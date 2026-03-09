import { deleteDishAPI, getListDishAPI } from '@/services/dish.api';
import { resolveStorageUrl } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { App, Avatar, Badge, Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import CreateDish from './create.dish.tsx';
import UpdateDish from './update.dish.tsx';

type TSearch = {
    name: string;
};

const DishTable = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IDish[]>([]);
    const [dishEditing, setDishEditing] = useState<IDish | null>(null);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
    const { message } = App.useApp();

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const handleDelete = async (id: number) => {
        const res = await deleteDishAPI(String(id));
        if (res && res.data) {
            message.success('Xóa món ăn thành công!');
        } else {
            message.error(res?.message ?? 'Xóa món ăn thất bại!');
        }
        refreshTable();
    };

    const columns: ProColumns<IDish>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true,
            width: 80,
        },
        {
            title: 'Tên món',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            hideInSearch: true,
            width: 100,
            render: (_, entity) => (
                <Avatar
                    size={48}
                    shape="square"
                    src={resolveStorageUrl(entity.image, 'dish')}
                    alt={entity.name}
                />
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render: (_, entity) => (
                <span>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(entity.price)}
                </span>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'name'],
            hideInSearch: true,
            render: (_, entity) => (
                <Tag color="blue">{entity.category?.name ?? '—'}</Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            hideInSearch: true,
            width: 120,
            render: (_, entity) =>
                entity.active ? (
                    <Badge status="success" text="Active" />
                ) : (
                    <Badge status="error" text="Inactive" />
                ),
        },
        {
            title: 'Hành động',
            hideInSearch: true,
            width: 100,
            render: (_, entity) => (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: 'pointer', marginRight: 15 }}
                        onClick={() => {
                            setDishEditing(entity);
                            setIsOpenModalUpdate(true);
                        }}
                    />
                    <Popconfirm
                        title="Xóa món ăn"
                        description="Bạn có chắc muốn xóa món ăn này không?"
                        onConfirm={() => handleDelete(entity.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <DeleteTwoTone
                            twoToneColor="#ff4d4f"
                            style={{ cursor: 'pointer' }}
                        />
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <>
            <ProTable<IDish, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    let query = `page=${params.current ?? 1}&pageSize=${params.pageSize ?? 5}`;

                    if (params.name) {
                        query += `&name=${encodeURIComponent(params.name)}`;
                    }

                    if (sort?.name) {
                        query += `&sort=${sort.name === 'ascend' ? 'name' : '-name'}`;
                    } else if (sort?.price) {
                        query += `&sort=${sort.price === 'ascend' ? 'price' : '-price'}`;
                    } else {
                        query += '&sort=-createdAt';
                    }

                    const res = await getListDishAPI(query);
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
                        page: res.data?.meta.page ?? 1,
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
                    showTotal: (total, range) => (
                        <div>
                            {range[0]}–{range[1]} / {total} món ăn
                        </div>
                    ),
                }}
                dateFormatter="string"
                headerTitle="Danh sách món ăn"
                toolBarRender={() => [
                    <Button
                        key="export"
                        type="primary"
                        icon={<ExportOutlined />}
                    >
                        <CSVLink data={currentDataTable} filename="export-dishes.csv">
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        key="create"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsOpenCreate(true)}
                    >
                        Thêm món
                    </Button>,
                ]}
            />

            <CreateDish
                isOpenCreate={isOpenCreate}
                setIsOpenCreate={setIsOpenCreate}
                refreshTable={refreshTable}
            />
            <UpdateDish
                dishEditing={dishEditing}
                isOpenUpdate={isOpenModalUpdate}
                setIsOpenUpdate={setIsOpenModalUpdate}
                refreshTable={refreshTable}
                setDishEditing={setDishEditing}
            />
        </>
    );
};

export default DishTable;
