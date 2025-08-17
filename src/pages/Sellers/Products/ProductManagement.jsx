import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [variants, setVariants] = useState([
    { color: '', size: '', stock: '', sku: '' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    images: [],
    status: 'active'
  });

  // Fetch data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/categories');
      const data = await response.json();
      setCategories(data.filter(cat => cat.status === 'active'));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Generate next ID
  const generateNextId = async () => {
    try {
      const response = await fetch('http://localhost:9000/products');
      const allProducts = await response.json();
      
      const numericIds = allProducts
        .map(product => parseInt(product.id))
        .filter(id => !isNaN(id));
      
      if (numericIds.length === 0) return "1";
      
      const maxId = Math.max(...numericIds);
      return (maxId + 1).toString();
    } catch (error) {
      console.error('Error generating ID:', error);
      return Date.now().toString();
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setPreviewImages(newPreviews);
  };

  // Handle variants
  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', stock: '', sku: '' }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };

  // Auto generate SKU
  const generateSKU = (productName, color, size) => {
    const productCode = productName.substring(0, 3).toUpperCase();
    const colorCode = color.substring(0, 3).toUpperCase();
    const sizeCode = size.toUpperCase();
    return `${productCode}-${colorCode}-${sizeCode}`;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      const nextId = await generateNextId();
      
      // Process variants with auto-generated IDs and SKUs
      const processedVariants = variants
        .filter(v => v.color && v.size && v.stock)
        .map((variant, index) => ({
          id: Date.now() + index,
          color: variant.color,
          size: variant.size,
          stock: parseInt(variant.stock),
          sku: variant.sku || generateSKU(productData.name, variant.color, variant.size)
        }));

      const response = await fetch('http://localhost:9000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: nextId,
          ...productData,
          categoryId: parseInt(productData.categoryId),
          price: parseInt(productData.price),
          originalPrice: parseInt(productData.originalPrice),
          sellerId: 1, // Assume current seller ID
          images: previewImages.length > 0 ? previewImages : ['/img/default-product.jpg'],
          variants: processedVariants,
          status: 'active',
          createdAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        fetchProducts();
        alert('Thêm sản phẩm thành công!');
      } else {
        alert('Lỗi khi thêm sản phẩm');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Lỗi khi thêm sản phẩm');
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      const existingProduct = products.find(p => p.id === id);
      
      // Process variants
      const processedVariants = variants
        .filter(v => v.color && v.size && v.stock)
        .map((variant, index) => ({
          id: variant.id || Date.now() + index,
          color: variant.color,
          size: variant.size,
          stock: parseInt(variant.stock),
          sku: variant.sku || generateSKU(productData.name, variant.color, variant.size)
        }));

      const response = await fetch(`http://localhost:9000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...existingProduct,
          ...productData,
          categoryId: parseInt(productData.categoryId),
          price: parseInt(productData.price),
          originalPrice: parseInt(productData.originalPrice),
          images: previewImages.length > 0 ? previewImages : existingProduct.images,
          variants: processedVariants
        })
      });
      
      if (response.ok) {
        fetchProducts();
        alert('Cập nhật sản phẩm thành công!');
      } else {
        alert('Lỗi khi cập nhật sản phẩm');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Lỗi khi cập nhật sản phẩm');
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:9000/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchProducts();
        alert('Xóa sản phẩm thành công!');
      } else {
        alert('Lỗi khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  // Toggle product status
  const toggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    await updateProduct(product.id, {
      ...product,
      status: newStatus
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      createProduct(formData);
    }
    
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      images: [],
      status: 'active'
    });
    setVariants([{ color: '', size: '', stock: '', sku: '' }]);
    setSelectedImages([]);
    setPreviewImages([]);
    setShowModal(false);
    setEditingId(null);
  };

  // Open modal for create
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Start editing
  const startEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      categoryId: product.categoryId.toString(),
      status: 'active'
    });
    
    setVariants(product.variants || [{ color: '', size: '', stock: '', sku: '' }]);
    setPreviewImages(product.images || []);
    setEditingId(product.id);
    setShowModal(true);
  };

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.name : 'N/A';
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  return (
    <div className="product-management">
      <div className="header">
        <h1>Quản Lý Sản Phẩm</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          Thêm Sản Phẩm
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sản phẩm:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Danh mục:</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sản phẩm"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá bán:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Giá gốc:</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Hình ảnh:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {previewImages.length > 0 && (
                  <div className="image-preview">
                    {previewImages.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="variants-section">
                <div className="variants-header">
                  <label>Biến thể sản phẩm:</label>
                  <button type="button" className="btn btn-sm" onClick={addVariant}>
                    Thêm biến thể
                  </button>
                </div>
                
                {variants.map((variant, index) => (
                  <div key={index} className="variant-item">
                    <div className="variant-row">
                      <input
                        type="text"
                        placeholder="Màu sắc"
                        value={variant.color}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Kích thước"
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="SKU (tự động)"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeVariant(index)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Product List */}
      <div className="product-list">
        <h2>Danh Sách Sản Phẩm ({products.length})</h2>
        
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="empty">Chưa có sản phẩm nào</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || '/img/default-product.jpg'} 
                    alt={product.name}
                    onError={(e) => e.target.src = '/img/default-product.jpg'}
                  />
                  <span className={`status-badge ${product.status}`}>
                    {product.status === 'active' ? 'Hoạt động' : 'Ngừng bán'}
                  </span>
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{getCategoryName(product.categoryId)}</p>
                  <p className="description">{product.description}</p>
                  
                  <div className="price-info">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  
                  <div className="variants-info">
                    <strong>Biến thể: {product.variants?.length || 0}</strong>
                    {product.variants?.map((variant, index) => (
                      <div key={index} className="variant-tag">
                        {variant.color} - {variant.size} ({variant.stock})
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="product-actions">
                  <button 
                    onClick={() => startEdit(product)}
                    className="btn btn-edit btn-sm"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => toggleStatus(product)}
                    className={`btn btn-sm ${product.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                  >
                    {product.status === 'active' ? 'Ẩn' : 'Hiện'}
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;