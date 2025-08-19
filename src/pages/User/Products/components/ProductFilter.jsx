import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Radio,
  Select,
  Slider,
  Space,
  Typography,
} from "antd";
import React, { useMemo } from "react";

const { Title } = Typography;
const { Option } = Select;

const ProductFilter = ({
  filters,
  onFilterChange,
  categories,
  products,
  onReset,
}) => {
  // Handle individual filter changes
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    onFilterChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onReset
      ? onReset()
      : onFilterChange({
          category: "",
          brand: "",
          gender: "",
          minPrice: 0,
          maxPrice: 1000000,
          sortBy: "newest",
        });
  };

  // Get unique brands
  const brands = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...new Set(products.map((p) => p.brand))].sort();
  }, [products]);

  // Get unique genders
  const genders = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...new Set(products.map((p) => p.gender))].sort();
  }, [products]);

  return (
    <Card
      title={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={4} style={{ margin: 0 }}>
            Bộ lọc
          </Title>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={resetFilters}
            size="small"
          >
            Đặt lại
          </Button>
        </Space>
      }
      size="small"
      style={{ width: "100%" }}
    >
      {/* Sort */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Sắp xếp theo</Title>
        <Select
          value={filters.sortBy}
          onChange={(value) => handleFilterChange("sortBy", value)}
          style={{ width: "100%" }}
          size="middle"
        >
          <Option value="newest">Mới nhất</Option>
          <Option value="priceAsc">Giá thấp đến cao</Option>
          <Option value="priceDesc">Giá cao đến thấp</Option>
          <Option value="rating">Đánh giá cao nhất</Option>
        </Select>
      </div>

      <Divider />

      {/* Category */}
      {categories && categories.length > 0 && (
        <>
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Danh mục</Title>
            <Radio.Group
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Radio value="">Tất cả</Radio>
                {categories.map((category) => (
                  <Radio key={category.id} value={category.slug}>
                    {category.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
          <Divider />
        </>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <>
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Thương hiệu</Title>
            <Radio.Group
              value={filters.brand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Radio value="">Tất cả</Radio>
                {brands.map((brand) => (
                  <Radio key={brand} value={brand}>
                    {brand}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
          <Divider />
        </>
      )}

      {/* Gender */}
      {genders.length > 0 && (
        <>
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Giới tính</Title>
            <Radio.Group
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Radio value="">Tất cả</Radio>
                {genders.map((gender) => (
                  <Radio key={gender} value={gender}>
                    {gender}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
          <Divider />
        </>
      )}

      {/* Price Range */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Khoảng giá</Title>
        <Slider
          range
          min={0}
          max={1000000}
          step={10000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceRangeChange}
          style={{ margin: "16px 0" }}
          tooltip={{
            formatter: (value) => `${value.toLocaleString("vi-VN")} ₫`,
          }}
        />
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <span>{filters.minPrice.toLocaleString("vi-VN")} ₫</span>
          <span>{filters.maxPrice.toLocaleString("vi-VN")} ₫</span>
        </Space>
      </div>
    </Card>
  );
};

export default React.memo(ProductFilter);
