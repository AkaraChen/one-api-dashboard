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

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API 控制台</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="mb-4">欢迎使用 One API Dashboard。您可以在这里管理和监控您的 API 使用情况。</p>
          
          <Button asChild>
            <Link to="/settings">
              前往设置
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API 使用统计</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">暂无数据</p>
        </CardContent>
      </Card>
    </div>
  )
}
