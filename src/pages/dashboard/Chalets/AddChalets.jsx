
import React, { useEffect, useState } from 'react'
import '../../../Styles/Chalets.css'
import Cookies from 'js-cookie';
import {Button,Typography,} from "@material-tailwind/react";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { cities } from './CityData';
import { getRoomOptions, getBathroomOptions, getFeatures, getAdditionalFeatures, getFamilyOptions, getkitchenOptions, getswimmingpoolsOptions } from './Data';
import axios from 'axios';
import { API_URL } from '@/App';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AddImagesInChalets from './AddImageInChalets';

function AddChalets() {
      const lang = Cookies.get('lang') || 'en';
      const navigate = useNavigate();
      const roomOptions = getRoomOptions();
      const bathroomOptions = getBathroomOptions();
      const features = getFeatures();
      const additionalFeatures = getAdditionalFeatures();
      // const interfaceOptions = getInterfaceOptions(lang);
      const familyoptions = getFamilyOptions();
      const kitchenOptions = getkitchenOptions();
      const swimmingpoolsOptions = getswimmingpoolsOptions();

      const [checkedFeatures, setCheckedFeatures] = useState([]);
      const [checkedadditioanlFeatures, setCheckedadditioanlFeatures] = useState([]);
      const [selectedCity, setSelectedCity] = useState('');
      const [availableAreas, setAvailableAreas] = useState([]);
      const [selectedArea, setSelectedArea] = useState('');
      const [haveOffer, setHaveOffer] = useState(false);
      const [status, setstatus] = useState([]);
      const [imgName, setImgName] = useState("");
       const [images, setImages] = useState([]);
       const [isLoading, setIsLoading] = useState(false);
       const [isContImagesOpen, setIsContImagesOpen] = useState(false);
       const [chalet_id, setChalet_id] = useState("");

      const [mainInfoChalets, setMainInfoChalets] = useState({
        title: "",
        description: "",
        Rating:null,
        city: "",
        area:"",
        intial_Amount:null,
        status_id: "",
        image: null,
    });
    
    const labels = {
      room: lang === 'ar' ? 'عدد الغرف' : 'Number of Rooms',
      bathroom: lang === 'ar' ? 'عدد الحمامات' : 'Number of Bathrooms',
      // interface: lang === 'ar' ? 'واجهة' : 'Interface',
      building_area: lang === 'ar' ? 'مساحة البناء' : 'Building Area',
      family: lang === 'ar' ? 'عدد الزوار' : 'Number of Visitors',
      kitchen: lang === 'ar' ? 'عدد المطابخ' : 'Number of Kitchen',
      swimmingpools: lang === 'ar' ? 'عدد حمامات السباحة' : 'Numberof swimming pools',
    };
  
    // Initialize state with dynamic keys
    const [formDataState, setFormDataState] = useState({
      [labels.room]: '',
      [labels.bathroom]: '',
      // [labels.interface]: '',
      [labels.building_area]: '',
      [labels.family]: '',
      [labels.kitchen]: '',
      [labels.swimmingpools]: '',
    });
    const handleFileChange = (e) => {
      const files =Array.from(e.target.files);
      if (files.length > 0) {
          setImages(files); // Store files in state
          setImgName(files.map((file) => file.name).join(", ")); // Store file names for display
        } else {
          setImages([]); // Reset if no files are selected
          setImgName("");
        }
  };
      useEffect(()=>{
        const fetchstatus_type = async () => {
          try {
            const response = await axios.get(`${API_URL}/status/getallstatuses/${lang}`) ;
            setstatus(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchstatus_type()
      },[])

        const handleCityChange = (e) => {
          const cityId = e.target.value;
          setSelectedCity(cityId);
          // Find the selected city and set its areas
          const city = cities.find(city => city.id === cityId);
          if (city) {
            setAvailableAreas(city.areas);
          } else {
            setAvailableAreas([]);
          }
          setSelectedArea(''); // Reset selected area
        };
      
        const handleAreaChange = (e) => {
          setSelectedArea(e.target.value);
        };
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;

    setCheckedFeatures((prevState) => {
      if (checked) {
        // Add the ID to the array if checked
        setCheckedFeatures([...prevState, id])
        return [...prevState, id];
      } else {
        // Remove the ID from the array if unchecked
        return prevState.filter((featureId) => featureId !== id);
      }
    });
  };

  // Handle checkbox change
  const handleAdditionalFeaturesChange = (e) => {
    const { id, checked } = e.target;

    setCheckedadditioanlFeatures((prevState) => {
      if (checked) {
        // Add the ID to the array if checked
        return [...prevState, id];
      } else {
        // Remove the ID from the array if unchecked
        return prevState.filter((benefitId) => benefitId !== id);
      }
    });
  };

  const handleChange = (e, fieldName) => {
    const value = e.target.value;
    setFormDataState(prevState => ({
      ...prevState,
      [labels[fieldName]]: value, // Dynamically update based on the label
    }));
  };
    const handleAddChalet = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      // Check for "Evening" time slot
      const hasEveningTimeSlot = rightTimesData.some(
        (timeSlot) => timeSlot.type_of_time === "Evening"
      );
    
      if (!hasEveningTimeSlot) {
        Swal.fire({
          title: lang === "ar" ? "خطأ!" : "Error!",
          text: lang === "ar" ? "يجب إضافة نوع وقت مسائي" : "You should add a type of time 'Evening'.",
          icon: "error",
          confirmButtonText: lang === "ar" ? "حسناً" : "OK",
        });
        setIsLoading(false);
        return;
      }
    
      // Prepare Chalet Data
      const typeData = formDataState;
      const formData = new FormData();
      formData.append("title", mainInfoChalets.title);
      formData.append("description", mainInfoChalets.description);
      formData.append("lang", lang);
      formData.append("status_id", mainInfoChalets.status_id);
      formData.append("Rating", mainInfoChalets.Rating);
      formData.append("intial_Amount", mainInfoChalets.intial_Amount);
      formData.append("city", selectedCity);
      formData.append("area", selectedArea);
      formData.append("image", mainInfoChalets.image);
      formData.append("features", checkedFeatures);
      formData.append("Additional_features", checkedadditioanlFeatures);
      formData.append("type", JSON.stringify(typeData));
    
      // Append time slots dynamically
      rightTimesData.forEach((timeSlot, index) => {
        formData.append(`rightTimesData[${index}][type_of_time]`, timeSlot.type_of_time);
        formData.append(`rightTimesData[${index}][from_time]`, timeSlot.from_time);
        formData.append(`rightTimesData[${index}][to_time]`, timeSlot.to_time);
        formData.append(`rightTimesData[${index}][price]`, timeSlot.price);
        formData.append(`rightTimesData[${index}][After_Offer]`, timeSlot.After_Offer);
        formData.append(`rightTimesData[${index}][lang]`, timeSlot.lang);
      });
    
      try {
        // Add Chalet
        const chaletResponse = await axios.post(
          `${API_URL}/chalets/createchalet`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
            const chalet_id = chaletResponse.data.chalet.id;
            setChalet_id(chalet_id);
            setIsContImagesOpen(true)
            setIsLoading(false)
        // Now, add images for the newly created chalet
        // await handleAddImagesInChalets(chalet_id); // Pass chalet_id to add images
          // navigate("/dashboard/chalets");
    window.scrollTo(0, 3050);
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
      }
    };
    
      const handleChangemainInfoChalets = (e) => {
        const { name, type, files } = e.target;
        setMainInfoChalets({
            ...mainInfoChalets,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };
    const [rightTimesData, setRightTimesData] = useState([
      { type_of_time: "", from_time: "", to_time: "", price: null, After_Offer: null ,lang: lang},
    ]);
  
    const addTimeSlot = () => {
      setRightTimesData([
        ...rightTimesData,
        { type_of_time: "", from_time: "", to_time: "", price: null, After_Offer: null,lang: lang},
      ]);
    };
  
    const updateTimeSlot = (index, key, value) => {
      const updatedData = [...rightTimesData];
      updatedData[index][key] = value;
      setRightTimesData(updatedData);
    };
  return (
    <>
   <form onSubmit={handleAddChalet}>
    <div className='big_container_chalets'>
         <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'تفاصيل الشاليه' : ' Chalets Details'}</Typography>
         <p className="font-bold mb-3">{lang === 'ar' ? 'صورة الغلاف' : 'Cover Image'}</p>
         <div>
       <input type="file" name="image"onChange={handleChangemainInfoChalets}id="timeimg" className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
       </div>
       <p className="font-bold mb-3">{lang === 'ar' ? 'عدد الغرف' : 'Number of rooms'}</p>
<div className="flex flex-wrap">
  {roomOptions.map((room, index) => (
    <div
      key={index}
      onChange={(e) => handleChange(e, "room")}
      className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto"
    >
      <input
        type="radio"
        id={`room-radio-${index}`}
        value={room}
        name="room-radio" // Unique name for room group
        checked={formDataState[labels.room] === room}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={`room-radio-${index}`}
        className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
      >
        {room}
      </label>
    </div>
  ))}
</div>

<hr />

<p className="font-bold my-3">{lang === 'ar' ? 'عدد الحمامات' : 'Number of bathrooms'}</p>
<div className="flex flex-wrap">
  {bathroomOptions.map((bathroom, index) => (
    <div
      key={index}
      onChange={(e) => handleChange(e, "bathroom")}
      className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto"
    >
      <input
        type="radio"
        id={`bathroom-radio-${index}`}
        value={bathroom}
        name="bathroom-radio" // Unique name for bathroom group
        checked={formDataState[labels.bathroom] === bathroom}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={`bathroom-radio-${index}`}
        className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
      >
        {bathroom}
      </label>
    </div>
  ))}
</div>

<hr />
<p className='font-bold my-3'>{lang === 'ar' ? 'المزايا الرئيسية' : 'Key Features'}</p>
      <ul className="flex flex-wrap gap-4 w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {features.map((feature) => (
          <li key={feature.id} className="w-full sm:w-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center">
              <input
                id={feature.id}
                type="checkbox"
                value={feature.id}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={checkedFeatures.includes(feature.id)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={feature.id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang === 'ar' ? feature.ar : feature.en}
              </label>
            </div>
          </li>
        ))}
      </ul>
      <hr />
<p className='font-bold my-3'>{lang=== 'ar' ? 'المزايا الاضافية' : 'Additional Features'}</p>
<ul className="flex flex-wrap gap-4 w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {additionalFeatures.map((benefit) => (
          <li key={benefit.id} className="w-full sm:w-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center">
              <input
                id={benefit.id}
                type="checkbox"
                value={benefit.id}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                checked={checkedadditioanlFeatures.includes(benefit.id)}
                onChange={handleAdditionalFeaturesChange}
              />
              <label htmlFor={benefit.id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang === 'ar' ? benefit.ar : benefit.en}
              </label>
            </div>
          </li>
        ))}
      </ul>
     <hr />
    {/* <p className="font-bold mb-3">{labels.interface}</p>
      <div className="flex flex-wrap">
        {interfaceOptions.map((inter, index) => (
          <div key={index} onChange={(e) => handleChange(e, "interface")} className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto">
            <input
              type="radio"
              id={`interface-radio-${index}`}
              value={inter}
              name="interface-radio"  
              checked={formDataState[labels.interface] === inter}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`interface-radio-${index}`}
              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
            >
              {inter}
            </label>
          </div>
        ))}
      </div>
      <hr /> */}

      {/* Building Area */}
      <p className="font-bold mb-3">{labels.building_area}</p>
      <div>
        <input
          type="number"
          value={formDataState[labels.building_area]}
          onChange={(e) => handleChange(e, "building_area")}
          id="Building"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Building"
          required
        />
      </div>
      <hr />

      {/* Visitors Family Option */}
      <p className="font-bold mb-3">{labels.family}</p>
      <div className="flex flex-wrap">
        {familyoptions.map((family, index) => (
          <div key={index} onChange={(e) => handleChange(e, "family")} className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto">
            <input
              type="radio"
              id={`family-radio-${index}`}
              value={family}
              name="family-radio"  
              checked={formDataState[labels.family] === family}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`family-radio-${index}`}
              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
            >
              {family}
            </label>
          </div>
        ))}
      </div>
      <hr />

      {/* Kitchen Option */}
      <p className="font-bold mb-3">{labels.kitchen}</p>
      <div className="flex flex-wrap">
        {kitchenOptions.map((kitchen, index) => (
          <div key={index} onChange={(e) => handleChange(e, "kitchen")} className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto">
            <input
              type="radio"
              id={`kitchen-radio-${index}`}
              value={kitchen}
              name="kitchen-radio" 
              checked={formDataState[labels.kitchen] === kitchen}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`kitchen-radio-${index}`}
              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
            >
              {kitchen}
            </label>
          </div>
        ))}
      </div>
      <hr />

      {/* Swimming Pools Option */}
      <p className="font-bold mb-3">{labels.swimmingpools}</p>
      <div className="flex flex-wrap">
        {swimmingpoolsOptions.map((pools, index) => (
          <div key={index} onChange={(e) => handleChange(e, "swimmingpools")} className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto">
            <input
              type="radio"
              id={`swimmingpools-radio-${index}`}
              value={pools}
              name="swimmingpools-radio" 
              checked={formDataState[labels.swimmingpools] === pools}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`swimmingpools-radio-${index}`}
              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
            >
              {pools}
            </label>
          </div>
        ))}
      </div>
    </div>
    
    <div className="big_container_chalets">
    <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'الموقع' : 'Location'}</Typography>
    <Form.Select
        aria-label="Select City"
        value={selectedCity}
        onChange={handleCityChange}
        className='select_location'
      >
        <option value="">{lang === 'ar' ? 'اختر مدينة' : 'Select City'}</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {lang === 'ar' ? city.ar : city.en}
          </option>
        ))}
      </Form.Select>
      {/* Area Dropdown */}
      <Form.Select
        aria-label="Select Area"
        className='select_location'
        value={selectedArea}
        onChange={handleAreaChange}
        disabled={!selectedCity}  // Disable area dropdown if no city is selected
      >
        <option value="">{lang === 'ar' ? 'اختر منطقة' : 'Select Area'}</option>
        {availableAreas.map((area, index) => (
          <option key={index} value={area}>
            {area}
          </option>
        ))}
      </Form.Select>
    </div>
    <div className="big_container_chalets">
    <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'الوقت' : 'Time'}</Typography>
  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
   
  {rightTimesData.map((timeSlot, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <select
              className="form-select"
              value={timeSlot.type_of_time}
              onChange={(e) => updateTimeSlot(index, "type_of_time", e.target.value)}
            >
              <option value="">{lang === "ar" ? "اختر نوع الوقت" : "Select Type of Time"}</option>
              <option value="Morning">{lang === "ar" ? "صباحي" : "Morning"}</option>
              <option value="Evening">{lang === "ar" ? "مسائي" : "Evening"}</option>
              <option value="Full Day">{lang === "ar" ? "كل اليوم" : "Full Day"}</option>
            </select>
          </div>

          <div>
            <label>From Time</label>
            <input
              type="time"
              className="form-control"
              value={timeSlot.from_time}
              onChange={(e) => updateTimeSlot(index, "from_time", e.target.value)}
            />
          </div>

          <div>
            <label>To Time</label>
            <input
              type="time"
              className="form-control"
              value={timeSlot.to_time}
              onChange={(e) => updateTimeSlot(index, "to_time", e.target.value)}
            />
          </div>

          <div>
           <input value={timeSlot.price} onChange={(e) => updateTimeSlot(index, "price", e.target.value)}type="number" id="Price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Price" required />
          </div>
              <div className="flex items-center mb-4">
    <input onClick={()=>{setHaveOffer(!haveOffer)}} id="default-checkbox" type="checkbox" value="" className=" mx-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label for="default-checkbox" className=" text-sm font-medium text-gray-900 dark:text-gray-300">Have Offer</label>
    </div>
    {haveOffer && (
        <div >
        <input type="number"  value={timeSlot.After_Offer} onChange={(e) => updateTimeSlot(index, "After_Offer", e.target.value)}id="after offer" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="After Offer" />
    </div>
    )}

          </div>
      ))}

      <button
        type="button"
        className="mt-4 bg-[#F2C79D] text-white p-2 rounded"
        onClick={addTimeSlot}
      >
        {lang === "ar" ? "إضافة وقت آخر" : "Add Another Time"}
      </button>
   {/* </div> */}
   </div>
   <div className="big_container_chalets">
    <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'التفاصيل' : 'Details'}</Typography>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5"> 
    <div>
      <InputGroup className="mb-3"> 
      <input type="text"onChange={handleChangemainInfoChalets} id="title"name='title' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'العنوان' : 'Title'} required />

      </InputGroup>
    </div>
    <div>
      <InputGroup className="mb-3"> 
      <input type="number"onChange={handleChangemainInfoChalets} id="rating"name='Rating' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'التصنيف' : 'Number of stars'} required />
      </InputGroup>
    </div>
    <div>
      <InputGroup className="mb-3"> 
      <input type="number"onChange={handleChangemainInfoChalets} id="intial_Amount"name='intial_Amount' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'المبلغ الأولي' : 'intial_Amount'} required />
      </InputGroup>
    </div>
    <div>
         <select 
          onChange={handleChangemainInfoChalets}
          name="status_id"
          className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={mainInfoChalets.status_id} // Bind select value to status_id state
      >
        <option value="">{lang ==='ar'? "الحالة" :"Select status"}</option>
          {status.map((item) => (
              <option key={item.id} value={item.id}>
                  {item.status}
              </option>
          ))}
      </select>
    </div>
   </div>
    <div >
      <InputGroup className="mb-3"> 
      <textarea type="text" rows={20}onChange={handleChangemainInfoChalets} name='description' id="Description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'الوصف' : 'Description'} required />
      </InputGroup>
    </div>

   <button 
  type="submit" 
  className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  disabled={isLoading}  // Disable button while loading
>
  {isLoading ? (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
    </div>
  ) : (
    lang === 'ar' ? 'حفظ' : 'Submit'
  )}
</button>
    {isContImagesOpen && (
      <AddImagesInChalets chalet_id={chalet_id}/>
    )}
  
   </div>
   </form>
    </>

  )
}

export default AddChalets
