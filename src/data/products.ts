import fitmealImg from "@/assets/fitmeal.jpg";
import tradicionalImg from "@/assets/tradicional.jpg";
import lowcarbImg from "@/assets/lowcarb.jpg";
import vegetarianaImg from "@/assets/vegetariana.jpg";
import type { Product, AddOnProduct, StoreConfig } from "@/types";

export const products: Product[] = [
  {
    id: "fitmeal",
    name: "FitMeal",
    description: "Marmita fitness balanceada para quem busca saúde e sabor em cada refeição.",
    price: 19.90,
    category: "Fit",
    ingredients: ["Frango grelhado", "Batata doce", "Brócolis", "Salada verde", "Azeite de oliva"],
    image: fitmealImg,
    active: true,
    available: true,
    sizes: [
      { id: "p", label: "Pequena (300g)", priceModifier: 0 },
      { id: "m", label: "Média (450g)", priceModifier: 5 },
      { id: "g", label: "Grande (600g)", priceModifier: 10 },
    ],
    flavors: [
      { id: "frango", label: "Frango Grelhado" },
      { id: "peixe", label: "Tilápia Grelhada" },
    ],
  },
  {
    id: "tradicional",
    name: "Tradicional",
    description: "A marmita caseira que lembra o sabor da comida da mamãe.",
    price: 17.90,
    category: "Tradicional",
    ingredients: ["Arroz branco", "Feijão carioca", "Carne bovina", "Salada fresca", "Farofa"],
    image: tradicionalImg,
    active: true,
    available: true,
    sizes: [
      { id: "p", label: "Pequena (350g)", priceModifier: 0 },
      { id: "m", label: "Média (500g)", priceModifier: 5 },
      { id: "g", label: "Grande (650g)", priceModifier: 10 },
    ],
    flavors: [
      { id: "carne", label: "Carne Bovina" },
      { id: "frango", label: "Frango" },
      { id: "porco", label: "Lombo Suíno" },
    ],
  },
  {
    id: "lowcarb",
    name: "Low Carb",
    description: "Opção com menos carboidratos para manter a dieta sem abrir mão do sabor.",
    price: 21.90,
    category: "Low Carb",
    ingredients: ["Frango grelhado", "Abobrinha", "Legumes salteados", "Salada verde", "Azeite"],
    image: lowcarbImg,
    active: true,
    available: true,
    sizes: [
      { id: "p", label: "Pequena (300g)", priceModifier: 0 },
      { id: "m", label: "Média (450g)", priceModifier: 5 },
      { id: "g", label: "Grande (600g)", priceModifier: 10 },
    ],
  },
  {
    id: "vegetariana",
    name: "Vegetariana",
    description: "Sem carne, com muito sabor. Proteína vegetal de qualidade com ingredientes frescos.",
    price: 18.90,
    category: "Vegetariana",
    ingredients: ["Proteína vegetal", "Quinoa", "Grão de bico", "Legumes variados", "Salada fresca"],
    image: vegetarianaImg,
    active: true,
    available: false, // Example: sold out today
    sizes: [
      { id: "p", label: "Pequena (300g)", priceModifier: 0 },
      { id: "m", label: "Média (450g)", priceModifier: 5 },
      { id: "g", label: "Grande (600g)", priceModifier: 10 },
    ],
  },
];

export const addOns: AddOnProduct[] = [
  {
    id: "suco-verde",
    name: "Suco Detox Verde",
    description: "Couve, limão, gengibre e maçã",
    price: 9.90,
    image: fitmealImg,
  },
  {
    id: "suco-laranja",
    name: "Suco de Laranja Natural",
    description: "Laranja espremida na hora",
    price: 7.90,
    image: tradicionalImg,
  },
  {
    id: "sobremesa-fit",
    name: "Brownie Fit",
    description: "Brownie de cacau com whey protein",
    price: 8.90,
    image: lowcarbImg,
  },
];

export const categories = ["Todos", "Fit", "Tradicional", "Low Carb", "Vegetariana"];

export const storeConfig: StoreConfig = {
  whatsappNumber: "5511999999999",
  minOrderValue: 30,
  openingHours: [
    { day: "Segunda", open: "08:00", close: "18:00" },
    { day: "Terça", open: "08:00", close: "18:00" },
    { day: "Quarta", open: "08:00", close: "18:00" },
    { day: "Quinta", open: "08:00", close: "18:00" },
    { day: "Sexta", open: "08:00", close: "18:00" },
    { day: "Sábado", open: "08:00", close: "14:00" },
    { day: "Domingo", open: "", close: "" },
  ],
  closedMessage: "Estamos fechados no momento. Confira nosso horário de funcionamento!",
};
