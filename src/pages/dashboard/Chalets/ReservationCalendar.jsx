import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import clock from "../../../Images/clock.png";
import { API_URL } from "@/App";
import Cookies from "js-cookie";
import '../../../Styles/CalendarChalets.css'
import { Typography } from "@material-tailwind/react";
function ReservationCalendar() {
  const { chalet_id } = useParams();
  const lang = Cookies.get('lang') || 'en';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservedDates, setReservedDates] = useState([]);
  const [rightTimes, setRightTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const localYear = date.getUTCFullYear();
    const localMonth = date.getUTCMonth();
    const localDay = date.getUTCDate();
    return `${localYear}-${(localMonth + 1)
      .toString()
      .padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;
  };

  // const fetchReservedDates = useCallback(
  //   async (timeOfDay, timeId) => {
  //     try {
  //       const res = await axios.get(
  //         `${API_URL}/ReservationsChalets/getReservationsByRightTimeName/${chalet_id}/${timeOfDay}/${lang}`
  //       );
  //       const reservedDates = res.data.reserved_days.map((reservation) => {
  //         const utcDate = new Date(reservation);
  //         const formattedDate = formatDate(utcDate); // Use your date formatting logic
  //         return { date: formattedDate };
  //       });
  
  //       // Update the reservedDates state per timeId
  //       setReservedDates((prev) => ({
  //         ...prev,
  //         [timeId]: reservedDates, // Use timeId as the key
  //       }));
  //     } catch (error) {
  //       console.error(`Error fetching reserved dates for ${timeOfDay}:`, error);
  //     }
  //   },
  //   [lang, chalet_id]
  // );
  // useEffect(() => {
  //   if (rightTimes && rightTimes.length > 0) {
  //     rightTimes.forEach((time) => {
  //       fetchReservedDates(time.type_of_time, time.chalet_id);
  //     });
  //   }
  // }, [rightTimes, lang, chalet_id, fetchReservedDates]);
  useEffect(() => {
    fetch(`${API_URL}/ReservationsChalets/reservationsDatesByChaletId/${chalet_id}/en`)
      .then((response) => response.json())
      .then((data) => {
        const formattedReservations = data.reservations.map((res) => ({
          date: res.start_date, // Keep the date
          time: res.Time, // Store the time slot
        }));
        setReservedDates(formattedReservations);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // day of week of the 1st of the month
    return { daysInMonth, startDay };
  };

  const { daysInMonth, startDay } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const getTimesBychaletsId = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/RightTimes/getallrighttimesbyChaletId/${chalet_id}/${lang}`
      );
      setRightTimes(res.data);
    } catch (error) {
      console.error("Error fetching available times:", error);
      alert(
        "There is no available times to show calendar. Please try again later."
      );
    }
  }, [lang, chalet_id]);

  useEffect(() => {
    getTimesBychaletsId();
  }, [chalet_id]);

  return (
    <>
      {/* <div className="date-picker-container">
        {rightTimes.length > 0 ? (
          rightTimes.map((time) => (
            <div className="calendar" key={time.chalet_id}>
              <h1 className="text-center " style={{ color: "#fff",fontSize:"30px",display:"flex",justifyContent:"center" }}>
                <img
                  src={clock}
                  alt="clock"
                  className="mx-3"
                />{" "}
                {time.type_of_time} Dates
              </h1>
              <h5 className="text-center" style={{ color: "#fff" }}>
                {time.from_time} - {time.to_time}
              </h5>
              <div className="calendar-header">
                <button className="prev-month" onClick={handlePrevMonth}>
                  Prev
                </button>
                <span className="month">
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button className="next-month" onClick={handleNextMonth}>
                  Next
                </button>
              </div>
              <div className="days-of-week">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="calendar-days">
                {Array(startDay)
                  .fill(null)
                  .map((_, index) => (
                    <span key={index} className="empty-day"></span>
                  ))}
                {Array.from(
                  { length: daysInMonth },
                  (_, index) => index + 1
                ).map((day) => {
                  const currentDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  );
                  const currentFormattedDate = `${currentDay.getFullYear()}-${(
                    currentDay.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${currentDay
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`;
                  const isReserved = reservedDates[time.chalet_id]?.some(
                    (reservedDate) => reservedDate.date === currentFormattedDate
                  );

                  return (
                    <span
                      key={day}
                      className={`calendar-day ${isReserved ? "reserved" : ""}`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p> Loading...</p>
        )}
      </div> */}
         <div className="date-picker-container">
        { rightTimes.length > 0 ? (
          rightTimes.map((time) => (
            <div className="calendar" key={time.id}>
              <h1 className="text-center " style={{ color: "#fff",fontSize:"30px",display:"flex",justifyContent:"center" }}>
                <img
                  src={clock}
                  alt="clock"
                  className="mx-3"
                />{" "}
                {time.type_of_time} Dates
              </h1>
              <h5 className="text-center" style={{ color: "#fff" }}>
                {time.from_time} - {time.to_time}
              </h5>
              <div className="calendar-header">
                <button className="prev-month" onClick={handlePrevMonth}>
                  Prev
                </button>
                <span className="month">
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button className="next-month" onClick={handleNextMonth}>
                  Next
                </button>
              </div>
              <div className="days-of-week">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="calendar-days">
                {Array(startDay)
                  .fill(null)
                  .map((_, index) => (
                    <span key={index} className="empty-day"></span>
                  ))}
                {Array.from(
                  { length: daysInMonth },
                  (_, index) => index + 1
                ).map((day) => {
                  const currentDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  );
                  const currentFormattedDate = `${currentDay.getFullYear()}-${(
                    currentDay.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${currentDay
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`;

                  // Check if this date AND time slot is reserved
                  const isReserved = reservedDates.some(
                    (reserved) =>
                      reserved.date === currentFormattedDate &&
                      reserved.time === time.type_of_time
                  );
                  return (
                    <span
                      key={day}
                      className={`calendar-day ${isReserved ? "reserved" : ""}`}
                      onClick={() =>
                        handleSelectDate(
                          day,
                          time.id,
                          time.After_Offer > 0 ? time.After_Offer : time.price
                        )
                      }
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p> No Times Available...</p>
        )}
      </div>

    </>
  );
}

export default ReservationCalendar;
