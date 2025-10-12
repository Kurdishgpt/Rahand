# AI Chatbot Design Guidelines

## Design Approach

**Selected Framework**: Custom Design System inspired by Linear, ChatGPT, and Gemini
**Rationale**: Utility-focused AI interface requiring clarity, speed, and efficiency. Blue theme with modern, clean aesthetics prioritizing function over decoration.

## Core Design Principles

1. **Clarity First**: Every element serves user interaction - no visual noise
2. **Speed Perception**: Instant feedback, smooth transitions, streaming responses
3. **Bilingual Excellence**: Seamless Kurdish-English switching with proper RTL support
4. **Voice-First Ready**: Prominent voice controls, clear audio states
5. **Minimal Cognitive Load**: Focus on conversation, not interface chrome

---

## Color Palette

### Primary Blue Theme
- **Primary Blue**: 217 91% 60% (vibrant blue for CTAs, active states)
- **Deep Blue**: 217 71% 45% (headers, important actions)
- **Accent Blue**: 200 100% 85% (hover states, highlights)

### Dark Mode (Primary)
- **Background**: 222 47% 11% (deep navy-blue background)
- **Surface**: 217 33% 17% (chat bubbles, cards)
- **Surface Elevated**: 217 28% 22% (sidebar, modals)
- **Border**: 217 20% 28% (subtle dividers)

### Light Mode
- **Background**: 0 0% 100% (pure white)
- **Surface**: 217 75% 97% (very light blue tint)
- **Surface Elevated**: 0 0% 100% (white cards)
- **Border**: 217 25% 88% (soft blue-gray borders)

### Functional Colors
- **Success**: 142 76% 36% (message sent, voice connected)
- **Warning**: 38 92% 50% (voice recording active)
- **Error**: 0 84% 60% (connection issues)
- **Text Primary**: 217 15% 95% (dark mode) / 222 47% 11% (light mode)
- **Text Secondary**: 217 15% 70% (dark mode) / 217 20% 40% (light mode)

---

## Typography

**Font Families**:
- **Interface**: 'Inter', system-ui, -apple-system, sans-serif
- **Code/Technical**: 'JetBrains Mono', monospace (for API responses, code snippets)
- **Kurdish Support**: Ensure full Unicode coverage for Central Kurdish script

**Type Scale**:
- **Display**: text-4xl (36px) font-bold - Main headings
- **Heading**: text-2xl (24px) font-semibold - Section titles
- **Body**: text-base (16px) font-normal - Chat messages, UI text
- **Small**: text-sm (14px) font-medium - Metadata, timestamps
- **Tiny**: text-xs (12px) font-normal - Labels, hints

**Line Height**: 
- Tight (1.25) for headings
- Relaxed (1.6) for chat messages (readability)
- Normal (1.5) for UI elements

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8** consistently
- Micro spacing: p-2, gap-2 (8px)
- Component spacing: p-4, gap-4 (16px)
- Section spacing: p-6, py-8 (24px, 32px)
- Major spacing: p-8, py-12 (32px, 48px)

**Grid Structure**:
- **Sidebar**: w-64 (256px) fixed width
- **Main Chat**: flex-1 with max-w-4xl container
- **Right Panel**: w-80 (320px) for image gallery/history (optional, collapsible)

**Responsive Breakpoints**:
- Mobile: Single column, bottom navigation
- Tablet (md:): Show sidebar, collapsible right panel
- Desktop (lg:): Full three-column layout

---

## Component Library

### A. Chat Interface
**Message Bubbles**:
- User messages: bg-primary (blue), text-white, rounded-2xl, ml-auto, max-w-[80%]
- AI responses: bg-surface, text-primary, rounded-2xl, mr-auto, max-w-[80%]
- Streaming indicator: Animated pulse on AI bubble during generation
- Timestamps: text-tiny, text-secondary, mt-1

**Input Area**:
- Fixed bottom bar: bg-surface-elevated, border-t, p-4
- Textarea: bg-background, border, rounded-xl, focus:ring-2 ring-primary
- Action buttons: Icon buttons in a row (voice, image, send) - size-10, rounded-lg
- Multi-line support with auto-expand up to 5 lines

### B. Voice Controls
**Voice Button States**:
- Idle: Microphone icon, bg-surface, border-2 border-border
- Listening: Red pulse animation, bg-warning/10, border-warning
- Processing: Spinner icon, bg-primary/10
- Speaking: Audio wave animation in blue

**Voice Visualization**:
- Audio waveform display: Animated bars showing voice input level
- Status text: "Listening in Kurdish..." / "Speaking response..."
- Language indicator: Small badge showing active TTS language

### C. Image Generation
**Image Display**:
- Grid layout: grid-cols-1 md:grid-cols-2 gap-4
- Generated images: rounded-xl, shadow-lg, aspect-square object-cover
- Loading state: Skeleton with animated gradient
- Actions overlay: Download, regenerate, copy prompt (on hover)

**Generation Input**:
- Prominent "Generate Image" mode toggle
- Prompt textarea with example suggestions
- Style presets: Buttons for art styles (optional quick picks)

### D. Navigation
**Sidebar**:
- Conversation history: Scrollable list of past chats
- New chat button: Prominent at top, bg-primary, rounded-lg
- Settings/Language toggle: Bottom fixed position
- Collapsible on mobile: Slide-in drawer

**Top Bar**:
- Model selector: Dropdown for GPT-4, image model selection
- Language switcher: Kurdish ⇄ English toggle with flag icons
- Voice settings: Quick access to TTS/STT preferences
- Theme toggle: Sun/moon icon for dark/light mode

### E. System Feedback
**Loading States**:
- Streaming text: Cursor animation at end of typing text
- Image generation: Progress bar with percentage and preview
- Voice processing: Pulsing microphone icon

**Empty States**:
- New chat: Welcome message with suggested prompts
- No images: Illustration + "Generate your first image" CTA
- No history: "Start a conversation" prompt

**Error States**:
- API error: Toast notification, top-right, auto-dismiss
- Voice error: Inline message below input with retry button
- Network error: Banner at top with reconnect action

### F. Overlays & Modals
**Settings Modal**:
- Full-screen overlay: bg-black/50 backdrop-blur
- Panel: max-w-2xl, bg-surface-elevated, rounded-2xl, p-6
- Sections: Voice preferences, API keys (if needed), language defaults
- Close: X button top-right, ESC key support

**Image Preview**:
- Lightbox: Full-screen, dark overlay, image centered
- Navigation: Arrow keys for gallery browsing
- Actions bar: Bottom fixed, bg-surface/80 backdrop-blur

---

## Animations & Interactions

**Minimal, Purposeful Animations**:
- Message appearance: Fade-in + slide-up (200ms)
- Voice pulse: Continuous scale animation when active
- Streaming text: Typing cursor blink
- Button hover: Subtle scale(1.02) + brightness increase (150ms)
- Modal open: Fade-in backdrop + scale-up panel (250ms)

**NO decorative animations** - only functional feedback

---

## Accessibility & Bilingual Support

**RTL Support**:
- Automatic dir="rtl" when Kurdish is active
- Mirror all layouts: Sidebar flips to right, messages align correctly
- Icon flipping: Directional icons rotate for RTL

**Keyboard Navigation**:
- Tab order: Input → Voice → Send → History
- Shortcuts: Ctrl+Enter to send, Ctrl+K for voice
- Focus indicators: 2px ring-primary outline

**Screen Reader**:
- ARIA labels for all icon buttons
- Live region announcements for streaming responses
- Status updates for voice state changes

---

## Performance Considerations

**Fast Loading**:
- Lazy load conversation history (virtual scrolling)
- Progressive image loading with blur-up placeholders
- Code splitting: Load image generation UI only when needed

**Real-time Optimization**:
- WebSocket for streaming (fallback to SSE)
- Debounced typing indicators
- Optimistic UI updates (messages appear instantly)

**Asset Strategy**:
- Icons: Heroicons via CDN (single library)
- Fonts: Google Fonts with font-display: swap
- Images: WebP format with fallbacks

---

## Images

**No Hero Image**: This is a utility application focused on chat interaction.

**Supporting Visuals**:
- Empty state illustrations: Abstract, minimalist blue-toned graphics for "No messages yet"
- Avatar placeholders: User (U) and AI (gradient blue orb) icons
- Generated images: User-created content displayed in grid/gallery

**Image Placement**:
- Message inline: Generated images appear as message content
- Right panel: Optional gallery view of session images
- Settings modal: Icon-based, no decorative images

---

This design creates a **professional, fast, and beautiful AI chatbot** that respects both Kurdish and English users while maintaining the blue aesthetic and prioritizing performance.