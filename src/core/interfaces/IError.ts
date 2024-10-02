export interface CustomError extends Error {
  statusCode: number;
  status: boolean;
}
