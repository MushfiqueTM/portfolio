import { Box, FileText, Lightbulb } from 'lucide-react';
import { ProjectSection } from '@/components/ProjectSection';
import { PageHeader } from '@/components/PageHeader';
import { byTool, mechanicalWithoutTool } from '@/lib/projects';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function MechanicalPage() {
  useDocumentMeta({
    title: 'Mechanical Design & CAD Portfolio — Mushfique Tanzim Muztaba',
    description:
      'Mechanical design and analysis work in SOLIDWORKS and AutoCAD — robot enclosures, crash-test rigs, FEA-optimized assemblies, product design, and technical drawings.',
    path: '/mechanical',
  });

  const solidworks = byTool('SOLIDWORKS');
  const autocad = byTool('AutoCAD');
  const concept = mechanicalWithoutTool();

  return (
    <section className="section-container py-12 sm:py-16">
      <PageHeader
        dwg="MD-001"
        discipline="Mechanical Design"
        title="CAD, analysis, and product design"
        description="Enclosures and assemblies taken from concept sketches through FEA to functional prototypes, plus the 2D drawing work that documents them."
        sheet={[2, 5]}
        count={solidworks.length + autocad.length + concept.length}
        countLabel="Items"
      />

      <ProjectSection
        id="solidworks"
        title="SOLIDWORKS"
        icon={Box}
        projects={solidworks}
      />
      <ProjectSection
        id="autocad"
        title="AutoCAD"
        icon={FileText}
        projects={autocad}
        headerDelay={0.1}
      />
      <ProjectSection
        id="concept"
        title="Concept & Product Design"
        icon={Lightbulb}
        projects={concept}
        headerDelay={0.15}
      />
    </section>
  );
}
