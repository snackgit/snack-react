import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Menu } from "antd";
import { DownloadOutlined, LoginOutlined, LogoutOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";
import UploadPage from "./upload";
import ProductPage from "./product";
import MainPageComponent from "./main/index";
import CategoryPage from "./category/index.js";
import LoginPage from "./login";
import MyPage from "./mypage";
import NewProductsPage from "./new";
import QAForm from "./QAForm/index.js";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        setUserNickname(currentUser.nickname || "");
        setUserRole(currentUser.role || "user");
      }
    } else {
      setIsLoggedIn(false);
      setUserNickname("");
      setUserRole("");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUserNickname("");
    setUserRole("");
    navigate("/");
  };

  const isAdmin = () => userRole === "admin";

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/mypage")} icon={<UserOutlined />}>
        마이페이지
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout} icon={<LogoutOutlined />}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

  const categories = [
    { title: "추억의 불량식품", link: "/category/snack", value: "snack" },
    { title: "일본간식", link: "/category/japan", value: "japan" },
    { title: "중국간식", link: "/category/china", value: "china" },
    { title: "동남아간식", link: "/category/asia", value: "asia" },
    { title: "유럽간식", link: "/category/europe", value: "europe" },
    { title: "미국간식", link: "/category/usa", value: "usa" },
    { title: "라면/컵라면", link: "/category/ramen", value: "ramen" },
    { title: "음료/커피", link: "/category/drink", value: "drink" },
  ];

  return (
    <div>
      <div id="header">
        <div id="header-area">
          <Link to="/">
            <img src="/images/icons/logo.png" alt="Logo" />
          </Link>
          <div className="nav-area" style={{
          backgroundColor: "#fffff",
          padding: "10px 0",
          borderBottom: "1px solid #fffff"
        }}>
          <div style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "70px"
          }}>
            <div style={{ position: "relative" }}>
              <Button
                icon={<MenuOutlined />}
                size="large"
                style={{
                  backgroundColor: "#3F93CC",
                  color: "white"
                }}
                onClick={() => setIsMenuVisible(!isMenuVisible)}
              >
                전체 카테고리
              </Button>
              {isMenuVisible && (
                <Menu style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "200px",
                  zIndex: 1000,
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                  {categories.map((category, index) => (
                    <Menu.Item key={index}>
                      <Link to={category.link}>{category.title}</Link>
                    </Menu.Item>
                  ))}
                </Menu>
              )}
            </div>
            <Link to="/new" style={{ fontSize: "16px", color: "#333", textDecoration: "none" }}>신상품</Link>
            <Link to="/QAForm" style={{ fontSize: "16px", color: "#333", textDecoration: "none" }}>Q & A</Link>
            <a
              href="https://itwlsmdwjdqhrhdgkrrhk-68217.waveon.me/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "16px", color: "#333", textDecoration: "none" }}
            >
              mbti
            </a>
          </div>
        </div>
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            {isLoggedIn && isAdmin() && (
              <Button size="large" onClick={() => navigate("/upload")} icon={<DownloadOutlined />}>
                상품 업로드
              </Button>
            )}
            {isLoggedIn ? (
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <Button size="large" icon={<UserOutlined />}>
                  {userNickname}
                </Button>
              </Dropdown>
            ) : (
              <Button size="large" onClick={() => navigate("/login")} icon={<LoginOutlined />}>
                로그인
              </Button>
            )}
          </div>
        </div>
      
      </div>
      <div id="body">
        <Routes>
          <Route path="/" element={<MainPageComponent />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/products/:id" element={<ProductPage userNickname={userNickname} />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/mypage" element={<MyPage userNickname={userNickname} isLoggedIn={isLoggedIn} />} />
          <Route path="/new" element={<NewProductsPage />} />
          <Route 
  path="/QAForm" 
  element={
    <QAForm 
      isLoggedIn={isLoggedIn} 
      userRole={userRole} 
      userNickname={userNickname} 
    />
  } 
/>

        </Routes>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;