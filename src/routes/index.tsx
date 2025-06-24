import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">One API Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Welcome to your API dashboard.</p>
      </div>
    </div>
  )
}
