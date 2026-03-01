import { Modal, Tabs, TabsProps } from "antd";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children: <><UserInfo /></>
        },
        {
            key: '2',
            label: 'Change Password',
            children: <><ChangePassword /></>,
        },
    ];
    return (
        <>
            <Modal width={'60vw'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="User Management" footer={null}>
                <Tabs
                    style={{ overflowX: "auto" }} defaultActiveKey="1" items={items} >
                </Tabs>
            </Modal>

        </>
    );
}

export default ManageAccount;