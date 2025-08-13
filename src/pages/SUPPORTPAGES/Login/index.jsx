// src/pages/ANONYMOUS/Login/index.js
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import ROUTER from "../../../router/ROUTER";
import "./index.css";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const result = await login(values.email, values.password);

    if (result.success) {
      // Điều hướng theo role
      switch (result.user.role) {
        case "seller":
          navigate(ROUTER.SELLER_DASHBOARD);
          break;
        case "admin":
          navigate(ROUTER.ADMIN_DASHBOARD);
          break;
        default:
          navigate(ROUTER.HOME);
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <Card className="login-card">
            <div className="login-header">
              <Title level={2} className="login-title">
                Đăng nhập
              </Title>
              <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập email của bạn"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="login-button"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="login-footer">
                <Text>Chưa có tài khoản? </Text>
                <Link to={ROUTER.DANG_KY}>Đăng ký ngay</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
