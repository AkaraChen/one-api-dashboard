import { Link, createFileRoute  } from '@tanstack/react-router'
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

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  // Get providers from the store
  const { providers } = useSettingsStore()

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
            <div className="space-y-4">
              {providers.map(provider => (
                <Card key={provider.id} className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription className="truncate">{provider.url}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/settings">管理</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">暂无数据</p>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500 mb-2">
            已配置 {providers.length} 个 API 端点
          </div>
          <div className="text-sm text-gray-500">
            点击管理按钮可以编辑或删除 API 端点
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
