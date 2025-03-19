import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/App";
import Form from "react-bootstrap/Form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Swal from 'sweetalert2';
import '../Styles/Payment.css';

function Payment() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { reservation_id } = useParams();
  const initial_amount = state?.initialAmount || "0";
  const total_amount = state?.totalAmount || "0"; 
  const reservation_type = state?.reservationType || "";
  const chalet_id = state?.chaletId || "";

  const [formData, setFormData] = useState({
    selectedPayment: "cash",
    phoneNumber: "+962",
    name: "",
    invoiceImg: null
  });
  
  const [error, setError] = useState(null);
  const [validatePhone, setValidatePhone] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handlePaymentTypeChange = (paymentType) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedPayment: paymentType,
      invoiceImg: null 
    }));
  };

  const isValidPhoneNumber = (phone) => {
    const phoneWithoutCode = phone.replace("+962", "");
    return /^(7\d{8})$/.test(phoneWithoutCode);
  };


  const handleConfirmPayment = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    
    setError(null);
    setValidatePhone(null);
  
    
    if (!formData.phoneNumber || !formData.phoneNumber.startsWith("+962")) {
      setValidatePhone("Phone number must start with +962");
      return;
    }
  
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setValidatePhone("Invalid phone number format.");
      return;
    }
  
   
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }
  
    setIsLoading(true);
  
    try {
      
      const paymentData = {
        reservation_id: Number(reservation_id),
        paymentMethod: formData.selectedPayment,
        UserName: formData.name,
        Phone_Number: formData.phoneNumber,
        initialAmount: initial_amount,
        Status: 'Pending',  
        payment_status: 'Pending' 
      };
  
      if (formData.selectedPayment === 'Cliq') {
        const formDataToSend = new FormData();
        
        Object.keys(paymentData).forEach(key => {
          formDataToSend.append(key, paymentData[key]);
        });
  
        if (formData.invoiceImg) {
          formDataToSend.append('image', formData.invoiceImg);
        }
  
        const paymentResponse = await axios.post(`http://localhost:5000/payments/createPayment`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
  
        try {
          const updateResponse = await axios.post(`${API_URL}/reservations/${reservation_id}`, {
            Status: 'Pending',
            payment_status: 'Pending'
          });
          console.log('Reservation Update Response:', updateResponse.data);
        } catch (updateError) {
          console.error('Error updating reservation status:', {
            message: updateError.message,
            response: updateError.response?.data,
            status: updateError.response?.status,
            reservation_id: reservation_id
          });
  
          Swal.fire({
            title: 'Warning',
            text: 'Payment processing, but could not update reservation status',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
  
        
        Swal.fire({
          title: 'Payment Processing!',
          html: `
            <div class="payment-details">
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Phone:</strong> ${formData.phoneNumber}</p>
              <p><strong>Reservation ID:</strong> ${reservation_id}</p>
              <p><strong>Payment Method:</strong> ${formData.selectedPayment}</p>
              <p><strong>Initial Amount:</strong> ${initial_amount} JD</p>
              <p><strong>Total Amount:</strong> ${total_amount} JD</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/dashboard/reservations');
        });
      } else if(paymentData.paymentMethod === "cash") {
        const formDataToSend = new FormData();
        
        Object.keys(paymentData).forEach(key => {
          formDataToSend.append(key, paymentData[key]);
        });
  
        const paymentResponse = await axios.post(`http://localhost:5000/payments/createPayment`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
  
        try {
          const updateResponse = await axios.post(`${API_URL}/reservations/${reservation_id}`, {
            Status: 'Pending',
            payment_status: 'Pending'
          });
          console.log('Reservation Update Response:', updateResponse.data);
        } catch (updateError) {
          console.error('Error updating reservation status:', {
            message: updateError.message,
            response: updateError.response?.data,
            status: updateError.response?.status,
            reservation_id: reservation_id
          });
  
          Swal.fire({
            title: 'Warning',
            text: 'Payment processing, but could not update reservation status',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
  
        
        Swal.fire({
          title: 'Payment Processing!',
          html: `
            <div class="payment-details">
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Phone:</strong> ${formData.phoneNumber}</p>
              <p><strong>Reservation ID:</strong> ${reservation_id}</p>
              <p><strong>Payment Method:</strong> ${formData.selectedPayment}</p>
              <p><strong>Initial Amount:</strong> ${initial_amount} JD</p>
              <p><strong>Total Amount:</strong> ${total_amount} JD</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/dashboard/reservations');
        });
      }
    } catch (error) {
      console.error("Error confirming Payment:", error);
      
      Swal.fire({
        title: 'Payment Failed',
        text: error.response?.data?.error || 'An error occurred during payment',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
  
      setError(error.response?.data?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
};
  


  const PaymentOptions = () => (
    <div className="payment-options-container">
      <div 
        className={`payment-option ${formData.selectedPayment === "cash" ? "selected" : ""}`}
        onClick={() => handlePaymentTypeChange("cash")}
      >
        <i className="fas fa-money-bill"></i>
        <span>Cash Payment</span>
      </div>
      <div 
        className={`payment-option ${formData.selectedPayment === "Cliq" ? "selected" : ""}`}
        onClick={() => handlePaymentTypeChange("Cliq")}
      >
        <i className="fab fa-paypal"></i>
        <span>Pay with Cliq</span>
      </div>
    </div>
  );

  return (
    <div className="payment-page">
      <Container>
        <div className="payment-card">
          <div className="payment-header">
            <h2>Payment Details</h2>
            <div className="amount-details">
              <p>Initial Amount: JD {initial_amount}</p>
              <p>Total Amount: JD {total_amount}</p>
            </div>
          </div>

          <div className="payment-section">
            <h4>Select Payment Method</h4>
            <PaymentOptions />

            {formData.selectedPayment === "Cliq" && (
              <div className="cliq-instructions">
                <h5>Payment Instructions</h5>
                <p>Please send the payment to: 077-534-7666</p>
                <p>After payment, share the receipt via WhatsApp to confirm your reservation.</p>
              </div>
            )}

            <form onSubmit={handleConfirmPayment} className="payment-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
                {error && <div className="error-message">{error}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <PhoneInput
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || "+962" }))}
                  defaultCountry="JO"
                  international
                  className="phone-input"
                />
                {validatePhone && <div className="error-message">{validatePhone}</div>}
              </div>

              {formData.selectedPayment === "Cliq" && (
                <div className="form-group">
                  <label htmlFor="receipt">Payment Receipt (Optional)</label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="receipt"
                      className="form-control"
                      name="invoiceImg"
                      onChange={handleInputChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="payment-submit-btn"  
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="payment-submit-btn__content">
                    <span className="payment-submit-btn__spinner" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="payment-submit-btn__content">
                    <span>Confirm Payment</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Payment;