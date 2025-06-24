import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  // Get settings providers and actions from the store
  const { providers, addProvider, updateProvider, deleteProvider } =
    useSettingsStore()

  // State for the form
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{ name: string; url: string }>({
    name: '',
    url: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add or update a provider
  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      // Update existing provider
      updateProvider(editingId, formData)
      setEditingId(null)
    } else {
      // Add new provider
      addProvider(formData)
    }

    // Reset form
    setFormData({ name: '', url: '' })
    setShowForm(false)
  }

  // Edit a provider
  const handleEditProvider = (id: string) => {
    const providerToEdit = providers.find((provider) => provider.id === id)
    if (providerToEdit) {
      setFormData({ name: providerToEdit.name, url: providerToEdit.url })
      setEditingId(id)
      setShowForm(true)
    }
  }

  // Delete a provider
  const handleDeleteProvider = (id: string) => {
    deleteProvider(id)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">设置</h1>
        <Button onClick={() => setShowForm(true)} variant="default">
          添加
        </Button>
      </div>

      {/* Form for adding/editing items */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? '编辑 API 设置' : '添加 API 设置'}
            </CardTitle>
            <CardDescription>
              {editingId ? '修改现有的 API 端点配置' : '添加新的 API 端点配置'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="settingsForm" onSubmit={handleSaveProvider}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">名称</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setFormData({ name: '', url: '' })
                setEditingId(null)
              }}
            >
              取消
            </Button>
            <Button type="submit" form="settingsForm">
              {editingId ? '更新' : '保存'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Grid of providers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <CardTitle>{provider.name}</CardTitle>
              <CardDescription className="truncate">
                {provider.url}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                onClick={() => handleEditProvider(provider.id)}
                variant="outline"
                size="sm"
              >
                编辑
              </Button>
              <Button
                onClick={() => handleDeleteProvider(provider.id)}
                variant="destructive"
                size="sm"
              >
                删除
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
