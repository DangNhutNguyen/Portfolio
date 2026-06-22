(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;
  var currentLang = 'en';

  /* ---------------------------- i18n dictionary ---------------------------- */
  var dict = {
    nav_about: { en: 'About', vi: 'Giới thiệu' },
    nav_education: { en: 'Education', vi: 'Học vấn' },
    nav_research: { en: 'Research', vi: 'Nghiên cứu' },
    nav_projects: { en: 'Projects', vi: 'Dự án' },
    nav_honors: { en: 'Honors', vi: 'Giải thưởng' },
    nav_skills: { en: 'Skills', vi: 'Kỹ năng' },
    nav_leadership: { en: 'Leadership', vi: 'Lãnh đạo' },
    nav_contact: { en: 'Contact', vi: 'Liên hệ' },
    tab_home: { en: 'Home', vi: 'Trang chủ' },
    tab_education: { en: 'Education', vi: 'Học vấn' },
    tab_projects: { en: 'Projects', vi: 'Dự án' },
    tab_more: { en: 'More', vi: 'Thêm' },
    more_title: { en: 'More', vi: 'Thêm' },
    btn_view_details: { en: 'View details', vi: 'Xem chi tiết' },
    hero_eyebrow: { en: 'Academic Portfolio', vi: 'Hồ Sơ Học Thuật' },
    eyebrow_about: { en: 'About', vi: 'Giới Thiệu' },
    h2_about: { en: 'Profile', vi: 'Hồ Sơ' },
    eyebrow_education: { en: 'Academic Record', vi: 'Thành Tích Học Tập' },
    h2_education: { en: 'Education', vi: 'Học Vấn' },
    eyebrow_research: { en: 'In Practice', vi: 'Trải Nghiệm Thực Tế' },
    h2_research: { en: 'Research Experience', vi: 'Kinh Nghiệm Nghiên Cứu' },
    eyebrow_projects: { en: 'Selected Builds', vi: 'Dự Án Tiêu Biểu' },
    h2_projects: { en: 'Projects', vi: 'Dự Án' },
    eyebrow_honors: { en: 'Recognition', vi: 'Ghi Nhận' },
    h2_honors: { en: 'Honors &amp; Awards', vi: 'Giải Thưởng &amp; Thành Tích' },
    eyebrow_skills: { en: 'Capabilities', vi: 'Năng Lực' },
    h2_skills: { en: 'Skills', vi: 'Kỹ Năng' },
    eyebrow_leadership: { en: 'Leadership', vi: 'Hoạt Động & Lãnh Đạo' },
    h2_leadership: { en: 'Extracurricular &amp; Leadership', vi: 'Hoạt Động Ngoại Khóa &amp; Lãnh Đạo' },
    eyebrow_contact: { en: 'Get in touch', vi: 'Liên Hệ' },
    chip_gpa_label: { en: 'Grade 12 GPA', vi: 'GPA Lớp 12' },
    chip_ai_label: { en: 'AI Research', vi: 'Nghiên cứu AI' },
    chip_citizenship_label: { en: 'Citizenship', vi: 'Quốc tịch' },
    chip_citizenship_val: { en: 'Vietnam', vi: 'Việt Nam' }
  };

  var tickerWords = {
    en: ['Mathematics', 'Physics', 'Artificial Intelligence', 'Combinatorics', 'Renewable Energy', 'Probability Theory'],
    vi: ['Toán Học', 'Vật Lý', 'Trí Tuệ Nhân Tạo', 'Tổ Hợp', 'Năng Lượng Tái Tạo', 'Lý Thuyết Xác Suất']
  };
  var tickerIndex = 0;
  var tickerEl = document.getElementById('tickerText');
  function showTicker() { tickerEl.textContent = tickerWords[currentLang][tickerIndex % tickerWords[currentLang].length]; }
  showTicker();
  if (!reduceMotion) {
    setInterval(function () {
      tickerEl.style.opacity = 0;
      tickerEl.style.transform = 'translateY(6px)';
      setTimeout(function () {
        tickerIndex++;
        showTicker();
        tickerEl.style.opacity = 1;
        tickerEl.style.transform = 'translateY(0)';
      }, 260);
    }, 2400);
  } else {
    tickerEl.textContent = tickerWords[currentLang].join(' · ');
  }

  function applyLang(lang) {
    currentLang = lang;
    html.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key][lang];
    });
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll('.lang-opt').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });
    var pill = document.getElementById('langPill');
    pill.style.transform = lang === 'en' ? 'translateX(30px)' : 'translateX(0)';
    if (!reduceMotion) showTicker();
    if (openProjectKey) openModal(openProjectKey);
  }

  document.getElementById('langToggle').addEventListener('click', function (e) {
    var opt = e.target.closest ? e.target.closest('.lang-opt') : null;
    var lang = (opt && opt.getAttribute('data-lang')) || (currentLang === 'vi' ? 'en' : 'vi');
    applyLang(lang);
  });

  /* ---------------------------- theme ---------------------------- */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    var metaTheme = document.querySelector('meta[name="theme-color"]');

    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        theme === 'dark' ? '#12131b' : '#f6f3ec'
      );
    }
  }

  applyTheme('light');

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  document.getElementById('themeToggle').addEventListener('click', function () {
    const next =
      html.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';

    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  /* ---------------------------- reveal on scroll + GPA bars ---------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  function fillBars(scope) {
    var bars = scope.querySelectorAll ? scope.querySelectorAll('.gbar-fill') : [];
    bars.forEach(function (b) { b.style.width = b.getAttribute('data-width'); });
  }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('show'); fillBars(el); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fillBars(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------- tab bar ---------------------------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-target');
      if (target === '#more') { openMore(); return; }
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
  var spyTargets = [
    { sel: '#top', btn: document.querySelector('.tab-btn[data-target="#top"]') },
    { sel: '#education', btn: document.querySelector('.tab-btn[data-target="#education"]') },
    { sel: '#projects', btn: document.querySelector('.tab-btn[data-target="#projects"]') }
  ];
  if ('IntersectionObserver' in window) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = spyTargets.find(function (t) { return document.querySelector(t.sel) === entry.target; });
          if (match) {
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            match.btn.classList.add('active');
          }
        }
      });
    }, { threshold: 0.5 });
    spyTargets.forEach(function (t) {
      var el = document.querySelector(t.sel);
      if (el) spyObs.observe(el);
    });
  }

  /* ---------------------------- more sheet ---------------------------- */
  var moreOverlay = document.getElementById('moreOverlay');
  function openMore() { moreOverlay.classList.add('show'); document.body.classList.add('no-scroll'); }
  function closeMore() { moreOverlay.classList.remove('show'); document.body.classList.remove('no-scroll'); }
  document.getElementById('moreClose').addEventListener('click', closeMore);
  moreOverlay.addEventListener('click', function (e) { if (e.target === moreOverlay) closeMore(); });
  document.querySelectorAll('.more-links a').forEach(function (a) { a.addEventListener('click', closeMore); });

  /* ---------------------------- project modal ---------------------------- */
  var projectData = {
    focumia: {
      title: { en: 'Focumia', vi: 'Focumia' },
      year: { en: '2025 — Present', vi: '2025 — Hiện tại' },
      tags: { en: ['Productivity Systems', 'Personal Tooling', 'Workflow Design'], vi: ['Hệ Thống Năng Suất', 'Công Cụ Cá Nhân', 'Thiết Kế Quy Trình'] },
      summary: {
        en: 'A productivity-focused application for concentration management, task organization, and daily workflow efficiency.',
        vi: 'Một ứng dụng tập trung vào năng suất, hỗ trợ quản lý sự tập trung, tổ chức công việc và hiệu quả làm việc hàng ngày.'
      },
      detail: {
        en: 'Focumia grew out of a simple need: a lightweight way to structure attention across study and research sessions. The project explores how small, deliberate constraints — timers, task hierarchies, daily rituals — can lower the friction of starting and sustaining deep work. It is an ongoing build, shaped by what actually holds up under a real workload.',
        vi: 'Focumia xuất phát từ một nhu cầu đơn giản: một công cụ gọn nhẹ giúp duy trì sự tập trung trong các buổi học và nghiên cứu kéo dài. Dự án tìm hiểu cách những giới hạn nhỏ và có chủ đích — bộ đếm thời gian, phân cấp công việc, các thói quen hàng ngày — có thể giảm bớt khó khăn khi bắt đầu và duy trì trạng thái tập trung sâu. Đây là một dự án đang được phát triển liên tục, hoàn thiện dựa trên những gì thực sự hiệu quả trong khối lượng công việc thực tế.'
      },
      link: 'https://github.com/DangNhutNguyen/Focumia',
      linktext: { en: 'View repository ↗', vi: 'Xem repository ↗' }
    },
    promptea: {
      title: { en: 'PrompTEA', vi: 'PrompTEA' },
      year: { en: '2025', vi: '2025' },
      tags: { en: ['Prompt Engineering', 'LLM Tooling', 'Learning Support'], vi: ['Kỹ Thuật Prompt', 'Công Cụ LLM', 'Hỗ Trợ Học Tập'] },
      summary: {
        en: 'An AI-assisted exploration of prompt engineering, learning support, and workflow automation with large language models.',
        vi: 'Một dự án có hỗ trợ AI khám phá kỹ thuật prompt, hỗ trợ học tập, và tự động hóa quy trình làm việc với các mô hình ngôn ngữ lớn.'
      },
      detail: {
        en: 'PrompTEA treats prompting as a craft worth studying directly — testing instructions, structures, and feedback loops that shape how useful a language model actually is for learning and research support. The goal was to move past surface-level convenience and understand what makes AI assistance genuinely effective for study workflows.',
        vi: 'PrompTEA xem việc thiết kế prompt như một kỹ năng đáng được nghiên cứu nghiêm túc — thử nghiệm các cấu trúc, hướng dẫn, và vòng phản hồi nhằm xác định điều gì khiến một mô hình ngôn ngữ thực sự hữu ích cho việc học và hỗ trợ nghiên cứu. Mục tiêu là hiểu rõ điều gì làm cho sự hỗ trợ của AI trở nên hiệu quả thực sự trong quy trình học tập.'
      },
      link: 'https://github.com/DangNhutNguyen/PrompTEA',
      linktext: { en: 'View repository ↗', vi: 'Xem repository ↗' }
    },
    nnscratch: {
      title: { en: 'Neural Network from Scratch', vi: 'Neural Network from Scratch' },
      year: { en: '2024', vi: '2024' },
      tags: { en: ['Machine Learning', 'Backpropagation', 'Python'], vi: ['Học Máy', 'Lan Truyền Ngược', 'Python'] },
      summary: {
        en: 'Implemented neural networks from first principles to study machine learning fundamentals, backpropagation, and optimization methods.',
        vi: 'Xây dựng mạng nơ-ron từ những nguyên lý cơ bản để tìm hiểu nền tảng học máy, lan truyền ngược, và các phương pháp tối ưu hóa.'
      },
      detail: {
        en: 'Rather than relying on existing machine learning frameworks, this project rebuilds a neural network from its mathematical foundations — forward propagation, gradient computation, and backpropagation — to make the underlying optimization process fully visible. The goal was understanding, not convenience: seeing exactly how a network learns rather than treating it as a black box.',
        vi: 'Thay vì sử dụng các framework học máy có sẵn, dự án này xây dựng lại một mạng nơ-ron từ nền tảng toán học của nó — lan truyền tiến, tính toán đạo hàm, và lan truyền ngược — để toàn bộ quá trình tối ưu hóa trở nên minh bạch. Mục tiêu là sự hiểu biết, không phải sự tiện lợi: nhìn thấy chính xác cách một mạng nơ-ron học, thay vì xem nó như một hộp đen.'
      },
      link: 'https://github.com/DangNhutNguyen/Neural-Network-from-Scratch',
      linktext: { en: 'View repository ↗', vi: 'Xem repository ↗' }
    },
    mnist: {
      title: { en: 'MNIST Neural Network Training', vi: 'MNIST Neural Network Training' },
      year: { en: '2024', vi: '2024' },
      tags: { en: ['Computer Vision', 'Model Optimization', 'MNIST'], vi: ['Thị Giác Máy Tính', 'Tối Ưu Hóa Mô Hình', 'MNIST'] },
      summary: {
        en: 'Trained machine learning models for handwritten digit recognition on the MNIST dataset, exploring model optimization techniques.',
        vi: 'Huấn luyện các mô hình học máy để nhận diện chữ số viết tay trên tập dữ liệu MNIST, đồng thời tìm hiểu các kỹ thuật tối ưu hóa mô hình.'
      },
      detail: {
        en: 'Building on the neural-network-from-scratch work, this project applies the same fundamentals to a concrete benchmark: classifying handwritten digits from the MNIST dataset. The focus was on iterating across training runs, comparing optimization choices, and developing intuition for how architecture and hyperparameters affect a model\u2019s ability to generalize.',
        vi: 'Tiếp nối dự án xây dựng mạng nơ-ron từ đầu, dự án này áp dụng những nguyên lý tương tự vào một bài toán cụ thể: phân loại chữ số viết tay từ tập dữ liệu MNIST. Trọng tâm là lặp lại qua nhiều lần huấn luyện, so sánh các lựa chọn tối ưu hóa, và phát triển trực giác về cách kiến trúc và siêu tham số ảnh hưởng đến khả năng tổng quát hóa của mô hình.'
      },
      link: 'https://github.com/DangNhutNguyen/MNIST-TRAINING',
      linktext: { en: 'View repository ↗', vi: 'Xem repository ↗' }
    },
    airesearch: {
      title: { en: 'AI Applications for Research Efficiency', vi: 'Ứng Dụng AI cho Hiệu Quả Nghiên Cứu' },
      year: { en: '2024 — Present', vi: '2024 — Hiện tại' },
      tags: { en: ['Research Workflow', 'Information Synthesis'], vi: ['Quy Trình Nghiên Cứu', 'Tổng Hợp Thông Tin'] },
      summary: {
        en: 'Used AI tools to improve research efficiency, information synthesis, and time-optimized workflow management.',
        vi: 'Sử dụng các công cụ AI để nâng cao hiệu quả nghiên cứu, tổng hợp thông tin, và quản lý quy trình làm việc tối ưu về thời gian.'
      },
      detail: {
        en: 'An ongoing, informal line of work rather than a single deliverable: testing how AI tools can be folded into everyday research habits — synthesizing reading, organizing notes, and surfacing connections across material that would otherwise take far longer to work through by hand.',
        vi: 'Chủ động thử nghiệm việc tích hợp các công cụ AI vào quy trình nghiên cứu cá nhân, từ tổng hợp tài liệu và quản lý ghi chú đến khám phá các kết nối giữa những nguồn thông tin khác nhau. Đây là một quá trình học hỏi liên tục về cách sử dụng công nghệ để nâng cao hiệu quả tư duy và nghiên cứu.'
      },
      link: null
    },
    solar: {
      title: { en: 'Concentrated Solar Power System', vi: 'Hệ Thống Năng Lượng Mặt Trời Tập Trung' },
      year: { en: '2023 — 2025', vi: '2023 — 2025' },
      tags: { en: ['Renewable Energy', 'Applied Physics', 'Systems Design'], vi: ['Năng Lượng Tái Tạo', 'Vật Lý Ứng Dụng', 'Thiết Kế Hệ Thống'] },
      summary: {
        en: 'Proposed a concentrated solar power approach for cleaner, lower-cost, and more sustainable electricity generation.',
        vi: 'Đề xuất giải pháp năng lượng mặt trời hội tụ (Parabolic Mirror) nhằm tạo ra điện năng sạch hơn, chi phí thấp hơn và bền vững hơn.'
      },
      detail: {
        en: 'This project proposes a concentrated solar power approach aimed at making electricity generation cleaner and more accessible. The work combines physics fundamentals — optics, thermodynamics, energy conversion — with a systems-level view of cost and feasibility, treating renewable energy as both a scientific and an engineering design problem.',
        vi: 'Đề xuất một giải pháp năng lượng mặt trời hội tụ nhằm giúp việc sản xuất điện trở nên sạch hơn và dễ tiếp cận hơn. Kết hợp các nguyên lý vật lý cơ bản — quang học, nhiệt động lực học, chuyển đổi năng lượng — tập trung đến việc giải quyết chi phí và tính khả thi, xem năng lượng tái tạo tập trung ở khoa học và thiết kế kỹ thuật.'
      },
      link: 'https://bit.ly/SolarProject-dangnhutnguyen',
      linktext: { en: 'View project demonstration ↗', vi: 'Xem video demo dự án ↗' }
    },
    pencilboo: {
      title: { en: 'PencilBooTalking', vi: 'PencilBooTalking' },
      year: { en: '2022', vi: '2022' },
      tags: { en: ['Storytelling', 'Animation', 'Communication'], vi: ['Kể Chuyện', 'Hoạt Hình', 'Giao Tiếp'] },
      summary: {
        en: 'A YouTube animation storytelling channel exploring social issues and personal growth through narrative.',
        vi: 'Kênh YouTube kể chuyện qua hoạt hình, khai thác các vấn đề xã hội và sự phát triển cá nhân qua hình thức kể chuyện bằng hình ảnh.'
      },
      detail: {
        en: 'A different kind of project: short animated stories built to talk about social issues and personal growth in a format that is approachable rather than academic. It was an early lesson in communicating ideas clearly to an audience outside a classroom or competition setting.',
        vi: 'Thực hiện các sản phẩm animation ngắn về những vấn đề xã hội và sự phát triển cá nhân nhằm truyền tải thông điệp theo cách gần gũi, dễ hiểu. Đây là trải nghiệm đầu tiên giúp tôi rèn luyện khả năng chuyển hóa ý tưởng thành nội dung phù hợp với công chúng ngoài môi trường học thuật.'
      },
      link: null
    },
    drugabuse: {
      title: { en: 'Impact of Drug Abuse on Children', vi: 'Tác Động của Ma Túy đến Trẻ Em' },
      year: { en: '2019 — 2020', vi: '2019 — 2020' },
      tags: { en: ['Social Research', 'Community Outreach'], vi: ['Nghiên Cứu Xã Hội', 'Quan Hệ Công Chúng'] },
      summary: {
        en: 'Research and awareness activities on the social and psychological impact of drug abuse on children.',
        vi: 'Tham gia nghiên cứu và truyền thông nâng cao nhận thức về tác động xã hội của tệ nạn ma túy đối với trẻ em.'
      },
      detail: {
        en: 'Early research and awareness work examining how drug abuse affects children socially and psychologically, carried out alongside community outreach. It was a first, formative experience with structuring a research question and communicating findings responsibly to a non-specialist audience.',
        vi: 'Tham gia một dự án nghiên cứu kết hợp hoạt động cộng đồng nhằm tìm hiểu những tác động của tệ nạn ma túy đối với trẻ em, đặc biệt ở khía cạnh tâm lý và đời sống xã hội. Đây là lần đầu tiên tôi trực tiếp xây dựng câu hỏi nghiên cứu, thu thập thông tin và trình bày kết quả theo cách dễ hiểu, phù hợp với cộng đồng, qua đó hình thành nền tảng ban đầu cho tư duy nghiên cứu và trách nhiệm trong việc truyền đạt kiến thức.'
      },
      link: null
    }
  };

  var openProjectKey = null;
  var modalOverlay = document.getElementById('modalOverlay');
  var elTitle = document.getElementById('modalTitle');
  var elYear = document.getElementById('modalYear');
  var elTags = document.getElementById('modalTags');
  var elSummary = document.getElementById('modalSummary');
  var elDetail = document.getElementById('modalDetail');
  var elLink = document.getElementById('modalLink');

  function openModal(key) {
    var p = projectData[key];
    if (!p) return;
    openProjectKey = key;
    elTitle.textContent = p.title[currentLang];
    elYear.textContent = p.year[currentLang];
    elTags.innerHTML = '';
    p.tags[currentLang].forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'tag accent';
      span.textContent = t;
      elTags.appendChild(span);
    });
    elSummary.textContent = p.summary[currentLang];
    elDetail.textContent = p.detail[currentLang];
    if (p.link) {
      elLink.href = p.link;
      elLink.textContent = p.linktext[currentLang];
      elLink.style.display = 'inline-flex';
    } else {
      elLink.style.display = 'none';
    }
    modalOverlay.classList.add('show');
    document.body.classList.add('no-scroll');
  }
  function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.classList.remove('no-scroll');
    openProjectKey = null;
  }
  document.querySelectorAll('.proj-card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card.getAttribute('data-project')); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.getAttribute('data-project')); }
    });
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeMore(); }
  });

  /* ---------------------------- init ---------------------------- */
  applyLang('en');

})();
