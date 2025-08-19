import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./components/ProductCard.jsx";
import ProductFilter from "./components/ProductFilter.jsx";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filters from URL - parse một lần
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:9000/products?status=active").then((res) =>
            res.json()
          ),
          fetch("http://localhost:9000/categories").then((res) => res.json()),
        ]);

        setProducts(productsRes || []);
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (loading || !products.length) return [];
    let result = [...products];

    if (filters.category && categories.length > 0) {
      const category = categories.find((cat) => cat.slug === filters.category);

      if (category) {
        result = result.filter((product) => product.categoryId == category.id);
        console.log("category", category);
      } else {
        return [];
      }
    }

    if (filters.brand) {
      result = result.filter(
        (product) => product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    if (filters.gender) {
      result = result.filter(
        (product) =>
          product.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    result = result.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    const sortFunctions = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    };

    if (sortFunctions[filters.sortBy]) {
      result.sort(sortFunctions[filters.sortBy]);
    }

    return result;
  }, [products, categories, filters, loading]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        // Chỉ add param nếu không phải giá trị mặc định
        if (value && value !== "") {
          if (key === "minPrice" && value !== 0) {
            params.set(key, value);
          } else if (key === "maxPrice" && value !== 1000000) {
            params.set(key, value);
          } else if (key !== "minPrice" && key !== "maxPrice") {
            params.set(key, value);
          }
        }
      });

      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Handle product click
  const handleProductClick = useCallback(
    (product) => {
      navigate(`/san-pham/${product.id}`);
    },
    [navigate]
  );

  // Get category name for display
  const getCurrentCategoryName = useCallback(() => {
    if (!filters.category) return "Tất cả sản phẩm";
    const category = categories.find((cat) => cat.slug === filters.category);
    return category ? category.name : "Tất cả sản phẩm";
  }, [filters.category, categories]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="product-list-container">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

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
              onReset={resetFilters}
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
                  className="breadcrumb-item clickable"
                  onClick={resetFilters}
                  style={{ cursor: "pointer" }}
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

            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />
            ) : (
              <div className="no-products">
                <div className="no-products-content">
                  <i className="fas fa-search fa-3x"></i>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>Không có sản phẩm nào phù hợp với bộ lọc của bạn.</p>
                  <button className="reset-filters-btn" onClick={resetFilters}>
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

// ProductGrid component
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
