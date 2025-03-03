import { useEffect, useState } from "react";
// import "../Css/Lands.css";
import { Container } from "react-bootstrap";
import info from "../Images/info.png";
import dollar from "../Images/dollars.png";
import money from "../Images/save-money.png";
import people from "../Images/people.jpg";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import axios from "axios";
import { API_URL } from "../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModelAlert from "../Components/ModelAlert.jsx";
// import { useUser } from "../Component/UserContext";
import SelectTime from "./SelectTime.jsx";
import CalendarChalets from "./CalendarChalets.jsx";
import WeeklyMonthlyCalendar from "../Admin DashBoard/WeeklyMonthlyCalendar";
import "../Styles/Chalets.css";
import Cookies from "js-cookie";
// import "../Css/Events.css";
const ReserveChalets = () => {
//   const { userId } = useUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = Cookies.get('lang') || 'en';
  const { priceTime, timeId } = location.state || {};
  const [numberOfFamilies, setNumberOfFamilies] = useState(null); // State to store the number of families
  const [timeIdDaily, setTimeIdDaily] = useState(null);
  const [timePriceDaily, setTimePriceDaily] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert the stored value to a number, or use 0 if it's null or not a valid number
  const storedPrice = Number(localStorage.getItem("price")) || 0;
  const intial_Amount = Number(localStorage.getItem("intial_Amount")) || 0;

  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [number_of_daysValue, setNumberOfDaysValue] = useState(0);
  const [additional_visitorsValue, setAdditionalVisitorsValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typeOfReseravtion, setTypeOfReservation] = useState("Daily");
  const [isReservationTypeChanged, setIsReservationTypeChanged] =
    useState(false); // New state
  const [lastFinalPrice, setLastFinalPrice] = useState("");
  const receiverId=Cookies.get("receiverId")

  useEffect(() => {
    window.scrollTo(0, 0);
    setNumberOfFamilies(localStorage.getItem("Number of Visitors"));
  }, []);

  // Helper functions
  const updateState = (stateSetter, currentValue, increment = true) => {
    stateSetter(increment ? currentValue + 1 : Math.max(0, currentValue - 1));
  };
  const handleTypeOfReservationChange = (e) => {
    const selectedType = e.target.value;
    setTypeOfReservation(selectedType);
    // Reset related states and mark type as changed
    setNumberOfDaysValue(0);
    setAdditionalVisitorsValue(0);
    setTimePriceDaily(null);
    setIsReservationTypeChanged(true); // Mark reservation type as changed
  };

  const calculatePrice = () => {
    const additionalCost = number_of_daysValue * 20; // 20 JD per day
    const visitorsCost = additional_visitorsValue * 10; // 10 JD per additional visitor
    const priceBerTime = timePriceDaily || priceTime;
    // If the reservation type was recently changed, reset to storedPrice
    if (isReservationTypeChanged) {
      setIsReservationTypeChanged(false); // Reset the flag
      return storedPrice;
    }
    // Use priceBerTime if it exists, otherwise use storedPrice
    const basePrice = priceBerTime ?? storedPrice;

    const totalAmount = basePrice + additionalCost + visitorsCost;
    setLastFinalPrice(totalAmount);
    return totalAmount;
  };
  useEffect(() => {
    calculatePrice();
  }, [
    number_of_daysValue,
    additional_visitorsValue,
    timePriceDaily,
    priceTime,
    storedPrice,
    isReservationTypeChanged,
  ]);
  const handleConfirmReservation = async () => {
    if (!selectedDate || !lang || !id) {
      setError("Please make sure you have selected a Date and Time.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
 // Check for weekly or monthly reservation types
   if ((typeOfReseravtion === "Weekly" || typeOfReseravtion === "Monthly") && !endDate) {
    setError("Please select an End Date for Weekly or Monthly reservations.");
    setIsLoading(false);
    return;
  }
    const formattedStartDate = new Date(selectedDate).toLocaleDateString(
      "en-CA"
    );
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-CA");

    const reservationData = {
      start_date: formattedStartDate,
      end_date: typeOfReseravtion === "Daily" ? null : formattedEndDate,
      lang: lang,
      additional_visitors: additional_visitorsValue,
      number_of_days: number_of_daysValue,
      Reservation_Type: typeOfReseravtion,
      user_id: receiverId,
      chalet_id: id,
      right_time_id: timeIdDaily || timeId,
      total_amount: lastFinalPrice,
      Status:"Confirmed"
      
    };

    try {
      const res = await axios.post(
        `${API_URL}/ReservationsChalets/createReservationChalet`,
        reservationData
      );
      setModalTitle("Successful Reservation");
      setModalMessage("Reservation created successfully");
      setShowModal(true);
      setTimeout(
        () =>
          navigate(
            `/dashboard/reservechalet`
          ),
        2000
      );
    setIsLoading(false);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Failed to confirm reservation. Please try again later.";

      setModalTitle("Error");
      setModalMessage(errorMessage);
      setShowModal(true);
      setIsLoading(false);
    }
  };
  const toggleDropdown = () => {
    setIsOpen(() => {
      const newIsOpen = true;
      return newIsOpen;
    });
    setError(""); // Reset error on successful selection
  };

  return (
    <>
      <Container className="mt-5">
        <select
          aria-label="Default select example"
          value={typeOfReseravtion ?? ""}
          onChange={handleTypeOfReservationChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option>
            {lang === "ar" ? "اختر نوع الحجز" : "Select type of reservation"}
          </option>
          <option value="Daily">{lang === "ar" ? "يومي" : "Daily"}</option>
          <option value="Weekly">{lang === "ar" ? "اسبوعي" : "Weekly"}</option>
          <option value="Monthly">{lang === "ar" ? "شهري" : "Monthly"}</option>
        </select>
      </Container>
      {typeOfReseravtion === "Daily" ? (
        <CalendarChalets
          setSelectedDate={setSelectedDate}
          setTimeIdDaily={setTimeIdDaily}
          setTimePriceDaily={setTimePriceDaily}
        />
      ) : (
        <WeeklyMonthlyCalendar
          setEndDate={setEndDate}
          setSelectedDate={setSelectedDate}
          toggleDropdown={toggleDropdown}
          setNumberOfDaysValue={setNumberOfDaysValue}
        />
      )}
      <SelectTime
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleDropdown={toggleDropdown}
        selectedDate={selectedDate}
      />
      <Container className="mt-5 flex flex-col justify-center items-center">
        <h6 className="py-2 flex">
          <img src={info} alt="info" height={"30px"} width={"30px"} />

          {lang === "ar"
            ? ` عدد الزائرين لهذا الشاليه ${numberOfFamilies} زوار `
            : ` The number of visitors to the chalet reaches ${numberOfFamilies} visitors`}
        </h6>

        <h6>
          <div className="plus-minus-container">
            <img src={people} alt="info" height={"30px"} width={"30px"} />
            {lang === "ar"
              ? " عدد الزوار الاضافيين "
              : "Number of additional visitors:"}
            <button
              className="plus-minus-button"
              onClick={() =>
                updateState(
                  setAdditionalVisitorsValue,
                  additional_visitorsValue,
                  false
                )
              }
            >
              <LuMinus />
            </button>
            <span className="number_of_daysvalue mx-2">
              {additional_visitorsValue}
            </span>
            <button
              className="plus-minus-button"
              onClick={() =>
                updateState(
                  setAdditionalVisitorsValue,
                  additional_visitorsValue
                )
              }
            >
              <GoPlus />
            </button>
          </div>
        </h6>
        <div className="flex mb-3">
          <img src={money} alt="info" height={"30px"} width={"30px"} />
          <h6 className="ms-2 mt-2">
            {lang === "ar" ? "المبلغ الاولي :" : "Initial amount:"}{" "}
            {intial_Amount} JD
          </h6>
        </div>
        <h6 className="flex">
          <img src={dollar} alt="info" height={"30px"} width={"30px"} />
          {lang === "ar" ? "قيمة الحجز هي : " : "Value of Reservation is:"}{" "}
          {lastFinalPrice} JD
        </h6>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="booknow_button_events w-100 my-5"
          onClick={handleConfirmReservation}
        >
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</span>
            </div>
          ) : lang === "ar" ? (
            "تأكيد الحجز"
          ) : (
            "Confirm Reservation"
          )}
        </button>

        <ModelAlert
          show={showModal}
          handleClose={() => setShowModal(false)}
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
    </>
  );
};

export default ReserveChalets;
