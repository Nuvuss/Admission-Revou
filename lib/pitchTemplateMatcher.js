/**
 * Pitch Template Matcher & Benchmark Catalog
 * 
 * Modul untuk mendeteksi kecocokan persona / situasi prospek dengan template benchmark
 * "Gold Standard" resmi dari knowledge_base_sales_script_benchmarks_and_examples.md.
 * 
 * Tujuannya:
 * 1. Jika ada template yang cocok, injeksi HANYA template tersebut (~250-400 token)
 *    sebagai few-shot exemplar ke prompt, BUKAN memuat seluruh file markdown benchmark (21 KB).
 * 2. Jika tidak ada yang cocok, sinyal fallback ke sistem dynamic knowledge base retrieval.
 */

export const BENCHMARK_TEMPLATES = [
  {
    id: "strategic_hr_compensation",
    programId: "strategic_hr",
    programName: "RevoU Strategic HR with AI",
    title: "Strategic HR with AI — Kasus Kompensasi & Benefit (9 Tahun Pengalaman)",
    keywords: [
      /\b(?:compensation|remunerasi|c&b|payroll|salary review|tunjangan)\b/i,
      /\b(?:9 tahun|berpengalaman|senior hr|hr lead)\b/i,
    ],
    // Match score booster
    matcher: (text) => {
      const hasComp = /compensation|remunerasi|c&b|payroll|salary review|tunjangan/i.test(text);
      const hasHR = /hr|human resource|sdm|personalia/i.test(text);
      return hasComp && (hasHR || /tahun|pengalaman/i.test(text));
    },
    exemplar: `
Halo kak 😊 9 tahun pegang compensation itu bukan kerjaan ringan ya. Kakak jadi tumpuan keputusan yg sensitif dan berdampak ke banyak orang, dan pengalaman sedalam itu jelas aset besar.

Nah, AI itu bukan pengganti, tapi "force multiplier" buat keahlian kakak 🚀 Di Strategic HR with AI, ada modul Compensation & Benefits (salary review dgn market data, pay philosophy) dan proyek Annual salary review case. Jadi kerjaan repetitif bisa dibantu AI, kakak fokus ke strategi.

Tujuannya jadi profesional "Top 1%" di bidang HR 💪 Boleh kita ngobrol singkat via konsultasi gratis, kak?
    `.trim(),
  },

  {
    id: "fsdm_career_break_irt",
    programId: "digital_marketing",
    programName: "Full Stack Digital Marketing (FSDM)",
    title: "Digital Marketing — Ibu Rumah Tangga / Career Break Luar Negeri",
    matcher: (text) => {
      const hasIRT = /ibu rumah tangga|\birt\b|ngurus rumah tangga|career break|jeda karir|luar negeri|pindah negara/i.test(text);
      const isMarketingIntent = /marketing|iklan|digital marketing|sosmed|karya|berkarya/i.test(text) || !/coding|developer|cyber|finance|itb/i.test(text);
      return hasIRT && isMarketingIntent;
    },
    exemplar: `
Kak, ngurus rumah tangga sambil adaptasi hidup di luar negeri itu peran yg besar dan nggak gampang lho 🙏 Dan kakak tetap kepikiran utk kembali berkarya, itu keren bgt 😊

Digital marketing ini cocok krn skill-nya bisa dipelajari dari rumah, dan di RevoU kakak nggak perlu background marketing. Semua sesi LIVE juga direkam dgn akses lifetime, jd fleksibel diulang kapan pun. AI jg bisa bantu kerjaan repetitif spt riset keyword, jd kakak fokus ke strategi ✨

Boleh aku jelasin lebih lanjut kak tentang programnya?
    `.trim(),
  },

  {
    id: "fsse_multimedia_switcher",
    programId: "software_engineering",
    programName: "Full Stack Software Engineering (FSSE)",
    title: "Software Engineering — Switch dari Multimedia / Tanpa Background CS",
    matcher: (text) => {
      const hasDesignOrMultimedia = /multimedia|desain|dkv|visual|grafis/i.test(text);
      const hasCodingIntent = /software|coding|programmer|developer|web dev|fullstack|fsse|banting setir ke coding|switch ke it/i.test(text);
      return hasDesignOrMultimedia && hasCodingIntent;
    },
    exemplar: `
Halo kak! Keputusan kakak buat banting setir ke software engineering setelah lihat peluangnya itu langkah yang berani dan realistis lho 😊 Background multimedia kakak justru modal bagus, karena sudah terbiasa mikir visual dan user experience, apalagi buat sisi frontend (di program ini ada HTML/CSS/JS, TypeScript, Tailwind, React/Next.js).

Di era sekarang AI itu "force multiplier", bukan pengganti: kerjaan repetitif dibantu AI, kakak fokus ke problem solving. Program kita memang AI-Native, in partnership dengan AWS 🚀 Dan tenang kak, tanpa background coding dan tanpa gelar CS pun bisa ikut.

Mau aku bantu jelasin gambaran materinya dulu, atau langsung atur sesi konsultasi gratis kak? Siapa tau kakak bisa jadi profesional Top 1% di bidangnya ✨
    `.trim(),
  },

  {
    id: "binus_cyber_redteam_student",
    programId: "cybersecurity_binus",
    programName: "BINUS Applied Cybersecurity with AI",
    title: "Applied Cybersecurity with AI — Mahasiswa / Pengalaman Red Team",
    matcher: (text) => {
      const hasCyber = /cyber|security|keamanan|hacker|soc|pentest/i.test(text);
      const hasStudentOrRedTeam = /red team|blue team|kompetisi|ctf|semester|mahasiswa/i.test(text);
      return hasCyber && hasStudentOrRedTeam;
    },
    exemplar: `
Hai kak [Nama], salut bgt udah sering ikut kompetisi red team padahal masih semester 1 🙌 Aku tau jalan bareng kuliah dan masih memperkuat fundamental itu nggak gampang, tapi pengalaman red team kakak itu modal yg langka. Di Applied Cybersecurity with AI, kakak belajar sisi defensive (Blue Team) dgn tetap memakai attacker's perspective (dibahas di W1-2). AI di sini jadi "force multiplier", bukan pengganti, jadi kerjaan repetitif seperti triage alert bisa dibantu AI dan kakak fokus ke analisis 🚀 Mau ngobrol 1:1 sama advisor kami? 😊
    `.trim(),
  },

  {
    id: "itb_applied_ds_analyst",
    programId: "applied_data_science_itb",
    programName: "Applied Data Science with AI (RevoU x ITB)",
    title: "Applied Data Science ITB — Data Analyst Pengalaman Ingin Naik Level ke DS",
    matcher: (text) => {
      const hasAnalystExp = /data analyst|analis data|bi analyst|business intelligence/i.test(text);
      const hasUpgradeIntent = /data science|predictive|itb|naik level|machine learning|churn|modelling/i.test(text) || /\btahun\b|\bpengalaman\b/i.test(text);
      return hasAnalystExp && hasUpgradeIntent && !/pemula dari nol|tidak ada background/i.test(text);
    },
    exemplar: `
Halo kak [Nama], salam kenal 😊 Aku [Nama AC] dari RevoU. Pengalaman jadi data analyst yg handle insight data itu modal berharga bgt kak, tekanan buat selalu kasih insight yg tajam pasti berasa 🙏

Pondasi analisis kakak sdh kuat, dan DS itu langkah natural berikutnya. AI itu force multiplier, bukan pengganti 🚀 Di Applied Data Science with AI (RevoU x ITB), kakak belajar regression, classification, forecasting, sampai clustering, dan capstone-nya bisa berupa Churn Decision App dari kasus nyata di kerjaan kakak.

Biar makin Top 1% di bidangnya, boleh ngobrol dulu soal real case kakak utk capstone? Gratis kok 😊
    `.trim(),
  },

  {
    id: "itb_decision_making_engineer_epc",
    programId: "decision_making_itb",
    programName: "Data-Driven Decision Making for Leaders (RevoU x ITB)",
    title: "ITB AI for Leaders — O&M / EPC / Konsultan / Kontraktor",
    matcher: (text) => {
      const hasIndustry = /o&m|epc|consultant|konsultan|kontraktor|engineering manager|konstruksi|operasional pabrik/i.test(text);
      const isLeaderOrITB = /itb|leader|manager|keputusan|decision/i.test(text);
      return hasIndustry && isLeaderOrITB;
    },
    exemplar: `
I see, kalau dari pengalaman Pak/Kakak di bidang industri dan konsultasi, justru penggunaan AI yg paling impactful biasanya bukan di teknis coding, tapi di:
- bantu analisa project & risk lebih cepat
- support decision making berbasis data
- sampai bantu streamline workflow & reporting antar tim

Dan ini yg memang jadi fokus di program Data-Driven Decision Making for Leaders (RevoU x ITB) ya Kak :) lebih ke arah gimana seorang profesional/leader bisa pakai AI utk bantu ambil keputusan dan manage project dgn lebih efektif. Terkait materi kelasnya sdh sempat cek jg blm kak? Kalau blm, aku bisa bantu jelaskan yaa 😊
    `.trim(),
  },

  {
    id: "itb_decision_making_umkm_dinas",
    programId: "decision_making_itb",
    programName: "Data-Driven Decision Making for Leaders (RevoU x ITB)",
    title: "ITB AI for Leaders — Instansi / Dinas / Tenaga Ahli / Kebijakan Publik",
    matcher: (text) => {
      return /dinas|koperasi|ukm|umkm|pemerintah|tenaga ahli|operasional dinas|kebijakan publik/i.test(text);
    },
    exemplar: `
I see. Kalau dari yg kakak jelasin kelihatannya challenge-nya lebih ke gimana membuat keputusan program yg tepat sasaran dan berbasis data yaa terutama utk kurasi dan efektivitas implementasi kebijakan 😊

Program Data-Driven Decision Making for Leaders ini kolaborasi resmi RevoU x ITB berdurasi 12 minggu:
🎓 Sertifikat resmi dari ITB & sesi tatap muka di kampus ITB Ganesha
📊 Fokus ke framework pengambilan keputusan & analisa dampak program tanpa perlu coding
💼 Capstone project studi kasus nyata perumusan kebijakan/solusi organisasi

Terkait detail jadwal dan materinya sdh sempat cek jg blm kak? Kalau blm, aku bisa bantu jelaskan yaa :)"
    `.trim(),
  },

  {
    id: "binus_applied_ai_freshgrad_mgmt",
    programId: "applied_ai_binus",
    programName: "Applied AI, Analytics & Automation Program (RevoU x BINUS)",
    title: "BINUS Applied AI — Fresh Graduate Manajemen / Bisnis + Pakai Tools AI",
    matcher: (text) => {
      const hasFreshGrad = /fresh grad|lulusan baru|s1 manajemen|manajemen|bisnis|ekonomi|administrasi/i.test(text);
      const hasAIInterest = /binus|applied ai|chatgpt|gpt|claude|gemini|otomasi|automation/i.test(text);
      return hasFreshGrad && hasAIInterest;
    },
    exemplar: `
Oh siap.. jd kakak lagi cari skill yg bikin makin stand out di job market ya. Skill ini emg bakal jd pembeda kamu dgn freshgrad lainnya. Bayangin aja kamu udh punya project portofolio bikin AI & Automation utk sebuah proses bisnis lho. Dan dont worry nanti learning path kita disusun bertahap & praktikal, jadi mudah diikuti bgt walaupun blm ada background koding 😊

Program Applied AI, Analytics & Automation berdurasi 3 bulan (12 minggu):
🎓 Kolaborasi resmi sama BINUS (sertifikat resmi & sesi tatap muka di kampus BINUS)
💼 Ada capstone project working prototype buat portofolio kerja
🤝 Lifetime akses materi + network sama profesional di industri

Proses belajarnya: Identify problem operasional -> Design solusi automasi AI -> Build & implement sampai punya AI workflow yg langsung bisa dipakai 🚀 Tertarik utk aku bantu jelaskan detail kurikulumnya kak?
    `.trim(),
  },

  {
    id: "binus_applied_ai_hr_automation",
    programId: "applied_ai_binus",
    programName: "Applied AI, Analytics & Automation Program (RevoU x BINUS)",
    title: "BINUS Applied AI — Profesional yang Ingin Otomasi Reporting & Analisis",
    matcher: (text) => {
      const hasRole = /hr|marketing|operations|operasional|admin|finance/i.test(text);
      const hasAutomationIntent = /otomasi|automation|reporting repetitif|efisiensi kerja|workflow|n8n|no code/i.test(text);
      const isBinus = /binus|applied ai/i.test(text) || !/itb|ui|fullstack/i.test(text);
      return hasRole && hasAutomationIntent && isBinus;
    },
    exemplar: `
Oh siapp berarti memang mau leverage AI & Automationnya utk support kerjaan sekarang ya.

Skill ini memang penting kak utk meningkatkan efisiensi pekerjaan dlm hal reporting & analysis, apalagi klo jumlah datanya banyak & repetitif ya 📊

Program Applied AI, Analytics & Automation ini kolaborasi resmi RevoU x BINUS (3 bulan / 12 minggu):
🎓 Sertifikat resmi BINUS & sesi tatap muka di kampus BINUS Kemanggisan
⚙️ Belajar menyusun alur automasi bisnis (Identify problem → Design solution → Build AI automation) tanpa harus coding
💼 Capstone project portofolio automasi nyata siap pakai

Terkait detail materi kelasnya apa sudah sempat cek jg kak? Kalau blm, aku bisa bantu jelaskan yaa :)
    `.trim(),
  },
];

/**
 * Cari template pitch benchmark yang paling cocok dengan query/situasi leads.
 * 
 * @param {string} text - Teks situasi/pertanyaan leads
 * @returns {Object|null} - Objek template yang cocok atau null jika tidak ada template yang match
 */
export function findMatchingPitchTemplate(text) {
  if (!text || typeof text !== "string") return null;

  const normalized = text.toLowerCase().trim();

  for (const template of BENCHMARK_TEMPLATES) {
    try {
      if (template.matcher(normalized)) {
        return {
          matched: true,
          templateId: template.id,
          programId: template.programId,
          programName: template.programName,
          title: template.title,
          exemplar: template.exemplar,
        };
      }
    } catch (err) {
      // Continue to next template if error
    }
  }

  return null;
}

