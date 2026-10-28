import { Hero } from '@/components/sections/Hero';
import { WorkExperience } from '@/components/sections/WorkExperience';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function HomePage() {
  useDocumentMeta({
    title: 'Mushfique Tanzim Muztaba — Mechanical Engineer',
    description:
      'Portfolio of Mushfique Tanzim Muztaba — Mechanical Engineering student at PolyU with experience in CAD/FEA, ROS2 robotics, AI/computer vision, and enterprise software. Open to graduate opportunities.',
    path: '/',
  });

  return (
    <>
      <Hero />
      <WorkExperience />
    </>
  );
}
