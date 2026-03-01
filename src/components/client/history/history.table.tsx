import { getHistoryAPI } from "@/services/api";
import { FORMATE_DATE_VN2 } from "@/services/helper";
import { App, Drawer, Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";


const HistoryTable = () => {
    // Sample data matching the image
    const [dataHistory, setDataHistory] = useState<IOrderHistoryTable[]>([]);
    const [openDetail, setOpenDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState<IOrderHistoryTable | null>(null);
    const { notification } = App.useApp();
    const columns: TableProps<IOrderHistoryTable>['columns'] = [
        {
            title: "STT",
            render: (text: any, record: any, index: number) => index + 1,
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            render: (dom, entity) => {
                return dayjs(entity.createdAt).format(FORMATE_DATE_VN2);
            }
        },
        {
            title: "Tổng số tiền",
            dataIndex: "totalPrice",
            render(dom, entity) {
                return (
                    <div>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </div>
                )
            }
        },
        {
            title: "Trạng thái",
            align: "center" as const,
            render: (text: string) => (
                <Tag color="green">
                    Thành công
                </Tag>
            )
        },
        {
            title: "Chi tiết",
            dataIndex: "detail",
            render(dom, entity) {
                return (
                    <div>
                        <a href='#' onClick={() => {
                            setDataDetail(entity);
                            setOpenDetail(true);
                        }}>{entity._id}</a>
                    </div>
                )
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHistoryAPI();
            if (res && res.data) {
                // Assuming res.data is an array of history items
                setDataHistory(res.data);
            }
            if (res.error) {
                notification.error({
                    message: 'Lỗi',
                    description: res.message
                });
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <Table<IOrderHistoryTable> dataSource={dataHistory} columns={columns} rowKey="_id" />
            <Drawer
                title="Chi tiết đơn hàng"
                placement="right"
                onClose={() => {
                    setOpenDetail(false);
                    setDataDetail(null);
                }}
                open={openDetail}
            >
                {dataDetail && (
                    <div>
                        {dataDetail.detail.map((item, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <span style={{ fontWeight: 500 }}>{item.bookName}</span> <br />
                                <span>Số lượng: {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Drawer>
        </>
    );
}

export default HistoryTable;