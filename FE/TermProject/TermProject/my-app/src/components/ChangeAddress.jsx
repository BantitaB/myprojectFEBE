import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./ChangeAddress.css";  // นำเข้าฟายล์ CSS

const ChangeAddress = ({ show, handleClose, onSaveUser, currentData }) => {
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState({ display_name: "", phone: "", address: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ฟังก์ชันตั้งค่าเมื่อ modal เปิด
  useEffect(() => {
    if (currentData) {
      setNewName(currentData.display_name);
      setNewPhone(currentData.phone);
      setNewAddress(currentData.address);
    }
  }, [currentData]);

  const handleSave = async () => {

    let isValid = true;
    let newError = { display_name: "", phone: "", address: "" };

    // ตรวจสอบข้อมูลฟอร์ม
    if (!newName) {
      newError.display_name = "กรุณากรอกชื่อ";
      isValid = false;
    }
    if (!newPhone) {
      newError.phone = "กรุณากรอกเบอร์โทร";
      isValid = false;
    }else if (newPhone.length !== 12) {
      newError.phone = "เบอร์โทรต้องมีความยาว 10 ตัวอักษร (xxx-xxx-xxxx)";
      isValid = false;
    }

    if (!newAddress) {
      newError.address = "กรุณากรอกที่อยู่";
      isValid = false;
    }

    if (!isValid) {
      setError(newError);
      return;
    }

    const updatedData = {
      user_id: currentData.user_id, // เพิ่ม id เข้าไปในข้อมูลที่ส่ง
      display_name: newName,
      phone: newPhone,
      address: newAddress,
    };
    console.log("updatedData", updatedData);

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/updateuser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถบันทึกข้อมูลได้");
      }
      setError({});
      const result = await response.json();
      console.log("ข้อมูลที่บันทึกสำเร็จ:", result);
      onSaveUser(updatedData);

    } catch (error) {
      setError((prevError) => ({
        ...prevError,
        general: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setNewName(currentData.display_name || ""); // รีเซ็ตเป็นค่าเดิม
    setNewPhone(currentData.phone || ""); // รีเซ็ตเป็นค่าเดิม
    setNewAddress(currentData.address || ""); // รีเซ็ตเป็นค่าเดิม
    setError({ display_name: "", phone: "", address: "", general: "" }); // รีเซ็ตข้อผิดพลาด
  };

  const handleCloseWithReset = () => {
    resetState(); // เรียกฟังก์ชันรีเซ็ต
    handleClose(); // ปิด Modal
  };


  return (
    <Modal show={show} onHide={handleCloseWithReset}>
      <Modal.Header closeButton className="change-address-modal__header">

        <Modal.Title className="change-address-modal__title">เปลี่ยนที่อยู่</Modal.Title>

      </Modal.Header>
      <Modal.Body className="change-address-modal__body">
        {error.general && <div className="change-address-modal__error">{error.general}</div>}
        <Form>

          <Form.Group controlId="formName" className="change-address-modal__form-group">
            <Form.Label className="change-address-modal__form-label">ชื่อ</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              isInvalid={!!error.display_name}
              className="change-address-modal__form-control"
            />
            <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPhone" className="change-address-modal__form-group">
            <Form.Label className="change-address-modal__form-label">เบอร์โทร</Form.Label>
            <Form.Control
              type="text"
              value={newPhone}
              onChange={(e) => {
                // กรองเฉพาะตัวเลข
                let value = e.target.value.replace(/\D/g, "");

                // เพิ่มเครื่องหมาย "-" ทุก 3 ตัว
                if (value.length > 3 && value.length <= 6) {
                  value = value.substring(0, 3) + "-" + value.substring(3);
                } else if (value.length > 6) {
                  value = value.substring(0, 3) + "-" + value.substring(3, 6) + "-" + value.substring(6, 10);
                }
                // if (value.length === 12) {
                  setNewPhone(value);
                // }
              }}
              isInvalid={!!error.phone}
              maxLength={12} // ความยาวสูงสุด 12 ตัว รวม "-" 
              pattern="^\d{3}-\d{3}-\d{4}$" // ใช้เพื่อเช็คว่าต้องเป็นรูปแบบ xxx-xxx-xxxx
              className="change-address-modal__form-control"
            />
            <Form.Control.Feedback type="invalid">{error.phone}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formAddress" className="change-address-modal__form-group">
            <Form.Label className="change-address-modal__form-label">ที่อยู่</Form.Label>
            <Form.Control
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              isInvalid={!!error.address}
              className="change-address-modal__form-control"
            />
            <Form.Control.Feedback type="invalid">{error.address}</Form.Control.Feedback>
          </Form.Group>
          
        </Form>
      </Modal.Body>
      <Modal.Footer className="change-address-modal__footer">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting}
          className="change-address-modal__save-button">
          {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeAddress;
