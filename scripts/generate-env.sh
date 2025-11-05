#!/bin/bash

# KanFlow CRM - Environment Variables Generator
# Gera automaticamente todas as variáveis de ambiente necessárias para deploy

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções
log() {
    local message=$1
    local color=$2
    case $color in
        green) echo -e "${GREEN}${message}${NC}" ;;
        yellow) echo -e "${YELLOW}${message}${NC}" ;;
        blue) echo -e "${BLUE}${message}${NC}" ;;
        cyan) echo -e "${CYAN}${message}${NC}" ;;
        red) echo -e "${RED}${message}${NC}" ;;
        *) echo "$message" ;;
    esac
}

generate_secret() {
    openssl rand -base64 32
}

generate_jwt() {
    openssl rand -hex 32
}

# Header
echo ""
log "🚀 KanFlow CRM - Environment Variables Generator" "cyan"
echo ""

# Diretório do projeto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Ler .env.example se existir
if [ -f "$PROJECT_ROOT/.env.example" ]; then
    log "📖 Lendo variáveis de .env.example..." "blue"
else
    log "⚠️  .env.example não encontrado, usando valores padrão" "yellow"
fi

# Gerar JWT Secret
JWT_SECRET=$(generate_jwt)
log "✅ JWT_SECRET gerado" "green"

# Gerar outras chaves
BUILT_IN_FORGE_API_KEY=$(generate_secret)
log "✅ BUILT_IN_FORGE_API_KEY gerado" "green"

# Criar arquivo .env.local
ENV_LOCAL_PATH="$PROJECT_ROOT/.env.local"
cat > "$ENV_LOCAL_PATH" << EOF
# Database
DATABASE_URL=mysql://user:password@localhost:3306/kanflow

# JWT
JWT_SECRET=$JWT_SECRET

# Manus OAuth
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# App Info
VITE_APP_TITLE=KanFlow CRM
VITE_APP_LOGO=https://kanflow.io/logo.png

# Forge API
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=$BUILT_IN_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_api_aqui

# Owner Info
OWNER_NAME=Admin
OWNER_OPEN_ID=
EOF

log "✅ Arquivo .env.local criado em: $ENV_LOCAL_PATH" "green"

# Criar arquivo .env.vercel
ENV_VERCEL_PATH="$PROJECT_ROOT/.env.vercel"
cat > "$ENV_VERCEL_PATH" << EOF
DATABASE_URL=mysql://user:password@localhost:3306/kanflow
JWT_SECRET=$JWT_SECRET
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=KanFlow CRM
VITE_APP_LOGO=https://kanflow.io/logo.png
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=$BUILT_IN_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_api_aqui
OWNER_NAME=Admin
OWNER_OPEN_ID=
EOF

log "✅ Arquivo .env.vercel criado em: $ENV_VERCEL_PATH" "green"

# Exibir resumo
echo ""
log "📋 Variáveis de Ambiente Geradas:" "cyan"
echo ""
log "  DATABASE_URL=mysql://user:password@localhost:3306/kanflow" "blue"
log "  JWT_SECRET=***" "blue"
log "  VITE_APP_ID=seu_app_id_aqui" "blue"
log "  OAUTH_SERVER_URL=https://api.manus.im" "blue"
log "  VITE_OAUTH_PORTAL_URL=https://portal.manus.im" "blue"
log "  VITE_APP_TITLE=KanFlow CRM" "blue"
log "  VITE_APP_LOGO=https://kanflow.io/logo.png" "blue"
log "  BUILT_IN_FORGE_API_URL=https://api.manus.im" "blue"
log "  BUILT_IN_FORGE_API_KEY=***" "blue"
log "  VITE_FRONTEND_FORGE_API_URL=https://api.manus.im" "blue"
log "  VITE_FRONTEND_FORGE_API_KEY=sua_chave_api_aqui" "blue"
log "  OWNER_NAME=Admin" "blue"
log "  OWNER_OPEN_ID=" "blue"

# Instruções
echo ""
log "📝 Próximos Passos:" "cyan"
echo ""
log "1️⃣  Atualize as variáveis com seus valores reais:" "yellow"
log "   - DATABASE_URL: URL do seu banco MySQL" "yellow"
log "   - VITE_APP_ID: Seu App ID do Manus" "yellow"
log "   - BUILT_IN_FORGE_API_KEY: Sua chave da Forge API" "yellow"
log "   - OWNER_OPEN_ID: Seu ID do Manus" "yellow"
echo ""

log "2️⃣  Para usar localmente:" "yellow"
log "   cp .env.local .env.development.local" "yellow"
echo ""

log "3️⃣  Para importar no Vercel:" "yellow"
log "   a) Acesse: https://vercel.com/dashboard" "yellow"
log "   b) Selecione seu projeto kanflow-crm" "yellow"
log "   c) Vá para Settings → Environment Variables" "yellow"
log "   d) Copie e cole cada variável do arquivo .env.vercel" "yellow"
echo ""

log "4️⃣  Ou use Vercel CLI:" "yellow"
log "   vercel env pull .env.local" "yellow"
echo ""

log "⚠️  IMPORTANTE: Nunca commite arquivos .env no Git!" "yellow"
echo ""
log "✅ Pronto para deploy no Vercel!" "green"
echo ""

