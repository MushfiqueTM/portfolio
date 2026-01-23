"use client";

import React, { memo } from 'react';
import WorkExperienceSection from '../components/sections/WorkExperienceSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import CertificationsSection from '../components/sections/CertificationsSection';
import LeadershipSection from '../components/sections/LeadershipSection';

export default memo(function AllExperiencesView({
  expanded,
  toggleImages,
  openLightbox
}: {
  expanded: {
    work: {[key: string]: boolean};
    team: {[key: string]: boolean};
    project: {[key: string]: boolean};
    leadership: {[key: string]: boolean};
  };
  toggleImages: (category: 'work' | 'team' | 'project' | 'leadership', key: string) => void;
  openLightbox: (imagePath: string, allImages: string[], index: number) => void;
}) {
  return (
    <>
      <WorkExperienceSection
        expanded={{ work: expanded.work, team: expanded.team }}
        toggleImages={toggleImages}
        openLightbox={openLightbox}
      />
      <ProjectsSection
        expanded={{ project: expanded.project }}
        toggleImages={toggleImages}
        openLightbox={openLightbox}
      />
      <CertificationsSection />
      <LeadershipSection
        expanded={{ leadership: expanded.leadership }}
        toggleImages={toggleImages}
        openLightbox={openLightbox}
      />
    </>
  );
});
