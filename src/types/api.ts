export type ApiError = {
  message: string;
  details?: string[];
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: ApiError;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type AuthTokenPayload = {
  userId: string;
  role: "admin" | "customer";
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};
