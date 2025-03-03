import React from "react";
import Cookies from "js-cookie";
import { useState,useEffect } from "react";
import clock from '../Images/clock.png'
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from '@/App';

  function TimeModule({chalet_id,times}) {
  const lang = Cookies.get('lang') || 'en';
  console.log("first time",times)
      const [showModal, setShowModal] = useState(false);
      const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateAndTime, setSelectedDateAndTime] = useState(null);
    const [rightTimesAndDate, setRightTimesAndDate] = useState([]);  // Global data
   
    const handleShow = () => {
    setShowModal(true);  // Show the modal
   };
    const handleClose = () => {
    setShowModal(false);
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
          const startDay = firstDay.getDay(); // day of week of the 1st of the month
          return { daysInMonth, startDay };
        };
      
        const { daysInMonth, startDay } = getDaysInMonth(
          currentDate.getFullYear(),
          currentDate.getMonth()
        );
    
    const handleDateSelect = (day) => {
      const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDateAndTime(newSelectedDate);
      handleShow();
    };
       
    // Add a new time slot
    const addTimeSlot = () => {
      if (selectedDateAndTime) {
        // Check if all required fields are filled for the existing time slots
        const valid = rightTimesAndDate.every(timeSlot =>
          timeSlot.id && 
          timeSlot.price !== null
        );    
        if (valid) {
          // Create a new empty time slot and add it to both the specific date and global data
          const newTimeSlot = {
            id: "", 
            price: null, 
            date: selectedDateAndTime, 
          };
    
          // Add the new time slot to both specific date data and global data
          setRightTimesAndDate((prevData) => [...prevData, newTimeSlot]);
          } else {
          // If any required field is missing, show an alert
          alert("Please fill in all fields before adding the time slot!");
        }
      } else {
        alert("Please select a valid date first!");
      }
    }; 
    // UseEffect to sync rightTimesAndDateForSpecificDate when the selected date changes
    useEffect(() => {
      if (selectedDateAndTime && rightTimesAndDate.length === 0) {
        const newTimeSlot = {
          id: "", 
          price: null, 
          date: selectedDateAndTime, 
        };
        // Optionally, also add it to the global data if needed
        setRightTimesAndDate((prevData) => [...prevData, newTimeSlot]);
      }
    }, [selectedDateAndTime]); 
    
    // Update the specific date's time slot
    // const updateTimeSlot = (index, key, value) => {
    //   const updatedRightTimesData = [...rightTimesAndDate];
    //   updatedRightTimesData[index][key] = value;
    //   setRightTimesAndDate(updatedRightTimesData);
    // };
    const updateTimeSlot = (index, key, value) => {
      const updatedRightTimesData = [...rightTimesAndDate];
    
      if (key === "id") {
        // Find the selected time slot
        const selectedTimeSlot = times.find(time => time.id === parseInt(value));
        
        if (selectedTimeSlot) {
          // Update both ID and price automatically
          updatedRightTimesData[index] = {
            ...updatedRightTimesData[index],
            id: value,
            price: selectedTimeSlot.price, // Auto-fill price
          };
        }
      } else {
        updatedRightTimesData[index][key] = value;
      }
    
      setRightTimesAndDate(updatedRightTimesData);
    };
    
    const handleAddTimeWithDate = async () => {
      if (!chalet_id) {
        // If chalet_id is not set, do not proceed with adding time slots
        Swal.fire({
          title: "Error!",
          text: "Chalet is not created yet. Please create the chalet first.",
          icon: "error",
        });
        return;
      }
    
      if (rightTimesAndDate.length > 0) {
        const lang = Cookies.get('lang') || 'en'; // Default to 'en' if not set
    
        const validData = rightTimesAndDate.every(timeSlot => {
          return timeSlot.id && timeSlot.price !== null && timeSlot.date; // Ensure 'date' is present
        });
    
        if (validData) {
          try {
            for (const timeSlot of rightTimesAndDate) {
              const response = await axios.post(`${API_URL}/DatesForRightTime/createDate`, {
                date: timeSlot.date, // Ensure date is sent correctly
                price: timeSlot.price,
                right_time_id: timeSlot.id, // Adjust this to use right_time_id
              });
              // Handle success for each individual request (if needed)
              Swal.fire({
                title: 'Success!',
                text: 'Time slot added successfully!',
                icon: 'success',
              });
            }
    
            setRightTimesAndDate([]); // Clear the data after successful submission
            handleClose(); // Close the modal
          } catch (error) {
            console.error('Error adding time slots:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an issue while adding time slots.',
              icon: 'error',
            });
          }
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Please make sure all fields are filled correctly.',
            icon: 'error',
          });
        }
      } else {
        Swal.fire({
          title: 'Warning!',
          text: 'No time slots to add!',
          icon: 'warning',
        });
      }
    };
    
  return (
    <>
    <div className="date-picker-container">
      <div className="calendar" >
      <h2 className="text-center " style={{fontSize:"20px",display:"flex",justifyContent:"center" }}>You can optionally add price for a specific date</h2>
                          <h1 className="text-center " style={{ color: "#fff",fontSize:"30px",display:"flex",justifyContent:"center" }}>
                            <img
                              src={clock}
                              alt="clock"
                              className="mx-3"
                            />{" "}
                            Calendar Dates
                          </h1>
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
      
                                const isSelected = selectedDateAndTime && selectedDateAndTime.getDate() === day;
      
                              return (
                                <span
                                  key={day}
                                  className={`calendar-day ${
                                    isSelected ? "selected" : ""
                                  }`}
                                  onClick={() => handleDateSelect(day)}
      
                                >
                                  {day}
                                </span>
                              );
                            })}
                          </div>
          </div>
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${showModal ? "block" : "hidden"}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // semi-transparent background
      onClick={handleClose} // Close on background click
    >
      <div className="relative ">
        <div
          className="relative p-4 bg-white rounded-lg shadow  "
          onClick={(e) => e.stopPropagation()} // Prevent closing on content click
        >
          <button onClick={handleClose} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>

          <div className="p-4 md:p-5 text-center ">
            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{lang === 'ar' ? "اضافة وقت" : "Add Time"}</h3>
            {rightTimesAndDate.map((timeSlot, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <select
                    className="form-select"
                    value={timeSlot.id}
                    required
                    onChange={(e) => updateTimeSlot(index, "id", e.target.value)}
                  >
                    <option value="">{lang === "ar" ? "اختر نوع الوقت" : "Select Type of Time"}</option>
                    {times.map((time)=>(
                      <option key={time.id} value={time.id}>{time.type_of_time}</option>
                    ))}
                     </select>
                </div>
               <div>
                  <input value={timeSlot.price}required onChange={(e) => updateTimeSlot(index, "price", e.target.value)} type="number" id="Price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Price"  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="mt-4 bg-[#F2C79D] text-white p-2 m-2 rounded"
              onClick={addTimeSlot}
            >
              {lang === "ar" ? "إضافة وقت آخر" : "Add Another Time"}
            </button>
            <button 
            // onClick={handleClose}
            onClick={handleAddTimeWithDate}
             className="bg-gray-300 px-4 py-2 rounded">
              {lang === 'ar' ? "اضافة" : " Add  "}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    </>

  );
}

export default TimeModule;
