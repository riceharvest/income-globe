import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/root";
import { initPostHog } from "~/lib/posthog";
import "./app.css";

export const meta: Route.MetaFunction = () => [
  { title: "income·globe — world statistics by sex" },
  {
    name: "description",
    content:
      "Explore global statistics on a dark, data-dense world map. Every stat sortable by male or female values per country.",
  },
];

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    initPostHog();
  }, []);
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let detail = "";
  if (isRouteErrorResponse(error)) {
    message = `${error.status}`;
    detail = error.statusText;
  } else if (error instanceof Error) {
    detail = error.message;
  }
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-2 bg-zinc-950 text-zinc-200">
      <h1 className="text-2xl font-semibold">{message}</h1>
      <p className="text-sm text-zinc-500">{detail}</p>
    </main>
  );
}
