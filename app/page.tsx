// import useAuth from '@/hooks/use-auth'
import dynamic from 'next/dynamic'
import LoadingScreen from "@/components/ui/loading-screen";
import { Suspense } from 'react';

const HomePage = dynamic(() => import('./home/page'), { ssr: true })

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomePage />
    </Suspense>
  );
}