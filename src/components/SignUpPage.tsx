import { useState } from "react";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Input, Button, Checkbox, Form, Alert, Layout, Typography } from "antd";
import "./LoginPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

interface SignUpPageProps {
  onBack: () => void;
  onSignUp: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onBack, onSignUp }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: any) => {
    const { fullName, email, password, confirmPassword, agreeTerms } = values;

    // Simple validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      // Here you would typically make an API call to register the user
      console.log("Sign up attempt with:", { fullName, email });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Call the onSignUp callback to navigate to the appropriate page
      onSignUp();
    } catch (err) {
      setError("Unable to create account. Please try again later.");
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
              Create your account
            </Title>
            <Text type="secondary">Enter your details to get started</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form
            name="signup"
            form={form}
            layout="vertical"
            initialValues={{ agreeTerms: false }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                size="large"
                placeholder="Full name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                size="large"
                placeholder="Email address"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                size="large"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                size="large"
                placeholder="Confirm password"
              />
            </Form.Item>

            <Form.Item
              name="agreeTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "You must agree to the terms and privacy policy"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                I agree to the{" "}
                <Button type="link" style={{ padding: "0 2px" }}>
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button type="link" style={{ padding: "0 2px" }}>
                  Privacy Policy
                </Button>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={<UserAddOutlined />}
              >
                Create account
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text type="secondary">Already have an account? </Text>
            <Button type="link" onClick={onBack} style={{ padding: "0 4px" }}>
              Log in
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SignUpPage;
