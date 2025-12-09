import { Service } from "@/core/domain/models/service";
import { mockLocations } from "../locations/mock-data";
import { faker } from "@faker-js/faker";
import { mockProvider } from "../auth/mock-data";

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

const durationRanges = [
  "1-2 horas",
  "2-4 horas",
  "4-8 horas",
  "1-2 dias",
  "2-3 dias",
  "3-5 dias",
  "1 semana",
  "1-2 semanas",
  "2-4 semanas",
  "Sob consulta",
];

const descriptions = [
  "Serviço profissional com garantia de qualidade e pontualidade. Atendimento especializado para residências e empresas.",
  "Especialista com anos de experiência no mercado, oferecendo soluções personalizadas e materiais de primeira qualidade.",
  "Técnico certificado com equipamentos modernos e técnicas atualizadas. Atendimento 24h para emergências.",
  "Profissional qualificado com foco em excelência e satisfação do cliente. Orçamento sem compromisso.",
  "Serviço completo com mão de obra especializada e materiais inclusos. Garantia estendida disponível.",
  "Atendimento personalizado com acompanhamento completo do projeto. Equipe técnica especializada.",
  "Soluções inovadoras e sustentáveis para seu projeto. Profissional com certificações técnicas.",
  "Atendimento diferenciado com foco na qualidade e prazo de entrega. Materiais de primeira linha.",
  "Especialista em projetos complexos com equipe técnica qualificada. Garantia total do serviço.",
  "Profissional experiente com portfólio diversificado. Atendimento personalizado e orçamento gratuito.",
];

const generateService = (id: string): Service => {
  const category = faker.helpers.arrayElement(serviceCategories);
  const companyName = mockProvider.company?.corporateName || "Acme Ltda";
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
    description: faker.helpers.arrayElement(descriptions),
    duration: faker.helpers.arrayElement(durationRanges),
    whatsappContact: faker.helpers.maybe(
      () =>
        `+55${faker.number.int({ min: 11, max: 99 })}${faker.number.int({
          min: 100000000,
          max: 999999999,
        })}`,
      { probability: 0.8 }
    ),
    providerId: mockProvider.id,
  };
};

export const mockServices: Service[] = Array.from({ length: 60 }, (_, index) =>
  generateService((index + 1).toString())
);
