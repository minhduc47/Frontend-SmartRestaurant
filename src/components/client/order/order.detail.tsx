import { useEffect, useState } from 'react';
import { App, Empty, InputNumber } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import { DeleteTwoTone } from '@ant-design/icons';

interface IProps {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

const currency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

const OrderDetail = (props: IProps) => {
    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);
    const { setCurrentStep } = props;
    const { message } = App.useApp();

    const handleDelete = (dishId: number) => {
        const cartsFiltered = carts.filter((item) => item.dish.id !== dishId);
        setCarts(cartsFiltered);
        localStorage.setItem('carts', JSON.stringify(cartsFiltered));
    };

    useEffect(() => {
        const sum = carts.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
        setTotalPrice(sum);
    }, [carts]);

    const handleChangeQuantity = (dishId: number, value: number) => {
        if (value < 1) return;

        const nextCarts = carts.map((item) =>
            item.dish.id === dishId ? { ...item, quantity: value } : item
        );

        setCarts(nextCarts);
        localStorage.setItem('carts', JSON.stringify(nextCarts));
    };

    const handleSubmit = () => {
        if (carts.length === 0) {
            message.error('Khong co mon nao trong gio hang');
            return;
        }
        setCurrentStep(1);
    };

    return (
        <div style={{ display: 'flex', gap: 24, padding: 24, background: '#f7f7f7', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
                {carts.length === 0 ? (
                    <Empty />
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
                                src={`${import.meta.env.VITE_API_URL}/storage/dish/${item.dish.image}`}
                                alt={item.dish.name}
                                style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, fontSize: 16 }}>{item.dish.name}</div>
                                <div style={{ color: '#888', fontSize: 14 }}>{currency(item.dish.price)}</div>
                            </div>
                            <InputNumber
                                min={1}
                                value={item.quantity}
                                onChange={(value) => handleChangeQuantity(item.dish.id, value || 1)}
                                size="middle"
                            />
                            <div style={{ fontWeight: 500, width: 120, textAlign: 'right', marginRight: 16 }}>
                                Tong: {currency(item.dish.price * item.quantity)}
                            </div>
                            <DeleteTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDelete(item.dish.id)}
                            />
                        </div>
                    ))
                )}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 16 }}>
                    <span>Tam tinh</span>
                    <span>{currency(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 22, color: '#e74c3c' }}>
                    <span>Tong tien</span>
                    <span>{currency(totalPrice)}</span>
                </div>
                <button
                    style={{
                        background: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '12px 0',
                        fontSize: 18,
                        fontWeight: 500,
                        cursor: 'pointer',
                        marginTop: 16,
                    }}
                    onClick={handleSubmit}
                >
                    Mua Hang ({carts.length})
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;
