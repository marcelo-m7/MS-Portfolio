import { useCallback } from 'react';
import { useTranslation, type UseTranslationOptions } from 'react-i18next';

export const useTranslations = (
  namespace?: string | string[],
  options?: UseTranslationOptions<string>,
) => {
  const { t: baseTranslate, ...rest } = useTranslation(namespace, options);
  const namespaceLabel = Array.isArray(namespace)
    ? namespace.join(', ')
    : namespace;

  const translate = useCallback(
    (...args: Parameters<typeof baseTranslate>) => {
      const [key] = args;
      const result = baseTranslate(...args);

      if (
        import.meta.env.DEV &&
        typeof key === 'string' &&
        (result === key || result === undefined || result === null)
      ) {
        const prefix = namespaceLabel ? `${namespaceLabel}:` : '';
        const error = new Error(
          `Missing translation for key "${prefix}${key}"`,
        );
        console.error(error);
        throw error;
      }

      return result;
    },
    [baseTranslate, namespaceLabel],
  );

  return { t: translate, ...rest };
};
