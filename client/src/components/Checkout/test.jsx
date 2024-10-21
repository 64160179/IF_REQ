import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutList = () => {
  const auth = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(auth.user ? auth.user.id : '');
  const [currentDate, setCurrentDate] = useState('');
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (auth.user.role === 'admin') {
          const response = await axios.get('http://localhost:5000/users');
          setUsers(response.data);
        }
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    fetchUsers();
  }, [auth.user]);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
    setMsg(''); 
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setMsg(''); 
  };

  const savePayOut = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/payouts', {
        userId: selectedUserId,
        date: currentDate,
        title: title,
      });
      setMsg('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <form onSubmit={savePayOut}>
      <div>
        <br />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
          <h1 className="title" style={{ marginBottom: '10px' }}>เบิกวัสดุ - อุปกรณ์</h1>
          <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
        </div>
        <br />
        <p style={{ marginLeft: '65rem' }}>วันที่ : {currentDate}</p>
        <br />
        <p className="has-text-centered" style={{ marginBottom: '10px' }}><strong style={{ color: 'red' }}>{msg}</strong></p>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
          <p style={{ margin: 0 }}>ข้าพเจ้า</p>
          {auth.user && auth.user.role === 'admin' ? (
            <select
              className="input has-text-centered"
              value={selectedUserId}
              onChange={handleUserChange}
              style={{ marginLeft: '1rem', width: '70%', height: '40px' }}
            >
              <option value="">-- เลือกผู้ใช้ --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fname} {user.lname}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="input has-text-centered"
              value={selectedUserId}
              onChange={handleUserChange}
              style={{ marginLeft: '1rem', width: '70%', height: '40px' }}
            >
              <option value="">-- เลือกผู้ใช้ --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fname} {user.lname}
                </option>
              ))}
            </select>
          )}
          <p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '99%' }}>
          <p style={{ margin: 0 }}>เพื่อใช้ในงาน</p>
          <input
            type="text"
            className="input"
            style={{ marginLeft: '1rem', width: '92%', height: '35px' }}
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <br />
        <button type="submit" className="button is-primary">บันทึก</button>
      </div>
    </form>
  );
};

export default CheckoutList;