"use client";

import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CurrencyUnit, getCurrencySymbol } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings-store";
import { EmptyState } from "@/components/empty-state";
import { getProviderQuota } from "@/services/one-api";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2Icon, XIcon } from "lucide-react";

function DashboardClient() {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API 提供商列表</h1>
        <Button size="sm" asChild>
          <Link href="/settings">管理提供商</Link>
        </Button>
      </div>

      {providers.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>提供商名称</TableHead>
                <TableHead>接口地址</TableHead>
                <TableHead>余额</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider, index) => {
                const quotaQuery = quotaQueries[index];
                const isLoading = quotaQuery.isLoading;
                const quotaData = quotaQuery.data;

                return (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell className="truncate">
                      {provider.url ? (
                        <a 
                          href={provider.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {provider.url}
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="w-[200px]">
                      {isLoading ? (
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                      ) : quotaQuery.isError ? (
                        <span className="text-destructive">获取失败</span>
                      ) : (
                        <span>
                          {getCurrencySymbol(provider.unit as CurrencyUnit || "USD")}
                          {quotaData?.unit.toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/settings?edit=${provider.id}`}>编辑</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
    </div>
  );
}

export default DashboardClient;
