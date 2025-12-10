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
  number: string | null;
};

export type ServiceProviderInfo = {
  userId: string;
};

export type Company = {
  corporateName: string;
  cnpj: string;
  tradeName: string | null;
};

export type Individual = {
  fullName: string;
  cpf: string;
  birthDate: string | null;
};

export type User = {
  id: string;
  email: string;
  userType: UserType;
  photoUrl: string | null;
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

export type SignupAddressRequest = {
  street: string;
  cityId: string;
  stateId: string;
  zipCode: string;
  neighborhood: string;
  number: string;
};

export type SignupContactRequest = {
  type: ContactType;
  value: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  birthDate: string | null;
  userType: "INDIVIDUAL";
  photoUrl?: string;
  address: SignupAddressRequest;
  contacts: SignupContactRequest[];
};

export type LoginResponse = {
  token: string;
};

export type SignupResponse = {
  token: string;
};

export type LogoutResponse = null;

export type GetCurrentUserResponse = User | null;

export type DeleteAccountResponse = null;
