import { HomeIcon, TagIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { Home } from "@/pages/dashboard";
import HomeAdminPage from "./Admin DashBoard/HomeAdminPage";
import ReservationsPage from "./SuperAdmin DashBoard/ReservationsPage";
import HomeChaletOwners from "./ChaletsOwners DashBoard/HomeChaletOwners";
import ChaletsPage from "./Admin DashBoard/ChaletsPage";
import React, { useState, useEffect } from "react";
import Chalets from "./pages/dashboard/Chalets/Chalets";
import Properties from "./pages/dashboard/Properties/Properties";
import HomeSuperAdmin from "./SuperAdmin DashBoard/HomeSuperAdmin";
import ChaletsOwnersPage from "./Admin DashBoard/ChaletsOwnersPage";
import Users from "./pages/dashboard/Users/Users";
import Abouts from "./pages/dashboard/About/Abouts";
import FooterData from "./pages/dashboard/Footer/FooterData";

const lang = Cookies.get("lang") || "en"; 

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const useRoutes = () => {
  const [userRole, setUserRole] = useState(null); 
  const [isRoleLoaded, setIsRoleLoaded] = useState(false); 

  useEffect(() => {
    const role = Cookies.get("userRole"); 
    if (role) {
      setUserRole(role);
    }
    setIsRoleLoaded(true); 
  }, []);

 
  if (!isRoleLoaded) {
    return null;
  }

 
  const routes = [
    {
      layout: "dashboard",
      pages: [
        ...(userRole === "1"
          ? [
              {
                icon: <HomeIcon {...icon} />,
                name: lang === "ar" ? "الرئيسية" : "Home",
                path: "/home",
                element: <Home />,
              },
              {
                icon: <TagIcon {...icon} />,
                name:lang ==='ar'? "الشاليهات" : "Chalets",
                path: "/chalets",
                element: <Chalets />,
              },  {
                icon: <TagIcon {...icon} />,
                name:lang ==='ar'? "خصائص الشاليهات" : "Properties Chalets",
                path: "/propertieschalets",
                element: <Properties />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "مالكي الشاليهات" : "Chalets Owners",
                path: "/ChaletsOwners",
                element: <ChaletsOwnersPage />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة المستخدمين" : "Users",
                path: "/usersSuperAdmin",
                element: <Users />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة الحجوزات" : "Reservations",
                path: "/reservationsPage",
                element: <ReservationsPage />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة الحجوزات" : "Setting",
                path: "/setting",
                element: <Abouts />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "أسفل الصفحة" : "Footer",
                path: "/footer",
                element: <FooterData />,
              },
            ]
          : []),
        ...(userRole === "4"
          ? [
              {
                icon: <HomeIcon {...icon} />,
                name: lang === "ar" ? "الرئيسية" : "Home",
                path: "/home",
                element: <Home />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar"
                  ? "الصفحة الرئيسية لمالكي الشاليهات"
                  : "Home Chalets Owners Page",
                path: "/HomeChaletsOwners",
                element: <HomeChaletOwners />,
              },
            ]
          : []),
        ...(userRole === "5"
          ? [
              {
                icon: <HomeIcon {...icon} />,
                name: lang === "ar" ? "الرئيسية" : "Home",
                path: "/home",
                element: <Home />,
              },
              {
                icon: <TagIcon {...icon} />,
                name:lang ==='ar'? "خصائص الشاليهات" : "Properties Chalets",
                path: "/propertieschalets",
                element: <Properties />,
              },
              {
                icon: <TagIcon {...icon} />,
                name:lang ==='ar'? "الشاليهات" : "Chalets",
                path: "/chalets",
                element: <Chalets />,
              },  {
                icon: <TagIcon {...icon} />,

                name: lang === "ar"
                 ? "صفحة المسؤول الرئيسية"
                  : "Chalets Owners",
                path: "/ChaletOwnersPage",
                element: <ChaletsOwnersPage />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة المستخدمين" : "Users",
                path: "/usersSuperAdmin",
                element: <Users />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة الحجوزات" : "Reservations",
                path: "/reservationsPage",
                element: <ReservationsPage />,
              },
            ]
          : []),
      ],
    },
  ];

  return routes;
};

export default useRoutes;
