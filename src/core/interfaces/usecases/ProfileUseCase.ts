import { User } from "@/core/domain/models/user";

export interface ProfileUseCase {
  getUserData(): Promise<User | null>;
}
