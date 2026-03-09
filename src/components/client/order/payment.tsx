import { useCurrentApp } from "@/components/context/app.context";
import { Form, Radio, Input, Button, FormProps, App, Empty, Select } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createOrderAPI, getTablesAPI } from "@/services/api";
import { resolveStorageUrl } from "@/services/helper";

interface IProps {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

interface FieldType {
    tableId?: number;
    orderType: 'IN_STORE' | 'DELIVERY';
    note?: string;
}

const VND = (value: number) => value.toLocaleString('vi-VN') + ' đ';

const Payment = (props: IProps) => {
    const { setCurrentStep } = props;
    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);
    const [form] = Form.useForm<FieldType>();
    const { message } = App.useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tableOptions, setTableOptions] = useState<{ label: string; value: number }[]>([]);

    const handleDelete = (dishId: number) => {
        const updated = carts.filter((item) => item.dish.id !== dishId);
        setCarts(updated);
        localStorage.setItem('carts', JSON.stringify(updated));
    };

    useEffect(() => {
        const sum = carts.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
        setTotalPrice(sum);
    }, [carts]);

    useEffect(() => {
        const fetchTables = async () => {
            const res = await getTablesAPI('page=1&pageSize=200');
            if (res.data) {
                setTableOptions(
                    res.data.result
                        .filter((table) => table.occupied === 'AVAILABLE')
                        .map((table) => ({ label: table.name, value: table.id }))
                );
            }
        };

        fetchTables();
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (carts.length === 0) {
            message.error('Khong co mon nao trong gio hang');
            return;
        }
        setIsSubmitting(true);

        const requestData: ICreateOrderRequest = {
            orderType: values.orderType,
            tableId: values.tableId,
            note: values.note,
            items: carts.map((item) => ({
                dishId: item.dish.id,
                quantity: item.quantity,
            })),
        };

        const res = await createOrderAPI(requestData);
        if (res.data) {
            message.success('Dat mon thanh cong!');
            setCarts([]);
            localStorage.removeItem('carts');
            setCurrentStep(2);
        } else {
            message.error(res.message ?? 'Dat mon that bai, vui long thu lai.');
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', gap: 24, padding: 24, background: '#f7f7f7', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
                {carts.length === 0 ? (
                    <Empty description="Gio hang trong" />
                ) : (
                    carts.map((item) => (
                        <div
                            key={item.dish.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#fff',
                                borderRadius: 8,
                                marginBottom: 16,
                                padding: 16,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                        >
                            <img
                                src={resolveStorageUrl(item.dish.image, 'dish')}
                                alt={item.dish.name}
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, fontSize: 16 }}>{item.dish.name}</div>
                                <div style={{ color: '#888', fontSize: 14 }}>{VND(item.dish.price)}</div>
                            </div>
                            <div style={{ fontWeight: 500, width: 120, textAlign: 'right', marginRight: 16 }}>
                                So luong: {item.quantity}
                            </div>
                            <div style={{ fontWeight: 500, width: 120, textAlign: 'right', marginRight: 16 }}>
                                Tong: {VND(item.dish.price * item.quantity)}
                            </div>
                            <DeleteTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDelete(item.dish.id)}
                            />
                        </div>
                    ))
                )}
                <div>
                    <span style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(0)}>
                        Quay lai gio hang
                    </span>
                </div>
            </div>

            <div
                style={{
                    width: 320,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 24,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}
            >
                <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ orderType: 'IN_STORE' }}>
                    <Form.Item label="Hinh thuc" name="orderType" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="IN_STORE">Tai ban</Radio>
                            <Radio value="DELIVERY">Giao hang</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="So ban"
                        name="tableId"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (getFieldValue('orderType') === 'DELIVERY' || value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Vui long chon ban'));
                                },
                            }),
                        ]}
                    >
                        <Select
                            placeholder="Chon ban"
                            options={tableOptions}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Ghi chu" name="note">
                        <Input.TextArea placeholder="Ghi chu them (tuy chon)" autoSize={{ minRows: 2 }} />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 16 }}>
                        <span>Tam tinh</span>
                        <span>{VND(totalPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 22, color: '#e74c3c', marginBottom: 16 }}>
                        <span>Tong tien</span>
                        <span>{VND(totalPrice)}</span>
                    </div>

                    <Button
                        type="primary"
                        style={{ background: '#e74c3c', border: 'none', fontSize: 18, fontWeight: 500, width: '100%', height: 48 }}
                        onClick={() => form.submit()}
                        loading={isSubmitting}
                    >
                        Dat Mon ({carts.length})
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Payment;
