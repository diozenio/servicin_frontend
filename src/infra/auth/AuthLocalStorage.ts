import { AuthAdapter } from "@/core/interfaces/adapters/AuthAdapter";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  UserWithPassword,
  AuthSession,
} from "@/core/domain/models/user";
import { LocalStorage, STORAGE_KEYS } from "@/lib/local-storage";
import { mockUsers } from "./mock-data";

export class AuthLocalStorage implements AuthAdapter {
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateToken(userId: string): string {
    const tokenData = {
      userId,
      timestamp: Date.now(),
      type: "auth",
    };
    return btoa(JSON.stringify(tokenData));
  }

  private generateAvatarUrl(name: string): string {
    const seed = encodeURIComponent(name.trim() || "user");
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
  }

  private getUsers(): Map<string, UserWithPassword> {
    const usersData = LocalStorage.get<Record<string, UserWithPassword>>(
      STORAGE_KEYS.USERS,
      {}
    );
    const usersMap = new Map<string, UserWithPassword>(
      Object.entries(usersData) as [string, UserWithPassword][]
    );

    if (usersMap.size === 0) {
      Object.entries(mockUsers).forEach(([email, user]) => {
        usersMap.set(email, user);
      });
      this.saveUsers(usersMap);
    }

    return usersMap;
  }

  private saveUsers(users: Map<string, UserWithPassword>): void {
    const usersObject = Object.fromEntries(users);
    LocalStorage.set(STORAGE_KEYS.USERS, usersObject);
  }

  private getCurrentSession(): AuthSession | null {
    return LocalStorage.get(STORAGE_KEYS.AUTH, null);
  }

  private saveSession(session: AuthSession): void {
    LocalStorage.set(STORAGE_KEYS.AUTH, session);
  }

  private clearSession(): void {
    LocalStorage.remove(STORAGE_KEYS.AUTH);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const users = this.getUsers();
    const userWithPassword = users.get(credentials.email);

    if (!userWithPassword) {
      throw new Error("Email não encontrado");
    }

    if (userWithPassword.password !== credentials.password) {
      throw new Error("Senha incorreta");
    }

    const user: User = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      userType: userWithPassword.userType,
      photoUrl: userWithPassword.photoUrl,
      createdAt: userWithPassword.createdAt,
      address: userWithPassword.address,
      contacts: userWithPassword.contacts,
      individual: userWithPassword.individual,
      company: userWithPassword.company,
      role: userWithPassword.role,
    };

    const token = this.generateToken(user.id);
    const session: AuthSession = {
      token,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.saveSession(session);

    return { user, token };
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    if (userData.password !== userData.confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    if (userData.password.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres");
    }

    const users = this.getUsers();

    if (users.has(userData.email)) {
      throw new Error("Este email já está cadastrado");
    }

    const userId = this.generateUserId();
    const user: User = {
      id: userId,
      email: userData.email,
      userType: "INDIVIDUAL",
      photoUrl: this.generateAvatarUrl(userData.name),
      createdAt: new Date().toISOString(),
      address: {
        id: `addr_${userId}`,
        country: { name: "" },
        state: { name: "" },
        city: { name: "" },
        neighborhood: "",
        street: "",
        zipCode: "",
        number: "",
      },
      contacts: [
        { id: `ct_email_${userId}`, type: "EMAIL", value: userData.email },
        ...(userData.phone
          ? ([
              {
                id: `ct_phone_${userId}`,
                type: "PHONE",
                value: userData.phone,
              },
            ] as const)
          : []),
      ],
      individual: { fullName: userData.name, cpf: "", birthDate: "" },
      company: null,
      role: "CUSTOMER",
    };

    const userWithPassword: UserWithPassword = {
      ...user,
      password: userData.password,
    };

    users.set(userData.email, userWithPassword);
    this.saveUsers(users);

    const token = this.generateToken(user.id);
    const session: AuthSession = {
      token,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.saveSession(session);

    return { user, token };
  }

  async logout(): Promise<boolean> {
    this.clearSession();
    return true;
  }

  async getCurrentUser(): Promise<User | null> {
    const session = this.getCurrentSession();

    if (!session) {
      return null;
    }

    if (new Date(session.expiresAt) < new Date()) {
      this.clearSession();
      return null;
    }

    return session.user;
  }
}
