import { useState, useEffect } from 'react';
import axios from 'axios';
import {Avatar, Button,Typography,} from "@material-tailwind/react";
import { getRoomOptions, getBathroomOptions, getFeatures, getAdditionalFeatures, getInterfaceOptions, getFamilyOptions, getkitchenOptions, getswimmingpoolsOptions } from './Data';
import { useParams } from 'react-router-dom';
import { API_URL } from '@/App';
import Form from 'react-bootstrap/Form';
import { cities } from './CityData';
import InputGroup from 'react-bootstrap/InputGroup';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon,CheckBadgeIcon  } from "@heroicons/react/24/outline";
import DeleteModule from '@/Components/DeleteModule';
import TimeModule from '@/Components/TimeModule';

const UpdateChalets = () => {
      const lang = Cookies.get('lang') || 'en';
      const {chalet_id}=useParams()
      const navigate=useNavigate()
      const [showModal, setShowModal] = useState(false);
    //  const [chaletData, setChaletData] = useState(null);
     const [formDataState, setFormDataState] = useState({});
      const roomOptions = getRoomOptions();
     const bathroomOptions = getBathroomOptions();
      const features = getFeatures();
      const additionalFeatures = getAdditionalFeatures();
      const kitchenOptions = getkitchenOptions();
      const swimmingpoolsOptions = getswimmingpoolsOptions();
      const [selectedCity, setSelectedCity] = useState('');
      const [availableAreas, setAvailableAreas] = useState([]);
      const [status, setstatus] = useState([]);
      const [idToDelete, setIdToDelete] = useState(null);
      const [itemType, setItemType] = useState(null); 
      const [time_id, setTime_id] = useState(""); 
            
      const labels = {
        room: lang === 'ar' ? 'عدد الغرف' : 'Number of Rooms',
        bathroom: lang === 'ar' ? 'عدد الحمامات' : 'Number of Bathrooms',
        // interface: lang === 'ar' ? 'واجهة' : 'Interface',
        building_area: lang === 'ar' ? 'مساحة البناء' : 'Building Area',
        family: lang === 'ar' ? 'عدد الزوار' : 'Number of Visitors',
        kitchen: lang === 'ar' ? 'عدد المطابخ' : 'Number of Kitchen',
        swimmingpools: lang === 'ar' ? 'عدد حمامات السباحة' : 'Numberof swimming pools',
      };
      
    const handleShow = (id, type) => {
      setIdToDelete(id);  // Set the ID to delete (chalet or details)
    setItemType(type);   // Set the type (either 'chalet' or 'details')
    setShowModal(true);  // Show the modal
     };
     const handleClose = () => {
      setShowModal(false);
      setIdToDelete(null); // Reset the ID when closing
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
      useEffect(() => {
        axios
          .get(`${API_URL}/chalets/getchaletbyid/${chalet_id}`)
          .then(response => {
            const data = response.data;
            let typeData = {};
            try {
              // First, check if type is a string that looks like escaped JSON
              if (typeof data.type === "string") {
                // Parse the escaped JSON string
                typeData = JSON.parse(data.type);
              } else {
                // If it's already an object, use it as is
                typeData = data.type;
              }
            } catch (error) {
              console.error("Error parsing type data:", error);
            }
            
            const parsedFeatures = data.features
              ? data.features.replace(/(^"|"$)/g, '').split(',')
              : [];
            const parsedAdditionalFeatures = data.Additional_features
              ? data.Additional_features.replace(/(^"|"$)/g, '').split(',')
              : [];
      
            // Find the initial city's areas
            const initialCity = cities.find(city => city.id === data.city);
            const initialAreas = initialCity ? initialCity.areas : [];
      
            // setChaletData(data);
            setFormDataState({
              title: data.title,
              room: typeData?.['Number of Rooms'],
              bathroom: typeData?.['Number of Bathrooms'],
              // interface: typeData?.Interface,
              building_area: typeData?.['Building Area'],
              family: typeData?.['Number of Visitors'],
              kitchen: typeData?.['Number of Kitchen'],
              swimmingpools: typeData?.['Numberof swimming pools'],
              image: data.image,
              features: parsedFeatures,
              Additional_features: parsedAdditionalFeatures,
              city: data.city,
              area: data.area,
              description: data.description,
              Rating: data.Rating,
              intial_Amount: data.intial_Amount,
              status_id: data.Status.id,
              lang:lang,
              RightTimeModels: data.RightTimeModels,
              ChaletsImages: data.ChaletsImages
            });
            setSelectedCity(data.city); // Set initial city
            setAvailableAreas(initialAreas); // Set areas based on the initial city
            setTime_id(data.RightTimeModels)
          })
          .catch(error => console.error('Error fetching chalet data:', error));
      }, [cities]); // Ensure cities is loaded before running this effect
          
      const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);     
        // Find the selected city and set its areas
        const city = cities.find(city => city.id === cityId);
        const areas = city ? city.areas : [];
        setAvailableAreas(areas);
        setFormDataState(prevState => ({
          ...prevState,
          city: cityId,
          area: '', // Reset area when city changes
        }));
      };
      
      const handleAreaChange = (e) => {
        const area = e.target.value;
        setFormDataState(prevState => ({
          ...prevState,
          area,
        }));
      };
      const preparePayload = () => {
        const payload = {
          ...formDataState, // Include other top-level fields
          type: {
            "Number of Rooms": formDataState.room,
            "Number of Bathrooms": formDataState.bathroom,
            // Interface: formDataState.interface,
            "Building Area": formDataState.building_area,
            "Number of Visitors": formDataState.family,
            "Number of Kitchen": formDataState.kitchen,
            "Numberof swimming pools": formDataState.swimmingpools,
          },
          // Remove escaped quotes and format the features correctly
          features: formDataState.features.length ? formDataState.features.join(',') : '', // Join array and remove extra quotes
          Additional_features: formDataState.Additional_features.length ? formDataState.Additional_features.join(',') : '',
        };
        return payload;
      };

  const handleChange = (e, field) => {
    if (field === 'image') {
      // If the field is 'image', handle the file upload
      const file = e.target.files[0]; // Get the selected file
      console.log("first file: " , file)
      if (file) {
        setFormDataState((prevState) => ({
          ...prevState,
          [field]: file, // Update the state with the file object
        }));
      }
    } else {
      // For other fields, handle as normal
      setFormDataState((prevState) => ({
        ...prevState,
        [field]: e.target.value, // Update the state with the selected value
      }));
    }
  };
  
  const handleCheckboxChange = (e, featureId, field) => {
    const updatedFeatures = [...formDataState[field]];
  
    if (e.target.checked) {
      updatedFeatures.push(featureId);  // Add the selected feature
    } else {
      const index = updatedFeatures.indexOf(featureId);
      if (index > -1) {
        updatedFeatures.splice(index, 1);  // Remove the unselected feature
      }
    }
  
    setFormDataState({ ...formDataState, [field]: updatedFeatures });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = preparePayload();
    axios.put(`${API_URL}/chalets/updatechalet/${chalet_id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data", // Specify multipart/form-data
      },
    })  
      .then(response => {
         Swal.fire({
          title: "Success!",
          text: "Chalets added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/chalets");
          })
      .catch(error => {
        console.error('Error updating chalet:', error);
      });
  };
  const handleDelete = async () => {  
    try {
      // Conditional logic to handle different delete operations
      const timeToDelete = formDataState.RightTimeModels?.find((time) => time.id === idToDelete);
  
      // Check if the time type is 'Evening'
      if (timeToDelete && timeToDelete.type_of_time === 'Evening') {
        Swal.fire({
          title: "Error!",
          text: "You cannot delete evening time.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
  
      // Proceed with the deletion based on item type
      if (itemType === 'time') {
        await axios.delete(`${API_URL}/RightTimes/deleterighttime/${idToDelete}/${lang}`);
        
        console.log("Before update", formDataState);
setFormDataState((prevState) => {
  const updatedState = {
    ...prevState,
    RightTimeModels: prevState.RightTimeModels.filter((time) => time.id !== idToDelete),
  };
  console.log("After update", updatedState);
  return updatedState;
});

      } 
      else if (itemType === 'date') {
        await axios.delete(`${API_URL}/DatesForRightTime/newmodel/${idToDelete}`);
        
        setFormDataState((prevState) => ({
          ...prevState,
          RightTimeModels: prevState.RightTimeModels.map((time) => ({
            ...time,
            DatesForRightTimes: time.DatesForRightTimes.filter((date) => date.id !== idToDelete)
          }))
        }));
      } 
      else if (itemType === 'images') {
        await axios.delete(`${API_URL}/chaletsimages/deleteChaletImage/${idToDelete}`);
        
        setFormDataState((prevState) => ({
          ...prevState,
          ChaletsImages: prevState.ChaletsImages.filter((image) => image.id !== idToDelete)
        }));
      }
      
    } catch (error) {
      console.error("Error during delete operation:", error);
    }
  };
  
  // const handleDelete = async () => {  
  //   try {
  //     // Conditional logic to handle different delete operations
  //     const timeToDelete = formDataState.RightTimeModels?.find((time) => time.id === idToDelete);
  //     // Check if the time type is evening
  //     if (timeToDelete && timeToDelete.type_of_time === 'Evening') {
  //               Swal.fire({
  //                 title: "Error!",
  //                 text: "You cannot delete evening time.",
  //                 icon: "error",
  //                 confirmButtonText: "OK",
  //               });
  //       return; 
  //     }
  
  //     // Proceed with the deletion if type is not evening
  //     if (itemType === 'time') {
  //       await axios.delete(`${API_URL}/RightTimes/deleterighttime/${idToDelete}/${lang}`);
        
  //       setFormDataState((prevState) => ({
  //         ...prevState,
  //         RightTimeModels: prevState.RightTimeModels?.filter((time) => time.id !== idToDelete),
  //       }));
  //     }
  //    else if (itemType === 'date') {
  //       await axios.delete(`${API_URL}/DatesForRightTime/newmodel/${idToDelete}`);
  //       setFormDataState((prevState) => ({
  //         ...prevState,
  //         RightTimeModels: prevState.RightTimeModels.map((time) => ({
  //           ...time,
  //           DatesForRightTimes: time.DatesForRightTimes?.filter((date) => date.id !== idToDelete)
  //         }))
  //       }));
  //     }
  //       else if (itemType === 'images') {
  //         await axios.delete(`${API_URL}/chaletsimages/deleteChaletImage/${idToDelete}`);
  //         setFormDataState((prevState) => ({
  //           ...prevState,
  //           ChaletsImages: prevState.ChaletsImages?.filter((image) => image.id !== idToDelete)
  //         }));
  //          }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  return (
    <>
    <form onSubmit={handleSubmit}>
  <div className='big_container_chalets'>
         <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'تفاصيل الشاليه' : ' Chalets Details'}</Typography>
         <p className="font-bold mb-3">{lang === 'ar' ? 'صورة الغلاف' : 'Cover Image'}</p>
         <div>
       <input type="file" name="image"onChange={(e) => handleChange(e, 'image')}id="timeimg" className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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
        checked={formDataState.room === room}  // Compare the room value with formDataState.room
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
        checked={formDataState.bathroom === bathroom}
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
{/* Features List */}
<ul className="flex flex-wrap gap-4 w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
  {features.map((feature) => (
    <li key={feature.id} className="w-full sm:w-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <div className="flex items-center">
        <input
          id={feature.id}
          type="checkbox"
          value={feature.id}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          checked={Array.isArray(formDataState.features) && formDataState.features.includes(feature.id)} // Ensure `features` is an array
          onChange={(e) => handleCheckboxChange(e, feature.id, 'features')} // Pass 'features' as the type
        />
        <label htmlFor={feature.id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          {lang === 'ar' ? feature.ar : feature.en}
        </label>
      </div>
    </li>
  ))}
</ul>
<hr />
{/* Additional Features List */}
<p className="font-bold my-3">{lang === 'ar' ? 'المزايا الاضافية' : 'Additional Features'}</p>
<ul className="flex flex-wrap gap-4 w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
  {additionalFeatures.map((additional) => (
    <li key={additional.id} className="w-full sm:w-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <div className="flex items-center">
        <input
          id={additional.id}
          type="checkbox"
          value={additional.id}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          checked={Array.isArray(formDataState.Additional_features) && formDataState.Additional_features.includes(additional.id)} // Ensure `features` is an array
          onChange={(e) => handleCheckboxChange(e, additional.id, 'Additional_features')} // Pass 'features' as the type
        />
        <label htmlFor={additional.id} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          {lang === 'ar' ? additional.ar : additional.en}
        </label>
      </div>
    </li>
  ))}
</ul>
     <hr />
      {/* Building Area */}
      <p className="font-bold mb-3">{labels.building_area}</p>
      <div>
        <input
          type="number"
          value={formDataState.building_area}
          onChange={(e) => handleChange(e, "building_area")}
          id="Building"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Building"
          required
        />
      </div>
      <hr />
      {/* Family Option */}
      <p className="font-bold mb-3">{labels.family}</p>
       <div>
        <input
          type="number"
          value={formDataState.family}
          onChange={(e) => handleChange(e, "family")}
          id="family"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Number Of Vistors"
          required
        />
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
              checked={formDataState.kitchen === kitchen}
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
              checked={formDataState.swimmingpools === pools}
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
  <Typography variant="h4" className="font-bold mb-4">{lang === 'ar' ? 'الموقع' : 'Location'}</Typography>
  {/* City Dropdown */}
  <Form.Select
    aria-label="Select City"
    value={formDataState.city} // Existing city value
    onChange={handleCityChange} // Update city and areas
    className="select_location">
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
    className="select_location"
    value={formDataState.area} // Existing area value
    onChange={handleAreaChange} // Update area
    disabled={!selectedCity} // Disable if no city is selected
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
  <div className='flex justify-between'>
       <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'الاوقات' : 'Times'}</Typography>
          <PlusIcon
            className="w-10 mr-1 text-blue-500"
            onClick={() => navigate(`/dashboard/addrighttimechalet/${chalet_id}`)} />
    </div>
 {formDataState.RightTimeModels && formDataState.RightTimeModels.length > 0 ? (
  formDataState.RightTimeModels.map((time) => (
    <>
    <div className="flex items-center gap-4" key={time.id}>
      <Typography variant="small" color="blue-gray" className="font-semibold">
        {time.type_of_time}, from_time: {time.from_time}, to_time: {time.to_time}, price: {time.price}, After Offer: {time.After_Offer}
      </Typography>
   

      <Typography variant="small" color="blue-gray" className="font-semibold">
      </Typography>
      <td className="p-2 text-right align-middle">
        <div className="flex justify-end">
          <PencilIcon
            className="h-5 w-5 mr-1"
            onClick={() => navigate(`/dashboard/updaterighttimechalet/${chalet_id}/${time.id}`)}
          />
          <TrashIcon
            className="h-5 w-5 mr-1 text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
            onClick={() => handleShow(time.id, 'time')}
          />
         
        </div>
      </td>
    </div>
    <td className='flex'> 
      <Typography variant="small" color="blue-gray" className="font-semibold">
       Dates : 
      </Typography>
      {time.DatesForRightTimes && time.DatesForRightTimes.length > 0 ? (
        time.DatesForRightTimes.map((dates, index) => (
          <>
         ( <Typography variant="small" color="blue-gray" className="font-semibold" key={index}>
            {dates.date} {dates.price}JD
          </Typography>
          <div className="flex justify-end">
          <TrashIcon
            className="h-5 w-5 mr-1 text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
            onClick={() => handleShow(dates.id, 'date')}
          />)
         
        </div>
          </>
          
        ))
      ) : (
        <Typography variant="small" color="blue-gray" className="font-semibold">
          No Date Available
        </Typography>
      )} 
     </td>
    </>
    
  ))
) : (
  <div className="text-center text-gray-500">
    {lang === "ar" ? "لا توجد بيانات للوقت المحدد." : "No data available for the selected time slot."}
  </div>
)}
<TimeModule chalet_id={chalet_id} times={formDataState.RightTimeModels}/>
</div>
<div className="big_container_chalets">
    <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'التفاصيل' : 'Details'}</Typography>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5"> 
    <div>
      <InputGroup className="mb-3"> 
      <input type="text" value={formDataState.title} onChange={(e) => handleChange(e, "title")} id="title"name='title' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'العنوان' : 'Title'} required />
      </InputGroup>
    </div>
    <div>
      <InputGroup className="mb-3"> 
      <input type="number" value={formDataState.Rating} onChange={(e) => handleChange(e, "Rating")} id="rating"name='Rating' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'التصنيف' : 'Rating'} required />
      </InputGroup>
    </div>
    <div>
      <InputGroup className="mb-3"> 
      <input type="number"value={formDataState.intial_Amount} onChange={(e) => handleChange(e, "intial_Amount")} id="intial_Amount"name='intial_Amount' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'المبلغ الأولي' : 'intial_Amount'} required />
      </InputGroup>
    </div>
    <div>
         <select 
          onChange={(e) => handleChange(e, "status_id")}          name="status_id"
          className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formDataState.status_id} >
        <option value="">{lang ==='ar'? "الحالة" :"Select status"}</option>
          {status.map((item) => (
              <option key={item.id} value={item.id}>
                  {item.status}
              </option>
          ))}
      </select>
    </div>
   </div>
    <div>
      <InputGroup className="mb-3"> 
      <textarea type="text" rows={20} value={formDataState.description}  onChange={(e) => handleChange(e, "description")} name='description' id="Description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'الوصف' : 'Description'} required />
      </InputGroup>
        <td
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "flex-start",
          height: "auto", 
        }} >
         {formDataState.ChaletsImages && formDataState.ChaletsImages.length > 0 ? (
        formDataState.ChaletsImages.map((img, index) => {
          // Check if the image URL is a video by looking for common video file extensions
          const isVideo = /\.(mp4|webm|avi|mov|ogg)$/i.test(img.image);      
          return (
            <div
              key={index}
              style={{
                width: "100%", 
                maxWidth: "180px", 
                textAlign: "center",
                marginBottom: "10px",
              }} >
              {/* Conditionally render video or image */}
              {isVideo ? (
                <video
                  src={img.image}
                  alt="chalets video"
                  controls
                  style={{
                    width: "100%", 
                    maxWidth: "100%", 
                    height: "130px",
                    objectFit: "cover", 
                    borderRadius: "8px", 
                  }}
                />
              ) : (
                <Avatar
                  src={img.image}
                  alt="chalets image"
                  variant="rounded"
                  style={{
                    width: "100%", 
                    maxWidth: "100%",
                    height: "130px", 
                    objectFit: "cover", 
                    borderRadius: "8px",
                  }}
                />
              )}      
              {/* Trash Icon */}
              <div className="flex justify-center mt-2">
                <TrashIcon
                  className="h-5 w-5 text-red-500"
                  onClick={() => handleShow(img.id, 'images')}
                />
              </div>
            </div>
          );
        })
        ): (
     <div className="text-center text-gray-500">
      {lang === "ar" ? "لا توجد صور وفيديوهات لهذا الشاليه." : "No images and videos available for this chalets."}
    </div>
   )}
         <PlusIcon
            className=" w-10 mr-1 text-blue-500"
            onClick={() => navigate(`/dashboard/addimginchalets/${chalet_id}`)}
            />
      </td>
    </div>
    <button 
    type="submit" 
    className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    {lang=== 'ar' ? 'حفظ' : 'Submit'}
   </button>
   </div>        
        <button type="submit">{lang === 'ar' ? 'تحديث' : 'Update'}</button>
    </form>
    <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={idToDelete} // Pass the chalet ID to DeleteModule
      />
    </>    
  );
};
export default UpdateChalets