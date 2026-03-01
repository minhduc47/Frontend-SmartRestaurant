
import { deleteUserAPI, getListOrdersAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableOrder = () => {
    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        <div>
                            <a href='#' >{entity._id}</a>
                        </div>
                    </>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            render(dom, entity) {
                return (
                    <>
                        <div>
                            <span>I'm Admin</span>
                        </div>
                    </>
                )
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render(dom, entity) {
                return (
                    <>
                        <div>
                            <span>abc</span>
                        </div>
                    </>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
            hideInSearch: true,
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

    const [currentDataTable, setCurrentDataTable] = useState<IOrderTable[]>([]);
    const { message } = App.useApp();

    const refreshTable = () => {
        actionRef.current?.reload();
    }
    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(params, sort, filter);
                    let query = '';
                    if (params) {
                        query += `current=${params.current ?? 1}&pageSize=${params.pageSize ?? 5}`;
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        const createdAtRange = dateRangeValidate(params.createdAtRange);
                        if (createdAtRange) {
                            query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
                        }
                    }
                    //default sort by createdAt

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt == 'ascend' ? 'createdAt' : '-createdAt'}`;
                    } else query += `&sort=-createdAt`;

                    const res = await getListOrdersAPI(query);
                    if (res.data) {
                        setMeta({
                            current: res.data?.meta.current,
                            pageSize: res.data?.meta.pageSize,
                            pages: res.data?.meta.pages,
                            total: res.data?.meta.total,
                        });
                        setCurrentDataTable(res.data?.result as IOrderTable[] ?? []);
                    }
                    return {
                        data: res.data?.result as IOrderTable[] | undefined,
                        success: true,
                        total: res.data?.meta.total,
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]}-{range[1]} of {total} items
                            </div>
                        )
                    },
                    // onChange: (page) => console.log(page),
                    showSizeChanger: true,
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <>


                    </>

                ]}
            />

        </>
    );
}

export default TableOrder;