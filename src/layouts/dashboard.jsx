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
import AddDetails from "@/pages/dashboard/Chalets/AddDetails";
import UpdateDetails from "@/pages/dashboard/Chalets/UpdateDetails";
import AddProperties from "@/pages/dashboard/Properties/AddProperties";
import UpdateProerties from "@/pages/dashboard/Properties/UpdateProperties";
import AddBriefChalets from "@/pages/dashboard/Properties/AddBriefChalets";
import UpdateBriefChalets from "@/pages/dashboard/Properties/UpdateBriefChalets";
import ReservationDetails from "@/SuperAdmin DashBoard/ReservationDetails";
import AddImagesChalets from "@/pages/dashboard/Properties/AddImagesChalets";
import UpdateHero from "@/pages/dashboard/About/UpdateHero";
import AddBlog from "@/pages/dashboard/About/AddBlog";
import UpdateBlog from "@/pages/dashboard/About/UpdateBlog";
import AddFooter from "@/pages/dashboard/Footer/AddFooter";


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
        <Route path="reservationdetails/:id" element={<ReservationDetails />} />

{/* /////////////////////////////////////// */}
<Route path="addchalet" element={<AddChalets />} />
<Route path="updatechalet/:id" element={<UpdateChalets />} />
<Route path="adddetails" element={<AddDetails />} />
<Route path="updatedetails/:id" element={<UpdateDetails />} />
<Route path="addchaletproperties" element={<AddProperties />} />
<Route path="updatepropertieschalet/:id" element={<UpdateProerties />} />
<Route path="addbriefchalets" element={<AddBriefChalets />} />
<Route path="updatebriefchalets/:id" element={<UpdateBriefChalets />} />
<Route path="addimgchalets" element={<AddImagesChalets />} />
<Route path="updateabouts/:id" element={<UpdateAbout />} /> 
<Route path="updatehero/:id" element={<UpdateHero />} />
<Route path="addblog" element={<AddBlog />} />
<Route path="updateblog/:id" element={<UpdateBlog />} />
<Route path="addfooter" element={<AddFooter />} />
<Route path="updatefooter/:id" element={<UpdateFooter />} />
<Route path="addsocial" element={<AddSocail />} />

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
