import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdError, MdCheckCircle } from 'react-icons/md'; // จาก Material Design

const FormEditUser = () => {
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  // validated states
  const [lowerValidated, setLowerValidated] = useState(false);
  const [upperValidated, setUpperValidated] = useState(false);
  const [numberValidated, setNumberValidated] = useState(false);
  const [specialValidated, setSpecialValidated] = useState(false);
  const [lengthValidated, setLengthValidated] = useState(false);

  // state to track changes
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setfName(response.data.fname);
        setlName(response.data.lname);
        setEmail(response.data.email);
        setRole(response.data.role);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getUserById();
  }, [id]);

  const handleChange = (value) => {
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.*[!@#$%^&*.])'); // Removed unnecessary escape characters
    const length = new RegExp('(?=.{8,})');

    const isLowerValidated = lower.test(value);
    const isUpperValidated = upper.test(value);
    const isNumberValidated = number.test(value);
    const isSpecialValidated = special.test(value);
    const isLengthValidated = length.test(value);

    setLowerValidated(isLowerValidated);
    setUpperValidated(isUpperValidated);
    setNumberValidated(isNumberValidated);
    setSpecialValidated(isSpecialValidated);
    setLengthValidated(isLengthValidated);

    if (!isLowerValidated || !isUpperValidated || !isNumberValidated || !isSpecialValidated || !isLengthValidated) {
    } else {
      setMsg('');
    }
    setIsChanged(true); // Mark as changed when password is modified
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setIsChanged(true); // Mark as changed when any field is modified
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
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

  return (
    <div>
      <br />
      <h1 className="title">ตั้งค่าผู้ใช้</h1>

      <div className="card is-shadowless" style={{ width: '99%' }}>
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateUser}>
              <p className="has-text-centered"><strong style={{ color: 'red' }}>{msg}</strong></p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">ชื่อจริง</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={fname}
                      onChange={handleFieldChange(setfName)}
                      placeholder="ชื่อจริง"
                    />
                  </div>
                </div>


                <div className="field" style={{ flex: 1 }}>
                  <label className="label">นามสกุล</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={lname}
                      onChange={handleFieldChange(setlName)}
                      placeholder="นามสกุล"
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={handleFieldChange(setEmail)}
                    placeholder="Email"
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
                      onChange={(e) => {
                        setPassword(e.target.value)
                        handleChange(e.target.value)
                      }}
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
              <style>
                {`
                  .tracker-box {
                  background-color: #f9f9f9;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  padding: 15px;
                  margin-top: 20px;
                  }
                  .tracker-box .validated {
                  color: green;
                  display: flex;
                  align-items: center;
                  margin-bottom: 10px;
                  }
                  .tracker-box .not-validated {
                  color: red;
                  display: flex;
                  align-items: center;
                  margin-bottom: 10px;
                  }
                  .tracker-box .list-icon {
                  margin-right: 10px;
                  }
                  .tracker-box .list-icon.green {
                  color: green;
                  }
                `}
              </style>
              <main className='tracker-box'>
                <div className={lowerValidated ? 'validated' : 'not-validated'}>
                  {lowerValidated ? (
                    <span className='list-icon green'>
                      <MdCheckCircle />
                    </span>
                  ) : (
                    <span className='list-icon'>
                      <MdError />
                    </span>
                  )}
                  ตัวอักษรภาษาอังกฤษพิมพ์เล็กอย่างน้อย 1 ตัว
                </div>
                <div className={upperValidated ? 'validated' : 'not-validated'}>
                  {upperValidated ? (
                    <span className='list-icon green'>
                      <MdCheckCircle />
                    </span>
                  ) : (
                    <span className='list-icon'>
                      <MdError />
                    </span>
                  )}
                  ตัวอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว
                </div>
                <div className={numberValidated ? 'validated' : 'not-validated'}>
                  {numberValidated ? (
                    <span className='list-icon green'>
                      <MdCheckCircle />
                    </span>
                  ) : (
                    <span className='list-icon'>
                      <MdError />
                    </span>
                  )}
                  ตัวเลข 0-9 อย่างน้อย 1 ตัว
                </div>
                <div className={specialValidated ? 'validated' : 'not-validated'}>
                  {specialValidated ? (
                    <span className='list-icon green'>
                      <MdCheckCircle />
                    </span>
                  ) : (
                    <span className='list-icon'>
                      <MdError />
                    </span>
                  )}
                  ตัวอักษรพิเศษอย่างน้อย 1 ตัว (! @ # $ % ^ & * .)
                </div>
                <div className={lengthValidated ? 'validated' : 'not-validated'}>
                  {lengthValidated ? (
                    <span className='list-icon green'>
                      <MdCheckCircle />
                    </span>
                  ) : (
                    <span className='list-icon'>
                      <MdError />
                    </span>
                  )}
                  มีความยาวมากกว่า 8 ตัวอักษร
                </div>
              </main>
              <br />
              <div className="field is-grouped">
                <div className="control">
                  <button type="submit" className="button is-success"
                    disabled={!isChanged || (password !== "" && !(lowerValidated && upperValidated && numberValidated && specialValidated && lengthValidated))}
                  >
                    ยืนยันการแก้ไข
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

export default FormEditUser;
