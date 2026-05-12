import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';

export interface DeleteAccountResponse {
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

function validateDeleteAccountResponse(body: DeleteAccountResponse): void {
    validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'DeleteAccountResponse');
}

export async function deleteAccountApi(request: APIRequestContext, email: string, password: string): Promise<DeleteAccountResponse> {
    const response = await request.delete(`${apiUrl}/deleteAccount`, {
        form: { email, password },
    });
    const body = await response.json();
    validateDeleteAccountResponse(body);
    return body;
}

export async function deleteAccountWithFormData(request: APIRequestContext, formData: Record<string, string>): Promise<DeleteAccountResponse> {
    const response = await request.delete(`${apiUrl}/deleteAccount`, {
        form: formData,
    });
    const body = await response.json();
    validateDeleteAccountResponse(body);
    return body;
}

export async function deleteAccountWithoutParams(request: APIRequestContext): Promise<DeleteAccountResponse> {
    const response = await request.delete(`${apiUrl}/deleteAccount`);
    const body = await response.json();
    validateDeleteAccountResponse(body);
    return body;
}
