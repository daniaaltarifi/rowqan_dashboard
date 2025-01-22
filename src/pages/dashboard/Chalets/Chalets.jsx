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
    Chip,
    Tooltip,
    Progress,
    Button,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { authorsTableData, projectsTableData } from "@/data";
function Chalets() {
    const navigate = useNavigate();
  const [Chalets, setChalets] = useState([]);
  const [ChaletsDetails, setChaletsDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ChaletsIdToDelete, setChaletsIdToDelete] = useState(null); // Store the ID of the slide to delete
  const [itemType, setItemType] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

//   const handleShow = (id) => {
//     setChaletsIdToDelete(id); // Set the slide ID to delete
//     setShowModal(true);
//   };
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
        axios.get(`${API_URL}/chaletsdetails/getalldetails/${lang}`)
      ]) 
      setChalets(chaletsRes.data);
      setChaletsDetails(DetailsRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    // const { idToDelete, itemType } = this.state;
  
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
  

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/chalets/deletechalet/${id}/${lang}`);
//       setChalets(Chalets.filter((b) => b.id !== id));
//     } catch (error) {
//       console.error(error);
//     }
//   };

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
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
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
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? "الوصف" :"description"}`,`${lang ==='ar'? "قيمة الحجز" :"Initial amount"}`,`${lang ==='ar'? "التصنيف" :"Rating"}`,`${lang ==='ar'? "المدينة" :"City"}`,`${lang ==='ar'? "المنطقة" :"Area"}`,`${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "النوع" :"type"}`,`${lang ==='ar'? "الميزات" :"Features"}`,`${lang ==='ar'? "الميزات الاضافية" :"Additional_features"}`,`${lang ==='ar'? "الحالة" :"status "}`,,`${lang ==='ar'? "الاوقات" :"Times "}`,`${lang ==='ar'? "الصور" :"All Images"}`,`${lang ==='ar'? "اضافة صور" :"Add Images"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
  let typeObject = {};
  try {
    // Remove outer escaping
    const parsedType = JSON.parse(chalet.type);
    // Parse the inner JSON
    typeObject = JSON.parse(parsedType);
  } catch (error) {
    console.error("Error parsing chalet.type:", error);
  }

  // Convert the object to an array of key-value pairs
  const typeList = Object.entries(typeObject);
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

                    <td className={className}>
                      <div >
                      {typeList.map(([key, value], i) => (
                      <div key={i}>
                      <strong>{key.replace(/_/g, " ")}:</strong> {value}
                    </div>
                     ))}
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
                       <td className={className}>
                    {chalet.RightTimeModels.map((time)=>(
                       <div className="flex items-center gap-4" >
                                                <div>

                       <Typography
                             variant="small"
                             color="blue-gray"
                             className="font-semibold"
                           >
                             {time.type_of_time } 
                             from_time:{time.from_time }
                             to_time:{time.to_time }
                             price:{time.price }
                             After Offer:{time.After_Offer }
                           
                             <td className="p-2 text-right align-middle">
                <div className="flex justify-end">
                  <PencilIcon
                    className="h-5 w-5 mr-1"
                    onClick={() => navigate(`/dashboard/updaterighttimechalet/${time.id}`)}
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
                           </Typography>
                           </div>
                       </div>
                    ))}
                     </td>
                     <td className={className} style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "flex-start", height: "auto",width:"80vh" }}>
  {chalet.ChaletsImages.map((img, index) => {
    // Check if the image URL is a video by looking for common video file extensions
    const isVideo = /\.(mp4|webm|avi|mov|ogg)$/i.test(img.image);

    return (
      <div key={index} style={{ width: "200px", textAlign: "center" }}>
        {/* Conditionally render video or image */}
        {isVideo ? (
          <video
            src={img.image}
            alt="chalets video"
            controls
            style={{
              width: "100px", 
              height: "auto", 
              objectFit: "cover", 
              borderRadius: "8px",  // Optional for rounded corners
            }}
          />
        ) : (
          <Avatar
            src={img.image}
            alt="chalets image"
            variant="rounded"
            style={{
              width: "80px", 
              height: "auto",
              objectFit: "cover",
              borderRadius: "8px",  // Optional for rounded corners
            }}
          />
        )}

        {/* Trash Icon */}
        <div className="flex justify-center mt-2">
          <TrashIcon className="h-5 w-5 text-red-500" onClick={() => handleShow(img.id, 'images')} />
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