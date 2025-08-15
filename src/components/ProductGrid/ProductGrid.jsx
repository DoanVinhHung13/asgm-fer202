import "./ProductGrid.css";

const ProductGrid = ({ products = [], loading = false }) => {
  // Transform server data to match expected format
  const transformProduct = (product) => ({
    id: product.id,
    name: product.name || product.title,
    price: product.price,
    originalPrice: product.originalPrice || product.discountPrice || null,
    image: product.images,
    badge: product.badge || product.status || "New",
    rating: product.rating || 4.5,
  });

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
          <h2 className="product-title">Trending Now</h2>
          <p className="product-description">
            Discover what's hot in fashion right now
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => {
            const transformedProduct = transformProduct(product);
            return (
              <div key={transformedProduct.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={transformedProduct.image}
                    alt={transformedProduct.name}
                    className="product-image"
                  />
                  <div className="product-actions">
                    <button className="action-btn" title="Add to wishlist">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <button className="action-btn" title="Add to cart">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
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
                      ${transformedProduct.price}
                    </span>
                    {transformedProduct.originalPrice && (
                      <span className="original-price">
                        ${transformedProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="product-footer">
          <button className="view-all-btn">View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
