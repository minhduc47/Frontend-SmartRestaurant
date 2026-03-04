import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Col, Image, InputNumber, Modal, Row, Select } from 'antd';
import { Form, Input } from 'antd';
import type { FormProps, UploadProps, GetProp } from 'antd';
import { Upload } from "antd";
import { UploadFile } from 'antd/lib';
import { UploadChangeParam } from 'antd/lib/upload';
import { useEffect, useState } from 'react';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { getCategoryAPI, updateBookAPI, uploadFileAPI } from '@/services/dish.api';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    bookEditing: IBookTable | null;
    isOpenUpdate: boolean;
    setIsOpenUpdate: (isOpen: boolean) => void;
    refreshTable: () => void;
    setBookEditing: (book: IBookTable | null) => void;
}

type FieldType = {
    mainText?: string;
    author?: string;
    price?: number;
    category?: string;
    quantity?: number;
    thumbnail?: any;
    slider?: any;
}

interface ICategory {
    label: string;
    value: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";
const UpdateBook = (props: IProps) => {
    const { isOpenUpdate, setIsOpenUpdate, refreshTable, bookEditing, setBookEditing } = props;
    const [form] = Form.useForm();
    const [listCategories, setListCategories] = useState<ICategory[]>([]);
    // Component logic for creating a book
    const { notification } = App.useApp();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {

        // Fetch categories from the API
        const fetchCategories = async () => {
            const response = await getCategoryAPI();
            if (response && response.data) {
                const categories = response.data.map((category) => ({
                    label: category,
                    value: category
                }));
                setListCategories(categories);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (bookEditing) {
            // Set thumbnail and slider file lists
            const thumbnailFile = [
                {
                    uid: uuidv4(),
                    name: bookEditing.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_API_URL}/images/book/${bookEditing.thumbnail}`,
                }
            ];
            const sliderFiles = bookEditing?.slider?.map((file) => {
                return {
                    uid: uuidv4(),
                    name: file,
                    status: 'done',
                    url: `${import.meta.env.VITE_API_URL}/images/book/${file}`,
                }
            });

            form.setFieldsValue({
                mainText: bookEditing.mainText,
                author: bookEditing.author,
                price: bookEditing.price,
                category: bookEditing.category,
                quantity: bookEditing.quantity,
                thumbnail: thumbnailFile,
                slider: sliderFiles,
            });
            setFileListThumbnail(thumbnailFile as any);
            setFileListSlider(sliderFiles as any);

        }
    }, [bookEditing]);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        const { mainText, author, price, quantity, category } = values;
        const requestData: ICreateBookRequest = {
            thumbnail: fileListThumbnail?.[0]?.name ?? '',
            slider: fileListSlider?.map((file: any) => file?.name) ?? [],
            mainText: mainText!,
            author: author!,
            price: price!,
            quantity: quantity!,
            category: category!
        };
        const res = await updateBookAPI(bookEditing!._id, requestData);

        if (res && res.data) {
            notification.success({
                message: 'Success',
                description: 'Book updated successfully!',
            });
            setIsOpenUpdate(false);
            form.resetFields();
            setFileListThumbnail([]);
            setFileListSlider([]);
            refreshTable();
        } else {
            notification.error({
                message: 'Error',
                description: 'Failed to update book.',
            });
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            notification.error({
                message: 'Invalid file type',
                description: 'You can only upload JPG/PNG file!',
            })
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notification.error({
                message: 'File too large',
                description: 'Image must be smaller than 2MB!',
            });
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE; // Return false to prevent upload
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        }
        if (type === 'slider') {
            setFileListSlider((prev) => prev.filter((item) => item.uid !== file.uid));
        }
    }

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            // Handle file change for thumbnail or slider
            type === 'thumbnail' ? setLoadingThumbnail(true) : setLoadingSlider(true);
            return;
        }

        if (info.file.status === 'done') {
            type === 'thumbnail' ? setLoadingThumbnail(false) : setLoadingSlider(false);
        }
    }

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const fileUrl = res.data.fileUploaded;
            const uploadedFile: UploadFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${fileUrl}`,
            };

            if (type === 'thumbnail') {
                setFileListThumbnail([{ ...uploadedFile }]);

            } else if (type === 'slider') {
                setFileListSlider((prev) => [...prev, { ...uploadedFile }]);

            }


            if (onSuccess) {
                onSuccess("ok");
            }
        } else {
            notification.error({
                message: 'Upload failed',
                description: 'Failed to upload the file.',
            });
        }

    };

    const handleOnCancel = () => {
        form.resetFields();
        setIsOpenUpdate(false);
        setFileListThumbnail([]);
        setFileListSlider([]);
        setBookEditing(null);
    }
    return (
        <>
            <Modal
                width={"60vw"}
                title="Update Book"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpenUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    handleOnCancel();
                }}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Book Name" name="mainText"
                                rules={[{ required: true, message: 'Please input the book name!' }]}>
                                <Input placeholder="Enter book name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Author" name="author"
                                rules={[{ required: true, message: 'Please input the author name!' }]}>
                                <Input placeholder="Enter author name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Please input the book price!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Enter book price"
                                    min={0}
                                    formatter={value =>
                                        value
                                            ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            : ''
                                    }
                                // replace(/[₫,\s]/g, '') 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Category" name="category"
                                rules={[{ required: true, message: 'Please select a category!' }]}>
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategories}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Quantity" name="quantity"
                                rules={[{ required: true, message: 'Please input the book quantity!' }]}>
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Thumbnail"
                                name="thumbnail"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{ required: true, message: 'Please upload a thumbnail!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    multiple={false}
                                    maxCount={1}
                                    accept=".jpg,.jpeg,.png"
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? <UploadOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Slider Images"
                                name="slider"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{ required: true, message: 'Please upload slider images!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    multiple
                                    accept=".jpg,.jpeg,.png"
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    fileList={fileListSlider}
                                >
                                    <div>
                                        {loadingSlider ? <UploadOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
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
            </Modal>
        </>
    )
}

export default UpdateBook;