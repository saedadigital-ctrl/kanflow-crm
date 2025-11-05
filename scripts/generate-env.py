#!/usr/bin/env python3
"""
KanFlow CRM - Environment Variables Generator
Gera automaticamente todas as variáveis de ambiente necessárias para deploy
"""

import os
import json
import secrets
import sys
from pathlib import Path
from typing import Dict

# Cores para terminal
class Colors:
    RESET = '\033[0m'
    BRIGHT = '\033[1m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'

def log(message: str, color: str = 'RESET'):
    """Imprimir mensagem colorida"""
    color_code = getattr(Colors, color, Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def generate_secret(length: int = 32) -> str:
    """Gerar chave secreta aleatória"""
    return secrets.token_urlsafe(length)

def generate_jwt() -> str:
    """Gerar JWT secret"""
    return secrets.token_hex(32)

def read_example_env(path: Path) -> Dict[str, str]:
    """Ler variáveis do .env.example"""
    vars_dict = {}
    if path.exists():
        with open(path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        vars_dict[key.strip()] = value.strip()
    return vars_dict

def main():
    log('\n🚀 KanFlow CRM - Environment Variables Generator\n', 'BRIGHT')
    
    # Obter diretório raiz do projeto
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # Ler variáveis existentes
    example_env_path = project_root / '.env.example'
    existing_vars = read_example_env(example_env_path)
    
    if not existing_vars:
        log('⚠️  .env.example não encontrado, usando valores padrão\n', 'YELLOW')
    
    # Gerar variáveis
    env_vars = {
        # Database
        'DATABASE_URL': existing_vars.get('DATABASE_URL', 'mysql://user:password@localhost:3306/kanflow'),
        
        # JWT
        'JWT_SECRET': generate_jwt(),
        
        # Manus OAuth
        'VITE_APP_ID': existing_vars.get('VITE_APP_ID', 'seu_app_id_aqui'),
        'OAUTH_SERVER_URL': 'https://api.manus.im',
        'VITE_OAUTH_PORTAL_URL': 'https://portal.manus.im',
        
        # App Info
        'VITE_APP_TITLE': 'KanFlow CRM',
        'VITE_APP_LOGO': 'https://kanflow.io/logo.png',
        
        # Forge API
        'BUILT_IN_FORGE_API_URL': 'https://api.manus.im',
        'BUILT_IN_FORGE_API_KEY': existing_vars.get('BUILT_IN_FORGE_API_KEY', 'sua_chave_api_aqui'),
        'VITE_FRONTEND_FORGE_API_URL': 'https://api.manus.im',
        'VITE_FRONTEND_FORGE_API_KEY': existing_vars.get('VITE_FRONTEND_FORGE_API_KEY', 'sua_chave_api_aqui'),
        
        # Owner Info
        'OWNER_NAME': existing_vars.get('OWNER_NAME', 'Admin'),
        'OWNER_OPEN_ID': existing_vars.get('OWNER_OPEN_ID', ''),
    }
    
    # Exibir variáveis geradas
    log('\n📋 Variáveis de Ambiente Geradas:\n', 'CYAN')
    
    for key, value in env_vars.items():
        is_secret = any(word in key for word in ['PASSWORD', 'SECRET', 'KEY', 'TOKEN'])
        display_value = '***' if is_secret else value
        log(f"  {key}={display_value}", 'BLUE')
    
    # Criar arquivo .env.local
    env_local_path = project_root / '.env.local'
    with open(env_local_path, 'w') as f:
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    log(f"\n✅ Arquivo .env.local criado em: {env_local_path}\n", 'GREEN')
    
    # Criar arquivo para Vercel
    vercel_env_path = project_root / '.env.vercel'
    with open(vercel_env_path, 'w') as f:
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    log(f"✅ Arquivo .env.vercel criado em: {vercel_env_path}\n", 'GREEN')
    
    # Criar JSON para importar no Vercel
    vercel_json_path = project_root / '.vercel-env.json'
    with open(vercel_json_path, 'w') as f:
        json.dump({'version': 2, 'env': env_vars}, f, indent=2)
    
    log(f"✅ Arquivo .vercel-env.json criado em: {vercel_json_path}\n", 'GREEN')
    
    # Instruções
    log('📝 Próximos Passos:\n', 'BRIGHT')
    log('1️⃣  Atualize as variáveis com seus valores reais:', 'YELLOW')
    log('   - DATABASE_URL: URL do seu banco MySQL', 'YELLOW')
    log('   - VITE_APP_ID: Seu App ID do Manus', 'YELLOW')
    log('   - BUILT_IN_FORGE_API_KEY: Sua chave da Forge API', 'YELLOW')
    log('   - OWNER_OPEN_ID: Seu ID do Manus\n', 'YELLOW')
    
    log('2️⃣  Para usar localmente:', 'YELLOW')
    log('   cp .env.local .env.development.local\n', 'YELLOW')
    
    log('3️⃣  Para importar no Vercel:', 'YELLOW')
    log('   a) Acesse: https://vercel.com/dashboard', 'YELLOW')
    log('   b) Selecione seu projeto kanflow-crm', 'YELLOW')
    log('   c) Vá para Settings → Environment Variables', 'YELLOW')
    log('   d) Copie e cole cada variável do arquivo .env.vercel\n', 'YELLOW')
    
    log('4️⃣  Ou use Vercel CLI:', 'YELLOW')
    log('   vercel env pull .env.local\n', 'YELLOW')
    
    log('⚠️  IMPORTANTE: Nunca commite arquivos .env no Git!\n', 'YELLOW')
    log('✅ Pronto para deploy no Vercel!\n', 'GREEN')

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        log(f"\n❌ Erro: {str(e)}\n", 'YELLOW')
        sys.exit(1)

