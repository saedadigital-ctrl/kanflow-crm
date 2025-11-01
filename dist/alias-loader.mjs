/**
 * ESM Loader para resolver aliases @shared
 */
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@shared/')) {
    const moduleName = specifier.replace('@shared/', '');
    const resolved = resolvePath(__dirname, 'shared', `${moduleName}.js`);
    return nextResolve(resolved, context);
  }
  
  if (specifier === '@shared') {
    const resolved = resolvePath(__dirname, 'shared', 'index.js');
    return nextResolve(resolved, context);
  }
  
  return nextResolve(specifier, context);
}
