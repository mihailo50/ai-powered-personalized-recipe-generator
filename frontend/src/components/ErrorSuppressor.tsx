"use client";

import { useEffect } from "react";

/**
 * Suppresses harmless browser extension errors from the console.
 * These errors come from extensions (like React DevTools) that inject scripts
 * referencing the `browser` API which isn't available in Chrome/Edge.
 */
export function ErrorSuppressor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Store original error handler
    const originalError = console.error;
    const originalWarn = console.warn;

    // Filter out browser extension errors
    const isExtensionError = (args: any[]): boolean => {
      const errorString = args.map((arg) => String(arg)).join(" ");
      return (
        errorString.includes("browser is not defined") ||
        errorString.includes("checkPageManual.js") ||
        errorString.includes("overlays.js") ||
        errorString.includes("content.js") ||
        errorString.includes("chrome-extension://") ||
        errorString.includes("moz-extension://")
      );
    };

    // Override console.error
    console.error = (...args: any[]) => {
      if (!isExtensionError(args)) {
        originalError.apply(console, args);
      }
    };

    // Override console.warn (some extensions use warn instead of error)
    console.warn = (...args: any[]) => {
      if (!isExtensionError(args)) {
        originalWarn.apply(console, args);
      }
    };

    // Also catch unhandled errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || String(event.error);
      if (
        errorMessage.includes("browser is not defined") ||
        errorMessage.includes("checkPageManual.js") ||
        errorMessage.includes("overlays.js") ||
        errorMessage.includes("content.js")
      ) {
        event.preventDefault();
      }
    };

    // Catch unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason);
      if (
        errorMessage.includes("browser is not defined") ||
        errorMessage.includes("checkPageManual.js") ||
        errorMessage.includes("overlays.js") ||
        errorMessage.includes("content.js")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}

