"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Mail, Phone, Globe, BookOpen, Briefcase, ExternalLink, X, Code, Palette, Monitor, Award, Linkedin, Download } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';

// Image component with loading states and error handling
const OptimizedImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  onClick,
  motionProps = {},
  disableHover = false
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  motionProps?: any;
  disableHover?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${containerClassName}`}
      onClick={onClick}
      {...motionProps}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] z-10">
          <div className="w-8 h-8 border-2 border-[var(--color-muted)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-muted)] z-10">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${!disableHover ? 'group-hover:scale-105' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default function Portfolio() {

  const [activeView, setActiveView] = useState<'3d' | 'all' | 'design'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLightboxTransitioning, setIsLightboxTransitioning] = useState(false);

  // Image visibility states for All Experiences view
  const [showWorkImages, setShowWorkImages] = useState<{[key: string]: boolean}>({});
  const [showWorkTeamImages, setShowWorkTeamImages] = useState<{[key: string]: boolean}>({});
  const [showProjectImages, setShowProjectImages] = useState<{[key: string]: boolean}>({});
  const [showLeadershipImages, setShowLeadershipImages] = useState<{[key: string]: boolean}>({});

  // Scroll position management
  const scrollPositionRef = useRef<number>(0);
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);

  const openLightbox = (imagePath: string, allImages: string[], index: number) => {
    setLightboxImages(allImages);
    setCurrentImageIndex(index);
    setLightboxImage(imagePath);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxImages([]);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (lightboxImages.length === 0 || isLightboxTransitioning) return;

    setIsLightboxTransitioning(true);
    let newIndex = currentImageIndex;
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % lightboxImages.length;
    } else {
      newIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
    }

    // Update index immediately for smooth transition
    setCurrentImageIndex(newIndex);
    setLightboxImage(lightboxImages[newIndex]);

    // Reset transition state after animation completes
    setTimeout(() => setIsLightboxTransitioning(false), 300);
  };

  // Toggle image visibility functions
  const toggleWorkImages = (company: string) => {
    scrollPositionRef.current = window.scrollY;
    setIsUpdatingImages(true);
    setShowWorkImages(prev => ({
      ...prev,
      [company]: !prev[company]
    }));
  };

  const toggleWorkTeamImages = (teamName: string) => {
    scrollPositionRef.current = window.scrollY;
    setIsUpdatingImages(true);
    setShowWorkTeamImages(prev => ({
      ...prev,
      [teamName]: !prev[teamName]
    }));
  };

  const toggleProjectImages = (title: string) => {
    scrollPositionRef.current = window.scrollY;
    setIsUpdatingImages(true);
    setShowProjectImages(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleLeadershipImages = (organization: string) => {
    scrollPositionRef.current = window.scrollY;
    setIsUpdatingImages(true);
    setShowLeadershipImages(prev => ({
      ...prev,
      [organization]: !prev[organization]
    }));
  };

  useLayoutEffect(() => {
    if (isUpdatingImages) {
      window.scrollTo(0, scrollPositionRef.current);
      setIsUpdatingImages(false);
    }
  }, [showWorkImages, showWorkTeamImages, showProjectImages, showLeadershipImages, isUpdatingImages]);

  // Preload images for lightbox
  useEffect(() => {
    if (lightboxImages.length > 0) {
      lightboxImages.forEach((imagePath) => {
        const img = new Image();
        img.src = imagePath;
      });
    }
  }, [lightboxImages]);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') navigateLightbox('prev');
      else if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, currentImageIndex, lightboxImages.length]);

  const ProjectItem = ({ children, index }: { children: React.ReactNode; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {children}
      </motion.div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const workExperience = [
    {
      company: "CLP Power Hong Kong",
      role: "Sandwich Intern",
      date: "July 2024 – June 2025",
      location: "Hong Kong",
      teams: [
        {
          name: "Project Execution Team (PET)",
          highlights: [
            "Architected and delivered an end-to-end Lessons Learned App using Microsoft Power Apps, Power Automate, and SharePoint, enabling 100+ team members to efficiently capture, review, and share organizational knowledge.",
            "Designed an intuitive user interface featuring a centralized gallery, seven advanced dropdown filters, and a search field for rapid discovery and management of lessons, ensuring seamless navigation and accessibility for all users.",
            "Implemented dynamic, business group–driven approval workflows with Power Automate, automatically routing submissions to the appropriate reviewers, managing notifications, and ensuring only fully approved lessons are published to the knowledge base, reducing feedback turnaround time by 70%.",
            "Integrated interactive social features such as a Like system, personalized liked-lessons section, and a real-time leaderboard to foster engagement, recognize valuable contributions, and promote a culture of continuous improvement across the organization.",
            "Utilized SharePoint Lists as a secure, centralized data repository, ensuring robust data integrity, auditability, and compliance while supporting efficient storage, retrieval, and reporting of all lessons learned records."
          ],
          images: [
            "/projects/project_execution_team_1.jpeg",
            "/projects/project_execution_team_2.jpeg",
            "/projects/project_execution_team_3.jpeg",
            "/projects/project_execution_team_4.jpeg",
            "/projects/project_execution_team_5.jpeg",
            "/projects/project_execution_team_6.jpeg",
          ]
        },
        {
          name: "",
          highlights: [
            "Gained in-depth knowledge of CLP's Project Management Governance System Lifecycle by completing training under the Project Management Academy to enhance project execution and governance."
          ]
        },
        {
          name: "Hong Kong Battery Energy Storage System (HKBESS)",
          highlights: [
            "Designed and delivered a comprehensive Management of Change / Process Change Control App using Microsoft Power Apps, Power Automate, and SharePoint, transforming the way process changes are initiated, tracked, and approved for the Hung Shui Kiu 'A' Substation Project.",
            "Developed an intuitive user interface featuring a centralized gallery of all change records, advanced filtering with multiple dropdowns and a search bar, and real-time status indicators by enabling users to efficiently locate, review, and manage change requests.",
            "Engineered dynamic, multi level approval workflows with Power Automate, allowing users to select relevant departments for endorsement, automatically routing requests to the appropriate stakeholders, and supporting iterative revisions until all endorsements are secured, thus reducing approval time by 50%",
            "Integrated seamless collaboration and notification features, including automated Teams approvals, flexible form editing, and pre endorsement review options, fostering transparent communication and continuous process improvement.",
            "Leveraged SharePoint Lists as a secure, centralized data repository, ensuring robust data integrity, auditability, and compliance while supporting efficient storage, retrieval, and reporting of all change management records."
          ],
          images: [
            "/projects/HKBESS_1.jpeg",
            "/projects/HKBESS_2.jpeg",
            "/projects/HKBESS_3.jpeg",
          ]
        },
        {
          name: "",
          highlights: [
            "Researched various risks and operational considerations, documenting findings in the risk register to enhance safety.",
            "Collaborated in the writing of technical specifications by accurately naming spare parts, enhancing clarity in inventory management and procurement.",
            "Participated in analysing equipment redundancies, helping to streamline operations.",
            "Created a Master Deliverables List by consolidating key project specifications (General, Technical, and Quality)."
          ]
        }
      ],
      images: []
    },
    {
      company: "PolyU E Formula Racing Team",
      role: "Steering Designer",
      date: "September 2023 – May 2024",
      location: "Hong Kong",
      teams: [
        {
          name: "",
          highlights: [
            "Engineered and simulated precise steering geometry using Adams for optimal handling and performance.",
            "Designed the tie rods, steering column and steering linkages in SOLIDWORKS, ensuring manufacturability.",
            "Formulated the manufacturing plan of the steering components."
          ]
        }
      ],
      images: []
    },
    {
      company: "Thai German Graduate School of Engineering (TGGS)",
      role: "Research Intern",
      date: "August 2023",
      location: "Bangkok, Thailand",
      teams: [
        {
          name: "",
          highlights: [
            "Developed and refined initial concept sketches, progressing to a detailed 3D model of the motorbike dolly for crash testing using SOLIDWORKS for precise visualization and design accuracy.",
            "Utilized Finite Element Method (FEM) techniques to analyse and optimize the dolly's structural integrity, ensuring enhanced durability and performance under crash testing conditions.",
            "Engineered a crash cushion system, effectively minimizing impact forces and reducing damage during crash scenarios."
          ]
        }
      ],
      images: [
        "/projects/motorbike-dolly-1.jpg",
        "/projects/motorbike-dolly-2.jpg",
        "/projects/motorbike-dolly-3.jpg",
        "/projects/motorbike-dolly-4.jpg",
      ]
    },
    {
      company: "WEXTECH HK LIMITED",
      role: "Product Designer",
      date: "July 2023",
      location: "Hong Kong",
      teams: [
        {
          name: "",
          highlights: [
            "Conceptualized and sketched initial design concepts, considering user preferences and market trends.",
            "Utilized CAD software to create detailed 3D models and prototypes.",
            "Successfully brought the designs from concept to production, including Seed Frame products."
          ]
        }
      ],
      images: [
        "/projects/wextech-product-1.jpg",
        "/projects/wextech-product-2.jpg",
      ]
    },
    {
      company: "World Green Organization (WGO) – ESG Accelerator",
      role: "Creative Designer",
      date: "June 2023",
      location: "Hong Kong",
      teams: [
        {
          name: "",
          highlights: [
            "Designed sponsorship posts, social media content, and banners, adopted in masterclasses.",
            "Developed visually appealing designs aligned with brand guidelines, effectively conveying key messages."
          ]
        }
      ],
      images: []
    }
  ];

  const leadership = [
    {
      organization: "PolyU ENGL English Debate Club",
      role: "Creative Designer",
      date: "August 2024 – June 2025",
      location: "Hong Kong",
      highlights: [
        "Designed visual content (social posts, posters, logos, merchandise) to communicate brand identity and increase engagement across 500+ club members."
      ],
      images: [
        "/projects/Debate_1.jpeg",
        "/projects/Debate_2.jpeg",
      ]
    },
    {
      organization: "PolyU International Student Association",
      role: "Creative Designer and Social Media Manager",
      date: "July 2023 – June 2024",
      location: "Hong Kong",
      highlights: [
        "Created engaging graphics, videos, and written posts for social media platforms, successfully reaching over 15,000 views to promote the association's mission and engage with the target audience.",
        "Produced and edited Instagram reels showcasing association activities and events."
      ],
      reels: [
        {
          title: "ALOHA WELCOMING WAVES",
          url: "https://www.instagram.com/reel/CygK3AhhwxO/?igsh=NGt3MjQ0OTlqNnE2"
        },
        {
          title: "Halloween Horizons: A Mexican Rooftop Fiesta",
          url: "https://www.instagram.com/reel/CzWBMwFhqm1/?igsh=MTE2NTJleWFjZnc0MA=="
        },
        {
          title: "International Fairytale Night",
          url: "https://www.instagram.com/reel/C688aeTBGxz/?igsh=NnB0cmVoNTJibWt6"
        }
      ]
    },
    {
      organization: "PolyU Student Halls of Residence",
      role: "Event Organizer",
      date: "November 2022 – June 2025",
      location: "Hong Kong",
      highlights: [
        "Organized and led inter-hall activities involving over 120 participants, fostering community and teamwork.",
        "Captured memorable moments through event photography, documenting community gatherings and hall activities."
      ],
      images: [
        "/projects/yellow_hall.jpeg",
      ]
    }
  ];

  const allExperiencesProjects = [
    {
      title: "Autonomous Shooting System",
      date: "November 2025",
      description: "Developed autonomous target shooting system using Python and OpenCV on Raspberry Pi for real-time green LED detection.",
      highlights: [
        "Developed autonomous target shooting system using Python and OpenCV on Raspberry Pi for real-time green LED detection and engagement with 90% accuracy under variable lighting.",
        "Implemented PID control algorithm with position smoothing and dead zone compensation for 2-axis servo gimbal, achieving stable tracking with minimal oscillation.",
        "Integrated trajectory compensation using fixed offset calibration and multi-method HSV colour detection (3 parallel algorithms) for robust target acquisition at 100cm distance.",
        "Designed firing control system with GPIO motor control and automated target sequencing."
      ],
      images: [
        "/projects/shooting_system_1.jpeg",
        "/projects/shooting_system_2.jpeg",
      ]
    },
    {
      title: "Designed and Manufactured an Automated Trolley",
      date: "September 2023",
      description: "Collaborated with a multidisciplinary team to develop automated trolley for industrial applications.",
      highlights: [
        "Collaborated with a multidisciplinary team to develop automated trolley for industrial applications using SOLIDWORKS for precise design, ensuring efficiency.",
        "Solved loading/unloading, straight-line motion, and 90° turn challenges, demonstrating expertise."
      ],
      images: [
        "/projects/multi-disciplinary-1.jpg",
        "/projects/multi-disciplinary-2.jpg",
      ]
    },
    {
      title: "Designed a Cleaning Device for the elderly people of Hong Kong",
      date: "November 2022",
      description: "Designed an accessible cleaning device specifically for the elderly population of Hong Kong.",
      highlights: [
        "Led 7-member team in researching and developing cleaning device for elderly users, applying functional decomposition, mind mapping, and concept sketches for ideation.",
        "Built SOLIDWORKS prototype with optimized architecture, components, and materials."
      ],
      images: [
        "/projects/cleaning-device-1.jpg",
        "/projects/cleaning-device-2.jpg",
        "/projects/cleaning-device-3.jpg",
        "/projects/cleaning-device-4.jpg",
      ]
    },
    {
      title: "Designed 3D Vector Calculation Program in Python",
      date: "November 2022",
      description: "Developed a comprehensive Python application for 3D vector calculations with secure authentication.",
      highlights: [
        "Developed object-oriented Python app for 3D vector calculations, implementing secure login with username-password authentication and 3-attempt limit.",
        "Created text menu for easy vector input, supporting dot product, arctan, and exit functions."
      ],
      images: []
    },
    {
      title: "Redesigned a Table Fan",
      date: "November 2022",
      description: "Comprehensive redesign and optimization of a table fan with focus on performance and manufacturability.",
      highlights: [
        "Collaborated with a team of seven people to analyse and redesign table fan components for improved performance and manufacturability, based on analysis and market research.",
        "Employed hand-drawn sketches and CAD models in SOLIDWORKS for detailed prototyping.",
        "Assembled all components of the original fan in SOLIDWORKS, allowing for a comprehensive view."
      ],
      images: [
        "/projects/table-fan-2.jpg",
        "/projects/table-fan-3.jpg",
        "/projects/table-fan-4.jpg",
        "/projects/table-fan-1.jpg",
      ]
    },
    {
      title: "Instructed Children in Machine Learning and Programming with Emphasis on AI Recognition",
      date: "July 2022",
      description: "Taught South African high school students machine learning and programming via Zoom.",
      highlights: [
        "Taught South African high school students machine learning and programming via Zoom.",
        "Guided projects using Scratch and Google's Teachable Machine to build AI object recognition for support."
      ],
      images: []
    },
    {
      title: "Assembled a Robot Arm",
      date: "March 2022",
      description: "Designed and developed a six degrees of freedom robot arm using SOLIDWORKS.",
      highlights: [
        "Designed 6-DOF robot arm in SOLIDWORKS, engineering key components: cover, base, shoulder support, upper arm, power cable, and servo motor subassembly.",
        "Assembled custom and pre-designed parts to complete functional robot arm."
      ],
      images: [
        "/projects/robot-arm-1.jpg",
      ]
    }
  ];

  const projects3D = [
    {
      title: "Automated Trolley",
      date: "September 2024",
      description: "Built a remote-controlled platform capable of carrying a payload of up to 50 kg.",
      highlights: [
        "Collaborated with a multidisciplinary team to develop automated trolley for industrial applications using SOLIDWORKS for precise design, ensuring efficiency",
        "Solved loading/unloading, straight-line motion, and 90° turn challenges, demonstrating expertise"
      ],
      images: [
        "/projects/multi-disciplinary-1.jpg",
        "/projects/multi-disciplinary-2.jpg",
      ]
    },
    {
      title: "TGGS - Motorbike Dolly for Crash Testing",
      date: "2023",
      description: "Design of a motorbike dolly for crash testing with comprehensive engineering analysis.",
      highlights: [
        "Developed and refined initial concept sketches, progressing to a detailed 3D model of the motorbike dolly for crash testing using SOLIDWORKS for precise visualization and design accuracy",
        "Utilized Finite Element Method (FEM) techniques to analyse and optimize the dolly's structural integrity, ensuring enhanced durability and performance under crash testing conditions",
        "Engineered a crash cushion system, effectively minimizing impact forces and reducing damage during crash scenarios"
      ],
      images: [
        "/projects/motorbike-dolly-1.jpg",
        "/projects/motorbike-dolly-2.jpg",
        "/projects/motorbike-dolly-3.jpg",
        "/projects/motorbike-dolly-4.jpg",
      ]
    },
    {
      title: "WEXTECH HK LIMITED - Product Designer",
      date: "2023",
      description: "Professional product design role focusing on consumer products from concept to production.",
      highlights: [
        "Conceptualized and sketched initial design concepts, considering user preferences and market trends",
        "Utilized CAD software to create detailed 3D models and prototypes",
        "Successfully brought the designs from concept to production, including Seed Frame products"
      ],
      images: [
        "/projects/wextech-product-1.jpg",
        "/projects/wextech-product-2.jpg",
      ]
    },
    {
      title: "Cleaning Device for Elderly People",
      date: "2023",
      description: "Designed an accessible cleaning device specifically for the elderly population of Hong Kong.",
      highlights: [
        "Conducted research with a team of seven to define objectives, constraints, and specific needs of elderly people",
        "Utilized design tools such as functional decomposition diagrams, mind maps, morphological charts, and concept sketches",
        "Implemented the chosen design process, including product architecture development, component selection, CAD modeling, and material selection",
        "Presented the accessibility, ease of use, and effectiveness of the cleaning device to an audience"
      ],
      images: [
        "/projects/cleaning-device-1.jpg",
        "/projects/cleaning-device-2.jpg",
        "/projects/cleaning-device-3.jpg",
        "/projects/cleaning-device-4.jpg",
      ]
    },
    {
      title: "Table Fan Redesign",
      date: "2022",
      description: "Comprehensive redesign and optimization of a table fan with focus on performance and manufacturability.",
      highlights: [
        "Collaborated with a team of seven to conduct assessment and examination of multiple fan components",
        "Introduced enhancements to individual parts based on thorough analysis and stress simulation",
        "Created detailed CAD prototypes of each component optimizing for manufacturability and performance",
        "Assembled all components in SOLIDWORKS for comprehensive product view"
      ],
      images: [
        "/projects/table-fan-2.jpg",
        "/projects/table-fan-3.jpg",
        "/projects/table-fan-4.jpg",
        "/projects/table-fan-1.jpg",
      ]
    },
    {
      title: "Gripper Design with Water Bottle",
      date: "2022",
      description: "Designed a mechanical gripper system for bottle handling with detailed CAD modeling.",
      highlights: [
        "Designed a bottle with predefined volume using SOLIDWORKS",
        "Modified the gripper to effectively grip the bottle, utilizing mechanical design principles",
        "Performed renderings in different appearances and utilized image mapping and animation video",
        "Produced detailed 2D drawings of parts with title blocks and annotations"
      ],
      images: [
        "/projects/gripper-design-1.jpg",
      ]
    },
    {
      title: "Robot Arm Assembly",
      date: "2022",
      description: "Designed and developed a six degrees of freedom robot arm using SOLIDWORKS.",
      highlights: [
        "Designed the Cover, Base, Shoulder Support, Upper Arm Model, Power Cable, and the Server Motor Subassembly",
        "Assembled all created parts along with predesigned parts to create the complete Robot Arm"
      ],
      images: [
        "/projects/robot-arm-1.jpg",
      ]
    }
  ];

  return (
    <motion.div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-background)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-sm p-5 sm:p-7 md:p-12 border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="absolute inset-0 opacity-70 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 20%, rgba(107, 75, 221, 0.12), transparent 35%), radial-gradient(circle at 80% 10%, rgba(124, 93, 216, 0.12), transparent 30%), radial-gradient(circle at 50% 80%, rgba(107, 75, 221, 0.08), transparent 35%)" }} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
          <div className="relative">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <motion.div
                className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-xl border-4 ring-4 ring-white/40"
                style={{ borderColor: 'var(--color-border)' }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/projects/my_picture_2.jpg"
                  alt="Mushfique Tanzim Muztaba"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex-1 space-y-4 text-center md:text-left"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2" style={{ color: 'var(--color-heading)' }}>Hey! I am Mushfique Tanzim Muztaba</h1>
                <p className="text-base sm:text-lg md:text-xl font-light" style={{ color: 'var(--color-body)' }}>Final Year Undergraduate Student in Mechanical Engineering</p>
              </motion.div>
              <motion.div 
                className="space-y-3 leading-relaxed"
                style={{ color: 'var(--color-body)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <p>I am passionate about mechanical design and prototyping. From concept development to physical fabrication, I enjoy turning ideas into functional solutions while also bringing experience in project management and digital automation.</p>
                <p>I am seeking opportunities where I can apply and further enhance my engineering skills.</p>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <motion.a
                    href="/projects/MUSHFIQUE TANZIM MUZTABA_CV.pdf"
                    download="Mushfique_Tanzim_Muztaba_CV.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download className="w-4 h-4" /> Download CV
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/mushfique-tanzim-muztaba/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-heading)] bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </motion.a>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <motion.a
                    href="mailto:mushfiquetm@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-heading)] bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </motion.a>
                  <motion.a
                    href="tel:+85256014576"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-heading)] bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Phone className="w-4 h-4" /> Phone
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="w-6 h-6 text-[var(--color-body)]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Education</h2>
          </motion.div>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <motion.img 
                src="/projects/university.jpg" 
                alt="The Hong Kong Polytechnic University Logo" 
                className="w-16 h-16 object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-heading)]">The Hong Kong Polytechnic University</h3>
                <p className="text-base sm:text-lg text-[var(--color-body)]">Bachelor of Engineering (Honours) in Mechanical Engineering</p>
                <p className="text-[var(--color-body)]">Graduation Date: June 2026</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Code className="w-6 h-6 text-[var(--color-body)]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Skills</h2>
          </motion.div>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Technical Skills */}
            <div>
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Code className="w-5 h-5 text-[#6B4BDD]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">Technical Skills</h3>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {['SOLIDWORKS', 'AutoCAD', 'MATLAB', 'Python', 'SQL', 'OpenCV', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Framer Motion (Animation Library)', 'CSS Variables', 'Raspberry Pi', 'GPIO', 'I2C', 'PID Control', 'Computer Vision', 'Microsoft Power Platform', 'Power Apps', 'Power Automate', 'Power BI', 'Microsoft Office', 'Excel', 'PowerPoint', 'Word'].map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + Math.floor(index / 6) * 0.1, // Group in batches of 6
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Design & Media */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Palette className="w-5 h-5 text-[#6B4BDD]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">Design & Media</h3>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {['Adobe Lightroom', 'CAPCUT', 'Da Vinci Resolve', 'Canva', 'Adobe Illustrator', 'UI/UX Design', 'Responsive Web Design', 'Animation Design', 'Interaction Design', 'Micro-interactions', 'User Experience Optimization'].map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:border-[#6B4BDD] hover:text-[#6B4BDD] transition-all duration-300 shadow-sm hover:shadow-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.6 + Math.floor(index / 4) * 0.08, // Group in batches of 4
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
          <motion.button
            onClick={() => setActiveView('3d')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center ${activeView === '3d' ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            3D Portfolio
          </motion.button>
          <motion.button
            onClick={() => setActiveView('all')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center ${activeView === 'all' ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            All Experiences
          </motion.button>
          <motion.button
            onClick={() => setActiveView('design')}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center ${activeView === 'design' ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Design Portfolio
          </motion.button>
        </div>
      </motion.div>

      {activeView === '3d' && (
        <>
          <div className="max-w-5xl mx-auto px-6 py-12 pb-20">
          <motion.div 
            className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-[var(--color-border)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
              <motion.div 
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Briefcase className="w-6 h-6 text-[var(--color-body)]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">3D Portfolio</h2>
              </motion.div>
            <div className="space-y-10">
              {projects3D.map((project, index) => (
                <ProjectItem key={index} index={index}>
                  <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">{project.title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">{project.date}</p>
                    </div>
                    <p className="text-[var(--color-body)] mb-4">{project.description}</p>
                    {project.images && project.images.length > 0 && (
                      <div className="mb-6">
                        {project.title === "TGGS - Motorbike Dolly for Crash Testing" || project.title === "Table Fan Redesign" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                              {project.images.slice(0, 3).map((imagePath, imgIndex) => (
                                <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${project.title} - Image ${imgIndex + 1}`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                                                              ))}
                              </div>
                              {project.images[3] && (
                                <div onClick={() => openLightbox(project.images[3], project.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                  <OptimizedImage
                                    src={project.images[3]}
                                    alt={`${project.title} - Image 4`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              )}
                            </div>
                          ) : project.title === "WEXTECH HK LIMITED - Product Designer" ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.images.map((imagePath, imgIndex) => (
                                  <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className="relative min-h-[350px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                    <OptimizedImage
                                      src={imagePath}
                                      alt={`${project.title} - Image ${imgIndex + 1}`}
                                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className={`grid gap-4 ${project.images.length === 1 ? 'grid-cols-1' : project.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : project.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                              {project.images.map((imagePath, imgIndex) => (
                                <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${project.images.length === 1 ? 'min-h-[400px]' : project.images.length === 2 ? 'min-h-[350px]' : 'min-h-[280px]'}`}>
                                  <OptimizedImage
                                    src={imagePath}
                                    alt={`${project.title} - Image ${imgIndex + 1}`}
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {project.highlights.length > 0 && (
                        <ul className="space-y-2">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                              <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </ProjectItem>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {activeView === 'all' && (
        <>
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="rounded-2xl shadow-sm p-8 md:p-12 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <motion.div 
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Briefcase className="w-6 h-6 text-[var(--color-body)]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Work Experience</h2>
              </motion.div>
              <div className="space-y-10">
                {workExperience.map((work, index) => (
                  <ProjectItem key={index} index={index}>
                    <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                      <div className="mb-3">
                        <div className="flex items-center gap-3 mb-1">
                          {(work.company === "CLP Power Hong Kong" || work.company === "PolyU E Formula Racing Team" || work.company === "Thai German Graduate School of Engineering (TGGS)" || work.company === "World Green Organization (WGO) – ESG Accelerator") && (
                            <img
                              src={work.company === "CLP Power Hong Kong" ? "/projects/CLP_logo_2.png" :
                                   work.company === "PolyU E Formula Racing Team" ? "/projects/Racing_logo.jpg" :
                                   work.company === "Thai German Graduate School of Engineering (TGGS)" ? "/projects/TGGS_logo.png" :
                                   "/projects/world_green_org_2.jpg"}
                              alt={`${work.company} Logo`}
                              className="w-8 h-8 object-contain rounded"
                            />
                          )}
                          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">{work.company}</h3>
                        </div>
                        <p className="text-base text-[var(--color-body)] mb-1">{work.role}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
                          <span>{work.date}</span><span>•</span><span>{work.location}</span>
                        </div>
                      </div>
                      {work.teams.map((team, teamIndex) => (
                        <div key={teamIndex} className="mt-4">
                          {team.name && <p className={`text-base font-medium text-[var(--color-body)] mb-2 ${team.name === 'Project Execution Team (PET)' || team.name === 'Hong Kong Battery Energy Storage System (HKBESS)' ? 'font-bold' : ''}`}>{team.name}</p>}
                          <ul className="space-y-2">
                            {team.highlights.map((highlight, i) => (
                              <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                                <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                          {'images' in team && team.images && team.images.length > 0 && (
                            <div className="mt-4">
                              <motion.button
                                onClick={() => toggleWorkTeamImages(team.name)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <motion.svg 
                                  className="w-4 h-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                  animate={{ rotate: showWorkTeamImages[team.name] ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                                {showWorkTeamImages[team.name] ? 'Hide Images' : 'Show Images'}
                              </motion.button>
                              <AnimatePresence>
                                {showWorkTeamImages[team.name] && 'images' in team && team.images && team.images.length > 0 && (
                                  <motion.div
                                    className="mt-4 space-y-4 overflow-hidden"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                  >
                                    <div className={`grid gap-4 ${team.images.length === 1 ? 'grid-cols-1' : team.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : team.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                      {team.images.map((imagePath: string, imgIndex: number) => (
                                        <motion.div
                                          key={imgIndex}
                                          onClick={() => openLightbox(imagePath, team.images, imgIndex)}
                                          className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${team.images.length === 1 ? 'min-h-[300px]' : team.images.length === 2 ? 'min-h-[250px]' : 'min-h-[100px]'}`}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                          whileHover={{ scale: 1.05, y: -5 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <OptimizedImage
                                            src={imagePath}
                                            alt={`${team.name} - Image ${imgIndex + 1}`}
                                            className="w-full h-auto object-contain"
                                          />
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      ))}
                      {work.images && work.images.length > 0 && (
                        <div className="mt-4">
                          <motion.button
                            onClick={() => toggleWorkImages(work.company)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              animate={{ rotate: showWorkImages[work.company] ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                            {showWorkImages[work.company] ? 'Hide Images' : 'Show Images'}
                          </motion.button>
                          <AnimatePresence>
                            {showWorkImages[work.company] && (
                              <motion.div
                                className="mt-4 space-y-4 overflow-hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                              >
                              {work.company === "Thai German Graduate School of Engineering (TGGS)" ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {work.images.slice(0, 3).map((imagePath, imgIndex) => (
                                      <div key={imgIndex} onClick={() => openLightbox(imagePath, work.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                        <OptimizedImage
                                          src={imagePath}
                                          alt={`${work.company} - Image ${imgIndex + 1}`}
                                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  {work.images[3] && (
                                    <div onClick={() => openLightbox(work.images[3], work.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                      <OptimizedImage
                                        src={work.images[3]}
                                        alt={`${work.company} - Image 4`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className={`grid gap-4 ${work.images.length === 1 ? 'grid-cols-1' : work.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : work.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                  {work.images.map((imagePath, imgIndex) => (
                                    <motion.div
                                      key={imgIndex}
                                      onClick={() => openLightbox(imagePath, work.images, imgIndex)}
                                      className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${work.images.length === 1 ? 'min-h-[400px]' : work.images.length === 2 ? 'min-h-[350px]' : work.images.length === 3 ? 'min-h-[200px]' : 'min-h-[200px]'}`}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                      whileHover={{ scale: 1.05, y: -5 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <OptimizedImage
                                        src={imagePath}
                                        alt={`${work.company} - Image ${imgIndex + 1}`}
                                        className="w-full h-auto object-contain"
                                      />
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </ProjectItem>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="rounded-2xl shadow-sm p-8 md:p-12 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <motion.div 
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Briefcase className="w-6 h-6 text-[var(--color-body)]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Projects</h2>
              </motion.div>
              <div className="space-y-10">
                {allExperiencesProjects.map((project, index) => (
                  <ProjectItem key={index} index={index}>
                    <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                      <div className="mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">{project.title}</h3>
                        <p className="text-sm text-[var(--color-muted)]">{project.date}</p>
                      </div>
                      {project.highlights.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                              <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {project.images && project.images.length > 0 && (
                        <div>
                          <button
                            onClick={() => toggleProjectImages(project.title)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                          >
                            <svg className={`w-4 h-4 transition-transform duration-200 ${showProjectImages[project.title] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {showProjectImages[project.title] ? 'Hide Images' : 'Show Images'}
                          </button>
                          {showProjectImages[project.title] && (
                            <div className="mt-4 space-y-4">
                              {project.title === "Redesigned a Table Fan" ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {project.images.slice(0, 3).map((imagePath, imgIndex) => (
                                      <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className="relative min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                        <OptimizedImage
                                          src={imagePath}
                                          alt={`${project.title} - Image ${imgIndex + 1}`}
                                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  {project.images[3] && (
                                    <div onClick={() => openLightbox(project.images[3], project.images, 3)} className="relative min-h-[300px] sm:min-h-[450px] rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center">
                                      <OptimizedImage
                                        src={project.images[3]}
                                        alt={`${project.title} - Image 4`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className={`grid gap-3 sm:gap-4 ${project.images.length === 1 ? 'grid-cols-1' : project.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : project.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                  {project.images.map((imagePath, imgIndex) => (
                                    <div key={imgIndex} onClick={() => openLightbox(imagePath, project.images, imgIndex)} className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${project.images.length === 1 ? 'min-h-[300px] sm:min-h-[400px]' : project.images.length === 2 ? 'min-h-[250px] sm:min-h-[350px]' : 'min-h-[200px] sm:min-h-[280px]'}`}>
                                      <OptimizedImage
                                        src={imagePath}
                                        alt={`${project.title} - Image ${imgIndex + 1}`}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </ProjectItem>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <motion.div
                className="flex items-center gap-3 mb-6 sm:mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="w-6 h-6 text-[var(--color-body)]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Certifications</h2>
              </motion.div>
              <div className="space-y-6">
                <ProjectItem key="cert1" index={0}>
                  <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold text-[var(--color-heading)] mb-1">Construction Industry Safety Training Certificate (Hong Kong Green Card)</h3>
                      <p className="text-base text-[var(--color-body)] mb-1">Issued by The Hong Kong Safety Training Association</p>
                      <p className="text-sm text-[var(--color-muted)]">Valid until March 2028</p>
                      <a href="/projects/green_card.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>
                </ProjectItem>
                <ProjectItem key="cert2" index={1}>
                  <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">Shipboard Cargo Handling Basic Safety Training Course (Hong Kong Blue Card)</h3>
                      <p className="text-base text-[var(--color-body)] mb-1">Issued by Asia Venture Human Resources & Construction Limited</p>
                      <p className="text-sm text-[var(--color-muted)]">Valid until January 2028</p>
                      <a href="/projects/blue_card.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>
                </ProjectItem>
                <ProjectItem key="cert3" index={2}>
                  <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">Learning AutoCAD 2024</h3>
                      <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                      <p className="text-sm text-[var(--color-muted)]">Completed July 03, 2023</p>
                      <a href="/projects/learning_autocad.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>
                </ProjectItem>
                <ProjectItem key="cert4" index={3}>
                  <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">SOLIDWORKS: Advanced Engineering Drawings</h3>
                      <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                      <p className="text-sm text-[var(--color-muted)]">Completed July 24, 2023</p>
                      <a href="/projects/solidworks_advanced_engineering_drawings.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>
                </ProjectItem>
                <ProjectItem key="cert5" index={4}>
                  <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">SOLIDWORKS: Advanced Simulation</h3>
                      <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                      <p className="text-sm text-[var(--color-muted)]">Completed July 24, 2023</p>
                      <a href="/projects/solidworks_advanced_simulation.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>
                </ProjectItem>
                <ProjectItem key="cert6" index={5}>
                  <div className="border-l-2 border-[var(--color-border)] pl-6 pb-6">
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)] mb-1">SOLIDWORKS: Modeling Gears</h3>
                      <p className="text-base text-[var(--color-body)] mb-1">Issued by LinkedIn Learning</p>
                      <p className="text-sm text-[var(--color-muted)]">Completed July 27, 2023</p>
                      <a href="/projects/solidworks_modeling_gears.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200 shadow-sm hover:shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>
                </ProjectItem>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="rounded-2xl shadow-sm p-8 md:p-12 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BookOpen className="w-6 h-6 text-[var(--color-body)]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Leadership & Campus Engagement</h2>
              </motion.div>
              <div className="space-y-8">
                {leadership.map((lead, index) => (
                  <ProjectItem key={index} index={index}>
                    <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">{lead.organization}</h3>
                          {lead.organization === "PolyU ENGL English Debate Club" && (
                            <a href="https://www.instagram.com/polyu.englishdebate?igsh=cDc4ZXhocWd1aG5t" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                          {lead.organization === "PolyU International Student Association" && (
                            <a href="https://www.instagram.com/polyusao_isa?igsh=MTk5c3VvdmphbHRkag==" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                          {lead.organization === "PolyU Student Halls of Residence" && (
                            <a href="https://www.instagram.com/polyu_yellow_hall?igsh=cmI4bW15YXJieDZh" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                        <p className="text-base text-[var(--color-body)] mb-1">{lead.role}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
                          <span>{lead.date}</span><span>•</span><span>{lead.location}</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        {lead.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                            <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      {lead.images && lead.images.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => toggleLeadershipImages(lead.organization)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6B4BDD] to-[#7C5DD8] hover:from-[#5A3BC7] hover:to-[#6B4BDD] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                          >
                            <svg className={`w-4 h-4 transition-transform duration-200 ${showLeadershipImages[lead.organization] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {showLeadershipImages[lead.organization] ? 'Hide Images' : 'Show Images'}
                          </button>
                          {showLeadershipImages[lead.organization] && (
                            <div className="mt-4 space-y-4">
                              <div className={`grid gap-4 ${lead.images.length === 1 ? 'grid-cols-1' : lead.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : lead.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                                {lead.images.map((imagePath, imgIndex) => (
                                  <div key={imgIndex} onClick={() => openLightbox(imagePath, lead.images, imgIndex)} className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex items-center justify-center ${lead.images.length === 1 ? 'min-h-[300px]' : lead.images.length === 2 ? 'min-h-[250px]' : 'min-h-[200px]'}`}>
                                    <img src={imagePath} alt={`${lead.organization} - Image ${imgIndex + 1}`} className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {lead.reels && lead.reels.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Instagram Reels</h4>
                          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {lead.reels.map((reel, index) => (
                              <motion.a
                                key={index}
                                href={reel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
                                style={{ 
                                  background: 'linear-gradient(to right, var(--color-surface), var(--color-surface))',
                                  borderColor: 'var(--color-border)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                                  e.currentTarget.style.background = 'linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--color-border)';
                                  e.currentTarget.style.background = 'linear-gradient(to right, var(--color-surface), var(--color-surface))';
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <motion.div 
                                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ background: 'linear-gradient(to bottom right, var(--color-accent), var(--color-primary))' }}
                                  whileHover={{ scale: 1.15, rotate: 360 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                  </svg>
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[var(--color-heading)] group-hover:text-[var(--color-heading)] truncate">
                                    {reel.title}
                                  </p>
                                  <p className="text-xs text-[var(--color-muted)] group-hover:text-[var(--color-body)]">
                                    View on Instagram
                                  </p>
                                </div>
                                <motion.div 
                                  className="flex-shrink-0"
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 1, x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </motion.div>
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ProjectItem>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'design' && (
        <>
          <div className="max-w-5xl mx-auto px-6 py-12">
            <motion.div
              className="rounded-2xl shadow-sm p-4 sm:p-6 md:p-12 border"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BookOpen className="w-6 h-6 text-[var(--color-body)]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">Design Portfolio</h2>
              </motion.div>
              <p className="text-[var(--color-body)] mb-6">Click on the Instagram icon beside each club name to explore more content.</p>
              <div className="space-y-8">
                {leadership.map((lead, index) => (
                  <ProjectItem key={index} index={index}>
                    <div className="border-l-2 border-[var(--color-border)] pl-3 sm:pl-4 md:pl-6 pb-4 sm:pb-6 last:pb-0">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-heading)]">{lead.organization}</h3>
                          {lead.organization === "PolyU ENGL English Debate Club" && (
                            <a href="https://www.instagram.com/polyu.englishdebate?igsh=cDc4ZXhocWd1aG5t" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                          {lead.organization === "PolyU International Student Association" && (
                            <a href="https://www.instagram.com/polyusao_isa?igsh=MTk5c3VvdmphbHRkag==" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                          {lead.organization === "PolyU Student Halls of Residence" && (
                            <a href="https://www.instagram.com/polyu_yellow_hall?igsh=cmI4bW15YXJieDZh" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-body)] transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                        <p className="text-base text-[var(--color-body)] mb-1">{lead.role}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
                          <span>{lead.date}</span><span>•</span><span>{lead.location}</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mt-4">
                        {lead.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-[var(--color-body)] flex gap-2">
                            <span className="text-[var(--color-muted)] mt-1">•</span><span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      {lead.images && lead.images.length > 0 && (
                        <div className="mt-6">
                          <div className="space-y-4">
                            <div className={`grid gap-4 ${lead.images.length === 1 ? 'grid-cols-1' : lead.images.length === 2 ? 'grid-cols-1 md:grid-cols-2' : lead.images.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'}`}>
                              {lead.images.map((imagePath, imgIndex) => (
                                <motion.div 
                                  key={imgIndex} 
                                  onClick={() => openLightbox(imagePath, lead.images, imgIndex)} 
                                  className={`relative rounded-lg overflow-hidden bg-[var(--color-surface)] group cursor-pointer flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 ${lead.images.length === 1 ? 'min-h-[300px]' : lead.images.length === 2 ? 'min-h-[250px]' : 'min-h-[200px]'}`}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                  whileHover={{ scale: 1.05, y: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <motion.img 
                                    src={imagePath} 
                                    alt={`${lead.organization} - Image ${imgIndex + 1}`} 
                                    className="w-full h-auto object-contain"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {lead.reels && lead.reels.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-[var(--color-body)] mb-3">Instagram Reels</h4>
                          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {lead.reels.map((reel, index) => (
                              <motion.a
                                key={index}
                                href={reel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
                                style={{ 
                                  background: 'linear-gradient(to right, var(--color-surface), var(--color-surface))',
                                  borderColor: 'var(--color-border)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                                  e.currentTarget.style.background = 'linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--color-border)';
                                  e.currentTarget.style.background = 'linear-gradient(to right, var(--color-surface), var(--color-surface))';
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <motion.div 
                                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ background: 'linear-gradient(to bottom right, var(--color-accent), var(--color-primary))' }}
                                  whileHover={{ scale: 1.15, rotate: 360 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                  </svg>
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[var(--color-heading)] group-hover:text-[var(--color-heading)] truncate">
                                    {reel.title}
                                  </p>
                                  <p className="text-xs text-[var(--color-muted)] group-hover:text-[var(--color-body)]">
                                    View on Instagram
                                  </p>
                                </div>
                                <motion.div 
                                  className="flex-shrink-0"
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 1, x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </motion.div>
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ProjectItem>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="text-center text-[var(--color-muted)] text-xs sm:text-sm space-y-2">
          <p>© 2026 Mushfique Tanzim Muztaba</p>
          <a href="https://www.linkedin.com/in/mushfique-tanzim-muztaba-331228242/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--color-body)] transition-colors min-h-[44px] px-2">
            LinkedIn <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4" 
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
            />
            <motion.button 
              onClick={closeLightbox} 
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-[var(--color-muted)] transition-colors z-10 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
              aria-label="Close lightbox"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.button>
            {lightboxImages.length > 1 && (
              <>
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} 
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-muted)] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
                  aria-label="Previous image"
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button 
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} 
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-[var(--color-muted)] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
                  aria-label="Next image"
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}
            <motion.div
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center px-4 sm:px-0"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              key={lightboxImage}
            >
              <OptimizedImage
                src={lightboxImage}
                alt="Lightbox image"
                className="max-w-full max-h-[85vh] sm:max-h-full object-contain"
                motionProps={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.95 },
                  transition: { duration: 0.3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }
                }}
              />
            </motion.div>
            {lightboxImages.length > 1 && (
              <motion.div 
                className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentImageIndex + 1} / {lightboxImages.length}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}