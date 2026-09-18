const invalidPath = (message) => new Error(message);

export function normalizeDocumentPath(value) {
  if (typeof value !== 'string' || !value.trim()) throw invalidPath('document path obbligatorio');
  const path = value.trim().replace(/^\/+/, '');
  if (path.includes('\\') || path.split('/').includes('..') || path.startsWith('.') || !path.endsWith('.md')) {
    throw invalidPath('document path non valido');
  }
  return path;
}

export function isAllowedDocumentPath(value, allowedPaths) {
  try {
    return allowedPaths.has(normalizeDocumentPath(value));
  } catch {
    return false;
  }
}
