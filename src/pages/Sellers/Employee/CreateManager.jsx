export default function CreateManager({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...rest } = formData; // bỏ id để JSON Server tự tăng
    const newUser = {
      ...rest,
      role: "manager",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const res = await fetch("http://localhost:9000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (res.ok && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <input name="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input name="password" type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <input name="phone" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
      <input name="address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      <button type="submit">Tạo</button>
    </form>
  );
}
