import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhoneCall } from 'react-icons/fi';

const footerLinks = [
    { label: 'Về chúng tôi', to: '/about' },
    { label: 'Thực đơn', to: '/#menu' },
    { label: 'Đặt bàn', to: '/#booking' },
    { label: 'Bài viết', to: '/#blog' },
];

const AppFooter = () => {
    return (
        <footer id="contact" className="site-footer">
            <div className="footer-inner">
                <div className="footer-col">
                    <h4>Về Chúng Tôi</h4>
                    <p>
                        Chúng tôi tự hào mang đến trải nghiệm ẩm thực tinh tế, kết hợp nguyên liệu tươi ngon địa
                        phương với phong cách chế biến hiện đại.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Liên Kết Quan Trọng</h4>
                    <div className="footer-links">
                        {footerLinks.map((item) => (
                            <Link key={item.label} to={item.to}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Thông Tin</h4>
                    <p>
                        <FiMapPin /> 106 Thanh Thủy, Hải Châu, Đà Nẵng
                    </p>
                    <p>
                        <FiPhoneCall /> +84 793 656 222
                    </p>
                    <p>
                        <FiMail /> support@webtop.vn
                    </p>
                    <div className="socials">
                        <a href="#" aria-label="facebook">
                            <FiFacebook />
                        </a>
                        <a href="#" aria-label="instagram">
                            <FiInstagram />
                        </a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Bản Tin</h4>
                    <p>Nhận ưu đãi và cập nhật món mới hằng tuần.</p>
                    <Form layout="inline" onFinish={() => undefined}>
                        <Form.Item name="email" style={{ width: '100%' }}>
                            <Input placeholder="Nhập email của bạn" />
                        </Form.Item>
                        <Button type="primary">Đăng ký</Button>
                    </Form>
                </div>
            </div>
            <div className="footer-bottom">Bản quyền © 2026 Restaurant. All rights reserved.</div>
        </footer>
    );
};

export default AppFooter;
