import { useEffect, useMemo, useState } from 'react';
import { FiShoppingCart, FiPhoneCall } from 'react-icons/fi';
import { Divider, Badge, Drawer, Avatar, Popover, Empty, Dropdown, Space, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';

const AppHeader = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } = useCurrentApp();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.replace('#', '');
        // Delay slightly so sections are mounted before scrolling.
        const timer = setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
                const offset = section.getBoundingClientRect().top + window.scrollY - 88;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [location.pathname, location.hash]);

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.statusCode === 200) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('carts');
        }
    };

    const items = [
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setOpenUpdateUser(true);
                    }}
                >
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử đơn hàng</Link>,
            key: 'history',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];

    if (user?.role?.name === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        });
    }

    const navItems = useMemo(
        () => [
            { label: 'Trang chủ', path: '/', sectionId: '' },
            { label: 'Giới thiệu', path: '/about', sectionId: '' },
            { label: 'Thực đơn', path: '/', sectionId: 'menu' },
            { label: 'Đầu bếp', path: '/', sectionId: 'chefs' },
            { label: 'Bài viết', path: '/', sectionId: 'blog' },
            { label: 'Liên hệ', path: '/', sectionId: 'contact' },
        ],
        []
    );

    const isActiveNav = (path: string, sectionId: string) => {
        if (sectionId && location.pathname === '/' && location.hash === `#${sectionId}`) return true;
        if (!sectionId && location.pathname === path) return true;
        return false;
    };

    const handleNavClick = (path: string, sectionId: string) => {
        if (sectionId) {
            if (location.pathname === '/') {
                const section = document.getElementById(sectionId);
                if (section) {
                    const offset = section.getBoundingClientRect().top + window.scrollY - 88;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            } else {
                navigate(`/${sectionId ? `#${sectionId}` : ''}`);
            }
            return;
        }
        navigate(path);
    };

    const contentPopover = () => {
        return (
            <div className="pop-cart-body">
                <div className="pop-cart-content">
                    {carts?.map((item, index) => (
                        <div className="dish" key={`cart-${index}`}>
                            <img src={`${import.meta.env.VITE_API_URL}/storage/dish/${item.dish.image}`} />
                            <div>{item.dish.name}</div>
                            <div className="price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.dish.price)}
                            </div>
                        </div>
                    ))}
                </div>
                {carts.length > 0 ? (
                    <div className="pop-cart-footer">
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                ) : (
                    <Empty description="Không có sản phẩm trong giỏ hàng" />
                )}
            </div>
        );
    };

    return (
        <>
            <div className={`header-container ${isScrolled ? 'is-scrolled' : ''}`}>
                <header className="page-header">
                    <div className="header-left" onClick={() => navigate('/')}>
                        <div className="brand-mark">R</div>
                        <div className="brand-text">
                            <strong>Restaurant</strong>
                            <span>Fine Dining</span>
                        </div>
                    </div>

                    <nav className="desktop-nav">
                        {navItems.map((item) => (
                            <button
                                key={`${item.path}-${item.sectionId}`}
                                className={`nav-link ${isActiveNav(item.path, item.sectionId) ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path, item.sectionId)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="header-actions">
                        <Button
                            className="booking-btn"
                            type="primary"
                            onClick={() => handleNavClick('/', 'booking')}
                        >
                            Dat ban ngay
                        </Button>

                        <Popover
                            className="popover-carts"
                            placement="bottomRight"
                            rootClassName="popover-carts"
                            title={'Mon vua them'}
                            content={contentPopover}
                            arrow
                        >
                            <Badge count={carts?.length ?? 0} size="small" showZero>
                                <FiShoppingCart className="icon-cart" />
                            </Badge>
                        </Popover>

                        {!isAuthenticated ? (
                            <button className="account-btn" onClick={() => navigate('/login')}>
                                Tai khoan
                            </button>
                        ) : (
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <Space className="account-box">
                                    <Avatar>{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</Avatar>
                                </Space>
                            </Dropdown>
                        )}

                        <button className="menu-btn" onClick={() => setOpenDrawer(true)}>
                            <MenuOutlined />
                        </button>
                    </div>
                </header>
            </div>

            <Drawer title="Menu" placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <div className="drawer-nav">
                    {navItems.map((item) => (
                        <button
                            key={`drawer-${item.path}-${item.sectionId}`}
                            className="drawer-link"
                            onClick={() => {
                                setOpenDrawer(false);
                                handleNavClick(item.path, item.sectionId);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <Divider />
                <div className="drawer-contact">
                    <FiPhoneCall /> <span>0123 456 789</span>
                </div>
                <Divider />
                {isAuthenticated ? (
                    <>
                        <p style={{ cursor: 'pointer' }} onClick={() => setOpenUpdateUser(true)}>
                            Quan ly tai khoan
                        </p>
                        <Divider />
                        <p style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                            Dang xuat
                        </p>
                    </>
                ) : (
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Dang nhap
                    </Button>
                )}
            </Drawer>

            <ManageAccount isModalOpen={openUpdateUser} setIsModalOpen={setOpenUpdateUser} />
        </>
    );
};

export default AppHeader;
