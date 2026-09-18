export type ApiErrorKind =
  | 'network'
  | 'validation'
  | 'auth'
  | 'forbidden'
  | 'conflict'
  | 'not-found'
  | 'server'
  | 'unknown';

export interface ApiErrorDetails {
  message: string;
  field?: string;
}

interface ApiErrorOptions {
  message?: string;
  status?: number;
  code?: string;
  kind?: ApiErrorKind;
  details?: ApiErrorDetails[];
  cause?: unknown;
}

const KIND_BY_STATUS: Record<number, ApiErrorKind> = {
  400: 'validation',
  401: 'auth',
  403: 'forbidden',
  404: 'not-found',
  409: 'conflict',
  500: 'server',
};

function messageFromPayload(payload: unknown): string | undefined {
  if (!payload) return undefined;
  if (typeof payload === 'string') return payload;

  const obj = payload as Record<string, unknown>;

  if (typeof obj.message === 'string') return obj.message;

  if (typeof obj.error === 'string') return obj.error;

  if (Array.isArray(obj.message)) {
    return obj.message
      .map((m) =>
        typeof m === 'string' ? m : (m as Record<string, unknown>)?.message,
      )
      .filter(Boolean)
      .join('\n');
  }

  return undefined;
}

function detailsFromPayload(payload: unknown): ApiErrorDetails[] | undefined {
  if (!payload || typeof payload !== 'object') return undefined;

  const obj = payload as Record<string, unknown>;

  if (!Array.isArray(obj.message)) return undefined;

  const details: ApiErrorDetails[] = obj.message
    .map((m) => {
      if (typeof m === 'string') return { message: m } as ApiErrorDetails;
      const item = m as Record<string, unknown>;
      return {
        message:
          typeof item.message === 'string'
            ? item.message
            : typeof item === 'string'
              ? item
              : 'Dato inválido',
        field:
          typeof item.field === 'string'
            ? item.field
            : typeof item.property === 'string'
              ? item.property
              : undefined,
      } as ApiErrorDetails;
    })
    .filter((d) => !!d.message);

  return details.length > 0 ? details : undefined;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly kind: ApiErrorKind;
  readonly details?: ApiErrorDetails[];
  readonly cause?: unknown;

  constructor({
    message,
    status,
    code,
    kind,
    details,
    cause,
  }: ApiErrorOptions = {}) {
    const resolvedKind =
      kind ?? (status ? KIND_BY_STATUS[status] : undefined) ?? 'unknown';
    const payload =
      cause && typeof cause === 'object'
        ? (cause as { response?: { data?: unknown } }).response?.data
        : undefined;

    super(
      message ?? messageFromPayload(payload) ?? 'Ocurrió un error inesperado',
    );
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.kind = resolvedKind;
    this.details = details ?? detailsFromPayload(payload);
    this.cause = cause;
  }
}

export function isApiError(error: unknown): error is ApiError {
  if (error instanceof ApiError) return true;
  if (error instanceof Error && (error as Error & { status?: number }).status !== undefined) {
    return true;
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado';
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof Error) {
    const status = (error as Error & { status?: number }).status;
    const kind = status ? KIND_BY_STATUS[status] : undefined;

    if (kind === 'auth' || kind === 'network') {
      return new ApiError({
        status,
        kind,
        message: error.message,
        cause: error,
      });
    }

    if (kind === 'validation') {
      const responseData =
        (error as Error & { response?: { data?: unknown } }).response
          ?.data;
      const details =
        responseData && typeof responseData === 'object'
          ? detailsFromPayload(responseData)
          : undefined;

      return new ApiError({
        status,
        kind,
        message: error.message,
        details,
        cause: error,
      });
    }

    return new ApiError({
      status,
      kind,
      message: error.message,
      cause: error,
    });
  }

  return new ApiError({ message: 'Ocurrió un error inesperado', cause: error });
}
