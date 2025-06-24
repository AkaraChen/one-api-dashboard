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
  // Get settings items and actions from the store
  const { items, addItem, updateItem, deleteItem } = useSettingsStore()
  
  // State for the form
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{name: string; url: string}>({    
    name: '',
    url: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Add or update an item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing item
      updateItem(editingId, formData)
      setEditingId(null)
    } else {
      // Add new item
      addItem(formData)
    }
    
    // Reset form
    setFormData({ name: '', url: '' })
    setShowForm(false)
  }
  
  // Edit an item
  const handleEditItem = (id: string) => {
    const itemToEdit = items.find(item => item.id === id)
    if (itemToEdit) {
      setFormData({ name: itemToEdit.name, url: itemToEdit.url })
      setEditingId(id)
      setShowForm(true)
    }
  }
  
  // Delete an item
  const handleDeleteItem = (id: string) => {
    deleteItem(id)
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">设置</h1>
        <Button 
          onClick={() => setShowForm(true)}
          variant="default"
        >
          添加
        </Button>
      </div>
      
      {/* Form for adding/editing items */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {formData.name ? '编辑 API 设置' : '添加新 API 设置'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveItem}>
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
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="default"
                >
                  保存
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', url: '' })
                  }}
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription className="truncate">{item.url}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                onClick={() => handleEditItem(item.id)}
                variant="outline"
                size="sm"
              >
                编辑
              </Button>
              <Button
                onClick={() => handleDeleteItem(item.id)}
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
