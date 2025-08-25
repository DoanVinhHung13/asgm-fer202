import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loadingFavourite, setLoadingFavourite] = useState(false);

  // ... (giữ nguyên các useEffect và functions khác)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:9000/products/${id}`);
        console.log("response", response);
        if (response.ok) {
          const productData = await response.json();
          console.log("productData", productData);
          setProduct(productData);
          setSelectedVariant(productData.variants[0]);

          // Check if product is in favourites
          await checkFavouriteStatus(productData.id);
        } else {
          // navigate("/404");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product?.originalPrice) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };

  const renderRating = () => {
    if (!product || !product.rating) return null;

    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - Math.ceil(product.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const getUniqueColors = () => {
    if (!product) return [];
    return [...new Set(product.variants.map((variant) => variant.color))];
  };

  const getSizesForColor = (color) => {
    if (!product) return [];
    return product.variants.filter((variant) => variant.color === color);
  };

  const handleColorChange = (color) => {
    const availableSizes = getSizesForColor(color);
    setSelectedVariant(availableSizes[0]);
    setQuantity(1);
  };

  const handleSizeChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    if (!selectedVariant) return;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  const getCustomerId = () => {
    return parseInt(localStorage.getItem("customerId")) || 1;
  };

  const checkFavouriteStatus = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/favourites?customerId=${getCustomerId()}&productId=${productId}`
      );
      if (response.ok) {
        const favouriteData = await response.json();
        setIsFavourite(favouriteData.length > 0);
      }
    } catch (error) {
      console.error("Error checking favourite status:", error);
    }
  };

  const handleFavouriteToggle = async () => {
    if (!product || loadingFavourite) return;

    const productId = parseInt(product.id);
    const customerId = getCustomerId();

    setLoadingFavourite(true);

    try {
      if (isFavourite) {
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
            setIsFavourite(false);
          }
        }
      } else {
        const favouriteItem = {
          customerId,
          productId,
          addedAt: new Date().toISOString(),
          productName: product.name,
          productImage: product.images[0],
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
          setIsFavourite(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoadingFavourite(false);
    }
  };

  const handleAddToCart = async (isBuyNow = false) => {
    if (!selectedVariant || selectedVariant.stock === 0 || addingToCart) return;

    setAddingToCart(true);
    try {
      const cartResponse = await fetch(
        `http://localhost:9000/cart?productId=${product.id}&variantId=${
          selectedVariant.id
        }&customerId=${getCustomerId()}`
      );
      const existingCartItems = await cartResponse.json();

      if (existingCartItems.length > 0) {
        const existingItem = existingCartItems[0];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > selectedVariant.stock) {
          if (!isBuyNow) {
            alert(
              `Chỉ còn ${selectedVariant.stock} sản phẩm trong kho. Bạn đã có ${existingItem.quantity} sản phẩm trong giỏ hàng.`
            );
          }
          return;
        }

        const updateResponse = await fetch(
          `http://localhost:9000/cart/${existingItem.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: newQuantity,
              updatedAt: new Date().toISOString(),
            }),
          }
        );

        if (updateResponse.ok) {
          if (!isBuyNow) {
            alert(
              `Đã cập nhật số lượng sản phẩm trong giỏ hàng! (Tổng: ${newQuantity})`
            );
          }
        } else {
          if (!isBuyNow) {
            throw new Error("Không thể cập nhật giỏ hàng");
          }
        }
      } else {
        const cartItem = {
          customerId: getCustomerId(),
          productId: parseInt(product.id),
          variantId: selectedVariant.id,
          quantity: quantity,
          addedAt: new Date().toISOString(),
          productName: product.name,
          productImage: product.images[0],
          productPrice: product.price,
          variantColor: selectedVariant.color,
          variantSize: selectedVariant.size,
          variantSku: selectedVariant.sku,
        };

        const response = await fetch("http://localhost:9000/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItem),
        });

        if (response.ok) {
          if (!isBuyNow) {
            alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
          }
        } else {
          if (!isBuyNow) {
            throw new Error("Không thể thêm vào giỏ hàng");
          }
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (!isBuyNow) {
        alert(
          "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."
        );
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    await handleAddToCart(true); // truyền true để không hiện alert
    navigate("/gio-hang"); // chuyển đến trang giỏ hàng
  };

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Shop`;
    }
    return () => {
      document.title = "Shop";
    };
  }, [product]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>Không tìm thấy sản phẩm</h2>
          <button onClick={handleBack} className="back-to-shop-btn">
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <button onClick={handleBack} className="back-btn">
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <div className="breadcrumb-path">
            <span onClick={handleBack} className="breadcrumb-link">
              Trang chủ
            </span>
            <span className="breadcrumb-separator"> / </span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>

        <div className="row">
          {/* Product Images */}
          <div className="col-md-6">
            <div className="product-images">
              <div className="main-image">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="main-product-image"
                />
                {getDiscountPercentage() > 0 && (
                  <div className="discount-badge">
                    -{getDiscountPercentage()}%
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="thumbnail-images">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <div className="product-detail-info">
              {/* Brand và Favourite với Flexbox */}
              <div className="brand-favourite-wrapper">
                {product.brand && (
                  <div className="product-brand">{product.brand}</div>
                )}
                <button
                  className={`favourite-btn-icon ${
                    isFavourite ? "favourite-active" : ""
                  }`}
                  onClick={handleFavouriteToggle}
                  disabled={loadingFavourite}
                  title={
                    isFavourite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                  }
                >
                  {loadingFavourite ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="loading-spinner-svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="31.4 31.4"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={isFavourite ? "red" : "none"}
                      stroke={isFavourite ? "red" : "currentColor"}
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}
                </button>
              </div>

              <h1 className="product-title">{product.name}</h1>

              {product.rating && (
                <div className="product-rating-detail">
                  <div className="stars">{renderRating()}</div>
                  <span className="rating-number">{product.rating}</span>
                  {product.reviewCount && (
                    <span className="review-count">
                      ({product.reviewCount} đánh giá)
                    </span>
                  )}
                </div>
              )}

              <div className="product-price-detail">
                <span className="current-price">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="original-price">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Color Selection */}
              {getUniqueColors().length > 1 && (
                <div className="variant-section">
                  <h4>Màu sắc:</h4>
                  <div className="color-options">
                    {getUniqueColors().map((color) => (
                      <button
                        key={color}
                        className={`color-btn ${
                          selectedVariant?.color === color ? "active" : ""
                        }`}
                        onClick={() => handleColorChange(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {selectedVariant && (
                <div className="variant-section">
                  <h4>Kích thước:</h4>
                  <div className="size-options">
                    {getSizesForColor(selectedVariant.color).map((variant) => (
                      <button
                        key={variant.id}
                        className={`size-btn ${
                          selectedVariant.id === variant.id ? "active" : ""
                        } ${variant.stock === 0 ? "disabled" : ""}`}
                        onClick={() => handleSizeChange(variant)}
                        disabled={variant.stock === 0}
                      >
                        {variant.size}
                        {variant.stock === 0 && (
                          <span className="sold-out">Hết hàng</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Info */}
              {selectedVariant && (
                <div className="stock-info">
                  <span>Còn lại: {selectedVariant.stock} sản phẩm</span>
                </div>
              )}

              {/* Quantity Selection */}
              {selectedVariant && (
                <div className="quantity-section">
                  <h4>Số lượng:</h4>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= selectedVariant.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant ||
                    selectedVariant.stock === 0 ||
                    addingToCart
                  }
                >
                  <i className="fas fa-shopping-cart"></i>
                  {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                </button>
                <button
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={
                    !selectedVariant ||
                    selectedVariant.stock === 0 ||
                    addingToCart
                  }
                >
                  Mua ngay
                </button>
              </div>

              {/* Product Meta */}
              {selectedVariant && (
                <div className="product-meta-detail">
                  <div className="meta-item">
                    <span className="meta-label">SKU:</span>
                    <span className="meta-value">{selectedVariant.sku}</span>
                  </div>
                  {product.categoryId && (
                    <div className="meta-item">
                      <span className="meta-label">Danh mục:</span>
                      <span className="meta-value">
                        ID {product.categoryId}
                      </span>
                    </div>
                  )}
                  {product.gender && (
                    <div className="meta-item">
                      <span className="meta-label">Giới tính:</span>
                      <span className="meta-value">{product.gender}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
