import { API_URL } from '@/App';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../Styles/Chalets.css';

function ReserveChalet() {
    const lang = Cookies.get('lang') || 'en';
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [message, setMessage] = useState("");
    const receiverId = Cookies.get('receiverId');
    const userRole = Cookies.get('userRole');
    const [selectedRole, setSelectedRole] = useState('user');

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const fetchData = useCallback(async () => {
        try {
            let chaletRes;
            
            if (selectedRole === 'user') {
                chaletRes = await axios.get(`${API_URL}/chalets/getallchalets`);
            } else {
                chaletRes = await axios.get(`${API_URL}/adminChalets/getChaletsByAdminId/${receiverId}`);
            }

            if (chaletRes.data !== dataToDisplay) {
                setDataToDisplay(chaletRes.data);
            }
        } catch (error) {
            console.error("Error fetching chalets:", error);
        }
    }, [lang, dataToDisplay, selectedRole, receiverId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, [lang, selectedRole]);

    // Función para analizar de forma segura los datos de tipo
    const parseType = (typeData) => {
        try {
            // Si typeData ya es un objeto, devolverlo directamente
            if (typeof typeData === 'object' && typeData !== null) {
                return typeData;
            }
            
            // Si es string, intentar parsear
            if (typeof typeData === 'string') {
                return JSON.parse(typeData.replace(/\\/g, "").replace(/^"|"$/g, ""));
            }
            
            // Si no es ni objeto ni string, devolver un objeto vacío para evitar errores
            return {};
        } catch (error) {
            console.error("Error parsing type data:", error, typeData);
            return {}; // Devolver objeto vacío en caso de error
        }
    };

    return (
        <div className="page-wrapper">
          
            <div className="dropdown-container">
                <div className="role-selector">
                    <h3 className="selector-title">
                        {lang === 'ar' ? 'اختر نوع الحجز' : 'Select Reservation Type'}
                    </h3>
                    <Form.Select 
                        value={selectedRole}
                        onChange={handleRoleChange}
                        className="custom-select hover-effect"
                    >
                        <option value="user">
                            {lang === 'ar' ? 'حجز للمستخدم' : 'Book for User'}
                        </option>
                        <option value="admin">
                            {lang === 'ar' ? 'حجز للأدمن' : 'Book for Admin'}
                        </option>
                    </Form.Select>
                </div>
            </div>

            <Container className="my-4">
                
                <style>
                    {`
                        .page-wrapper {
                            display: flex;
                            flex-direction: column;
                            min-height: 70vh;
                        }
                        
                        .dropdown-container {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            padding: 40px 0;
                        }
                        
                        .role-selector {
                            max-width: 500px;
                            width: 90%;
                            padding: 30px;
                            border-radius: 15px;
                            background-color: #ffffff;
                            box-shadow: 0 6px 15px rgba(0,0,0,0.1);
                            border: 1px solid #e0e0e0;
                            transition: all 0.3s ease;
                        }
                        
                        .role-selector:hover {
                            transform: translateY(-5px);
                            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                        }
                        
                        .selector-title {
                            text-align: center;
                            color: #2c3e50;
                            font-size: 28px;
                            font-weight: 600;
                            margin-bottom: 25px;
                        }
                        
                        .custom-select {
                            padding: 15px;
                            font-size: 18px;
                            border-radius: 10px;
                            border: 2px solid #e0e0e0;
                            background-color: #f8f9fa;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        }
                        
                        .hover-effect:hover {
                            border-color: #007bff;
                            box-shadow: 0 4px 8px rgba(0,123,255,0.15);
                        }
                        
                        .hover-effect:focus {
                            border-color: #007bff;
                            box-shadow: 0 0 0 0.25rem rgba(0,123,255,.25);
                            outline: none;
                        }
                    `}
                </style>

              
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {dataToDisplay.length > 0 ? (
                        dataToDisplay.map((chal) => {
                            // Usar la función parseType para manejar diferentes formatos de datos
                            const typeChalets = parseType(chal.type);

                            const eveningTime = chal.RightTimeModels && chal.RightTimeModels.find(
                                (time) => time.type_of_time === "Evening"
                            );
                            const eveningPrice = eveningTime ? eveningTime.price : 0;

                            return (
                                <div key={chal.id}>
                                    <Link
                                        to={
                                            selectedRole === 'admin' 
                                            ? `/dashboard/createadminreservation/${chal.id}` 
                                            : `/dashboard/createreservation/${chal.id}`
                                        }
                                        onClick={() => {
                                            try {
                                                localStorage.setItem("intial_Amount", chal.intial_Amount);
                                                localStorage.setItem("price", eveningPrice);
                                                localStorage.setItem(
                                                    "Number of Visitors",
                                                    typeChalets["Number of Visitors"] || typeChalets["عدد الغرف"] || null
                                                );
                                            } catch (error) {
                                                console.error("Error accessing localStorage", error);
                                            }
                                        }}
                                        className="block text-decoration-none"
                                    >
                                        <Card className="cont_card_chalets">
                                            <Card.Img
                                                variant="top"
                                                className="img_chalet"
                                                srcSet={chal.image}
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                alt="chal img"
                                                decoding="async"
                                                loading="lazy"
                                            />
                                            <Card.Body className="flex flex-col">
                                                <Card.Title className="title_chalets">
                                                    {chal.title}
                                                </Card.Title>

                                                <div className="mt-4 flex flex-col">
                                                    <div className="flex justify-evenly flex-wrap mb-3">
                                                        {typeChalets && Object.entries(typeChalets)
                                                            .filter(([key]) => key === "Number of Visitors" || key === "عدد الغرف")
                                                            .map(([key, value], index) => (
                                                                <Card.Text key={index} className="type_chalets">
                                                                    {key.replace(/_/g, " ")}: {value}
                                                                </Card.Text>
                                                            ))}
                                                    </div>
                                                    <div className="flex justify-evenly mt-3">
                                                        <Card.Text className="text_card_det">
                                                            {lang === "ar"
                                                                ? "يبدأ السعر من "
                                                                : "Starting Price :"}{" "}
                                                            {eveningPrice} JD
                                                        </Card.Text>
                                                    </div>
                                                </div>

                                                <div className="flex justify-evenly mt-3 mt-auto">
                                                    <button className="booknow_button_events">
                                                        {lang === "ar" ? "احجز الان" : "Reserve Now"}
                                                    </button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center">{message}</p>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default ReserveChalet;