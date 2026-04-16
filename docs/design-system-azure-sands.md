# Design System Documentation: Azure Sands (The Coastal Sanctuary)

## 1. Creative Concept & North Star

### "The Coastal Sanctuary"
The design aims to evoke a sense of immediate tranquility and luxury. It is built on the principle of **visual breathing room**, using generous whitespace and high-quality coastal imagery to transport the user to the beach before they even arrive.

## 2. Visual Style Guidelines

### Typography
- **Primary Headings:** `Noto Serif`  
  Used for a classic, sophisticated, and high-end feel. Evokes the quality of a premium travel magazine.
- **Body Text:** `Inter` (or standard sans-serif)  
  Clean, legible, and modern to balance the serif headings.
- **Styling Detail:** Use italic serif for emotional sub-headers (for example, *"An oasis of quietude"*) to add a human, poetic touch.

### Color Palette
- **Primary:** `#0077B6` (Deep Azure)  
  Used for primary CTAs and brand accents. Represents the deep ocean.
- **Secondary/Surface:** `#F8FAFC` (Slate 50) and `#FFFFFF`  
  Provides the clean, airy foundation.
- **Accents:**
  - Sky `700/800` for navigation and links
  - Slate `400/500` for secondary text and meta-information
  - Sand/Beige (optional) for subtle section separation

### UI Elements & Spacing
- **Border Radius:** `4px` (Round Four)  
  Subtle rounding that feels modern but structured.
- **Shadows:** Flat or extremely subtle elevations  
  Visual depth should come from image overlays and tonal shifts, not heavy drop shadows.
- **Whitespace:** Extremely generous  
  Sections should be clearly separated by large vertical padding to prevent clutter.

## 3. Key UI Components & UX Patterns

### Navigation (TopNavBar)
- **Style:** Sticky with a light, semi-transparent backdrop blur (`backdrop-blur-xl`).
- **Logo:** Serif font, italicized, representing elegance.
- **CTA:** High-contrast primary button ("Reserve Now") always visible in the top-right.

### Hero Section
- **Visuals:** Full-width, high-quality beach or room-view photography.
- **UX Pattern:** Integrated Quick Booking form (Check-in, Check-out, Guests) positioned over the hero image to drive immediate conversion.

### Room Cards
- **Layout:** Vertical stack with large images.
- **Details:** Minimalist tags for "Sea View" or "Private Pool". Prices are clearly emphasized but integrated into typography flow.
- **Hover Behavior:** Subtle image zoom or shadow transition.

### Gallery
- **Pattern:** Masonry or clean grid.
- **Intent:** Showcase the "lifestyle" aspect (food, sunset, architecture), not just rooms.

### Booking Flow
- **Pattern:** Multi-step form with a persistent summary sidebar on the right.
- **Trust Signals:** Place icons for "Best Rate Guaranteed" and "Secure Booking" near the final action button.

## 4. Implementation Notes (TailwindCSS)

- **Backgrounds:** `bg-slate-50`, `bg-white`
- **Text:** `text-sky-900` (headings), `text-slate-600` (body)
- **Buttons:** `bg-[#0077B6] hover:bg-[#005B8E] text-white transition-colors duration-300`
- **Layout Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
