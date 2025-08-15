// src/pages/ANONYMOUS/Home/index.js
import { Card, Input, Select, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategorySection from "../../../components/CategorySection/CategorySection";
import HeroSection from "../../../components/HeroSection/HeroSection";
import ProductGrid from "../../../components/ProductGrid/ProductGrid";
import { AuthContext } from "../../../context/AuthContext";
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
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/categories?status=active"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="home-page">
      <main>
        <HeroSection />
        <CategorySection categories={categories} />
        <ProductGrid products={products} loading={loading} />
      </main>
    </div>
  );
};

export default Home;
