import React from "react";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
import '../../App.css'

const ProductDetailList = () => {
  // const [name, setName] = useState([]);
  // const { id } = useParams();

  // useEffect(() => {
  //   const getProductToDetail = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/products/detail/${id}`);
  //       const product = response.data;
  //       setName(product.name);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   }  
  // }, [])

  return (
    <div>
      <br />
      <h1 className="title">รายงานวัสดุคงคลัง</h1>
      <div className="product-details">
        <p>ชื่อสินค้า : ปากกาแดง</p>
        <p>รหัส : A001</p>
        <p>หน่วยนับ : อัน</p>
        <p>สถานที่ : ห้องเรียน</p>
      </div>
      <div>
        <br />
        <table className="table is-bordered  is-fullwidth " style={{ width: '99%' }}>
          <thead>
            <tr>
              <th className="has-text-centered" style={{ width: '150px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">ว.ด.ป.</th>
              <th className="has-text-centered" style={{ width: '400px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">เลขที่เอกสาร</th>
              <th className="has-text-centered" style={{ width: '400px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">รายการ</th>
              <th colSpan="3" className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>รับ</th>
              <th colSpan="3" className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จ่าย</th>
              <th colSpan="3" className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>คงเหลือ</th>
            </tr>
            <tr>
              {/* รับ */}
              <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>จำนวน</th>
              <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>ราคา</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(226,239,217)" }}>รวม</th>
              {/* จ่าย */}
              <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จำนวน</th>
              <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>ราคา</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(252,225,214)" }}>รวม</th>
              {/* คงเหลือ */}
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>จำนวน</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>ราคา</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>รวม</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td className="has-text-centered">24/09/25</td>
              <td className="has-text-centered">WE2024 5200012283</td>
              <td >ใส่ตู้สำนักงาน</td>
              {/* รับ */}
              <td className="has-text-centered" >10.00</td>
              <td className="has-text-centered" >126.10</td>
              <td className="has-text-centered" style={{ color: 'red' }}>1261.00</td>
              {/* จ่าย */}
              <td className="has-text-centered">2.00</td>
              <td className="has-text-centered">105.08</td>
              <td className="has-text-centered" style={{ color: 'red' }}>210.17</td>
              {/* คงเหลือ */}
              <td className="has-text-centered" style={{ color: 'red' }}>12.00</td>
              <td className="has-text-centered" style={{ color: 'red' }}>105.08</td>
              <td className="has-text-centered" style={{ color: 'red' }}>1155.92</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductDetailList

