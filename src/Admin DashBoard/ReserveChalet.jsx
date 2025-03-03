import { API_URL } from '@/App';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../Styles/Chalets.css'
function ReserveChalet() {
    const lang = Cookies.get('lang') || 'en';
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [message, setMessage] = useState("");
const receiverId=Cookies.get('receiverId');
const userRole=Cookies.get('userRole');
  const fetchData = useCallback(async () => {
    try {
      let chaletRes;

      if(userRole === "5"){
      chaletRes = await axios.get(`${API_URL}/chalets/getallchalets/${lang}`)
      }
      else{
         chaletRes = await axios.get(`${API_URL}/adminChalets/getChaletsByAdminId/${receiverId}`)
      }

      if (chaletRes.data !== dataToDisplay) {
        setDataToDisplay(chaletRes.data);
      }
    } catch (error) {
      console.error("Error fetching chalets:", error);
    }
  }, [lang, dataToDisplay]);
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang]);
  return (
    <div>
       <Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((chal) => {
            const typeChalets = JSON.parse(
              chal.type.replace(/\\/g, "").replace(/^"|"$/g, "")
            );

            // Find the Evening time model
            const eveningTime = chal.RightTimeModels.find(
              (time) => time.type_of_time === "Evening"
            );
            const eveningPrice = eveningTime ? eveningTime.price : 0; // If no Evening time, fallback to default reserve price

            return (
              <div key={chal.id}>
                <Link
                  to={`/dashboard/createreservation/${chal.id}`}
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
                    //   height={"286px"}
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
                          {Object.entries(typeChalets)
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
  )
}

export default ReserveChalet