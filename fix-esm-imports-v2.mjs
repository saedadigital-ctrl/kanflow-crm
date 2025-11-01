#!/usr/bin/env node
/**
 * Fix ESM Imports Script V2
 * 
 * Corrige todos os imports em arquivos .js compilados para adicionar extensões .js
 * quando necessário. Processa recursivamente todo o diretório dist/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let filesProcessed = 0;
let importsFixed = 0;

/**
 * Corrige imports em um arquivo
 */
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Padrão 1: import X from './path' (sem extensão)
    content = content.replace(/from\s+['"](\.[^'"]*?)(?<!\.js)(?<!\.json)(?<!\.mjs)['"];/g, (match, importPath) => {
      // Não adicionar .js se já tem extensão
      if (importPath.includes('.')) {
        return match;
      }
      
      importsFixed++;
      return `from '${importPath}.js';`;
    });

    // Padrão 2: import('./path') (dinâmico, sem extensão)
    content = content.replace(/import\s*\(\s*['"](\.[^'"]*?)(?<!\.js)(?<!\.json)(?<!\.mjs)['"]\s*\)/g, (match, importPath) => {
      if (importPath.includes('.')) {
        return match;
      }
      
      importsFixed++;
      return `import('${importPath}.js')`;
    });

    // Padrão 3: require('./path') (CommonJS, sem extensão)
    content = content.replace(/require\s*\(\s*['"](\.[^'"]*?)(?<!\.js)(?<!\.json)(?<!\.mjs)['"]\s*\)/g, (match, importPath) => {
      if (importPath.includes('.')) {
        return match;
      }
      
      importsFixed++;
      return `require('${importPath}.js')`;
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
  console.log('🔧 Iniciando correção de imports ESM (V2)...\n');

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

