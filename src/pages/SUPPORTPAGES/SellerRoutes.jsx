// src/pages/SUPPORTPAGES/SellerRoutes.js
import {
  BarChartOutlined,
  BellOutlined,
  CloseOutlined,
  GiftOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useContext, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ROUTER from "../../router/ROUTER";
import "./SellerRoutes.css";

const SellerRoutes = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  if (!isAuthenticated || user?.role !== "seller") {
    return <Navigate to={ROUTER.DANG_NHAP} replace />;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChartOutlined />,
      path: ROUTER.DASHBOARD,
    },
    {
      id: "orders",
      label: "Quản lý Đơn hàng",
      icon: <ShoppingCartOutlined />,
      path: ROUTER.QUAN_LY_DON_HANG,
    },
    {
      id: "products",
      label: "Tạo Sản phẩm",
      icon: <InboxOutlined />,
      path: ROUTER.THEM_SAN_PHAM,
    },
    {
      id: "vouchers",
      label: "Tạo Voucher",
      icon: <GiftOutlined />,
      path: ROUTER.QUAN_LY_VOUCHER,
    },
    {
      id: "employees",
      label: "Tạo Nhân viên",
      icon: <TeamOutlined />,
      path: ROUTER.QUAN_LY_NHAN_VIEN,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
              className={`sidebar-btn ${
                location.pathname === item.path ? "active" : ""
              }`}
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
            {menuItems.find((item) => location.pathname === item.path)?.label ||
              "Dashboard"}
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
                <span>Seller</span>
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

export default SellerRoutes;
