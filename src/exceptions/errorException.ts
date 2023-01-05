class AppError extends Error {
  statusCode: number | undefined;
  message: string;
  constructor(message?: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    console.log('>>>>>>', message, statusCode);
  }
}
export { AppError };
