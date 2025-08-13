// src/components/Layout/Footer/index.js
import {
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Col, Layout, Row, Space, Typography } from "antd";
// import "./Footer.css";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter className="main-footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={4} className="footer-title">
                SellerApp
              </Title>
              <Text className="footer-description">
                Nền tảng mua bán trực tuyến hàng đầu Việt Nam. Chúng tôi kết nối
                người mua và người bán một cách hiệu quả nhất.
              </Text>
              <Space className="social-links">
                <Link href="#">
                  <FacebookOutlined />
                </Link>
                <Link href="#">
                  <TwitterOutlined />
                </Link>
                <Link href="#">
                  <InstagramOutlined />
                </Link>
                <Link href="#">
                  <YoutubeOutlined />
                </Link>
              </Space>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-subtitle">
                Dành cho người mua
              </Title>
              <ul className="footer-links">
                <li>
                  <Link href="#">Cách đặt hàng</Link>
                </li>
                <li>
                  <Link href="#">Cách thanh toán</Link>
                </li>
                <li>
                  <Link href="#">Chính sách vận chuyển</Link>
                </li>
                <li>
                  <Link href="#">Chính sách đổi trả</Link>
                </li>
                <li>
                  <Link href="#">Câu hỏi thường gặp</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-subtitle">
                Dành cho người bán
              </Title>
              <ul className="footer-links">
                <li>
                  <Link href="#">Đăng ký bán hàng</Link>
                </li>
                <li>
                  <Link href="#">Hướng dẫn bán hàng</Link>
                </li>
                <li>
                  <Link href="#">Chính sách seller</Link>
                </li>
                <li>
                  <Link href="#">Hỗ trợ seller</Link>
                </li>
                <li>
                  <Link href="#">Trung tâm seller</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-subtitle">
                Liên hệ
              </Title>
              <div className="contact-info">
                <div className="contact-item">
                  <PhoneOutlined />
                  <Text>1900 1234</Text>
                </div>
                <div className="contact-item">
                  <MailOutlined />
                  <Text>support@sellerapp.vn</Text>
                </div>
                <div className="contact-item">
                  <EnvironmentOutlined />
                  <Text>123 Đường ABC, TP.HCM</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom">
          <Text type="secondary">
            © 2024 SellerApp. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
