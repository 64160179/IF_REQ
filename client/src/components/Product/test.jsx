import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductList = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [wareHouseData, setWareHouseData] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchWareHouseData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/warehouse');
                const data = response.data.reduce((acc, item) => {
                    acc[item.productId] = item.quantity;
                    return acc;
                }, {});
                setWareHouseData(data);
            } catch (error) {
                console.error('Error fetching warehouse data:', error);
            }
        };

        fetchProducts();
        fetchWareHouseData();
    }, []);

    const addToCart = async (productId) => {
        const availableQuantity = wareHouseData[productId] || 0;

        if (availableQuantity <= 0) {
            await Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'สินค้าหมด',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/cart', {
                userId: user.id,
                productId: productId,
                quantity: 1
            });
            console.log('Product added to cart:', response.data);
            fetchCartItems(); // รีเฟรชข้อมูลตะกร้า

            // อัปเดตจำนวนสินค้าที่เหลือในคลัง
            setWareHouseData(prevState => ({
                ...prevState,
                [productId]: prevState[productId] - 1
            }));
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

    return (
        <div>
            <h1>Product List</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - {wareHouseData[product.id] || 0} in stock
                        <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;