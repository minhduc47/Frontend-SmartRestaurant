import dayjs from "dayjs";

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD/MM/YYYY";
export const FORMATE_DATE_VN2 = "DD-MM-YYYY";
export const dateRangeValidate = (dateRange: any) => {
    if (!dateRange) return undefined;

    const startDate = dayjs(dateRange[0], FORMATE_DATE_DEFAULT).toDate();
    const endDate = dayjs(dateRange[1], FORMATE_DATE_DEFAULT).toDate();

    return [startDate, endDate];
};

export const normalizePagingQuery = (query: string) => {
    const cleanedQuery = (query ?? '').replace(/^\?/, '');
    const params = new URLSearchParams(cleanedQuery);

    if (params.has('current') && !params.has('page')) {
        params.set('page', params.get('current') || '1');
    }

    if (params.has('pageSize') && !params.has('size')) {
        params.set('size', params.get('pageSize') || '10');
    }

    params.delete('current');
    params.delete('pageSize');

    // Spring Pageable expects sort syntax like: sort=field,desc
    // Allow legacy FE style: sort=-field
    const sorts = params.getAll('sort');
    if (sorts.length > 0) {
        params.delete('sort');
        sorts.forEach((sortValue) => {
            const value = (sortValue ?? '').trim();
            if (!value) return;

            if (value.startsWith('-')) {
                params.append('sort', `${value.slice(1)},desc`);
            } else {
                params.append('sort', value);
            }
        });
    }

    return params.toString();
};

export const resolveStorageUrl = (fileNameOrUrl: string | undefined, folder: string) => {
    if (!fileNameOrUrl) return '';

    if (
        fileNameOrUrl.startsWith('http://')
        || fileNameOrUrl.startsWith('https://')
        || fileNameOrUrl.startsWith('data:')
        || fileNameOrUrl.startsWith('blob:')
        || fileNameOrUrl.startsWith('/')
    ) {
        return fileNameOrUrl;
    }

    const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
    return `${base}/storage/${folder}/${fileNameOrUrl}`;
};

export const escapeSpringFilterString = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export const sfContainsIgnoreCase = (field: string, value: string) =>
    `${field} ~~ '%${escapeSpringFilterString(value.trim())}%'`;

export const sfDateRangeInclusive = (field: string, from: Date, to: Date) => {
    const fromDate = dayjs(from).format('YYYY-MM-DD');
    const toDate = dayjs(to).format('YYYY-MM-DD');
    return `${field} >: '${fromDate}' and ${field} <: '${toDate}'`;
};

export const buildSpringFilter = (parts: Array<string | undefined>) => {
    const clauses = parts.filter((item): item is string => !!item && item.trim().length > 0);
    return clauses.length > 0 ? clauses.join(' and ') : undefined;
};
