import {
  HomeIcon,
  UserCircleIcon,
  TagIcon, // Icon for Brands
  ShoppingBagIcon,
  CreditCardIcon,
  WalletIcon,
  ChatBubbleLeftEllipsisIcon ,ShieldCheckIcon ,ShieldExclamationIcon ,
  PhotoIcon ,NewspaperIcon,ShareIcon,GlobeAsiaAustraliaIcon,ArrowTopRightOnSquareIcon 
} from "@heroicons/react/24/solid"; // Ensure you import the correct icon
import { BiSolidCoupon } from "react-icons/bi";
import {Products } from "@/pages/dashboard";
import { Home } from "@/pages/dashboard";
import Users from "./pages/dashboard/Users/Users";
import Brands from "./pages/dashboard/Brands/Brands";
import Codes from "./pages/dashboard/Codes/Codes";
import Orders from "./pages/dashboard/Orders/Orders";
import Slider from "./pages/dashboard/Slider/Slider";
import Feedback from "./pages/dashboard/Feedback/Feedback";
import Wallet from "./pages/dashboard/Wallet/Wallet";
import Category from "./pages/dashboard/Category/Category";
import Blogs from "./pages/dashboard/Blogs/Blogs";
import Abouts from "./pages/dashboard/About/Abouts";
import FooterData from "./pages/dashboard/Footer/FooterData";
import PrivacyPolicies from "./pages/dashboard/PrivacyPolicy/AllPrivacyPolicy";
import AllTermsAndConditions from "./pages/dashboard/TermsConditions/AllTermsAndConditions"
import Header from "./pages/dashboard/Header/Header";
import Cookies from "js-cookie";

const lang = Cookies.get('lang') || 'en';



const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: lang ==='ar'? "الرئيسية" :"Home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: lang ==='ar'? "المستخدمين" :"Users",
        path: "/users",
        element: <Users />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name:lang ==='ar'? "الاصناف" : "Category",
        path: "/category",
        element: <Category />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name:lang ==='ar'? "المنتجات" : "Products",
        path: "/products",
        element: <Products />,
      },
      {
        icon: <GlobeAsiaAustraliaIcon {...icon} />,
        name: lang ==='ar'? "عن مزرعتنا" :"About Us",
        path: "/about",
        element: <Abouts />,
      },
      // {
      //   icon: <TagIcon {...icon} />, // Icon for Brands
      //   name: "Brands",
      //   path: "/brands",
      //   element: <Notifications />, // Adjust this to the correct element if needed
      // },
      {
        icon: <TagIcon {...icon} />, // Icon for Brands
        name: lang ==='ar'? "الشهادات" :"Certificate",
        path: "/certificate",
        element: <Brands />, // Adjust this to the correct element if needed
      },
      {
        icon: <BiSolidCoupon {...icon} />, // Icon for Brands
        name: lang ==='ar'? "اكواد الخصم" :"Discount Codes",
        path: "/codes",
        element: <Codes />, // Adjust this to the correct element if needed
      },
      {
        icon: <CreditCardIcon {...icon} />, // Icon for Brands
        name: lang ==='ar'? "الطلبات" :"Orders",
        path: "/orders",
        element: <Orders />, // Adjust this to the correct element if needed
      },
      {
        icon: <WalletIcon {...icon} />, // Icon for Brands
        name: lang ==='ar'? "المحفظة" :"Wallet",
        path: "/wallet",
        element: <Wallet />, // Adjust this to the correct element if needed
      },
      {
        icon: <NewspaperIcon {...icon} />, // Icon for Brands
        name: lang ==='ar'? "المدونات" :"Blogs",
        path: "/blogs",
        element: <Blogs />, // Adjust this to the correct element if needed
      },
      {
        icon: <ChatBubbleLeftEllipsisIcon  {...icon} />, // Icon for Brands
        name: lang ==='ar'? "الاراء" :"FeedBack",
        path: "/feedback",
        element: <Feedback />, // Adjust this to the correct element if needed
      }, 
       {
        icon: <PhotoIcon  {...icon} />, // Icon for Brands
        name: lang ==='ar'? "الصور" :"Slider",
        path: "/slider",
        element: <Slider />, // Adjust this to the correct element if needed
      },
      {
        icon: <ArrowTopRightOnSquareIcon    {...icon} />, // Icon for Brands
        name: lang ==='ar'? "اعلى الصفحة" :"Header",
        path: "/header",
        element: <Header />, // Adjust this to the correct element if needed
      },
      {
        icon: <ShareIcon  {...icon} />, // Icon for Brands
        name: lang ==='ar'? "اسفل الصفحة" :"Footer",
        path: "/footer",
        element: <FooterData />,
      },
        { // Adjust this to the correct element if needed
        icon: <ShieldCheckIcon   {...icon} />, // Icon for Brands
        name: lang ==='ar'? "سياسة الخصوصية" :"privacypolicy",
        path: "/privacypolicy",
        element: <PrivacyPolicies />, // Adjust this to the correct element if needed
      },
      {
        icon: <ShieldExclamationIcon   {...icon} />, // Icon for Brands
        name: lang ==='ar'? "الشروط والاحكام" :"terms and conditions",
        path: "/termsandconditions",
        element: <AllTermsAndConditions />, // Adjust this to the correct element if needed
      },

    ],
  },
  // {
  //   title: "Auth Pages",
  //   layout: "auth",
  //   pages: [
  //     // {
  //     //   icon: <ServerStackIcon {...icon} />,
  //     //   name: "Sign In",
  //     //   path: "/sign-in",
  //     //   element: <SignIn />,
  //     // },
  //     // {
  //     //   icon: <RectangleStackIcon {...icon} />,
  //     //   name: "Sign Up",
  //     //   path: "/sign-up",
  //     //   element: <SignUp />,
  //     // },
  //   ],
  // },
];

export default routes;