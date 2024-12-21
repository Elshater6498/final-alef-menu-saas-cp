import { Currency, Restaurant } from './restaurant'
export interface UserInfoResponse {
    items?: UserInfo[]
    total?: number
    page?: number
    size?: number
    pages?: number
}

export interface UserInfo {
  id?:                string;
  email?:             string;
  name?:              string;
  phone?:             string;
  country?:           string;
  city?:              string;
  notes?:             string;
  responsiblePerson?: string;
  planPrice?:         number;
  currency?:          Currency;
  active?:            boolean;
  verified?:          boolean;
  paid?:              boolean;
  dueDate?:           Date;
  role?:              number;
  duration?:          number;
  domain?:            string;
  permissions?:       string[];
  created_at?:        Date;
  updated_at?:        Date;
  deletedAt?:         null;
  restaurantId?:      string;
  restaurant?:        Restaurant;
}

export interface PermissionsList {
    base?: string[]
    categories?: string[]
    orders?: string[]
    permissions?: string[]
    plans?: string[]
    products?: string[]
    rates?: string[]
    restaurants?: string[]
    users?: string[]
}
