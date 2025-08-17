import React, { useState, useEffect } from 'react';
import './ManagerList.css';

const ManagerList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    status: 'active' // Luôn mặc định là active
  });

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/users');
      const data = await response.json();
      // Filter only sellers
      const sellers = data.filter(user => user.role === 'seller');
      setEmployees(sellers);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Create employee
  const createEmployee = async (employeeData) => {
    try {
      // Lấy tất cả users để tìm ID cao nhất
      const allUsersResponse = await fetch('http://localhost:9000/users');
      const allUsers = await allUsersResponse.json();
      
      // Tìm ID cao nhất trong tất cả users (chỉ tính các ID số)
      const generateNextId = () => {
        const numericIds = allUsers
          .map(user => parseInt(user.id))
          .filter(id => !isNaN(id)); // Lọc bỏ các ID không phải số như "04c9"
        
        if (numericIds.length === 0) return "1";
        
        const maxId = Math.max(...numericIds);
        return (maxId + 1).toString(); // Trả về string để match với cấu trúc database
      };

      const response = await fetch('http://localhost:9000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: generateNextId(),
          ...employeeData,
          role: 'seller',
          createdAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        fetchEmployees();
        alert('Thêm nhân viên thành công!');
      } else {
        alert('Lỗi khi thêm nhân viên');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Lỗi khi thêm nhân viên');
    }
  };

  // Update employee
  const updateEmployee = async (id, employeeData) => {
    try {
      const response = await fetch(`http://localhost:9000/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
      });
      
      if (response.ok) {
        fetchEmployees();
        alert('Cập nhật nhân viên thành công!');
      } else {
        alert('Lỗi khi cập nhật nhân viên');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Lỗi khi cập nhật nhân viên');
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:9000/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchEmployees();
        alert('Xóa nhân viên thành công!');
      } else {
        alert('Lỗi khi xóa nhân viên');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Lỗi khi xóa nhân viên');
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Đảm bảo status luôn là active
    const dataToSubmit = {
      ...formData,
      status: 'active'
    };
    
    if (editingId) {
      updateEmployee(editingId, dataToSubmit);
    } else {
      createEmployee(dataToSubmit);
    }
    
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      status: 'active' // Luôn reset về active
    });
    setShowModal(false);
    setEditingId(null);
  };

  // Open modal for create
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };
  const startEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '', // Don't show password
      phone: employee.phone,
      address: employee.address,
      status: employee.status
    });
    setEditingId(employee.id);
    setShowModal(true);
  };

  // Toggle employee status
  const toggleStatus = async (employee) => {
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    await updateEmployee(employee.id, {
      ...employee,
      status: newStatus
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="employee-management">
      <div className="header">
        <h1>Quản Lý Nhân Viên Seller</h1>
        <button 
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          Thêm Nhân Viên
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</h2>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Họ tên:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingId ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                  required={!editingId}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ:</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>

              {/* Ẩn trường status - luôn mặc định là active */}
              <input 
                type="hidden" 
                name="status" 
                value="active" 
              />
            </div>

            <div className="modal-footer">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Hủy
              </button>
              <button type="button" onClick={handleSubmit} className="btn btn-success">
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="employee-list">
        <h2>Danh Sách Nhân Viên ({employees.length})</h2>
        
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : employees.length === 0 ? (
          <div className="empty">Chưa có nhân viên nào</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.address}</td>
                    <td>
                      <span className={`status ${employee.status}`}>
                        {employee.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td>{formatDate(employee.createdAt)}</td>
                    <td>
                      <div className="actions">
                        <button 
                          onClick={() => startEdit(employee)}
                          className="btn btn-edit"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => toggleStatus(employee)}
                          className={`btn ${employee.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                        >
                          {employee.status === 'active' ? 'Vô hiệu' : 'Kích hoạt'}
                        </button>
                        <button 
                          onClick={() => deleteEmployee(employee.id)}
                          className="btn btn-danger"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerList;