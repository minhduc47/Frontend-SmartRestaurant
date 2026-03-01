import { Row, Col, Skeleton, Card, Divider } from "antd";

const BookLoader = () => {
    return (
        <div className="book-page">
            <div className="container">
                <Row gutter={[32, 32]}>
                    {/* Image Gallery Skeleton */}
                    <Col xs={24} md={12}>
                        <div style={{ background: 'white', borderRadius: '20px', padding: '30px' }}>
                            {/* Main image skeleton */}
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <Skeleton.Image
                                    style={{
                                        width: '350px',
                                        height: '350px',
                                        borderRadius: '15px'
                                    }}
                                    active
                                />
                            </div>

                            {/* Thumbnail gallery skeleton */}
                            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Skeleton.Image
                                        key={item}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '6px'
                                        }}
                                        active
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* Book Details Skeleton */}
                    <Col xs={24} md={12}>
                        <div className="book-details" style={{ background: 'white', borderRadius: '20px', padding: '30px' }}>
                            {/* Author skeleton */}
                            <Skeleton.Input
                                style={{ width: '200px', height: '16px', marginBottom: '16px' }}
                                active
                                size="small"
                            />

                            {/* Title skeleton */}
                            <Skeleton.Input
                                style={{ width: '100%', height: '40px', marginBottom: '20px' }}
                                active
                                size="large"
                            />

                            {/* Rating skeleton */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <Skeleton.Input
                                    style={{ width: '120px', height: '20px' }}
                                    active
                                    size="small"
                                />
                                <Skeleton.Input
                                    style={{ width: '100px', height: '16px' }}
                                    active
                                    size="small"
                                />
                            </div>

                            {/* Price skeleton */}
                            <Skeleton.Input
                                style={{ width: '150px', height: '32px', marginBottom: '24px' }}
                                active
                            />

                            <Divider />

                            {/* Shipping info skeleton */}
                            <div style={{ marginBottom: '20px' }}>
                                <Skeleton.Input
                                    style={{ width: '100px', height: '16px', marginBottom: '8px' }}
                                    active
                                    size="small"
                                />
                                <Skeleton.Input
                                    style={{ width: '150px', height: '16px' }}
                                    active
                                    size="small"
                                />
                            </div>

                            {/* Quantity section skeleton */}
                            <div style={{ marginBottom: '24px' }}>
                                <Skeleton.Input
                                    style={{ width: '80px', height: '16px', marginBottom: '12px' }}
                                    active
                                    size="small"
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Skeleton.Input
                                        style={{ width: '80px', height: '40px' }}
                                        active
                                    />
                                    <Skeleton.Input
                                        style={{ width: '100px', height: '16px' }}
                                        active
                                        size="small"
                                    />
                                </div>
                            </div>

                            {/* Action buttons skeleton */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <Skeleton.Button
                                        style={{ width: '180px', height: '40px' }}
                                        active
                                    />
                                    <Skeleton.Button
                                        style={{ width: '120px', height: '40px' }}
                                        active
                                    />
                                </div>

                                {/* Secondary actions skeleton */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <Skeleton.Button
                                        style={{ width: '140px', height: '32px' }}
                                        active
                                        size="small"
                                    />
                                    <Skeleton.Button
                                        style={{ width: '100px', height: '32px' }}
                                        active
                                        size="small"
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Book Description Skeleton */}
                <Row style={{ marginTop: '48px' }}>
                    <Col span={24}>
                        <Card title={<Skeleton.Input style={{ width: '120px', height: '20px' }} active />} className="book-description-card">
                            <Skeleton
                                paragraph={{
                                    rows: 4,
                                    width: ['100%', '80%', '90%', '70%']
                                }}
                                title={false}
                                active
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BookLoader;