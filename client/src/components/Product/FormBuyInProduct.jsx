import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'; // นำเข้า react-select

const FormBuyInProduct = () => {
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState('');
    const [doc_number, setDoc_number] = useState('');
    const [quantity, setQuantity] = useState('');
    const [countingUnits, setCountingUnits] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [countingUnitName, setCountingUnitName] = useState('');
    const [msg, setMsg] = useState('');
    const [fields, setFields] = useState([{ id: 1, selectedProduct: null, quantity: '', countingUnitName: '' }]);
    const [counter, setCounter] = useState(2); 
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products and counting units from the API
        const fetchData = async () => {
            const productsResponse = await axios.get('http://localhost:5000/products');
            const countingUnitsResponse = await axios.get('http://localhost:5000/countingUnits');
            setProducts(productsResponse.data);
            setCountingUnits(countingUnitsResponse.data);
        };
        fetchData();
    }, []);

    const handleProductChange = (selectedOption, index) => {
        const newFields = [...fields];
        newFields[index].selectedProduct = selectedOption;
        const product = products.find(p => p.id === selectedOption.value);
        const countingUnit = countingUnits.find(cu => cu.id === product.countingunitId);
        newFields[index].countingUnitName = countingUnit ? countingUnit.name : '';
        setFields(newFields);
        
        // ตรวจสอบสินค้าซ้ำ
        checkDuplicateProducts(newFields);
    };

    const handleQuantityChange = (e, index) => {
        const newFields = [...fields];
        newFields[index].quantity = e.target.value;
        setFields(newFields);
    };

    const addField = () => {
        if (fields.length < 10) {
            setFields([...fields, { id: counter, selectedProduct: null, quantity: '', countingUnitName: '' }]);
            setCounter(counter + 1); // Increment counter
        } else {
            setMsg('สามารถเพิ่มได้เพียง 10 รายการเท่านั้น !');
        }
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    const checkDuplicateProducts = (fields) => {
        const selectedProducts = fields.map(field => field.selectedProduct?.value);
        const hasDuplicates = selectedProducts.some((product, index) => selectedProducts.indexOf(product) !== index);
        if (hasDuplicates) {
            setMsg('คุณทำการเลือกสินค้าที่ซ้ำกัน กรุณาเลือกลบอันใดอันหนึ่ง !');
        } else {
            setMsg('');
        }
    };

    const formatDecimal = (value) => {
        return parseFloat(value).toFixed(2);
    };

    const saveBuyIn = async (e) => {
        e.preventDefault();
        try {
            await Promise.all(fields.map(async (field) => {
                if (field.selectedProduct && field.quantity) {
                    await axios.post("http://localhost:5000/buyins", {
                        productId: field.selectedProduct.value,
                        quantity: formatDecimal(field.quantity),
                        doc_number: doc_number,
                        title: title,
                    });
                } else {
                    throw new Error('Please fill in all fields.');
                }
            }));
            navigate("/summary");
        } catch (error) {
            setMsg(error.message || 'Error saving buy-in data.');
        }
    };

    return (
        <div>
            <form onSubmit={saveBuyIn}>
                <br />
                <h1 className="title">ซื้อวัสดุเข้าคลัง</h1>
                <div className='card is-shadowless'>
                    <div className='card-content'>
                        <div className='content'>
                            <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className='field' style={{ flex: 1 }}>
                                    <label className='label'>เลขที่เอกสาร</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            value={doc_number}
                                            onChange={(e) => setDoc_number(e.target.value)}
                                            placeholder="กรุณากรอกชื่อ เลขที่เอกสาร"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='field' style={{ flex: 1 }}>
                                    <label className='label'>ชื่อรายการ</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="กรุณากรอกชื่อ รายการสั่งซื้อ"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card is-shadowless" style={{ width: '99%' }}>
                    <div className="card-content">
                        <div className="content">
                            {fields.map((field, index) => (
                                <div key={field.id} className="field-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div className="field" style={{ flex: 1 }}>
                                        <label className="label">ชื่อสินค้า</label>
                                        <div className="control">
                                            <Select
                                                placeholder="-- เลือกสินค้า --"
                                                value={field.selectedProduct}
                                                options={products.map(product => ({ value: product.id, label: product.name }))}
                                                onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                                            />
                                        </div>
                                    </div>

                                    <div className="field" style={{ flex: 1 }}>
                                        <label className="label">จำนวน (หน่วย)</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="number"
                                                placeholder="กรุณากรอกจำนวน"
                                                value={field.quantity}
                                                onChange={(e) => handleQuantityChange(e, index)}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="field" style={{ flex: 1 }}>
                                        <label className="label">หน่วยนับ</label>
                                        <div className="control">
                                            {field.countingUnitName && (
                                                <input
                                                    className="input"
                                                    type="text"
                                                    value={field.countingUnitName}
                                                    readOnly
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="field" style={{ flex: '0 0 auto' }}>
                                        <button type="button" onClick={() => removeField(index)} className="button is-danger is-outlined" style={{ marginTop: '20px'}}>ลบ</button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addField} className="button is-link">เพิ่มสินค้า</button>
                        </div>
                        <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p>
                    </div>
                </div>

                {/* ปุ่มกด */}
                <div className="field is-grouped" >
                    <div className="control">
                        <button type="submit" className="button is-success" style={{ width: "120px" }}>
                            บันทึกข้อมูล
                        </button>
                    </div>
                    <div className="control">
                        <button type="button" className="button is-danger" style={{ width: "120px" }}>
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </form>
        </div >
    )
}

export default FormBuyInProduct;