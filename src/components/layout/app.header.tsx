import { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover, Empty, Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';
import ManageAccount from '../client/account';

interface IProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } = useCurrentApp();
    const navigate = useNavigate();

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
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => setOpenDrawer(true)}>
                            ☰
                        </div>
                        <div className="page-header__logo">
                            <span className="logo">
                                <span onClick={() => navigate('/')}>
                                    <FaReact className="rotate icon-react" />Hoi Dan !T
                                </span>
                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input
                                className="input-search"
                                type="text"
                                placeholder="Bạn muốn tìm gì hôm nay?"
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={' món vừa thêm'}
                                    content={contentPopover}
                                    arrow
                                >
                                    <Badge count={carts?.length ?? 0} size="small" showZero>
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}>Tai khoan</span>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space>
                                            <Avatar>{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</Avatar>
                                            {user?.name}
                                        </Space>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>

            <Drawer title="Menu" placement="left" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <p style={{ cursor: 'pointer' }} onClick={() => setOpenUpdateUser(true)}>
                    Quan ly tai khoan
                </p>
                <Divider />
                <p style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Dang xuat
                </p>
            </Drawer>

            <ManageAccount isModalOpen={openUpdateUser} setIsModalOpen={setOpenUpdateUser} />
        </>
    );
};

export default AppHeader;
