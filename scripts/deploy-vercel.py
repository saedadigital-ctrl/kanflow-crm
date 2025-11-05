#!/usr/bin/env python3
"""
KanFlow CRM - Vercel Deploy Script
Automatiza o processo de deploy no Vercel
"""

import subprocess
import sys
import os
from pathlib import Path

# Cores para terminal
class Colors:
    RESET = '\033[0m'
    BRIGHT = '\033[1m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'
    RED = '\033[31m'

def log(message: str, color: str = 'RESET'):
    """Imprimir mensagem colorida"""
    color_code = getattr(Colors, color, Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def exec_command(command: str, description: str) -> bool:
    """Executar comando e retornar sucesso/erro"""
    try:
        log(f"\n▶️  {description}", 'BLUE')
        result = subprocess.run(
            command,
            shell=True,
            cwd=Path(__file__).parent.parent,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            log(f"✅ {description} concluído", 'GREEN')
            return True
        else:
            log(f"❌ Erro: {result.stderr}", 'RED')
            return False
    except Exception as e:
        log(f"❌ Erro: {str(e)}", 'RED')
        return False

def main():
    log('\n🚀 KanFlow CRM - Vercel Deploy Script\n', 'BRIGHT')

    try:
        # 1. Verificar Vercel CLI
        log('1️⃣  Verificando Vercel CLI...', 'CYAN')
        result = subprocess.run(
            'vercel --version',
            shell=True,
            capture_output=True
        )
        
        if result.returncode != 0:
            log('❌ Vercel CLI não encontrado. Instalando...', 'YELLOW')
            exec_command('npm install -g vercel', 'Instalando Vercel CLI')
        else:
            log('✅ Vercel CLI encontrado\n', 'GREEN')

        # 2. Fazer build local
        log('2️⃣  Fazendo build local...', 'CYAN')
        if not exec_command('pnpm build', 'Build do projeto'):
            raise Exception('Build falhou')

        # 3. Fazer commit e push
        log('3️⃣  Enviando código para GitHub...', 'CYAN')
        exec_command('git add .', 'Adicionando arquivos ao Git')
        exec_command(
            'git commit -m "Deploy: Fase 3 - Billing + Auto-deploy script"',
            'Fazendo commit'
        )
        exec_command('git push origin main', 'Fazendo push para GitHub')

        # 4. Deploy no Vercel
        log('4️⃣  Fazendo deploy no Vercel...', 'CYAN')
        if not exec_command('vercel --prod', 'Deploy no Vercel'):
            raise Exception('Deploy falhou')

        # 5. Sucesso
        log('\n✅ Deploy concluído com sucesso!\n', 'GREEN')
        log('🎉 Seu aplicativo está em produção!', 'BRIGHT')
        log('📊 Acesse: https://vercel.com/dashboard\n', 'CYAN')

    except Exception as e:
        log(f"\n❌ Erro durante o deploy: {str(e)}\n", 'RED')
        log('💡 Dicas:', 'YELLOW')
        log('  1. Verifique se você está logado no Vercel: vercel login', 'YELLOW')
        log('  2. Verifique se o projeto está configurado: vercel link', 'YELLOW')
        log('  3. Verifique os logs: vercel logs', 'YELLOW')
        sys.exit(1)

if __name__ == '__main__':
    main()

