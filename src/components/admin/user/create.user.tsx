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
    name?: string;
    email?: string;
    password?: string;
    age?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
};

const CreateUser = (props: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const { isOpenCreate, setIsOpenCreate, refreshTable } = props;
    const onFinish: FormProps['onFinish'] = async (values: FieldType) => {
        const res = await createUserAPI({
            name: values.name!,
            email: values.email!,
            password: values.password!,
            age: values.age,
            gender: values.gender,
            address: values.address,
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
                    label="Tên đầy đủ"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Tuổi"
                    name="age"
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateUser;