import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { Sidenav, DashboardNavbar, Configurator, Footer } from "@/widgets/layout";
import useRoutes from "@/routes"; 
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import UpdateAbout from "@/pages/dashboard/About/UpdateAbout";
import UpdateFooter from "@/pages/dashboard/Footer/UpdateFooter";
import AddSocail from "@/pages/dashboard/Footer/AddSocial";
import UpdateSocial from "@/pages/dashboard/Footer/UpdateSocial";
import AddHeader from "@/pages/dashboard/Header/AddHeader";
import UpdateHeader from "@/pages/dashboard/Header/UpdateHeader";
import AddChalets from "@/pages/dashboard/Chalets/AddChalets";
import UpdateChalets from "@/pages/dashboard/Chalets/UpdateChalets";

import AddImagesChalets from "@/pages/dashboard/Properties/AddImagesChalets";
import UpdateHero from "@/pages/dashboard/About/UpdateHero";
import UpdateBlog from "@/pages/dashboard/About/UpdateBlog";
import AddBlog from "@/pages/dashboard/About/AddBlog";
import AddFooter from "@/pages/dashboard/Footer/AddFooter";
import Messages from "@/ChaletsOwners DashBoard/Messages";

import UpdateUser from "@/pages/dashboard/Users/UpdateUser";

import UpdateLogo from "@/pages/dashboard/Header/UpdateLogo";
import UpdateStatusChalet from "@/pages/dashboard/TimeAndStatus/UpdateStatusChalet";
import Abouts from "@/pages/dashboard/About/Abouts";
import ReservationCalendar from "@/pages/dashboard/Chalets/ReservationCalendar";
import AddContact from "@/pages/dashboard/Contact/AddContact";
import UpdateContact from "@/pages/dashboard/Contact/UpdateContact";
import AddStatusChalet from "@/pages/dashboard/TimeAndStatus/AddStatusChalet";
import AddImagesInChalets from "@/pages/dashboard/Chalets/AddImageInChalets";
import AddUser from "@/pages/dashboard/Users/AddUser";
import AddRightTime from "@/pages/dashboard/TimeAndStatus/AddRightTime";
import UsersByChaletsMessages from "@/ChaletsOwners DashBoard/UsersByChaletsMessages";
import UpdateRightTime from "@/pages/dashboard/TimeAndStatus/UpdateRightTme";



export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;


  const routes = useRoutes();

  
  if (!routes) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Routes>
          {routes.map(({ layout, pages }) =>
            layout === "dashboard" &&
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          )}
            <Route path="updatesocial/:id" element={<UpdateSocial />} />
        <Route path="addheader" element={<AddHeader />} />
        <Route path="updateheader/:id" element={<UpdateHeader />} />
        {/* <Route path="dashboard/abouts" element={<Abouts />} /> */}
<Route path="addchalet" element={<AddChalets />} />
<Route path="updatechalet/:chalet_id" element={<UpdateChalets />} />

<Route path="adduser" element={<AddUser />} />

<Route path="updateUser/:id" element={<UpdateUser/>} />
<Route path="addimginchalets/:chalet_id" element={<AddImagesChalets />} />
<Route path="addimgchalets" element={<AddImagesChalets />} />
<Route path="abouts" element={<Abouts />} />
<Route path="updateabouts/:id" element={<UpdateAbout />} />
<Route path="updatehero/:id" element={<UpdateHero />} />
<Route path="addblog" element={<AddBlog />} />
<Route path="updateblog/:id" element={<UpdateBlog />} />
<Route path="addfooter" element={<AddFooter />} />
<Route path="updatefooter/:id" element={<UpdateFooter />} />
<Route path="addsocial" element={<AddSocail />} />
<Route path="reservationcalendar/:chalet_id" element={<ReservationCalendar />} />
<Route path="updatelogo/:id" element={<UpdateLogo />} />
<Route path="addcontact" element={<AddContact />} />
<Route path="updatecontact/:id" element={<UpdateContact />} />
<Route path="addrighttimechalet/:chalet_id" element={<AddRightTime />} />
<Route path="updaterighttimechalet/:chalet_id/:time_id" element={<UpdateRightTime />} />
<Route path="addstatuschalet" element={<AddStatusChalet />} />
<Route path="updatestatuschalet/:id" element={<UpdateStatusChalet />} />
<Route path="usersbychaletsmessages/:chalet_id/messagebetweenusers/:user_id" element={<Messages />} />
<Route path="usersbychaletsmessages/:chalet_id" element={<UsersByChaletsMessages />} />





          {Array.isArray(routes) &&
            routes.map(({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
            )}
          
        </Routes>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
