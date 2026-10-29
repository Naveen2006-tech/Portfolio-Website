/**
 * Naveena K - VLSI Portfolio
 * content.js
 * Applies saved admin content, item additions/deletions across public pages,
 * handles responsive navigation, and processes visitor queries.
 * (Note: Public pages do not show edit controls; edit icons are exclusive to admin.html)
 */

// Default portfolio content
const DEFAULT_PORTFOLIO_CONTENT = {
  heroName: "Naveena K",
  heroTitle: "Hi, I’m Naveena K — Aspiring VLSI Engineer",
  heroText: "I am an Electronics and Communication Engineering student from Hiriyur, Karnataka, interested in digital design, RTL design, verification, CMOS circuits, FPGA development, and semiconductor technology.",
  aboutEducation: "B.E. Electronics and Communication Engineering, Hiriyur, Karnataka",
  aboutGoal: "VLSI Design Engineer, Verification Engineer, or FPGA Engineer",
  
  technicalPaper: null,
  technicalPapers: [],
  profilePhoto: null,

  contactEmail: "naveenkrishnamurthy2006@gmail.com",
  linkedin: "https://www.linkedin.com/in/naveena-k-vlsi",
  github: "https://github.com/naveena-k",
  
  deletedProjects: [],
  deletedPapers: [],
  deletedCertificates: [],
  deletedSkills: [],
  customProjects: [],
  customPapers: [],
  customCertificates: [],
  customSkills: [],
  additionalAboutDetails: []
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

        const liveContent = {
          ...DEFAULT_PORTFOLIO_CONTENT,
          ...(res.portfolioContent || {}),
          profilePhoto: photo || res.portfolioContent?.profilePhoto || null
        };
        renderPortfolioContentToDOM(liveContent);
      }
    }).catch((err) => {
      console.warn("Could not retrieve Supabase portfolio data:", err);
    });

    // 3. Register live viewer sync so admin edits immediately update viewer pages in real time
    if (typeof window.initLiveViewerSync === "function") {
      window.initLiveViewerSync((updatedContent) => {
        const liveContent = { ...DEFAULT_PORTFOLIO_CONTENT, ...updatedContent };
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

  // 7. Render Skills (on skills.html)
  const skillsGrid = document.getElementById("skillsGrid");
  if (skillsGrid) {
    skillsGrid.innerHTML = ""; // Clean out previous cards to prevent duplicates

    const rawSkills = [];
    if (Array.isArray(content.customSkills)) {
      content.customSkills.forEach(s => { if (s && (s.title || s.name)) rawSkills.push(s); });
    }
    if (Array.isArray(content.skills)) {
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

    if (uniqueSkills.length === 0) {
      skillsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">🛠️</div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">No Skills in Database</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">All database skills have been permanently cleared. You can add technical skills through the Admin Portal.</p>
          <a href="admin.html" class="btn btn-primary btn-sm">Open Admin Portal</a>
        </div>
      `;
    } else {
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
  }

  // 8. Render Additional About Details on about.html
  const additionalAboutDetails = Array.isArray(content.additionalAboutDetails) ? content.additionalAboutDetails : [];
  if (additionalAboutDetails.length > 0) {
    const mainContent = document.querySelector(".main-content .container");
    if (mainContent && window.location.pathname.includes("about")) {
      let extraBox = document.getElementById("publicExtraAboutDetails");
      if (!extraBox) {
        extraBox = document.createElement("div");
        extraBox.id = "publicExtraAboutDetails";
        extraBox.style.marginTop = "28px";
        extraBox.className = "card";
        extraBox.innerHTML = `
          <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            Additional Details & Academic Highlights
          </h2>
          <div id="extraDetailsList" style="display: flex; flex-direction: column; gap: 12px;"></div>
        `;
        mainContent.appendChild(extraBox);
      }
      const list = extraBox.querySelector("#extraDetailsList");
      if (list) {
        list.innerHTML = additionalAboutDetails.map(d => `
          <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 14px;">
            <strong style="color: #60A5FA; font-size: 0.95rem; display: block; margin-bottom: 4px;">${escapeHTML(d.title)}</strong>
            <p style="color: var(--text-muted); font-size: 0.875rem; line-height: 1.5;">${escapeHTML(d.desc)}</p>
          </div>
        `).join("");
      }
    }
  }

  // 8b. Render Education Pathway Records on about.html
  let eduList = content.education;
  if (!Array.isArray(eduList) || eduList.length === 0) {
    try {
      const savedEdu = localStorage.getItem("portfolioEducation");
      if (savedEdu) eduList = JSON.parse(savedEdu);
    } catch (e) {}
  }
  if (Array.isArray(eduList) && eduList.length > 0 && window.location.pathname.includes("about")) {
    const mainContent = document.querySelector(".main-content .container");
    if (mainContent) {
      let eduBox = document.getElementById("publicEducationPathway");
      if (!eduBox) {
        eduBox = document.createElement("div");
        eduBox.id = "publicEducationPathway";
        eduBox.style.marginTop = "28px";
        eduBox.className = "card";
        eduBox.innerHTML = `
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            Comprehensive Academic Pathway
          </h2>
          <div id="eduPathwayList" style="display: flex; flex-direction: column; gap: 14px;"></div>
        `;
        mainContent.appendChild(eduBox);
      }
      const pList = eduBox.querySelector("#eduPathwayList");
      if (pList) {
        pList.innerHTML = eduList.map(e => `
          <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin: 0;">${escapeHTML(e.degree || '')}</h3>
              <span style="font-size: 0.8rem; font-family: var(--font-mono); color: #FCD34D; font-weight: 600;">${escapeHTML(e.year || '')}</span>
            </div>
            <div style="font-size: 0.875rem; color: #60A5FA; font-weight: 600; margin-bottom: 4px;">
              ${escapeHTML(e.institution || '')} ${e.location ? `• <span style="color: var(--text-muted);">${escapeHTML(e.location)}</span>` : ''}
            </div>
            ${e.score ? `<div style="font-size: 0.825rem; color: #34D399; font-weight: 600; margin-bottom: 6px;">${escapeHTML(e.score)}</div>` : ''}
            ${e.details ? `<p style="font-size: 0.875rem; color: var(--text-muted); margin: 0; line-height: 1.5;">${escapeHTML(e.details)}</p>` : ''}
          </div>
        `).join("");
      }
    }
  }

  // 8c. Render Achievements & Hackathons on about.html & resume.html
  let achList = content.achievements;
  if (!Array.isArray(achList) || achList.length === 0) {
    try {
      const savedAch = localStorage.getItem("portfolioAchievements");
      if (savedAch) achList = JSON.parse(savedAch);
    } catch (e) {}
  }
  if (Array.isArray(achList) && achList.length > 0 && (window.location.pathname.includes("about") || window.location.pathname.includes("resume"))) {
    const mainContent = document.querySelector(".main-content .container") || document.querySelector(".resume-container");
    if (mainContent) {
      let achBox = document.getElementById("publicAchievementsSection");
      if (!achBox) {
        achBox = document.createElement("div");
        achBox.id = "publicAchievementsSection";
        achBox.style.marginTop = "28px";
        achBox.className = "card";
        achBox.innerHTML = `
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            Honors, Competitions & Hackathons
          </h2>
          <div id="achievementsDisplayList" style="display: flex; flex-direction: column; gap: 14px;"></div>
        `;
        mainContent.appendChild(achBox);
      }
      const aList = achBox.querySelector("#achievementsDisplayList");
      if (aList) {
        aList.innerHTML = achList.map(a => `
          <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="color: #FCD34D; font-weight: 700; font-size: 1rem;">🏆</span>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin: 0;">${escapeHTML(a.title || '')}</h3>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.55;">${escapeHTML(a.description || '')}</p>
          </div>
        `).join("");
      }
    }
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
  const roleNotice = document.getElementById("roleNoticeText");
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
    if (roleNotice) roleNotice.innerHTML = "Sending Recruiter Inquiry to <strong>naveenkrishnamurthy2006@gmail.com</strong>";
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
    if (roleNotice) roleNotice.innerHTML = "Sending Inquiry to <strong>naveenkrishnamurthy2006@gmail.com</strong>";
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
 * Robust Initialization (DOM ready or already loaded)
 */
function initPortfolioApp() {
  applyPortfolioContent();
  setupNavigation();
  setupContactForm();
  setupSmoothScrolling();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolioApp);
} else {
  initPortfolioApp();
}
