"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ErrorHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hideNextOverlay = () => {
      const selectors = [
        "[data-nextjs-toast]",
        "[data-nextjs-dialog]",
        "#__next-build-watcher",
        "[data-nextjs-error-overlay]",
      ];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.display = "none";
          htmlEl.style.visibility = "hidden";
          htmlEl.style.opacity = "0";
          htmlEl.style.pointerEvents = "none";
        });
      });
    };

    hideNextOverlay();

    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      hideNextOverlay();
      toast.error("Erro de sistema");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      hideNextOverlay();
      toast.error("Erro de sistema");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const observer = new MutationObserver(() => {
      hideNextOverlay();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const interval = setInterval(hideNextOverlay, 100);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
