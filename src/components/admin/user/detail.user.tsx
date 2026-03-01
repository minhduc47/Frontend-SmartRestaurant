import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge } from "antd";
import type { DescriptionsProps } from 'antd';
import dayjs from 'dayjs';
import { Drawer } from "antd";
import { Descriptions } from "antd";
import { Avatar } from 'antd';
interface IProps {
    isOpenDetail: boolean;
    setIsOpenDetail: (isOpen: boolean) => void;
    userDetail: IUserTable | null;
    setUserDetail: (user: IUserTable | null) => void;
}
const DetailUser = (props: IProps) => {
    const { isOpenDetail, setIsOpenDetail, userDetail, setUserDetail } = props;
    const avatarUrl = userDetail ? `${import.meta.env.VITE_API_URL}/images/avatar/${userDetail.avatar}` : '';
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: userDetail ? userDetail._id : 'N/A',
            span: 2,
        },
        {
            key: '2',
            label: 'Full Name',
            children: userDetail ? userDetail.fullName : 'N/A',
            span: 2,
        },
        {
            key: '3',
            label: 'Email',
            children: userDetail ? userDetail.email : 'N/A',
            span: 2,
        },
        {
            key: '4',
            label: 'Phone',
            children: userDetail ? userDetail.phone : 'N/A',
            span: 2,
        },
        {
            key: '5',
            label: 'Role',
            children: <Badge status="processing" text={userDetail ? userDetail.role : 'N/A'} />,
            span: 2,
        },
        {
            key: '5',
            label: 'Avatar',
            children: <Avatar size={40} src={avatarUrl}></Avatar>,
            span: 2
        },
        {
            key: '6',
            label: 'Created At',
            children: userDetail ? dayjs(userDetail.createdAt).format(FORMATE_DATE_VN) : 'N/A',
            span: 2,
        },
        {
            key: '7',
            label: 'Updated At',
            children: userDetail ? dayjs(userDetail.updatedAt).format(FORMATE_DATE_VN) : 'N/A',
            span: 2,
        }

    ];

    const onClose = () => {
        setUserDetail(null);
        setIsOpenDetail(false);
    };

    return (
        <>
            <Drawer
                width={'50vw'}
                title="User Detail Information"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={isOpenDetail}
            >
                {
                    userDetail ? (
                        <Descriptions title="User Info" bordered items={items} />
                    ) : null
                }
            </Drawer>
        </>
    )
}

export default DetailUser;