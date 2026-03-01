import { useCurrentApp } from "@/components/context/app.context";
import { updateUserPasswordAPI } from "@/services/api";
import { App, Button, Form, FormProps, Input } from "antd";
import { useEffect, useState } from "react";

interface FieldType {
    email: string;
    oldpass: string;
    newpass: string;
}
const ChangePassword = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const { user } = useCurrentApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
            });
        }
    }, [user]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        setIsSubmitting(true);
        const { email, oldpass, newpass } = values;
        console.log(values);
        const res = await updateUserPasswordAPI(email, oldpass, newpass);
        if (res && res.data) {
            message.success("Password changed successfully!");
            form.setFieldsValue({
                oldpass: '',
                newpass: '',
            });
        }
        if (res.error) {
            message.error(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div>
            <h2>Change Password</h2>
            <Form
                form={form}
                name="change-password"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="oldpass" label="Old Password" rules={[{ required: true, message: 'Please input your old password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="newpass" label="New Password" rules={[{ required: true, message: 'Please input your new password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ padding: '6px 24px', borderRadius: 4, border: 'none', cursor: 'pointer' }} loading={isSubmitting}>Change Password</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ChangePassword;