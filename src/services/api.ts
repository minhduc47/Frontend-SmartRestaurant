import axios from 'services/axios.customize';

export const loginAPI = (username: string, password: string) => {
    const urlBackend = '/auth/login';
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
};

export const registerAPI = (data: IRegisterRequest) => {
    const urlBackend = '/user/register';
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
};

export const fetchAccountAPI = () => {
    const urlBackend = '/auth/account';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1000,
        },
    });
};

export const logoutAPI = () => {
    const urlBackend = '/auth/logout';
    return axios.post<IBackendRes<unknown>>(urlBackend);
};

export const getUsersAPI = (query: string) => {
    const urlBackend = `/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const createUserAPI = (data: IRegisterRequest) => {
    const urlBackend = '/user';
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
};

export const createListUsersAPI = (data: IDataImport[]) => {
    const urlBackend = '/user/bulk-create';
    return axios.post<IBackendRes<IBulkUsersResponse>>(urlBackend, data);
};

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = '/user';
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone });
};

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const createOrderAPI = (data: ICreateOrderRequest) => {
    const urlBackend = '/order';
    return axios.post<IBackendRes<IOrder>>(urlBackend, data);
};

export const getHistoryAPI = () => {
    const urlBackend = '/history';
    return axios.get<IBackendRes<IOrder[]>>(urlBackend);
};

export const updateUserInfoAPI = (_id: string, avatar: string, fullName: string, phone: string) => {
    const urlBackend = '/user';
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, avatar, fullName, phone });
};

export const updateUserPasswordAPI = (email: string, oldpass: string, newpass: string) => {
    const urlBackend = '/user/change-password';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, oldpass, newpass });
};

export const getListOrdersAPI = (query: string) => {
    const urlBackend = `/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};

export const getDashboardDataAPI = () => {
    const urlBackend = '/database/dashboard';
    return axios.get<IBackendRes<IDashboardData>>(urlBackend);
};

