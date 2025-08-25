import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import ROUTER from "../../../router/ROUTER";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Giỏ hàng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [updatingItemId, setUpdatingItemId] = useState(null); // Đang cập nhật số lượng

  // Form thông tin giao hàng
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const navigate = useNavigate();

  // Lấy customerId từ localStorage
  const getCustomerId = () => parseInt(localStorage.getItem("customerId")) || 1;

  // Gọi API lấy danh sách giỏ hàng
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:9000/cart?customerId=${getCustomerId()}`
        );
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          alert("Không thể lấy giỏ hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Định dạng giá VND
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Tăng/giảm số lượng sản phẩm
  const handleQuantityChange = async (
    itemId,
    currentQuantity,
    change,
    stock
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1 || newQuantity > stock) return;

    setUpdatingItemId(itemId);

    try {
      const response = await fetch(`http://localhost:9000/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: newQuantity,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert("Không cập nhật được số lượng.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Xóa sản phẩm khỏi giỏ
  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;

    try {
      const response = await fetch(`http://localhost:9000/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      } else {
        alert("Không thể xóa sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  // Tổng tiền
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    if (!recipientName || !recipientPhone || !shippingAddress) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn thanh toán đơn hàng này?")) return;

    try {
      // Tạo đơn hàng
      const orderResponse = await fetch("http://localhost:9000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: getCustomerId(),
          items: cartItems,
          recipientName,
          recipientPhone,
          shippingAddress,
          total: totalAmount,
          status: "pending", // Trạng thái chờ xử lý
          createdAt: new Date().toISOString(),
        }),
      });

      if (orderResponse.ok) {
        // Xoá giỏ hàng từng item
        await Promise.all(
          cartItems.map((item) =>
            fetch(`http://localhost:9000/cart/${item.id}`, { method: "DELETE" })
          )
        );

        alert("Thanh toán thành công. Đơn hàng đang chờ xử lý.");
        navigate(ROUTER.HOME); // Điều hướng tới trang đơn hàng
      } else {
        alert("Không thể thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
    }
  };

  // Hiển thị khi đang loading
  if (loading) {
    return (
      <div className="cart-loading">
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // Nếu giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Giỏ hàng trống</h2>
        <button className="back-to-shop-btn" onClick={() => navigate("/")}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.productImage} alt={item.productName} />
            <div className="cart-item-info">
              <h3>{item.productName}</h3>
              <p>Màu: {item.variantColor}</p>
              <p>Kích thước: {item.variantSize}</p>
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

      {/* Form nhập thông tin giao hàng */}
      <div className="checkout-info">
        <h2>Thông tin giao hàng</h2>
        <input
          type="text"
          placeholder="Tên người nhận"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
        />
        <textarea
          placeholder="Địa chỉ giao hàng"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />
      </div>

      <div className="cart-summary">
        <h2>Tổng thanh toán: {formatPrice(totalAmount)}</h2>
        <button className="checkout-btn" onClick={handleCheckout}>
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
