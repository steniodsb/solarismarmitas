/**
 * Grava o pedido no banco antes de abrir o WhatsApp.
 *
 * Até aqui o carrinho morria no navegador: o analytics registrava só
 * total e quantidade de itens, então não havia como saber QUAIS sabores
 * foram vendidos. Isto é o que alimenta o relatório de mais/menos
 * vendidos por categoria.
 *
 * Regra de ouro: gravar é secundário ao pedido. Se o banco estiver fora
 * do ar ou a policy recusar, o cliente NÃO pode ser impedido de mandar a
 * mensagem — por isso nada aqui lança para fora.
 */
import { supabase } from "@/integrations/supabase/client";
import type { FrozenCartItem } from "@/contexts/FrozenCartContext";

export interface DadosPedido {
  transactionId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  notes: string;
  itemsCount: number;
  total: number;
  deliveryMode?: string;
}

/** UUID v4. Usa a API nativa quando disponível (exige contexto seguro). */
function novoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Retorna o id do pedido gravado, ou null se não deu para gravar.
 * Nunca lança.
 */
export async function salvarPedido(
  dados: DadosPedido,
  itens: FrozenCartItem[],
): Promise<string | null> {
  try {
    // O id é gerado aqui de propósito. Pedir o id de volta com .select()
    // faria o PostgREST exigir permissão de SELECT, e visitante anônimo
    // não pode ler a tabela de pedidos (ela guarda nome, telefone e
    // endereço de clientes). Gerando o id no cliente, INSERT basta.
    const orderId = novoId();

    const { error: erroPedido } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        transaction_id: dados.transactionId,
        customer_name: dados.customerName || null,
        customer_phone: dados.customerPhone || null,
        address: dados.address || null,
        city: dados.city || null,
        notes: dados.notes || null,
        delivery_mode: dados.deliveryMode ?? "delivery",
        items_count: dados.itemsCount,
        total: dados.total,
        source: "site",
      });

    if (erroPedido) {
      console.warn("[pedido] não foi possível gravar o cabeçalho:", erroPedido.message);
      return null;
    }

    // Nome e rótulos vão como texto de propósito: se o sabor for renomeado
    // ou removido do catálogo, o histórico continua legível.
    const linhas = itens.map((i) => ({
      order_id: orderId,
      flavor_id: i.flavor.id,
      category_id: i.category.id,
      size_id: i.size.id,
      flavor_name: i.flavor.name,
      category_name: i.category.name,
      category_slug: i.category.slug,
      size_label: i.size.label,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      subtotal: Number((i.unitPrice * i.quantity).toFixed(2)),
    }));

    const { error: erroItens } = await supabase.from("order_items").insert(linhas);
    if (erroItens) {
      console.warn("[pedido] cabeçalho gravado, mas os itens falharam:", erroItens.message);
    }

    return orderId;
  } catch (e) {
    console.warn("[pedido] falha inesperada ao gravar:", e);
    return null;
  }
}
