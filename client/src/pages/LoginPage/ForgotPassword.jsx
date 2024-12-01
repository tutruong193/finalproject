import React, { useEffect, useState } from "react";
import { Button, Input, message, Steps, theme, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import * as Message from "../../components/MessageComponent/MessageComponent";
const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stateUser, setStateUser] = useState("");
  const onBackToLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    if (current === 1) {
      sendVerificationCode();
    }
  }, [current]);
  const sendVerificationCode = async () => {
    const res = await UserService.sendVertifyCode(stateUser?._id);
    if (res.status === "OK") {
      Message.success();
    } else {
      Message.error(res.message);
    }
  };
  const steps = [
    {
      title: "Verify Email",
      content: (
        <div
          className="step-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <Title
            level={3}
            style={{
              marginBottom: "20px",
              color: token.colorPrimary,
            }}
          >
            Reset Your Password
          </Title>
          <Text
            type="secondary"
            style={{
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            Enter the email address associated with your account. We'll send a
            verification code to reset your password.
          </Text>
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
            style={{
              width: "100%",
              maxWidth: "400px",
              marginBottom: "16px",
            }}
          />
        </div>
      ),
    },
    {
      title: "Verification",
      content: (
        <div
          className="step-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <Title
            level={3}
            style={{
              marginBottom: "20px",
              color: token.colorPrimary,
            }}
          >
            Verify Your Identity
          </Title>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <UserOutlined
              style={{
                fontSize: "48px",
                color: token.colorPrimary,
                marginBottom: "16px",
              }}
            />
            <Text strong style={{ marginBottom: "10px" }}>
              {stateUser?.name || "User"}
            </Text>
            <Text type="secondary">{stateUser?.email || email}</Text>
          </div>
          <Text
            type="secondary"
            style={{
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            Check your email for a 6-digit verification code. Enter the code
            below to proceed.
          </Text>
          <Input.OTP
            value={verificationCode}
            onChange={setVerificationCode}
            size="large"
            style={{
              width: "100%",
              maxWidth: "400px",
              marginBottom: "16px",
            }}
          />
          <Text
            type="secondary"
            style={{
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            If you don't receive any code, please{" "}
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={sendVerificationCode}
            >
              resend
            </span>
          </Text>
        </div>
      ),
    },
    {
      title: "Reset Password",
      content: (
        <div
          className="step-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <Title
            level={3}
            style={{
              marginBottom: "20px",
              color: token.colorPrimary,
            }}
          >
            Create New Password
          </Title>
          <Text
            type="secondary"
            style={{
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            Choose a strong, unique password that you haven't used on other
            sites.
          </Text>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="large"
            style={{
              width: "100%",
              maxWidth: "400px",
              marginBottom: "16px",
            }}
          />
        </div>
      ),
    },
  ];
  const next = async () => {
    try {
      switch (current) {
        case 0:
          // Email verification step
          if (!email) {
            Message.error("Please enter an email address");
            return;
          }
          const verifyResponse = await UserService.vertifyUser(email);
          if (verifyResponse.status === "OK") {
            setCurrent(current + 1);
            setStateUser(verifyResponse.data);
          } else {
            Message.error(
              verifyResponse.message || "Email verification failed"
            );
          }
          break;
        case 1:
          if (!verificationCode) {
            Message.error("Please enter the verification code");
            return;
          }
          const verifyCode = await UserService.vertifyCode(
            stateUser?._id,
            verificationCode
          );
          if (verifyCode.status === "OK") {
            setCurrent(current + 1);
            setVerificationCode("");
            Message.success();
          } else {
            Message.error(verifyCode.message);
            setVerificationCode("");
          }
          break;

        case 2:
          if (!newPassword) {
            Message.error("Please enter a new password");
            return;
          }
          const resetResponse = await UserService.changePassword(
            stateUser?._id,
            newPassword,
            "forget"
          );
          console.log(resetResponse);
          if (resetResponse.status === "OK") {
            Message.success("Password reset successfully!");
            navigate("/login");
          } else {
            Message.error(resetResponse.message || "Password reset failed");
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error in password reset process:", error);
      Message.error("An unexpected error occurred. Please try again.");
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const containerStyle = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "800px",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
  };

  const contentStyle = {
    textAlign: "center",
    padding: "20px",
    minHeight: "250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const renderButtons = () => {
    switch (current) {
      case 0:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <Button icon={<LoginOutlined />} onClick={onBackToLogin}>
              Back to Login
            </Button>
            <Button
              type="primary"
              onClick={next}
              icon={<CheckCircleOutlined />}
            >
              Next
            </Button>
          </div>
        );
      case 1:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <Button icon={<ArrowLeftOutlined />} onClick={prev}>
              Previous
            </Button>
            <Button
              type="primary"
              onClick={next}
              icon={<CheckCircleOutlined />}
            >
              Next
            </Button>
          </div>
        );
      case 2:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <Button icon={<ArrowLeftOutlined />} onClick={prev}>
              Previous
            </Button>
            <Button
              type="primary"
              onClick={next}
              icon={<CheckCircleOutlined />}
            >
              Reset Password
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Steps
          current={current}
          items={items}
          style={{ marginBottom: "30px" }}
        />
        <div style={contentStyle}>{steps[current].content}</div>
        {renderButtons()}
      </div>
    </div>
  );
};

export default ForgotPassword;
