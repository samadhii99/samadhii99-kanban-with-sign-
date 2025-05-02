import { useState } from "react";
import {
  UserOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Input, Button, Form, Alert, Layout, Typography } from "antd";
import "./LoginPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: any) => {
    const { email } = values;

    // Simple validation
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Here you would typically make an API call to send a reset link
      console.log("Password reset requested for:", email);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Show success message
      setSuccess(true);
    } catch (err) {
      setError("Unable to process your request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "auto",
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            margin: "20px",
          }}
        >
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{ marginBottom: "16px", padding: "0" }}
            onClick={onBack}
          >
            Back to login
          </Button>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <img
              src="/src/logo.png"
              alt="Worklenz Logo"
              style={{ height: "60px", marginBottom: "24px", maxWidth: "100%" }}
            />
            <Title level={3} style={{ margin: 0 }}>
              Reset your password
            </Title>
            <Text type="secondary">
              Enter your email and we'll send you a reset link
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          )}

          {success ? (
            <div>
              <Alert
                message="Reset link sent!"
                description="If an account exists with this email, you will receive password reset instructions shortly."
                type="success"
                showIcon
                style={{ marginBottom: "24px" }}
              />
              <Button type="primary" size="large" block onClick={onBack}>
                Return to login
              </Button>
            </div>
          ) : (
            <Form
              name="forgotPassword"
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  size="large"
                  placeholder="Email address"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  icon={<SendOutlined />}
                >
                  Send reset link
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ForgotPasswordPage;
