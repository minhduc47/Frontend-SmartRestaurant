import { Drawer } from "antd";
import { Button, Checkbox, Col, Divider, Form, InputNumber, Rate, Row } from "antd";
interface IProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleChangeFilter: any;
    categories: any[];
    onFinish: any;
}

const MobileFilter = (props: IProps) => {
    const { isOpen, setIsOpen, handleChangeFilter, categories, onFinish } = props
    const [form] = Form.useForm();
    return (
        <>
            <h2>Mobile Filter</h2>
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                placement="right"
                title="Filter"
            >
                <Form form={form} onFinish={onFinish}>
                    <Form.Item label="Danh mục sản phẩm" name="category" labelCol={{ span: 24 }}>
                        <Checkbox.Group >
                            <Row>
                                {categories.map((category, index) => (
                                    <Col span={24} key={index} style={{ marginBottom: 8 }}>
                                        <Checkbox value={category.value}>
                                            {category.label}
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <Form.Item name={["range", "from"]}>
                                <InputNumber style={{ width: "100%" }} placeholder="đ TỪ" min={0} formatter={value =>
                                    value
                                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : ''
                                } />
                            </Form.Item>
                            <span style={{ alignSelf: "center" }}>-</span>
                            <Form.Item name={["range", "to"]}>
                                <InputNumber style={{ width: "100%" }} placeholder="đ ĐẾN" min={0} formatter={value =>
                                    value
                                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : ''
                                } />
                            </Form.Item>
                        </div>
                        <div>
                            <Button type="primary" style={{ width: "100%" }}
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} style={{ marginBottom: 8, cursor: "pointer", padding: "4px 0" }}>
                                <Rate value={rating} disabled style={{ color: "#ffce3d", fontSize: 14 }} />
                                <span style={{ marginLeft: 8, fontSize: 14 }}>{rating === 5 ? "trở lên" : ""}</span>
                            </div>
                        ))}
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default MobileFilter;