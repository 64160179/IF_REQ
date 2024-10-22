import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';

const ConfirmCheckoutList = () => {
    const auth = useSelector((state) => state.auth);
    const [docNumber, setDocNumber] = useState('');
    const [status, setStatus] = useState('');
    const [docDate, setDocDate] = useState('');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState({});
    const { id } = useParams();
    const [currentDate, setCurrentDate] = useState('');
    const [payoutDetails, setPayoutDetails] = useState([]);
    const [countingUnits, setCountingUnits] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [productName, setProductName] = useState([]);
    
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const getPayOutById = async () => {
            try {
                const [payoutResponse, detailsResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/payouts/${id}`),
                    axios.get(`http://localhost:5000/payoutdetails/${id}`)
                ]);
                const formattedDate = new Date(response.data.doc_date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                setDocDate(formattedDate);
                setDocNumber(payoutResponse.data.doc_number);
                setStatus(payoutResponse.data.status);
                setTitle(payoutResponse.data.title);
                setUser(payoutResponse.data.user);

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

    return (
        <div>
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
                <h1 className="title" style={{ marginBottom: '10px' }}>เบิกวัสดุ - อุปกรณ์</h1>
                <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
            </div>

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
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
                <strong><p style={{ margin: 0 }}>ข้าพเจ้า</p></strong>
                <input
                    type="text"
                    className="input has-text-centered"
                    value={`${user.fname} ${user.lname}`}
                    style={{ width: '70%', height: '35px', marginLeft: '10px' }}
                    readOnly
                />
                <strong><p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p></strong>
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

                    <tr >
                        <td className="has-text-centered"></td>
                        <td></td>
                        <td className="has-text-centered"></td>
                        <td className="has-text-centered"></td>
                        <td className="has-text-centered"></td>
                        <td className="has-text-centered"></td>
                    </tr>

                    <tr>
                        <td colSpan="3" className="has-text-centered">
                            <br />
                            (ลงชื่อ) .............................................................. ผู้เบิก/ผู้รับ
                            <br />
                            <p>( {user.fname} {user.lname} )</p>
                            <p>{docDate}</p>
                        </td>
                        <td colSpan="3" className="has-text-centered">
                            <br />
                            (ลงชื่อ) .............................................................. ผู้จ่ายของ
                            <br />
                            ( {auth.user?.fname} {auth.user?.lname} )
                            <br />
                            <p> {currentDate}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="has-text-centered">
                            <br />
                            เจ้าหน้าที่พัสดุได้ตรวจและหักจำนวนแล้ว
                            <br />
                            <br />
                            <p>(ลงชื่อ) ............... <span>{auth.user?.fname} {auth.user?.lname} </span> .....................</p>
                            <p> {currentDate}</p>
                        </td>
                    </tr>

                </tbody>

            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
                <Link to={'/products'}
                    className="button is-info"
                    style={{ width: "150px" }}
                >
                    <strong>ย้อนกลับหน้าวัสดุ</strong>
                </Link>
                <button className="button is-danger" style={{ width: "150px" }}>ยกเลิกการเบิก</button>
                <button className="button is-success" style={{ width: "150px" }}>ยืนยันการเบิกวัสดุ</button>
            </div>
        </div>
    );
};

export default ConfirmCheckoutList