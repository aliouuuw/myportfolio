/* Shallow-merge locale overlays onto window.FLOW_DATA. Arrays replace; objects merge. */
window.applyFlowLocale = function applyFlowLocale(overlay) {
  const base = window.FLOW_DATA;
  if (!base || !overlay) return;

  for (const key of Object.keys(overlay)) {
    const value = overlay[key];
    if (Array.isArray(value)) {
      base[key] = value;
    } else if (value && typeof value === 'object') {
      base[key] = { ...(base[key] ?? {}), ...value };
    } else {
      base[key] = value;
    }
  }
};
