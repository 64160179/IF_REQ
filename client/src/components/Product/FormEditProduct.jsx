import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from 'react-select'; // นำเข้า react-select

const FormEditProduct = () => {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [countingUnit, setCountingUnit] = useState([]);
    const [location, setLocations] = useState([]);
    const [selectedCountingUnit, setSelectedCountingUnit] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [msg, setMsg] = useState('')
    const { id } = useParams();
    const navigate = useNavigate();


    const handleCancel = () => {
        navigate('/products');
    };

    useEffect(() => {
        const getProductById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                const product = response.data;
                setName(product.name);
                setQuantity(product.quantity);
                setSelectedCountingUnit(product.countingunitId);
                setSelectedLocation(product.locationId);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getProductById();
    }, [id])

    useEffect(() => {
        const fetchCountingUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/countingUnits');
                setCountingUnit(response.data);
            } catch (error) {
                console.error('Error fetching counting units:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/locations');
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchCountingUnits();
        fetchLocations();
    }, []);

    const locationOptions = location.map((location) => ({
        value: location.id,
        label: location.name
    }));

    const countingUnitOptions = countingUnit.map((countingUnit) => ({
        value: countingUnit.id,
        label: countingUnit.name
    }));

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/products/${id}`, {
                name: name,
                quantity: quantity,
                locationId: selectedLocation,
                countingunitId: selectedCountingUnit
            });
            navigate("/products");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <br />
            <h1 className="title">แก้ไขวัสดุ - อุปกรณ์</h1>
            <div className="card is-shadowless" style={{ width: '99%' }}>
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={updateProduct}>
                            <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">ชื่อสินค้า</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="กรุณากรอกชื่อสินค้า"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">หน่วยนับ</label>
                                    <div className="control">
                                        <div className="is-fullwidth">
                                            <div className="is-fullwidth">
                                                <Select
                                                    options={countingUnitOptions}
                                                    value={countingUnitOptions.find(option => option.value === selectedCountingUnit)}
                                                    onChange={(option) => setSelectedCountingUnit(option ? option.value : '')}
                                                    isClearable
                                                    placeholder="- เลือกหน่วยนับ -"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">จำนวน</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="number"
                                            placeholder="กรุณากรอกจำนวน"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">สถานที่จัดเก็บ</label>
                                    <div className="control">
                                        <div className="is-fullwidth">
                                            <div className="is-fullwidth">
                                                <Select
                                                    options={locationOptions}
                                                    value={locationOptions.find(option => option.value === selectedLocation)}
                                                    onChange={(option) => setSelectedLocation(option ? option.value : '')}
                                                    isClearable
                                                    placeholder="- เลือกสถานที่จัดเก็บ -"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br />
                            <div className="field is-grouped">
                                <div className="control">
                                    <button type="submit" className="button is-success" style={{ width: "120px" }}>
                                        บันทึกข้อมูล
                                    </button>
                                </div>
                                <div className="control">
                                    <button type="button" onClick={handleCancel} className="button is-danger" style={{ width: "120px" }}>
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormEditProduct