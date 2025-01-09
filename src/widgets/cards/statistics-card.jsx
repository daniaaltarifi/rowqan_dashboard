import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../App.jsx";
import {
  PhotoIcon ,
  ShoppingBagIcon,
  BellIcon ,
} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
export function StatisticsCard() {
  const [users, setusers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const lang = Cookies.get('lang') || 'en';
 
const fetchData = async () => {
  try {
    const [usersResponse, productsResponse, ordersResponse,feedbackResponse] = await Promise.all([
      axios.get(`${API_URL}/users/getAllUsers/${lang}`),
      axios.get(`${API_URL}/chalets/getallchalets/${lang}`),
      axios.get(`${API_URL}/ReservationsChalets/getAllReservationChalet/${lang}`),
      axios.get(`${API_URL}/Blogs/getAllBlogs/${lang}`),
      axios.get(`${API_URL}/payments/getPayments`),
    ]);

    setusers(usersResponse.data);
    setProducts(productsResponse.data);
    setOrders(ordersResponse.data);
    setFeedback(feedbackResponse.data);
  
  } catch (error) {
    console.error(error);
  }
};
 useEffect(()=>{
 fetchData();
 },[])
  const statisticsCardsData = [
    {
      color: "gray",
      icon: UsersIcon,
      title: lang ==='ar'? "المسنخدمين" : "Users",
      value: users.length,
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
    {
      color: "gray",
      icon: PhotoIcon ,
      title: lang ==='ar'? "الشاليهات" :"Chalets",
      value: products.length,
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: lang ==='ar'? "الحجوزات" : "Reservations",
      value: orders.length,
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than yesterday",
      },
    },
    {
      color: "gray",
      icon: BellIcon,
      title: lang ==='ar'? "المدونات" :"Blogs",
      value: feedback.length,
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
  ];
  return (
    <>
          {statisticsCardsData.map(({ icon, title, footer, color, value }) => (

    <Card key={title} className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      > 
  {React.createElement(icon)}  
  </CardHeader>
      <CardBody className={lang ==='ar'? "p-4 text-left" : "p-4 text-right"}>
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {value}
        </Typography>
      </CardBody>
      {/* {footer && (
  <CardFooter className="border-t border-blue-gray-50 p-4">
    <Typography variant="small" className={footer.color}>
      {footer.value} {footer.label}
    </Typography>
  </CardFooter>
)} */}

    </Card>
         ))}
    </>

  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
