const SYMBOLS: Record<string, string> = {
  "i-globe":
    '<circle cx="20" cy="20" r="16.5" stroke-dasharray="1.3 3.4"/><circle cx="20" cy="20" r="7.6"/><ellipse cx="20" cy="20" rx="3.3" ry="7.6"/><path d="M12.6 20h14.8"/>',
  "i-stack":
    '<rect x="5.5" y="23.5" width="13" height="9" rx="1"/><rect x="21.5" y="23.5" width="13" height="9" rx="1"/><rect x="13.5" y="12.5" width="13" height="9" rx="1"/>',
  "i-check":
    '<circle cx="20" cy="20" r="16.5" stroke-dasharray="1.3 3.4"/><circle cx="20" cy="20" r="9.6" fill="currentColor" stroke="none"/><path d="M15.9 20.4l2.9 3 5.5-6" stroke="#0a0b0c" stroke-width="2"/>',
  "i-dollar":
    '<path d="M20 5.5v29" stroke-width="1.9"/><path d="M26.6 12.2c-1.7-1.8-3.9-2.6-6.4-2.5-3.2.1-5.6 1.8-5.6 4.3 0 2.8 2.6 3.6 6.2 4.4 3.9.9 6.4 1.9 6.4 4.7 0 2.6-2.5 4.3-6 4.3-2.7 0-5.1-.9-6.8-2.6"/>',
  "i-chevrons":
    '<path d="M11 8.5L21 20 11 31.5"/><path d="M20 8.5L30 20 20 31.5"/>',
  "i-ocean":
    '<path d="M4.5 26h31l-3 7.5h-25z"/><rect x="8.5" y="19" width="9.5" height="6.5" rx=".8"/><rect x="19.5" y="19" width="9.5" height="6.5" rx=".8"/><rect x="14" y="12" width="9.5" height="6" rx=".8"/>',
  "i-land":
    '<path d="M8.5 33c0-9 4.8-14 11.5-14s11.5 5 11.5 14"/><path d="M13.8 33c0-6 2.6-9.2 6.2-9.2s6.2 3.2 6.2 9.2"/><path d="M20 33V9"/><path d="M15.4 13.5L20 9l4.6 4.5"/>',
  "i-air":
    '<path d="M5.5 20h23"/><path d="M22 12.5L29.5 20 22 27.5"/><path d="M10 12.5L5.5 20l4.5 7.5"/>',
  "i-box":
    '<circle cx="20" cy="20" r="16.5" stroke-dasharray="1.3 3.4"/><path d="M12 18.5l8-4.2 8 4.2v9L20 32l-8-4.5z"/><path d="M12 18.5l8 4.3 8-4.3M20 22.8V32"/>',
  "i-bag":
    '<path d="M10.5 13.5h19L28 32.5H12z"/><path d="M15.5 16.5v-4a4.5 4.5 0 019 0v4"/>',
  "i-snow":
    '<path d="M20 6v28M8 13l24 14M32 13L8 27"/><path d="M20 6l-3 3.6M20 6l3 3.6M20 34l-3-3.6M20 34l3-3.6"/>',
  "i-crane":
    '<path d="M9 34V9h21"/><path d="M9 9l-4 6.5h8z"/><path d="M24.5 9v8.5"/><rect x="21.5" y="17.5" width="6" height="5" rx=".8"/><path d="M5 34h28"/>',
  "i-gear":
    '<circle cx="20" cy="20" r="6.4"/><path d="M20 5.5v5M20 29.5v5M5.5 20h5M29.5 20h5M9.8 9.8l3.5 3.5M26.7 26.7l3.5 3.5M30.2 9.8l-3.5 3.5M13.3 26.7l-3.5 3.5"/>',
  "i-bolt":
    '<path d="M23 5.5L11.5 21.5h7.2L17 34.5l11.5-16.4h-7.2z"/>',
  "i-cross":
    '<path d="M16.5 7.5h7v9h9v7h-9v9h-7v-9h-9v-7h9z"/>',
};

/** Inline symbol sheet: one request, no icon dependency. */
export function Sprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      {Object.entries(SYMBOLS).map(([id, body]) => (
        <symbol
          key={id}
          id={id}
          viewBox="0 0 40 40"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      ))}
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 8h18M3 16h18" />
    </svg>
  );
}
