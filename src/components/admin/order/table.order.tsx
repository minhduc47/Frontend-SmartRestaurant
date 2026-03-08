import { getListOrdersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useRef, useState } from 'react';

const statusColor: Record<string, string> = {
    PENDING: 'gold',
    PREPARING: 'blue',
    SERVED: 'cyan',
    PAID: 'green',
    CANCELLED: 'red',
};

type TSearch = {
    orderType: string;
    createdAtRange: string;
};

const TableOrder = () => {
    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: 'Table',
            dataIndex: 'tableId',
            hideInSearch: true,
            render: (_, record) => record.tableId ?? '-',
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            valueType: 'select',
            valueEnum: {
                IN_STORE: { text: 'IN_STORE' },
                DELIVERY: { text: 'DELIVERY' },
            },
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            hideInSearch: true,
            render: (_, record) =>
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            hideInSearch: true,
            render: (_, record) => <Tag color={statusColor[record.status] ?? 'default'}>{record.status}</Tag>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
    ];

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    return (
        <ProTable<IOrderTable, TSearch>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort) => {
                let query = `page=${params.current ?? 1}&pageSize=${params.pageSize ?? 5}`;
                if (params.orderType) query += `&orderType=${params.orderType}`;

                const createdAtRange = dateRangeValidate(params.createdAtRange);
                if (createdAtRange) {
                    query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
                }

                if (sort?.createdAt) {
                    query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                } else {
                    query += '&sort=-createdAt';
                }

                const res = await getListOrdersAPI(query);
                if (res.data) {
                    setMeta({
                        current: res.data.meta.page,
                        pageSize: res.data.meta.pageSize,
                        pages: res.data.meta.pages,
                        total: res.data.meta.total,
                    });
                }

                return {
                    data: (res.data?.result as IOrderTable[]) ?? [],
                    success: true,
                    total: res.data?.meta.total,
                };
            }}
            rowKey="id"
            pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                total: meta.total,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
            }}
            dateFormatter="string"
            headerTitle="Order Table"
        />
    );
};

export default TableOrder;
