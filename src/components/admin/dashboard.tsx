import { getDashboardDataAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";


const Dashboard = () => {
    const [dataDashboard, setDataDashboard] = useState<IDashboardData>({
        countBook: 0,
        countUser: 0,
        countOrder: 0,
    });

    useEffect(() => {
        const initDashboardData = async () => {
            const res = await getDashboardDataAPI()
            if (res.data) setDataDashboard(res.data);
        }
        initDashboardData();
    }, [])
    const fomatter = (value: any) => <CountUp end={value} separator="," />
    return (
        <>
            <Row gutter={[40, 40]} >
                <Col span={8}>
                    <Card>
                        <Statistic title="Total Users" value={dataDashboard.countUser} formatter={fomatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Total Orders" value={dataDashboard.countOrder} formatter={fomatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Total Books" value={dataDashboard.countBook} formatter={fomatter} />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Dashboard;