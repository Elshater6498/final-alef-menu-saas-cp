export type Product = {
    id?: string;
    name?: string;
    details?: string;
    image?: string;
    price?: number;
    calories?: number;
    active?: boolean;
    sort?: number;
    categoryId?: string;
    restaurantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: null;
}

export type ProductRespones = Product[]