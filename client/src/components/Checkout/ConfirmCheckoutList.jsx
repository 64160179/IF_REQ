import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const ConfirmCheckoutList = () => {
    const auth = useSelector((state) => state.auth);
    const [docNumber, setDocNumber] = useState('');
    const [status, setStatus] = useState('');
    const [docDate, setDocDate] = useState('');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const [currentDate, setCurrentDate] = useState('');
    const [payoutDetails, setPayoutDetails] = useState([]);
    const [msg, setMsg] = useState('');
    const [quantityApprove, setQuantityApprove] = useState({});
    const [notes, setNotes] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const getPayOutById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/payoutdetails/${id}`);
                const formattedDate = new Date(response.data.doc_date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                setDocDate(formattedDate);
                setDocNumber(response.data.doc_number);
                setStatus(response.data.status);
                setTitle(response.data.title);
                setUser(response.data.user);
                setPayoutDetails(response.data.payoutDetails);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getPayOutById();
    }, [id]);

    useEffect(() => {
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const parts = today.toLocaleDateString('th-TH', options).split(' ');

        // สมมติว่า parts[0] คือวัน, parts[1] คือเดือน, parts[2] คือปี
        const formattedDate = `${parts[0]} / ${parts[1]} / ${parts[2]}`;
        setCurrentDate(formattedDate);
    }, []);

    const handleQuantityApproveChange = (id, value, max) => {
        const newValue = Math.min(Math.max(value, 0), max); // ตรวจสอบให้ค่าที่กรอกอยู่ในช่วง 0 ถึง max
        setQuantityApprove(prevState => ({
            ...prevState,
            [id]: newValue
        }));
    };

    const handleNoteChange = (id, value) => {
        setNotes(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const userId = auth.user.id; // Get userId from authentication context
    
            if (!userId) {
                throw new Error("User ID is not available.");
            }
    
            const response = await axios.patch('http://localhost:5000/payout/approve', {
                quantityApprove,
                notes,
                userId // Ensure userId is included here
            });
    
            if (response.status === 200) {
                setMsg('บันทึกข้อมูลสำเร็จ');
                navigate("/histories");
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg('เกิดข้อผิดพลาด');
            }
        }
    };
    
    const handleConfirmSubmit = () => {
        Swal.fire({
            title: 'ยืนยันการอนุมัติ',
            text: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, อนุมัติเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit();
            }
        });
    };

    return (
        <div>
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
                <h1 className="title" style={{ marginBottom: '10px' }}>เบิกวัสดุ - อุปกรณ์</h1>
                <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%', marginTop: '3rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex' }}>
                    <strong><p style={{ width: '100px', marginTop: '5px' }}>เลขที่เอกสาร :</p></strong>
                    <input
                        type="text"
                        className="input has-text-centered"
                        value={docNumber}
                        style={{ width: '80%', height: '35px' }}
                        readOnly
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <strong><p style={{ marginTop: '5px' }}>วันที่ : </p></strong>
                    <input
                        type="text"
                        className="input has-text-centered"
                        value={docDate}
                        style={{ width: '80%', height: '35px' }}
                        readOnly
                    />
                </div>
            </div>

            <br />
            {msg && <div style={{ color: 'red' }}>{msg}</div>}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
                <p style={{ margin: 0 }}>ข้าพเจ้า</p>
                <input
                    type="text"
                    className="input has-text-centered"
                    value={user ? `${user.fname} ${user.lname}` : ''} // ตรวจสอบว่ามี user ก่อน
                    style={{ width: '70%', height: '35px', marginLeft: '10px' }}
                    readOnly
                />
                <p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '99%' }}>
                <strong><p style={{ margin: 0, marginLeft: '10px' }}>เพื่อใช้ในงาน</p></strong>
                <input
                    type="text"
                    className="input"
                    value={title}
                    style={{ marginLeft: '1rem', width: '90%', height: '35px' }}
                    readOnly
                />
            </div>
            <br />
            <table className="table is-bordered  is-fullwidth " style={{ width: '99%' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '70px', backgroundColor: "rgb(255,255,204)" }}>ลำดับ</th>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '300px', backgroundColor: "rgb(255,255,204)" }}>รายการ</th>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '70px', backgroundColor: "rgb(255,255,204)" }}>หน่วยนับ</th>
                        <th colSpan="2" className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>จำนวน</th>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '150px', backgroundColor: "rgb(252,225,214)" }}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th className="has-text-centered" style={{ width: '150px', backgroundColor: "rgb(226,239,217)" }}>ขอเบิก</th>
                        <th className="has-text-centered" style={{ width: '150px', backgroundColor: "rgb(226,239,217)" }}>เบิกได้ <br />(สำหรับเจ้าหน้าที่พัสดุ)</th>
                    </tr>
                </thead>
                <tbody>
                    {payoutDetails.map((detail, index) => (
                        <tr key={detail.id}>
                            <td className="has-text-centered" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{index + 1}</td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{detail.product.name}</td>
                            <td className="has-text-centered" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{detail.product.countingUnit.name}</td>
                            <td className="has-text-centered" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{detail.quantity}</td>
                            <td className="has-text-centered">
                                <input
                                    type="number"
                                    className="input has-text-centered"
                                    style={{ width: '100%', height: '100%' }}
                                    placeholder="จำนวนที่เบิกได้"
                                    value={quantityApprove[detail.id] || ''}
                                    onChange={(e) => handleQuantityApproveChange(detail.id, e.target.value, detail.quantity)}
                                    min="0"
                                    max={detail.quantity}
                                />
                            </td>
                            <td className="has-text-centered">
                                <input
                                    type="text"
                                    className="input has-text-centered"
                                    style={{ width: '100%', height: '100%' }}
                                    placeholder="หมายเหตุ (ถ้ามี)"
                                    value={notes[detail.id] || ''}
                                    onChange={(e) => handleNoteChange(detail.id, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
                <Link to={'/histories'}
                    className="button is-info"
                    style={{ width: "150px" }}
                >
                    <strong>ย้อนกลับ</strong>
                </Link>
                <button className="button is-primary" onClick={handleConfirmSubmit}>อนุมัติการเบิกวัสดุ</button>
            </div>
        </div>
    );
};

export default ConfirmCheckoutList;