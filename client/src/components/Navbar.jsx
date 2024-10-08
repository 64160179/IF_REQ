import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
// import ifbuu from "../asset/ifbuu.png";

const Navbar = () => {

  const [hover, setHover] = React.useState(false);

  const linkStyle = {
    marginLeft: "10px",
    color: '#ffffff',
    fontSize: "27px",
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'text-decoration 0.3s ease',
  };

  const linkHoverStyle = {
    textDecoration: 'underline',
  };

  return (
    <div>
      <nav
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
        style={{ backgroundColor: '#00396b', height: '120px' }}
      >

        <div className="navbar-brand" style={{ marginLeft: "10px", marginTop: "15px" }}>
          <NavLink to="/home">
            <img
              src="https://www.informatics.buu.ac.th/2020/wp-content/uploads/2018/04/logo-informatics.png"
              alt="Logo"
              style={{ width: '90px', height: '90px', }}
            />
          </NavLink>

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: "10px", marginTop: "10px" }}>
            <Link
              to="/home"
              style={hover ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            >
              คณะวิทยาการสารสนเทศ
            </Link>

            <p style={{ marginLeft: "10px", color: '#dadada', fontSize: "15px" }}>มหาวิทยาลัยบูรพา</p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;