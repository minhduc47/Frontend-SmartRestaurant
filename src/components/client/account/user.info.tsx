import { useCurrentApp } from "@/components/context/app.context";
import { updateUserInfoAPI } from "@/services/api";
import { App, Avatar, Button, Form, FormProps, Input, Upload, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { uploadFileAPI } from "@/services/dish.api";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
interface FieldType {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar: any;
}
const UserInfo = () => {
    const { user, setUser } = useCurrentApp();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { message, notification } = App.useApp();
    const [userAvatar, setUserAvatar] = useState<string>(user?.avatar ?? '');
    const urlAvatar = `${import.meta.env.VITE_API_URL}/images/avatar/${userAvatar}`;
    useEffect(() => {
        if (user) {
            console.log("user", user);
            form.setFieldsValue({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar
            });
            setUserAvatar(user.avatar);
        }
    }, [user]);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        const { _id, fullName, phone } = values;
        console.log(values);
        const res = await updateUserInfoAPI(_id, userAvatar, fullName, phone);
        if (res && res.data) {
            setUser({ ...user!, avatar: userAvatar, fullName, phone });
            message.success("Cập nhật thông tin thành công!");

            localStorage.removeItem("access_token");
        }
        if (res.error) {
            message.error(res.message);
        }
        setIsSubmitting(false);
    };

    const handleUploadFile = async (options: RcCustomRequestOptions,) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "avatar");

        if (res && res.data) {
            const fileUrl = res.data.fileUploaded;
            setUserAvatar(fileUrl);
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
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
                {/* Avatar Section */}
                <div style={{ minWidth: 180, textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                        <Avatar src={urlAvatar} size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160 }} icon={<AntDesignOutlined />} shape="circle" />
                    </div>
                    <Upload
                        multiple={false}
                        maxCount={1}
                        accept=".jpg,.jpeg,.png"
                        showUploadList={false}
                        customRequest={handleUploadFile}
                        onChange={(info) => {
                            if (info.file.status === 'uploading') {
                            }
                            if (info.file.status === 'done') {
                                message.success('Avatar uploaded successfully');
                            } else if (info.file.status === 'error') {
                                message.error('Failed to upload avatar');
                            }
                        }}

                    >
                        <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                    </Upload>
                </div>
                {/* Form Section */}
                <div style={{ flex: 1 }}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item name="_id" noStyle hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                            <Input disabled />
                        </Form.Item>

                        <Form.Item name="fullName" label="Tên hiển thị" rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ padding: '6px 24px', borderRadius: 4, border: 'none', cursor: 'pointer' }} loading={isSubmitting}>Cập nhật</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};



export default UserInfo;