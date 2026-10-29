/**
 * Supabase Integration Module for Naveena K's Portfolio
 * Connects directly to the user's Supabase backend:
 * Project ID: zzjqkekiapteaixragev
 * URL: https://zzjqkekiapteaixragev.supabase.co
 * Publishable Key: sb_publishable_ePN8ZGJ8SHg_2X5ZUkd3Bg_97SACpuO
 *
 * Handles live synchronization between Admin edits, Supabase database, and Viewers in real time,
 * as well as saving appointment bookings and visitor queries directly to Supabase.
 */

const SUPABASE_CONFIG = {
  projectId: "zzjqkekiapteaixragev",
  url: "https://zzjqkekiapteaixragev.supabase.co",
  publishableKey: "sb_publishable_ePN8ZGJ8SHg_2X5ZUkd3Bg_97SACpuO",
  rowId: "main"
};

// Global reference
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

// Internal in-flight and cache deduplication
let _inFlightSupabasePromise = null;
let _cachedSupabaseData = null;
let _lastSupabaseFetchTime = 0;

/**
 * Fetches portfolio data from Supabase
 * Reuses in-flight requests and recent memory cache to prevent duplicate 1.8MB payloads.
 * @param {boolean} [force=false]
 * @returns {Promise<Object|null>}
 */
async function fetchSupabasePortfolioData(force = false) {
  if (!force && _cachedSupabaseData && (Date.now() - _lastSupabaseFetchTime < 6000)) {
    return _cachedSupabaseData;
  }

  if (_inFlightSupabasePromise) {
    return _inFlightSupabasePromise;
  }

  _inFlightSupabasePromise = (async () => {
    try {
      const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=*`;
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: SUPABASE_CONFIG.publishableKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`,
          "Content-Type": "application/json"
        },
        signal: controller ? controller.signal : undefined
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn("Supabase fetch returned non-200:", response.status);
        return _cachedSupabaseData || null;
      }

      const rows = await response.json();
      if (!rows || rows.length === 0) {
        return _cachedSupabaseData || null;
      }

    const row = rows[0];
    const data = row.data || {};
    window._lastSupabaseUpdatedAt = row.updated_at;

    // Extract portfolioContent object stored in Supabase
    const portfolioContent = data.portfolioContent || {};

    // Synchronize default fallback values from structured keys if not present
    if (!portfolioContent.heroName && data.hero?.name) {
      portfolioContent.heroName = data.hero.name;
    }
    if (!portfolioContent.heroName) {
      portfolioContent.heroName = "Naveena K";
    }
    if (!portfolioContent.heroText && data.hero?.intro) {
      portfolioContent.heroText = data.hero.intro;
    }
    if (!portfolioContent.heroTitle) {
      portfolioContent.heroTitle = data.hero?.headline
        ? (data.hero.headline.includes(portfolioContent.heroName) ? data.hero.headline : `Hi, I’m ${portfolioContent.heroName} — ${data.hero.headline}`)
        : `Hi, I’m ${portfolioContent.heroName} — Aspiring VLSI Engineer`;
    } else if (!portfolioContent.heroTitle.toLowerCase().includes(portfolioContent.heroName.toLowerCase())) {
      portfolioContent.heroTitle = `Hi, I’m ${portfolioContent.heroName} — ${portfolioContent.heroTitle}`;
    }
    if (!portfolioContent.contactEmail && data.contact?.email) {
      portfolioContent.contactEmail = data.contact.email;
    }
    if (!portfolioContent.linkedin && data.contact?.linkedin) {
      portfolioContent.linkedin = data.contact.linkedin;
    }
    if (!portfolioContent.github && data.contact?.github) {
      portfolioContent.github = data.contact.github;
    }

    // Resolve profile photo from all possible Supabase schema attributes
    const resolvedProfilePhoto =
      data.portfolioContent?.profilePhoto ||
      data.portfolioContent?.photoUrl ||
      data.portfolioContent?.avatar ||
      data.hero?.profilePhoto ||
      data.hero?.photoUrl ||
      data.hero?.avatar ||
      data.hero?.image ||
      data.profilePhoto ||
      data.photoUrl ||
      data.avatar ||
      null;

    if (resolvedProfilePhoto) {
      portfolioContent.profilePhoto = resolvedProfilePhoto;
      portfolioContent.photoUrl = resolvedProfilePhoto;
      if (!data.hero) data.hero = {};
      data.hero.profilePhoto = resolvedProfilePhoto;
      data.hero.photoUrl = resolvedProfilePhoto;
    }

    // Synchronize resume object from Supabase if present
    if (data.resume) {
      portfolioContent.resume = data.resume;
      try {
        localStorage.setItem("portfolioResume", JSON.stringify(data.resume));
      } catch (e) {}
    } else if (portfolioContent.resume) {
      try {
        localStorage.setItem("portfolioResume", JSON.stringify(portfolioContent.resume));
      } catch (e) {}
    }

    // Synchronize projects from Supabase into customProjects
    if (Array.isArray(data.projects)) {
      portfolioContent.customProjects = data.projects.map((p, idx) => ({
        id: p.id || ("proj_" + idx),
        title: p.title || "VLSI Project",
        text: p.description || p.text || "",
        link: p.link || p.url || "",
        tags: Array.isArray(p.technologies) ? p.technologies : (p.tags || ["VLSI", "RTL"]),
        highlights: p.highlights || "",
        photos: p.photos || []
      }));
    } else {
      portfolioContent.customProjects = [];
    }

    // Synchronize certifications from Supabase into customCertificates
    if (Array.isArray(data.certifications)) {
      portfolioContent.customCertificates = data.certifications.map((c, idx) => ({
        id: c.id || ("cert_" + idx),
        title: c.name || c.title || "Verified Certification",
        issuer: c.organization || c.issuer || "Accredited Institution",
        date: c.date || "",
        url: c.url || "",
        desc: c.description || c.desc || `Official accreditation conferred by ${c.organization || "institution"}.`,
        tags: Array.isArray(c.tags) ? c.tags : ["Certificate", "Credential", "Verified"],
        photos: c.photos || []
      }));
    } else {
      portfolioContent.customCertificates = [];
    }

    // Synchronize skills from Supabase into customSkills
    if (Array.isArray(data.skills)) {
      const skillsFlat = [];
      data.skills.forEach((s, idx) => {
        if (!s) return;
        if (Array.isArray(s.skills)) {
          s.skills.forEach(skillName => {
            skillsFlat.push({
              id: "skill_" + skillsFlat.length,
              title: skillName,
              category: s.name || "Domain Skill",
              desc: `Proficiency in ${skillName}`,
              tags: [s.name || "Engineering"]
            });
          });
        } else {
          skillsFlat.push({
            id: s.id || ("skill_" + idx),
            title: s.title || s.name || "Engineering Skill",
            category: s.category || "VLSI Competency",
            desc: s.desc || s.description || "",
            tags: s.tags || ["Engineering"]
          });
        }
      });
      portfolioContent.customSkills = skillsFlat;
    } else {
      portfolioContent.customSkills = [];
    }

    // Synchronize technical papers from Supabase into customPapers
    const papersFlat = [];
    if (data.technicalPaper && data.technicalPaper.title) {
      papersFlat.push(data.technicalPaper);
    }
    if (Array.isArray(data.technicalPapers)) {
      data.technicalPapers.forEach(p => {
        if (p && p.title && !papersFlat.some(x => x.title === p.title)) {
          papersFlat.push(p);
        }
      });
    }
    portfolioContent.customPapers = papersFlat;
    portfolioContent.technicalPaper = papersFlat[0] || null;

    // Cache locally for offline resiliency and fast load
    try {
      const existing = JSON.parse(localStorage.getItem("portfolioContent") || "{}");
      const merged = { ...existing, ...portfolioContent };
      merged.customProjects = Array.isArray(portfolioContent.customProjects) ? portfolioContent.customProjects : [];
      merged.customCertificates = Array.isArray(portfolioContent.customCertificates) ? portfolioContent.customCertificates : [];
      merged.customSkills = Array.isArray(portfolioContent.customSkills) ? portfolioContent.customSkills : [];
      merged.customPapers = Array.isArray(portfolioContent.customPapers) ? portfolioContent.customPapers : [];
      merged.technicalPaper = portfolioContent.technicalPaper || null;
      merged.technicalPapers = Array.isArray(portfolioContent.customPapers) ? portfolioContent.customPapers : [];
      merged.projects = merged.customProjects;
      merged.certifications = merged.customCertificates;
      merged.skills = merged.customSkills;
      localStorage.setItem("portfolioContent", JSON.stringify(merged));
    } catch (e) {
      console.warn("Could not cache Supabase data to localStorage", e);
    }

    const result = {
      portfolioContent: portfolioContent,
      fullData: data,
      updated_at: row.updated_at
    };
    _cachedSupabaseData = result;
    _lastSupabaseFetchTime = Date.now();
    window._cachedSupabaseData = result;
    return result;
  } catch (err) {
    console.warn("Notice: fetchSupabasePortfolioData fallback:", err?.message || err);
    return _cachedSupabaseData || null;
  } finally {
    _inFlightSupabasePromise = null;
  }
})();

return _inFlightSupabasePromise;
}

/**
 * Saves updated portfolio content to Supabase database
 * @param {Object} updatedPortfolioContent
 * @param {Object} [fullDatabaseUpdates={}] Optional full database fields to merge (education, achievements, etc.)
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function saveSupabasePortfolioData(updatedPortfolioContent, fullDatabaseUpdates = {}) {
  try {
    // 1. Acquire current database object: prefer memory/cache to avoid blocking 1.8MB GET
    let currentData = {};
    if (window.currentFullDatabase && typeof window.currentFullDatabase === "object" && Object.keys(window.currentFullDatabase).length > 0) {
      currentData = { ...window.currentFullDatabase };
    } else if (_cachedSupabaseData && _cachedSupabaseData.fullData) {
      currentData = { ..._cachedSupabaseData.fullData };
    } else {
      try {
        const getEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=*`;
        const getRes = await fetch(getEndpoint, {
          method: "GET",
          headers: {
            apikey: SUPABASE_CONFIG.publishableKey,
            Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`
          }
        });
        if (getRes.ok) {
          const rows = await getRes.json();
          if (rows && rows.length > 0) {
            currentData = rows[0].data || {};
          }
        }
      } catch (e) {
        console.warn("Could not pre-fetch remote Supabase row, proceeding with local merge:", e);
      }
    }

    // 2. Attach updated portfolio content
    currentData.portfolioContent = { ...(currentData.portfolioContent || {}), ...updatedPortfolioContent };

    // 3. Keep structured fields synchronized
    if (!currentData.hero) currentData.hero = {};
    if (updatedPortfolioContent.heroName) currentData.hero.name = updatedPortfolioContent.heroName;
    if (updatedPortfolioContent.heroText) currentData.hero.intro = updatedPortfolioContent.heroText;

    // Synchronize profile photo across all schema variations (hero.profilePhoto, hero.photoUrl, root profilePhoto)
    const photoToPersist = updatedPortfolioContent.profilePhoto !== undefined
      ? updatedPortfolioContent.profilePhoto
      : (fullDatabaseUpdates?.hero?.profilePhoto || currentData.hero?.profilePhoto || currentData.hero?.photoUrl || currentData.profilePhoto || null);

    if (photoToPersist !== undefined && photoToPersist !== "") {
      currentData.hero.profilePhoto = photoToPersist;
      currentData.hero.photoUrl = photoToPersist;
      currentData.profilePhoto = photoToPersist;
      currentData.photoUrl = photoToPersist;
      if (!currentData.portfolioContent) currentData.portfolioContent = {};
      currentData.portfolioContent.profilePhoto = photoToPersist;
      currentData.portfolioContent.photoUrl = photoToPersist;
    } else if (updatedPortfolioContent.profilePhoto === null) {
      // Explicit removal requested
      currentData.hero.profilePhoto = null;
      currentData.hero.photoUrl = null;
      currentData.profilePhoto = null;
      currentData.photoUrl = null;
      if (currentData.portfolioContent) {
        currentData.portfolioContent.profilePhoto = null;
        currentData.portfolioContent.photoUrl = null;
      }
    }

    if (!currentData.contact) currentData.contact = {};
    if (updatedPortfolioContent.contactLocation) currentData.contact.location = updatedPortfolioContent.contactLocation;
    else if (!currentData.contact.location) currentData.contact.location = "Hiriyur, Karnataka, India";
    if (updatedPortfolioContent.contactPhone) currentData.contact.phone = updatedPortfolioContent.contactPhone;
    if (updatedPortfolioContent.contactEmail) currentData.contact.email = updatedPortfolioContent.contactEmail;
    if (updatedPortfolioContent.linkedin) currentData.contact.linkedin = updatedPortfolioContent.linkedin;
    if (updatedPortfolioContent.github) currentData.contact.github = updatedPortfolioContent.github;

    // Keep resume object synchronized
    if (updatedPortfolioContent.resume) {
      currentData.resume = updatedPortfolioContent.resume;
    }

    // Keep certifications array synchronized
    if (Array.isArray(fullDatabaseUpdates?.certifications)) {
      currentData.certifications = fullDatabaseUpdates.certifications;
    } else if (Array.isArray(updatedPortfolioContent.customCertificates)) {
      currentData.certifications = updatedPortfolioContent.customCertificates;
    }
    currentData.portfolioContent.customCertificates = currentData.certifications || [];
    currentData.portfolioContent.certifications = currentData.certifications || [];

    // Keep education array synchronized
    if (Array.isArray(fullDatabaseUpdates?.education)) {
      currentData.education = fullDatabaseUpdates.education;
    } else if (Array.isArray(updatedPortfolioContent.education)) {
      currentData.education = updatedPortfolioContent.education;
    }

    // Keep achievements array synchronized
    if (Array.isArray(fullDatabaseUpdates?.achievements)) {
      currentData.achievements = fullDatabaseUpdates.achievements;
    } else if (Array.isArray(updatedPortfolioContent.achievements)) {
      currentData.achievements = updatedPortfolioContent.achievements;
    }

    // Keep projects array synchronized
    if (Array.isArray(fullDatabaseUpdates?.projects)) {
      currentData.projects = fullDatabaseUpdates.projects;
    } else if (Array.isArray(updatedPortfolioContent.customProjects)) {
      currentData.projects = updatedPortfolioContent.customProjects;
    } else if (Array.isArray(updatedPortfolioContent.projects)) {
      currentData.projects = updatedPortfolioContent.projects;
    }
    currentData.portfolioContent.customProjects = currentData.projects || [];
    currentData.portfolioContent.projects = currentData.projects || [];

    // Keep technicalPaper synchronized
    if ("technicalPaper" in fullDatabaseUpdates) {
      currentData.technicalPaper = fullDatabaseUpdates.technicalPaper;
    } else if ("technicalPaper" in updatedPortfolioContent) {
      currentData.technicalPaper = updatedPortfolioContent.technicalPaper;
    }
    if (Array.isArray(fullDatabaseUpdates?.technicalPapers)) {
      currentData.technicalPapers = fullDatabaseUpdates.technicalPapers;
    } else if (Array.isArray(updatedPortfolioContent?.customPapers)) {
      currentData.technicalPapers = updatedPortfolioContent.customPapers;
    }
    currentData.portfolioContent.technicalPaper = currentData.technicalPaper || null;
    currentData.portfolioContent.technicalPapers = currentData.technicalPapers || [];
    currentData.portfolioContent.customPapers = currentData.technicalPapers || [];

    // Keep skills array synchronized
    if (Array.isArray(fullDatabaseUpdates?.skills)) {
      currentData.skills = fullDatabaseUpdates.skills;
    } else if (Array.isArray(updatedPortfolioContent?.customSkills)) {
      currentData.skills = updatedPortfolioContent.customSkills;
    }
    currentData.portfolioContent.customSkills = currentData.skills || [];
    currentData.portfolioContent.skills = currentData.skills || [];

    // Keep hero & about extra fields synchronized
    if (fullDatabaseUpdates?.hero) {
      currentData.hero = { ...currentData.hero, ...fullDatabaseUpdates.hero };
    }
    if (fullDatabaseUpdates?.about) {
      currentData.about = { ...currentData.about, ...fullDatabaseUpdates.about };
    }
    if (fullDatabaseUpdates?.contact) {
      currentData.contact = { ...currentData.contact, ...fullDatabaseUpdates.contact };
    }

    // 4. Send PATCH to Supabase with return=minimal for instantaneous 100ms response
    const patchEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}`;
    const timestamp = new Date().toISOString();
    const patchRes = await fetch(patchEndpoint, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        data: currentData,
        updated_at: timestamp
      })
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.warn("Supabase PATCH returned error:", patchRes.status, errText);
      return { success: false, error: errText };
    }

    // 5. Update local memory and cache stores immediately
    window._lastSupabaseUpdatedAt = timestamp;
    window.currentFullDatabase = currentData;
    _cachedSupabaseData = {
      portfolioContent: currentData.portfolioContent,
      fullData: currentData,
      updated_at: timestamp
    };
    _lastSupabaseFetchTime = Date.now();
    window._cachedSupabaseData = _cachedSupabaseData;

    try {
      localStorage.setItem("portfolioContent", JSON.stringify(currentData.portfolioContent));
      if (currentData.education) localStorage.setItem("portfolioEducation", JSON.stringify(currentData.education));
      if (currentData.achievements) localStorage.setItem("portfolioAchievements", JSON.stringify(currentData.achievements));
    } catch (e) {
      console.warn("Could not save to localStorage quota:", e);
    }

    console.log("Successfully saved and committed changes to Supabase database!");
    return { success: true, updated_at: timestamp };
  } catch (err) {
    console.error("Error saving to Supabase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Directly uploads and persists resume document to Supabase database
 * @param {Object} resumeObj { fileName, pdfUrl, lastUpdated, uploadedPdfData, fileSize }
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function uploadResumeToSupabase(resumeObj) {
  try {
    let currentData = {};
    if (window.currentFullDatabase && typeof window.currentFullDatabase === "object" && Object.keys(window.currentFullDatabase).length > 0) {
      currentData = { ...window.currentFullDatabase };
    } else if (_cachedSupabaseData && _cachedSupabaseData.fullData) {
      currentData = { ..._cachedSupabaseData.fullData };
    } else {
      try {
        const getEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=*`;
        const getRes = await fetch(getEndpoint, {
          method: "GET",
          headers: {
            apikey: SUPABASE_CONFIG.publishableKey,
            Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`
          }
        });
        if (getRes.ok) {
          const rows = await getRes.json();
          if (rows && rows.length > 0) {
            currentData = rows[0].data || {};
          }
        }
      } catch (e) {
        console.warn("Could not pre-fetch before resume upload, continuing:", e);
      }
    }

    // Attach resume to data.resume and data.portfolioContent.resume
    currentData.resume = resumeObj;
    if (!currentData.portfolioContent) currentData.portfolioContent = {};
    currentData.portfolioContent.resume = resumeObj;

    const patchEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}`;
    const timestamp = new Date().toISOString();
    const patchRes = await fetch(patchEndpoint, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        data: currentData,
        updated_at: timestamp
      })
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.warn("Supabase resume PATCH returned error:", patchRes.status, errText);
      return { success: false, error: errText };
    }

    try {
      localStorage.setItem("portfolioResume", JSON.stringify(resumeObj));
      const pc = JSON.parse(localStorage.getItem("portfolioContent") || "{}");
      pc.resume = resumeObj;
      localStorage.setItem("portfolioContent", JSON.stringify(pc));
    } catch (e) {}

    window._lastSupabaseUpdatedAt = timestamp;
    window.currentFullDatabase = currentData;
    _cachedSupabaseData = {
      portfolioContent: currentData.portfolioContent,
      fullData: currentData,
      updated_at: timestamp
    };
    _lastSupabaseFetchTime = Date.now();
    window._cachedSupabaseData = _cachedSupabaseData;

    console.log("Successfully uploaded resume to Supabase database!");
    return { success: true, updated_at: timestamp };
  } catch (err) {
    console.error("Error uploading resume to Supabase:", err);
    return { success: false, error: err.message };
  }
}

window.uploadResumeToSupabase = uploadResumeToSupabase;

/**
 * Saves a new appointment booking or contact query into Supabase
 * @param {Object} queryData
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function saveSupabaseAppointment(queryData) {
  try {
    let currentData = {};
    if (window.currentFullDatabase && typeof window.currentFullDatabase === "object" && Object.keys(window.currentFullDatabase).length > 0) {
      currentData = { ...window.currentFullDatabase };
    } else if (_cachedSupabaseData && _cachedSupabaseData.fullData) {
      currentData = { ..._cachedSupabaseData.fullData };
    } else {
      try {
        const getEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=*`;
        const getRes = await fetch(getEndpoint, {
          method: "GET",
          headers: {
            apikey: SUPABASE_CONFIG.publishableKey,
            Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`
          }
        });
        if (getRes.ok) {
          const rows = await getRes.json();
          if (rows && rows.length > 0) {
            currentData = rows[0].data || {};
          }
        }
      } catch (e) {
        console.warn("Could not pre-fetch before appointment save, continuing:", e);
      }
    }

    const messages = Array.isArray(currentData.messages) ? currentData.messages : [];
    
    // Construct message record
    const newMessage = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      name: queryData.name || "Anonymous",
      email: queryData.email || "",
      subject: queryData.subject || "Appointment / Query",
      message: queryData.message || "",
      type: queryData.type || (queryData.appointmentDate ? "appointment" : "query"),
      appointmentDate: queryData.appointmentDate || null,
      appointmentTime: queryData.appointmentTime || null,
      company: queryData.company || "Individual",
      tags: queryData.appointmentDate ? ["Appointment", "Inquiry"] : ["Inquiry"],
      status: "new",
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      isStarred: false
    };

    messages.unshift(newMessage);
    currentData.messages = messages;

    // PATCH to Supabase with return=minimal for instantaneous response
    const patchEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}`;
    const timestamp = new Date().toISOString();
    const patchRes = await fetch(patchEndpoint, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        data: currentData,
        updated_at: timestamp
      })
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.warn("Supabase failed saving message:", patchRes.status, errText);
      return { success: false, error: errText };
    }

    window._lastSupabaseUpdatedAt = timestamp;
    if (window.currentFullDatabase) {
      window.currentFullDatabase.messages = messages;
    }
    if (_cachedSupabaseData && _cachedSupabaseData.fullData) {
      _cachedSupabaseData.fullData.messages = messages;
      _cachedSupabaseData.updated_at = timestamp;
      _lastSupabaseFetchTime = Date.now();
    }

    console.log("Appointment / message successfully saved to Supabase!");
    return { success: true, message: newMessage };
  } catch (err) {
    console.warn("Notice: Error saving appointment to Supabase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches all appointments / queries stored in Supabase.
 * Uses targeted PostgREST JSON selection (data->messages) to avoid downloading
 * the 1.8MB main row, and falls back gracefully to in-memory/local caches.
 * @returns {Promise<Array>}
 */
async function fetchSupabaseAppointments() {
  // 1. Return immediately from in-memory store if fresh messages exist
  if (window.currentFullDatabase && Array.isArray(window.currentFullDatabase.messages) && window.currentFullDatabase.messages.length > 0) {
    return window.currentFullDatabase.messages;
  }
  if (_cachedSupabaseData && Array.isArray(_cachedSupabaseData.fullData?.messages) && _cachedSupabaseData.fullData.messages.length > 0) {
    return _cachedSupabaseData.fullData.messages;
  }

  try {
    // 2. Query targeted messages field directly (~500 bytes, ultra-fast 30ms response)
    const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=data->messages`;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        "Content-Type": "application/json"
      },
      signal: controller ? controller.signal : undefined
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (response.ok) {
      const rows = await response.json();
      if (rows && rows.length > 0) {
        const msgs = rows[0].messages || rows[0].data?.messages;
        if (Array.isArray(msgs)) {
          if (window.currentFullDatabase) {
            window.currentFullDatabase.messages = msgs;
          }
          return msgs;
        }
      }
    }
  } catch (err) {
    console.warn("Notice: Supabase appointment fetch fallback to local cache:", err?.message || err);
  }

  // 3. Resilient fallback to memory or localStorage
  if (window.currentFullDatabase && Array.isArray(window.currentFullDatabase.messages)) {
    return window.currentFullDatabase.messages;
  }
  try {
    const raw = localStorage.getItem("portfolioQueries");
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return [];
}

/**
 * Initializes real-time / live synchronization for viewers.
 * Polls Supabase periodically and on visibility changes, so when the admin
 * edits content, viewers' open browser tabs automatically reflect the changes live!
 * @param {Function} onUpdateCallback
 */
function initLiveViewerSync(onUpdateCallback) {
  if (typeof onUpdateCallback !== "function") return;

  async function checkVersion() {
    try {
      const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=updated_at`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: SUPABASE_CONFIG.publishableKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows[0]) {
          const remoteUpdated = rows[0].updated_at;
          if (window._lastSupabaseUpdatedAt && remoteUpdated !== window._lastSupabaseUpdatedAt) {
            console.log("Supabase database updated! Syncing fresh portfolio content to viewer...");
            window._lastSupabaseUpdatedAt = remoteUpdated;
            const full = await fetchSupabasePortfolioData();
            if (full && full.portfolioContent) {
              onUpdateCallback(full.portfolioContent);
            }
          } else if (!window._lastSupabaseUpdatedAt) {
            window._lastSupabaseUpdatedAt = remoteUpdated;
          }
        }
      }
    } catch (e) {
      // Ignore background network blips
    }
  }

  // Poll every 8 seconds
  const intervalId = setInterval(checkVersion, 8000);

  // Check immediately on tab focus
  window.addEventListener("focus", checkVersion);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      checkVersion();
    }
  });

  return () => clearInterval(intervalId);
}

/**
 * Overwrites / saves full database object directly to Supabase
 * @param {Object} fullData
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function saveFullSupabaseDatabase(fullData) {
  try {
    const patchEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}`;
    const timestamp = new Date().toISOString();
    const patchRes = await fetch(patchEndpoint, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        data: fullData,
        updated_at: timestamp
      })
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      return { success: false, error: errText };
    }

    window._lastSupabaseUpdatedAt = timestamp;
    return { success: true, updated_at: timestamp };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Deletes a single message by ID from Supabase
 * @param {string} messageId
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function deleteSupabaseMessage(messageId) {
  try {
    const getEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=*`;
    const getRes = await fetch(getEndpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`
      }
    });
    let currentData = {};
    if (getRes.ok) {
      const rows = await getRes.json();
      if (rows && rows.length > 0) currentData = rows[0].data || {};
    }
    const msgs = Array.isArray(currentData.messages) ? currentData.messages : [];
    currentData.messages = msgs.filter(m => m.id !== messageId);
    return await saveFullSupabaseDatabase(currentData);
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Clears all messages from Supabase
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function clearAllSupabaseMessages() {
  try {
    const getEndpoint = `${SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${SUPABASE_CONFIG.rowId}&select=*`;
    const getRes = await fetch(getEndpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_CONFIG.publishableKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.publishableKey}`
      }
    });
    let currentData = {};
    if (getRes.ok) {
      const rows = await getRes.json();
      if (rows && rows.length > 0) currentData = rows[0].data || {};
    }
    currentData.messages = [];
    return await saveFullSupabaseDatabase(currentData);
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Export functions to window
window.fetchSupabasePortfolioData = fetchSupabasePortfolioData;
window.saveSupabasePortfolioData = saveSupabasePortfolioData;
window.saveFullSupabaseDatabase = saveFullSupabaseDatabase;
window.saveSupabaseAppointment = saveSupabaseAppointment;
window.fetchSupabaseAppointments = fetchSupabaseAppointments;
window.deleteSupabaseMessage = deleteSupabaseMessage;
window.clearAllSupabaseMessages = clearAllSupabaseMessages;
window.initLiveViewerSync = initLiveViewerSync;
