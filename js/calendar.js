/* ====================================================
   calendar.js v2 — modern calendar with categories
   Used in activities.html
   - Bilingual (TH/EN), TH uses Buddhist year + Thai month names
   - Events stored as date string "YYYY-MM-DD"
   - Click event → opens modal with full detail
   - Category color coding + filter + upcoming events sidebar
   - Source: ปฏิทินกิจกรรมพัฒนานักศึกษา ภาคเรียนที่ 2/2568 และปีการศึกษา 2569
     คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ ราชวิทยาลัยจุฬาภรณ์
   ==================================================== */

(function () {
  'use strict';

  // ===== DOM refs =====
  const calGrid       = document.getElementById('calGrid');
  const calLabel      = document.getElementById('calLabel');
  const prevBtn       = document.getElementById('prevMonth');
  const nextBtn       = document.getElementById('nextMonth');
  const todayBtn      = document.getElementById('todayBtn');
  const catFilterBar  = document.getElementById('catFilterBar');
  const upcomingList  = document.getElementById('upcomingList');
  const legendList    = document.getElementById('legendList');
  const eventModal    = document.getElementById('eventModal');
  const eventModalContent = document.getElementById('eventModalContent');

  if (!calGrid || !calLabel) return;

  /* ====== EVENT DATA — เพิ่ม/แก้ไขกิจกรรมได้ที่นี่ ====== */
  const EVENTS = {
    /* ===== ปีการศึกษา 2569 (ตามปฏิทินกิจกรรมพัฒนานักศึกษา คณะ HST) ===== */
    "2026-07-20": {
      th: { title: "ทำบุญตักบาตร & ปฐมนิเทศนักศึกษาใหม่ ราชวิทยาลัยจุฬาภรณ์ ปีการศึกษา 2569", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "ปฐมนิเทศ / รับน้อง" },
      en: { title: "Merit-making & CRA Freshman Orientation 2026", time: "All day", place: "Chulabhorn Royal Academy", category: "Orientation / Welcome" }
    },
    "2026-07-23": {
      th: { title: "รับน้องเข้าหอพักนักศึกษา ราชวิทยาลัยจุฬาภรณ์ 2569", time: "ตลอดวัน", place: "หอพักนักศึกษา ราชวิทยาลัยจุฬาภรณ์", category: "ปฐมนิเทศ / รับน้อง" },
      en: { title: "Dormitory Welcome for New Students, CRA 2026", time: "All day", place: "CRA Student Dormitory", category: "Orientation / Welcome" }
    },
    "2026-08-01": {
      th: { title: "กิจกรรมแรกพบเด็กพ่อ CRA'69", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "ปฐมนิเทศ / รับน้อง" },
      en: { title: "First Meet — CRA'69 Freshmen", time: "All day", place: "Chulabhorn Royal Academy", category: "Orientation / Welcome" }
    },
    "2026-08-03": {
      th: { title: "เปิดภาคการศึกษาที่ 1/2569", time: "—", place: "—", category: "ปฏิทินการศึกษา" },
      en: { title: "Start of Semester 1/2026", time: "—", place: "—", category: "Academic Calendar" }
    },
    "2026-08-05": {
      th: { title: "โครงการปฐมนิเทศนักศึกษาใหม่และแรกพบน้องพี่ (First Meet HST)", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "ปฐมนิเทศ / รับน้อง" },
      en: { title: "First Meet HST — New Student Orientation", time: "All day", place: "Faculty of Health Science Technology", category: "Orientation / Welcome" }
    },
    "2026-08-15": {
      th: { title: "โครงการสานสัมพันธ์จุฬาภรณ์ รุ่นที่ 10 (วันที่ 1/2)", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "ค่าย / สัมพันธ์" },
      en: { title: "Chulabhorn Bonding Camp Gen 10 (Day 1/2)", time: "All day", place: "Chulabhorn Royal Academy", category: "Camp / Bonding" }
    },
    "2026-08-16": {
      th: { title: "โครงการสานสัมพันธ์จุฬาภรณ์ รุ่นที่ 10 (วันที่ 2/2)", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "ค่าย / สัมพันธ์" },
      en: { title: "Chulabhorn Bonding Camp Gen 10 (Day 2/2)", time: "All day", place: "Chulabhorn Royal Academy", category: "Camp / Bonding" }
    },
    "2026-08-19": {
      th: { title: "พิธีมอบเสื้อกาวน์และชุดปฏิบัติงาน คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "พิธีการ" },
      en: { title: "White Coat & Uniform Ceremony — Faculty of HST", time: "All day", place: "Faculty of Health Science Technology", category: "Ceremony" }
    },
    "2026-08-22": {
      th: { title: "โครงการจิตอาสา \"สานอาสาจุฬาภรณ์\" กิจกรรมช่างไม้จิตอาสา (วันที่ 1/2)", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "จิตอาสา / บำเพ็ญประโยชน์" },
      en: { title: "Chulabhorn Volunteer — Carpentry Service (Day 1/2)", time: "All day", place: "Chulabhorn Royal Academy", category: "Volunteer" }
    },
    "2026-08-29": {
      th: { title: "โครงการจิตอาสา \"สานอาสาจุฬาภรณ์\" กิจกรรมช่างไม้จิตอาสา (วันที่ 2/2)", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "จิตอาสา / บำเพ็ญประโยชน์" },
      en: { title: "Chulabhorn Volunteer — Carpentry Service (Day 2/2)", time: "All day", place: "Chulabhorn Royal Academy", category: "Volunteer" }
    },
    "2026-09-03": {
      th: { title: "พิธีพระราชทานโอวาทนักศึกษาใหม่ ปีการศึกษา 2569", time: "ตลอดวัน", place: "ราชวิทยาลัยจุฬาภรณ์", category: "พิธีการ" },
      en: { title: "Royal Address for New Students 2026", time: "All day", place: "Chulabhorn Royal Academy", category: "Ceremony" }
    },
    "2026-09-23": {
      th: { title: "โครงการไหว้ครู คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "พิธีการ" },
      en: { title: "Wai Khru Ceremony — Faculty of HST", time: "All day", place: "Faculty of Health Science Technology", category: "Ceremony" }
    },
    "2026-10-01": {
      th: { title: "โครงการเปิดบ้าน (Open House) คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ ร่วมกับฝ่ายประชาสัมพันธ์และการตลาด รจภ. (เดือนตุลาคม — รอกำหนดวัน)", time: "—", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "ประชาสัมพันธ์" },
      en: { title: "HST Open House (with CRA PR & Marketing) — October, date TBA", time: "—", place: "Faculty of Health Science Technology", category: "PR / Outreach" }
    },
    "2026-10-17": {
      th: { title: "การแข่งขันกีฬาสานสัมพันธ์ HST (1st HST Game) (วันที่ 1/2)", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "กีฬา" },
      en: { title: "1st HST Game — Sports & Bonding (Day 1/2)", time: "All day", place: "Faculty of Health Science Technology", category: "Sports" }
    },
    "2026-10-18": {
      th: { title: "การแข่งขันกีฬาสานสัมพันธ์ HST (1st HST Game) (วันที่ 2/2)", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "กีฬา" },
      en: { title: "1st HST Game — Sports & Bonding (Day 2/2)", time: "All day", place: "Faculty of Health Science Technology", category: "Sports" }
    },
    "2026-10-28": {
      th: { title: "โครงการเรียนรู้ AI เพื่อปรับตัวสู่โลกใหม่ เสริมทักษะในยุคดิจิทัล", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "วิชาการ" },
      en: { title: "Learning AI for the New World — Digital Skills Workshop", time: "All day", place: "Faculty of Health Science Technology", category: "Academic" }
    },
    "2026-12-07": {
      th: { title: "ปิดภาคการศึกษาที่ 1/2569", time: "—", place: "—", category: "ปฏิทินการศึกษา" },
      en: { title: "End of Semester 1/2026", time: "—", place: "—", category: "Academic Calendar" }
    },

    /* ===== ภาคเรียนที่ 2/2569 (พ.ศ. 2570 = ค.ศ. 2027) ===== */
    "2027-01-04": {
      th: { title: "เปิดภาคการศึกษาที่ 2/2569", time: "—", place: "—", category: "ปฏิทินการศึกษา" },
      en: { title: "Start of Semester 2/2026", time: "—", place: "—", category: "Academic Calendar" }
    },
    "2027-01-06": {
      th: { title: "โครงการจิตอาสาเพื่อชุมชน สโมสรนักศึกษาคณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", time: "ตลอดวัน", place: "ชุมชนเครือข่าย", category: "จิตอาสา / บำเพ็ญประโยชน์" },
      en: { title: "Community Volunteer Project by HST Student Association", time: "All day", place: "Partner Community", category: "Volunteer" }
    },
    "2027-01-13": {
      th: { title: "โครงการพัฒนาบุคลิกภาพและการสร้างภาพลักษณ์เพื่อเสริมความมั่นใจสู่ความเป็นมืออาชีพ", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "พัฒนาตนเอง" },
      en: { title: "Personality Development & Professional Image Building", time: "All day", place: "Faculty of Health Science Technology", category: "Self-development" }
    },
    "2027-02-10": {
      th: { title: "โครงการส่งเสริมพัฒนานักศึกษาเพื่อสืบสานและรักษาศิลปวัฒนธรรม สโมสรนักศึกษา HST", time: "ตลอดวัน", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "ศิลปวัฒนธรรม" },
      en: { title: "Student Development for Cultural Preservation by HST Student Association", time: "All day", place: "Faculty of Health Science Technology", category: "Arts & Culture" }
    },
    "2027-04-30": {
      th: { title: "โครงการปัจฉิมนิเทศนักศึกษา ประจำปีการศึกษา 2569 (เมษายน – พฤษภาคม 2570)", time: "—", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "พิธีการ" },
      en: { title: "Senior Farewell Ceremony — Academic Year 2026 (Apr–May 2027)", time: "—", place: "Faculty of Health Science Technology", category: "Ceremony" }
    },
    "2027-05-10": {
      th: { title: "ปิดภาคการศึกษาที่ 2/2569", time: "—", place: "—", category: "ปฏิทินการศึกษา" },
      en: { title: "End of Semester 2/2026", time: "—", place: "—", category: "Academic Calendar" }
    },
    "2027-05-15": {
      th: { title: "เลือกตั้งสโมสรนักศึกษา ปีการศึกษา 2570 (เดือนพฤษภาคม — รอกำหนดวัน)", time: "—", place: "คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ", category: "เลือกตั้ง" },
      en: { title: "Student Association Election 2027 (May, date TBA)", time: "—", place: "Faculty of Health Science Technology", category: "Election" }
    }
  };

  /* ====== CATEGORY DEFINITIONS ====== */
  const CATEGORIES = {
    academic:    { color: '#2563eb', bg: '#dbeafe', icon: 'fa-graduation-cap',     th: 'วิชาการ',           en: 'Academic' },
    ceremony:    { color: '#d97706', bg: '#fef3c7', icon: 'fa-hands-praying',      th: 'พิธีการ',           en: 'Ceremony' },
    meeting:     { color: '#6b7280', bg: '#f3f4f6', icon: 'fa-people-group',       th: 'ประชุม',            en: 'Meeting' },
    election:    { color: '#dc2626', bg: '#fee2e2', icon: 'fa-square-poll-vertical', th: 'เลือกตั้ง',        en: 'Election' },
    camp:        { color: '#7c3aed', bg: '#ede9fe', icon: 'fa-campground',         th: 'ค่าย/สัมพันธ์',     en: 'Camp / Bonding' },
    volunteer:   { color: '#16a34a', bg: '#dcfce7', icon: 'fa-hand-holding-heart', th: 'จิตอาสา',           en: 'Volunteer' },
    orientation: { color: '#0891b2', bg: '#cffafe', icon: 'fa-flag',               th: 'ปฐมนิเทศ/รับน้อง',  en: 'Orientation / Welcome' },
    culture:     { color: '#db2777', bg: '#fce7f3', icon: 'fa-palette',            th: 'ศิลปวัฒนธรรม',      en: 'Arts & Culture' },
    development: { color: '#059669', bg: '#d1fae5', icon: 'fa-user-graduate',      th: 'พัฒนาตนเอง',        en: 'Self-Development' },
    pr:          { color: '#9333ea', bg: '#f3e8ff', icon: 'fa-bullhorn',           th: 'ประชาสัมพันธ์',     en: 'PR / Outreach' },
    academic_cal:{ color: '#475569', bg: '#e2e8f0', icon: 'fa-calendar-days',      th: 'ปฏิทินการศึกษา',    en: 'Academic Calendar' },
    sports:      { color: '#ea580c', bg: '#ffedd5', icon: 'fa-medal',              th: 'กีฬา',              en: 'Sports' },
    other:       { color: '#0c3b2e', bg: '#fef9c3', icon: 'fa-circle-info',        th: 'อื่นๆ',             en: 'Other' }
  };

  // Auto-classify a category string into our keys
  function getCategoryKey(catStr) {
    const s = (catStr || '').toLowerCase();
    if (s.includes('ปฏิทินการศึกษา') || s.includes('academic calendar')) return 'academic_cal';
    if (s.includes('ปฐมนิเทศ') || s.includes('รับน้อง') || s.includes('orientation') || s.includes('welcome')) return 'orientation';
    if (s.includes('วิชาการ') || (s.includes('academic') && !s.includes('calendar'))) return 'academic';
    if (s.includes('พิธีการ') || s.includes('ceremony')) return 'ceremony';
    if (s.includes('ประชุม') || s.includes('meeting')) return 'meeting';
    if (s.includes('เลือกตั้ง') || s.includes('election')) return 'election';
    if (s.includes('กีฬา') || s.includes('sport')) return 'sports';
    if (s.includes('ค่าย') || s.includes('สัมพันธ์') || s.includes('camp') || s.includes('bonding')) return 'camp';
    if (s.includes('จิตอาสา') || s.includes('บำเพ็ญ') || s.includes('volunteer')) return 'volunteer';
    if (s.includes('ศิลปวัฒนธรรม') || s.includes('arts') || s.includes('culture')) return 'culture';
    if (s.includes('พัฒนาตนเอง') || s.includes('self-development') || s.includes('development')) return 'development';
    if (s.includes('ประชาสัมพันธ์') || s.includes('pr ') || s.includes('outreach')) return 'pr';
    return 'other';
  }

  /* ====== STATE ====== */
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-based
  let activeFilter = 'all';

  const TH_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const TH_MONTHS_SHORT = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const EN_MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function pad(n){ return n.toString().padStart(2,'0'); }
  function dateKey(y,m,d){ return `${y}-${pad(m+1)}-${pad(d)}`; }
  function currentLang(){
    return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'th';
  }
  function escapeHtml(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Strip parenthetical extras and trim for calendar cell display
  function shortTitle(t) {
    if (!t) return '';
    return t.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  }

  /* ====== CATEGORY FILTER BAR ====== */
  function renderFilterBar() {
    const lang = currentLang();
    // Find which categories actually appear in EVENTS
    const usedCats = new Set();
    Object.values(EVENTS).forEach(e => {
      usedCats.add(getCategoryKey(e.th.category));
    });

    let html = `<button class="cat-chip ${activeFilter==='all'?'active':''}" data-cat="all">
      <i class="fa-solid fa-layer-group" style="font-size:0.72rem;"></i>
      <span class="th">ทั้งหมด</span><span class="en">All</span>
    </button>`;

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      if (!usedCats.has(key)) return;
      const isActive = activeFilter === key;
      html += `<button class="cat-chip ${isActive?'active':''}" data-cat="${key}"
                 style="--cat-color:${cat.color};${isActive?`background:${cat.color};border-color:${cat.color}`:''}">
                 <span class="cat-dot"></span>
                 <span>${lang==='en' ? cat.en : cat.th}</span>
               </button>`;
    });

    catFilterBar.innerHTML = html;
    catFilterBar.querySelectorAll('.cat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.cat;
        renderFilterBar();
        renderCalendar();
      });
    });
  }

  /* ====== LEGEND ====== */
  function renderLegend() {
    const lang = currentLang();
    const usedCats = new Set();
    Object.values(EVENTS).forEach(e => usedCats.add(getCategoryKey(e.th.category)));

    let html = '';
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      if (!usedCats.has(key)) return;
      html += `<div class="legend-item">
        <span class="legend-swatch" style="--cat-color:${cat.color}"></span>
        <span>${lang==='en' ? cat.en : cat.th}</span>
      </div>`;
    });
    legendList.innerHTML = html;
  }

  /* ====== CALENDAR GRID ====== */
  function renderCalendar() {
    const lang = currentLang();
    const monthNames = lang === 'en' ? EN_MONTHS : TH_MONTHS;
    const yearShown = lang === 'en' ? viewYear : viewYear + 543;
    calLabel.textContent = `${monthNames[viewMonth]} ${yearShown}`;

    calGrid.innerHTML = '';

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const todayD = new Date();
    const isCurrentMonth = todayD.getFullYear() === viewYear && todayD.getMonth() === viewMonth;

    // Leading muted cells
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrev - i;
      const cell = document.createElement('div');
      cell.className = 'cal-cell muted';
      cell.innerHTML = `<span class="day-num">${d}</span>`;
      calGrid.appendChild(cell);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(viewYear, viewMonth, d);
      const ev = EVENTS[key];
      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      let cellMatchesFilter = true;
      if (ev) {
        const catKey = getCategoryKey(ev.th.category);
        cell.classList.add('has-event');
        if (activeFilter !== 'all' && activeFilter !== catKey) {
          cell.classList.add('filtered-out');
          cellMatchesFilter = false;
        }
      }
      if (isCurrentMonth && todayD.getDate() === d) cell.classList.add('today');

      let html = `<span class="day-num">${d}</span>`;
      if (ev) {
        const evLang = ev[lang];
        const catKey = getCategoryKey(ev.th.category);
        const cat = CATEGORIES[catKey];
        const safeTitle = escapeHtml(shortTitle(evLang.title));
        html += `<span class="event-chip"
                       data-key="${key}"
                       style="--cat-color:${cat.color};--cat-bg:${cat.bg}"
                       title="${escapeHtml(evLang.title)}">
                   ${safeTitle}
                 </span>`;
      }
      cell.innerHTML = html;

      // Click event chip → modal
      cell.querySelectorAll('.event-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          openEventModal(chip.dataset.key);
        });
      });

      calGrid.appendChild(cell);
    }

    // Trailing muted cells
    const total = firstDay + daysInMonth;
    const trail = (7 - (total % 7)) % 7;
    for (let i = 1; i <= trail; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell muted';
      cell.innerHTML = `<span class="day-num">${i}</span>`;
      calGrid.appendChild(cell);
    }
  }

  /* ====== UPCOMING EVENTS SIDEBAR ====== */
  function renderUpcoming() {
    const lang = currentLang();
    const now = new Date();
    now.setHours(0,0,0,0);

    const upcoming = Object.keys(EVENTS)
      .map(k => {
        const [y,m,d] = k.split('-').map(Number);
        return { key: k, date: new Date(y, m-1, d) };
      })
      .filter(o => o.date >= now)
      .sort((a,b) => a.date - b.date)
      .slice(0, 5);

    if (upcoming.length === 0) {
      upcomingList.innerHTML = `<div style="padding:18px;text-align:center;color:#9ca3af;font-size:0.88rem;">
        ${lang==='en' ? 'No upcoming events' : 'ยังไม่มีกิจกรรมที่กำหนดไว้'}
      </div>`;
      return;
    }

    let html = '';
    upcoming.forEach(o => {
      const ev = EVENTS[o.key];
      const evLang = ev[lang];
      const catKey = getCategoryKey(ev.th.category);
      const cat = CATEGORIES[catKey];
      const m = o.date.getMonth();
      const daysUntil = Math.round((o.date - now) / 86400000);
      const dayLabel = daysUntil === 0
        ? (lang==='en' ? 'Today' : 'วันนี้')
        : daysUntil === 1
        ? (lang==='en' ? 'Tomorrow' : 'พรุ่งนี้')
        : (lang==='en' ? `in ${daysUntil} days` : `อีก ${daysUntil} วัน`);

      html += `<div class="upcoming-item" data-key="${o.key}"
                    style="--cat-color:${cat.color};--cat-bg:${cat.bg}">
        <div class="upcoming-date">
          <strong>${o.date.getDate()}</strong>
          <span>${lang==='en' ? EN_MONTHS_SHORT[m] : TH_MONTHS_SHORT[m]}</span>
        </div>
        <div class="upcoming-info">
          <h5>${escapeHtml(shortTitle(evLang.title))}</h5>
          <div class="upcoming-meta">
            <i class="fa-solid ${cat.icon}" style="color:${cat.color}"></i>
            <span>${lang==='en' ? cat.en : cat.th}</span>
          </div>
          <span class="upcoming-countdown">${dayLabel}</span>
        </div>
      </div>`;
    });
    upcomingList.innerHTML = html;

    upcomingList.querySelectorAll('.upcoming-item').forEach(item => {
      item.addEventListener('click', () => {
        const key = item.dataset.key;
        // Jump calendar to that month, then open modal
        const [y,m,d] = key.split('-').map(Number);
        viewYear = y;
        viewMonth = m - 1;
        renderCalendar();
        openEventModal(key);
      });
    });
  }

  /* ====== EVENT MODAL ====== */
  function openEventModal(key) {
    const ev = EVENTS[key];
    if (!ev) return;
    const lang = currentLang();
    const evLang = ev[lang];
    const catKey = getCategoryKey(ev.th.category);
    const cat = CATEGORIES[catKey];
    const [y,m,d] = key.split('-').map(Number);
    const dateObj = new Date(y, m-1, d);
    const monthName = lang==='en' ? EN_MONTHS[m-1] : TH_MONTHS[m-1];
    const yearShown = lang==='en' ? y : y + 543;
    const dayNames = lang==='en'
      ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      : ['วันอาทิตย์','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์'];

    // Google Calendar add URL
    const gcalDate = `${y}${pad(m)}${pad(d)}/${y}${pad(m)}${pad(d+1)}`;
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`
      + `&text=${encodeURIComponent(evLang.title)}`
      + `&dates=${gcalDate}`
      + `&details=${encodeURIComponent(`${evLang.category}\nเวลา: ${evLang.time}\nสถานที่: ${evLang.place}`)}`
      + `&location=${encodeURIComponent(evLang.place)}`;

    eventModalContent.style.setProperty('--cat-color', cat.color);
    eventModalContent.style.setProperty('--cat-bg', cat.bg);
    eventModalContent.innerHTML = `
      <div class="event-modal__hero" style="--cat-color:${cat.color}">
        <span class="cat-label">
          <i class="fa-solid ${cat.icon}"></i>
          ${lang==='en' ? cat.en : cat.th}
        </span>
        <h2>${escapeHtml(evLang.title)}</h2>
        <div class="date-big">
          <strong>${d}</strong>
          <span>${monthName} ${yearShown}</span>
        </div>
      </div>
      <div class="event-modal__body">
        <div class="event-modal__row" style="--cat-color:${cat.color};--cat-bg:${cat.bg}">
          <div class="row-icon"><i class="fa-solid fa-calendar-day"></i></div>
          <div class="row-content">
            <strong>${lang==='en' ? 'Day' : 'วัน'}</strong>
            ${dayNames[dateObj.getDay()]}
          </div>
        </div>
        <div class="event-modal__row" style="--cat-color:${cat.color};--cat-bg:${cat.bg}">
          <div class="row-icon"><i class="fa-solid fa-clock"></i></div>
          <div class="row-content">
            <strong>${lang==='en' ? 'Time' : 'เวลา'}</strong>
            ${escapeHtml(evLang.time)}
          </div>
        </div>
        <div class="event-modal__row" style="--cat-color:${cat.color};--cat-bg:${cat.bg}">
          <div class="row-icon"><i class="fa-solid fa-location-dot"></i></div>
          <div class="row-content">
            <strong>${lang==='en' ? 'Location' : 'สถานที่'}</strong>
            ${escapeHtml(evLang.place)}
          </div>
        </div>
        <div class="event-modal__actions">
          <a href="${gcalUrl}" target="_blank" rel="noopener" class="btn btn-solid">
            <i class="fa-brands fa-google"></i>
            <span class="th">เพิ่มลง Google Calendar</span>
            <span class="en">Add to Google Calendar</span>
          </a>
          <button class="btn btn-outline" data-close-modal>
            <span class="th">ปิด</span>
            <span class="en">Close</span>
          </button>
        </div>
      </div>
    `;

    eventModal.classList.add('open');
    eventModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Wire up newly-rendered close buttons
    eventModal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', closeEventModal);
    });
  }

  function closeEventModal() {
    eventModal.classList.remove('open');
    eventModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eventModal.classList.contains('open')) {
      closeEventModal();
    }
  });

  /* ====== NAVIGATION ====== */
  prevBtn && prevBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  nextBtn && nextBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });
  todayBtn && todayBtn.addEventListener('click', () => {
    const t = new Date();
    viewYear = t.getFullYear();
    viewMonth = t.getMonth();
    renderCalendar();
  });

  // Re-render when language toggles
  document.querySelectorAll('[data-lang-btn]').forEach(b => {
    b.addEventListener('click', () => setTimeout(() => {
      renderFilterBar();
      renderCalendar();
      renderUpcoming();
      renderLegend();
      renderYearActivities();
    }, 30));
  });

  /* ====================================================
     YEAR-ROUND ACTIVITIES LIST
     Renders the "โครงการและกิจกรรมตลอดปี" section by
     pulling directly from EVENTS data — keeps the
     page in sync with the calendar automatically.
     ==================================================== */
  let activeYearFilter = 'all';   // 'all' | '2/2568' | '1/2569' | '2/2569'
  let currentPage = 1;            // current pagination page (1-based)
  const PAGE_SIZE = 6;            // cards per page

  // Semester windows (academic-year buckets)
  // Each event is bucketed by where its date falls.
  const SEMESTERS = [
    { id: '2/2568', th: 'ภาคเรียนที่ 2/2568', en: 'Semester 2/2025', from: '2026-01-01', to: '2026-05-15' },
    { id: '1/2569', th: 'ภาคเรียนที่ 1/2569', en: 'Semester 1/2026', from: '2026-05-16', to: '2026-12-31' },
    { id: '2/2569', th: 'ภาคเรียนที่ 2/2569', en: 'Semester 2/2026', from: '2027-01-01', to: '2027-12-31' }
  ];
  function semesterOf(key) {
    for (const s of SEMESTERS) {
      if (key >= s.from && key <= s.to) return s.id;
    }
    return null;
  }

  function renderYearFilterBar() {
    const container = document.getElementById('yearFilterBar');
    if (!container) return;
    const lang = currentLang();

    let html = `<button class="year-chip ${activeYearFilter==='all'?'active':''}" data-year="all">
      <i class="fa-solid fa-calendar"></i>
      <span class="th"> ทั้งหมด</span><span class="en"> All</span>
    </button>`;

    SEMESTERS.forEach(s => {
      const has = Object.keys(EVENTS).some(k => semesterOf(k) === s.id);
      if (!has) return;
      const isActive = activeYearFilter === s.id;
      html += `<button class="year-chip ${isActive?'active':''}" data-year="${s.id}">
        ${lang==='en' ? s.en : s.th}
      </button>`;
    });

    container.innerHTML = html;
    container.querySelectorAll('.year-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeYearFilter = btn.dataset.year;
        currentPage = 1;                     // reset to first page on filter change
        renderYearFilterBar();
        renderYearActivities();
      });
    });
  }

  function renderYearActivities() {
    const container = document.getElementById('yearActivities');
    if (!container) return;
    const lang = currentLang();

    // Sort all events chronologically and apply semester filter
    const sorted = Object.keys(EVENTS).sort().filter(k => {
      if (activeYearFilter === 'all') return true;
      return semesterOf(k) === activeYearFilter;
    });

    if (sorted.length === 0) {
      container.innerHTML = `<div class="activities-empty">
        ${lang==='en' ? 'No activities in this period' : 'ไม่มีกิจกรรมในช่วงนี้'}
      </div>`;
      renderPagination(0);
      return;
    }

    // ===== Pagination slicing =====
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;   // clamp
    if (currentPage < 1) currentPage = 1;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageKeys = sorted.slice(startIdx, startIdx + PAGE_SIZE);

    let html = '';
    pageKeys.forEach(key => {
      const ev = EVENTS[key];
      const evLang = ev[lang];
      const [y, m, d] = key.split('-').map(Number);
      const catKey = getCategoryKey(ev.th.category);
      const cat = CATEGORIES[catKey];

      const monthShort = lang === 'en' ? EN_MONTHS_SHORT[m-1] : TH_MONTHS_SHORT[m-1];
      const yearTag = lang === 'en' ? y : (y + 543);

      html += `<div class="activity-card"
                    data-key="${key}"
                    style="--cat-color:${cat.color};--cat-bg:${cat.bg};">
        <div class="activity-date">
          <strong>${d}</strong>
          <span>${monthShort}</span>
          <span class="year-tag">${yearTag}</span>
        </div>
        <div class="activity-info">
          <h3>${escapeHtml(evLang.title)}</h3>
          <span class="activity-cat-line">
            <i class="fa-solid ${cat.icon}"></i>
            ${escapeHtml(evLang.category)}
          </span>
          <div class="activity-meta">
            <span><i class="fa-solid fa-clock"></i> ${escapeHtml(evLang.time)}</span>
            <span class="activity-meta-truncate" title="${escapeHtml(evLang.place)}">
              <i class="fa-solid fa-location-dot"></i> ${escapeHtml(evLang.place)}
            </span>
          </div>
        </div>
      </div>`;
    });

    container.innerHTML = html;

    // Click card → open modal
    container.querySelectorAll('.activity-card').forEach(card => {
      card.addEventListener('click', () => {
        openEventModal(card.dataset.key);
      });
    });

    renderPagination(sorted.length);
  }

  function renderPagination(total) {
    const nav = document.getElementById('activityPagination');
    if (!nav) return;
    const lang = currentLang();

    if (total <= PAGE_SIZE) {
      nav.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(total / PAGE_SIZE);

    // Build window of page numbers, with ellipses when needed:
    //   1 … 4 5 [6] 7 8 … 12
    function pageWindow() {
      const pages = new Set();
      pages.add(1);
      pages.add(totalPages);
      for (let p = currentPage - 1; p <= currentPage + 1; p++) {
        if (p >= 1 && p <= totalPages) pages.add(p);
      }
      const sortedPages = [...pages].sort((a,b) => a - b);
      const result = [];
      for (let i = 0; i < sortedPages.length; i++) {
        result.push(sortedPages[i]);
        if (i < sortedPages.length - 1 && sortedPages[i+1] - sortedPages[i] > 1) {
          result.push('…');
        }
      }
      return result;
    }

    const startIdx = (currentPage - 1) * PAGE_SIZE + 1;
    const endIdx = Math.min(currentPage * PAGE_SIZE, total);

    let html = '';

    // Prev button
    html += `<button data-page="prev" ${currentPage===1?'disabled':''} aria-label="Previous page">
      <i class="fa-solid fa-chevron-left"></i>
      <span class="page-label">${lang==='en'?'Prev':'ก่อนหน้า'}</span>
    </button>`;

    // Page numbers
    pageWindow().forEach(p => {
      if (p === '…') {
        html += `<span class="page-ellipsis">…</span>`;
      } else {
        html += `<button data-page="${p}" class="${p===currentPage?'active':''}"
                  aria-label="Page ${p}" ${p===currentPage?'aria-current="page"':''}>${p}</button>`;
      }
    });

    // Next button
    html += `<button data-page="next" ${currentPage===totalPages?'disabled':''} aria-label="Next page">
      <span class="page-label">${lang==='en'?'Next':'ถัดไป'}</span>
      <i class="fa-solid fa-chevron-right"></i>
    </button>`;

    // Info row
    html += `<div class="pagination-info">
      ${lang==='en'
        ? `Showing ${startIdx}–${endIdx} of ${total} activities · page ${currentPage} of ${totalPages}`
        : `แสดงรายการที่ ${startIdx}–${endIdx} จากทั้งหมด ${total} กิจกรรม · หน้า ${currentPage} จาก ${totalPages}`}
    </div>`;

    nav.innerHTML = html;

    nav.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.page;
        if (action === 'prev') currentPage = Math.max(1, currentPage - 1);
        else if (action === 'next') currentPage = Math.min(totalPages, currentPage + 1);
        else currentPage = parseInt(action, 10);
        renderYearActivities();
        // Smooth-scroll to top of the activities list
        const sec = document.getElementById('yearActivities');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ====== INITIAL RENDER ====== */
  renderFilterBar();
  renderCalendar();
  renderUpcoming();
  renderLegend();
  renderYearFilterBar();
  renderYearActivities();

})();
