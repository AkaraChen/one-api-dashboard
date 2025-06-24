"use client";

import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSettingsStore } from "@/store/settings-store";
import { EmptyState } from "@/components/empty-state";
import { getProviderQuota } from "@/services/one-api";
import Link from "next/link";

function Dashboard() {
  // Get providers from the store
  const { providers } = useSettingsStore();

  // 使用 useQueries 获取每个 provider 的配额信息
  const quotaQueries = useQueries({
    queries: providers.map((provider) => ({
      queryKey: ["providerQuota", provider.id],
      queryFn: async () => {
        // 只有当 URL 和 API Key 都存在时才发起请求
        if (provider.url && provider.apiKey && provider.userId) {
          try {
            return await getProviderQuota(
              provider.url,
              provider.apiKey,
              provider.userId,
            );
          } catch (error) {
            console.error(`获取 ${provider.name} 配额失败:`, error);
            return { quota: 0, quotaPerUnit: 1, unit: 0 }; // 返回默认值
          }
        }
        throw new Error("未提供 URL 或 API Key");
      },
      staleTime: 1000 * 60 * 5, // 5分钟缓存
      refetchOnWindowFocus: false,
    })),
  });

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
            <Link href="/settings">前往设置</Link>
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
                const quotaQuery = quotaQueries[index];
                const isLoading = quotaQuery.isLoading;
                const quotaData = quotaQuery.data;

                return (
                  <Card key={provider.id}>
                    <CardContent>
                      {isLoading ? (
                        <p className="text-sm text-muted-foreground">
                          加载中...
                        </p>
                      ) : quotaQuery.isError ? (
                        <p className="text-sm text-destructive">获取配额失败</p>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-5 h-5 mr-2 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z" />
                              </svg>
                            </div>
                            <span className="text-base font-medium">
                              {provider.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 mr-2 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                            </div>
                            <span className="text-sm">
                              {provider.unit === "USD"
                                ? "$"
                                : provider.unit === "CNY"
                                  ? "¥"
                                  : provider.unit === "EUR"
                                    ? "€"
                                    : provider.unit === "GBP"
                                      ? "£"
                                      : provider.unit === "JPY"
                                        ? "¥"
                                        : provider.unit}
                              {quotaData?.unit.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="暂无 API 提供商"
              description="您尚未添加任何 API 提供商。点击下方按钮添加您的第一个 API 提供商。"
              actionLabel="添加提供商"
              onAction={() => {
                window.location.href = "/settings";
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
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-500">
              点击管理按钮可以编辑或删除 API 端点
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">管理所有端点</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Dashboard;
