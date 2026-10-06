const { PrismaClient, Role, ContentStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create Admin User
  const adminEmail = "admin@janic.edu.so";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("AdminPassword2026!", salt);

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "JANIC System Administrator",
        role: Role.ADMIN,
        avatar: "/images/admin-avatar.png",
      },
    });
    console.log("Created admin user: admin@janic.edu.so (Password: AdminPassword2026!)");
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { passwordHash, role: Role.ADMIN },
    });
    console.log("Updated admin user credentials.");
  }

  // 2. Seed Student Innovation Projects from JANIC docx
  const projects = [
    {
      title: "MAAL HUB",
      slug: "maal-hub",
      category: "Web Platform",
      summary: "An investment and entrepreneurship platform connecting investors with small-business owners and innovators.",
      problem: "Access to early-stage capital and structured mentorship is severely limited for aspiring Somali entrepreneurs and micro-businesses, creating a bottleneck for regional economic growth.",
      solution: "MAAL HUB bridges this gap through a verified digital marketplace offering equity crowdfunding tracking, pitch deck reviews, and real-time investor communication channels.",
      technology: "Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, REST APIs",
      innovation: "Smart matching algorithms that align investor risk appetite with startup traction metrics, tailored specifically to local business structures.",
      outcomes: "Piloted with 12 student startups and 5 local angel investors, facilitating over $45,000 in pledged seed commitments.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      heroImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      demoUrl: "https://maalhub.example.com",
      teamMembers: "Ahmed Nur (Lead), Hafsa Abdullahi (Full-Stack), Mohamed Ali (UI/UX)",
      order: 1,
      publishedAt: new Date(),
    },
    {
      title: "SAHAL SACCO",
      slug: "sahal-sacco",
      category: "Branding & Graphic Design",
      summary: "A modern brand identity and digital design system built on trust, financial accessibility, and long-term community growth.",
      problem: "Traditional savings and credit cooperatives suffer from outdated branding and unintuitive digital interfaces, alienating tech-savvy younger members.",
      solution: "A complete visual identity system, including logo, typography guidelines, responsive mobile dashboard UI, and accessible member cards.",
      technology: "Figma, Adobe Illustrator, React Native UI Kit, Tailwind CSS",
      innovation: "Bilingual design system (Somali & English) crafted with culturally resonant iconography representing community resilience and thrift.",
      outcomes: "Adopted by 3 regional cooperative savings groups, reporting a 64% increase in youth member onboarding.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      teamMembers: "Khadar Hassan (Brand Strategist), Fartun Ismail (Design Lead)",
      order: 2,
      publishedAt: new Date(),
    },
    {
      title: "BADBAADO",
      slug: "badbaado",
      category: "HealthTech / API",
      summary: "A lightweight, secure, API-first healthcare coordination platform supporting inter-hospital patient handoffs and emergency triage alerts.",
      problem: "Hospitals in Mogadishu face critical communication delays during emergency patient transfers due to lack of interoperable medical records and automated bed availability tracking.",
      solution: "BADBAADO provides an ultra-low-bandwidth FHIR-compatible REST API and mobile dispatch dashboard that transmits vitals, trauma scores, and estimated arrival times to receiving ER teams.",
      technology: "Next.js, FastAPI, WebSockets, Docker, MySQL, Redis, Tailwind CSS",
      innovation: "Offline-first sync engine that queues vital patient transfer data during network interruptions and synchronizes instantly upon reconnection.",
      outcomes: "Reduced inter-hospital emergency handoff communication lag by 48% across 4 participating clinical wards.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      demoUrl: "https://badbaado-health.example.com",
      teamMembers: "Dr. Abdirashid Sheikh (Clinical Advisor), Zakaria Jama (Backend & API Lead), Maryan Yusuf (Frontend)",
      order: 3,
      publishedAt: new Date(),
    },
    {
      title: "ROBOT CAR CLEANER",
      slug: "robot-car-cleaner",
      category: "Robotics / Arduino",
      summary: "An autonomous Arduino-based robotic vehicle engineered to detect obstacles, navigate confined spaces, and collect debris.",
      problem: "Manual waste cleaning in university workshops and tight urban corridors is labor-intensive and poses safety hazards near operational machinery.",
      solution: "An automated mobile robot featuring ultrasonic distance sensors, differential motor drivers, and a vacuum-brush collection mechanism.",
      technology: "Arduino Mega, C++, Ultrasonic Sensors, L298N Motor Driver, 3D CAD Modeling",
      innovation: "Adaptive obstacle avoidance routing algorithm with custom chassis weight distribution optimizing battery life and sweep coverage.",
      outcomes: "Successfully deployed in Jazeera University engineering laboratories, achieving an 85% autonomous cleaning coverage rate.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://youtube.com/watch?v=example-robot",
      teamMembers: "Mustafa Dahir (Hardware Lead), Hamza Osman (Firmware Engineer), Bilal Aden (Mechanical Design)",
      order: 4,
      publishedAt: new Date(),
    },
    {
      title: "STUDENT FILE",
      slug: "student-file",
      category: "Information Systems",
      summary: "Duplicate file detection and intelligent storage management system optimizing institutional academic archives.",
      problem: "University servers accumulated hundreds of gigabytes of redundant academic coursework, assignment duplicates, and disorganized student documentation.",
      solution: "An automated hashing and categorization tool that analyzes file signatures (SHA-256), detects exact and near-duplicates, and archives old versions.",
      technology: "Python, Next.js, MySQL, Redis, MinIO / S3 Storage, Tailwind CSS",
      innovation: "Near-duplicate semantic analysis for PDF documents and deduplication at ingestion without impacting student retrieval speeds.",
      outcomes: "Reclaimed 42% of university faculty storage capacity and accelerated student transcript retrieval from minutes to seconds.",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      heroImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      teamMembers: "Ayan Warsame (System Architect), Osman Barre (Database Engineer)",
      order: 5,
      publishedAt: new Date(),
    },
    {
      title: "JANIC DOCUMENTARY",
      slug: "janic-documentary",
      category: "Media & Digital Storytelling",
      summary: "A high-definition visual storytelling and documentary series chronicling the JANIC innovation journey from 2021 to date.",
      problem: "Groundbreaking student innovations and grassroots tech breakthroughs in Somalia often lack professional media representation to reach global audiences.",
      solution: "A multi-part documentary and digital media campaign showcasing student founders, laboratory breakthroughs, and the founding story at Jazeera University.",
      technology: "Adobe Premiere Pro, DaVinci Resolve, Cinema Cameras, Web Video Optimization",
      innovation: "Interactive web documentary format pairing video chapters with live code repositories and project interactive demos.",
      outcomes: "Over 85,000 views across digital platforms and featured at the National ICT Exhibition in Mogadishu.",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      heroImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://youtube.com/watch?v=janic-doc",
      teamMembers: "Farhan Keynan (Director), Leyla Abdi (Cinematographer & Editor)",
      order: 6,
      publishedAt: new Date(),
    },
    {
      title: "SMART DUST PIN",
      slug: "smart-dust-pin",
      category: "IoT / Arduino",
      summary: "An IoT-enabled smart dry and wet waste separation bin promoting sustainable recycling on university campuses.",
      problem: "Unsorted municipal waste in educational institutions contaminates recyclable material and increases processing hazards.",
      solution: "A dual-chamber smart receptacle that senses moisture levels, metal conductivity, and proximity, opening the corresponding lid automatically.",
      technology: "ESP32, Soil Moisture Sensors, Inductive Proximity Sensors, Servo Motors, MQTT, Cloud Dashboard",
      innovation: "Low-power battery management system with solar trickle charging and automated fill-level SMS alerts to custodial teams.",
      outcomes: "Deployed across 8 campus buildings, diverting over 3.2 tons of clean recyclables away from municipal landfills.",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      heroImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      teamMembers: "Mohamud Gedi (IoT Engineer), Sahra Noor (Embedded Systems)",
      order: 7,
      publishedAt: new Date(),
    },
    {
      title: "AUTO WATER",
      slug: "auto-water",
      category: "IoT / Automation",
      summary: "A contactless automatic water dispenser engineered for hygienic public and institutional sanitation.",
      problem: "Cross-contamination on manual water dispensers and taps in university facilities elevates the spread of infectious illnesses.",
      solution: "An infrared-triggered solenoid dispensing valve system that accurately dispenses preset water volumes without physical touch.",
      technology: "Arduino Nano, Infrared Proximity Sensor, 12V Solenoid Valve, Relay Module, Flow Meter",
      innovation: "Pulse-width flow modulation that eliminates water spillage and reduces water wastage by 35% compared to manual faucets.",
      outcomes: "Installed at 14 campus hydration stations, logging over 120,000 contactless dispensations.",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      heroImage: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80",
      teamMembers: "Ibrahim Salad (Hardware Engineer), Naima Muse (Electronics Specialist)",
      order: 8,
      publishedAt: new Date(),
    },
  ];

  for (const projectData of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: projectData.slug } });
    if (!existing) {
      await prisma.project.create({ data: projectData });
    } else {
      await prisma.project.update({ where: { slug: projectData.slug }, data: projectData });
    }
  }
  console.log(`Seeded ${projects.length} innovation projects.`);

  // 3. Seed Training Programs
  const trainingPrograms = [
    {
      title: "Full-Stack Web & Platform Engineering",
      slug: "full-stack-web-engineering",
      category: "Software Engineering",
      summary: "Master modern web development from relational databases to responsive React and Next.js user interfaces.",
      description: "An intensive 12-week program designed for aspiring software engineers. Students learn modern TypeScript, Next.js, relational database architecture with MySQL/PostgreSQL, REST and GraphQL APIs, Docker containers, and automated deployment pipelines.",
      level: "Intermediate",
      duration: "12 Weeks",
      schedule: "Mon & Wed, 4:00 PM – 7:00 PM",
      mode: "On-Campus & Hybrid",
      certification: "JANIC Certified Full-Stack Developer",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      maxSeats: 30,
    },
    {
      title: "Robotics, Embedded Systems & IoT",
      slug: "robotics-embedded-systems-iot",
      category: "Emerging Technologies",
      summary: "Hands-on engineering covering microcontrollers, sensor integration, Arduino, ESP32, and automated systems.",
      description: "Gain real-world experience designing electronic circuits, programming Arduino and ESP32 microcontrollers, integrating ultrasonic and optical sensors, motor drivers, and building IoT wireless telemetry pipelines.",
      level: "Beginner to Intermediate",
      duration: "10 Weeks",
      schedule: "Tue & Thu, 3:30 PM – 6:30 PM",
      mode: "On-Campus (Hardware Lab)",
      certification: "JANIC Certified IoT & Robotics Specialist",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
      maxSeats: 25,
    },
    {
      title: "Cybersecurity Defense & Network Infrastructure",
      slug: "cybersecurity-network-infrastructure",
      category: "Cybersecurity",
      summary: "Practical training in ethical hacking, vulnerability assessments, firewall configuration, and SOC fundamentals.",
      description: "Prepare for international security certifications with comprehensive practical labs covering network defense, penetration testing fundamentals, secure Linux server hardening, cryptographic protocols, and incident response.",
      level: "Intermediate",
      duration: "8 Weeks",
      schedule: "Saturdays, 9:00 AM – 3:00 PM",
      mode: "On-Campus",
      certification: "JANIC Network Security Practitioner",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      maxSeats: 25,
    },
    {
      title: "Cloud Computing & DevOps Architecture",
      slug: "cloud-computing-devops",
      category: "Cloud Computing",
      summary: "Build scalable cloud infrastructure with Linux, Docker, CI/CD pipelines, and cloud native architectures.",
      description: "Learn how modern tech enterprises deploy and scale applications. Covers containerization with Docker, reverse proxies with Nginx, continuous integration pipelines, and infrastructure management.",
      level: "Intermediate to Advanced",
      duration: "8 Weeks",
      schedule: "Sun & Tue, 5:00 PM – 7:30 PM",
      mode: "Hybrid",
      certification: "JANIC Certified Cloud Associate",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      maxSeats: 30,
    },
    {
      title: "AI, Machine Learning & Intelligent Automation",
      slug: "ai-machine-learning-automation",
      category: "Emerging Technologies",
      summary: "Explore applied machine learning, computer vision, data analysis with Python, and intelligent agent workflows.",
      description: "Dive into data science and modern AI. Learn Python for numerical analysis, train machine learning classifiers with scikit-learn, build neural networks, and explore real-world computer vision applications.",
      level: "Intermediate",
      duration: "10 Weeks",
      schedule: "Wed & Sat, 4:00 PM – 7:00 PM",
      mode: "On-Campus",
      certification: "JANIC Applied AI Practitioner",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      maxSeats: 25,
    },
    {
      title: "UI/UX & Product Design Masterclass",
      slug: "ui-ux-product-design",
      category: "Digital Design",
      summary: "Transform complex software requirements into intuitive, accessible, and delightful digital user interfaces.",
      description: "Learn user research, wireframing, high-fidelity prototyping in Figma, design systems, design tokens, micro-interactions, and developer handoff workflows.",
      level: "Beginner",
      duration: "6 Weeks",
      schedule: "Mon & Thu, 4:00 PM – 6:30 PM",
      mode: "On-Campus",
      certification: "JANIC Product Design Certificate",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
      maxSeats: 20,
    },
  ];

  for (const program of trainingPrograms) {
    const existing = await prisma.trainingProgram.findUnique({ where: { slug: program.slug } });
    if (!existing) {
      await prisma.trainingProgram.create({ data: program });
    } else {
      await prisma.trainingProgram.update({ where: { slug: program.slug }, data: program });
    }
  }
  console.log(`Seeded ${trainingPrograms.length} training programs.`);

  // 4. Seed Research Papers
  const researchPapers = [
    {
      title: "AI-Driven Emergency Triage and Inter-Hospital Coordination in Resource-Constrained Environments",
      slug: "ai-emergency-triage-inter-hospital-coordination",
      category: "Applied Research",
      abstract: "This paper evaluates the efficacy of an API-centric healthcare dispatch architecture that applies lightweight decision-tree classifiers to triage urgent emergency handoffs across secondary healthcare facilities in Mogadishu.",
      content: "Detailed comparative analysis demonstrating a 48% reduction in transfer latency and improved data fidelity under intermittent 3G connectivity.",
      authors: "Dr. Hassan Omar, Eng. Zakaria Jama, Faculty of Computer Science & IT, Jazeera University",
      journalOrConference: "East African Journal of Medical Informatics & Digital Health (2025)",
      doi: "10.1016/j.eajmidh.2025.04.012",
      publicationDate: new Date("2025-05-15"),
      pdfUrl: "https://janic.edu.so/research/papers/ai-triage-badbaado.pdf",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      title: "Edge Robotics for Autonomous Municipal Waste Separation in Arid Coastal Cities",
      slug: "edge-robotics-autonomous-waste-separation",
      category: "Technology Innovation",
      abstract: "Investigates the implementation of low-cost edge sensors coupled with embedded microcontroller architectures to automate the sorting of recyclable dry versus wet municipal waste in high-ambient temperature settings.",
      content: "Experimental trials in educational institutions revealed a 91% sensor accuracy rate under heavy dust environments with zero mechanical failures over 90 days.",
      authors: "Mustafa Dahir, Eng. Amina Farah, JANIC Robotics Division",
      journalOrConference: "IEEE International Conference on Sustainable Computing & IoT (2025)",
      doi: "10.1109/ICSCI.2025.1084219",
      publicationDate: new Date("2025-08-20"),
      pdfUrl: "https://janic.edu.so/research/papers/smart-waste-robotics.pdf",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      title: "Optimized File Deduplication Architectures for Distributed Academic Information Systems",
      slug: "optimized-file-deduplication-academic-systems",
      category: "Student Research",
      abstract: "Presents an algorithmic framework integrating cryptographic chunk hashing with metadata clustering to minimize institutional cloud storage costs across university faculties.",
      content: "Achieved a 42% physical footprint reduction without degrading latency for simultaneous student download requests during exam cycles.",
      authors: "Ayan Warsame, Dr. Mohamed Qasim",
      journalOrConference: "JANIC Academic Working Papers Series, Vol. 3",
      publicationDate: new Date("2025-11-10"),
      pdfUrl: "https://janic.edu.so/research/papers/academic-deduplication.pdf",
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
    },
  ];

  for (const paper of researchPapers) {
    const existing = await prisma.researchPaper.findUnique({ where: { slug: paper.slug } });
    if (!existing) {
      await prisma.researchPaper.create({ data: paper });
    } else {
      await prisma.researchPaper.update({ where: { slug: paper.slug }, data: paper });
    }
  }
  console.log(`Seeded ${researchPapers.length} research papers.`);

  // 5. Seed Events
  const events = [
    {
      title: "JANIC Annual Tech Showcase & Demo Day 2026",
      slug: "janic-annual-tech-showcase-2026",
      category: "Innovation Showcase",
      summary: "Experience the latest student-built hardware prototypes, AI applications, and startup innovations live on stage.",
      description: "Join university leaders, tech industry pioneers, angel investors, and government representatives as JANIC's student innovators pitch and demonstrate functional prototypes built over the past academic year.",
      eventDate: new Date("2026-11-20T09:00:00Z"),
      endDate: new Date("2026-11-20T17:00:00Z"),
      location: "Jazeera University Main Auditorium, Mogadishu",
      isVirtual: false,
      capacity: 350,
      registrationUrl: "https://janic.edu.so/events/demo-day-2026/register",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Mogadishu Smart Cities Student Hackathon 2026",
      slug: "mogadishu-smart-cities-hackathon-2026",
      category: "Student Hackathons",
      summary: "48-hour competitive hackathon solving urban mobility, healthcare, and digital finance challenges.",
      description: "Teams of 3 to 5 students will collaborate intensively over 48 hours with expert engineering mentors to prototype software and IoT solutions that tackle pressing challenges in urban living.",
      eventDate: new Date("2026-12-05T08:00:00Z"),
      endDate: new Date("2026-12-07T18:00:00Z"),
      location: "JANIC Innovation Lab, Jazeera University",
      isVirtual: false,
      capacity: 120,
      registrationUrl: "https://janic.edu.so/events/smart-cities-hackathon/register",
      status: ContentStatus.PUBLISHED,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Embedded Robotics & IoT Hands-On Workshop",
      slug: "embedded-robotics-iot-workshop",
      category: "Technology Competitions",
      summary: "Interactive microcontroller programming and sensor integration workshop for university and high school tech talents.",
      description: "Learn how to wire, program, and debug Arduino and ESP32 microcontrollers. Attendees build a line-tracking sensor robot from scratch during this intensive weekend workshop.",
      eventDate: new Date("2026-10-25T13:30:00Z"),
      endDate: new Date("2026-10-25T18:00:00Z"),
      location: "JANIC Hardware & Robotics Laboratory",
      isVirtual: false,
      capacity: 50,
      status: ContentStatus.PUBLISHED,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const event of events) {
    const existing = await prisma.event.findUnique({ where: { slug: event.slug } });
    if (!existing) {
      await prisma.event.create({ data: event });
    } else {
      await prisma.event.update({ where: { slug: event.slug }, data: event });
    }
  }
  console.log(`Seeded ${events.length} events.`);

  // 6. Seed Team Members
  const teamMembers = [
    {
      name: "Eng. Abdullahi Hassan",
      role: "Director of JANIC",
      department: "Faculty of Computer Science & IT",
      bio: "Leading JANIC's strategic vision to connect academic curricula with high-impact market technology solutions.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      email: "director@janic.edu.so",
      linkedin: "https://linkedin.com",
      order: 1,
      isActive: true,
    },
    {
      name: "Dr. Mohamed Qasim",
      role: "Dean, Faculty of CS & IT",
      department: "Jazeera University",
      bio: "Academic leader championing research excellence, curriculum modernization, and international accreditation.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      email: "dean.cs@jazeera.edu.so",
      order: 2,
      isActive: true,
    },
    {
      name: "Eng. Amina Farah",
      role: "Head of Robotics & IoT Lab",
      department: "JANIC Hardware Division",
      bio: "Specializing in embedded electronics, autonomous robotics, and IoT hardware prototyping for regional challenges.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      email: "robotics@janic.edu.so",
      order: 3,
      isActive: true,
    },
    {
      name: "Zakaria Jama",
      role: "Lead Software & API Architect",
      department: "JANIC Software Incubator",
      bio: "Full-stack engineer focusing on distributed web platforms, API security, and mentor to student development teams.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      email: "software@janic.edu.so",
      order: 4,
      isActive: true,
    },
  ];

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({ where: { name: member.name } });
    if (!existing) {
      await prisma.teamMember.create({ data: member });
    } else {
      await prisma.teamMember.update({ where: { id: existing.id }, data: member });
    }
  }
  console.log(`Seeded ${teamMembers.length} team members.`);

  // 7. Site Settings
  const settings = [
    { key: "site_name", value: "Jazeera Nexus Innovation Center (JANIC)", group: "general" },
    { key: "site_tagline", value: "Innovating Technology. Empowering the Future.", group: "general" },
    { key: "contact_email", value: "info@janic.edu.so", group: "contact" },
    { key: "contact_phone", value: "+252 61 555 1234", group: "contact" },
    { key: "campus_address", value: "Jazeera University Main Campus, KM4, Mogadishu, Somalia", group: "contact" },
    { key: "founded_date", value: "October 25, 2021", group: "institutional" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }
  console.log("Seeded site settings.");

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
