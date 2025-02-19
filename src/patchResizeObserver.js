// src/patchResizeObserver.js

if (typeof window !== 'undefined') {
    // === 1. Override console.error to filter out the warning ===
    if (process.env.NODE_ENV !== 'production') {
      const originalConsoleError = console.error.bind(console);
      console.error = (...args) => {
        if (
          args[0] &&
          typeof args[0] === 'string' &&
          (args[0].includes('ResizeObserver loop completed with undelivered notifications') ||
           args[0].includes('ResizeObserver loop limit exceeded'))
        ) {
          return;
        }
        originalConsoleError(...args);
      };
    }
  
    // === 2. Add a global error event listener to prevent the error from propagating ===
    window.addEventListener('error', (event) => {
      if (
        event.message &&
        (event.message.includes('ResizeObserver loop completed with undelivered notifications') ||
         event.message.includes('ResizeObserver loop limit exceeded'))
      ) {
        // Prevent this error from being reported in the console.
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        return true;
      }
    });
  
    // === 3. Patch the ResizeObserver constructor to wrap the callback ===
    if (window.ResizeObserver) {
      const OriginalResizeObserver = window.ResizeObserver;
      window.ResizeObserver = class extends OriginalResizeObserver {
        constructor(callback) {
          const wrappedCallback = (entries, observer) => {
            try {
              callback(entries, observer);
            } catch (error) {
              if (
                error &&
                error.message &&
                (error.message.includes('ResizeObserver loop completed') ||
                 error.message.includes('ResizeObserver loop limit exceeded'))
              ) {
                // Suppress this specific error.
                return;
              }
              console.error(error);
            }
          };
          super(wrappedCallback);
        }
      };
    }
  }
  