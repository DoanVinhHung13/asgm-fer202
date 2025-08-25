import "./Profile.css";
import React, { useEffect, useState, useContext } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { AuthContext } from "../../../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // State lưu avatar hiện tại (đã lưu)
  const [avatar, setAvatar] = useState(null);

  // State lưu avatar mới được chọn (chưa lưu)
  const [newAvatar, setNewAvatar] = useState(null);

  // Hàm lưu user và avatar vào localStorage
  const saveUserToLocal = (userData, avatarData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      if (avatarData) {
        localStorage.setItem("avatar", avatarData);
      }
    } catch (error) {
      console.error("Lỗi lưu user hoặc avatar vào localStorage", error);
    }
  };

  // Hàm lấy user từ localStorage
  const getUserFromLocal = () => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Lỗi đọc user localStorage", error);
      return null;
    }
  };

  // Hàm lấy avatar từ localStorage
  const getAvatarFromLocal = () => {
    try {
      return localStorage.getItem("avatar") || null;
    } catch (error) {
      console.error("Lỗi đọc avatar localStorage", error);
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    const localUser = getUserFromLocal();
    const localAvatar = getAvatarFromLocal();

    if (localUser) {
      form.setFieldsValue({
        name: localUser.name,
        email: localUser.email,
        phone: localUser.phone,
        address: localUser.address,
      });
    } else if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }

    if (localAvatar) {
      setAvatar(localAvatar);
    } else if (user?.avatar) {
      setAvatar(user.avatar);
    }

    setLoading(false);
  }, [user, form]);

  // Khi chọn ảnh mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFinish = (values) => {
    setLoading(true);
    try {
      // Cập nhật avatar nếu có ảnh mới
      const updatedAvatar = newAvatar || avatar;

      const updatedUser = { ...user, ...values };

      // Lưu user và avatar vào localStorage
      saveUserToLocal(updatedUser, updatedAvatar);

      // Cập nhật context nếu có setUser
      if (setUser) setUser(updatedUser);

      // Cập nhật avatar state
      setAvatar(updatedAvatar);

      // Reset ảnh mới đã lưu
      setNewAvatar(null);

      message.success("Cập nhật thông tin thành công!");
      setSuccessMessage("Cập nhật thông tin thành công!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      message.error("Có lỗi khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <img
            src={
              newAvatar ||
              avatar ||
              "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
            }
            alt="User Avatar"
            className="avatar-img"
          />
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload" className="avatar-upload-btn">
            Thay đổi ảnh đại diện
          </label>
          <div className="profile-username">{user?.name || "User"}</div>
        </div>
      </div>

      <div className="profile-content">
        <h1>Account</h1>
        {loading ? (
          <Spin tip="Đang tải..." />
        ) : (
          <>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ name: "", email: "", phone: "", address: "" }}
            >
              {/* ... các Form.Item ... */}
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
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="save-btn"
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
