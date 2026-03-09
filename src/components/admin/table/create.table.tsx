import { createTableAPI } from '@/services/api';
import { App, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';

interface IProps {
    isOpenCreate: boolean;
    setIsOpenCreate: (isOpen: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    qrToken?: string;
};

const CreateTable = ({ isOpenCreate, setIsOpenCreate, refreshTable }: IProps) => {
    const [form] = Form.useForm<FieldType>();
    const { message, notification } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const res = await createTableAPI({
            name: values.name,
            qrToken: values.qrToken,
        });

        if (res.data) {
            message.success('Tao ban thanh cong');
            form.resetFields();
            setIsOpenCreate(false);
            refreshTable();
            return;
        }

        notification.error({
            message: 'Tao ban that bai',
            description: res.message,
        });
    };

    return (
        <Modal
            title="Tao ban moi"
            open={isOpenCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                form.resetFields();
                setIsOpenCreate(false);
            }}
            okText="Luu"
            cancelText="Huy"
        >
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
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

export default CreateTable;
