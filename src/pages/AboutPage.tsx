import { Skills } from '@/components/sections/Skills';
import { Certifications } from '@/components/sections/Certifications';
import { PageHeader } from '@/components/PageHeader';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function AboutPage() {
  useDocumentMeta({
    title: 'Skills & Certifications — Mushfique Tanzim Muztaba',
    description:
      'Technical skills across SOLIDWORKS, AutoCAD, ROS 2, Python, C++, and the Microsoft Power Platform, plus safety, CAD, and award certifications.',
    path: '/about',
  });

  return (
    <>
      <div className="section-container pt-12 sm:pt-16">
        <PageHeader
          dwg="GEN-004"
          discipline="Skills & Certs"
          title="What I work with"
          description="Software, hardware, and workshop skills, alongside the certifications and awards behind them."
          sheet={[5, 5]}
        />
      </div>
      <Skills />
      <Certifications />
    </>
  );
}
