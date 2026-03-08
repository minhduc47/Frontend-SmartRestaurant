import axios from 'services/axios.customize';

export const loginAPI = (username: string, password: string) => {
    const urlBackend = '/auth/login';
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
};

export const registerAPI = (data: IRegisterRequest) => {
    const urlBackend = '/auth/register'; // BE: POST /api/v1/auth/register → ResCreateUserDTO
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
};

export const fetchAccountAPI = () => {
    const urlBackend = '/auth/account';
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};

export const logoutAPI = () => {
    const urlBackend = '/auth/logout';
    return axios.post<IBackendRes<unknown>>(urlBackend);
};

export const getUsersAPI = (query: string) => {
    const urlBackend = `/users?${query}`; // BE: GET /api/v1/users
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const createUserAPI = (data: IRegisterRequest) => {
    const urlBackend = '/users'; // BE: POST /api/v1/users → ResCreateUserDTO
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
};

// TODO: BE chưa có endpoint /users/bulk-create. IDataImport dùng 'fullName'/'phone' không khớp với User entity BE
// → DEAD CODE: không gọi API này cho đến khi BE triển khai endpoint
export const createListUsersAPI = (data: IDataImport[]) => {
    const urlBackend = '/users/bulk-create';
    return axios.post<IBackendRes<IBulkUsersResponse>>(urlBackend, data);
};

// id: number (BE dùng long), name: string (BE dùng "name", KHÔNG phải "fullName")
// Response khớp với BE ResUpdateUserDTO
export const updateUserAPI = (id: number, name: string) => {
    const urlBackend = '/users'; // BE: PUT /api/v1/users
    return axios.put<IBackendRes<IResUpdateUser>>(urlBackend, { id, name });
};

export const deleteUserAPI = (id: number) => {
    const urlBackend = `/users/${id}`; // BE: DELETE /api/v1/users/{id}
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const createOrderAPI = (data: ICreateOrderRequest) => {
    const urlBackend = '/orders'; // BE: POST /api/v1/orders
    return axios.post<IBackendRes<IOrder>>(urlBackend, data);
};

// TODO: BE chưa có endpoint /history → DEAD CODE
export const getHistoryAPI = () => {
    const urlBackend = '/history';
    return axios.get<IBackendRes<IOrder[]>>(urlBackend);
};

// NOTE: BE User entity không có field 'avatar' → không gửi avatar lên BE
// Response khớp với BE ResUpdateUserDTO
export const updateUserInfoAPI = (id: number, name: string) => {
    const urlBackend = '/users'; // BE: PUT /api/v1/users
    return axios.put<IBackendRes<IResUpdateUser>>(urlBackend, { id, name });
};

// TODO: BE chưa có endpoint /users/change-password → DEAD CODE
export const updateUserPasswordAPI = (email: string, oldpass: string, newpass: string) => {
    const urlBackend = '/users/change-password';
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, oldpass, newpass });
};

export const getListOrdersAPI = (query: string) => {
    const urlBackend = `/orders?${query}`; // BE: GET /api/v1/orders
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};

// TODO: BE chưa có endpoint /database/dashboard → DEAD CODE
export const getDashboardDataAPI = () => {
    const urlBackend = '/database/dashboard';
    return axios.get<IBackendRes<IDashboardData>>(urlBackend);
};

