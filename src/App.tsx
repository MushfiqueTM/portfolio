import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import HomePage from '@/pages/HomePage';

// The home page is eager — it is the entry point for almost every visit, and lazying it
// would add a chunk round-trip before first paint. The rest split into their own chunks.
const MechanicalPage = lazy(() => import('@/pages/MechanicalPage'));
const RoboticsPage = lazy(() => import('@/pages/RoboticsPage'));
const DesignPage = lazy(() => import('@/pages/DesignPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/** Wraps a lazy route so its chunk download shows a skeleton rather than a blank page. */
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="mechanical" element={<Lazy><MechanicalPage /></Lazy>} />
          <Route path="robotics" element={<Lazy><RoboticsPage /></Lazy>} />
          <Route path="design" element={<Lazy><DesignPage /></Lazy>} />
          <Route path="about" element={<Lazy><AboutPage /></Lazy>} />
          <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
