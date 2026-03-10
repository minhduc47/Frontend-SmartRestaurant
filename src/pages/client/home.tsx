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
        role: 'Giam doc dieu hanh',
        feedback:
            'Khong gian nha hang tuyet voi, mon an vuot xa mong doi va dich vu rat chu dao. Toi chac chan se quay lai.',
    },
    {
        name: 'Sarah Johnson',
        role: 'Marketing Manager',
        feedback:
            'Trai nghiem am thuc dang nho, mon an duoc trinh bay dep mat va huong vi rat can bang. Rat dang thu.',
    },
    {
        name: 'John Carter',
        role: 'Creative Director',
        feedback:
            'Buoi toi tuyet voi voi khong khi am cung, nhan vien than thien va menu trang mieng rat an tuong.',
    },
];

const blogs = [
    {
        id: 1,
        image: '/webtop/blog_1.png',
        title: 'Nghe thuat ket hop ruou vang va mon Au',
        desc: 'Cach lua chon ruou vang phu hop voi tung nhom huong vi de nang tam bua toi.',
    },
    {
        id: 2,
        image: '/webtop/blog_2.png',
        title: '5 nguyen lieu theo mua lam nen menu dac biet',
        desc: 'Tu nong trai den ban an, hanh trinh cua nguyen lieu tuoi va sach trong tung mon.',
    },
    {
        id: 3,
        image: '/webtop/blog_3.png',
        title: 'Bi quyet tao nen mon khai vi day an tuong',
        desc: 'Can bang ket cau, nhiet do va gia vi de mo dau bua an mot cach tinh te.',
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
                <div className="hero-overlay" />
                <div className="hero-content reveal-up">
                    <p className="hero-kicker">Fine Dining Experience</p>
                    <h1>
                        Huong vi tinh te,
                        <br />
                        khong gian dang cap
                    </h1>
                    <p>
                        Mang den trai nghiem am thuc dinh cao voi nguyen lieu tuoi ngon, phong cach phuc vu chu dao
                        va khong gian am cung hien dai.
                    </p>
                    <Space size={16} wrap>
                        <Button type="primary" size="large" onClick={() => navigate('/#booking')}>
                            Dat ban ngay
                        </Button>
                        <Button size="large" ghost onClick={() => navigate('/about')}>
                            Kham pha them <ArrowRightOutlined />
                        </Button>
                    </Space>
                </div>
            </section>

            <section className="about-section">
                <div className="section-inner">
                    <div className="section-heading">
                        <p>About Us</p>
                        <h2>Chung toi ton vinh am thuc bang su sang tao va tam huyet</h2>
                    </div>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12} className="reveal-up delay-1">
                            <Card bordered={false} className="soft-card">
                                <h3>Nguyen lieu chon loc</h3>
                                <p>
                                    Moi mon an duoc tao nen tu nguyen lieu theo mua, uu tien chat luong va do tuoi moi moi
                                    ngay.
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
                                    Ket hop ky thuat am thuc quoc te va huong vi dia phuong de tao nen trai nghiem can bang va
                                    dang nho.
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            <section id="menu" className="menu-section">
                <div className="section-inner">
                    <div className="section-heading align-between">
                        <div>
                            <p>Featured Menu</p>
                            <h2>Mon an noi bat</h2>
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
                        <h2>Nhung dau bep tao nen dau an</h2>
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
                        <h2>Khach hang noi gi ve chung toi</h2>
                    </div>
                    <Carousel autoplay dots>
                        {testimonials.map((item) => (
                            <div key={item.name}>
                                <div className="testimonial-card">
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
                            <h2>Bai viet am thuc</h2>
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
                                    <button>Xem them</button>
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
                        <h2>Dat ban cho toi nay</h2>
                        <span>
                            Dat cho som de giu cho ngoi dep nhat. Doi ngu cua chung toi se xac nhan nhanh sau khi tiep nhan.
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
                                    <Form.Item label="Ho va ten" name="name" rules={[{ required: true }]}>
                                        <Input placeholder="Nguyen Van A" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="So dien thoai" name="phone" rules={[{ required: true }]}>
                                        <Input placeholder="09xx xxx xxx" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Ngay" name="date" rules={[{ required: true }]}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Gio" name="time" rules={[{ required: true }]}>
                                        <TimePicker style={{ width: '100%' }} format="HH:mm" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="So nguoi" name="people" rules={[{ required: true }]}>
                                        <InputNumber min={1} max={20} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item label="Ghi chu" name="note">
                                        <Input.TextArea rows={3} placeholder="Yeu cau them..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button type="primary" htmlType="submit" size="large" block>
                                Xac nhan dat ban
                            </Button>
                        </Form>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
