import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

const ConfirmCheckoutList = () => {
    return (
        <div>
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '20px' }}>
                <h1 className="title" style={{ marginBottom: '10px' }}>เบิกวัสดุ - อุปกรณ์</h1>
                <h1 className="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</h1>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', width: '99%' }}>
                <strong><p>เลขที่เอกสาร :</p></strong>
                <strong><p >วันที่ : 19 ตุลาคม 2567</p></strong>
            </div>

            <br />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4rem', width: '100%' }}>
                <strong><p style={{ margin: 0 }}>ข้าพเจ้า</p></strong>

                <strong><p style={{ marginLeft: '1rem' }}>ขอเบิกพัสดุตามรายการข้างล่างนี้</p></strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', width: '99%' }}>
                <strong><p style={{ margin: 0 }}>เพื่อใช้ในงาน</p></strong>
                <input type="text" className="input" style={{ marginLeft: '1rem', width: '90%', height: '35px' }} />
            </div>
            <br />
            <table className="table is-bordered  is-fullwidth " style={{ width: '99%' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '70px' }}>ลำดับ</th>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '300px' }}>รายการ</th>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '70px' }}>หน่วยนับ</th>
                        <th colSpan="2" className="has-text-centered" >จำนวน</th>
                        <th rowSpan="2" className="has-text-centered" style={{ width: '150px' }}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th className="has-text-centered" style={{ width: '150px' }}>ขอเบิก</th>
                        <th className="has-text-centered" style={{ width: '150px' }}>เบิกได้ <br />(สำหรับเจ้าหน้าที่พัสดุ)</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td className="has-text-centered"></td>
                        <td> </td>
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
                            (  นายบวรทัต คุณสารวนิช  )
                            <br />
                            19 / ตุลาคม / 2567
                        </td>
                        <td colSpan="3" className="has-text-centered">
                            <br />
                            (ลงชื่อ) .............................................................. ผู้จ่ายของ
                            <br />
                            (  นายบวรทัต คุณสารวนิช  )
                            <br />
                            19 / ตุลาคม / 2567
                        </td>
                    </tr>

                </tbody>

            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
                <Link to={'/products'}
                    className="button is-danger"
                    style={{ width: "150px" }}
                >
                    <strong>ย้อนกลับหน้าวัสดุ</strong>
                </Link>
                <button className="button is-success" style={{ width: "150px" }}>ยืนยันการเบิกวัสดุ</button>
            </div>
        </div>
    );
};

export default ConfirmCheckoutList