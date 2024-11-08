import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from "react-redux";
// import axios from 'axios';
import '../../src/App.css';

import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [products, setProducts] = useState([]);
  // const [warehouseItems, setWarehouseItems] = useState([]);
  // const [showOutOfStock, setShowOutOfStock] = useState(false);

  const images = [
    image1,
    image2,
    image3,
    image4,
    image5
  ];

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [nextSlide]); // เพิ่ม nextSlide ลงใน dependency array

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/products'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
  //       setProducts(response.data);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };

  //   const fetchWarehouseItems = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/warehouses'); // เปลี่ยน URL ให้ตรงกับ API ของคุณ
  //       setWarehouseItems(response.data);
  //     } catch (error) {
  //       console.error('Error fetching warehouse items:', error);
  //     }
  //   };

  //   fetchProducts();
  //   fetchWarehouseItems();
  // }, []);

  // const lowStockItems = warehouseItems
  //   .filter(item => item.quantity < 10 && item.quantity > 0)
  //   .map(item => ({
  //     ...item,
  //     product: products.find(product => product.id === item.productId)
  //   }));

  // const outOfStockItems = warehouseItems
  //   .filter(item => item.quantity === 0)
  //   .map(item => ({
  //     ...item,
  //     product: products.find(product => product.id === item.productId)
  //   }));

  return (
    <div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '99%' }}>
        <h1 className="title">หน้าหลัก</h1>
        <span className="subtitle" style={{ marginRight: "5px" }}>ยินดีต้อนรับคุณ <strong>{user && user.fname}</strong> <strong>{user && user.lname}</strong></span>
      </div>

      {/* start image slider */}
      <div className="slider">
        <button onClick={prevSlide} className="prev">
          &#10094;
        </button>
        <div className="slider-image" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`slide ${index}`} />
          ))}
        </div>
        <button onClick={nextSlide} className="next">
          &#10095;
        </button>
      </div>
      {/* end image slider */}

      {/* start dashboard */}
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ flex: '1', margin: '10px', padding: '20px', backgroundColor: '#00396b', textAlign: 'center', color: "#ffffff" }}>
          <h3>Dashboard 1</h3>
          <p>รายละเอียดของ Dashboard 1</p>
        </div>
        <div style={{ flex: '1', margin: '10px', padding: '20px', backgroundColor: '#00396b', textAlign: 'center', color: "#ffffff" }}>
          <h3>Dashboard 2</h3>
          <p>รายละเอียดของ Dashboard 2</p>
        </div>
        <div style={{ flex: '1', margin: '10px', padding: '20px', backgroundColor: '#00396b', textAlign: 'center', color: "#ffffff" }}>
          <h3>Dashboard 3</h3>
          <p>รายละเอียดของ Dashboard 3</p>
        </div>
        <div style={{ flex: '1', margin: '10px', padding: '20px', backgroundColor: '#00396b', textAlign: 'center', color: "#ffffff" }}>
          <h3>Dashboard 4</h3>
          <p>รายละเอียดของ Dashboard 4</p>
        </div>
      </div> */}
      {/* end dashboard */}

      {/* start dashboard */}
      {/* <div className="dashboard-container" >
        <div className="dashboard">
          <h3>Dashboard 1</h3>
          <h4>แจ้งเตือน: สินค้าที่มีจำนวนน้อยกว่า 10 ชิ้น</h4>
          <br />
          {lowStockItems.length > 0 && (
            <div className="low-stock-alert">
              
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>ชื่อสินค้า</th>
                    <th>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.product ? item.product.name : 'ข้อมูลสินค้าไม่สมบูรณ์'}</td>
                      <td>{item.product ? `${item.quantity} ` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div> */}
      {/* end dashboard */}

    </div>
  );
};

export default Welcome;