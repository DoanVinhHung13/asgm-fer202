import {
  Button,
  Card,
  Col,
  Drawer,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Tag,
} from "antd";
import { Filter, Grid, Heart, List } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ProductListing.css";

const { Option } = Select;
const { Meta } = Card;

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();

  const getCurrentRouteConfig = () => {
    const pathname = location.pathname;

    const routeConfig = {
      "/quan": {
        title: "Quần Thời Trang",
        subtitle: "Các loại quần thời trang nam nữ",
        categoryId: 2, // Based on your database
        breadcrumb: ["Trang chủ", "Quần Thời Trang"],
      },
      "/ao": {
        title: "Áo Thời Trang",
        subtitle: "Các loại áo thời trang nam nữ",
        categoryId: 1, // Based on your database
        breadcrumb: ["Trang chủ", "Áo Thời Trang"],
      },
      "/giay": {
        title: "Giày",
        subtitle: "Giày thời trang",
        categoryId: 4, // Based on your database
        breadcrumb: ["Trang chủ", "Giày"],
      },
      "/phu-kien": {
        title: "Phụ Kiện",
        subtitle: "Phụ kiện thời trang",
        categoryId: 3, // Based on your database
        breadcrumb: ["Trang chủ", "Phụ Kiện"],
      },
      "/new-arrivals": {
        title: "Hàng Mới Về",
        subtitle: "Khám phá những sản phẩm mới nhất",
        apiFilter: "sortBy=newest",
        breadcrumb: ["Trang chủ", "Hàng Mới Về"],
      },
      "/women": {
        title: "Thời Trang Nữ",
        subtitle: "Bộ sưu tập dành cho phái nữ",
        apiFilter: "gender=women",
        breadcrumb: ["Trang chủ", "Thời Trang Nữ"],
      },
      "/men": {
        title: "Thời Trang Nam",
        subtitle: "Bộ sưu tập dành cho phái nam",
        apiFilter: "gender=men",
        breadcrumb: ["Trang chủ", "Thời Trang Nam"],
      },
      "/accessories": {
        title: "Phụ Kiện",
        subtitle: "Phụ kiện thời trang cao cấp",
        categoryId: 3,
        breadcrumb: ["Trang chủ", "Phụ Kiện"],
      },
      "/sale": {
        title: "Khuyến Mãi",
        subtitle: "Sản phẩm giảm giá hấp dẫn",
        apiFilter: "onSale=true",
        breadcrumb: ["Trang chủ", "Khuyến Mãi"],
      },
      "/summer-collection": {
        title: "Bộ Sưu Tập Mùa Hè",
        subtitle: "Thời trang thoáng mát cho mùa hè",
        apiFilter: "collection=summer",
        breadcrumb: ["Trang chủ", "Bộ Sưu Tập Mùa Hè"],
      },
      "/search": {
        title: "Kết Quả Tìm Kiếm",
        subtitle: "Sản phẩm phù hợp với từ khóa của bạn",
        apiFilter: "",
        breadcrumb: ["Trang chủ", "Tìm Kiếm"],
      },
    };

    return (
      routeConfig[pathname] || {
        title: "Tất Cả Sản Phẩm",
        subtitle: "Khám phá toàn bộ bộ sưu tập",
        apiFilter: "",
        breadcrumb: ["Trang chủ", "Sản Phẩm"],
      }
    );
  };

  const currentCategory = getCurrentRouteConfig();

  // Mock data for filters - will be replaced with API data
  const brands = ["Nike", "Adidas", "Puma", "Converse", "Vans"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    "Đỏ",
    "Xanh dương",
    "Xanh lá",
    "Vàng",
    "Đen",
    "Trắng",
    "Hồng",
  ];

  // Fetch products based on category
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:9000/products?status=active";

      if (currentCategory.categoryId) {
        url += `&categoryId=${currentCategory.categoryId}`;
      }
      if (currentCategory.apiFilter) {
        url += `&${currentCategory.apiFilter}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log("Fetched products:", data);

      const transformedProducts =
        data?.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : `https://picsum.photos/300/300?random=${product.id}`,
          brand: "StyleHub", // Default brand, can be extended
          //   rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating
          //   reviewCount: Math.floor(Math.random() * 500) + 10, // Mock reviews

          colors: product.variants
            ?.map((v) => v.color)
            .filter((color, index, self) => self.indexOf(color) === index) || [
            "Đen",
          ],
          sizes: product.variants
            ?.map((v) => v.size)
            .filter((size, index, self) => self.indexOf(size) === index) || [
            "M",
          ],
          categoryId: product.categoryId,
          variants: product.variants || [],
          stock:
            product.variants?.reduce(
              (total, variant) => total + variant.stock,
              0
            ) || 0,
        })) || [];

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
      console.log("Transformed products:", transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to mock data if API fails
      const mockProducts = generateMockProducts();
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock products for demonstration (fallback)
  const generateMockProducts = () => {
    const mockProducts = [];
    for (let i = 1; i <= 12; i++) {
      mockProducts.push({
        id: i,
        name: `${currentCategory.title} ${i}`,
        price: Math.floor(Math.random() * 2000000) + 300000,
        originalPrice: Math.floor(Math.random() * 2500000) + 500000,
        image: `/img/${
          currentCategory.categoryId === 1
            ? "ao_thun_1.avif"
            : currentCategory.categoryId === 2
            ? "quan1.avif"
            : "accessories.avif"
        }`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500) + 10,
        isNew: Math.random() > 0.7,
        isSale: Math.random() > 0.6,
        colors: colors.slice(0, Math.floor(Math.random() * 4) + 1),
        sizes: sizes.slice(0, Math.floor(Math.random() * 6) + 2),
        categoryId: currentCategory.categoryId || 1,
        stock: Math.floor(Math.random() * 100) + 10,
      });
    }
    return mockProducts;
  };

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter (if implemented)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Size filter - check if product has selected sizes in variants
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size) => selectedSizes.includes(size))
      );
    }

    // Color filter - check if product has selected colors in variants
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) => selectedColors.includes(color))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [
    products,
    priceRange,
    selectedBrands,
    selectedSizes,
    selectedColors,
    sortBy,
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleProductClick = (product) => {
    navigate(`/san-pham/${product.id}`);
  };

  const handleFilterChange = (type, values) => {
    switch (type) {
      case "brands":
        setSelectedBrands(values);
        break;
      case "sizes":
        setSelectedSizes(values);
        break;
      case "colors":
        setSelectedColors(values);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 5000000]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const FilterSection = () => (
    <div className="filter-section">
      <div className="filter-header">
        <h3>Bộ lọc</h3>
        <Button type="text" onClick={clearAllFilters} size="small">
          Xóa tất cả
        </Button>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4>Khoảng giá</h4>
        <Slider
          range
          min={0}
          max={5000000}
          step={100000}
          value={priceRange}
          onChange={setPriceRange}
          tooltip={{
            formatter: (value) => formatPrice(value),
          }}
        />
        <div className="price-range-display">
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <h4>Thương hiệu</h4>
        <div className="checkbox-group">
          {brands.map((brand) => (
            <label key={brand} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(
                      selectedBrands.filter((b) => b !== brand)
                    );
                  }
                }}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="filter-group">
        <h4>Kích cỡ</h4>
        <div className="size-options">
          {sizes.map((size) => (
            <Button
              key={size}
              size="small"
              type={selectedSizes.includes(size) ? "primary" : "default"}
              onClick={() => {
                if (selectedSizes.includes(size)) {
                  setSelectedSizes(selectedSizes.filter((s) => s !== size));
                } else {
                  setSelectedSizes([...selectedSizes, size]);
                }
              }}
              className="size-button"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <Card
      hoverable
      className="product-card"
      cover={
        <div className="product-image-container">
          <img
            alt={product.name}
            src={product.image}
            className="product-image"
            onError={(e) => {
              e.target.src = `https://picsum.photos/300/300?random=${product.id}`;
            }}
          />
          <div className="product-overlay">
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product);
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              type="text"
              size="small"
              icon={<Heart />}
              className="favorite-button"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {product.isNew && (
            <Tag color="green" className="product-tag">
              Mới
            </Tag>
          )}
          {product.isSale && (
            <Tag color="red" className="product-tag sale-tag">
              Giảm giá
            </Tag>
          )}
          {product.stock === 0 && (
            <Tag color="default" className="product-tag out-of-stock">
              Hết hàng
            </Tag>
          )}
        </div>
      }
      onClick={() => handleProductClick(product)}
    >
      <Meta
        title={product.name}
        description={
          <div className="product-info">
            <div className="product-brand">{product.brand}</div>
            <div className="product-description">{product.description}</div>
            <div className="product-price">
              <span className="current-price">
                {formatPrice(product.price)}
              </span>
              {product.isSale && (
                <span className="original-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="product-rating">
              ⭐ {product.rating} ({product.reviewCount} đánh giá)
            </div>
            {product.colors && product.colors.length > 0 && (
              <div className="product-variants">
                <div className="product-colors">
                  <span className="variant-label">Màu: </span>
                  {product.colors.slice(0, 3).map((color, index) => (
                    <Tag key={index} size="small" className="color-tag">
                      {color}
                    </Tag>
                  ))}
                  {product.colors.length > 3 && (
                    <span className="more-variants">
                      +{product.colors.length - 3}
                    </span>
                  )}
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="product-sizes">
                    <span className="variant-label">Size: </span>
                    {product.sizes.slice(0, 4).map((size, index) => (
                      <Tag key={index} size="small" className="size-tag">
                        {size}
                      </Tag>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="more-variants">
                        +{product.sizes.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">Còn {product.stock} sản phẩm</span>
              ) : (
                <span className="out-of-stock">Hết hàng</span>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="product-listing">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        {currentCategory.breadcrumb.map((item, index) => (
          <span key={index}>
            {index > 0 && " / "}
            {index === 0 ? (
              <span
                onClick={() => navigate("/")}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {item}
              </span>
            ) : (
              <span>{item}</span>
            )}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="listing-header">
        <div className="header-content">
          <h1>{currentCategory.title}</h1>
          <p>{currentCategory.subtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="listing-controls">
        <div className="controls-left">
          <Button
            icon={<Filter />}
            onClick={() => setFilterDrawerOpen(true)}
            className="mobile-filter-button"
          >
            Bộ lọc
          </Button>
          <span className="results-count">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        <div className="controls-right">
          <Space>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 200 }}
              placeholder="Sắp xếp theo"
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="price-low">Giá thấp đến cao</Option>
              <Option value="price-high">Giá cao đến thấp</Option>
              <Option value="name">Tên A-Z</Option>
            </Select>

            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="grid">
                <Grid size={16} />
              </Radio.Button>
              <Radio.Button value="list">
                <List size={16} />
              </Radio.Button>
            </Radio.Group>
          </Space>
        </div>
      </div>

      <div className="listing-content">
        {/* Desktop Filters */}
        <div className="desktop-filters">
          <FilterSection />
        </div>

        {/* Products Grid */}
        <div className="products-container">
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col
                key={product.id}
                xs={12}
                sm={12}
                md={viewMode === "grid" ? 8 : 24}
                lg={viewMode === "grid" ? 6 : 24}
                xl={viewMode === "grid" ? 6 : 24}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              <Button onClick={clearAllFilters}>Xóa bộ lọc</Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc sản phẩm"
        placement="left"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={300}
      >
        <FilterSection />
      </Drawer>
    </div>
  );
};

export default ProductListing;
