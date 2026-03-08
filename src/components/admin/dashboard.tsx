import { getListOrdersAPI, getUsersAPI } from '@/services/api';
import { getListDishAPI } from '@/services/dish.api';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const Dashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countDish: 0,
        countUser: 0,
        countOrder: 0,
    });

    useEffect(() => {
        const initDashboardData = async () => {
            const [userRes, orderRes, dishRes] = await Promise.all([
                getUsersAPI('page=1&pageSize=1'),
                getListOrdersAPI('page=1&pageSize=1'),
                getListDishAPI('page=1&pageSize=1'),
            ]);

            setDataDashboard({
                countUser: Number(userRes.data?.meta.total ?? 0),
                countOrder: Number(orderRes.data?.meta.total ?? 0),
                countDish: Number(dishRes.data?.meta.total ?? 0),
            });
        };

        initDashboardData();
    }, []);

    const formatter = (value: number | string) => <CountUp end={Number(value)} separator="," />;

    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Users" value={dataDashboard.countUser} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Orders" value={dataDashboard.countOrder} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Total Dishes" value={dataDashboard.countDish} formatter={formatter} />
                </Card>
            </Col>
        </Row>
    );
};

export default Dashboard;
