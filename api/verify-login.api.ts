import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';

export interface VerifyLoginResponse {
    responseCode: number;
    message: string;
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

function validateVerifyLoginResponse(body: VerifyLoginResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'VerifyLoginResponse');
}

export async function verifyLogin(request: APIRequestContext, email: string, password: string): Promise<VerifyLoginResponse> {
    const response = await request.post(`${apiUrl}/verifyLogin`, {
        form: { email, password },
    });
    const body = await response.json();
    validateVerifyLoginResponse(body);
    return body;
}

export async function verifyLoginWithFormData(request: APIRequestContext, formData: Record<string, string>): Promise<VerifyLoginResponse> {
    const response = await request.post(`${apiUrl}/verifyLogin`, {
        form: formData,
    });
    const body = await response.json();
    validateVerifyLoginResponse(body);
    return body;
}

export async function verifyLoginWithoutParams(request: APIRequestContext): Promise<VerifyLoginResponse> {
    const response = await request.post(`${apiUrl}/verifyLogin`);
    const body = await response.json();
    validateVerifyLoginResponse(body);
    return body;
}

export async function deleteVerifyLogin(request: APIRequestContext): Promise<VerifyLoginResponse> {
    const response = await request.delete(`${apiUrl}/verifyLogin`);
    const body = await response.json();
    validateVerifyLoginResponse(body);
    return body;
}

export async function getVerifyLogin(request: APIRequestContext): Promise<VerifyLoginResponse> {
    const response = await request.get(`${apiUrl}/verifyLogin`);
    const body = await response.json();
    validateVerifyLoginResponse(body);
    return body;
}

export async function putVerifyLogin(request: APIRequestContext): Promise<VerifyLoginResponse> {
    const response = await request.put(`${apiUrl}/verifyLogin`);
    const body = await response.json();
    validateVerifyLoginResponse(body);
    return body;
}
