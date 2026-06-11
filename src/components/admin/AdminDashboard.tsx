import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, MessageCircle, Users, TrendingUp, Loader2, Calendar, AlertCircle } from "lucide-react";

interface Stats {
  pageviews: { total: number; today: number; last7: number; last30: number };
  whatsappOrders: { total: number; today: number; last7: number; last30: number };
  sessions: { total: number; today: number; last7: number; last30: number };
  topPaths: { path: string; count: number }[];
  recentOrders: { created_at: string; metadata: Record<string, unknown> | null }[];
}

const EMPTY: Stats = {
  pageviews: { total: 0, today: 0, last7: 0, last30: 0 },
  whatsappOrders: { total: 0, today: 0, last7: 0, last30: 0 },
  sessions: { total: 0, today: 0, last7: 0, last30: 0 },
  topPaths: [],
  recentOrders: [],
};

function startOfDayISO(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setTableMissing(false);

    const today = startOfDayISO(0);
    const last7 = startOfDayISO(7);
    const last30 = startOfDayISO(30);

    const countWhere = async (eventType: string, sinceISO?: string) => {
      let q = supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", eventType);
      if (sinceISO) q = q.gte("created_at", sinceISO);
      const { count, error } = await q;
      if (error) throw error;
      return count || 0;
    };

    try {
      const [
        pvTotal, pvToday, pv7, pv30,
        woTotal, woToday, wo7, wo30,
        ssTotal, ssToday, ss7, ss30,
      ] = await Promise.all([
        countWhere("pageview"),
        countWhere("pageview", today),
        countWhere("pageview", last7),
        countWhere("pageview", last30),
        countWhere("whatsapp_order"),
        countWhere("whatsapp_order", today),
        countWhere("whatsapp_order", last7),
        countWhere("whatsapp_order", last30),
        countWhere("session_start"),
        countWhere("session_start", today),
        countWhere("session_start", last7),
        countWhere("session_start", last30),
      ]);

      // Top páginas — últimos 30 dias
      const { data: pathRows } = await supabase
        .from("analytics_events")
        .select("path")
        .eq("event_type", "pageview")
        .gte("created_at", last30)
        .limit(5000);

      const pathCounts: Record<string, number> = {};
      (pathRows || []).forEach((r: { path: string | null }) => {
        const p = r.path || "/";
        pathCounts[p] = (pathCounts[p] || 0) + 1;
      });
      const topPaths = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([path, count]) => ({ path, count }));

      // Pedidos recentes
      const { data: recent } = await supabase
        .from("analytics_events")
        .select("created_at, metadata")
        .eq("event_type", "whatsapp_order")
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        pageviews: { total: pvTotal, today: pvToday, last7: pv7, last30: pv30 },
        whatsappOrders: { total: woTotal, today: woToday, last7: wo7, last30: wo30 },
        sessions: { total: ssTotal, today: ssToday, last7: ss7, last30: ss30 },
        topPaths,
        recentOrders: (recent || []) as Stats["recentOrders"],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("analytics_events") || msg.includes("does not exist") || msg.includes("relation")) {
        setTableMissing(true);
      } else {
        console.error("Erro buscando stats:", err);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tableMissing) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h3 className="font-bold text-amber-900">Tabela analytics_events não existe</h3>
        </div>
        <p className="text-sm text-amber-800">
          O dashboard precisa que a tabela <code className="bg-amber-100 px-1 rounded">analytics_events</code> seja criada no Supabase.
        </p>
        <ol className="text-sm text-amber-800 list-decimal pl-5 space-y-1">
          <li>Acesse o <a href="https://supabase.com/dashboard/project/vwcfcyjfsbgfcoprcywc/sql" target="_blank" rel="noopener" className="underline font-semibold">SQL Editor</a></li>
          <li>Execute o conteúdo do arquivo <code className="bg-amber-100 px-1 rounded">supabase/migrations/20260506200000_analytics_events.sql</code></li>
          <li>Recarregue esta página</li>
        </ol>
      </div>
    );
  }

  const hasData = stats.pageviews.total > 0 || stats.whatsappOrders.total > 0;

  return (
    <div className="space-y-6">
      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-900">
          Ainda não há dados. As métricas começam a ser coletadas conforme os visitantes acessam o site.
        </div>
      )}

      {/* Top stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Acessos (pageviews)"
          color="blue"
          stats={stats.pageviews}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Visitantes únicos"
          color="purple"
          stats={stats.sessions}
        />
        <StatCard
          icon={<MessageCircle className="h-5 w-5" />}
          label="Pedidos WhatsApp"
          color="green"
          stats={stats.whatsappOrders}
        />
      </div>

      {/* Conversion */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Taxa de conversão</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <ConversionItem
            label="Hoje"
            views={stats.pageviews.today}
            orders={stats.whatsappOrders.today}
          />
          <ConversionItem
            label="7 dias"
            views={stats.pageviews.last7}
            orders={stats.whatsappOrders.last7}
          />
          <ConversionItem
            label="30 dias"
            views={stats.pageviews.last30}
            orders={stats.whatsappOrders.last30}
          />
        </div>
      </div>

      {/* Top pages */}
      {stats.topPaths.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-3">Páginas mais acessadas (30 dias)</h3>
          <div className="space-y-2">
            {stats.topPaths.map((p) => {
              const max = stats.topPaths[0]?.count || 1;
              const pct = (p.count / max) * 100;
              return (
                <div key={p.path} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-foreground truncate flex-1 mr-2">{p.path}</span>
                    <span className="font-bold text-primary tabular-nums">{p.count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {stats.recentOrders.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Últimos pedidos enviados</h3>
          </div>
          <div className="space-y-2">
            {stats.recentOrders.map((o, i) => {
              const meta = o.metadata as { total?: number; items_count?: number; delivery_mode?: string } | null;
              const total = meta?.total ? `R$ ${meta.total.toFixed(2).replace(".", ",")}` : "—";
              const itemsCount = meta?.items_count ?? "?";
              const mode = meta?.delivery_mode === "delivery" ? "🚚 Entrega" : meta?.delivery_mode === "pickup" ? "🏪 Retirada" : "";
              return (
                <div key={i} className="flex justify-between items-center text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium">
                      {new Date(o.created_at).toLocaleString("pt-BR")}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {itemsCount} {Number(itemsCount) === 1 ? "item" : "itens"} · {mode}
                    </span>
                  </div>
                  <span className="font-bold text-primary">{total}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  color: "blue" | "green" | "purple";
  stats: { total: number; today: number; last7: number; last30: number };
}

function StatCard({ icon, label, color, stats }: StatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-2 tabular-nums">{stats.total.toLocaleString("pt-BR")}</div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="opacity-70">Hoje</div>
          <div className="font-bold tabular-nums">{stats.today}</div>
        </div>
        <div>
          <div className="opacity-70">7d</div>
          <div className="font-bold tabular-nums">{stats.last7}</div>
        </div>
        <div>
          <div className="opacity-70">30d</div>
          <div className="font-bold tabular-nums">{stats.last30}</div>
        </div>
      </div>
    </div>
  );
}

function ConversionItem({ label, views, orders }: { label: string; views: number; orders: number }) {
  const rate = views > 0 ? (orders / views) * 100 : 0;
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <div className="font-display text-2xl font-black text-primary tabular-nums">
        {rate.toFixed(1)}%
      </div>
      <div className="text-xs text-muted-foreground tabular-nums">
        {orders} / {views}
      </div>
    </div>
  );
}
