// src/pages/SUPPORTPAGES/PublicRouters.js
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const PublicRouters = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout.Content style={{ padding: "20px" }}>
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

export default PublicRouters;
