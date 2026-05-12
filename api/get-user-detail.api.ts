import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../constants/url';

export interface UserDetail {
    id: number;
    name: string;
    email: string;
    title: string;
    birth_day: string;
    birth_month: string;
    birth_year: string;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
}

export interface GetUserDetailResponse {
    responseCode: number;
    user?: UserDetail;
    message?: string;
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

export async function getUserDetailByEmail(request: APIRequestContext, email: string): Promise<GetUserDetailResponse> {
    const response = await request.get(`${apiUrl}/getUserDetailByEmail`, {
        params: { email },
    });
    const body = await response.json();
    return body;
}

export async function getUserDetailRaw(request: APIRequestContext): Promise<GetUserDetailResponse> {
    const response = await request.get(`${apiUrl}/getUserDetailByEmail`);
    const body = await response.json();
    return body;
}
