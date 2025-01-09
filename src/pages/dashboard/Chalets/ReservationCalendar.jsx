import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../../../Styles/CalendarChalets.css'
import { API_URL } from "@/App";
import Cookies from "js-cookie";
function ReservationCalendar() {
  const { chalet_id } = useParams();
  const lang = Cookies.get('lang') || 'en';
  const [currentDate, setCurrentDate] = useState(new Date());
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [reservedDatesMorning, setReservedDatesMorning] = useState([]);
  const [reservedDatesEvening, setReservedDatesEvening] = useState([]);


  const formatDate = (date) => {
    const localYear = date.getUTCFullYear();
    const localMonth = date.getUTCMonth();
    const localDay = date.getUTCDate();
    return `${localYear}-${(localMonth + 1)
      .toString()
      .padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;
  };

  // Fetch reserved dates for morning and evening
  const fetchReservedDates = useCallback(
    async (timeOfDay, setReservedDates) => {
      try {
        const res = await axios.get(
          `${API_URL}/ReservationsChalets/reservationsByright_time_name/${chalet_id}/${timeOfDay}/${lang}`
        );
        const reservedDates = res.data.reservations.map((reservation) => {
          const utcDate = new Date(reservation.date);
          const formattedDate = formatDate(utcDate);
          return { date: formattedDate };
        });

        setReservedDates(reservedDates);
      } catch (error) {
        console.error(`Error fetching reserved dates for ${timeOfDay}:`, error);
      }
    },
    [lang, chalet_id]
  );

  useEffect(() => {
    fetchReservedDates("Morning%20Full%20day", setReservedDatesMorning);
    fetchReservedDates("Evening%20Full%20day", setReservedDatesEvening);
  }, [lang, chalet_id, currentDate, fetchReservedDates]);

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
//   ReservationCalendar.propTypes = {
//     setSelectedDate: PropTypes.string.isRequired, // Ensure selectedDate is a Date object
//   };
  return (
    <>
      <div className="date-picker-container">
        <div className="calendar">
          <h3 className="text-center" style={{ color: "#fff" }}>
            Morning Reserved Date
          </h3>
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
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
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
                const isReserved = reservedDatesMorning.some(
                  (reservedDate) => reservedDate.date === currentFormattedDate
                );
                return (
                  <span
                    key={day}
                    className={`calendar-day ${
                        isReserved ? "reserved" : "" }`}
                  >
                    {day}
                  </span>
                );
              }
            )}
          </div>
        </div>
        <div className="calendar">
          <h3 className="text-center" style={{ color: "#fff" }}>
            Evening Reserved Date
          </h3>
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
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
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
                const isReserved = reservedDatesEvening.some(
                  (reservedDate) => reservedDate.date === currentFormattedDate
                );
                return (
                  <span
                    key={day}
                    className={`calendar-day ${
                      isReserved ? "reserved" : ""
                    }`}
                  >
                    {day}
                  </span>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* <ModelAlert
        show={showModal}
        handleClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      /> */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </>
  );
}

export default ReservationCalendar;
