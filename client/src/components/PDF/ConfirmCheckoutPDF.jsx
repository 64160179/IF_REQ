import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ConfirmCheckoutPDF = () => {
  const { users } = useSelector((state) => state.auth);
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
  const [approvedByName, setApprovedByName] = useState(''); // State สำหรับเก็บชื่อผู้อนุมัติ
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
        setQuantityApprove(response.data.quantityApprove);
        setNotes(response.data.notes);

        // ดึงข้อมูล approvedByName
        const approvedBy = response.data.payoutDetails[0]?.approvedBy;
        if (approvedBy) {
          setApprovedByName(`${approvedBy.fname} ${approvedBy.lname}`);
        } else {
          setApprovedByName('N/A');
        }

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <div style={{ border: '2px solid black', padding: '15px' }}>
          <p>เลขที่ {docNumber}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
        <h1 className="title" style={{ marginBottom: '20px', fontSize: '30px' }}>ใบเบิกวัสดุ</h1>
        <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
      </div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p>วันที่ : 25 ตุลาคม 2567</p>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5rem', width: '100%' }}>
        <p style={{ margin: 0 }}>ข้าพเจ้า</p>
        <div
          style={{ width: '54%', height: '35px', marginLeft: '10px', border: 'none', borderBottom: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {user ? `${user.fname} ${user.lname}` : ''}
        </div>
        <p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '100%' }}>
        <p style={{ margin: 0 }}>เพื่อใช้ในงาน</p>
        <div
          style={{ width: '88%', height: '35px', marginLeft: '10px', border: 'none', borderBottom: '1px solid black', display: 'flex', alignItems: 'center' }}
        >
          {title}
        </div>
      </div>
      <br />
      <table className="table is-bordered " style={{ width: '100%' }}>
        <thead>
          <tr>
            <th rowSpan="2" className="has-text-centered" style={{ width: '70px', border: '1px solid black' }}>ลำดับ</th>
            <th rowSpan="2" className="has-text-centered" style={{ width: '300px', border: '1px solid black' }}>รายการ</th>
            <th rowSpan="2" className="has-text-centered" style={{ width: '70px', border: '1px solid black' }}>หน่วยนับ</th>
            <th colSpan="2" className="has-text-centered" style={{ border: '1px solid black' }}>จำนวน</th>
            <th rowSpan="2" className="has-text-centered" style={{ width: '150px', border: '1px solid black' }}>หมายเหตุ</th>
          </tr>
          <tr>
            <th className="has-text-centered" style={{ width: '150px', border: '1px solid black' }}>ขอเบิก</th>
            <th className="has-text-centered" style={{ width: '150px', border: '1px solid black' }}>เบิกได้ <br />(สำหรับเจ้าหน้าที่พัสดุ)</th>
          </tr>
        </thead>
        <tbody>
          {payoutDetails.map((detail, index) => (
            <tr key={detail.id}>
              <td className="has-text-centered" style={{ textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{index + 1}</td>
              <td style={{ border: '1px solid black' }}>{detail.product.name}</td>
              <td className="has-text-centered" style={{ textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{detail.product.countingUnit.name}</td>
              <td className="has-text-centered" style={{ textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{detail.quantity}</td>
              <td className="has-text-centered" style={{ border: '1px solid black' }}>{detail.quantity_approved}</td>
              <td className="has-text-centered" style={{ border: '1px solid black' }}>{detail.note}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="has-text-centered" style={{ border: '1px solid black' }}>
              <br />
              (ลงชื่อ) ....................................................... ผู้เบิก/ผู้รับ
              <br />
              <p>( {user ? `${user.fname} ${user.lname}` : ''} )</p>
              <p>{docDate}</p>
            </td>
            <td colSpan="3" className="has-text-centered" style={{ border: '1px solid black' }}>
              <br />
              (ลงชื่อ) .............................................................. ผู้จ่ายของ
              <br />
              ( {approvedByName} )
              <br />
              <p>{currentDate}</p>
            </td>
          </tr>
          <tr>
            <td colSpan="6" className="has-text-centered" style={{ border: '1px solid black' }}>
              <br />
              เจ้าหน้าที่พัสดุได้ตรวจและหักจำนวนแล้ว
              <br />
              <br />
              <div>(ลงชื่อ)
                <span style={{ borderBottom: '1px solid black', paddingLeft: '100px', paddingRight: '140px' }}>
                  {approvedByName}
                </span>
              </div>
              <p style={{ marginTop: '5px'}}>{currentDate}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ConfirmCheckoutPDF