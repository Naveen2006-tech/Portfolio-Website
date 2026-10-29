/**
 * Naveena K - VLSI Portfolio
 * admin.js
 * Admin authentication, content editor, robust item additions, editing & deletions,
 * and visitor queries management.
 */

const ADMIN_CREDENTIALS = {
  email: "naveenkrishnamurthy2006@gmail.com",
  password: "Naveena@622006"
};

const DEFAULT_CONTENT = {
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
  
  resumeObjective: "Seeking internships or entry-level opportunities in VLSI design, verification, FPGA development, or embedded systems where I can apply strong fundamentals in RTL coding, digital logic verification, CMOS circuit design, and EDA simulation workflows to build efficient semiconductor solutions.",
  resumeEducation: "Bachelor of Engineering (B.E.) — Electronics and Communication Engineering. Relevant Coursework: CMOS VLSI Design, Digital Electronics & Logic Design, Microcontrollers & Embedded Systems, Signals & Systems, Analog Electronics, Communication Systems, HDL Programming.",
  
  deletedProjects: [],
  deletedPapers: [],
  deletedCertificates: [],
  deletedSkills: [],
  customProjects: [],
  customPapers: [],
  customCertificates: [],
  customSkills: [],
  additionalAboutDetails: [],

  // Presentation Photos collections (Up to 2 to 3 photos each)
  project1Photos: [],
  project2Photos: [],
  project3Photos: [],
  project4Photos: [],
  paper1Photos: [],
  paper2Photos: [],
  paper3Photos: [],
  paper4Photos: [],
  cert1Photos: [],
  cert2Photos: [],
  cert3Photos: [],
  cert4Photos: []
};

// Default Education records (mirrors Supabase data.education)
const DEFAULT_EDUCATION = [
  {
    id: "edu-1",
    degree: "Bachelor of Engineering (B.E. / B.Tech) in Electronics & Communication Engineering",
    institution: "S J M Institute of Technology , chitradurga",
    year: "2024 - 2028",
    score: "CGPA: 7.75 / 10.0",
    location: "Hiriyur, Karnataka",
    details: "Core Coursework: VLSI Design, Digital System Design, Computer Architecture, Electronic Circuits, Microprocessors & Microcontrollers, Signal Processing."
  },
  {
    id: "edu-2",
    degree: "Pre-University College (Class XII) - PCMC (Physics, Chemistry, Math, Biology)",
    institution: "Presidency pre-university College ,Sira ,Tumkur ",
    year: "2024",
    score: "Percentage: 89%",
    location: "Hiriyur, Karnataka",
    details: "Ranked among top performers with distinction in Mathematics and Physics."
  },
  {
    id: "edu-3",
    degree: "Secondary School Examination (Class X)",
    institution: "Morarji Desai Residential School (34) ,Yalladakere",
    year: "2022",
    score: "Percentage: 88%",
    location: "Hiriyur, Karnataka",
    details: "Academic distinction with focus on foundational science and mathematics."
  }
];

// Default Achievements records (mirrors Supabase data.achievements)
const DEFAULT_ACHIEVEMENTS = [
  {
    id: "ach-1",
    title: "VIDYUTSAVA-2K26",
    description: "Participated in VIDYUTSAVA-2K26 event held at S J M Institute of Technology, Chitradurga with classmate in Technical Paper Presentation and secured 2nd place.",
    isSample: false
  },
  {
    id: "ach-2",
    title: "IMPULSE-2026",
    description: "Participated in IMPULSE-2026 Event with classmate in Technical Paper Presentation conducted by Bapuji Institute of Engineering and Technology, Davanagere and ranked top 5th group among 20 groups.",
    isSample: false
  },
  {
    id: "ach-3",
    title: "EMERGE-2026",
    description: "Participated in EMERGE-2K26 Hackathon, an innovation-focused event that provided an opportunity to collaborate with peers, brainstorm technology-driven ideas, and present solutions to engineering challenges.",
    isSample: false
  }
];

// Active State
let currentContent = { ...DEFAULT_CONTENT };
let currentEducation = [...DEFAULT_EDUCATION];
let currentAchievements = [...DEFAULT_ACHIEVEMENTS];
let currentFullDatabase = null;

// Universal helper to trigger hidden file inputs reliably from any button or device
window.triggerFileInput = function(id) {
  const input = document.getElementById(id);
  if (input) {
    input.value = "";
    input.click();
  } else {
    console.warn("triggerFileInput: Element not found:", id);
  }
};

// DOM Elements
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("adminEmail");
const loginPasswordInput = document.getElementById("adminPassword");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const logoutBtn = document.getElementById("logoutBtn");
const viewPortfolioBtn = document.getElementById("viewPortfolioBtn");
const saveContentBtn = document.getElementById("saveContentBtn");
const saveContentBtnTop = document.getElementById("saveContentBtnTop");
const resetContentBtn = document.getElementById("resetContentBtn");
const queriesList = document.getElementById("queriesList");
const clearQueriesBtn = document.getElementById("clearQueriesBtn");
const toast = document.getElementById("adminToast");

const fields = [
  "heroName",
  "heroTitle",
  "heroText",
  "aboutEducation",
  "aboutGoal",
  
  // Skills 1 to 12
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
  "skill12Title", "skill12Category", "skill12Desc",

  // Projects 1 to 4 + URLs
  "project1Title", "project1Text", "project1Url",
  "project2Title", "project2Text", "project2Url",
  "project3Title", "project3Text", "project3Url",
  "project4Title", "project4Text", "project4Url",

  // Papers 1 to 4 + URLs
  "paper1Title", "paper1Text", "paper1Url",
  "paper2Title", "paper2Text", "paper2Url",
  "paper3Title", "paper3Text", "paper3Url",
  "paper4Title", "paper4Text", "paper4Url",

  // Certificates 1 to 4 + URLs
  "cert1Title", "cert1Issuer", "cert1Date", "cert1Desc", "cert1Url",
  "cert2Title", "cert2Issuer", "cert2Date", "cert2Desc", "cert2Url",
  "cert3Title", "cert3Issuer", "cert3Date", "cert3Desc", "cert3Url",
  "cert4Title", "cert4Issuer", "cert4Date", "cert4Desc", "cert4Url",

  // Resume Section
  "resumeObjective",
  "resumeEducation",

  "contactEmail",
  "contactPhone",
  "contactLocation",
  "linkedin",
  "github"
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true" || localStorage.getItem("adminLoggedIn") === "true";

  if (isLoggedIn) {
    if (loginSection) loginSection.style.display = "none";
    if (dashboardSection) dashboardSection.style.display = "block";
    try {
      loadFormContent();
    } catch (err) {
      console.error("Error in loadFormContent:", err);
    }
    try {
      renderQueries();
    } catch (err) {
      console.error("Error in renderQueries:", err);
    }
  } else {
    if (loginSection) loginSection.style.display = "block";
    if (dashboardSection) dashboardSection.style.display = "none";
  }
}

function validateAdminCredentials(inputUser, inputPass) {
  const user = String(inputUser || "").trim().toLowerCase();
  const pass = String(inputPass || "").trim();

  // Strict: Only accept naveenkrishnamurthy2006@gmail.com and Naveena@622006
  return user === ADMIN_CREDENTIALS.email.toLowerCase() && pass === ADMIN_CREDENTIALS.password;
}

// Authentication Listeners
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginEmailInput ? loginEmailInput.value : "";
    const pass = loginPasswordInput ? loginPasswordInput.value : "";

    if (validateAdminCredentials(email, pass)) {
      sessionStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminLoggedIn", "true");
      if (loginErrorMessage) loginErrorMessage.style.display = "none";
      checkAuth();
      showToast("Welcome Naveena! Admin session active.");
    } else {
      if (loginErrorMessage) {
        loginErrorMessage.textContent = "Invalid email or password. Please try again.";
        loginErrorMessage.style.display = "block";
      }
    }
  });
}

// Toggle password visibility
function togglePasswordVisibility() {
  if (!loginPasswordInput) return;
  const isPass = loginPasswordInput.type === "password";
  loginPasswordInput.type = isPass ? "text" : "password";
  const eyeIcon = document.getElementById("eyeIcon");
  if (eyeIcon) {
    eyeIcon.innerHTML = isPass
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
  }
}
const togglePasswordIconBtn = document.getElementById("togglePasswordIconBtn");
if (togglePasswordIconBtn) {
  togglePasswordIconBtn.addEventListener("click", togglePasswordVisibility);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoggedIn");
    checkAuth();
    showToast("Logged out successfully.");
  });
}

if (viewPortfolioBtn) {
  viewPortfolioBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

window.scrollToSection = function(sectionId) {
  const sec = document.getElementById(sectionId);
  if (sec) {
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

window.focusField = function(fieldId) {
  let el = document.getElementById(fieldId);
  if (!el && (fieldId === "dbPaperTitle" || fieldId === "paper1Title")) {
    toggleAddBox("addPaperBox");
    el = document.getElementById("newPaperTitle");
  }
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      el.focus();
      el.style.transition = "all 0.3s ease";
      el.style.borderColor = "#0F62FE";
      el.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.4)";
      setTimeout(() => {
        el.style.boxShadow = "";
        el.style.borderColor = "";
      }, 1500);
    }, 200);
  }
};

window.deleteFieldContent = function(fieldId, fieldLabel) {
  const el = document.getElementById(fieldId);
  if (el) {
    el.value = "";
    showToast(`${fieldLabel} cleared. Click "Save All Changes" to publish.`);
  }
};

window.toggleAddBox = function(boxId) {
  const box = document.getElementById(boxId);
  if (box) {
    if (box.style.display === "none" || !box.style.display) {
      box.style.display = "block";
      box.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstInput = box.querySelector("input, textarea");
      if (firstInput) setTimeout(() => firstInput.focus(), 200);
    } else {
      box.style.display = "none";
    }
  }
};

function getSavedContent() {
  let content = { ...DEFAULT_CONTENT };
  try {
    const saved = localStorage.getItem("portfolioContent");
    if (saved) {
      content = { ...content, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error("Error loading portfolioContent:", err);
  }
  return content;
}

function getSavedEducation() {
  try {
    const saved = localStorage.getItem("portfolioEducation");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [...DEFAULT_EDUCATION];
}

function getSavedAchievements() {
  try {
    const saved = localStorage.getItem("portfolioAchievements");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [...DEFAULT_ACHIEVEMENTS];
}

function saveContentToStorage(content, fullDatabaseUpdates = {}) {
  try {
    localStorage.setItem("portfolioContent", JSON.stringify(content));
    currentContent = { ...content };
  } catch (err) {
    console.warn("Notice: localStorage saving portfolioContent:", err);
  }

  if (Array.isArray(fullDatabaseUpdates.education)) {
    try {
      localStorage.setItem("portfolioEducation", JSON.stringify(fullDatabaseUpdates.education));
      currentEducation = [...fullDatabaseUpdates.education];
    } catch (e) {}
  }

  if (Array.isArray(fullDatabaseUpdates.achievements)) {
    try {
      localStorage.setItem("portfolioAchievements", JSON.stringify(fullDatabaseUpdates.achievements));
      currentAchievements = [...fullDatabaseUpdates.achievements];
    } catch (e) {}
  }

  // Synchronize with Supabase database (zzjqkekiapteaixragev)
  if (typeof window.saveSupabasePortfolioData === "function") {
    return window.saveSupabasePortfolioData(content, {
      education: currentEducation,
      achievements: currentAchievements,
      ...fullDatabaseUpdates
    }).then((res) => {
      if (res && res.success) {
        console.log("Supabase database synced with new edits.");
        window._lastSupabaseUpdatedAt = res.updated_at;
        updateAdminBadgesAndMetrics();
      } else {
        console.warn("Supabase background save returned warning:", res?.error);
      }
      return res;
    }).catch((err) => {
      console.warn("Supabase network error during save:", err);
      return { success: false, error: err?.message || "network error" };
    });
  }
  return Promise.resolve({ success: true, localOnly: true });
}

function loadFormContent() {
  currentContent = getSavedContent();
  currentEducation = getSavedEducation();
  currentAchievements = getSavedAchievements();

  populateFormFields();
  renderEducationList();
  renderAchievementsList();
  renderDatabaseProjectsList();
  renderDatabaseCertsList();
  renderTechnicalPaperCard();
  renderDatabaseSkillsCategories();
  renderDatabaseJsonViewer();
  loadSeoSettings();
  updateAdminBadgesAndMetrics();

  // Fetch freshest data from Supabase backend
  if (typeof window.fetchSupabasePortfolioData === "function") {
    window.fetchSupabasePortfolioData().then((res) => {
      if (res) {
        if (res.fullData) {
          currentFullDatabase = res.fullData;
          if (Array.isArray(res.fullData.education) && res.fullData.education.length > 0) {
            currentEducation = res.fullData.education;
            try { localStorage.setItem("portfolioEducation", JSON.stringify(currentEducation)); } catch (e) {}
          }
          if (Array.isArray(res.fullData.achievements) && res.fullData.achievements.length > 0) {
            currentAchievements = res.fullData.achievements;
            try { localStorage.setItem("portfolioAchievements", JSON.stringify(currentAchievements)); } catch (e) {}
          }
          if (res.fullData.contact) {
            if (res.fullData.contact.phone && !currentContent.contactPhone) currentContent.contactPhone = res.fullData.contact.phone;
            if (res.fullData.contact.location && !currentContent.contactLocation) currentContent.contactLocation = res.fullData.contact.location;
          }
        }
        if (res.portfolioContent && Object.keys(res.portfolioContent).length > 0) {
          currentContent = { ...currentContent, ...res.portfolioContent };
          try { localStorage.setItem("portfolioContent", JSON.stringify(currentContent)); } catch (e) {}
        }

        // Extract profile photo across all schema variations
        const photoFromDb =
          res.portfolioContent?.profilePhoto ||
          res.portfolioContent?.photoUrl ||
          res.portfolioContent?.avatar ||
          res.fullData?.hero?.profilePhoto ||
          res.fullData?.hero?.photoUrl ||
          res.fullData?.hero?.avatar ||
          res.fullData?.profilePhoto ||
          res.fullData?.photoUrl ||
          null;

        if (photoFromDb) {
          currentContent.profilePhoto = photoFromDb;
          if (!currentFullDatabase) currentFullDatabase = {};
          if (!currentFullDatabase.hero) currentFullDatabase.hero = {};
          currentFullDatabase.hero.profilePhoto = photoFromDb;
          currentFullDatabase.hero.photoUrl = photoFromDb;
        }

        populateFormFields();
        renderEducationList();
        renderAchievementsList();
        renderDatabaseProjectsList();
        renderDatabaseCertsList();
        renderTechnicalPaperCard();
        renderDatabaseSkillsCategories();
        renderDatabaseJsonViewer();
        loadSeoSettings();
        renderQueries();
        renderProfilePhotoPreview();
        updateAdminBadgesAndMetrics();
        console.log("Form updated with latest Supabase database content.");
      }
    }).catch((err) => {
      console.warn("Could not fetch remote content from Supabase:", err);
    });
  }
}

function populateFormFields() {
  fields.forEach((key) => {
    const input = document.getElementById(key);
    if (input) {
      input.value = currentContent[key] || "";
    }
  });

  // Populate contact phone and location from database if available
  if (currentFullDatabase?.contact) {
    const phoneInput = document.getElementById("contactPhone");
    if (phoneInput && !phoneInput.value && currentFullDatabase.contact.phone) {
      phoneInput.value = currentFullDatabase.contact.phone;
    }
    const locInput = document.getElementById("contactLocation");
    if (locInput && !locInput.value && currentFullDatabase.contact.location) {
      locInput.value = currentFullDatabase.contact.location;
    }
  }

  renderCustomSkills();
  renderCustomProjects();
  renderCustomPapers();
  renderCustomCertificates();
  renderCustomAboutDetails();
  renderAllPhotoThumbs();
  renderProfilePhotoPreview();

  const activeResume = currentContent.resume || getSavedResume();
  if (activeResume) {
    updateResumeUI(activeResume);
  }
}

// -------------------------------------------------------------
// TAB SWITCHING & ADMIN NAVIGATION
// -------------------------------------------------------------
window.switchAdminTab = function(tabId) {
  if (!tabId) tabId = "tab-overview";

  // Tab buttons
  const navBtns = document.querySelectorAll(".admin-tab-btn");
  navBtns.forEach(btn => {
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Tab content sections
  const contents = document.querySelectorAll(".admin-tab-content");
  contents.forEach(content => {
    if (content.id === tabId) {
      content.classList.add("active");
      content.style.display = "block";
    } else {
      content.classList.remove("active");
      content.style.display = "none";
    }
  });

  try {
    sessionStorage.setItem("adminActiveTab", tabId);
  } catch (e) {}

  // Context-specific renders
  if (tabId === "tab-database") {
    renderDatabaseJsonViewer();
  } else if (tabId === "tab-education") {
    renderEducationList();
  } else if (tabId === "tab-achievements") {
    renderAchievementsList();
  } else if (tabId === "tab-projects") {
    renderDatabaseProjectsList();
    renderCustomProjects();
  } else if (tabId === "tab-certs") {
    renderDatabaseCertsList();
    renderCustomCertificates();
  } else if (tabId === "tab-papers") {
    renderTechnicalPaperCard();
    renderCustomPapers();
  } else if (tabId === "tab-skills") {
    renderDatabaseSkillsCategories();
    renderCustomSkills();
  } else if (tabId === "tab-queries") {
    renderQueries();
  } else if (tabId === "tab-seo") {
    loadSeoSettings();
  } else if (tabId === "tab-overview") {
    updateAdminBadgesAndMetrics();
  }
};

// -------------------------------------------------------------
// ADMIN BADGES & METRICS UPDATER
// -------------------------------------------------------------
window.updateAdminBadgesAndMetrics = function() {
  const dbProjects = currentFullDatabase && Array.isArray(currentFullDatabase.projects) ? currentFullDatabase.projects.length : 0;
  const customProjects = Array.isArray(currentContent.customProjects) ? currentContent.customProjects.length : 0;
  const totalProjects = Math.max(dbProjects, customProjects);

  const dbCerts = currentFullDatabase && Array.isArray(currentFullDatabase.certifications) ? currentFullDatabase.certifications.length : 0;
  const customCerts = Array.isArray(currentContent.customCertificates) ? currentContent.customCertificates.length : 0;
  const totalCerts = Math.max(dbCerts, customCerts);

  const totalEdu = Array.isArray(currentEducation) ? currentEducation.length : 0;
  const totalAch = Array.isArray(currentAchievements) ? currentAchievements.length : 0;

  let totalSkillsInDb = 0;
  if (currentFullDatabase && Array.isArray(currentFullDatabase.skills)) {
    currentFullDatabase.skills.forEach(c => {
      if (Array.isArray(c.skills)) totalSkillsInDb += c.skills.length;
      else if (c.title || c.name) totalSkillsInDb += 1;
    });
  }
  const customSkillsCount = Array.isArray(currentContent.customSkills) ? currentContent.customSkills.length : 0;
  const totalSkills = Math.max(totalSkillsInDb, customSkillsCount);

  let totalPapers = 0;
  if (currentFullDatabase?.technicalPaper && currentFullDatabase.technicalPaper.title) {
    totalPapers = 1;
  }
  if (Array.isArray(currentFullDatabase?.technicalPapers) && currentFullDatabase.technicalPapers.length > 0) {
    totalPapers = Math.max(totalPapers, currentFullDatabase.technicalPapers.length);
  }
  if (Array.isArray(currentContent.customPapers) && currentContent.customPapers.length > 0) {
    totalPapers = Math.max(totalPapers, currentContent.customPapers.length);
  }

  let totalQueries = 0;
  try {
    const q = JSON.parse(localStorage.getItem("portfolioQueries") || "[]");
    totalQueries = q.length;
  } catch (e) {}
  if (currentFullDatabase && Array.isArray(currentFullDatabase.messages)) {
    totalQueries = Math.max(totalQueries, currentFullDatabase.messages.length);
  }

  // Update navbar badges
  const bEdu = document.getElementById("badgeEduCount"); if (bEdu) bEdu.textContent = totalEdu;
  const bAch = document.getElementById("badgeAchCount"); if (bAch) bAch.textContent = totalAch;
  const bProj = document.getElementById("badgeProjCount"); if (bProj) bProj.textContent = totalProjects;
  const bCert = document.getElementById("badgeCertCount"); if (bCert) bCert.textContent = totalCerts;
  const bPaper = document.getElementById("badgePaperCount"); if (bPaper) bPaper.textContent = totalPapers;
  const bSkill = document.getElementById("badgeSkillCount"); if (bSkill) bSkill.textContent = totalSkills;
  const bQuery = document.getElementById("badgeQueryCount"); if (bQuery) bQuery.textContent = totalQueries;

  // Update Overview Stat Cards
  const sEdu = document.getElementById("statEduCount"); if (sEdu) sEdu.textContent = totalEdu;
  const sAch = document.getElementById("statAchCount"); if (sAch) sAch.textContent = totalAch;
  const sProj = document.getElementById("statProjectsCount"); if (sProj) sProj.textContent = totalProjects;
  const sCert = document.getElementById("statCertsCount"); if (sCert) sCert.textContent = totalCerts;
  const sPaper = document.getElementById("statPapersCount"); if (sPaper) sPaper.textContent = totalPapers;
  const sSkill = document.getElementById("statSkillsCount"); if (sSkill) sSkill.textContent = totalSkills;
  const sQuery = document.getElementById("statQueriesCount"); if (sQuery) sQuery.textContent = totalQueries;

  // Update database section badges
  const dbSkBadge = document.getElementById("badgeDbSkillsCount"); if (dbSkBadge) dbSkBadge.textContent = `${totalSkills} In Database`;
  const dbPrBadge = document.getElementById("badgeDbProjectsCount"); if (dbPrBadge) dbPrBadge.textContent = `${totalProjects} In Database`;
  const dbCrBadge = document.getElementById("badgeDbCertsCount"); if (dbCrBadge) dbCrBadge.textContent = `${totalCerts} In Database`;
  const dbPpBadge = document.getElementById("badgeDbPapersCount"); if (dbPpBadge) dbPpBadge.textContent = `${totalPapers} In Database`;

  const lastSync = document.getElementById("overviewLastSyncTime");
  if (lastSync) {
    lastSync.textContent = "Last Synced: " + (window._lastSupabaseUpdatedAt ? new Date(window._lastSupabaseUpdatedAt).toLocaleTimeString() : "Live Active");
  }
};

// -------------------------------------------------------------
// EDUCATION RECORDS MANAGEMENT
// -------------------------------------------------------------
window.renderEducationList = function() {
  const container = document.getElementById("adminEducationList");
  if (!container) return;

  if (!currentEducation || currentEducation.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <p style="font-size: 0.95rem; font-weight: 600;">No academic records found in database.</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Click "+ Add Academic Record" above to add degrees, high school, or certificates.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = currentEducation.map((edu, idx) => `
    <div class="card" style="border: 1px solid rgba(251, 191, 36, 0.25); background: var(--bg-card); padding: 18px; margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.1rem;">🎓</span>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin: 0;">Record #${idx + 1}: ${escapeHTML(edu.degree || "Academic Degree")}</h4>
            <span style="font-size: 0.775rem; color: #FBBF24; font-weight: 600;">${escapeHTML(edu.institution || "Institution")}</span>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="btn btn-primary btn-sm" onclick="saveEducationItem('${edu.id}')" title="Save edits to this education record">
            Save
          </button>
          <button type="button" class="btn-delete" onclick="deleteEducation('${edu.id}')" title="Delete record from database">
            Delete
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.775rem;">Degree / Certificate</label>
          <input type="text" id="eduDegree_${edu.id}" class="form-input" value="${escapeHTML(edu.degree || '')}" />
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.775rem;">Institution / College</label>
          <input type="text" id="eduInst_${edu.id}" class="form-input" value="${escapeHTML(edu.institution || '')}" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 10px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.775rem;">Year / Duration</label>
          <input type="text" id="eduYear_${edu.id}" class="form-input" value="${escapeHTML(edu.year || '')}" />
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.775rem;">Score / CGPA / %</label>
          <input type="text" id="eduScore_${edu.id}" class="form-input" value="${escapeHTML(edu.score || '')}" />
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.775rem;">Location</label>
          <input type="text" id="eduLoc_${edu.id}" class="form-input" value="${escapeHTML(edu.location || '')}" />
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Coursework & Details</label>
        <textarea id="eduDetails_${edu.id}" class="form-textarea" style="min-height: 55px;">${escapeHTML(edu.details || '')}</textarea>
      </div>
    </div>
  `).join("");
};

window.saveEducationItem = function(id) {
  const item = currentEducation.find(e => e.id === id);
  if (!item) return;

  const d = document.getElementById("eduDegree_" + id); if (d) item.degree = d.value.trim();
  const i = document.getElementById("eduInst_" + id); if (i) item.institution = i.value.trim();
  const y = document.getElementById("eduYear_" + id); if (y) item.year = y.value.trim();
  const s = document.getElementById("eduScore_" + id); if (s) item.score = s.value.trim();
  const l = document.getElementById("eduLoc_" + id); if (l) item.location = l.value.trim();
  const det = document.getElementById("eduDetails_" + id); if (det) item.details = det.value.trim();

  saveContentToStorage(currentContent, { education: currentEducation });
  renderEducationList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("Academic record updated & saved to Supabase!");
};

window.submitNewEducation = function() {
  const deg = (document.getElementById("newEduDegree")?.value || "").trim();
  const inst = (document.getElementById("newEduInstitution")?.value || "").trim();
  const year = (document.getElementById("newEduYear")?.value || "").trim();
  const score = (document.getElementById("newEduScore")?.value || "").trim();
  const loc = (document.getElementById("newEduLocation")?.value || "").trim();
  const details = (document.getElementById("newEduDetails")?.value || "").trim();

  if (!deg && !inst) {
    alert("Please provide at least a Degree name or Institution.");
    return;
  }

  const newEdu = {
    id: "edu-" + Date.now(),
    degree: deg || "Engineering Milestone",
    institution: inst || "Institution",
    year: year || "2024 - Present",
    score: score || "Distinction",
    location: loc || "Karnataka, India",
    details: details || "Relevant engineering coursework and laboratory practicals."
  };

  currentEducation.push(newEdu);
  saveContentToStorage(currentContent, { education: currentEducation });

  ["newEduDegree", "newEduInstitution", "newEduYear", "newEduScore", "newEduLocation", "newEduDetails"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  toggleAddBox("addEducationBox");

  renderEducationList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("New education record added & synced with Supabase!");
};

window.deleteEducation = function(id) {
  if (confirm("Are you sure you want to delete this educational record from your database?")) {
    currentEducation = currentEducation.filter(e => e.id !== id);
    saveContentToStorage(currentContent, { education: currentEducation });
    renderEducationList();
    updateAdminBadgesAndMetrics();
    renderDatabaseJsonViewer();
    showToast("Education record deleted.");
  }
};

// -------------------------------------------------------------
// ACHIEVEMENTS & HACKATHONS MANAGEMENT
// -------------------------------------------------------------
window.renderAchievementsList = function() {
  const container = document.getElementById("adminAchievementsList");
  if (!container) return;

  if (!currentAchievements || currentAchievements.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <p style="font-size: 0.95rem; font-weight: 600;">No achievements found in database.</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Click "+ Add Achievement" above to add competitions, symposiums, or awards.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = currentAchievements.map((ach, idx) => `
    <div class="card" style="border: 1px solid rgba(167, 139, 250, 0.25); background: var(--bg-card); padding: 18px; margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.1rem;">🎖️</span>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin: 0;">Achievement #${idx + 1}: ${escapeHTML(ach.title || "Award")}</h4>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="btn btn-primary btn-sm" onclick="saveAchievementItem('${ach.id}')" title="Save edits to this achievement">
            Save
          </button>
          <button type="button" class="btn-delete" onclick="deleteAchievement('${ach.id}')" title="Delete achievement from database">
            Delete
          </button>
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 10px;">
        <label class="form-label" style="font-size: 0.775rem;">Event / Award Title</label>
        <input type="text" id="achTitle_${ach.id}" class="form-input" value="${escapeHTML(ach.title || '')}" />
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Description & Recognition Summary</label>
        <textarea id="achDesc_${ach.id}" class="form-textarea" style="min-height: 70px;">${escapeHTML(ach.description || '')}</textarea>
      </div>
    </div>
  `).join("");
};

window.saveAchievementItem = function(id) {
  const item = currentAchievements.find(a => a.id === id);
  if (!item) return;

  const t = document.getElementById("achTitle_" + id); if (t) item.title = t.value.trim();
  const desc = document.getElementById("achDesc_" + id); if (desc) item.description = desc.value.trim();

  saveContentToStorage(currentContent, { achievements: currentAchievements });
  renderAchievementsList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("Achievement updated & saved to Supabase!");
};

window.submitNewAchievement = function() {
  const title = (document.getElementById("newAchTitle")?.value || "").trim();
  const desc = (document.getElementById("newAchDesc")?.value || "").trim();

  if (!title) {
    alert("Please provide an Event or Award Title.");
    return;
  }

  const newAch = {
    id: "ach-" + Date.now(),
    title: title,
    description: desc || "Award of technical excellence.",
    isSample: false
  };

  currentAchievements.push(newAch);
  saveContentToStorage(currentContent, { achievements: currentAchievements });

  const tEl = document.getElementById("newAchTitle"); if (tEl) tEl.value = "";
  const dEl = document.getElementById("newAchDesc"); if (dEl) dEl.value = "";
  toggleAddBox("addAchievementBox");

  renderAchievementsList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("New achievement added & synced with Supabase!");
};

window.deleteAchievement = function(id) {
  if (confirm("Are you sure you want to delete this achievement from your database?")) {
    currentAchievements = currentAchievements.filter(a => a.id !== id);
    saveContentToStorage(currentContent, { achievements: currentAchievements });
    renderAchievementsList();
    updateAdminBadgesAndMetrics();
    renderDatabaseJsonViewer();
    showToast("Achievement deleted.");
  }
};

// -------------------------------------------------------------
// LIVE DATABASE RAW JSON EXPLORER
// -------------------------------------------------------------
window.renderDatabaseJsonViewer = function() {
  const viewer = document.getElementById("databaseJsonViewer");
  const editor = document.getElementById("databaseJsonEditor");
  if (!viewer) return;

  const dbData = currentFullDatabase ? { ...currentFullDatabase } : {};
  dbData.portfolioContent = { ...currentContent };
  dbData.education = [...currentEducation];
  dbData.achievements = [...currentAchievements];

  const jsonStr = JSON.stringify(dbData, null, 2);
  viewer.textContent = jsonStr;
  if (editor && !editor.dataset.userEditing) {
    editor.value = jsonStr;
  }
};

window.filterDatabaseJson = function(term) {
  const viewer = document.getElementById("databaseJsonViewer");
  if (!viewer) return;
  const q = String(term || "").trim().toLowerCase();
  const dbData = currentFullDatabase ? { ...currentFullDatabase } : {};
  dbData.portfolioContent = { ...currentContent };
  dbData.education = [...currentEducation];
  dbData.achievements = [...currentAchievements];
  const fullJson = JSON.stringify(dbData, null, 2);

  if (!q) {
    viewer.textContent = fullJson;
    return;
  }

  const lines = fullJson.split("\n");
  const matchingLines = lines.filter(l => l.toLowerCase().includes(q));
  viewer.textContent = matchingLines.length > 0
    ? `// Showing ${matchingLines.length} line(s) matching "${term}":\n\n` + matchingLines.join("\n")
    : `// No keys or values matched query "${term}".\n\n` + fullJson;
};

window.copyDatabaseJsonToClipboard = function() {
  const viewer = document.getElementById("databaseJsonViewer");
  const text = viewer ? viewer.textContent : "";
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Database JSON copied to clipboard!");
  }).catch(() => {
    showToast("Copied to clipboard.");
  });
};

window.downloadDatabaseBackupJson = function() {
  const dbData = currentFullDatabase ? { ...currentFullDatabase } : {};
  dbData.portfolioContent = { ...currentContent };
  dbData.education = [...currentEducation];
  dbData.achievements = [...currentAchievements];
  const blob = new Blob([JSON.stringify(dbData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Naveena_Portfolio_Supabase_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Database backup downloaded successfully!");
};

window.toggleDatabaseJsonEditMode = function() {
  const container = document.getElementById("databaseJsonEditContainer");
  const viewer = document.getElementById("databaseJsonViewer");
  const searchBox = document.getElementById("jsonSearchFilterBox");
  const btn = document.getElementById("toggleJsonEditBtn");

  if (!container) return;
  const isEditing = container.style.display !== "none";

  if (isEditing) {
    container.style.display = "none";
    if (viewer) viewer.style.display = "block";
    if (searchBox) searchBox.style.display = "block";
    if (btn) btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit Raw JSON';
  } else {
    container.style.display = "block";
    if (viewer) viewer.style.display = "none";
    if (searchBox) searchBox.style.display = "none";
    renderDatabaseJsonViewer();
    const editor = document.getElementById("databaseJsonEditor");
    if (editor) {
      editor.dataset.userEditing = "true";
      editor.focus();
    }
    if (btn) btn.innerHTML = '✕ Close Editor';
  }
};

window.cancelDatabaseJsonEdit = function() {
  const editor = document.getElementById("databaseJsonEditor");
  if (editor) delete editor.dataset.userEditing;
  toggleDatabaseJsonEditMode();
};

window.saveEditedDatabaseJson = async function() {
  const editor = document.getElementById("databaseJsonEditor");
  const statusEl = document.getElementById("jsonEditorStatus");
  if (!editor) return;

  let parsed = null;
  try {
    parsed = JSON.parse(editor.value);
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = "Syntax Error: " + err.message;
      statusEl.style.color = "#EF4444";
    }
    alert("Invalid JSON: " + err.message);
    return;
  }

  if (statusEl) {
    statusEl.textContent = "Saving to Supabase...";
    statusEl.style.color = "#60A5FA";
  }

  showToast("Saving full JSON to Supabase database...");
  if (typeof window.saveFullSupabaseDatabase === "function") {
    const res = await window.saveFullSupabaseDatabase(parsed);
    if (res && res.success) {
      currentFullDatabase = parsed;
      if (Array.isArray(parsed.education)) currentEducation = parsed.education;
      if (Array.isArray(parsed.achievements)) currentAchievements = parsed.achievements;
      if (parsed.portfolioContent) currentContent = { ...currentContent, ...parsed.portfolioContent };

      saveContentToStorage(currentContent, { education: currentEducation, achievements: currentAchievements });
      populateFormFields();
      renderEducationList();
      renderAchievementsList();
      renderDatabaseJsonViewer();
      updateAdminBadgesAndMetrics();
      toggleDatabaseJsonEditMode();
      showToast("Full database JSON saved to Supabase successfully!");
    } else {
      showToast("Supabase error: " + (res?.error || "Unknown"));
    }
  }
};

window.syncWithSupabaseNow = async function() {
  showToast("Syncing with Supabase database...");
  if (typeof window.fetchSupabasePortfolioData === "function") {
    try {
      const res = await window.fetchSupabasePortfolioData();
      if (res) {
        if (res.fullData) {
          currentFullDatabase = res.fullData;
          if (Array.isArray(res.fullData.education) && res.fullData.education.length > 0) {
            currentEducation = res.fullData.education;
            try { localStorage.setItem("portfolioEducation", JSON.stringify(currentEducation)); } catch (e) {}
          }
          if (Array.isArray(res.fullData.achievements) && res.fullData.achievements.length > 0) {
            currentAchievements = res.fullData.achievements;
            try { localStorage.setItem("portfolioAchievements", JSON.stringify(currentAchievements)); } catch (e) {}
          }
        }
        if (res.portfolioContent) {
          currentContent = { ...currentContent, ...res.portfolioContent };
        }
        populateFormFields();
        renderEducationList();
        renderAchievementsList();
        renderDatabaseProjectsList();
        renderDatabaseCertsList();
        renderTechnicalPaperCard();
        renderDatabaseSkillsCategories();
        renderDatabaseJsonViewer();
        updateAdminBadgesAndMetrics();
        renderQueries();
        showToast("Synchronized with Supabase! All fields up to date.");
        return;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  showToast("Connected to Supabase.");
};

// -------------------------------------------------------------
// LIVE DATABASE PROJECTS MANAGEMENT (Supabase data.projects)
// -------------------------------------------------------------
window.renderDatabaseProjectsList = function() {
  const container = document.getElementById("adminDatabaseProjectsList");
  if (!container) return;

  const projects = currentFullDatabase && Array.isArray(currentFullDatabase.projects)
    ? currentFullDatabase.projects
    : [];

  if (projects.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <p style="font-size: 0.95rem; font-weight: 600;">No projects currently stored in Supabase database table.</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Click "+ Add New Project" above to create and publish projects directly to your database.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map((p, idx) => {
    const techStr = Array.isArray(p.technologies) ? p.technologies.join(", ") : (p.technologies || "");
    const photos = Array.isArray(p.photos) ? p.photos.slice(0, 4) : [];
    return `
      <div class="card" style="border: 1px solid rgba(69, 137, 255, 0.35); background: var(--bg-card); padding: 18px; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.15rem;">🚀</span>
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin: 0;">DB Project #${idx + 1}: ${escapeHTML(p.title || "Hardware Project")}</h4>
              <span style="font-size: 0.75rem; color: #60A5FA; font-weight: 600;">ID: ${escapeHTML(p.id)}</span>
            </div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            ${p.link ? `
              <a href="${escapeHTML(p.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px; text-decoration: none;" title="Open GitHub/Simulation link">
                🔗 Open Link
              </a>
            ` : ''}
            <button type="button" class="btn btn-primary btn-sm" onclick="saveDatabaseProject('${p.id}')" title="Save changes directly to Supabase database">
              Save to DB
            </button>
            <button type="button" class="btn-delete" onclick="deleteDatabaseProject('${p.id}')" title="Delete project from database">
              Delete
            </button>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.775rem;">Project Title</label>
          <input type="text" id="dbProjTitle_${p.id}" class="form-input" value="${escapeHTML(p.title || '')}" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.775rem;">GitHub / Simulation / Repo Link</label>
            <input type="url" id="dbProjLink_${p.id}" class="form-input" value="${escapeHTML(p.link || '')}" placeholder="https://github.com/..." />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.775rem;">Technologies & Tools (comma-separated)</label>
            <input type="text" id="dbProjTech_${p.id}" class="form-input" value="${escapeHTML(techStr)}" placeholder="Verilog HDL, Xilinx Vivado, FPGA..." />
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.775rem;">Detailed Technical Description & RTL Specifications</label>
          <textarea id="dbProjDesc_${p.id}" class="form-textarea" style="min-height: 70px;">${escapeHTML(p.description || '')}</textarea>
        </div>

        <!-- 4-Photo Uploader for Database Project -->
        <div class="admin-photo-uploader" style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <span style="font-size: 0.8rem; font-weight: 600; color: #93C5FD; display: flex; align-items: center; gap: 5px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              Project Photos (${photos.length}/4)
            </span>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="triggerFileInput('dbProjPhotoInput_${p.id}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                + Upload Photo
              </button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px;" onclick="promptDbProjectPhotoUrl('${p.id}')">
                🔗 Add URL
              </button>
            </div>
          </div>
          <input type="file" id="dbProjPhotoInput_${p.id}" accept="image/*" style="display: none;" onchange="handleDbProjectPhotoUpload('${p.id}', event)" />
          <div class="admin-photo-thumbs-list" id="dbProjPhotoThumbs_${p.id}">
            ${photos.length === 0 ? `<span style="font-size: 0.72rem; color: #94A3B8; font-style: italic;">No photos yet. Click "+ Upload Photo" or "🔗 Add URL" (up to 4 photos).</span>` : ''}
            ${photos.map((src, pIdx) => `
              <div class="admin-photo-item">
                <img src="${src}" alt="Project Photo ${pIdx + 1}" />
                <button type="button" class="admin-photo-remove-btn" onclick="removeDbProjectPhoto('${p.id}', ${pIdx})" title="Remove photo">✕</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
};

window.handleDbProjectPhotoUpload = async function(id, event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  if (!currentFullDatabase) currentFullDatabase = {};
  if (!Array.isArray(currentFullDatabase.projects)) {
    currentFullDatabase.projects = Array.isArray(currentContent.customProjects) ? [...currentContent.customProjects] : [];
  }

  let proj = currentFullDatabase.projects.find(p => p.id === id);
  if (!proj && Array.isArray(currentContent.customProjects)) {
    proj = currentContent.customProjects.find(p => p.id === id);
    if (proj) currentFullDatabase.projects.push(proj);
  }
  if (!proj) {
    showToast("Project not found in database.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }
  if (!Array.isArray(proj.photos)) proj.photos = [];

  if (proj.photos.length >= 4) {
    showToast("Maximum 4 photos allowed for this project. Remove one first.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }

  showToast(`Uploading photo for ${proj.title || "project"}...`);
  try {
    const dataUrl = await compressImageFile(file, 640, 480, 0.72);
    proj.photos.push(dataUrl);

    // Keep currentContent in sync
    if (Array.isArray(currentContent.customProjects)) {
      const cp = currentContent.customProjects.find(p => p.id === id || (p.title || "").toLowerCase() === (proj.title || "").toLowerCase());
      if (cp) cp.photos = [...proj.photos];
    }
    if (Array.isArray(currentContent.projects)) {
      const cp = currentContent.projects.find(p => p.id === id || (p.title || "").toLowerCase() === (proj.title || "").toLowerCase());
      if (cp) cp.photos = [...proj.photos];
    }

    saveContentToStorage(currentContent, { projects: currentFullDatabase.projects });
    renderDatabaseProjectsList();
    showToast(`Photo added (${proj.photos.length}/4)! Saved to database.`);
  } catch (err) {
    console.error("Project photo upload error:", err);
    showToast("Upload failed: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.promptDbProjectPhotoUrl = function(id) {
  const proj = currentFullDatabase?.projects?.find(p => p.id === id);
  if (!proj) return;
  if (!Array.isArray(proj.photos)) proj.photos = [];

  if (proj.photos.length >= 4) {
    showToast("Maximum 4 photos allowed for this project.", "error");
    return;
  }

  const url = prompt("Enter public image URL for this project (up to 4 photos):");
  if (!url || !url.trim()) return;

  proj.photos.push(url.trim());

  if (Array.isArray(currentContent.customProjects)) {
    const cp = currentContent.customProjects.find(p => p.id === id || (p.title || "").toLowerCase() === (proj.title || "").toLowerCase());
    if (cp) cp.photos = [...proj.photos];
  }
  if (Array.isArray(currentContent.projects)) {
    const cp = currentContent.projects.find(p => p.id === id || (p.title || "").toLowerCase() === (proj.title || "").toLowerCase());
    if (cp) cp.photos = [...proj.photos];
  }

  saveContentToStorage(currentContent, { projects: currentFullDatabase.projects });
  renderDatabaseProjectsList();
  showToast(`Photo added (${proj.photos.length}/4)! Saved to database.`);
};

window.removeDbProjectPhoto = function(id, photoIdx) {
  const proj = currentFullDatabase?.projects?.find(p => p.id === id);
  if (!proj || !Array.isArray(proj.photos)) return;

  proj.photos.splice(photoIdx, 1);

  if (Array.isArray(currentContent.customProjects)) {
    const cp = currentContent.customProjects.find(p => p.id === id || (p.title || "").toLowerCase() === (proj.title || "").toLowerCase());
    if (cp) cp.photos = [...proj.photos];
  }
  if (Array.isArray(currentContent.projects)) {
    const cp = currentContent.projects.find(p => p.id === id || (p.title || "").toLowerCase() === (proj.title || "").toLowerCase());
    if (cp) cp.photos = [...proj.photos];
  }

  saveContentToStorage(currentContent, { projects: currentFullDatabase.projects });
  renderDatabaseProjectsList();
  showToast("Photo removed from project.");
};

window.saveDatabaseProject = function(id) {
  if (!currentFullDatabase || !Array.isArray(currentFullDatabase.projects)) return;
  const proj = currentFullDatabase.projects.find(p => p.id === id);
  if (!proj) return;

  const tEl = document.getElementById("dbProjTitle_" + id); if (tEl) proj.title = tEl.value.trim();
  const lEl = document.getElementById("dbProjLink_" + id); if (lEl) proj.link = lEl.value.trim();
  const dEl = document.getElementById("dbProjDesc_" + id); if (dEl) proj.description = dEl.value.trim();
  const techEl = document.getElementById("dbProjTech_" + id);
  if (techEl) {
    proj.technologies = techEl.value.split(",").map(s => s.trim()).filter(Boolean);
  }

  saveContentToStorage(currentContent, { projects: currentFullDatabase.projects });
  renderDatabaseProjectsList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("Project saved to Supabase database!");
};

window.deleteDatabaseProject = function(id) {
  if (confirm("Are you sure you want to delete this project from your Supabase database?")) {
    if (!currentFullDatabase || !Array.isArray(currentFullDatabase.projects)) return;
    currentFullDatabase.projects = currentFullDatabase.projects.filter(p => p.id !== id);
    if (Array.isArray(currentContent.customProjects)) {
      currentContent.customProjects = currentContent.customProjects.filter(p => p.id !== id);
    }
    saveContentToStorage(currentContent, { projects: currentFullDatabase.projects });
    renderDatabaseProjectsList();
    updateAdminBadgesAndMetrics();
    renderDatabaseJsonViewer();
    showToast("Project removed from database.");
  }
};

// -------------------------------------------------------------
// LIVE DATABASE CERTIFICATIONS MANAGEMENT (Supabase data.certifications)
// -------------------------------------------------------------
window.renderDatabaseCertsList = function() {
  const container = document.getElementById("adminDatabaseCertsList");
  if (!container) return;

  const certs = currentFullDatabase && Array.isArray(currentFullDatabase.certifications)
    ? currentFullDatabase.certifications
    : [];

  if (certs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <p style="font-size: 0.95rem; font-weight: 600;">No certifications currently stored in Supabase database table.</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Click "+ Add New Certificate" above to create and push a certificate to your database.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = certs.map((c, idx) => {
    const photos = Array.isArray(c.photos) ? c.photos.slice(0, 4) : [];
    return `
      <div class="card" style="border: 1px solid rgba(16, 185, 129, 0.35); background: var(--bg-card); padding: 18px; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.15rem;">🏆</span>
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin: 0;">DB Certificate #${idx + 1}: ${escapeHTML(c.name || "Credential")}</h4>
              <span style="font-size: 0.75rem; color: #34D399; font-weight: 600;">${escapeHTML(c.organization || "Issuing Body")}</span>
            </div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            ${c.url ? `
              <a href="${escapeHTML(c.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px; text-decoration: none;" title="Open Google Drive verification document">
                📄 Drive File
              </a>
            ` : ''}
            <button type="button" class="btn btn-primary btn-sm" onclick="saveDatabaseCert('${c.id}')" title="Save edits to Supabase database">
              Save to DB
            </button>
            <button type="button" class="btn-delete" onclick="deleteDatabaseCert('${c.id}')" title="Delete certificate from database">
              Delete
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.775rem;">Certificate / Competition Name</label>
            <input type="text" id="dbCertName_${c.id}" class="form-input" value="${escapeHTML(c.name || '')}" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.775rem;">Organization / University / Institute</label>
            <input type="text" id="dbCertOrg_${c.id}" class="form-input" value="${escapeHTML(c.organization || '')}" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px; margin-bottom: 10px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.775rem;">Issue Date (DD/MM/YYYY)</label>
            <input type="text" id="dbCertDate_${c.id}" class="form-input" value="${escapeHTML(c.date || '')}" placeholder="DD/MM/YYYY" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 0.775rem;">Google Drive / Credential URL</label>
            <input type="url" id="dbCertUrl_${c.id}" class="form-input" value="${escapeHTML(c.url || '')}" placeholder="https://drive.google.com/..." />
          </div>
        </div>

        <!-- 4-Photo Uploader for Database Certificate -->
        <div class="admin-photo-uploader" style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <span style="font-size: 0.8rem; font-weight: 600; color: #6EE7B7; display: flex; align-items: center; gap: 5px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              Certificate Photos (${photos.length}/4)
            </span>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="triggerFileInput('dbCertPhotoInput_${c.id}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                + Upload Photo
              </button>
              <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px;" onclick="promptDbCertPhotoUrl('${c.id}')">
                🔗 Add URL
              </button>
            </div>
          </div>
          <input type="file" id="dbCertPhotoInput_${c.id}" accept="image/*" style="display: none;" onchange="handleDbCertPhotoUpload('${c.id}', event)" />
          <div class="admin-photo-thumbs-list" id="dbCertPhotoThumbs_${c.id}">
            ${photos.length === 0 ? `<span style="font-size: 0.72rem; color: #94A3B8; font-style: italic;">No photos yet. Click "+ Upload Photo" or "🔗 Add URL" (up to 4 photos).</span>` : ''}
            ${photos.map((src, pIdx) => `
              <div class="admin-photo-item">
                <img src="${src}" alt="Certificate Photo ${pIdx + 1}" />
                <button type="button" class="admin-photo-remove-btn" onclick="removeDbCertPhoto('${c.id}', ${pIdx})" title="Remove photo">✕</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
};

window.handleDbCertPhotoUpload = async function(id, event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  if (!currentFullDatabase) currentFullDatabase = {};
  if (!Array.isArray(currentFullDatabase.certifications)) {
    currentFullDatabase.certifications = Array.isArray(currentContent.customCertificates) ? [...currentContent.customCertificates] : [];
  }

  let cert = currentFullDatabase.certifications.find(c => c.id === id);
  if (!cert && Array.isArray(currentContent.customCertificates)) {
    cert = currentContent.customCertificates.find(c => c.id === id);
    if (cert) currentFullDatabase.certifications.push(cert);
  }
  if (!cert) {
    showToast("Certificate not found in database.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }
  if (!Array.isArray(cert.photos)) cert.photos = [];

  if (cert.photos.length >= 4) {
    showToast("Maximum 4 photos allowed for this certificate. Remove one first.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }

  showToast(`Uploading photo for ${cert.name || cert.title || "certificate"}...`);
  try {
    const dataUrl = await compressImageFile(file, 640, 480, 0.72);
    cert.photos.push(dataUrl);

    if (Array.isArray(currentContent.customCertificates)) {
      const cc = currentContent.customCertificates.find(c => c.id === id || (c.title || c.name || "").toLowerCase() === (cert.name || cert.title || "").toLowerCase());
      if (cc) cc.photos = [...cert.photos];
    }
    if (Array.isArray(currentContent.certifications)) {
      const cc = currentContent.certifications.find(c => c.id === id || (c.title || c.name || "").toLowerCase() === (cert.name || cert.title || "").toLowerCase());
      if (cc) cc.photos = [...cert.photos];
    }

    saveContentToStorage(currentContent, { certifications: currentFullDatabase.certifications });
    renderDatabaseCertsList();
    showToast(`Photo added (${cert.photos.length}/4)! Saved to database.`);
  } catch (err) {
    console.error("Certificate photo upload error:", err);
    showToast("Upload failed: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.promptDbCertPhotoUrl = function(id) {
  const cert = currentFullDatabase?.certifications?.find(c => c.id === id);
  if (!cert) return;
  if (!Array.isArray(cert.photos)) cert.photos = [];

  if (cert.photos.length >= 4) {
    showToast("Maximum 4 photos allowed for this certificate.", "error");
    return;
  }

  const url = prompt("Enter public image URL for this certificate (up to 4 photos):");
  if (!url || !url.trim()) return;

  cert.photos.push(url.trim());

  if (Array.isArray(currentContent.customCertificates)) {
    const cc = currentContent.customCertificates.find(c => c.id === id || (c.title || c.name || "").toLowerCase() === (cert.name || cert.title || "").toLowerCase());
    if (cc) cc.photos = [...cert.photos];
  }
  if (Array.isArray(currentContent.certifications)) {
    const cc = currentContent.certifications.find(c => c.id === id || (c.title || c.name || "").toLowerCase() === (cert.name || cert.title || "").toLowerCase());
    if (cc) cc.photos = [...cert.photos];
  }

  saveContentToStorage(currentContent, { certifications: currentFullDatabase.certifications });
  renderDatabaseCertsList();
  showToast(`Photo added (${cert.photos.length}/4)! Saved to database.`);
};

window.removeDbCertPhoto = function(id, photoIdx) {
  const cert = currentFullDatabase?.certifications?.find(c => c.id === id);
  if (!cert || !Array.isArray(cert.photos)) return;

  cert.photos.splice(photoIdx, 1);

  if (Array.isArray(currentContent.customCertificates)) {
    const cc = currentContent.customCertificates.find(c => c.id === id || (c.title || c.name || "").toLowerCase() === (cert.name || cert.title || "").toLowerCase());
    if (cc) cc.photos = [...cert.photos];
  }
  if (Array.isArray(currentContent.certifications)) {
    const cc = currentContent.certifications.find(c => c.id === id || (c.title || c.name || "").toLowerCase() === (cert.name || cert.title || "").toLowerCase());
    if (cc) cc.photos = [...cert.photos];
  }

  saveContentToStorage(currentContent, { certifications: currentFullDatabase.certifications });
  renderDatabaseCertsList();
  showToast("Photo removed from certificate.");
};

window.saveDatabaseCert = function(id) {
  if (!currentFullDatabase || !Array.isArray(currentFullDatabase.certifications)) return;
  const cert = currentFullDatabase.certifications.find(c => c.id === id);
  if (!cert) return;

  const nEl = document.getElementById("dbCertName_" + id); if (nEl) cert.name = nEl.value.trim();
  const oEl = document.getElementById("dbCertOrg_" + id); if (oEl) cert.organization = oEl.value.trim();
  const dEl = document.getElementById("dbCertDate_" + id); if (dEl) cert.date = dEl.value.trim();
  const uEl = document.getElementById("dbCertUrl_" + id); if (uEl) cert.url = uEl.value.trim();

  saveContentToStorage(currentContent, { certifications: currentFullDatabase.certifications });
  renderDatabaseCertsList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("Certificate saved to Supabase database!");
};

window.deleteDatabaseCert = function(id) {
  if (confirm("Are you sure you want to delete this certificate from your database?")) {
    if (!currentFullDatabase || !Array.isArray(currentFullDatabase.certifications)) return;
    currentFullDatabase.certifications = currentFullDatabase.certifications.filter(c => c.id !== id);
    if (Array.isArray(currentContent.customCertificates)) {
      currentContent.customCertificates = currentContent.customCertificates.filter(c => c.id !== id);
    }
    saveContentToStorage(currentContent, { certifications: currentFullDatabase.certifications });
    renderDatabaseCertsList();
    updateAdminBadgesAndMetrics();
    renderDatabaseJsonViewer();
    showToast("Certificate removed from database.");
  }
};

// -------------------------------------------------------------
// LIVE DATABASE TECHNICAL PAPER (Supabase data.technicalPaper)
// -------------------------------------------------------------
window.renderTechnicalPaperCard = function() {
  const container = document.getElementById("adminDatabasePaperContainer");
  if (!container) return;

  const paper = (currentFullDatabase && currentFullDatabase.technicalPaper && currentFullDatabase.technicalPaper.title)
    ? currentFullDatabase.technicalPaper
    : (currentContent && currentContent.technicalPaper && currentContent.technicalPaper.title ? currentContent.technicalPaper : null);

  if (!paper || !paper.title) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">📑</div>
        <h4 style="font-size: 1.05rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">No Technical Papers in Database</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">All technical papers have been permanently cleared. Click "+ Add New Paper" above to publish a paper.</p>
        <button type="button" class="btn btn-primary btn-sm" onclick="toggleAddBox('addPaperBox')">
          + Add New Paper
        </button>
      </div>
    `;
    return;
  }

  const photos = Array.isArray(paper.photos) ? paper.photos.slice(0, 4) : [];

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.25rem;">📑</span>
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; color: #FFFFFF; margin: 0;">${escapeHTML(paper.title || "Technical Paper")}</h4>
          <span style="font-size: 0.775rem; color: #F472B6; font-weight: 600;">${escapeHTML(paper.event || "Conference Event")} • ${escapeHTML(paper.result || "Award")}</span>
        </div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        ${paper.link ? `
          <a href="${escapeHTML(paper.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 4px 10px; text-decoration: none;">
            📄 View Drive Document
          </a>
        ` : ""}
        <button type="button" class="btn btn-primary btn-sm" onclick="saveTechnicalPaperToDb()">
          Save Paper to DB
        </button>
        <button type="button" class="btn-delete" onclick="deleteDatabasePaper()" title="Permanently delete paper from database">
          Delete Paper
        </button>
      </div>
    </div>

    <div class="form-group" style="margin-bottom: 10px;">
      <label class="form-label" style="font-size: 0.775rem;">Technical Paper Title</label>
      <input type="text" id="dbPaperTitle" class="form-input" value="${escapeHTML(paper.title || "")}" />
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Event</label>
        <input type="text" id="dbPaperEvent" class="form-input" value="${escapeHTML(paper.event || "")}" />
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Award won / Result</label>
        <input type="text" id="dbPaperResult" class="form-input" value="${escapeHTML(paper.result || "")}" />
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Host Institution / University</label>
        <input type="text" id="dbPaperInst" class="form-input" value="${escapeHTML(paper.institution || "")}" />
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Conference / Event Date</label>
        <input type="text" id="dbPaperDate" class="form-input" value="${escapeHTML(paper.date || "")}" />
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Tagline / Motto</label>
        <input type="text" id="dbPaperTagline" class="form-input" value="${escapeHTML(paper.tagline || "")}" />
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label" style="font-size: 0.775rem;">Google Drive Link to Full Paper / Certificate</label>
        <input type="url" id="dbPaperLink" class="form-input" value="${escapeHTML(paper.link || "")}" />
      </div>
    </div>

    <div class="form-group" style="margin-bottom: 10px;">
      <label class="form-label" style="font-size: 0.775rem;">Abstract / System Description</label>
      <textarea id="dbPaperDesc" class="form-textarea" style="min-height: 80px;">${escapeHTML(paper.description || "")}</textarea>
    </div>

    <!-- 4-Photo Uploader for Technical Paper -->
    <div class="admin-photo-uploader" style="margin-top: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
        <span style="font-size: 0.8rem; font-weight: 600; color: #F472B6; display: flex; align-items: center; gap: 5px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          Presentation & Certificate Photos (${photos.length}/4)
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="triggerFileInput('dbPaperPhotoInput')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            + Upload Photo
          </button>
          <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 3px 8px;" onclick="promptDbPaperPhotoUrl()">
            🔗 Add URL
          </button>
        </div>
      </div>
      <input type="file" id="dbPaperPhotoInput" accept="image/*" style="display: none;" onchange="handleDbPaperPhotoUpload(event)" />
      <div class="admin-photo-thumbs-list" id="dbPaperPhotoThumbs">
        ${photos.length === 0 ? `<span style="font-size: 0.72rem; color: #94A3B8; font-style: italic;">No photos yet. Click "+ Upload Photo" or "🔗 Add URL" (up to 4 photos).</span>` : ""}
        ${photos.map((src, pIdx) => `
          <div class="admin-photo-item">
            <img src="${src}" alt="Paper Photo ${pIdx + 1}" />
            <button type="button" class="admin-photo-remove-btn" onclick="removeDbPaperPhoto(${pIdx})" title="Remove photo">✕</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
};

window.deleteDatabasePaper = function() {
  if (confirm("Are you sure you want to permanently delete this technical paper from your database?")) {
    if (!currentFullDatabase) currentFullDatabase = {};
    currentFullDatabase.technicalPaper = null;
    currentFullDatabase.technicalPapers = [];
    currentContent.technicalPaper = null;
    currentContent.customPapers = [];

    saveContentToStorage(currentContent, {
      technicalPaper: null,
      technicalPapers: []
    });

    renderTechnicalPaperCard();
    updateAdminBadgesAndMetrics();
    renderDatabaseJsonViewer();
    showToast("Technical paper permanently removed from database.");
  }
};

window.handleDbPaperPhotoUpload = async function(event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  if (!currentFullDatabase) currentFullDatabase = {};
  if (!currentFullDatabase.technicalPaper) currentFullDatabase.technicalPaper = {};
  const paper = currentFullDatabase.technicalPaper;
  if (!Array.isArray(paper.photos)) paper.photos = [];

  if (paper.photos.length >= 4) {
    showToast("Maximum 4 photos allowed for this paper.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }

  showToast("Uploading presentation photo...");
  try {
    const dataUrl = await compressImageFile(file, 640, 480, 0.72);
    paper.photos.push(dataUrl);

    if (!Array.isArray(currentFullDatabase.technicalPapers)) currentFullDatabase.technicalPapers = [];
    if (currentFullDatabase.technicalPapers.length > 0) currentFullDatabase.technicalPapers[0].photos = [...paper.photos];
    else currentFullDatabase.technicalPapers = [{ ...paper }];

    currentContent.technicalPaper = { ...paper };
    currentContent.customPapers = [{ ...paper }];

    saveContentToStorage(currentContent, {
      technicalPaper: currentFullDatabase.technicalPaper,
      technicalPapers: currentFullDatabase.technicalPapers
    });
    renderTechnicalPaperCard();
    showToast(`Photo added (${paper.photos.length}/4)! Saved to database.`);
  } catch (err) {
    console.error("Paper photo upload error:", err);
    showToast("Upload failed: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.promptDbPaperPhotoUrl = function() {
  if (!currentFullDatabase) currentFullDatabase = {};
  if (!currentFullDatabase.technicalPaper) currentFullDatabase.technicalPaper = {};
  const paper = currentFullDatabase.technicalPaper;
  if (!Array.isArray(paper.photos)) paper.photos = [];

  if (paper.photos.length >= 4) {
    showToast("Maximum 4 photos allowed.", "error");
    return;
  }

  const url = prompt("Enter public image URL for paper presentation/certificate (up to 4 photos):");
  if (!url || !url.trim()) return;

  paper.photos.push(url.trim());

  if (!Array.isArray(currentFullDatabase.technicalPapers)) currentFullDatabase.technicalPapers = [];
  if (currentFullDatabase.technicalPapers.length > 0) currentFullDatabase.technicalPapers[0].photos = [...paper.photos];
  else currentFullDatabase.technicalPapers = [{ ...paper }];

  currentContent.technicalPaper = { ...paper };
  currentContent.customPapers = [{ ...paper }];

  saveContentToStorage(currentContent, {
    technicalPaper: currentFullDatabase.technicalPaper,
    technicalPapers: currentFullDatabase.technicalPapers
  });
  renderTechnicalPaperCard();
  showToast(`Photo added (${paper.photos.length}/4)! Saved to database.`);
};

window.removeDbPaperPhoto = function(photoIdx) {
  if (!currentFullDatabase?.technicalPaper || !Array.isArray(currentFullDatabase.technicalPaper.photos)) return;
  currentFullDatabase.technicalPaper.photos.splice(photoIdx, 1);
  const paper = currentFullDatabase.technicalPaper;

  if (Array.isArray(currentFullDatabase.technicalPapers) && currentFullDatabase.technicalPapers.length > 0) {
    currentFullDatabase.technicalPapers[0].photos = [...paper.photos];
  }
  currentContent.technicalPaper = { ...paper };
  currentContent.customPapers = [{ ...paper }];

  saveContentToStorage(currentContent, {
    technicalPaper: currentFullDatabase.technicalPaper,
    technicalPapers: currentFullDatabase.technicalPapers
  });
  renderTechnicalPaperCard();
  showToast("Photo removed from technical paper.");
};

window.saveTechnicalPaperToDb = function() {
  if (!currentFullDatabase) currentFullDatabase = {};
  if (!currentFullDatabase.technicalPaper) currentFullDatabase.technicalPaper = {};

  const p = currentFullDatabase.technicalPaper;
  const tEl = document.getElementById("dbPaperTitle"); if (tEl) p.title = tEl.value.trim();
  const eEl = document.getElementById("dbPaperEvent"); if (eEl) p.event = eEl.value.trim();
  const rEl = document.getElementById("dbPaperResult"); if (rEl) p.result = rEl.value.trim();
  const iEl = document.getElementById("dbPaperInst"); if (iEl) p.institution = iEl.value.trim();
  const dEl = document.getElementById("dbPaperDate"); if (dEl) p.date = dEl.value.trim();
  const tagEl = document.getElementById("dbPaperTagline"); if (tagEl) p.tagline = tagEl.value.trim();
  const lEl = document.getElementById("dbPaperLink"); if (lEl) p.link = lEl.value.trim();
  const descEl = document.getElementById("dbPaperDesc"); if (descEl) p.description = descEl.value.trim();

  currentContent.technicalPaper = { ...p };
  currentContent.customPapers = [{ ...p }];
  currentFullDatabase.technicalPapers = [{ ...p }];

  saveContentToStorage(currentContent, {
    technicalPaper: currentFullDatabase.technicalPaper,
    technicalPapers: currentFullDatabase.technicalPapers
  });
  renderTechnicalPaperCard();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("Research paper updated and synced with Supabase!");
};

// Global Temporary Photos State for "Add New" Forms (up to 4 photos)
window._newItemPhotos = {
  project: [],
  cert: [],
  paper: []
};

window.handleNewItemPhotoSelected = async function(type, event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  if (!window._newItemPhotos[type]) window._newItemPhotos[type] = [];
  if (window._newItemPhotos[type].length >= 4) {
    showToast("Maximum 4 photos allowed for new " + type + ". Please remove one first.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }

  showToast(`Processing photo (${file.name || 'image'})...`);
  try {
    const dataUrl = await compressImageFile(file, 640, 480, 0.72);
    window._newItemPhotos[type].push(dataUrl);
    renderNewItemPhotoThumbs(type);
    showToast(`Photo added (${window._newItemPhotos[type].length}/4)! Ready to save.`);
  } catch (err) {
    console.error("Photo processing error:", err);
    showToast("Could not process photo: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.promptAddNewItemPhotoUrl = function(type) {
  if (!window._newItemPhotos[type]) window._newItemPhotos[type] = [];
  if (window._newItemPhotos[type].length >= 4) {
    showToast("Maximum 4 photos allowed.", "error");
    return;
  }

  const url = prompt(`Enter public image URL for this new ${type} photo:`);
  if (!url || !url.trim()) return;

  window._newItemPhotos[type].push(url.trim());
  renderNewItemPhotoThumbs(type);
  showToast(`Photo added (${window._newItemPhotos[type].length}/4)! Ready to save.`);
};

window.removeNewItemPhoto = function(type, index) {
  if (window._newItemPhotos[type]) {
    window._newItemPhotos[type].splice(index, 1);
    renderNewItemPhotoThumbs(type);
    showToast("Photo removed.");
  }
};

function renderNewItemPhotoThumbs(type) {
  let containerId = "newProjectPhotosThumbs";
  if (type === "cert") containerId = "newCertPhotosThumbs";
  if (type === "paper") containerId = "newPaperPhotosThumbs";

  const container = document.getElementById(containerId);
  if (!container) return;

  const photos = window._newItemPhotos[type] || [];
  if (photos.length === 0) {
    container.innerHTML = `<span style="font-size: 0.75rem; color: #94A3B8; font-style: italic;">No photos added yet. Click "+ Upload Photo" or "🔗 Add URL" (up to 4 photos).</span>`;
    return;
  }

  container.innerHTML = photos.map((src, idx) => `
    <div class="admin-photo-item" title="Photo ${idx + 1}">
      <img src="${src}" alt="New Photo ${idx + 1}" />
      <button type="button" class="admin-photo-remove-btn" onclick="removeNewItemPhoto('${type}', ${idx})" title="Remove photo">✕</button>
    </div>
  `).join("");
}

// Full submitNewPaper implementation with all 7 requested fields
window.submitNewPaper = function() {
  const title = (document.getElementById("newPaperTitle")?.value || "").trim();
  const eventName = (document.getElementById("newPaperEvent")?.value || "").trim();
  const result = (document.getElementById("newPaperResult")?.value || "").trim();
  const institution = (document.getElementById("newPaperInst")?.value || "").trim();
  const date = (document.getElementById("newPaperDate")?.value || "").trim();
  const link = (document.getElementById("newPaperLink")?.value || "").trim();
  const tagline = (document.getElementById("newPaperTagline")?.value || "").trim();
  const desc = (document.getElementById("newPaperDesc")?.value || "").trim();

  if (!title) {
    showToast("Please enter a Technical Paper Title.", "error");
    document.getElementById("newPaperTitle")?.focus();
    return;
  }

  const photos = [...(window._newItemPhotos.paper || [])];
  const paperId = "paper_" + Date.now();

  const paperData = {
    id: paperId,
    title: title,
    event: eventName || "Conference / Symposium",
    result: result || "Paper Presentation",
    institution: institution || "Engineering Institution",
    date: date || new Date().toLocaleDateString("en-GB"),
    link: link || "",
    tagline: tagline || "",
    description: desc || "Technical research publication and demonstration.",
    abstract: desc || "Technical research publication and demonstration.",
    photos: photos
  };

  if (!currentFullDatabase) currentFullDatabase = {};
  currentFullDatabase.technicalPaper = paperData;
  currentFullDatabase.technicalPapers = [paperData];

  currentContent.technicalPaper = paperData;
  currentContent.customPapers = [paperData];

  // Sync to database and localStorage
  saveContentToStorage(currentContent, {
    technicalPaper: currentFullDatabase.technicalPaper,
    technicalPapers: currentFullDatabase.technicalPapers
  });

  // Clear inputs and photos
  window._newItemPhotos.paper = [];
  renderNewItemPhotoThumbs("paper");

  if (document.getElementById("newPaperTitle")) document.getElementById("newPaperTitle").value = "";
  if (document.getElementById("newPaperEvent")) document.getElementById("newPaperEvent").value = "";
  if (document.getElementById("newPaperResult")) document.getElementById("newPaperResult").value = "";
  if (document.getElementById("newPaperInst")) document.getElementById("newPaperInst").value = "";
  if (document.getElementById("newPaperDate")) document.getElementById("newPaperDate").value = "";
  if (document.getElementById("newPaperLink")) document.getElementById("newPaperLink").value = "";
  if (document.getElementById("newPaperTagline")) document.getElementById("newPaperTagline").value = "";
  if (document.getElementById("newPaperDesc")) document.getElementById("newPaperDesc").value = "";

  toggleAddBox("addPaperBox");
  renderTechnicalPaperCard();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast(`Technical Paper "${title}" published and saved to Supabase!`);
};

// -------------------------------------------------------------
window.renderDatabaseSkillsCategories = function() {
  const container = document.getElementById("adminDatabaseSkillsList");
  if (!container) return;

  const categories = currentFullDatabase && Array.isArray(currentFullDatabase.skills)
    ? currentFullDatabase.skills
    : [];

  if (categories.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🛠️</div>
        <h4 style="font-size: 1.05rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">No Technical Skills in Database</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">All database skills have been permanently cleared. Click "+ Add New Skill" above to add your technical skills.</p>
        <button type="button" class="btn btn-primary btn-sm" onclick="toggleAddBox('addSkillBox')">
          + Add New Skill
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = categories.map((cat, catIdx) => {
    const skillsList = Array.isArray(cat.skills) ? cat.skills : [];
    return `
      <div class="card" style="border: 1px solid rgba(56, 189, 248, 0.35); background: var(--bg-card); padding: 16px; margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">🛠️</span>
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin: 0;">Domain #${catIdx + 1}: ${escapeHTML(cat.name || "Competency")}</h4>
              <span style="font-size: 0.72rem; color: #38BDF8;">${skillsList.length} Competencies</span>
            </div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button type="button" class="btn btn-primary btn-sm" onclick="saveSkillsCategoryToDb('${cat.id}')">
              Save Domain
            </button>
            <button type="button" class="btn-delete" onclick="deleteSkillsCategoryFromDb('${cat.id}')" title="Delete domain">
              Delete Domain
            </button>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.775rem;">Domain Category Name</label>
          <input type="text" id="dbCatName_${cat.id}" class="form-input" value="${escapeHTML(cat.name || "")}" />
        </div>

        <div style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.775rem; margin-bottom: 6px;">Skills in this Category</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            ${skillsList.length === 0 ? `<span style="font-size: 0.75rem; color: #94A3B8; font-style: italic;">No skills in this domain yet. Add below.</span>` : ""}
            ${skillsList.map(skill => `
              <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #BAE6FD; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
                ${escapeHTML(skill)}
                <button type="button" onclick="removeSkillFromCategory('${cat.id}', '${escapeHTML(skill)}')" style="background: none; border: none; color: #F87171; cursor: pointer; padding: 0; font-size: 0.85rem; line-height: 1;" title="Remove skill">✕</button>
              </span>
            `).join("")}
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <input type="text" id="newSkillInput_${cat.id}" class="form-input" placeholder="Add new skill to this domain (e.g. SystemVerilog, UVM)..." style="font-size: 0.8rem; height: 34px;" onkeydown="if(event.key==='Enter'){event.preventDefault();addSkillToCategory('${cat.id}');}" />
          <button type="button" class="btn btn-secondary btn-sm" onclick="addSkillToCategory('${cat.id}')" style="white-space: nowrap;">
            + Add
          </button>
        </div>
      </div>
    `;
  }).join("");
};

window.deleteSkillsCategoryFromDb = function(catId) {
  if (confirm("Delete this entire skill domain category from database?")) {
    if (!currentFullDatabase || !Array.isArray(currentFullDatabase.skills)) return;
    const cat = currentFullDatabase.skills.find(c => c.id === catId);
    currentFullDatabase.skills = currentFullDatabase.skills.filter(c => c.id !== catId);
    if (cat && Array.isArray(cat.skills)) {
      currentContent.customSkills = (currentContent.customSkills || []).filter(s => !cat.skills.includes(s.title));
    }
    saveContentToStorage(currentContent, { skills: currentFullDatabase.skills });
    renderDatabaseSkillsCategories();
    updateAdminBadgesAndMetrics();
    renderDatabaseJsonViewer();
    showToast("Skill domain deleted.");
  }
};

window.saveSkillsCategoryToDb = function(catId) {
  if (!currentFullDatabase || !Array.isArray(currentFullDatabase.skills)) return;
  const cat = currentFullDatabase.skills.find(c => c.id === catId);
  if (!cat) return;
  const nameEl = document.getElementById("dbCatName_" + catId);
  if (nameEl) cat.name = nameEl.value.trim();
  saveContentToStorage(currentContent, { skills: currentFullDatabase.skills });
  renderDatabaseSkillsCategories();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast("Domain saved to database!");
};

window.addSkillToCategory = function(catId) {
  if (!currentFullDatabase || !Array.isArray(currentFullDatabase.skills)) return;
  const cat = currentFullDatabase.skills.find(c => c.id === catId);
  if (!cat) return;
  const input = document.getElementById("newSkillInput_" + catId);
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  if (!Array.isArray(cat.skills)) cat.skills = [];
  if (!cat.skills.includes(val)) {
    cat.skills.push(val);
  }
  input.value = "";

  if (!Array.isArray(currentContent.customSkills)) currentContent.customSkills = [];
  currentContent.customSkills = currentContent.customSkills.filter(s => (s.title || "").toLowerCase() !== val.toLowerCase());
  currentContent.customSkills.push({
    id: "skill_" + Date.now(),
    title: val,
    category: cat.name || "Domain Skill",
    desc: `Proficiency in ${val}`,
    tags: [cat.name || "Engineering"]
  });

  saveContentToStorage(currentContent, { skills: currentFullDatabase.skills });
  renderDatabaseSkillsCategories();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast(`Added "${val}" to ${cat.name}!`);
};

window.removeSkillFromCategory = function(catId, skillName) {
  if (!currentFullDatabase || !Array.isArray(currentFullDatabase.skills)) return;
  const cat = currentFullDatabase.skills.find(c => c.id === catId);
  if (!cat || !Array.isArray(cat.skills)) return;
  cat.skills = cat.skills.filter(s => s !== skillName);
  if (Array.isArray(currentContent.customSkills)) {
    currentContent.customSkills = currentContent.customSkills.filter(s => s.title !== skillName);
  }
  saveContentToStorage(currentContent, { skills: currentFullDatabase.skills });
  renderDatabaseSkillsCategories();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast(`Removed "${skillName}"`);
};

window.submitNewSkill = function() {
  const title = (document.getElementById("newSkillTitle")?.value || "").trim();
  const category = (document.getElementById("newSkillCategory")?.value || "").trim();
  const desc = (document.getElementById("newSkillDesc")?.value || "").trim();
  const tagsStr = (document.getElementById("newSkillTags")?.value || "").trim();

  if (!title) {
    showToast("Please enter a Skill Name.", "error");
    document.getElementById("newSkillTitle")?.focus();
    return;
  }

  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : ["VLSI"];
  const skillId = "skill_" + Date.now();
  const catName = category || "VLSI Competencies";

  const newSkill = {
    id: skillId,
    title: title,
    category: catName,
    desc: desc || "Practical proficiency in semiconductor design flow.",
    tags: tags
  };

  if (!currentFullDatabase) currentFullDatabase = {};
  if (!Array.isArray(currentFullDatabase.skills)) currentFullDatabase.skills = [];

  let cat = currentFullDatabase.skills.find(c => (c.name || "").toLowerCase() === catName.toLowerCase());
  if (!cat) {
    cat = {
      id: "domain_" + Date.now(),
      name: catName,
      skills: []
    };
    currentFullDatabase.skills.push(cat);
  }
  if (!Array.isArray(cat.skills)) cat.skills = [];
  if (!cat.skills.includes(title)) {
    cat.skills.push(title);
  }

  if (!Array.isArray(currentContent.customSkills)) currentContent.customSkills = [];
  currentContent.customSkills = currentContent.customSkills.filter(s => (s.title || "").toLowerCase() !== title.toLowerCase());
  currentContent.customSkills.push(newSkill);

  saveContentToStorage(currentContent, { skills: currentFullDatabase.skills });

  if (document.getElementById("newSkillTitle")) document.getElementById("newSkillTitle").value = "";
  if (document.getElementById("newSkillCategory")) document.getElementById("newSkillCategory").value = "";
  if (document.getElementById("newSkillDesc")) document.getElementById("newSkillDesc").value = "";
  if (document.getElementById("newSkillTags")) document.getElementById("newSkillTags").value = "";
  toggleAddBox("addSkillBox");

  renderDatabaseSkillsCategories();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast(`Skill "${title}" added and saved to Supabase!`);
};

// No-ops for customSkills
window.deleteCustomSkill = function() {};
window.renderCustomSkills = function() {};

window.submitNewProject = function() {
  const title = (document.getElementById("newProjectTitle")?.value || "").trim();
  const desc = (document.getElementById("newProjectDesc")?.value || "").trim();
  const tagsStr = (document.getElementById("newProjectTags")?.value || "").trim();
  const link = (document.getElementById("newProjectLink")?.value || "").trim();
  const highlights = (document.getElementById("newProjectHighlights")?.value || "").trim();

  if (!title) {
    showToast("Please enter a Project Title.", "error");
    document.getElementById("newProjectTitle")?.focus();
    return;
  }

  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : ["VLSI", "RTL"];
  const photos = [...(window._newItemPhotos.project || [])];
  const projId = "proj_" + Date.now();

  const projectObj = {
    id: projId,
    title: title,
    text: desc || "Hardware design project in VLSI engineering.",
    description: desc || "Hardware design project in VLSI engineering.",
    tags: tags,
    technologies: tags,
    link: link || "https://github.com/naveena-k",
    highlights: highlights || "",
    photos: photos,
    isSample: false
  };

  if (!currentFullDatabase) currentFullDatabase = {};
  if (!Array.isArray(currentFullDatabase.projects)) currentFullDatabase.projects = [];
  
  // Deduplicate before adding
  currentFullDatabase.projects = currentFullDatabase.projects.filter(p => (p.title || "").toLowerCase() !== title.toLowerCase() && p.id !== projId);
  currentFullDatabase.projects.push(projectObj);

  if (!Array.isArray(currentContent.customProjects)) currentContent.customProjects = [];
  currentContent.customProjects = currentContent.customProjects.filter(p => (p.title || "").toLowerCase() !== title.toLowerCase() && p.id !== projId);
  currentContent.customProjects.push(projectObj);

  saveContentToStorage(currentContent, { projects: currentFullDatabase.projects });

  // Clear inputs and state
  window._newItemPhotos.project = [];
  renderNewItemPhotoThumbs("project");

  if (document.getElementById("newProjectTitle")) document.getElementById("newProjectTitle").value = "";
  if (document.getElementById("newProjectDesc")) document.getElementById("newProjectDesc").value = "";
  if (document.getElementById("newProjectTags")) document.getElementById("newProjectTags").value = "";
  if (document.getElementById("newProjectLink")) document.getElementById("newProjectLink").value = "";
  if (document.getElementById("newProjectHighlights")) document.getElementById("newProjectHighlights").value = "";
  toggleAddBox("addProjectBox");

  renderDatabaseProjectsList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast(`Project "${title}" added and saved to Supabase!`);
};

// No-ops for customProjects
window.deleteCustomProject = function() {};
window.renderCustomProjects = function() {};

window.submitNewCertificate = function() {
  const title = (document.getElementById("newCertTitle")?.value || "").trim();
  const issuer = (document.getElementById("newCertIssuer")?.value || "").trim();
  const date = (document.getElementById("newCertDate")?.value || "").trim();
  const url = (document.getElementById("newCertUrl")?.value || "").trim();
  const desc = (document.getElementById("newCertDesc")?.value || "").trim();
  const tagsStr = (document.getElementById("newCertTags")?.value || "").trim();

  if (!title) {
    showToast("Please enter a Certificate Title.", "error");
    document.getElementById("newCertTitle")?.focus();
    return;
  }

  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : ["Verified", "VLSI"];
  const photos = [...(window._newItemPhotos.cert || [])];
  const certId = "cert_" + Date.now();

  const certObj = {
    id: certId,
    title: title,
    name: title,
    issuer: issuer || "Verified Authority",
    organization: issuer || "Verified Authority",
    date: date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    url: url || "",
    desc: desc || "Verified professional competency and credential.",
    description: desc || "Verified professional competency and credential.",
    tags: tags,
    photos: photos
  };

  if (!currentFullDatabase) currentFullDatabase = {};
  if (!Array.isArray(currentFullDatabase.certifications)) currentFullDatabase.certifications = [];

  // Deduplicate before adding
  currentFullDatabase.certifications = currentFullDatabase.certifications.filter(c => (c.name || c.title || "").toLowerCase() !== title.toLowerCase() && c.id !== certId);
  currentFullDatabase.certifications.push(certObj);

  if (!Array.isArray(currentContent.customCertificates)) currentContent.customCertificates = [];
  currentContent.customCertificates = currentContent.customCertificates.filter(c => (c.title || c.name || "").toLowerCase() !== title.toLowerCase() && c.id !== certId);
  currentContent.customCertificates.push(certObj);

  saveContentToStorage(currentContent, { certifications: currentFullDatabase.certifications });

  // Clear inputs and state
  window._newItemPhotos.cert = [];
  renderNewItemPhotoThumbs("cert");

  if (document.getElementById("newCertTitle")) document.getElementById("newCertTitle").value = "";
  if (document.getElementById("newCertIssuer")) document.getElementById("newCertIssuer").value = "";
  if (document.getElementById("newCertDate")) document.getElementById("newCertDate").value = "";
  if (document.getElementById("newCertUrl")) document.getElementById("newCertUrl").value = "";
  if (document.getElementById("newCertDesc")) document.getElementById("newCertDesc").value = "";
  if (document.getElementById("newCertTags")) document.getElementById("newCertTags").value = "";
  toggleAddBox("addCertBox");

  renderDatabaseCertsList();
  updateAdminBadgesAndMetrics();
  renderDatabaseJsonViewer();
  showToast(`Certificate "${title}" added and saved to Supabase!`);
};

// No-ops for customCertificates and customPapers
window.deleteCustomCertificate = function() {};
window.renderCustomCertificates = function() {};
window.renderCustomPapers = function() {};
window.deleteCustomPaper = function() {};
window.updateCustomCertificateField = function() {};


// -------------------------------------------------------------
// PRESENTATION & CREDENTIAL PHOTOS MANAGEMENT (User Request)
// -------------------------------------------------------------

function compressImageFile(file, maxWidth = 640, maxHeight = 480, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }

    // 1. Primary: Use URL.createObjectURL - lightweight, zero memory overhead, universally supported
    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      try {
        const blobUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function() {
          try {
            URL.revokeObjectURL(blobUrl);
            let width = img.naturalWidth || img.width || 640;
            let height = img.naturalHeight || img.height || 480;

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.max(1, Math.round(width * ratio));
              height = Math.max(1, Math.round(height * ratio));
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              runFileReaderFallback(file, maxWidth, maxHeight, quality, resolve, reject);
              return;
            }

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(dataUrl);
          } catch (err) {
            runFileReaderFallback(file, maxWidth, maxHeight, quality, resolve, reject);
          }
        };
        img.onerror = function() {
          URL.revokeObjectURL(blobUrl);
          runFileReaderFallback(file, maxWidth, maxHeight, quality, resolve, reject);
        };
        img.src = blobUrl;
        return;
      } catch (e) {
        // Fall back to FileReader
      }
    }

    runFileReaderFallback(file, maxWidth, maxHeight, quality, resolve, reject);
  });
}

function runFileReaderFallback(file, maxWidth, maxHeight, quality, resolve, reject) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const rawResult = e.target.result;
    const img = new Image();
    img.onload = function() {
      try {
        let width = img.naturalWidth || img.width || 640;
        let height = img.naturalHeight || img.height || 480;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      } catch (err) {
        if (rawResult && typeof rawResult === "string" && rawResult.startsWith("data:image")) {
          resolve(rawResult);
        } else {
          reject(new Error("Unable to compress image. Please try another format."));
        }
      }
    };
    img.onerror = function() {
      if (rawResult && typeof rawResult === "string" && rawResult.startsWith("data:image")) {
        resolve(rawResult);
      } else {
        reject(new Error("Could not decode image file. Please select a JPG, PNG, or WebP file."));
      }
    };
    img.src = rawResult;
  };
  reader.onerror = function() {
    reject(new Error("Could not read file from your device."));
  };
  reader.readAsDataURL(file);
}

// -------------------------------------------------------------
// PROFILE AVATAR / PHOTO HANDLERS
// -------------------------------------------------------------
window.handleProfilePhotoUpload = async function(event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  showToast(`Optimizing profile photo (${file.name || 'image'})...`);
  try {
    const dataUrl = await compressImageFile(file, 400, 400, 0.8);
    currentContent.profilePhoto = dataUrl;
    if (!currentFullDatabase) currentFullDatabase = {};
    if (!currentFullDatabase.hero) currentFullDatabase.hero = {};
    currentFullDatabase.hero.profilePhoto = dataUrl;
    currentFullDatabase.hero.photoUrl = dataUrl;
    currentFullDatabase.profilePhoto = dataUrl;
    currentFullDatabase.photoUrl = dataUrl;

    saveContentToStorage(currentContent, { hero: currentFullDatabase.hero });
    renderProfilePhotoPreview();
    showToast("Profile photo uploaded and synced with Supabase!");
  } catch (err) {
    console.error("Profile photo upload error:", err);
    showToast("Upload failed: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.applyProfilePhotoUrlFromInput = function() {
  const input = document.getElementById("profilePhotoUrlInput");
  if (!input) return;
  const url = input.value.trim();
  if (!url) {
    showToast("Please paste an image URL first.", "error");
    return;
  }

  currentContent.profilePhoto = url;
  if (!currentFullDatabase) currentFullDatabase = {};
  if (!currentFullDatabase.hero) currentFullDatabase.hero = {};
  currentFullDatabase.hero.profilePhoto = url;
  currentFullDatabase.hero.photoUrl = url;
  currentFullDatabase.profilePhoto = url;
  currentFullDatabase.photoUrl = url;

  saveContentToStorage(currentContent, { hero: currentFullDatabase.hero });
  renderProfilePhotoPreview();
  showToast("Profile photo URL saved and synced with Supabase!");
};

window.promptProfilePhotoUrl = function() {
  const url = prompt("Enter public image URL for your profile photo / avatar:\n(e.g., https://... or public image link)");
  if (!url || !url.trim()) return;

  const cleanUrl = url.trim();
  currentContent.profilePhoto = cleanUrl;
  if (!currentFullDatabase) currentFullDatabase = {};
  if (!currentFullDatabase.hero) currentFullDatabase.hero = {};
  currentFullDatabase.hero.profilePhoto = cleanUrl;
  currentFullDatabase.hero.photoUrl = cleanUrl;
  currentFullDatabase.profilePhoto = cleanUrl;
  currentFullDatabase.photoUrl = cleanUrl;

  saveContentToStorage(currentContent, { hero: currentFullDatabase.hero });
  renderProfilePhotoPreview();
  showToast("Profile photo URL saved and synced!");
};

window.removeProfilePhoto = function() {
  if (confirm("Remove your profile photo? Default initials (NK) will be displayed.")) {
    currentContent.profilePhoto = null;
    if (currentFullDatabase?.hero) {
      currentFullDatabase.hero.profilePhoto = null;
      currentFullDatabase.hero.photoUrl = null;
    }
    if (currentFullDatabase) {
      currentFullDatabase.profilePhoto = null;
      currentFullDatabase.photoUrl = null;
    }
    saveContentToStorage(currentContent, { hero: currentFullDatabase.hero });
    renderProfilePhotoPreview();
    showToast("Profile photo removed.");
  }
};

window.renderProfilePhotoPreview = function() {
  const preview = document.getElementById("adminProfilePhotoPreview");
  const removeBtn = document.getElementById("removeProfilePhotoBtn");
  const urlInput = document.getElementById("profilePhotoUrlInput");
  if (!preview) return;

  const photo =
    currentContent.profilePhoto ||
    currentFullDatabase?.hero?.profilePhoto ||
    currentFullDatabase?.hero?.photoUrl ||
    currentFullDatabase?.profilePhoto ||
    currentFullDatabase?.photoUrl ||
    null;

  if (photo) {
    preview.innerHTML = `<img src="${photo}" alt="Profile Avatar" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit;" />`;
    if (removeBtn) removeBtn.style.display = "inline-flex";
    if (urlInput && (!urlInput.value || urlInput.value.startsWith("http"))) {
      urlInput.value = photo.startsWith("http") ? photo : "";
    }
  } else {
    preview.innerHTML = "NK";
    if (removeBtn) removeBtn.style.display = "none";
    if (urlInput) urlInput.value = "";
  }
};

window.promptAddPhotoUrl = function(sectionType, key) {
  const url = prompt("Enter public image URL for presentation / credential photo:\n(e.g., https://... or public image link)");
  if (!url || !url.trim()) return;
  const cleanUrl = url.trim();

  const photosKey = key + "Photos";
  if (!Array.isArray(currentContent[photosKey])) {
    currentContent[photosKey] = [];
  }
  if (currentContent[photosKey].length >= 4) {
    showToast("Maximum 4 presentation photos allowed. Please remove an existing photo first.", "error");
    return;
  }
  currentContent[photosKey].push(cleanUrl);
  saveContentToStorage(currentContent);
  renderPhotoThumbs(key);
  showToast(`Photo URL added (${currentContent[photosKey].length}/4)! Saved to cloud.`);
};

window.promptAddCustomPhotoUrl = function(type, id) {
  const url = prompt("Enter public image URL for this item:\n(e.g., https://... or public image link)");
  if (!url || !url.trim()) return;
  const cleanUrl = url.trim();

  let listKey = "customCertificates";
  if (type === "project") listKey = "customProjects";
  if (type === "paper") listKey = "customPapers";

  const item = (currentContent[listKey] || []).find(x => x.id === id);
  if (!item) return;
  if (!Array.isArray(item.photos)) item.photos = [];

  if (item.photos.length >= 4) {
    showToast("Maximum 4 photos allowed. Please remove one first.", "error");
    return;
  }

  item.photos.push(cleanUrl);
  saveContentToStorage(currentContent);
  if (type === "cert") renderCustomCertificates();
  if (type === "project") renderCustomProjects();
  if (type === "paper") renderCustomPapers();
  showToast(`Photo added (${item.photos.length}/4)! Saved to cloud.`);
};

window.triggerPhotoUpload = function(sectionType, key) {
  let input = document.getElementById(key + "PhotoFileInput");
  if (!input) {
    input = document.getElementById(`custom_${sectionType}_${key}_PhotoInput`);
  }
  if (input) {
    input.value = "";
    input.click();
  }
};

window.handlePhotoFileSelected = async function(sectionType, key, event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  const photosKey = key + "Photos";
  if (!Array.isArray(currentContent[photosKey])) {
    currentContent[photosKey] = [];
  }

  if (currentContent[photosKey].length >= 4) {
    showToast("Maximum 4 presentation photos allowed for this section. Please remove an existing photo first.", "error");
    return;
  }

  showToast(`Optimizing & uploading photo (${file.name || 'image'})...`);

  try {
    const dataUrl = await compressImageFile(file, 640, 480, 0.72);
    currentContent[photosKey].push(dataUrl);
    saveContentToStorage(currentContent);
    renderPhotoThumbs(key);
    showToast(`Photo uploaded (${currentContent[photosKey].length}/4)! Saved to cloud.`);
  } catch (err) {
    console.error("Photo upload error:", err);
    showToast("Could not process photo: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.removePhoto = function(key, index) {
  const photosKey = key + "Photos";
  if (Array.isArray(currentContent[photosKey])) {
    currentContent[photosKey].splice(index, 1);
    saveContentToStorage(currentContent);
    renderPhotoThumbs(key);
    showToast("Photo removed & changes saved.");
  }
};

function renderPhotoThumbs(key) {
  const container = document.getElementById(key + "PhotosThumbs");
  if (!container) return;
  const photos = currentContent[key + "Photos"] || [];
  if (photos.length === 0) {
    container.innerHTML = `<span style="font-size: 0.75rem; color: #94A3B8; font-style: italic;">No photos uploaded yet. Click "+ Upload Photo" or "🔗 Add URL" (up to 4 photos).</span>`;
    return;
  }
  container.innerHTML = photos.map((src, idx) => `
    <div class="admin-photo-item" title="Presentation photo ${idx + 1}">
      <img src="${src}" alt="Presentation Photo ${idx + 1}" />
      <button type="button" class="admin-photo-remove-btn" onclick="removePhoto('${key}', ${idx})" title="Remove photo">✕</button>
    </div>
  `).join("");
}

function renderAllPhotoThumbs() {
  const allKeys = [
    "project1", "project2", "project3", "project4",
    "paper1", "paper2", "paper3", "paper4",
    "cert1", "cert2", "cert3", "cert4"
  ];
  allKeys.forEach(k => renderPhotoThumbs(k));
}

window.triggerCustomPhotoUpload = function(type, id) {
  const input = document.getElementById(`custom_${type}_${id}_PhotoInput`);
  if (input) {
    input.value = "";
    input.click();
  }
};

window.handleCustomPhotoFileSelected = async function(type, id, event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  let listKey = "customCertificates";
  if (type === "project") listKey = "customProjects";
  if (type === "paper") listKey = "customPapers";

  const item = (currentContent[listKey] || []).find(x => x.id === id);
  if (!item) return;
  if (!Array.isArray(item.photos)) item.photos = [];

  if (item.photos.length >= 4) {
    showToast("Maximum 4 photos allowed for this item. Please remove one first.", "error");
    try { input.value = ""; } catch (e) {}
    return;
  }

  showToast(`Uploading photo for ${item.title || 'item'}...`);
  try {
    const dataUrl = await compressImageFile(file, 640, 480, 0.72);
    item.photos.push(dataUrl);
    saveContentToStorage(currentContent);
    if (type === "cert") renderCustomCertificates();
    if (type === "project") renderCustomProjects();
    if (type === "paper") renderCustomPapers();
    showToast(`Photo uploaded (${item.photos.length}/4)! Saved to cloud.`);
  } catch (err) {
    console.error("Custom photo upload error:", err);
    showToast("Upload failed: " + (err.message || "Unknown error"), "error");
  } finally {
    try { input.value = ""; } catch (e) {}
  }
};

window.removeCustomPhoto = function(type, id, index) {
  let listKey = "customCertificates";
  if (type === "project") listKey = "customProjects";
  if (type === "paper") listKey = "customPapers";

  const item = (currentContent[listKey] || []).find(x => x.id === id);
  if (item && Array.isArray(item.photos)) {
    item.photos.splice(index, 1);
    saveContentToStorage(currentContent);
    if (type === "cert") renderCustomCertificates();
    if (type === "project") renderCustomProjects();
    if (type === "paper") renderCustomPapers();
    showToast("Photo removed.");
  }
};

// -------------------------------------------------------------
// 4. ABOUT SECTION DETAILS MANAGEMENT
// -------------------------------------------------------------

window.submitNewAboutDetail = function() {
  const title = (document.getElementById("newAboutTitle")?.value || "").trim();
  const desc = (document.getElementById("newAboutDesc")?.value || "").trim();

  if (!title) {
    showToast("Please enter a Heading / Title.", "error");
    document.getElementById("newAboutTitle")?.focus();
    return;
  }

  const newDetail = {
    id: "about_" + Date.now(),
    title: title,
    desc: desc || "Academic and laboratory specialization highlight."
  };

  const list = currentContent.additionalAboutDetails || [];
  list.push(newDetail);
  currentContent.additionalAboutDetails = list;

  saveContentToStorage(currentContent);

  if (document.getElementById("newAboutTitle")) document.getElementById("newAboutTitle").value = "";
  if (document.getElementById("newAboutDesc")) document.getElementById("newAboutDesc").value = "";
  toggleAddBox("addAboutBox");

  renderCustomAboutDetails();
  showToast(`Detail "${title}" added and published successfully!`);
};

window.deleteAboutDetail = function(id) {
  if (confirm("Delete this detail entry?")) {
    currentContent.additionalAboutDetails = (currentContent.additionalAboutDetails || []).filter(d => d.id !== id);
    saveContentToStorage(currentContent);
    renderCustomAboutDetails();
    showToast("Detail removed.");
  }
};

function renderCustomAboutDetails() {
  const container = document.getElementById("additionalAboutDetailsContainer");
  if (!container) return;
  container.innerHTML = "";

  const list = currentContent.additionalAboutDetails || [];
  if (list.length === 0) return;

  const header = document.createElement("div");
  header.style.cssText = "font-weight: 700; font-size: 0.9rem; color: #60A5FA; margin-top: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;";
  header.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Additional Details (${list.length})`;
  container.appendChild(header);

  list.forEach((d) => {
    const card = document.createElement("div");
    card.className = "custom-item-card";
    card.style.border = "1px solid rgba(69, 137, 255, 0.4)";
    card.style.background = "#0E203C";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 700; font-size: 0.85rem; color: #60A5FA;">${escapeHTML(d.title)}</span>
        <button type="button" class="btn-delete" onclick="deleteAboutDetail('${d.id}')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete Detail
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">Heading</label>
        <input type="text" class="form-input" value="${escapeHTML(d.title)}" onchange="updateAboutDetailField('${d.id}', 'title', this.value)" />
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" style="min-height: 50px;" onchange="updateAboutDetailField('${d.id}', 'desc', this.value)">${escapeHTML(d.desc || '')}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

window.updateAboutDetailField = function(id, field, value) {
  const d = (currentContent.additionalAboutDetails || []).find(x => x.id === id);
  if (d) {
    d[field] = value;
    saveContentToStorage(currentContent);
    showToast("Detail updated & saved.");
  }
};

// -------------------------------------------------------------
// RESUME MANAGEMENT & FILE UPLOAD
// -------------------------------------------------------------

function getSavedResume() {
  try {
    const raw = localStorage.getItem("portfolioResume");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

window.triggerResumeUpload = function() {
  const input = document.getElementById("resumeFileInput");
  if (input) {
    input.value = "";
    input.click();
  }
};

window.handleResumeDragOver = function(e) {
  e.preventDefault();
  const zone = document.getElementById("resumeDropzone");
  if (zone) {
    zone.style.borderColor = "#0F62FE";
    zone.style.background = "rgba(15, 98, 254, 0.12)";
  }
};

window.handleResumeDragLeave = function(e) {
  e.preventDefault();
  const zone = document.getElementById("resumeDropzone");
  if (zone) {
    zone.style.borderColor = "rgba(69, 137, 255, 0.4)";
    zone.style.background = "rgba(11, 25, 44, 0.5)";
  }
};

window.handleResumeDrop = function(e) {
  e.preventDefault();
  const zone = document.getElementById("resumeDropzone");
  if (zone) {
    zone.style.borderColor = "rgba(69, 137, 255, 0.4)";
    zone.style.background = "rgba(11, 25, 44, 0.5)";
  }
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processResumeUpload(e.dataTransfer.files[0]);
  }
};

window.handleResumeFileSelected = function(e) {
  if (e.target && e.target.files && e.target.files.length > 0) {
    processResumeUpload(e.target.files[0]);
  }
};

function processResumeUpload(file) {
  if (!file) return;

  const validExtensions = /\.(pdf|doc|docx)$/i;
  if (!validExtensions.test(file.name)) {
    showToast("Please upload a PDF or Word document (.pdf, .doc, .docx).", "error");
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    showToast("File exceeds 8MB. Please select a resume file under 8MB.", "error");
    return;
  }

  const progress = document.getElementById("resumeUploadProgress");
  if (progress) {
    progress.style.display = "block";
    progress.textContent = `Processing "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`;
  }

  showToast(`Uploading "${file.name}" to Supabase...`);

  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64Data = evt.target.result;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const sizeFormatted = (file.size / 1024).toFixed(1) + " KB";

    const resumeObj = {
      fileName: file.name,
      pdfUrl: file.name,
      lastUpdated: dateFormatted,
      uploadedPdfData: base64Data,
      fileSize: sizeFormatted
    };

    currentContent.resume = resumeObj;
    saveContentToStorage(currentContent);
    try {
      localStorage.setItem("portfolioResume", JSON.stringify(resumeObj));
    } catch (e) {}

    updateResumeUI(resumeObj);

    if (progress) {
      progress.textContent = "Syncing resume with Supabase cloud backend...";
    }

    if (typeof window.uploadResumeToSupabase === "function") {
      window.uploadResumeToSupabase(resumeObj).then((res) => {
        if (progress) progress.style.display = "none";
        if (res && res.success) {
          showToast(`Resume "${file.name}" saved to Supabase & public viewers!`);
        } else {
          showToast(`Saved locally. Supabase error: ${res?.error || "check network"}`);
        }
      }).catch((err) => {
        if (progress) progress.style.display = "none";
        showToast(`Saved locally. Network error: ${err.message}`);
      });
    } else {
      if (progress) progress.style.display = "none";
      showToast(`Resume "${file.name}" saved locally!`);
    }
  };

  reader.onerror = function() {
    if (progress) progress.style.display = "none";
    showToast("Error reading file. Please try again.", "error");
  };

  reader.readAsDataURL(file);
}

function updateResumeUI(resumeObj) {
  if (!resumeObj) return;

  const fileNameEl = document.getElementById("currentResumeFileName");
  if (fileNameEl && resumeObj.fileName) {
    fileNameEl.textContent = resumeObj.fileName;
  }

  const dateEl = document.getElementById("currentResumeLastUpdated");
  if (dateEl && resumeObj.lastUpdated) {
    dateEl.textContent = resumeObj.lastUpdated;
  }

  const statusEl = document.getElementById("currentResumeStatus");
  if (statusEl) {
    statusEl.textContent = "Active for Public Download (" + (resumeObj.fileSize || "PDF") + ")";
  }

  const previewLink = document.getElementById("adminPreviewResumeLink");
  if (previewLink) {
    previewLink.href = resumeObj.uploadedPdfData || resumeObj.pdfUrl || "Naveena_K_Resume.pdf";
    previewLink.setAttribute("download", resumeObj.fileName || "Resume.pdf");
  }
}

// -------------------------------------------------------------
// SAVE ALL CHANGES
// -------------------------------------------------------------

function saveAllInputs() {
  fields.forEach((key) => {
    const input = document.getElementById(key);
    if (input) {
      currentContent[key] = input.value.trim();
    }
  });

  const fullUpdates = {
    education: currentEducation,
    achievements: currentAchievements
  };
  if (currentFullDatabase?.projects) fullUpdates.projects = currentFullDatabase.projects;
  if (currentFullDatabase?.certifications) fullUpdates.certifications = currentFullDatabase.certifications;
  if (currentFullDatabase?.technicalPaper) fullUpdates.technicalPaper = currentFullDatabase.technicalPaper;
  if (currentFullDatabase?.skills) fullUpdates.skills = currentFullDatabase.skills;
  if (currentFullDatabase?.contact) fullUpdates.contact = currentFullDatabase.contact;
  if (currentFullDatabase?.hero) fullUpdates.hero = currentFullDatabase.hero;

  // Ensure profile photo is preserved
  if (!currentContent.profilePhoto && currentFullDatabase?.hero?.profilePhoto) {
    currentContent.profilePhoto = currentFullDatabase.hero.profilePhoto;
  }
  if (!currentContent.profilePhoto && currentFullDatabase?.hero?.photoUrl) {
    currentContent.profilePhoto = currentFullDatabase.hero.photoUrl;
  }

  showToast("Saving all changes to Supabase database...");

  saveContentToStorage(currentContent, fullUpdates).then((res) => {
    if (res && res.success) {
      showToast("Saved to Supabase database (zzjqkekiapteaixragev) & live to viewers!");
      updateAdminBadgesAndMetrics();
      renderDatabaseJsonViewer();
    } else {
      showToast("Saved locally. Supabase sync notice: " + (res?.error || "synced"));
    }
  }).catch((err) => {
    showToast("Saved locally. Sync notice: " + (err?.message || "synced"));
  });
}

if (saveContentBtn) {
  saveContentBtn.addEventListener("click", saveAllInputs);
}
if (saveContentBtnTop) {
  saveContentBtnTop.addEventListener("click", saveAllInputs);
}

if (resetContentBtn) {
  resetContentBtn.addEventListener("click", () => {
    if (confirm("Reset all content, restore deleted items, and remove custom additions?")) {
      saveContentToStorage(DEFAULT_CONTENT);
      loadFormContent();
      showToast("Content reset to defaults.");
    }
  });
}

// -------------------------------------------------------------
// VISITOR QUERIES & APPOINTMENT REQUESTS MANAGEMENT
// -------------------------------------------------------------

async function renderQueries() {
  if (!queriesList) return;

  let localQueries = [];
  try {
    const raw = localStorage.getItem("portfolioQueries");
    if (raw) {
      localQueries = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading portfolioQueries:", e);
  }

  let supabaseMessages = [];
  if (typeof window.fetchSupabaseAppointments === "function") {
    try {
      supabaseMessages = await window.fetchSupabaseAppointments();
    } catch (e) {
      console.warn("Could not fetch Supabase appointments:", e);
    }
  }

  // Combine unique messages by ID or email+subject
  const map = new Map();
  (supabaseMessages || []).forEach(m => {
    if (m && m.id) map.set(m.id, { ...m, source: "Supabase" });
  });
  localQueries.forEach(q => {
    if (q && q.id && !map.has(q.id)) {
      map.set(q.id, { ...q, source: "Local" });
    }
  });

  const allQueries = Array.from(map.values());

  queriesList.innerHTML = "";

  if (!allQueries || allQueries.length === 0) {
    queriesList.innerHTML = `
      <div style="text-align: center; padding: 24px 16px; color: var(--text-muted); background: var(--bg-card); border-radius: 8px; border: 1px dashed var(--border-color);">
        <p style="font-size: 0.95rem; font-weight: 500;">No appointments or queries available yet.</p>
        <p style="font-size: 0.8rem; margin-top: 3px; color: var(--text-subtle);">Appointments and queries submitted on the Contact page will automatically sync from Supabase and appear here.</p>
      </div>
    `;
    if (clearQueriesBtn) clearQueriesBtn.style.display = "none";
    return;
  }

  if (clearQueriesBtn) clearQueriesBtn.style.display = "inline-flex";

  allQueries.forEach((q, idx) => {
    const isRecruiter = q.persona === "Recruiter" || (q.company && q.company.trim() !== "") || (q.type && q.type.toLowerCase().includes("recruiter"));
    const isAppointment = q.appointmentDate || (q.tags && q.tags.includes("Appointment")) || q.type === "Book an Appointment";
    
    const card = document.createElement("div");
    card.className = "query-card";
    card.style.borderLeft = isRecruiter ? "4px solid #38BDF8" : isAppointment ? "4px solid #10B981" : "4px solid #A855F7";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="query-author" style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF;">${escapeHTML(q.name || "Anonymous")}</span>
          
          ${isRecruiter ? `
            <span class="badge" style="background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); font-size: 0.7rem; padding: 2px 7px;">💼 Recruiter</span>
            ${q.company ? `<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #FCD34D; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.7rem; padding: 2px 7px;">🏢 ${escapeHTML(q.company)}</span>` : ''}
          ` : `
            <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #C084FC; border: 1px solid rgba(168, 85, 247, 0.4); font-size: 0.7rem; padding: 2px 7px;">💡 ${escapeHTML(q.category || 'Interested / Peer')}</span>
          `}
          
          <span style="font-size: 0.7rem; color: #34D399; background: rgba(16, 185, 129, 0.1); padding: 1px 6px; border-radius: 4px;">Supabase</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; color: var(--text-subtle); font-family: ui-monospace, monospace;">${escapeHTML(q.dateFormatted || q.date || q.createdAt || "Recent")}</span>
          <button type="button" class="btn-delete" style="padding: 1px 6px; font-size: 0.68rem;" onclick="deleteQueryById('${q.id}')">Delete</button>
        </div>
      </div>

      ${q.appointmentDate || q.appointmentTime ? `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 4px; padding: 6px 10px; margin-bottom: 8px; font-size: 0.8rem; color: #A7F3D0; display: flex; gap: 14px; flex-wrap: wrap;">
          <span>📅 <strong>Proposed Interview / Slot:</strong> ${escapeHTML(q.appointmentDate || 'Flexible')}</span>
          <span>⏰ <strong>Window:</strong> ${escapeHTML(q.appointmentTime || 'Flexible')}</span>
        </div>
      ` : ''}

      <div class="query-meta" style="margin-bottom: 8px; font-size: 0.8rem; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <span><strong>Email:</strong> <a href="mailto:${encodeURIComponent(q.email || "")}" style="color: #60A5FA; text-decoration: none;">${escapeHTML(q.email || "N/A")}</a></span>
        <span>•</span>
        <span><strong>Subject:</strong> ${escapeHTML(q.subject || "No Subject")}</span>
        ${q.type ? `<span>•</span><span><strong>Type:</strong> ${escapeHTML(q.type)}</span>` : ''}
        ${q.location ? `<span>•</span><span><strong>Location:</strong> ${escapeHTML(q.location)}</span>` : ''}
      </div>
      <div class="query-body" style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 6px; font-size: 0.88rem; line-height: 1.55; color: #E2E8F0; white-space: pre-wrap;">${escapeHTML(q.message || "No content")}</div>
      
      <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="mailto:${encodeURIComponent(q.email || '')}?subject=${encodeURIComponent('Re: ' + (q.subject || 'Portfolio Query'))}&body=${encodeURIComponent('\n\n--- Original Request ---\nFrom: ' + (q.name || '') + '\n' + (q.message || ''))}" class="btn btn-secondary btn-sm" style="font-size: 0.725rem; padding: 4px 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Reply to ${escapeHTML(q.name || 'Visitor')} via Email
        </a>
      </div>
    `;
    queriesList.appendChild(card);
  });
}

window.deleteQueryById = async function(id) {
  // Remove from localStorage
  let queries = JSON.parse(localStorage.getItem("portfolioQueries") || "[]");
  queries = queries.filter(q => q.id !== id);
  localStorage.setItem("portfolioQueries", JSON.stringify(queries));

  // Remove from Supabase messages if present
  if (window.SUPABASE_CONFIG) {
    try {
      const getEndpoint = `${window.SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${window.SUPABASE_CONFIG.rowId}&select=*`;
      const res = await fetch(getEndpoint, {
        headers: {
          apikey: window.SUPABASE_CONFIG.publishableKey,
          Authorization: `Bearer ${window.SUPABASE_CONFIG.publishableKey}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows[0] && rows[0].data) {
          const data = rows[0].data;
          data.messages = (data.messages || []).filter(m => m.id !== id);
          await fetch(`${window.SUPABASE_CONFIG.url}/rest/v1/portfolio_data?id=eq.${window.SUPABASE_CONFIG.rowId}`, {
            method: "PATCH",
            headers: {
              apikey: window.SUPABASE_CONFIG.publishableKey,
              Authorization: `Bearer ${window.SUPABASE_CONFIG.publishableKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: data, updated_at: new Date().toISOString() })
          });
        }
      }
    } catch (e) {
      console.warn("Could not delete from Supabase:", e);
    }
  }

  renderQueries();
  updateAdminBadgesAndMetrics();
  showToast("Record removed.");
};

if (clearQueriesBtn) {
  clearQueriesBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear all stored visitor queries and appointments?")) {
      localStorage.removeItem("portfolioQueries");
      if (typeof window.clearAllSupabaseMessages === "function") {
        await window.clearAllSupabaseMessages();
      }
      renderQueries();
      updateAdminBadgesAndMetrics();
      showToast("All queries cleared from local and Supabase database.");
    }
  });
}

// -------------------------------------------------------------
// SITE INDEXING & GOOGLE SEARCH CONSOLE MANAGER
// -------------------------------------------------------------
const DEFAULT_SEO_SETTINGS = {
  siteUrl: "https://ais-pre-dvchbkbkhlw33asnf2e35d-963613134071.asia-southeast1.run.app",
  googleSiteVerification: "",
  bingSiteVerification: "",
  pageTitle: "Naveena K | Aspiring VLSI Engineer - ECE Portfolio",
  pageDescription: "Portfolio of Naveena K, an Electronics and Communication Engineering (ECE) student from Chitradurga, Karnataka specializing in VLSI design, Verilog HDL, RTL verification, CMOS circuits, and FPGA prototyping.",
  keywords: "Naveena K, VLSI Engineer, ECE student, Chitradurga, SJMIT, Verilog HDL, RTL Design, FPGA simulation, CMOS, semiconductor"
};

window.getSavedSeoSettings = function() {
  try {
    const raw = localStorage.getItem("portfolioSeo");
    if (raw) {
      return { ...DEFAULT_SEO_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Error reading portfolioSeo from localStorage:", e);
  }
  if (currentContent && currentContent.seo) {
    return { ...DEFAULT_SEO_SETTINGS, ...currentContent.seo };
  }
  return { ...DEFAULT_SEO_SETTINGS };
};

window.loadSeoSettings = function() {
  const seo = window.getSavedSeoSettings();

  const urlInput = document.getElementById("seoSiteUrl");
  if (urlInput) urlInput.value = seo.siteUrl || DEFAULT_SEO_SETTINGS.siteUrl;

  const gMetaInput = document.getElementById("seoGoogleVerification");
  if (gMetaInput) gMetaInput.value = seo.googleSiteVerification || "";

  const bMetaInput = document.getElementById("seoBingVerification");
  if (bMetaInput) bMetaInput.value = seo.bingSiteVerification || "";

  const titleInput = document.getElementById("seoPageTitle");
  if (titleInput) titleInput.value = seo.pageTitle || DEFAULT_SEO_SETTINGS.pageTitle;

  const descInput = document.getElementById("seoPageDescription");
  if (descInput) descInput.value = seo.pageDescription || DEFAULT_SEO_SETTINGS.pageDescription;

  const kwInput = document.getElementById("seoKeywords");
  if (kwInput) kwInput.value = seo.keywords || DEFAULT_SEO_SETTINGS.keywords;

  window.updateSerpPreview();
  window.updateSeoStatusBadges(seo);
};

window.updateSeoStatusBadges = function(seo) {
  const activeUrl = (seo.siteUrl || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");

  const urlDisplay = document.getElementById("statusSiteUrlDisplay");
  if (urlDisplay) urlDisplay.textContent = activeUrl;

  const tagDisplay = document.getElementById("statusGoogleTagDisplay");
  if (tagDisplay) {
    if (seo.googleSiteVerification) {
      tagDisplay.textContent = "Verified (" + seo.googleSiteVerification.substring(0, 12) + "...)";
      tagDisplay.style.color = "#10B981";
    } else {
      tagDisplay.textContent = "Pending Verification Tag";
      tagDisplay.style.color = "#F59E0B";
    }
  }

  const sitemapDisplay = document.getElementById("statusSitemapDisplay");
  if (sitemapDisplay) sitemapDisplay.textContent = "8 Pages Live";

  const sitemapUrlEl = document.getElementById("sitemapUrlDisplay");
  if (sitemapUrlEl) sitemapUrlEl.textContent = `${activeUrl}/sitemap.xml`;

  const robotsUrlEl = document.getElementById("robotsUrlDisplay");
  if (robotsUrlEl) robotsUrlEl.textContent = `${activeUrl}/robots.txt`;
};

window.updateSerpPreview = function() {
  const urlVal = document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl;
  const titleVal = document.getElementById("seoPageTitle")?.value.trim() || DEFAULT_SEO_SETTINGS.pageTitle;
  const descVal = document.getElementById("seoPageDescription")?.value.trim() || DEFAULT_SEO_SETTINGS.pageDescription;

  const serpUrl = document.getElementById("serpPreviewUrl");
  if (serpUrl) serpUrl.textContent = urlVal.replace(/\/+$/, "");

  const serpTitle = document.getElementById("serpPreviewTitle");
  if (serpTitle) serpTitle.textContent = titleVal;

  const serpDesc = document.getElementById("serpPreviewDesc");
  if (serpDesc) serpDesc.textContent = descVal;

  const descCount = document.getElementById("metaDescCount");
  if (descCount) {
    const len = descVal.length;
    descCount.textContent = `${len} / 160 chars`;
    descCount.style.color = len >= 120 && len <= 160 ? "#10B981" : len > 160 ? "#EF4444" : "var(--text-muted)";
  }
};

window.sanitizeGoogleVerificationTag = function() {
  const input = document.getElementById("seoGoogleVerification");
  if (!input) return;
  let val = input.value.trim();

  // If user pasted full <meta ... content="XYZ" ... />
  const match = val.match(/content=["']([^"']+)["']/i);
  if (match && match[1]) {
    val = match[1];
    input.value = val;
    showToast("Extracted verification token from HTML tag.");
  } else if (val.startsWith("google-site-verification=")) {
    val = val.replace("google-site-verification=", "").trim();
    input.value = val;
  }
};

window.saveSeoSettings = function() {
  window.sanitizeGoogleVerificationTag();

  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const googleSiteVerification = document.getElementById("seoGoogleVerification")?.value.trim() || "";
  const bingSiteVerification = document.getElementById("seoBingVerification")?.value.trim() || "";
  const pageTitle = document.getElementById("seoPageTitle")?.value.trim() || DEFAULT_SEO_SETTINGS.pageTitle;
  const pageDescription = document.getElementById("seoPageDescription")?.value.trim() || DEFAULT_SEO_SETTINGS.pageDescription;
  const keywords = document.getElementById("seoKeywords")?.value.trim() || DEFAULT_SEO_SETTINGS.keywords;

  const seoData = {
    siteUrl,
    googleSiteVerification,
    bingSiteVerification,
    pageTitle,
    pageDescription,
    keywords,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem("portfolioSeo", JSON.stringify(seoData));
  } catch (e) {
    console.error("Error saving portfolioSeo to localStorage:", e);
  }

  // Update in-memory content & Supabase database
  currentContent.seo = seoData;
  saveContentToStorage(currentContent, { seo: seoData });

  window.updateSeoStatusBadges(seoData);
  window.updateSerpPreview();

  showToast("SEO & Google Search Indexing settings saved and published!");
};

window.autoDetectSiteUrl = function() {
  const input = document.getElementById("seoSiteUrl");
  if (!input) return;

  let detectedUrl = window.location.origin;
  if (!detectedUrl || detectedUrl.includes("localhost") || detectedUrl.includes("127.0.0.1")) {
    detectedUrl = "https://ais-pre-dvchbkbkhlw33asnf2e35d-963613134071.asia-southeast1.run.app";
  }

  input.value = detectedUrl;
  window.updateSerpPreview();
  showToast(`Auto-detected live URL: ${detectedUrl}`);
};

window.pasteSiteUrlFromClipboard = async function() {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().startsWith("http")) {
        const input = document.getElementById("seoSiteUrl");
        if (input) {
          input.value = text.trim();
          window.updateSerpPreview();
          showToast("Pasted URL from clipboard!");
          return;
        }
      }
    }
  } catch (e) {}

  const manual = prompt("Paste your live site URL here (e.g. https://...):");
  if (manual && manual.trim().startsWith("http")) {
    const input = document.getElementById("seoSiteUrl");
    if (input) {
      input.value = manual.trim();
      window.updateSerpPreview();
      showToast("Pasted URL!");
    }
  }
};

window.copySiteUrlToClipboard = function() {
  const val = document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl;
  navigator.clipboard.writeText(val).then(() => {
    showToast("Site URL copied to clipboard: " + val);
  }).catch(() => {
    prompt("Copy your Site URL:", val);
  });
};

window.copySitemapUrlToClipboard = function() {
  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  navigator.clipboard.writeText(sitemapUrl).then(() => {
    showToast("Sitemap URL copied: " + sitemapUrl);
  }).catch(() => {
    prompt("Copy your Sitemap URL:", sitemapUrl);
  });
};

window.copyRobotsUrlToClipboard = function() {
  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const robotsUrl = `${siteUrl}/robots.txt`;
  navigator.clipboard.writeText(robotsUrl).then(() => {
    showToast("robots.txt URL copied: " + robotsUrl);
  }).catch(() => {
    prompt("Copy your robots.txt URL:", robotsUrl);
  });
};

window.pasteGoogleVerificationFromClipboard = async function() {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const input = document.getElementById("seoGoogleVerification");
        if (input) {
          input.value = text.trim();
          window.sanitizeGoogleVerificationTag();
          showToast("Verification tag pasted from clipboard!");
          return;
        }
      }
    }
  } catch (e) {}

  const manual = prompt("Paste your Google Search Console verification meta tag or token:");
  if (manual && manual.trim()) {
    const input = document.getElementById("seoGoogleVerification");
    if (input) {
      input.value = manual.trim();
      window.sanitizeGoogleVerificationTag();
      showToast("Verification tag pasted!");
    }
  }
};

window.focusSeoField = function(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      el.focus();
      el.style.boxShadow = "0 0 0 3px rgba(15, 98, 254, 0.4)";
      setTimeout(() => { el.style.boxShadow = ""; }, 1500);
    }, 200);
  }
};

window.resetSeoToDefaults = function() {
  if (confirm("Reset all SEO & Site Indexing settings to default verified values?")) {
    localStorage.removeItem("portfolioSeo");
    window.loadSeoSettings();
    showToast("SEO settings restored to defaults.");
  }
};

window.openGoogleSearchConsole = function() {
  window.open("https://search.google.com/search-console/welcome", "_blank", "noopener,noreferrer");
};

window.testGoogleRichResults = function() {
  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const testUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(siteUrl)}`;
  window.open(testUrl, "_blank", "noopener,noreferrer");
};

window.testGooglePageSpeed = function() {
  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const testUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(siteUrl)}`;
  window.open(testUrl, "_blank", "noopener,noreferrer");
};

window.openBingWebmaster = function() {
  window.open("https://www.bing.com/webmasters", "_blank", "noopener,noreferrer");
};

window.downloadSitemapXml = function() {
  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const today = new Date().toISOString().split("T")[0];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/skills.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/papers.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/certificates.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/resume.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  const blob = new Blob([xmlContent], { type: "application/xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sitemap.xml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Downloaded sitemap.xml!");
};

window.downloadRobotsTxt = function() {
  const siteUrl = (document.getElementById("seoSiteUrl")?.value.trim() || DEFAULT_SEO_SETTINGS.siteUrl).replace(/\/+$/, "");
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin.html

Sitemap: ${siteUrl}/sitemap.xml
`;
  const blob = new Blob([robotsContent], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "robots.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Downloaded robots.txt!");
};

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
  });
} else {
  checkAuth();
}
