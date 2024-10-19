import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckoutList = () => {
  const auth = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (auth.user) {
      setFullName(`${auth.user.fname} ${auth.user.lname}`);
      setSelectedUserId(auth.user.id);
    }
  }, [auth]);

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
      const response = await axios.get('http://localhost:5000/users'); // เปลี่ยน URL ตาม API ของคุณ
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    const selectedUser = users.find(user => user.id === selectedUserId);
    if (selectedUser) {
      setFullName(`${selectedUser.fname} ${selectedUser.lname}`);
      setSelectedUserId(selectedUserId);
    }
  };

  return (
    <div>
      <br />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
        <h1 className="title" style={{ marginBottom: '10px' }}>เบิกวัสดุ - อุปกรณ์</h1>
        <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
      </div>
      <br />
      <p style={{ marginLeft: '65rem' }}>วันที่ : {currentDate}</p>
      <br />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '99%' }}>
        <p style={{ margin: 0 }}>ข้าพเจ้า</p>
        {auth.user && auth.user.role === 'admin' ? (
          <select
            className="input"
            style={{ marginLeft: '1rem', width: '70%', height: '35px' }}
            value={selectedUserId}
            onChange={handleUserChange}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.fname} {user.lname}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            className="input"
            style={{ marginLeft: '1rem', width: '70%', height: '35px' }}
            value={fullName}
            readOnly
          />
        )}
        <p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '99%' }}>
        <p style={{ margin: 0 }}>เพื่อใช้ในงาน</p>
        <input type="text" className="input" style={{ marginLeft: '1rem', width: '92%', height: '35px' }} />
      </div>
      <br />
      <table className="table is-bordered  is-fullwidth " style={{ width: '99%' }}>
        <thead>
          <tr>
            <th className="has-text-centered" style={{ width: '70px' }}>ลำดับ</th>
            <th className="has-text-centered" style={{ width: '400px' }}>รายการ</th>
            <th className="has-text-centered" style={{ width: '150px' }}>จำนวน</th>
            <th className="has-text-centered" style={{ width: '150px' }}>หน่วยนับ</th>
          </tr>
        </thead>
        {/* ... */}
      </table>
    </div>
  );
};

export default CheckoutList;