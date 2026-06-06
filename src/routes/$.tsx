import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import indexCss from "../index.css?url";
import App from "../App";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "App" },
      { name: "description", content: "Mobile-first app with Home, Goals, and Me." },
    ],
    links: [{ rel: "stylesheet", href: indexCss }],
  }),
  component: SplatRoute,
});

function SplatRoute() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <App />;
}
