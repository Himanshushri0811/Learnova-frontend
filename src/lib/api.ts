
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiErrorResponse {
    message?: string;
}

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('learnova_token');

    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');

    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(
        `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
        {
            ...options,
            headers,
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const errorData = data as ApiErrorResponse | null;
        throw new Error(
            errorData?.message || `Request failed (${response.status})`
        );
    }

    return data as T;
}
