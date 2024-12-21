export interface StatisticsType {
  admins_count?:      number;
  restaurant_owners?: number;
  restaurant_staff?:  number;
  total_restaurants?: number;
  orders_by_type?:    OrdersByType;
  total_categories?:  number;
  total_products?:    number;
  top_restaurants?:   TopRestaurant[];
}

export interface OrdersByType {
  delivery?:     number;
  inRestaurant?: number;
  takeaway?:     number;
}

export interface TopRestaurant {
  restaurant_id?:   string;
  restaurant_name?: string;
  total_orders?:    number;
  orders_by_type?:  OrdersByType;
}