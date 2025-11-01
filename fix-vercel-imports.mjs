#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

/**
 * Resolve @shared/ imports para caminhos relativos com .js
 */
function resolveAliases(content, filePath) {
  const fileDir = path.dirname(filePath);
  
  // Resolve @shared/const -> ../../shared/const.js
  content = content.replace(
    /from\s+['"]@shared\/([^'"]+)['"]/g,
    (match, module) => {
      // Se já tem .js, não adiciona novamente
      const moduleName = module.endsWith('.js') ? module : `${module}.js`;
      
      // Calcular caminho relativo de fileDir para dist/shared/moduleName
      const targetPath = path.join(distDir, 'shared', moduleName);
      let relativePath = path.relative(fileDir, targetPath);
      
      // Garantir que começa com ../ ou ./
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }
      
      // Converter barras para frente (Unix style)
      relativePath = relativePath.replace(/\\/g, '/');
      
      return `from '${relativePath}'`;
    }
  );

  return content;
}

/**
 * Processar todos os arquivos .js em dist/
 */
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Resolver aliases
      content = resolveAliases(content, filePath);

      // Escrever se mudou
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✓ Resolvidos aliases em ${path.relative(__dirname, filePath)}`);
      }
    }
  }
}

console.log('🔧 Resolvendo aliases para Vercel...');
if (fs.existsSync(distDir)) {
  processDirectory(distDir);
  console.log('✅ Aliases resolvidos com sucesso!');
} else {
  console.log('⚠️ Diretório dist/ não encontrado');
  process.exit(1);
}

