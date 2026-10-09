const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding rich past and upcoming events for JANIC...");

  const richEvents = [
    {
      title: "JANIC Annual Tech Showcase & Demo Day 2025",
      slug: "janic-annual-tech-showcase-2025",
      summary: "JANIC's signature annual flagship showcase celebrating 35+ student engineering innovations, autonomous robotics, AI models, and enterprise software.",
      description: `The JANIC Annual Tech Showcase & Demo Day 2025 brought together over 420 industry leaders, technology executives, angel investors, and academia at the Jazeera University Main Auditorium.\n\nThroughout the day, 35 curated student engineering teams from the Faculty of Computer Science & IT presented live working prototypes solving pressing national challenges in Somalia—ranging from automated solar-powered agricultural sensors to decentralized healthcare records and smart municipal waste tracking.\n\nThe event featured an opening keynote from the Dean of IT, an interactive hardware gallery where attendees could test robotics in real time, and high-stakes pitch rounds evaluated by senior industry engineers.`,
      category: "Innovation Showcase",
      eventDate: new Date("2025-11-20T09:00:00.000Z"),
      endDate: new Date("2025-11-20T17:00:00.000Z"),
      location: "Jazeera University Main Auditorium & Innovation Quad, Mogadishu",
      isVirtual: false,
      registrationUrl: null,
      capacity: 500,
      attendeesCount: 425,
      status: "PUBLISHED",
      isFeatured: true,
      coverImage: "/images/event-summit.jpg",
      videoUrl: "/uploads/1791540165560_tm1i2_IMG_5677.MP4",
      gallery: JSON.stringify([
        { url: "/uploads/1791440285236_v1igg_Stage_Backdrop.jpg", caption: "Grand Stage & Keynote Session at Jazeera Auditorium", alt: "Event Stage" },
        { url: "/uploads/1791440308820_xw2rm_Group_of_enthusiastic_Somali_students_in_a_high-tech_workshop__using_futuristic_tools__smiling_and_c.jpg", caption: "Student Innovators Demonstrating Prototype Solutions", alt: "Students Showcase" },
        { url: "/uploads/1791485114805_54hfs_Event_Banner_Mockup.jpg", caption: "Innovation Quad Exhibition Hall & Registration Area", alt: "Exhibition Hall" },
        { url: "/uploads/1791485115202_0s9kd_Award_Mockup1.png", caption: "Grand Trophy & Outstanding Innovation Awards", alt: "Awards Ceremony" },
        { url: "/images/robot-car-cleaner.jpg", caption: "Autonomous Robotics Prototype Demonstration", alt: "Robotics Demo" },
        { url: "/uploads/1791487100729_qxwnp_54716319848.jpg", caption: "Faculty Leadership & Guest Dignitaries", alt: "VIP Guests" }
      ]),
      guests: JSON.stringify([
        {
          name: "Dr. Abdullahi Mohamed",
          role: "Keynote Speaker",
          organization: "Dean of IT, Jazeera University",
          avatar: "/images/Founder-img.jpeg"
        },
        {
          name: "Eng. Qaarey",
          role: "Chief Technical Judge",
          organization: "JANIC Advisory Board & Senior Cloud Architect",
          avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png"
        },
        {
          name: "Eng. Muscab Ahmed",
          role: "Hardware & Robotics Mentor",
          organization: "Embedded Systems Lab Lead, JANIC",
          avatar: "/uploads/1791399723072_sypno_muscab.jpeg"
        },
        {
          name: "Fatima Hassan",
          role: "Guest Panelist",
          organization: "Somali ICT Innovation Forum",
          avatar: "/images/admin-avatar.png"
        }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 09:30", title: "Registration & Welcome Breakfast", speaker: "JANIC Host Team", description: "Badge collection, networking coffee, and access to exhibition materials." },
        { time: "09:30 - 10:15", title: "Opening Address: Catalyzing Somalia's Digital Renaissance", speaker: "Dr. Abdullahi Mohamed", description: "Official welcoming remarks on JANIC's roadmap and university-industry bridge." },
        { time: "10:30 - 12:30", title: "Session A: Student Software & AI Demos", speaker: "18 Student Teams", description: "Live demonstrations of fintech, edtech, and computer vision models." },
        { time: "12:30 - 14:00", title: "Innovation Quad Exhibition Walkthrough & Lunch", speaker: "All Attendees", description: "Hands-on interaction with hardware booths, robots, and solar IoT stations." },
        { time: "14:00 - 15:30", title: "Pitch Round: Top 8 Finalists to Judges", speaker: "Eng. Qaarey & Panel", description: "Fast-paced 5-minute pitches with rigorous Q&A from technical evaluators." },
        { time: "15:45 - 16:30", title: "Grand Awards Ceremony & Closing", speaker: "Faculty Board", description: "Presentation of innovation grants, trophies, and closing photo session." }
      ]),
      keyHighlights: JSON.stringify([
        "425+ Attendees and 35 Working Prototypes",
        "$15,000 in Seed Grants Awarded",
        "Over 12 Industry Partners in Attendance",
        "Autonomous Robotics Live Demonstration"
      ])
    },
    {
      title: "JANIC Innovation Summit 2024",
      slug: "janic-innovation-summit-2024",
      summary: "A milestone summit gathering university researchers, ministry representatives, and emerging technologists to chart the future of research commercialization in Mogadishu.",
      description: `The inaugural JANIC Innovation Summit 2024 served as the launching pad for Jazeera Nexus Innovation Center's modern collaborative laboratory facilities.\n\nKey discussion pillars included bridging the gap between theoretical computer science and deployable community solutions, fostering female leadership in technology, and establishing open-access digital fabrication labs in Somalia.\n\nThe day concluded with live showcase demonstrations by JANIC cohort members and bilateral partnership signings with regional tech ecosystems.`,
      category: "Innovation Summit",
      eventDate: new Date("2024-10-18T09:00:00.000Z"),
      endDate: new Date("2024-10-18T16:30:00.000Z"),
      location: "Jazeera Nexus Innovation Center, Ground Floor Hall",
      isVirtual: false,
      registrationUrl: null,
      capacity: 350,
      attendeesCount: 360,
      status: "PUBLISHED",
      isFeatured: true,
      coverImage: "/images/event-summit.jpg",
      videoUrl: "/uploads/1791487046676_2z645_my-video_2026-07-27_17-40-22__1_.mp4",
      gallery: JSON.stringify([
        { url: "/images/event-summit.jpg", caption: "Keynote Plenary Session in Session", alt: "Keynote" },
        { url: "/uploads/1791440285236_v1igg_Stage_Backdrop.jpg", caption: "Opening Ceremonial Address", alt: "Ceremony" },
        { url: "/images/janic-hero-lab.jpg", caption: "JANIC Innovation Lab Walkthrough", alt: "Lab Tour" },
        { url: "/uploads/1791487036247_fq1lx_Name_Badge_Mockup.jpg", caption: "Official Summit Credentials & Swag", alt: "Credentials" }
      ]),
      guests: JSON.stringify([
        {
          name: "Prof. Dahir Hassan",
          role: "Chancellor's Address",
          organization: "Jazeera University",
          avatar: "/images/Founder-img.jpeg"
        },
        {
          name: "Eng. Qaarey",
          role: "Keynote Speaker",
          organization: "JANIC Advisory Board",
          avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png"
        },
        {
          name: "Safia Ali",
          role: "Panelist",
          organization: "Mogadishu Tech Hub",
          avatar: "/images/admin-avatar.png"
        }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 09:45", title: "Opening Address: Building Applied Tech in Somalia", speaker: "Prof. Dahir Hassan", description: "Vision of JANIC and university commitment to modern engineering education." },
        { time: "10:00 - 11:30", title: "Symposium: Research Commercialization Pathways", speaker: "Eng. Qaarey & Guest Panel", description: "Case studies of university spin-offs and patent protections." },
        { time: "11:45 - 13:00", title: "Innovation Lab Ribbon-Cutting & Facility Tour", speaker: "Lab Leads", description: "Demonstrations of modern 3D printers, IoT benches, and high-performance computing clusters." },
        { time: "14:00 - 15:30", title: "Townhall: Student Ideas to Market", speaker: "Student Founders", description: "Panel discussion with early student startup founders." }
      ]),
      keyHighlights: JSON.stringify([
        "360+ Industry & Student Attendees",
        "Official Launch of JANIC Lab Facilities",
        "3 Inter-University Research Partnerships Signed"
      ])
    },
    {
      title: "Cybersecurity Challenge 3.0 & 24H CTF",
      slug: "cybersecurity-challenge-3",
      summary: "A thrilling hands-on offensive and defensive cyber competition testing students across reverse engineering, network forensics, cryptography, and web exploits.",
      description: `Cybersecurity Challenge 3.0 brought together 120 students organized into 24 competitive teams inside the JANIC Cyber Range Lab.\n\nParticipants tackled 45 jeopardy-style capture-the-flag challenges ranging from vulnerable API discovery to binary exploitation and memory forensics under real-time adversary simulation.\n\nIndustry security engineers from Somali telecommunications and banking sectors monitored the competition and hosted a tactical deconstruction session dissecting attack vectors and remediation strategies.`,
      category: "Hackathon & CTF",
      eventDate: new Date("2025-05-12T08:00:00.000Z"),
      endDate: new Date("2025-05-12T20:00:00.000Z"),
      location: "JANIC Cyber Range Lab & Virtual Platform",
      isVirtual: false,
      registrationUrl: null,
      capacity: 250,
      attendeesCount: 240,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/event-cyber.jpg",
      videoUrl: "/uploads/1791540165560_tm1i2_IMG_5677.MP4",
      gallery: JSON.stringify([
        { url: "/images/event-cyber.jpg", caption: "High-Intensity CTF War Room", alt: "CTF Room" },
        { url: "/uploads/1791540281689_86i8f_cybersecurity_command_center_visualization_with_world_map_and_data_nodes.png", caption: "Live Cyber Attack Simulation & Scoring Board", alt: "Attack Simulation" },
        { url: "/uploads/1791440308820_xw2rm_Group_of_enthusiastic_Somali_students_in_a_high-tech_workshop__using_futuristic_tools__smiling_and_c.jpg", caption: "Winning Defense Team Analyzing Packet Dumps", alt: "Winning Team" }
      ]),
      guests: JSON.stringify([
        {
          name: "Eng. Hassan Warsame",
          role: "Chief Cyber Arbiter",
          organization: "Somalia National CERT Specialist",
          avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png"
        },
        {
          name: "Amina Shire",
          role: "Guest Speaker",
          organization: "Network Defense Researcher, Jazeera University",
          avatar: "/images/admin-avatar.png"
        }
      ]),
      agenda: JSON.stringify([
        { time: "08:00 - 08:30", title: "Rules of Engagement & Arena Onboarding", speaker: "Challenge Marshals", description: "Network connection setup, flag submission testing, and ethical hacking rules." },
        { time: "08:30 - 14:30", title: "Round 1: Jeopardy Style CTF Competition", speaker: "All Teams", description: "Solving challenges across web exploitation, cryptography, and reverse engineering." },
        { time: "15:00 - 17:00", title: "Round 2: King of the Hill Live Server Defense", speaker: "Top 8 Teams", description: "Maintaining defensive control of target virtual servers while deflecting attacks." },
        { time: "17:30 - 18:30", title: "Vector Deconstruction & Award Ceremony", speaker: "Eng. Hassan Warsame", description: "Live analysis of exploits and trophy presentation." }
      ]),
      keyHighlights: JSON.stringify([
        "240 Active Competitors and Observers",
        "45 Capture-The-Flag Challenges Solved",
        "Top 3 Teams Awarded Security Certifications"
      ])
    },
    {
      title: "Embedded Robotics & IoT Hands-On Workshop",
      slug: "embedded-robotics-iot-workshop-2025",
      summary: "An intensive 3-day hardware prototyping workshop where students constructed autonomous micro-rovers and LoRaWAN environmental monitoring nodes from scratch.",
      description: `Hosted in the JANIC Hardware Prototyping Lab, this hands-on bootcamp gave 150 aspiring engineers complete access to Arduino, ESP32, motor controllers, ultrasonic sensors, and laser cutters.\n\nStudents worked in pairs to design custom circuit schematics, solder components onto protoboards, flash C++ firmware, and deploy real-time sensor dashboards streaming data over local WiFi and LoRaWAN gateways.\n\nThe workshop concluded with an obstacle-course robotics challenge where student rovers navigated an unpredictable arena autonomously.`,
      category: "Bootcamp & Workshop",
      eventDate: new Date("2025-03-10T13:30:00.000Z"),
      endDate: new Date("2025-03-12T17:30:00.000Z"),
      location: "JANIC Hardware Prototyping Lab, Main Campus",
      isVirtual: false,
      registrationUrl: null,
      capacity: 150,
      attendeesCount: 150,
      status: "PUBLISHED",
      isFeatured: false,
      coverImage: "/images/event-workshop.jpg",
      videoUrl: "/uploads/1791487046676_2z645_my-video_2026-07-27_17-40-22__1_.mp4",
      gallery: JSON.stringify([
        { url: "/images/event-workshop.jpg", caption: "Students Soldering Circuit Boards", alt: "Soldering Lab" },
        { url: "/images/robot-car-cleaner.jpg", caption: "Autonomous Obstacle-Navigating Rover Demo", alt: "Rover Demo" },
        { url: "/uploads/1791440426921_7xjje_Smart_solar-powered_agricultural_sensor_device_in_a_field.jpg", caption: "Solar IoT Soil Moisture Sensor Deployment", alt: "IoT Field Demo" }
      ]),
      guests: JSON.stringify([
        {
          name: "Eng. Muscab Ahmed",
          role: "Lead Hardware Instructor",
          organization: "JANIC Robotics Lab Lead",
          avatar: "/uploads/1791399723072_sypno_muscab.jpeg"
        },
        {
          name: "Eng. Qaarey",
          role: "Technical Advisor",
          organization: "JANIC Advisory Board",
          avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png"
        }
      ]),
      agenda: JSON.stringify([
        { time: "Day 1 (13:30 - 17:30)", title: "Schematic Design, Microcontroller Pinouts & Breadboarding", speaker: "Eng. Muscab Ahmed", description: "Introduction to ESP32 architecture, GPIO programming, and sensor interfacing." },
        { time: "Day 2 (13:30 - 17:30)", title: "Motor Drivers, PWM Control & Autonomous Navigation Logic", speaker: "Lab Mentors", description: "PID control loops, sensor fusion with ultrasonic/IR, and soldering circuits." },
        { time: "Day 3 (13:30 - 17:30)", title: "Obstacle Course Arena Trial & Certificate Ceremony", speaker: "Faculty Jury", description: "Time-trial races through an obstacle maze and distribution of hardware kits." }
      ]),
      keyHighlights: JSON.stringify([
        "150 Engineering Students Trained",
        "28 Working Autonomous Rovers Built",
        "Full Hardware Starter Kits Awarded to All Attendees"
      ])
    }
  ];

  for (const item of richEvents) {
    const existing = await prisma.event.findFirst({
      where: { slug: item.slug }
    });

    if (existing) {
      console.log(`Updating existing event: ${item.title}`);
      await prisma.event.update({
        where: { id: existing.id },
        data: {
          title: item.title,
          summary: item.summary,
          description: item.description,
          category: item.category,
          eventDate: item.eventDate,
          endDate: item.endDate,
          location: item.location,
          isVirtual: item.isVirtual,
          registrationUrl: item.registrationUrl,
          capacity: item.capacity,
          status: item.status,
          isFeatured: item.isFeatured,
          coverImage: item.coverImage,
        }
      });
      await prisma.$executeRawUnsafe(
        "UPDATE Event SET videoUrl = ?, attendeesCount = ?, gallery = ?, guests = ?, agenda = ?, keyHighlights = ? WHERE id = ?",
        item.videoUrl,
        item.attendeesCount,
        item.gallery,
        item.guests,
        item.agenda,
        item.keyHighlights,
        existing.id
      );
    } else {
      console.log(`Creating new past event: ${item.title}`);
      const created = await prisma.event.create({
        data: {
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          description: item.description,
          category: item.category,
          eventDate: item.eventDate,
          endDate: item.endDate,
          location: item.location,
          isVirtual: item.isVirtual,
          registrationUrl: item.registrationUrl,
          capacity: item.capacity,
          status: item.status,
          isFeatured: item.isFeatured,
          coverImage: item.coverImage,
        }
      });
      await prisma.$executeRawUnsafe(
        "UPDATE Event SET videoUrl = ?, attendeesCount = ?, gallery = ?, guests = ?, agenda = ?, keyHighlights = ? WHERE id = ?",
        item.videoUrl,
        item.attendeesCount,
        item.gallery,
        item.guests,
        item.agenda,
        item.keyHighlights,
        created.id
      );
    }
  }

  // Also make sure upcoming events have rich previews!
  const upcomingEvents = [
    {
      slug: "janic-annual-tech-showcase-2026",
      title: "JANIC Annual Tech Showcase & Demo Day 2026",
      videoUrl: "/uploads/1791540165560_tm1i2_IMG_5677.MP4",
      attendeesCount: 500,
      gallery: JSON.stringify([
        { url: "/uploads/1791440285236_v1igg_Stage_Backdrop.jpg", caption: "Showcase Auditorium Setup", alt: "Auditorium" },
        { url: "/uploads/1791485114805_54hfs_Event_Banner_Mockup.jpg", caption: "Exhibition Floor", alt: "Exhibition" }
      ]),
      guests: JSON.stringify([
        { name: "Dr. Abdullahi Mohamed", role: "Keynote Speaker", organization: "Dean of IT", avatar: "/images/Founder-img.jpeg" },
        { name: "Eng. Qaarey", role: "Head of Jury", organization: "Senior Cloud Architect", avatar: "/uploads/1791399723067_f5plu_ENG-Qaarey.png" }
      ]),
      agenda: JSON.stringify([
        { time: "09:00 - 10:00", title: "Registration & Keynote", speaker: "Dr. Abdullahi Mohamed", description: "Opening session." },
        { time: "10:30 - 15:00", title: "Live Demonstrations", speaker: "Student Teams", description: "Interactive exhibition." }
      ]),
      keyHighlights: JSON.stringify([
        "Over 40 Projects Competing",
        "Networking with Venture Capitalists",
        "Public Voting for People's Choice Award"
      ])
    },
    {
      slug: "mogadishu-smart-cities-hackathon-2026",
      title: "Mogadishu Smart Cities Student Hackathon 2026",
      videoUrl: "/uploads/1791487046676_2z645_my-video_2026-07-27_17-40-22__1_.mp4",
      attendeesCount: 300,
      gallery: JSON.stringify([
        { url: "/images/event-cyber.jpg", caption: "Hackathon Coding Floor", alt: "Coding floor" },
        { url: "/uploads/1791440308820_xw2rm_Group_of_enthusiastic_Somali_students_in_a_high-tech_workshop__using_futuristic_tools__smiling_and_c.jpg", caption: "Student Hackers Collaborating", alt: "Hackers" }
      ]),
      guests: JSON.stringify([
        { name: "Eng. Muscab Ahmed", role: "Lead Mentor", organization: "JANIC", avatar: "/uploads/1791399723072_sypno_muscab.jpeg" },
        { name: "Dr. Abdullahi Mohamed", role: "Patron", organization: "Jazeera University", avatar: "/images/Founder-img.jpeg" }
      ]),
      agenda: JSON.stringify([
        { time: "08:00 - 09:00", title: "Team Check-in & Hackathon Kickoff", speaker: "Organizers", description: "Challenges reveal." },
        { time: "09:00 - 18:00", title: "48-Hour Sprint", speaker: "Hackers", description: "Prototyping smart municipal solutions." }
      ]),
      keyHighlights: JSON.stringify([
        "48-Hour Non-stop Prototyping",
        "Mentorship from Leading Software Engineers",
        "Cash Prizes & Incubation Offers"
      ])
    }
  ];

  for (const up of upcomingEvents) {
    const existing = await prisma.event.findFirst({ where: { slug: up.slug } });
    if (existing) {
      await prisma.$executeRawUnsafe(
        "UPDATE Event SET videoUrl = ?, attendeesCount = ?, gallery = ?, guests = ?, agenda = ?, keyHighlights = ? WHERE id = ?",
        up.videoUrl,
        up.attendeesCount,
        up.gallery,
        up.guests,
        up.agenda,
        up.keyHighlights,
        existing.id
      );
      console.log(`Updated rich details for upcoming event: ${up.title}`);
    }
  }

  console.log("Done seeding rich events!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
