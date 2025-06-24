import type { Status, User } from "./one-api.def";

interface QuotaResponse {
  quotaPerUnit: number;
  quota: number;
  unit: number;
  statusData: Status;
  userData: User;
}

export async function getProviderQuota(
  baseURL: string,
  token: string,
  userId: string,
) {
  const url = `/api/one-api/quota`;
  const search = new URLSearchParams();
  search.set("baseURL", baseURL);
  search.set("token", token);
  search.set("userId", userId);
  const response = await fetch(`${url}?${search.toString()}`);
  const data = (await response.json()) as QuotaResponse;

  return {
    quotaPerUnit: data.quotaPerUnit,
    quota: data.quota,
    unit: data.unit,
  };
}
