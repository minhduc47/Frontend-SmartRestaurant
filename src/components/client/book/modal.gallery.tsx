import { Col, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";

interface IProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentIndex: number;
    items: any[];
    title: string;
}

const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex]);
    return (
        <>
            <Modal
                width={'80vw'}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                title={title}
                footer={null}
                closable={false}
            >
                <Row gutter={16}>
                    <Col span={18}>
                        <ImageGallery
                            items={items}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            showNav={true}
                            startIndex={activeIndex}
                            onSlide={(index) => setActiveIndex(index)}
                            ref={refGallery}
                            showThumbnails={false}
                            showBullets={false}
                        />
                    </Col>
                    <Col span={6}>
                        <div style={{
                            height: '400px',
                            overflowY: 'auto',
                            padding: '8px',
                            background: '#f5f5f5',
                            borderRadius: '8px'
                        }}>
                            <Row gutter={[8, 8]}>
                                {items.map((item, index) => (
                                    <Col span={24} key={`image-${index}`} >
                                        <img
                                            src={item.thumbnail || item.original}
                                            alt={`Thumbnail ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '80px',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                            onClick={() => {
                                                setActiveIndex(index);
                                                refGallery.current?.slideToIndex(index);
                                            }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Col>
                </Row>

            </Modal>
        </>
    )
}

export default ModalGallery;