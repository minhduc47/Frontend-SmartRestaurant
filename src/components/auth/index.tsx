import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="You are not logged in. Please login to access this page."
                extra={
                    <Button type="primary">
                        <Link to="/login">Login</Link>
                    </Button>
                }
            />
        );
    }
    const isAdminRoute = location.pathname.includes('admin');
    if (isAuthenticated == true && isAdminRoute == true) {
        const roleName = user?.role?.name;
        if (roleName === 'USER') {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
                />
            )
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;