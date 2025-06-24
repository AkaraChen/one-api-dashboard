import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
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
  // Get settings from the store
  const { items } = useSettingsStore()
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API 控制台</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="mb-4">欢迎使用 One API Dashboard。您可以在这里管理和监控您的 API 使用情况。</p>
          
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/settings">
                前往设置
              </Link>
            </Button>
            <div className="text-sm text-gray-500 flex items-center">
              已配置 {items.length} 个 API 端点
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API 端点概览</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500 truncate">{item.url}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/settings">管理</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">暂无数据</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
