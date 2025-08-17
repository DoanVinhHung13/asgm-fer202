import { Menu as AntdMenu, Button, Dropdown, Input } from "antd";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Adjust path as needed
import ROUTER from "../../router/ROUTER";
import "./header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { key: "new", label: "Bộ sưu tập mới", path: "/bo-suu-tap" },
    { key: "women", label: "Áo", path: "/ao-thun" },
    { key: "men", label: "Quần", path: "/quan" },
    { key: "accessories", label: "Phụ kiện", path: "/phu-kien" },
    { key: "shoes", label: "Giày", path: "/giay" },
  ];

  // User menu items based on role
  const getUserMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { key: "profile", label: "Hồ sơ của tôi", path: "/ho-so" },
      { key: "orders", label: "Đơn hàng của tôi", path: "/don-hang" },
    ];

    if (user.role === "seller") {
      baseItems.splice(1, 0, {
        key: "shop",
        label: "My Shop",
        path: "/my-shop",
      });
    }

    baseItems.push({ key: "logout", label: "Đăng xuất", path: null });
    return baseItems;
  };

  const handleMenuClick = (item) => {
    console.log("Menu clicked:", item.key);
    if (item.path) {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search:", searchQuery);
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    setIsUserDropdownOpen(false);
    const menuItem = getUserMenuItems().find((item) => item.key === key);

    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "shop":
        navigate("/my-shop");
        break;
      case "logout":
        logout();
        navigate(ROUTER.HOME);
        break;
      default:
        if (menuItem && menuItem.path) {
          navigate(menuItem.path);
        }
        break;
    }
  };

  const handleLoginClick = () => {
    navigate("/dang-nhap");
  };

  const handleRegisterClick = () => {
    navigate(ROUTER.DANG_KY);
  };

  const handleFavoritesClick = () => {
    if (user) {
      navigate("/favorites");
    } else {
      // Redirect to login if not authenticated
      navigate("/dang-nhap");
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/cart");
    } else {
      // Redirect to login if not authenticated
      navigate("/dang-nhap");
    }
  };

  const userMenu = (
    <AntdMenu onClick={handleUserMenuClick}>
      {getUserMenuItems().map((item) => (
        <AntdMenu.Item key={item.key}>{item.label}</AntdMenu.Item>
      ))}
    </AntdMenu>
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div
            className="logo"
            onClick={() => navigate(ROUTER.HOME)}
            style={{ cursor: "pointer" }}
          >
            <h1 className="logo-text">StyleHub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Button
                key={item.key}
                type="text"
                className="nav-button"
                onClick={() => handleMenuClick(item)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="desktop-search">
            <Input
              prefix={<Search className="search-icon" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              placeholder="Search for trendy styles..."
              className="search-input"
            />
          </div>

          {/* Action Icons */}
          <div className="action-icons">
            {/* Favorites */}
            <Button
              type="text"
              className="action-button"
              onClick={handleFavoritesClick}
              title="Favorites"
            >
              <Heart className="icon" />
            </Button>

            {/* Authentication Section */}
            {user ? (
              <div>
                <Dropdown
                  overlay={userMenu}
                  trigger={["click"]}
                  open={isUserDropdownOpen}
                  onOpenChange={setIsUserDropdownOpen}
                >
                  <Button
                    type="text"
                    className="action-button"
                    title="User Menu"
                  >
                    <User className="icon" />
                  </Button>
                </Dropdown>
                {/* Shopping Cart */}
                <Button
                  type="text"
                  className="action-button cart-button"
                  onClick={handleCartClick}
                  title="Shopping Cart"
                >
                  <ShoppingBag className="icon" />
                  <span className="cart-badge">3</span>
                </Button>
              </div>
            ) : (
              // Not logged in - Show login/register buttons
              <div className="auth-buttons">
                <Button
                  type="text"
                  className="auth-button login-button"
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  className="auth-button register-button"
                  onClick={handleRegisterClick}
                >
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              type="text"
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="icon" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">Menu</h2>
              <Button
                type="text"
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="icon" />
              </Button>
            </div>

            <div className="mobile-menu-body">
              {/* Mobile Search */}
              <div className="mobile-search">
                <Input
                  prefix={<Search className="search-icon" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={handleSearch}
                  placeholder="Search for trendy styles..."
                  className="search-input"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="mobile-nav">
                {navItems.map((item) => (
                  <Button
                    key={item.key}
                    type="text"
                    className="mobile-nav-button"
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="mobile-user-actions">
                <Button
                  type="text"
                  className="mobile-action-button"
                  onClick={handleFavoritesClick}
                >
                  <Heart className="icon" />
                  Favorites
                </Button>

                {user ? (
                  // Logged in mobile view
                  <>
                    {getUserMenuItems().map((item) => (
                      <Button
                        key={item.key}
                        type="text"
                        className="mobile-action-button"
                        onClick={() => handleUserMenuClick({ key: item.key })}
                      >
                        <User className="icon" />
                        {item.label}
                      </Button>
                    ))}
                    {/* Mobile Cart Button */}
                    <Button
                      type="text"
                      className="mobile-action-button"
                      onClick={handleCartClick}
                    >
                      <ShoppingBag className="icon" />
                      Shopping Cart
                      <span className="cart-badge">3</span>
                    </Button>
                  </>
                ) : (
                  // Not logged in mobile view
                  <div className="mobile-auth-buttons">
                    <Button
                      type="text"
                      className="mobile-action-button"
                      onClick={handleLoginClick}
                    >
                      <User className="icon" />
                      Đăng nhập
                    </Button>
                    <Button
                      type="primary"
                      className="mobile-action-button register-button"
                      onClick={handleRegisterClick}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
