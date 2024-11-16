// app/page.tsx
// import useAuth from '@/hooks/use-auth'
import dynamic from 'next/dynamic'

const HomePage = dynamic(() => import('./home/page'), { ssr: false })

export default function Page() {
  return <HomePage />
}