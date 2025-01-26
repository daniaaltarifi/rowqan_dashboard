import { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Typography,} from "@material-tailwind/react";
import { getRoomOptions, getBathroomOptions, getFurnishedOptions, getFeatures, getAdditionalFeatures, getInterfaceOptions, getFamilyOptions, getkitchenOptions, getswimmingpoolsOptions } from './Data';
import { useParams } from 'react-router-dom';
import { API_URL } from '@/App';
import Form from 'react-bootstrap/Form';
import { cities } from './CityData';
import InputGroup from 'react-bootstrap/InputGroup';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
const UpdateChalets = () => {
      const lang = Cookies.get('lang') || 'en';
      const {chalet_id}=useParams()
      const navigate=useNavigate()
     const [chaletData, setChaletData] = useState(null);
     const [formDataState, setFormDataState] = useState({});
      const roomOptions = getRoomOptions();
     const bathroomOptions = getBathroomOptions();
      const furnishedOptions = getFurnishedOptions(lang);
      const features = getFeatures();
      const additionalFeatures = getAdditionalFeatures();
      const interfaceOptions = getInterfaceOptions(lang);
      const familyoptions = getFamilyOptions();
      const kitchenOptions = getkitchenOptions();
      const swimmingpoolsOptions = getswimmingpoolsOptions();
           const [selectedCity, setSelectedCity] = useState('');
            const [availableAreas, setAvailableAreas] = useState([]);
            const [status, setstatus] = useState([]);
            
      const labels = {
        room: lang === 'ar' ? 'عدد الغرف' : 'Number of Rooms',
        bathroom: lang === 'ar' ? 'عدد الحمامات' : 'Number of Bathrooms',
        furnished: lang === 'ar' ? 'مفروشة/غير مفروشة' : 'Furnished/Unfurnished',
        interface: lang === 'ar' ? 'واجهة' : 'Interface',
        building_area: lang === 'ar' ? 'مساحة البناء' : 'Building Area',
        family: lang === 'ar' ? 'عدد الزوار' : 'Number of Visitors',
        kitchen: lang === 'ar' ? 'عدد المطابخ' : 'Number of Kitchen',
        swimmingpools: lang === 'ar' ? 'عدد حمامات السباحة' : 'Numberof swimming pools',
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
      
            setChaletData(data);
            setFormDataState({
              title: data.title,
              room: typeData?.['Number of Rooms'],
              bathroom: typeData?.['Number of Bathrooms'],
              furnished: typeData?.['Furnished/Unfurnished'],
              interface: typeData?.Interface,
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
              lang:lang
            });
            setSelectedCity(data.city); // Set initial city
            setAvailableAreas(initialAreas); // Set areas based on the initial city
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
            "Furnished/Unfurnished": formDataState.furnished,
            Interface: formDataState.interface,
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
    setFormDataState({ ...formDataState, [field]: e.target.value });
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

    // Update chalet data using the PUT API
    axios.put(`${API_URL}/chalets/updatechalet/${chalet_id}`, payload)
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

  return (
    <form onSubmit={handleSubmit}>
  <div className='big_container_chalets'>
         <Typography variant="h4" className="font-bold mb-4">{lang=== 'ar' ? 'تفاصيل الشاليه' : ' Chalets Details'}</Typography>
         <p className="font-bold mb-3">{lang === 'ar' ? 'صورة الغلاف' : 'Cover Image'}</p>
         <div>
       <input type="file" name="image"onChange={(e) => handleChange(e, 'room')}id="timeimg" className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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
<p className="font-bold my-3">{lang === 'ar' ? 'مفروشة/غير مفروشة' : 'Furnished/Unfurnished'}</p>
<div className="flex flex-wrap">
  {furnishedOptions.map((furn, index) => (
    <div
      key={index}
      onChange={(e) => handleChange(e, "furnished")}
      className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto"
    >
      <input
        type="radio"
        id={`furnished-radio-${index}`}
        value={furn}
        name="furnished-radio" // Unique name for furnished group
        checked={formDataState.furnished === furn}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={`furnished-radio-${index}`}
        className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 px-2"
      >
        {furn}
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
    <p className="font-bold mb-3">{labels.interface}</p>
      <div className="flex flex-wrap">
        {interfaceOptions.map((inter, index) => (
          <div key={index} onChange={(e) => handleChange(e, "interface")} className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto">
            <input
              type="radio"
              id={`interface-radio-${index}`}
              value={inter}
              name="interface-radio"  
              checked={formDataState.interface === inter}
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
      <div className="flex flex-wrap">
        {familyoptions.map((family, index) => (
          <div key={index} onChange={(e) => handleChange(e, "family")} className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 mx-3 my-2 w-full sm:w-auto">
            <input
              type="radio"
              id={`family-radio-${index}`}
              value={family}
              name="family-radio"  
              checked={formDataState.family === family}
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
    className="select_location"
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
          value={formDataState.status_id} // Bind select value to status_id state
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
    <div>
      <InputGroup className="mb-3"> 
      <textarea type="text" rows={20} value={formDataState.description}  onChange={(e) => handleChange(e, "description")} name='description' id="Description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={lang=== 'ar' ? 'الوصف' : 'Description'} required />
      </InputGroup>
    </div>
    <button 
    type="submit" 
    className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    {lang=== 'ar' ? 'حفظ' : 'Submit'}
   </button>
</div>        
        <button type="submit">{lang === 'ar' ? 'تحديث' : 'Update'}</button>
    </form>
  );
};
export default UpdateChalets