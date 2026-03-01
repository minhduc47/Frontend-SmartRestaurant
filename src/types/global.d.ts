export {};

declare global {
interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }
    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }
    interface IRegisterRequest {
        fullName: string;
        email: string;
        password: string;
        phone: string;
    }
    interface IRegister {
        _id:string;
        email: string;
        fullName: string;
    }
    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
       user: IUser;
    }
    interface IUserTable {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface IDataImport {
        fullName: string;
        email: string;
        phone: string;
        password?: string;
    }
    interface IBulkUsersResponse {
        countSuccess: number;
        countError: number;
        detail: string;
    }

    interface IBookTable {
        _id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICreateBookRequest {
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        quantity: number;
        category: string;
    }

    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable;
    }

    interface IOrderRequest {
        name: string;
        address: string;
        phone: string;
        totalPrice: number;
        type: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
    }

    interface IOrder {
        _id: string;
        name: string;
        address: string;
        phone: string;
        totalPrice: number;
        type: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }
    interface IOrderHistoryTable {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        userId: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        paymentStatus: string;
        paymentRef: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IOrderTable {
        _id: string;
        name: string;
        address: string;
        phone: string;
        type: string;
        paymentStatus: string;
        paymentRef: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IDashboardData {
        countOrder: number;
        countUser: number;
        countBook: number;
    }
}
