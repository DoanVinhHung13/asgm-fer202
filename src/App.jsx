// src/App.js
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import viVN from "antd/locale/vi_VN";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AppRouter from "./router/AppRouter";

// Cấu hình theme cho Ant Design
const theme = {
  token: {
    colorPrimary: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#f5222d",
    colorInfo: "#1890ff",
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
    },
  },
};

function App() {
  return (
    <ConfigProvider locale={viVN} theme={theme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <AppRouter />
          </div>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
