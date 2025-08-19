import { Spin } from "antd";
import React from "react";
import { useRoutes } from "react-router-dom";
import ROUTER from "./ROUTER";

// Public Pages
const Home = React.lazy(() => import("../pages/SUPPORTPAGES/Home"));
const Login = React.lazy(() => import("../pages/SUPPORTPAGES/Login"));
const PublicRouters = React.lazy(() =>
  import("../pages/SUPPORTPAGES/PublicRouters")
);
const ProductList = React.lazy(() =>
  import("../pages/User/Products/ProductList")
);

// Private Pages
const PrivateRouters = React.lazy(() =>
  import("../pages/SUPPORTPAGES/PrivateRouters")
);
const ProductDetail = React.lazy(() =>
  import("../pages/User/Products/components/ProductDetail")
);
// const Cart = React.lazy(() => import("../pages/User/Cart"));

// const Orders = React.lazy(() => import("../pages/User/Orders"));
// const Favorites = React.lazy(() => import("../pages/Shopping/Favorites"));

// Seller Pages
const SellerRoutes = React.lazy(() =>
  import("../pages/SUPPORTPAGES/SellerRoutes")
);
const SellerDashboard = React.lazy(() =>
  import("../pages/Sellers/SellerDashboard")
);
const ManagerList = React.lazy(() =>
  import("../pages/Sellers/Employee/ManagerList")
);
const CreateManager = React.lazy(() =>
  import("../pages/Sellers/Employee/CreateManager")
);

function LazyLoadingComponent({ children }) {
  return (
    <React.Suspense
      fallback={
        <div className="loading-center" style={{ height: "100vh" }}>
          <Spin fullscreen />
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}

const routes = [
  // Public routes
  {
    element: (
      <LazyLoadingComponent>
        <PublicRouters />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.HOME,
        element: (
          <LazyLoadingComponent>
            <Home />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.DANG_NHAP,
        element: (
          <LazyLoadingComponent>
            <Login />
          </LazyLoadingComponent>
        ),
      },

      {
        path: ROUTER.SAN_PHAM,
        element: (
          <LazyLoadingComponent>
            <ProductList />
          </LazyLoadingComponent>
        ),
      },
    ],
  },
  {
    element: (
      <LazyLoadingComponent>
        <PrivateRouters />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.CHI_TIET_SAN_PHAM,
        element: (
          <LazyLoadingComponent>
            <ProductDetail />
          </LazyLoadingComponent>
        ),
      },
    ],
  },
  {
    element: (
      <LazyLoadingComponent>
        <SellerRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: "/manager-list",
        element: (
          <LazyLoadingComponent>
            <ManagerList />
          </LazyLoadingComponent>
        ),
      },
      {
        path: "/create-manager",
        element: (
          <LazyLoadingComponent>
            <CreateManager />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.SELLER_DASHBOARD,
        element: (
          <LazyLoadingComponent>
            <SellerDashboard />
          </LazyLoadingComponent>
        ),
      },

      {
        path: ROUTER.MY_SHOP,
        element: (
          <LazyLoadingComponent>
            <SellerDashboard />
          </LazyLoadingComponent>
        ),
      },
    ],
  },
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return renderRouter;
};

export default AppRouter;
