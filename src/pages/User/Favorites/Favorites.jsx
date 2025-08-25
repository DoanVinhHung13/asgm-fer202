import { useEffect, useState } from "react";
import "./Favorites.css";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const customerId = parseInt(localStorage.getItem("customerId")) || 1;

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:9000/favourites?customerId=${customerId}`
      );
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [customerId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi yêu thích?"))
      return;

    setDeletingId(id);
    try {
      const response = await fetch(`http://localhost:9000/favourites/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      } else {
        alert("Xóa sản phẩm yêu thích thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
      alert("Đã có lỗi xảy ra khi xóa sản phẩm yêu thích.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return <p className="loading-text">Đang tải sản phẩm yêu thích...</p>;

  if (favorites.length === 0)
    return <p className="empty-text">Bạn chưa có sản phẩm yêu thích nào.</p>;

  return (
    <div className="favorite-container">
      <h2 className="favorite-title">Sản phẩm yêu thích</h2>
      <div className="favorite-list">
        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-item">
            <img
              src={fav.productImage}
              alt={fav.productName}
              className="favorite-item-image"
              loading="lazy"
            />
            <div className="favorite-item-info">
              <h3 className="favorite-item-name">{fav.productName}</h3>
              <p className="favorite-item-price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(fav.productPrice)}
              </p>
              {fav.originalPrice && (
                <p className="favorite-item-original-price">
                  Giá gốc:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(fav.originalPrice)}
                </p>
              )}
            </div>
            <button
              className="favorite-delete-btn"
              onClick={() => handleDelete(fav.id)}
              disabled={deletingId === fav.id}
              title="Xóa khỏi yêu thích"
            >
              {deletingId === fav.id ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
