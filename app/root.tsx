import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
} from "react-router";
import { Globe, Search, BarChart3, Calculator } from "lucide-react";
import type { Route } from "./+types/root";
import { initPostHog } from "~/lib/posthog";
import "./app.css";

export const meta: Route.MetaFunction = () => [
  { title: "Income Globe — What the bottom 90% earn worldwide" },
  {
    name: "description",
    content:
      "See what people actually earn in every country. Real income distribution data from WID.world, OECD, and ILO.",
  },
  { property: "og:title", content: "Income Globe — What the bottom 90% earn worldwide" },
  {
    property: "og:description",
    content: "Real income distribution data for 31 countries. See where you fit.",
  },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://income-globe.vercel.app" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Income Globe — What the bottom 90% earn worldwide" },
  {
    name: "twitter:description",
    content: "Real income distribution data for 31 countries. See where you fit.",
  },
];

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

const navLinks = [
  { to: "/", label: "Explore", icon: Search, end: true },
  { to: "/compare", label: "Compare", icon: BarChart3 },
  { to: "/calculator", label: "Where Do I Fit?", icon: Calculator },
];

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"
            >
              <Globe className="h-5 w-5 text-primary" />
              <span>Income Globe</span>
            </NavLink>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold">{message}</h1>
      <p className="mt-2 text-muted-foreground">{details}</p>
      {stack && (
        <pre className="mt-4 max-w-full overflow-x-auto rounded-lg bg-muted p-4 text-left text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
