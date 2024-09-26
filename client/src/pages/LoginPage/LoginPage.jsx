import React, { useState } from "react";
import LogoComponent from "../../components/LogoComponent/LogoComponent";
import { Form, Button, Input } from "antd";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import * as UserService from "../../services/UserService";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { jwtTranslate } from "../../ultilis";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies([
    "access_token",
  ]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    console.log(email, password);
    const res = await UserService.loginUser({ email, password });
    if (res?.status === "OK") {
      Message.success("Login successful");
      setCookieAccessToken("access_token", res?.access_token, {
        path: "/", // Cookie có thể truy cập trên toàn bộ ứng dụng
        maxAge: 3600, // Thời gian sống của cookie (1 giờ)
        secure: true, // Chỉ gửi cookie qua HTTPS
        sameSite: "strict", // Ngăn chặn cookie từ miền khác
      });
      const user = jwtTranslate(res?.access_token);
      console.log(user?.role);
      if (user?.role.includes("admin")) {
        navigate("/system/admin");
      } else if (!user?.role.includes("admin")) {
        navigate("/system/user");
      } else {
        navigate("/login");
      }
    } else {
      Message.error(res?.message);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="container-login">
        <div className="body-login">
          <LogoComponent style={{ border: "none" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 0px 20px 0px ",
            }}
          >
            <h5 style={{ color: "black", fontSize: "20px" }}>Welcome Back!</h5>
            <p style={{ color: "#495057" }}>Sign in to continue to Probic.</p>
          </div>
          <Form
            name="basic"
            labelCol={{
              span: 24, // Label chiếm toàn bộ chiều rộng
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 400, // Đặt maxWidth nhỏ hơn để dễ căn giữa
            }}
            onFinish={handleLogin} // Xử lý khi submit form
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
              style={{ marginBottom: "10px" }}
            >
              <Input onChange={handleOnChangeEmail} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              style={{ marginBottom: "50px" }}
            >
              <Input.Password onChange={handleOnChangePassword} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
              style={{ textAlign: "center", marginBottom: "10px" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "50%" }}
                disabled={!email || !password} // Disable khi email hoặc password rỗng
              >
                Login
              </Button>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
              style={{ textAlign: "center" }} // Căn giữa nội dung
            >
              <Link to="/forgot-password" style={{ color: "#1890ff" }}>
                Forgot Password?
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
