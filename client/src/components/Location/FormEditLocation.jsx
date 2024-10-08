import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditLacation = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getLocationById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/locations/${id}`);
        setName(response.data.name);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getLocationById();
  }, [id]);

  const handleCancel = () => {
    // รีเซ็ตสถานะของฟอร์ม
    setName('');
    // ย้อนกลับไปหน้า /users
    navigate('/locations');
  };

  const updateLocation = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/locations/${id}`, {
        name: name
      });
      navigate("/locations");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <br />
      <h1 className="title">แก้ไขสถานที่จัดเก็บ</h1>

      <div className="card is-shadowless" style={{ width: '99%' }}>
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateLocation}>
              <p className="has-text-centered"><strong style={{ color: 'red' }}>{msg}</strong></p>
              <div className="field">
                <label className="label">ตำแหน่งสถานที่จัดเก็บ</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="กรุณากรอกชื่อหน่วยนับ"
                  />
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button type="submit" className="button is-success" >
                    ยืนยันการแก้ไข
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

export default FormEditLacation