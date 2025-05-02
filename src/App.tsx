import React, { useEffect, useState } from "react";
import { Layout, Button, Dropdown, Menu } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Board from "./components/Board";
import ProjectsList from "./components/ProjectsList/ProjectsList";
import AuthContainer from "./components/AuthContainer";
import "antd/dist/reset.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggleButton from "./components/ThemeToggleButton";
import "./App.css";
import "./components/DarkModeToggle.css";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  UsergroupAddOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

// Declare the custom property on the window object
declare global {
  interface Window {
    __react_beautiful_dnd_disable_dev_warnings: boolean;
  }
}

// Fix for react-beautiful-dnd in React 18
const useMount = (fn: () => void) => useEffect(fn, []);

const App: React.FC = () => {
  // Apply the fix before rendering
  useMount(() => {
    window.__react_beautiful_dnd_disable_dev_warnings = true;
  });

  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for development

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // User dropdown menu
  const userDropdownMenu = (
    <Menu>
      <Menu.Item key="account" style={{ padding: '10px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: '10px', fontSize: '16px' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>Samadhi</div>
            <div style={{ fontSize: '12px', color: '#666' }}>samadhi@example.com</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="admin" icon={<SettingOutlined />}>
        Admin Center
      </Menu.Item>
      <Menu.Item key="outline" icon={<BookOutlined />}>
        Outline
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // If not logged in, show auth container
  if (!isLoggedIn) {
    return <AuthContainer onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Layout
            className="app-layout"
            style={{ width: "100vw", height: "100vh" }}
          >
            <Header
              className="app-header"
              style={{
                textAlign: "center",
                fontSize: "16px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                backgroundColor: "white",
                color: "black",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className="header-left"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  className="logo"
                  style={{
                    marginRight: "30px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/src/logo.png"
                    alt="Worklenz Logo"
                    style={{
                      height: "50px", // Adjust this size as needed
                      width: "auto",
                    }}
                  />
                </div>
                <nav style={{ display: "flex", gap: "30px" }}>
                  <Link to="/" style={{ color: "black" }}>
                    Home
                  </Link>
                  <Link
                    to="/"
                    style={{
                      color: "#1890ff",
                      borderBottom: "2px solid #1890ff",
                      paddingBottom: "4px",
                    }}
                  >
                    Projects
                  </Link>
                  <Link to="/" style={{ color: "black" }}>
                    Schedule
                  </Link>
                  <Link to="/" style={{ color: "black" }}>
                    Reporting
                  </Link>
                  <Link to="/" style={{ color: "black" }}>
                    Client Portal
                  </Link>
                </nav>
              </div>

              <div
                className="header-right"
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <Button
                  style={{
                    backgroundColor: "#f9d270",
                    color: "black",
                    border: "none",
                  }}
                >
                  Upgrade Plan
                </Button>
                <Button
                  style={{
                    border: "1px dashed #1890ff",
                    color: "#1890ff",
                    backgroundColor: "transparent",
                  }}
                >
                  <UsergroupAddOutlined style={{ marginRight: "5px" }} /> Invite
                </Button>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <span>Samadhi</span>
                  <BellOutlined style={{ fontSize: "18px" }} />
                  <QuestionCircleOutlined style={{ fontSize: "18px" }} />
                  <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                    <UserOutlined 
                      style={{ fontSize: "18px", cursor: "pointer" }} 
                    />
                  </Dropdown>
                </div>
              </div>
            </Header>
            <Content
              className="app-content"
              style={{
                padding: "20px",
                height: "calc(100vh - 104px)", // Updated to match the header height
                overflow: "hidden", // Keep this to prevent vertical scrolling of the content area itself
              }}
            >
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<ProjectsList />} />
                  <Route path="/project/:projectId" element={<Board />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </Content>
          </Layout>
          <ThemeToggleButton />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;