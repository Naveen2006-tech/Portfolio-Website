/**
 * Naveena K - VLSI Portfolio
 * content.js
 * Applies saved admin content, item additions/deletions across public pages,
 * handles responsive navigation, and processes visitor queries.
 * (Note: Public pages do not show edit controls; edit icons are exclusive to admin.html)
 */

// Default Education records (matches Supabase database)
const DEFAULT_EDUCATION = [
  {
    id: "edu-1",
    degree: "Bachelor of Engineering (B.E. / B.Tech) in Electronics & Communication Engineering",
    institution: "S J M Institute of Technology , chitradurga",
    year: "2024 - 2028",
    score: "CGPA: 7.75 / 10.0",
    location: "Chitradurga, Karnataka",
    details: "Core Coursework: VLSI Design, Digital System Design, Computer Architecture, Electronic Circuits, Microprocessors & Microcontrollers, Signal Processing."
  },
  {
    id: "edu-2",
    degree: "Pre-University College (Class XII) - PCMC (Physics, Chemistry, Math, Biology)",
    institution: "Presidency pre-university College ,Sira ,Tumkur",
    year: "2024",
    score: "Percentage: 89%",
    location: "Sira, Tumkur, Karnataka",
    details: "Ranked among top performers with distinction in Mathematics and Physics."
  },
  {
    id: "edu-3",
    degree: "Secondary School Examination (Class X)",
    institution: "Morarji Desai Residential School (34) ,Yalladakere",
    year: "2022",
    score: "Percentage: 88%",
    location: "Yalladakere, Hiriyur, Karnataka",
    details: "Academic distinction with focus on foundational science and mathematics."
  }
];

// Default Achievements & Hackathons (matches Supabase database)
const DEFAULT_ACHIEVEMENTS = [
  {
    id: "ach-1",
    title: "VIDYUTSAVA-2K26",
    description: "Secured **2nd Place in the Technical Paper Presentation** at **VIDYUTSAVA-2K26**, organized by the EEE Department of S.J.M. Institute of Technology, Chitradurga, on 6 May 2026. Presented a technical paper titled *“Automatic Intelligent Waste Segregation System”*, highlighting innovative approaches to automated waste identification and segregation. This experience enhanced my research, technical communication, and presentation skills.",
    isSample: false
  },
  {
    id: "ach-2",
    title: "IMPULSE-2026",
    description: "Participated in **IMPULSE-2026**, an innovation-focused technical event organized at **Bapuji Institute of Engineering and Technology (BIET), Davanagere**. Took part in the Innomarathon, gaining valuable exposure to innovation, creative problem-solving, teamwork, and technical skills. The event provided an opportunity to explore innovative ideas, collaborate with fellow participants, and enhance practical engineering knowledge.",
    isSample: false
  },
  {
    id: "ach-3",
    title: "EMERGE-2026",
    description: "Participated in **EMERGE-2026**, a Hackathon organized at **Jain Institute of Technology, Davanagere**. The event provided an opportunity to showcase innovative thinking, develop creative solutions to real-world problems, and collaborate with fellow participants. It enhanced my problem-solving abilities, teamwork, technical knowledge, and practical engineering skills.",
    isSample: false
  }
];

// Default Technical Skills
const DEFAULT_SKILLS = [
  {
    id: "skill-1",
    title: "Verilog HDL & RTL Design",
    category: "Hardware Description",
    desc: "Synthesis-ready register-transfer-level design, behavioral and structural modeling, and finite state machines (FSM).",
    tags: ["Verilog", "RTL", "FSM", "Digital Design"]
  },
  {
    id: "skill-2",
    title: "Digital Logic & Architecture",
    category: "Core Digital Systems",
    desc: "Combinational and sequential logic, arithmetic logic units, multiplexers, counters, and pipelined datapaths.",
    tags: ["Digital Logic", "ALU", "Datapath", "Architecture"]
  },
  {
    id: "skill-3",
    title: "Digital Verification & Testbenches",
    category: "Verification",
    desc: "Architecting self-checking testbenches, edge-case test vectors, and timing simulation waveform debugging.",
    tags: ["Verification", "Testbenches", "ModelSim", "Coverage"]
  },
  {
    id: "skill-4",
    title: "Xilinx Vivado & FPGA Prototyping",
    category: "EDA & Tooling",
    desc: "Synthesis, implementation, bitstream generation, XDC constraint assignment, and hardware board emulation.",
    tags: ["Vivado", "FPGA", "Hardware Emulation", "Xilinx"]
  },
  {
    id: "skill-5",
    title: "CMOS VLSI & Transistor Sizing",
    category: "Semiconductor Physics",
    desc: "CMOS inverter voltage transfer characteristics (VTC), noise margins, propagation delay, and low-power techniques.",
    tags: ["CMOS", "VTC", "Propagation Delay", "VLSI"]
  },
  {
    id: "skill-6",
    title: "Static Timing Analysis (STA)",
    category: "Timing & Synthesis",
    desc: "Analyzing setup/hold time margins, clock skew, critical timing paths, and maximum clock frequencies.",
    tags: ["STA", "Setup/Hold", "Clock Constraints"]
  },
  {
    id: "skill-7",
    title: "C & Python for Engineering",
    category: "Programming & Scripting",
    desc: "Low-level firmware programming in C and automation, data manipulation, and verification scripting in Python.",
    tags: ["C Programming", "Python", "Automation", "Firmware"]
  },
  {
    id: "skill-8",
    title: "Microcontrollers & Embedded Protocols",
    category: "Embedded Hardware",
    desc: "Microcontroller interfacing, serial communication protocols (UART, SPI, I2C), and peripheral control.",
    tags: ["UART", "SPI", "I2C", "Embedded Systems"]
  }
];

// Default Technical Papers
const DEFAULT_PAPERS = [
  {
    id: "paper_vidyutsava_2k26",
    title: "Automatic Intelligent Waste Segregation System",
    event: "VIDYUTSAVA-2K26 - Technical Symposium",
    date: "May 2026",
    result: "2nd Place Award Winner",
    authors: "Naveena K & Co-Presenter",
    institution: "S.J.M. Institute of Technology, Chitradurga",
    summary: "Technical presentation addressing automated waste categorization using intelligent sensing, embedded microcontroller control, and real-time segregation logic.",
    abstract: "An automated intelligent waste sorting system designed to classify waste materials into recyclable and non-recyclable streams. Utilizes sensor-driven input processing and microcontroller-based automation to streamline sanitation operations.",
    photos: []
  }
];

/**
 * Formats simple markdown bold (**text**) and italic (*text*) safely after HTML escaping
 */
function formatSimpleMarkdown(text) {
  if (!text) return "";
  let html = escapeHTML(text);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FFFFFF;">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="color: #93C5FD;">$1</em>');
  return html;
}

// Default portfolio content
const DEFAULT_PORTFOLIO_CONTENT = {
  heroName: "Naveena K",
  heroTitle: "Hi, I’m Naveena K — Aspiring VLSI Engineer",
  heroText: "I am an Electronics and Communication Engineering student from Hiriyur, Karnataka, interested in digital design, RTL design, verification, CMOS circuits, FPGA development, and semiconductor technology.",
  aboutEducation: "B.E. Electronics and Communication Engineering, Hiriyur, Karnataka",
  aboutGoal: "VLSI Design Engineer, Verification Engineer, or FPGA Engineer",
  
  technicalPaper: DEFAULT_PAPERS[0],
  technicalPapers: DEFAULT_PAPERS,
  profilePhoto: null,

  contactEmail: "naveenkrishnamurthy2006@gmail.com",
  linkedin: "https://www.linkedin.com/in/naveena-k-vlsi",
  github: "https://github.com/naveena-k",
  
  deletedProjects: [],
  deletedPapers: [],
  deletedCertificates: [],
  deletedSkills: [],
  customProjects: [],
  customPapers: DEFAULT_PAPERS,
  customCertificates: [],
  customSkills: DEFAULT_SKILLS,
  additionalAboutDetails: [],
  education: DEFAULT_EDUCATION,
  achievements: DEFAULT_ACHIEVEMENTS
};

/**
 * Loads and applies stored portfolio content from localStorage and Supabase
 */
function applyPortfolioContent() {
  // Never run on admin page (admin.js has its own form manager)
  if (window.location.pathname.includes("admin") || document.getElementById("dashboardSection")) {
    return;
  }

  // 1. First render with local cached content (immediate, no flicker)
  let stored = {};
  try {
    const raw = localStorage.getItem("portfolioContent");
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading portfolioContent from localStorage:", e);
  }

  const initialContent = { ...DEFAULT_PORTFOLIO_CONTENT, ...stored };
  renderPortfolioContentToDOM(initialContent);

  // 2. Fetch fresh content from Supabase backend in the background
  if (typeof window.fetchSupabasePortfolioData === "function") {
    window.fetchSupabasePortfolioData().then((res) => {
      if (res && (res.portfolioContent || res.fullData)) {
        const photo =
          res.portfolioContent?.profilePhoto ||
          res.portfolioContent?.photoUrl ||
          res.portfolioContent?.avatar ||
          res.fullData?.hero?.profilePhoto ||
          res.fullData?.hero?.photoUrl ||
          res.fullData?.hero?.avatar ||
          res.fullData?.profilePhoto ||
          res.fullData?.photoUrl ||
          null;

        const ach = Array.isArray(res.portfolioContent?.achievements) && res.portfolioContent.achievements.length > 0
          ? res.portfolioContent.achievements
          : (Array.isArray(res.fullData?.achievements) && res.fullData.achievements.length > 0 ? res.fullData.achievements : DEFAULT_ACHIEVEMENTS);

        const edu = Array.isArray(res.portfolioContent?.education) && res.portfolioContent.education.length > 0
          ? res.portfolioContent.education
          : (Array.isArray(res.fullData?.education) && res.fullData.education.length > 0 ? res.fullData.education : DEFAULT_EDUCATION);

        const liveContent = {
          ...DEFAULT_PORTFOLIO_CONTENT,
          ...(res.portfolioContent || {}),
          profilePhoto: photo || res.portfolioContent?.profilePhoto || null,
          achievements: ach,
          education: edu
        };
        renderPortfolioContentToDOM(liveContent);
      }
    }).catch((err) => {
      console.warn("Could not retrieve Supabase portfolio data:", err);
    });

    // 3. Register live viewer sync so admin edits immediately update viewer pages in real time
    if (typeof window.initLiveViewerSync === "function") {
      window.initLiveViewerSync((updatedContent) => {
        const ach = Array.isArray(updatedContent.achievements) && updatedContent.achievements.length > 0
          ? updatedContent.achievements
          : DEFAULT_ACHIEVEMENTS;

        const edu = Array.isArray(updatedContent.education) && updatedContent.education.length > 0
          ? updatedContent.education
          : DEFAULT_EDUCATION;

        const liveContent = {
          ...DEFAULT_PORTFOLIO_CONTENT,
          ...updatedContent,
          achievements: ach,
          education: edu
        };
        renderPortfolioContentToDOM(liveContent);
      });
    }
  }
}

/**
 * Injects dynamic canonical URL, OpenGraph URL, search verification tags,
 * and Schema.org JSON-LD structured data into the document head
 */
function applySeoMetadata(content) {
  let seo = {};
  try {
    const raw = localStorage.getItem("portfolioSeo");
    if (raw) seo = JSON.parse(raw);
  } catch (e) {}

  if (content && content.seo) {
    seo = { ...seo, ...content.seo };
  }

  const siteUrl = (seo.siteUrl || "https://ais-pre-dvchbkbkhlw33asnf2e35d-963613134071.asia-southeast1.run.app").replace(/\/+$/, "");
  const currentPath = window.location.pathname.replace(/^\/+/, "") || "";
  const canonicalUrl = `${siteUrl}/${currentPath === "index.html" ? "" : currentPath}`;

  // 1. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", canonicalUrl);

  // 2. OpenGraph URL
  let ogUrlEl = document.querySelector('meta[property="og:url"]');
  if (!ogUrlEl) {
    ogUrlEl = document.createElement("meta");
    ogUrlEl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrlEl);
  }
  ogUrlEl.setAttribute("content", canonicalUrl);

  // 3. Google Site Verification
  if (seo.googleSiteVerification) {
    let googleMeta = document.querySelector('meta[name="google-site-verification"]');
    if (!googleMeta) {
      googleMeta = document.createElement("meta");
      googleMeta.setAttribute("name", "google-site-verification");
      document.head.appendChild(googleMeta);
    }
    googleMeta.setAttribute("content", seo.googleSiteVerification);
  }

  // 4. Bing Site Verification
  if (seo.bingSiteVerification) {
    let bingMeta = document.querySelector('meta[name="msvalidate.01"]');
    if (!bingMeta) {
      bingMeta = document.createElement("meta");
      bingMeta.setAttribute("name", "msvalidate.01");
      document.head.appendChild(bingMeta);
    }
    bingMeta.setAttribute("content", seo.bingSiteVerification);
  }

  // 5. Schema.org JSON-LD Structured Data
  let jsonLdEl = document.getElementById("seoJsonLdStructuredData");
  if (!jsonLdEl) {
    jsonLdEl = document.createElement("script");
    jsonLdEl.id = "seoJsonLdStructuredData";
    jsonLdEl.type = "application/ld+json";
    document.head.appendChild(jsonLdEl);
  }
  jsonLdEl.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Naveena K - VLSI Engineer Portfolio",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "Person",
      "name": content.heroName || "Naveena K",
      "jobTitle": "VLSI Design & Electronics Engineer",
      "url": siteUrl,
      "email": content.contactEmail || "naveenkrishnamurthy2006@gmail.com",
      "sameAs": [
        content.linkedin || "https://www.linkedin.com/in/naveena-k-vlsi",
        content.github || "https://github.com/naveena-k"
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "S J M Institute of Technology, Chitradurga"
      },
      "knowsAbout": [
        "VLSI Design",
        "Verilog HDL",
        "RTL Design & Verification",
        "CMOS Technology",
        "FPGA Prototyping",
        "Digital System Design"
      ]
    }
  }, null, 2);
}

/**
 * Renders all portfolio data elements to the DOM
 */
function renderPortfolioContentToDOM(content) {
  // Apply SEO, canonical, and verification tags
  applySeoMetadata(content);

  // 1. Handle User Name (Home section greeting, badges, profile cards)
  const heroNameVal = content.heroName || "Naveena K";
  const heroNameEl = document.getElementById("heroName");
  if (heroNameEl) {
    heroNameEl.textContent = heroNameVal;
  }
  const profileNameEls = document.querySelectorAll(".profile-name, #profileName");
  profileNameEls.forEach((el) => {
    el.textContent = heroNameVal;
  });

  // 1b. Handle Profile Avatar / Photo across navigation and home card
  const profilePhotoUrl =
    content.profilePhoto ||
    content.photoUrl ||
    content.avatar ||
    (content.hero && (content.hero.profilePhoto || content.hero.photoUrl || content.hero.avatar || content.hero.image)) ||
    null;

  const avatarEls = document.querySelectorAll(".profile-avatar-lg, .brand-avatar");
  avatarEls.forEach((el) => {
    if (profilePhotoUrl) {
      el.innerHTML = `<img src="${profilePhotoUrl}" alt="${heroNameVal}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;" />`;
    } else {
      el.innerHTML = "NK";
    }
  });

  // 2. Handle Hero Title with Name Guarantee and Accent Formatting
  const heroTitleEl = document.getElementById("heroTitle");
  if (heroTitleEl) {
    let rawTitle = content.heroTitle;
    if (!rawTitle || typeof rawTitle !== "string" || rawTitle.trim() === "") {
      rawTitle = `Hi, I’m ${heroNameVal} — Aspiring VLSI Engineer`;
    }

    // If the title does not contain the user's name, prefix it to guarantee it is displayed in the home section
    if (!rawTitle.toLowerCase().includes(heroNameVal.toLowerCase())) {
      rawTitle = `Hi, I’m ${heroNameVal} — ${rawTitle}`;
    }

    // Highlight the user's name with the accent styling class
    const escapedName = heroNameVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedName})`, "gi");
    heroTitleEl.innerHTML = rawTitle.replace(regex, '<span class="accent">$1</span>');
  }

  // 3. Update other text elements by ID
  const textKeys = [
    "heroText",
    "aboutEducation",
    "aboutGoal",
    "skill1Title", "skill1Category", "skill1Desc",
    "skill2Title", "skill2Category", "skill2Desc",
    "skill3Title", "skill3Category", "skill3Desc",
    "skill4Title", "skill4Category", "skill4Desc",
    "skill5Title", "skill5Category", "skill5Desc",
    "skill6Title", "skill6Category", "skill6Desc",
    "skill7Title", "skill7Category", "skill7Desc",
    "skill8Title", "skill8Category", "skill8Desc",
    "skill9Title", "skill9Category", "skill9Desc",
    "skill10Title", "skill10Category", "skill10Desc",
    "skill11Title", "skill11Category", "skill11Desc",
    "skill12Title", "skill12Category", "skill12Desc"
  ];

  textKeys.forEach((key) => {
    const el = document.getElementById(key);
    if (el && content[key] !== undefined && content[key] !== "") {
      el.textContent = content[key];
    }
  });

  // Handle contactEmail
  const emailEl = document.getElementById("contactEmail");
  if (emailEl && content.contactEmail) {
    emailEl.textContent = content.contactEmail;
    if (emailEl.tagName.toLowerCase() === "a") {
      emailEl.href = "mailto:" + content.contactEmail;
    }
  }

  // Handle linkedin
  const linkedinEl = document.getElementById("linkedin");
  if (linkedinEl && content.linkedin) {
    if (linkedinEl.tagName.toLowerCase() === "a") {
      linkedinEl.href = content.linkedin;
    } else {
      linkedinEl.textContent = content.linkedin;
    }
  }

  // Handle github
  const githubEl = document.getElementById("github");
  if (githubEl && content.github) {
    if (githubEl.tagName.toLowerCase() === "a") {
      githubEl.href = content.github;
    } else {
      githubEl.textContent = content.github;
    }
  }

  // Handle Resume download buttons & document synchronization
  const resumeInfo = content.resume || (function() {
    try {
      return JSON.parse(localStorage.getItem("portfolioResume") || "null");
    } catch (e) {
      return null;
    }
  })();

  const resumeDownloadHref = (resumeInfo && (resumeInfo.uploadedPdfData || resumeInfo.pdfUrl)) || "/assets/aistudio/Resume_f01dffd6.pdf";
  const resumeFileName = (resumeInfo && resumeInfo.fileName) || "Naveena_K_Resume.pdf";

  // Update all resume download buttons across all pages
  const resumeLinks = document.querySelectorAll(
    'a#downloadResumeBtn, a[download*="Resume"], a[href*="Resume.pdf"], a[data-resume-download]'
  );
  resumeLinks.forEach((link) => {
    link.href = resumeDownloadHref;
    link.setAttribute("download", resumeFileName);
  });

  // Update career objective & education if edited in resume section
  const resumeObjEl = document.getElementById("resumeObjective");
  if (resumeObjEl && content.resumeObjective) {
    resumeObjEl.textContent = content.resumeObjective;
  }
  const resumeEduEl = document.getElementById("resumeEducation");
  if (resumeEduEl && content.resumeEducation) {
    resumeEduEl.textContent = content.resumeEducation;
  }

  // 2. Hide Deleted Default Projects
  const deletedProjects = Array.isArray(content.deletedProjects) ? content.deletedProjects : [];
  deletedProjects.forEach((pid) => {
    const cards = document.querySelectorAll(`[data-project-id="${pid}"]`);
    cards.forEach((c) => {
      c.style.display = "none";
    });
  });

  // 3. Hide Deleted Default Papers
  const deletedPapers = Array.isArray(content.deletedPapers) ? content.deletedPapers : [];
  deletedPapers.forEach((pid) => {
    const cards = document.querySelectorAll(`[data-paper-id="${pid}"]`);
    cards.forEach((c) => {
      c.style.display = "none";
    });
  });

  // 4. Hide Deleted Default Skills
  const deletedSkills = Array.isArray(content.deletedSkills) ? content.deletedSkills : [];
  deletedSkills.forEach((sid) => {
    const cards = document.querySelectorAll(`[data-skill-id="${sid}"]`);
    cards.forEach((c) => {
      c.style.display = "none";
    });
  });

  // 5. Render Projects (on projects.html and index.html)
  const rawProjects = Array.isArray(content.customProjects) && content.customProjects.length > 0
    ? content.customProjects
    : (Array.isArray(content.projects) ? content.projects : []);

  // Strict deduplication by project title & ID
  const uniqueProjects = [];
  const seenProj = new Set();
  rawProjects.forEach((p) => {
    if (!p) return;
    const titleKey = (p.title || "").trim().toLowerCase();
    const idKey = (p.id || "").trim();
    if (!titleKey) return;
    if (seenProj.has(titleKey) || (idKey && seenProj.has(idKey))) return;
    seenProj.add(titleKey);
    if (idKey) seenProj.add(idKey);
    uniqueProjects.push(p);
  });

  const projectGrids = document.querySelectorAll("#projectsGrid");
  projectGrids.forEach((grid) => {
    grid.innerHTML = ""; // Clean out previous cards to prevent duplicate items

    if (uniqueProjects.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">📁</div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">No Projects in Database</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">All database projects have been cleared. You can add new hardware & VLSI projects through the Admin Portal.</p>
          <a href="admin.html" class="btn btn-primary btn-sm">Open Admin Portal</a>
        </div>
      `;
      return;
    }

    const isHome = window.location.pathname.includes("index") || window.location.pathname === "/" || (!window.location.pathname.includes("projects") && !window.location.pathname.includes("admin"));
    const listToRender = isHome ? uniqueProjects.slice(0, 3) : uniqueProjects;

    listToRender.forEach((p) => {
      const domId = "custom_proj_" + p.id;
      const tags = Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(",") : (p.technologies || ["VLSI", "RTL"]));
      const card = document.createElement("div");
      card.id = domId;
      card.className = "card project-card";
      card.innerHTML = `
        <div class="card-header-accent"></div>
        <div class="project-card-top">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div class="project-icon-box" style="margin-bottom: 0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
              </svg>
            </div>
            <span class="badge badge-primary">VLSI Design</span>
          </div>
          <h2 class="project-title" style="font-size: 1.15rem;">${escapeHTML(p.title)}</h2>
          <p class="project-desc">${escapeHTML(p.text || p.description || "")}</p>
          <div class="tags">
            ${tags.map(t => `<span class="tag">${escapeHTML(String(t).trim())}</span>`).join("")}
          </div>
          ${p.highlights ? `
            <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; margin-top: 12px;">
              <p style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.5;">${escapeHTML(p.highlights)}</p>
            </div>
          ` : ""}
          ${Array.isArray(p.photos) && p.photos.length > 0 ? `
            <div class="presentation-photos-container" style="margin-top: 14px;">
              <div class="presentation-photos-header">
                <span style="display: flex; align-items: center; gap: 5px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  Presentation & Demo Photos (${Math.min(p.photos.length, 4)})
                </span>
                <span style="font-size: 0.7rem; color: #94A3B8;">Click to expand</span>
              </div>
              <div class="presentation-photos-grid photo-grid-4">
                ${p.photos.slice(0, 4).map((src, idx) => `
                  <img src="${src}" alt="${escapeHTML(p.title)} Photo ${idx + 1}" class="presentation-photo-thumb" onclick="openPresentationLightbox(this.src, '${escapeHTML(p.title)} - Photo ${idx + 1}')" />
                `).join("")}
              </div>
            </div>
          ` : ""}
        </div>
        <div class="project-links">
          <a href="${escapeHTML(p.link || p.url || "https://github.com/naveena-k")}" target="_blank" rel="noopener noreferrer" class="btn-credential">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            View Repository & Details
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  });

  // 6. Render Technical Papers (on papers.html)
  const papersGrid = document.getElementById("papersGrid");
  if (papersGrid) {
    papersGrid.innerHTML = ""; // Clear existing cards to prevent duplicate items
    const rawPapers = [];
    if (content.technicalPaper && content.technicalPaper.title) {
      rawPapers.push(content.technicalPaper);
    }
    if (Array.isArray(content.technicalPapers)) {
      content.technicalPapers.forEach(p => { if (p && p.title) rawPapers.push(p); });
    }
    if (Array.isArray(content.customPapers)) {
      content.customPapers.forEach(p => { if (p && p.title) rawPapers.push(p); });
    }

    if (rawPapers.length === 0) {
      DEFAULT_PAPERS.forEach(p => rawPapers.push(p));
    }

    // Deduplicate papers by title
    const uniquePapers = [];
    const seenPap = new Set();
    rawPapers.forEach((p) => {
      const key = (p.title || "").trim().toLowerCase();
      if (key && !seenPap.has(key)) {
        seenPap.add(key);
        uniquePapers.push(p);
      }
    });

    if (uniquePapers.length === 0) {
      papersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">📑</div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">No Technical Papers in Database</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">All technical papers have been permanently cleared. You can add research papers & symposium presentations through the Admin Portal.</p>
          <a href="admin.html" class="btn btn-primary btn-sm">Open Admin Portal</a>
        </div>
      `;
    } else {
      uniquePapers.forEach((paper, pIdx) => {
        const card = document.createElement("div");
        card.className = "card paper-card";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.justifyContent = "space-between";

        const photos = Array.isArray(paper.photos) ? paper.photos.slice(0, 4) : [];

        card.innerHTML = `
          <div class="card-header-accent"></div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <span class="badge badge-primary paper-badge" style="display: inline-flex; align-items: center; gap: 5px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                ${escapeHTML(paper.event || "Technical Symposium")}
              </span>
              ${paper.result ? `
                <span class="award-badge">
                  🏆 ${escapeHTML(paper.result)}
                </span>
              ` : ""}
            </div>

            <h2 class="paper-title" style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px; line-height: 1.35;">
              ${escapeHTML(paper.title)}
            </h2>

            ${paper.tagline ? `
              <div style="font-size: 0.85rem; font-style: italic; color: #93C5FD; margin-bottom: 10px;">
                ${escapeHTML(paper.tagline)}
              </div>
            ` : ""}

            <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; font-size: 0.825rem; color: var(--text-muted);">
              ${paper.institution ? `
                <div style="display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/></svg>
                  <span><strong>Host Institution / University:</strong> ${escapeHTML(paper.institution)}</span>
                </div>
              ` : ""}
              ${paper.date ? `
                <div style="display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span><strong>Conference / Event Date:</strong> ${escapeHTML(paper.date)}</span>
                </div>
              ` : ""}
            </div>

            <div style="background: rgba(15, 98, 254, 0.1); border-left: 3px solid #0F62FE; padding: 12px 14px; border-radius: 4px; margin-bottom: 14px; border: 1px solid rgba(69, 137, 255, 0.25); border-left-width: 3px; border-left-color: #0F62FE;">
              <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #93C5FD; letter-spacing: 0.05em; margin-bottom: 5px;">
                Abstract / System Description:
              </div>
              <p class="paper-summary" style="font-size: 0.875rem; color: #CBD5E1; line-height: 1.55; margin: 0;">
                ${escapeHTML(paper.description || paper.abstract || paper.text || "")}
              </p>
            </div>

            ${photos.length > 0 ? `
              <div class="presentation-photos-container" style="margin-bottom: 14px;">
                <div class="presentation-photos-header">
                  <span style="display: flex; align-items: center; gap: 5px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    Paper Presentation & Certificate Photos (${photos.length})
                  </span>
                  <span style="font-size: 0.7rem; color: #94A3B8;">Click to expand</span>
                </div>
                <div class="presentation-photos-grid photo-grid-4">
                  ${photos.map((src, idx) => `
                    <img src="${src}" alt="Paper Presentation Photo ${idx + 1}" class="presentation-photo-thumb" onclick="openPresentationLightbox(this.src, '${escapeHTML(paper.title)} - Photo ${idx + 1}')" />
                  `).join("")}
                </div>
              </div>
            ` : ""}
          </div>

          <div class="project-links" style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            ${paper.link ? `
              <a href="${escapeHTML(paper.link)}" target="_blank" rel="noopener noreferrer" class="btn-drive" title="Open Full Paper / Certificate on Google Drive">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Google Drive Link to Full Paper / Certificate
              </a>
            ` : ""}
            <button class="btn btn-outline btn-sm" onclick="openTechnicalPaperModal(${pIdx})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              Read Abstract & Details
            </button>
          </div>
        `;
        papersGrid.appendChild(card);
      });
    }
    window._papersListForModal = uniquePapers;
  }

  // 7. Render Skills (on skills.html & index.html)
  const skillsGrid = document.getElementById("skillsGrid");
  const homeSkillsGrid = document.getElementById("homeSkillsGrid");

  const rawSkills = [];
  if (Array.isArray(content.customSkills) && content.customSkills.length > 0) {
    content.customSkills.forEach(s => { if (s && (s.title || s.name)) rawSkills.push(s); });
  }
  if (Array.isArray(content.skills) && content.skills.length > 0) {
    content.skills.forEach(catOrSkill => {
      if (!catOrSkill) return;
      if (Array.isArray(catOrSkill.skills)) {
        catOrSkill.skills.forEach(skillName => {
          rawSkills.push({
            title: skillName,
            category: catOrSkill.name || "Domain Skill",
            desc: `Practical competency in ${skillName}.`,
            tags: [catOrSkill.name || "Engineering"]
          });
        });
      } else if (catOrSkill.title || catOrSkill.name) {
        rawSkills.push(catOrSkill);
      }
    });
  }

  // Fall back to default skills if database has no records
  if (rawSkills.length === 0) {
    DEFAULT_SKILLS.forEach(s => rawSkills.push(s));
  }

  // Deduplicate skills by title
  const uniqueSkills = [];
  const seenS = new Set();
  rawSkills.forEach(s => {
    const name = (s.title || s.name || "").trim();
    const key = name.toLowerCase();
    if (key && !seenS.has(key)) {
      seenS.add(key);
      uniqueSkills.push({
        id: s.id || ("skill_" + uniqueSkills.length),
        title: name,
        category: s.category || "VLSI Competency",
        desc: s.desc || s.description || s.text || `Practical engineering proficiency in ${name}.`,
        tags: Array.isArray(s.tags) ? s.tags : (s.tags ? String(s.tags).split(",") : ["Engineering"])
      });
    }
  });

  if (skillsGrid) {
    skillsGrid.innerHTML = "";
    uniqueSkills.forEach((s) => {
      const domId = "custom_skill_" + s.id;
      const card = document.createElement("div");
      card.id = domId;
      card.className = "card skill-card";
      card.innerHTML = `
        <div class="card-header-accent"></div>
        <div class="skill-header">
          <div class="skill-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div>
            <span class="skill-category">${escapeHTML(s.category || "VLSI Skill")}</span>
            <h3 class="skill-title">${escapeHTML(s.title)}</h3>
          </div>
        </div>
        <p class="skill-desc">${escapeHTML(s.desc || "")}</p>
        <div class="tags" style="margin: 0; margin-top: auto;">
          ${s.tags.map(t => `<span class="tag">${escapeHTML(String(t).trim())}</span>`).join("")}
        </div>
      `;
      skillsGrid.appendChild(card);
    });
  }

  if (homeSkillsGrid) {
    homeSkillsGrid.innerHTML = "";
    const homeSkillsList = uniqueSkills.slice(0, 8);
    homeSkillsList.forEach((s) => {
      const card = document.createElement("div");
      card.className = "card skill-card";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.innerHTML = `
        <div class="card-header-accent"></div>
        <div class="skill-header" style="margin-bottom: 8px;">
          <div class="skill-icon" style="width: 32px; height: 32px; font-size: 0.9rem;">
            ⚡
          </div>
          <div>
            <span class="skill-category" style="font-size: 0.7rem;">${escapeHTML(s.category || "VLSI Skill")}</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin: 0;">${escapeHTML(s.title)}</h4>
          </div>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 10px;">${escapeHTML(s.desc || "")}</p>
        <div class="tags" style="margin-top: auto;">
          ${s.tags.slice(0, 3).map(t => `<span class="tag" style="font-size: 0.7rem; padding: 2px 6px;">${escapeHTML(String(t).trim())}</span>`).join("")}
        </div>
      `;
      homeSkillsGrid.appendChild(card);
    });
  }

  // 8. Render Additional About Details on about.html
  const additionalAboutDetails = Array.isArray(content.additionalAboutDetails) ? content.additionalAboutDetails : [];
  const extraBox = document.getElementById("publicExtraAboutDetails");
  if (extraBox) {
    if (additionalAboutDetails.length > 0) {
      extraBox.style.display = "block";
      const list = extraBox.querySelector("#extraDetailsList");
      if (list) {
        list.innerHTML = additionalAboutDetails.map(d => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 14px;">
            <strong style="color: #60A5FA; font-size: 0.95rem; display: block; margin-bottom: 4px;">${escapeHTML(d.title)}</strong>
            <p style="color: #CBD5E1; font-size: 0.875rem; line-height: 1.5;">${escapeHTML(d.desc)}</p>
          </div>
        `).join("");
      }
    } else {
      extraBox.style.display = "none";
    }
  }

  // 8b. Render Education Pathway Records on about.html & resume.html
  let eduList = content.education;
  if (!Array.isArray(eduList) || eduList.length === 0) {
    try {
      const savedEdu = localStorage.getItem("portfolioEducation");
      if (savedEdu) eduList = JSON.parse(savedEdu);
    } catch (e) {}
  }
  if (!Array.isArray(eduList) || eduList.length === 0) {
    eduList = [...DEFAULT_EDUCATION];
  }

  // Render on about.html (#eduPathwayList)
  const pList = document.getElementById("eduPathwayList");
  if (pList) {
    pList.innerHTML = eduList.map(e => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #FFFFFF; margin: 0;">${escapeHTML(e.degree || '')}</h3>
          <span style="font-size: 0.8rem; font-family: var(--font-mono); color: #FCD34D; font-weight: 600; background: rgba(245, 158, 11, 0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3);">${escapeHTML(e.year || '')}</span>
        </div>
        <div style="font-size: 0.9rem; color: #60A5FA; font-weight: 600; margin-bottom: 4px;">
          ${escapeHTML(e.institution || '')} ${e.location ? `• <span style="color: var(--text-muted); font-weight: normal;">${escapeHTML(e.location)}</span>` : ''}
        </div>
        ${e.score ? `<div style="font-size: 0.85rem; color: #34D399; font-weight: 700; margin-bottom: 6px;">${escapeHTML(e.score)}</div>` : ''}
        ${e.details ? `<p style="font-size: 0.875rem; color: #CBD5E1; margin: 0; line-height: 1.55;">${escapeHTML(e.details)}</p>` : ''}
      </div>
    `).join("");
  }

  // Render on resume.html (#resumeEducationList)
  const resumeEduList = document.getElementById("resumeEducationList");
  if (resumeEduList) {
    resumeEduList.innerHTML = eduList.map(e => `
      <div class="resume-item" style="margin-bottom: 16px;">
        <div class="resume-item-header">
          <span class="resume-item-title">${escapeHTML(e.degree || '')}</span>
          <span class="resume-item-date" style="color: #93C5FD; font-weight: 600;">${escapeHTML(e.year || '')}</span>
        </div>
        <div class="resume-item-sub">
          ${escapeHTML(e.institution || '')} ${e.location ? `(${escapeHTML(e.location)})` : ''} ${e.score ? `• <strong style="color: #34D399;">${escapeHTML(e.score)}</strong>` : ''}
        </div>
        ${e.details ? `<p class="resume-item-desc" style="color: #94A3B8; margin-top: 4px; font-size: 0.85rem;">${escapeHTML(e.details)}</p>` : ''}
      </div>
    `).join("");
  }

  // 8c. Render Achievements & Hackathons across all public pages
  let achList = content.achievements;
  if (!Array.isArray(achList) || achList.length === 0) {
    try {
      const savedAch = localStorage.getItem("portfolioAchievements");
      if (savedAch) achList = JSON.parse(savedAch);
    } catch (e) {}
  }
  if (!Array.isArray(achList) || achList.length === 0) {
    achList = [...DEFAULT_ACHIEVEMENTS];
  }

  // 1) Render on about.html (#achievementsDisplayList)
  const aboutAchList = document.getElementById("achievementsDisplayList");
  if (aboutAchList) {
    aboutAchList.innerHTML = achList.map(a => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              🏆
            </div>
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #FFFFFF; margin: 0;">${escapeHTML(a.title || '')}</h3>
              <span style="font-size: 0.75rem; color: #FCD34D; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Distinction / Award</span>
            </div>
          </div>
          <span class="badge badge-primary" style="font-size: 0.75rem;">Verified Record</span>
        </div>
        <p style="font-size: 0.9rem; color: #CBD5E1; margin: 0; line-height: 1.6;">${formatSimpleMarkdown(a.description || '')}</p>
      </div>
    `).join("");
  }

  // 2) Render on index.html (#homeAchievementsGrid)
  const homeAchGrid = document.getElementById("homeAchievementsGrid");
  if (homeAchGrid) {
    homeAchGrid.innerHTML = achList.map(a => `
      <div class="card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
        <div class="card-header-accent"></div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              🏆
            </div>
            <span class="badge badge-primary" style="font-size: 0.725rem;">Honors</span>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; line-height: 1.35;">${escapeHTML(a.title || '')}</h3>
          <p style="font-size: 0.88rem; color: #CBD5E1; line-height: 1.55; margin-bottom: 14px;">${formatSimpleMarkdown(a.description || '')}</p>
        </div>
        <div style="border-top: 1px solid rgba(69, 137, 255, 0.15); padding-top: 10px; margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; color: #60A5FA; font-weight: 600;">Technical Recognition</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Karnataka, IN</span>
        </div>
      </div>
    `).join("");
  }

  // 3) Render on certificates.html (#certificatesAchievementsGrid)
  const certAchGrid = document.getElementById("certificatesAchievementsGrid");
  if (certAchGrid) {
    certAchGrid.innerHTML = achList.map(a => `
      <div class="card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
        <div class="card-header-accent"></div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🎖️</span>
              <span class="cert-card-badge">Competition Award</span>
            </div>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">${escapeHTML(a.title || '')}</h3>
          <p style="font-size: 0.88rem; color: #CBD5E1; line-height: 1.55; margin-bottom: 12px;">${formatSimpleMarkdown(a.description || '')}</p>
        </div>
        <div style="border-top: 1px solid rgba(69, 137, 255, 0.15); padding-top: 10px; margin-top: auto;">
          <span style="font-size: 0.775rem; color: #34D399; font-weight: 600;">Accredited Symposium Achievement</span>
        </div>
      </div>
    `).join("");
  }

  // 4) Render on resume.html (#resumeExposureList)
  const resumeExposureList = document.getElementById("resumeExposureList");
  if (resumeExposureList) {
    const achBullets = achList.map(a => {
      return `<li><strong>${escapeHTML(a.title)}:</strong> ${formatSimpleMarkdown(a.description)}</li>`;
    });
    achBullets.push(`<li>Developed an <strong>FPGA-Based UART Transmitter & Receiver</strong> using Verilog HDL and synthesized in Xilinx Vivado.</li>`);
    achBullets.push(`<li>Designed and simulated a <strong>4-Bit Ripple Carry Adder</strong> and <strong>Binary to Gray Code Converter</strong> in Verilog HDL.</li>`);
    resumeExposureList.innerHTML = achBullets.join("");
  }

  // 9. Hide Deleted Default Certificates
  const deletedCerts = Array.isArray(content.deletedCertificates) ? content.deletedCertificates : [];
  deletedCerts.forEach((cid) => {
    const cards = document.querySelectorAll(`[data-cert-id="${cid}"]`);
    cards.forEach((c) => {
      c.style.display = "none";
    });
  });

  // 10. Render Certificates (on certificates.html & index.html)
  const certGrids = document.querySelectorAll("#certificatesGrid, #homeCertificatesGrid");
  if (certGrids.length > 0) {
    const rawCerts = Array.isArray(content.customCertificates) && content.customCertificates.length > 0
      ? content.customCertificates
      : (Array.isArray(content.certifications) ? content.certifications : []);

    // Strict deduplication by title & ID
    const uniqueCerts = [];
    const seenC = new Set();
    rawCerts.forEach((c) => {
      if (!c) return;
      const titleKey = (c.title || c.name || "").trim().toLowerCase();
      const idKey = (c.id || "").trim();
      if (!titleKey) return;
      if (seenC.has(titleKey) || (idKey && seenC.has(idKey))) return;
      seenC.add(titleKey);
      if (idKey) seenC.add(idKey);
      uniqueCerts.push(c);
    });

    certGrids.forEach((grid) => {
      grid.innerHTML = ""; // ALWAYS CLEAR PREVIOUS CARDS TO PREVENT DUPLICATES!

      if (uniqueCerts.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">🏆</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">No Certificates in Database</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">All database certificates have been cleared. You can add verified credentials through the Admin Portal.</p>
            <a href="admin.html" class="btn btn-primary btn-sm">Open Admin Portal</a>
          </div>
        `;
        return;
      }

      const isHome = grid.id === "homeCertificatesGrid";
      const listToRender = isHome ? uniqueCerts.slice(0, 2) : uniqueCerts;

      listToRender.forEach((c) => {
        const domId = "custom_cert_" + c.id;
        const tags = Array.isArray(c.tags) ? c.tags : (c.tags ? c.tags.split(",") : ["Verified", "ECE"]);
        const card = document.createElement("div");
        card.id = domId;
        card.className = "card cert-card";
        card.innerHTML = `
          <div class="card-header-accent"></div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
              <span class="cert-card-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                Verified Credential
              </span>
              <span style="font-size: 0.8rem; color: #64748B; font-family: var(--font-mono);">${escapeHTML(c.date || "")}</span>
            </div>
            <h2 class="project-title" style="font-size: 1.15rem;">${escapeHTML(c.title || c.name || "")}</h2>
            <p style="font-size: 0.85rem; color: #60A5FA; font-weight: 600; margin-bottom: 8px;">${escapeHTML(c.issuer || c.organization || "Verified Authority")}</p>
            <p class="project-desc">${escapeHTML(c.desc || c.description || "")}</p>
            <div class="tags">
              ${tags.map(t => `<span class="tag">${escapeHTML(String(t).trim())}</span>`).join("")}
            </div>
            ${Array.isArray(c.photos) && c.photos.length > 0 ? `
              <div class="presentation-photos-container">
                <div class="presentation-photos-header">
                  <span style="display: flex; align-items: center; gap: 5px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Certificate & Presentation Photos (${Math.min(c.photos.length, 4)})
                  </span>
                  <span style="font-size: 0.7rem; color: #94A3B8;">Click to expand</span>
                </div>
                <div class="presentation-photos-grid photo-grid-4">
                  ${c.photos.slice(0, 4).map((src, idx) => `
                    <img src="${src}" alt="${escapeHTML(c.title || c.name || "")} Photo ${idx + 1}" class="presentation-photo-thumb" onclick="openPresentationLightbox(this.src, '${escapeHTML(c.title || c.name || "")} - Photo ${idx + 1}')" />
                  `).join("")}
                </div>
              </div>
            ` : ""}
          </div>
          ${c.url ? `
            <div class="project-links" style="margin-top: 16px;">
              <a href="${escapeHTML(c.url)}" target="_blank" rel="noopener noreferrer" class="btn-credential">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Verify Credential & Details
              </a>
            </div>
          ` : ""}
        `;
        grid.appendChild(card);
      });
    });
  }

  // 11. Render Presentation Photos for Papers
  const photoSections = [
    { prefix: "paper", count: 4 }
  ];

  photoSections.forEach(({ prefix, count }) => {
    for (let i = 1; i <= count; i++) {
      const photos = content[`${prefix}${i}Photos`];
      if (Array.isArray(photos) && photos.length > 0) {
        const gridEl = document.getElementById(`${prefix}${i}PhotosGrid`);
        if (gridEl) {
          const title = content[`${prefix}${i}Title`] || "Presentation Slide";
          gridEl.innerHTML = photos.map((src, idx) => `
            <img src="${src}" alt="${escapeHTML(title)} Photo ${idx + 1}" class="presentation-photo-thumb" onclick="openPresentationLightbox(this.src, '${escapeHTML(title)} - Photo ${idx + 1}')" />
          `).join("");
        }
        if (prefix === "cert" && (i === 1 || i === 2)) {
          const homeGrid = document.getElementById(`homeCert${i}PhotosGrid`);
          if (homeGrid) {
            const title = content[`cert${i}Title`] || "Certificate Photo";
            homeGrid.innerHTML = photos.map((src, idx) => `
              <img src="${src}" alt="${escapeHTML(title)} Photo ${idx + 1}" class="presentation-photo-thumb" onclick="openPresentationLightbox(this.src, '${escapeHTML(title)} - Photo ${idx + 1}')" />
            `).join("");
          }
        }
      }
    }
  });
}

// Global Lightbox preview handler
window.openPresentationLightbox = function(src, caption) {
  let box = document.getElementById("presentationLightbox");
  if (!box) {
    box = document.createElement("div");
    box.id = "presentationLightbox";
    box.className = "presentation-lightbox-backdrop";
    box.onclick = function(e) { if (e.target === box) closePresentationLightbox(); };
    box.innerHTML = `
      <div class="presentation-lightbox-card">
        <div class="presentation-lightbox-header">
          <h3 id="lightboxCaption" style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin: 0;">Presentation Slide Preview</h3>
          <button type="button" class="btn btn-secondary btn-sm" onclick="closePresentationLightbox()" style="padding: 4px 10px; font-size: 0.8rem;">✕ Close</button>
        </div>
        <div class="presentation-lightbox-body">
          <img id="lightboxImage" src="" alt="Presentation Photo" />
        </div>
      </div>
    `;
    document.body.appendChild(box);
  }
  const img = box.querySelector("#lightboxImage");
  const cap = box.querySelector("#lightboxCaption");
  if (img) img.src = src;
  if (cap) cap.textContent = caption || "Presentation Photo Preview";
  box.classList.add("open");
};

window.closePresentationLightbox = function() {
  const box = document.getElementById("presentationLightbox");
  if (box) box.classList.remove("open");
};

window.openTechnicalPaperModal = function(index) {
  const modal = document.getElementById("paperModal");
  const modalContent = document.getElementById("modalContent");
  if (!modal || !modalContent) return;

  const papers = window._papersListForModal || [];
  const paper = papers[index] || papers[0];
  if (!paper) return;

  modalContent.innerHTML = `
    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; align-items: center;">
      <span class="badge badge-primary" style="display: inline-flex; align-items: center; gap: 4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        ${escapeHTML(paper.event || "Technical Symposium")}
      </span>
      ${paper.result ? `<span class="award-badge" style="background: rgba(245, 158, 11, 0.2); color: #B45309; border-color: rgba(245, 158, 11, 0.5);">🏆 ${escapeHTML(paper.result)}</span>` : ''}
    </div>
    <h2 style="font-size: 1.45rem; font-weight: 800; color: #FFFFFF; margin-bottom: 8px; line-height: 1.35;">${escapeHTML(paper.title)}</h2>
    ${paper.tagline ? `<p style="font-size: 0.95rem; color: #60A5FA; font-style: italic; font-weight: 600; margin-bottom: 14px;">${escapeHTML(paper.tagline)}</p>` : ''}

    <div style="background: rgba(15, 98, 254, 0.1); border-left: 4px solid #0F62FE; padding: 12px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 0.85rem; color: #E2E8F0;">
      ${paper.institution ? `<div style="margin-bottom: 4px;"><strong>Host Institution / University:</strong> ${escapeHTML(paper.institution)}</div>` : ''}
      ${paper.date ? `<div><strong>Conference / Event Date:</strong> ${escapeHTML(paper.date)}</div>` : ''}
    </div>

    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(69, 137, 255, 0.25); padding: 14px 16px; border-radius: 8px; margin-bottom: 20px;">
      <h4 style="font-size: 0.825rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #93C5FD; margin-bottom: 6px;">
        Abstract / System Description:
      </h4>
      <p style="font-size: 0.9rem; color: #CBD5E1; line-height: 1.65; margin: 0;">
        ${escapeHTML(paper.description || paper.abstract || paper.text || '')}
      </p>
    </div>

    ${Array.isArray(paper.photos) && paper.photos.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 0.825rem; font-weight: 700; color: #1E293B; margin-bottom: 8px;">
          Presentation & Certificate Photos (${paper.photos.length}):
        </h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${paper.photos.map((src, i) => `
            <img src="${src}" alt="Photo ${i+1}" style="width: 100px; height: 75px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 1.5px solid #CBD5E1;" onclick="openPresentationLightbox('${src}', '${escapeHTML(paper.title)} - Photo ${i+1}')" />
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      ${paper.link ? `
        <a href="${escapeHTML(paper.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; background: #059669; border-color: #059669;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Open Google Drive Full Paper / Certificate
        </a>
      ` : ''}
      <button class="btn btn-secondary btn-sm" onclick="document.getElementById('paperModal').classList.remove('open')">Close</button>
    </div>
  `;

  modal.classList.add("open");
};

// Universal Smooth Scrolling for Viewers
function setupSmoothScrolling() {
  document.addEventListener("click", function(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          try {
            history.pushState(null, null, href);
          } catch (_) {}
        }
      }
    }
  });
}

/**
 * Setup navigation UI (highlight active page, mobile toggle, sticky shadow)
 */
function setupNavigation() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
      }
    });
  }

  // Active link detection
  const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
  const currentBase = currentPath.replace(/\.html$/, '') || 'index';
  
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    
    const linkPath = href.split("?")[0].split("#")[0].replace(/^\/|\/$/g, '');
    const linkBase = linkPath.replace(/\.html$/, '') || 'index';

    if (linkBase === currentBase) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Sticky Navbar shadow on scroll
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }, { passive: true });
  }
}

// -------------------------------------------------------------
// SENDER ROLE SWITCHER & QUERY HANDLER
// -------------------------------------------------------------
window.switchQueryRole = function(role) {
  const btnRecruiter = document.getElementById("btnRoleRecruiter");
  const btnInterested = document.getElementById("btnRoleInterested");
  const recruiterFields = document.getElementById("recruiterFieldsContainer");
  const interestedFields = document.getElementById("interestedFieldsContainer");
  const formTitle = document.getElementById("formHeadingTitle");
  const formSubtitle = document.getElementById("formHeadingSubtitle");
  const btnSubmitText = document.getElementById("btnSubmitQueryText");
  const hiddenPersona = document.getElementById("hiddenSenderPersona");
  const hiddenSubject = document.getElementById("hiddenFormSubject");
  const labelMessage = document.getElementById("labelVisitorMessage");
  const messageInput = document.getElementById("visitorMessage");
  const companyInput = document.getElementById("recruiterCompany");

  if (role === "recruiter") {
    btnRecruiter?.classList.add("active");
    btnInterested?.classList.remove("active");
    if (recruiterFields) recruiterFields.style.display = "block";
    if (interestedFields) interestedFields.style.display = "none";
    if (formTitle) formTitle.innerHTML = "<span>💼</span> Recruiter & Opportunity Inquiry";
    if (formSubtitle) formSubtitle.innerHTML = "Connect regarding <strong>VLSI internships, entry-level engineering roles</strong>, or recruitment interviews.";
    if (btnSubmitText) btnSubmitText.textContent = "Submit Recruiter Inquiry";
    if (hiddenPersona) hiddenPersona.value = "Recruiter";
    if (hiddenSubject) hiddenSubject.value = "New Recruiter Inquiry for Naveena K";
    if (labelMessage) labelMessage.innerHTML = 'Role Requirements / Message <span style="color: #DC2626;">*</span>';
    if (messageInput) messageInput.placeholder = "Describe the opportunity requirements, timeline, stipend/package, or next steps...";
    if (companyInput) companyInput.required = true;
  } else {
    btnInterested?.classList.add("active");
    btnRecruiter?.classList.remove("active");
    if (recruiterFields) recruiterFields.style.display = "none";
    if (interestedFields) interestedFields.style.display = "block";
    if (formTitle) formTitle.innerHTML = "<span>💡</span> Technical & Collaboration Inquiry";
    if (formSubtitle) formSubtitle.innerHTML = "Send a message about <strong>VLSI projects, FPGA design, research papers</strong>, or engineering networking.";
    if (btnSubmitText) btnSubmitText.textContent = "Send Query / Message";
    if (hiddenPersona) hiddenPersona.value = "Interested Party";
    if (hiddenSubject) hiddenSubject.value = "New Inquiry / Collaboration Message for Naveena K";
    if (labelMessage) labelMessage.innerHTML = 'Query Details & Message <span style="color: #DC2626;">*</span>';
    if (messageInput) messageInput.placeholder = "Write your questions, collaboration thoughts, or message here...";
    if (companyInput) companyInput.required = false;
  }
};

window.toggleScheduleFields = function(show) {
  const box = document.getElementById("scheduleFieldsBox");
  if (box) box.style.display = show ? "grid" : "none";
};

/**
 * Global Contact Form Submission Handler
 * Resilient in Sandboxed Iframes, Public Viewers, and Mobile Browsers
 */
window.handleContactFormSubmit = async function (event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const form = document.getElementById("queryForm");
  const successBanner = document.getElementById("formSuccessBanner");
  const persona = (document.getElementById("hiddenSenderPersona")?.value || "Recruiter").trim();
  const isRecruiter = persona === "Recruiter";

  const nameInput = document.getElementById("visitorName");
  const emailInput = document.getElementById("visitorEmail");
  const messageInput = document.getElementById("visitorMessage");
  const companyInput = document.getElementById("recruiterCompany");

  const name = (nameInput?.value || "").trim();
  const email = (emailInput?.value || "").trim();
  const message = (messageInput?.value || "").trim();
  let company = (companyInput?.value || "").trim();

  // Validate required fields
  if (!name || !email || !message) {
    if (successBanner) {
      successBanner.style.display = "block";
      successBanner.style.borderColor = "rgba(239, 68, 68, 0.4)";
      successBanner.style.background = "rgba(239, 68, 68, 0.12)";
      successBanner.innerHTML = `
        <div style="font-weight: 600; color: #F87171; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Please fill in all required fields (Your Name, Email, and Message).</span>
        </div>
      `;
      successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (!name && nameInput) nameInput.focus();
    else if (!email && emailInput) emailInput.focus();
    else if (!message && messageInput) messageInput.focus();
    return false;
  }

  let opportunityType = "";
  let locationMode = "";
  let interestedCategory = "";
  let queryType = "";
  let proposedDate = "";
  let proposedTime = "";
  let subject = "";

  if (isRecruiter) {
    if (!company) company = "Hiring Organization / Recruiter";
    opportunityType = (document.getElementById("recruiterOpportunityType")?.value || "VLSI Internship / Role").trim();
    locationMode = (document.getElementById("recruiterLocation")?.value || "Bengaluru, Karnataka").trim();
    const rawSub = (document.getElementById("recruiterSubject")?.value || "").trim();
    subject = rawSub || `[Recruiter Inquiry] ${company} - ${opportunityType}`;

    const scheduleChecked = document.getElementById("toggleScheduleMeeting")?.checked;
    if (scheduleChecked) {
      proposedDate = (document.getElementById("recruiterDate")?.value || "").trim();
      proposedTime = (document.getElementById("recruiterTime")?.value || "").trim();
    }
  } else {
    interestedCategory = (document.getElementById("interestedCategory")?.value || "Engineering Student / Peer").trim();
    queryType = (document.getElementById("interestedQueryType")?.value || "Technical Discussion").trim();
    const rawSub = (document.getElementById("interestedSubject")?.value || "").trim();
    subject = rawSub || `[Inquiry] ${queryType} from ${name} (${interestedCategory})`;
  }

  const newQuery = {
    id: "q_" + Date.now(),
    name: name,
    email: email,
    persona: persona,
    company: company || (isRecruiter ? "Hiring Company" : "Individual"),
    type: isRecruiter ? opportunityType : queryType,
    category: interestedCategory || null,
    location: locationMode || null,
    appointmentDate: proposedDate || null,
    appointmentTime: proposedTime || null,
    subject: subject,
    message: message,
    date: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  // 1. Immediately save to localStorage for offline persistence
  try {
    const existingQueries = JSON.parse(localStorage.getItem("portfolioQueries") || "[]");
    existingQueries.unshift(newQuery);
    localStorage.setItem("portfolioQueries", JSON.stringify(existingQueries));
  } catch (e) {
    console.warn("Storage note:", e);
  }

  // Visual loading feedback on button
  const submitBtn = document.getElementById("btnSubmitQuery") || form?.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : (isRecruiter ? "Submit Recruiter Inquiry" : "Send Query / Message");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
        </svg>
        Sending Query...
      </span>
    `;
  }

  // 2. Prepare message body
  let fullEmailMessage = message;
  if (isRecruiter) {
    fullEmailMessage = `💼 RECRUITER INQUIRY DETAILS:\n- Recruiter Name: ${name}\n- Work Email: ${email}\n- Company: ${company || 'Not specified'}\n- Opportunity Type: ${opportunityType}\n- Job Location / Mode: ${locationMode}\n- Proposed Interview Slot: ${proposedDate ? `${proposedDate} (${proposedTime || 'Flexible'})` : 'None proposed (Flexible)'}\n\nROLE REQUIREMENTS & MESSAGE:\n${message}`;
  } else {
    fullEmailMessage = `💡 INQUIRY & COLLABORATION DETAILS:\n- Sender Name: ${name}\n- Email: ${email}\n- Background: ${interestedCategory}\n- Topic / Inquiry: ${queryType}\n\nMESSAGE:\n${message}`;
  }

  const payload = {
    name: name,
    email: email,
    _replyto: email,
    _subject: subject,
    _captcha: "false",
    _template: "table",
    sender_persona: persona,
    company: company || "N/A",
    inquiry_type: isRecruiter ? opportunityType : queryType,
    sender_background: interestedCategory || "N/A",
    job_location: locationMode || "N/A",
    proposed_date: proposedDate || "N/A",
    proposed_time: proposedTime || "N/A",
    message: fullEmailMessage
  };

  // 3. Dispatch Supabase and Email in parallel with a strict 2.5s timeout race
  // This guarantees the public viewer is NEVER frozen by network timeouts or iframe restrictions!
  const timeoutGuard = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), 2500));

  const supabaseTask = (async () => {
    if (typeof window.saveSupabaseAppointment === "function") {
      try {
        return await window.saveSupabaseAppointment({
          name: name,
          email: email,
          company: company,
          type: isRecruiter ? `[Recruiter] ${company ? company + ' - ' : ''}${opportunityType}` : `[Inquiry] ${interestedCategory} - ${queryType}`,
          appointmentDate: proposedDate || null,
          appointmentTime: proposedTime || null,
          subject: subject,
          message: isRecruiter
            ? `RECRUITER INQUIRY\nCompany: ${company || 'N/A'}\nOpportunity: ${opportunityType}\nLocation: ${locationMode}\nProposed Meeting: ${proposedDate || 'Flexible'} (${proposedTime || 'Flexible'})\n\nMessage:\n${message}`
            : `TECHNICAL / COLLABORATION INQUIRY\nSender Background: ${interestedCategory}\nTopic: ${queryType}\n\nMessage:\n${message}`
        });
      } catch (err) {
        console.warn("Supabase background dispatch:", err);
      }
    }
    return null;
  })();

  const formSubmitTask = (async () => {
    try {
      const response = await fetch("https://formsubmit.co/ajax/naveenkrishnamurthy2006@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      return await response.json().catch(() => null);
    } catch (err) {
      console.warn("FormSubmit background dispatch:", err);
      return null;
    }
  })();

  try {
    await Promise.race([
      Promise.allSettled([supabaseTask, formSubmitTask]),
      timeoutGuard
    ]);
  } catch (e) {
    // Proceed regardless
  }

  // 4. Render the clear success confirmation banner
  if (successBanner) {
    const mailtoUrl = `mailto:naveenkrishnamurthy2006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullEmailMessage)}`;

    successBanner.style.borderColor = "#A7F3D0";
    successBanner.style.background = "#ECFDF5";

    successBanner.innerHTML = `
      <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; color: #065F46;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>${isRecruiter ? 'Recruiter Inquiry Sent' : 'Query Submitted'} Successfully!</span>
      </div>
      <p style="font-size: 0.9rem; margin: 0 0 8px 0; color: #CBD5E1; line-height: 1.5;">
        Thank you, <strong>${escapeHTML(name)}</strong>. Your ${isRecruiter ? 'recruiter inquiry' : 'query'} has been sent successfully to Naveena K.
      </p>
      <p style="font-size: 0.825rem; margin: 0 0 12px 0; color: #93C5FD; font-weight: 500;">
        Dispatched to inbox: <strong>naveenkrishnamurthy2006@gmail.com</strong>.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="${mailtoUrl}" class="btn btn-secondary btn-sm" style="background: #0F62FE; color: #FFFFFF; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; padding: 6px 12px; border-radius: 4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Open in Email App (Gmail/Mail)
        </a>
        <button type="button" onclick="document.getElementById('formSuccessBanner').style.display='none'" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; padding: 6px 12px; border-radius: 4px;">
          Dismiss
        </button>
      </div>
    `;

    successBanner.style.display = "block";
    successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // 5. Clean reset
  if (form) form.reset();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }

  return false;
};

// Aliases
window.handleQuerySubmit = window.handleContactFormSubmit;

/**
 * Setup Contact Form Submission listeners
 */
function setupContactForm() {
  const form = document.getElementById("queryForm");
  if (!form) return;

  // Intercept submit directly
  form.onsubmit = function (event) {
    event.preventDefault();
    return window.handleContactFormSubmit(event);
  };
}

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Modern Floating Tabs Navigation Dock
 * Renders a frosted-glass floating navigation pill with active tracking and responsive collapse
 */
function setupFloatingTabs() {
  if (window.location.pathname.includes("admin") || document.getElementById("dashboardSection")) {
    return;
  }

  // Prevent duplicate mounts
  if (document.getElementById("floatingTabsDock")) return;

  const currentPath = window.location.pathname.replace(/^\/+/, "").toLowerCase() || "index.html";

  const tabsConfig = [
    {
      id: "tab-home",
      label: "Home",
      url: "index.html",
      match: ["", "index.html", "index"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      id: "tab-about",
      label: "About",
      url: "about.html",
      match: ["about.html", "about"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    },
    {
      id: "tab-skills",
      label: "Skills",
      url: "skills.html",
      match: ["skills.html", "skills"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`
    },
    {
      id: "tab-projects",
      label: "Projects",
      url: "projects.html",
      match: ["projects.html", "projects"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
    },
    {
      id: "tab-papers",
      label: "Papers",
      url: "papers.html",
      match: ["papers.html", "papers"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`
    },
    {
      id: "tab-certs",
      label: "Certificates",
      url: "certificates.html",
      match: ["certificates.html", "certificates"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`
    },
    {
      id: "tab-resume",
      label: "Resume",
      url: "resume.html",
      match: ["resume.html", "resume"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`
    },
    {
      id: "tab-contact",
      label: "Contact",
      url: "contact.html",
      match: ["contact.html", "contact"],
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
    }
  ];

  const container = document.createElement("div");
  container.id = "floatingTabsDock";
  container.className = "floating-dock-container";
  container.setAttribute("role", "navigation");
  container.setAttribute("aria-label", "Floating Navigation Dock");

  const nav = document.createElement("nav");
  nav.className = "floating-dock-nav";

  tabsConfig.forEach(tab => {
    const isActive = tab.match.some(m => 
      currentPath.endsWith(m) || 
      currentPath === m || 
      (m === "" && (currentPath === "index.html" || currentPath === "" || currentPath === "/"))
    );

    const a = document.createElement("a");
    a.href = tab.url;
    a.className = `floating-dock-tab ${isActive ? "active" : ""}`;
    a.title = tab.label;
    if (isActive) a.setAttribute("aria-current", "page");

    a.innerHTML = `
      ${tab.icon}
      <span class="tab-label">${escapeHTML(tab.label)}</span>
      ${isActive ? `<span class="floating-dock-dot"></span>` : ""}
    `;

    nav.appendChild(a);
  });

  container.appendChild(nav);
  document.body.appendChild(container);

  // Modern smart scroll behavior: hide on fast scroll down, reveal on scroll up
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        // Don't hide if near the top
        if (currentScrollY > 150 && currentScrollY > lastScrollY + 12) {
          container.classList.add("dock-hidden");
        } else if (currentScrollY < lastScrollY - 6 || currentScrollY <= 90) {
          container.classList.remove("dock-hidden");
        }
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Robust Initialization (DOM ready or already loaded)
 */
function initPortfolioApp() {
  applyPortfolioContent();
  setupNavigation();
  setupContactForm();
  setupSmoothScrolling();
  setupFloatingTabs();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolioApp);
} else {
  initPortfolioApp();
}
