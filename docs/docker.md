# Building & Running with Docker (PT-BR)

Este guia descreve como criar uma imagem Docker para o site em Vite + React e servir a saída compilada via Nginx.

Requisitos locais
- Node v22.x
- npm v10.x

Observação: Estes valores também estão refletidos no `package.json` em `engines` e no arquivo `.nvmrc`.

Build da imagem:

```powershell
docker build -t monynha-portfolio:latest .
```

Run container localmente:

```powershell
docker run --rm -p 8080:80 monynha-portfolio:latest
```

Você pode visitar <http://localhost:8080> para ver o site compilado.

Notas

- Esta configuração usa um build multi-stage para reduzir o tamanho final da imagem (Node -> Nginx).
- O `nginx.conf` fornece um fallback de SPA (`index.html`) para suportar client-side routing e configura cache para ativos estáticos por 1 ano.
- Se o diretório de saída do build (atualmente `dist`) for alterado, atualize o `Dockerfile` para copiar o diretório correto.
