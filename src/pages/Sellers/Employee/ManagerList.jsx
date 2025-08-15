import React, { useEffect, useState } from "react";
import CreateManager from "./CreateManager";


export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchManagers = async () => {
    try {
      const res = await fetch("http://localhost:3000/users?role=manager");
      const data = await res.json();
      setManagers(data);
    } catch (error) {
      console.error("Lỗi load managers:", error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
      fetchManagers();
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Danh sách nhân viên (Manager)</h2>
      <button onClick={() => setShowModal(true)} style={{ marginBottom: "10px" }}>
        + Thêm nhân viên
      </button>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button
              onClick={() => setShowModal(false)}
              style={{ float: "right", cursor: "pointer" }}
            >
              ❌
            </button>
            <h3>Tạo nhân viên mới</h3>
            <CreateManager
              onSuccess={() => {
                setShowModal(false);
                fetchManagers(); // cập nhật lại danh sách sau khi tạo
              }}
            />
          </div>
        </div>
      )}

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.address}</td>
              <td>
                <button onClick={() => handleDelete(m.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {managers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không có nhân viên nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "90vh",
  overflowY: "auto"
};
