import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Função para resolver aliases em um arquivo
function resolveAliases(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Resolver @shared/ → ../../shared/
  content = content.replace(/from\s+['"]@shared\/([^'"]+)['"]/g, 'from "../../shared/$1.js"');
  content = content.replace(/from\s+['"]@shared['"]/g, 'from "../../shared/index.js"');
  
  // Resolver server/ → ./
  content = content.replace(/from\s+['"]server\/([^'"]+)['"]/g, 'from "./$1.js"');
  
  // Resolver ../ imports sem .js
  content = content.replace(/from\s+['"](\.\.\/.+?)(?<!\.js)['"]/g, 'from "$1.js"');
  
  // Resolver ./ imports sem .js
  content = content.replace(/from\s+['"](\.\/.+?)(?<!\.js)['"]/g, 'from "$1.js"');
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Processar todos os arquivos .js em dist/src
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      console.log(`Resolvendo aliases em ${filePath}`);
      resolveAliases(filePath);
    }
  }
}

const distDir = path.join(__dirname, 'dist', 'src');
if (fs.existsSync(distDir)) {
  console.log('Resolvendo aliases em arquivos compilados...');
  processDirectory(distDir);
  console.log('✅ Aliases resolvidos com sucesso!');
  
  // Copiar shared/ para dist/shared/
  const sharedSrc = path.join(__dirname, 'shared');
  const sharedDest = path.join(__dirname, 'dist', 'shared');
  if (fs.existsSync(sharedSrc)) {
    if (fs.existsSync(sharedDest)) {
      fs.rmSync(sharedDest, { recursive: true });
    }
    fs.cpSync(sharedSrc, sharedDest, { recursive: true });
    console.log('✅ shared/ copiado para dist/shared/');
  }
  
  // Copiar drizzle/ para dist/drizzle/
  const drizzleSrc = path.join(__dirname, 'drizzle');
  const drizzleDest = path.join(__dirname, 'dist', 'drizzle');
  if (fs.existsSync(drizzleSrc)) {
    if (fs.existsSync(drizzleDest)) {
      fs.rmSync(drizzleDest, { recursive: true });
    }
    fs.cpSync(drizzleSrc, drizzleDest, { recursive: true });
    console.log('✅ drizzle/ copiado para dist/drizzle/');
  }
  
  // Copiar vite.config.ts para dist/vite.config.ts
  const viteConfigSrc = path.join(__dirname, 'vite.config.ts');
  const viteConfigDest = path.join(__dirname, 'dist', 'vite.config.ts');
  if (fs.existsSync(viteConfigSrc)) {
    fs.copyFileSync(viteConfigSrc, viteConfigDest);
    console.log('✅ vite.config.ts copiado para dist/');
  }
  
  // Copiar dist/public para dist/src/_core/public
  const publicSrc = path.join(__dirname, 'dist', 'public');
  const publicDest = path.join(__dirname, 'dist', 'src', '_core', 'public');
  if (fs.existsSync(publicSrc)) {
    if (fs.existsSync(publicDest)) {
      fs.rmSync(publicDest, { recursive: true });
    }
    fs.cpSync(publicSrc, publicDest, { recursive: true });
    console.log('✅ dist/public copiado para dist/src/_core/public/');
  }
} else {
  console.error('❌ Diretório dist/src não encontrado');
  process.exit(1);
}

