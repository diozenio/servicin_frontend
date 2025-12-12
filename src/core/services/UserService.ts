import { ProfileUseCase } from "@/core/interfaces/usecases/ProfileUseCase";
import { UserAdapter } from "@/core/interfaces/adapters/UserAdapter";
import { User } from "@/core/domain/models/user";

export class ProfileService implements ProfileUseCase {
  constructor(private userAdapter: UserAdapter) {}

  async getUserData(): Promise<User | null> {
    return await this.userAdapter.getProfileData();
  }
}
