import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhoneCall } from 'react-icons/fi';

const footerLinks = [
    { label: 'Ve chung toi', to: '/about' },
    { label: 'Thuc don', to: '/#menu' },
    { label: 'Dat ban', to: '/#booking' },
    { label: 'Bai viet', to: '/#blog' },
];

const AppFooter = () => {
    return (
        <footer id="contact" className="site-footer">
            <div className="footer-inner">
                <div className="footer-col">
                    <h4>Ve Chung Toi</h4>
                    <p>
                        Chung toi tu hao mang den trai nghiem am thuc tinh te, ket hop nguyen lieu tuoi ngon dia
                        phuong voi phong cach che bien hien dai.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Lien Ket Nhanh</h4>
                    <div className="footer-links">
                        {footerLinks.map((item) => (
                            <Link key={item.label} to={item.to}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Thong Tin</h4>
                    <p>
                        <FiMapPin /> 106 Thanh Thuy, Hai Chau, Da Nang
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
                    <h4>Ban Tin</h4>
                    <p>Nhan uu dai va cap nhat mon moi hang tuan.</p>
                    <Form layout="inline" onFinish={() => undefined}>
                        <Form.Item name="email" style={{ width: '100%' }}>
                            <Input placeholder="Nhap email cua ban" />
                        </Form.Item>
                        <Button type="primary">Dang ky</Button>
                    </Form>
                </div>
            </div>
            <div className="footer-bottom">Ban quyen © 2026 Restaurant. All rights reserved.</div>
        </footer>
    );
};

export default AppFooter;
