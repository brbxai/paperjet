export const HOME_ROUTE = "/";

export const SIGNUP_ROUTE = "/signup";
export const LOGIN_ROUTE = "/login";
export const PROFILE_ROUTE = "/profile";
export const FORGOT_PASSWORD_ROUTE = "/reset-password";

export const INVOICES_ROUTE = "/invoices";
export const NEW_INVOICE_ROUTE = "/invoices/new";
export const invoiceRoute = (id: string) => `/invoices/${id}`;

export const CUSTOMERS_ROUTE = "/customers";
export const NEW_CUSTOMER_ROUTE = "/customers/new";
export const customerRoute = (id: string) => `/customers/${id}`;

export const CUSTOM_TABLES_ROUTE = "/custom-tables";
export const NEW_CUSTOM_TABLE_ROUTE = "/custom-tables/new";
export const customTableRoute = (id: string) => `/custom-tables/${id}`;

export const ITEMS_ROUTE = "/items";
export const NEW_ITEM_ROUTE = "/items/new";
export const itemRoute = (id: string) => `/items/${id}`;
