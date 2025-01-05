import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import ChangeAddress from "./ChangeAddress"; // ใช้ ChangeAddress เป็น modal สำหรับเปลี่ยนที่อยู่
import './AddressCard.css'; // นำเข้าไฟล์ CSS

const AddressCard = ({ address }) => {
  const [showModal, setShowModal] = useState(false); // สถานะการแสดง modal
  const [currentData, setCurrentData] = useState(address); // เก็บข้อมูลทั้งหมดของผู้ใช้

  // ฟังก์ชันเปิด modal
  const handleShow = () => {
    setShowModal(true); // ควรทำให้ modal เปิด
  };

  // ฟังก์ชันปิด modal
  const handleClose = () => setShowModal(false);

  // ฟังก์ชันเมื่อบันทึกข้อมูลใหม่
  const handleSaveAddress = (updatedData) => {
    console.log("ข้อมูลใหม่ที่ถูกบันทึก:", updatedData);
    setCurrentData(updatedData); // อัพเดตข้อมูลใน state
    setShowModal(false); // ปิด modal เมื่อบันทึกข้อมูลเรียบร้อยแล้ว
  };

  return (
    <div className="address-card-container">
      <Card className="address-card">
        
        {/* หัวข้อ "ที่อยู่ของฉัน" */}
        <Card.Title>ที่อยู่ของฉัน</Card.Title>
 
        {/* เส้นกั้นระหว่างหัวข้อและเนื้อหา */}
        <hr className="address-card-hr" />

        {/* ข้อมูลชื่อ, เบอร์โทร, ที่อยู่ และปุ่ม */}
        <div className="address-info-container">
          {/* ส่วนชื่อและเบอร์โทร */}
          <div className="address-info-left">
            <div>{currentData.display_name || "ชื่อผู้ใช้"}</div>
            <div>{currentData.phone || "XXX-XXX-XXXX"}</div>
          </div>

          {/* ที่อยู่ */}
          <div className="address-info-address">
            {currentData.address || "เพิ่มที่อยู่"}
          </div>

          {/* ปุ่มแก้ไขที่อยู่ */}
          <div className="address-info-button">
            <Button variant="primary" onClick={handleShow}>เปลี่ยน</Button>
          </div>
        </div>
      </Card>

      {/* แสดง ChangeAddress modal เมื่อคลิกปุ่ม "เปลี่ยน" */}
      <ChangeAddress
        show={showModal}
        handleClose={handleClose}
        onSaveUser={handleSaveAddress}
        currentData={currentData} // ส่งข้อมูลทั้งหมดไปยัง modal
      />
    </div>
  );
};

export default AddressCard;
