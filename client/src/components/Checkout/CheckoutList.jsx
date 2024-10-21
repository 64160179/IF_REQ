import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Select from "react-select";

const CheckoutList = () => {
  const auth = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);

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

    if (auth.user) {
      fetchUsers();
    }
  }, [auth.user]);

  useEffect(() => {
    if (auth.user && auth.user.role !== 'admin') {
      setSelectedUserId(auth.user.id);
    }
  }, [auth.user]);

  const handleUserChange = (selectedOption) => {
    setSelectedUserId(selectedOption ? selectedOption.value : '');
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

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.fname} ${user.lname}`,
  }));

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cart/${user.id}`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  return (
    <div>
      <form onSubmit={savePayOut}>
        <br />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
          <h1 className="title" style={{ marginBottom: '10px' }}>เบิกวัสดุ - อุปกรณ์</h1>
          <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
        </div>
        <br />
        <p style={{ marginLeft: '65rem' }}>วันที่ : {currentDate}</p>
        <br />
        <p className="has-text-centered" style={{ marginBottom: '10px' }}>
          <strong style={{ color: 'red' }}>{msg}</strong>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
          <p style={{ margin: 0 }}>ข้าพเจ้า</p>
          {auth.user && auth.user.role === 'admin' ? (
            <Select
              className="has-text-centered"
              value={userOptions.find(option => option.value === selectedUserId)}
              onChange={handleUserChange}
              options={userOptions}
              isClearable
              placeholder="-- เลือกผู้ใช้ --"
              styles={{
                container: (provided) => ({
                  ...provided,
                  marginLeft: '1rem',
                  width: '70%',
                }),
                control: (provided) => ({
                  ...provided,
                  height: '40px',
                }),
              }}
            />
          ) : (
            <select
              className="input has-text-centered"
              value={selectedUserId}
              onChange={handleUserChange}
              style={{ marginLeft: '1rem', width: '70%', height: '40px' }}
            >
              <option value={auth.user?.id || ''}>
                {auth.user ? `${auth.user.fname} ${auth.user.lname}` : 'ไม่มีข้อมูล'}
              </option>
            </select>
          )}
          <p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '99%' }}>
          <p style={{ margin: 0 }}>เพื่อใช้ในงาน</p>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setMsg(''); // ลบข้อความของ msg เมื่อมีการเปลี่ยนแปลงใน input ของ title
            }}
            style={{ marginLeft: '1rem', width: '92%', height: '35px' }}
          />
        </div>
        <br />
        <table className="table is-bordered  is-fullwidth " style={{ width: '99%' }}>
          <thead>
            <tr>
              <th className="has-text-centered" style={{ width: '100px' }}>ลำดับ</th>
              <th className="has-text-centered" style={{ width: '150px' }}>รหัสสินค้า</th>
              <th className="has-text-centered" >รายการ</th>
              <th className="has-text-centered" >จำนวน</th>
              <th className="has-text-centered" style={{ width: '150px' }}>หน่วยนับ</th>
            </tr>

          </thead>
          <tbody>
          {cartItems.map((item, index) => (
            <tr key={item.id}>
              <td className="has-text-centered">{index + 1}</td>
              <td className="has-text-centered">{item.product.code} </td>
              <td >{item.product.name}</td>
              <td className="has-text-centered">{item.quantity}</td>
              <td className="has-text-centered">{item.product.countingUnit ? item.product.countingUnit.name : 'No unit'}</td>
            </tr>
          ))}
          </tbody>

        </table>
        <button type="submit" className="button is-primary">บันทึก</button>
      </form>
    </div>
  );
};

export default CheckoutList;