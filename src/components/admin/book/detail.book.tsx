import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Divider, Image, Upload } from "antd";
import type { DescriptionsProps } from 'antd';
import dayjs from 'dayjs';
import { Drawer } from "antd";
import { Descriptions } from "antd";
import { useEffect, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { v4 as uuidv4 } from 'uuid';
interface IProps {
    isOpenDetail: boolean;
    setIsOpenDetail: (isOpen: boolean) => void;
    bookDetail: IBookTable | null;
    setBookDetail: (book: IBookTable | null) => void;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const DetailBook = (props: IProps) => {
    const { isOpenDetail, setIsOpenDetail, bookDetail, setBookDetail } = props;
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: bookDetail ? bookDetail._id : 'N/A',
            span: 1,
        },
        {
            key: '2',
            label: 'Book Name',
            children: bookDetail ? bookDetail.mainText : 'N/A',
            span: 2,
        },
        {
            key: '3',
            label: 'Author',
            children: bookDetail ? bookDetail.author : 'N/A',
            span: 1,
        },
        {
            key: '4',
            label: 'Price',
            children: bookDetail ? bookDetail.price : 'N/A',
            span: 2,
        },
        {
            key: '5',
            label: 'Category',
            children: <Badge status="processing" text={bookDetail ? bookDetail.category : 'N/A'} />,
            span: 3,
        },
        {
            key: '6',
            label: 'Created At',
            children: bookDetail ? dayjs(bookDetail.createdAt).format(FORMATE_DATE_VN) : 'N/A',
            span: 1,
        },
        {
            key: '7',
            label: 'Updated At',
            children: bookDetail ? dayjs(bookDetail.updatedAt).format(FORMATE_DATE_VN) : 'N/A',
            span: 2,
        }

    ];
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (bookDetail) {
            const images = [bookDetail.thumbnail, ...bookDetail.slider];
            setFileList(images.map((image) => ({
                uid: uuidv4(),
                name: image,
                status: 'done',
                url: `${import.meta.env.VITE_API_URL}/images/book/${image}`,
            })));
        }
    }, [bookDetail])

    const onClose = () => {
        setBookDetail(null);
        setIsOpenDetail(false);
        setFileList([]);
        setPreviewImage('');
    };
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);
    return (
        <>
            <Drawer
                width={'50vw'}
                title="Book Detail Information"
                closable={{ 'aria-label': 'Close Button' }}

                onClose={onClose}
                open={isOpenDetail}
            >
                {
                    bookDetail ? (
                        <Descriptions title="Book Info" bordered items={items} />
                    ) : null
                }
                <br />
                <Divider orientation="left">Book Images</Divider>
                <Upload
                    style={{ marginTop: 20 }}
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailBook;