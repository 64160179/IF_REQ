import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../../App.css'

const ProductDetailList = () => {
  const [name, setName] = useState([]);
  const [product, setProduct] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getProductToDetailById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/detail/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }
    getProductToDetailById();
  }, [id]);

  return (
    <div>
      <br />
      <h1 className="title">รายงานวัสดุคงคลัง</h1>
      <div style={{ display: 'flex', alignItems: 'center', width: '99%' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1', marginRight: '10px' }}>
          <strong><p style={{ width: '120px' }}>ชื่อสินค้า : </p></strong>
          <input
            type="text"
            className="input has-text-centered"
            style={{ width: '100%', height: '35px', marginLeft: '10px' }}
            value={product.name}
            readOnly
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1', marginLeft: '10px' }}>
          <strong><p style={{ width: '120px' }}>รหัสสินค้า : </p></strong>
          <input
            type="text"
            className="input has-text-centered"
            style={{ width: '100%', height: '35px', marginLeft: '10px' }}
            value={product.code}
            readOnly
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '99%', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1', marginRight: '10px' }}>
          <strong><p style={{ width: '120px' }}>สถานที่จัดเก็บ : </p></strong>
          <input
            type="text"
            className="input has-text-centered"
            style={{ width: '100%', height: '35px', marginLeft: '10px' }}
            value={product.location ? product.location.name : ''}
            readOnly
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1', marginLeft: '10px' }}>
          <strong><p style={{ width: '120px' }}>หน่วยนับ : </p></strong>
          <input
            type="text"
            className="input has-text-centered"
            style={{ width: '100%', height: '35px', marginLeft: '10px' }}
            value={product.countingUnit ? product.countingUnit.name : ''}
            readOnly
          />
        </div>
      </div>
      <div>
        <table className="table is-bordered  is-fullwidth " style={{ width: '99%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th className="has-text-centered" style={{ width: '120px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">ว.ด.ป.</th>
              <th className="has-text-centered" style={{ width: '250px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">เลขที่เอกสาร</th>
              <th className="has-text-centered" style={{ width: '400px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">รายการ</th>
              <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>รับ</th>
              <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จ่าย</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>คงเหลือ</th>
            </tr>
            <tr>
              {/* รับ */}
              <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>จำนวน</th>
              {/* <th className="has-text-centered" style={{ backgroundColor: "rgb(226,239,217)" }}>ราคา</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(226,239,217)" }}>รวม</th> */}
              {/* จ่าย */}
              <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จำนวน</th>
              {/* <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>ราคา</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(252,225,214)" }}>รวม</th> */}
              {/* คงเหลือ */}
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>จำนวน</th>
              {/* <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>ราคา</th>
              <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>รวม</th> */}
            </tr>
          </thead>
          <tbody>
            <tr >
              <td className="has-text-centered">24/09/25</td>
              <td className="has-text-centered">WE2024 5200012233</td>
              <td >ใส่ตู้สำนักงาน</td>
              {/* รับ */}
              <td className="has-text-centered" >10.00</td>
              {/* <td className="has-text-centered" >126.10</td>
              <td className="has-text-centered" style={{ color: 'red' }}>1261.00</td> */}
              {/* จ่าย */}
              <td className="has-text-centered">2.00</td>
              {/* <td className="has-text-centered">105.08</td>
              <td className="has-text-centered" style={{ color: 'red' }}>210.17</td> */}
              {/* คงเหลือ */}
              <td className="has-text-centered" style={{ color: 'red' }}>12.00</td>
              {/* <td className="has-text-centered" style={{ color: 'red' }}>105.08</td>
              <td className="has-text-centered" style={{ color: 'red' }}>1155.92</td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductDetailList

