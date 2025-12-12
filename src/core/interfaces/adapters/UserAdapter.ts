import { User } from "@/core/domain/models/user";

export abstract class UserAdapter {
  abstract getProfileData(): Promise<User | null>;
}
