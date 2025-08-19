import React, { useState } from "react";
import {
  ShoppingCartOutlined,
  InboxOutlined,
  GiftOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./SellerDashboard.css";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // thêm state cho dropdown

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChartOutlined />, path: "/seller/dashboard" },
    { id: "orders", label: "Quản lý Đơn hàng", icon: <ShoppingCartOutlined />, path: "/seller/quan-ly-don-hang" },
    { id: "products", label: "Tạo Sản phẩm", icon: <InboxOutlined />, path: "/seller/tao-san-pham" },
    { id: "vouchers", label: "Tạo Voucher", icon: <GiftOutlined />, path: "/seller/tao-voucher" },
    { id: "employees", label: "Tạo Nhân viên", icon: <TeamOutlined />, path: "/seller/tao-nhan-vien" },
    { id: "settings", label: "Cài đặt", icon: <SettingOutlined />, path: "/seller/cai-dat" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user"); // xoá user/token
    navigate("/"); // chuyển về login
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1>Seller Panel</h1>
          <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
            <CloseOutlined />
          </button>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-btn ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="main-header">
          <button
            className="icon-btn lg-hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuOutlined />
          </button>
          <h2>
            {menuItems.find((item) => location.pathname === item.path)?.label || "Dashboard"}
          </h2>

          {/* Actions */}
          <div className="header-actions">
            <button className="icon-btn">
              <BellOutlined />
            </button>

            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <UserOutlined />
                <span>Admin</span>
              </button>

              {openMenu && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>
                    <LogoutOutlined /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="main-section">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
