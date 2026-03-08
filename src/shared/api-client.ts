export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null = null,
    public readonly details: unknown = null,
  ) {
    super(message);
  }
}

type ErrorPayload = {
  error?:
    | string
    | {
        code?: string;
        message?: string;
        details?: unknown;
      };
};

async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  let payload: ErrorPayload | null = null;

  try {
    payload = (await response.json()) as ErrorPayload;
  } catch {
    return new ApiClientError(`Request failed with status ${response.status}`, response.status);
  }

  if (typeof payload?.error === "string") {
    return new ApiClientError(payload.error, response.status);
  }

  const code = payload?.error?.code ?? null;
  const message = payload?.error?.message ?? `Request failed with status ${response.status}`;
  const details = payload?.error?.details ?? null;

  return new ApiClientError(message, response.status, code, details);
}

export async function apiRequest<TResponse>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}
