import { useCurrentApp } from '@/components/context/app.context';
import { updateUserInfoAPI } from '@/services/api';
import { App, Button, Form, FormProps, Input } from 'antd';
import { useEffect, useState } from 'react';

interface FieldType {
    id: number;
    name: string;
    email: string;
}

const UserInfo = () => {
    const { user, setUser } = useCurrentApp();
    const [form] = Form.useForm<FieldType>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        if (!user) return;
        form.setFieldsValue({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }, [form, user]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmitting(true);
        const res = await updateUserInfoAPI(values.id, values.name);
        if (res && res.data && user) {
            setUser({ ...user, name: values.name });
            message.success('Cap nhat thong tin thanh cong!');
        } else {
            message.error(`${res.message}`);
        }
        setIsSubmitting(false);
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
            <Form.Item name="id" hidden>
                <Input disabled />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui long nhap email!' }]}>
                <Input disabled />
            </Form.Item>

            <Form.Item name="name" label="Ten hien thi" rules={[{ required: true, message: 'Vui long nhap ten hien thi!' }]}>
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    Cap nhat
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserInfo;
