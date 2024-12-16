const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    res.send(error?.code ?? 500)?.json({
      message: error?.message,
    });
  }
};

const asyncHandlerPromise = (requestHandler) => {
  return (req, res, next) => {
    Promise?.resolve(requestHandler(req, res, next))?.catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler, asyncHandlerPromise };
