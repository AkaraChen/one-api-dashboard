import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm mb-4">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl">One API Dashboard</div>
        <nav className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link
              href="/"
              className="bg-accent text-accent-foreground"
            >
              首页
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link
              href="/settings"
              className="bg-accent text-accent-foreground"
            >
              设置
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
