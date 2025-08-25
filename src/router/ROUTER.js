const ROUTER = {
  DEFAULT: "/",
  HOME: "/",
  DANG_NHAP: "/dang-nhap",
  DANG_KY: "/dang-ky",

  // Product routes
  SAN_PHAM: "/san-pham",
  CHI_TIET_SAN_PHAM: "/san-pham/:id",
  TIM_KIEM: "/search",

  // User routes

  THONG_TIN_CA_NHAN: "/thong-tin-ca-nhan",
  GIO_HANG: "/gio-hang",
  DON_HANG_CUA_TOI: "/don-hang-cua-toi",
  YEU_THICH: "/yeu-thich",
  LICH_SU_DON_HANG: "/lich-su-don-hang",

  // Collections
  COLLECTIONS: "/collections",
  SALE: "/sale",

  // Seller routes
  SELLER_DASHBOARD: "/seller/dashboard",
  MY_SHOP: "/my-shop",
  QUAN_LY_SAN_PHAM: "/seller/quan-ly-san-pham",
  THEM_SAN_PHAM: "/seller/them-san-pham",
  SUA_SAN_PHAM: "/seller/sua-san-pham/:id",
  QUAN_LY_DON_HANG: "/seller/quan-ly-don-hang",
  CHI_TIET_DON_HANG: "/seller/chi-tiet-don-hang/:id",
  QUAN_LY_VOUCHER: "/seller/quan-ly-voucher",
  THEM_VOUCHER: "/seller/them-voucher",
  BAO_CAO: "/seller/bao-cao",

  QUAN_LY_NHAN_VIEN: "/employee/quan-ly-nhan-vien",
  THEM_NHAN_VIEN: "/employee/them-nhan-vien",

  ADMIN_DASHBOARD: "/admin/dashboard",
  QUAN_LY_NGUOI_DUNG: "/admin/quan-ly-nguoi-dung",
  QUAN_LY_SELLER: "/admin/quan-ly-seller",
};

export default ROUTER;
