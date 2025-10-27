# Docker Deployment Guide

Este guia explica como construir e executar o MS-Portfolio usando Docker.

## 📋 Pré-requisitos

- Docker 20.10+ instalado
- Docker Compose 2.0+ (opcional, para uso com docker-compose)

## 🏗️ Construindo a Imagem Docker

### Opção 1: Build direto do source

```bash
# Build da imagem
docker build -t ms-portfolio:latest .

# Ou especificando a versão
docker build -t ms-portfolio:2.0.0 .
```

### Opção 2: Usando Docker Compose

```bash
docker-compose build
```

## 🚀 Executando o Container

### Método 1: Docker run

```bash
# Executar em background na porta 8080
docker run -d \
  --name ms-portfolio \
  -p 8080:80 \
  --restart unless-stopped \
  ms-portfolio:latest
```

### Método 2: Docker Compose

```bash
# Iniciar o serviço
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar o serviço
docker-compose down
```

## 🔧 Configuração

### Variáveis de Ambiente

Se você precisa configurar variáveis de ambiente para o Supabase, edite o `docker-compose.yml`:

```yaml
environment:
  VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
  VITE_SUPABASE_KEY: ${VITE_SUPABASE_KEY}
  VITE_SUPABASE_SCHEMA: ${VITE_SUPABASE_SCHEMA}
```

Ou crie um arquivo `.env` com as variáveis:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_SUPABASE_SCHEMA=portfolio
```

## 📊 Health Check

O container inclui um health check endpoint em `/health`:

```bash
# Verificar status
curl http://localhost:8080/health
# Resposta esperada: healthy
```

## 🔍 Verificando Status

```bash
# Listar containers em execução
docker ps

# Ver logs
docker logs ms-portfolio

# Ver logs em tempo real
docker logs -f ms-portfolio

# Inspecionar container
docker inspect ms-portfolio
```

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker logs ms-portfolio

# Verificar se a porta já está em uso
netstat -tuln | grep 8080
# ou no Windows
netstat -an | findstr "8080"
```

### Build falha

Se o build falhar durante `npm install`, você pode:

1. **Fazer o build localmente primeiro**:
   ```bash
   npm install
   npm run build
   docker build -t ms-portfolio:latest .
   ```

2. **O Dockerfile detecta automaticamente** se a pasta `dist` já existe e a utiliza, evitando refazer o build.

### Rebuild completo

```bash
# Rebuild sem cache
docker build --no-cache -t ms-portfolio:latest .
```

## 🔐 Segurança

O container roda com um usuário não-root (`nginx-app`) por questões de segurança.

## 📝 Notas Importantes

1. **Build Process**: O Dockerfile tem uma proteção que verifica se a pasta `dist` já existe. Se existir, usa ela diretamente ao invés de refazer o build.

2. **Porta**: O container expõe a porta 80 internamente. Você deve mapear para a porta desejada no host (ex: `-p 8080:80`).

3. **Health Check**: O container tem um health check automático que verifica a cada 30 segundos se o serviço está respondendo.

4. **Logs**: Nginx roda em modo foreground para facilitar o acesso aos logs via `docker logs`.

## 🌐 Deploy em Produção

### Docker Swarm

```bash
docker service create \
  --name ms-portfolio \
  --publish 80:80 \
  --replicas 3 \
  ms-portfolio:latest
```

### Kubernetes

Veja o exemplo de deployment no arquivo `k8s-deployment.yaml` (criar se necessário).

### Cloud Platforms

#### Google Cloud Run
```bash
# Build e push para GCR
docker tag ms-portfolio:latest gcr.io/PROJECT_ID/ms-portfolio:latest
docker push gcr.io/PROJECT_ID/ms-portfolio:latest

# Deploy
gcloud run deploy ms-portfolio \
  --image gcr.io/PROJECT_ID/ms-portfolio:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### AWS ECS/Fargate
```bash
# Autenticar no ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Push
docker tag ms-portfolio:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ms-portfolio:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ms-portfolio:latest
```

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name ms-portfolio \
  --image ms-portfolio:latest \
  --dns-name-label ms-portfolio-demo \
  --ports 80
```

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
- [Node.js Docker Image](https://hub.docker.com/_/node)
