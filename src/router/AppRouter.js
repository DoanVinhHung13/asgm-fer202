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
// const Register = React.lazy(() => import("src/pages/ANONYMOUS/Register"));

// // Customer
// const ProductList = React.lazy(() => import("src/pages/CUSTOMER/ProductList"));
// Product Pages
const ProductListing = React.lazy(() =>
  import("../pages/User/Products/ProductListing")
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
// // User Pages
// const Profile = React.lazy(() => import("../pages/User/Profile"));
// const Orders = React.lazy(() => import("../pages/User/Orders"));



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
    path: "/seller",
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
        <SellerDashboard />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: "dashboard",
        element: <div className="content-box">Đây là trang Dashboard</div>,
      },
      {
      path: "tao-nhan-vien",   
      element: (
        <LazyLoadingComponent>
          <ManagerList />
        </LazyLoadingComponent>
      ),
    },
    {
      path: "tao-nhan-vien/create", 
      element: (
        <LazyLoadingComponent>
          <CreateManager />
        </LazyLoadingComponent>
      ),
    },
      {
        path: "quan-ly-don-hang",
        element: (
        <LazyLoadingComponent>
          <OrderManagement />
        </LazyLoadingComponent>
      ),
      },
      {
      path: "tao-san-pham",   
      element: (
        <LazyLoadingComponent>
          <ProductManagement />
        </LazyLoadingComponent>
      ),
    },
      {
        path: "tao-voucher",
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

  //   {
  //     element: (
  //       <LazyLoadingComponent>
  //         <SellerRoutes />
  //       </LazyLoadingComponent>
  //     ),
  //     children: [
  //       {
  //         path: ROUTER.SELLER_DASHBOARD,
  //         element: (
  //           <LazyLoadingComponent>
  //             <SellerDashboard />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.QUAN_LY_SAN_PHAM,
  //         element: (
  //           <LazyLoadingComponent>
  //             <ProductManagement />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.THEM_SAN_PHAM,
  //         element: (
  //           <LazyLoadingComponent>
  //             <AddProduct />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.SUA_SAN_PHAM,
  //         element: (
  //           <LazyLoadingComponent>
  //             <EditProduct />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.QUAN_LY_DON_HANG,
  //         element: (
  //           <LazyLoadingComponent>
  //             <OrderManagement />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.CHI_TIET_DON_HANG,
  //         element: (
  //           <LazyLoadingComponent>
  //             <OrderDetail />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.QUAN_LY_VOUCHER,
  //         element: (
  //           <LazyLoadingComponent>
  //             <VoucherManagement />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.THEM_VOUCHER,
  //         element: (
  //           <LazyLoadingComponent>
  //             <AddVoucher />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.BAO_CAO,
  //         element: (
  //           <LazyLoadingComponent>
  //             <Reports />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //     ],
  //   },

  // Admin routes
  //   {
  //     element: (
  //       <LazyLoadingComponent>
  //         <AdminRoutes />
  //       </LazyLoadingComponent>
  //     ),
  //     children: [
  //       {
  //         path: ROUTER.ADMIN_DASHBOARD,
  //         element: (
  //           <LazyLoadingComponent>
  //             <AdminDashboard />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.QUAN_LY_NGUOI_DUNG,
  //         element: (
  //           <LazyLoadingComponent>
  //             <UserManagement />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.QUAN_LY_SELLER,
  //         element: (
  //           <LazyLoadingComponent>
  //             <SellerManagement />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //     ],
  //   },

  //   {
  //     path: "*",
  //     element: (
  //       <LazyLoadingComponent>
  //         <NotFound />
  //       </LazyLoadingComponent>
  //     ),
  //   },
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return renderRouter;
};

export default AppRouter;
