import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "solaris_session_started";

export async function trackEvent(
  eventType: string,
  path: string | null = null,
  metadata: Record<string, unknown> | null = null
) {
  try {
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      path,
      metadata: metadata as never,
    });
  } catch {
    // tracking falha em silêncio — não afeta UX
  }
}

export function useAnalyticsTracking() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (lastPath.current === path) return;
    lastPath.current = path;

    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      trackEvent("session_start", path);
    }

    trackEvent("pageview", path);
  }, [location.pathname]);
}
