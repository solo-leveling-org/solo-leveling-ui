/**
 * Liquid glass theme: black background, white/gray tones, subtle highlights.
 * Use for panels, cards, dialogs. Combine with className "liquid-glass" when no inline override needed.
 */
export const liquidGlass = {
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 24px rgba(0, 0, 0, 0.4)',
} as const;

export const liquidGlassStrong = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 40px rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.4)',
} as const;

/** Text and borders for black theme */
export const theme = {
  text: '#f4f4f5',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  border: 'rgba(255, 255, 255, 0.12)',
  bg: '#000000',
} as const;
