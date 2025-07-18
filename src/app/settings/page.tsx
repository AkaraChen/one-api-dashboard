"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/settings-store";
import { EmptyState } from "@/components/empty-state";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CURRENCY_UNITS } from "@/lib/utils";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

function Settings() {
  // Get settings providers and actions from the store
  const { providers, addProvider, updateProvider, deleteProvider } =
    useSettingsStore();

  // State for the form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    url: string;
    apiKey: string;
    userId: string;
    unit: string;
  }>({
    name: "",
    url: "",
    apiKey: "",
    userId: "",
    unit: "USD",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update a provider
  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing provider
      updateProvider(editingId, formData);
      setEditingId(null);
    } else {
      // Add new provider
      addProvider(formData);
    }

    // Reset form
    setFormData({ name: "", url: "", apiKey: "", userId: "", unit: "USD" });
    setShowForm(false);
  };

  // Edit a provider
  const handleEditProvider = (id: string) => {
    const providerToEdit = providers.find((provider) => provider.id === id);
    if (providerToEdit) {
      setFormData({
        name: providerToEdit.name,
        url: providerToEdit.url,
        apiKey: providerToEdit.apiKey,
        userId: providerToEdit.userId || "",
        unit: providerToEdit.unit || "USD",
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  // Delete a provider
  const handleDeleteProvider = (id: string) => {
    deleteProvider(id);
  };

  const [rootParent] = useAutoAnimate();
  const [listParent] = useAutoAnimate();

  // Handle export of providers
  const handleExportProviders = () => {
    const dataStr = JSON.stringify(providers, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `one-api-providers-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Handle import of providers
  const handleImportProviders = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProviders = JSON.parse(e.target?.result as string);

        // Validate the imported data structure
        if (
          Array.isArray(importedProviders) &&
          importedProviders.every(
            (provider) =>
              typeof provider === "object" &&
              provider !== null &&
              "name" in provider &&
              "url" in provider &&
              "apiKey" in provider,
          )
        ) {
          // Replace all providers with imported ones
          importedProviders.forEach((provider) => {
            addProvider({
              name: provider.name,
              url: provider.url,
              apiKey: provider.apiKey,
              userId: provider.userId || "",
              unit: provider.unit || "USD",
            });
          });
          toast.success("导入成功！");
        } else {
          toast.error("导入失败：无效的数据格式");
        }
      } catch (error) {
        toast.error(`导入失败： ${(error as Error).message}`);
      }

      // Reset the file input
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Helmet>
        <title>设置 - One API Dashboard</title>
        <meta name="description" content="管理您的 API 提供商设置" />
      </Helmet>
      <div className="container mx-auto p-4" ref={rootParent}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">设置</h1>
          <div className="flex gap-2">
            {/* Hidden file input for import */}
            <input
              type="file"
              id="import-file"
              accept=".json"
              className="hidden"
              onChange={handleImportProviders}
            />

            <Button
              onClick={() => document.getElementById("import-file")?.click()}
              variant="outline"
            >
              导入
            </Button>

            <Button onClick={handleExportProviders} variant="outline">
              导出
            </Button>

            <Button onClick={() => setShowForm(true)} variant="default">
              添加
            </Button>
          </div>
        </div>

        {/* Form for adding/editing items */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "编辑 API 设置" : "添加 API 设置"}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? "修改现有的 API 端点配置"
                  : "添加新的 API 端点配置"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="settingsForm" onSubmit={handleSaveProvider}>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  ref={listParent}
                >
                  {/* 左列 */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        名称
                      </label>
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
                      <label className="block text-sm font-medium mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        name="apiKey"
                        value={formData.apiKey}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      />
                      <CardDescription className="mt-1 text-xs">
                        由于浏览器的安全限制，API Key 将被发送至服务端
                      </CardDescription>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        用户 ID
                      </label>
                      <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      />
                      <CardDescription className="mt-1 text-xs">
                        New API 要求提供用户 ID，如果使用 One API 则可以留空
                      </CardDescription>
                    </div>
                  </div>

                  {/* 右列 */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        货币单位
                      </label>
                      <Select
                        name="unit"
                        value={formData.unit}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            unit: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择货币单位" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CURRENCY_UNITS).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {key}({value})
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <CardDescription className="mt-1 text-xs">
                        用于显示费用的货币单位
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: "",
                    url: "",
                    apiKey: "",
                    userId: "",
                    unit: "USD",
                  });
                  setEditingId(null);
                }}
              >
                取消
              </Button>
              <Button type="submit" form="settingsForm">
                {editingId ? "更新" : "保存"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Grid of providers or empty state */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <CardTitle>{provider.name}</CardTitle>
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
        ) : (
          <EmptyState
            title="暂无 API 提供商"
            description="您尚未添加任何 API 提供商。点击下方按钮添加您的第一个 API 提供商。"
            actionLabel="添加提供商"
            onAction={() => setShowForm(true)}
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
      </div>
    </>
  );
}

export default Settings;
