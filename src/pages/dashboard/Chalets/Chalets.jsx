import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon,CheckBadgeIcon  } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
  } from "@material-tailwind/react";

function Chalets() {
    const navigate = useNavigate();
  const [Chalets, setChalets] = useState([]);
  // const [ChaletsDetails, setChaletsDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ChaletsIdToDelete, setChaletsIdToDelete] = useState(null); // Store the ID of the slide to delete
  const [itemType, setItemType] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

const handleShow = (id, type) => {
    setChaletsIdToDelete(id);  // Set the ID to delete (chalet or details)
    setItemType(type);   // Set the type (either 'chalet' or 'details')
    setShowModal(true);  // Show the modal
  };
  
  const handleClose = () => {
    setShowModal(false);
    setChaletsIdToDelete(null); // Reset the ID when closing
  };

  const fetchChalets = async () => {
    try {
      const [chaletsRes,DetailsRes] = await Promise.all([
        axios.get(`${API_URL}/chalets/getallchalets/${lang}`),
      ]) 
      setChalets(chaletsRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = async () => {  
    try {
      // Conditional logic to handle different delete operations
      if (itemType === 'chalet') {
        await axios.delete(`${API_URL}/chalets/deletechalet/${ChaletsIdToDelete}/${lang}`);
        setChalets(Chalets.filter((chalet) => chalet.id !== ChaletsIdToDelete)); // Remove from list
      } else if (itemType === 'time') {
        await axios.delete(`${API_URL}/RightTimes/deleterighttime/${ChaletsIdToDelete}/${lang}`);
        setChalets(
          Chalets.map((chal) => {
            const filteredchal = chal.RightTimeModels?.filter((chars) => chars.id !== ChaletsIdToDelete);
            return { ...chal, RightTimeModels: filteredchal };
          })
        );       }
        else if (itemType === 'images') {
          await axios.delete(`${API_URL}/chaletsimages/deleteChaletImage/${ChaletsIdToDelete}`);
          setChalets(
            Chalets.map((detail) => {
              const filteredImages = detail.ChaletsImages?.filter((img) => img.id !== ChaletsIdToDelete);
              return { ...detail, ChaletsImages: filteredImages };
            })
          );
           }
    } catch (error) {
      console.error(error);
    }
  };
  
const parseType = (type) => {
  try {
    // Check if it's a double-escaped JSON
    if (typeof type === "string") {
      const parsedOnce = JSON.parse(type); // Parse once
      // If the result is still a string, parse again
      return typeof parsedOnce === "string" ? JSON.parse(parsedOnce) : parsedOnce;
    }
    return type; // Return as is if it's already an object
  } catch (error) {
    console.error("Error parsing type:", error);
    return {}; // Return an empty object in case of error
  }
};

  useEffect(() => {
    fetchChalets();
  }, []);

  return (
    <>
    {/* <Button className="mt-6" >Add chalet</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول الشاليهات" :"  Chalets Table "}
        </Typography>
      </CardHeader>
      <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addchalet">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة شاليه" : "Add Chalets "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? "الوصف" :"description"}`,`${lang ==='ar'? "قيمة الحجز" :"Initial amount"}`,`${lang ==='ar'? "التصنيف" :"Number of stars"}`,`${lang ==='ar'? "المدينة" :"City"}`,`${lang ==='ar'? "المنطقة" :"Area"}`,`${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "النوع" :"type"}`,`${lang ==='ar'? "الميزات" :"Features"}`,`${lang ==='ar'? "الميزات الاضافية" :"Additional_features"}`,`${lang ==='ar'? "الحالة" :"status "}`,,`${lang ==='ar'? "الاوقات" :"Times "}`,`${lang ==='ar'? "الصور" :"All Images"}`,`${lang ==='ar'? "اضافة صور" :"Add Images"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 "
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Chalets.map(
              (chalet,index) => {
                const className = `py-3 px-5 ${index === Chalets.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                               // Parse the `type` field
                               const typeObject = chalet.type ? parseType(chalet.type) : null;
                               const typeList = typeObject ? Object.entries(typeObject) : [];
                return (
                  <tr key={chalet.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.title}
                          </Typography>
                         </div>
                      </div>
                    </td>
                    <td className={className} >
                      <div className="flex items-center gap-4" style={{width:"100vh"}}>
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.description}
                            </Typography>
                         </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.intial_Amount}
                          </Typography>
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.Rating}
                          </Typography>
                         </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.city}
                          </Typography>
                         </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.area}
                          </Typography>
                         </div>
                      </div>
                    </td>
                    <td>

                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar   src={chalet.image} alt={"chalets"} size="md" variant="rounded" />
                      </Typography>
                      </td>
                {typeList.length > 0 ? (
                <td className={className} >
                      <div style={{width:"250px"}} >
                      {typeList.map(([key, value], i) => (
                 <div key={i}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                  </div>
                    ))}
                      </div>
                    </td>
                      ): (
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                     {lang ==='ar'? "لا يوجد معلومات" :"No Type data"}
                    </Typography>
                      )}       
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.features}
                          </Typography>
                         </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.Additional_features	}
                          </Typography>
                         </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.Status?.status }
                          </Typography>
                      </Typography>
                    </td>
                       <td className={className} >
                       {chalet.RightTimeModels && chalet.RightTimeModels.length > 0 ? (
  chalet.RightTimeModels.map((time) => (
    <div className="flex items-center gap-4" style={{ width: "550px" }} key={time.id}>
      <Typography variant="small" color="blue-gray" className="font-semibold">
        {time.type_of_time}, from_time: {time.from_time}, to_time: {time.to_time}, price: {time.price}, After Offer: {time.After_Offer}
      </Typography>

      <td className="p-2 text-right align-middle">
        <div className="flex justify-end">
          <PencilIcon
            className="h-5 w-5 mr-1"
            onClick={() => navigate(`/dashboard/updaterighttimechalet/${chalet.id}/${time.id}`)}
          />
          <TrashIcon
            className="h-5 w-5 mr-1 text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
            onClick={() => handleShow(time.id, 'time')}
          />
          <PlusIcon
            className="h-5 w-5 mr-1 text-blue-500"
            onClick={() => navigate(`/dashboard/addrighttimechalet/${chalet.id}`)}
          />
        </div>
      </td>
    </div>
  ))
) : (
  <div className="text-center text-gray-500">
    {lang === "ar" ? "لا توجد بيانات للوقت المحدد." : "No data available for the selected time slot."}
  </div>
)}

                     </td>
                     <td
  className={className}
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "flex-start",
    height: "auto", // Adjusted to let content grow or shrink based on image/video
    width: "80vh",  // Set to 100% to take full width of the container
  }}
>
  {chalet.ChaletsImages.map((img, index) => {
    // Check if the image URL is a video by looking for common video file extensions
    const isVideo = /\.(mp4|webm|avi|mov|ogg)$/i.test(img.image);

    return (
      <div
        key={index}
        style={{
          width: "100%", // Set width to 100% to scale down properly
          maxWidth: "250px", // Limit width to 250px to prevent it from growing too large
          textAlign: "center",
          marginBottom: "10px", // Add space between each item
        }}
      >
        {/* Conditionally render video or image */}
        {isVideo ? (
          <video
            src={img.image}
            alt="chalets video"
            controls
            style={{
              width: "100%", // Make the video responsive
              maxWidth: "100%", // Set max width for video to prevent it from getting too large
              height: "130px", // Let height adjust automatically based on aspect ratio
              objectFit: "cover", // Ensure content covers area without stretching
              borderRadius: "8px", // Optional for rounded corners
            }}
          />
        ) : (
          <Avatar
            src={img.image}
            alt="chalets image"
            variant="rounded"
            style={{
              width: "100%", // Make the image responsive
              maxWidth: "100%", // Set max width for image to prevent it from getting too large
              height: "130px", // Let height adjust automatically based on aspect ratio
              objectFit: "cover", // Ensure image covers area without stretching
              borderRadius: "8px", // Optional for rounded corners
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
  })}
</td>



<td className={className}><PlusIcon
      className="h-5 w-5 mr-1 text-blue-500"
      onClick={() => navigate(`/dashboard/addimginchalets/${chalet.id}`)}
      /></td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatechalet/${chalet.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
   onClick={() => handleShow(chalet.id, 'chalet')} // Pass 'chalet' type
   className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "حذف" : "Delete "}
                          </Button>
                          <Button 
                           onClick={() => navigate(`/dashboard/reservationcalendar/${chalet.id}`)}
                           className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500 ms-2"
   >
<CheckBadgeIcon class="h-6 w-6 text-white-500 " />See Reservation  
   </Button>
                         {/* <Button
                           onClick={() => navigate(`/dashboard/reservationdetails/${reservation.id}`)}
                           className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                           >
                           See Details
                         </Button> */}
                        </div>
                      </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
    <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={ChaletsIdToDelete} // Pass the chalet ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Chalets