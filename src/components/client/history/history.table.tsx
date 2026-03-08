import { getListOrdersAPI } from '@/services/api';
import { FORMATE_DATE_VN2 } from '@/services/helper';
import { App, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const statusColor: Record<string, string> = {
    PENDING: 'gold',
    PREPARING: 'blue',
    SERVED: 'cyan',
    PAID: 'green',
    CANCELLED: 'red',
};

const HistoryTable = () => {
    const [dataHistory, setDataHistory] = useState<IOrderTable[]>([]);
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();

    const columns: TableProps<IOrderTable>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 90,
        },
        {
            title: 'Thoi gian',
            dataIndex: 'createdAt',
            render: (_, entity) => dayjs(entity.createdAt).format(FORMATE_DATE_VN2),
        },
        {
            title: 'Tong tien',
            dataIndex: 'totalPrice',
            render: (_, entity) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice),
        },
        {
            title: 'Loai',
            dataIndex: 'orderType',
        },
        {
            title: 'Trang thai',
            dataIndex: 'status',
            render: (_, entity) => <Tag color={statusColor[entity.status] ?? 'default'}>{entity.status}</Tag>,
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getListOrdersAPI('page=1&pageSize=20&sort=-createdAt');
            if (res?.data) {
                setDataHistory((res.data.result as IOrderTable[]) ?? []);
            } else {
                notification.error({
                    message: 'Loi',
                    description: `${res?.message}`,
                });
            }
            setLoading(false);
        };

        fetchData();
    }, [notification]);

    return <Table<IOrderTable> loading={loading} dataSource={dataHistory} columns={columns} rowKey="id" />;
};

export default HistoryTable;
