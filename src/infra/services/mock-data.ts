import { Service } from "@/core/domain/models/service";
import { mockLocations } from "../locations/mock-data";
import { faker } from "@faker-js/faker";

const serviceTypes = ["Urgente", "Padrão", "Orçamento"];
const serviceCategories = [
  "Encanador",
  "Eletricista",
  "Pintor",
  "Pedreiro",
  "Técnico em Ar Condicionado",
  "Marceneiro",
  "Jardineiro",
  "Dedetizador",
  "Serralheiro",
  "Vidraceiro",
  "Gesseiro",
  "Impermeabilizador",
  "Marmorista",
  "Instalador de Drywall",
  "Técnico em Energia Solar",
  "Chaveiro",
  "Montador de Móveis",
  "Técnico em Segurança",
  "Desentupidor",
  "Instalador de Piscinas",
  "Técnico em Portões",
  "Limpeza de Fachadas",
  "Instalador de Pisos",
  "Técnico em Aquecedores",
  "Decorador de Interiores",
  "Paisagista",
  "Técnico em Refrigeração",
  "Instalador de Câmeras",
  "Técnico em Elevadores",
  "Instalador de Portas",
  "Técnico em Automação",
  "Instalador de Janelas",
  "Técnico em Hidráulica",
];

const requirementsTemplates = [
  [
    "Licença profissional ativa",
    "5+ anos de experiência",
    "Disponibilidade 24h",
  ],
  ["CREA ativo", "3+ anos de experiência", "Conhecimento em automação"],
  [
    "Experiência em pintura residencial",
    "2+ anos de experiência",
    "Materiais inclusos",
  ],
  [
    "Experiência em alvenaria",
    "4+ anos de experiência",
    "Trabalho com acabamento",
  ],
  ["Certificação técnica", "3+ anos de experiência", "Manutenção preventiva"],
  [
    "Especialização em móveis sob medida",
    "6+ anos de experiência",
    "Trabalho com madeiras nobres",
  ],
  [
    "Conhecimento em paisagismo",
    "3+ anos de experiência",
    "Manutenção de jardins",
  ],
  [
    "Certificação em controle de pragas",
    "4+ anos de experiência",
    "Produtos certificados",
  ],
  [
    "Experiência com metalurgia",
    "5+ anos de experiência",
    "Projetos personalizados",
  ],
  [
    "Experiência em vidros temperados",
    "3+ anos de experiência",
    "Instalação e manutenção",
  ],
];

const priceRanges = [
  "R$ 50 - 150 por hora",
  "R$ 80 - 200 por serviço",
  "R$ 15 - 35 por m²",
  "R$ 100 - 300 por dia",
  "R$ 60 - 120 por visita",
  "R$ 200 - 500 por m²",
  "R$ 70 - 150 por visita",
  "R$ 150 - 400 por serviço",
  "R$ 100 - 300 por m²",
  "R$ 80 - 180 por m²",
];

const generateService = (id: string): Service => {
  const category = faker.helpers.arrayElement(serviceCategories);
  const companyName = faker.company.name();
  const initials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id,
    title: `${category} ${faker.helpers.arrayElement([
      "Profissional",
      "Especializado",
      "Especialista",
      "Técnico",
      "Artesão",
    ])}`,
    company: companyName,
    type: faker.helpers.arrayElement(serviceTypes),
    requirements: faker.helpers.arrayElement(requirementsTemplates),
    location: faker.helpers.arrayElement(mockLocations),
    price: faker.helpers.arrayElement(priceRanges),
    rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 20, max: 500 }),
    logo: "",
    logoFallback: initials,
  };
};

export const mockServices: Service[] = Array.from(
  { length: 1000 },
  (_, index) => generateService((index + 1).toString())
);
