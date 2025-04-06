import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import clock from "../Images/clock.png";
import { API_URL } from "@/App";
import Cookies from "js-cookie";

function CalendarChalets({
  setSelectedDate,
  setTimeIdDaily,
  setTimePriceDaily,
}) {
  const { id } = useParams();
  const lang = Cookies.get('lang') || 'en';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState("");
  const [reservedDates, setReservedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [selectedDateAndTime, setSelectedDateAndTime] = useState({});
  const [rightTimes, setRightTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSelectDate = (day, time_id, priceForDaily) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    const selectedFormattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
  
    const timeObject = rightTimes.find((time) => time.id === time_id);  
    
    const reservedDateInfo = reservedDates.find(
      (reservedDate) =>
        reservedDate.date === selectedFormattedDate &&
        (reservedDate.time === timeObject?.type_of_time || reservedDate.time === "FullDay")
    );
  
    if (reservedDateInfo && reservedDateInfo.status === 'Confirmed') {
      setModalTitle(lang === "ar" ? "التاريخ غير متاح" : "Date Not Available");
      setModalMessage(
        lang === "ar" 
          ? "هذا التاريخ محجوز بالفعل ولا يمكن اختياره"
          : "This date is already confirmed and cannot be selected."
      );
      handleShowModal();
      return;
    }

    if (reservedDateInfo && reservedDateInfo.status === 'Pending') {
      setModalTitle(
        lang === "ar" 
          ? "تاريخ قيد الانتظار" 
          : "Pending Date"
      );
      setModalMessage(
        lang === "ar"
          ? "هذا التاريخ محجوز من قبل في انتظار موافقة الادمن"
          : "This date is already reserved and waiting for admin approval."
      );
      handleShowModal();
      return;
    }
  
    
    const dateInRightTimes = timeObject?.DatesForRightTimes.find(
      (dateObj) => dateObj.date === selectedFormattedDate
    );
  
    const finalPrice = dateInRightTimes ? dateInRightTimes.price : priceForDaily;
  
    setSelectedDateAndTime({ [time_id]: newDate });
    setSelectedDate(newDate);
    setTimeIdDaily(time_id);
    setTimePriceDaily(finalPrice);
};

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
    const startDay = firstDay.getDay();
    return { daysInMonth, startDay };
  };

  const { daysInMonth, startDay } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  CalendarChalets.propTypes = {
    setSelectedDate: PropTypes.func.isRequired,
    setTimeIdDaily: PropTypes.func.isRequired,
    setTimePriceDaily: PropTypes.func.isRequired,
  };

  const getTimesBychaletsId = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/RightTimes/getallrighttimesbyChaletId/${id}`
      );
      setRightTimes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching available times:", error);
      alert(
        "There was an error fetching the available times. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [lang, id]);

  useEffect(() => {
    getTimesBychaletsId();
  }, [getTimesBychaletsId, id, lang]);

  useEffect(() => {
    fetch(`${API_URL}/ReservationsChalets/reservationsDatesByChaletId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedReservations = data.reservations.map((res) => ({
          date: res.start_date,
          time: res.Time,
          status: res.status
        }));
        setReservedDates(formattedReservations);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  return (
    <>
      <style>{`
        .calendar-day.confirmed {
          color: red !important;
          text-decoration: line-through;
          opacity: 0.5;
          cursor: not-allowed;
          position: relative;
          pointer-events: none;
        }
        .calendar-day.confirmed::after {
          content: 'Confirmed';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          color: red;
          font-size: 0.7em;
        }
        .calendar-day.pending {
          color: #FFC107 !important; /* Yellow color for pending */
          position: relative;
          cursor: pointer;
          background-color: rgba(255, 193, 7, 0.2); /* Light yellow background */
          border-radius: 50%;
        }
        .calendar-day.pending::after {
          content: 'Pending';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          color: #FFC107;
          font-size: 0.7em;
          font-weight: bold;
        }
        
        /* Modal styling */
        .modal {
          display: ${showModal ? 'block' : 'none'};
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
          background-color: white;
          margin: 15% auto;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .close-button {
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          background: none;
          border: none;
        }
        .modal-footer {
          margin-top: 20px;
          text-align: right;
        }
        .modal-button {
          padding: 8px 16px;
          background-color: #6DA6BA;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
      <div className="date-picker-container">
        {loading ? (
          <p>Loading...</p>
        ) : rightTimes.length > 0 ? (
          rightTimes.map((time) => (
            <div className="calendar" key={time.id}>
              <h4 className="text-center" style={{ color: "#fff", fontSize: "20px", display: "flex", justifyContent: "center" }}>
                <img src={clock} alt="clock" height={"30px"} width={"35px"} />{" "}
                {time.type_of_time} Dates
              </h4>
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

                  
                  const reservedDateInfo = reservedDates.find(
                    (reserved) =>
                      reserved.date === currentFormattedDate &&
                      (reserved.time === time.type_of_time || reserved.time === "FullDay")
                  );

                  const isSelected =
                    selectedDateAndTime[time.id]?.getDate() === day &&
                    selectedDateAndTime[time.id]?.getMonth() ===
                      currentDate.getMonth() &&
                    selectedDateAndTime[time.id]?.getFullYear() ===
                      currentDate.getFullYear();

                  let reservationClass = '';
                  let isDisabled = false;
                  if (reservedDateInfo) {
                    if (reservedDateInfo.status === 'Confirmed') {
                      reservationClass = 'confirmed';
                      isDisabled = true;
                    } else if (reservedDateInfo.status === 'Pending') {
                      reservationClass = 'pending';
                    }
                  }

                  return (
                    <span
                      key={day}
                      className={`calendar-day ${
                        isSelected ? "selected" : ""
                      } ${reservationClass}`}
                      onClick={() =>
                        handleSelectDate(
                          day,
                          time.id,
                          time.After_Offer > 0 ? time.After_Offer : time.price
                        )}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>No Times Available...</p>
        )}
      </div>

      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{modalTitle}</h3>
            <button className="close-button" onClick={handleCloseModal}>&times;</button>
          </div>
          <div className="modal-body">
            <p>{modalMessage}</p>
          </div>
          <div className="modal-footer">
            <button className="modal-button" onClick={handleCloseModal}>
              {lang === "ar" ? "حسناً" : "OK"}
            </button>
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </>
  );
}

export default CalendarChalets;