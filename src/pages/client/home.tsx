import { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Card,
    Carousel,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Rate,
    Space,
    TimePicker,
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getCategoryAPI, getListDishAPI } from '@/services/dish.api';
import { resolveStorageUrl } from '@/services/helper';
import './home.scss';

interface ICategoryOption {
    label: string;
    value: number;
}

const testimonials = [
    {
        name: 'Mosan Cameron',
        role: 'Giám đốc điều hành Fedex',
        feedback:
            'Không gian nhà hàng thật tuyệt vời và món ăn vượt xa mong đợi. Dịch vụ chu đáo, tôi chắc chắn sẽ quay lại.',
    },
    {
        name: 'Sarah Johnson',
        role: 'Trưởng phòng Marketing',
        feedback:
            'Một trải nghiệm ẩm thực đáng nhớ, món ăn được trình bày đẹp mắt và hương vị rất độc đáo.',
    },
    {
        name: 'John Carter',
        role: 'Giám đốc Sáng tạo',
        feedback:
            'Bữa tối tuyệt vời với không khí ấm cúng, nhân viên thân thiện và món tráng miệng ấn tượng.',
    },
];

const blogs = [
    {
        id: 1,
        image: '/webtop/blog_1.png',
        title: 'Nghe thuat ket hop ruou vang va mon Au',
        desc: 'Cách lựa chọn rượu vang phù hợp với từng nhóm hương vị để nâng tầm trải nghiệm bữa tối.',
    },
    {
        id: 2,
        image: '/webtop/blog_2.png',
        title: '5 nguyen lieu theo mua lam nen menu dac biet',
        desc: 'Từ nông trại đến bàn ăn, hành trình của nguyên liệu tươi sạch trong từng món đặc sắc.',
    },
    {
        id: 3,
        image: '/webtop/blog_3.png',
        title: 'Bi quyet tao nen mon khai vi day an tuong',
        desc: 'Cân bằng kết cấu, nhiệt độ và gia vị để mở đầu bữa ăn một cách tinh tế.',
    },
];

const signatureDishes = [
    {
        id: 1,
        image: '/webtop/food_item_1.png',
        name: 'Bun bo wagyu',
        desc: 'Hương vị đậm đà với nước dùng hầm chậm và thịt wagyu mềm mọng.',
    },
    {
        id: 2,
        image: '/webtop/food_item_2.png',
        name: 'Ca hoi ap chao',
        desc: 'Cá hồi tươi kết hợp sốt bơ chanh và rau theo mùa hài hòa.',
    },
    {
        id: 3,
        image: '/webtop/food_item_3.png',
        name: 'Bo sot ruou do',
        desc: 'Thịt bò mềm thơm, hoàn hảo cho bữa tối trang trọng.',
    },
];

const HomePage = () => {
    const navigate = useNavigate();
    const [featuredDishes, setFeaturedDishes] = useState<IDish[]>([]);
    const [categories, setCategories] = useState<ICategoryOption[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const categoryRes = await getCategoryAPI();
            if (categoryRes?.data?.result) {
                setCategories(
                    categoryRes.data.result.map((c) => ({
                        label: c.name,
                        value: c.id,
                    }))
                );
            }

            const dishRes = await getListDishAPI('page=1&size=6&sort=-createdAt');
            setFeaturedDishes(dishRes?.data?.result ?? []);
        };

        loadData();
    }, []);

    const chefCards = useMemo(
        () => [
            { name: 'Chef Minh', role: 'Head Chef', image: '/webtop/chefs_1.png' },
            { name: 'Chef Anh', role: 'Pastry Chef', image: '/webtop/chefs_2.png' },
            { name: 'Chef Phuong', role: 'Sous Chef', image: '/webtop/chefs_3.png' },
        ],
        []
    );

    return (
        <div className="restaurant-home">
            <section className="hero-section">
                <div className="hero-inner">
                    <div className="hero-copy">
                        <p className="hero-kicker">HƯƠNG VỊ THƯỢNG HẠNG</p>
                        <h1>
                            Tinh hoa ẩm thực
                            <br />
                            <span>tan ngay</span> trong
                            <br />
                            miệng
                        </h1>
                        <p>
                            Mang đến trải nghiệm ẩm thực đỉnh cao, mỗi món ăn là một tác phẩm nghệ thuật được chế biến
                            tỉ mỉ từ nguyên liệu tươi ngon nhất.
                        </p>
                        <Space size={20} wrap>
                            <Button className="hero-primary-btn" type="primary" size="large" onClick={() => navigate('/#booking')}>
                                ĐẶT BÀN NGAY
                            </Button>
                            <button className="hero-video-btn" type="button">
                                <span className="hero-video-icon">▶</span>
                                <span>
                                    <strong>XEM VIDEO</strong>
                                    <small>Câu chuyện của chúng tôi</small>
                                </span>
                            </button>
                        </Space>
                    </div>

                    <div className="hero-right-visual">
                        <div className="hero-gradient-bg" />
                        <img className="hero-food-main" src="/webtop/banner_bg.png" alt="dish" />
                        <img className="hero-decor hero-decor-overlay" src="/webtop/banner_overlay.png" alt="decor" />
                        <img className="hero-decor hero-decor-leaf" src="/webtop/about.png" alt="leaf" />
                        <img className="hero-decor hero-decor-spice-1" src="/webtop/food_item_1.png" alt="spice" />
                        <img className="hero-decor hero-decor-spice-2" src="/webtop/food_item_3.png" alt="spice" />
                        <div className="hero-food-shadow" />
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="section-inner">
                    <div className="section-heading">
                        <p>About Us</p>
                        <h2>Chúng tôi tôn vinh ẩm thực bằng sự sáng tạo và tâm huyết</h2>
                    </div>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12} className="reveal-up delay-1">
                            <Card bordered={false} className="soft-card">
                                <h3>Nguyen lieu chon loc</h3>
                                <p>
                                    Mỗi món ăn được tạo nên từ nguyên liệu theo mùa, ưu tiên chất lượng và độ tươi mới mỗi
                                    ngày.
                                </p>
                            </Card>
                        </Col>
                        <Col xs={24} md={12} className="reveal-up delay-2">
                            <div className="about-photo-wrap">
                                <img src="/webtop/about.png" alt="about" />
                            </div>
                            <Card bordered={false} className="soft-card about-secondary-card">
                                <h3>Phong cach hien dai</h3>
                                <p>
                                    Kết hợp kỹ thuật ẩm thực quốc tế và hương vị địa phương để tạo nên trải nghiệm cân bằng và
                                    đáng nhớ.
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            <section className="signature-section">
                <div className="section-inner">
                    <div className="section-heading align-between">
                        <div>
                            <p>Chef Selection</p>
                            <h2>Món đặc trưng theo mùa</h2>
                        </div>
                    </div>
                    <Row gutter={[20, 20]}>
                        {signatureDishes.map((dish) => (
                            <Col xs={24} md={8} key={dish.id} className="reveal-up">
                                <Card className="signature-card" bordered={false}>
                                    <div className="signature-image-wrap">
                                        <img src={dish.image} alt={dish.name} />
                                    </div>
                                    <h3>{dish.name}</h3>
                                    <p>{dish.desc}</p>
                                    <Button type="text">Thưởng thức ngay</Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            <section id="menu" className="menu-section">
                <div className="section-inner">
                    <div className="section-heading align-between">
                        <div>
                            <p>Featured Menu</p>
                            <h2>Món ăn nổi bật</h2>
                        </div>
                    </div>

                    <div className="category-pills">
                        {categories.slice(0, 6).map((category) => (
                            <span key={category.value}>{category.label}</span>
                        ))}
                    </div>

                    <Row gutter={[20, 20]}>
                        {featuredDishes.map((dish) => (
                            <Col key={dish.id} xs={24} sm={12} lg={8} className="reveal-up">
                                <Card
                                    hoverable
                                    className="dish-card"
                                    cover={
                                        <img
                                            alt={dish.name}
                                            src={resolveStorageUrl(dish.image, 'dish')}
                                            onClick={() => navigate(`/dish/${dish.id}`)}
                                        />
                                    }
                                >
                                    <h3 onClick={() => navigate(`/dish/${dish.id}`)}>{dish.name}</h3>
                                    <p>{dish.category?.name}</p>
                                    <strong>{new Intl.NumberFormat('vi-VN').format(dish.price)} VND</strong>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            <section id="chefs" className="chef-section">
                <div className="section-inner">
                    <div className="section-heading">
                        <p>Our Team</p>
                        <h2>Những đầu bếp tạo nên dấu ấn</h2>
                    </div>
                    <Row gutter={[20, 20]}>
                        {chefCards.map((chef) => (
                            <Col xs={24} md={8} key={chef.name} className="reveal-up">
                                <Card className="chef-card" bordered={false}>
                                    <div className="chef-image-wrap">
                                        <img src={chef.image} alt={chef.name} />
                                    </div>
                                    <h3>{chef.name}</h3>
                                    <p>{chef.role}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            <section className="testimonial-section">
                <div className="section-inner">
                    <div className="section-heading">
                        <p>Testimonials</p>
                        <h2>Khách hàng nói gì về chúng tôi</h2>
                    </div>
                    <Carousel autoplay dots>
                        {testimonials.map((item) => (
                            <div key={item.name}>
                                <div className="testimonial-card">
                                    <img src="/webtop/client_1.png" alt="client" className="testimonial-avatar" />
                                    <Rate value={5} disabled className="testimonial-rate" />
                                    <blockquote>"{item.feedback}"</blockquote>
                                    <h4>{item.name}</h4>
                                    <span>{item.role}</span>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </section>

            <section id="blog" className="blog-section">
                <div className="section-inner">
                    <div className="section-heading align-between">
                        <div>
                            <p>Latest News</p>
                            <h2>Bài viết ẩm thực</h2>
                        </div>
                    </div>

                    <Row gutter={[20, 20]}>
                        {blogs.map((blog) => (
                            <Col xs={24} md={8} key={blog.id} className="reveal-up">
                                <Card className="blog-card" bordered={false}>
                                    <div className="blog-image-wrap">
                                        <img src={blog.image} alt={blog.title} />
                                    </div>
                                    <h3>{blog.title}</h3>
                                    <p>{blog.desc}</p>
                                    <button>
                                        Xem thêm <ArrowRightOutlined />
                                    </button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            <section id="booking" className="booking-section">
                <div className="booking-overlay" />
                <div className="section-inner booking-inner">
                    <div className="booking-copy">
                        <p>Reservation</p>
                        <h2>Đặt bàn cho tối nay</h2>
                        <span>
                            Đặt chỗ sớm để giữ vị trí đẹp nhất. Đội ngũ của chúng tôi sẽ xác nhận nhanh sau khi tiếp nhận.
                        </span>
                    </div>
                    <Card className="booking-form-card" bordered={false}>
                        <Form
                            layout="vertical"
                            onFinish={() => {
                                message.success('Da gui yeu cau dat ban thanh cong!');
                            }}
                        >
                            <Row gutter={[12, 12]}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
                                        <Input placeholder="Nguyễn Văn A" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
                                        <Input placeholder="09xx xxx xxx" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Ngày" name="date" rules={[{ required: true }]}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Giờ" name="time" rules={[{ required: true }]}>
                                        <TimePicker style={{ width: '100%' }} format="HH:mm" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Số người" name="people" rules={[{ required: true }]}>
                                        <InputNumber min={1} max={20} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item label="Ghi chú" name="note">
                                        <Input.TextArea rows={3} placeholder="Yêu cầu thêm..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button type="primary" htmlType="submit" size="large" block>
                                Xác nhận đặt bàn
                            </Button>
                        </Form>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
