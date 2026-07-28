/**
 * Triggers the native print dialog on mobile devices via Capacitor,
 * or falls back to the standard window.print() on the web.
 */
export const triggerPrint = async () => {
  try {
    window.print();
  } catch (error) {
    console.error('Print failed:', error);
  }
};
