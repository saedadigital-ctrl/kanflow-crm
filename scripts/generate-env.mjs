#!/usr/bin/env node

import { randomBytes } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const projectRoot = join(__dirname, '..');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateSecretKey(length = 32) {
  return randomBytes(length).toString('base64');
}

function generateJWT() {
  return randomBytes(32).toString('hex');
}

async function main() {
  log('\n🚀 KanFlow CRM - Environment Variables Generator\n', 'bright');

  // Ler .env.example se existir
  const exampleEnvPath = join(projectRoot, '.env.example');
  let existingVars = {};

  try {
    const exampleContent = readFileSync(exampleEnvPath, 'utf-8');
    exampleContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && !key.startsWith('#')) {
        existingVars[key.trim()] = value?.trim() || '';
      }
    });
  } catch (error) {
    log('⚠️  .env.example não encontrado, usando valores padrão\n', 'yellow');
  }

  // Gerar variáveis
  const envVars = {
    // Database
    DATABASE_URL: existingVars.DATABASE_URL || 'mysql://user:password@localhost:3306/kanflow',
    
    // JWT
    JWT_SECRET: generateJWT(),
    
    // Manus OAuth
    VITE_APP_ID: existingVars.VITE_APP_ID || 'seu_app_id_aqui',
    OAUTH_SERVER_URL: 'https://api.manus.im',
    VITE_OAUTH_PORTAL_URL: 'https://portal.manus.im',
    
    // App Info
    VITE_APP_TITLE: 'KanFlow CRM',
    VITE_APP_LOGO: 'https://kanflow.io/logo.png',
    
    // Forge API
    BUILT_IN_FORGE_API_URL: 'https://api.manus.im',
    BUILT_IN_FORGE_API_KEY: existingVars.BUILT_IN_FORGE_API_KEY || 'sua_chave_api_aqui',
    VITE_FRONTEND_FORGE_API_URL: 'https://api.manus.im',
    VITE_FRONTEND_FORGE_API_KEY: existingVars.VITE_FRONTEND_FORGE_API_KEY || 'sua_chave_api_aqui',
    
    // Owner Info
    OWNER_NAME: existingVars.OWNER_NAME || 'Admin',
    OWNER_OPEN_ID: existingVars.OWNER_OPEN_ID || '',
  };

  // Exibir variáveis geradas
  log('\n📋 Variáveis de Ambiente Geradas:\n', 'cyan');
  
  Object.entries(envVars).forEach(([key, value]) => {
    const isSecret = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN'].some(word => key.includes(word));
    const displayValue = isSecret ? '***' : value;
    log(`  ${key}=${displayValue}`, 'blue');
  });

  // Criar arquivo .env.local
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envLocalPath = join(projectRoot, '.env.local');
  writeFileSync(envLocalPath, envContent);
  log(`\n✅ Arquivo .env.local criado em: ${envLocalPath}\n`, 'green');

  // Criar arquivo para Vercel
  const vercelEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const vercelEnvPath = join(projectRoot, '.env.vercel');
  writeFileSync(vercelEnvPath, vercelEnvContent);
  log(`✅ Arquivo .env.vercel criado em: ${vercelEnvPath}\n`, 'green');

  // Criar JSON para importar no Vercel
  const vercelJson = {
    version: 2,
    env: Object.entries(envVars).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {}),
  };

  const vercelJsonPath = join(projectRoot, '.vercel-env.json');
  writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
  log(`✅ Arquivo .vercel-env.json criado em: ${vercelJsonPath}\n`, 'green');

  // Instruções
  log('📝 Próximos Passos:\n', 'bright');
  log('1️⃣  Atualize as variáveis com seus valores reais:', 'yellow');
  log('   - DATABASE_URL: URL do seu banco MySQL', 'yellow');
  log('   - VITE_APP_ID: Seu App ID do Manus', 'yellow');
  log('   - BUILT_IN_FORGE_API_KEY: Sua chave da Forge API', 'yellow');
  log('   - OWNER_OPEN_ID: Seu ID do Manus\n', 'yellow');

  log('2️⃣  Para usar localmente:', 'yellow');
  log('   cp .env.local .env.development.local\n', 'yellow');

  log('3️⃣  Para importar no Vercel:', 'yellow');
  log('   a) Acesse: https://vercel.com/dashboard', 'yellow');
  log('   b) Selecione seu projeto kanflow-crm', 'yellow');
  log('   c) Vá para Settings → Environment Variables', 'yellow');
  log('   d) Copie e cole cada variável do arquivo .env.vercel\n', 'yellow');

  log('4️⃣  Ou use Vercel CLI:', 'yellow');
  log('   vercel env pull .env.local\n', 'yellow');

  log('⚠️  IMPORTANTE: Nunca commite arquivos .env no Git!\n', 'yellow');
  log('✅ Pronto para deploy no Vercel!\n', 'green');
}

main().catch(error => {
  log(`\n❌ Erro: ${error.message}\n`, 'yellow');
  process.exit(1);
});

