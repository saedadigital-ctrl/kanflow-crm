#!/usr/bin/env node

import { execSync } from 'child_process';
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
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, description) {
  try {
    log(`\n▶️  ${description}`, 'blue');
    const output = execSync(command, { cwd: projectRoot, encoding: 'utf-8' });
    log(`✅ ${description} concluído`, 'green');
    return output;
  } catch (error) {
    log(`❌ Erro: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  log('\n🚀 KanFlow CRM - Vercel Deploy Script\n', 'bright');

  try {
    // 1. Verificar se Vercel CLI está instalado
    log('1️⃣  Verificando Vercel CLI...', 'cyan');
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      log('✅ Vercel CLI encontrado\n', 'green');
    } catch {
      log('❌ Vercel CLI não encontrado. Instalando...', 'yellow');
      exec('npm install -g vercel', 'Instalando Vercel CLI');
    }

    // 2. Fazer build local
    log('2️⃣  Fazendo build local...', 'cyan');
    exec('pnpm build', 'Build do projeto');

    // 3. Fazer commit e push
    log('3️⃣  Enviando código para GitHub...', 'cyan');
    try {
      exec('git add .', 'Adicionando arquivos ao Git');
      exec('git commit -m "Deploy: Fase 3 - Billing + Auto-deploy script"', 'Fazendo commit');
      exec('git push origin main', 'Fazendo push para GitHub');
    } catch (error) {
      log('⚠️  Erro ao fazer push (pode não ter mudanças)', 'yellow');
    }

    // 4. Deploy no Vercel
    log('4️⃣  Fazendo deploy no Vercel...', 'cyan');
    exec('vercel --prod', 'Deploy no Vercel');

    // 5. Sucesso
    log('\n✅ Deploy concluído com sucesso!\n', 'green');
    log('🎉 Seu aplicativo está em produção!', 'bright');
    log('📊 Acesse: https://vercel.com/dashboard\n', 'cyan');

  } catch (error) {
    log(`\n❌ Erro durante o deploy: ${error.message}\n`, 'red');
    log('💡 Dicas:', 'yellow');
    log('  1. Verifique se você está logado no Vercel: vercel login', 'yellow');
    log('  2. Verifique se o projeto está configurado: vercel link', 'yellow');
    log('  3. Verifique os logs: vercel logs', 'yellow');
    process.exit(1);
  }
}

main();

