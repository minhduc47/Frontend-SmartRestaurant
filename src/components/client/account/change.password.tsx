import { Alert } from 'antd';

const ChangePassword = () => {
    return (
        <Alert
            type="warning"
            showIcon
            message="Tinh nang doi mat khau tam thoi chua ho tro"
            description="Backend hien tai chua co endpoint /users/change-password. Hay bo sung API nay o BE neu ban muon bat lai tinh nang."
        />
    );
};

export default ChangePassword;
