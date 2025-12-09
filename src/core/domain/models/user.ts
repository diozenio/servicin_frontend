export type UserType = "COMPANY" | "INDIVIDUAL";

export type UserRole = "PROVIDER" | "CUSTOMER";

export type ContactType = "EMAIL" | "PHONE";

export type Contact = {
  id: string;
  type: ContactType;
  value: string;
};

export type AddressEntity = {
  name: string;
};

export type Address = {
  id: string;
  country: AddressEntity;
  state: AddressEntity;
  city: AddressEntity;
  neighborhood: string;
  street: string;
  zipCode: string;
  number: string;
};

export type ServiceProviderInfo = {
  userId: string;
};

export type Company = {
  corporateName: string;
  cnpj: string;
  tradeName: string;
};

export type Individual = {
  fullName: string;
  cpf: string;
  birthDate: string;
};

export type User = {
  id: string;
  email: string;
  userType: UserType;
  photoUrl: string;
  createdAt: string;
  address: Address;
  contacts: Contact[];
  individual: Individual | null;
  company: Company | null;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type AuthError = {
  message: string;
  field?: string;
};

export type UserWithPassword = User & {
  password: string;
};

export type AuthSession = {
  token: string;
  user: User;
  expiresAt: string;
};
