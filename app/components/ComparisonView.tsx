"use client";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Scale,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Award,
  DollarSign,
  Clock,
  Video,
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  Filter,
  Tag,
  Calendar,
  GraduationCap,
  Building2,
  ChevronDown,
  ArrowRight
} from "lucide-react";

export interface CompetitorBattlecard {
  id: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  format: string;
  careerSupport: string;
  certification: string;
  honestStrength: string;
  revouWins: string[];
  proofPoint: string;
  acScriptTemplate: string;
}

const BATTLECARDS: CompetitorBattlecard[] = [
  {
    id: "hacktiv8",
    name: "Hacktiv8",
    tagline: "Kuat di coding murni JavaScript & Golang, opsi Full-Day intensif 09:00–18:00 & Night Bootcamp",
    price: "Full-Day: Rp 35.000.000 – Rp 45.000.000 (Early Bird Rp 33jt–43jt) | Night: Rp 18.000.000 – Rp 25.000.000. Reg fee Rp 100.000 non-refundable. Bayar upfront 2 tahap, cicilan 0% (Danacita/CIMB), atau Study Now Pay Later.",
    duration: "Full-Day: 12–16 minggu (Senin–Jumat 09:00–18:00 WIB) | Night: 12–16 minggu (Senin–Jumat 19:00–22:00 WIB, ±15 jam/minggu).",
    format: "Tersedia kampus offline Jakarta (Kebayoran/Sultan Iskandar Muda) & remote online live coding.",
    careerSupport: "Career class, latihan interview, Job Portal, Career Buddy. Klaim 87–88% direkrut <3 bulan, rerata gaji Rp 7jt – Rp 8jt.",
    certification: "Sertifikat Kelulusan Hacktiv8 & BNSP (pada program tertentu).",
    honestStrength: "Sangat kuat dan terspesialisasi di bidang Software Engineering teknis murni (JavaScript stack & Golang) dengan format full-day immersion pagi-sore yang cocok bagi yang bisa komitmen 100% waktu penuh.",
    revouWins: [
      "Jadwal kelas malam (19:00–21:00 WIB) yang fleksibel — peserta tidak perlu resign dari kantor saat masa belajar.",
      "RevoU Labs (3 Bulan): Mengerjakan portofolio riil dengan klien dan dataset bisnis riil, bukan simulasi latihan internal.",
      "Ekosistem program multi-disiplin terlengkap (Digital Marketing, Data Analytics, Software Engineering, AI Academy).",
      "Garansi refund biaya s.d. 100% dengan syarat transparan dan realistis (10 lamaran/minggu)."
    ],
    proofPoint: "93% Completion & Employment Rate: Laporan transparansi karir RevoU menunjukkan 93% peserta menyelesaikan program dan mayoritas hired dalam 3–6 bulan pasca lulus di unicorn/multinasional.",
    acScriptTemplate: "Wah menarik banget kak! Hacktiv8 memang punya reputasi bagus untuk bootcamp coding seharian terutama kalau kakak siap komitmen full-day dari jam 9 pagi sampai 6 sore. Nah, di RevoU kelas kita di ain khusus jam 19.00 WIB malam, jadi kakak tetap bisa belajar dan bangun karir baru tanpa harus mengorbankan pekerjaan atau resign duluan. Plus, di RevoU ada 3 bulan RevoU Labs mengerjakan real project perusahaan dan didukung sertifikasi resmi. Kakak saat ini lebih nyaman belajar full-day seharian atau kelas malam di luar jam kerja kak? :)"
  },
  {
    id: "purwadhika",
    name: "Purwadhika",
    tagline: "Pilihan bagi yang mencari fasilitas kampus fisik BSD/Jakarta, ada 10 program Job Connector",
    price: "Tiered Pricing: Early Bird Rp 13jt–20jt | Term 1 Rp 15jt–25jt | Term 2 Rp 17jt–30jt | Promo 39th Anniv Rp 14,5jt–27,5jt | Scholarship Sinarmas Rp 10jt–17,5jt | Harga normal Rp 20jt–35jt (Tools premium tertentu ditanggung peserta).",
    duration: "Batch kalender 20–28 minggu (modul 6–15 minggu + final project 4–5 minggu). Pilihan After Hours (Sen–Kam 19:00–22:00 / Sel & Kam) & Office Hours (09:00–12:00).",
    format: "Kampus fisik (On-campus BSD Green Office Park, Jakarta, Batam) & Online Livestream via Zoom, serta opsi Video Learning.",
    careerSupport: "Purwadhika Hiring Network & Career Network (job connector portal). Klaim 92% alumni DS&ML berkarir di data.",
    certification: "Sertifikat Purwadhika Digital Technology School.",
    honestStrength: "Memiliki fasilitas kampus offline fisik yang megah di BSD & Jakarta bagi siswa yang memprioritaskan kehadiran fisik tatap muka di ruang kelas.",
    revouWins: [
      "100% Live Online dua arah hemat biaya akomodasi hingga puluhan juta rupiah bagi siswa luar kota.",
      "3 Bulan RevoU Labs: Mengerjakan portofolio nyata dengan real client & real budget (bukan tugas dummy simulasi kelompok 7-8 orang).",
      "Kemitraan resmi universitas terkemuka (ITB untuk Leaders, BINUS untuk AI & Analytics, UI untuk Strategic Finance).",
      "Persyaratan fleksibel (terbuka untuk seluruh jenjang vs Purwadhika yang mayoritas mewajibkan minimal S1)."
    ],
    proofPoint: "RevoU Labs Real Project Experience: Peserta RevoU Digital Marketing memegang anggaran riil jutaan rupiah langsung untuk running campaign live, dan peserta Data menganalisa dataset bisnis skala enterprise.",
    acScriptTemplate: "Purwadhika reputasinya memang sangat baik kak, terutama untuk teman-teman yang berdomisili di BSD/Jakarta dan ingin merasakan suasana kampus fisik. Kalau di RevoU, kita fokus 100% live interaktif online agar teman-teman dari seluruh Indonesia bisa belajar langsung dari praktisi top company tanpa perlu keluar biaya sewa kos/transportasi puluhan juta. Di RevoU juga ada RevoU Labs selama 3 bulan untuk ngerjain project riil dengan client beneran. Kakak sendiri lebih mempertimbangkan fleksibilitas online atau tatap muka fisik kak? :)"
  },
  {
    id: "dibimbing",
    name: "Dibimbing",
    tagline: "Opsi budget-friendly & pilihan 14 program (Data, IT, Marketing, HR, Supply Chain, ESG, Legal)",
    price: "Rp 7.000.000 – Rp 15.000.000 (Harga ekonomis, banyak diskon promo, opsi cicilan fleksibel, garansi gratis mengulang batch seumur hidup).",
    duration: "Pre-bootcamp mandiri + 24 minggu bootcamp + 2 minggu post-bootcamp + 4 minggu Job Connect (total ±7 bulan). Frekuensi 2–3 sesi per minggu (weekday atau weekend).",
    format: "Kombinasi materi video rekaman LMS + sesi Live Zoom tanya jawab / mentoring mingguan (Online, Offline Jakarta/Surabaya, Private).",
    careerSupport: "Penyaluran kerja ke 1.100+ hiring partner, konsultasi 1-on-1, review CV & LinkedIn, latihan interview, talent showcase. Klaim 96% alumni dapat kerja.",
    certification: "Sertifikat Kelulusan Dibimbing.",
    honestStrength: "Pilihan kategori program sangat luas dan variatif (mencakup HR, Supply Chain, ESG, Legal) dengan biaya masuk lebih ekonomis (budget-friendly) dan benefit gratis mengulang batch.",
    revouWins: [
      "Kedalaman kurikulum & jam terbang praktik 2x lebih intensif (>80 sesi live interaktif harian vs <40 sesi rekaman/campuran).",
      "3 Bulan RevoU Labs: Praktik riil mengelola dana iklan jutaan rupiah atau dataset enterprise langsung.",
      "Standar seleksi ketat menjamin circle belajar ambisius dan suportif (tingkat penerimaan <10%).",
      "Track record alumni terbukti di multinational & top tech companies (Gojek, Tokopedia, Traveloka, Shopee, Big 4, BUMN)."
    ],
    proofPoint: "Standar Portofolio & Reputasi Recruiter: Hiring Partner RevoU telah mencapai ratusan perusahaan di Asia Tenggara, dan kurikulum RevoU diakui setara standar profesional associate di tech unicorn.",
    acScriptTemplate: "Dibimbing pilihan yang bagus kak kalau kakak mencari opsi belajar yang terjangkau dan memiliki variasi program yang luas seperti HR atau Legal. Namun kalau tujuan kakak adalah career switch total atau naik level karir di tech company papan atas, RevoU memberikan 100% live class interaktif setiap hari (bukan video rekaman), bimbingan karir 1-on-1 intensif, dan 3 bulan RevoU Labs portofolio riil. Boleh tau tujuan utama kakak ambil program ini apakah untuk eksplorasi dasar atau persiapan karir jangka panjang kak? :)"
  },
  {
    id: "dqlab",
    name: "DQLab",
    tagline: "Kursus kilat live Zoom modular, persiapan sertifikasi resmi BNSP & Pearson VUE dengan budget ekonomis",
    price: "Rp 699.000 – Rp 3.800.000 (Bootcamp Single Rp 699rb–2,5jt; Ujian Sertifikasi BNSP/Pearson VUE Rp 1,68jt–2,8jt; Bundle Program Rp 1,2jt–3,8jt).",
    duration: "10 – 17 sesi singkat (durasi 1,5 – 2,5 bulan), jadwal 2x seminggu malam (19:00–21:30 WIB) atau weekend.",
    format: "Live Class via Zoom interaktif singkat + modul platform mandiri (Level Beginner hingga Intermediate).",
    careerSupport: "Terfokus pada bimbingan persiapan ujian sertifikasi BNSP & Pearson VUE; tidak ada pendampingan karir 1-on-1 intensif atau penyaluran kerja langsung.",
    certification: "Ujian Sertifikasi Resmi BNSP (KKNI 6 Data/BI Analyst & KKNI 7 Data Scientist/Engineer) & Pearson VUE AI.",
    honestStrength: "Biaya sangat terjangkau dengan format kursus singkat terfokus untuk memperoleh sertifikat BNSP/Pearson VUE tanpa komitmen waktu atau biaya besar.",
    revouWins: [
      "Program karir end-to-end 6–9 bulan dari nol hingga siap kerja profesional dengan kurikulum industri mendalam, bukan sekadar lulus ujian tertulis.",
      "RevoU Labs 3 bulan memegang dataset bisnis riil dan problem solving bisnis strategis (bukan sekadar sintaks koding).",
      "Bimbingan karir intensif RevoU NEXT 1-on-1 bersama Career Coach profesional + jaminan refund 100% transparan.",
      "Ekosistem 6.000+ alumni aktif di 1.000+ top company dan komunitas pelajar 550.000+ member."
    ],
    proofPoint: "93% Penyerapan Karir & Kenaikan Gaji Up to 100%+: Alumni FSDA RevoU banyak yang melipatgandakan gajinya dan bekerja di Gojek, Tokopedia, Traveloka, Shopee, Big 4, dan perbankan terkemuka.",
    acScriptTemplate: "DQLab itu opsi yang oke banget kak kalau kakak sekadar ingin mengambil ujian sertifikasi BNSP atau kursus kilat Excel/Python dalam durasi 1-2 bulan dengan budget terjangkau. Namun kalau tujuan kakak ingin career switch menjadi Data Analyst profesional yang siap kerja di top company, di RevoU kakak akan belajar 6–9 bulan komprehensif, menguasai SQL, Python, Tableau, Looker Studio, dan 3 bulan RevoU Labs menganalisis real dataset bisnis riil, plus bimbingan karir 1-on-1 sampai dapat kerja. Kakak saat ini lebih butuh sertifikasi singkat atau persiapan karir menyeluruh sampai siap kerja kak? :)"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA DETAIL PER PROGRAM DENGAN BARIS KOMPARASI SPESIFIK UNTUK TABEL
// ─────────────────────────────────────────────────────────────────────────────
export interface ProgramComparisonTableRow {
  parameter: string;
  categoryTag: string;
  revouValue: string;
  competitorValue: string;
  highlight?: boolean;
}

export interface CompetitorProgramItem {
  id: string;
  competitorId: "hacktiv8" | "purwadhika" | "dibimbing" | "dqlab";
  competitorName: string;
  programTitle: string;
  badge: string;
  revouMatchProgram: string;
  revouMatchBadge: "FSDM" | "FSDA" | "FSSE" | "ITB" | "BINUS" | "UI" | "Joint AI" | "RevoU All-In";
  tableRows: ProgramComparisonTableRow[];
  competitorLimitation: string;
  revouEdge: string;
  acTalkingPoint: string;
}

const COMPETITOR_PROGRAMS_BY_VENDOR: Record<"hacktiv8" | "purwadhika" | "dibimbing" | "dqlab", CompetitorProgramItem[]> = {
  // ── 1. HACKTIV8 (Program Resmi 20 Okt 2026) ──
  hacktiv8: [
    {
      id: "h8-fsd",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "AI-Enhanced Full Stack Developer",
      badge: "Full-Day (09:00–18:00)",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an (Opsi cicilan bunga 0% s.d. 12-18 bulan via kartu kredit/Danacita, tanpa biaya kos/transport).",
          competitorValue: "Rp 45.000.000 (Early Bird Rp 43.000.000 lunas H-14). Registration fee Rp 100.000. Opsi cicilan Danacita/CIMB Niaga atau Study Now Pay Later.",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Jumat — dirancang ramah pekerja & mahasiswa (TIDAK perlu resign dari kantor saat belajar).",
          competitorValue: "Senin–Jumat 09:00–18:00 WIB (Wajib komitmen seharian penuh di jam kantor — harus cuti atau resign kerja).",
          highlight: true
        },
        {
          parameter: "Durasi & Total Sesi Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "6 – 9 bulan komprehensif (>80 sesi live intensif harian + 3 bulan RevoU Labs & Career Acceleration).",
          competitorValue: "16 minggu (4 minggu persiapan dasar + 12 minggu bootcamp intensif).",
          highlight: true
        },
        {
          parameter: "Format Belajar & Lokasi",
          categoryTag: "METODE BELAJAR",
          revouValue: "100% Live Online interaktif dua arah (diskusi, live review code baris-per-baris) + rekaman materi selamanya.",
          competitorValue: "Pilihan Kampus Offline Jakarta (Kebayoran/Sultan Iskandar Muda) atau Remote Online live coding.",
          highlight: false
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Full-stack JavaScript modern: Frontend (HTML, CSS, React, Next.js, Tailwind), Backend API (Node.js, Express, PostgreSQL), System Design, Secure Coding, Deployment.",
          competitorValue: "Fase 0 (HTML/CSS/JS) -> Fase 1 (Express.js, PostgreSQL, Sequelize) -> Fase 2 (API, React.js, Redux, Copilot) -> Fase 3 (Microservices, NoSQL, Next.js, TypeScript, Docker, Cursor).",
          highlight: false
        },
        {
          parameter: "Tools & Teknologi Dipelajari",
          categoryTag: "TECH STACK",
          revouValue: "React, Next.js, Node.js, Express, PostgreSQL, Prisma, TailwindCSS, Docker, Git/GitHub, Vercel.",
          competitorValue: "React, Next.js, Express.js, PostgreSQL, Sequelize, Docker, TypeScript, MongoDB, GitHub Copilot, Cursor.",
          highlight: false
        },
        {
          parameter: "Portofolio Proyek (RevoU Labs)",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan Program Khusus (RevoU Labs) membangun produk software nyata untuk real company partner dari nol sampai deployment production.",
          competitorValue: "Final project web application full-stack di akhir fase 3 (pengerjaan kelompok siswa internal).",
          highlight: true
        },
        {
          parameter: "Jaminan Kerja & Kebijakan Refund",
          categoryTag: "JAMINAN REFUND",
          revouValue: "Garansi Refund Biaya s.d. 100% dengan syarat transparan & realistis (cukup 10 lamaran kerja per minggu).",
          competitorValue: "NON-REFUNDABLE (Tidak ada garansi refund pengembalian uang sama sekali jika tidak mendapatkan pekerjaan).",
          highlight: true
        },
        {
          parameter: "Bimbingan Karir & Job Placement",
          categoryTag: "PERSIAPAN KERJA",
          revouValue: "RevoU NEXT: 1-on-1 Personal Career Coach, 16 sesi Career Development live, simulasi live coding interview HR/User, akses 1.000+ hiring partners.",
          competitorValue: "Career class, latihan interview, Job Portal, Career Buddy. Klaim 88% direkrut <3 bulan, rerata gaji Rp 7,2 jt.",
          highlight: false
        },
        {
          parameter: "Sertifikasi Resmi",
          categoryTag: "KREDENSIAL",
          revouValue: "RevoU Certificate of Completion bertaraf internasional + Sertifikasi Resmi Program Kemitraan Universitas Top (**ITB, BINUS, UI**).",
          competitorValue: "Sertifikat Kelulusan Hacktiv8 & BNSP (pada program tertentu).",
          highlight: false
        }
      ],
      competitorLimitation: "Biaya sangat tinggi (Rp 45.000.000), mewajibkan cuti/resign karena jam belajar seharian 09:00–18:00 WIB, dan biaya pendaftaran/kursus bersifat non-refundable (tanpa refund).",
      revouEdge: "RevoU FSSE memberikan kelas malam (19:00–21:00 WIB) sehingga peserta tetap berpenghasilan, biaya jauh lebih terjangkau, ada 3 bulan RevoU Labs mengerjakan real product, dan jaminan refund 100%.",
      acTalkingPoint: "Hacktiv8 memang bagus untuk coding seharian kak, tapi biayanya Rp 45 jt dan jam belajarnya 09:00–18:00 sehingga kakak harus resign duluan. Di RevoU FSSE kelas kita jam 19.00 malam, jadi kakak tetap bisa terima gaji kantor sambil belajar coding dari nol sampai deployment, ada 3 bulan RevoU Labs, dan ada Garansi Refund 100% transparan."
    },
    {
      id: "h8-golang",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Back End Golang",
      badge: "Night Bootcamp (19:00–22:00)",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Skema Bayar",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an (Cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita).",
          competitorValue: "Rp 22.000.000 (Early Bird Rp 20.000.000). Non-refundable.",
          highlight: false
        },
        {
          parameter: "Cakupan Stack Pengembangan",
          categoryTag: "CAKUPAN ROLE",
          revouValue: "Full Stack (Frontend React/Next.js + Backend Node.js/Express/PostgreSQL) — paling fleksibel untuk peluang loker junior/associate di Indonesia.",
          competitorValue: "Backend Murni (Golang, Gin, gRPC, Microservices, K8s) — spesialisasi backend tanpa penguasaan frontend web modern.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs membangun web app terintegrasi live deployment production untuk partner bisnis nyata.",
          competitorValue: "Final project web API real-time microservices di akhir batch.",
          highlight: true
        },
        {
          parameter: "Jaminan Refund",
          categoryTag: "JAMINAN REFUND",
          revouValue: "Garansi Refund 100% transparan (10 lamaran/minggu).",
          competitorValue: "Non-refundable (Tidak ada garansi refund).",
          highlight: true
        }
      ],
      competitorLimitation: "Hanya mencakup backend Golang saja tanpa frontend React/Next.js, sehingga cakupan loker entry level lebih terbatas dibanding Full Stack.",
      revouEdge: "RevoU FSSE melatih Full Stack modern (React + Node.js + Next.js) yang paling banyak dicari startup & korporasi di Indonesia, lengkap dengan 3 bulan RevoU Labs.",
      acTalkingPoint: "Golang di Hacktiv8 sangat bagus jika kakak sudah pasti ingin berkarir khusus di backend microservices. Namun bagi pemula atau career switcher, lowongan kerja Software Engineer terbesar di Indonesia mencari Full Stack JavaScript (React + Node.js). Di RevoU FSSE kakak belajar end-to-end frontend dan backend lengkap dengan portofolio riil RevoU Labs."
    },
    {
      id: "h8-dsml",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Data Science & AI Machine Learning",
      badge: "Full-Day (09:00–18:00)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an (Cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita).",
          competitorValue: "Rp 35.000.000 (Early Bird Rp 33.000.000). Non-refundable. Upfront 2 tahap atau cicilan Danacita.",
          highlight: true
        },
        {
          parameter: "Jadwal & Jam Kelas",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Jumat — fleksibel tanpa harus meninggalkan pekerjaan saat ini.",
          competitorValue: "Senin–Jumat 09:00–18:00 WIB (Wajib komitmen seharian penuh).",
          highlight: true
        },
        {
          parameter: "Durasi Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "6 – 9 bulan komprehensif (>80 sesi live interaktif harian + 3 bulan RevoU Labs).",
          competitorValue: "12 minggu (4 minggu persiapan + 8 minggu bootcamp intensif).",
          highlight: true
        },
        {
          parameter: "Fokus Kurikulum & Silabus",
          categoryTag: "KURIKULUM",
          revouValue: "Menekankan Business Problem Solving, Data Storytelling, dan Stakeholder Communication ke manajemen C-level, dipadukan SQL, Python, Tableau, Looker Studio.",
          competitorValue: "Fokus berat pada matematika koding teknis: Scikit-Learn, Deep Learning, TensorFlow, AWS Big Data, Airflow, Spark, Docker.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (RevoU Labs)",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs menganalisis dataset riil skala ribuan hingga jutaan baris data perusahaan partner nyata.",
          competitorValue: "Capstone project pipeline data & model deployment di akhir minggu bootcamp.",
          highlight: true
        },
        {
          parameter: "Jaminan Refund",
          categoryTag: "JAMINAN REFUND",
          revouValue: "Garansi Refund 100% transparan jika tidak terserap kerja (syarat realistis: 10 lamaran/minggu).",
          competitorValue: "Non-refundable (Tidak ada pengembalian uang sama sekali).",
          highlight: true
        }
      ],
      competitorLimitation: "Jadwal seharian penuh (09:00–18:00) menyulitkan pekerja, biaya non-refundable, dan fokus dominan matematika koding tanpa latihan business communication ke direksi.",
      revouEdge: "RevoU FSDA fokus melatih Business Communication & Problem Solving C-level, jadwal malam fleksibel 19:00–21:00, 3 bulan RevoU Labs data riil, dan garansi refund 100%.",
      acTalkingPoint: "Hacktiv8 DS&ML mewajibkan waktu seharian dari pagi sampai jam 6 sore kak. Kalau di RevoU FSDA, jam kelas kita jam 19.00 malam, jadi kakak tidak perlu resign. Di RevoU juga fokus melatih cara mempresentasikan data ke bos dan manajemen bisnis, ada 3 bulan RevoU Labs menganalisis real dataset bisnis, dan didukung garansi refund 100%."
    },
    {
      id: "h8-cda",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Comprehensive Data Analytics",
      badge: "Night Bootcamp (19:00–22:00)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an (Cicilan 0% s.d. 12-18 bulan, garansi refund 100%).",
          competitorValue: "Rp 18.000.000 (Early Bird Rp 16.000.000). Non-refundable. Cicilan Danacita/CIMB.",
          highlight: false
        },
        {
          parameter: "Jadwal Belajar",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Jumat (2 jam/hari pas untuk stamina pekerja).",
          competitorValue: "Malam hari (19:00–22:00 WIB) Senin–Jumat (3 jam/hari cukup padat).",
          highlight: false
        },
        {
          parameter: "Durasi & Kedalaman Materi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "6 – 9 bulan komprehensif (>80 sesi live harian + 3 bulan RevoU Labs real project).",
          competitorValue: "12 minggu (kurang dari 3 bulan).",
          highlight: true
        },
        {
          parameter: "Proyek Nyata (RevoU Labs)",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs memegang dataset riil dari perusahaan partner nyata, dibimbing praktisi senior.",
          competitorValue: "Latihan capstone project internal tanpa program lab klien terpisah.",
          highlight: true
        },
        {
          parameter: "Kebijakan Garansi Refund",
          categoryTag: "JAMINAN REFUND",
          revouValue: "Garansi Refund Biaya s.d. 100% jika belum mendapatkan pekerjaan.",
          competitorValue: "Non-refundable (Tidak ada refund sama sekali).",
          highlight: true
        }
      ],
      competitorLimitation: "Biaya non-refundable (tidak ada pengembalian uang sama sekali jika tidak dapat kerja), durasi hanya 12 minggu tanpa program lab portofolio terpisah.",
      revouEdge: "RevoU FSDA berdurasi 6–9 bulan komprehensif termasuk 3 bulan RevoU Labs data nyata klien, dan didukung Garansi Refund 100% transparan jika tidak dapat kerja.",
      acTalkingPoint: "Hacktiv8 Comprehensive DA bagus kak, tapi mereka tidak ada jaminan refund (non-refundable) dan durasinya hanya 12 minggu. Di RevoU FSDA kakak belajar 6–9 bulan komprehensif, ada 3 bulan RevoU Labs menganalisis dataset bisnis riil perusahaan, dan ada Garansi Refund 100% jika belum mendapatkan pekerjaan. Tentu jauh lebih aman dan matang untuk persiapan karir kakak :)"
    },
    {
      id: "h8-ai-itb",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Applied AI Engineer (vs RevoU x ITB)",
      badge: "Night Bootcamp",
      revouMatchProgram: "x ITB: Data-Driven Decision Making for Leaders",
      revouMatchBadge: "ITB",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Universitas",
          categoryTag: "INVESTASI & SERTIFIKAT",
          revouValue: "Investasi kompetitif program eksekutif (opsi cicilan 0% & corporate invoice) + Sertifikasi Resmi Institut Teknologi Bandung (**ITB**).",
          competitorValue: "Rp 20.000.000 (Harga normal Rp 25.000.000). Sertifikat kelulusan internal Hacktiv8.",
          highlight: true
        },
        {
          parameter: "Target Peserta & Syarat Masuk",
          categoryTag: "SYARAT MASUK",
          revouValue: "Para Leader, Manager, Business Head, dan Decision Maker (TIDAK ada syarat koding teknis).",
          competitorValue: "Wajib pengalaman IT min. 1 tahun & tes praktik koding Python/SQL yang ketat.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Fokus Pembelajaran",
          categoryTag: "KURIKULUM",
          revouValue: "Decision making strategis berbasis data & AI, optimalisasi riset tim, workflow otomasi n8n, evaluasi model (Claude, ChatGPT, Gemini).",
          competitorValue: "Koding pipeline data berat: Databricks, Apache Spark, RAG LangChain, CrewAI, Pinecone.",
          highlight: true
        },
        {
          parameter: "Format Belajar & Networking",
          categoryTag: "FORMAT KELAS",
          revouValue: "Hybrid: 2x/minggu Live Zoom malam + Sesi On-Campus Networking tatap muka di Kampus ITB Bandung.",
          competitorValue: "Remote Online live stream malam hari.",
          highlight: false
        }
      ],
      competitorLimitation: "Wajib punya background IT minimal 1 tahun dan ada tes koding teknis ketat, tidak relevan untuk para pemimpin bisnis atau manajer non-IT.",
      revouEdge: "Program RevoU x ITB dirancang khusus para leaders untuk pengambilan keputusan berbasis data & AI tanpa pusing koding teknis, dengan sertifikasi resmi ITB.",
      acTalkingPoint: "Hacktiv8 Applied AI mensyaratkan minimal 1 tahun kerja IT dan tes koding sulit kak. Jika tujuan kakak adalah pengambilan keputusan strategis dan peningkatan kepemimpinan tim, di program RevoU x ITB kurikulumnya didesain khusus para leaders dengan sertifikat resmi ITB tanpa pusing koding dari nol."
    },
    {
      id: "h8-ai-binus",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Applied AI Engineer (vs RevoU x BINUS)",
      badge: "Night Bootcamp",
      revouMatchProgram: "x BINUS: Applied AI, Analytics & Automation",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Universitas",
          categoryTag: "INVESTASI & SERTIFIKAT",
          revouValue: "Investasi all-in transparan (opsi cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita) + Professional Certificate resmi **BINUS University** & GreatNusa.",
          competitorValue: "Rp 20.000.000 (Harga normal Rp 25.000.000). Sertifikat kelulusan internal Hacktiv8.",
          highlight: true
        },
        {
          parameter: "Target Peserta & Syarat Masuk",
          categoryTag: "SYARAT MASUK",
          revouValue: "Profesional lintas divisi (Marketing, Ops, Finance, HR, PM) — pendekatan no-code praktikal.",
          competitorValue: "Wajib min. 1 tahun di IT (Software/Data Engineer) & lolos screening coding.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Otomasi AI",
          categoryTag: "KURIKULUM",
          revouValue: "End-to-end AI Automation no-code: n8n, Claude Code, AI Agents untuk eliminasi tugas repetitif kantor.",
          competitorValue: "Koding teknis pipeline machine learning Databricks, Spark, LangChain, server deployment.",
          highlight: true
        },
        {
          parameter: "Sesi Tatap Muka Kampus",
          categoryTag: "FORMAT KELAS",
          revouValue: "Hybrid: Live Zoom malam + 2x Sesi Tatap Muka di Kampus BINUS Kemanggisan Jakarta (Networking & Showcase).",
          competitorValue: "Remote Online live stream.",
          highlight: false
        }
      ],
      competitorLimitation: "Kurikulum Hacktiv8 sangat berat koding data engineering, sedangkan profesional non-IT butuh solusi cepat otomasi operasional bisnis.",
      revouEdge: "RevoU x BINUS fokus membangun prototype otomasi AI siap pakai di kantor dengan n8n & AI Agent tanpa koding, lengkap dengan kredensial resmi BINUS University.",
      acTalkingPoint: "Hacktiv8 Applied AI sangat teknikal koding dan wajib punya background IT. Nah di RevoU x BINUS (Applied AI, Analytics & Automation), kakak bisa langsung membangun workflow otomasi bisnis nyata dengan n8n & AI Agent tanpa perlu koding rumit, lengkap dengan sertifikasi resmi BINUS University."
    },
    {
      id: "h8-ai-ui",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Applied AI Engineer (vs RevoU x UI)",
      badge: "Night Bootcamp",
      revouMatchProgram: "x UI: AI-Enabled Strategic Finance",
      revouMatchBadge: "UI",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Universitas",
          categoryTag: "INVESTASI & SERTIFIKAT",
          revouValue: "Rp 15.000.000 (Reguler) / Rp 12.500.000 (Khusus Alumni RevoU/UI), cicilan 0% & corporate invoice + Sertifikat Resmi **Universitas Indonesia (FEB UI & FIA UI)**.",
          competitorValue: "Rp 20.000.000 (Harga normal Rp 25.000.000). Sertifikat kelulusan internal Hacktiv8.",
          highlight: true
        },
        {
          parameter: "Fokus Disiplin & Target Karir",
          categoryTag: "TARGET KARIR",
          revouValue: "Khusus profesional Finance, Accounting, Tax, FP&A menuju posisi Head of Finance / Controller.",
          competitorValue: "Khusus IT Software Engineer / AI Developer.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Aplikasi AI",
          categoryTag: "KURIKULUM",
          revouValue: "Corporate finance, transaksi multi-entitas holding, regulasi pajak DJP, 3-statement financial modeling dengan asisten AI.",
          competitorValue: "Pemrograman pipeline model machine learning Databricks, Apache Spark, vector database.",
          highlight: true
        },
        {
          parameter: "Sesi Kampus & Pengajar",
          categoryTag: "FORMAT KELAS",
          revouValue: "Guru Besar & Dosen FEB/FIA UI serta praktisi eks McKinsey/GoTo + Capstone Defense di Kampus UI.",
          competitorValue: "Instruktur internal Hacktiv8 via Zoom.",
          highlight: false
        }
      ],
      competitorLimitation: "Hacktiv8 tidak memiliki program khusus bidang finance, akuntansi, dan perpajakan korporasi.",
      revouEdge: "Program RevoU x UI mentransformasi praktisi keuangan menjadi strategic finance leader dengan sertifikasi resmi kampus nomor satu di Indonesia (Universitas Indonesia).",
      acTalkingPoint: "Jika latar belakang atau target karir kakak di bidang finance, akuntansi, atau permodalan bisnis, program RevoU x UI (AI-Enabled Strategic Finance) memberikan sertifikasi resmi Universitas Indonesia yang sangat prestisius di hadapan manajemen direksi."
    }
  ],

  // ── 2. PURWADHIKA (10 Program Job Connector Resmi 20 Okt 2026) ──
  purwadhika: [
    {
      id: "pwd-ai-auto",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "AI Automation Engineer",
      badge: "After Hours (Sen–Kam 19:00–22:00)",
      revouMatchProgram: "x BINUS: Applied AI, Analytics & Automation",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Struktur Promo",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Biaya all-in transparan, opsi cicilan 0% hingga 18 bulan, sudah termasuk kredensial resmi universitas.",
          competitorValue: "Early Bird Rp 13jt | Term 1 Rp 15jt | Promo 39th Rp 14,5jt | Scholarship Sinarmas Land Rp 10jt | Normal Rp 20jt.",
          highlight: false
        },
        {
          parameter: "Kredensial & Akreditasi",
          categoryTag: "KREDENSIAL KAMPUS",
          revouValue: "Sertifikat & Kredensial Resmi dari **BINUS University** (perguruan tinggi swasta top Indonesia) + RevoU Certified.",
          competitorValue: "Sertifikat kelulusan internal Purwadhika Digital Technology School (tanpa akreditasi kampus perguruan tinggi).",
          highlight: true
        },
        {
          parameter: "Durasi Modul Belajar",
          categoryTag: "DURASI MODUL",
          revouValue: "3 Bulan komprehensif pendampingan praktisi global & dosen ahli universitas.",
          competitorValue: "6 minggu modul materi (24 sesi) + 3–4 minggu final project (total batch kalender ±20 minggu).",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang pendidikan profesional (manajer, staf bisnis, owner, finance).",
          competitorValue: "Mewajibkan minimal lulusan S1.",
          highlight: true
        },
        {
          parameter: "Materi & Tools Otomasi",
          categoryTag: "KURIKULUM",
          revouValue: "Practical no-code automation: Zapier, Make, AI Agents, integrasi database, otomasi proses bisnis corporate, AI governance.",
          competitorValue: "BPM, Zapier, Make, n8n, Ollama, Google Sheets, Slack, Telegram Bot, AI for CS/Sales/Marketing.",
          highlight: false
        }
      ],
      competitorLimitation: "Hanya menerbitkan sertifikat internal Purwadhika tanpa kemitraan universitas ternama, durasi modul inti relatif singkat (6 minggu), dan mensyaratkan min. S1.",
      revouEdge: "Executive Joint Program BINUS x RevoU: Kredensial resmi universitas bergengsi (BINUS), kurikulum otomasi AI bisnis enterprise, dan pengajar Lead AI internasional.",
      acTalkingPoint: "Purwadhika AI Automation memang mengajarkan tools seperti Zapier dan n8n kak. Nah, di RevoU kita bekerjasama resmi dengan BINUS (Applied AI & Automation) dan ITB (AI for Leaders), jadi selain menguasai otomasi AI untuk efisiensi kantor, kakak mendapatkan sertifikasi dan kredensial resmi dari universitas top yang sangat diakui manajemen perusahaan!"
    },
    {
      id: "pwd-ai-eng",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "AI Engineering",
      badge: "Job Connector (On Campus / Online)",
      revouMatchProgram: "x ITB: Data-Driven Decision Making for Leaders",
      revouMatchBadge: "ITB",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Kampus",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Investasi sangat bersahabat dengan Kredensial Resmi Perguruan Tinggi Terbaik (**ITB & BINUS**).",
          competitorValue: "Early Bird Rp 20jt | Term 1 Rp 25jt | Promo 39th Rp 27,5jt | Scholarship Rp 17,5jt | Normal Rp 35.000.000 (sertifikat internal).",
          highlight: true
        },
        {
          parameter: "Fasilitas & Lokasi",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif hemat puluhan juta biaya kos/transport di Jabodetabek.",
          competitorValue: "On Campus BSD Green Office Park / Jakarta atau Online Livestream.",
          highlight: false
        },
        {
          parameter: "Fokus Kurikulum",
          categoryTag: "KURIKULUM",
          revouValue: "Applied AI strategis untuk bisnis & manajemen, RAG, prompt engineering, efisiensi operasional perusahaan.",
          competitorValue: "Koding AI teknis berat: Scikit-Learn, TensorFlow, Computer Vision CNN, LangChain, vector DB, MLOps, MLflow.",
          highlight: false
        }
      ],
      competitorLimitation: "Biaya sangat tinggi (mencapai Rp 35 jt harga normal) dan kurikulum sangat berat koding matematika murni tanpa akreditasi kampus ternama.",
      revouEdge: "Joint Program ITB & BINUS x RevoU memadukan keahlian praktis AI terkini dengan sertifikasi resmi perguruan tinggi terbaik dengan biaya jauh lebih terjangkau.",
      acTalkingPoint: "Purwadhika AI Engineering biayanya mencapai Rp 35 juta untuk sertifikat internal. Di RevoU, kakak bisa mengambil program AI bekerjasama langsung dengan ITB atau BINUS dengan kurikulum praktikal bisnis, mentor AI Lead global, dan kredensial kampus nomor satu dengan investasi yang jauh lebih terjangkau."
    },
    {
      id: "pwd-bda",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Business & Data Analyst",
      badge: "After/Office Hours",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Garansi Refund",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an + **Garansi Refund 100%** jika tidak dapat kerja.",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Promo 39th Rp 18,5jt | Normal Rp 25jt. **Tanpa garansi refund biaya**.",
          highlight: true
        },
        {
          parameter: "Durasi Modul Pembelajaran",
          categoryTag: "DURASI MODUL",
          revouValue: "6 – 9 bulan komprehensif (Foundation + Advanced Core + 3 bulan RevoU Labs klien riil).",
          competitorValue: "9 minggu modul materi (45 sesi) + 5 minggu final project (total batch kalender ±20 minggu).",
          highlight: true
        },
        {
          parameter: "Persyaratan Peserta",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang pendidikan (SMA/SMK, D3, S1).",
          competitorValue: "Mewajibkan minimal lulusan S1.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek Nyata",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs menganalisis dataset bisnis riil skala enterprise ribuan-jutaan baris data klien nyata.",
          competitorValue: "Final project kelompok 1–3 orang di akhir program.",
          highlight: true
        }
      ],
      competitorLimitation: "Durasi modul pembelajaran sangat cepat (hanya 9 minggu modul), mensyaratkan min. lulusan S1, dan tidak ada jaminan refund biaya.",
      revouEdge: "RevoU FSDA terbuka untuk seluruh jenjang, durasi belajar 6–9 bulan intensif dengan 3 bulan RevoU Labs dan garansi refund 100%.",
      acTalkingPoint: "Purwadhika BDA waktu modul belajarnya relatif singkat yaitu 9 minggu dan mewajibkan syarat min. S1. Kalau di RevoU FSDA, kita mendalami SQL, Python, Tableau, dan data storytelling selama 6–9 bulan termasuk 3 bulan RevoU Labs mengerjakan data klien nyata, dan ada jaminan refund 100% transparan."
    },
    {
      id: "pwd-dm",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Digital Marketing",
      badge: "Job Connector",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an (All-in termasuk alokasi real ads budget jutaan rupiah).",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Promo 39th Rp 18,5jt | Normal Rp 25jt.",
          highlight: false
        },
        {
          parameter: "Praktek Anggaran Iklan Riil",
          categoryTag: "REAL ADS BUDGET",
          revouValue: "Setiap siswa memegang REAL BUDGET ADS jutaan rupiah langsung untuk running campaign live di Meta, Google, & TikTok.",
          competitorValue: "Latihan akun demo / tugas kelompok dengan anggaran terbatas.",
          highlight: true
        },
        {
          parameter: "Format Kelompok Proyek Akhir",
          categoryTag: "PORTOFOLIO AKHIR",
          revouValue: "Portofolio mandiri & RevoU Labs 3 bulan bersama real client bisnis nyata.",
          competitorValue: "Final project dikerjakan dalam kelompok BESAR (7–8 orang) sehingga kontribusi individu tidak menonjol.",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang (SMA/SMK/D3/S1).",
          competitorValue: "Mewajibkan minimal lulusan S1.",
          highlight: true
        }
      ],
      competitorLimitation: "Final project dibagi dalam kelompok besar (7–8 orang) sehingga kontribusi individu tidak terlihat, dan mensyaratkan min. S1.",
      revouEdge: "Di RevoU FSDM, setiap peserta mengelola real budget ads jutaan rupiah secara mandiri dan dibimbing 1-on-1 oleh Lead praktisi top tech.",
      acTalkingPoint: "Di Purwadhika final project-nya dikerjakan bareng 7-8 orang kak, jadi hasil portofolionya dibagi banyak orang. Kalau di RevoU FSDM, kakak langsung megang real ads budget jutaan rupiah sendiri untuk running live campaign, ada 3 bulan RevoU Labs, dan dibimbing Career Coach 1-on-1 sampai dapat kerja. Kakak lebih memprioritaskan portofolio mandiri atau kelompok besar kak? :)"
    },
    {
      id: "pwd-fsd",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Fullstack Software Development",
      badge: "Job Connector",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Jaminan Refund",
          categoryTag: "INVESTASI & REFUND",
          revouValue: "Rp 16.000.000 – Rp 25.000.000-an + Garansi Refund 100% transparan.",
          competitorValue: "Early Bird Rp 15jt | Promo 39th Rp 18,5jt | Normal Rp 25jt. Tanpa garansi refund.",
          highlight: true
        },
        {
          parameter: "Support System Harian",
          categoryTag: "SUPPORT BELAJAR",
          revouValue: "Pengajar Praktisi + Section Manager + Team Lead + Mentor + 1-on-1 Personal Career Coach.",
          competitorValue: "Instruktur kelas + Admin + Career portal.",
          highlight: true
        },
        {
          parameter: "Proyek Nyata (RevoU Labs)",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs membangun produk nyata terintegrasi deployment live untuk partner bisnis.",
          competitorValue: "Final project kelompok 2–3 orang (4–5 minggu).",
          highlight: true
        }
      ],
      competitorLimitation: "Tidak ada garansi refund biaya 100% jika peserta tidak bekerja, dan pendampingan career support terpusat pada job portal pasif.",
      revouEdge: "Pendampingan intensif harian dengan Section Manager dan Team Lead, review kode baris-per-baris oleh Senior Engineer, 3 bulan RevoU Labs, dan garansi refund 100% transparan.",
      acTalkingPoint: "Kurikulum Fullstack Purwadhika cukup lengkap kak, namun di RevoU FSSE kakak mendapatkan pendampingan lebih intensif harian dari Section Manager dan mentor, 3 bulan RevoU Labs membangun produk riil perusahaan, serta jaminan refund 100% transparan jika tidak terserap kerja."
    }
  ],

  // ── 3. DIBIMBING (Katalog 7 Domain Resmi) ──
  dibimbing: [
    {
      id: "db-da",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Data Analytics Bootcamp",
      badge: "Bootcamp ±4 Bulan",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Garansi Uang Kembali",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Investasi berbanding lurus dengan fasilitas: **100% Live Instruction** harian, 3 bulan RevoU Labs, & **Garansi Refund 100%**.",
          competitorValue: "Rp 7.000.000 – Rp 15.000.000 (Harga ekonomis, banyak diskon promo, benefit gratis ulang kelas seumur hidup tanpa refund dana).",
          highlight: true
        },
        {
          parameter: "Format Belajar & Intensitas Sesi",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif dua arah 5x per minggu (>80 sesi live intensif) bersama Lead/Manager aktif unicorn.",
          competitorValue: "Kombinasi video rekaman materi LMS + sesi Live Zoom tanya jawab 2–3x per minggu.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (RevoU Labs)",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs menganalisis dataset bisnis skala enterprise ribuan-jutaan baris data klien nyata.",
          competitorValue: "Portofolio tugas akhir dan talent showcase ke partner.",
          highlight: true
        },
        {
          parameter: "Reputasi Recruiter Top Tech",
          categoryTag: "TRACK RECORD",
          revouValue: "Kurikulum terstandar unicorn, 6.000+ alumni aktif di 1.000+ top company (Gojek, Tokopedia, Traveloka, Shopee, Big 4).",
          competitorValue: "Penyaluran ke 1.100+ hiring partner Dibimbing.",
          highlight: false
        }
      ],
      competitorLimitation: "Hanya 2–3 sesi per minggu dan sebagian materi berupa rekaman video; jam interaksi live bersama praktisi jauh lebih sedikit.",
      revouEdge: "100% Live Instruction 5x seminggu (>80 sesi intensif), review tugas personal mingguan, 3 bulan RevoU Labs, dan reputasi alumni terbukti di unicorn & Big 4.",
      acTalkingPoint: "Dibimbing cocok kalau kakak ingin belajar santai 2-3 sesi per minggu via video rekaman LMS. Tapi jika kakak ingin switch career total menjadi Data Analyst handal, RevoU menyediakan 100% live class interaktif 5x seminggu, bimbingan langsung dari Lead Data unicorn, dan 3 bulan RevoU Labs analisis real dataset bisnis."
    },
    {
      id: "db-dm",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Digital Marketing Bootcamp",
      badge: "Bootcamp ±4 Bulan",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Format Sesi & Real Budget",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Instruction 5x/minggu + Setiap siswa pegang REAL BUDGET ADS jutaan rupiah langsung.",
          competitorValue: "Video LMS rekaman + live Zoom 2-3x/minggu tanpa alokasi anggaran ads riil mandiri.",
          highlight: true
        },
        {
          parameter: "Portofolio Klien Nyata",
          categoryTag: "PROYEK NYATA",
          revouValue: "3 Bulan RevoU Labs menjalankan kampanye pemasaran nyata untuk perusahaan partner.",
          competitorValue: "Studi kasus latihan dan tugas akhir kelompok.",
          highlight: true
        },
        {
          parameter: "Garansi Refund",
          categoryTag: "JAMINAN REFUND",
          revouValue: "Garansi Refund Biaya s.d. 100% jika belum mendapatkan pekerjaan.",
          competitorValue: "Benefit mengulang kelas gratis tanpa pengembalian biaya.",
          highlight: true
        }
      ],
      competitorLimitation: "Sebagian materi berupa rekaman video mandiri LMS dan pertemuan live hanya 2–3x seminggu; anggaran ads latihan sangat terbatas dibanding RevoU.",
      revouEdge: "100% Live Instruction interaktif harian (5x seminggu), alokasi real ads budget jutaan rupiah untuk setiap siswa, dan 3 bulan RevoU Labs klien riil.",
      acTalkingPoint: "Dibimbing memang opsi yang ramah kantong untuk belajar santai 2-3x seminggu via video LMS kak. Tapi kalau tujuan kakak ingin career switch menjadi Digital Marketer handal di perusahaan top, RevoU memberikan 100% live class interaktif setiap hari, real ads budget jutaan rupiah, dan 3 bulan RevoU Labs bersama real client."
    }
  ],

  // ── 4. DQLAB (Live Zoom & Sertifikasi Resmi) ──
  dqlab: [
    {
      id: "dq-da",
      competitorId: "dqlab",
      competitorName: "DQLab",
      programTitle: "Data Analyst with SQL and Python & Ujian BNSP",
      badge: "Live Zoom Singkat (17 Sesi)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Model Program",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Program Karir Komprehensif End-to-End 6–9 bulan (Rp 16jt–25jt) + Garansi Refund 100%.",
          competitorValue: "Kursus Modular Singkat Rp 899.000 (normal Rp 1.099.000) atau paket bundle BNSP Rp 1,2jt–3,8jt.",
          highlight: true
        },
        {
          parameter: "Durasi & Total Jam Belajar",
          categoryTag: "DURASI BELAJAR",
          revouValue: "6 – 9 bulan (>80 sesi intensif harian + 3 bulan RevoU Labs menganalisis dataset enterprise).",
          competitorValue: "17 sesi singkat (total 42,5 jam, 2x seminggu malam).",
          highlight: true
        },
        {
          parameter: "Cakupan Materi",
          categoryTag: "KURIKULUM",
          revouValue: "End-to-end: SQL, Python, Tableau, Looker Studio, Advanced Excel, Data Storytelling, Business Problem Solving.",
          competitorValue: "SQL queries dasar, manipulasi data Pandas, dan persiapan uji kompetensi BNSP.",
          highlight: true
        },
        {
          parameter: "Dukungan Karir (Job Placement)",
          categoryTag: "PERSIAPAN KERJA",
          revouValue: "RevoU NEXT: 1-on-1 Personal Career Coach, 16 sesi Career Development live, simulasi interview sampai hired.",
          competitorValue: "Fokus persiapan ujian sertifikasi BNSP (tanpa pendampingan karir 1-on-1 mendalam).",
          highlight: true
        }
      ],
      competitorLimitation: "Hanya 17 sesi (42 jam) pengenalan dasar tanpa bimbingan portofolio bisnis nyata atau pendampingan karir 1-on-1.",
      revouEdge: "Di RevoU FSDA peserta belajar >80 sesi intensif (6–9 bulan), menguasai Tableau, Looker, dan 3 bulan RevoU Labs mengerjakan data bisnis riil, didampingi Career Coach sampai dapat kerja.",
      acTalkingPoint: "DQLab hanya 17 sesi (42 jam) pengenalan dasar kak. Di RevoU FSDA peserta belajar >80 sesi intensif (6–9 bulan), menguasai SQL, Python, Tableau, Looker Studio, dan 3 bulan RevoU Labs mengerjakan data bisnis riil, didampingi Career Coach 1-on-1 sampai dapat kerja."
    },
    {
      id: "dq-genai",
      competitorId: "dqlab",
      competitorName: "DQLab",
      programTitle: "Gen AI & n8n for AI Workflow Automation",
      badge: "Live Zoom Singkat (10 Sesi)",
      revouMatchProgram: "x BINUS: Applied AI, Analytics & Automation",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Kredensial & Akreditasi",
          categoryTag: "KREDENSIAL",
          revouValue: "Kredensial & Sertifikat Resmi dari **BINUS University** / **ITB**.",
          competitorValue: "Sertifikat kelulusan kelas Zoom DQLab.",
          highlight: true
        },
        {
          parameter: "Durasi & Kedalaman Materi",
          categoryTag: "DURASI BELAJAR",
          revouValue: "3 Bulan komprehensif membedah strategi AI korporat dan otomasi workflow bisnis.",
          competitorValue: "10 sesi ringkas (total 20 jam, 2x seminggu malam).",
          highlight: true
        }
      ],
      competitorLimitation: "Hanya kursus ringkas 20 jam tanpa pendampingan manajerial dan tanpa akreditasi kampus ternama.",
      revouEdge: "Program Executive RevoU x BINUS memadukan otomatisasi n8n dengan strategic thinking manajerial, keamanan data korporasi, dan kredensial resmi institusi BINUS.",
      acTalkingPoint: "Kelas DQLab ini ringkas 20 jam. Di program Executive RevoU x BINUS, otomatisasi dipadukan dengan strategic thinking manajerial, keamanan data korporasi, dan kredensial resmi institusi BINUS."
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA TABEL GENERAL KOMPARASI DENGAN FIELD PER KOMPETITOR
// ─────────────────────────────────────────────────────────────────────────────
interface GeneralComparisonRow {
  category: "Sistem Belajar" | "Persiapan Kerja" | "Jaminan Kerja" | "Komunitas Alumni" | "Seleksi Program";
  feature: string;
  revou: string;
  general: string;
  hacktiv8: string;
  purwadhika: string;
  dibimbing: string;
  dqlab: string;
  selfPaced: string;
  revouHighlight?: boolean;
}

const GENERAL_COMPARISON_DATA: GeneralComparisonRow[] = [
  // Sistem Belajar
  {
    category: "Sistem Belajar",
    feature: "Format Pembelajaran",
    revou: "100% Live Online (+ Akses rekaman & materi ajar selamanya)",
    general: "Kombinasi kelas live dengan rekaman video",
    hacktiv8: "Kampus Offline Jakarta (Kebayoran) & Remote Online live coding intensif",
    purwadhika: "Kampus Fisik (BSD/Jakarta/Batam) & Online Livestream / Video Learning",
    dibimbing: "Kombinasi materi video rekaman LMS + sesi Live Zoom tanya jawab / mentoring mingguan",
    dqlab: "Live Class Zoom interaktif singkat (10–17 sesi) + modul platform mandiri",
    selfPaced: "100% rekaman video mandiri",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Biaya & Skema Cicilan",
    revou: "Rp 16.000.000 – Rp 25.000.000-an (Cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita, tanpa biaya kos)",
    general: "Rp 7.000.000 – Rp 45.000.000 (Sering ada biaya pendaftaran/non-refundable)",
    hacktiv8: "Full-Day Rp 35jt–45jt | Night Rp 18jt–25jt. Reg fee Rp 100rb, non-refundable. Upfront 2 tahap / cicilan",
    purwadhika: "Tiered Rp 10jt–35jt (Early Bird Rp 13jt–20jt, Term 1/2 Rp 15jt–30jt, Promo Rp 14,5jt–27,5jt, Normal Rp 20jt–35jt)",
    dibimbing: "Rp 7jt – Rp 15jt (Ekonomis, bayar penuh atau cicilan, gratis mengulang batch seumur hidup)",
    dqlab: "Rp 699rb – Rp 3,8jt (Bootcamp single Rp 699rb–2,5jt, Ujian BNSP Rp 1,9jt–2,5jt, Bundle Rp 1,2jt–3,8jt)",
    selfPaced: "Rp 500rb – Rp 5jt (tanpa bimbingan live)",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Jadwal & Komitmen Waktu",
    revou: "Malam hari (19.00–21.00 WIB) ramah pekerja & mahasiswa",
    general: "Bervariasi (beberapa program full-day bentrok jam kantor)",
    hacktiv8: "Full-Day 09:00–18:00 WIB (Senin–Jumat wajib komitmen seharian) atau Night 19:00–22:00 WIB",
    purwadhika: "After Hours (Sen–Kam / Sel & Kam 19:00–22:00) atau Office Hours (Sen–Kam 09:00–12:00)",
    dibimbing: "Weekday malam atau Weekend (frekuensi 2–3 sesi per minggu)",
    dqlab: "2x seminggu malam (19:00–21:30 WIB) atau weekend pagi (10:00–12:00)",
    selfPaced: "Mandiri tanpa jadwal pasti",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Durasi & Total Sesi",
    revou: "6 – 9 bulan (>80 sesi intensif live + 3 bulan RevoU Labs)",
    general: "3 – 5 bulan (<60 sesi)",
    hacktiv8: "12 – 16 minggu (4 minggu persiapan + 8–12 minggu bootcamp)",
    purwadhika: "Kalender 20–28 minggu (modul 6–15 minggu + final project 4–5 minggu)",
    dibimbing: "Pre-bootcamp + 24 minggu bootcamp + 2 post + 4 minggu Job Connect (±7 bulan)",
    dqlab: "10 – 17 sesi singkat (durasi 1,5 – 2,5 bulan, total 20–42,5 jam)",
    selfPaced: "7 – 9 bulan tanpa sesi live",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Sesi Tanya Jawab & Diskusi",
    revou: "5x per minggu live interaktif dua arah bersama praktisi",
    general: "1 – 3x per minggu",
    hacktiv8: "Harian intensif di jam kelas full-day atau 15 jam/minggu night",
    purwadhika: "Sesuai jadwal sesi kelas (Sen–Kam malam / siang)",
    dibimbing: "1 – 2x per minggu sesi tanya jawab mentor",
    dqlab: "Tanya jawab singkat di akhir sesi Zoom (2x seminggu)",
    selfPaced: "Forum diskusi mandiri / tidak ada",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Kurikulum & Case Study",
    revou: "Disesuaikan kebutuhan industri di Indonesia & Asia Tenggara",
    general: "Sebagian teori umum atau materi luar tanpa konteks lokal",
    hacktiv8: "Coding stack murni (JS/Node/React/Go/Python)",
    purwadhika: "Modul industri umum (termasuk modul no-code & AI tools)",
    dibimbing: "Modul praktis terstandar di berbagai bidang (tech & non-tech)",
    dqlab: "Modul sintaks dasar koding data dan persiapan uji SKKNI",
    selfPaced: "Terjemahan materi luar negeri tanpa konteks lokal"
  },
  {
    category: "Sistem Belajar",
    feature: "Support System Belajar",
    revou: "Pengajar Praktisi + Section Manager + Team Lead + Mentor + Konselor",
    general: "Pengajar + Admin Kelas",
    hacktiv8: "Instructor + Buddy + Admin",
    purwadhika: "Instructor + Class Admin + Mentor",
    dibimbing: "Mentor + Class Admin (ada fasilitas gratis ulang kelas)",
    dqlab: "Instruktur Zoom + Komunitas Discord/Telegram",
    selfPaced: "Pengajar saja / Forum mandiri",
    revouHighlight: true
  },

  // Persiapan Kerja
  {
    category: "Persiapan Kerja",
    feature: "Proyek Nyata Portofolio (RevoU Labs)",
    revou: "3 Bulan Program Khusus (RevoU Labs) dengan real client & real budget iklan/data",
    general: "2–4 minggu proyek dummy simulasi / tugas akhir mandiri",
    hacktiv8: "Final project web app / pipeline model kelompok kecil di akhir fase",
    purwadhika: "Final project kelompok (DM 7–8 orang, Fullstack 2–3 orang, AI 1–3 orang)",
    dibimbing: "Portofolio tugas akhir dan talent showcase ke partner",
    dqlab: "Latihan modul sintaks koding & studi kasus dasar",
    selfPaced: "Proyek mandiri tanpa bimbingan",
    revouHighlight: true
  },
  {
    category: "Persiapan Kerja",
    feature: "Kelas Pengembangan Karir & Review CV",
    revou: "16 sesi LIVE bersama Career Coach + 1-on-1 Personalized Coaching",
    general: "< 10 sesi, mayoritas rekaman",
    hacktiv8: "Career class, latihan interview, Job Portal, Career Buddy",
    purwadhika: "Purwadhika Hiring Network portal & review CV/portofolio",
    dibimbing: "Konsultasi 1-on-1, review CV & LinkedIn, latihan interview",
    dqlab: "Terfokus bimbingan ujian sertifikasi (tanpa pendampingan karir 1-on-1)",
    selfPaced: "Tergantung penyedia / tidak ada",
    revouHighlight: true
  },

  // Jaminan Kerja
  {
    category: "Jaminan Kerja",
    feature: "Jaminan Refund Biaya",
    revou: "Refund s.d. 100% biaya program dengan syarat transparan (10 lamaran/minggu)",
    general: "Syarat refund sangat ketat / skema ISA mengikat",
    hacktiv8: "Tanpa refund (Non-refundable), skema Study Now Pay Later atau cicilan",
    purwadhika: "Tidak ada jaminan refund biaya (Purwadhika Hiring Network portal)",
    dibimbing: "Gratis mengulang batch seumur hidup (tidak ada jaminan refund dana)",
    dqlab: "Tidak ada jaminan refund dana",
    selfPaced: "Tidak ada jaminan refund",
    revouHighlight: true
  },
  {
    category: "Jaminan Kerja",
    feature: "Sertifikasi & Kemitraan Kampus",
    revou: "RevoU Certificate bertaraf internasional + Sertifikasi Resmi Kemitraan Universitas Top (ITB, BINUS, UI)",
    general: "Sertifikat internal lembaga kursus biasa",
    hacktiv8: "Sertifikat Kelulusan Hacktiv8 & BNSP (pada program tertentu)",
    purwadhika: "Sertifikat Purwadhika Digital Technology School",
    dibimbing: "Sertifikat Kelulusan Dibimbing",
    dqlab: "Ujian Sertifikasi Resmi BNSP (KKNI 6 & 7) & Pearson VUE AI",
    selfPaced: "Certificate of completion otomatis platform",
    revouHighlight: true
  },

  // Komunitas Alumni & Seleksi
  {
    category: "Komunitas Alumni",
    feature: "Jumlah Komunitas Alumni & Network",
    revou: "6.000+ Alumni Aktif di 1.000+ top company & 550.000+ member pelajar",
    general: "< 2.000 alumni / < 200.000 member",
    hacktiv8: "Alumni network coding tech di Jabodetabek & kota besar",
    purwadhika: "Alumni Purwadhika network di Jabodetabek & BSD",
    dibimbing: "10.000+ lulusan & 1.100+ partner perusahaan",
    dqlab: "Komunitas data learners DQLab se-Indonesia",
    selfPaced: "0 / tidak terpusat",
    revouHighlight: true
  },
  {
    category: "Seleksi Program",
    feature: "Tingkat Seleksi Masuk",
    revou: "Kurang dari 10% (Tes dasar + wawancara untuk jamin circle terbaik), terbuka SMA/SMK/S1",
    general: "Mayoritas tanpa seleksi ketat",
    hacktiv8: "Screening test dasar; program AI wajib min. 1 tahun di IT",
    purwadhika: "Mayoritas program mewajibkan minimal lulusan S1",
    dibimbing: "Terbuka untuk umum tanpa seleksi ketat",
    dqlab: "Terbuka untuk umum tanpa seleksi",
    selfPaced: "Tanpa seleksi",
    revouHighlight: true
  },
  {
    category: "Seleksi Program",
    feature: "Completion Rate Peserta",
    revou: "93% peserta berhasil menyelesaikan program sampai akhir",
    general: "30% – 60% completion rate",
    hacktiv8: "88% direkrut <3 bulan bagi yang lulus",
    purwadhika: "92% lulusan DS&ML berkarir di data",
    dibimbing: "96% alumni dapat kerja",
    dqlab: "Tingkat kelulusan sertifikasi BNSP",
    selfPaced: "< 15% completion rate",
    revouHighlight: true
  }
];

export default function ComparisonView() {
  const [activeTab, setActiveTab] = useState<"bootcamp" | "general" | "battlecards">("bootcamp");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ── DUAL DROPDOWN STATES (RevoU vs [Kompetitor] -> [Pilih Program]) ──
  const [selectedCompetitorKey, setSelectedCompetitorKey] = useState<"hacktiv8" | "purwadhika" | "dibimbing" | "dqlab">("hacktiv8");

  // Programs of the active competitor in Dropdown 1
  const availableProgramsForSelectedComp = COMPETITOR_PROGRAMS_BY_VENDOR[selectedCompetitorKey] || [];

  // Initially empty so output tables appear only after the user selects a program!
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");


  // Active program detail (null when no program has been chosen yet)
  const activeProgramDetail = useMemo(() => {
    if (!selectedProgramId) return null;
    return availableProgramsForSelectedComp.find((p) => p.id === selectedProgramId) || null;
  }, [availableProgramsForSelectedComp, selectedProgramId]);

  // Unique RevoU program badges for this competitor
  const uniqueRevoUProgramsForComp = useMemo(() => {
    const seen = new Set<string>();
    const list: { badge: string; title: string; firstProgramId: string }[] = [];
    for (const prog of availableProgramsForSelectedComp) {
      if (!seen.has(prog.revouMatchBadge)) {
        seen.add(prog.revouMatchBadge);
        list.push({
          badge: prog.revouMatchBadge,
          title: `RevoU ${prog.revouMatchProgram}`,
          firstProgramId: prog.id
        });
      }
    }
    return list;
  }, [availableProgramsForSelectedComp]);

  const handleRevoUMatchChange = (badge: string) => {
    if (!badge) {
      setSelectedProgramId("");
      return;
    }
    const found = uniqueRevoUProgramsForComp.find((item) => item.badge === badge);
    if (found) {
      setSelectedProgramId(found.firstProgramId);
    }
  };

  // Handle change of Dropdown 1 (Competitor)
  const handleCompetitorChange = (newComp: "hacktiv8" | "purwadhika" | "dibimbing" | "dqlab") => {
    setSelectedCompetitorKey(newComp);
    setSelectedProgramId(""); // Reset program selection so user chooses program for new competitor
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredGeneralRows = GENERAL_COMPARISON_DATA;

  const competitorDisplayNames: Record<string, string> = {
    hacktiv8: "Hacktiv8",
    purwadhika: "Purwadhika",
    dibimbing: "Dibimbing",
    dqlab: "DQLab"
  };

  const activeBattlecard = BATTLECARDS.find((b) => b.id === selectedCompetitorKey) || BATTLECARDS[0];

  // Helper to dynamically integrate row data combining general benchmarks with activeProgramDetail specifics
  const getIntegratedRowData = (row: GeneralComparisonRow) => {
    if (!activeProgramDetail) {
      return {
        revouText: row.revou,
        compText: row[selectedCompetitorKey] || row.general,
        isSpecificMatch: false
      };
    }

    const matchingDetailRow = activeProgramDetail.tableRows.find((detailRow) => {
      const p1 = detailRow.parameter.toLowerCase();
      const p2 = row.feature.toLowerCase();
      return (
        p1.includes(p2) ||
        p2.includes(p1) ||
        (p2.includes("biaya") && p1.includes("biaya")) ||
        (p2.includes("jadwal") && p1.includes("jadwal")) ||
        (p2.includes("durasi") && p1.includes("durasi")) ||
        (p2.includes("proyek") && (p1.includes("portofolio") || p1.includes("proyek"))) ||
        (p2.includes("portofolio") && (p1.includes("portofolio") || p1.includes("proyek"))) ||
        (p2.includes("kurikulum") && p1.includes("kurikulum")) ||
        (p2.includes("refund") && p1.includes("refund")) ||
        (p2.includes("jaminan") && p1.includes("jaminan")) ||
        (p2.includes("karir") && p1.includes("karir")) ||
        (p2.includes("sertifikasi") && p1.includes("sertifikasi"))
      );
    });

    if (matchingDetailRow) {
      return {
        revouText: matchingDetailRow.revouValue,
        compText: matchingDetailRow.competitorValue,
        isSpecificMatch: true
      };
    }

    return {
      revouText: row.revou,
      compText: row[selectedCompetitorKey] || row.general,
      isSpecificMatch: false
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP CONTROL CONTAINER: DUA LEVEL DROPDOWN TERPISAH            */}
      {/* LEVEL 1: HEAD-TO-HEAD LEMBAGA (DIPISAH: LEMBAGA 1 VS LEMBAGA 2) */}
      {/* LEVEL 2: DROPDOWN PROGRAM-PROGRAM LEMBAGA (DI BAWAHNYA)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* KONTROL KOMPARASI PERSIS SESUAI SKETSA USER                   */}
      {/* Baris 1: Lembaga kami [RevoU] vs Pilih Kompetitor [Lembaga lain]*/}
      {/* Baris 2: Program kami [RevoU] vs Program kompetitor            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border-2 border-[#141412] rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6 card-interactive"
      >

        {/* ── BARIS 1: LEMBAGA KAMI vs PILIH KOMPETITOR ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 sm:gap-6 items-center">
          {/* Sisi Kiri: Lembaga kami */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-[#141412] mb-1.5 flex items-center justify-between">
              <span>Lembaga kami</span>
              <span className="font-mono text-[10.5px] uppercase font-bold text-[#1F7A4D] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#D4EDDA]">
                Utama
              </span>
            </label>
            <div className="dropdown-wrapper group">
              <select
                disabled
                className="w-full appearance-none bg-[#F5F5F2] text-[#141412] font-display font-extrabold text-base sm:text-lg rounded-2xl px-5 py-3.5 pr-12 cursor-default border-2 border-transparent transition-all"
              >
                <option value="revou">RevoU</option>
              </select>
              <ChevronDown className="dropdown-chevron-animated w-6 h-6 text-[#141412] stroke-[3] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-xs" />
            </div>
          </div>

          {/* Tengah: vs */}
          <div className="flex items-center justify-center pt-1 md:pt-6">
            <span className="font-display font-bold text-lg sm:text-xl text-[#141412] lowercase select-none px-3 py-1 bg-[#F5F5F2] rounded-full border border-[#E8E8E4]">
              vs
            </span>
          </div>

          {/* Sisi Kanan: Pilih Kompetitor */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-[#141412] mb-1.5 flex items-center justify-between">
              <span>Pilih Kompetitor</span>
              <span className="font-mono text-[10.5px] uppercase font-bold text-[#A15C00] bg-[#FFF6D1] px-2 py-0.5 rounded-full border border-[#FFD84D]/60 animate-pulse">
                Pilih
              </span>
            </label>
            <div className="dropdown-wrapper group">
              <select
                value={selectedCompetitorKey}
                onChange={(e) => handleCompetitorChange(e.target.value as any)}
                className="w-full appearance-none bg-[#E0E0E0] hover:bg-[#D6D6D6] text-[#141412] font-display font-extrabold text-base sm:text-lg rounded-2xl px-5 py-3.5 pr-12 cursor-pointer shadow-xs transition-all duration-200 border-2 border-transparent hover:border-[#FFD84D] focus:border-[#FFD84D] focus:ring-4 focus:ring-[#FFD84D]/35 focus:outline-none"
              >
                <option value="hacktiv8">Hacktiv8</option>
                <option value="purwadhika">Purwadhika</option>
                <option value="dibimbing">Dibimbing</option>
                <option value="dqlab">DQLab</option>
              </select>
              <ChevronDown className="dropdown-chevron-animated w-6 h-6 text-[#141412] stroke-[3] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-xs" />
            </div>
          </div>
        </div>

        {/* ── BARIS 2 (DI BAWAHNYA): PROGRAM KAMI vs PROGRAM KOMPETITOR ── */}
        <div className="pt-4 border-t border-[#E8E8E4]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 sm:gap-6 items-center">
            {/* Sisi Kiri: Program kami */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-[#141412] mb-1.5 flex items-center justify-between">
                <span>Program kami</span>
                <span className={`font-mono text-[10.5px] uppercase font-bold px-2 py-0.5 rounded-full border ${activeProgramDetail ? "text-[#1F7A4D] bg-[#EBF7EE] border-[#D4EDDA]" : "text-[#A15C00] bg-[#FFF6D1] border-[#FFD84D]/60 animate-pulse"}`}>
                  {activeProgramDetail ? "Terpilih" : "Wajib Pilih"}
                </span>
              </label>
              <div className="dropdown-wrapper group">
                <select
                  value={activeProgramDetail?.revouMatchBadge || ""}
                  onChange={(e) => handleRevoUMatchChange(e.target.value)}
                  className="w-full appearance-none bg-[#E8E8E8] hover:bg-[#DFDFDF] text-[#141412] font-display font-bold text-sm sm:text-base rounded-2xl px-5 py-3.5 pr-12 cursor-pointer shadow-xs transition-all duration-200 border-2 border-transparent hover:border-[#FFD84D] focus:border-[#FFD84D] focus:ring-4 focus:ring-[#FFD84D]/35 focus:outline-none truncate"
                >
                  <option value="">— Pilih Program RevoU —</option>
                  {uniqueRevoUProgramsForComp.map((p) => (
                    <option key={p.badge} value={p.badge}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="dropdown-chevron-animated w-6 h-6 text-[#141412] stroke-[3] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-xs" />
              </div>
              <p className="text-xs text-[#60605B] mt-1.5 font-medium truncate">
                {activeProgramDetail ? (activeProgramDetail.revouMatchProgram.startsWith("x ") ? `RevoU ${activeProgramDetail.revouMatchProgram}` : activeProgramDetail.revouMatchProgram) : "Pilih program RevoU untuk membuka tabel"}
              </p>
            </div>

            {/* Tengah: vs */}
            <div className="flex items-center justify-center pt-1 md:pt-6">
              <span className="font-display font-bold text-lg sm:text-xl text-[#141412] lowercase select-none px-3 py-1 bg-[#F5F5F2] rounded-full border border-[#E8E8E4]">
                vs
              </span>
            </div>

            {/* Sisi Kanan: Program kompetitor */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-[#141412] mb-1.5 flex items-center justify-between">
                <span>Program {competitorDisplayNames[selectedCompetitorKey]}</span>
                <span className={`font-mono text-[10.5px] uppercase font-bold px-2 py-0.5 rounded-full border ${activeProgramDetail ? "text-[#1F7A4D] bg-[#EBF7EE] border-[#D4EDDA]" : "text-[#A15C00] bg-[#FFF6D1] border-[#FFD84D]/60 animate-pulse"}`}>
                  {activeProgramDetail ? "Terpilih" : "Wajib Pilih"}
                </span>
              </label>
              <div className="dropdown-wrapper group">
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full appearance-none bg-[#E8E8E8] hover:bg-[#DFDFDF] text-[#141412] font-display font-bold text-sm sm:text-base rounded-2xl px-5 py-3.5 pr-12 cursor-pointer shadow-xs transition-all duration-200 border-2 border-transparent hover:border-[#FFD84D] focus:border-[#FFD84D] focus:ring-4 focus:ring-[#FFD84D]/35 focus:outline-none truncate"
                >
                  <option value="">— Pilih Program {competitorDisplayNames[selectedCompetitorKey]} —</option>
                  {availableProgramsForSelectedComp.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.programTitle} — [{prog.badge}]
                    </option>
                  ))}
                </select>
                <ChevronDown className="dropdown-chevron-animated w-6 h-6 text-[#141412] stroke-[3] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-xs" />
              </div>
              <p className="text-xs text-[#A15C00] mt-1.5 font-medium truncate">
                {activeProgramDetail ? `Format: ${activeProgramDetail.badge}` : `Pilih program ${competitorDisplayNames[selectedCompetitorKey]} untuk membuka tabel`}
              </p>
            </div>
          </div>

          {/* Quick Pill Buttons untuk Program Kompetitor */}
          <div className="pt-4 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] text-[#8A8A84] font-bold uppercase shrink-0">
              Pilihan Cepat:
            </span>
            {availableProgramsForSelectedComp.map((p) => {
              const isSelected = p.id === selectedProgramId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProgramId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none border ${isSelected
                    ? "bg-[#141412] text-[#FFD84D] border-[#141412] shadow-xs active:scale-95"
                    : "bg-[#F5F5F2] text-[#4B4B46] border-[#E8E8E4] hover:border-[#141412] hover:bg-[#EAEAEA] active:scale-95"
                    }`}
                >
                  {p.programTitle}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-NAVIGATION TABS (Tabel Spesifik, Tabel General, Battlecard)*/}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 border-b-2 border-[#E8E8E4] -mb-[2px]">
        <button
          type="button"
          onClick={() => setActiveTab("bootcamp")}
          className={`group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0 ${activeTab === "bootcamp"
            ? "bg-[#F5F5F0] text-[#141412] border-[#FFD84D]"
            : "bg-transparent text-[#7A7A74] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            }`}
        >
          <Layers className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "bootcamp" ? "text-[#A15C00]" : "text-[#8A8A84]"}`} />
          <span className="truncate">Tabel Komparasi Spesifik</span>
          <span className="font-mono text-[9px] sm:text-[10px] bg-[#141412] text-white px-1.5 py-0.5 rounded-full shrink-0 hidden lg:inline-block">
            Head-to-Head
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0 ${activeTab === "general"
            ? "bg-[#F5F5F0] text-[#141412] border-[#FFD84D]"
            : "bg-transparent text-[#7A7A74] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            }`}
        >
          <Scale className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "general" ? "text-[#A15C00]" : "text-[#8A8A84]"}`} />
          <span className="truncate">Tabel General RevoU</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("battlecards")}
          className={`group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0 ${activeTab === "battlecards"
            ? "bg-[#F5F5F0] text-[#141412] border-[#FFD84D]"
            : "bg-transparent text-[#7A7A74] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            }`}
        >
          <Award className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "battlecards" ? "text-[#A15C00]" : "text-[#8A8A84]"}`} />
          <span className="truncate">
            <span className="hidden xl:inline">One-Pager </span>Battlecard {competitorDisplayNames[selectedCompetitorKey]}
          </span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TAB: TABEL KOMPARASI SPESIFIK (FORMAT TABEL SEPERTI GENERAL) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "bootcamp" && (
        activeProgramDetail ? (
          <motion.div
            key={activeProgramDetail.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Header Info Komparasi Spesifik */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E8E4] shadow-2xs space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#141412] text-white">
                  Tabel Komparasi Spesifik
                </span>
                <span className="font-mono text-xs bg-[#FFF4E5] text-[#B76E00] border border-[#FFE2B8] font-bold px-2.5 py-0.5 rounded-full">
                  {activeProgramDetail.competitorName}
                </span>
                <span className="font-mono text-xs bg-[#F5F5F2] text-[#4B4B46] font-semibold px-2 py-0.5 rounded-md">
                  {activeProgramDetail.badge}
                </span>
              </div>
              {/* ── BLOOMBERG / FT SCORECARD DUEL BANNER (EXECUTIVE STAGGER MOTION) ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 rounded-xl border border-[#D9D9D4] bg-[#FAFAF8] p-3 sm:p-4 shadow-2xs overflow-hidden"
              >
                {/* Top Overline Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#E8E8E4]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#141412] bg-[#E8E8E4] px-2 py-0.5 rounded">
                      BENCHMARK REPORT // HEAD-TO-HEAD
                    </span>
                    <span className="font-mono text-[10.5px] text-[#7A7A74] hidden sm:inline">
                      Evaluasi Kurikulum &amp; ROI Program
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] text-[#1F7A4D] font-bold bg-[#EBF7EE] border border-[#D4EDDA] px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D]"></span>
                    <span>VERIFIED METRICS · OKT 2026</span>
                  </div>
                </motion.div>

                {/* Duel Scorecard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-2">
                  {/* Left Contender: RevoU (Slide in from Left + Micro-lift on hover) */}
                  <motion.div
                    key={`revou-${activeProgramDetail.id}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="bg-white rounded-lg border-l-4 border-l-[#1F7A4D] border border-[#E8E8E4] p-3 shadow-2xs hover:shadow-xs hover:border-[#D0D0CB] transition-colors cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F7A4D]">
                        [01] PROGRAM RevoU
                      </span>
                      <span className="font-mono text-[9.5px] font-bold bg-[#EBF7EE] text-[#1F7A4D] px-1.5 py-0.5 rounded">
                        {activeProgramDetail.revouMatchBadge || "RevoU"}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xs sm:text-[13.5px] text-[#141412] leading-snug">
                      RevoU {activeProgramDetail.revouMatchProgram}
                    </h4>
                  </motion.div>

                  {/* Center VS Connector (Crisp Spring Pop-in + Micro-tilt on hover) */}
                  <div className="flex items-center justify-center my-0.5 md:my-0">
                    <div className="flex md:flex-col items-center justify-center gap-1">
                      <div className="hidden md:block w-px h-2 bg-[#D9D9D4]"></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.18 }}
                        whileHover={{ scale: 1.15, rotate: 3, transition: { duration: 0.15 } }}
                        className="w-7 h-7 rounded-full bg-[#141412] text-[#FFD84D] font-mono text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs shrink-0 select-none cursor-pointer"
                        title="Head-to-head matchup"
                      >
                        VS
                      </motion.div>
                      <div className="hidden md:block w-px h-2 bg-[#D9D9D4]"></div>
                    </div>
                  </div>

                  {/* Right Contender: Competitor (Slide in from Right + Micro-lift on hover) */}
                  <motion.div
                    key={`comp-${activeProgramDetail.id}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="bg-white rounded-lg border-l-4 border-l-[#B76E00] border border-[#E8E8E4] p-3 shadow-2xs hover:shadow-xs hover:border-[#D0D0CB] transition-colors cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#8A8A84]">
                        [02] PROGRAM KOMPETITOR YANG SESUAI
                      </span>
                      <span className="font-mono text-[9.5px] font-bold bg-[#FFF4E5] text-[#B76E00] px-1.5 py-0.5 rounded">
                        {activeProgramDetail.competitorName}
                      </span>
                    </div>
                    <div className="font-display font-bold text-xs sm:text-[13.5px] text-[#141412] leading-snug">
                      {activeProgramDetail.competitorName} – {activeProgramDetail.programTitle}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Analytical Pitch Insight */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.22 }}
                  className="mt-2.5 pt-2 border-t border-[#E8E8E4] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#4B4B46]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#141412]">PANDUAN ADMISSION:</span>
                    <span className="text-[#60605B]">Kupas tuntas parameter live mentorship, durasi praktik, dan jaminan karir.</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8A8A84] shrink-0">
                    Sistem Perbandingan Resmi
                  </span>
                </motion.div>
              </motion.div>
              <p className="text-xs text-[#8A8A84] mt-0.5">
                Perbandingan rinci parameter kurikulum, biaya resmi per 20 Oktober 2026, jadwal, dan keunggulan RevoU.
              </p>
            </div>

            {/* ── TABEL UTAMA (FORMAT PERSIS SEPERTI TABEL GENERAL TAPI ISINYA SPESIFIK) ── */}
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/4 font-bold border-r border-white/10">
                      Parameter Komparasi
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FEF08A]" />
                        <span>RevoU {activeProgramDetail.revouMatchProgram}</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#2A2A26] text-white">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#FFD84D]" />
                        <span>{activeProgramDetail.competitorName} – {activeProgramDetail.programTitle}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E4]">
                  {activeProgramDetail.tableRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${row.highlight ? "bg-[#FFFDF5]/80 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50"
                        }`}
                    >
                      <td className="p-3.5 sm:p-4 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top">
                        <div>
                          <span className="text-xs sm:text-[13px]">{row.parameter}</span>
                          <span className="block font-mono text-[10px] text-[#8A8A84] font-normal uppercase mt-0.5 tracking-wider">
                            {row.categoryTag}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#141412] font-medium border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-semibold text-[#1F7A4D] text-xs sm:text-[13px]">
                            {row.revouValue}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#141412] align-top leading-relaxed font-normal bg-[#FAFAF8]/60 text-xs sm:text-[13px]">
                        {row.competitorValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── ANALISIS KRITIS & JAWABAN AC ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Keunggulan RevoU */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-2.5 card-interactive">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4D]" />
                  <span>Keunggulan Mutlak RevoU ({activeProgramDetail.revouMatchProgram})</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] font-medium leading-relaxed">
                  {activeProgramDetail.revouEdge}
                </p>
                <div className="text-[11.5px] text-[#1F7A4D] space-y-1 pt-1 border-t border-[#D4EDDA]/80">
                  <p>✓ 100% Live Instruction malam (19:00–21:00 WIB) — tidak perlu resign kerja</p>
                  <p>✓ 3 Bulan RevoU Labs mengerjakan real client & real budget (bukan simulasi dummy)</p>
                  <p>✓ Garansi Refund Biaya s.d. 100% transparan (cukup 10 lamaran/minggu)</p>
                </div>
              </div>

              {/* Keterbatasan Program Kompetitor */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#FFD84D]/80 bg-[#FFFDF0] space-y-2.5 card-interactive">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                  <AlertTriangle className="w-4 h-4 text-[#A15C00]" />
                  <span>Keterbatasan {activeProgramDetail.competitorName} yang Perlu Diketahui AC</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] leading-relaxed">
                  {activeProgramDetail.competitorLimitation}
                </p>
                <p className="text-[11px] text-[#8A8A84] italic pt-1 border-t border-[#FFD84D]/40">
                  💡 Gunakan poin ini secara elegan saat calon siswa menanyakan perbandingan spesifik program ini.
                </p>
              </div>
            </div>

            {/* Template Jawaban AC WhatsApp */}
            <div className="p-4 sm:p-5 rounded-xl border border-[#0E62FE]/30 bg-[#EDF5FF] space-y-2.5 card-interactive">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider text-[#0E62FE]">
                  <Sparkles className="w-4 h-4 text-[#0E62FE]" />
                  <span>Template Jawaban AC Siap Salin untuk Program Ini</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(activeProgramDetail.acTalkingPoint, `pt-${activeProgramDetail.id}`)}
                  className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#0E62FE] text-white hover:bg-[#004ECC] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  {copiedId === `pt-${activeProgramDetail.id}` ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white" />
                      <span>Salin Pesan</span>
                    </>
                  )}
                </button>
              </div>
              <blockquote className="text-xs sm:text-[13px] text-[#141412] leading-relaxed bg-white/80 p-3.5 rounded-lg border border-[#0E62FE]/15 whitespace-pre-line font-normal">
                {activeProgramDetail.acTalkingPoint}
              </blockquote>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border-2 border-dashed border-[#D9D9D4] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-2xs card-interactive"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FFF6D1] text-[#A15C00] mx-auto flex items-center justify-center border border-[#FFD84D] shadow-2xs">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-lg sm:text-xl text-[#141412]">
                Pilih Program untuk Membuka Tabel Komparasi Spesifik
              </h4>
              <p className="text-sm text-[#8A8A84] max-w-[56ch] mx-auto leading-relaxed">
                Tabel komparasi spesifik head-to-head akan muncul setelah Anda memilih program di dropdown atas, atau klik salah satu pilihan cepat di bawah ini:
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
              <span className="font-mono text-xs text-[#8A8A84] font-bold uppercase w-full mb-1">
                Pilihan Cepat Program {competitorDisplayNames[selectedCompetitorKey]}:
              </span>
              {availableProgramsForSelectedComp.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProgramId(p.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5F5F2] hover:bg-[#FFD84D] hover:text-[#141412] text-[#4B4B46] border border-[#E8E8E4] transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {p.programTitle} →
                </button>
              ))}
            </div>
          </motion.div>
        ))}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TAB: TABEL GENERAL REVOU (TERINTEGRASI PROGRAM)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "general" && (
        activeProgramDetail ? (
          <motion.div
            key={activeProgramDetail.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E8E4] shadow-2xs space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#141412] text-white">
                    Tabel Komparasi Terintegrasi Program
                  </span>
                  <span className="font-mono text-xs bg-[#EBF7EE] text-[#1F7A4D] font-bold px-2.5 py-0.5 rounded-full border border-[#D4EDDA]">
                    {activeProgramDetail.revouMatchBadge}
                  </span>
                  <span className="font-mono text-xs bg-[#FFF4E5] text-[#A15C00] font-bold px-2.5 py-0.5 rounded-full border border-[#FFE2B8]">
                    {activeProgramDetail.badge}
                  </span>
                </div>
                {/* ── BLOOMBERG / FT SCORECARD DUEL BANNER (EXECUTIVE STAGGER MOTION) ── */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-3 rounded-xl border border-[#D9D9D4] bg-[#FAFAF8] p-3 sm:p-4 shadow-2xs overflow-hidden"
                >
                  {/* Top Overline Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#E8E8E4]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#141412] bg-[#E8E8E4] px-2 py-0.5 rounded">
                        BENCHMARK REPORT // HEAD-TO-HEAD
                      </span>
                      <span className="font-mono text-[10.5px] text-[#7A7A74] hidden sm:inline">
                        Sinkronisasi Terintegrasi Program
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] text-[#1F7A4D] font-bold bg-[#EBF7EE] border border-[#D4EDDA] px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D]"></span>
                      <span>VERIFIED METRICS · OKT 2026</span>
                    </div>
                  </motion.div>

                  {/* Duel Scorecard Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-2">
                    {/* Left Contender: RevoU (Slide in from Left + Micro-lift on hover) */}
                    <motion.div
                      key={`revou-gen-${activeProgramDetail.id}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      className="bg-white rounded-lg border-l-4 border-l-[#1F7A4D] border border-[#E8E8E4] p-3 shadow-2xs hover:shadow-xs hover:border-[#D0D0CB] transition-colors cursor-default"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#1F7A4D]">
                          [01] PROGRAM RevoU
                        </span>
                        <span className="font-mono text-[9.5px] font-bold bg-[#EBF7EE] text-[#1F7A4D] px-1.5 py-0.5 rounded">
                          {activeProgramDetail.revouMatchBadge || "RevoU"}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xs sm:text-[13.5px] text-[#141412] leading-snug">
                        RevoU {activeProgramDetail.revouMatchProgram}
                      </h3>
                    </motion.div>

                    {/* Center VS Connector (Crisp Spring Pop-in + Micro-tilt on hover) */}
                    <div className="flex items-center justify-center my-0.5 md:my-0">
                      <div className="flex md:flex-col items-center justify-center gap-1">
                        <div className="hidden md:block w-px h-2 bg-[#D9D9D4]"></div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.18 }}
                          whileHover={{ scale: 1.15, rotate: 3, transition: { duration: 0.15 } }}
                          className="w-7 h-7 rounded-full bg-[#141412] text-[#FFD84D] font-mono text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs shrink-0 select-none cursor-pointer"
                          title="Head-to-head matchup"
                        >
                          VS
                        </motion.div>
                        <div className="hidden md:block w-px h-2 bg-[#D9D9D4]"></div>
                      </div>
                    </div>

                    {/* Right Contender: Competitor (Slide in from Right + Micro-lift on hover) */}
                    <motion.div
                      key={`comp-gen-${activeProgramDetail.id}`}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      className="bg-white rounded-lg border-l-4 border-l-[#B76E00] border border-[#E8E8E4] p-3 shadow-2xs hover:shadow-xs hover:border-[#D0D0CB] transition-colors cursor-default"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-[#8A8A84]">
                          [02] PROGRAM KOMPETITOR YANG SESUAI
                        </span>
                        <span className="font-mono text-[9.5px] font-bold bg-[#FFF4E5] text-[#B76E00] px-1.5 py-0.5 rounded">
                          {activeProgramDetail.competitorName}
                        </span>
                      </div>
                      <div className="font-display font-bold text-xs sm:text-[13.5px] text-[#141412] leading-snug">
                        {activeProgramDetail.competitorName} – {activeProgramDetail.programTitle}
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Analytical Pitch Insight */}
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.22 }}
                    className="mt-2.5 pt-2 border-t border-[#E8E8E4] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#4B4B46]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#141412]">PANDUAN ADMISSION:</span>
                      <span className="text-[#60605B]">Data parameter kurikulum, biaya, dan portofolio disinkronkan otomatis.</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8A8A84] shrink-0">
                      Tabel Komparasi Terintegrasi
                    </span>
                  </motion.div>
                </motion.div>
                <p className="text-xs text-[#8A8A84] mt-0.5">
                  Data parameter kurikulum, biaya, durasi, dan portofolio disinkronkan langsung dengan program <strong className="text-[#141412]">{activeProgramDetail.programTitle}</strong> yang Anda pilih di atas.
                </p>
            </div>

            {/* Responsive Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/4 font-bold border-r border-white/10">Fitur & Parameter</th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FEF08A]" />
                        <span>RevoU ({activeProgramDetail.revouMatchBadge})</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-semibold text-white/95 border-r border-white/10 bg-[#2A2A26]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#FFD84D]" />
                        <span>{activeProgramDetail.competitorName} – {activeProgramDetail.programTitle}</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/5 font-semibold text-white/70">
                      Program Mandiri / Luar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E4]">
                  {filteredGeneralRows.map((row, idx) => {
                    const integrated = getIntegratedRowData(row);
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${row.revouHighlight ? "bg-[#FFFDF5]/70 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50"
                          }`}
                      >
                        <td className="p-3 sm:p-3.5 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span>{row.feature}</span>
                              {integrated.isSpecificMatch && (
                                <span className="font-mono text-[9px] bg-[#EBF7EE] text-[#1F7A4D] font-bold px-1.5 py-0.2 rounded border border-[#D4EDDA]">
                                  Sesuai Program
                                </span>
                              )}
                            </div>
                            <span className="block font-mono text-[10px] text-[#8A8A84] font-normal uppercase mt-0.5">
                              {row.category}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-3.5 text-[#141412] font-medium border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                          <div className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-semibold text-[#1F7A4D]">{integrated.revouText}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed font-normal bg-[#FAFAF8]/60">
                          {integrated.compText}
                        </td>
                        <td className="p-3 sm:p-3.5 text-[#8A8A84] align-top leading-relaxed">
                          {row.selfPaced}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── ANALISIS KRITIS & JAWABAN AC TERINTEGRASI SESUAI PROGRAM YANG DIPILIH ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Keunggulan Mutlak RevoU pada Program Ini */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-2.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4D]" />
                  <span>Keunggulan Mutlak RevoU ({activeProgramDetail.revouMatchProgram})</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] font-medium leading-relaxed">
                  {activeProgramDetail.revouEdge}
                </p>
                <div className="text-[11.5px] text-[#1F7A4D] space-y-1 pt-2 border-t border-[#D4EDDA]/80">
                  <p>✓ 100% Live Instruction malam (19:00–21:00 WIB) — tidak perlu resign kerja</p>
                  <p>✓ 3 Bulan RevoU Labs mengerjakan real client & real budget (bukan simulasi dummy)</p>
                  <p>✓ Garansi Refund Biaya s.d. 100% transparan (cukup 10 lamaran/minggu)</p>
                </div>
              </div>

              {/* Keterbatasan Program Kompetitor yang Dipilih */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#FFD84D]/80 bg-[#FFFDF0] space-y-2.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                  <AlertTriangle className="w-4 h-4 text-[#A15C00]" />
                  <span>Keterbatasan {activeProgramDetail.competitorName} ({activeProgramDetail.programTitle})</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] leading-relaxed">
                  {activeProgramDetail.competitorLimitation}
                </p>
                <p className="text-[11px] text-[#8A8A84] italic pt-1 border-t border-[#FFD84D]/40">
                  💡 Gunakan poin ini secara elegan saat calon siswa menanyakan perbandingan program ini.
                </p>
              </div>
            </div>

            {/* Template Jawaban AC WhatsApp Siap Salin untuk Program Ini */}
            <div className="p-4 sm:p-5 rounded-xl border border-[#0E62FE]/30 bg-[#EDF5FF] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider text-[#0E62FE]">
                  <Sparkles className="w-4 h-4 text-[#0E62FE]" />
                  <span>Template Jawaban AC Siap Salin ({activeProgramDetail.programTitle})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(activeProgramDetail.acTalkingPoint, `gen-prog-${activeProgramDetail.id}`)}
                  className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#0E62FE] text-white hover:bg-[#004ECC] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  {copiedId === `gen-prog-${activeProgramDetail.id}` ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white" />
                      <span>Salin Pesan</span>
                    </>
                  )}
                </button>
              </div>
              <blockquote className="text-xs sm:text-[13px] text-[#141412] leading-relaxed bg-white/80 p-3.5 rounded-lg border border-[#0E62FE]/15 whitespace-pre-line font-normal">
                {activeProgramDetail.acTalkingPoint}
              </blockquote>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border-2 border-dashed border-[#D9D9D4] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-2xs card-interactive"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#EBF7EE] text-[#1F7A4D] mx-auto flex items-center justify-center border border-[#D4EDDA] shadow-2xs">
              <Scale className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-lg sm:text-xl text-[#141412]">
                Pilih Program untuk Membuka Tabel General RevoU
              </h4>
              <p className="text-sm text-[#8A8A84] max-w-[56ch] mx-auto leading-relaxed">
                Tabel general akan langsung disinkronkan secara otomatis sesuai dengan program spesifik yang Anda pilih untuk membandingkan parameter pembelajaran RevoU vs {competitorDisplayNames[selectedCompetitorKey]}.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
              <span className="font-mono text-xs text-[#8A8A84] font-bold uppercase w-full mb-1">
                Pilihan Cepat Program {competitorDisplayNames[selectedCompetitorKey]}:
              </span>
              {availableProgramsForSelectedComp.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProgramId(p.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5F5F2] hover:bg-[#FFD84D] hover:text-[#141412] text-[#4B4B46] border border-[#E8E8E4] transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {p.programTitle} →
                </button>
              ))}
            </div>
          </motion.div>
        ))}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. TAB: ONE-PAGER BATTLECARD                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "battlecards" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8E8E4] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
            {/* Header info */}
            <div className="border-b border-[#E8E8E4] pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-[#141412]">
                  Battlecard: RevoU vs {activeBattlecard.name}
                </h3>
                <span className="font-mono text-[11px] bg-[#EBF7EE] text-[#1F7A4D] font-bold px-2.5 py-0.5 rounded-full border border-[#D4EDDA]">
                  Verified Data 20 Okt 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8A8A84]">
                {activeBattlecard.tagline}
              </p>
            </div>

            {/* 8 Core Battlecard Dimensions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Price */}
              <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8A8A84] font-bold">
                  <DollarSign className="w-4 h-4 text-[#A15C00]" />
                  <span>1. Price & Skema Cicilan (Instalments)</span>
                </div>
                <div className="text-xs text-[#141412] space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-[#8A8A84] font-semibold">{activeBattlecard.name}: </strong>
                    {activeBattlecard.price}
                  </p>
                  <p>
                    <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                    Rp 16.000.000 – Rp 25.000.000-an (Opsi cicilan bunga 0% s.d. 12-18 bulan via kartu kredit/mitra resmi Danacita, tanpa biaya kos/transportasi tambahan).
                  </p>
                </div>
              </div>

              {/* 2. Duration & Schedule */}
              <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8A8A84] font-bold">
                  <Clock className="w-4 h-4 text-[#A15C00]" />
                  <span>2. Duration and Schedule</span>
                </div>
                <div className="text-xs text-[#141412] space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-[#8A8A84] font-semibold">{activeBattlecard.name}: </strong>
                    {activeBattlecard.duration}
                  </p>
                  <p>
                    <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                    6–9 bulan (Termasuk 3 bulan RevoU Labs & Career Development), jadwal kelas malam (19.00–21.00 WIB) ramah pekerja & mahasiswa.
                  </p>
                </div>
              </div>

              {/* 3. Format */}
              <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8A8A84] font-bold">
                  <Video className="w-4 h-4 text-[#A15C00]" />
                  <span>3. Format (Live or Recorded)</span>
                </div>
                <div className="text-xs text-[#141412] space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-[#8A8A84] font-semibold">{activeBattlecard.name}: </strong>
                    {activeBattlecard.format}
                  </p>
                  <p>
                    <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                    100% Live Online interaktif dua arah (5x/minggu sesi tanya jawab & diskusi) + Akses rekaman & materi ajar selamanya.
                  </p>
                </div>
              </div>

              {/* 4. Career Support & Claims */}
              <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8A8A84] font-bold">
                  <Briefcase className="w-4 h-4 text-[#A15C00]" />
                  <span>4. Career Support and Placement Claims</span>
                </div>
                <div className="text-xs text-[#141412] space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-[#8A8A84] font-semibold">{activeBattlecard.name}: </strong>
                    {activeBattlecard.careerSupport}
                  </p>
                  <p>
                    <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                    RevoU NEXT (Career Coach 1-on-1, review CV & portofolio personal, simulasi interview HR & User) + Jaminan Refund 100% transparan (10 lamaran/minggu).
                  </p>
                </div>
              </div>

              {/* 5. Certification */}
              <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8A8A84] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#A15C00]" />
                  <span>5. Certification</span>
                </div>
                <div className="text-xs text-[#141412] space-y-1 leading-relaxed">
                  <p>
                    <strong className="text-[#8A8A84] font-semibold">{activeBattlecard.name}: </strong>
                    {activeBattlecard.certification}
                  </p>
                  <p>
                    <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                    RevoU Certificate of Completion bertaraf internasional + Sertifikasi Resmi Program Kemitraan Universitas Terbaik (ITB untuk Leaders, BINUS untuk AI & Analytics, UI untuk Strategic Finance).
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Differentiators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 sm:p-5 rounded-xl border border-[#FFD84D]/70 bg-[#FFFDF0] space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                  <Lightbulb className="w-4 h-4 text-[#A15C00]" />
                  <span>6. What They Genuinely Do Better (Stated Honestly)</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] leading-relaxed">
                  &quot;{activeBattlecard.honestStrength}&quot;
                </p>
                <p className="text-[11px] text-[#8A8A84] italic">
                  💡 Tips AC: Jangan pernah membantah poin ini. Akui kelebihan ini dengan hormat, lalu bawa kembali ke konteks kebutuhan spesifik leads.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4D]" />
                  <span>7. Where RevoU Wins (Keunggulan RevoU)</span>
                </div>
                <ul className="text-xs text-[#141412] space-y-1.5 list-disc pl-4 leading-relaxed">
                  {activeBattlecard.revouWins.map((win, idx) => (
                    <li key={idx}>
                      <span>{win}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* One Proof Point */}
            <div className="p-4 rounded-xl border border-[#0E62FE]/30 bg-[#EDF5FF] space-y-1.5">
              <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#0E62FE]">
                <ShieldCheck className="w-4 h-4 text-[#0E62FE]" />
                <span>8. One Proof Point (1 Bukti Konkret Wajib)</span>
              </div>
              <p className="text-xs sm:text-[13.5px] text-[#141412] font-medium leading-relaxed">
                🎯 {activeBattlecard.proofPoint}
              </p>
            </div>

            {/* Ready-to-use AC Script Blueprint */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#8A8A84] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A15C00]" />
                  <span>Template Jawaban AC Siap Salin (Sesuai Shared Answer Pattern)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(activeBattlecard.acScriptTemplate, `comp-${activeBattlecard.id}`)}
                  className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FFD84D] text-[#141412] hover:bg-[#FFCC1A] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  {copiedId === `comp-${activeBattlecard.id}` ? (
                    <>
                      <Check className="w-3 h-3 text-[#141412]" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#141412]" />
                      <span>Salin Pesan</span>
                    </>
                  )}
                </button>
              </div>

              <blockquote className="bg-[#F5F5F2] border border-[#E8E8E4] rounded-xl p-4 text-xs sm:text-sm text-[#141412] leading-relaxed whitespace-pre-line font-normal">
                {activeBattlecard.acScriptTemplate}
              </blockquote>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
