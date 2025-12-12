import { User } from "@/core/domain/models/user";
import { UserAdapter } from "@/core/interfaces/adapters/UserAdapter";
import { client } from "@/lib/client";

export class ProfileAPI implements UserAdapter {
  async getProfileData(): Promise<User | null> {
    const response = await client.get("/auth/me");
    return response.data;
  }

  async deleteAccount(): Promise<null> {
    const response = await client.delete("/auth/me");
    return response.data; // deve ser null mesmo
  }
}
