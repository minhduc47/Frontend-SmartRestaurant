import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, InputNumber, Typography, Divider, message, Card, Tag } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getDishByIdAPI } from '@/services/dish.api';
import { useCurrentApp } from '@/components/context/app.context';
import { resolveStorageUrl } from '@/services/helper';
import './dish.detail.scss';

const { Title, Text, Paragraph } = Typography;

const DishDetail = () => {
    const params = useParams<{ id: string }>();
    const [dish, setDish] = useState<IDish | null>(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { carts, setCarts } = useCurrentApp();

    useEffect(() => {
        const fetchDishDetail = async () => {
            if (!params.id) return;
            setLoading(true);
            const res = await getDishByIdAPI(params.id);
            if (res?.data) {
                setDish(res.data);
            } else {
                message.error(`${res?.message ?? 'Khong tim thay mon an'}`);
            }
            setLoading(false);
        };

        fetchDishDetail();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!dish) return;

        const existingCart = carts.find((item) => item.dish.id === dish.id);
        let nextCarts: ICart[];

        if (existingCart) {
            nextCarts = carts.map((item) =>
                item.dish.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            nextCarts = [...carts, { dish, quantity }];
        }

        setCarts(nextCarts);
        localStorage.setItem('carts', JSON.stringify(nextCarts));
        message.success('Da them vao gio hang');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    if (loading) {
        return <div style={{ padding: 24 }}>Loading...</div>;
    }

    if (!dish) {
        return (
            <div style={{ padding: 24 }}>
                <Title level={2}>Khong tim thay mon an</Title>
            </div>
        );
    }

    return (
        <div className="dish-page">
            <div className="container">
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <img
                            src={resolveStorageUrl(dish.image, 'dish')}
                            alt={dish.name}
                            style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
                        />
                    </Col>

                    <Col xs={24} md={12}>
                        <div className="dish-details">
                            <Tag color="blue">{dish.category?.name}</Tag>
                            <Title level={2} className="dish-title">{dish.name}</Title>

                            <div className="dish-price">
                                <Text className="current-price">{formatPrice(dish.price)}</Text>
                            </div>

                            <Divider />

                            <div className="dish-actions">
                                <div className="quantity-section">
                                    <Text strong>So luong</Text>
                                    <div className="quantity-controls">
                                        <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value || 1)} />
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <Button
                                        icon={<ShoppingCartOutlined />}
                                        className="add-to-cart-btn"
                                        onClick={handleAddToCart}
                                        type="primary"
                                    >
                                        Them vao gio hang
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row style={{ marginTop: '48px' }}>
                    <Col span={24}>
                        <Card title="Mo ta mon an" className="dish-description-card">
                            <Paragraph>{dish.description || 'Khong co mo ta'}</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DishDetail;
