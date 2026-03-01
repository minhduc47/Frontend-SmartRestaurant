import { useCurrentApp } from "@/components/context/app.context";
import { Form, Radio, Input, Button, FormProps, App, Empty } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createOrderAPI } from "@/services/api";

interface IProps {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}
interface FieldType {
    fullName: string;
    phone: string;
    address: string;
    method: string;
}
const currency = (value: number) => value.toLocaleString('vi-VN') + ' đ';
const Payment = (props: IProps) => {
    const { currentStep, setCurrentStep } = props;
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleDelete = (bookId: string) => {
        const cartsFiltered = carts.filter((book) => book._id !== bookId);
        setCarts(cartsFiltered);
        localStorage.setItem('carts', JSON.stringify(cartsFiltered));
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            });
        }
    }, [user]);

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((book) => {
                sum += book.detail.price * book.quantity;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (carts.length === 0) {
            message.error('Không có sản phẩm nào trong giỏ hàng');
            return;
        }
        setIsSubmitting(true);
        const requestData: IOrderRequest = {
            name: values.fullName,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            type: values.method,
            detail: carts.map((book) => ({
                bookName: book.detail.mainText,
                quantity: book.quantity,
                _id: book._id
            })),
        }
        const res = await createOrderAPI(requestData);
        if (res.data) {
            message.success('Đặt hàng thành công');
            setCarts([]);
            localStorage.removeItem('carts');
            setCurrentStep(2);
        } else if (res.error) {
            message.error('Đặt hàng thất bại, vui lòng thử lại sau');
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', gap: 24, padding: 24, background: '#f7f7f7', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
                {carts?.length == 0 ? <Empty /> : carts.map((book) => (
                    <div key={book._id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, marginBottom: 16, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <img src={`${import.meta.env.VITE_API_URL}/images/book/${book?.detail?.thumbnail}`} alt={book.detail.mainText} style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 4, marginRight: 16 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 16 }}>{book.detail.mainText}</div>
                            <div style={{ color: '#888', fontSize: 14 }}>{currency(book.detail.price)}</div>
                        </div>
                        <div style={{ fontWeight: 500, width: 120, textAlign: 'right', marginRight: 16 }}>
                            Số lượng: {book.quantity}
                        </div>
                        <div style={{ fontWeight: 500, width: 120, textAlign: 'right', marginRight: 16 }}>
                            Tổng: {currency(book.detail.price * book.quantity)}
                        </div>
                        <DeleteTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer' }} onClick={() => handleDelete(book._id)} />
                    </div>
                ))}
                <div>
                    <span style={{ cursor: "pointer" }} onClick={() => setCurrentStep(0)}>Quay lại giỏ hàng</span>
                </div>
            </div>
            <div style={{ width: 320, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item label="Hình thức thanh toán" name="method" initialValue="COD">
                        <Radio.Group>
                            <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                            <Radio value="BANKING">Chuyển khoản ngân hàng</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="* Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input placeholder="Nhập họ tên" size="large" />
                    </Form.Item>
                    <Form.Item label="* Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input placeholder="Nhập số điện thoại" size="large" />
                    </Form.Item>
                    <Form.Item label="* Địa chỉ nhận hàng" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng' }]}>
                        <Input.TextArea placeholder="Nhập địa chỉ nhận hàng" size="large" autoSize={{ minRows: 3 }} />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 16, marginTop: 16 }}>
                        <span>Tạm tính</span>
                        <span>{currency(totalPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 22, color: '#e74c3c' }}>
                        <span>Tổng tiền</span>
                        <span>{currency(totalPrice)}</span>
                    </div>
                    <Form.Item style={{ marginTop: 16 }}>
                        <Button type="primary" style={{ background: '#e74c3c', border: 'none', fontSize: 18, fontWeight: 500, width: '100%', height: 48 }}
                            onClick={() => form.submit()}
                            loading={isSubmitting}>
                            Đặt Hàng ({carts.length})
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Payment;