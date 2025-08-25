import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  // State lưu danh sách sản phẩm trong giỏ hàng
  const [cartItems, setCartItems] = useState([]);
  // State hiển thị loading khi đang lấy dữ liệu
  const [loading, setLoading] = useState(true);
  // State lưu id sản phẩm đang được cập nhật (để disable nút khi chờ phản hồi)
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const navigate = useNavigate();

  // Hàm lấy customerId từ localStorage (hoặc mặc định 1)
  const getCustomerId = () => {
    return parseInt(localStorage.getItem("customerId")) || 1;
  };

  // Khi component mount, gọi API để lấy danh sách sản phẩm trong giỏ hàng
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:9000/cart?customerId=${getCustomerId()}`
        );
        if (response.ok) {
          const data = await response.json();
          setCartItems(data); // Lưu dữ liệu lấy được vào state
        } else {
          alert("Lỗi khi lấy dữ liệu giỏ hàng.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Lỗi kết nối server.");
      } finally {
        setLoading(false); // Ẩn loading dù thành công hay lỗi
      }
    };

    fetchCartItems();
  }, []);

  // Hàm format giá tiền theo định dạng VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm xử lý tăng/giảm số lượng sản phẩm trong giỏ hàng
  const handleQuantityChange = async (
    itemId,
    currentQuantity,
    change,
    stock
  ) => {
    const newQuantity = currentQuantity + change;
    // Không cho số lượng < 1 hoặc vượt quá tồn kho
    if (newQuantity < 1 || newQuantity > stock) return;

    setUpdatingItemId(itemId); // Đánh dấu item đang được cập nhật (disable nút)

    try {
      // Gửi request cập nhật số lượng lên backend
      const response = await fetch(`http://localhost:9000/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: newQuantity,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Cập nhật lại state để UI tự động render lại
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert("Không thể cập nhật số lượng");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng.");
    } finally {
      setUpdatingItemId(null); // Bỏ đánh dấu đang cập nhật
    }
  };

  // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId) => {
    // Hiển thị popup xác nhận xóa
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"))
      return;

    try {
      // Gửi request xóa sản phẩm trên backend
      const response = await fetch(`http://localhost:9000/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Cập nhật lại state loại bỏ sản phẩm
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      } else {
        alert("Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  // Tính tổng tiền của tất cả sản phẩm trong giỏ hàng
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  // Hiển thị loading khi đang gọi API lấy dữ liệu giỏ hàng
  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // Nếu giỏ hàng trống, hiện thông báo và nút quay lại cửa hàng
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <button className="back-to-shop-btn" onClick={() => navigate("/")}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  // Hiển thị danh sách sản phẩm trong giỏ hàng
  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.productImage}
              alt={item.productName}
              className="cart-item-image"
            />
            <div className="cart-item-info">
              <h3>{item.productName}</h3>
              <p>Màu: {item.variantColor}</p>
              <p>Kích thước: {item.variantSize}</p>
              <p>SKU: {item.variantSku}</p>
              <p>Đơn giá: {formatPrice(item.productPrice)}</p>
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.quantity,
                      -1,
                      item.variantStock || 1000
                    )
                  }
                  disabled={item.quantity <= 1 || updatingItemId === item.id}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.quantity,
                      1,
                      item.variantStock || 1000
                    )
                  }
                  disabled={updatingItemId === item.id}
                >
                  +
                </button>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => handleRemoveItem(item.id)}
                disabled={updatingItemId === item.id}
              >
                Xóa
              </button>
            </div>
            <div className="cart-item-total">
              <strong>{formatPrice(item.productPrice * item.quantity)}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Tổng tiền và nút Thanh toán */}
      <div className="cart-summary">
        <h2>Tổng thanh toán: {formatPrice(totalAmount)}</h2>
        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
