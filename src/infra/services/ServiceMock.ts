import { ServiceAdapter } from "@/core/interfaces/adapters/ServiceAdapter";
import {
  Service,
  ServiceListResponse,
  ServiceQueryParams,
} from "@/core/domain/models/service";
import { search } from "@/lib/search";

export class ServiceMock extends ServiceAdapter {
  async findAll(params?: ServiceQueryParams): Promise<ServiceListResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const services: Service[] = [
        {
          id: "1",
          title: "Encanador Profissional",
          company: "AquaFix Soluções",
          type: "Urgente",
          requirements: [
            "Licença profissional ativa",
            "5+ anos de experiência",
            "Disponibilidade 24h",
          ],
          location: "São Paulo, SP",
          price: "R$ 80 - 150 por hora",
          rating: 4.8,
          reviews: 127,
          logo: "",
          logoFallback: "AF",
        },
        {
          id: "2",
          title: "Eletricista Especializado",
          company: "VoltTech Elétrica",
          type: "Padrão",
          requirements: [
            "CREA ativo",
            "3+ anos de experiência",
            "Conhecimento em automação",
          ],
          location: "Rio de Janeiro, RJ",
          price: "R$ 100 - 200 por serviço",
          rating: 4.9,
          reviews: 89,
          logo: "",
          logoFallback: "VT",
        },
        {
          id: "3",
          title: "Pintor Residencial",
          company: "ColorCasa Pinturas",
          type: "Orçamento",
          requirements: [
            "Experiência em pintura residencial",
            "2+ anos de experiência",
            "Materiais inclusos",
          ],
          location: "Belo Horizonte, MG",
          price: "R$ 15 - 25 por m²",
          rating: 4.7,
          reviews: 156,
          logo: "",
          logoFallback: "CC",
        },
        {
          id: "4",
          title: "Pedreiro Especialista",
          company: "Construtora Forte",
          type: "Urgente",
          requirements: [
            "Experiência em alvenaria",
            "4+ anos de experiência",
            "Trabalho com acabamento",
          ],
          location: "Salvador, BA",
          price: "R$ 120 - 180 por dia",
          rating: 4.6,
          reviews: 203,
          logo: "",
          logoFallback: "CF",
        },
        {
          id: "5",
          title: "Técnico em Ar Condicionado",
          company: "CoolAir Refrigeração",
          type: "Padrão",
          requirements: [
            "Certificação técnica",
            "3+ anos de experiência",
            "Manutenção preventiva",
          ],
          location: "Fortaleza, CE",
          price: "R$ 90 - 140 por visita",
          rating: 4.8,
          reviews: 94,
          logo: "",
          logoFallback: "CA",
        },
        {
          id: "6",
          title: "Marceneiro Artesão",
          company: "Madeira Nobre",
          type: "Orçamento",
          requirements: [
            "Especialização em móveis sob medida",
            "6+ anos de experiência",
            "Trabalho com madeiras nobres",
          ],
          location: "Curitiba, PR",
          price: "R$ 200 - 400 por m²",
          rating: 4.9,
          reviews: 67,
          logo: "",
          logoFallback: "MN",
        },
      ];

      // Apply filters if params are provided
      let filteredServices = services;

      if (params?.search) {
        filteredServices = search(filteredServices, params.search, {
          keys: ["title", "company"],
          caseSensitive: false,
        });
      }

      if (params?.location) {
        filteredServices = search(filteredServices, params.location, {
          keys: ["location"],
          caseSensitive: false,
        });
      }

      return {
        data: filteredServices,
        success: true,
        message: "Services fetched successfully",
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch services",
      };
    }
  }
}
