import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Button, Rate, InputNumber, Typography, Divider, message, Card } from "antd";
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import { getBookByIdAPI } from "services/book.api";
import "./book.detail.scss";
import ImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";
import BookLoader from "./book.loader";
import { useCurrentApp } from "@/components/context/app.context";
const { Title, Text, Paragraph } = Typography;

const BookDetail = () => {
    const params = useParams<{ id: string }>();
    const [book, setBook] = useState<IBookTable | null>(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const refGallery = useRef<ImageGallery>(null);
    const [allImages, setAllImages] = useState<any[]>([]);
    const { carts, setCarts } = useCurrentApp();

    useEffect(() => {
        fetchBookDetail();
    }, [params.id]);

    const fetchBookDetail = async () => {
        if (!params.id) return;
        setLoading(true);
        const res = await getBookByIdAPI(params.id);
        if (res?.data) {
            setBook(res.data);
            const images = []
            if (res.data.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_API_URL}/images/book/${res.data.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_API_URL}/images/book/${res.data.thumbnail}`,
                });
            }
            if (res.data.slider) {
                res.data.slider.forEach((image: string) => {
                    images.push({
                        original: `${import.meta.env.VITE_API_URL}/images/book/${image}`,
                        thumbnail: `${import.meta.env.VITE_API_URL}/images/book/${image}`,
                    });
                });
            }
            setAllImages(images);
            setLoading(false);

        }
        if (res.error) {
            message.error(res.message);
        }
    };

    const handleAddToCart = (isBuyNow: boolean) => {
        const cartStorage = localStorage.getItem('carts');
        if (cartStorage && book) {
            const carts: ICart[] = JSON.parse(cartStorage);
            const existingCart = carts.find(item => item._id === book._id);
            if (existingCart) {
                existingCart.quantity += quantity;
            } else {
                carts.push({
                    _id: book._id,
                    quantity,
                    detail: book
                });
            }
            localStorage.setItem('carts', JSON.stringify(carts));
            setCarts(carts);
        }
        else {
            const newCart: ICart[] = [{
                _id: book?._id || '',
                quantity,
                detail: book!
            }]
            localStorage.setItem('carts', JSON.stringify(newCart));
            setCarts(newCart);
        }
        message.success('Đã thêm vào giỏ hàng');
    };

    console.log('carts', carts);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };


    if (!book) {
        return (
            <div className="book-not-found">
                <Title level={2}>Không tìm thấy sách</Title>
            </div>
        );
    }

    const handleImageClick = () => {
        setIsOpenModalGallery(true);
        setSelectedImage(refGallery?.current?.getCurrentIndex() ?? 0);
    };
    if (loading) {
        return <BookLoader />;
    }
    return (
        <div className="book-page">
            <div className="container">
                <Row gutter={[32, 32]}>
                    {/* Image Gallery */}
                    <Col xs={24} md={12}>
                        <ImageGallery items={allImages} showFullscreenButton={false} showPlayButton={false} showNav={false} onClick={handleImageClick} ref={refGallery} />
                    </Col>

                    {/* Book Details */}
                    <Col xs={24} md={12}>
                        <div className="book-details">
                            <div className="book-meta">
                                <Text type="secondary">Tác giả: {book.author}</Text>
                            </div>

                            <Title level={1} className="book-title">
                                {book.mainText}
                            </Title>

                            <div className="book-rating">
                                <Rate disabled defaultValue={5} />
                                <Text className="rating-count">Đã bán {book.sold || 0}</Text>
                            </div>

                            <div className="book-price">
                                <Text className="current-price">{formatPrice(book.price)}</Text>
                            </div>

                            <Divider />

                            <div className="book-actions">
                                <div className="quantity-section">
                                    <Text strong>Vận Chuyển</Text>
                                    <Text>Miễn phí vận chuyển</Text>
                                </div>

                                <div className="quantity-section">
                                    <Text strong>Số Lượng</Text>
                                    <div className="quantity-controls">
                                        <InputNumber
                                            min={1}
                                            max={book.quantity}
                                            value={quantity}
                                            onChange={(value) => setQuantity(value || 1)}
                                            size="large"
                                        />
                                        <Text type="secondary">{book.quantity} có sẵn</Text>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <Button
                                        icon={<ShoppingCartOutlined />}
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(false)}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="buy-now-btn"
                                        onClick={() => handleAddToCart(true)}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>

                                <div className="secondary-actions">
                                    <Button icon={<HeartOutlined />} type="text">
                                        Thêm vào yêu thích
                                    </Button>
                                    <Button icon={<ShareAltOutlined />} type="text">
                                        Chia sẻ
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Book Description */}
                <Row style={{ marginTop: '48px' }}>
                    <Col span={24}>
                        <Card title="Mô tả sách" className="book-description-card">
                            <Paragraph>
                                <strong>Thể loại:</strong> {book.category}
                            </Paragraph>
                            <Paragraph>
                                <strong>Tác giả:</strong> {book.author}
                            </Paragraph>
                            <Paragraph>
                                Đây là một cuốn sách tuyệt vời với nội dung phong phú và hấp dẫn.
                                Cuốn sách này sẽ mang đến cho bạn những kiến thức bổ ích và trải nghiệm đọc thú vị.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                items={allImages}
                currentIndex={selectedImage}
                title={book.mainText}
            />
        </div>
    );
};

export default BookDetail;