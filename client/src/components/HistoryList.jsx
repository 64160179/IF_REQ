import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HistoryList = () => {
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลผู้ใช้
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [msg, setMsg] = useState('');
    const { user } = useSelector((state) => state.auth);
    const [search, setSearch] = useState('');

    // คำนวณรายการวัสดุที่จะแสดงในหน้าปัจจุบัน
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);

    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(history.length / itemsPerPage);

    // ฟังก์ชั่นเปลี่ยนหน้า
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const fetchHistory = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/payouts?search=${search}`);
            const formattedHistory = response.data.map(item => {
                const formattedDate = new Date(item.doc_date).toLocaleString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
                return { ...item, doc_date: formattedDate };
            });
            setHistory(formattedHistory);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg('Error fetching history');
            }
            console.error('Error fetching history:', error);
        }
    }, [search]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchUsers();
    }, [fetchHistory]);


    const getUserName = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.fname} ${user.lname}` : 'Unknown User';
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return { color: 'blue', text: 'รอการอนุมัติ' };
            case 'approved':
                return { color: 'green', text: 'อนุมัติแล้ว' };
            case 'rejected':
                return { color: 'red', text: 'ไม่อนุมัติ' };
            default:
                return { color: 'black', text: status };
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value); // อัปเดตค่าการค้นหาเมื่อผู้ใช้กรอกข้อมูล
    };



    return (
        <div>
            <br />
            <h1 className="title">ประวัติการขอเบิก</h1>
            <p className="has-text-centered" style={{ marginBottom: '10px' }}>
                <strong style={{ color: 'red' }}>{msg}</strong>
            </p>
            {/* search Admin */}
            {user && user.role === "admin" && (
                <input
                    type="text"
                    className="input"
                    placeholder="ค้นหาเลขที่ใบเบิก, หัวเรื่อง, ผู้ขอเบิก"
                    style={{ flex: 1, marginBottom: '10px' }}
                    value={search}  // กำหนดค่า search ใน input
                    onChange={handleSearch} // ฟังก์ชันเรียกใช้งานเมื่อมีการกรอกข้อมูล
                />
            )}

            {/* search User */}
            {user && user.role === "user" && (
                <input
                    type="text"
                    className="input"
                    placeholder="ค้นหาเลขที่ใบเบิก, หัวเรื่อง"
                    style={{ flex: 1, marginBottom: '10px' }}
                    value={search}  // กำหนดค่า search ใน input
                    onChange={handleSearch} // ฟังก์ชันเรียกใช้งานเมื่อมีการกรอกข้อมูล
                />
            )}
            <table className='table is-bordered' style={{ width: '99%' }}>
                <thead>
                    <tr>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(255,255,204)", width: '50px' }}>No</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(255,255,204)", width: '120px' }}>เลขที่ใบเบิก</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(255,255,204)", width: '350px' }}>หัวเรื่อง</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)", width: '250px' }}>เมื่อวันที่</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>ผู้ขอเบิก</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>สถานะ</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(255,255,204)" }}>ใบเบิกวัสดุ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHistory.map((history) => {
                        const statusStyle = getStatusStyle(history.status);
                        return (
                            <tr key={history.id}>
                                <td className="has-text-centered">{history.id}</td>
                                {user && user.role === "admin" ? (
                                    <td className="has-text-centered" style={{ textDecoration: "underline", textDecorationColor: "#0000CC" }}>
                                        <Link to={`/checkout/confirm/${history.uuid}`} style={{ color: '#0000CC' }}>{history.doc_number}</Link>
                                    </td>
                                ) : (
                                    <td className="has-text-centered">{history.doc_number}</td>
                                )}
                                <td>{history.title}</td>
                                <td className="has-text-centered">{history.doc_date}</td>
                                <td>{getUserName(history.userId)}</td>
                                <td className="has-text-centered" style={{ color: statusStyle.color }}>{statusStyle.text}</td>
                                <td>pdf</td>
                            </tr>
                        );
                    })}
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

export default HistoryList;