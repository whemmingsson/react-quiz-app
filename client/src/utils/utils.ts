const generateGuid = () => {
  // Use crypto.randomUUID if available (modern browsers)
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback implementation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

  export { generateGuid };