// giao diện hiển thị hồ sơ và xử lý cập nhật hồ sơ - Nguyễn Bảo An
import "./Profile.css";
import React, { useEffect, useState, useContext } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { AuthContext } from "../../../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext); // lấy user hiện tại từ AuthContext
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load dữ liệu user từ db.json
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:9000/users/${user.id}`);
        const data = await res.json();
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        });
      } catch (error) {
        message.error("Không thể tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchUser();
  }, [user, form]);

  // Xử lý submit form
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:9000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success("Cập nhật thông tin thành công!");
      } else {
        message.error("Cập nhật thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi khi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Card title="Cập nhật hồ sơ" className="profile-card">
        <h2 className="profile-title">Cập nhật hồ sơ</h2>
        {loading ? (
          <Spin tip="Đang tải..." />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ name: "", email: "", phone: "", address: "" }}
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="Nhập tên của bạn" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" disabled />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Nhập địa chỉ của bạn" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
