import { UserAdapter } from "@/core/interfaces/adapters/UserAdapter";
import { DeleteAccountUseCase } from "../interfaces/usecases/DeleteUseCase";

export class DeleteAccountService implements DeleteAccountUseCase {
  constructor(private userAdapter: UserAdapter) {}

  async execute(): Promise<null> {
    return await this.userAdapter.deleteAccount();
  }
}
