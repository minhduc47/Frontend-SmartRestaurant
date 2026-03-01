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
    _id?: string;
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
};

const UpdateUser = (props: IProps) => {
    const { userEditing, isOpenModalUpdate, setIsOpenModalUpdate, refreshTable, setUserEditing } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (userEditing) {
            form.setFieldsValue({
                _id: userEditing._id,
                fullName: userEditing.fullName,
                email: userEditing.email,
                phone: userEditing.phone,
            });

        }
    }, [userEditing]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        // Assuming updateUserAPI is a function that updates the user
        const res = await updateUserAPI(values?._id!, values.fullName!, values.phone!);

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
                        label="_id"
                        name="_id"
                        rules={[{ required: true, message: 'Please input your _id!' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
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
        </>
    )
}

export default UpdateUser;