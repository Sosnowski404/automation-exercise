import { APIRequestContext, APIResponse } from '@playwright/test';
import { apiUrl } from '../constants/url';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface RawRequestOptions {
    method: HttpMethod;
    endpoint: string;
    queryParams?: Record<string, string>;
    form?: Record<string, string>;
    pathSuffix?: string;
}

export async function rawRequest(request: APIRequestContext, options: RawRequestOptions): Promise<APIResponse> {
    const { method, endpoint, queryParams, form, pathSuffix } = options;

    let url = `${apiUrl}/${endpoint}`;
    if (pathSuffix) {
        url += `/${pathSuffix}`;
    }

    if (queryParams) {
        const params = new URLSearchParams(queryParams).toString();
        url += `?${params}`;
    }

    return request[method](url, form ? { form } : undefined);
}
