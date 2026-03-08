import { getCategoryAPI, updateDishAPI, uploadFileAPI } from '@/services/dish.api';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
    App,
    Col,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Switch,
    Upload,
} from 'antd';
import type { FormProps, GetProp, UploadProps } from 'antd';
import { UploadFile } from 'antd/lib';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useEffect, useState } from 'react';

interface IProps {
    dishEditing: IDish | null;
    isOpenUpdate: boolean;
    setIsOpenUpdate: (isOpen: boolean) => void;
    refreshTable: () => void;
    setDishEditing: (dish: IDish | null) => void;
}

type FieldType = {
    name: string;
    price: number;
    categoryId: number;
    description: string;
    active: boolean;
    image?: UploadFile[];
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UpdateDish = ({
    dishEditing,
    isOpenUpdate,
    setIsOpenUpdate,
    refreshTable,
    setDishEditing,
}: IProps) => {
    const [form] = Form.useForm<FieldType>();
    const { notification } = App.useApp();

    const [listCategories, setListCategories] = useState<{ label: string; value: number }[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loadingImage, setLoadingImage] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // Load categories once
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoryAPI();
            if (res?.data) {
                // BE trả về ResultPaginationDTO { result: ICategory[] }
                setListCategories(
                    res.data.result.map((c) => ({ label: c.name, value: c.id }))
                );
            }
        };
        fetchCategories();
    }, []);

    // Pre-fill form when editing dish changes
    useEffect(() => {
        if (dishEditing) {
            const existingImage: UploadFile = {
                uid: `existing-${dishEditing.id}`,
                name: dishEditing.image,
                status: 'done',
                url: dishEditing.image,
            };
            setFileList([existingImage]);
            form.setFieldsValue({
                name: dishEditing.name,
                price: dishEditing.price,
                categoryId: dishEditing.category?.id,
                description: dishEditing.description,
                active: dishEditing.active,
                image: [existingImage],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dishEditing]);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJpgOrPng)
            notification.error({ message: 'Chỉ chấp nhận file JPG/PNG!' });
        if (!isLt2M)
            notification.error({ message: 'Ảnh phải nhỏ hơn 2MB!' });
        return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') setLoadingImage(true);
        if (info.file.status === 'done') setLoadingImage(false);
    };

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess, onError } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file as unknown as File, 'dish');
        if (res?.data) {
            const uploadedFile: UploadFile = {
                uid: file.uid,
                name: res.data.fileName, // WAS: res.data.fileUploaded
                status: 'done',
                url: `${import.meta.env.VITE_API_URL}/storage/dish/${res.data.fileName}`,
            };
            setFileList([uploadedFile]);
            setLoadingImage(false);
            onSuccess?.('ok');
        } else {
            notification.error({ message: 'Upload ảnh thất bại!' });
            onError?.(new Error('Upload failed'));
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (!dishEditing) return;

        const requestData: ICreateDishRequest = {
            id: dishEditing.id,
            name: values.name,
            price: values.price,
            category: { id: values.categoryId },
            description: values.description,
            image: fileList[0]?.name ?? dishEditing.image,
            active: values.active,
        };
        const res = await updateDishAPI(requestData);
        if (res?.data) {
            notification.success({ message: 'Cập nhật món ăn thành công!' });
            handleCancel();
            refreshTable();
        } else {
            notification.error({
                message: 'Cập nhật thất bại!',
                description: res?.message,
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setDishEditing(null);
        setIsOpenUpdate(false);
    };

    return (
        <>
            <Modal
                title="Cập nhật món ăn"
                width="60vw"
                open={isOpenUpdate}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                label="Tên món ăn"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên món ăn!' }]}
                            >
                                <Input placeholder="Nhập tên món ăn" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Giá (VNĐ)"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="0"
                                    formatter={(value) =>
                                        value
                                            ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            : ''
                                    }
                                    parser={(value) =>
                                        (value ? Number(value.replace(/,/g, '')) : 0) as unknown as 0
                                    }
                                    addonAfter="₫"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Danh mục"
                                name="categoryId"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Chọn danh mục"
                                    options={listCategories}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '')
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Trạng thái" name="active" valuePropName="checked">
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Mô tả món ăn..." />
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            accept=".jpg,.jpeg,.png"
                            customRequest={handleUploadFile}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={() => setFileList([])}
                            fileList={fileList}
                        >
                            {fileList.length === 0 && (
                                <div>
                                    {loadingImage ? <UploadOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
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
    );
};

export default UpdateDish;
