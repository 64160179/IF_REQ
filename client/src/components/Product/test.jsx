import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import '../../../src/App.css'

// กำหนด AppElement
Modal.setAppElement('#root');

const ProductList = () => {
    const { user } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [wareHouses, setWareHouses] = useState([]);
    const [countingUnits, setCountingUnits] = useState([]);
    const [storageLocations, setStorageLocations] = useState([]);
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartHovered, setIsCartHovered] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout', { state: { cart } });
    };

    const getProducts = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/products?search=${search}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [search]);

    useEffect(() => {
        getProducts();
    }, [search, getProducts]); // โหลดข้อมูลใหม่เมื่อค่า search หรือ getUsers เปลี่ยนแปลง

    const handleSearch = (e) => {
        setSearch(e.target.value); // อัปเดตค่าการค้นหาเมื่อผู้ใช้กรอกข้อมูล
    };

    useEffect(() => {
        const fetchData = async () => {
            const wareHousesResponse = await axios.get('http://localhost:5000/warehouses');
            setWareHouses(wareHousesResponse.data);
        };
        fetchData();
    }, []);

    const getWareHouseData = (productId) => {
        const wareHouse = wareHouses.find(wareHouse => wareHouse.productId === productId);
        return wareHouse ? { quantity: wareHouse.quantity } : { quantity: 0 };
    };

    useEffect(() => {
        const fetchCountingUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/countingUnits/show');
                setCountingUnits(response.data);
            } catch (error) {
                console.error('Error fetching counting units:', error);
            }
        };

        fetchCountingUnits();
    }, []);

    const countingUnitMap = countingUnits.reduce((map, countingUnit) => {
        map[countingUnit.id] = countingUnit.name;
        return map;
    }, {});

    useEffect(() => {
        const fetchStorageLocations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/locations');
                setStorageLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchStorageLocations();
    }, []);

    const locationMap = storageLocations.reduce((map, location) => {
        map[location.id] = location.name;
        return map;
    }, {});

    const toggleVisibility = async (productId, currentVisibility) => {
        try {
            await axios.patch(`http://localhost:5000/products/visibility/${productId}`, {
                visible: !currentVisibility
            });
            getProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error updating product visibility:', error);
        }
    };

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

    const deleteProduct = async (productId, productName) => {
        const result = await Swal.fire({
            title: 'คุณยืนยันที่จะลบ ?',
            text: `คุณยืนยันที่จะลบ ${productName} หรือไม่ ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย !',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            await axios.delete(`http://localhost:5000/products/${productId}`);
            getProducts();
            Swal.fire(
                'ลบแล้ว !',
                `${productName} ถูกลบเรียบร้อยแล้ว.`,
                'success'
            );
        }
    };

    const addToCart = async (productId) => {
        try {
            const response = await axios.post('http://localhost:5000/cart', {
                userId: user.id,
                productId: productId,
                quantity: 1
            });
            console.log('Product added to cart:', response.data);
            getCart();
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };



    return (
        <div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '99%' }}>
                <h1 className="title">รายการวัสดุ - อุปกรณ์</h1>
                <span className="subtitle">จำนวนทั้งสิ้น:<strong> {products.length} </strong>ชิ้น</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '99%' }}>
                {user && user.role === "admin" && (
                    <Link to="/products/add" className="button is-link" style={{ marginRight: '10px' }}>
                        + เพิ่มวัสดุชิ้นใหม่
                    </Link>
                )}
                {/* cart button */}
                <button
                    className="floating-cart-btn" style={{ marginRight: '10px' }}
                    onClick={() => setIsCartOpen(true)}
                >
                    🛒
                </button>        


                {/* search Admin */}
                {user && user.role === "admin" && (
                    <input
                        type="text"
                        className="input"
                        placeholder="ค้นหา ชื่อวัสดุ - อุปกรณ์, หน่วยนับ, ที่จัดเก็บ"
                        style={{ flex: 1 }}
                        value={search}  // กำหนดค่า search ใน input
                        onChange={handleSearch} // ฟังก์ชันเรียกใช้งานเมื่อมีการกรอกข้อมูล
                    />
                )}

                {/* search User */}
                {user && user.role === "user" && (
                    <input
                        type="text"
                        className="input"
                        placeholder="ค้นหา รหัส, ชื่อวัสดุ - อุปกรณ์, หน่วยนับ"
                        style={{ flex: 1 }}
                        value={search}  // กำหนดค่า search ใน input
                        onChange={handleSearch} // ฟังก์ชันเรียกใช้งานเมื่อมีการกรอกข้อมูล
                    />
                )}
            </div>

            <table className="location-table table is-bordered ">
                <thead>
                    <tr>

                        {user && user.role === "admin" && <th className="has-text-centered" style={{ width: '50px', backgroundColor: "rgb(255,255,204)" }}>BOX</th>}
                        <th className="has-text-centered" style={{ width: '50px', backgroundColor: "rgb(255,255,204)" }}>ลำดับ</th>
                        <th className="has-text-centered" style={{ width: '80px', backgroundColor: "rgb(255,255,204)" }}>รหัส</th>
                        <th style={{ width: '200px', backgroundColor: "rgb(255,255,204)" }}>ชื่อสินค้า</th>
                        <th className="has-text-centered" style={{ width: '80px', backgroundColor: "rgb(226,239,217)" }}>คงเหลือ</th>
                        <th className="has-text-centered" style={{ width: '80px', backgroundColor: "rgb(226,239,217)" }}>หน่วยนับ</th>
                        <th className="has-text-centered" style={{ width: '120px', backgroundColor: "rgb(252,225,214)" }}>เพิ่มลงตระกร้า</th>
                        {user && user.role === "admin" && <th className="has-text-centered" style={{ width: '150px', backgroundColor: "rgb(255,255,204)" }}>ที่จัดเก็บ</th>}
                        {user && user.role === "admin" && <th className="has-text-centered" style={{ width: '100px', backgroundColor: "rgb(252,225,214)" }}>อื่น ๆ</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => {
                        const wareHouseData = getWareHouseData(product.id);
                        return (
                            <tr key={product.uuid}>
                                {user && user.role === "admin" && (
                                    <td className="has-text-centered" style={{ width: '50px' }}>
                                        <input
                                            type="checkbox"
                                            checked={product.visible}
                                            onChange={() => toggleVisibility(product.uuid, product.visible)}
                                            style={{ transform: 'scale(1.5)' }}
                                        />
                                    </td>
                                )}
                                <td className="has-text-centered" style={{ width: '50px' }}>{product.id}</td>
                                <td className="has-text-centered" style={{ width: '100px' }}>{product.code}</td>
                                <td style={{ width: '200px' }}>{product.name}</td>
                                <td className="has-text-centered" style={{ width: '80px' }}>{Math.floor(wareHouseData.quantity)}</td>
                                <td className="has-text-centered" style={{ width: '80px' }}>{countingUnitMap[product.countingunitId]}</td>
                                <td className="has-text-centered" style={{ width: '120px' }}>
                                    <button
                                        className="button is-link"
                                        style={{ width: '80%', height: '30px' }}
                                        onClick={() => addToCart(product.id)}
                                        disabled={wareHouseData.quantity === 0} // disable ปุ่มเมื่อ quantity เป็น 0
                                    >
                                        + เพิ่ม
                                    </button>
                                </td>
                                {user && user.role === "admin" && <td className="has-text-centered" style={{ width: '150px' }}>{locationMap[product.locationId]}</td>}
                                {user && user.role === "admin" && (
                                    <td className="has-text-centered">
                                        <Link to={`/products/edit/${product.uuid}`}
                                            className="button is-small is-warning"
                                            style={{ width: '45px' }}
                                        >
                                            <strong>แก้ไข</strong>
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product.uuid, product.name)}
                                            className="button is-small is-danger"
                                            style={{ width: '45px', marginLeft: '5px' }}
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                )}
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

export default ProductList