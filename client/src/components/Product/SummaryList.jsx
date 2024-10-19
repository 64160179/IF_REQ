import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../../App.css'

const SummaryList = () => {
    const [products, setProducts] = useState([]);
    const [buyIns, setBuyIns] = useState([]);

    const [wareHouses, setWareHouses] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        const productsResponse = await axios.get(`http://localhost:5000/products?search=${search}`);
        const buyInsResponse = await axios.get('http://localhost:5000/buyins');

        const wareHousesResponse = await axios.get('http://localhost:5000/warehouses');
        setProducts(productsResponse.data);
        setBuyIns(buyInsResponse.data);

        setWareHouses(wareHousesResponse.data);
    }, [search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (e) => {
        setSearch(e.target.value); // อัปเดตค่าการค้นหาเมื่อผู้ใช้กรอกข้อมูล
    };

    const getBuyInData = (productId) => {
        const buyIn = buyIns.find(buyin => buyin.productId === productId);
        return buyIn ? { quantity: parseFloat(buyIn.quantity).toFixed(2), price: buyIn.price, summary: buyIn.summary } : { quantity: 0, price: 0, summary: 0 };
    };



    const getWareHouseData = (productId) => {
        const wareHouse = wareHouses.find(wareHouse => wareHouse.productId === productId);
        return wareHouse ? { quantity: wareHouse.quantity, price: wareHouse.price, summary: wareHouse.summary } : { quantity: 0, price: 0, summary: 0 };
    };

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(formattedDate);
    }, []);

    // คำนวณรายการวัสดุที่จะแสดงในหน้าปัจจุบัน
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(products.length / itemsPerPage);

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
                <h1 className="title">สรุปสินค้าคงเหลือ</h1>
                <span style={{ fontSize: '18px',fontWeight: 'bold', color: '#666',marginBottom: '20px' }}>วันที่: {currentDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '99%' }}>
                <Link to="/products/buyin" className="button is-link" style={{ marginRight: '10px' }}>
                    + ซื้อวัสดุเข้าคลัง
                </Link>
                <input
                    type="text"
                    className="input"
                    placeholder="ค้นหา รหัส และ ชื่อวัสดุ - อุปกรณ์"
                    style={{ flex: 1 }}
                    value={search}  // กำหนดค่า search ใน input
                    onChange={handleSearch} // ฟังก์ชันเรียกใช้งานเมื่อมีการกรอกข้อมูล
                />
            </div>
            <table className="table is-bordered  is-fullwidth " style={{ width: '99%' }}>
                <thead>
                    <tr>
                        <th className="has-text-centered" style={{ width: '70px', verticalAlign: 'middle', backgroundColor: "rgb(255,255,204)" }} rowSpan="2">ลำดับ</th>
                        <th className="has-text-centered" style={{ width: '400px', backgroundColor: "rgb(255,255,204)" }} colSpan="2" rowSpan="1">รายการ</th>
                        <th className="has-text-centered" style={{ color: 'blue', backgroundColor: "rgb(226,239,217)" }}>รับ</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จ่าย</th>
                        <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>คงเหลือ</th>
                    </tr>
                    <tr>
                        {/* รายการ */}
                        <th className="has-text-centered" style={{ width: '80px', backgroundColor: "rgb(255,255,204)" }}>รหัส</th>
                        <th className="has-text-centered" style={{ width: '600px', backgroundColor: "rgb(255,255,204)" }}>ชื่อวัสดุ - อุปกรณ์</th>
                        {/* รับ */}
                        <th className="has-text-centered" style={{ color: 'blue', backgroundColor: "rgb(226,239,217)" }}>จำนวน</th>
                        {/* <th className="has-text-centered" style={{ color: 'blue', backgroundColor: "rgb(226,239,217)" }}>ราคา</th>
                        <th className="has-text-centered" style={{ color: 'blue', backgroundColor: "rgb(226,239,217)" }}>รวม</th> */}
                        {/* จ่าย */}
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>จำนวน</th>
                        {/* <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>ราคา</th>
                        <th className="has-text-centered" style={{ backgroundColor: "rgb(252,225,214)" }}>รวม</th> */}
                        {/* คงเหลือ */}
                        <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>จำนวน</th>
                        {/* <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>ราคา</th>
                        <th className="has-text-centered" style={{ color: 'red', backgroundColor: "rgb(255,255,204)" }}>รวม</th> */}
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => {
                        const buyInData = getBuyInData(product.id);
                        // const payOutData = getPayOutData(product.id);
                        const wareHouseData = getWareHouseData(product.id);
                        return (
                            <tr key={product.uuid}>
                                <td className="has-text-centered">{product.id}</td>
                                <td className="has-text-centered">{product.code}</td>
                                <td style={{ textDecoration: "underline", textDecorationColor: "#0000CC" }}>
                                    <Link to={`/products/detail/${product.uuid}`} style={{ color: '#0000CC' }}>{product.name}</Link>
                                </td>
                                {/* รับ */}
                                <td className="has-text-centered" style={{ color: 'blue' }}>{buyInData.quantity}</td>
                                {/* <td className="has-text-centered" style={{ color: 'blue' }}>{buyInData.price}</td>
                                <td className="has-text-centered" style={{ color: 'blue' }}>{buyInData.summary}</td> */}
                                {/* จ่าย */}
                                <td className="has-text-centered"></td>
                                {/* <td className="has-text-centered">{payOutData.price}</td>
                                <td className="has-text-centered">{payOutData.summary}</td> */}
                                {/* คงเหลือ */}
                                <td className="has-text-centered" style={{ color: 'red' }}>{wareHouseData.quantity}</td>
                                {/* <td className="has-text-centered" style={{ color: 'red' }}>{wareHouseData.price}</td>
                                <td className="has-text-centered" style={{ color: 'red' }}>{wareHouseData.summary}</td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* start control page */}
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
                        <option value={20} className="has-text-centered">20</option>
                        <option value={100} className="has-text-centered">100</option>
                        <option value={150} className="has-text-centered">150</option>
                        <option value={200} className="has-text-centered">200</option>
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
            {/* end control page */}
        </div>
    )
}

export default SummaryList