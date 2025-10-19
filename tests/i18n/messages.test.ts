import ptMessages from '@/locales/pt-PT.json';
import { getMessages } from '@/lib/i18n/messages';

import type { Locale } from '@/i18n.config';

describe('getMessages', () => {
  it('returns default locale messages without fallback keys', async () => {
    const messages = (await getMessages('pt-PT')) as Record<string, any>;
    expect(messages.home.title).toBe(ptMessages.home.title);
    expect(messages.__meta.fallbackKeys).toHaveLength(0);
  });

  it('merges fallback strings when locale is missing keys', async () => {
    const messages = (await getMessages('en')) as Record<string, any>;
    expect(messages.home.bio).toBe(ptMessages.home.bio);
    expect(messages.__meta.fallbackKeys).toContain('home.bio');
  });
});
