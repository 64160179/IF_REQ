import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPricetag, IoHome, IoSettingsSharp, IoPerson, IoLogOut } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { TbShoppingCartFilled } from "react-icons/tb";
import { RiNumbersFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getMe, LogOut, reset } from "../features/authSlice";
import '../../src/App.css'

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth) || {};

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  useEffect(() => {
    // โหลดข้อมูล user จากเซิร์ฟเวอร์เมื่อ component ถูก mount
    if (!user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  // ตรวจสอบว่า user เป็น null หรือไม่
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar">
      <aside className="menu pl-3 has-shadow" style={{ marginTop: "70px" }}>
        <p className="menu-label"><strong>ทั่วไป</strong></p>
        <ul className="menu-list">
          <li className="custom-font-size">
            <NavLink to={"/home"} className="menu-item">
              <IoHome className="menu-secoundary" /> หน้าหลัก
            </NavLink>
          </li>
          <li className="custom-font-size">
            <NavLink to={"/products"} className="menu-item">
              <TbShoppingCartFilled className="menu-secoundary" /> วัสดุ-อุปกรณ์
            </NavLink>
          </li>
          <li className="custom-font-size">
            <NavLink to={"/historys"} className="menu-item">
              <FaHistory className="menu-secoundary" /> ประวัติการขอเบิก
            </NavLink>
          </li>
        </ul>
        {user && user.role === "admin" && (
          <div style={{ marginTop: '10px' }}>
            <p className="menu-label"><strong>การจัดการ</strong></p>
            <ul className="menu-list">
              <li className="custom-font-size">
                <NavLink to={"/summary"} className="menu-item">
                  <IoPricetag className="menu-secoundary" /> สรุปสินค้าคงเหลือ
                </NavLink>
              </li>
              <li className="custom-font-size">
                <NavLink to={"/users"} className="menu-item">
                  <IoPerson className="menu-secoundary" /> จัดการชื่อผู้ใช้
                </NavLink>
              </li>
              <li className="custom-font-size">
                <NavLink to={"/countingunits"} className="menu-item">
                  <RiNumbersFill className="menu-secoundary" /> จัดการหน่วยนับ
                </NavLink>
              </li>
              <li className="custom-font-size">
                <NavLink to={"/locations"} className="menu-item">
                  <BiSolidCategory className="menu-secoundary" /> จัดการที่จัดเก็บ
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        <p className="menu-label"><strong>การตั้งค่า</strong></p>
        <ul className="menu-list">
          <li className="custom-font-size">
            <NavLink to={`/editprofile/${user.uuid}`} className="menu-item">
              <IoSettingsSharp className="menu-secoundary" /> ตั้งค่าบัญชีผู้ใช้
            </NavLink>
          </li>
        </ul>
        <p className="menu-label"><strong>อื่น ๆ</strong></p>
        <ul className="menu-list">
          <li>
            <button onClick={logout} className="a-logout custom-font-size">
              <IoLogOut className="menu-secoundary" /> ออกจากระบบ
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
