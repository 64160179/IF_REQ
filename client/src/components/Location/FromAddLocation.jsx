import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FromAddLocation = () => {
  const [locationName, setLocationName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleCancel = () => {
    // รีเซ็ตสถานะของฟอร์ม
    setLocationName('');
    // ย้อนกลับไปหน้า /users
    navigate('/locations');
  };

  const saveLocation = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/locations", {
        name: locationName
      });
      navigate("/locations");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  }

  return (
<div>
      <br />
      <h1 className="title">เพิ่มสถานที่จัดเก็บใหม่</h1>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveLocation}>
              <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p>
              <div className="field">
                <label className="label">ตำแหน่งสถานที่จัดเก็บ</label>
                <div className="control">
                  <input className="input"
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="กรุณากรอกสถานที่จัดเก็บ"
                    required
                  />
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button type="submit" className="button is-success" style={{ width: "120px" }}>
                    บันทึกข้อมูล
                  </button>
                </div>
                <div className="control">
                  <button type="button" onClick={handleCancel} className="button is-danger" style={{ width: "120px" }}>
                    ยกเลิก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FromAddLocation