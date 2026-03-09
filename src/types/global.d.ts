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
    // BE User entity: name (KHÔNG phải fullName), email, password, age, gender, address (KHÔNG có phone)
    interface IRegisterRequest {
        name: string;
        email: string;
        password: string;
        age?: number;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        address?: string;
    }
    // Khớp với BE ResCreateUserDTO: id, name, email, gender, address, age, createdAt, role
    interface IRegister {
        id: number;
        name: string;
        email: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        address?: string;
        age?: number;
        createdAt?: string;
        role?: IRole;
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
    // BE User entity: id (long), name, email, age, gender, address, role { id, name }
    interface IUserTable {
        id: number;
        name: string;
        email: string;
        age: number;
        gender: 'MALE' | 'FEMALE' | 'OTHER';
        address: string;
        role: {
            id: number;
            name: string;
        };
        createdAt: string;
        updatedAt: string;
    }
    interface IDataImport {
        id?: number;
        fullName?: string;
        name?: string;
        email: string;
        phone?: string;
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
        description?: string;
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

    // BE Dish entity: category là nested object { id }, KHÔNG phải flat categoryId
    interface ICreateDishRequest {
        id?: number;        // cần thiết cho update
        name: string;
        price: number;
        description: string;
        image: string;
        active?: boolean;
        category: { id: number }; // WAS: categoryId: number
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

    // Khớp với BE ResOrderDTO: { id, totalPrice, status, orderType, note, createdAt, tableId }
    // items & updatedAt KHÔNG có trong ResOrderDTO — phải fetch /orders/{id} riêng nếu cần detail
    interface IOrder {
        id: number;
        totalPrice: number;
        status: OrderStatus;
        orderType: OrderType;
        tableId: number | null;
        note?: string;
        createdAt: string; // BE trả về Instant → ISO string
    }

    interface ICreateOrderItem {
        dishId: number;
        quantity: number;
        note?: string;
    }

    interface ICreateOrderRequest {
        orderType: OrderType;
        tableId?: number;
        note?: string;
        items: ICreateOrderItem[];
    }

    // Khớp với BE ResOrderDTO (dùng cho bảng danh sách đơn hàng admin)
    interface IOrderTable {
        id: number;
        totalPrice: number;
        status: OrderStatus;
        orderType: OrderType;
        tableId: number | null;
        note?: string;
        createdAt: string;
    }

    interface ICart {
        dish: IDish;
        quantity: number;
    }

    interface IRestaurantTable {
        id: number;
        name: string;
        qrToken?: string;
        occupied: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
        createdAt?: string;
        createdBy?: string;
    }

    // Khớp với BE ResUpdateUserDTO: { id, name, gender, address, age, updatedAt, role }
    interface IResUpdateUser {
        id: number;
        name: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
        address?: string;
        age?: number;
        updatedAt: string;
        role?: IRole;
    }

    interface IDashboardData {
        countOrder: number;
        countUser: number;
        countBook: number;
    }
}
