import { createUserAPI } from '@/services/api';
import { App, Modal } from 'antd';
import { Form, Input } from 'antd';
import type { FormProps } from 'antd';


interface IProps {
    isOpenCreate: boolean;
    setIsOpenCreate: (isOpen: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
};

const CreateUser = (props: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const { isOpenCreate, setIsOpenCreate, refreshTable } = props;
    const onFinish: FormProps['onFinish'] = async (values: FieldType) => {
        const res = await createUserAPI({
            fullName: values.fullName!,
            email: values.email!,
            password: values.password!,
            phone: values.phone!
        });

        if (res.data) {
            form.resetFields();
            setIsOpenCreate(false);
            message.success('User created successfully!');
            refreshTable();
        } else {
            // Handle error case
            notification.error({
                message: 'Error',
                description: res.message,
            });
        }
    };
    return (
        <Modal
            title="Create User"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isOpenCreate}
            onOk={() => {
                form.submit();
            }}
            onCancel={() => {
                form.resetFields();
                setIsOpenCreate(false);
            }}
        >
            <Form
                form={form}
                name="basic"
                style={{ maxWidth: 600 }}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Full Name"
                    name="fullName"
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

                <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateUser;