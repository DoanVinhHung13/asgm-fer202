import { Layout, Spin } from "antd";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";
import ROUTER from "../../router/ROUTER";

const PrivateRoutes = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTER.DANG_NHAP} replace />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout.Content style={{ flex: 1 }}>
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};

export default PrivateRoutes;
