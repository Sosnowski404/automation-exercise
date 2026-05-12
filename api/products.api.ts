import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';

export interface Category {
    usertype: {
        usertype: string;
    };
    category: string;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category: Category;
}

export interface ProductsListResponse {
    responseCode: number;
    products: Product[];
}

function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
    const actualKeys = Object.keys(obj).sort();
    const expected = [...expectedKeys].sort();
    const extraKeys = actualKeys.filter(key => !expected.includes(key));
    if (extraKeys.length > 0) {
        throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
    }
    const missingKeys = expected.filter(key => !actualKeys.includes(key));
    if (missingKeys.length > 0) {
        throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
    }
}

function validateProduct(product: Record<string, unknown>): void {
    validateKeys(product, ['id', 'name', 'price', 'brand', 'category'], 'Product');
    const category = product.category as Record<string, unknown>;
    validateKeys(category, ['usertype', 'category'], 'Category');
    validateKeys(category.usertype as Record<string, unknown>, ['usertype'], 'Usertype');
}

function validateProductsListResponse(body: ProductsListResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'products'], 'ProductsListResponse');
    if (body.products) {
        body.products.forEach(product => validateProduct(product as unknown as Record<string, unknown>));
    }
}

export async function getProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
    const response = await request.get(`${apiUrl}/productsList`);
    const body = await response.json();
    validateProductsListResponse(body);
    return body;
}

export async function postToProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
    const response = await request.post(`${apiUrl}/productsList`);
    return response.json();
}

export async function deleteToProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
    const response = await request.delete(`${apiUrl}/productsList`);
    return response.json();
}

export async function putToProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
    const response = await request.put(`${apiUrl}/productsList`);
    return response.json();
}
