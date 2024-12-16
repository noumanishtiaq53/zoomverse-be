export const errorHandler = (error, request, response, next) => {
  return response?.status(error?.statusCode).json({
    message: error?.message,
    data: error?.data,
  });
};
