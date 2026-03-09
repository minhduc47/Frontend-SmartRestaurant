import axios from 'services/axios.customize';
import { normalizePagingQuery } from './helper';

// ── Dish ──────────────────────────────────────────────────────────────────────

/** Lấy danh sách món ăn có phân trang / filter.
 *  query: chuỗi query string, ví dụ "page=1&pageSize=10&name=bún" */
export const getListDishAPI = (query: string) => {
    const normalized = normalizePagingQuery(query);
    const urlBackend = normalized ? `/dishes?${normalized}` : '/dishes';
    return axios.get<IBackendRes<IModelPaginate<IDish>>>(urlBackend);
};

/** Lấy chi tiết một món ăn theo id. */
export const getDishByIdAPI = (id: string) => {
    const urlBackend = `/dishes/${id}`;
    return axios.get<IBackendRes<IDish>>(urlBackend);
};

/** Tạo mới món ăn. */
export const createDishAPI = (data: ICreateDishRequest) => {
    const urlBackend = '/dishes';
    return axios.post<IBackendRes<IDish>>(urlBackend, data);
};

/** Cập nhật món ăn. Body phải chứa trường `id` để BE tìm món cần sửa. */
export const updateDishAPI = (data: ICreateDishRequest) => {
    const urlBackend = `/dishes`; // BE: PUT /api/v1/dishes (không trailing slash)
    return axios.put<IBackendRes<IDish>>(urlBackend, data);
};

/** Xóa mềm món ăn theo id. */
export const deleteDishAPI = (id: string) => {
    const urlBackend = `/dishes/${id}`;
    return axios.delete<IBackendRes<IDish>>(urlBackend);
};

// ── Category ──────────────────────────────────────────────────────────────────

/** Lấy danh sách danh mục món ăn (có phân trang).
 *  Gọi không có query → mặc định pageSize=10. Để lấy toàn bộ nên gọi với `pageSize=1000`.
 */
export const getCategoryAPI = () => {
    const urlBackend = '/categories?page=1&size=1000';
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(urlBackend);
};

// ── File upload ───────────────────────────────────────────────────────────────

export const uploadFileAPI = (fileImg: File, folder: string) => {
    // BE: POST /api/v1/files?folder={folder} (đọc folder từ @RequestParam, KHÔNG phải header)
    const urlBackend = `/files?folder=${folder}`;
    const formData = new FormData();
    formData.append('file', fileImg);
    // BE trả về: { fileName: string, uploadedAt: string }
    return axios.post<IBackendRes<{ fileName: string; uploadedAt: string }>>(urlBackend, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

