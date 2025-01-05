import React, { useEffect, useState } from 'react';
import AddressCard from '../components/AddressCard';
import OrderDetailCard from '../components/OrderDetailCard';
import PaymentCard from '../components/PaymentCard';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ใช้ axios ในการดึงข้อมูลจาก API
import './Order.css'; // นำเข้า CSS

const Order = () => {
  const [address, setAddresses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        //ดึงข้อมูลสินค้า
        const savedCartItems = sessionStorage.getItem('cartItems');
        const parsedCartItems = JSON.parse(savedCartItems);
        setCartItems(parsedCartItems);

        // ดึงข้อมูลที่อยู่จาก API
        const userID = sessionStorage.getItem('userID');
        const response = await axios.get(`http://localhost:8080/api/v1/users/${userID}`);
        setAddresses(response.data); // อัปเดตข้อมูลที่อยู่ใน state
        console.log("data", response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [navigate]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const totalPrice = cartItems.reduce((total, item) => total + item.total_price, 0);

  return (
    <div id="root" className="page-container">
      <div className="order-container">
        <Navbar />
          <h2 className="order-header">ทำการสั่งซื้อ</h2>

          <AddressCard address={address} />

          <OrderDetailCard />

          <PaymentCard
            totalPrice={totalPrice}
            key="paymentCard"
          />
      </div>
        <Footer />
    </div>
  );
};

export default Order;
