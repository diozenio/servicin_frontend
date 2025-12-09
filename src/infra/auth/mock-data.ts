import { UserWithPassword } from "@/core/domain/models/user";

const generateAvatarUrl = (name: string): string => {
  const seed = encodeURIComponent(name.trim() || "user");
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
};

export const mockProvider: UserWithPassword = {
  id: "provider_001",
  email: "prestador@example.com",
  userType: "INDIVIDUAL",
  photoUrl: generateAvatarUrl("João Silva"),
  createdAt: new Date("2024-01-01").toISOString(),
  address: {
    id: "addr_provider_001",
    country: { name: "Brasil" },
    state: { name: "São Paulo" },
    city: { name: "São Paulo" },
    neighborhood: "Centro",
    street: "Rua A",
    zipCode: "01000-000",
    number: "123",
  },
  contacts: [
    { id: "ct_p1", type: "EMAIL", value: "prestador@example.com" },
    { id: "ct_p2", type: "PHONE", value: "(11) 99999-9999" },
  ],
  individual: {
    fullName: "João Silva",
    cpf: "00000000000",
    birthDate: "1990-01-01",
  },
  company: null,
  password: "12345678",
  role: "PROVIDER",
};

export const mockCustomer: UserWithPassword = {
  id: "customer_001",
  email: "cliente@example.com",
  userType: "INDIVIDUAL",
  photoUrl: generateAvatarUrl("Maria Santos"),
  createdAt: new Date("2024-01-01").toISOString(),
  address: {
    id: "addr_customer_001",
    country: { name: "Brasil" },
    state: { name: "Rio de Janeiro" },
    city: { name: "Rio de Janeiro" },
    neighborhood: "Copacabana",
    street: "Avenida Atlântica",
    zipCode: "22021-000",
    number: "456",
  },
  contacts: [
    { id: "ct_c1", type: "EMAIL", value: "cliente@example.com" },
    { id: "ct_c2", type: "PHONE", value: "(11) 88888-8888" },
  ],
  individual: {
    fullName: "Maria Santos",
    cpf: "11111111111",
    birthDate: "1992-02-02",
  },
  company: null,
  password: "12345678",
  role: "CUSTOMER",
};

export const mockUsers: Record<string, UserWithPassword> = {
  [mockProvider.email]: mockProvider,
  [mockCustomer.email]: mockCustomer,
};
