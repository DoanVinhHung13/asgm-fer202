import { Spin } from "antd";
import React from "react";
import { useRoutes } from "react-router-dom";
import ROUTER from "./ROUTER";

// Common
const PublicRouters = React.lazy(() =>
  import("../pages/SUPPORTPAGES/PublicRouters")
);
// const PrivateRoutes = React.lazy(() =>
//   import("src/pages/SUPPORTPAGES/PrivateRoutes.jsx")
// );
// const SellerRoutes = React.lazy(() =>
//   import("src/pages/SUPPORTPAGES/SellerRoutes")
// );
// const AdminRoutes = React.lazy(() =>
//   import("src/pages/SUPPORTPAGES/AdminRoutes")
// );
// const NotFound = React.lazy(() => import("src/pages/SUPPORTPAGES/NotFound"));

// Anonymous
const Home = React.lazy(() => import("../pages/SUPPORTPAGES/Home"));
const Login = React.lazy(() => import("../pages/SUPPORTPAGES/Login"));

// const Register = React.lazy(() => import("src/pages/ANONYMOUS/Register"));

// // Customer
// const ProductList = React.lazy(() => import("src/pages/CUSTOMER/ProductList"));
// const ProductDetail = React.lazy(() =>
//   import("src/pages/CUSTOMER/ProductDetail")
// );
// const Cart = React.lazy(() => import("src/pages/CUSTOMER/Cart"));
// const Checkout = React.lazy(() => import("src/pages/CUSTOMER/Checkout"));
// const MyOrders = React.lazy(() => import("src/pages/CUSTOMER/MyOrders"));

// Seller
// const SellerDashboard = React.lazy(() => import("src/pages/SELLER/Dashboard"));
// const ProductManagement = React.lazy(() =>
//   import("src/pages/SELLER/ProductManagement")
// );
// const AddProduct = React.lazy(() => import("src/pages/SELLER/AddProduct"));
// const EditProduct = React.lazy(() => import("src/pages/SELLER/EditProduct"));
// const OrderManagement = React.lazy(() =>
//   import("src/pages/SELLER/OrderManagement")
// );
// const OrderDetail = React.lazy(() => import("src/pages/SELLER/OrderDetail"));
// const VoucherManagement = React.lazy(() =>
//   import("src/pages/SELLER/VoucherManagement")
// );
// const AddVoucher = React.lazy(() => import("src/pages/SELLER/AddVoucher"));
// const Reports = React.lazy(() => import("src/pages/SELLER/Reports"));

// // Admin
// const AdminDashboard = React.lazy(() => import("src/pages/ADMIN/Dashboard"));
// const UserManagement = React.lazy(() =>
//   import("src/pages/ADMIN/UserManagement")
// );
// const SellerManagement = React.lazy(() =>
//   import("src/pages/ADMIN/SellerManagement")
// );

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
      //   {
      //     path: ROUTER.DANG_KY,
      //     element: (
      //       <LazyLoadingComponent>
      //         <Register />
      //       </LazyLoadingComponent>
      //     ),
      //   },
      //   {
      //     path: ROUTER.SAN_PHAM,
      //     element: (
      //       <LazyLoadingComponent>
      //         <ProductList />
      //       </LazyLoadingComponent>
      //     ),
      //   },
      //   {
      //     path: ROUTER.CHI_TIET_SAN_PHAM,
      //     element: (
      //       <LazyLoadingComponent>
      //         <ProductDetail />
      //       </LazyLoadingComponent>
      //     ),
      //   },
    ],
  },

  // Customer routes
  //   {
  //     element: (
  //       <LazyLoadingComponent>
  //         <PrivateRoutes />
  //       </LazyLoadingComponent>
  //     ),
  //     children: [
  //       {
  //         path: ROUTER.GIO_HANG,
  //         element: (
  //           <LazyLoadingComponent>
  //             <Cart />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.THANH_TOAN,
  //         element: (
  //           <LazyLoadingComponent>
  //             <Checkout />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //       {
  //         path: ROUTER.DON_HANG_CUA_TOI,
  //         element: (
  //           <LazyLoadingComponent>
  //             <MyOrders />
  //           </LazyLoadingComponent>
  //         ),
  //       },
  //     ],
  //   },

  //   // Seller routes
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
