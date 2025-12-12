import type { Metadata } from "next";
import { Playfair_Display, Work_Sans, Fira_Code } from "next/font/google";
import "@/app/globals.css";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorHandler } from "@/components/error-handler";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Servicin",
  description: "Serviços elegantes e confiáveis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                const hideOverlay = () => {
                  const selectors = [
                    '[data-nextjs-toast]',
                    '[data-nextjs-dialog]',
                    '#__next-build-watcher',
                    '[data-nextjs-error-overlay]'
                  ];
                  selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      el.style.pointerEvents = 'none';
                    });
                  });
                };
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', hideOverlay);
                } else {
                  hideOverlay();
                }
                const observer = new MutationObserver(hideOverlay);
                observer.observe(document.body, { childList: true, subtree: true });
                setInterval(hideOverlay, 100);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${workSans.variable} ${firaCode.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <div className="min-h-screen">
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ErrorHandler />
                {children}
                <Toaster richColors closeButton position="top-right" />
              </ThemeProvider>
            </div>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
