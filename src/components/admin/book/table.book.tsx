import { deleteBookAPI, getBooksAPI } from "@/services/book.api";
import { dateRangeValidate } from "@/services/helper";
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";

type TSearch = {
    author: string;
    mainText: string;
}

const BookTable = () => {
    const columns: ProColumns<IBookTable>[] = [
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
                    <div>
                        <a href='#' onClick={() => showBookDetail(entity)}>{entity._id}</a>
                    </div>
                )
            },
        },
        {
            title: 'Book Name',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render(dom, entity) {
                return (
                    <div>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </div>
                )
            }
        },
        {
            title: 'Update At',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Action',
            copyable: true,
            ellipsis: true,
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 15 }}
                            onClick={() => {
                                setBookEditing(entity);
                                setIsOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            title="Delete the book"
                            description="Are you sure to delete this book?"
                            onConfirm={() => handleDelete(entity._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: 'pointer' }} />
                        </Popconfirm>

                    </>
                )
            },
        },
    ];
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
    const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
    const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
    const [isOpenModalImport, setIsOpenModalImport] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);
    const [bookEditing, setBookEditing] = useState<IBookTable | null>(null);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
    const { message } = App.useApp();
    const showBookDetail = (record: IBookTable) => {
        setBookDetail(record);
        setIsOpenDetail(true);
    };
    const refreshTable = () => {
        actionRef.current?.reload();
    }
    const handleDelete = async (id: string) => {
        // Call your delete API here
        // await deleteBookAPI(id);
        // After deletion, refresh the table
        const res = await deleteBookAPI(id);
        if (res.data) {
            message.success('Delete book successfully');
        } else {
            message.error('Delete book failed');
        }
        refreshTable();
    }
    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(params, sort, filter);
                    let query = '';
                    if (params) {
                        query += `current=${params.current ?? 1}&pageSize=${params.pageSize ?? 5}`;
                        if (params.author) {
                            query += `&author=/${params.author}/i`;
                        }
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`;
                        }
                    }
                    //default sort by createdAt

                    if (sort && sort.updateAt) {
                        query += `&sort=${sort.updateAt == 'ascend' ? 'updateAt' : '-updateAt'}`;
                    } else query += `&sort=-updateAt`;
                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText == 'ascend' ? 'mainText' : '-mainText'}`;
                    } else query += `&sort=-mainText`;
                    if (sort && sort.price) {
                        query += `&sort=${sort.price == 'ascend' ? 'price' : '-price'}`;
                    } else query += `&sort=-price`;
                    if (sort && sort.author) {
                        query += `&sort=${sort.author == 'ascend' ? 'author' : '-author'}`;
                    } else query += `&sort=-author`;
                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta({
                            current: res.data?.meta.current,
                            pageSize: res.data?.meta.pageSize,
                            pages: res.data?.meta.pages,
                            total: res.data?.meta.total,
                        });
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
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
                headerTitle="Table book"
                toolBarRender={() => [
                    <>
                        <Button type="primary" icon={<ExportOutlined />} onClick={() => { }}>
                            <CSVLink
                                data={currentDataTable}
                                filename="export-books.csv"
                            >
                                Export
                            </CSVLink>
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsOpenCreate(true)}>
                            New Book
                        </Button>
                    </>

                ]}
            />
            <DetailBook
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
                bookDetail={bookDetail}
                setBookDetail={setBookDetail}
            />
            <CreateBook
                isOpenCreate={isOpenCreate}
                setIsOpenCreate={setIsOpenCreate}
                refreshTable={refreshTable}
            />
            <UpdateBook
                bookEditing={bookEditing}
                isOpenUpdate={isOpenModalUpdate}
                setIsOpenUpdate={setIsOpenModalUpdate}
                refreshTable={refreshTable}
                setBookEditing={setBookEditing}
            />
        </>
    );
}

export default BookTable;