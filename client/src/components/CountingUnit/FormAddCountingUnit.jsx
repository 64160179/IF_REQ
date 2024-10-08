import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddCountingUnit = () => {
  const [countingUnitName, setCountingUnitName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleCancel = () => {
    // รีเซ็ตสถานะของฟอร์ม
    setCountingUnitName('');
    // ย้อนกลับไปหน้า /users
    navigate('/countingunits');
  };

  const saveCountingUnit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/countingunits", {
        name: countingUnitName
      });
      navigate("/countingunits");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <br />
      <h1 className="title">เพิ่มหน่วยนับใหม่</h1>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveCountingUnit}>
              <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p>
              <div className="field">
                <label className="label">ชื่อหน่วยนับ</label>
                <div className="control">
                  <input className="input"
                    type="text"
                    value={countingUnitName}
                    onChange={(e) => setCountingUnitName(e.target.value)}
                    placeholder="กรุณากรอกชื่อหน่วยนับ"
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

export default FormAddCountingUnit