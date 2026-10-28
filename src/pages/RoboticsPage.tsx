import { Bot, Sparkles, Code2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ProjectSection } from '@/components/ProjectSection';
import { PageHeader } from '@/components/PageHeader';
import { partitionByCategory } from '@/lib/projects';
import type { Category } from '@/lib/projects';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/** Section order doubles as the partition order, so each project lands in exactly one. */
const SECTIONS: { category: Category; id: string; title: string; icon: LucideIcon }[] = [
  { category: 'robotics', id: 'robotics', title: 'Robotics & Autonomy', icon: Bot },
  { category: 'ai', id: 'ai', title: 'AI & Computer Vision', icon: Sparkles },
  { category: 'software', id: 'software', title: 'Software', icon: Code2 },
];

export default function RoboticsPage() {
  useDocumentMeta({
    title: 'Robotics & AI Projects — Mushfique Tanzim Muztaba',
    description:
      'Autonomous robotics and computer vision projects using ROS 2, SLAM Toolbox, Nav2, YOLO, OpenCV, and PyTorch — including a thermal inspection robot and a vision-guided tracking system.',
    path: '/robotics',
  });

  const buckets = partitionByCategory(SECTIONS.map((s) => s.category));

  return (
    <section className="section-container py-12 sm:py-16">
      <PageHeader
        dwg="RB-002"
        discipline="Robotics & AI"
        title="Autonomous systems and perception"
        description="ROS 2 robots, control loops, and vision pipelines — from SLAM and frontier exploration to multimodal anomaly detection."
        sheet={[3, 5]}
        count={buckets.reduce((n, b) => n + b.projects.length, 0)}
        countLabel="Items"
      />

      {SECTIONS.map((section, index) => (
        <ProjectSection
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          projects={buckets[index].projects}
          headerDelay={index * 0.08}
        />
      ))}
    </section>
  );
}
