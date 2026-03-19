import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function TrackingScripts() {
  const { data: config } = useQuery({
    queryKey: ["store-config-tracking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_config")
        .select("facebook_pixel_id, google_analytics_id, google_tag_manager_id, tiktok_pixel_id, custom_head_scripts")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!config) return;

    // Facebook Pixel
    if (config.facebook_pixel_id) {
      const script = document.createElement("script");
      script.id = "fb-pixel";
      script.innerHTML = `
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${config.facebook_pixel_id}');
        fbq('track','PageView');
      `;
      if (!document.getElementById("fb-pixel")) document.head.appendChild(script);

      const noscript = document.createElement("noscript");
      noscript.id = "fb-pixel-ns";
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${config.facebook_pixel_id}&ev=PageView&noscript=1"/>`;
      if (!document.getElementById("fb-pixel-ns")) document.body.appendChild(noscript);
    }

    // Google Analytics (GA4)
    if (config.google_analytics_id) {
      if (!document.getElementById("ga-script")) {
        const gaTag = document.createElement("script");
        gaTag.id = "ga-script";
        gaTag.async = true;
        gaTag.src = `https://www.googletagmanager.com/gtag/js?id=${config.google_analytics_id}`;
        document.head.appendChild(gaTag);

        const gaInit = document.createElement("script");
        gaInit.id = "ga-init";
        gaInit.innerHTML = `
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','${config.google_analytics_id}');
        `;
        document.head.appendChild(gaInit);
      }
    }

    // Google Tag Manager
    if (config.google_tag_manager_id) {
      if (!document.getElementById("gtm-script")) {
        const gtmScript = document.createElement("script");
        gtmScript.id = "gtm-script";
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${config.google_tag_manager_id}');
        `;
        document.head.appendChild(gtmScript);
      }
    }

    // TikTok Pixel
    if (config.tiktok_pixel_id) {
      if (!document.getElementById("tt-pixel")) {
        const ttScript = document.createElement("script");
        ttScript.id = "tt-pixel";
        ttScript.innerHTML = `
          !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
          ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
          var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
          var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${config.tiktok_pixel_id}');
          ttq.page();
          }(window,document,'ttq');
        `;
        document.head.appendChild(ttScript);
      }
    }

    // Custom head scripts
    if (config.custom_head_scripts) {
      if (!document.getElementById("custom-scripts")) {
        const customDiv = document.createElement("div");
        customDiv.id = "custom-scripts";
        customDiv.innerHTML = config.custom_head_scripts;
        const scripts = customDiv.querySelectorAll("script");
        scripts.forEach((s) => {
          const newScript = document.createElement("script");
          if (s.src) newScript.src = s.src;
          else newScript.innerHTML = s.innerHTML;
          if (s.async) newScript.async = true;
          document.head.appendChild(newScript);
        });
      }
    }
  }, [config]);

  return null;
}
