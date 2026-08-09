// TODO (учасник №5): request validation
import createHttpError from 'http-errors';

const allowedFields = ['name', 'avatar'];

export const validateUpdateUser = data => {
  if (!data || typeof data !== 'object') {
    throw createHttpError(400, 'Request body must be an object');
  }

  const fields = Object.keys(data);

  const hasInvalidField = fields.some(
    field => !allowedFields.includes(field)
  );

  if (hasInvalidField) {
    throw createHttpError(400, 'Invalid field in request body');
  }

  if (data.name !== undefined && typeof data.name !== 'string') {
    throw createHttpError(400, 'Name must be a string');
  }

  if (data.avatar !== undefined && typeof data.avatar !== 'string') {
    throw createHttpError(400, 'Avatar must be a string');
  }
};
