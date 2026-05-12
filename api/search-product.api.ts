import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';

export interface SearchProductResponse {
    responseCode: number;
    products?: Product[];
    message?: string;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category: Category;
}

export interface Category {
    usertype: {
        usertype: string;
    };
    category: string;
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

function validateSearchProductResponse(body: SearchProductResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'products'], 'SearchProductResponse');
    if (body.products) {
        body.products.forEach(product => validateProduct(product as unknown as Record<string, unknown>));
    }
}

function validateErrorResponse(body: SearchProductResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'SearchProductErrorResponse');
}

export async function searchProduct(request: APIRequestContext, searchTerm: string): Promise<SearchProductResponse> {
    const response = await request.post(`${apiUrl}/searchProduct`, {
        form: { search_product: searchTerm },
    });
    const body = await response.json();
    validateSearchProductResponse(body);
    return body;
}

export async function searchProductWithoutParam(request: APIRequestContext): Promise<SearchProductResponse> {
    const response = await request.post(`${apiUrl}/searchProduct`);
    const body = await response.json();
    validateErrorResponse(body);
    return body;
}

export async function searchProductWithFormData(request: APIRequestContext, formData: Record<string, string>): Promise<SearchProductResponse> {
    const response = await request.post(`${apiUrl}/searchProduct`, {
        form: formData,
    });
    return response.json();
}

export async function getSearchProduct(request: APIRequestContext): Promise<SearchProductResponse> {
    const response = await request.get(`${apiUrl}/searchProduct`);
    return response.json();
}

export async function deleteSearchProduct(request: APIRequestContext): Promise<SearchProductResponse> {
    const response = await request.delete(`${apiUrl}/searchProduct`);
    return response.json();
}

export async function putSearchProduct(request: APIRequestContext): Promise<SearchProductResponse> {
    const response = await request.put(`${apiUrl}/searchProduct`);
    return response.json();
}
