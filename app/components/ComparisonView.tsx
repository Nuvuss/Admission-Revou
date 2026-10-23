"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    price: "Full-Day: Rp 35jt – Rp 45jt (Early Bird Rp 33jt–43jt) | Night: Rp 18jt – Rp 25jt. Reg fee Rp 100.000 (Non-refundable).\nOpsi Pembayaran Resmi:\n• Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga)\n• Cicilan 0%: Melalui partner OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah\n• Study Now Pay Later (SNPL): Penangguhan bayar s.d. 4 bulan via Danacita",
    duration: "Full-Day: 12–16 minggu (Senin–Jumat 09:00–18:00 WIB) | Night: 12–16 minggu (Senin–Jumat 19:00–22:00 WIB, ±15 jam/minggu).",
    format: "Full-Day Bootcamp & Night Bootcamp; lokasi Jakarta, Tangerang, dan Remote.",
    careerSupport: "Career Class (CV & LinkedIn), latihan interview HR, peluang interview langsung dengan 1.000+ hiring partner tanpa placement fee, Career Buddy grup & 1-on-1. Outcome: 90% kerja full-time dalam 90 hari, 96% relevan IT & Data.",
    certification: "Sertifikat Kelulusan Hacktiv8 & BNSP (pada program tertentu); tidak ada kemitraan kampus.",
    honestStrength: "Sangat kuat dan terspesialisasi di bidang Software Engineering teknis murni (JavaScript stack & Golang) dengan format full-day immersion pagi-sore yang cocok bagi yang bisa komitmen 100% waktu penuh.",
    revouWins: [
      "Jadwal kelas malam (19:00–21:00 WIB) yang fleksibel — peserta tidak perlu resign dari kantor saat masa belajar.",
      "12 Minggu Virtual Internship (3 Bulan): Mengerjakan real business problem dengan partner bisnis nyata (Telkom OCA, Zurich, dll) & portofolio riil.",
      "Indonesia's 1st AI-Native Software Engineering Program (Kemitraan eksklusif AWS, kurikulum 4 fase: Algorithm HackerRank, Python/Flask, Next.js/TypeScript, AI Kiro/Claude).",
      "Dukungan karir intensif Career+ (1:1 Personal Career Coach, AI Career Engine, dan Mock Interview dengan Hiring Manager)."
    ],
    proofPoint: "15.000+ alumni RevoU di 11+ kota & 1.000+ top company. Completion rate belajar Hacktiv8 tidak dipublikasi resmi di web. RevoU transparan mempublikasikan 93% completion rate resmi.",
    acScriptTemplate: "Wah menarik banget kak! Hacktiv8 memang punya reputasi bagus untuk bootcamp coding seharian terutama kalau kakak siap komitmen full-day dari jam 9 pagi sampai 6 sore. Nah, di RevoU kelas kita didesain khusus jam 19.00 WIB malam, jadi kakak tetap bisa belajar dan bangun karir baru tanpa harus resign kantor. Plus, RevoU adalah Indonesia's 1st AI-Native Program bermitra eksklusif dengan AWS, ada 12 minggu Virtual Internship mengerjakan real project perusahaan, dan bimbingan karir intensif 1-on-1 Career+ sampai dapat kerja. Kakak saat ini lebih nyaman belajar full-day seharian atau kelas malam di luar jam kerja kak? :)"
  },
  {
    id: "purwadhika",
    name: "Purwadhika",
    tagline: "Pilihan bagi yang mencari fasilitas kampus fisik BSD/Jakarta, ada 10 program Job Connector",
    price: "Tiered Pricing per Intake (10 Program Job Connector):\n• AI Engineering: Early Bird Rp 20jt | Term 1 Rp 25jt | Term 2 Rp 30jt | Promo 39th Rp 27,5jt | Sinarmas Rp 17,5jt | Normal Rp 35jt\n• DM, BDA, DSML, FSD, Data Eng, Cybersecurity: Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Sinarmas Rp 12,5jt | Normal Rp 25jt\n• QA & Social Media: Early Bird Rp 14jt | Term 2 Rp 20jt | Promo 39th Rp 14,5jt | Normal Rp 23jt\n• AI Automation: Early Bird Rp 13jt | Term 1 Rp 15jt | Term 2 Rp 17jt | Promo 39th Rp 14,5jt | Sinarmas Rp 10jt | Normal Rp 20jt\n*Catatan: Akun/tools premium tertentu ditanggung peserta, non-refundable.",
    duration: "Batch kalender 20–28 minggu (modul materi 5–15 minggu + final project 3–5 minggu). Pilihan After Hours (Sen–Kam 19:00–22:00 / Sel & Kam 19:00–22:00) & Office Hours (Sen–Kam 09:00–12:00).",
    format: "On campus (BSD Green Office Park, Jakarta, Batam) atau Online Livestream Zoom.",
    careerSupport: "Bimbingan CV & LinkedIn, persiapan interview, 1-on-1 career counseling, Purwadhika Hiring Network ke 1.000+ hiring partner (syarat koneksi kerja full-time: maksimal usia 30 tahun & minimal lulusan S1/sederajat, kecuali Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK).",
    certification: "Sertifikat Purwadhika Digital Technology School, Terdaftar Kemendikbud & Certified Google Partner (tidak ada kemitraan kampus perguruan tinggi).",
    honestStrength: "Memiliki fasilitas kampus offline fisik yang megah di BSD & Jakarta bagi siswa yang memprioritaskan kehadiran fisik tatap muka di ruang kelas.",
    revouWins: [
      "100% Live Online dua arah hemat biaya akomodasi hingga puluhan juta rupiah bagi siswa luar kota.",
      "12 Minggu Virtual Internship: Portofolio nyata dengan real client & real ads budget/dataset (bukan tugas kelompok besar 7-8 orang).",
      "Kemitraan resmi universitas terkemuka (#1 ITB untuk Leaders & Data Science, BINUS untuk AI & Cybersecurity x AWS, UI untuk Strategic Finance).",
      "Persyaratan fleksibel & inklusif (terbuka untuk seluruh jenjang SMA/SMK/D3/S1 di semua program vs Purwadhika yang mayoritas mewajibkan minimal S1/sederajat, kecuali FSD dan UI/UX)."
    ],
    proofPoint: "15.000+ alumni RevoU & 550.000+ digital learners. Completion rate belajar Purwadhika tidak dipublikasi di web. RevoU transparan dengan 93% completion rate dan 12 minggu Virtual Internship dengan real partner (Telkom OCA, Zurich, dll).",
    acScriptTemplate: "Purwadhika reputasinya memang sangat baik kak, terutama untuk teman-teman yang berdomisili di BSD/Jakarta dan ingin merasakan suasana kampus fisik. Kalau di RevoU, kita fokus 100% live interaktif online agar teman-teman dari seluruh Indonesia bisa belajar langsung dari praktisi top company tanpa perlu keluar biaya sewa kos puluhan juta. Di RevoU juga ada 12 minggu Virtual Internship mengerjakan real project perusahaan partner, real ads budget mandiri, serta sertifikasi resmi ITB, BINUS, dan UI. Kakak sendiri lebih mempertimbangkan fleksibilitas online atau tatap muka fisik kak? :)"
  },
  {
    id: "dibimbing",
    name: "Dibimbing",
    tagline: "Opsi budget-friendly & pilihan 14 program (Data, IT, Marketing, HR, Supply Chain, ESG, Legal)",
    price: "Rp 7.000.000 – Rp 15.000.000 (Harga ekonomis, banyak diskon promo, opsi cicilan fleksibel, garansi gratis mengulang batch seumur hidup).",
    duration: "Pre-bootcamp mandiri + 24 minggu bootcamp + 2 minggu post-bootcamp + 4 minggu Job Connect (total ±7 bulan). Frekuensi 2–3 sesi per minggu (weekday atau weekend).",
    format: "Online & offline, supported with AI.",
    careerSupport: "Konsultasi karier & portofolio 1-on-1, review CV & LinkedIn, latihan interview, Talent Showcase ke 1.100+ partner (hanya lulusan berpredikat eligible). Klaim 96% alumni dapat kerja.",
    certification: "Sertifikat Kelulusan Dibimbing, Terakui Kemendikti; layanan BNSP & placement program untuk universitas; Forbes 30 Under 30 Asia 2025.",
    honestStrength: "Pilihan kategori program sangat luas dan variatif (mencakup HR, Supply Chain, ESG, Legal) dengan biaya masuk lebih ekonomis (budget-friendly) dan benefit gratis mengulang batch.",
    revouWins: [
      "Kedalaman kurikulum & jam terbang 100% LIVE interaktif harian (4-5 sesi live/minggu, 210+ jam live vs <40 sesi rekaman/campuran LMS).",
      "Kurikulum terdepan: FSDM 12 modul AI, FSDA 8 modul + Apache Airflow & Automated ETL, FSSE 4 fase AI-native bersama AWS.",
      "12 Minggu Virtual Internship: Portofolio mandiri mengelola real budget iklan jutaan rupiah atau dataset enterprise langsung.",
      "Standar seleksi ketat menjamin circle belajar ambisius dan suportif (tingkat penerimaan <10%)."
    ],
    proofPoint: "15.000+ alumni RevoU di 1.000+ top company (Gojek, Tokopedia, Traveloka, Shopee, Big 4, BUMN). Completion rate Dibimbing tidak dipublikasi resmi di web. RevoU transparan mempublikasikan 93% completion rate resmi.",
    acScriptTemplate: "Dibimbing pilihan yang bagus kak kalau kakak mencari opsi belajar santai 2-3 sesi per minggu via video rekaman LMS dengan budget hemat. Namun kalau tujuan kakak adalah career switch total di tech company papan atas, RevoU memberikan 100% live class interaktif setiap hari, bimbingan karir 1-on-1 intensif selama 7-8 bulan, 12 minggu Virtual Internship portofolio riil, dan pendampingan karir intensif 1-on-1 Career+ sampai dapat kerja. Boleh tau tujuan utama kakak ambil program ini apakah untuk eksplorasi dasar atau persiapan karir jangka panjang kak? :)"
  },
  {
    id: "dqlab",
    name: "DQLab",
    tagline: "Kursus kilat live Zoom modular, persiapan sertifikasi resmi BNSP & Pearson VUE dengan budget ekonomis",
    price: "Rp 699.000 – Rp 3.800.000 (Bootcamp Single Rp 699rb–2,5jt; Ujian Sertifikasi BNSP/Pearson VUE Rp 1,68jt–2,8jt; Bundle Program Rp 1,2jt–3,8jt).",
    duration: "10 – 17 sesi singkat (durasi 1,5 – 2,5 bulan), jadwal 2x seminggu malam (19:00–21:30 WIB) atau weekend.",
    format: "Bootcamp live class virtual + belajar mandiri via modul.",
    careerSupport: "DQLab Career: portofolio terbaik berpeluang interview dengan 30+ mitra hiring & corporate training (CV review tidak tercantum di website).",
    certification: "E-certificate per modul; program Sertifikasi BNSP Data Analyst; dimiliki Yayasan Multimedia Nusantara & Xeratic.",
    honestStrength: "Biaya sangat terjangkau dengan format kursus singkat terfokus untuk memperoleh sertifikat BNSP/Pearson VUE tanpa komitmen waktu atau biaya besar.",
    revouWins: [
      "Program karir komprehensif 7 bulan dari nol hingga siap kerja (8 modul + Apache Airflow & Automated ETL, 7 portofolio proyek industri, bukan sekadar lulus ujian tertulis).",
      "12 Minggu Virtual Internship memegang dataset bisnis riil (mitra Telkom OCA, Zurich) dan problem solving bisnis strategis C-level.",
      "Bimbingan karir intensif Career+ 1-on-1 bersama Career Coach profesional selama 7 bulan penuh + simulasi interview hiring manager.",
      "Ekosistem 15.000+ alumni aktif di 1.000+ top company dan komunitas pelajar 550.000+ member."
    ],
    proofPoint: "550.000+ komunitas pelajar RevoU & 15.000+ alumni. Completion rate DQLab tidak dipublikasi di web. RevoU mendampingi 7 bulan komprehensif dari nol dengan 12 minggu Virtual Internship portofolio riil.",
    acScriptTemplate: "DQLab itu opsi yang oke banget kak kalau kakak sekadar ingin mengambil ujian sertifikasi BNSP atau kursus kilat Excel/Python dalam durasi 1-2 bulan dengan budget terjangkau. Namun kalau tujuan kakak ingin career switch menjadi Data Analyst profesional yang siap kerja di top company, di RevoU kakak akan belajar 7 bulan komprehensif, menguasai SQL, Python, Tableau, Looker Studio, Apache Airflow ETL, dan 12 minggu Virtual Internship menganalisis dataset bisnis riil, plus bimbingan karir 1-on-1 sampai dapat kerja. Kakak saat ini lebih butuh sertifikasi singkat atau persiapan karir menyeluruh sampai siap kerja kak? :)"
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
  referenceImages?: {
    url: string;
    title: string;
    subtitle?: string;
    tools: string[];
  }[];
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
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (Rp 19.5jt – 22.5jt all-in sudah termasuk kurikulum AI, 3 bulan Virtual Internship, & Career+ sampai hired).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Tanpa Biaya Tambahan: Bebas biaya registrasi tersembunyi & tanpa biaya akomodasi/transportasi (100% Live Online).",
          competitorValue: "• Biaya Program: Rp 45.000.000 (Early Bird Rp 43.000.000 lunas H-14).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Kamis (LIVE Lecture & Simulation) + Sesi Review Tugas Opsional: Sabtu 13:00–15:30 WIB — ramah pekerja & mahasiswa (tidak perlu resign).",
          competitorValue: "Senin–Jumat 09:00–18:00 WIB (Wajib komitmen seharian penuh di jam kantor — harus cuti atau resign kerja).",
          highlight: true
        },
        {
          parameter: "Durasi & Total Sesi Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "8 Bulan komprehensif (5 Bulan Live Classes & 210+ Jam Kelas LIVE + 3 Bulan Virtual Internship / Real Company Project).",
          competitorValue: "16 minggu (4 minggu persiapan dasar + 12 minggu bootcamp intensif).",
          highlight: true
        },
        {
          parameter: "Format Belajar & Lokasi",
          categoryTag: "METODE BELAJAR",
          revouValue: "100% Live Online interaktif dua arah (diskusi, live review code baris-per-baris) + rekaman materi selamanya & 24/7 AI Learning Assistant.",
          competitorValue: "Pilihan Kampus Offline Jakarta (Kebayoran/Sultan Iskandar Muda) atau Remote Online live coding.",
          highlight: false
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Indonesia's 1st AI-Native Software Engineering Program (Eksklusif AWS):\n• Phase 1 - Algorithm & Problem Solving: Flowchart, pseudocode, searching/sorting algorithms, & tantangan HackerRank.\n• Phase 2 - Backend Engineering: Python, Flask, arsitektur PostgreSQL, RESTful API design, & automated testing.\n• Phase 3 - Modern Frontend: Next.js (App Router), TypeScript, TailwindCSS, React state management, & Playwright E2E testing.\n• Phase 4 - AI-Driven Production & DevOps: Spec-driven dev Kiro, Claude, Locust load testing, Docker, & AWS Cloud deployment.\n• Virtual Internship (3 Bulan): Proyek riil memecahkan problem software partner korporasi nyata.",
          competitorValue: "4 Fase Kurikulum Berbasis JavaScript & Full-Stack Web:\n• Fase 0 - Programming Foundation: Logika dasar coding, algoritma, HTML5, CSS3, & vanilla JavaScript modern.\n• Fase 1 - Backend & Database: Node.js runtime, Express.js server, PostgreSQL RDBMS, Sequelize ORM, & JWT authentication.\n• Fase 2 - Frontend & State: Single Page Application (SPA) React.js, Redux state management, integrasi REST API, & GitHub Copilot.\n• Fase 3 - Microservices & Scalability: Microservices, MongoDB (NoSQL), Next.js, TypeScript, Docker container, & Cursor AI.",
          highlight: false
        },
        {
          parameter: "Tools & Teknologi Dipelajari",
          categoryTag: "TECH STACK",
          revouValue: "Python, Flask, PostgreSQL, Next.js (App Router), TypeScript, TailwindCSS, AWS, Docker, Postman, Playwright (E2E testing), Locust, Kiro, Claude.",
          competitorValue: "React, Next.js, Express.js, PostgreSQL, Sequelize, Docker, TypeScript, MongoDB, GitHub Copilot, Cursor.",
          highlight: false
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "2 Portofolio Utama (Project 1: Full-Stack App konvensional Python/Flask + Next.js/TypeScript + 3-layer testing + AWS; Project 2: AI-Built Project skala produksi dengan spec mode Kiro) + 3 Bulan Virtual Internship mengerjakan real partner business problem.",
          competitorValue: "Final project web application full-stack di akhir fase 3 (pengerjaan kelompok siswa internal).",
          highlight: true
        },
        {
          parameter: "Sertifikasi Resmi",
          categoryTag: "KREDENSIAL",
          revouValue: "RevoU Certificate of Completion bertaraf internasional + Kemitraan Eksklusif Amazon Web Services (AWS) Partner.",
          competitorValue: "Sertifikat Kelulusan Hacktiv8 & BNSP (pada program tertentu).",
          highlight: false
        }
      ],
      competitorLimitation: "Biaya sangat tinggi (Rp 45.000.000), mewajibkan cuti/resign karena jam belajar seharian 09:00–18:00 WIB, dan biaya pendaftaran/kursus bersifat non-refundable (tanpa refund).",
      revouEdge: "RevoU FSSE adalah program AI-Native pertama di Indonesia bermitra eksklusif dengan AWS, berdurasi 8 bulan (210+ jam live) malam hari (19:00–21:00 WIB), mengajarkan Python/Flask + Next.js/TypeScript, dan portofolio riil Virtual Internship.",
      acTalkingPoint: "Hacktiv8 memang bagus untuk coding seharian kak, tapi biayanya Rp 45 jt dan jam belajarnya 09:00–18:00 sehingga kakak harus resign duluan. Di RevoU FSSE, kita adalah Indonesia's 1st AI-Native Program bermitra eksklusif dengan AWS, kelas jam 19.00 malam (tidak perlu resign), diajarkan Python/Flask dan Next.js/TypeScript, 3 bulan Virtual Internship mengerjakan masalah nyata perusahaan, dan didampingi Career Coach 1-on-1 sampai dapat kerja."
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (Rp 19.5jt – 22.5jt all-in sudah termasuk materi Full-Stack, 3 bulan Virtual Internship, & Career+).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Tanpa Biaya Tambahan: Bebas biaya registrasi tersembunyi & tanpa biaya akomodasi (100% Live Online).",
          competitorValue: "• Biaya Program: Rp 22.000.000 (Early Bird Rp 20.000.000).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
          highlight: false
        },
        {
          parameter: "Jadwal & Durasi Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "8 Bulan komprehensif (210+ Jam Kelas LIVE malam 19:00–21:00 WIB + 3 Bulan Virtual Internship real project).",
          competitorValue: "16 minggu (Senin–Jumat 19:00–22:00 WIB, ±15 jam/minggu).",
          highlight: true
        },
        {
          parameter: "Cakupan Stack Pengembangan",
          categoryTag: "CAKUPAN ROLE",
          revouValue: "Full Stack AI-Native (Frontend Next.js App Router/TypeScript/TailwindCSS + Backend Python/Flask/PostgreSQL + 3-Layer Testing Playwright & Locust + AI Spec Mode Kiro & AWS Cloud) — mencakup end-to-end frontend dan backend untuk fleksibilitas loker software engineer di Indonesia.",
          competitorValue: "Backend Golang Murni: Go fundamentals (Goroutine/Channel), REST API Gin/Echo, PostgreSQL, NoSQL, Load Testing Grafana k6, Microservices gRPC, Docker, K8s, serta Cloud Deployment via Railway — fokus backend tanpa penguasaan frontend web modern.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Kurikulum Full Stack AI-Native (Frontend + Backend + Cloud):\n• Phase 1 - Algorithm: Dasar logika komputasional, flowchart, data structures, & tantangan HackerRank.\n• Phase 2 - Backend Skalabel: Python, Flask REST API, PostgreSQL database modeling, & automated backend testing.\n• Phase 3 - Modern Frontend: Next.js App Router, TypeScript, React component lifecycle, & Playwright E2E testing.\n• Phase 4 - AI Engineering & Cloud DevOps: Kiro Spec Mode, Claude AI agent, Locust load testing, Docker, & AWS Cloud deployment.\n• Virtual Internship (3 Bulan): Proyek software skala enterprise bersama partner korporasi nyata.",
          competitorValue: "Spesialisasi Arsitektur Backend Microservices Golang:\n• Go Fundamentals: Syntax dasar, pointer, struct, interface, data structures, concurrency (Goroutine & Channel).\n• RESTful API Development: Framework Gin / Echo, middleware handling, JWT authentication, & validation.\n• Databases Architecture: PostgreSQL (relational) & NoSQL database, connection pooling, & query tuning.\n• Microservices Architecture: Komunikasi antar service via gRPC protocol & Protocol Buffers (protobuf).\n• Testing, DevOps & Cloud: Load testing Grafana k6, containerisasi Docker, Kubernetes (K8s), & deployment Railway.",
          highlight: true
        },
        {
          parameter: "Database, Testing & Cloud Tooling",
          categoryTag: "DATABASE & DEVOPS",
          revouValue: "PostgreSQL RDBMS design, 3-layer automated testing (pytest unit test, Locust performance/stress test, Playwright E2E), AI engineering dengan Kiro spec mode & Claude, serta Cloud Infrastructure bersama Amazon Web Services (AWS) Partner & Vercel/Railway.",
          competitorValue: "Relational Database (PostgreSQL) & NoSQL database, performance load testing menggunakan Grafana k6, containerisasi Docker & Kubernetes (K8s), serta cloud deployment ke Railway.",
          highlight: false
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "2 Proyek Full-Stack berskala produksi (konvensional & AI-driven) + 3 Bulan Virtual Internship memecahkan masalah bisnis nyata perusahaan mitra.",
          competitorValue: "Final project web API real-time microservices di akhir batch (pengerjaan project backend murni).",
          highlight: true
        }
      ],
      competitorLimitation: "Fokus kurikulum sangat spesifik pada backend Golang dengan PostgreSQL, NoSQL, Grafana k6, dan deployment Railway tanpa penguasaan frontend Next.js/React modern, sehingga cakupan peluang kerja bagi pemula/career switcher lebih terbatas dibanding Full Stack.",
      revouEdge: "RevoU FSSE melatih Full Stack AI-Native (Next.js/TypeScript + Python/Flask/PostgreSQL + AWS) yang mencakup 3-layer testing (Playwright & Locust) dan deployment, lengkap dengan 3 bulan Virtual Internship riil.",
      acTalkingPoint: "Golang di Hacktiv8 sangat bagus jika kakak sudah pasti ingin berkarir spesifik di backend microservices dengan PostgreSQL, NoSQL, Grafana k6, dan Railway. Namun bagi pemula atau career switcher, lowongan kerja Software Engineer terbesar di Indonesia mencari Full Stack (Next.js + Python/Flask). Di RevoU FSSE kakak belajar end-to-end frontend dan backend lengkap dengan portofolio riil Virtual Internship dan kemitraan resmi AWS."
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
          revouValue: "• Biaya Program: Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt all-in sudah termasuk 8 modul + Apache Airflow ETL, 12 minggu Virtual Internship, & Career+).\n• Upfront: Lunas di awal tanpa bunga/biaya admin.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Tanpa Biaya Tambahan: Bebas biaya registrasi tersembunyi & hemat biaya kos (100% Live Online).",
          competitorValue: "• Biaya Program: Rp 35.000.000 (Early Bird Rp 33.000.000).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
          highlight: true
        },
        {
          parameter: "Jadwal & Jam Kelas",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Kamis (LIVE Lecture & Simulation) + Sesi Review Tugas Opsional: Sabtu 13:00–15:30 WIB — ramah pekerja & mahasiswa (tidak perlu resign).",
          competitorValue: "Senin–Jumat 09:00–18:00 WIB (Wajib komitmen seharian penuh di jam kantor).",
          highlight: true
        },
        {
          parameter: "Durasi Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan komprehensif (Bulan 1-4: Class Modules; Bulan 5-7: Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "12 minggu (4 minggu persiapan + 8 minggu bootcamp intensif).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "8 Modul Analisis Data + AI & Automated ETL:\n• Modul 1-2 - Problem Solving & Spreadsheet AI: Issue Tree, Root Cause Analysis, Google Sheets AI, & financial modeling.\n• Modul 3-4 - SQL & Enterprise Database: BigQuery AI, window functions, CTE, complex data joins, & query optimization.\n• Modul 5 - Python for Data Analytics: Pandas, NumPy, PandasAI, otomatisasi data cleaning, & exploratory data analysis (EDA).\n• Modul 6 - Visual Analytics & BI: Tableau, Looker Studio, & executive dashboard design.\n• Modul 7 - Executive Storytelling: Menerjemahkan data menjadi insight & strategi bisnis ke jajaran C-Level.\n• Modul 8 - Production-Ready Analytics: Apache Airflow & Automated ETL pipeline.\n• Virtual Internship (12 Minggu): Menganalisis dataset riil klien industri (Telkom OCA, Zurich).",
          competitorValue: "Fokus Berat Matematika Koding & Deep Learning Machine Learning:\n• Python & Data Wrangling: Python scripting, SQL database querying, pandas, & data preprocessing.\n• Applied Machine Learning: Regresi linear/logistik, decision tree, clustering, & evaluasi model via Scikit-Learn.\n• Deep Learning & Computer Vision: TensorFlow, Keras, convolutional neural network (CNN), & NLP dasar.\n• Big Data Engineering: Apache Spark, AWS Big Data ecosystem, & orkestrasi pipeline data Airflow.\n• Model Deployment: Containerisasi Docker & deploy model AI ke production API.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portfolio Projects standar industri (6 Skill-Specific Projects + 1 End-to-End Capstone Project di Banking, Retail, Telco, atau E-Commerce) + 12 Minggu Virtual Internship (mitra nyata seperti Telkom Indonesia OCA, Zurich, dll).",
          competitorValue: "Capstone project pipeline data & model deployment di akhir minggu bootcamp.",
          highlight: true
        }
      ],
      competitorLimitation: "Jadwal seharian penuh (09:00–18:00) menyulitkan pekerja, biaya non-refundable, dan fokus dominan matematika koding tanpa latihan business communication ke direksi.",
      revouEdge: "RevoU FSDA fokus melatih Business Communication & Problem Solving C-level, 8 modul lengkap dengan Apache Airflow & Automated ETL, jadwal kelas malam 19:00–21:00 WIB (ramah pekerja tanpa resign), dan 12 minggu Virtual Internship studi kasus riil (Telkom OCA, Zurich).",
      acTalkingPoint: "Hacktiv8 DS&ML mewajibkan waktu seharian dari pagi sampai jam 6 sore kak. Kalau di RevoU FSDA, kelas berlangsung malam hari 19.00–21.00 WIB Senin–Kamis (+ Review Sabtu opsional), jadi kakak tidak perlu resign kerja. Di RevoU juga fokus melatih cara mempresentasikan data ke bos dan manajemen bisnis, ada modul Apache Airflow ETL terbaru, 12 minggu Virtual Internship menganalisis real dataset bisnis mitra, dan didampingi Career Coach 1-on-1 sampai dapat kerja."
    },
    {
      id: "h8-dsml-ads",
      competitorId: "hacktiv8",
      competitorName: "Hacktiv8",
      programTitle: "Data Science & AI Machine Learning (vs RevoU x ITB ADS)",
      badge: "Full-Day (09:00–18:00)",
      revouMatchProgram: "x ITB: Applied Data Science with AI",
      revouMatchBadge: "ITB",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Universitas",
          categoryTag: "INVESTASI & KREDENSIAL",
          revouValue: "• Biaya Program: Rp 16.999.000 (Alumni ITB/RevoU Diskon 15% jadi Rp 14.449.150).\n• Sertifikasi Resmi: Certificate of Completion resmi Institut Teknologi Bandung (FTI ITB).\n• Opsi Transfer Kredit: Microcredential 1 SKS FTI ITB (Mata Kuliah Metode Statistika) dapat ditransfer ke Magister ITB.\n• Opsi Cicilan: Cicilan fleksibel via kartu kredit / Danacita & invoice perusahaan.",
          competitorValue: "• Biaya Program: Rp 35.000.000 (Early Bird Rp 33.000.000) + Reg fee Rp 100.000.\n• Non-refundable (tanpa refund dana).\n• Sertifikat: Sertifikat kelulusan Hacktiv8 (tanpa kemitraan perguruan tinggi negeri).",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Hybrid 13 Minggu: Live Online Sessions malam hari (Selasa & Kamis 19:30–21:30 WIB) — ramah pekerja/profesional tanpa perlu resign kerja + 2 Hari On-Campus Immersion di Kampus ITB Ganesha Bandung.",
          competitorValue: "Senin–Jumat 09:00–18:00 WIB (Wajib komitmen seharian penuh di jam kantor — harus cuti atau resign kerja).",
          highlight: true
        },
        {
          parameter: "Pengajar & Instruktur Praktisi",
          categoryTag: "PENGAJAR",
          revouValue: "Kolaborasi Dosen FTI ITB (Statistical Rigor) & Praktisi Senior Aktif: Rahmat Hidayatullah (Head of Data Science, XLSMART) — kurikulum mutakhir data product terapan.",
          competitorValue: "Instruktur coding internal Hacktiv8 & mentor praktisi industri.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modern AI Tooling",
          categoryTag: "KURIKULUM",
          revouValue: "Modern Data Science: Predictive modelling (regresi, klasifikasi), forecasting, ML clustering, AI coding agent via Claude Code Safety Gate (akselerasi koding aman berstandar ITB).",
          competitorValue: "Python scripting, SQL, Scikit-Learn machine learning, deep learning TensorFlow/Keras, Apache Spark, & deployment API.",
          highlight: true
        },
        {
          parameter: "Deliverable Proyek Akhir",
          categoryTag: "PROYEK AKHIR",
          revouValue: "Working Live Data Product (model tervalidasi dengan interface interaktif Streamlit, misal Churn Decision App) yang diuji langsung di hadapan industry panel defense.",
          competitorValue: "Capstone project pipeline data & model deployment di akhir minggu bootcamp.",
          highlight: true
        }
      ],
      competitorLimitation: "Biaya sangat tinggi (Rp 35.000.000), mewajibkan cuti/resign kerja karena jam belajar full-day 09:00–18:00 WIB, dan hanya menerbitkan sertifikat internal lembaga kursus.",
      revouEdge: "Kredensial resmi universitas teknik nomor 1 di Indonesia (FTI ITB) dengan opsi transfer 1 SKS Magister, biaya separuh lebih terjangkau (Rp 16,99jt), jadwal malam ramah pekerja, bimbingan Head of Data Science XLSMART, dan AI coding agent Claude Code.",
      acTalkingPoint: "Hacktiv8 DS&ML biayanya Rp 35 juta dan jam belajarnya full-day 09:00–18:00 WIB sehingga kakak harus resign duluan kak. Di program RevoU x ITB Applied Data Science with AI, biayanya jauh lebih terjangkau (Rp 16,99jt), jadwal kelas malam jam 19.30 WIB (tidak perlu resign kerja), dibimbing langsung oleh Head of Data Science XLSMART & Dosen FTI ITB, menggunakan AI coding agent Claude Code, dan mendapatkan sertifikat resmi ITB plus opsi 1 SKS Magister ITB. Jauh lebih prestigius dan fleksibel untuk karir kakak!"
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
          revouValue: "• Biaya Program: Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt all-in sudah termasuk 8 modul + Apache Airflow ETL, 12 minggu Virtual Internship, & Career+).\n• Upfront: Lunas di awal tanpa bunga/biaya admin.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Tanpa Biaya Tambahan: Bebas biaya registrasi & hemat biaya kos (100% Live Online).",
          competitorValue: "• Biaya Program: Rp 18.000.000 (Early Bird Rp 16.000.000).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
          highlight: false
        },
        {
          parameter: "Jadwal Belajar",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Kamis (LIVE Lecture & Simulation) + Sesi Review Tugas Opsional: Sabtu 13:00–15:30 WIB — ramah pekerja & mahasiswa (tidak perlu resign).",
          competitorValue: "Malam hari (19:00–22:00 WIB) Senin–Jumat (3 jam/hari cukup padat).",
          highlight: false
        },
        {
          parameter: "Durasi & Kedalaman Materi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "12 minggu (kurang dari 3 bulan).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "8 Modul Analisis Data + AI & Automated ETL:\n• Modul 1-2 - Business Problem Solving & Advanced Spreadsheet: Issue Tree, Root Cause Analysis, Google Sheets AI, financial modeling.\n• Modul 3-4 - SQL & BigQuery AI: Window functions, CTE, complex joins, automated query analysis.\n• Modul 5 - Python for Data Analytics: Pandas, NumPy, PandasAI, automated data cleaning.\n• Modul 6 - Business Intelligence & Dashboards: Tableau, Looker Studio, visual KPI tracking.\n• Modul 7 - Executive Communication: Data storytelling & presentasi rekomendasi ke C-Level.\n• Modul 8 - Production-Ready Analytics: Apache Airflow & Automated ETL pipeline.\n• Virtual Internship (12 Minggu): Menganalisis dataset riil klien industri (Telkom OCA, Zurich).",
          competitorValue: "3 Fase Kurikulum Analytics & Data Engineering:\n• Fase 1 - Analytics & Visualization: Python, Pandas, SQL, Google Sheets, Looker Studio, & Tableau.\n• Fase 2 - Data Pipeline & REST API: Database PostgreSQL, web scraping (Selenium & BeautifulSoup), FastAPI, Git, GitHub, & Vercel deployment.\n• Fase 3 - Big Data, Data Engineering & GenAI: Apache Spark, dbt, MongoDB, Great Expectations, Apache Airflow, AWS Glue, Docker, OpenAI, & Gemini.",
          highlight: true
        },
        {
          parameter: "Proyek Nyata (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portofolio Proyek standar industri + 12 Minggu Virtual Internship memegang dataset riil dari perusahaan partner nyata (Telkom OCA, Zurich, dll) dan presentasi langsung ke tim internal mitra.",
          competitorValue: "Latihan capstone project internal tanpa program lab klien terpisah.",
          highlight: true
        }
      ],
      competitorLimitation: "Biaya non-refundable (tidak ada pengembalian uang sama sekali jika tidak dapat kerja), durasi hanya 12 minggu tanpa program lab portofolio terpisah.",
      revouEdge: "RevoU FSDA berdurasi 7 bulan komprehensif termasuk 8 modul + Apache Airflow ETL, 12 minggu Virtual Internship data nyata klien, dan didukung bimbingan karir 1-on-1 intensif Career+.",
      acTalkingPoint: "Hacktiv8 Comprehensive DA durasinya hanya 12 minggu kak. Di RevoU FSDA kakak belajar 7 bulan komprehensif, menguasai Apache Airflow ETL, ada 12 minggu Virtual Internship menganalisis dataset bisnis riil perusahaan, dan dibimbing langsung oleh Career Coach 1-on-1 sampai dapat kerja. Tentu jauh lebih matang untuk persiapan karir kakak :)",
      referenceImages: [
        {
          url: "/images/hacktiv8/h8-cda-stack-analytics-viz.png",
          title: "Fase 1: Data Analytics & Visualization",
          subtitle: "Fondasi analisis data, spreadsheet, database SQL, dan pembuatan dashboard visual interaktif",
          tools: ["Python", "Pandas", "SQL", "Google Sheets", "Looker Studio", "Tableau"]
        },
        {
          url: "/images/hacktiv8/h8-cda-stack-scraping-fastapi.png",
          title: "Fase 2: Data Pipeline, Web Scraping & REST API",
          subtitle: "Automasi web scraping (Selenium & BeautifulSoup), database PostgreSQL, dan API backend FastAPI",
          tools: ["PostgreSQL", "Selenium", "BeautifulSoup", "FastAPI", "Pandas", "Git", "GitHub", "Vercel", "Python"]
        },
        {
          url: "/images/hacktiv8/h8-cda-stack-bigdata-genai.png",
          title: "Fase 3: Big Data, Data Engineering & Generative AI",
          subtitle: "Pemrosesan big data terdistribusi (Spark), orkestrasi pipeline (Airflow, dbt, Glue), dan integrasi AI (OpenAI & Gemini)",
          tools: ["OpenAI", "Gemini", "Apache Spark", "dbt", "MongoDB", "Great Expectations", "Apache Airflow", "AWS Glue", "Docker", "Python", "SQL"]
        }
      ]
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 15.000.000 (Alumni ITB/RevoU: Rp 12.750.000 / Diskon 15%).\n• Upfront / Corporate Invoice: Pembayaran lunas atau penagihan B2B/reimbursement kantor.\n• Cicilan 0%: Tenor fleksibel s.d. 12-18 bulan via kartu kredit/Danacita.\n• Sudah Termasuk: Certificate of Completion & Digital Badge resmi Institut Teknologi Bandung (ITB) + sesi tatap muka kampus.",
          competitorValue: "• Biaya Program: Rp 20.000.000 (Harga normal Rp 25.000.000).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
          highlight: true
        },
        {
          parameter: "Target Peserta & Syarat Masuk",
          categoryTag: "SYARAT MASUK",
          revouValue: "Para Leader, Manager, Business Head, dan Decision Maker (tidak ada syarat koding teknis).",
          competitorValue: "Wajib pengalaman IT min. 1 tahun & tes praktik koding Python/SQL yang ketat.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Kurikulum Kepemimpinan Berbasis Data & AI untuk Leaders (Non-Coding):\n• Strategic Decision-Making: Framework analitis menguji intuisi bisnis dengan data valid.\n• AI-Assisted Business Intelligence: Pemanfaatan model LLM (Claude, ChatGPT, Gemini) untuk riset & benchmarking pasar kilat.\n• Workflow Automation: Otomasi alur kerja operasional tim tanpa koding menggunakan n8n & AI agents.\n• AI Governance & Risk Management: Mitigasi risiko halusinasi AI, keamanan data privasi korporat, & compliance.\n• Campus Networking: Sesi tatap muka eksklusif di Kampus ITB Bandung bersama para leader industri.",
          competitorValue: "Pipeline Machine Learning & AI Engineering Teknis (Heavy Coding):\n• Data Engineering Pipeline: Databricks, Apache Spark, & arsitektur big data.\n• Vector Storage: Pinecone, Milvus, & embedding storage untuk data retrieval.\n• Advanced RAG: Retrieval-Augmented Generation menggunakan framework LangChain & LlamaIndex.\n• Autonomous AI Agents: Multi-agent system orchestration menggunakan CrewAI & AutoGen.\n• Model Serving: Containerisasi & microservices deployment untuk serving model AI.",
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 15.000.000 (Mahasiswa BINUS & Alumni RevoU: Rp 12.750.000 / Diskon 15%).\n• Upfront / Corporate Invoice: Pembayaran lunas atau penagihan invoice B2B kantor.\n• Cicilan 0%: Tenor fleksibel s.d. 12-18 bulan via kartu kredit/Danacita.\n• Sudah Termasuk: Professional Certificate resmi BINUS University & RevoU (72 jam pembelajaran diakui) + 2x tatap muka kampus.",
          competitorValue: "• Biaya Program: Rp 20.000.000 (Harga normal Rp 25.000.000).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
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
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Kurikulum Practical No-Code / Low-Code AI Automation:\n• No-Code AI Automation: Membangun workflow otomatisasi proses bisnis lintas divisi menggunakan n8n & Zapier.\n• AI Coding & Agentic Workflow: Pemanfaatan Claude Code & prompt engineering untuk eliminasi tugas repetitif kantor.\n• Cross-Functional Implementation: Solusi otomasi nyata untuk efisiensi Marketing, HR, Finance, & Operasional bisnis.\n• Capstone Decision App: Membangun prototype otomasi fungsional siap pakai langsung di unit kerja.\n• Campus Showcase: 2x sesi tatap muka dan showcase di Kampus BINUS Kemanggisan Jakarta.",
          competitorValue: "Kurikulum Berat Rekayasa Koding AI (Wajib Background IT):\n• Data Pipelines: Pemrosesan pipeline data terdistribusi via Apache Spark & Databricks.\n• Vector Storage: Integrasi Pinecone database untuk pencarian semantik berkecepatan tinggi.\n• Generative AI Systems: Rekayasa RAG berbasis LangChain & integrasi LLM API.\n• Multi-Agent Systems: Desain AI agent berbasis CrewAI untuk koding otomasi teknikal.\n• DevOps for AI: Deployment pipeline container di server cloud.",
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 15.000.000 (Reguler) / Rp 12.500.000 (Khusus Alumni RevoU/UI).\n• Upfront / Corporate Invoice: Pembayaran lunas atau penagihan invoice perusahaan.\n• Cicilan 0%: Tenor fleksibel s.d. 12-18 bulan via kartu kredit/Danacita.\n• Sudah Termasuk: Sertifikat Resmi Universitas Indonesia (FEB UI & FIA UI) + Capstone Defense di Kampus UI Depok.",
          competitorValue: "• Biaya Program: Rp 20.000.000 (Harga normal Rp 25.000.000).\n• Registration Fee: Rp 100.000 (Non-refundable).\n• Opsi Pembayaran Resmi:\n  • Upfront (Best Choice): Pembayaran 2 tahap sebelum kelas dimulai (tanpa admin fee & bunga).\n  • Cicilan 0%: Melalui financial partner terdaftar OJK: Danacita & CIMB Niaga / CIMB Niaga Syariah.\n  • Study Now Pay Later (SNPL): Bayar biaya pendidikan dengan masa penangguhan hingga 4 bulan via Danacita.",
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
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Kurikulum Strategic Corporate Finance Berbantuan AI:\n• Corporate Financial Strategy: Pengambilan keputusan permodalan, restrukturisasi, & M&A holding.\n• Multi-Entity & Holding Transactions: Transaksi afiliasi, transfer pricing, & regulasi perpajakan DJP.\n• AI Financial Modeling: Pembuatan 3-Statement financial model presisi tinggi dibantu AI agent.\n• Executive FP&A: Analisis varians laba rugi dan simulasi skenario bisnis untuk Board of Directors.\n• UI Campus Defense: Sidang Capstone Project langsung di hadapan Guru Besar & Dosen FEB/FIA UI di Kampus UI Depok.",
          competitorValue: "Kurikulum Khusus IT / Software Engineering (Tanpa Materi Keuangan):\n• Data & AI Infrastructure: Databricks, Apache Spark, & pipeline Big Data.\n• Vector Embeddings: Pinecone & vector similarity search.\n• RAG & Agent Framework: LangChain, LlamaIndex, & CrewAI multi-agent.\n• Model Serving: API deployment untuk integrasi backend software.\n• (Tidak ada materi financial modeling, akuntansi, atau perpajakan korporasi).",
          highlight: true
        },
        {
          parameter: "Sesi Kampus & Pengajar",
          categoryTag: "FORMAT KELAS",
          revouValue: "Guru Besar & Dosen FEB/FIA UI serta praktisi eks McKinsey/GoTo + Capstone Defense di Kampus UI.",
          competitorValue: "Instruktur praktisi data & AI industri (Remote Online Livestream); tidak memiliki kurikulum corporate finance atau dosen perguruan tinggi.",
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
          revouValue: "Rp 15.000.000 (Mahasiswa BINUS & Alumni RevoU: **Rp 12.750.000** / Diskon 15%), opsi cicilan 0% hingga 18 bulan, sudah termasuk kredensial resmi universitas.",
          competitorValue: "Early Bird Rp 13jt | Term 1 Rp 15jt | Promo 39th Rp 14,5jt | Scholarship Sinarmas Land Rp 10jt | Normal Rp 20jt.",
          highlight: false
        },
        {
          parameter: "Kredensial & Akreditasi",
          categoryTag: "KREDENSIAL KAMPUS",
          revouValue: "Professional Certificate of Achievement resmi dari **BINUS University** & RevoU (72 jam durasi pembelajaran diakui) + sesi tatap muka Kampus BINUS Kemanggisan.",
          competitorValue: "Sertifikat kelulusan internal Purwadhika Digital Technology School (tanpa akreditasi kampus perguruan tinggi).",
          highlight: true
        },
        {
          parameter: "Durasi Modul Belajar",
          categoryTag: "DURASI MODUL",
          revouValue: "3 Bulan (12 Minggu) komprehensif pendampingan praktisi industri & dosen ahli universitas.",
          competitorValue: "6 minggu modul materi (24 sesi) + 3–4 minggu final project (total batch kalender ±20 minggu).",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang pendidikan profesional (manajer, staf bisnis, owner, finance).",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK).",
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
      competitorLimitation: "Menerbitkan sertifikat internal Purwadhika (tanpa kemitraan perguruan tinggi), durasi modul 6 minggu (24 sesi), dan mensyaratkan min. S1/sederajat.",
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
          revouValue: "Rp 15.000.000 (Alumni ITB/RevoU: **Rp 12.750.000** / Diskon 15%) vs Purwadhika normal Rp 35.000.000. Sertifikasi Resmi **ITB** & Digital Badge.",
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
      competitorLimitation: "Biaya normal Rp 35 juta menerbitkan sertifikat internal Purwadhika (tanpa kemitraan perguruan tinggi), dengan kurikulum teknis koding machine learning & deep learning.",
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt, cicilan 3x–12x via kartu kredit/Danacita, all-in termasuk 12 minggu Virtual Internship & Career+).",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25jt (Non-refundable).",
          highlight: false
        },
        {
          parameter: "Durasi Modul Pembelajaran",
          categoryTag: "DURASI MODUL",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "9 minggu modul materi (45 sesi) + 5 minggu final project (total batch kalender ±20 minggu).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "8 Modules + AI: Business Problem Solving (Issue Tree, RCA), SQL BigQuery AI, Python Pandas/PandasAI, Tableau, Looker Studio, Data Storytelling, serta Production-Ready Analytics (Apache Airflow & Automated ETL).",
          competitorValue: "Python, SQL, Tableau, Statistics, Machine Learning dasar.",
          highlight: false
        },
        {
          parameter: "Persyaratan Peserta",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang pendidikan (SMA/SMK, D3, S1).",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK).",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek Nyata (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portofolio Proyek standar industri (6 Skill-Specific Projects + 1 Capstone Project) + 12 Minggu Virtual Internship menyelesaikan kasus nyata perusahaan partner (Telkom OCA, Zurich, dll).",
          competitorValue: "Final project kelompok 1–3 orang di akhir program.",
          highlight: true
        }
      ],
      competitorLimitation: "Durasi modul pembelajaran sangat cepat (hanya 9 minggu modul), dan mewajibkan minimal lulusan S1 untuk fasilitas penyaluran kerja.",
      revouEdge: "RevoU FSDA terbuka untuk seluruh jenjang, durasi belajar 7 bulan komprehensif termasuk 8 modul + Apache Airflow ETL, 12 minggu Virtual Internship studi kasus riil (Telkom OCA, Zurich), dan didampingi Career Coach 1-on-1 sampai hired.",
      acTalkingPoint: "Purwadhika BDA waktu modul belajarnya relatif singkat yaitu 9 minggu dan mewajibkan syarat min. S1. Kalau di RevoU FSDA, kita mendalami SQL, Python, Tableau, Looker, dan Apache Airflow ETL selama 7 bulan termasuk 12 minggu Virtual Internship mengerjakan data klien nyata, dan ada bimbingan Career Coach 1-on-1 intensif sampai dapat kerja."
    },
    {
      id: "pwd-dsml-itb",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Data Science & Machine Learning (vs RevoU x ITB ADS)",
      badge: "After Hours (3-6 Bulan)",
      revouMatchProgram: "x ITB: Applied Data Science with AI",
      revouMatchBadge: "ITB",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Universitas",
          categoryTag: "INVESTASI & KREDENSIAL",
          revouValue: "Rp 16.999.000 (opsi cicilan 0% & corporate invoice) + Certificate of Completion resmi **Institut Teknologi Bandung (FTI ITB)** + Opsi transfer kredit 1 SKS Program Magister FTI ITB.",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25jt (Hanya sertifikat kelulusan internal kursus Purwadhika).",
          highlight: true
        },
        {
          parameter: "Pengajar & Instruktur Praktisi",
          categoryTag: "PENGAJAR",
          revouValue: "Kolaborasi Dosen FTI ITB & Praktisi Senior Aktif: **Rahmat Hidayatullah** (Head of Data Science, XLSMART) — kurikulum terapan mutakhir.",
          competitorValue: "Instruktur pengajar kelas dan mentor praktisi internal saat final project.",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modern AI Tooling",
          categoryTag: "KURIKULUM",
          revouValue: "Modern Data Science: Predictive analytics (regression, classification), forecasting, ML clustering, AI coding agent via **Claude Code Safety Gate** untuk akselerasi koding aman.",
          competitorValue: "Python dasar, SQL, Tableau, statistik, dan machine learning (Scikit-Learn).",
          highlight: true
        },
        {
          parameter: "Format Belajar & On-Campus Sesi",
          categoryTag: "FORMAT KELAS",
          revouValue: "Hybrid 13 Minggu: Live Zoom interaktif malam hari + Sesi On-Campus Networking tatap muka di Kampus ITB Ganesha Bandung.",
          competitorValue: "Online Livestream (Sen–Kam 3 bulan atau Sel & Kam 6 bulan) atau tatap muka di kampus swasta BSD.",
          highlight: false
        },
        {
          parameter: "Deliverable Proyek Akhir",
          categoryTag: "PROYEK AKHIR",
          revouValue: "Capstone Decision App siap pakai berbasis machine learning & AI (misal Churn Prediction & Decision System) yang langsung bisa diimplementasikan ke sistem bisnis nyata.",
          competitorValue: "Final project kelompok 1–3 orang (4 minggu).",
          highlight: true
        }
      ],
      competitorLimitation: "Biaya normal mencapai Rp 25 juta menerbitkan sertifikat internal Purwadhika, fokus kurikulum pada machine learning Python/Scikit-Learn tanpa integrasi AI coding agent seperti Claude Code, dan final project dikerjakan secara berkelompok.",
      revouEdge: "Kredensial resmi universitas teknik nomor 1 di Indonesia (FTI ITB) dengan opsi 1 SKS Magister, bimbingan langsung Head of Data Science XLSMART & Dosen FTI ITB, integrasi modern Claude Code, dan Capstone Decision App nyata.",
      acTalkingPoint: "Purwadhika DS&ML biaya normalnya Rp 25 juta untuk sertifikat internal kursus kak. Di program RevoU x ITB Applied Data Science with AI (Rp 16,99jt), kakak belajar machine learning terapan modern bersama Dosen FTI ITB dan Head of Data Science XLSMART, menggunakan AI coding agent Claude Code, dan mendapatkan sertifikat resmi ITB plus opsi 1 SKS Magister ITB. Kredensial dan kedalamannya jauh lebih bernilai tinggi di mata industri!"
    },
    {
      id: "pwd-dsml-fsda",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Data Science & Machine Learning (vs RevoU FSDA)",
      badge: "After Hours (3-6 Bulan)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt, cicilan 3x–12x via kartu kredit/Danacita, tanpa biaya kos). Non-refundable.",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25jt. Non-refundable.",
          highlight: false
        },
        {
          parameter: "Durasi & Kedalaman Modul",
          categoryTag: "DURASI MODUL",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "12–14 minggu materi (45 sesi) + 4 minggu final project (total batch kalender ±20 minggu).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Production Engineering",
          categoryTag: "KURIKULUM",
          revouValue: "8 Modules + AI: Business Problem Solving (Issue Tree, RCA), SQL BigQuery AI, Python Pandas/PandasAI, Tableau, Looker Studio, Data Storytelling, serta **Production-Ready Analytics (Apache Airflow & Automated ETL)**.",
          competitorValue: "Python programming, SQL, Tableau, statistik, dan machine learning (Scikit-Learn).",
          highlight: false
        },
        {
          parameter: "Proyek Nyata (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portfolio Projects standar industri + **12 Minggu Virtual Internship** menganalisis dataset bisnis riil dari korporasi partner (Telkom OCA, Zurich, dll) dan presentasi ke tim manajemen mitra.",
          competitorValue: "Final project kelompok 1–3 orang tanpa program lab/magang dengan mitra perusahaan riil.",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan & Usia",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang (SMA/SMK, D3, S1) tanpa batasan usia karir.",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK), dan fasilitas koneksi kerja dibatasi maks. usia 30 tahun.",
          highlight: true
        }
      ],
      competitorLimitation: "Durasi modul materi relatif singkat (12–14 minggu), mewajibkan minimal S1/sederajat, dan batas usia 30 tahun untuk koneksi kerja.",
      revouEdge: "RevoU FSDA berdurasi 7 bulan komprehensif dari nol hingga menguasai Apache Airflow & Automated ETL, 12 minggu Virtual Internship studi kasus riil perusahaan (Telkom OCA, Zurich), terbuka semua jenjang/usia, dan didukung bimbingan karir 1-on-1 Career+.",
      acTalkingPoint: "Purwadhika DS&ML mensyaratkan minimal S1/sederajat dan batas usia 30 tahun. Di RevoU FSDA, kita mendalami data end-to-end selama 7 bulan dari nol, menguasai Apache Airflow ETL, ada 12 minggu Virtual Internship mengolah real dataset perusahaan mitra, dan dibimbing langsung oleh Career Coach 1-on-1 intensif sampai dapat kerja. Tentu jauh lebih matang untuk persiapan karir kakak :)"
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
          revouValue: "• Biaya Program: Rp 14.900.000 – Rp 17.900.000 (Rp 14.9jt – 17.9jt all-in sudah termasuk 12 modul AI, alokasi real ads budget jutaan rupiah, 12 minggu Virtual Internship, & Career+).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Bebas Biaya Tambahan: Bebas biaya tools/akun premium (100% disediakan RevoU).",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25jt. Non-refundable.",
          highlight: false
        },
        {
          parameter: "Durasi Modul Pembelajaran",
          categoryTag: "DURASI MODUL",
          revouValue: "7 Bulan komprehensif (Bulan 1-4: Pembelajaran Modul LIVE; Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "12 minggu modul + 5 minggu final project (total batch kalender ±20-28 minggu).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Integrasi AI",
          categoryTag: "KURIKULUM",
          revouValue: "12 Modul Lengkap Integrasi AI: Performance & Budget (CAC, CLTV), Landing Pages & CRO, GenAI & Custom GPTs, GA4 & GTM, Looker Studio, Social Media Organic AI, Influencer KOL, Meta Ads AI, TikTok & Marketplace Ads (Shopee/Tokopedia CPAS), Google Ads, SEO with AI (100% AI-Powered), CRM & Automation.",
          competitorValue: "Fundamental DM, Social Media, SEO, Performance Marketing (Google & Meta Ads).",
          highlight: false
        },
        {
          parameter: "Praktek Anggaran Iklan Riil",
          categoryTag: "REAL ADS BUDGET",
          revouValue: "Setiap siswa memegang REAL BUDGET ADS jutaan rupiah langsung untuk running campaign live di Meta, Google, & TikTok.",
          competitorValue: "Tidak tercantum informasi alokasi real ad spend mandiri di website resmi (tools/akun premium tertentu ditanggung peserta).",
          highlight: true
        },
        {
          parameter: "Format Portofolio Proyek Akhir",
          categoryTag: "PORTOFOLIO AKHIR",
          revouValue: "13 Portfolio Projects praktis mandiri (1 per modul) + 12 Minggu Virtual Internship bersama partner bisnis nyata.",
          competitorValue: "Final project 5 minggu (persiapan s.d. presentasi) dikerjakan dalam kelompok 7–8 orang didampingi 1 mentor internal praktisi; wajib memenuhi prerequisite nilai akhir modul untuk bisa mengikuti.",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang (SMA/SMK/D3/S1).",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK), dan koneksi kerja dibatasi maks. usia 30 tahun.",
          highlight: true
        }
      ],
      competitorLimitation: "Final project 5 minggu dikerjakan dalam kelompok 7–8 orang didampingi 1 mentor internal (wajib lolos prerequisite nilai akhir seluruh modul), serta syarat koneksi kerja min. S1/sederajat dan usia maks. 30 tahun.",
      revouEdge: "Di RevoU FSDM, setiap peserta menguasai 12 modul digital marketing terintegrasi AI, mengelola real budget ads jutaan rupiah secara mandiri, memiliki 13 portofolio nyata, serta 12 minggu Virtual Internship.",
      acTalkingPoint: "Di Purwadhika, final project-nya berlangsung 5 minggu dikerjakan dalam kelompok 7-8 orang dengan 1 mentor internal, dan ada syarat nilai prerequisite modul dulu kak. Kalau di RevoU FSDM, setiap siswa membuat 13 portofolio mandiri per modul, mengelola real ads budget jutaan rupiah secara mandiri, ada 12 minggu Virtual Internship mengerjakan real project perusahaan mitra, dan dibimbing Career Coach 1-on-1 sampai dapat kerja. Kakak lebih memprioritaskan portofolio mandiri atau kelompok besar kak? :)"
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 19.500.000 – Rp 22.500.000 (Rp 19.5jt – 22.5jt, cicilan 3x–12x via kartu kredit/Danacita). Non-refundable.",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25jt. Tanpa garansi refund.",
          highlight: false
        },
        {
          parameter: "Durasi & Kurikulum",
          categoryTag: "DURASI & KURIKULUM",
          revouValue: "8 Bulan komprehensif (5 Bulan Live Classes 210+ Jam LIVE malam 19:00–21:00 WIB + 3 Bulan Virtual Internship). Indonesia's 1st AI-Native Software Engineering Program (Eksklusif AWS), Python/Flask, Next.js/TypeScript, Tailwind, Playwright, Kiro spec mode, Claude.",
          competitorValue: "13 minggu modul + 4–5 minggu final project (JavaScript/Node.js, Express, React, MySQL).",
          highlight: true
        },
        {
          parameter: "Support System Harian",
          categoryTag: "SUPPORT BELAJAR",
          revouValue: "Pengajar Praktisi + Section Manager + Team Lead + Mentor + 1-on-1 Personal Career Coach (Career+).",
          competitorValue: "Instruktur kelas, 1 mentor internal praktisi saat final project, akses video materi LMS, serta soft skill development by innergy.",
          highlight: true
        },
        {
          parameter: "Proyek Nyata (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "2 Proyek Utama skala produksi (Full-Stack konvensional & AI-built) + 3 Bulan Virtual Internship memecahkan masalah nyata perusahaan partner.",
          competitorValue: "Final project kelompok 2–3 orang (4–5 minggu).",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang (SMA/SMK, D3, S1) tanpa batasan latar belakang.",
          competitorValue: "Terbuka untuk lulusan SMA/SMK (salah satu dari 2 program Job Connector Purwadhika yang menerima SMA/SMK bersama Visual Design & UI/UX; program Job Connector lainnya wajib S1/sederajat).",
          highlight: false
        }
      ],
      competitorLimitation: "Kurikulum fokus pada fullstack JavaScript (Express/React), tanpa kemitraan cloud AWS resmi atau pendekatan AI-native terstruktur.",
      revouEdge: "RevoU FSSE adalah program AI-Native pertama di Indonesia bermitra eksklusif dengan AWS, berdurasi 8 bulan komprehensif, review kode baris-per-baris, 3 bulan Virtual Internship, dan bimbingan karir 1-on-1 intensif Career+.",
      acTalkingPoint: "Kurikulum Fullstack Purwadhika belum berbasis AI-native dan tanpa kemitraan cloud global kak. Di RevoU FSSE, kita bermitra eksklusif dengan AWS, kurikulum AI-native 8 bulan (210+ jam live) mengajarkan Python/Flask dan Next.js/TypeScript, ada 3 bulan Virtual Internship membangun produk riil perusahaan mitra, serta bimbingan Career Coach 1-on-1 intensif sampai siap kerja."
    },
    {
      id: "pwd-cyber",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Cybersecurity",
      badge: "Job Connector (Online Livestream)",
      revouMatchProgram: "x BINUS: Applied Cybersecurity with AI",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Resmi",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Online: Rp 15.000.000 / On-Campus: Rp 16.500.000 (cicilan tersedia) + Professional Certificate resmi kolaborasi **BINUS University, AWS, dan RevoU**.",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25.000.000 (sertifikat internal Purwadhika).",
          highlight: true
        },
        {
          parameter: "Fasilitas Cloud Lab Praktis",
          categoryTag: "LABS PRAKTIK",
          revouValue: "3 Live Cloud Infrastructure Labs di lingkungan resmi **Amazon Web Services (AWS)** + 5 sesi on-campus di BINUS Kemanggisan.",
          competitorValue: "Sesi Online Livestream Zoom dengan hands-on labs (tidak tercantum dedicated live cloud lab AWS enterprise resmi).",
          highlight: true
        },
        {
          parameter: "Fokus Kurikulum Pertahanan",
          categoryTag: "KURIKULUM",
          revouValue: "Mendalam pada **Defensive Cybersecurity (Blue Team)**: threat triage, monitoring, incident response, dan integrasi AI security agent sejak Day One.",
          competitorValue: "Mencakup materi keamanan siber Blue Team (defensive) dan Red Team (ethical hacking/penetration testing).",
          highlight: true
        },
        {
          parameter: "Deliverables Portofolio",
          categoryTag: "PORTOFOLIO AKHIR",
          revouValue: "5 Portofolio Artifacts + Capstone working security tool dengan workflow modern (*vibe coding*).",
          competitorValue: "Final project kelompok 4–5 minggu.",
          highlight: false
        }
      ],
      competitorLimitation: "Biaya normal mencapai Rp 25 juta menerbitkan sertifikat internal Purwadhika, materi mencakup Blue Team & Red Team tanpa dedicated live cloud lab AWS terintegrasi.",
      revouEdge: "Kolaborasi resmi BINUS University, AWS, dan RevoU, fokus mendalam pada Defensive Cybersecurity (Blue Team), 3 hari live lab AWS, dan sertifikasi resmi institusi dengan biaya mulai Rp 15 juta.",
      acTalkingPoint: "Purwadhika Cybersecurity biaya normalnya mencapai Rp 25jt untuk sertifikat internal sekolah kursus kak. Di RevoU x BINUS Applied Cybersecurity with AI, kakak belajar 12 minggu langsung praktek di 3 live labs infrastruktur cloud AWS asli, fokus di Defensive Security (Blue Team) yang paling dicari industri saat ini, dan mendapatkan Professional Certificate resmi dari BINUS University & AWS dengan biaya mulai Rp 15 juta saja!"
    },
    {
      id: "pwd-de",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Data Engineering",
      badge: "Job Connector (Online Livestream)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt, cicilan 3x–12x via kartu kredit/Danacita, tanpa biaya kos). Non-refundable.",
          competitorValue: "Early Bird Rp 15jt | Term 1 Rp 18jt | Term 2 Rp 21jt | Promo 39th Rp 18,5jt | Scholarship Sinarmas Land Rp 12,5jt | Normal Rp 25jt. Non-refundable.",
          highlight: false
        },
        {
          parameter: "Jadwal Belajar",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) Senin–Kamis (LIVE Lecture & Simulation) + Sesi Review Tugas Opsional: Sabtu 13:00–15:30 WIB — ramah pekerja & mahasiswa (tidak perlu resign).",
          competitorValue: "Senin–Kamis 19:00–22:00 WIB (Online Livestream, 3 jam per sesi).",
          highlight: false
        },
        {
          parameter: "Durasi Modul & Sesi Belajar",
          categoryTag: "DURASI MODUL",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "14 minggu materi (44 sesi) + 5 minggu final project (total batch kalender ±20–25 minggu).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Data Pipeline Stack",
          categoryTag: "KURIKULUM",
          revouValue: "End-to-end Data Lifecycle: Business Problem Framing, Advanced SQL BigQuery AI, Python Pandas, Data Storytelling, serta **Production-Ready Analytics (Apache Airflow & Automated ETL Pipeline)**.",
          competitorValue: "Python OOP & Docker -> Database (Relational & NoSQL) -> Data Warehouse (BigQuery) -> Data Pipeline (Apache Airflow, Apache Spark, GCP).",
          highlight: false
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portofolio Proyek standar industri + **12 Minggu Virtual Internship** mengolah dataset korporasi nyata (Telkom OCA, Zurich, dll) dan presentasi ke tim manajemen mitra.",
          competitorValue: "Final project kelompok 1–3 orang (membangun pipeline data mandiri).",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan & Usia",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang pendidikan (SMA/SMK, D3, S1) tanpa batasan usia.",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK), dan koneksi kerja dibatasi maksimal usia 30 tahun.",
          highlight: true
        }
      ],
      competitorLimitation: "Kurikulum murni teknis backend pipeline tanpa latihan presentasi bisnis ke jajaran direksi/stakeholder, mewajibkan min. S1/sederajat, dan batas usia 30 tahun untuk koneksi kerja.",
      revouEdge: "RevoU FSDA menggabungkan pemecahan masalah bisnis nyata, visualisasi eksekutif, dan automated ETL Apache Airflow selama 7 bulan komprehensif, 12 minggu Virtual Internship korporasi nyata, dan Career+ 1-on-1 coaching sampai dapat kerja.",
      acTalkingPoint: "Purwadhika Data Engineering fokusnya sangat teknikal koding pipeline data dan mewajibkan syarat min. S1/sederajat serta usia maks 30 tahun kak. Kalau di RevoU FSDA, kakak belajar komprehensif 7 bulan dari business problem solving, SQL, Python, Tableau, hingga automated ETL dengan Apache Airflow, ada 12 minggu Virtual Internship mengerjakan real dataset partner korporasi, terbuka untuk semua jenjang pendidikan, dan didampingi Career Coach 1-on-1 sampai dapat kerja."
    },
    {
      id: "pwd-qa",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Quality Assurance Engineer",
      badge: "Job Connector (Sen–Kam 19:00–22:00)",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 19.500.000 – Rp 22.500.000 (Rp 19.5jt – 22.5jt, cicilan 3x–12x via kartu kredit/Danacita). Non-refundable.",
          competitorValue: "Early Bird Rp 14jt | Term 2 Rp 20jt | Promo 39th Rp 14,5jt | Normal Rp 23jt. Non-refundable.",
          highlight: false
        },
        {
          parameter: "Jadwal & Waktu Belajar",
          categoryTag: "JADWAL KELAS",
          revouValue: "Kelas malam konsisten 19:00–21:00 WIB Senin–Jumat (210+ jam live) — sangat ramah pekerja tanpa perlu resign.",
          competitorValue: "Senin–Kamis 19:00–22:00 WIB (Online Livestream).",
          highlight: false
        },
        {
          parameter: "Durasi Modul & Kedalaman Materi",
          categoryTag: "DURASI MODUL",
          revouValue: "8 Bulan komprehensif (5 Bulan Live Classes 210+ Jam LIVE + 3 Bulan Virtual Internship memecahkan masalah klien nyata).",
          competitorValue: "8 minggu modul materi (32 sesi) + 4 minggu final project (total batch kalender ±16–20 minggu).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Cakupan Skill",
          categoryTag: "KURIKULUM",
          revouValue: "Full Stack Software Engineering AI-Native (AWS partner): Python/Flask, Next.js/TypeScript, modern testing end-to-end dengan Playwright & spec-driven AI development, cloud deployment CI/CD.",
          competitorValue: "Manual Testing (Test Case, SDLC/STLC, Jira), API Testing (Postman, Newman), Automation Testing (Selenium, Cypress/Playwright), Performance Testing (JMeter).",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan & Usia",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang (SMA/SMK, D3, S1) tanpa batasan usia karir.",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK), dan koneksi kerja dibatasi maksimal usia 30 tahun.",
          highlight: true
        },
        {
          parameter: "Proyek Nyata (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "2 Proyek Utama skala produksi + 3 Bulan Virtual Internship membangun produk software nyata bersama partner korporasi.",
          competitorValue: "Final project testing kelompok pada aplikasi web/mobile.",
          highlight: true
        }
      ],
      competitorLimitation: "Durasi modul 8 minggu (32 sesi) dengan biaya normal Rp 23jt fokus pada pengujian perangkat lunak (QA manual & automation), mewajibkan min. S1/sederajat, dan batas usia 30 tahun untuk koneksi kerja.",
      revouEdge: "RevoU FSSE berdurasi 8 bulan komprehensif bermitra eksklusif dengan AWS, melatih software engineer serba bisa yang menguasai automated end-to-end testing (Playwright) sekaligus full stack coding, 3 bulan Virtual Internship, dan Career+ 1-on-1 coaching.",
      acTalkingPoint: "Purwadhika QA durasi modulnya 8 minggu dengan harga normal Rp 23jt fokus pada testing (QA) kak. Di industri modern, banyak recruiter mencari Software Engineer yang menguasai pengembangan aplikasi sekaligus automated testing. Di RevoU FSSE (8 bulan, kemitraan AWS), kakak belajar Full Stack Next.js dan Python, automated testing dengan Playwright, 3 bulan Virtual Internship, dan didampingi Career Coach 1-on-1 sampai dapat kerja!"
    },
    {
      id: "pwd-socmed",
      competitorId: "purwadhika",
      competitorName: "Purwadhika",
      programTitle: "Social Media & Content Creation",
      badge: "Job Connector (Sen–Kam 19:00–22:00)",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 14.900.000 – Rp 17.900.000 (Rp 14.9jt – 17.9jt all-in sudah termasuk 12 modul AI, alokasi real ads budget jutaan rupiah, 12 minggu Virtual Internship, & Career+).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Bebas Biaya Tambahan: Bebas biaya tools/akun premium (100% disediakan RevoU).",
          competitorValue: "Early Bird Rp 14jt | Term 2 Rp 20jt | Promo 39th Rp 14,5jt | Normal Rp 23jt. Non-refundable.",
          highlight: false
        },
        {
          parameter: "Durasi Modul Pembelajaran",
          categoryTag: "DURASI MODUL",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live interaktif + Bulan 5-7: 12 Minggu Virtual Internship & Career Track).",
          competitorValue: "5 minggu modul materi (30 sesi) + 5 minggu final project (total batch kalender ±15–20 minggu).",
          highlight: true
        },
        {
          parameter: "Cakupan Kurikulum & Kanal Marketing",
          categoryTag: "KURIKULUM",
          revouValue: "12 Modul Digital Marketing Full Funnel: Social Media Organic AI, Short-form Video, Influencer KOL, Meta/Google/TikTok Ads, SEO with AI, GA4 & GTM, Looker Studio, CRM & Automation.",
          competitorValue: "Fokus kurikulum: Marketing foundation, Content planning & calendar, Copywriting, Short-form video production, AI-optimized content strategy.",
          highlight: true
        },
        {
          parameter: "Praktek Anggaran Iklan Riil",
          categoryTag: "REAL ADS BUDGET",
          revouValue: "Setiap siswa memegang REAL BUDGET ADS jutaan rupiah langsung untuk running campaign live di Meta, Google, & TikTok.",
          competitorValue: "Tidak tercantum alokasi ad spend (fokus kurikulum resmi pada konten media sosial organik & copywriting).",
          highlight: true
        },
        {
          parameter: "Format Portofolio Akhir",
          categoryTag: "PORTOFOLIO AKHIR",
          revouValue: "13 Portfolio Projects praktis mandiri (1 per modul) + 12 Minggu Virtual Internship bersama partner bisnis nyata.",
          competitorValue: "Final project dikerjakan dalam kelompok maksimal 5 orang.",
          highlight: true
        },
        {
          parameter: "Persyaratan Pendidikan & Usia",
          categoryTag: "SYARAT MASUK",
          revouValue: "Terbuka bagi seluruh jenjang pendidikan (SMA/SMK, D3, S1) tanpa batasan usia.",
          competitorValue: "Mewajibkan minimal lulusan S1/sederajat (hanya program Full Stack Software Development dan Visual Design & UI/UX yang terbuka untuk SMA/SMK), dan koneksi kerja dibatasi maksimal usia 30 tahun.",
          highlight: true
        }
      ],
      competitorLimitation: "Durasi modul 5 minggu dengan biaya normal Rp 23jt berfokus pada media sosial organik & konten, tidak mencakup alokasi ad spend berbayar mandiri, serta mewajibkan min. S1/sederajat.",
      revouEdge: "RevoU FSDM memberikan penguasaan digital marketing 360° lengkap (organik + paid advertising dengan real budget jutaan rupiah), 13 portofolio mandiri, 12 minggu Virtual Internship, dan didampingi Career Coach 1-on-1 sampai hired.",
      acTalkingPoint: "Purwadhika Social Media modulnya hanya 5 minggu dengan biaya normal Rp 23jt dan hanya belajar konten media sosial organik kak. Kalau di RevoU FSDM, selama 7 bulan kakak menguasai strategi konten organik PLUS paid performance marketing (Meta, Google, TikTok Ads) dengan real ads budget jutaan rupiah mandiri, ada 13 portofolio nyata, 12 minggu Virtual Internship, dan didampingi Career Coach 1-on-1 sampai dapat kerja. Nilai karirnya jauh lebih tinggi di mata recruiter!"
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
          parameter: "Biaya & Skema Pembelajaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Investasi berbanding lurus dengan fasilitas: **100% Live Instruction** harian, 12 minggu Virtual Internship, & Career+ 1-on-1 coaching (non-refundable).",
          competitorValue: "Rp 7.000.000 – Rp 15.000.000 (Harga ekonomis, banyak diskon promo, benefit gratis ulang kelas seumur hidup tanpa refund dana).",
          highlight: false
        },
        {
          parameter: "Format Belajar & Intensitas Sesi",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif dua arah malam hari (19:00–21:00 WIB) Senin–Kamis + Sesi Review Tugas Opsional Sabtu (ramah pekerja tanpa perlu resign).",
          competitorValue: "Kombinasi video rekaman materi LMS + sesi Live Zoom tanya jawab 2–3x per minggu.",
          highlight: true
        },
        {
          parameter: "Durasi & Kurikulum",
          categoryTag: "DURASI & KURIKULUM",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track). 8 Modul + AI termasuk Apache Airflow & Automated ETL.",
          competitorValue: "Pre-bootcamp + 24 minggu bootcamp + 2 post + 4 minggu Job Connect (±7 bulan).",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portfolio Projects standar industri + 12 Minggu Virtual Internship menganalisis dataset bisnis skala enterprise mitra riil (Telkom Indonesia OCA, Zurich, dll).",
          competitorValue: "Portofolio tugas akhir dan talent showcase ke partner.",
          highlight: true
        },
        {
          parameter: "Reputasi Recruiter Top Tech",
          categoryTag: "TRACK RECORD",
          revouValue: "Kurikulum berstandar praktik industry, 15.000+ alumni aktif di 1.000+ top company (Gojek, Tokopedia, Traveloka, Shopee, Big 4).",
          competitorValue: "Penyaluran ke 1.100+ hiring partner Dibimbing.",
          highlight: false
        }
      ],
      competitorLimitation: "Hanya 2–3 sesi per minggu dan sebagian materi berupa rekaman video; jam interaksi live bersama praktisi jauh lebih sedikit.",
      revouEdge: "100% Live Instruction interaktif, 8 modul lengkap dengan Apache Airflow & Automated ETL, 7 portofolio proyek + 12 minggu Virtual Internship mitra nyata, dan bimbingan karir 1-on-1 intensif Career+.",
      acTalkingPoint: "Dibimbing cocok kalau kakak ingin belajar santai 2-3 sesi per minggu via video rekaman LMS. Tapi jika kakak ingin switch career total menjadi Data Analyst handal, RevoU menyediakan 100% live class interaktif, bimbingan langsung dari praktisi industri aktif, penguasaan Apache Airflow ETL, dan 12 minggu Virtual Internship analisis real dataset bisnis."
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
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 14.900.000 – Rp 17.900.000 (Rp 14.9jt – 17.9jt all-in sudah termasuk 12 modul AI, alokasi real ads budget jutaan rupiah, 12 minggu Virtual Internship, & Career+).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Bebas Biaya Tambahan: Bebas biaya registrasi tersembunyi & tanpa biaya tools.",
          competitorValue: "Rp 7.000.000 – Rp 15.000.000 (Harga ekonomis, banyak diskon promo, benefit gratis ulang kelas seumur hidup tanpa refund dana).",
          highlight: false
        },
        {
          parameter: "Format Sesi & Real Budget",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Instruction 4x/minggu malam (19:00–21:00 WIB) + Setiap siswa pegang REAL BUDGET ADS jutaan rupiah langsung untuk live campaign di Meta, Google, & TikTok.",
          competitorValue: "Video LMS rekaman + live Zoom 2-3x/minggu tanpa alokasi anggaran ads riil mandiri.",
          highlight: true
        },
        {
          parameter: "Durasi & Kurikulum",
          categoryTag: "DURASI & KURIKULUM",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track). 12 Modul Lengkap Integrasi AI (Custom GPTs, GA4/GTM, Looker Studio, Meta/Google/TikTok Ads, SEO with AI, CRM).",
          competitorValue: "Durasi 4 bulan, fokus materi dasar SEO, sosmed, ads, CRM.",
          highlight: true
        },
        {
          parameter: "Portofolio Klien Nyata (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "13 Portfolio Projects praktis mandiri + 12 Minggu Virtual Internship menjalankan kampanye pemasaran nyata untuk perusahaan partner.",
          competitorValue: "Studi kasus latihan dan tugas akhir kelompok.",
          highlight: true
        }
      ],
      competitorLimitation: "Sebagian materi dipelajari mandiri melalui video rekaman LMS dengan sesi live 2–3x seminggu, dan tidak tercantum alokasi anggaran ads berbayar mandiri untuk tiap siswa.",
      revouEdge: "100% Live Instruction interaktif malam, kurikulum 12 modul lengkap integrasi AI, alokasi real ads budget jutaan rupiah untuk setiap siswa, 13 portofolio mandiri, dan 12 minggu Virtual Internship.",
      acTalkingPoint: "Dibimbing memang opsi yang ramah kantong untuk belajar santai 2-3x seminggu via video LMS kak. Tapi kalau tujuan kakak ingin career switch menjadi Digital Marketer handal di perusahaan top, RevoU memberikan 100% live class interaktif, real ads budget jutaan rupiah mandiri, 12 modul integrasi AI, 13 portofolio project, dan 12 minggu Virtual Internship bersama real client."
    },
    {
      id: "db-cyber",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Cyber Security Bootcamp",
      badge: "Bootcamp ±4 Bulan",
      revouMatchProgram: "x BINUS: Applied Cybersecurity with AI",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Resmi",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Online: Rp 15.000.000 / On-Campus: Rp 16.500.000 (cicilan tersedia) + Professional Certificate resmi **BINUS University, AWS, dan RevoU**.",
          competitorValue: "Rp 7.000.000 – Rp 15.000.000 (Sertifikat kelulusan internal Dibimbing).",
          highlight: true
        },
        {
          parameter: "Fasilitas Cloud Lab Praktis",
          categoryTag: "LABS PRAKTIK",
          revouValue: "3 Live Cloud Infrastructure Labs di lingkungan resmi **Amazon Web Services (AWS)** + 5 sesi on-campus di BINUS Kemanggisan.",
          competitorValue: "Sesi Zoom dan tugas akhir mandiri tanpa dedicated cloud labs di AWS.",
          highlight: true
        },
        {
          parameter: "Fokus Kurikulum Pertahanan",
          categoryTag: "KURIKULUM",
          revouValue: "Mendalam pada **Defensive Cybersecurity (Blue Team)**: threat detection, triage, respons insiden, dan integrasi AI security agent sejak Day One.",
          competitorValue: "Kombinasi materi rekaman video LMS dan sesi live Zoom (tidak tercantum fasilitas live cloud labs AWS enterprise).",
          highlight: true
        }
      ],
      competitorLimitation: "Materi sebagian besar berupa rekaman video LMS dan tidak memiliki fasilitas hands-on lab di cloud AWS enterprise resmi.",
      revouEdge: "Kolaborasi resmi BINUS University, AWS, dan RevoU, fokus mendalam pada Defensive Cybersecurity (Blue Team), 3 hari live lab AWS, dan sertifikasi resmi institusi.",
      acTalkingPoint: "Dibimbing opsi ekonomis via video LMS rekaman kak. Namun di bidang cybersecurity, industri mencari analis Blue Team yang sudah terbiasa dengan environment cloud nyata. Di RevoU x BINUS, kakak praktek langsung di 3 AWS Live Labs asli dan dibimbing langsung oleh faculty BINUS serta Solutions Architect AWS!"
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
          revouValue: "Program Karir Komprehensif End-to-End 7 bulan (Rp 17.9jt – 20.9jt, opsi cicilan 3x–12x) termasuk 12 minggu Virtual Internship & Career+ (non-refundable).",
          competitorValue: "Kursus Modular Singkat Rp 899.000 (normal Rp 1.099.000) atau paket bundle BNSP Rp 1,2jt–3,8jt.",
          highlight: false
        },
        {
          parameter: "Durasi & Total Jam Belajar",
          categoryTag: "DURASI BELAJAR",
          revouValue: "7 Bulan komprehensif (>80 sesi intensif live + 12 Minggu Virtual Internship menganalisis dataset enterprise).",
          competitorValue: "17 sesi singkat (total 42,5 jam, 2x seminggu malam).",
          highlight: true
        },
        {
          parameter: "Cakupan Materi",
          categoryTag: "KURIKULUM",
          revouValue: "End-to-end: SQL BigQuery AI, Python Pandas/PandasAI, Tableau, Looker Studio, Advanced Spreadsheet, Data Storytelling, Business Problem Solving (Issue Tree/RCA), serta Production-Ready Analytics (Apache Airflow & Automated ETL).",
          competitorValue: "SQL queries dasar, manipulasi data Pandas, dan persiapan uji kompetensi BNSP.",
          highlight: true
        }
      ],
      competitorLimitation: "Format kursus modular singkat 17 sesi (42,5 jam) fokus pada persiapan ujian kompetensi BNSP, tanpa program magang virtual atau bimbingan karir intensif 1-on-1.",
      revouEdge: "Di RevoU FSDA peserta belajar 7 bulan komprehensif dari nol, menguasai SQL, Python, Tableau, Looker, dan Apache Airflow ETL, serta 12 minggu Virtual Internship mengerjakan data bisnis riil (Telkom OCA, Zurich), didampingi Career Coach 1-on-1 sampai dapat kerja.",
      acTalkingPoint: "DQLab berformat kursus modular singkat 17 sesi (42,5 jam) fokus pada persiapan sertifikasi BNSP kak. Di RevoU FSDA peserta belajar 7 bulan komprehensif, menguasai SQL, Python, Tableau, Looker Studio, dan Apache Airflow ETL, ada 12 minggu Virtual Internship mengerjakan data bisnis riil perusahaan, didampingi Career Coach 1-on-1 sampai dapat kerja."
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
          parameter: "Biaya & Kredensial Resmi",
          categoryTag: "INVESTASI & KREDENSIAL",
          revouValue: "Rp 15.000.000 (Mahasiswa BINUS & Alumni RevoU: **Rp 12.750.000** / Diskon 15%) + Professional Certificate resmi **BINUS University** & RevoU (72 jam durasi pembelajaran).",
          competitorValue: "Rp 2.500.000 (Sertifikat kelulusan kelas Zoom singkat internal DQLab).",
          highlight: true
        },
        {
          parameter: "Durasi & Kedalaman Materi",
          categoryTag: "DURASI BELAJAR",
          revouValue: "3 Bulan (12 Minggu) komprehensif membedah strategi AI korporat, otomasi workflow bisnis (n8n), AI Agents, dan Claude Code.",
          competitorValue: "10 sesi ringkas (total 20 jam, 2x seminggu malam).",
          highlight: true
        }
      ],
      competitorLimitation: "Format kursus ringkas 10 sesi (20 jam) berfokus pada pengenalan tools n8n & GenAI internal DQLab tanpa sertifikasi dari perguruan tinggi.",
      revouEdge: "Program Executive RevoU x BINUS memadukan otomatisasi n8n dengan strategic thinking manajerial, keamanan data korporasi, dan kredensial resmi institusi BINUS.",
      acTalkingPoint: "Kelas DQLab ini berformat kursus ringkas 10 sesi (20 jam) kak. Di program Executive RevoU x BINUS, otomatisasi dipadukan dengan strategic thinking manajerial, keamanan data korporasi, dan kredensial resmi institusi BINUS berdurasi 72 jam pembelajaran dengan biaya terjangkau!"
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
    revou: "100% Live Online Interaktif Dua Arah (+ Akses rekaman selamanya & 24/7 AI Learning Assistant) | Program Eksekutif: Sesi On-Campus ITB Ganesha / BINUS / UI",
    general: "Kombinasi kelas live dengan rekaman video",
    hacktiv8: "Full-Day Bootcamp & Night Bootcamp; lokasi Jakarta, Tangerang, dan Remote",
    purwadhika: "On campus atau online livestream",
    dibimbing: "Online & offline, supported with AI",
    dqlab: "Bootcamp live class virtual + belajar mandiri via modul",
    selfPaced: "100% rekaman video mandiri",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Biaya & Skema Cicilan",
    revou: "Program Karir: Rp 16jt – 25jt (Cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita, tanpa biaya kos) | Program Eksekutif: Rp 15jt – 16,99jt (Diskon alumni 15%)",
    general: "Rp 7.000.000 – Rp 45.000.000 (Sering ada biaya pendaftaran/non-refundable)",
    hacktiv8: "Full-Day Rp 35jt–45jt | Night Rp 18jt–25jt. Reg fee Rp 100rb (non-refundable).\n• Upfront (Best Choice): 2 tahap (tanpa admin & bunga)\n• Cicilan 0%: Danacita & CIMB Niaga / CIMB Niaga Syariah\n• SNPL: Penangguhan bayar s.d. 4 bulan via Danacita",
    purwadhika: "Tiered 10 Program: Normal Rp 20jt–35jt (Early Bird Rp 13jt–20jt, Term 1 Rp 15jt–25jt, Term 2 Rp 17jt–30jt, Promo 39th Rp 14,5jt–27,5jt, Sinarmas Rp 10jt–17,5jt). Tools premium tertentu ditanggung peserta.",
    dibimbing: "Rp 7jt – Rp 15jt (Ekonomis, bayar penuh atau cicilan, gratis mengulang batch seumur hidup)",
    dqlab: "Rp 699rb – Rp 3,8jt (Bootcamp single Rp 699rb–2,5jt, Ujian BNSP Rp 1,9jt–2,5jt, Bundle Rp 1,2jt–3,8jt)",
    selfPaced: "Rp 500rb – Rp 5jt (tanpa bimbingan live)",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Jadwal & Komitmen Waktu",
    revou: "Malam hari (19:00–21:00 WIB) Senin–Kamis (LIVE Lecture & Simulation) + Sesi Review Tugas Opsional: Sabtu 13:00–15:30 WIB — ramah pekerja & mahasiswa (tidak perlu resign)",
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
    revou: "Program Karir: 7 – 8 bulan (Bulan 1-4/5 Modul Live + 12 Minggu Virtual Internship / Real Partner Project + Career+) | Program Eksekutif: 12 – 13 minggu (ITB, BINUS, UI)",
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
    revou: "4–5x per minggu live interaktif dua arah bersama praktisi industri aktif",
    general: "1 – 3x per minggu",
    hacktiv8: "1-on-1 mentoring dengan instruktur berpengalaman",
    purwadhika: "Final project didampingi mentor; rekaman kelas & materi tersedia di LMS",
    dibimbing: "Dedicated class manager untuk kebutuhan di dalam & luar kelas",
    dqlab: "Forum belajar dibantu tim data; Data Mentoring dengan praktisi minimal 1x/bulan",
    selfPaced: "Forum diskusi mandiri / tidak ada",
    revouHighlight: true
  },
  {
    category: "Sistem Belajar",
    feature: "Kurikulum & Case Study",
    revou: "Kurikulum AI-Native & teruji industri SEA (FSDM 12 modul AI, FSDA 8 modul + Airflow ETL, FSSE 4 fase AWS) + HackerRank Challenge + 12 Minggu Virtual Internship mitra nyata",
    general: "Sebagian teori umum atau materi luar tanpa konteks lokal",
    hacktiv8: "Kurikulum berbasis AI-powered sesuai kebutuhan industri",
    purwadhika: "Kurikulum teruji industri dengan capstone project di tiap modul + AI Boost",
    dibimbing: "Tugas & project menantang untuk portofolio, plus pengalaman magang nyata",
    dqlab: "Metode HERO (Hands-On, Experiential Learning, Outcome-based); studi kasus relevan industri",
    selfPaced: "Terjemahan materi luar negeri tanpa konteks lokal"
  },
  {
    category: "Sistem Belajar",
    feature: "Support System Belajar",
    revou: "Pengajar Praktisi + Section Manager + Team Lead + Mentor + 1-on-1 Career Coach + 24/7 AI Learning Assistant",
    general: "Pengajar + Admin Kelas",
    hacktiv8: "Sesi growth mindset; Career Buddy untuk konsultasi grup & 1-on-1",
    purwadhika: "LMS dengan video tambahan tanpa batas; soft skill development by innergy",
    dibimbing: "475+ mentor yang dievaluasi berkala; Talent Support selama & setelah bootcamp",
    dqlab: "ChatGPT terintegrasi di semua modul; real-time feedback",
    selfPaced: "Pengajar saja / Forum mandiri",
    revouHighlight: true
  },

  // Persiapan Kerja
  {
    category: "Persiapan Kerja",
    feature: "Proyek Nyata Portofolio (Virtual Internship)",
    revou: "12 Minggu Virtual Internship mengerjakan kasus nyata perusahaan partner (Telkom OCA, Zurich, dll) & real budget ads jutaan rupiah (hingga 13 portofolio per program)",
    general: "2–4 minggu proyek simulasi internal / tugas akhir mandiri",
    hacktiv8: "Final project web app / pipeline model kelompok kecil di akhir fase",
    purwadhika: "Final project 5 minggu persiapan s.d. presentasi (DM 7–8 orang didampingi 1 mentor internal, Fullstack 2–3 orang, AI 1–3 orang) dengan syarat prerequisite nilai akhir modul",
    dibimbing: "Portofolio tugas akhir dan talent showcase ke partner",
    dqlab: "Latihan modul sintaks koding & studi kasus dasar",
    selfPaced: "Proyek mandiri tanpa bimbingan",
    revouHighlight: true
  },
  {
    category: "Persiapan Kerja",
    feature: "Kelas Pengembangan Karir & Review CV",
    revou: "Career+ (1:1 Personal Career Coach selama 7-8 bulan penuh + AI Career Engine CV/LinkedIn + Monthly Career Clinics + Mock Interview Hiring Manager)",
    general: "< 10 sesi, mayoritas rekaman",
    hacktiv8: "Career Class (CV & LinkedIn), latihan interview HR, peluang interview langsung partner",
    purwadhika: "Bimbingan CV & LinkedIn, persiapan interview, 1-on-1 career counseling",
    dibimbing: "Konsultasi karier & portofolio 1-on-1, review CV & LinkedIn, latihan interview, Talent Showcase",
    dqlab: "DQLab Career: portofolio berpeluang interview partner (CV review tidak tercantum)",
    selfPaced: "Tergantung penyedia / tidak ada",
    revouHighlight: true
  },

  // Jaminan Kerja & Penyaluran Karir
  {
    category: "Jaminan Kerja",
    feature: "Kebijakan Refund & Jaminan Karir",
    revou: "Tidak ada garansi refund dana (Non-refundable). Komitmen difokuskan pada pendampingan karir intensif Career+ (1:1 Career Coach selama 7-8 bulan dan AI Career Engine)",
    general: "Mayoritas non-refundable atau skema ISA/cicilan mengikat",
    hacktiv8: "Tanpa refund (Non-refundable). Reg fee Rp 100rb & biaya pendidikan tidak dapat ditarik kembali. Opsi: Upfront 2 tahap, Cicilan 0% OJK, atau SNPL",
    purwadhika: "Tidak ada jaminan refund biaya (Non-refundable; fasilitas Purwadhika Hiring Network)",
    dibimbing: "Gratis mengulang batch seumur hidup (tidak ada jaminan refund dana)",
    dqlab: "Tidak ada jaminan refund dana",
    selfPaced: "Tidak ada jaminan refund",
    revouHighlight: false
  },
  {
    category: "Jaminan Kerja",
    feature: "Sertifikasi & Kemitraan Kampus",
    revou: "RevoU Certificate bertaraf internasional (Course Report 4.94, SwitchUp 4.93) + Kemitraan Resmi AWS Partner + Universitas Top (#1 ITB, BINUS x AWS, UI)",
    general: "Sertifikat internal lembaga kursus biasa",
    hacktiv8: "Sertifikat kelulusan Hacktiv8; tidak ada kemitraan kampus",
    purwadhika: "Terdaftar Kemendikbud; Certified Google Partner; menerbitkan sertifikat internal Purwadhika (tanpa kemitraan kampus)",
    dibimbing: "Terakui Kemendikti; layanan BNSP & placement program universitas; Forbes 30 Under 30 Asia 2025",
    dqlab: "E-certificate per modul; Sertifikasi BNSP DA; naungan Yayasan Multimedia Nusantara & Xeratic",
    selfPaced: "Certificate of completion otomatis platform",
    revouHighlight: true
  },

  // Komunitas Alumni & Seleksi
  {
    category: "Komunitas Alumni",
    feature: "Jumlah Komunitas Alumni & Network",
    revou: "15.000+ Alumni RevoU di 11+ kota & 1.000+ top company, serta 550.000+ member pelajar digital",
    general: "< 2.000 alumni / < 200.000 member",
    hacktiv8: "3.500+ lulusan di industri tech; 1.000+ hiring partner tanpa placement fee",
    purwadhika: "30.000–40.000+ alumni; Alumni Club berbasis tribe; 1.000+ hiring partner",
    dibimbing: "10K+ lulusan; 100.000+ digital learners; 1.100+ hiring partners",
    dqlab: "500.000+ pengguna; 30+ mitra hiring & corporate training",
    selfPaced: "0 / tidak terpusat",
    revouHighlight: true
  },
  {
    category: "Seleksi Program",
    feature: "Tingkat Seleksi Masuk",
    revou: "Kurang dari 10% (Tes dasar + wawancara untuk jamin circle terbaik), terbuka seluruh jenjang SMA/SMK/D3/S1",
    general: "Mayoritas tanpa seleksi ketat",
    hacktiv8: "Form + reg fee Rp100rb, validasi; syarat motivasi, komitmen, laptop, English dasar",
    purwadhika: "Tidak ada tes masuk; koneksi kerja full-time maks. usia 30 tahun & min. S1/sederajat (kecuali program FSD dan UI/UX yang terbuka untuk SMA/SMK)",
    dibimbing: "Tes masuk tidak tercantum; Job Connect hanya untuk lulusan berpredikat eligible",
    dqlab: "Tidak ada; tidak perlu background IT",
    selfPaced: "Tanpa seleksi",
    revouHighlight: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// KAMUS INFO POP-UP TOOLS & TEKNOLOGI REVOU (POP-UP BOX INFORMATION)
// ─────────────────────────────────────────────────────────────────────────────
interface ToolGlossaryItem {
  name: string;
  title: string;
  roleTag: string;
  bullets: { bold: string; text: string }[];
}

const TOOL_GLOSSARY_DATA: Record<string, ToolGlossaryItem> = {
  Kiro: {
    name: "Kiro",
    title: "Kiro",
    roleTag: "Spec-Driven AI",
    bullets: [
      {
        bold: "Rancang dulu, koding kemudian:",
        text: "Membuat spec arsitektur sebelum coding seperti engineer profesional."
      },
      {
        bold: "Pegang kendali penuh:",
        text: "Membagi task dan verifikasi hasil AI, bukan sekadar menerima saran kode."
      },
      {
        bold: "Fondasi transferable:",
        text: "Paham workflow AI modern mempermudah adaptasi ke berbagai AI tool lainnya."
      }
    ]
  },
  "Next.js (App Router)": {
    name: "Next.js (App Router)",
    title: "Next.js",
    roleTag: "Modern React",
    bullets: [
      {
        bold: "Standar industri #1:",
        text: "Framework React paling dominan di tech company global."
      },
      {
        bold: "App Router termutakhir:",
        text: "Server Components & SSR untuk performa kilat dan SEO terbaik."
      },
      {
        bold: "Paling dicari recruiter:",
        text: "Syarat utama lowongan Software Engineer modern."
      }
    ]
  },
  "Next.js": {
    name: "Next.js",
    title: "Next.js",
    roleTag: "Modern React",
    bullets: [
      {
        bold: "Standar industri #1:",
        text: "Framework React paling dominan di tech company global."
      },
      {
        bold: "App Router termutakhir:",
        text: "Server Components & SSR untuk performa kilat dan SEO terbaik."
      },
      {
        bold: "Paling dicari recruiter:",
        text: "Syarat utama lowongan Software Engineer modern."
      }
    ]
  },
  TypeScript: {
    name: "TypeScript",
    title: "TypeScript",
    roleTag: "Type-Safe JS",
    bullets: [
      {
        bold: "Cegah bug sejak awal:",
        text: "Menangkap error saat koding sebelum aplikasi dipakai pengguna."
      },
      {
        bold: "Wajib di enterprise:",
        text: "Standar kolaborasi tim besar di Gojek, Tokopedia, dan tier-1 tech."
      },
      {
        bold: "Nilai tawar karir:",
        text: "Pembeda utama software engineer profesional vs junior coder."
      }
    ]
  },
  Python: {
    name: "Python",
    title: "Python",
    roleTag: "Universal AI & Backend",
    bullets: [
      {
        bold: "Bahasa #1 era AI:",
        text: "Fondasi utama AI engineering, data science, dan backend."
      },
      {
        bold: "Sintaks bersih:",
        text: "Fokus mendalami logika pemecahan masalah bisnis."
      },
      {
        bold: "Ekosistem terluas:",
        text: "Menghubungkan software engineering dengan model AI/LLM."
      }
    ]
  },
  Flask: {
    name: "Flask",
    title: "Flask",
    roleTag: "Python API",
    bullets: [
      {
        bold: "Arsitektur transparan:",
        text: "Ringan tanpa black-box untuk mendalami cara kerja REST API."
      },
      {
        bold: "Standar AI serving:",
        text: "Pilihan utama engineer untuk melayani model AI ke aplikasi web."
      },
      {
        bold: "Modular & scalable:",
        text: "Mudah dipadukan dengan database PostgreSQL dan Docker."
      }
    ]
  },
  PostgreSQL: {
    name: "PostgreSQL",
    title: "PostgreSQL",
    roleTag: "Enterprise RDBMS",
    bullets: [
      {
        bold: "Database SQL standar dunia:",
        text: "Keandalan transaksi tinggi (ACID) standar perbankan."
      },
      {
        bold: "Dukungan AI vector:",
        text: "Mendukung ekstensi pgvector untuk integrasi AI & semantic search."
      },
      {
        bold: "Cloud-ready:",
        text: "Langsung aplikatif ke AWS RDS, Supabase, dan Cloud SQL."
      }
    ]
  },
  AWS: {
    name: "AWS",
    title: "AWS",
    roleTag: "Official Partner",
    bullets: [
      {
        bold: "Partner resmi AWS:",
        text: "RevoU adalah AWS Academy & Training Partner resmi di Indonesia."
      },
      {
        bold: "Praktik cloud nyata:",
        text: "Deploy langsung ke infrastruktur cloud enterprise (EC2, S3, RDS)."
      },
      {
        bold: "Peluang sertifikasi:",
        text: "Persiapan kredensial resmi AWS Certified Cloud Practitioner."
      }
    ]
  },
  Docker: {
    name: "Docker",
    title: "Docker",
    roleTag: "Container Standard",
    bullets: [
      {
        bold: "Lingkungan konsisten:",
        text: "Aplikasi berjalan identik di laptop maupun server cloud."
      },
      {
        bold: "Standar wajib DevOps:",
        text: "Membungkus aplikasi terisolasi yang siap scale di cloud."
      },
      {
        bold: "Fondasi cloud-native:",
        text: "Langkah awal sebelum deployment container di production."
      }
    ]
  },
  "Playwright (E2E testing)": {
    name: "Playwright",
    title: "Playwright",
    roleTag: "Automated E2E Testing",
    bullets: [
      {
        bold: "Testing multi-browser:",
        text: "Uji otomatis di Chromium, Firefox, dan Safari sekaligus."
      },
      {
        bold: "Kualitas production:",
        text: "Mencegah bug regresi merusak fitur yang sudah berjalan."
      },
      {
        bold: "Cepat & andal:",
        text: "Mekanisme auto-wait cerdas buatan Microsoft tanpa flaky test."
      }
    ]
  },
  Playwright: {
    name: "Playwright",
    title: "Playwright",
    roleTag: "Automated E2E Testing",
    bullets: [
      {
        bold: "Testing multi-browser:",
        text: "Uji otomatis di Chromium, Firefox, dan Safari sekaligus."
      },
      {
        bold: "Kualitas production:",
        text: "Mencegah bug regresi merusak fitur yang sudah berjalan."
      },
      {
        bold: "Cepat & andal:",
        text: "Mekanisme auto-wait cerdas buatan Microsoft tanpa flaky test."
      }
    ]
  },
  Locust: {
    name: "Locust",
    title: "Locust",
    roleTag: "Load Testing",
    bullets: [
      {
        bold: "Simulasi beban user:",
        text: "Uji daya tahan server saat traffic melonjak tinggi."
      },
      {
        bold: "Script berbasis Python:",
        text: "Skenario pengujian ditulis dengan koding terukur."
      },
      {
        bold: "Diferensiasi industri:",
        text: "Kesiapan menangani skala riil yang jarang diajarkan kursus lain."
      }
    ]
  },
  Postman: {
    name: "Postman",
    title: "Postman",
    roleTag: "API Testing",
    bullets: [
      {
        bold: "Validasi API:",
        text: "Uji request payload, response, status code, dan auth token."
      },
      {
        bold: "Dokumentasi tim:",
        text: "Standar kolaborasi agar tim backend dan frontend selalu sinkron."
      },
      {
        bold: "Tool harian wajib:",
        text: "Dipakai setiap hari oleh engineer di industri teknologi."
      }
    ]
  },
  Claude: {
    name: "Claude",
    title: "Claude",
    roleTag: "Frontier AI",
    bullets: [
      {
        bold: "Reasoning koding terbaik:",
        text: "Handal untuk arsitektur kompleks, debugging teliti, dan refactoring."
      },
      {
        bold: "AI thinking partner:",
        text: "Diskusi merancang automated test dan validasi solusi."
      },
      {
        bold: "Kerja 10x lebih efisien:",
        text: "Mengarahkan AI secara presisi tanpa kehilangan esensi pemahaman."
      }
    ]
  },
  TailwindCSS: {
    name: "TailwindCSS",
    title: "TailwindCSS",
    roleTag: "Utility-First CSS",
    bullets: [
      {
        bold: "Pembangunan UI kilat:",
        text: "Styling cepat langsung di komponen React/Next.js."
      },
      {
        bold: "Design system rapi:",
        text: "Konsistensi warna, font scale, dan spacing responsif."
      },
      {
        bold: "Standar industri modern:",
        text: "Framework styling paling populer dan dominan saat ini."
      }
    ]
  },
  "Apache Airflow": {
    name: "Apache Airflow",
    title: "Apache Airflow",
    roleTag: "Data Pipeline",
    bullets: [
      {
        bold: "Orkestrasi otomatis:",
        text: "Jadwalkan dan monitor pipeline data ribuan tabel otomatis."
      },
      {
        bold: "Standar data tier-1:",
        text: "Dipakai unicorn dan perbankan untuk alur data warehouse."
      },
      {
        bold: "Diferensiasi RevoU:",
        text: "Belajar membuat automated pipeline skala produksi nyata."
      }
    ]
  },
  Airflow: {
    name: "Airflow",
    title: "Apache Airflow",
    roleTag: "Data Pipeline",
    bullets: [
      {
        bold: "Orkestrasi otomatis:",
        text: "Jadwalkan dan monitor pipeline data ribuan tabel otomatis."
      },
      {
        bold: "Standar data tier-1:",
        text: "Dipakai unicorn dan perbankan untuk alur data warehouse."
      },
      {
        bold: "Diferensiasi RevoU:",
        text: "Belajar membuat automated pipeline skala produksi nyata."
      }
    ]
  },
  Tableau: {
    name: "Tableau",
    title: "Tableau",
    roleTag: "Enterprise BI",
    bullets: [
      {
        bold: "Market leader korporat:",
        text: "Software visualisasi data pilihan korporasi multinasional."
      },
      {
        bold: "Visualisasi interaktif:",
        text: "Mengolah jutaan data menjadi insight bisnis dinamis."
      },
      {
        bold: "Data storytelling:",
        text: "Membantu menyajikan data meyakinkan bagi jajaran direksi."
      }
    ]
  },
  "Looker Studio": {
    name: "Looker Studio",
    title: "Looker Studio",
    roleTag: "Cloud BI",
    bullets: [
      {
        bold: "Ekosistem Google:",
        text: "Terhubung instan ke BigQuery, GA4, Sheets, dan Google Ads."
      },
      {
        bold: "Dashboard real-time:",
        text: "Mudah dibagikan via tautan untuk monitoring KPI harian."
      },
      {
        bold: "Favorit startup:",
        text: "Visualisasi cepat, efisien, dan hemat biaya lisensi."
      }
    ]
  },
  BigQuery: {
    name: "BigQuery",
    title: "BigQuery",
    roleTag: "Cloud Data Warehouse",
    bullets: [
      {
        bold: "Query data kilat:",
        text: "Proses dataset skala terabyte dalam hitungan detik."
      },
      {
        bold: "Fitur BigQuery ML:",
        text: "Jalankan model machine learning langsung dengan sintaks SQL."
      },
      {
        bold: "Standar industri modern:",
        text: "Data warehouse utama startup unicorn dan korporat."
      }
    ]
  },
  Pandas: {
    name: "Pandas",
    title: "Pandas",
    roleTag: "Data Wrangling",
    bullets: [
      {
        bold: "Manipulasi data #1:",
        text: "Standar mutlak untuk data cleaning, filtering, dan join tabel."
      },
      {
        bold: "Otomasi spreadsheet:",
        text: "Ubah pekerjaan manual jam-jaman di Excel jadi script hitungan detik."
      },
      {
        bold: "Fondasi machine learning:",
        text: "Tahap awal wajib dalam setiap proyek data science."
      }
    ]
  },
  PandasAI: {
    name: "PandasAI",
    title: "PandasAI",
    roleTag: "AI Data Analysis",
    bullets: [
      {
        bold: "Analisis bahasa alami:",
        text: "Eksplorasi dataset menggunakan prompt teks dibantu AI."
      },
      {
        bold: "Insight generation kilat:",
        text: "Mempercepat pembersihan dan eksplorasi data secara instan."
      },
      {
        bold: "Standar data modern:",
        text: "Kombinasi logika koding Python dengan akselerasi generative AI."
      }
    ]
  },
  SQL: {
    name: "SQL",
    title: "SQL",
    roleTag: "Core Data Language",
    bullets: [
      {
        bold: "Bahasa wajib data:",
        text: "Standar mutlak ekstraksi, agregasi, dan filtering data bisnis."
      },
      {
        bold: "Tingkat lanjut (Advanced):",
        text: "Menguasai Window Functions dan CTE yang diuji saat interview."
      },
      {
        bold: "Praktik cloud warehouse:",
        text: "Dijalankan langsung pada Google BigQuery skala jutaan baris."
      }
    ]
  },
  "Meta Ads": {
    name: "Meta Ads",
    title: "Meta Ads",
    roleTag: "Paid Social",
    bullets: [
      {
        bold: "Targeting presisi:",
        text: "Menjangkau miliaran audiens Facebook & Instagram dengan AI targeting."
      },
      {
        bold: "Real budget iklan:",
        text: "Setiap siswa mengelola anggaran iklan riil langsung saat praktik."
      },
      {
        bold: "Strategi full-funnel:",
        text: "Optimasi dari awareness hingga konversi penjualan ber-ROAS tinggi."
      }
    ]
  },
  "Google Ads": {
    name: "Google Ads",
    title: "Google Ads",
    roleTag: "High-Intent Ads",
    bullets: [
      {
        bold: "Target audiens berniat beli:",
        text: "Menjangkau calon pembeli yang aktif mencari di Google."
      },
      {
        bold: "Ekosistem lengkap:",
        text: "Google Search, YouTube Ads, Display, hingga Performance Max."
      },
      {
        bold: "Efisiensi biaya:",
        text: "Optimasi Quality Score dan bidding cerdas untuk menekan CPC."
      }
    ]
  },
  "TikTok Ads": {
    name: "TikTok Ads",
    title: "TikTok Ads",
    roleTag: "Short-Form Video",
    bullets: [
      {
        bold: "Pertumbuhan tercepat:",
        text: "Channel akuisisi paling efektif untuk segmen Gen-Z & millenials."
      },
      {
        bold: "Integrasi TikTok Shop:",
        text: "Memahami struktur campaign untuk optimasi GMV toko online."
      },
      {
        bold: "Kreatif berbasis data:",
        text: "Melatih hook video dan A/B testing materi konten interaktif."
      }
    ]
  },
  GA4: {
    name: "GA4",
    title: "GA4",
    roleTag: "Web Analytics",
    bullets: [
      {
        bold: "Standar analitik global:",
        text: "Pelacakan user journey berbasis event di web & aplikasi."
      },
      {
        bold: "Prediksi berbasis AI:",
        text: "Metrik prediktif Google untuk strategi retensi dan konversi."
      },
      {
        bold: "Integrasi BigQuery:",
        text: "Ekspor data mentah langsung untuk analisis data mendalam."
      }
    ]
  },
  GTM: {
    name: "GTM",
    title: "GTM",
    roleTag: "Tag Management",
    bullets: [
      {
        bold: "Tracking mandiri:",
        text: "Pasang pixel dan event tracking tanpa perlu bantuan developer."
      },
      {
        bold: "Debugging presisi:",
        text: "Preview mode memastikan seluruh event tercatat 100% akurat."
      },
      {
        bold: "Eksekusi lincah:",
        text: "Marketer leluasa merilis tracking kampanye baru seketika."
      }
    ]
  },
  HackerRank: {
    name: "HackerRank",
    title: "HackerRank",
    roleTag: "Coding Assessment",
    bullets: [
      {
        bold: "Standar rekrutmen global:",
        text: "Platform ujian koding resmi yang dipakai unicorn untuk hiring."
      },
      {
        bold: "Asah computational thinking:",
        text: "Mengasah efisiensi algoritma dan penanganan edge cases."
      },
      {
        bold: "Portofolio terpercaya:",
        text: "Bukti valid kemampuan koding yang diakui hiring manager."
      }
    ]
  },
  Zapier: {
    name: "Zapier",
    title: "Zapier",
    roleTag: "No-Code Automation",
    bullets: [
      {
        bold: "Otomasi tanpa coding:",
        text: "Menghubungkan ratusan aplikasi kerja otomatis 24/7."
      },
      {
        bold: "Hemat jam kerja:",
        text: "Mengeliminasi pekerjaan manual repetitif di unit bisnis."
      },
      {
        bold: "Aset berharga:",
        text: "Mendongkrak efisiensi dan produktivitas tim operasional."
      }
    ]
  },
  Make: {
    name: "Make",
    title: "Make",
    roleTag: "Visual Automation",
    bullets: [
      {
        bold: "Alur visual kompleks:",
        text: "Membangun skenario multi-step dengan logika percabangan fleksibel."
      },
      {
        bold: "Integrasi Webhook & API:",
        text: "Menghubungkan database internal dengan layanan third-party."
      },
      {
        bold: "Standar startup & korporat:",
        text: "Otomasi alur leads, transaksi, dan pelaporan berkala."
      }
    ]
  }
};

interface ToolGlossaryTooltipProps {
  toolKey: string;
  children: React.ReactNode;
}

function ToolGlossaryTooltip({ toolKey, children }: ToolGlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const normalizedKey = useMemo(() => {
    const lower = toolKey.toLowerCase().trim();
    return Object.keys(TOOL_GLOSSARY_DATA).find(
      (k) => k.toLowerCase() === lower
    ) || toolKey;
  }, [toolKey]);

  const toolData = TOOL_GLOSSARY_DATA[normalizedKey];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!toolData) {
    return <>{children}</>;
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-block group/tool"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }
        }}
        className="underline decoration-dotted decoration-[#1F7A4D]/60 underline-offset-3 cursor-pointer font-semibold text-inherit hover:text-[#165836] hover:decoration-[#1F7A4D] transition-colors"
        title={`Info keunggulan ${toolData.name}`}
      >
        {children}
      </span>

      {/* Pop-up Box Minimalis */}
      {isOpen && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-[260px] sm:w-[280px] max-w-[calc(100vw-32px)] p-3 bg-white text-[#141412] rounded-xl border border-[#E8E8E4] shadow-md kiro-popover-animate block text-left pointer-events-auto after:content-[''] after:absolute after:top-full after:left-0 after:right-0 after:h-2"
          style={{
            boxShadow: "0 8px 24px -4px rgba(20, 20, 18, 0.12), 0 0 0 1px rgba(20, 20, 18, 0.04)"
          }}
        >
          {/* Header */}
          <span className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#F0F0EC] mb-2 block">
            <span className="font-display font-bold text-xs text-[#141412]">
              {toolData.title}
            </span>
            {toolData.roleTag && (
              <span className="font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#EBF7EE] text-[#1F7A4D] border border-[#D4EDDA] shrink-0">
                {toolData.roleTag}
              </span>
            )}
          </span>

          {/* Bullet Points Ringkas */}
          <span className="space-y-1.5 block text-[11px] leading-relaxed text-[#4B4B46]">
            {toolData.bullets.map((b, bIdx) => (
              <span key={bIdx} className="flex items-start gap-1.5 block">
                <span className="text-[#1F7A4D] shrink-0 select-none font-bold">•</span>
                <span className="block flex-1">
                  <strong className="font-semibold text-[#141412]">{b.bold}</strong>{" "}
                  {b.text}
                </span>
              </span>
            ))}
          </span>

          {/* Tooltip Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-6 border-transparent border-t-white" />
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-[#E8E8E4] -z-10" />
        </span>
      )}
    </span>
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderTextWithGlossary(text: string) {
  if (!text || typeof text !== "string") return text;

  // Sorted by length descending so multi-word terms match first
  const keys = Object.keys(TOOL_GLOSSARY_DATA).sort((a, b) => b.length - a.length);
  const escapedKeys = keys.map((k) => escapeRegex(k)).join("|");
  const pattern = new RegExp(`(^|[^a-zA-Z0-9_])(${escapedKeys})(?=[^a-zA-Z0-9_]|$)`, "gi");

  if (!pattern.test(text)) return text;
  pattern.lastIndex = 0;

  const tokens: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const prefix = match[1] || "";
    const matchedTool = match[2];
    const matchStart = match.index + prefix.length;
    const matchEnd = matchStart + matchedTool.length;

    if (matchStart > lastIndex) {
      tokens.push(text.slice(lastIndex, matchStart));
    }

    const officialKey = keys.find((k) => k.toLowerCase() === matchedTool.toLowerCase()) || matchedTool;

    tokens.push(
      <ToolGlossaryTooltip key={`${matchStart}-${officialKey}`} toolKey={officialKey}>
        {matchedTool}
      </ToolGlossaryTooltip>
    );

    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

function renderBoldText(text: string, enableGlossary: boolean = true) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-[#141412]">
          {enableGlossary ? renderTextWithGlossary(inner) : inner}
        </strong>
      );
    }
    return <React.Fragment key={i}>{enableGlossary ? renderTextWithGlossary(part) : part}</React.Fragment>;
  });
}

function renderComparisonCell(text: string, isRevou: boolean = false) {
  if (!text) return null;
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  if (lines.length <= 1) {
    return (
      <span className={`leading-relaxed text-xs sm:text-[13px] ${isRevou ? "font-semibold text-[#1F7A4D]" : "font-normal text-[#2A2A26]"}`}>
        {renderBoldText(text, isRevou)}
      </span>
    );
  }

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const isSubBullet = trimmed.startsWith("•") && (line.startsWith("    •") || line.startsWith("  •"));
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
        const cleanContent = isBullet ? trimmed.replace(/^[•\-]\s*/, "") : trimmed;

        if (isBullet) {
          return (
            <div key={idx} className={`flex items-start gap-1.5 ${isSubBullet ? "pl-3.5" : "pl-0.5"}`}>
              <span className={`shrink-0 select-none text-[12px] font-bold mt-0.5 ${isRevou ? "text-[#1F7A4D]" : "text-[#73736C]"}`}>
                •
              </span>
              <span className={`flex-1 ${isRevou ? "font-medium text-[#1F7A4D]" : "text-[#2A2A26]"}`}>
                {renderBoldText(cleanContent, isRevou)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className={`font-bold ${isRevou ? "text-[#165836]" : "text-[#141412]"}`}>
            {renderBoldText(trimmed, isRevou)}
          </p>
        );
      })}
    </div>
  );
}

interface AnimatedSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; badge?: string }[];
  placeholder?: string;
  buttonClassName?: string;
}

function AnimatedSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  buttonClassName = "",
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value && opt.value !== "");

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-w-0 flex items-center justify-between text-left transition-all duration-200 cursor-pointer select-none ${buttonClassName} ${isOpen ? "ring-2 ring-[#FFD84D]/60 border-[#FFD84D] shadow-xs" : ""
          }`}
        title={selectedOption ? selectedOption.label : placeholder}
      >
        <span className={`truncate min-w-0 mr-2 flex-1 block ${!selectedOption ? "text-[#73736C]" : "text-[#141412]"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#141412] stroke-[2.5] shrink-0 transition-transform duration-250 ease-out ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.94 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top center" }}
            className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[#141412] rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const isPlaceholder = opt.value === "";
              return (
                <button
                  key={opt.value || "__placeholder__"}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full min-w-0 text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${isPlaceholder
                    ? "text-[#73736C] hover:bg-[#F5F5F2] italic border-b border-[#E8E8E4] mb-0.5"
                    : isSelected
                      ? "bg-[#FFF6D1] text-[#141412] font-bold"
                      : "text-[#2A2A26] hover:bg-[#F5F5F2] font-medium"
                    }`}
                  title={opt.label}
                >
                  <span className="truncate min-w-0 flex-1">{opt.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {opt.badge && !isPlaceholder && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#EDEDEA] text-[#4B4B46]">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && !isPlaceholder && (
                      <Check className="w-3.5 h-3.5 text-[#A15C00] stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── FEATURE TOGGLES ──
// Set ke `true` jika tim AC ingin mengaktifkan kembali tab General Comparison (Level Institusi/Makro)
const SHOW_GENERAL_COMPARISON = false;

export default function ComparisonView() {
  const [activeTab, setActiveTab] = useState<"bootcamp" | "general" | "battlecards">("bootcamp");
  const [institutionViewMode, setInstitutionViewMode] = useState<"headToHead" | "allCompetitors">("headToHead");
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

  // Unique RevoU programs for this competitor
  const uniqueRevoUProgramsForComp = useMemo(() => {
    const seen = new Set<string>();
    const list: { program: string; badge: string; title: string; firstProgramId: string }[] = [];
    for (const prog of availableProgramsForSelectedComp) {
      if (!seen.has(prog.revouMatchProgram)) {
        seen.add(prog.revouMatchProgram);
        list.push({
          program: prog.revouMatchProgram,
          badge: prog.revouMatchBadge,
          title: `RevoU ${prog.revouMatchProgram}`,
          firstProgramId: prog.id
        });
      }
    }
    return list;
  }, [availableProgramsForSelectedComp]);

  const handleRevoUMatchChange = (programName: string) => {
    if (!programName) {
      setSelectedProgramId("");
      return;
    }
    const found = uniqueRevoUProgramsForComp.find((item) => item.program === programName);
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

  const competitorDisplayNames: Record<string, string> = {
    hacktiv8: "Hacktiv8",
    purwadhika: "Purwadhika",
    dibimbing: "Dibimbing",
    dqlab: "DQLab"
  };

  const competitorOptions = useMemo(() => [
    { value: "hacktiv8", label: "Hacktiv8" },
    { value: "purwadhika", label: "Purwadhika" },
    { value: "dibimbing", label: "Dibimbing" },
    { value: "dqlab", label: "DQLab" },
  ], []);

  const revouProgramOptions = useMemo(() => [
    { value: "", label: "— Pilih Program RevoU —" },
    ...uniqueRevoUProgramsForComp.map((p) => ({
      value: p.program,
      label: p.title,
      badge: p.badge,
    })),
  ], [uniqueRevoUProgramsForComp]);

  const compProgramOptions = useMemo(() => [
    { value: "", label: `— Pilih Program ${competitorDisplayNames[selectedCompetitorKey]} —` },
    ...availableProgramsForSelectedComp.map((prog) => ({
      value: prog.id,
      label: `${prog.programTitle} — [${prog.badge}]`,
      badge: prog.badge,
    })),
  ], [availableProgramsForSelectedComp, competitorDisplayNames, selectedCompetitorKey]);

  const activeBattlecard = BATTLECARDS.find((b) => b.id === selectedCompetitorKey) || BATTLECARDS[0];

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border-2 border-[#141412] rounded-xl p-4 sm:p-5 shadow-xs space-y-4 card-interactive"
      >

        {/* ── BARIS 1: LEMBAGA KAMI vs PILIH KOMPETITOR ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] gap-3 sm:gap-4 items-center">
          {/* Sisi Kiri: Lembaga kami */}
          <div className="min-w-0">
            <label className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
              <span>Lembaga kami</span>
              <span className="font-mono text-[10px] uppercase font-bold text-[#1F7A4D] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#D4EDDA]">
                Utama
              </span>
            </label>
            <div className="w-full min-w-0 flex items-center justify-between bg-[#F5F5F2] text-[#141412] font-display font-bold text-sm sm:text-base rounded-xl px-3.5 py-2.5 border border-[#E8E8E4] cursor-default select-none shadow-2xs">
              <span className="truncate">RevoU</span>
              <CheckCircle2 className="w-4 h-4 text-[#1F7A4D] shrink-0" />
            </div>
          </div>

          {/* Tengah: vs */}
          <div className="flex items-center justify-center pt-0 md:pt-5 shrink-0">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-[#73736C] select-none px-2.5 py-1 bg-[#F5F5F2] rounded-md border border-[#E8E8E4]">
              vs
            </span>
          </div>

          {/* Sisi Kanan: Pilih Kompetitor */}
          <div className="min-w-0">
            <label className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
              <span>Pilih Kompetitor</span>
              <span className="font-mono text-[10px] uppercase font-bold text-[#A15C00] bg-[#FFF6D1] px-2 py-0.5 rounded-full border border-[#FFD84D]/60 animate-pulse">
                Pilih
              </span>
            </label>
            <AnimatedSelect
              value={selectedCompetitorKey}
              onChange={(val) => handleCompetitorChange(val as any)}
              options={competitorOptions}
              buttonClassName="bg-[#EAEAE6] hover:bg-[#E0E0DC] text-[#141412] font-display font-bold text-sm sm:text-base rounded-xl px-3.5 py-2.5 border border-[#D4D4CE] hover:border-[#FFD84D] shadow-2xs"
            />
          </div>
        </div>

        {/* ── BARIS 2 (DI BAWAHNYA): PROGRAM KAMI vs PROGRAM KOMPETITOR ── */}
        <div className="pt-3.5 border-t border-[#E8E8E4]">
          {SHOW_GENERAL_COMPARISON && activeTab === "general" && (
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#EBF7EE] border border-[#D4EDDA] flex items-center gap-2 text-[11.5px] text-[#1F7A4D]">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#1F7A4D]" />
              <span>
                <strong>Mode Makro Lembaga:</strong> Tab Matriks Komparasi Lembaga langsung menampilkan standar institusi secara menyeluruh. Pilihan program di bawah ini digunakan saat Anda membuka tab <strong>Komparasi Spesifik Program</strong>.
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] gap-3 sm:gap-4 items-center">
            {/* Sisi Kiri: Program kami */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
                <span>Program kami</span>
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${activeProgramDetail ? "text-[#1F7A4D] bg-[#EBF7EE] border-[#D4EDDA]" : "text-[#A15C00] bg-[#FFF6D1] border-[#FFD84D]/60 animate-pulse"}`}>
                  {activeProgramDetail ? "Terpilih" : "Wajib Pilih"}
                </span>
              </label>
              <AnimatedSelect
                value={activeProgramDetail?.revouMatchProgram || ""}
                onChange={(val) => handleRevoUMatchChange(val)}
                options={revouProgramOptions}
                placeholder="— Pilih Program RevoU —"
                buttonClassName="bg-[#F5F5F2] hover:bg-[#EDEDEA] text-[#141412] font-display font-medium text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#D4D4CE] hover:border-[#FFD84D] shadow-2xs"
              />
            </div>

            {/* Tengah: vs */}
            <div className="flex items-center justify-center pt-0 md:pt-4 shrink-0">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#73736C] select-none px-2.5 py-1 bg-[#F5F5F2] rounded-md border border-[#E8E8E4]">
                vs
              </span>
            </div>

            {/* Sisi Kanan: Program kompetitor */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
                <span>Program {competitorDisplayNames[selectedCompetitorKey]}</span>
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${activeProgramDetail ? "text-[#1F7A4D] bg-[#EBF7EE] border-[#D4EDDA]" : "text-[#A15C00] bg-[#FFF6D1] border-[#FFD84D]/60 animate-pulse"}`}>
                  {activeProgramDetail ? "Terpilih" : "Wajib Pilih"}
                </span>
              </label>
              <AnimatedSelect
                value={selectedProgramId}
                onChange={(val) => setSelectedProgramId(val)}
                options={compProgramOptions}
                placeholder={`— Pilih Program ${competitorDisplayNames[selectedCompetitorKey]} —`}
                buttonClassName="bg-[#F5F5F2] hover:bg-[#EDEDEA] text-[#141412] font-display font-medium text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#D4D4CE] hover:border-[#FFD84D] shadow-2xs"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-NAVIGATION TABS (Komparasi Spesifik, Matriks Lembaga, Battlecard) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={`grid ${SHOW_GENERAL_COMPARISON ? "grid-cols-3" : "grid-cols-2"} gap-1 sm:gap-2 border-b-2 border-[#E8E8E4] -mb-[2px]`}>
        <button
          type="button"
          onClick={() => setActiveTab("bootcamp")}
          className={`group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0 ${activeTab === "bootcamp"
            ? "bg-[#F5F5F0] text-[#141412] border-[#FFD84D]"
            : "bg-transparent text-[#7A7A74] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            }`}
        >
          <Layers className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "bootcamp" ? "text-[#A15C00]" : "text-[#8A8A84]"}`} />
          <span className="truncate">Spesific Comparison</span>
        </button>

        {SHOW_GENERAL_COMPARISON && (
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0 ${activeTab === "general"
              ? "bg-[#F5F5F0] text-[#141412] border-[#1F7A4D]"
              : "bg-transparent text-[#7A7A74] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
              }`}
          >
            <Scale className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "general" ? "text-[#1F7A4D]" : "text-[#8A8A84]"}`} />
            <span className="truncate">General Comparison</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("battlecards")}
          className={`group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0 ${activeTab === "battlecards"
            ? "bg-[#F5F5F0] text-[#141412] border-[#B76E00]"
            : "bg-transparent text-[#7A7A74] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            }`}
        >
          <Award className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "battlecards" ? "text-[#B76E00]" : "text-[#8A8A84]"}`} />
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
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#141412] text-[#FFD84D]">
                  MIKRO · PROGRAM HEAD-TO-HEAD
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
                      MATCHING PROGRAM
                    </span>
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
                  </div>
                </motion.div>
              </motion.div>
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
                      <td className="p-3.5 sm:p-4 border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            {renderComparisonCell(row.revouValue, true)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 align-top leading-relaxed bg-[#FAFAF8]/60 text-xs sm:text-[13px]">
                        {renderComparisonCell(row.competitorValue, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── ACUAN VISUAL SILABUS & TECH STACK KOMPETITOR ── */}
            {activeProgramDetail.referenceImages && activeProgramDetail.referenceImages.length > 0 && (
              <div className="bg-[#FAFAF8] border border-[#E8E8E4] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E4] pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📸</span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-[#141412]">
                        Acuan Visual Silabus &amp; Stack ({activeProgramDetail.competitorName} {activeProgramDetail.programTitle})
                      </h4>
                    </div>
                    <p className="text-xs text-[#73736C]">
                      Daftar tools dan teknologi yang dipelajari pada tiap fase bootcamp sebagai acuan komparasi tim Admission
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF6D1] text-[#A15C00] border border-[#FFD84D] self-start sm:self-auto">
                    {activeProgramDetail.referenceImages.length} Fase Modul
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeProgramDetail.referenceImages.map((refImg, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E8E8E4] bg-white overflow-hidden flex flex-col shadow-2xs hover:shadow-sm hover:border-[#141412]/30 transition-all"
                    >
                      <div className="p-3 bg-[#F5F5F2]/70 border-b border-[#E8E8E4] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#141412] border border-[#E8E8E4]">
                            Fase {idx + 1}
                          </span>
                          <span className="font-mono text-[10px] font-medium text-[#73736C]">
                            {refImg.tools.length} Tools
                          </span>
                        </div>
                        <h5 className="font-display font-bold text-xs sm:text-[13px] text-[#141412]">
                          {refImg.title}
                        </h5>
                        {refImg.subtitle && (
                          <p className="text-[11px] text-[#73736C] leading-snug">
                            {refImg.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-white flex items-center justify-center min-h-[110px] max-h-[140px] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={refImg.url}
                          alt={refImg.title}
                          className="max-h-[100px] w-auto object-contain rounded transition-transform duration-200 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-2.5 mt-auto bg-[#FAFAF8] border-t border-[#E8E8E4] flex flex-wrap gap-1">
                        {refImg.tools.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white text-[#4B4B46] border border-[#E8E8E4]"
                          >
                            {renderTextWithGlossary(t)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <p>✓ 12 Minggu Virtual Internship mengerjakan real client & real budget/dataset (bukan sekadar tugas simulasi internal)</p>
                  <p>✓ Pendampingan Karir Intensif Career+ (1:1 Coaching sampai Hired)</p>
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
                Silakan pilih program pada dropdown di atas untuk melihat tabel komparasi detail head-to-head secara spesifik.
              </p>
            </div>
          </motion.div>
        ))}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TAB: MATRIKS KOMPARASI LEMBAGA (MAKRO EKOSISTEM BELAJAR)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {SHOW_GENERAL_COMPARISON && activeTab === "general" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {/* Header Info & View Mode Toggle */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E8E4] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1F7A4D] text-white">
                  MAKRO EKOSISTEM BELAJAR
                </span>
                <span className="font-mono text-xs bg-[#EBF7EE] text-[#1F7A4D] font-bold px-2.5 py-0.5 rounded-full border border-[#D4EDDA]">
                  Level Institusi
                </span>
                <span className="font-mono text-xs bg-[#F5F5F2] text-[#4B4B46] font-semibold px-2 py-0.5 rounded-md">
                  Data Terverifikasi Website Resmi Okt 2026
                </span>
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#141412] pt-1">
                Matriks Perbandingan Standar Mutu Lembaga
              </h3>
              <p className="text-xs text-[#60605B] max-w-[72ch] leading-relaxed">
                Perbandingan makro sistem pendidikan, support system belajar, jaminan refund, sertifikasi universitas, dan tingkat seleksi RevoU vs kompetitor.
              </p>
            </div>

            {/* Toggle Mode: Head-to-Head vs Semua Lembaga */}
            <div className="flex items-center gap-1 bg-[#F5F5F2] p-1 rounded-xl border border-[#E8E8E4] shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => setInstitutionViewMode("headToHead")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${institutionViewMode === "headToHead"
                  ? "bg-[#141412] text-[#FFD84D] shadow-2xs"
                  : "text-[#60605B] hover:text-[#141412]"
                  }`}
              >
                <span>RevoU vs {competitorDisplayNames[selectedCompetitorKey]}</span>
              </button>
              <button
                type="button"
                onClick={() => setInstitutionViewMode("allCompetitors")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${institutionViewMode === "allCompetitors"
                  ? "bg-[#141412] text-[#FFD84D] shadow-2xs"
                  : "text-[#60605B] hover:text-[#141412]"
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Semua Lembaga (Bird&apos;s-Eye)</span>
              </button>
            </div>
          </div>

          {/* ── TABEL MATRIKS ── */}
          {institutionViewMode === "headToHead" ? (
            /* Mode 1: Head-to-Head Lembaga (RevoU vs Selected Competitor) */
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/4 font-bold border-r border-white/10">
                      Parameter &amp; Standar Lembaga
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FEF08A]" />
                        <span>RevoU (Standar Mutu Utama)</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#2A2A26] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#FFD84D]" />
                        <span>{competitorDisplayNames[selectedCompetitorKey]} (Data Website Resmi)</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/5 font-semibold text-white/70">
                      Kursus Mandiri / Luar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E4]">
                  {GENERAL_COMPARISON_DATA.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${row.revouHighlight ? "bg-[#FFFDF5]/70 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50"}`}
                    >
                      <td className="p-3.5 sm:p-4 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top">
                        <div>
                          <span className="text-xs sm:text-[13px]">{row.feature}</span>
                          <span className="block font-mono text-[10px] text-[#8A8A84] font-normal uppercase mt-0.5">
                            {row.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#141412] font-medium border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            {renderComparisonCell(row.revou, true)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed font-normal bg-[#FAFAF8]/60 text-xs sm:text-[13px]">
                        {renderComparisonCell(row[selectedCompetitorKey] || row.general, false)}
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#8A8A84] align-top leading-relaxed text-xs">
                        {row.selfPaced}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Mode 2: Matriks Semua Lembaga (RevoU vs Hacktiv8 vs Purwadhika vs Dibimbing vs DQLab) */
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/6 font-bold border-r border-white/10 sticky left-0 bg-[#141412] z-10">
                      Parameter Lembaga
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/5 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#FEF08A]" />
                        <span>RevoU</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      Hacktiv8
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      Purwadhika
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      Dibimbing
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold bg-[#2A2A26] text-white">
                      DQLab
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E4]">
                  {GENERAL_COMPARISON_DATA.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${row.revouHighlight ? "bg-[#FFFDF5]/70 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50"}`}
                    >
                      <td className="p-3 sm:p-3.5 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top sticky left-0 bg-white z-10 shadow-2xs">
                        <span className="text-xs sm:text-[12.5px]">{row.feature}</span>
                        <span className="block font-mono text-[9.5px] text-[#8A8A84] font-normal uppercase mt-0.5">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] font-medium border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#1F7A4D] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            {renderComparisonCell(row.revou, true)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.hacktiv8, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.purwadhika, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.dibimbing, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.dqlab, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Catatan Verifikasi Data Kompetitor */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-xs text-[#60605B] leading-relaxed">
            <Info className="w-4 h-4 text-[#A15C00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#141412] font-semibold">Catatan Transparansi &amp; Validasi Data (Audit Website Resmi Okt 2026): </strong>
              Completion rate tidak dipublikasikan oleh satu pun kompetitor di halaman website resmi mereka (kandidat sumber sekunder: laporan CIRR Hacktiv8 PDF dan Outcomes Report Dibimbing). RevoU transparan mempublikasikan 93% completion rate resmi. Untuk perbandingan detail teknis kurikulum, biaya paket, dan modul per program, silakan buka tab <strong>Komparasi Spesifik Program</strong>.
            </div>
          </div>

          {/* ── 5 PILAR STANDAR KEUNGGULAN LEMBAGA REVOU (MAKRO SELLING POINTS) ── */}
          <div className="bg-white rounded-2xl border border-[#E8E8E4] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A15C00]" />
              <h4 className="font-display font-bold text-sm sm:text-base text-[#141412]">
                5 Pilar Standar Mutu Lembaga RevoU (Kunci Diferensiasi Makro AC)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                  <span>1. Seleksi Ketat (&lt;10% Penerimaan)</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed">
                  Menjamin peer group dan circle belajar yang memiliki komitmen tinggi, saling memotivasi, dan suportif hingga lulus.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                  <span>2. 100% Live Instruction Interaktif 5x/Minggu</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed">
                  Bukan menonton video rekaman mandiri. Setiap malam dipandu praktisi aktif industri dengan sesi tanya-jawab langsung dua arah.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                  <span>3. 12 Minggu Virtual Internship (Real Client &amp; Dataset)</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed">
                  Bukan sekadar tugas simulasi internal. Peserta memegang anggaran iklan jutaan rupiah riil atau menganalisis dataset bisnis riil perusahaan partner (Telkom OCA, Zurich, dll).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                  <span>4. Kemitraan Kampus Top (ITB, BINUS, UI)</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed">
                  Kredensial dan sertifikat resmi universitas teknik &amp; bisnis nomor satu di Indonesia yang diakui luas oleh para perekrut.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                  <span>5. Bimbingan Karir Intensif Career+</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed">
                  Pendampingan 1:1 Personal Career Coach selama 7-8 bulan, AI Career Engine untuk CV/LinkedIn, dan simulasi interview langsung bersama Hiring Manager hingga siap kerja.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
                    Rp 14.9jt – 22.5jt (FSDM: Rp 14.9jt – 17.9jt | FSDA: Rp 17.9jt – 20.9jt | FSSE: Rp 19.5jt – 22.5jt, opsi cicilan 3x–12x via kartu kredit/Danacita, tanpa biaya kos).
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
                      <span>{renderBoldText(win)}</span>
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

            {/* Catatan Verifikasi Data Kompetitor */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-xs text-[#60605B] leading-relaxed">
              <Info className="w-4 h-4 text-[#A15C00] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#141412] font-semibold">Catatan Data Website Resmi Kompetitor (Okt 2026): </strong>
                Completion rate tidak dipublikasikan oleh satu pun kompetitor di halaman website resmi mereka (kandidat sumber sekunder: laporan CIRR Hacktiv8 PDF dan Outcomes Report Dibimbing). Parameter spesifik program seperti biaya, jadwal, dan kurikulum disinkronkan otomatis sesuai pilihan.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
