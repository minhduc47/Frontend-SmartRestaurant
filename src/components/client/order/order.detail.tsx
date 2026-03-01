

import React, { useEffect, useState } from 'react';
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
    const { currentStep, setCurrentStep } = props;
    const { message } = App.useApp();
    const handleDelete = (bookId: string) => {
        const cartsFiltered = carts.filter((book) => book._id !== bookId);
        setCarts(cartsFiltered);
        localStorage.setItem('carts', JSON.stringify(cartsFiltered));
    }
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

    const handleChangeQuantity = (bookId: string, value: number) => {
        if (value < 1) return; // Prevent setting quantity to less than 1
        if (!isNaN(+value)) {
            const cartStorage = localStorage.getItem('carts');
            if (cartStorage && bookId) {
                const carts = JSON.parse(cartStorage);
                const book = carts.find((item: any) => item._id === bookId);
                if (book) {
                    book.quantity = value;
                    setCarts([...carts]);
                    localStorage.setItem('carts', JSON.stringify(carts));
                }
            }
        }

    };
    const handleSubmit = () => {
        if (carts.length === 0) {
            message.error('Không có sản phẩm nào trong giỏ hàng');
            return;
        }
        setCurrentStep(1);
    };
    return (
        <div style={{ display: 'flex', gap: 24, padding: 24, background: '#f7f7f7', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
                {
                    carts?.length == 0 ? <Empty /> :
                        carts.map((book) => (
                            <div key={book._id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, marginBottom: 16, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <img src={`${import.meta.env.VITE_API_URL}/images/book/${book?.detail?.thumbnail}`} alt={book.detail.mainText} style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 4, marginRight: 16 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>{book.detail.mainText}</div>
                                    <div style={{ color: '#888', fontSize: 14 }}>{currency(book.detail.price)}</div>
                                </div>
                                <InputNumber
                                    min={1}
                                    max={book.detail.quantity}
                                    value={book.quantity}
                                    onChange={(value) => { handleChangeQuantity(book._id, value || 1); }}
                                    size="middle"
                                />
                                <div style={{ fontWeight: 500, width: 120, textAlign: 'right', marginRight: 16 }}>
                                    Tổng: {currency(book.detail.price * book.quantity)}
                                </div>
                                <DeleteTwoTone
                                    twoToneColor="#f57800"
                                    style={{ cursor: 'pointer' }} onClick={() => handleDelete(book._id)} />
                            </div>
                        ))}
            </div>
            <div style={{ width: 320, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 16 }}>
                    <span>Tạm tính</span>
                    <span>{currency(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 22, color: '#e74c3c' }}>
                    <span>Tổng tiền</span>
                    <span>{currency(totalPrice)}</span>
                </div>
                <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 0', fontSize: 18, fontWeight: 500, cursor: 'pointer', marginTop: 16 }}
                    onClick={() => handleSubmit()}>
                    Mua Hàng ({carts.length})
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;