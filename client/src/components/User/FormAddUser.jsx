import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormAddUser = () => {
    const [fname, setfName] = useState("");
    const [lname, setlName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleCancel = () => {
        // รีเซ็ตสถานะของฟอร์ม
        setfName('');
        setlName('');
        setEmail('');
        setPassword('');
        setConfPassword('');
        setRole('');
        // ย้อนกลับไปหน้า /users
        navigate('/users');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/users", {
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                confPassword: confPassword,
                role: role,
            });
            navigate("/users");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <br />
            <h1 className="title">เพิ่มผู้ใช้ใหม่</h1>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={saveUser}>
                            <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">ชื่อจริง</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            value={fname}
                                            onChange={(e) => setfName(e.target.value)}
                                            placeholder="กรุณากรอกชื่อจริง"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">นามสกุล</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            value={lname}
                                            onChange={(e) => setlName(e.target.value)}
                                            placeholder="กรุณากรอกชื่อนามสกุล"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Email (มหาวิทยาลัย)</label>
                                <div className="control">
                                    <input className="input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="กรุณากรอกอีเมล (มหาวิทยาลัย)"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Role</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="">กรุณาเลือกสิทธิ์การใช้งาน</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">รหัสผ่าน</label>
                                    <div className="control has-icons-right">
                                        <input className="input"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="**********"
                                        />
                                        <button onClick={toggleShowPassword} type="button" style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            border: 'none',
                                            background: 'none'
                                        }}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="field" style={{ flex: 1 }}>
                                    <label className="label">ยืนยันรหัสผ่าน</label>
                                    <div className="control has-icons-right">
                                        <input className="input"
                                            type={showPassword ? "text" : "password"}
                                            value={confPassword}
                                            onChange={(e) => setConfPassword(e.target.value)}
                                            placeholder="**********"
                                        />
                                        <button onClick={toggleShowPassword} type="button" style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            border: 'none',
                                            background: 'none'
                                        }}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
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
    );
};

export default FormAddUser;
