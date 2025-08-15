const ROUTER = {
  DEFAULT: "/",
  SVG_VIEWER: "/svg-viewer",
  HOME: "/",
  DANG_NHAP: "/dang-nhap",
  DANG_KY: "/dang-ky",
  DOI_MAT_KHAU: "/doi-mat-khau",
  CAP_NHAT_THONG_TIN: "/cap-nhat-thong-tin",

  // Product Categories
  QUAN: "/quan",
  AO: "/ao",
  GIAY: "/giay",
  PHU_KIEN: "/phu-kien",

  // Product routes
  SAN_PHAM: "/san-pham",
  CHI_TIET_SAN_PHAM: "/san-pham/:id",
  TIM_KIEM: "/search",

  // Shopping
  GIO_HANG: "/gio-hang",
  THANH_TOAN: "/thanh-toan",
  DON_HANG_CUA_TOI: "/don-hang-cua-toi",
  YEU_THICH: "/yeu-thich",

  // Collections
  NEW_ARRIVALS: "/new-arrivals",
  COLLECTIONS: "/collections",
  SUMMER_COLLECTION: "/summer-collection",
  WOMEN: "/women",
  MEN: "/men",
  ACCESSORIES: "/accessories",
  SALE: "/sale",

  // User routes
  PROFILE: "/profile",
  ORDERS: "/orders",

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

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  QUAN_LY_NGUOI_DUNG: "/admin/quan-ly-nguoi-dung",
  QUAN_LY_SELLER: "/admin/quan-ly-seller",
};

export default ROUTER;
