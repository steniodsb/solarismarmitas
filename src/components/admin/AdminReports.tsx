import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, TrendingDown, Package, DollarSign, AlertCircle } from "lucide-react";

/**
 * Relatório de mais e menos vendidos por categoria.
 *
 * Lê de order_items, que só passou a ser preenchida quando a gravação de
 * pedidos subiu. Pedidos anteriores a isso não têm os itens registrados —
 * o carrinho ia direto para o WhatsApp e nada além de total e quantidade
 * chegava ao banco. Por isso a tela avisa a data do primeiro registro.
 */

interface ItemVendido {
  flavor_id: string | null;
  flavor_name: string;
  category_name: string;
  category_slug: string | null;
  quantity: number;
  subtotal: number;
  created_at: string;
}

interface LinhaRanking {
  chave: string;
  sabor: string;
  unidades: number;
  receita: number;
  pedidos: number;
}

interface BlocoCategoria {
  categoria: string;
  unidades: number;
  receita: number;
  itens: LinhaRanking[];
}

const PERIODOS = [
  { valor: 7, rotulo: "7 dias" },
  { valor: 30, rotulo: "30 dias" },
  { valor: 90, rotulo: "90 dias" },
  { valor: 0, rotulo: "Tudo" },
] as const;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminReports() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [itens, setItens] = useState<ItemVendido[]>([]);
  const [periodo, setPeriodo] = useState<number>(30);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [primeiroRegistro, setPrimeiroRegistro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    const buscar = async () => {
      setCarregando(true);
      setErro(null);
      try {
        let consulta = supabase
          .from("order_items")
          .select("flavor_id, flavor_name, category_name, category_slug, quantity, subtotal, created_at")
          .order("created_at", { ascending: false });

        if (periodo > 0) {
          const desde = new Date();
          desde.setDate(desde.getDate() - periodo);
          consulta = consulta.gte("created_at", desde.toISOString());
        }

        const [{ data, error }, contagem, primeiro] = await Promise.all([
          consulta,
          supabase.from("orders").select("id", { count: "exact", head: true }),
          supabase.from("order_items").select("created_at").order("created_at", { ascending: true }).limit(1),
        ]);

        if (cancelado) return;
        if (error) throw error;

        setItens((data ?? []) as ItemVendido[]);
        setTotalPedidos(contagem.count ?? 0);
        setPrimeiroRegistro(primeiro.data?.[0]?.created_at ?? null);
      } catch (e) {
        if (!cancelado) setErro(e instanceof Error ? e.message : "Erro ao carregar o relatório");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    buscar();
    return () => { cancelado = true; };
  }, [periodo]);

  const blocos = useMemo<BlocoCategoria[]>(() => {
    const porCategoria = new Map<string, Map<string, LinhaRanking>>();

    for (const item of itens) {
      const cat = item.category_name || "Sem categoria";
      // Agrupa por sabor. Usa o id quando existe; se o sabor foi apagado
      // do catálogo, cai no nome para não perder a linha do histórico.
      const chave = item.flavor_id ?? `nome:${item.flavor_name}`;

      if (!porCategoria.has(cat)) porCategoria.set(cat, new Map());
      const mapa = porCategoria.get(cat)!;
      const atual = mapa.get(chave) ?? {
        chave, sabor: item.flavor_name, unidades: 0, receita: 0, pedidos: 0,
      };
      atual.unidades += Number(item.quantity) || 0;
      atual.receita += Number(item.subtotal) || 0;
      atual.pedidos += 1;
      mapa.set(chave, atual);
    }

    return [...porCategoria.entries()]
      .map(([categoria, mapa]) => {
        const lista = [...mapa.values()].sort((a, b) => b.unidades - a.unidades);
        return {
          categoria,
          unidades: lista.reduce((s, i) => s + i.unidades, 0),
          receita: lista.reduce((s, i) => s + i.receita, 0),
          itens: lista,
        };
      })
      .sort((a, b) => b.unidades - a.unidades);
  }, [itens]);

  const totais = useMemo(() => {
    const unidades = itens.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
    const receita = itens.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);
    return { unidades, receita };
  }, [itens]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Relatórios de vendas</h2>
          <p className="text-sm text-muted-foreground">
            Mais e menos vendidos por categoria, com base nos pedidos enviados pelo site.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {PERIODOS.map((p) => (
            <button
              key={p.valor}
              onClick={() => setPeriodo(p.valor)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                periodo === p.valor
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.rotulo}
            </button>
          ))}
        </div>
      </div>

      {erro && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {erro}
        </div>
      )}

      {/* O histórico começa na data em que a gravação de pedidos entrou no ar. */}
      {primeiroRegistro && (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Os dados começam em{" "}
            <strong>{new Date(primeiroRegistro).toLocaleDateString("pt-BR")}</strong>, quando o
            registro de itens por pedido entrou no ar. Pedidos anteriores não têm os sabores
            gravados.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Cartao icone={<Package className="h-4 w-4" />} rotulo="Unidades vendidas" valor={String(totais.unidades)} />
        <Cartao icone={<DollarSign className="h-4 w-4" />} rotulo="Receita" valor={brl(totais.receita)} />
        <Cartao icone={<Package className="h-4 w-4" />} rotulo="Pedidos (total)" valor={String(totalPedidos)} />
        <Cartao
          icone={<DollarSign className="h-4 w-4" />}
          rotulo="Ticket médio por item"
          valor={totais.unidades ? brl(totais.receita / totais.unidades) : "—"}
        />
      </div>

      {blocos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 font-semibold text-foreground">Nenhuma venda no período</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Assim que o primeiro pedido for enviado pelo site, o ranking aparece aqui.
          </p>
        </div>
      ) : (
        blocos.map((bloco) => {
          const maisVendidos = bloco.itens.slice(0, 5);
          // Só faz sentido falar em "menos vendido" quando há mais de um
          // sabor; e nunca repetimos itens que já apareceram no topo.
          const menosVendidos =
            bloco.itens.length > 1
              ? [...bloco.itens].reverse().slice(0, 5).filter((i) => !maisVendidos.includes(i))
              : [];

          return (
            <div key={bloco.categoria} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <h3 className="font-display font-bold text-foreground">{bloco.categoria}</h3>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span><strong className="text-foreground">{bloco.unidades}</strong> unidades</span>
                  <span><strong className="text-foreground">{brl(bloco.receita)}</strong></span>
                  <span><strong className="text-foreground">{bloco.itens.length}</strong> sabores vendidos</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <Ranking
                  titulo="Mais vendidos"
                  icone={<TrendingUp className="h-4 w-4 text-emerald-600" />}
                  linhas={maisVendidos}
                  maximo={bloco.itens[0]?.unidades ?? 1}
                  cor="bg-emerald-500"
                />
                {menosVendidos.length > 0 ? (
                  <Ranking
                    titulo="Menos vendidos"
                    icone={<TrendingDown className="h-4 w-4 text-amber-600" />}
                    linhas={menosVendidos}
                    maximo={bloco.itens[0]?.unidades ?? 1}
                    cor="bg-amber-500"
                  />
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    Só um sabor vendido nesta categoria no período.
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function Cartao({ icone, rotulo, valor }: { icone: React.ReactNode; rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        {icone}
        <span>{rotulo}</span>
      </div>
      <p className="mt-1 font-display text-xl font-bold text-foreground">{valor}</p>
    </div>
  );
}

function Ranking({
  titulo, icone, linhas, maximo, cor,
}: {
  titulo: string;
  icone: React.ReactNode;
  linhas: LinhaRanking[];
  maximo: number;
  cor: string;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icone}
        {titulo}
      </div>
      {linhas.map((linha, i) => (
        <div key={linha.chave} className="space-y-1">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="truncate text-foreground">
              <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
              {linha.sabor}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              <strong className="text-foreground">{linha.unidades}</strong> un · {brl(linha.receita)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${cor} rounded-full`}
              style={{ width: `${Math.max(4, (linha.unidades / maximo) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
