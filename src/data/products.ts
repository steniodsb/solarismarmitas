import fitmealImg from "@/assets/fitmeal.jpg";
import tradicionalImg from "@/assets/tradicional.jpg";
import lowcarbImg from "@/assets/lowcarb.jpg";
import vegetarianaImg from "@/assets/vegetariana.jpg";
import type { Product } from "@/types";

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
  },
  {
    id: "tradicional",
    name: "Tradicional",
    description: "A marmita caseira que lembra o sabor da comida da mamãe. Receitas tradicionais feitas com carinho.",
    price: 17.90,
    category: "Tradicional",
    ingredients: ["Arroz branco", "Feijão carioca", "Carne bovina", "Salada fresca", "Farofa"],
    image: tradicionalImg,
    active: true,
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
  },
];

export const categories = ["Todos", "Fit", "Tradicional", "Low Carb", "Vegetariana"];
