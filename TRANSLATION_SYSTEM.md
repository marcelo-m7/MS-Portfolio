# Automatic Translation System

This portfolio implements an automatic translation mechanism that uses Google Translate API in the background to translate dynamic content while providing instant UI updates.

## Overview

The translation system has two layers:

1. **Static UI Translations** - Pre-translated UI elements (navigation, buttons, labels) in `src/lib/translations.ts`
2. **Dynamic Content Translation** - Automatic translation of content from `cv.json` (projects, bio, thoughts) using Google Translate API

## Supported Languages

- 🇵🇹 Portuguese (PT) - Default/Source language
- 🇬🇧 English (EN)
- 🇪🇸 Spanish (ES)
- 🇫🇷 French (FR)

## How It Works

### 1. Language Selection

Users select their preferred language via the language toggle dropdown in the navigation bar. The selection:
- Fires a `monynha:languagechange` CustomEvent
- Updates the `lang` attribute on the `<html>` element
- Stores preference in localStorage as `monynha-lang`
- Triggers re-render of all components using `useCurrentLanguage` hook

### 2. UI Translation (Instant)

Static UI elements use pre-defined translations from `src/lib/translations.ts`:

```typescript
import { useTranslations } from '@/hooks/useTranslations';

function MyComponent() {
  const t = useTranslations();
  return <button>{t.nav.home}</button>;
}
```

### 3. Dynamic Content Translation (Background)

Content from `cv.json` is automatically translated using Google Translate API:

```typescript
import { useTranslatedText } from '@/hooks/useTranslatedContent';

function ProfileComponent({ profile }) {
  const translatedBio = useTranslatedText(profile.bio);
  return <p>{translatedBio}</p>;
}
```

**Process:**
1. Component initially shows Portuguese content (source language)
2. Translation service makes API call in background
3. Content updates smoothly when translation completes
4. Result is cached in localStorage for instant re-use
5. No visible loading states or flickering

### 4. Caching Strategy

- Translations are cached in localStorage with key `monynha-translate-cache`
- Cache version: `1.0` (automatic invalidation on version change)
- Structure: `sourceText::targetLang` → `translatedText`
- Prevents redundant API calls
- Persists across sessions and page reloads

### 5. Request Deduplication

If multiple components request translation of the same text simultaneously:
- Only ONE API call is made
- All components receive the same result
- Prevents API quota waste

## Configuration

### Google Translate API Key

Add your API key to `.env`:

```bash
VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

**How to get an API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Translation API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the key to your `.env` file

**Graceful Degradation:**
- If no API key is configured, the app works normally
- Content displays in Portuguese (source language)
- No errors or broken functionality
- Console warning: "Google Translate API key not configured"

## SEO & Accessibility

### HTML Lang Attribute

Automatically updated on language change:
```html
<html lang="pt">  <!-- Updates to en, es, or fr -->
```

### Hreflang Tags

The `LanguageMetadata` component automatically adds:

```html
<link rel="alternate" hreflang="pt" href="https://example.com?lang=pt" />
<link rel="alternate" hreflang="en" href="https://example.com?lang=en" />
<link rel="alternate" hreflang="es" href="https://example.com?lang=es" />
<link rel="alternate" hreflang="fr" href="https://example.com?lang=fr" />
<link rel="alternate" hreflang="x-default" href="https://example.com" />
```

### Open Graph Locale

```html
<meta property="og:locale" content="pt_PT" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:locale:alternate" content="es_ES" />
<meta property="og:locale:alternate" content="fr_FR" />
```

## Translation Hooks

### `useTranslatedText(text, sourceLang?)`

Translate a single text string:

```typescript
const translatedBio = useTranslatedText(profile.bio);
```

### `useTranslatedTexts(texts[], sourceLang?)`

Translate multiple strings efficiently:

```typescript
const [title, description] = useTranslatedTexts([
  project.name,
  project.description
]);
```

### `useTranslatedObject(obj, fields[], sourceLang?)`

Translate specific fields of an object:

```typescript
const translatedProject = useTranslatedObject(
  project,
  ['name', 'description', 'summary']
);
```

## API Reference

### Translation Service

```typescript
import { translationService } from '@/lib/translateService';

// Check if API is configured
translationService.isAvailable(); // boolean

// Clear cache
translationService.clearCache();

// Translate single text
await translationService.translate({
  text: 'Hello',
  targetLang: 'pt',
  sourceLang: 'en'
});

// Translate batch
await translationService.translateBatch(
  ['Hello', 'World'],
  'pt',
  'en'
);
```

## Testing

The translation system includes unit tests:

```bash
npm run test
```

Tests verify:
- ✅ Same-language translations return immediately
- ✅ API calls are made with correct parameters
- ✅ Translations are cached properly
- ✅ Errors are handled gracefully
- ✅ Pending requests are deduplicated

## Performance

- **Initial load**: UI in Portuguese, instant
- **Language switch**: UI updates instantly, content translates in background
- **Subsequent switches**: Instant from cache
- **API quota**: Minimal usage due to caching and deduplication
- **Bundle size**: ~3KB for translation service (gzipped)

## Validation Steps

### 1. Language Switching

1. Open the site
2. Click the language toggle (🌐 icon)
3. Select each language (PT → EN → ES → FR)
4. Verify:
   - Navigation items update instantly
   - Hero section bio/headline translate smoothly
   - No page reloads
   - No flickering or loading states

### 2. Translation Persistence

1. Switch to English
2. Navigate to different pages
3. Return to home
4. Verify language stays English
5. Refresh the page
6. Verify language is still English (from localStorage)

### 3. SEO Metadata

1. Switch to English
2. Open browser DevTools → Elements
3. Inspect `<html>` tag → verify `lang="en"`
4. Inspect `<head>` → verify hreflang links
5. Verify og:locale meta tags

### 4. Console Errors

1. Open browser console
2. Switch between all languages
3. Verify:
   - No errors
   - No visible Google Translate references
   - Warning if API key not configured (expected)

## Architecture

```
User Action (Select Language)
    ↓
setLanguage() → localStorage
    ↓
CustomEvent: monynha:languagechange
    ↓
useCurrentLanguage hook triggers re-render
    ↓
Components update:
  ├─ UI: Use static translations (instant)
  └─ Content: Use translation hooks
         ↓
    useTranslatedText hook
         ├─ Check cache → Found? Return
         └─ Not found? → Google Translate API
                ↓
           Save to cache
                ↓
           Update component state
                ↓
           Content smoothly updates
```

## Troubleshooting

### Content not translating

1. **Check API key**: Ensure `VITE_GOOGLE_TRANSLATE_API_KEY` is set in `.env`
2. **Check browser console**: Look for errors or warnings
3. **Clear cache**: `localStorage.removeItem('monynha-translate-cache')`
4. **Check network tab**: Verify API calls are being made

### Translations incorrect

1. Google Translate API may produce imperfect translations
2. For critical content, consider manual translations in `cv.json`
3. Clear cache and retry

### API quota exceeded

1. Google Translate has usage limits
2. Check your Google Cloud Console for quota
3. Consider upgrading plan if needed
4. Cache helps minimize API calls

## Future Enhancements

- [ ] Support for more languages (DE, IT, JA, ZH)
- [ ] Manual translation overrides for specific content
- [ ] Translation quality feedback mechanism
- [ ] Fallback to alternative translation services
- [ ] Pre-translation build step for static content
- [ ] A/B testing different translations

## References

- [Google Cloud Translation API](https://cloud.google.com/translate/docs)
- [HTML Lang Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
- [Hreflang Tags](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Open Graph Locale](https://ogp.me/#optional)
