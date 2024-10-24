import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const ConfirmCheckoutList = () => {
    const [docNumber, setDocNumber] = useState('');
    const [status, setStatus] = useState('');
    const [docDate, setDocDate] = useState('');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const [currentDate, setCurrentDate] = useState('');
    const [payoutDetails, setPayoutDetails] = useState([]);
    const [msg, setMsg] = useState('');
    const [quantityApprove, setQuantityApprove] = useState({}); // State สำหรับเก็บค่าของ quantity_approve
    const [notes, setNotes] = useState({}); // State สำหรับเก็บค่าของ note

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
                setPayoutDetails(response.data.payoutDetails || []);
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

        const formattedDate = `${parts[0]} / ${parts[1]} / ${parts[2]}`;
        setCurrentDate(formattedDate);
    }, []);

    const handleQuantityApproveChange = (id, value, max) => {
        const newValue = Math.min(Math.max(value, 1), max); // ตรวจสอบให้ค่าที่กรอกอยู่ในช่วง 1 ถึง max
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
            await axios.patch('http://localhost:5000/payout/approve', {
                quantityApprove,
                notes
            });
            setMsg('บันทึกข้อมูลสำเร็จ');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleConfirmSubmit = () => {
        Swal.fire({
            title: 'ยืนยันการบันทึก?',
            text: "คุณต้องการบันทึกข้อมูลนี้หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, บันทึกเลย!',
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
                        className="input"
                        value={docNumber}
                        style={{ width: '15%', height: '35px' }}
                        readOnly
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <strong><p style={{ width: '100px', marginTop: '5px' }}>วันที่ :</p></strong>
                    <input
                        type="text"
                        className="input"
                        value={docDate}
                        style={{ width: '15%', height: '35px' }}
                        readOnly
                    />
                </div>
            </div>
            <br />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
                <p style={{ margin: 0 }}>ข้าพเจ้า</p>
                <input
                    type="text"
                    className="input has-text-centered"
                    value={user ? `${user.fname} ${user.lname}` : ''}
                    style={{ width: '70%', height: '35px', marginLeft: '10px' }}
                    readOnly
                />
                <p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p>
            </div>
            <br />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
                <p style={{ margin: 0 }}>หัวข้อ: {title}</p>
            </div>
            <br />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
                <p style={{ margin: 0 }}>สถานะ: {status}</p>
            </div>
            <br />
            <table className="table is-bordered is-fullwidth">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อวัสดุ</th>
                        <th>หน่วยนับ</th>
                        <th>จำนวนที่ขอเบิก</th>
                        <th>จำนวนที่อนุมัติ</th>
                        <th>หมายเหตุ</th>
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
                                    min="1"
                                    max={detail.quantity}
                                    required
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
            <button className="button is-primary" onClick={handleConfirmSubmit}>บันทึก</button>
            {msg && <div style={{ color: 'red' }}>{msg}</div>}
        </div>
    );
};

export default ConfirmCheckoutList;