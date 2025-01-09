import React, { useEffect, useState } from 'react';


function ReservationDetails() {
  const [reservations, setReservations] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:5000/ReservationsChalets/getAllReservationChalet/en');
      const data = await response.json();
      setReservations(data);

      
      const dates = data.map(reservation => ({
        date: new Date(reservation.date),
        time: reservation.rightTime.time,
        title: reservation.chalet.title
      }));

      setMarkedDates(dates);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const formatTileContent = ({ date, view }) => {
    if (view === 'month') {
      const reservation = markedDates.find(
        (marked) => 
          marked.date.toDateString() === date.toDateString()
      );
      return reservation ? (
        <div style={{ color: 'red', fontSize: '0.8rem' }}>
          {reservation.time}
        </div>
      ) : null;
    }
  };

  return (
    <div className="calendar-container">
      <h1>Reservation Calendar</h1>
      <Calendar 
        tileContent={formatTileContent}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            return markedDates.some(
              (marked) => marked.date.toDateString() === date.toDateString()
            )
              ? 'highlight'
              : '';
          }
        }}
      />
      <style jsx>{`
        .calendar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: #f7f7f7;
        }

        h1 {
          margin-bottom: 20px;
        }

        .react-calendar {
          width: 100%;
          max-width: 1000px; /* يمكن تعديل الحجم حسب الحاجة */
          height: auto;
        }

        .highlight {
          background: #FF0000;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default ReservationDetails;
