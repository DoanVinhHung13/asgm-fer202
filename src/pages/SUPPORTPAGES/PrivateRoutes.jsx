// src/pages/SUPPORTPAGES/PrivateRoutes.js
import { Layout } from "antd";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import ROUTER from "../../../router/ROUTER";

const PrivateRoutes = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to={ROUTER.DANG_NHAP} replace />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Header /> */}
      <Layout.Content style={{ padding: "20px" }}>
        <Outlet />
      </Layout.Content>
      {/* <Footer /> */}
    </Layout>
  );
};

export default PrivateRoutes;
