import axios from 'services/axios.customize';

export const loginAPI = (username: string, password: string) => {
    const urlBackend = '/api/v1/auth/login';
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
}

export const registerAPI = (data: IRegisterRequest) => {
    const urlBackend = '/api/v1/user/register';
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

export const fetchAccountAPI = () => {
    const urlBackend = '/api/v1/auth/account';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers:{
            delay: 1000,
        }
    });
}

export const logoutAPI = () => {
    const urlBackend = '/api/v1/auth/logout';
    return axios.post<IBackendRes<any>>(urlBackend);
}

export const getUsersAPI = (query:string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}


export const createUserAPI = (data: IRegisterRequest) => {
    const urlBackend = '/api/v1/user';
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

export const createListUsersAPI = (data: IDataImport[]) => {
    const urlBackend = '/api/v1/user/bulk-create';
    return axios.post<IBackendRes<IBulkUsersResponse>>(urlBackend, data);
}

export const updateUserAPI = (_id:string, fullName:string, phone:string) => {
    const urlBackend = '/api/v1/user';
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone });
}

export const deleteUserAPI = (_id:string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend );
}

export const createOrderAPI = (data: IOrderRequest) => {
    const urlBackend = '/api/v1/order';
    return axios.post<IBackendRes<IOrder>>(urlBackend, data);
}

export const getHistoryAPI = () => {
    const urlBackend = '/api/v1/history';
    return axios.get<IBackendRes<IOrderHistoryTable[]>>(urlBackend);
}

export const updateUserInfoAPI = (_id:string, avatar:string, fullName:string, phone:string) => {
    const urlBackend = '/api/v1/user';
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, avatar, fullName, phone });
}

export const updateUserPasswordAPI = (email:string, oldpass:string, newpass:string) => {
    const urlBackend = '/api/v1/user/change-password';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, oldpass, newpass });
}
export const getListOrdersAPI = (query:string) => {
    const urlBackend = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
}

export const getDashboardDataAPI = () => {
    const urlBackend = `/api/v1/database/dashboard`;
    return axios.get<IBackendRes<IDashboardData>>(urlBackend);
}

