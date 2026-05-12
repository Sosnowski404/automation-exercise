import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';
import { CreateAccountParams } from '../utils/helpers';

export interface CreateAccountResponse {
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

function validateCreateAccountResponse(body: CreateAccountResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'CreateAccountResponse');
}

export async function createAccount(request: APIRequestContext, params: CreateAccountParams): Promise<CreateAccountResponse> {
    const form: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            form[key] = value;
        }
    }
    const response = await request.post(`${apiUrl}/createAccount`, { form });
    const body = await response.json();
    validateCreateAccountResponse(body);
    return body;
}

export async function createAccountRaw(request: APIRequestContext, form: Record<string, string>): Promise<CreateAccountResponse> {
    const response = await request.post(`${apiUrl}/createAccount`, { form });
    const body = await response.json();
    validateCreateAccountResponse(body);
    return body;
}

export async function deleteAccount(request: APIRequestContext, email: string, password: string): Promise<CreateAccountResponse> {
    const response = await request.delete(`${apiUrl}/deleteAccount`, {
        form: { email, password },
    });
    const body = await response.json();
    validateCreateAccountResponse(body);
    return body;
}

export async function getCreateAccount(request: APIRequestContext): Promise<CreateAccountResponse> {
    const response = await request.get(`${apiUrl}/createAccount`);
    const body = await response.json();
    validateCreateAccountResponse(body);
    return body;
}

export async function putCreateAccount(request: APIRequestContext): Promise<CreateAccountResponse> {
    const response = await request.put(`${apiUrl}/createAccount`);
    const body = await response.json();
    validateCreateAccountResponse(body);
    return body;
}
