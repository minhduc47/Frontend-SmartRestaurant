import axios from 'services/axios.customize';

// ── Dish ──────────────────────────────────────────────────────────────────────

/** Lấy danh sách món ăn có phân trang / filter.
 *  query: chuỗi query string, ví dụ "page=1&pageSize=10&name=bún" */
export const getListDishAPI = (query: string) => {
    const urlBackend = `/dish?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IDish>>>(urlBackend);
};

/** Lấy chi tiết một món ăn theo id. */
export const getDishByIdAPI = (id: string) => {
    const urlBackend = `/dish/${id}`;
    return axios.get<IBackendRes<IDish>>(urlBackend);
};

/** Tạo mới món ăn. */
export const createDishAPI = (data: ICreateDishRequest) => {
    const urlBackend = '/dish';
    return axios.post<IBackendRes<IDish>>(urlBackend, data);
};

/** Cập nhật món ăn theo id. */
export const updateDishAPI = (id: string, data: ICreateDishRequest) => {
    const urlBackend = `/dish/${id}`;
    return axios.put<IBackendRes<IDish>>(urlBackend, data);
};

/** Xóa mềm món ăn theo id. */
export const deleteDishAPI = (id: string) => {
    const urlBackend = `/dish/${id}`;
    return axios.delete<IBackendRes<IDish>>(urlBackend);
};

// ── Category ──────────────────────────────────────────────────────────────────

/** Lấy danh sách danh mục món ăn. */
export const getCategoryAPI = () => {
    const urlBackend = '/category';
    return axios.get<IBackendRes<ICategory[]>>(urlBackend);
};

// ── File upload ───────────────────────────────────────────────────────────────

export const uploadFileAPI = (fileImg: File, folder: string) => {
    const urlBackend = '/file/upload';
    const formData = new FormData();
    formData.append('fileImg', fileImg);
    return axios.post<IBackendRes<{ fileUploaded: string }>>(urlBackend, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'upload-type': folder,
        },
    });
};