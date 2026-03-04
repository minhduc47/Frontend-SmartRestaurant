export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[];
    }
    interface ILogin {
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: IRole;
        };
    }
    interface IRegisterRequest {
        fullName: string;
        email: string;
        password: string;
        phone: string;
    }
    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }
    interface IRole {
        id: number;
        name: string;
    }

    interface IUser {
        id: number;
        email: string;
        name: string;
        role: IRole;
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

    // ── Smart Restaurant – Category ───────────────────────────────────────────

    interface ICategory {
        id: number;
        name: string;
        description: string;
    }

    // ── Smart Restaurant – Dish ───────────────────────────────────────────────

    interface IDish {
        id: number;
        name: string;
        price: number;
        description: string;
        image: string;
        active: boolean;
        category: ICategory;
    }

    interface ICreateDishRequest {
        name: string;
        price: number;
        description: string;
        image: string;
        active?: boolean;
        categoryId: number;
    }

    // ── Smart Restaurant – Order ───────────────────────────────────────────────

    type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'PAID' | 'CANCELLED';
    type OrderType = 'IN_STORE' | 'DELIVERY';

    interface IOrderItem {
        dishId: number;
        dishName: string;
        quantity: number;
        unitPrice: number;
    }

    interface IOrder {
        id: number;
        totalPrice: number;
        status: OrderStatus;
        orderType: OrderType;
        tableId: number | null;
        items: IOrderItem[];
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICreateOrderItem {
        dishId: number;
        quantity: number;
        note?: string;
    }

    interface ICreateOrderRequest {
        orderType: OrderType;
        tableId?: number;
        items: ICreateOrderItem[];
    }

    interface IOrderTable {
        id: number;
        totalPrice: number;
        status: OrderStatus;
        orderType: OrderType;
        tableId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICart {
        dish: IDish;
        quantity: number;
    }

    interface IDashboardData {
        countOrder: number;
        countUser: number;
        countBook: number;
    }
}
