import { createOrderAPI, getTablesAPI } from '@/services/api';
import { getCategoryAPI, getListDishAPI } from '@/services/dish.api';
import { resolveStorageUrl } from '@/services/helper';
import {
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import {
    App,
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Flex,
    Input,
    Row,
    Select,
    Skeleton,
    Space,
    Tabs,
    Tag,
    Typography,
} from 'antd';
import { useEffect, useState } from 'react';

const { Text, Title } = Typography;

// ── local types ────────────────────────────────────────────────────────────────

interface ICartItem {
    dish: IDish;
    quantity: number;
    note: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const VND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// ── component ─────────────────────────────────────────────────────────────────

const DishOrderPage = () => {
    const { notification, modal } = App.useApp();

    // ── data state ──────────────────────────────────────────────────────────
    const [dishes, setDishes] = useState<IDish[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loadingDishes, setLoadingDishes] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [tableOptions, setTableOptions] = useState<{ label: string; value: number }[]>([]);

    // ── cart state ──────────────────────────────────────────────────────────
    const [cart, setCart] = useState<Map<number, ICartItem>>(new Map());
    const [tableId, setTableId] = useState<number | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    // ── fetch data ───────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            setLoadingDishes(true);
            const [dishRes, catRes, tableRes] = await Promise.all([
                getListDishAPI('page=1&pageSize=100&sort=-createdAt'),
                getCategoryAPI(),
                getTablesAPI('page=1&pageSize=200'),
            ]);
            if (dishRes.data) setDishes(dishRes.data.result.filter((d) => d.active));
            if (catRes.data) setCategories(catRes.data.result); // getCategoryAPI trả về IModelPaginate
            if (tableRes.data) {
                setTableOptions(
                    tableRes.data.result
                        .filter((table) => table.occupied === 'AVAILABLE')
                        .map((table) => ({ label: table.name, value: table.id }))
                );
            }
            setLoadingDishes(false);
        };
        fetchAll();
    }, []);

    // ── derived ──────────────────────────────────────────────────────────────
    const filteredDishes =
        activeCategory === 'all'
            ? dishes
            : dishes.filter((d) => String(d.category?.id) === activeCategory);

    const cartItems = Array.from(cart.values());
    const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cartItems.reduce((s, i) => s + i.dish.price * i.quantity, 0);

    const categoryTabs = [
        { key: 'all', label: 'Tất cả' },
        ...categories.map((c) => ({ key: String(c.id), label: c.name })),
    ];

    // ── cart helpers ─────────────────────────────────────────────────────────
    const addToCart = (dish: IDish) => {
        setCart((prev) => {
            const next = new Map(prev);
            const existing = next.get(dish.id);
            if (existing) {
                next.set(dish.id, { ...existing, quantity: existing.quantity + 1 });
            } else {
                next.set(dish.id, { dish, quantity: 1, note: '' });
            }
            return next;
        });
    };

    const updateQty = (dishId: number, delta: number) => {
        setCart((prev) => {
            const next = new Map(prev);
            const item = next.get(dishId);
            if (!item) return prev;
            const newQty = item.quantity + delta;
            if (newQty <= 0) {
                next.delete(dishId);
            } else {
                next.set(dishId, { ...item, quantity: newQty });
            }
            return next;
        });
    };

    const updateNote = (dishId: number, note: string) => {
        setCart((prev) => {
            const next = new Map(prev);
            const item = next.get(dishId);
            if (item) next.set(dishId, { ...item, note });
            return next;
        });
    };

    const removeItem = (dishId: number) => {
        setCart((prev) => {
            const next = new Map(prev);
            next.delete(dishId);
            return next;
        });
    };

    const clearCart = () => setCart(new Map());

    // ── submit ───────────────────────────────────────────────────────────────
    const handleOrder = async () => {
        if (!tableId) {
            notification.warning({ message: 'Vui lòng chọn số bàn!' });
            return;
        }
        if (cartItems.length === 0) {
            notification.warning({ message: 'Giỏ hàng đang trống!' });
            return;
        }

        modal.confirm({
            title: `Xác nhận đặt món – Bàn ${tableId}`,
            content: (
                <div>
                    <p>Tổng cộng <strong>{totalItems}</strong> món —&nbsp;
                        <strong style={{ color: '#f57800' }}>{VND(totalPrice)}</strong>
                    </p>
                    <p>Bạn có chắc muốn gửi yêu cầu đặt món?</p>
                </div>
            ),
            okText: 'Đặt món',
            cancelText: 'Hủy',
            onOk: async () => {
                setSubmitting(true);
                const payload: ICreateOrderRequest = {
                    orderType: 'IN_STORE',
                    tableId,
                    items: cartItems.map((i) => ({
                        dishId: i.dish.id,
                        quantity: i.quantity,
                        note: i.note || undefined,
                    })),
                };
                const res = await createOrderAPI(payload);
                setSubmitting(false);
                if (res?.data) {
                    notification.success({
                        message: 'Đặt món thành công!',
                        description: `Đơn hàng của bàn ${tableId} đã được ghi nhận.`,
                    });
                    clearCart();
                    setTableId(undefined);
                } else {
                    notification.error({
                        message: 'Đặt món thất bại!',
                        description: res?.message,
                    });
                }
            },
        });
    };

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '16px 24px' }}>
            <Title level={3} style={{ marginBottom: 16 }}>
                🍽️ Đặt món tại bàn
            </Title>

            <Row gutter={16} align="top">
                {/* ── LEFT: dish list ────────────────────────────────────── */}
                <Col xs={24} lg={15}>
                    <Card bodyStyle={{ padding: '12px 16px' }}>
                        <Tabs
                            activeKey={activeCategory}
                            onChange={setActiveCategory}
                            items={categoryTabs}
                            style={{ marginBottom: 12 }}
                        />

                        {loadingDishes ? (
                            <Row gutter={[12, 12]}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Col key={i} xs={24} sm={12} md={8} xl={6}>
                                        <Card>
                                            <Skeleton active avatar paragraph={{ rows: 2 }} />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : filteredDishes.length === 0 ? (
                            <Empty description="Không có món ăn nào" />
                        ) : (
                            <Row gutter={[12, 12]}>
                                {filteredDishes.map((dish) => {
                                    const inCart = cart.get(dish.id);
                                    return (
                                        <Col key={dish.id} xs={24} sm={12} md={8} xl={6}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img
                                                        alt={dish.name}
                                                        src={resolveStorageUrl(dish.image, 'dish')}
                                                        style={{
                                                            height: 140,
                                                            objectFit: 'cover',
                                                        }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                'https://placehold.co/300x140?text=No+Image';
                                                        }}
                                                    />
                                                }
                                                bodyStyle={{ padding: '10px 12px' }}
                                            >
                                                <Flex vertical gap={6}>
                                                    <Text strong ellipsis title={dish.name}>
                                                        {dish.name}
                                                    </Text>
                                                    <Tag color="blue" style={{ width: 'fit-content' }}>
                                                        {dish.category?.name}
                                                    </Tag>
                                                    <Flex justify="space-between" align="center">
                                                        <Text style={{ color: '#f57800', fontWeight: 600 }}>
                                                            {VND(dish.price)}
                                                        </Text>
                                                        {inCart ? (
                                                            <Space size={4}>
                                                                <Button
                                                                    size="small"
                                                                    icon={<MinusOutlined />}
                                                                    onClick={() => updateQty(dish.id, -1)}
                                                                />
                                                                <Text style={{ minWidth: 20, textAlign: 'center' }}>
                                                                    {inCart.quantity}
                                                                </Text>
                                                                <Button
                                                                    size="small"
                                                                    type="primary"
                                                                    icon={<PlusOutlined />}
                                                                    onClick={() => updateQty(dish.id, 1)}
                                                                />
                                                            </Space>
                                                        ) : (
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => addToCart(dish)}
                                                            >
                                                                Thêm
                                                            </Button>
                                                        )}
                                                    </Flex>
                                                </Flex>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </Card>
                </Col>

                {/* ── RIGHT: cart ────────────────────────────────────────── */}
                <Col xs={24} lg={9}>
                    <div style={{ position: 'sticky', top: 16 }}>
                        <Card
                            title={
                                <Flex justify="space-between" align="center">
                                    <Space>
                                        <Badge count={totalItems} showZero color="#f57800">
                                            <ShoppingCartOutlined style={{ fontSize: 20 }} />
                                        </Badge>
                                        <span>Giỏ hàng</span>
                                    </Space>
                                    {cartItems.length > 0 && (
                                        <Button
                                            size="small"
                                            danger
                                            type="link"
                                            onClick={clearCart}
                                        >
                                            Xóa tất cả
                                        </Button>
                                    )}
                                </Flex>
                            }
                        >
                            {/* Table selector */}
                            <Flex vertical gap={4} style={{ marginBottom: 16 }}>
                                <Text strong>Số bàn</Text>
                                <Select
                                    placeholder="Chọn bàn..."
                                    options={tableOptions}
                                    value={tableId}
                                    onChange={setTableId}
                                    style={{ width: '100%' }}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Flex>

                            <Divider style={{ margin: '0 0 12px' }} />

                            {/* Cart items */}
                            {cartItems.length === 0 ? (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Chưa có món nào"
                                    style={{ padding: '20px 0' }}
                                />
                            ) : (
                                <Flex vertical gap={12}>
                                    {cartItems.map(({ dish, quantity, note }) => (
                                        <div key={dish.id}>
                                            <Flex gap={10} align="flex-start">
                                                <Avatar
                                                    shape="square"
                                                    size={48}
                                                    src={dish.image}
                                                    style={{ flexShrink: 0 }}
                                                />
                                                <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                                                    <Flex justify="space-between" align="center">
                                                        <Text
                                                            strong
                                                            ellipsis
                                                            style={{ maxWidth: 140 }}
                                                            title={dish.name}
                                                        >
                                                            {dish.name}
                                                        </Text>
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => removeItem(dish.id)}
                                                        />
                                                    </Flex>
                                                    <Flex justify="space-between" align="center">
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {VND(dish.price)} × {quantity}
                                                        </Text>
                                                        <Space size={4}>
                                                            <Button
                                                                size="small"
                                                                icon={<MinusOutlined />}
                                                                onClick={() => updateQty(dish.id, -1)}
                                                            />
                                                            <Text style={{ minWidth: 20, textAlign: 'center' }}>
                                                                {quantity}
                                                            </Text>
                                                            <Button
                                                                size="small"
                                                                type="primary"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => updateQty(dish.id, 1)}
                                                            />
                                                        </Space>
                                                    </Flex>
                                                    <Input
                                                        size="small"
                                                        placeholder="Ghi chú (ít cay, không hành,...)"
                                                        value={note}
                                                        onChange={(e) => updateNote(dish.id, e.target.value)}
                                                        style={{ marginTop: 4 }}
                                                    />
                                                </Flex>
                                            </Flex>
                                            <Divider style={{ margin: '10px 0 0' }} />
                                        </div>
                                    ))}
                                </Flex>
                            )}

                            {/* Total & submit */}
                            <Flex justify="space-between" align="center" style={{ marginTop: 16 }}>
                                <Text strong>Tổng cộng</Text>
                                <Text strong style={{ fontSize: 18, color: '#f57800' }}>
                                    {VND(totalPrice)}
                                </Text>
                            </Flex>

                            <Button
                                type="primary"
                                block
                                size="large"
                                style={{ marginTop: 12 }}
                                disabled={cartItems.length === 0 || !tableId}
                                loading={submitting}
                                onClick={handleOrder}
                            >
                                Đặt món
                            </Button>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DishOrderPage;
