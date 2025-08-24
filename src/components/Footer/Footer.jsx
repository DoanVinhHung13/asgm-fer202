import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo & Slogan */}
          <div className="footer-brand">
            <h3 className="footer-logo">StyleHub</h3>
          </div>

          {/* Liên kết nhanh */}
          <div className="footer-section">
            <h4 className="footer-heading">SERVICES</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Theo dõi đơn hàng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Tìm kiếm cửa hàng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">TERMS & POLICY</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Chương trình thành viên
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Liên hệ</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Văn phòng: Đại học FPT
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Số điện thoại: 098.765.4321
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Email: support@fptshop.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright 2025 © By FPTU All rights reserved
          </p>
          <div className="footer-social">
            <a href="https://instagram.com">Instagram</a>
            <a href="https://facebook.com">Facebook</a>
            <a href="https://x.com/">X</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
