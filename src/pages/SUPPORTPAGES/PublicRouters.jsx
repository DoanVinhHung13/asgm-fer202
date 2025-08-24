import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const PublicRouters = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

export default PublicRouters;
