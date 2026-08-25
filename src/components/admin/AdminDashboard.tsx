import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, MessageCircle, Users, TrendingUp, Loader2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface Stats {
  pageviews: number;
  whatsappOrders: number;
  sessions: number;
  topPaths: { path: string; count: number }[];
  recentOrders: { created_at: string; metadata: Record<string, unknown> | null }[];
}

const EMPTY: Stats = {
  pageviews: 0,
  whatsappOrders: 0,
  sessions: 0,
  topPaths: [],
  recentOrders: [],
};

type Preset = "today" | "yesterday" | "7d" | "30d" | "custom";

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "custom", label: "Personalizado" },
];

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function endOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(23, 59, 59, 999);
  return c;
}

function getRange(preset: Preset, custom: DateRange | undefined) {
  const now = new Date();

  if (preset === "yesterday") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return { start: startOfDay(y), end: endOfDay(y), label: "Ontem" };
  }
  if (preset === "7d") {
    const s = new Date(now);
    s.setDate(s.getDate() - 6);
    return { start: startOfDay(s), end: endOfDay(now), label: "Últimos 7 dias" };
  }
  if (preset === "30d") {
    const s = new Date(now);
    s.setDate(s.getDate() - 29);
    return { start: startOfDay(s), end: endOfDay(now), label: "Últimos 30 dias" };
  }
  if (preset === "custom") {
    const from = custom?.from ? startOfDay(custom.from) : startOfDay(now);
    const to = custom?.to ? endOfDay(custom.to) : endOfDay(custom?.from ?? now);
    const sameDay = from.toDateString() === to.toDateString();
    return {
      start: from,
      end: to,
      label: sameDay
        ? format(from, "dd/MM/yyyy")
        : `${format(from, "dd/MM/yyyy")} – ${format(to, "dd/MM/yyyy")}`,
    };
  }
  return { start: startOfDay(now), end: endOfDay(now), label: "Hoje" };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);
  const [preset, setPreset] = useState<Preset>("today");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [pickerOpen, setPickerOpen] = useState(false);

  const range = useMemo(() => getRange(preset, customRange), [preset, customRange]);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.start.getTime(), range.end.getTime()]);

  const fetchStats = async () => {
    setLoading(true);
    setTableMissing(false);

    const startISO = range.start.toISOString();
    const endISO = range.end.toISOString();

    const countWhere = async (eventType: string) => {
      const { count, error } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", eventType)
        .gte("created_at", startISO)
        .lte("created_at", endISO);
      if (error) throw error;
      return count || 0;
    };

    try {
      const [pageviews, whatsappOrders, sessions] = await Promise.all([
        countWhere("pageview"),
        countWhere("whatsapp_order"),
        countWhere("session_start"),
      ]);

      // Top páginas no período selecionado
      const { data: pathRows } = await supabase
        .from("analytics_events")
        .select("path")
        .eq("event_type", "pageview")
        .gte("created_at", startISO)
        .lte("created_at", endISO)
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

      // Pedidos enviados no período selecionado
      const { data: recent } = await supabase
        .from("analytics_events")
        .select("created_at, metadata")
        .eq("event_type", "whatsapp_order")
        .gte("created_at", startISO)
        .lte("created_at", endISO)
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        pageviews,
        whatsappOrders,
        sessions,
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
          <li>Acesse o <a href="https://supabase.com/dashboard/project/crrvzgvhjvkpihxsraiw/sql" target="_blank" rel="noopener" className="underline font-semibold">SQL Editor</a></li>
          <li>Execute o conteúdo do arquivo <code className="bg-amber-100 px-1 rounded">supabase/migrations/20260506200000_analytics_events.sql</code></li>
          <li>Recarregue esta página</li>
        </ol>
      </div>
    );
  }

  const hasData = stats.pageviews > 0 || stats.whatsappOrders > 0;

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => {
          if (p.key === "custom") {
            return (
              <Popover key={p.key} open={pickerOpen} onOpenChange={setPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={preset === "custom" ? "default" : "outline"}
                    size="sm"
                    className="h-9 gap-1.5"
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {preset === "custom" ? range.label : "Personalizado"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    locale={ptBR}
                    selected={customRange}
                    defaultMonth={customRange?.from}
                    onSelect={(r) => {
                      setCustomRange(r);
                      setPreset("custom");
                      if (r?.from && r?.to) setPickerOpen(false);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            );
          }
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              className={cn(
                "px-3 h-9 rounded-md text-sm font-medium border transition-colors",
                preset === p.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Período: {format(range.start, "dd/MM/yyyy", { locale: ptBR })} –{" "}
        {format(range.end, "dd/MM/yyyy", { locale: ptBR })}
      </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {!hasData && (
            <div className="bg-muted border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground">
              Nenhum dado para o período selecionado ({range.label}).
            </div>
          )}

          {/* Top stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              icon={<Eye className="h-5 w-5" />}
              label="Acessos (pageviews)"
              color="blue"
              value={stats.pageviews}
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Visitantes únicos"
              color="purple"
              value={stats.sessions}
            />
            <StatCard
              icon={<MessageCircle className="h-5 w-5" />}
              label="Pedidos WhatsApp"
              color="green"
              value={stats.whatsappOrders}
            />
          </div>

          {/* Conversion */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Taxa de conversão · {range.label}</h3>
            </div>
            <ConversionItem views={stats.pageviews} orders={stats.whatsappOrders} />
          </div>

          {/* Top pages */}
          {stats.topPaths.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-3">Páginas mais acessadas · {range.label}</h3>
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
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">Pedidos enviados · {range.label}</h3>
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
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  color: "blue" | "green" | "purple";
  value: number;
}

function StatCard({ icon, label, color, value }: StatCardProps) {
  const colors = {
    blue: "bg-card text-blue-700 border-border",
    green: "bg-card text-green-700 border-border",
    purple: "bg-card text-purple-700 border-border",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-3xl font-bold tabular-nums">{value.toLocaleString("pt-BR")}</div>
    </div>
  );
}

function ConversionItem({ views, orders }: { views: number; orders: number }) {
  const rate = views > 0 ? (orders / views) * 100 : 0;
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-black text-primary tabular-nums">
        {rate.toFixed(1)}%
      </div>
      <div className="text-xs text-muted-foreground tabular-nums mt-1">
        {orders} pedidos / {views} acessos
      </div>
    </div>
  );
}
