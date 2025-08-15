import { Spin } from "antd";
import React from "react";
import { useRoutes } from "react-router-dom";
import ROUTER from "./ROUTER";

// Common
const PublicRouters = React.lazy(() =>
  import("../pages/SUPPORTPAGES/PublicRouters")
);

// Anonymous
const Home = React.lazy(() => import("../pages/SUPPORTPAGES/Home"));
const Login = React.lazy(() => import("../pages/SUPPORTPAGES/Login"));

// Product Pages
const ProductListing = React.lazy(() =>
  import("../pages/User/Products/ProductListing")
);
// const ProductDetail = React.lazy(() =>
//   import("../pages/Products/ProductDetail")
// );
// const SearchResults = React.lazy(() =>
//   import("../pages/Products/SearchResults")
// );

// // Shopping Pages
// const Cart = React.lazy(() => import("../pages/Shopping/Cart"));
// const Checkout = React.lazy(() => import("../pages/Shopping/Checkout"));
// const Favorites = React.lazy(() => import("../pages/Shopping/Favorites"));

// // User Pages
// const Profile = React.lazy(() => import("../pages/User/Profile"));
// const Orders = React.lazy(() => import("../pages/User/Orders"));

// Seller
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

      // Product Category Routes - All use the same ProductListing component
      {
        path: ROUTER.QUAN,
        element: (
          <LazyLoadingComponent>
            <ProductListing />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.AO,
        element: (
          <LazyLoadingComponent>
            <ProductListing />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.GIAY,
        element: (
          <LazyLoadingComponent>
            <ProductListing />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.PHU_KIEN,
        element: (
          <LazyLoadingComponent>
            <ProductListing />
          </LazyLoadingComponent>
        ),
      },

      // // Product Detail Route
      // {
      //   path: ROUTER.CHI_TIET_SAN_PHAM,
      //   element: (
      //     <LazyLoadingComponent>
      //       <ProductDetail />
      //     </LazyLoadingComponent>
      //   ),
      // },

      // // Search Route
      // {
      //   path: ROUTER.TIM_KIEM,
      //   element: (
      //     <LazyLoadingComponent>
      //       <SearchResults />
      //     </LazyLoadingComponent>
      //   ),
      // },

      // // Shopping Routes (require authentication)
      // {
      //   path: ROUTER.GIO_HANG,
      //   element: (
      //     <LazyLoadingComponent>
      //       <Cart />
      //     </LazyLoadingComponent>
      //   ),
      // },
      // {
      //   path: ROUTER.THANH_TOAN,
      //   element: (
      //     <LazyLoadingComponent>
      //       <Checkout />
      //     </LazyLoadingComponent>
      //   ),
      // },
      // {
      //   path: ROUTER.YEU_THICH,
      //   element: (
      //     <LazyLoadingComponent>
      //       <Favorites />
      //     </LazyLoadingComponent>
      //   ),
      // },

      // // User Routes
      // {
      //   path: ROUTER.PROFILE,
      //   element: (
      //     <LazyLoadingComponent>
      //       <Profile />
      //     </LazyLoadingComponent>
      //   ),
      // },
      // {
      //   path: ROUTER.ORDERS,
      //   element: (
      //     <LazyLoadingComponent>
      //       <Orders />
      //     </LazyLoadingComponent>
      //   ),
      // },
    ],
  },

  // Seller routes
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
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return renderRouter;
};

export default AppRouter;
