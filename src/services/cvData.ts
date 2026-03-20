let cvDataCache: Record<string, unknown> | null = null;
let cvDataPromise: Promise<Record<string, unknown>> | null = null;

export async function loadCvData(): Promise<Record<string, unknown>> {
  if (cvDataCache) return cvDataCache;
  if (cvDataPromise) return cvDataPromise;

  const base = import.meta.env.BASE_URL || '/';
  const cvUrl = base.endsWith('/') ? `${base}data/cv.json` : `${base}/data/cv.json`;

  cvDataPromise = fetch(cvUrl)
    .then((response) => response.json())
    .then((data: unknown) => {
      cvDataCache = data as Record<string, unknown>;
      cvDataPromise = null;
      return cvDataCache;
    })
    .catch((error) => {
      cvDataPromise = null;
      throw error;
    });

  return cvDataPromise;
}
