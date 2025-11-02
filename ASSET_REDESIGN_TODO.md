# Visual Asset Redesign - Task Tracker

## Project Overview

Redesign all images, placeholders, icons, and SVG assets to align with Monynha Softwares' visual identity and color palette.

## Design Guidelines

### Color Palette (HSL)

**Light Theme:**

- Primary: `243 75% 59%` (#7c3aed - Purple)
- Secondary: `199 89% 48%` (#0ea5e9 - Cyan/Blue)
- Accent: `281 66% 60%` (#d946ef - Pink/Magenta)
- Background: `216 33% 96%` (Light gray-blue)
- Foreground: `222 47% 11%` (Dark blue-gray)

**Dark Theme:**

- Primary: `244 63% 68%` (Lighter purple)
- Secondary: `199 89% 60%` (Brighter cyan)
- Accent: `281 66% 68%` (Brighter pink)
- Background: `222 47% 7%` (Very dark blue)
- Foreground: `210 40% 96%` (Off-white)

### Typography

- Display: Space Grotesk
- Body: Inter
- Monospace: JetBrains Mono

### Design Principles

- **Geometric & Modern**: Use clean geometric shapes (circles, rounded rectangles, diamonds)
- **Gradients**: Utilize linear gradients between primary → secondary → accent
- **Consistent Border Radius**: Use `1.5rem` (24px) for cards, `1rem` for medium elements
- **Accessibility**: Maintain WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI components)
- **Responsive**: SVGs should scale gracefully from mobile to desktop
- **Performance**: Optimize SVGs (remove unnecessary metadata, minimize paths)
- **Theme Support**: Assets should work in both light and dark modes

### Visual Language

- Abstract geometric patterns representing technology and creativity
- Fluid shapes suggesting innovation and flexibility
- Grid patterns for technical/infrastructure projects
- 3D isometric elements for creative/artistic projects
- Consistent stroke weights (1.5-2px)
- Corner radius consistency across all assets

## Asset Inventory

### Core Branding Assets

- [x] `public/favicon.svg` - Current: Monynha "M" logo with gradient
- [x] `public/og-image.svg` - Current: Social media preview with profile info
- [x] `public/placeholder.svg` - Current: Generic gray placeholder with camera icon
- [x] `public/avatar.jpg` - Current: Profile photo (likely to keep as is)
- [x] `public/avatar.png` - Current: Profile photo PNG version

### Project Thumbnail SVGs (10 projects)

- [x] `public/images/botecopro.svg` - BotecoPro (Restaurant Management with AI)
- [x] `public/images/facodi.svg` - FACODI (Digital Community Education)
- [x] `public/images/monynha-tech.svg` - MonynhaTech (Technical Blog)
- [x] `public/images/artleo.svg` - Art Leo (Digital Art Portfolio)
- [x] `public/images/assistina.svg` - AssisTina (AI Virtual Assistant)
- [x] `public/images/monadocs.svg` - MonaDocs (Documentation Template)
- [x] `public/images/monynha-com.svg` - Monynha.com (Corporate Website)
- [x] `public/images/infra-hub.svg` - Infra Hub (Infrastructure Management)
- [x] `public/images/open-webui.svg` - Open WebUI (AI Interface)
- [x] `public/images/marcelo-portfolio.svg` - Marcelo Portfolio (This site)

### Artwork Thumbnails

- [x] `public/images/artleo-hero.svg` - Art Leo hero image
- [x] `public/images/artleo-3d.svg` - Art Leo 3D preview

## Redesign Tasks

### Phase 1: Core Branding (High Priority)

- [ ] Redesign `public/placeholder.svg`
  - Add geometric pattern with brand colors
  - Include subtle gradient overlays
  - Maintain 1200x1200 aspect ratio
  - Ensure visibility in both themes
  
- [ ] Enhance `public/favicon.svg`
  - Refine Monynha "M" logo
  - Improve gradient definition
  - Add subtle glow effect
  - Ensure 256x256 renders clearly at 16x16, 32x32, 48x48
  
- [ ] Redesign `public/og-image.svg`
  - Update layout with modern design
  - Incorporate geometric patterns
  - Add visual hierarchy improvements
  - Ensure 1200x630 aspect ratio (Twitter/OG standard)

### Phase 2: Project Thumbnails (High Priority)

Each thumbnail should:

- Use consistent 640x360 aspect ratio
- Incorporate project-specific visual metaphors
- Apply brand color palette
- Include subtle depth/layering
- Work in both light and dark themes

**Business/Enterprise Projects:**

- [ ] `botecopro.svg` - Restaurant/bar theme with modern POS/management visuals
- [ ] `facodi.svg` - Education/learning theme with community elements
- [ ] `monynha-com.svg` - Corporate/institutional with professional look

**Technical/Infrastructure Projects:**

- [ ] `infra-hub.svg` - Server/infrastructure with network patterns
- [ ] `monadocs.svg` - Documentation theme with organized content visuals
- [ ] `monynha-tech.svg` - Blog/content with technical elements
- [ ] `open-webui.svg` - AI interface with modern UI elements

**Creative/AI Projects:**

- [ ] `artleo.svg` - 3D/artistic with creative elements
- [ ] `assistina.svg` - AI assistant with conversational/chat visuals
- [ ] `monagent.svg` - AI agent with automation theme (if exists)

**Portfolio:**

- [ ] `marcelo-portfolio.svg` - Personal portfolio with creative showcase theme

### Phase 3: Artwork Assets

- [ ] `artleo-hero.svg` - Hero image for Art Leo project
- [ ] `artleo-3d.svg` - 3D preview/thumbnail

### Phase 4: Optimization & Validation

- [ ] Optimize all SVGs with SVGO or similar tool
- [ ] Validate WCAG AA contrast ratios for all assets
- [ ] Test rendering in both light and dark themes
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Run production build and verify all assets load correctly
- [ ] Test on actual devices/browsers

### Phase 5: Documentation

- [ ] Create asset usage guidelines
- [ ] Document color palette specifications
- [ ] Add examples for future asset creation
- [ ] Update README with asset information (if needed)

## Success Criteria

✅ All assets use consistent brand color palette  
✅ Unified visual language across all thumbnails  
✅ Accessible contrast ratios (WCAG AA)  
✅ Optimized file sizes (< 50KB per SVG)  
✅ Works perfectly in both light and dark themes  
✅ Responsive and scalable  
✅ Professional and modern aesthetic  
✅ Clear visual hierarchy and readability  

## Notes

- Keep avatar images as they are (personal photos)
- Maintain lucide-react icons in components (no changes needed)
- MonynhaLogo component is already well-designed (may minor tweaks only)
- Focus on SVG assets only (no raster image creation)
