import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";

import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import AddUser from "@/pages/dashboard/Users/AddUser";
import UpdateUser from "@/pages/dashboard/Users/UpdateUser";
import UpdateBrand from "@/pages/dashboard/Brands/UpdateCertificate";
import AddCode from "@/pages/dashboard/Codes/AddCodes";
import UpdateCode from "@/pages/dashboard/Codes/UpdateCode";
import AddSlide from "@/pages/dashboard/Slider/AddSlide";
import UpdateSlide from "@/pages/dashboard/Slider/UpdateSlide";
import AddCertificate from "@/pages/dashboard/Brands/AddCertificate";
import UpdateCertificate from "@/pages/dashboard/Brands/UpdateCertificate";
import AddCategory from "@/pages/dashboard/Category/AddCategory";
import AddProduct from "@/pages/dashboard/Products/AddProducts/AddProduct";
import UpdateProduct from "@/pages/dashboard/Products/UpdateProducts";
import UpdateVariant from "@/pages/dashboard/Products/UpdateVariants";
import AddBlog from "@/pages/dashboard/Blogs/AddBlog";
import UpdateBlog from "@/pages/dashboard/Blogs/UpdateBlog";
import AddAbout from "@/pages/dashboard/About/AddAbout";
import UpdateAbout from "@/pages/dashboard/About/UpdateAbout";
import UpdateFooter from "@/pages/dashboard/Footer/UpdateFooter";
import AddSocail from "@/pages/dashboard/Footer/AddSocial";
import UpdateSocial from "@/pages/dashboard/Footer/UpdateSocial";
import AddPrivacyPolicy from "@/pages/dashboard/PrivacyPolicy/AddPrivacyPolicy";
import UpdatePrivacyPolicy from "@/pages/dashboard/PrivacyPolicy/UpdatePrivacyPolicy";
import AddTermsAndConditions from "@/pages/dashboard/TermsConditions/AddTermsAndConditions";
import UpdateTermsAndConditions from "@/pages/dashboard/TermsConditions/UpdateTermsAndConditions";
import AddHeader from "@/pages/dashboard/Header/AddHeader";
import UpdateHeader from "@/pages/dashboard/Header/UpdateHeader";
import AddChalets from "@/pages/dashboard/Chalets/AddChalets";
import UpdateChalets from "@/pages/dashboard/Chalets/UpdateChalets";
import AddDetails from "@/pages/dashboard/Chalets/AddDetails";
import UpdateDetails from "@/pages/dashboard/Chalets/UpdateDetails";
export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

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
            <Route path="adduser" element={<AddUser />} />
            <Route path="updateuser/:id" element={<UpdateUser />} />
            <Route path="updateabouts/:id" element={<UpdateAbout />} /> 
            <Route path="addCertificate" element={<AddCertificate />} />
            <Route path="updatecertificate/:id" element={<UpdateCertificate />} />
            <Route path="addcode" element={<AddCode />} />
            <Route path="updatecode/:id" element={<UpdateCode />} />
            <Route path="addslide" element={<AddSlide />} />
            <Route path="updateslide/:id" element={<UpdateSlide />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="addabout" element={<AddAbout />} />
            <Route path="addtermsandconditions" element={<AddTermsAndConditions />} />
            <Route path="updatetermsandconditions/:id" element={<UpdateTermsAndConditions />} />
            <Route path="addprivacypolicy" element={<AddPrivacyPolicy />} />
            <Route path="updateprivacypolicy/:id" element={<UpdatePrivacyPolicy />} />
        <Route path="updateproducts/:id" element={<UpdateProduct />} /> 
        <Route path="updatevariants/:id" element={<UpdateVariant />} /> 
        <Route path="addblog" element={<AddBlog />} />
        <Route path="updateblog/:id" element={<UpdateBlog />} />
        <Route path="updatefooter/:id" element={<UpdateFooter />} />
        <Route path="addsocial" element={<AddSocail />} />
        <Route path="updatesocial/:id" element={<UpdateSocial />} />
        <Route path="addheader" element={<AddHeader />} />
        <Route path="updateheader/:id" element={<UpdateHeader />} />
       
{/* /////////////////////////////////////// */}
<Route path="addchalet" element={<AddChalets />} />
<Route path="updatechalet/:id" element={<UpdateChalets />} />
<Route path="adddetails" element={<AddDetails />} />
<Route path="updatedetails/:id" element={<UpdateDetails />} />



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
