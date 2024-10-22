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
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [msg, setMsg] = useState('');

    const handleCheckout = () => {
        navigate('/checkout');
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

        if (user && user.role === 'admin') {
            fetchStorageLocations();
        }
    }, [user]);

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

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/cart/${user.id}`);
            setCartItems(response.data);
            const total = response.data.reduce((sum, item) => sum + item.quantity, 0);
            setTotalQuantity(total);
        } catch (error) {
            console.error('Error fetching cart items:', error);
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
            fetchCartItems(); // รีเฟรชข้อมูลตะกร้า
        } catch (error) {
            if (error.response) {
                await Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: error.response.data.msg,
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            }
        }
    };

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        try {
            const response = await axios.patch('http://localhost:5000/cart', {
                cartItemId: cartItemId,
                quantity: newQuantity
            });
            console.log('Cart item quantity updated:', response.data);
            fetchCartItems(); // รีเฟรชข้อมูลตะกร้า
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };

    const handleQuantityChange = (cartItemId, newQuantity) => {
        // ถ้า newQuantity เป็นค่าว่าง หรือ 0, ให้ตั้งค่าเป็น 1 อัตโนมัติ
        if (newQuantity === '' || parseInt(newQuantity) === 0) {
            updateCartItemQuantity(cartItemId, 1);
        } else if (parseInt(newQuantity) >= 1) {
            updateCartItemQuantity(cartItemId, parseInt(newQuantity));
        }
    };

    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, [user]);

    const deleteCartItem = async (cartItemId, productName) => {
        const result = await Swal.fire({
            title: 'คุณยืนยันที่จะลบ ?',
            text: `คุณยืนยันที่จะลบสินค้านี้ในตะกร้าหรือไม่ ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย !',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/cart/${cartItemId}`);
                fetchCartItems(); // รีเฟรชข้อมูลตะกร้า
                Swal.fire(
                    'ลบแล้ว !',
                    `ลบเรียบร้อยแล้ว.`,
                    'success'
                );
            } catch (error) {
                console.error('Error deleting cart item:', error);
            }
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

                {/* cart preview */}
                <div
                    className="cart-icon-container"
                    onMouseEnter={() => setIsCartHovered(true)}
                    onMouseLeave={() => setIsCartHovered(false)}
                >
                    {/* cart button */}
                    <button
                        className="floating-cart-btn" style={{ marginRight: '10px' }}
                        onClick={() => setIsCartOpen(true)}
                    >
                        🛒 {totalQuantity}
                    </button>
                    {isCartHovered && cart.length > 0 && (
                        <div className="cart-preview">
                            <ul>
                                {cartItems.map((item,) => (
                                    <li key={item.id}>
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-quantity">{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Modal ตะกร้าสินค้า */}
                <Modal
                    isOpen={isCartOpen}
                    onRequestClose={() => setIsCartOpen(false)}
                    className="cart-modal"
                    overlayClassName="cart-modal-overlay"
                >
                    <strong><h2>ตะกร้าสินค้า 🛒</h2></strong>
                    <br />
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center' }}>
                            <strong><p>❌ ไม่มีสินค้าในตะกร้า ❌</p></strong>

                        </div>

                    ) : (
                        <table className='modal-like-table'>
                            <thead >
                                <tr>
                                    <th className="item-name">ชื่อสินค้า</th>
                                    <th className="item-quantity">จำนวน</th>
                                    <th className="item-quantity">หน่วย</th>
                                    <th className="item-actions">อื่น ๆ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="cart-item">
                                        <td className="item-name">{item.product.name}</td>
                                        <td className="item-quantity">
                                            <div className="quantity-controls">
                                                <button className="decrease-btn" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>-</button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}  // รับค่าเป็น string ก่อน
                                                />
                                                <button className="increase-btn" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                        </td>
                                        <td className="item-quantity">{item.product.countingUnit ? item.product.countingUnit.name : 'No unit'}</td>
                                        <td className="item-actions">
                                            <button className="remove-btn"
                                                onClick={() => deleteCartItem(item.id)}
                                            >
                                                ลบ
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}


                    <div className="cart-footer">
                        {/* แสดงปุ่ม "ไปที่หน้า Checkout" เฉพาะเมื่อมีสินค้าในตะกร้า */}
                        {cartItems.length > 0 && (
                            <button
                                className="checkout-btn"
                                onClick={handleCheckout}
                            >
                                ยืนยันการเบิก</button>
                        )}
                        <button className="close-modal-btn" onClick={() => setIsCartOpen(false)}>
                            ปิด
                        </button>
                    </div>
                </Modal>
                {/* end modal */}


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
                        <th className="has-text-centered" style={{ width: '80px', backgroundColor: "rgb(255,255,204)" }}>รหัสสินค้า</th>
                        <th className="has-text-centered" style={{ width: '200px', backgroundColor: "rgb(255,255,204)" }}>ชื่อวัสดุ - อุปกรณ์</th>
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