import { updateTableAPI } from '@/services/api';
import { App, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { useEffect } from 'react';

interface IProps {
    tableEditing: IRestaurantTable | null;
    isOpenUpdate: boolean;
    setIsOpenUpdate: (isOpen: boolean) => void;
    setTableEditing: (table: IRestaurantTable | null) => void;
    refreshTable: () => void;
}

type FieldType = {
    id: number;
    name: string;
    qrToken?: string;
};

const UpdateTable = ({
    tableEditing,
    isOpenUpdate,
    setIsOpenUpdate,
    setTableEditing,
    refreshTable,
}: IProps) => {
    const [form] = Form.useForm<FieldType>();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (!tableEditing) return;

        form.setFieldsValue({
            id: tableEditing.id,
            name: tableEditing.name,
            qrToken: tableEditing.qrToken,
        });
    }, [tableEditing, form]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const res = await updateTableAPI(values.id, {
            name: values.name,
            qrToken: values.qrToken,
        });

        if (res.data) {
            message.success('Cap nhat ban thanh cong');
            form.resetFields();
            setIsOpenUpdate(false);
            setTableEditing(null);
            refreshTable();
            return;
        }

        notification.error({
            message: 'Cap nhat ban that bai',
            description: res.message,
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setIsOpenUpdate(false);
        setTableEditing(null);
    };

    return (
        <Modal
            title="Cap nhat ban"
            open={isOpenUpdate}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Luu"
            cancelText="Huy"
        >
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Ten ban"
                    name="name"
                    rules={[{ required: true, message: 'Vui long nhap ten ban' }]}
                >
                    <Input placeholder="VD: Ban A1" />
                </Form.Item>

                <Form.Item label="QR Token" name="qrToken">
                    <Input placeholder="Nhap QR token neu co" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateTable;
