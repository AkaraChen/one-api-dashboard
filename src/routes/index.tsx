import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSettingsStore } from '@/store/settingsStore'
import { EmptyState } from '@/components/empty-state'
import { useQueries } from '@tanstack/react-query'
import { getProviderQuota } from '@/services/one-api'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  // Get providers from the store
  const { providers } = useSettingsStore()
  
  // 使用 useQueries 获取每个 provider 的配额信息
  const quotaQueries = useQueries({
    queries: providers.map(provider => ({
      queryKey: ['providerQuota', provider.id],
      queryFn: () => {
        // 只有当 URL 和 API Key 都存在时才发起请求
        if (provider.url && provider.apiKey) {
          return getProviderQuota(provider.url, provider.apiKey)
            .catch(error => {
              console.error(`获取 ${provider.name} 配额失败:`, error)
              return { quota: 0, quotaPerUnit: 1, unit: 0 } // 返回默认值
            })
        }
        return Promise.resolve({ quota: 0, quotaPerUnit: 1, unit: 0 }) // 默认值
      },
      staleTime: 1000 * 60 * 5, // 5分钟缓存
      refetchOnWindowFocus: false
    }))
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API 控制台</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>欢迎使用 One API Dashboard</CardTitle>
          <CardDescription>
            您可以在这里管理和监控您的 API 使用情况
          </CardDescription>
        </CardHeader>
        <CardContent>已配置 {providers.length} 个 API 端点</CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/settings">前往设置</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API 端点概览</CardTitle>
          <CardDescription>所有配置的 API 端点列表</CardDescription>
        </CardHeader>
        <CardContent>
          {providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider, index) => {
                const quotaQuery = quotaQueries[index]
                const isLoading = quotaQuery.isLoading
                const quotaData = quotaQuery.data
                
                return (
                  <Card key={provider.id} className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{provider.name}</CardTitle>
                      <CardDescription className="truncate">
                        <a 
                          href={provider.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline cursor-pointer"
                        >
                          {provider.url}
                        </a>
                      </CardDescription>
                      <CardDescription className="mt-1 text-xs">
                        API Key: {provider.apiKey ? '••••' + provider.apiKey.slice(-4) : '未设置'}
                      </CardDescription>
                      <CardDescription className="mt-1 text-xs">
                        货币单位: {provider.unit === 'USD' ? '$' : 
                                 provider.unit === 'CNY' ? '¥' : 
                                 provider.unit === 'EUR' ? '€' : 
                                 provider.unit === 'GBP' ? '£' : 
                                 provider.unit === 'JPY' ? '¥' : provider.unit}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {isLoading ? (
                        <p className="text-sm text-muted-foreground">加载中...</p>
                      ) : quotaQuery.isError ? (
                        <p className="text-sm text-destructive">获取配额失败</p>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">剩余配额:</span>
                            <span className="text-sm">
                              {quotaData?.quota.toLocaleString()} / {(quotaData?.quotaPerUnit || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, ((quotaData?.quota || 0) / (quotaData?.quotaPerUnit || 1)) * 100)}%` 
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-right">
                            {provider.unit === 'USD' ? '$' : 
                             provider.unit === 'CNY' ? '¥' : 
                             provider.unit === 'EUR' ? '€' : 
                             provider.unit === 'GBP' ? '£' : 
                             provider.unit === 'JPY' ? '¥' : provider.unit}
                            {quotaData?.unit.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/settings">管理</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <EmptyState 
              title="暂无 API 提供商"
              description="您尚未添加任何 API 提供商。点击下方按钮添加您的第一个 API 提供商。"
              actionLabel="添加提供商"
              onAction={() => {
                window.location.href = '/settings'
              }}
              icon={
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z" />
                    <path d="M2 8v11a2 2 0 0 0 2 2h14" />
                  </svg>
                </div>
              }
            />
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500 mb-2">
            已配置 {providers.length} 个 API 端点
          </div>
          <div className="text-sm text-gray-500">
            点击管理按钮可以编辑或删除 API 端点
          </div>
          <Button variant="outline" asChild>
            <Link to="/settings">管理所有端点</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
