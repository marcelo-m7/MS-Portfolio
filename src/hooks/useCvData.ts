import cvDataset from '../../public/data/cv.json';
import { DEFAULT_LANGUAGE, type SupportedLanguage } from '@/lib/language';
import { useCurrentLanguage } from './useCurrentLanguage';

type CvDataset = typeof cvDataset;
type LocalizedLanguageKey = Extract<keyof CvDataset, string>;
type DatasetLanguageKey = Exclude<LocalizedLanguageKey, 'defaultLanguage'>;
export type CvData = CvDataset[DatasetLanguageKey];

const resolveLanguageKey = (language: SupportedLanguage): DatasetLanguageKey => {
  const datasetLanguageKeys = Object.keys(cvDataset).filter(
    (key): key is DatasetLanguageKey => key !== 'defaultLanguage',
  );

  if (datasetLanguageKeys.includes(language as DatasetLanguageKey)) {
    return language as DatasetLanguageKey;
  }

  const fallbackLanguage =
    (cvDataset.defaultLanguage as DatasetLanguageKey | undefined) ??
    (DEFAULT_LANGUAGE as DatasetLanguageKey);

  if (datasetLanguageKeys.includes(fallbackLanguage)) {
    return fallbackLanguage;
  }

  return datasetLanguageKeys[0];
};

export const useCvData = (): CvData => {
  const language = useCurrentLanguage();
  const datasetKey = resolveLanguageKey(language);
  return cvDataset[datasetKey];
};
