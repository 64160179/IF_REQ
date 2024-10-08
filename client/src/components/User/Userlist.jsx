import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import '../../../src/App.css'

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState(''); // เก็บค่าการค้นหา
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const getUsers = useCallback(async () => {
        const response = await axios.get(`http://localhost:5000/users?search=${search}`);
        setUsers(response.data);
    }, [search]);

    useEffect(() => {
        getUsers();
    }, [search, getUsers]); // โหลดข้อมูลใหม่เมื่อค่า search หรือ getUsers เปลี่ยนแปลง

    const handleSearch = (e) => {
        setSearch(e.target.value); // อัปเดตค่าการค้นหาเมื่อผู้ใช้กรอกข้อมูล
    };

    const deleteUser = async (userId, userName) => {
        const result = await Swal.fire({
            title: 'คุณยืนยันที่จะลบ ?',
            text: `คุณยืนยันที่จะลบ ${userName} หรือไม่ ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย !',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            await axios.delete(`http://localhost:5000/users/${userId}`);
            getUsers();
            Swal.fire(
                'ลบแล้ว !',
                `${userName} ถูกลบเรียบร้อยแล้ว.`,
                'success'
            );
        }
    };

    // คำนวณรายการวัสดุที่จะแสดงในหน้าปัจจุบัน
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(users.length / itemsPerPage);

    // ฟังก์ชั่นเปลี่ยนหน้า
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '99%' }}>
                <h1 className="title">รายชื่อผู้ใช้</h1>
                <span className="subtitle">จำนวนผู้ใช้ทั้งหมด:<strong> {users.length} </strong>คน</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '99%' }}>
                <Link to="/users/add" className="button is-link">
                    + เพิ่มผู้ใช้ใหม่
                </Link>

                {/* search bar */}
                <input
                    type="text"
                    className="input"
                    placeholder="ค้นหา ชื่อจริง - นามสกุล"
                    style={{ flex: 1, marginLeft: '10px' }}
                    value={search}  // กำหนดค่า search ใน input
                    onChange={handleSearch} // ฟังก์ชันเรียกใช้งานเมื่อมีการกรอกข้อมูล
                />
            </div>
            <table className='table is-bordered' style={{ width: '99%' }}>
                <thead>
                    <tr>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(255,255,204)", width: '50px' }}>ลำดับ</th>
                        <th style={{ backgroundColor: "rgb(255,255,204)", width: '300px' }}>ชื่อจริง</th>
                        <th style={{ backgroundColor: "rgb(255,255,204)", width: '300px' }}>นามสกุล</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)", width: '250px' }}>อีเมล</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)", width: '150px' }}>สิทธิ์การใช้งาน</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)", width: '180px' }}>อื่น ๆ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={indexOfFirstItem + user.uuid}>
                            <td className="has-text-centered">{user.id}</td>
                            <td>{user.fname}</td>
                            <td>{user.lname}</td>
                            <td>{user.email}</td>
                            <td className="has-text-centered">{user.role}</td>
                            <td className="has-text-centered actions">
                                <Link
                                    to={`/users/edit/${user.uuid}`}
                                    className="button is-small is-warning"
                                    style={{ width: '60px', }}
                                >
                                    <strong>แก้ไข</strong>
                                </Link>
                                <button
                                    onClick={() => deleteUser(user.uuid, user.fname)}
                                    className="button is-small is-danger"
                                    style={{ width: '60px', marginLeft: '10px' }}
                                >
                                    <strong>ลบ</strong>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* เมนูเลื่อนหน้า */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label htmlFor="itemsPerPage">แสดง : </label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเมื่อเปลี่ยนจำนวนการแสดงผล
                        }}
                        style={{ padding: '5px', margin: '2px', border: '1px solid #ccc', borderRadius: '5px', width: '80px' }}
                    >
                        <option value={10} className="has-text-centered">10</option>
                        <option value={15} className="has-text-centered">15</option>
                        <option value={20} className="has-text-centered">20</option>
                        <option value={25} className="has-text-centered">25</option>
                        <option value={30} className="has-text-centered">30</option>
                    </select>
                </div>

                <div style={{ fontWeight: 'bold' }}>
                    หน้า {currentPage} จาก {totalPages}
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                        className="button is-warning"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={{ width: '100px', padding: '5px', margin: '2px', border: '1px solid #ccc', borderRadius: '5px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        ก่อนหน้า
                    </button>
                    <button
                        className="button is-success"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{ width: '100px', padding: '5px', margin: '2px', border: '1px solid #ccc', borderRadius: '5px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserList;
