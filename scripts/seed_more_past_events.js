const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function seedMorePastEvents() {
  console.log("Adding 6 more past events to JANIC so past events total >= 10...");

  const additionalPastEvents = [
    {
      title: "Somali AI & NLP Research Symposium 2024",
      slug: "somali-ai-nlp-symposium-2024",
      summary: "Academic researchers, faculty scholars, and student engineers convened to present natural language processing models tailored to Somali dialectical corpora.",
      description: "The Somali AI & NLP Research Symposium 2024 marked a historic milestone for computational linguistics in East Africa. Hosted at Jazeera University, the event highlighted open-source LLM fine-tuning, automated speech recognition for regional Somali dialects, and digital literacy tools developed by JANIC researchers.",
      category: "Tech Summits",
      eventDate: new Date("2024-12-10T09:00:00.000Z"),
      endDate: new Date("2024-12-10T16:00:00.000Z"),
      location: "Jazeera University Research Hall B, Mogadishu",
      isVirtual: false,
      capacity: 300,
      attendeesCount: 280,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/event-cyber.jpg",
      videoUrl: "/uploads/1791540165560_tm1i2_IMG_5677.MP4",
      gallery: JSON.stringify([
        { url: "/images/event-cyber.jpg", caption: "Symposium Plenary Presentation", alt: "Plenary" },
        { url: "/uploads/1791440285236_v1igg_Stage_Backdrop.jpg", caption: "Auditorium Discussion Stage", alt: "Stage" }
      ]),
      guests: JSON.stringify([
        { name: "Dr. Abdullahi Mohamed", role: "Keynote Speaker", organization: "Dean of IT, Jazeera University", avatar: "/images/Founder-img.jpeg" }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 10:30", title: "Somali NLP Keynote", speaker: "Dr. Abdullahi Mohamed", description: "State of Somali dialect modeling" },
        { time: "11:00 - 14:00", title: "Research Paper Presentations", speaker: "Student Researchers", description: "Corpus analysis and benchmarking" }
      ]),
      keyHighlights: JSON.stringify(["280+ Attendees", "14 Research Papers Presented", "Open-source Dataset Released"])
    },
    {
      title: "Mogadishu FinTech Hackathon 2025",
      slug: "mogadishu-fintech-hackathon-2025",
      summary: "A 48-hour competitive sprint engineering frictionless mobile payment integrations, micro-lending algorithms, and USSD banking APIs.",
      description: "Over 200 student developers gathered for the Mogadishu FinTech Hackathon 2025 to disrupt digital finance in Somalia. Teams built working prototypes connecting local telecommunication mobile money infrastructure with automated accounting and fraud detection engines.",
      category: "Student Hackathons",
      eventDate: new Date("2025-02-14T08:30:00.000Z"),
      endDate: new Date("2025-02-16T18:00:00.000Z"),
      location: "JANIC Innovation Lab & Co-working Floor",
      isVirtual: false,
      capacity: 250,
      attendeesCount: 310,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/event-summit.jpg",
      videoUrl: "/uploads/1791487046676_2z645_my-video_2026-07-27_17-40-22__1_.mp4",
      gallery: JSON.stringify([
        { url: "/uploads/1791440308820_xw2rm_Group_of_enthusiastic_Somali_students_in_a_high-tech_workshop__using_futuristic_tools__smiling_and_c.jpg", caption: "Fintech Teams Collaborating", alt: "Collaboration" },
        { url: "/uploads/1791485114805_54hfs_Event_Banner_Mockup.jpg", caption: "Hackathon Welcome Zone", alt: "Welcome" }
      ]),
      guests: JSON.stringify([
        { name: "Eng. Qaarey", role: "Technical Judge", organization: "Senior Cloud Architect", avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png" }
      ]),
      agenda: JSON.stringify([
        { time: "08:30 - 09:30", title: "Problem Statement Unveiling", speaker: "Organizers", description: "Fintech tracks introduced" },
        { time: "09:30 - 18:00", title: "Sprint & Mentor Reviews", speaker: "Mentors", description: "Continuous code reviews" }
      ]),
      keyHighlights: JSON.stringify(["310 Participants", "28 FinTech Prototypes", "$8,000 in Prizes"])
    },
    {
      title: "Jazeera Web3 & Decentralized Systems Workshop",
      slug: "jazeera-web3-decentralized-systems-workshop",
      summary: "Hands-on masterclass covering cryptographic primitives, smart contract security, and decentralized identity for student engineers.",
      description: "An intensive training lab providing practical exposure to decentralized ledgers, cryptographic proofs, and decentralized identity verification systems. Participants deployed audited testnet smart contracts and explored tamper-proof academic credentials.",
      category: "Workshops & Training",
      eventDate: new Date("2025-01-22T10:00:00.000Z"),
      endDate: new Date("2025-01-22T17:00:00.000Z"),
      location: "Software Engineering Lab 3, Jazeera University",
      isVirtual: false,
      capacity: 200,
      attendeesCount: 180,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/event-cyber.jpg",
      videoUrl: null,
      gallery: JSON.stringify([
        { url: "/images/janic-hero-lab.jpg", caption: "Engineering Lab Training", alt: "Lab" }
      ]),
      guests: JSON.stringify([
        { name: "Eng. Muscab Ahmed", role: "Lead Instructor", organization: "JANIC", avatar: "/uploads/1791399723072_sypno_muscab.jpeg" }
      ]),
      agenda: JSON.stringify([
        { time: "10:00 - 12:30", title: "Decentralized Architecture Fundamentals", speaker: "Eng. Muscab Ahmed", description: "Ledger basics" },
        { time: "13:30 - 17:00", title: "Hands-on Smart Contract Lab", speaker: "Lab Assistants", description: "Contract deployments" }
      ]),
      keyHighlights: JSON.stringify(["180 Attendees", "100% Hands-on Coding", "Verifiable Certificates"])
    },
    {
      title: "Somali Youth Coding Cup 2024",
      slug: "somali-youth-coding-cup-2024",
      summary: "Annual high-speed algorithmic programming contest challenging university and high school coders with dynamic programming, graphs, and data structures.",
      description: "Over 50 teams competed in the annual Somali Youth Coding Cup 2024. Modeled after the ACM-ICPC, contestants solved 10 competitive algorithmic puzzles in under 4 hours, showcasing raw mathematical logic and optimization skills.",
      category: "Competitions & CTFs",
      eventDate: new Date("2024-08-16T09:00:00.000Z"),
      endDate: new Date("2024-08-16T15:00:00.000Z"),
      location: "Jazeera University Main Auditorium, Mogadishu",
      isVirtual: false,
      capacity: 300,
      attendeesCount: 250,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/event-summit.jpg",
      videoUrl: "/uploads/1791540165560_tm1i2_IMG_5677.MP4",
      gallery: JSON.stringify([
        { url: "/uploads/1791440285236_v1igg_Stage_Backdrop.jpg", caption: "Scoreboard Live Screen", alt: "Scoreboard" }
      ]),
      guests: JSON.stringify([
        { name: "Dr. Abdullahi Mohamed", role: "Patron", organization: "Dean of IT", avatar: "/images/Founder-img.jpeg" }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 10:00", title: "Practice Problem Round", speaker: "Judges", description: "Warm-up" },
        { time: "10:00 - 14:00", title: "Competitive Contest Round", speaker: "Teams", description: "Timed coding" }
      ]),
      keyHighlights: JSON.stringify(["50+ Teams", "4-Hour High Stakes Contest", "Trophies & Tech Scholarships"])
    },
    {
      title: "Autonomous Drone & Robotics Bootcamp 2024",
      slug: "autonomous-drone-robotics-bootcamp-2024",
      summary: "A 5-day bootcamp where students built flight controllers, programmed autonomous obstacle avoidance, and tested unmanned aerial survey vehicles.",
      description: "Students from Jazeera University engineered autonomous UAVs from ground-up microcontrollers to optical sensor modules. The bootcamp concluded with outdoor test flights simulating aerial surveying for agricultural crop health in regional Somalia.",
      category: "Robotics & IoT",
      eventDate: new Date("2024-11-05T09:00:00.000Z"),
      endDate: new Date("2024-11-09T17:00:00.000Z"),
      location: "JANIC Hardware Prototyping Workshop, Ground Floor",
      isVirtual: false,
      capacity: 220,
      attendeesCount: 195,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/robot-car-cleaner.jpg",
      videoUrl: null,
      gallery: JSON.stringify([
        { url: "/images/robot-car-cleaner.jpg", caption: "Hardware Assembly in Lab", alt: "Robotics" }
      ]),
      guests: JSON.stringify([
        { name: "Eng. Muscab Ahmed", role: "Robotics Mentor", organization: "JANIC", avatar: "/uploads/1791399723072_sypno_muscab.jpeg" }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 12:00", title: "Avionics & Flight Physics", speaker: "Eng. Muscab", description: "Sensor fundamentals" },
        { time: "13:00 - 17:00", title: "Live Flight Testing", speaker: "Students", description: "Drone telemetry" }
      ]),
      keyHighlights: JSON.stringify(["195 Participants", "8 Autonomous Drones Built", "Outdoor Field Demonstrations"])
    },
    {
      title: "JANIC National Demo Day 2024",
      slug: "janic-national-demo-day-2024",
      summary: "The inaugural graduation showcase for JANIC's first cohort of student tech startups, featuring enterprise software, healthcare AI, and civic tech.",
      description: "JANIC's National Demo Day 2024 celebrated the graduation of 20 pioneering student startup prototypes. Key government ministers, venture backers, and institutional donors attended to evaluate the prototypes and offer incubation backing.",
      category: "Innovation Showcase",
      eventDate: new Date("2024-06-25T09:00:00.000Z"),
      endDate: new Date("2024-06-25T16:00:00.000Z"),
      location: "Jazeera University Main Auditorium, Mogadishu",
      isVirtual: false,
      capacity: 400,
      attendeesCount: 380,
      status: "PUBLISHED",
      isFeatured: true,
      coverImage: "/images/event-summit.jpg",
      videoUrl: "/uploads/1791487046676_2z645_my-video_2026-07-27_17-40-22__1_.mp4",
      gallery: JSON.stringify([
        { url: "/uploads/1791440285236_v1igg_Stage_Backdrop.jpg", caption: "Demo Day Opening Keynote", alt: "Keynote" },
        { url: "/uploads/1791485115202_0s9kd_Award_Mockup1.png", caption: "Grand Trophy Presentation", alt: "Awards" }
      ]),
      guests: JSON.stringify([
        { name: "Dr. Abdullahi Mohamed", role: "Keynote Speaker", organization: "Dean of IT", avatar: "/images/Founder-img.jpeg" },
        { name: "Eng. Qaarey", role: "Jury Lead", organization: "Advisory Board", avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png" }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 10:00", title: "Dean's Welcome Keynote", speaker: "Dr. Abdullahi Mohamed", description: "Cohort milestone" },
        { time: "10:15 - 13:30", title: "Startup Pitches & Demos", speaker: "Cohort Founders", description: "20 startups" }
      ]),
      keyHighlights: JSON.stringify(["380 Attendees", "20 Startups Pitched", "$10,000 Seed Pool"])
    }
  ];

  for (const ev of additionalPastEvents) {
    let item = await prisma.event.findFirst({ where: { slug: ev.slug } });
    if (!item) {
      item = await prisma.event.create({
        data: {
          title: ev.title,
          slug: ev.slug,
          summary: ev.summary,
          description: ev.description,
          category: ev.category,
          eventDate: ev.eventDate,
          endDate: ev.endDate,
          location: ev.location,
          isVirtual: ev.isVirtual,
          capacity: ev.capacity,
          status: ev.status,
          isFeatured: ev.isFeatured,
          coverImage: ev.coverImage
        }
      });
      console.log(`Created base past event: ${ev.title}`);
    }

    await prisma.$executeRawUnsafe(
      "UPDATE Event SET videoUrl = ?, attendeesCount = ?, gallery = ?, guests = ?, agenda = ?, keyHighlights = ? WHERE id = ?",
      ev.videoUrl,
      ev.attendeesCount,
      ev.gallery,
      ev.guests,
      ev.agenda,
      ev.keyHighlights,
      item.id
    );
    console.log(`Populated rich past event details: ${ev.title}`);
  }

  const allEvents = await prisma.event.findMany();
  const pastEvents = allEvents.filter(e => new Date(e.eventDate) < new Date());
  console.log(`Finished! Total events in DB: ${allEvents.length}, Total past events: ${pastEvents.length}`);
}

seedMorePastEvents().catch(console.error).finally(() => prisma.$disconnect());
