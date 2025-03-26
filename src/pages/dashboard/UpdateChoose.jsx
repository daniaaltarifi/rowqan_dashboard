import React, { useState, useEffect } from "react";
import { Globe2, Calendar, Check, PhoneCall, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";



const translations = {
  ar: {
    pageTitle: "خليها علينا",
    subTitle: "دع روقان يختار لك",
    reservationType: "نوع الحجز",
    required: "مطلوب",
    other: 'أخرى',
    types: {
      family: "عائلي",
      shabab: "شباب",
      banat: "بنات",
      romantic: "رومانسي",
      birthday: "عيد ميلاد",
      graduation: "تخرج",
      wedding: "زفاف / خطوبة",
      
    },
    familyDetails: {
      title: "تفاصيل العائلات",
      numberOfFamilies: "عدد العائلات",
      familyCount: "كم عدد العائلات؟",
    },
    duration: {
      title: "مدة الحجز والتاريخ",
      startDate: "تاريخ البداية",
      selectDate: "اختر التاريخ",
      selectDuration: "اختر المدة",
      options: {
        oneDay: "يوم واحد (10 صباحاً - 9 مساءً)",
        oneNight: "ليلة واحدة (9 مساءً - 10 صباحاً)",
        twoDaysMorning: "يومان - يبدأ صباحاً",
        twoDaysEvening: "يومان - يبدأ مساءً",
        oneWeek: "أسبوع",
        oneMonth: "شهر",
        custom: "مدة مخصصة",
      },
    },
    visitors: {
      title: "عدد الزوار",
      count: "عدد الأشخاص",
    },
    facilities: {
      title: "المرافق والميزات",
      outdoorPool: "مسبح خارجي",
      indoorPool: "مسبح داخلي",
      heatedPool: "مسبح مدفأ",
      footballField: "ملعب كرة قدم",
      tableTennis: "تنس طاولة",
      foosball: "كرة قدم طاولة",
      bbqArea: "منطقة شواء",
      scenicView: "إطلالة جميلة",
      fullPrivacy: "خصوصية كاملة",
      newChalet: "شاليه جديد",
      numberOfRooms: "عدد الغرف",
    },
    rating: {
      title: "تصنيف الشاليه المفضل",
      selectRating: "اختر التصنيف",
      stars: {
        three: "★★★ (3 نجوم)",
        four: "★★★★ (4 نجوم)",
        five: "★★★★★ (5 نجوم)",
      },
    },
    calendar: {
      months: [
        "يناير",
        "فبراير",
        "مارس",
        "إبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      days: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
      today: "اليوم",
      clear: "مسح",
    },
    location: {
      title: "الموقع المفضل",
      options: {
        amman: "عمان",
        salt: "السلط",
        jerash: "جرش",
        ajloun: "عجلون",
        deadSea: "البحر الميت",
        Irbid:"اربد",
        Perrin:"بيرين",
        Airport_Road:"طريق المطار",
        other: "أخرى",
        currentLocation: "موقعي الحالي",
      },
      placeholder: "أدخل موقعًا آخر",
      currentLocation: {
        buttonLabel: "موقعي الحالي",
        capture: {
          longitude: "خط الطول",
          latitude: "خط العرض",
          capturedAt: "وقت التقاط الموقع",
        },
        openMapLabel: "افتح الموقع على الخريطة",
        errors: {
          notSupported: "خدمة الموقع غير متوفرة على هذا المتصفح.",
          permissionDenied:
            "تم رفض الوصول إلى الموقع. يرجى التأكد من تشغيل خدمات الموقع.",
          positionUnavailable: "معلومات الموقع غير متوفرة حاليًا.",
        },
      },
      
    },
    budget: {
      title: "الميزانية",
      placeholder: "أدخل الميزانية بالدينار الأردني",
      required: "مطلوب",
      validationMessages: {
        family: "الحد الأدنى للميزانية للحجز العائلي 70 دينار",
        shabab: "الحد الأدنى للميزانية لحجز الشباب 80 دينار",
        banat: "الحد الأدنى للميزانية لحجز البنات 80 دينار",
        romantic: "الحد الأدنى للميزانية للحجز الرومانسي 90 دينار",
        birthday: "الحد الأدنى للميزانية لحجز عيد الميلاد 100 دينار",
        graduation: "الحد الأدنى للميزانية لحجز التخرج 120 دينار",
        wedding: "الحد الأدنى للميزانية لحجز الزفاف 180 دينار",
      },
    },
    additionalNotes: {
      title: "ملاحظات إضافية",
      placeholder: "أدخل أي ملاحظات أو طلبات خاصة",
    },
    contact: {
      title: "معلومات التواصل",
      fullName: {
        label: "الاسم الكامل",
        placeholder: "أدخل اسمك الكامل",
        error: "الاسم الكامل مطلوب",
      },
      phoneNumber: {
        label: "رقم الهاتف",
        placeholder: "مثال: +962 79xxxxxxx",
        error: "رقم الهاتف مطلوب",
        invalidError: "يرجى إدخال رقم هاتف أردني صحيح (مثل: +962 79xxxxxxx)",
      },
      contactMethod: {
        call: "اتصال",
        whatsapp: "واتساب",
      },
      callButton: {
        label: "اتصال",
        number: "0786399917",
      },
      whatsappButton: {
        label: "مراسلة على واتساب",
        number: "0786399917",
        defaultMessage: "مرحبًا، أود الاستفسار عن حجز شاليه",
      },
    },
    submission: {
      buttonLabel: "أرسل الطلب الآن",
      successTitle: "تم إرسال الطلب بنجاح!",
      successMessage: "طلبك ارسل بنجاح رح بتم التواصل معك من قبل فريق روقان.",
      errorTitle: "خطأ في الإرسال",
      errorMessage: "عذرًا، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      okButton: "حسنًا",
    },
  },
  en: {
    pageTitle: "Let Rowqan Choose",
    other: 'Other',
    subTitle: "Let us handle your reservation",
    reservationType: "Reservation Type",
    required: "Required",
    types: {
      family: "Family",
      shabab: "Shabab",
      banat: "Banat",
      romantic: "Romantic",
      birthday: "Birthday",
      graduation: "Graduation",
      wedding: "Wedding / Engagement",
    },
    familyDetails: {
      title: "Family Details",
      numberOfFamilies: "Number of Families",
      familyCount: "How many families?",
    },
    duration: {
      title: "Reservation Duration & Date",
      startDate: "Start Date",
      selectDate: "Select Date",
      selectDuration: "Select Duration",
      options: {
        oneDay: "One day (10 AM – 9 PM)",
        oneNight: "One night (9 PM – 10 AM)",
        twoDaysMorning: "Two days – Starting Morning",
        twoDaysEvening: "Two days – Starting Evening",
        oneWeek: "One week",
        oneMonth: "One month",
        custom: "Custom Duration",
      },
    },
    visitors: {
      title: "Number of Visitors",
      count: "Number of people",
    },
    facilities: {
      title: "Facilities & Features",
      outdoorPool: "Outdoor Pool",
      indoorPool: "Indoor Pool",
      heatedPool: "Heated Pool",
      footballField: "Football Field",
      tableTennis: "Table Tennis",
      foosball: "Foosball",
      bbqArea: "BBQ Area",
      scenicView: "Scenic View",
      fullPrivacy: "Full Privacy",
      newChalet: "New Chalet",
      numberOfRooms: "Number of Rooms",
    },
    rating: {
      title: "Preferred Chalet Rating",
      selectRating: "Select Rating",
      stars: {
        three: "★★★ (3 Stars)",
        four: "★★★★ (4 Stars)",
        five: "★★★★★ (5 Stars)",
      },
    },
    calendar: {
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: "Today",
      clear: "Clear",
    },
    location: {
      title: "Preferred Location",
      options: {
        amman: "Amman",
        salt: "Salt",
        jerash: "Jerash",
        ajloun: "Ajloun",
        deadSea: "Dead Sea",
        Irbid:"Irbid",
        Perrin:"Perrin",
        Airport_Road: "Airport_Road",
        other: "Other",
        currentLocation: "My Location",
      },
      placeholder: "Enter another location",
      currentLocation: {
        buttonLabel: "My Location",
        capture: {
          longitude: "Longitude",
          latitude: "Latitude",
          capturedAt: "Location captured at",
        },
        openMapLabel: "Open Location on Map",
        errors: {
          notSupported: "Geolocation is not supported by this browser.",
          permissionDenied:
            "Location access was denied. Please ensure location services are enabled.",
          positionUnavailable: "Location information is currently unavailable.",
        },
      },
    },
    budget: {
      title: "Budget",
      placeholder: "Enter total budget in JOD",
      required: "Required",
      validationMessages: {
        family: "Minimum budget for Family reservation is 70 JOD",
        shabab: "Minimum budget for Shabab reservation is 80 JOD",
        banat: "Minimum budget for Banat reservation is 80 JOD",
        romantic: "Minimum budget for Romantic reservation is 90 JOD",
        birthday: "Minimum budget for Birthday reservation is 100 JOD",
        graduation: "Minimum budget for Graduation reservation is 120 JOD",
        wedding: "Minimum budget for Wedding reservation is 180 JOD",
        invalid: "Budget is invalid for the selected reservation type",
      },
    },
    additionalNotes: {
      title: "Additional Notes",
      placeholder: "Enter any special requests or notes",
    },
    contact: {
      title: "Contact Information",
      fullName: {
        label: "Full Name",
        placeholder: "Enter your full name",
        error: "Full name is required",
      },
      phoneNumber: {
        label: "Phone Number",
        placeholder: "Example: +962 79xxxxxxx",
        error: "Phone number is required",
        invalidError:
          "Please enter a valid Jordanian phone number (e.g., +962 79xxxxxxx)",
      },
      contactMethod: {
        call: "Call",
        whatsapp: "WhatsApp",
      },
      callButton: {
        label: "Call",
        number: "0786399917",
      },
      whatsappButton: {
        label: "Message on WhatsApp",
        number: "0786399917",
        defaultMessage:
          "Hello, I would like to inquire about a chalet reservation",
      },
    },
    submission: {
      buttonLabel: "Submit Request Now",
      successTitle: "Request Submitted Successfully!",
      successMessage:
        "Your request has been sent successfully. A member of the Rowqan team will contact you.",
      errorMessage:
        "Sorry, an error occurred while sending the request. Please try again.",
      okButton: "OK",
    },
  },
};



const CustomDatePickerInput = React.forwardRef(
  ({ value, onClick, placeholder, lang }, ref) => {
    return (
      <div className="relative">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white text-center"
          onClick={onClick}
          value={value}
          placeholder={placeholder}
          readOnly
          ref={ref}
        />
        <Calendar
          className={`absolute ${
            lang === "ar" ? "left-3" : "right-3"
          } top-3 h-5 w-5 text-gray-400`}
        />
      </div>
    );
  }
);



function UpdateChoose() {
  return (
    <div>dwwdwd</div>
  )
}

export default UpdateChoose