import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LoginUser, reset } from '../features/authSlice'
import '../../src/App.css'

import video from '../assets/video.mp4'
import logo from '../assets/logo.png'

//icons
import { MdEmail } from "react-icons/md";
import { BsFillShieldLockFill } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state => state.auth)
  );
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/home");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className='loginPage flex'>
      <div className="container flex">

        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h1 className='title'>เบิกวัสดุ - อุปกรณ์</h1>
            <p>คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา</p>
          </div>


          <div className="footerDiv flex">
            <span className='text'>*** สถานะของเว็บไซต์ ยังไม่ได้ทำ ***</span>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} width="150" height="50" alt="logo" />
            <h1>ยินดีต้อนรับ <br />กรุณาเข้าสู่ระบบ</h1>
          </div>
          {isError && <p className="has-text-centered" ><strong style={{ color: 'red' }}>{message}</strong></p>}

          <form onSubmit={Auth} className='form grid'>
            <div className='inputDiv'>
              <label htmlFor="email"><strong>อีเมล (มหาวิทยาลัย)</strong></label>
              <div className='input flex'>
                <MdEmail className='icon' />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรุณากรอกอีเมล"
                  required
                />
              </div>
            </div>

            <div className='inputDiv'>
              <label htmlFor="password"><strong>รหัสผ่าน</strong></label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
                <button onClick={toggleShowPassword} type="button" style={{ border: 'none', background: 'none' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <button type='submit' className='btn flex'>
                <span>{isLoading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}</span>
                <CiLogin className='icon' />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login