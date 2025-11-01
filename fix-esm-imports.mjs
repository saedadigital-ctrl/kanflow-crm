#!/usr/bin/env node
/**
 * Fix ESM Imports Script
 * 
 * Corrige todos os imports em arquivos .js compilados para adicionar extensões .js
 * quando necessário. Processa recursivamente todo o diretório dist/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Padrões de regex para encontrar imports que precisam de .js
const IMPORT_PATTERNS = [
  // import X from './path' → import X from './path.js'
  /from\s+['"](\.[^'"]+)(?<!\.js)(?<!\.json)(?<!\.mjs)['"];?/g,
  // import('./path') → import('./path.js')
  /import\s*\(\s*['"](\.[^'"]+)(?<!\.js)(?<!\.json)(?<!\.mjs)['"]\s*\)/g,
  // require('./path') → require('./path.js')
  /require\s*\(\s*['"](\.[^'"]+)(?<!\.js)(?<!\.json)(?<!\.mjs)['"]\s*\)/g,
];

let filesProcessed = 0;
let importsFixed = 0;

/**
 * Corrige imports em um arquivo
 */
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Aplicar cada padrão de regex
    IMPORT_PATTERNS.forEach(pattern => {
      content = content.replace(pattern, (match, importPath) => {
        // Não adicionar .js se já tem extensão
        if (importPath.includes('.')) {
          return match;
        }
        
        // Adicionar .js e contar
        importsFixed++;
        return match.replace(importPath, `${importPath}.js`);
      });
    });

    // Se houve mudanças, salvar arquivo
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Corrigido: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Processa recursivamente todos os arquivos .js em um diretório
 */
function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Ignorar node_modules e outros diretórios
        if (!file.startsWith('.') && file !== 'node_modules') {
          processDirectory(filePath);
        }
      } else if (file.endsWith('.js')) {
        filesProcessed++;
        fixImportsInFile(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao processar diretório ${dir}:`, error.message);
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🔧 Iniciando correção de imports ESM...\n');

  const distDir = path.join(__dirname, 'dist');

  if (!fs.existsSync(distDir)) {
    console.error('❌ Diretório dist/ não encontrado');
    process.exit(1);
  }

  console.log(`📂 Processando: ${distDir}\n`);
  processDirectory(distDir);

  console.log(`\n✅ Processamento concluído!`);
  console.log(`📊 Estatísticas:`);
  console.log(`   - Arquivos processados: ${filesProcessed}`);
  console.log(`   - Imports corrigidos: ${importsFixed}`);

  if (importsFixed > 0) {
    console.log(`\n✨ Todos os imports ESM foram corrigidos com sucesso!`);
  } else {
    console.log(`\nℹ️  Nenhum import precisava de correção.`);
  }
}

main();

