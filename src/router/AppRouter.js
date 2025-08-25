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

// const Register = React.lazy(() => import("src/pages/ANONYMOUS/Register"));

// Private Pages
const PrivateRouters = React.lazy(() =>
  import("../pages/SUPPORTPAGES/PrivateRouters")
);

const SellerRoutes = React.lazy(() =>
  import("../pages/SUPPORTPAGES/SellerRoutes")
);

const OrderHistory = React.lazy(() =>
  import("../pages/User/OrderHistory/OderHistory")
);
const Cart = React.lazy(() => import("../pages/User/Cart/Cart"));

const ProductDetail = React.lazy(() =>
  import("../pages/User/Products/components/ProductDetail")
);

const Profile = React.lazy(() => import("../pages/User/Profile/Profile"));

const Favorites = React.lazy(() => import("../pages/User/Favorites/Favorites"));

//Seller
const SellerDashboard = React.lazy(() =>
  import("../pages/Sellers/SellerDashboard")
);
const ManagerList = React.lazy(() =>
  import("../pages/Sellers/Employee/ManagerList")
);
const CreateManager = React.lazy(() =>
  import("../pages/Sellers/Employee/CreateManager")
);
const ProductManagement = React.lazy(() =>
  import("../pages/Sellers/Products/ProductManagement")
);
const OrderManagement = React.lazy(() =>
  import("../pages/Sellers/Orders/OrderManagement")
);
const VoucherManagement = React.lazy(() =>
  import("../pages/Sellers/Vouchers/VoucherManagement")
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
  // Private routes
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
      {
        path: ROUTER.GIO_HANG,
        element: (
          <LazyLoadingComponent>
            <Cart />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.LICH_SU_DON_HANG,
        element: (
          <LazyLoadingComponent>
            <OrderHistory />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.THONG_TIN_CA_NHAN,
        element: (
          <LazyLoadingComponent>
            <Profile />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.YEU_THICH,
        element: (
          <LazyLoadingComponent>
            <Favorites />
          </LazyLoadingComponent>
        ),
      },
    ],
  },
  // Seller routes
  {
    element: (
      <LazyLoadingComponent>
        <SellerRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.SELLER_DASHBOARD,
        element: (
          <LazyLoadingComponent>
            <SellerDashboard />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.THEM_SAN_PHAM,
        element: (
          <LazyLoadingComponent>
            <ManagerList />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.QUAN_LY_NHAN_VIEN,
        element: (
          <LazyLoadingComponent>
            <CreateManager />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.QUAN_LY_DON_HANG,
        element: (
          <LazyLoadingComponent>
            <OrderManagement />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.THEM_SAN_PHAM,
        element: (
          <LazyLoadingComponent>
            <ProductManagement />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.QUAN_LY_VOUCHER,
        element: (
          <LazyLoadingComponent>
            <VoucherManagement />
          </LazyLoadingComponent>
        ),
      },
      {
        path: "cai-dat",
        element: <div className="content-box">Cài đặt</div>,
      },
    ],
  },
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return renderRouter;
};

export default AppRouter;
