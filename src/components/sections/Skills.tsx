import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Wrench, Palette, Monitor } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { NeuTag } from '@/components/ui/NeuTag';
import { ScrollReveal } from '@/components/ScrollReveal';

interface SkillCategory {
  icon: React.ReactNode;
  title: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    icon: <Monitor className="w-5 h-5" />,
    title: 'CAD & Design',
    skills: ['SOLIDWORKS', 'AutoCAD'],
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'Programming',
    skills: ['Python', 'MATLAB', 'SQL', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: 'AI/ML & Computer Vision',
    skills: ['OpenCV', 'PyTorch', 'Ultralytics YOLO', 'Roboflow', 'Object Detection', 'Image Classification'],
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: 'Hardware & Embedded',
    skills: ['Raspberry Pi', 'GPIO', 'I2C', 'PID Control'],
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: 'Microsoft Suite',
    skills: ['Power Apps', 'Power Automate', 'Power BI', 'Excel', 'PowerPoint'],
  },
];

const industrialSkills = ['3D Printing', 'Metal Casting', 'Surface Engineering', 'Sheet Metal', 'Welding', 'Machining'];

const designSkills = [
  { title: 'Photo & Video', skills: ['Adobe Lightroom', 'CAPCUT', 'Da Vinci Resolve'] },
  { title: 'Graphic Design', skills: ['Canva', 'Adobe Illustrator', 'Adobe Photoshop'] },
];

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="section-container py-12 sm:py-16">
      <ScrollReveal>
        <NeuCard className="p-6 sm:p-10">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-[#F2F4F6] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center"
            >
              <Code2 className="w-6 h-6 text-[#1A2B4A]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2B4A]">Skills</h2>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Skills - Large Card */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-[#1A2B4A] mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#3B82F6]" />
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillCategories.map((category, index) => (
                  <ScrollReveal key={category.title} delay={index * 0.1}>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <h4 className="text-sm font-medium text-[#5F6B7A] mb-3">{category.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <NeuTag key={skill} variant="default">
                            {skill}
                          </NeuTag>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Industrial Skills */}
            <ScrollReveal delay={0.3}>
              <div>
                <h3 className="text-lg font-semibold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#3B82F6]" />
                  Industrial Skills
                </h3>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex flex-wrap gap-2">
                    {industrialSkills.map((skill) => (
                      <NeuTag key={skill} variant="default">
                        {skill}
                      </NeuTag>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Design & Media */}
            <ScrollReveal delay={0.4}>
              <div>
                <h3 className="text-lg font-semibold text-[#1A2B4A] mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#3B82F6]" />
                  Design & Media
                </h3>
                <div className="space-y-3">
                  {designSkills.map((category) => (
                    <div key={category.title} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <h4 className="text-xs font-medium text-[#8B95A5] mb-2">{category.title}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {category.skills.map((skill) => (
                          <NeuTag key={skill} variant="default">
                            {skill}
                          </NeuTag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </NeuCard>
      </ScrollReveal>
    </section>
  );
};
