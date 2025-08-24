import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";

const ProductGrid = ({ products = [], loading = false }) => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState({});

  // Transform server data to match expected format
  const transformProduct = (product) => ({
    id: product.id,
    name: product.name || product.title,
    price: product.price,
    originalPrice: product.originalPrice || product.discountPrice || null,
    image: Array.isArray(product.images) ? product.images[0] : product.images,
    badge: product.badge || product.status || "New",
    rating: product.rating || 4.5,
    brand: product.brand,
  });

  // Lấy customerId từ localStorage hoặc session
  const getCustomerId = () => {
    return parseInt(localStorage.getItem("customerId")) || 1;
  };

  // Load danh sách favourites của user
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/favourites?customerId=${getCustomerId()}`
        );
        if (response.ok) {
          const favouriteData = await response.json();
          setFavourites(favouriteData.map((item) => item.productId));
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    fetchFavourites();
  }, []);

  // Kiểm tra sản phẩm có trong danh sách yêu thích không
  const isFavourite = (productId) => {
    return favourites.includes(parseInt(productId));
  };

  // Format giá tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý thêm/xóa yêu thích
  const handleFavouriteToggle = async (e, product) => {
    e.stopPropagation(); // Ngăn không cho navigate khi click vào heart

    const productId = parseInt(product.id);
    const customerId = getCustomerId();

    setLoadingFavourites((prev) => ({ ...prev, [productId]: true }));

    try {
      if (isFavourite(productId)) {
        // Xóa khỏi favourites
        const favouriteResponse = await fetch(
          `http://localhost:9000/favourites?customerId=${customerId}&productId=${productId}`
        );
        const existingFavourites = await favouriteResponse.json();

        if (existingFavourites.length > 0) {
          const deleteResponse = await fetch(
            `http://localhost:9000/favourites/${existingFavourites[0].id}`,
            {
              method: "DELETE",
            }
          );

          if (deleteResponse.ok) {
            setFavourites((prev) => prev.filter((id) => id !== productId));
          }
        }
      } else {
        // Thêm vào favourites
        const favouriteItem = {
          customerId,
          productId,
          addedAt: new Date().toISOString(),
          productName: product.name,
          productImage: product.image,
          productPrice: product.price,
          originalPrice: product.originalPrice,
          brand: product.brand,
        };

        const response = await fetch("http://localhost:9000/favourites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favouriteItem),
        });

        if (response.ok) {
          setFavourites((prev) => [...prev, productId]);
        }
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    } finally {
      setLoadingFavourites((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Navigate đến trang chi tiết sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/san-pham/${productId}`);
  };
  const handleViewAllClick = () => {
    navigate("/san-pham");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="product-section">
        <div className="product-container">
          <div className="product-header">
            <h2 className="product-title">Trending Now</h2>
            <p className="product-description">Loading products...</p>
          </div>
          <div className="loading-spinner">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-section">
      <div className="product-container">
        <div className="product-header">
          <h2 className="product-title">Sản phẩm</h2>
          <p className="product-description">
            Discover what's hot in fashion right now
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => {
            const transformedProduct = transformProduct(product);
            const productId = parseInt(transformedProduct.id);
            const isProductFavourite = isFavourite(productId);
            const isLoadingFav = loadingFavourites[productId];

            return (
              <div
                key={transformedProduct.id}
                className="product-card"
                onClick={() => handleProductClick(transformedProduct.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image-container">
                  <img
                    src={transformedProduct.image}
                    alt={transformedProduct.name}
                    className="product-image"
                  />
                  <div className="product-actions">
                    <button
                      className={`action-btn ${
                        isProductFavourite ? "favourite" : ""
                      }`}
                      title={
                        isProductFavourite
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      onClick={(e) =>
                        handleFavouriteToggle(e, transformedProduct)
                      }
                      disabled={isLoadingFav}
                    >
                      {isLoadingFav ? (
                        <div className="loading-heart">⏳</div>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={isProductFavourite ? "red" : "none"}
                          stroke={isProductFavourite ? "red" : "currentColor"}
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{transformedProduct.name}</h3>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < Math.floor(transformedProduct.rating)
                              ? "filled"
                              : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">
                      ({transformedProduct.rating})
                    </span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">
                      {formatPrice(transformedProduct.price)}
                    </span>
                    {transformedProduct.originalPrice && (
                      <span className="original-price">
                        {formatPrice(transformedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="product-footer">
          <button className="view-all-btn" onClick={handleViewAllClick}>
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
