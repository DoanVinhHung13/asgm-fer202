// src/pages/ANONYMOUS/Home/index.js
import {
  EyeOutlined,
  FilterOutlined,
  HeartOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Image,
  Input,
  Rate,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import ROUTER from "../../../router/ROUTER";
import "./home.css";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:9000/products?status=active"
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/categories?status=active"
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getTotalStock = (variants) => {
    return variants?.reduce((total, variant) => total + variant.stock, 0) || 0;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Khác";
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.categoryId.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleAddToCart = async (product, variantId = null) => {
    if (!user) {
      navigate(ROUTER.DANG_NHAP);
      return;
    }

    try {
      const cartItem = {
        customerId: user.id,
        productId: product.id,
        variantId: variantId || product.variants[0]?.id,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        // message.success("Đã thêm vào giỏ hàng!")
        console.log("Added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const bannerData = [
    {
      id: 1,
      image:
        "https://via.placeholder.com/1200x400/1890ff/ffffff?text=Sale+50%25+All+Items",
      title: "Giảm giá 50% toàn bộ sản phẩm",
      description: "Khuyến mãi lớn cuối năm",
    },
    {
      id: 2,
      image:
        "https://via.placeholder.com/1200x400/52c41a/ffffff?text=New+Collection",
      title: "Bộ sưu tập mới 2024",
      description: "Xu hướng thời trang mới nhất",
    },
    {
      id: 3,
      image:
        "https://via.placeholder.com/1200x400/fa8c16/ffffff?text=Free+Shipping",
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng từ 500k",
    },
  ];

  return (
    <div className="home-page">
      {/* Banner Carousel */}
      <div className="banner-section">
        <Carousel autoplay effect="fade" dotPosition="bottom">
          {bannerData.map((banner) => (
            <div key={banner.id} className="banner-slide">
              <div
                className="banner-content"
                style={{
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div>
                  <Title level={1} style={{ color: "white", marginBottom: 8 }}>
                    {banner.title}
                  </Title>
                  <Paragraph style={{ color: "white", fontSize: 18 }}>
                    {banner.description}
                  </Paragraph>
                  <Button type="primary" size="large" style={{ marginTop: 16 }}>
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="container">
        {/* Categories Section */}
        <div className="categories-section">
          <Title level={3} className="section-title">
            Danh mục sản phẩm
          </Title>
          <Row gutter={[16, 16]}>
            {categories.map((category) => (
              <Col xs={12} sm={8} md={6} lg={4} key={category.id}>
                <Card
                  hoverable
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id.toString())}
                  cover={
                    <div className="category-image">
                      <Image
                        src={`https://via.placeholder.com/200x150/${Math.floor(
                          Math.random() * 16777215
                        ).toString(16)}/ffffff?text=${encodeURIComponent(
                          category.name
                        )}`}
                        alt={category.name}
                        preview={false}
                      />
                    </div>
                  }
                >
                  <Meta
                    title={category.name}
                    description={category.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* Filter and Search Section */}
        <div className="filter-section">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>

            <Col xs={12} md={6}>
              <Select
                placeholder="Chọn danh mục"
                allowClear
                size="large"
                style={{ width: "100%" }}
                value={selectedCategory}
                onChange={setSelectedCategory}
                suffixIcon={<FilterOutlined />}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} md={6}>
              <Select
                value={sortBy}
                size="large"
                style={{ width: "100%" }}
                onChange={setSortBy}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="price_asc">Giá thấp đến cao</Option>
                <Option value="price_desc">Giá cao đến thấp</Option>
                <Option value="name">Tên A-Z</Option>
              </Select>
            </Col>

            <Col xs={24} md={4}>
              <Text strong>
                Tìm thấy {filteredAndSortedProducts.length} sản phẩm
              </Text>
            </Col>
          </Row>
        </div>

        {/* Products Section */}
        <div className="products-section">
          <Title level={3} className="section-title">
            Sản phẩm nổi bật
          </Title>

          <Spin spinning={loading}>
            <Row gutter={[16, 24]}>
              {filteredAndSortedProducts.map((product) => {
                const discount = calculateDiscount(
                  product.originalPrice,
                  product.price
                );
                const totalStock = getTotalStock(product.variants);

                return (
                  <Col xs={12} sm={8} md={6} lg={6} xl={4} key={product.id}>
                    <Badge.Ribbon
                      text={discount > 0 ? `-${discount}%` : ""}
                      color="red"
                      style={{ display: discount > 0 ? "block" : "none" }}
                    >
                      <Card
                        hoverable
                        className="product-card"
                        cover={
                          <div className="product-image-container">
                            <Image
                              src={
                                product.images?.[0] ||
                                "https://via.placeholder.com/300x300"
                              }
                              alt={product.name}
                              preview={false}
                              className="product-image"
                            />
                            <div className="product-overlay">
                              <Space>
                                <Button
                                  type="primary"
                                  shape="circle"
                                  icon={<EyeOutlined />}
                                  onClick={() =>
                                    navigate(
                                      ROUTER.CHI_TIET_SAN_PHAM.replace(
                                        ":id",
                                        product.id
                                      )
                                    )
                                  }
                                />
                                <Button
                                  type="default"
                                  shape="circle"
                                  icon={<HeartOutlined />}
                                />
                              </Space>
                            </div>
                          </div>
                        }
                        actions={[
                          <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            disabled={totalStock === 0}
                            onClick={() => handleAddToCart(product)}
                            style={{ width: "90%" }}
                          >
                            {totalStock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                          </Button>,
                        ]}
                      >
                        <div className="product-info">
                          <Tag color="blue" className="category-tag">
                            {getCategoryName(product.categoryId)}
                          </Tag>

                          <Title
                            level={5}
                            className="product-name"
                            ellipsis={{ rows: 2 }}
                          >
                            {product.name}
                          </Title>

                          <div className="product-rating">
                            <Rate
                              disabled
                              defaultValue={4.5}
                              style={{ fontSize: 12 }}
                            />
                            <Text
                              type="secondary"
                              style={{ fontSize: 12, marginLeft: 8 }}
                            >
                              (128 đánh giá)
                            </Text>
                          </div>

                          <div className="product-price">
                            <Text strong className="current-price">
                              {formatCurrency(product.price)}
                            </Text>
                            {product.originalPrice > product.price && (
                              <Text
                                delete
                                type="secondary"
                                className="original-price"
                              >
                                {formatCurrency(product.originalPrice)}
                              </Text>
                            )}
                          </div>

                          <div className="product-stock">
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Còn lại: <Text strong>{totalStock}</Text> sản phẩm
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  </Col>
                );
              })}
            </Row>
          </Spin>

          {filteredAndSortedProducts.length === 0 && !loading && (
            <div className="no-products">
              <Title level={4} type="secondary">
                Không tìm thấy sản phẩm nào
              </Title>
              <Text type="secondary">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </Text>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="load-more-section">
            <Button type="default" size="large">
              Xem thêm sản phẩm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
