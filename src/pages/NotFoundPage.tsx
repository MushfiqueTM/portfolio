import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Plate } from '@/components/ui/Plate';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function NotFoundPage() {
  useDocumentMeta({
    title: 'Page not found — Mushfique Tanzim Muztaba',
    description: 'That page does not exist.',
    path: '/',
  });

  return (
    <section className="section-container py-24 sm:py-32">
      <Plate className="p-10 sm:p-14 max-w-xl mx-auto text-center">
        <p className="text-5xl font-bold text-ink tabular-nums">404</p>
        <h1 className="text-xl font-semibold text-ink mt-4">Page not found</h1>
        <p className="text-ink-soft mt-2">
          That page does not exist. The portfolio lives across the home page, mechanical
          design, robotics, design, and about.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-sm bg-ink text-paper text-sm font-medium hover:bg-ink-light transition-colors"
          data-cursor="Go"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </Plate>
    </section>
  );
}
