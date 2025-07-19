export interface ApiResponse<T = unknown> {
	message: string; // Human-readable message
	data?: T; // Response data (generic)
	errors?: string[]; // List of error messages (if any)
	meta?: Record<string, any>; // Optional metadata (pagination, timestamps, etc.)
	statusCode?: number; // Optional HTTP status code reference
}
