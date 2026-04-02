import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code2, Wrench, Palette, Monitor, Cpu, Bot, AppWindow } from 'lucide-react';
import { NeuCard } from '@/components/ui/NeuCard';
import { NeuTag } from '@/components/ui/NeuTag';
import { ScrollReveal } from '@/components/ScrollReveal';

interface SkillCategory {
  icon: React.ReactNode;
  title: string;
  skills: string[];
  colSpan?: string;
  rowSpan?: string;
}

const skillCategories: SkillCategory[] = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'Programming',
    skills: ['Python', 'C++', 'MATLAB', 'SQL', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
    colSpan: 'sm:col-span-2',
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: 'CAD & Design',
    skills: ['SOLIDWORKS', 'AutoCAD'],
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: 'Robotics & ROS',
    skills: ['ROS 2 (Jazzy/Humble)', 'Gazebo Sim', 'SLAM (Cartographer/SLAM Toolbox)', 'Nav2 Navigation', 'URDF/Xacro', 'Robot Localization (EKF)'],
    colSpan: 'sm:col-span-2',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'AI/ML & Computer Vision',
    skills: ['OpenCV', 'PyTorch', 'Ultralytics YOLO', 'Roboflow', 'Object Detection', 'Image Classification'],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Hardware & Embedded',
    skills: ['Raspberry Pi', 'GPIO', 'I2C', 'PID Control'],
  },
  {
    icon: <AppWindow className="w-5 h-5" />,
    title: 'Microsoft Suite',
    skills: ['Power Apps', 'Power Automate', 'Power BI', 'Excel', 'PowerPoint'],
  },
];

const industrialSkills = ['3D Printing', 'Metal Casting', 'Surface Engineering', 'Sheet Metal', 'Welding', 'Machining'];

const designSkills = [
  { title: 'Photo & Video', skills: ['Adobe Lightroom', 'CAPCUT', 'Da Vinci Resolve'] },
  { title: 'Graphic Design', skills: ['Canva', 'Adobe Illustrator', 'Adobe Photoshop'] },
];

// 3D tilt card component
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 20, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

          {/* Technical Skills — Bento Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1A2B4A] mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#3B82F6]" />
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {skillCategories.map((category, index) => (
                <ScrollReveal key={category.title} delay={index * 0.08}>
                  <TiltCard className={`h-full ${category.colSpan || ''}`}>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:shadow-lg transition-all duration-300 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EEF1F5] flex items-center justify-center text-[#3B82F6]">
                          {category.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-[#1A2B4A]">{category.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <NeuTag key={skill} variant="default">
                            {skill}
                          </NeuTag>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Bottom row: Industrial + Design side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Industrial Skills */}
            <ScrollReveal delay={0.3}>
              <TiltCard className="h-full">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EEF1F5] flex items-center justify-center text-[#3B82F6]">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A2B4A]">Industrial Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {industrialSkills.map((skill) => (
                      <NeuTag key={skill} variant="default">
                        {skill}
                      </NeuTag>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Design & Media */}
            <ScrollReveal delay={0.4}>
              <TiltCard className="h-full">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EEF1F5] flex items-center justify-center text-[#3B82F6]">
                      <Palette className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A2B4A]">Design & Media</h3>
                  </div>
                  <div className="space-y-3">
                    {designSkills.map((category) => (
                      <div key={category.title}>
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
              </TiltCard>
            </ScrollReveal>
          </div>
        </NeuCard>
      </ScrollReveal>
    </section>
  );
};
