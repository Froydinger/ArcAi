export interface StorageOptions {
  key: string;
  version?: number;
}

export interface StorageError extends Error {
  type: 'PARSE_ERROR' | 'WRITE_ERROR' | 'READ_ERROR' | 'AUTH_ERROR';
}
