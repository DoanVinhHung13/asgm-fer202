// src/components/Layout/Header/index.js
import {
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space } from "antd";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ROUTER from "../../router/ROUTER";
import "./header.css";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTER.HOME);
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin tài khoản",
      onClick: () => navigate(ROUTER.CAP_NHAT_THONG_TIN),
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng của tôi",
      onClick: () => navigate(ROUTER.DON_HANG_CUA_TOI),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const sellerMenuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard Seller",
      onClick: () => navigate(ROUTER.SELLER_DASHBOARD),
    },
    {
      key: "products",
      icon: <SettingOutlined />,
      label: "Quản lý sản phẩm",
      onClick: () => navigate(ROUTER.QUAN_LY_SAN_PHAM),
    },
    {
      type: "divider",
    },
    ...userMenuItems,
  ];

  const menuItems = user?.role === "seller" ? sellerMenuItems : userMenuItems;

  return (
    <AntHeader className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to={ROUTER.HOME} className="logo">
            <h2>SellerApp</h2>
          </Link>
        </div>

        <div className="header-center">
          <Menu mode="horizontal" className="main-menu">
            <Menu.Item key="home">
              <Link to={ROUTER.HOME}>Trang chủ</Link>
            </Menu.Item>
            <Menu.Item key="products">
              <Link to={ROUTER.SAN_PHAM}>Sản phẩm</Link>
            </Menu.Item>
          </Menu>
        </div>

        <div className="header-right">
          <Space size="middle">
            {isAuthenticated ? (
              <>
                <Badge count={3} size="small">
                  <Button
                    type="text"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => navigate(ROUTER.GIO_HANG)}
                  />
                </Badge>

                <Dropdown
                  menu={{ items: menuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <Button type="text" className="user-button">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span className="user-name">{user?.name}</span>
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Space>
                <Button
                  type="default"
                  onClick={() => navigate(ROUTER.DANG_NHAP)}
                >
                  Đăng nhập
                </Button>
                <Button type="primary" onClick={() => navigate(ROUTER.DANG_KY)}>
                  Đăng ký
                </Button>
              </Space>
            )}
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
