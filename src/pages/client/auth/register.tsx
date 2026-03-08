import { registerAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, App } from 'antd';
import { Card } from 'antd';
import { useState } from 'react';
import { useNavigate } from "react-router";
type FieldType = {
    name?: string;
    email?: string;
    password?: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const onFinish: FormProps['onFinish'] = async (values: FieldType) => {
        setIsSubmit(true);
        const res = await registerAPI({
            name: values.name!,
            email: values.email!,
            password: values.password!,
        });

        if (res.data) {
            message.success('Registration successful!');
            navigate("/login");
            // redirect to login page or home page
        }
        if (res.error) {
            message.error(res.message);
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
                <h1>Register</h1>
                <Form
                    name="basic"
                    style={{ maxWidth: 600 }}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Register
                        </Button>
                    </Form.Item>
                    <Divider>OR</Divider>
                    Has an account? <a href="/login">Login</a>
                </Form>
            </Card>
        </>
    )
}
export default RegisterPage;