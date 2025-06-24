import { createClient } from './base'
import type { Status, User } from './one-api.def'

export async function getProviderQuota(baseURL: string, token: string) {
  const client = createClient(baseURL)
  const {
    data: { quota_per_unit: quotaPerUnit },
  } = await client<Status>('/api/status', { token, useCorsProxy: true })
  const {
    data: { quota },
  } = await client<User>('/api/user/self', { token, useCorsProxy: true })
  const unit = quota / quotaPerUnit
  return {
    quotaPerUnit,
    quota,
    unit,
  }
}
