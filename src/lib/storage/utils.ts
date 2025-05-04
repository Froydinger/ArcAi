import { StorageError } from './types';

export const safelyParseJSON = <T>(json: string): T | null => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

export const createStorageError = (
  message: string,
  type: StorageError['type']
): StorageError => {
  const error = new Error(message) as StorageError;
  error.type = type;
  return error;
};
