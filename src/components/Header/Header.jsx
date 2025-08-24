import { Button, Dropdown, Menu } from "antd";
import { Heart, Menu as MenuIcon, ShoppingBag, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ROUTER from "../../router/ROUTER";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { key: "new", label: "Bộ sưu tập mới", path: "/bo-suu-tap" },
    { key: "women", label: "Áo", path: "/san-pham?category=ao" },
    { key: "men", label: "Quần", path: "/san-pham?category=quan" },
    {
      key: "accessories",
      label: "Phụ kiện",
      path: "/san-pham?category=phu-kien",
    },
    { key: "shoes", label: "Giày", path: "/san-pham?category=giay" },
  ];

  const userMenuItems = user
    ? [
        {
          key: "profile",
          label: "Hồ sơ của tôi",
          onClick: () => navigate(ROUTER.THONG_TIN_CA_NHAN),
        },
        ...(user.role === "seller"
          ? [
              {
                key: "shop",
                label: "Quản lý cửa hàng",
                onClick: () => navigate(ROUTER.SELLER_DASHBOARD),
              },
            ]
          : []),
        {
          key: "orders",
          label: "Đơn hàng của tôi",
          onClick: () => navigate(ROUTER.LICH_SU_DON_HANG),
        },
        {
          key: "logout",
          label: "Đăng xuất",
          onClick: () => {
            logout();
            navigate(ROUTER.HOME);
          },
        },
      ]
    : [];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleUserMenuClick = ({ key }) => {
    const item = userMenuItems.find((item) => item.key === key);
    item?.onClick();
  };

  const handleProtectedAction = (path) => {
    navigate(user ? path : "/dang-nhap");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo" onClick={() => navigate(ROUTER.HOME)}>
            <h1 className="logo-text">StyleHub</h1>
          </div>

          <Button
            type="text"
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="icon" />
            ) : (
              <MenuIcon className="icon" />
            )}
          </Button>

          {/* Navigation Menu */}
          <div className={`nav-menu ${isMenuOpen ? "nav-menu-open" : ""}`}>
            <nav className="nav-links">
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  type="text"
                  className="nav-button"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="action-icons">
              {user ? (
                <>
                  <Button
                    type="text"
                    className="action-button"
                    onClick={() => handleProtectedAction(ROUTER.YEU_THICH)}
                    title="Yêu thích"
                  >
                    <Heart className="icon" />
                  </Button>

                  <Dropdown
                    overlay={
                      <Menu onClick={handleUserMenuClick}>
                        {userMenuItems.map((item) => (
                          <Menu.Item key={item.key}>{item.label}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button type="text" className="action-button">
                      <User className="icon" />
                    </Button>
                  </Dropdown>

                  <Button
                    type="text"
                    className="action-button cart-button"
                    onClick={() => handleProtectedAction(ROUTER.GIO_HANG)}
                    title="Giỏ hàng"
                  >
                    <ShoppingBag className="icon" />
                  </Button>
                </>
              ) : (
                <div className="auth-buttons">
                  <Button
                    type="text"
                    className="auth-button login-button"
                    onClick={() => navigate("/dang-nhap")}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    type="primary"
                    className="auth-button register-button"
                    onClick={() => navigate(ROUTER.DANG_KY)}
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Overlay for mobile menu */}
          {isMenuOpen && (
            <div
              className="menu-overlay"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
