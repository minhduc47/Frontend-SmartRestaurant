import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { buildSpringFilter, dateRangeValidate, sfContainsIgnoreCase, sfDateRangeInclusive } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import CreateUser from './create.user';
import DetailUser from './detail.user';
import UpdateUser from './update.user';

type TSearch = {
    name: string;
    email: string;
    createdAtRange: string;
};

const TableUser = () => {
    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true,
            render: (_, entity) => (
                <a href="#" onClick={() => showUserDetail(entity)}>{entity.id}</a>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
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
            title: 'Action',
            hideInSearch: true,
            render: (_, entity) => (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: 'pointer', marginRight: 15 }}
                        onClick={() => {
                            setUserEditing(entity);
                            setIsOpenModalUpdate(true);
                        }}
                    />
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={() => handleDelete(entity.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteTwoTone twoToneColor="#f57800" style={{ cursor: 'pointer' }} />
                    </Popconfirm>
                </>
            ),
        },
    ];

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [userDetail, setUserDetail] = useState<IUserTable | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const [userEditing, setUserEditing] = useState<IUserTable | null>(null);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const { message } = App.useApp();

    const showUserDetail = (record: IUserTable) => {
        setUserDetail(record);
        setIsOpenDetail(true);
    };

    const refreshTable = () => {
        actionRef.current?.reloadAndRest?.();
    };

    const handleDelete = async (id: number) => {
        const res = await deleteUserAPI(id);
        if (res.data !== undefined) {
            message.success({ content: 'Delete user successfully' });
        } else {
            message.error({ content: `${res.message}` });
        }
        refreshTable();
    };

    return (
        <>
            <ProTable<IUserTable, TSearch>
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
                        params.email ? sfContainsIgnoreCase('email', params.email) : undefined,
                        createdAtRange ? sfDateRangeInclusive('createdAt', createdAtRange[0], createdAtRange[1]) : undefined,
                    ]);

                    if (filter) queryParams.set('filter', filter);

                    if (sort?.createdAt) {
                        queryParams.set('sort', sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt');
                    } else {
                        queryParams.set('sort', '-id');
                    }

                    const res = await getUsersAPI(queryParams.toString());
                    if (res.data) {
                        setMeta({
                            current: res.data.meta.page,
                            pageSize: res.data.meta.pageSize,
                            pages: res.data.meta.pages,
                            total: res.data.meta.total,
                        });
                        setCurrentDataTable(res.data.result ?? []);
                    }

                    return {
                        data: res.data?.result,
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
                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink key="export" data={currentDataTable} filename="export-users.csv">
                        <Button type="primary" icon={<ExportOutlined />}>
                            Export
                        </Button>
                    </CSVLink>,
                    <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setIsOpenCreate(true)}>
                        New User
                    </Button>,
                ]}
            />

            <DetailUser
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
                userDetail={userDetail}
                setUserDetail={setUserDetail}
            />
            <CreateUser
                isOpenCreate={isOpenCreate}
                setIsOpenCreate={setIsOpenCreate}
                refreshTable={refreshTable}
            />
            <UpdateUser
                userEditing={userEditing}
                isOpenModalUpdate={isOpenModalUpdate}
                setIsOpenModalUpdate={setIsOpenModalUpdate}
                setUserEditing={setUserEditing}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;
