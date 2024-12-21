export type Category = {
    id?:           string;
    name?:         string;
    active?:       boolean;
    restaurantId?: string;
    sort?:         number;
    createdAt?:    Date;
    updatedAt?:    Date;
    deletedAt?:    null;
}

export type CategoryResponse = Category[]