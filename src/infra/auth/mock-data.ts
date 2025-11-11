import { UserWithPassword, UserRole } from "@/core/domain/models/user";

const generateAvatarUrl = (name: string): string => {
  const seed = encodeURIComponent(name.trim() || "user");
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
};

export const mockProvider: UserWithPassword = {
  id: "provider_001",
  name: "João Silva",
  email: "prestador@example.com",
  phone: "(11) 99999-9999",
  password: "12345678",
  avatarUrl: generateAvatarUrl("João Silva"),
  role: "provider",
  createdAt: new Date("2024-01-01").toISOString(),
};

export const mockCustomer: UserWithPassword = {
  id: "customer_001",
  name: "Maria Santos",
  email: "cliente@example.com",
  phone: "(11) 88888-8888",
  password: "12345678",
  avatarUrl: generateAvatarUrl("Maria Santos"),
  role: "customer",
  createdAt: new Date("2024-01-01").toISOString(),
};

export const mockUsers: Record<string, UserWithPassword> = {
  [mockProvider.email]: mockProvider,
  [mockCustomer.email]: mockCustomer,
};
