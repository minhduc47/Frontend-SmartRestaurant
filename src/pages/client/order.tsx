import OrderDetail from "@/components/client/order/order.detail";
import Payment from "@/components/client/order/payment";
import { Button, Result, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";


const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const items = [
        {
            title: 'Giỏ hàng',
        },
        {
            title: 'Đặt hàng',
        },
        {
            title: 'Thanh toán',
        },
    ];
    return (
        <>
            <div style={{ padding: 24, background: '#f7f7f7', minHeight: '100vh', margin: '0 auto', maxWidth: '1200px' }}>
                <Steps current={currentStep} items={items} />
                {
                    currentStep === 0 && (
                        <OrderDetail currentStep={currentStep} setCurrentStep={setCurrentStep} />
                    )
                }
                {
                    currentStep === 1 && (
                        <Payment currentStep={currentStep} setCurrentStep={setCurrentStep} />
                    )
                }
                {
                    currentStep === 2 && (
                        <Result
                            status="success"
                            title="Đặt hàng thành công!"
                            subTitle="Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể."
                            extra={[
                                <Button type="primary" key="console">
                                    Trang chủ
                                </Button>,
                                <Button key="history">
                                    <Link to="/history" type="primary">Lịch sử mua hàng</Link>
                                </Button>
                            ]}
                        />
                    )
                }
            </div>
        </>
    );
}

export default OrderPage;