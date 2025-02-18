import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../App";
import '../Styles/Chalets.css'
function ContactUsPage() {
  const [contacts, setContacts] = useState([]);
  const [lang] = useState("en");

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/ContactUs/getAllContactUs/${lang}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleDelete = async (id) => {
    
    const result = await Swal.fire({
      title: lang === "ar" ? "هل أنت متأكد من حذف هذا العنصر؟" : "Are you sure to delete this item?",
      text: lang === "ar" ? "لا يمكنك التراجع عن هذا الإجراء!" : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === "ar" ? "نعم، احذف!" : "Yes, delete it!",
      cancelButtonText: lang === "ar" ? "إلغاء" : "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/ContactUs/deletecontactus/${id}/${lang}`);
        setContacts(contacts.filter((contact) => contact.id !== id));

        
        Swal.fire(
          lang === "ar" ? "تم الحذف!" : "Deleted!",
          lang === "ar" ? "تم حذف العنصر بنجاح." : "Your item has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting contact:", error);
       
        Swal.fire(
          lang === "ar" ? "خطأ!" : "Error!",
          lang === "ar" ? "حدث خطأ أثناء محاولة الحذف." : "An error occurred while trying to delete.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" style={{ backgroundColor: "#6DA6BA" }} className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {lang === "ar" ? "جدول التواصل" : "Contact Table"}
          </Typography>
        </CardHeader>
        <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["First Name", "Last Name", "Email", "Phone", "Address", "Message", "Action"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => {
                const className = `py-3 px-5 ${index === contacts.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={contact.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{contact.First_Name}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{contact.Last_name}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{contact.EmailAddress}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{contact.Phone_Number}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{contact.Address}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{contact.Messages}</Typography>
                    </td>
                    <td className={className}>
                      <Button
                        onClick={() => handleDelete(contact.id)}
                        className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                      >
                        <TrashIcon className="h-5 w-5 mr-1" /> {lang === "ar" ? "حذف" : "Delete"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default ContactUsPage;
