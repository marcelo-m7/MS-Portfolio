---
title: "React Query: Gerenciamento de Estado Assíncrono"
date: "2025-10-15"
author: "Marcelo Santos"
tags: ["react", "react-query", "state-management", "tutorial"]
excerpt: "Entenda como React Query simplifica o gerenciamento de dados assíncronos no React."
---

O gerenciamento de estado assíncrono sempre foi um desafio no React. Entre Redux, Context API e custom hooks, a complexidade pode crescer rapidamente.

## Por Que React Query?

**React Query** (agora TanStack Query) resolve este problema de forma elegante:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

Três linhas de código substituem dezenas de linhas de boilerplate.

## Principais Benefícios

### 1. Cache Inteligente
React Query mantém um cache automático que:
- Evita requisições duplicadas
- Atualiza em background
- Sincroniza entre componentes

### 2. Estados Automáticos
Não precisa gerenciar manualmente:
- `loading`
- `error`
- `success`

Tudo é gerenciado automaticamente.

### 3. Refetch Automático
Atualizações quando:
- A janela ganha foco
- A rede reconecta
- Um intervalo expira

### 4. Otimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: updateProject,
  onMutate: async (newProject) => {
    // Atualiza UI antes da resposta
    await queryClient.cancelQueries(['projects']);
    const previousProjects = queryClient.getQueryData(['projects']);
    queryClient.setQueryData(['projects'], old => [...old, newProject]);
    return { previousProjects };
  },
  onError: (err, newProject, context) => {
    // Reverte em caso de erro
    queryClient.setQueryData(['projects'], context.previousProjects);
  },
});
```

## Padrões Úteis

### Fallback em Cascata
```typescript
queryFn: async () => {
  const dbData = await fetchFromDatabase();
  if (dbData) return dbData;
  
  const apiData = await fetchFromAPI();
  if (apiData) return apiData;
  
  return loadLocalData();
}
```

### Prefetching
```typescript
await queryClient.prefetchQuery({
  queryKey: ['project', slug],
  queryFn: () => fetchProject(slug),
});
```

## Conclusão

React Query transforma o gerenciamento de estado assíncrono de uma tarefa complexa em algo simples e declarativo. É uma ferramenta essencial para qualquer aplicação React moderna.
