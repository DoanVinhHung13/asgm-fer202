import { message } from "antd";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Gọi API đăng nhập
      const response = await fetch("http://localhost:9000/users");
      const users = await response.json();

      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const token = `token_${foundUser.id}_${Date.now()}`;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(foundUser));

        setUser(foundUser);
        setIsAuthenticated(true);
        message.success("Đăng nhập thành công!");
        return { success: true, user: foundUser };
      } else {
        message.error("Email hoặc mật khẩu không đúng!");
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng nhập!");
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    message.success("Đăng xuất thành công!");
  };

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:9000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          status: "active",
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        message.success("Đăng ký thành công!");
        return { success: true };
      } else {
        message.error("Có lỗi xảy ra khi đăng ký!");
        return { success: false };
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng ký!");
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
