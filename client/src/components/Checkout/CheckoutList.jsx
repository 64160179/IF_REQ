import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import Swal from 'sweetalert2';

const CheckoutList = () => {
  const auth = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

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
    e.preventDefault(); // เรียก e.preventDefault() ก่อน

    const result = await Swal.fire({
      title: 'ยืนยันการเบิกวัสดุ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        await axios.post('http://localhost:5000/payouts', {
          userId: selectedUserId,
          date: currentDate,
          title: title,
        });
        setMsg('บันทึกข้อมูลสำเร็จ');
        await Swal.fire({
          title: 'สำเร็จ!',
          text: 'กรุณารอการตรวจสอบจากเจ้าหน้าที่',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
        navigate("/histories");
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
          await Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: error.response.data.msg,
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
        }
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
              <th className="has-text-centered" style={{ width: '100px', backgroundColor: "rgb(255,255,204)" }}>ลำดับ</th>
              <th className="has-text-centered" style={{ width: '150px', backgroundColor: "rgb(255,255,204)" }}>รหัสสินค้า</th>
              <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>รายการ</th>
              <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จำนวน</th>
              <th className="has-text-centered" style={{ width: '150px', backgroundColor: "rgb(255,255,204)" }}>หน่วยนับ</th>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
          <Link to={'/products'}
            className="button is-info"
            style={{ width: "150px" }}
          >
            <strong>ย้อนกลับหน้าวัสดุ</strong>
          </Link>

          <button type="submit" className="button is-success" style={{ width: "150px" }}>ยืนยันการเบิกวัสดุ</button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutList;