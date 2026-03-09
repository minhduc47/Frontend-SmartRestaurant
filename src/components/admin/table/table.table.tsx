import { deleteTableAPI, getTablesAPI } from '@/services/api';
import {
    buildSpringFilter,
    dateRangeValidate,
    sfContainsIgnoreCase,
    sfDateRangeInclusive,
} from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import CreateTable from './create.table';
import UpdateTable from './update.table';

type TSearch = {
    name: string;
    occupied: string;
    createdAtRange: string;
};

const occupiedColor: Record<string, string> = {
    AVAILABLE: 'green',
    OCCUPIED: 'red',
    RESERVED: 'gold',
};

const TableTable = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [tableEditing, setTableEditing] = useState<IRestaurantTable | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const handleDelete = async (id: number) => {
        const res = await deleteTableAPI(id);
        if (res.data !== undefined || Number(res.statusCode) === 200) {
            message.success('Xoa ban thanh cong');
        } else {
            message.error(res.message ?? 'Xoa ban that bai');
        }
        refreshTable();
    };

    const columns: ProColumns<IRestaurantTable>[] = [
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
            title: 'Ten ban',
            dataIndex: 'name',
        },
        {
            title: 'Trang thai',
            dataIndex: 'occupied',
            valueType: 'select',
            valueEnum: {
                AVAILABLE: { text: 'AVAILABLE' },
                OCCUPIED: { text: 'OCCUPIED' },
                RESERVED: { text: 'RESERVED' },
            },
            render: (_, record) => (
                <Tag color={occupiedColor[record.occupied] ?? 'default'}>{record.occupied}</Tag>
            ),
        },
        {
            title: 'QR Token',
            dataIndex: 'qrToken',
            hideInSearch: true,
            render: (_, record) => record.qrToken || '-',
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
        {
            title: 'Hanh dong',
            hideInSearch: true,
            render: (_, entity) => (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: 'pointer', marginRight: 12 }}
                        onClick={() => {
                            setTableEditing(entity);
                            setIsOpenUpdate(true);
                        }}
                    />
                    <Popconfirm
                        title="Xoa ban"
                        description="Ban chac chan muon xoa ban nay?"
                        onConfirm={() => handleDelete(entity.id)}
                        okText="Xoa"
                        cancelText="Huy"
                    >
                        <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: 'pointer' }} />
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <>
            <ProTable<IRestaurantTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    const queryParams = new URLSearchParams();
                    queryParams.set('page', String(params.current ?? 1));
                    queryParams.set('size', String(params.pageSize ?? 5));

                    const createdAtRange = dateRangeValidate(params.createdAtRange);
                    const filter = buildSpringFilter([
                        params.name ? sfContainsIgnoreCase('name', params.name) : undefined,
                        params.occupied ? `occupied : '${params.occupied}'` : undefined,
                        createdAtRange ? sfDateRangeInclusive('createdAt', createdAtRange[0], createdAtRange[1]) : undefined,
                    ]);
                    if (filter) queryParams.set('filter', filter);

                    if (sort?.createdAt) {
                        queryParams.set('sort', sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt');
                    } else {
                        queryParams.set('sort', '-createdAt');
                    }

                    const res = await getTablesAPI(queryParams.toString());
                    if (res.data) {
                        setMeta({
                            current: res.data.meta.page,
                            pageSize: res.data.meta.pageSize,
                            pages: res.data.meta.pages,
                            total: res.data.meta.total,
                        });
                    }

                    return {
                        data: (res.data?.result as IRestaurantTable[]) ?? [],
                        success: true,
                        total: res.data?.meta.total ?? 0,
                    };
                }}
                rowKey="id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                }}
                headerTitle="Quan ly ban"
                toolBarRender={() => [
                    <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setIsOpenCreate(true)}>
                        Them ban
                    </Button>,
                ]}
            />

            <CreateTable
                isOpenCreate={isOpenCreate}
                setIsOpenCreate={setIsOpenCreate}
                refreshTable={refreshTable}
            />

            <UpdateTable
                tableEditing={tableEditing}
                isOpenUpdate={isOpenUpdate}
                setIsOpenUpdate={setIsOpenUpdate}
                setTableEditing={setTableEditing}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableTable;
