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
} from "@ant-design/icons";
import "./SellerDashboard.css";
import ManagerList from "./Employee/ManagerList";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChartOutlined /> },
    { id: "orders", label: "Quản lý Đơn hàng", icon: <ShoppingCartOutlined /> },
    { id: "products", label: "Tạo Sản phẩm", icon: <InboxOutlined /> },
    { id: "vouchers", label: "Tạo Voucher", icon: <GiftOutlined /> },
    { id: "employees", label: "Tạo Nhân viên", icon: <TeamOutlined /> },
    { id: "settings", label: "Cài đặt", icon: <SettingOutlined /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-icon blue">
                <ShoppingCartOutlined />
              </div>
              <div>
                <p className="label">Tổng đơn hàng</p>
                <p className="value">1,234</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon green">
                <InboxOutlined />
              </div>
              <div>
                <p className="label">Sản phẩm</p>
                <p className="value">456</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon purple">
                <GiftOutlined />
              </div>
              <div>
                <p className="label">Voucher</p>
                <p className="value">23</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon orange">
                <TeamOutlined />
              </div>
              <div>
                <p className="label">Nhân viên</p>
                <p className="value">12</p>
              </div>
            </div>
          </div>
        );

      case "orders":
        return <div className="content-box">Quản lý Đơn hàng</div>;
      case "products":
        return <div className="content-box">Tạo Sản phẩm</div>;
      case "vouchers":
        return <div className="content-box">Tạo Voucher</div>;
      case "employees":
        return <ManagerList />;
      case "settings":
        return <div className="content-box">Cài đặt</div>;
      default:
        return null;
    }
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
              className={`sidebar-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
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
            {menuItems.find((item) => item.id === activeTab)?.label ||
              "Dashboard"}
          </h2>
          <div className="header-actions">
            <button className="icon-btn">
              <BellOutlined />
            </button>
            <button className="user-btn">
              <UserOutlined />
              <span>Admin</span>
            </button>
          </div>
        </header>

        <section className="main-section">{renderContent()}</section>
      </main>
    </div>
  );
};

export default SellerDashboard;
