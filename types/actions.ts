export type FieldErrors = Record<string, string[]>;

export type ActionResult<TData = unknown> = {
  success: boolean;
  error?: string;
  errorType?: "validation" | "unauthorized" | "forbidden" | "not_found" | "unknown";
  fieldErrors?: FieldErrors;
  data?: TData;
};
