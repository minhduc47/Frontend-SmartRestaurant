import axios from 'services/axios.customize';

export const getBooksAPI = (query:string) => {
    const urlBackend = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
}

export const getBookByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/book/${id}`;
    return axios.get<IBackendRes<IBookTable>>(urlBackend);
}

export const createBookAPI = (data: ICreateBookRequest) => {
    const urlBackend = '/api/v1/book';
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
}

export const createListBooksAPI = (data: IDataImport[]) => {
    const urlBackend = '/api/v1/book/bulk-create';
    return axios.post<IBackendRes<IBulkUsersResponse>>(urlBackend, data);
}

export const updateBookAPI = (_id:string, data: ICreateBookRequest) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend, data);
}

export const deleteBookAPI = (_id:string) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend );
}   

export const getCategoryAPI = () => {
    const urlBackend = '/api/v1/database/category';
    return axios.get<IBackendRes<string[]>>(urlBackend);
}

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const urlBackend = '/api/v1/file/upload';
    const formData = new FormData();
    formData.append('fileImg', fileImg);
    return axios.post<IBackendRes<{
        fileUploaded: string;
    }>>(urlBackend, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            "upload-type": folder,
        },
    });
}