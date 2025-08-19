import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ROUTER from "../../../router/ROUTER.js";
import ProductCard from "./components/ProductCard.jsx";
import ProductFilter from "./components/ProductFilter.jsx";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filters from URL
  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      gender: searchParams.get("gender") || "",
      minPrice: parseInt(searchParams.get("minPrice")) || 0,
      maxPrice: parseInt(searchParams.get("maxPrice")) || 1000000,
      sortBy: searchParams.get("sortBy") || "newest",
    }),
    [searchParams]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:9000/products?status=active"
      ).then((res) => res.json());
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:9000/categories").then(
        (res) => res.json()
      );
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (filters.category) {
      const categorySlug = filters.category;
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        filtered = filtered.filter(
          (product) => product.categoryId === category.id
        );
      }
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(
        (product) => product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(
        (product) =>
          product.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Sort
    switch (filters.sortBy) {
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return filtered;
  }, [filters, products, categories]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      // Only add non-empty filters to URL
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "" && value !== 0 && value !== 1000000) {
          if (key === "minPrice" || key === "maxPrice") {
            // Only add price params if they're not default values
            if (
              (key === "minPrice" && value !== 0) ||
              (key === "maxPrice" && value !== 1000000)
            ) {
              params.set(key, value.toString());
            }
          } else {
            params.set(key, value.toString());
          }
        }
      });

      // Update URL without page reload
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const handleProductClick = useCallback(
    (product) => {
      // Navigate to product detail with current filters preserved
      const currentParams = searchParams.toString();
      const detailUrl =
        ROUTER.SAN_PHAM +
        `/${product.id}${currentParams ? `?${currentParams}` : ""}`;
      navigate(detailUrl);
    },
    [navigate, searchParams]
  );

  // Get current category name for header
  const getCurrentCategoryName = () => {
    if (!filters.category) return "Tất cả sản phẩm";
    const category = categories.find((cat) => cat.slug === filters.category);
    return category ? category.name : "Sản phẩm";
  };

  return (
    <div className="product-list-container">
      <div className="container">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-md-3">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              products={products}
            />
          </div>

          {/* Product Grid */}
          <div className="col-md-9">
            <div className="products-header">
              <h2>
                {getCurrentCategoryName()} ({filteredProducts.length})
              </h2>
              {/* Breadcrumb */}
              <div className="breadcrumb-nav">
                <span
                  className="breadcrumb-item"
                  onClick={() =>
                    handleFilterChange({ ...filters, category: "" })
                  }
                >
                  Trang chủ
                </span>
                {filters.category && (
                  <>
                    <span className="breadcrumb-separator"> / </span>
                    <span className="breadcrumb-item active">
                      {getCurrentCategoryName()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="no-products">
                <div className="no-products-content">
                  <i className="fas fa-search fa-3x"></i>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>Không có sản phẩm nào phù hợp với bộ lọc của bạn.</p>
                  <button
                    className="reset-filters-btn"
                    onClick={() =>
                      handleFilterChange({
                        category: "",
                        brand: "",
                        gender: "",
                        minPrice: 0,
                        maxPrice: 1000000,
                        sortBy: "newest",
                      })
                    }
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoized ProductGrid component to prevent unnecessary re-renders
const ProductGrid = React.memo(({ products, onProductClick }) => {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
});

export default ProductList;
