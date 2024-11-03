import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const FormEditCountingUnit = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getCountingUnitById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/countingUnits/${id}`);
        setName(response.data.name);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getCountingUnitById();
  }, [id]);

  const handleCancel = () => {
    // รีเซ็ตสถานะของฟอร์ม
    setName('');
    // ย้อนกลับไปหน้า /users
    navigate('/countingunits');
  };

  const updateCountingUnit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/countingUnits/${id}`, {
        name: name
      });
      navigate("/countingunits");
    } catch (error) {
      if (error.response) {
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.response.data.msg,
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };

  return (
    <div>
      <br />
      <h1 className="title">แก้ไขชื่อหน่วยนับ</h1>

      <div className="card is-shadowless" style={{ width: '99%' }}>
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateCountingUnit}>
              <p className="has-text-centered"><strong style={{ color: 'red' }}>{msg}</strong></p>
              <div className="field">
                <label className="label">ชื่อหน่วยนับ</label>
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

export default FormEditCountingUnit