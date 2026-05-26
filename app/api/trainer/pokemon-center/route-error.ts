type ServiceError = {
  statusCode?: number;
  message?: string;
};

export const resolveTrainerPokemonCenterRouteError = (
  error: unknown,
  fallbackMessage: string,
): { status: number; message: string } => {
  if (error instanceof Error) {
    return { status: 500, message: error.message || fallbackMessage };
  }

  if (typeof error === 'object' && error !== null) {
    const serviceError = error as ServiceError;
    return {
      status: typeof serviceError.statusCode === 'number' ? serviceError.statusCode : 500,
      message: typeof serviceError.message === 'string' && serviceError.message
        ? serviceError.message
        : fallbackMessage,
    };
  }

  return { status: 500, message: fallbackMessage };
};
