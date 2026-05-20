const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
    });

    if (!response.ok) {
        throw new Error(`Erro na requisiçao HTTP: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        return response.text() as unknown as T;
    }

    return response.json();
}