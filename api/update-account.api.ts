import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';
import { CreateAccountParams } from '../utils/helpers';

export interface UpdateAccountResponse {
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

function validateUpdateAccountResponse(body: UpdateAccountResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'UpdateAccountResponse');
}

export async function updateAccount(request: APIRequestContext, params: CreateAccountParams): Promise<UpdateAccountResponse> {
    const form: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            form[key] = value;
        }
    }
    const response = await request.put(`${apiUrl}/updateAccount`, { form });
    const body = await response.json();
    validateUpdateAccountResponse(body);
    return body;
}

export async function updateAccountRaw(request: APIRequestContext, form: Record<string, string>): Promise<UpdateAccountResponse> {
    const response = await request.put(`${apiUrl}/updateAccount`, { form });
    const body = await response.json();
    validateUpdateAccountResponse(body);
    return body;
}
