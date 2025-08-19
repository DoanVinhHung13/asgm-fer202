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
    const params = searchParams.toString();
    navigate(params ? `/?${params}` : "/");
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
    if (!product) return null;

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
  };

  const handleSizeChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (change) => {
    if (!selectedVariant) return;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    // Add to cart logic here
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  // Update page title
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
              <div className="product-brand">{product.brand}</div>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating-detail">
                <div className="stars">{renderRating()}</div>
                <span className="rating-number">{product.rating}</span>
                <span className="review-count">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>

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

              <div className="product-description">
                <p>{product.description}</p>
              </div>

              {/* Color Selection */}
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
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Thêm vào giỏ hàng
                </button>
                <button
                  className="buy-now-btn"
                  disabled={!selectedVariant || selectedVariant.stock === 0}
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
                  <div className="meta-item">
                    <span className="meta-label">Danh mục:</span>
                    <span className="meta-value">ID {product.categoryId}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Giới tính:</span>
                    <span className="meta-value">{product.gender}</span>
                  </div>
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
