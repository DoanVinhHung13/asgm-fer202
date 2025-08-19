import React, { useEffect, useState } from "react";
import "./VoucherManagement.css";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "fixed",
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 1,
    startDate: "",
    endDate: "",
    status: "active",
  });

  // Lấy danh sách voucher từ JSON server
  useEffect(() => {
    fetch("http://localhost:9000/vouchers")
      .then((res) => res.json())
      .then((data) => {
        setVouchers(data);
        setLoading(false);
      });
  }, []);

  // Mở form thêm/sửa
  const openForm = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData(voucher);
    } else {
      setEditingVoucher(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        type: "fixed",
        value: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 1,
        startDate: "",
        endDate: "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  // Cập nhật form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lưu voucher (thêm hoặc update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingVoucher) {
      await fetch(`http://localhost:9000/vouchers/${editingVoucher.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch("http://localhost:9000/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, createdAt: new Date().toISOString() }),
      });
    }

    window.location.reload();
  };

  // Xóa voucher
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa voucher này?")) {
      await fetch(`http://localhost:9000/vouchers/${id}`, {
        method: "DELETE",
      });
      setVouchers(vouchers.filter((v) => v.id !== id));
    }
  };

  if (loading) return <div className="loading">Đang tải voucher...</div>;

  return (
    <div className="voucher-management">
      <div className="header">
        <h1>Quản lý Voucher</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Tạo Voucher
        </button>
      </div>

      {/* Danh sách voucher */}
      <div className="voucher-list">
        {vouchers.length === 0 ? (
          <p className="empty">Chưa có voucher nào</p>
        ) : (
          <table className="voucher-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>ĐH tối thiểu</th>
                <th>Giảm tối đa</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vouchers
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((v) => (
                  <tr key={v.id}>
                    <td>{v.code}</td>
                    <td>{v.name}</td>
                    <td>{v.type === "fixed" ? "Giảm tiền" : "Giảm %"} </td>
                    <td>
                      {v.type === "fixed"
                        ? v.value.toLocaleString() + "đ"
                        : v.value + "%"}
                    </td>
                    <td>{v.minOrderAmount.toLocaleString()}đ</td>
                    <td>{v.maxDiscount.toLocaleString()}đ</td>
                    <td>
                      {new Date(v.startDate).toLocaleDateString()} -{" "}
                      {new Date(v.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${v.status}`}>
                        {v.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-edit" onClick={() => openForm(v)}>
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(v.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal thêm/sửa voucher */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{editingVoucher ? "Chỉnh sửa Voucher" : "Tạo Voucher mới"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Voucher</label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tên Voucher</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loại</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="fixed">Giảm tiền</option>
                    <option value="percent">Giảm %</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá trị</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Giảm tối đa</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate.split("T")[0]}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate.split("T")[0]}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-success">
                  {editingVoucher ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
