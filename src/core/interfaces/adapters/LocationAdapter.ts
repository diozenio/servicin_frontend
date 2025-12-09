import {
  StateListResponse,
  CityListResponse,
} from "@/core/domain/models/location";

export abstract class LocationAdapter {
  abstract getStates(): Promise<StateListResponse>;
  abstract getCitiesByState(stateId: string): Promise<CityListResponse>;
}
