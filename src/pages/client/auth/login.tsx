import { useCurrentApp } from '@/components/context/app.context';
import { loginAPI } from '@/services/api';
import { Button, Divider, Form, Input, App } from 'antd';
import { Card } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { useNavigate } from "react-router";
type FieldType = {
    username: string;
    password: string;
};
const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();
    const onFinish: FormProps['onFinish'] = async (values: FieldType) => {
        setIsSubmit(true);
        const res = await loginAPI(values.username, values.password);
        if (res.data) {
            // Assuming res.data contains the login response
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            message.success('Login successful!');
            navigate("/");
            // redirect to dashboard or home page
        } else {
            notification.error({
                message: 'Login failed',
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
        setIsSubmit(false);
    };
    return (
        <>
            <Card
                style={{
                    width: 600,
                    margin: 'auto',
                    marginTop: '50px',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}
            >
                <h1>Login</h1>
                <Form<FieldType>
                    name="basic"
                    style={{ maxWidth: 600 }}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="username"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Login
                        </Button>
                    </Form.Item>
                    <Divider>OR</Divider>
                    Don't have an account? <a href="/register">Register</a>
                </Form>
            </Card>
        </>
    )
}
export default LoginPage;