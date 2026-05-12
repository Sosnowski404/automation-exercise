import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';

export interface Brand {
    id: number;
    brand: string;
}

export interface BrandsListResponse {
    responseCode: number;
    brands: Brand[];
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

function validateBrandsListResponse(body: BrandsListResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'brands'], 'BrandsListResponse');
    if (body.brands) {
        body.brands.forEach(brand =>
            validateKeys(brand as unknown as Record<string, unknown>, ['id', 'brand'], 'Brand')
        );
    }
}

export async function getBrandsList(request: APIRequestContext): Promise<BrandsListResponse> {
    const response = await request.get(`${apiUrl}/brandsList`);
    const body = await response.json();
    validateBrandsListResponse(body);
    return body;
}

export async function postToBrandsList(request: APIRequestContext): Promise<BrandsListResponse> {
    const response = await request.post(`${apiUrl}/brandsList`);
    return response.json();
}

export async function deleteToBrandsList(request: APIRequestContext): Promise<BrandsListResponse> {
    const response = await request.delete(`${apiUrl}/brandsList`);
    return response.json();
}

export async function putToBrandsList(request: APIRequestContext): Promise<BrandsListResponse> {
    const response = await request.put(`${apiUrl}/brandsList`);
    return response.json();
}
