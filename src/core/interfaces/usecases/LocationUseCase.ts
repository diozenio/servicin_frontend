import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";

export interface LocationUseCase {
  getStates(): Promise<StateListResponse>;
  getCitiesByState(stateId: string): Promise<CityListResponse>;
}
