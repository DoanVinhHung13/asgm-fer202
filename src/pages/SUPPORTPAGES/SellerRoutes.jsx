// src/pages/SUPPORTPAGES/SellerRoutes.js
import { Layout } from "antd";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ROUTER from "../../router/ROUTER";

const SellerRoutes = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || user?.role !== "seller") {
    return <Navigate to={ROUTER.DANG_NHAP} replace />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <SellerSidebar /> */}
      <Layout>
        {/* <SellerHeader /> */}
        <Layout.Content
          style={{ margin: "24px 16px", padding: 24, background: "#fff" }}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default SellerRoutes;
