import { Palette, Users } from 'lucide-react';
import { OrgSection } from '@/components/OrgSection';
import { PageHeader } from '@/components/PageHeader';
import { orgsByCategory, allOrgs } from '@/lib/orgs';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function DesignPage() {
  useDocumentMeta({
    title: 'Graphic Design & Media — Mushfique Tanzim Muztaba',
    description:
      'Graphic design and social media work for PolyU student organizations — posters, logos, merchandise, and Instagram reels reaching over 15,000 views.',
    path: '/design',
  });

  return (
    <section className="section-container py-12 sm:py-16">
      <PageHeader
        dwg="GD-003"
        discipline="Graphic Design"
        title="Visual identity and social content"
        description="Posters, logos, merchandise, and short-form video built for student organizations across PolyU."
        sheet={[4, 5]}
        count={allOrgs.length}
        countLabel="Orgs"
      />

      <OrgSection
        id="design"
        title="Graphic Design"
        icon={Palette}
        orgs={orgsByCategory('design')}
        note="Click the Instagram badge beside any name to explore more content on the page."
      />
      <OrgSection
        id="leadership"
        title="Leadership & Activities"
        icon={Users}
        orgs={orgsByCategory('leadership')}
        headerDelay={0.1}
      />
    </section>
  );
}
