import React, { useEffect, useState } from "react";
import CreateManager from "./CreateManager";

export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchManagers = async () => {
    const res = await fetch("http://localhost:3000/users?role=manager");
    const data = await res.json();
    setManagers(data);
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
      fetchManagers();
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Danh sách nhân viên</h2>
      <button onClick={() => setShowModal(true)}>+ Thêm nhân viên</button>

      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <button onClick={() => setShowModal(false)}>❌</button>
            <CreateManager
              onSuccess={() => {
                setShowModal(false);
                fetchManagers();
              }}
            />
          </div>
        </div>
      )}

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
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
        </tbody>
      </table>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px"
};
