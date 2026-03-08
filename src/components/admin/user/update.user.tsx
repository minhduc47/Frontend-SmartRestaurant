import { updateUserAPI } from '@/services/api';
import { App, Modal } from 'antd';
import { Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { useEffect } from 'react';

interface IProps {
    userEditing: IUserTable | null;
    isOpenModalUpdate: boolean;
    setIsOpenModalUpdate: (isOpen: boolean) => void;
    setUserEditing: (user: IUserTable | null) => void;
    refreshTable: () => void;
}

type FieldType = {
    id?: number;         // BE: User.id (long) — KHÔNG phải _id string
    name?: string;       // BE: User.name — KHÔNG phải fullName
    email?: string;
    age?: number;
    address?: string;
};

const UpdateUser = (props: IProps) => {
    const { userEditing, isOpenModalUpdate, setIsOpenModalUpdate, refreshTable, setUserEditing } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (userEditing) {
            form.setFieldsValue({
                id: userEditing.id,
                name: userEditing.name,
                email: userEditing.email,
                age: userEditing.age,
                address: userEditing.address,
            });
        }
    }, [userEditing]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        // updateUserAPI(id: number, name: string)
        const res = await updateUserAPI(values.id!, values.name!);

        if (res.data) {
            form.resetFields();
            setIsOpenModalUpdate(false);
            setUserEditing(null);
            message.success('User updated successfully!');
            refreshTable();
        } else {
            // Handle error case
            notification.error({
                message: 'Error',
                description: res.message,
            });
        }
    };

    const onCancel = () => {
        setIsOpenModalUpdate(false);
        setUserEditing(null);
        form.resetFields();
    }

    return (
        <>
            <Modal
                title="Update User"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpenModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={onCancel}
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
                        hidden
                        label="id"
                        name="id"
                        rules={[{ required: true }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Tên đầy đủ"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input />
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
        </>
    )
}

export default UpdateUser;