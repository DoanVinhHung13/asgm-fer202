import { useState } from "react";

export default function CreateManager({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Không gửi id => JSON Server (port 9000) sẽ tự tăng id
    const newUser = {
      ...formData,
      role: "manager",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:9000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("Tạo nhân viên mới thành công!");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        });
        if (onSuccess) onSuccess();
      } else {
        alert("Lỗi khi tạo nhân viên, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Tạo Nhân viên mới</h2>
      <input
        name="name"
        value={formData.name}
        placeholder="Tên"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        value={formData.email}
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        placeholder="Mật khẩu"
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        value={formData.phone}
        placeholder="Điện thoại"
        onChange={handleChange}
        required
      />
      <input
        name="address"
        value={formData.address}
        placeholder="Địa chỉ"
        onChange={handleChange}
      />
      <button type="submit" style={{ marginTop: "10px" }}>
        Tạo
      </button>
    </form>
  );
}
