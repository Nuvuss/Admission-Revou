"use client";

import React, { useState, useMemo, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
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
  ArrowRight,
  MessageSquare
} from "lucide-react";

export interface CompetitorBattlecard {
  id: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  format: string;
  curriculum?: string;
  tools?: string[];
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
    curriculum: "Kurikulum coding murni JavaScript stack (Node.js, Express, React/React Native) & Golang terfokus dengan AI-Powered development.",
    tools: ["JavaScript","Node.js","Express","React","Next.js","TypeScript","Golang","PostgreSQL","Docker","OpenAI","Cursor"],
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
    curriculum: "Kurikulum multi-disiplin (Web, Data, DM, UI/UX, AI Boost) dengan capstone project bertahap di tiap modul.",
    tools: ["React.js","Node.js","Python","Tableau","Meta Ads","Google Ads","Zapier","Make","n8n","Figma","ChatGPT"],
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
    tagline: "Opsi budget-friendly & pilihan 8 program Tech (Data, AI, Web Dev, DevOps, QA) dengan benefit gratis mengulang batch",
    price: "Bayar Hari Ini atau Cicilan (harga di-render dinamis via JS / estimasi promo Rp 7jt – Rp 15jt via WA Admission 081227741541). Benefit gratis mengulang batch seumur hidup (non-refundable).",
    duration: "Pre-bootcamp mandiri + 24 minggu bootcamp + 2 minggu post-bootcamp + 4 minggu Job Connect (total ±7–7,5 bulan). Frekuensi 2–3 sesi per minggu (weekday atau weekend). Catatan: meta-description FE & QA menyebut 5 bulan.",
    format: "Online (seluruh 8 program) · Offline Jakarta (baru di Data Analytics Batch 3 & Full-Stack Batch 1) · Private Session (Full-Stack).",
    curriculum: "Kurikulum 8 trek teknologi (DA, DS, DE, FE, BE, QA, DevOps, AI) berbasis modul LMS dan tugas kelompok mingguan.",
    tools: ["SQL","Python","Tableau","React.js","Node.js","Figma","DevOps Tools","QA Automation","LMS Portal"],
    careerSupport: "Job Connect 4 minggu (konsultasi 1-on-1, review CV & LinkedIn, latihan interview, Talent Showcase ke 1.100+ hiring partner; meta QA: 700+; klaim 96% alumni dapat kerja). FAQ AI Engineering membedakan Job Connect vs Job Connect Plus.",
    certification: "Sertifikat Kelulusan Dibimbing, Diakui Kemendikti; 4.96/5 SwitchUp (Back-End: 4.9/5), 4.81 Course Report; 10K+ alumni (Back-End: 4K+); Forbes 30 Under 30 Asia 2025.",
    honestStrength: "Pilihan 8 program spesifik tech (Data Engineering, DA, AI, FE, DevOps Batch 1, QA Batch 4, BE, Full-Stack) dengan tools mutakhir (termasuk LangChain, Groq, PgVector), opsi offline Jakarta di program tertentu, dan benefit gratis mengulang batch seumur hidup.",
    revouWins: [
      "Kedalaman kurikulum & jam terbang 100% LIVE interaktif harian (4-5 sesi live/minggu, 210+ jam live coding vs 2-3 sesi/minggu dominan video LMS).",
      "Kurikulum terdepan: FSDA 8 modul + Apache Airflow & Automated ETL, FSSE 4 fase AI-native bersama AWS Cloud, RevoU x ITB diajar Head of Data Science XLSMART & Dosen FTI ITB.",
      "12 Minggu Virtual Internship: Portofolio mandiri mengolah real dataset korporasi mitra (Telkom OCA, Zurich) atau mendeploy software riil (bukan sekadar tugas akhir portofolio).",
      "Kemitraan kampus bergengsi: Kredensial resmi ITB, BINUS x AWS, dan UI dengan transfer SKS Magister & kredibilitas akademis jauh lebih tinggi dibanding sertifikat kursus internal.",
      "Standar seleksi ketat menjamin circle belajar ambisius dan suportif (tingkat penerimaan <10%)."
    ],
    proofPoint: "15.000+ alumni RevoU di 1.000+ top company (Gojek, Tokopedia, Traveloka, Shopee, Big 4, BUMN). Completion rate Dibimbing tidak dipublikasi resmi di web. RevoU transparan mempublikasikan 93% completion rate resmi.",
    acScriptTemplate: "Dibimbing pilihan yang bagus kak kalau kakak mencari opsi belajar santai 2-3 sesi per minggu via video rekaman LMS dengan benefit gratis mengulang batch seumur hidup. Namun kalau tujuan kakak adalah career switch total di tech company papan atas, RevoU memberikan 100% live class interaktif setiap hari, bimbingan karir 1-on-1 intensif selama 7-8 bulan, 12 minggu Virtual Internship portofolio riil bersama korporasi mitra, dan pendampingan karir intensif Career+ sampai dapat kerja. Boleh tau tujuan utama kakak ambil program ini apakah untuk eksplorasi dasar atau persiapan karir jangka panjang kak? :)"
  },
  {
    id: "dqlab",
    name: "DQLab",
    tagline: "Kursus kilat live Zoom modular, persiapan sertifikasi resmi BNSP & Pearson VUE dengan budget ekonomis",
    price: "Rp 699.000 – Rp 3.800.000 (Bootcamp Single Rp 699rb–2,5jt; Ujian Sertifikasi BNSP/Pearson VUE Rp 1,68jt–2,8jt; Bundle Program Rp 1,2jt–3,8jt).",
    duration: "10 – 17 sesi singkat (durasi 1,5 – 2,5 bulan), jadwal 2x seminggu malam (19:00–21:30 WIB) atau weekend.",
    format: "Bootcamp live class virtual + belajar mandiri via modul.",
    curriculum: "Kurikulum modular data sintaks (Python, R, SQL, Excel) metode HERO berfokus latihan soal dan modul koding mandiri.",
    tools: ["Python","R","SQL","Microsoft Excel","Power BI","Google Data Studio","ChatGPT Integration"],
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
  },
  {
    id: "rework",
    name: "Rework Academy",
    tagline: "Bootcamp AI, Cyber Security, dan Data dengan opsi After-Work & cicilan 4x, namun Career Support & magang di-unbundle (dijual terpisah di paket Career Accelerator)",
    price: "Normal Rp 10.000.000 (Earlybird/Final Seat Rp 1.999.900 – Rp 2.499.900). Cicilan 0% hingga 4x (mulai Rp 500rb - 625rb/bulan). Paket Career Accelerator (magang & 1:1 career) dijual terpisah.",
    duration: "12 minggu (20+ sesi live Zoom, 2x seminggu malam 19:30–22:00 WIB, ~5 jam live/minggu).",
    format: "100% Online via Zoom (after-work class) + rekaman lifetime.",
    curriculum: "Kurikulum korporat spesifik Cyber Security (SOC Analyst, ISO 27001), AI Engineering, dan Data Analytics berbasis enterprise use cases.",
    tools: ["Burp Suite","Nmap","Wireshark","Wazuh SIEM","Python","PyTorch","LangChain","LangGraph","Docker","GCP"],
    careerSupport: "TIDAK ADA di paket Professional Bootcamp. Mentoring karir 1-on-1 dan magang 1-3 bulan dialihkan ke paket Career Accelerator Bootcamp terpisah.",
    certification: "Official Certificate Rework Academy (PT. Tempat Bertumbuh Indonesia), Rapor & Cyber Security Badge (tanpa kemitraan kampus).",
    honestStrength: "Biaya masuk terjangkau (Rp 2jt-an saat diskon) dengan materi tech modern (RAG, LangGraph, Docker, Burp Suite) bagi yang ingin eksplorasi teknis mandiri tanpa butuh fasilitas karir.",
    revouWins: [
      "All-In Career Support: Pendampingan karir intensif Career+ (1:1 Personal Career Coach, AI Career Engine, dan Mock Interview) sudah termasuk tanpa biaya tambahan terpisah.",
      "12 Minggu Virtual Internship: Portofolio nyata bersama korporasi mitra skala enterprise (Telkom OCA, Zurich), bukan sekadar dataset simulasi.",
      "Kemitraan Resmi Universitas Top: Sertifikasi dan transfer SKS perguruan tinggi bergengsi (#1 ITB, BINUS x AWS, UI) dengan kredibilitas tinggi di mata recruiter.",
      "Jam terbang live jauh lebih intensif: 4-5 sesi live interaktif setiap minggu (210+ jam live) vs Rework yang hanya 2 sesi per minggu (20+ sesi total)."
    ],
    proofPoint: "15.000+ alumni RevoU di 1.000+ top company. Rework tidak mempublikasikan data outcome penempatan kerja resmi di web. Di RevoU, transparansi 93% completion rate dan program 12 minggu Virtual Internship terbukti melipatgandakan peluang hired.",
    acScriptTemplate: "Rework Academy itu opsi yang menarik kak kalau kakak mencari kelas malam 2x seminggu dengan budget 2 jutaan untuk belajar tools teknis mandiri. Tapi penting dicatat, di paket 2 jutaan tersebut belum termasuk bimbingan karir 1-on-1 maupun magang (mereka jual terpisah di paket Career Accelerator). Kalau di RevoU, programnya sudah All-In: 7-8 bulan intensif dengan 12 minggu Virtual Internship menangani problem bisnis riil korporasi, sertifikasi resmi kampus top (ITB/BINUS/UI), dan didampingi Career Coach 1-on-1 sampai kakak dapat kerja. Kakak orientasinya untuk sekadar coba tools dasar dulu atau persiapan switch career sampai tembus kerja kak? :)"
  },
  {
    id: "tempatbelajar",
    name: "TempatBelajar",
    tagline: "Struktur 2 Tier: Professional (3 bln, tanpa bimbingan karir/magang, Rp 3,5jt–4jt) vs Career Accelerator (4 bln, 2 project, 6 mgg 1:1 HR, magang remote 1-3 bln, Rp 7jt–10jt)",
    price: "• Tier Career Accelerator (DM & HR): Normal Rp 30jt | Earlybird Rp 6.999.900 (hemat 76%) | Reguler Rp 8.999.900 – Rp 9.999.900.\n• Tier Professional (DM & HR): Normal Rp 20jt | Earlybird Rp 3.499.900 – Rp 3.999.900 | 2nd Wave Rp 4.999.900 – Rp 5.999.900.\n• Cicilan: 2–4x pembayaran bunga 0% via WhatsApp admisi 081382423135.\n• Budget Project: DM include budget iklan UMKM s.d. Rp 1.000.000 (Career Accelerator) atau Rp 700rb (Professional).",
    duration: "Career Accelerator: 4 bulan (16 minggu: 8 mgg intensive learning + 8 mgg 2 project). Professional: 3 bulan (12 minggu: 8 mgg learning + 4 mgg 1 project). Jadwal live 2x/minggu malam (19:30–21:30 WIB) + video modul.",
    format: "Full Online (Live Zoom 2x seminggu + pre-recorded videos).",
    curriculum: "Kurikulum staf operasional Digital Marketing (18 lesson, Meta/Google/TikTok ads) dan Human Resource (17 lesson, payroll PPh 21, UU ketenagakerjaan, demo Gajihub).",
    tools: ["Meta Ads","TikTok Ads (GMV Max)","Google Ads","ManyChat","WordPress","Elementor","Demo Gajihub","Gaji.id","GA4","Gemini"],
    careerSupport: "• Career Accelerator: 6 minggu mentoring 1-on-1 dengan mentor HR/praktisi + penyaluran magang remote (WFH) 1-3 bulan di agency/perusahaan mitra.\n• Professional: TIDAK ADA mentoring 1-on-1 maupun penyaluran magang.",
    certification: "Sertifikat PT. Tempat Berkarya Indonesia, rapor penilaian, dan keterangan kompetensi (tanpa kemitraan kampus).",
    honestStrength: "Menyediakan jalur Career Accelerator dengan 2 project nyata (termasuk budget ads UMKM Rp 1jt di DM dan demo HRIS Gajihub di HR) serta magang remote 1-3 bulan seharga Rp 7jt-an promo.",
    revouWins: [
      "Skala Portofolio Enterprise: RevoU Virtual Internship menangani campaign brand korporat besar dengan real budget jutaan rupiah (FSDM) atau 7 portofolio strategis C-level (Strategic HR), bukan sekadar UMKM mikro budget 1jt.",
      "Jam Terbang 100% Live: RevoU 5x seminggu live interaktif harian (FSDM) vs TempatBelajar yang hanya 2x seminggu (Sen & Kam) dominan rekaman video mandiri.",
      "Durasi Pendampingan Karir: Career+ RevoU mendampingi 7-8 bulan penuh bersama Personal Career Coach 1-on-1 & AI Career Engine sampai dapat kerja (vs 6 minggu di TempatBelajar).",
      "Kredensial Universitas Ternama: Sertifikasi resmi ITB, BINUS x AWS, dan UI dengan transfer SKS Magister.",
      "Jaringan Alumni Unicorn: 15.000+ alumni RevoU di top company (Gojek, Tokopedia, Traveloka, Shopee, Big 4) vs 2.300-an alumni TempatBelajar."
    ],
    proofPoint: "2.327+ alumni TempatBelajar. RevoU memiliki 15.000+ alumni terbukti berkarir di 1.000+ top companies dengan rata-rata kenaikan gaji hingga 120% dan 93% completion rate resmi.",
    acScriptTemplate: "TempatBelajar punya 2 tier kak: versi Professional 3 bulan (Rp 3,5jt–4jt) tapi belum ada bimbingan karir 1-on-1 maupun magang, dan versi Career Accelerator 4 bulan (Rp 7jt–10jt) yang ada magang remote dan budget iklan UMKM 1 juta. Nah, kalau di RevoU FSDM, program kita sudah all-in 7 bulan: 12 minggu Virtual Internship memegang brand enterprise besar dengan real budget jutaan rupiah, 100% live class setiap hari (bukan 2x seminggu), dan pendampingan 1:1 Career Coach selama 7-8 bulan sampai dapat kerja. Begitu juga kalau kakak tertarik di bidang HR, RevoU Strategic HR with AI melatih kakak di level strategis HRBP & People Strategy C-level dengan AI workflows harian. Kakak lebih memprioritaskan portofolio UMKM kecil atau pengalaman menangani bisnis skala besar kak? :)"
  },
  {
    id: "dicoding",
    name: "Dicoding",
    tagline: "Platform belajar coding & data science mandiri (self-paced) berbasis teks & kurikulum terstruktur Google Cloud / Kemendikbud",
    price: "Normal Rp 14.000.000 (Promo diskon 60% Bayar Penuh Rp 5.040.000; Cicil 3x Rp 5.320.000; Cicil 5x Rp 5.600.000).",
    duration: "20 minggu (±5 bulan), self-paced learning dengan target 5–6 jam/hari. Hanya 10+ sesi tatap muka online bersama praktisi selama 5 bulan.",
    format: "Online Self-paced (LMS teks & quiz) + hanya 10+ sesi live class online bersama praktisi.",
    curriculum: "Kurikulum terakreditasi Google Authorized Developer (Web Front-End, Android, Data Science, Machine Learning) berbasis modul interaktif dan code review 1-on-1.",
    tools: ["React.js","Python","Django","JavaScript ES6+","GCP (Google Cloud)","Postman","PostgreSQL","Google Colab","Git"],
    careerSupport: "Sesi career preparation 2 jam di akhir program, screening awal hiring partners hanya untuk lulusan terbaik, Capstone project dipresentasikan ke hiring partner.",
    certification: "Sertifikat Kelulusan Dicoding Akademi (Google Authorized Training Partner).",
    honestStrength: "Materi belajar mandiri berbasis teks/modul sangat rapi, sistematis, dan terstandarisasi untuk pembelajar otodidak yang sangat disiplin membaca.",
    revouWins: [
      "100% LIVE Instruction Harian: 4-5 sesi live interaktif tiap minggu (210+ jam live) vs Dicoding yang hanya 10+ sesi tatap muka selama 20 minggu (rata-rata 1 sesi per 2 minggu).",
      "Pendampingan Personal & Accountability: Tidak dibiarkan belajar sendiri membaca modul; didampingi Section Manager, Team Lead, Mentor harian.",
      "12 Minggu Virtual Internship dengan Real Corporate Partner vs Capstone simulasi Dicoding.",
      "Career+ 1:1 Coaching menyeluruh ke semua siswa yang eligible (bukan hanya screening untuk lulusan terbaik)."
    ],
    proofPoint: "2.800+ alumni Dicoding berkarir vs 15.000+ alumni RevoU di top company. RevoU menjamin bimbingan 100% live interaktif harian agar siswa tidak putus di tengah jalan karena jenuh membaca modul mandiri.",
    acScriptTemplate: "Dicoding itu platform yang luar biasa bagus kalau kakak tipe pembelajar mandiri yang disiplin membaca modul teks 5-6 jam setiap hari, karena sesi live interaktifnya hanya sekitar 10 sesi dalam 5 bulan. Nah, kendala terbesar banyak orang saat belajar koding/data otodidak adalah rasa jenuh dan bingung saat stuck. Di RevoU, format kita 100% live interaktif setiap hari (210+ jam live), ada Section Manager & Mentor yang mendampingi harian, 12 minggu Virtual Internship dengan korporasi nyata, dan Career Coach 1-on-1 sampai dapat kerja. Kakak lebih cocok tipe belajar mandiri membaca modul atau interaktif live setiap hari kak? :)"
  },
  {
    id: "myskill",
    name: "MySkill",
    tagline: "Kursus kilat pengenalan dasar (3–7 minggu) dengan harga terjangkau (Rp 230k–650k), namun final project kelompok berbayar terpisah",
    price: "Rp 230.000 – Rp 650.000 (Late Sale Rp 1.000.000 – Rp 1.100.000). Catatan: Final project tim opsional dengan biaya tambahan terpisah.",
    duration: "5 – 7 minggu (8 – 18 sesi live class, 2-3x seminggu malam 19:30–21:30 WIB).",
    format: "100% Online Live Class Zoom + rekaman.",
    curriculum: "Kurikulum intensive pengenalan cepat 4-8 minggu di Data Analytics, Digital Marketing, dan AI coding (Lovable AI) didukung ratusan video e-learning rekaman.",
    tools: ["PostgreSQL","Python (NumPy, Pandas)","Google Data Studio","Meta Ads","Lovable AI","Canva","Microsoft Excel"],
    careerSupport: "1 sesi Career Class (review HR CV & interview) + template CV/surat lamaran ID/EN. Tanpa pendampingan 1-on-1 intensif.",
    certification: "e-Certificate MySkill (PT. Linimuda Inspirasi Negeri).",
    honestStrength: "Harga tiket masuk sangat murah dan terjangkau untuk mahasiswa atau pemula yang sekadar ingin mencicipi materi dasar (overview) dalam hitungan minggu.",
    revouWins: [
      "Job-Ready Career Transformation: RevoU melatih dari nol hingga level profesional siap kerja selama 7 bulan, bukan kursus kilat permukaan 5-7 minggu.",
      "Transparansi Tanpa Biaya Tersembunyi: Final project & Virtual Internship sudah all-in (MySkill memungut biaya tambahan jika ingin ikut final project).",
      "1:1 Career Coach Intensif: Didampingi personal coach selama 7 bulan vs 1 sesi webinar sharing class.",
      "Kredensial Kampus Bergengsi: Sertifikat resmi ITB, BINUS, dan UI yang diakui recruiter unicorn.",
    ],
    proofPoint: "15.000+ alumni RevoU tembus di Gojek, Shopee, Traveloka, Tokopedia, Big 4, BUMN. MySkill berfokus pada volume ratusan ribu peserta kursus kilat. RevoU fokus pada kualitas lulusan dengan 93% completion rate dan pendampingan kerja riil.",
    acScriptTemplate: "MySkill itu pilihan yang bagus banget kak kalau kakak baru mau coba-coba pengenalan dasar selama 1-2 bulan dengan budget ratusan ribu. Namun untuk bisa tembus kerja profesional di top company, perusahaan butuh kandidat dengan jam terbang tinggi dan portfolio bisnis nyata. Di program kilat, materinya baru level surface-level dan untuk final project bahkan ada biaya tambahan. Di RevoU, kakak belajar 7 bulan intensif, memegang proyek nyata 12 minggu Virtual Internship tanpa biaya tersembunyi, dan didampingi Career Coach 1-on-1 sampai dapat kerja. Kakak saat ini butuh pengenalan dasar atau persiapan karir serius sampai kerja kak? :)"
  },
  {
    id: "fullstackbangalore",
    name: "Full Stack Bangalore",
    tagline: "Workshop pengenalan tools tech/data instan 3–4 minggu seharga Rp 149.000 dengan mentor anonim",
    price: "Promo Rp 149.000 (Normal Rp 599.000). Pendaftaran via Lynk.id.",
    duration: "3 – 4 minggu (5 – 10 sesi live, weekday malam + weekend).",
    format: "Live Zoom + Rekaman.",
    curriculum: "Kurikulum hands-on tools terkini: Data Engineering (dbt, Kafka, Airflow), AI & Prompt (LangChain, RAG), dan n8n Automation workflow.",
    tools: ["SQL","Python","Power BI","Apache Airflow","dbt","Apache Kafka","Streamlit","n8n Automation","Meta Ads"],
    careerSupport: "Free kelas career preparation (webinar/materi). Tanpa 1-on-1 coaching atau jaminan/penyaluran karir.",
    certification: "Sertifikat Full Stack Bangalore (tanpa akreditasi kampus/BNSP).",
    honestStrength: "Sangat murah (seharga makan siang Rp 149rb) untuk melihat demonstrasi tools (PowerBI, n8n, Streamlit, Meta Ads) secara ringkas.",
    revouWins: [
      "Kurikulum Industri Mendalam: 210+ jam live harian vs 10 sesi kilat.",
      "Instruktur Terverifikasi & Transparan: Di RevoU semua pengajar adalah lead/head terverifikasi dari tech unicorns & multinasional (FSB tidak mencantumkan nama instruktur).",
      "12 Minggu Virtual Internship & Career+ 1:1 vs mini project demo.",
      "Kredibilitas Akademik Resmi (#1 ITB, BINUS x AWS, UI)."
    ],
    proofPoint: "550.000+ komunitas pembelajar RevoU & 15.000+ alumni. RevoU menjamin akuntabilitas pengajaran dan standar seleksi ketat (<10% acceptance rate).",
    acScriptTemplate: "Full Stack Bangalore itu opsi yang terjangkau banget kak kalau kakak sekadar ingin lihat demo pengenalan tools seperti PowerBI atau n8n seharga 149 ribu. Namun kelas 4 minggu dengan 10 sesi itu adalah workshop pengenalan singkat. Untuk switch career ke tech company, recruiter mencari pemahaman bisnis menyeluruh, data storytelling, dan portfolio nyata. Di RevoU, kakak belajar 7 bulan intensif dari nol, diajar langsung praktisi top company yang terverifikasi, ada 12 minggu Virtual Internship, dan bimbingan karir 1-on-1 sampai dapat kerja. Kakak mencari pengenalan tools singkat atau persiapan switch career menyeluruh kak? :)"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA DETAIL PER PROGRAM DENGAN BARIS KOMPARASI SPESIFIK UNTUK TABEL
// ─────────────────────────────────────────────────────────────────────────────
export type CompetitorId =
  | "hacktiv8"
  | "purwadhika"
  | "dibimbing"
  | "dqlab"
  | "rework"
  | "tempatbelajar"
  | "dicoding"
  | "myskill"
  | "fullstackbangalore";

export interface ProgramComparisonTableRow {
  parameter: string;
  categoryTag: string;
  revouValue: string;
  competitorValue: string;
  highlight?: boolean;
}

export interface CompetitorProgramItem {
  id: string;
  competitorId: CompetitorId;
  competitorName: string;
  programTitle: string;
  badge: string;
  revouMatchProgram: string;
  revouMatchBadge: "FSDM" | "FSDA" | "FSSE" | "ITB" | "BINUS" | "UI" | "Joint AI" | "RevoU All-In" | "Strategic HR";
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

const COMPETITOR_PROGRAMS_BY_VENDOR: Record<CompetitorId, CompetitorProgramItem[]> = {
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
          competitorValue: "Backend Golang & Fondasi Web: Dasar Web (HTML, CSS), Query Database Relasional (SQL / PostgreSQL), Go fundamentals (Goroutine/Channel), REST API Gin/Echo, NoSQL, Load Testing Grafana k6, Microservices gRPC, Docker, K8s, serta Cloud Deployment via Railway — fokus backend & basis data tanpa penguasaan framework frontend web modern (Next.js/React).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Modul Utama",
          categoryTag: "KURIKULUM",
          revouValue: "Kurikulum Full Stack AI-Native (Frontend + Backend + Cloud):\n• Phase 1 - Algorithm: Dasar logika komputasional, flowchart, data structures, & tantangan HackerRank.\n• Phase 2 - Backend Skalabel: Python, Flask REST API, PostgreSQL database modeling, & automated backend testing.\n• Phase 3 - Modern Frontend: Next.js App Router, TypeScript, React component lifecycle, & Playwright E2E testing.\n• Phase 4 - AI Engineering & Cloud DevOps: Kiro Spec Mode, Claude AI agent, Locust load testing, Docker, & AWS Cloud deployment.\n• Virtual Internship (3 Bulan): Proyek software skala enterprise bersama partner korporasi nyata.",
          competitorValue: "Spesialisasi Arsitektur Backend Microservices Golang:\n• Web Basics & Go Fundamentals: Dasar web HTML & CSS, syntax dasar Go, pointer, struct, interface, data structures, concurrency (Goroutine & Channel).\n• Databases Architecture & SQL: Query database SQL relasional, PostgreSQL & NoSQL database, connection pooling, & query tuning.\n• RESTful API Development: Framework Gin / Echo, middleware handling, JWT authentication, & validation.\n• Microservices Architecture: Komunikasi antar service via gRPC protocol & Protocol Buffers (protobuf).\n• Testing, DevOps & Cloud: Load testing Grafana k6, containerisasi Docker, Kubernetes (K8s), & deployment Railway.",
          highlight: true
        },
        {
          parameter: "Database, Testing & Cloud Tooling",
          categoryTag: "DATABASE & DEVOPS",
          revouValue: "PostgreSQL RDBMS design, 3-layer automated testing (pytest unit test, Locust performance/stress test, Playwright E2E), AI engineering dengan Kiro spec mode & Claude, serta Cloud Infrastructure bersama Amazon Web Services (AWS) Partner & Vercel/Railway.",
          competitorValue: "SQL & Relational Database (PostgreSQL) serta NoSQL database, performance load testing menggunakan Grafana k6, containerisasi Docker & Kubernetes (K8s), serta cloud deployment ke Railway.",
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
      competitorLimitation: "Meskipun mencakup fondasi HTML, CSS, dan SQL, fokus kurikulum tetap sangat spesifik pada backend Golang dengan PostgreSQL, NoSQL, Grafana k6, dan deployment Railway tanpa penguasaan framework frontend web modern (Next.js/React), sehingga fleksibilitas peluang kerja bagi pemula/career switcher lebih terbatas dibanding Full Stack.",
      revouEdge: "RevoU FSSE melatih Full Stack AI-Native (Next.js/TypeScript + Python/Flask/PostgreSQL + AWS) yang mencakup 3-layer testing (Playwright & Locust) dan deployment, lengkap dengan 3 bulan Virtual Internship riil.",
      acTalkingPoint: "Golang di Hacktiv8 sangat bagus jika kakak sudah pasti ingin berkarir spesifik di backend microservices dan sudah dibekali dasar HTML, CSS, serta SQL PostgreSQL. Namun bagi pemula atau career switcher, lowongan kerja Software Engineer terbesar di Indonesia mencari Full Stack (Next.js + Python/Flask). Di RevoU FSSE kakak belajar end-to-end frontend dan backend lengkap dengan portofolio riil Virtual Internship dan kemitraan resmi AWS.",
      referenceImages: [
        {
          url: "/images/hacktiv8/h8-golang-stack-web-db.png",
          title: "Fondasi Web & Database: HTML, CSS & SQL",
          subtitle: "Fondasi antarmuka web (HTML5, CSS3) serta manajemen dan kueri basis data relasional (SQL)",
          tools: ["HTML", "CSS", "SQL", "PostgreSQL", "Go"]
        }
      ]
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
          competitorValue: "Fokus Teknis Koding, Machine Learning, Deep Learning & Big Data:\n• Fase 1 - Data Wrangling, Scraping & Visualisasi: Python, Pandas, NumPy, PostgreSQL, Web Scraping BeautifulSoup, Git/GitHub, Visualisasi Seaborn & Tableau.\n• Fase 2 - Applied Machine Learning & Deployment: Scikit-Learn, SciPy, Interactive Web App Streamlit, & Pre-trained NLP Models Hugging Face.\n• Fase 3 - Deep Learning, Big Data & MLOps Pipeline: Deep Learning TensorFlow, Big Data Apache Spark, Elasticsearch, Data Quality Great Expectations, Workflow Apache Airflow, Container Docker, & Cloud AWS.",
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
      acTalkingPoint: "Hacktiv8 DS&ML mewajibkan waktu seharian dari pagi sampai jam 6 sore kak. Kalau di RevoU FSDA, kelas berlangsung malam hari 19.00–21.00 WIB Senin–Kamis (+ Review Sabtu opsional), jadi kakak tidak perlu resign kerja. Di RevoU juga fokus melatih cara mempresentasikan data ke bos dan manajemen bisnis, ada modul Apache Airflow ETL terbaru, 12 minggu Virtual Internship menganalisis real dataset bisnis mitra, dan didampingi Career Coach 1-on-1 sampai dapat kerja.",
      referenceImages: [
        {
          url: "/images/hacktiv8/h8-dsml-stack-phase1.png",
          title: "Fase 1: Data Analytics, Scraping & Visualisasi",
          subtitle: "Fondasi pemrograman Python, manipulasi data Pandas & NumPy, web scraping BeautifulSoup, database PostgreSQL, visualisasi Seaborn & Tableau, serta Git/GitHub",
          tools: ["Python", "Pandas", "NumPy", "PostgreSQL", "BeautifulSoup", "Seaborn", "Tableau", "GitHub"]
        },
        {
          url: "/images/hacktiv8/h8-dsml-stack-phase2.png",
          title: "Fase 2: Classical Machine Learning & Model Deployment",
          subtitle: "Pemodelan algoritma Scikit-Learn, komputasi sains SciPy, pembuatan interactive web app Streamlit, dan integrasi pre-trained model Hugging Face",
          tools: ["scikit-learn", "SciPy", "Streamlit", "Hugging Face", "Machine Learning"]
        },
        {
          url: "/images/hacktiv8/h8-dsml-stack-phase3.png",
          title: "Fase 3: Deep Learning, Big Data & MLOps Pipeline",
          subtitle: "Deep learning neural network TensorFlow, distributed computing Apache Spark, Elasticsearch, data quality Great Expectations, orkestrasi Airflow, Docker, dan deployment AWS",
          tools: ["TensorFlow", "Apache Spark", "Elasticsearch", "Great Expectations", "Apache Airflow", "Docker", "AWS"]
        }
      ]
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
          competitorValue: "Kurikulum 3 Fase Teknis:\n• Fase 1: Python, Pandas, NumPy, PostgreSQL, BeautifulSoup, Seaborn, Tableau, GitHub.\n• Fase 2: Scikit-Learn ML, SciPy, Streamlit App, Hugging Face.\n• Fase 3: Deep Learning TensorFlow, Apache Spark, Elasticsearch, Great Expectations, Apache Airflow, Docker, AWS.",
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
      acTalkingPoint: "Hacktiv8 DS&ML biayanya Rp 35 juta dan jam belajarnya full-day 09:00–18:00 WIB sehingga kakak harus resign duluan kak. Di program RevoU x ITB Applied Data Science with AI, biayanya jauh lebih terjangkau (Rp 16,99jt), jadwal kelas malam jam 19.30 WIB (tidak perlu resign kerja), dibimbing langsung oleh Head of Data Science XLSMART & Dosen FTI ITB, menggunakan AI coding agent Claude Code, dan mendapatkan sertifikat resmi ITB plus opsi 1 SKS Magister ITB. Jauh lebih prestigius dan fleksibel untuk karir kakak!",
      referenceImages: [
        {
          url: "/images/hacktiv8/h8-dsml-stack-phase1.png",
          title: "Fase 1: Data Analytics, Scraping & Visualisasi",
          subtitle: "Fondasi pemrograman Python, manipulasi data Pandas & NumPy, web scraping BeautifulSoup, database PostgreSQL, visualisasi Seaborn & Tableau, serta Git/GitHub",
          tools: ["Python", "Pandas", "NumPy", "PostgreSQL", "BeautifulSoup", "Seaborn", "Tableau", "GitHub"]
        },
        {
          url: "/images/hacktiv8/h8-dsml-stack-phase2.png",
          title: "Fase 2: Classical Machine Learning & Model Deployment",
          subtitle: "Pemodelan algoritma Scikit-Learn, komputasi sains SciPy, pembuatan interactive web app Streamlit, dan integrasi pre-trained model Hugging Face",
          tools: ["scikit-learn", "SciPy", "Streamlit", "Hugging Face", "Machine Learning"]
        },
        {
          url: "/images/hacktiv8/h8-dsml-stack-phase3.png",
          title: "Fase 3: Deep Learning, Big Data & MLOps Pipeline",
          subtitle: "Deep learning neural network TensorFlow, distributed computing Apache Spark, Elasticsearch, data quality Great Expectations, orkestrasi Airflow, Docker, dan deployment AWS",
          tools: ["TensorFlow", "Apache Spark", "Elasticsearch", "Great Expectations", "Apache Airflow", "Docker", "AWS"]
        }
      ]
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
          competitorValue: "Kurikulum 3 Fase (Data Analytics, Machine Learning & Big Data Pipeline):\n• Fase 1 - Data Analytics, Scraping & Visualisasi: Python, Pandas, NumPy, PostgreSQL, Web Scraping BeautifulSoup, Git/GitHub, visualisasi data Seaborn & Tableau.\n• Fase 2 - Applied Machine Learning & Deployment: Pemodelan prediktif Scikit-Learn, komputasi sains SciPy, interactive web application Streamlit, & pre-trained model Hugging Face.\n• Fase 3 - Deep Learning, Big Data & MLOps Pipeline: Deep Learning TensorFlow, Big Data Apache Spark, distributed search Elasticsearch, data quality Great Expectations, pipeline Apache Airflow, containerisasi Docker, & cloud AWS.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Google Sheets AI, BigQuery SQL, Python, Pandas, NumPy, PandasAI, Tableau, Looker Studio, Claude Code Safety Gate, Apache Airflow, & AWS Partner Cloud.",
          competitorValue: "Daftar Tools Lengkap 3 Fase:\n• Fase 1 (Data & Scraping): Python, Pandas, NumPy, PostgreSQL, BeautifulSoup, GitHub, Seaborn, Tableau.\n• Fase 2 (ML & Web App): Scikit-Learn, SciPy, Streamlit, Hugging Face.\n• Fase 3 (Big Data & DevOps): Docker, Elasticsearch, Great Expectations, Apache Airflow, Apache Spark, AWS, TensorFlow.",
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
      acTalkingPoint: "Hacktiv8 Comprehensive DA durasinya hanya 12 minggu kak. Di RevoU FSDA kakak belajar 7 bulan komprehensif, menguasai Apache Airflow ETL, ada 12 minggu Virtual Internship menganalisis dataset bisnis riil perusahaan, dan dibimbing langsung oleh Career Coach 1-on-1 sampai dapat kerja. Tentu jauh lebih matang untuk persiapan karir kakak :)"
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
          competitorValue: "Kurikulum Rekayasa AI Teknis 3 Tingkat (Heavy Coding):\n• Tier 1 - Data Architecture & Pipeline: Python, Pandas, PostgreSQL, MongoDB, Databricks, Apache Spark, Apache Airflow, Great Expectations, Grafana, Tableau, FastAPI, Docker, AWS, Google Cloud.\n• Tier 2 - LLM Ecosystem, RAG & Multi-Agent: OpenAI (GPT-4o), Google Gemini, Ollama (Local LLM), Hugging Face, LangChain, LangSmith, CrewAI (Multi-Agent), Pinecone (Vector DB), Redis, PostgreSQL, FastAPI, Docker.\n• Tier 3 - AI Automation, MCP & Multi-Cloud Deployment: n8n Workflow Automation, Model Context Protocol (MCP), Docker, & Multi-Cloud Serving (DigitalOcean, Hetzner, IDCloudHost, Biznet Gio Cloud, VPSDime).",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Claude Code Safety Gate, ChatGPT & Gemini untuk riset pasar dan strategic forecasting, framework analitis eksekutif, n8n no-code automation, & AI Governance toolkit (tanpa koding teknis).",
          competitorValue: "Ekosistem Tools Lengkap 3 Tingkat:\n• Data & Pipeline: Python, Pandas, PostgreSQL, MongoDB, Databricks, Apache Spark, Apache Airflow, Great Expectations, Grafana, Tableau, FastAPI, Docker, AWS, Google Cloud.\n• LLM & Agentic AI: OpenAI, Gemini, Ollama, Hugging Face, LangChain, LangSmith, CrewAI, Pinecone, Redis.\n• Automation & Serving: n8n, Model Context Protocol (MCP), DigitalOcean, Hetzner, IDCloudHost, Biznet Gio Cloud, VPSDime.",
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
          competitorValue: "Kurikulum Rekayasa AI Teknis 3 Tingkat (Heavy Coding):\n• Tier 1 - Data Architecture & Pipeline: Python, Pandas, PostgreSQL, MongoDB, Databricks, Apache Spark, Apache Airflow, Great Expectations, Grafana, Tableau, FastAPI, Docker, AWS, Google Cloud.\n• Tier 2 - LLM Ecosystem, RAG & Multi-Agent: OpenAI (GPT-4o), Google Gemini, Ollama (Local LLM), Hugging Face, LangChain, LangSmith, CrewAI (Multi-Agent), Pinecone (Vector DB), Redis, PostgreSQL, FastAPI, Docker.\n• Tier 3 - AI Automation, MCP & Multi-Cloud Deployment: n8n Workflow Automation, Model Context Protocol (MCP), Docker, & Multi-Cloud Serving (DigitalOcean, Hetzner, IDCloudHost, Biznet Gio Cloud, VPSDime).",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "n8n AI Workflow Automation, Zapier, Claude Code, OpenAI API, Gemini, Google Sheets AI, Looker Studio, & prompt engineering praktikal tanpa koding teknis.",
          competitorValue: "Ekosistem Tools Lengkap 3 Tingkat:\n• Data & Pipeline: Python, Pandas, PostgreSQL, MongoDB, Databricks, Apache Spark, Apache Airflow, Great Expectations, Grafana, Tableau, FastAPI, Docker, AWS, Google Cloud.\n• LLM & Agentic AI: OpenAI, Gemini, Ollama, Hugging Face, LangChain, LangSmith, CrewAI, Pinecone, Redis.\n• Automation & Serving: n8n, Model Context Protocol (MCP), DigitalOcean, Hetzner, IDCloudHost, Biznet Gio Cloud, VPSDime.",
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
          competitorValue: "Kurikulum Rekayasa AI Teknis 3 Tingkat (Khusus IT / Software Engineering, Tanpa Finansial):\n• Tier 1 - Data Architecture & Pipeline: Python, Pandas, PostgreSQL, MongoDB, Databricks, Apache Spark, Apache Airflow, Great Expectations, Grafana, Tableau, FastAPI, Docker, AWS, Google Cloud.\n• Tier 2 - LLM Ecosystem, RAG & Multi-Agent: OpenAI (GPT-4o), Google Gemini, Ollama (Local LLM), Hugging Face, LangChain, LangSmith, CrewAI (Multi-Agent), Pinecone (Vector DB), Redis, PostgreSQL, FastAPI, Docker.\n• Tier 3 - AI Automation, MCP & Multi-Cloud Deployment: n8n Workflow Automation, Model Context Protocol (MCP), Docker, & Multi-Cloud Serving (DigitalOcean, Hetzner, IDCloudHost, Biznet Gio Cloud, VPSDime).\n• (Tidak ada materi financial modeling, akuntansi, atau perpajakan korporasi).",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "AI Financial Modeling tools, Claude & ChatGPT untuk 3-statement modeling presisi tinggi, financial ratio analysis, Python automation opsional, & compliance DJP (fokus manajemen finansial strategis).",
          competitorValue: "Ekosistem Tools Lengkap 3 Tingkat (Khusus Software/AI Engineering, Tanpa Finansial):\n• Data & Pipeline: Python, Pandas, PostgreSQL, MongoDB, Databricks, Apache Spark, Apache Airflow, Great Expectations, Grafana, Tableau, FastAPI, Docker, AWS, Google Cloud.\n• LLM & Agentic AI: OpenAI, Gemini, Ollama, Hugging Face, LangChain, LangSmith, CrewAI, Pinecone, Redis.\n• Automation & Serving: n8n, Model Context Protocol (MCP), DigitalOcean, Hetzner, IDCloudHost, Biznet Gio Cloud, VPSDime.",
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
          competitorValue: "Kurikulum Otomasi Proses & Modul AI Boost (24 Sesi):\n• Platforms Covered: Zapier, Make, n8n, PostgreSQL, Maze, Google Data Studio, Miro.\n• Chat & Communication Channels: WhatsApp Business, Slack, Telegram Bot, Discord, Gmail.\n• Workspace Tools: Google Sheets, Google Docs, Google Forms.\n• Modul AI Boost: Akselerasi keahlian AI praktis menggunakan ChatGPT (OpenAI), Ollama (Local LLM), & workflow automation n8n.",
          highlight: false
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "n8n AI Workflow Automation, Zapier, Make, Claude Code Safety Gate, OpenAI API, Gemini, Google Sheets AI, Looker Studio, & integrasi enterprise database.",
          competitorValue: "Daftar Lengkap Platforms Covered & AI Boost:\n• Automation & Database: Zapier, Make, PostgreSQL, Maze, Google Data Studio, Miro.\n• Communication & Messaging: WhatsApp Business, Slack, Telegram Bot, Discord, Gmail.\n• Google Workspace: Google Sheets, Google Docs, Google Forms.\n• Modul AI Boost: ChatGPT, Ollama, n8n.",
          highlight: true
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
          competitorValue: "Koding AI Teknis Berat (15 Minggu Modul / 60 Sesi):\n• Core Dev & Data: Python, VSCode, Pandas, MySQL, Git, GitHub, Seaborn.\n• Machine Learning & Vision: Scikit-Learn, TensorFlow, OpenCV.\n• GenAI, LLM & Vector DB: ChatGPT, OpenAI, Hugging Face, LangChain, Pinecone, FAISS, MongoDB.\n• Serving & MLOps Infrastructure: Flask, FastAPI, Docker, GCP, MLflow, ONNX, Langfuse.",
          highlight: false
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Claude Code Safety Gate, ChatGPT & Gemini untuk analitis bisnis dan strategic forecasting, framework analitis eksekutif, n8n no-code automation, & AI Governance toolkit.",
          competitorValue: "Platforms Covered Lengkap:\n• Core Dev & Data: Python, VSCode, Pandas, MySQL, Git, GitHub, Seaborn.\n• Machine Learning & Vision: Scikit-Learn, TensorFlow, OpenCV.\n• GenAI, LLM & Vector DB: ChatGPT, OpenAI, Hugging Face, LangChain, Pinecone, FAISS, MongoDB.\n• Deployment & MLOps: Flask, FastAPI, Docker, GCP, MLflow, ONNX, Langfuse.",
          highlight: true
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
          competitorValue: "Analisis Data Bisnis & AI Assistance (45 Sesi Modul):\n• Coding & Environment: Python, Jupyter Notebook, VSCode, Pandas.\n• Database Querying: Relational Database MySQL.\n• Visualisasi & Dashboard: Tableau visual analytics.\n• AI & Documentation Tools: Notion, ChatGPT (OpenAI) untuk akselerasi analisis data bisnis & penyusunan insight.",
          highlight: false
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Google Sheets AI, BigQuery SQL, Python, Pandas, NumPy, PandasAI, Tableau, Looker Studio, Claude Code Safety Gate, Apache Airflow, & AWS Partner Cloud.",
          competitorValue: "Platforms Covered Lengkap:\n• Environment & Programming: Python, Jupyter, VSCode, Pandas.\n• Database: MySQL.\n• Business Intelligence & Visualisasi: Tableau.\n• AI & Productivity: ChatGPT, OpenAI, Notion.",
          highlight: true
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
          competitorValue: "Kurikulum Data Science & Machine Learning (45 Sesi):\n• Coding & Environment: Python, Jupyter Notebook, VSCode, Pandas.\n• Database & Visualisasi: MySQL relational database, Tableau business dashboards.\n• Modeling & AI Assistance: Scikit-Learn machine learning, integrasi ChatGPT & OpenAI untuk eksplorasi dan analitis.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Claude Code Safety Gate, ChatGPT & Gemini untuk analitis prediktif terapan, BigQuery, Python, Pandas, Tableau, & sertifikasi resmi ITB.",
          competitorValue: "Platforms Covered Lengkap:\n• Environment & Tools: Python, Jupyter, VSCode, Pandas.\n• Database: MySQL.\n• Visual Analytics: Tableau.\n• AI Models: ChatGPT, OpenAI.",
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
          competitorValue: "Kurikulum Data Science & Machine Learning (45 Sesi):\n• Coding & Environment: Python, Jupyter Notebook, VSCode, Pandas.\n• Database & Visualisasi: MySQL relational database, Tableau business dashboards.\n• Modeling & AI Assistance: Scikit-Learn machine learning, integrasi ChatGPT & OpenAI untuk analisis data.",
          highlight: false
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Google Sheets AI, BigQuery SQL, Python, Pandas, NumPy, PandasAI, Tableau, Looker Studio, Claude Code Safety Gate, Apache Airflow, & AWS Partner Cloud.",
          competitorValue: "Platforms Covered Lengkap:\n• Environment & Tools: Python, Jupyter, VSCode, Pandas.\n• Database: MySQL.\n• Visual Analytics: Tableau.\n• AI Models: ChatGPT, OpenAI.",
          highlight: true
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
          competitorValue: "Kurikulum Digital Marketing 12 Minggu Modul:\n• Organic & SEO: Ahrefs, Semrush, Ubersuggest, Google Search Console.\n• Paid Advertising & Performance: Google Ads, Meta Ads (Facebook & Instagram), TikTok Ads.\n• Social Media Channels: Facebook, Instagram, YouTube, X, TikTok, Canva content design.\n• Analytics & CRM: Google Analytics, Mailchimp email automation.\n• AI Copywriting: ChatGPT (OpenAI).",
          highlight: false
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "GA4, Google Tag Manager, Looker Studio, Meta Ads Manager, Google Ads, TikTok Ads Manager, Marketplace CPAS (Shopee/Tokopedia), Mailchimp, HubSpot CRM, Ahrefs, Semrush, WordPress, Canva, Custom GPTs & Claude AI Copywriting.",
          competitorValue: "Platforms Covered Lengkap:\n• SEO & Research: Ahrefs, Semrush, Ubersuggest, Google.\n• Paid Ads: Google Ads, Meta Ads (Facebook & Instagram), TikTok Ads.\n• Social Media Channels: Facebook, Instagram, YouTube, X, TikTok.\n• Analytics, CRM & Creative: Google Analytics, Mailchimp, Canva.\n• AI Tools: ChatGPT, OpenAI.",
          highlight: true
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
          competitorValue: "13 minggu modul (45 sesi) + 4–5 minggu final project kelompok 2–3 orang:\n• Frontend Modern: React.js, TailwindCSS, Vite, Axios.\n• Backend REST API: Node.js, Express.js.\n• Database & ORM: PostgreSQL & PrismaJS ORM.\n• Testing & DevOps: Unit testing Jest, containerisasi Docker, & integrasi AI ChatGPT.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Next.js App Router, TypeScript, React, TailwindCSS, Python, Flask REST API, PostgreSQL, Playwright E2E Testing, Locust Load Testing, Docker, Amazon Web Services (AWS) Partner Cloud, Claude AI, & Kiro Spec Mode.",
          competitorValue: "Platforms Covered Lengkap:\n• Frontend: React.js, TailwindCSS, Vite, Axios.\n• Backend & Database: Node.js, Express.js, PostgreSQL, PrismaJS.\n• Testing & DevOps: Jest, Docker.\n• Tools & AI: Visual Studio Code, GitHub, ChatGPT.",
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
          competitorValue: "Mencakup Kurikulum 13 Minggu (52 Sesi) Blue Team & Red Team:\n• Network & Reconnaissance: nmap, Wireshark, theHarvester, Cisco Packet Tracer.\n• Red Team & Pentest: Metasploit, Burp Suite, ZAP Proxy, Aircrack-ng, Postman.\n• Blue Team & SIEM: Wazuh / Splunk Free, Snort (NIDS), MISP Threat Sharing.\n• Forensics & Scripting: Sysinternals, Volatility, OpenSSL, Python 3.x, PowerShell/Bash, VirtualBox.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Amazon Web Services (AWS) Cloud Security, GuardDuty, AWS WAF, Security Hub, IAM, Claude AI Security Agent, SIEM Tools, & Linux Security Hardening.",
          competitorValue: "Platforms Covered Lengkap:\n• Recon & Network: nmap, Wireshark, theHarvester, Cisco Packet Tracer.\n• Red Team & Pentesting: Burp Suite Community, ZAP Proxy, Metasploit Framework, Aircrack-ng, Postman.\n• Blue Team & SIEM: Wazuh / Splunk Free, Snort, MISP.\n• Forensics & OS: Sysinternals Suite, Volatility, OpenSSL.\n• Scripting & Virtualization: Python 3.x, PowerShell / Bash, VirtualBox.",
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
          competitorValue: "Kurikulum Data Engineering 14 Minggu Modul (44 Sesi):\n• Programming & Foundations: Python, Pandas, Jupyter, VSCode, Scala, Linux CLI, Git, GitHub.\n• Database & Storage: Relational Database PostgreSQL, Cloud Data Warehouse Google BigQuery.\n• Distributed Big Data & Processing: Apache Spark, PySpark, Google Cloud Platform (GCP).\n• Pipeline Orchestration & Containerization: Apache Airflow, Docker, Kubernetes.\n• AI Assistance: ChatGPT & OpenAI.",
          highlight: false
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Google Sheets AI, BigQuery SQL, Python, Pandas, NumPy, PandasAI, Tableau, Looker Studio, Claude Code Safety Gate, Apache Airflow Automated ETL, & AWS Partner Cloud.",
          competitorValue: "Platforms Covered Lengkap:\n• Foundations & Coding: Python, Pandas, Jupyter, VSCode, Linux, Git, GitHub, Scala.\n• Database & Warehouse: PostgreSQL, BigQuery.\n• Big Data & Cloud: Apache Spark, PySpark, GCP (Google Cloud Platform).\n• Pipeline & DevOps: Apache Airflow, Docker, Kubernetes.\n• AI Tools: ChatGPT, OpenAI.",
          highlight: true
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
          competitorValue: "Kurikulum Quality Assurance Engineer (8 Minggu / 32 Sesi):\n• Test Management & Defect Tracking: Jira, Zephyr Scale, Microsoft Excel.\n• Database & Data Verification: MySQL, DBeaver.\n• API & Automation Testing: Postman (API Testing), Node.js, Visual Studio Code (VSCode), GitHub.\n• Generative AI for QA: ChatGPT, Gemini, Claude (pembuatan test case otomatis & bug reporting).",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "TypeScript, Python/Flask, Next.js, Playwright (Automated Testing), Git, GitHub, Docker, AWS Cloud Partner, Claude Code & AI-Assisted Spec Testing.",
          competitorValue: "Platforms Covered Lengkap:\n• Test Management: Jira, Zephyr Scale, Microsoft Excel.\n• Database Testing: MySQL, DBeaver.\n• Automation & Development: Postman, Node.js, Visual Studio Code, GitHub.\n• AI-Powered QA: ChatGPT, Gemini, Claude.",
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
          competitorValue: "Kurikulum Social Media & Content (5 Minggu / 30 Sesi):\n• Social Platforms: Instagram, Threads, TikTok, YouTube, LinkedIn, X (Twitter).\n• Creative & Video Production: Canva, CapCut (Short-form Video Editing).\n• Social Analytics & Intel: Rival IQ, UpDog, Seedance.\n• AI Generation & Strategy: HiggsField AI, ChatGPT, Gemini, Claude.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Meta Ads Manager, Google Ads & Keyword Planner, TikTok Ads Manager, GA4, Google Tag Manager, Looker Studio, Mailchimp CRM, Canva, Ahrefs, & AI Prompts (ChatGPT, Claude).",
          competitorValue: "Platforms Covered Lengkap:\n• Social Channels: Instagram, Threads, TikTok, YouTube, LinkedIn, X.\n• Creative & Editing: Canva, CapCut.\n• Social Analytics & Intelligence: Rival IQ, UpDog, Seedance.\n• AI Content & Video: HiggsField AI, ChatGPT, Gemini, Claude.",
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

  // ── 3. DIBIMBING (8 Program Tech Resmi Hasil Scrape 26 Okt 2026) ──
  dibimbing: [
    // 1. Data Engineering (Batch 12)
    {
      id: "db-de",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Data Engineering Bootcamp",
      badge: "Batch 12 · Online",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Opsi Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt all-in sudah termasuk 8 modul AI, Apache Airflow ETL, 12 minggu Virtual Internship, & Career+ sampai hired).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Bebas Biaya Tambahan: Bebas biaya registrasi & tools (100% disediakan RevoU).",
          competitorValue: "• Biaya Program: Bayar Hari Ini (biaya di-render dinamis via JavaScript; estimasi promo Rp 7jt – Rp 15jt, perlu hubungi admission WA 081227741541).\n• Refund: Non-refundable (tidak ada garansi refund dana).\n• Keunggulan Finansial: Opsi gratis mengulang batch seumur hidup.",
          highlight: false
        },
        {
          parameter: "Format Belajar & Jadwal Sesi",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif dua arah malam hari (19:00–21:00 WIB) Senin–Kamis (210+ jam live) + Sesi Review Tugas Opsional Sabtu (ramah pekerja tanpa perlu resign).",
          competitorValue: "Online (Batch 12) · Pre-bootcamp mandiri + sesi live Zoom tanya jawab 2–3x per minggu kombinasi rekaman video LMS.",
          highlight: true
        },
        {
          parameter: "Durasi & Alur Belajar",
          categoryTag: "DURASI & ALUR",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "Pre-bootcamp (belajar mandiri) → Bootcamp 24 minggu → Post-bootcamp 2 minggu → Job Connect 4 minggu (total ±7,5 bulan). Batch terbaru: Batch 12.",
          highlight: true
        },
        {
          parameter: "Fokus Kurikulum & Spesialisasi",
          categoryTag: "KURIKULUM",
          revouValue: "8 Modul + AI: BigQuery SQL, Python PandasAI, Tableau, Looker Studio, Automated ETL dengan **Apache Airflow**, Business Problem Solving (Issue Tree, RCA), & Cloud Analytics.",
          competitorValue: "SQL, Python, Spark, Cloud DWH, pipeline, big data.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Apache Airflow, BigQuery, Python, Pandas, NumPy, PandasAI, Tableau, Looker Studio, Claude Code Safety Gate, & AWS Cloud Partner.",
          competitorValue: "Colab, Git, Google Cloud, Docker, Airflow, Spark, Hadoop, Kafka, PostgreSQL, WSL.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portfolio Projects standar industri + **12 Minggu Virtual Internship** mengolah dataset bisnis skala enterprise riil mitra (Telkom OCA, Zurich) dan presentasi C-level.",
          competitorValue: "Tugas akhir mandiri/kelompok dan talent showcase ke 1.100+ partner Dibimbing.",
          highlight: true
        },
        {
          parameter: "Mentor & Dukungan Karir",
          categoryTag: "KARIR & MENTOR",
          revouValue: "Career+ (1-on-1 Personal Career Coach selama 7-8 bulan + AI Career Engine CV/LinkedIn + Mock Interview Hiring Manager). 15.000+ alumni di 1.000+ top company.",
          competitorValue: "Job Connect 4 minggu: Review CV & LinkedIn, latihan interview, konsultasi 1-on-1. Mentor dari DANA, Kredivo, ZEALS, MIFX, INA Digital, Bank Mega, Singaporean Bank. Klaim gaji Data Engineer Rp 9–18jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Sesi live hanya 2–3 kali seminggu dengan sebagian besar materi dipelajari mandiri via video LMS rekaman, biaya di-render dinamis via JS (harus kontak WA), dan portofolio hanya berupa tugas akhir tanpa virtual internship klien korporasi riil.",
      revouEdge: "100% Live Instruction intensif setiap malam, penguasaan Apache Airflow & Automated ETL end-to-end, 12 minggu Virtual Internship mengolah real dataset perusahaan mitra, dan bimbingan karir intensif Career+ 1-on-1.",
      acTalkingPoint: "Dibimbing Data Engineering fokus pada pipeline big data via 2-3 sesi per minggu dan materi rekaman LMS kak. Di RevoU FSDA, kakak belajar komprehensif selama 7 bulan dengan 100% live class interaktif setiap hari, menguasai SQL BigQuery, Python, Tableau, Looker Studio, dan Production-Ready Analytics dengan Apache Airflow & Automated ETL, plus 12 minggu Virtual Internship mengolah real dataset korporasi mitra (Telkom OCA, Zurich) serta didampingi Career Coach 1-on-1 sampai dapat kerja."
    },

    // 2. Data Analytics (Online Batch 21+, Offline JKT Batch 3)
    {
      id: "db-da",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Data Analytics Bootcamp",
      badge: "Online (Batch 21+) + Offline JKT (Batch 3)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Opsi Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 17.900.000 – Rp 20.900.000 (Rp 17.9jt – 20.9jt all-in sudah termasuk 8 modul AI, Apache Airflow ETL, 12 minggu Virtual Internship, & Career+ sampai hired).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & mitra resmi (Danacita).\n• Bebas Biaya Tambahan: Bebas biaya registrasi & tools.",
          competitorValue: "• Biaya Program: Bayar Hari Ini atau Cicilan (harga di-render dinamis via JS / estimasi promo Rp 7jt – Rp 15jt via WA 081227741541).\n• Refund: Non-refundable (tidak ada refund dana).\n• Keunggulan Finansial: Opsi cicilan tersedia & gratis mengulang batch seumur hidup.",
          highlight: false
        },
        {
          parameter: "Format Belajar & Lokasi Kelas",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif dua arah malam hari (19:00–21:00 WIB) Senin–Kamis + Review Sabtu. Ramah pekerja tanpa perlu macet atau biaya akomodasi.",
          competitorValue: "Online (Weekday & Weekend - Batch 21+) atau Offline Jakarta (BARU - Batch 3). Frekuensi 2–3 sesi per minggu kombinasi rekaman video LMS.",
          highlight: true
        },
        {
          parameter: "Durasi & Alur Program",
          categoryTag: "DURASI & ALUR",
          revouValue: "7 Bulan komprehensif (Bulan 1-4 Modul Live + Bulan 5-7: 12 Minggu Virtual Internship & Career Track; Lifetime Community).",
          competitorValue: "Pre-bootcamp mandiri → 24 minggu bootcamp → 2 minggu post → 4 minggu Job Connect (total ±7 bulan). Batch: Weekend Online Batch 21+, Offline Jakarta Batch 3.",
          highlight: true
        },
        {
          parameter: "Fokus Kurikulum & Problem Solving",
          categoryTag: "KURIKULUM",
          revouValue: "8 Modul + AI: Business Problem Solving (Issue Tree, RCA), SQL BigQuery AI, Python PandasAI, Tableau, Looker Studio, Data Storytelling, serta **Production-Ready Analytics (Apache Airflow & Automated ETL)**.",
          competitorValue: "Excel, SQL, Python, Business Metrics & KPI, Power BI, Tableau, dan integrasi tools AI modern.",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Google Sheets AI, BigQuery SQL, Python, Pandas, NumPy, PandasAI, Tableau, Looker Studio, Claude Code Safety Gate, & Apache Airflow.",
          competitorValue: "Excel/Spreadsheet, Colab, MongoDB, VS Code, LangChain, PostgreSQL, PgVector, GroqAPI, Streamlit, DBeaver.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "7 Portfolio Projects mandiri standar industri + **12 Minggu Virtual Internship** menganalisis dataset bisnis riil enterprise mitra (Telkom OCA, Zurich) dan presentasi C-level.",
          competitorValue: "Tugas akhir mandiri/kelompok dan talent showcase ke 1.100+ hiring partner.",
          highlight: true
        },
        {
          parameter: "Mentor & Klaim Gaji",
          categoryTag: "KARIR & MENTOR",
          revouValue: "Career+ 1-on-1 Personal Career Coach selama 7-8 bulan penuh + AI Career Engine CV/LinkedIn + Mock Interview Hiring Manager. 15.000+ alumni di 1.000+ top company.",
          competitorValue: "Job Connect 4 minggu. Mentor dari Ajaib, OY! Indonesia, Philip Morris, Astro, Mekari. Klaim gaji: DA Rp 7,6–15jt; BI Analyst Rp 9,8–18,5jt; BI Developer Rp 6,8–13jt; Marketing/Sales Analyst Rp 7,6–15,6jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Meskipun sudah ada opsi offline Jakarta dan memasukkan tools AI (LangChain/Groq), format online tetap berbasis 2–3 sesi seminggu dengan banyak modul mandiri via video LMS, serta tidak ada program virtual internship dataset enterprise riil.",
      revouEdge: "100% Live Instruction interaktif setiap malam bersama praktisi senior, kurikulum terdepan mencakup Apache Airflow Automated ETL & Business Problem Solving, 12 minggu Virtual Internship dataset riil mitra, dan pendampingan karir 1-on-1 intensif Career+.",
      acTalkingPoint: "Dibimbing Data Analytics memang sudah menyediakan opsi offline Jakarta dan tools AI seperti LangChain kak. Namun belajarnya hanya 2-3 sesi per minggu dan materi banyak dipelajari mandiri via video LMS rekaman. Kalau di RevoU FSDA, kakak belajar 100% live class interaktif setiap malam, menguasai business problem solving dan Apache Airflow Automated ETL, serta yang paling bernilai tinggi adalah 12 minggu Virtual Internship menganalisis dataset bisnis riil perusahaan mitra (Telkom OCA, Zurich) dan didampingi Career Coach 1-on-1 sampai dapat kerja."
    },

    // 3. AI Engineering (Batch 41 - ex Data Science & AI ML)
    {
      id: "db-ai",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "AI Engineering Bootcamp (ex-Data Science & ML)",
      badge: "Batch 41 · Online",
      revouMatchProgram: "x ITB: Applied Data Science with AI",
      revouMatchBadge: "ITB",
      tableRows: [
        {
          parameter: "Biaya & Kredensial Resmi",
          categoryTag: "INVESTASI & KREDENSIAL",
          revouValue: "Rp 16.999.000 (cicilan 0% & invoice kantor) + Certificate of Completion resmi **Institut Teknologi Bandung (FTI ITB)** + Opsi transfer kredit 1 SKS Magister FTI ITB.",
          competitorValue: "• Biaya Program: Bayar Hari Ini (biaya via WA 081227741541 / estimasi promo Rp 7jt–15jt; non-refundable).\n• Sertifikasi: Sertifikat kelulusan internal Dibimbing (tanpa kemitraan kampus PTN/PTS).\n• FAQ: Menyebut program bergaransi serta perbedaan Job Connect vs Job Connect Plus.",
          highlight: true
        },
        {
          parameter: "Pengajar & Instruktur Praktisi",
          categoryTag: "PENGAJAR",
          revouValue: "Kolaborasi Dosen FTI ITB & Praktisi Senior Aktif: **Rahmat Hidayatullah** (Head of Data Science, XLSMART) — kurikulum terapan mutakhir.",
          competitorValue: "Mentor praktisi dari Evermos, Bank Multiarta Sentosa, Astra International, Bank Mega, Otten Coffee.",
          highlight: true
        },
        {
          parameter: "Rebrand & Fokus Kurikulum",
          categoryTag: "KURIKULUM",
          revouValue: "Modern Data Science: Predictive analytics (regression, classification), forecasting, ML clustering, AI coding agent via **Claude Code Safety Gate** untuk akselerasi koding aman.",
          competitorValue: "Python, SQL, statistik, ML, deep learning, NLP, Generative AI. (Catatan: Rebrand dari 'Data Science & AI Machine Learning' — URL website masih `/data-science`, footer Back-End masih pakai nama lama).",
          highlight: true
        },
        {
          parameter: "Platform & Tools yang Digunakan",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Claude Code Safety Gate, ChatGPT & Gemini untuk analitis prediktif terapan, BigQuery, Python, Pandas, Tableau, & sertifikasi resmi ITB.",
          competitorValue: "Colab, PostgreSQL, DBeaver, MongoDB, VS Code, Anaconda, LangChain, Docker, Streamlit, Tableau.",
          highlight: true
        },
        {
          parameter: "Format Belajar & Kampus",
          categoryTag: "FORMAT KELAS",
          revouValue: "Hybrid 13 Minggu: Live Zoom interaktif malam hari + Sesi On-Campus Networking tatap muka di Kampus ITB Ganesha Bandung.",
          competitorValue: "Online 2–3x seminggu + video rekaman materi LMS (total ±7 bulan alur belajar). Batch terbaru: Batch 41.",
          highlight: false
        },
        {
          parameter: "Deliverable Akhir & Klaim Gaji",
          categoryTag: "PROYEK & KARIR",
          revouValue: "Capstone Decision App siap pakai berbasis machine learning & AI (misal Churn Prediction & Decision System) yang langsung bisa diimplementasikan ke sistem bisnis nyata.",
          competitorValue: "Tugas akhir mandiri/kelompok. Klaim gaji: AI Engineer Rp 8,7–14,4jt; MLE Rp 8,2–28,9jt; Data Scientist Rp 6,9–12,8jt; CV/NLP Engineer Rp 5,9–10,5jt; MLOps Rp 8–10jt/bulan.",
          highlight: true
        }
      ],
      competitorLimitation: "AI Engineering merupakan rebrand dari kursus Data Science lama (URL masih `/data-science`), format belajar hanya 2–3 sesi seminggu dengan materi rekaman LMS, dan sertifikat yang didapat hanya sertifikat internal lembaga kursus tanpa pengakuan universitas ternama.",
      revouEdge: "Kredensial resmi Institut Teknologi Bandung (FTI ITB) dengan opsi 1 SKS Magister ITB, dibimbing langsung Head of Data Science XLSMART & Dosen FTI ITB, integrasi modern Claude Code, dan sesi tatap muka eksklusif di Kampus ITB Ganesha Bandung.",
      acTalkingPoint: "Dibimbing AI Engineering adalah rebrand dari program Data Science & ML mereka dengan format online rekaman video 2-3 sesi per minggu dan sertifikat internal kursus kak. Di program RevoU x ITB Applied Data Science with AI, kakak belajar langsung dari Dosen FTI ITB dan Head of Data Science XLSMART, menggunakan AI coding agent Claude Code, sesi on-campus di ITB Ganesha Bandung, dan mendapatkan sertifikat resmi ITB plus opsi 1 SKS Magister ITB. Kredensial dan bobot profesionalnya jauh lebih prestisius di mata recruiter industri!"
    },

    // 4. Front-End Web Development (Batch 26+)
    {
      id: "db-fe",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Front-End Web Development Bootcamp",
      badge: "Batch 26+ · Online",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Cakupan Program",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (Rp 19.5jt – 22.5jt all-in sudah termasuk Full Stack Front-End + Back-End + AWS Cloud + AI Agent, 3 bulan Virtual Internship, & Career+ sampai hired).\n• Upfront: Lunas di awal tanpa admin fee & tanpa bunga.\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & Danacita.",
          competitorValue: "• Biaya Program: Bayar Hari Ini (biaya via admission WA 081227741541; estimasi promo Rp 7jt–15jt).\n• Pembatasan: Hanya mencakup modul Front-End saja. Jika ingin Back-End harus daftar terpisah (FAQ menyebut bisa daftar FE dan BE sekaligus dengan biaya terpisah).",
          highlight: false
        },
        {
          parameter: "Cakupan Arsitektur Software",
          categoryTag: "ARSITEKTUR KODING",
          revouValue: "**Full Stack End-to-End**: Front-End (React, Next.js, TypeScript) PLUS Back-End (Node.js, Express, PostgreSQL, REST API) + Cloud Architecture di AWS.",
          competitorValue: "**Hanya Front-End Terpisah**: HTML, CSS, JavaScript dasar, React, Redux, Netlify. Tidak ada pembelajaran arsitektur backend, database, atau cloud server.",
          highlight: true
        },
        {
          parameter: "Format Belajar & Durasi",
          categoryTag: "FORMAT & DURASI",
          revouValue: "100% Live Online interaktif malam (19:00–21:00 WIB) Senin–Kamis (210+ jam live coding & review baris-per-baris bersama praktisi).",
          competitorValue: "Pre-bootcamp mandiri + 24 minggu bootcamp + 2 post + 4 Job Connect (±7,5 bulan). Sesi live Zoom 2–3x/minggu. Catatan: meta-description di web menyebut '5 bulan' (inkonsisten dengan alur 24 minggu). Batch: Batch 26+.",
          highlight: true
        },
        {
          parameter: "Tech Stack & AI Tooling",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "React, Next.js, TypeScript, Node.js, Express, PostgreSQL, Docker, AWS Partner Cloud, & AI Coding Agents (Claude Code, Cursor).",
          competitorValue: "HTML, CSS, JavaScript, React, Redux, Git, GitHub, Netlify, Hackerrank, VS Code.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "Proyek mandiri standar industri + **12 Minggu Virtual Internship** membangun software riil untuk mitra korporasi enterprise nyata.",
          competitorValue: "Portofolio tugas akhir mandiri dan talent showcase ke 1.100+ partner.",
          highlight: true
        },
        {
          parameter: "Mentor & Klaim Gaji",
          categoryTag: "KARIR & MENTOR",
          revouValue: "Career+ 1-on-1 Personal Career Coach selama 7-8 bulan penuh sampai hired. 15.000+ alumni di 1.000+ top company.",
          competitorValue: "Job Connect 4 minggu. Mentor dari SALT, Rekosistem, Paragon, Apotek Digital, Hijr Studio, Telkom Indonesia, PrivyID, Amartha. Klaim gaji: FE Developer Rp 5–8jt, FE Engineer Rp 6–9jt, Web Designer Rp 5–6jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Materi hanya mencakup Front-End terpisah (jika ingin full stack harus bayar dan ikut FE dan BE terpisah), ada inkonsistensi durasi antara meta (5 bulan) vs alur resmi (24 minggu), dan jam live coding bersama praktisi sangat minim (2-3 sesi seminggu).",
      revouEdge: "Di RevoU siswa langsung menguasai Full Stack Software Engineering lengkap (Front-End Modern React/Next.js PLUS Back-End Node.js & AWS Cloud) dengan 210+ jam live instruction harian, review code baris-per-baris, dan 12 minggu Virtual Internship membangun software nyata.",
      acTalkingPoint: "Di Dibimbing, Front-End dijual terpisah kak, jadi kalau mau jadi Full Stack harus daftar FE dan BE sekaligus dengan biaya dobel, plus belajarnya 2-3 sesi per minggu via video rekaman LMS. Di RevoU FSSE, kakak langsung menguasai Full Stack Software Engineering lengkap (Front-End React/Next.js PLUS Back-End Node.js, database, dan AWS cloud) dengan 100% live class interaktif setiap hari, bimbingan code review baris-per-baris, dan 12 minggu Virtual Internship software riil sampai dapat kerja!"
    },

    // 5. DevOps Engineering (Batch 1)
    {
      id: "db-devops",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "DevOps Engineering Bootcamp",
      badge: "Batch 1 (Baru) · Online",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Kematangan Program",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (Program matang dengan ribuan alumni sukses di top tech unicorn & multinational, integrasi resmi AWS Partner Cloud).\n• Skema: Cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita.",
          competitorValue: "• Biaya Program: Bayar Hari Ini (biaya via admission WA 081227741541).\n• Status Program: **Baru berjalan Batch 1** (program perintis yang belum teruji rekam jejak lulusannya di pasar kerja).",
          highlight: true
        },
        {
          parameter: "Cakupan Kurikulum & Relevansi Karir",
          categoryTag: "KURIKULUM",
          revouValue: "Full Stack Software Engineering AI-Native: Pengembangan aplikasi end-to-end + CI/CD automated pipeline, Docker containerization, AWS Cloud Infrastructure, & monitoring sistem.",
          competitorValue: "Automation, CI/CD, containerization, infra management, deployment. Tools: Linux, Git, SSH, Virtual Machine, NGINX, Docker, Kubernetes, WSL, VS Code, Miro.",
          highlight: true
        },
        {
          parameter: "Format Belajar & Jam Interaksi Live",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online intensif harian malam (19:00–21:00 WIB) 4-5x seminggu (210+ jam live) bersama praktisi senior + 24/7 AI Learning Assistant.",
          competitorValue: "Online (Batch 1). Pre-bootcamp mandiri + 24 minggu bootcamp + 2 post + 4 Job Connect (±7,5 bulan). Sesi live Zoom 2–3x seminggu kombinasi rekaman video LMS.",
          highlight: true
        },
        {
          parameter: "Ekosistem Mentor & Network",
          categoryTag: "MENTOR & NETWORK",
          revouValue: "15.000+ alumni di 1.000+ top company (Gojek, Tokopedia, Traveloka, Shopee, Big 4, BUMN) dengan reputasi kurikulum yang diakui hiring manager.",
          competitorValue: "Mentor yang terdaftar baru dari 2 perusahaan: BTPN Syariah & SPE Solution.",
          highlight: false
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "**12 Minggu Virtual Internship** mendeploy dan memelihara aplikasi skala enterprise dengan arsitektur cloud nyata mitra korporasi.",
          competitorValue: "Tugas akhir mandiri/kelompok simulasi infrastruktur lokal.",
          highlight: true
        },
        {
          parameter: "Klaim Gaji & Prospek Karir",
          categoryTag: "KARIR & GAJI",
          revouValue: "Software Engineer / DevOps Engineer siap pakai dengan pendampingan karir 1-on-1 intensif Career+ sampai hired.",
          competitorValue: "Klaim gaji DevOps Engineer Rp 5,7–19,5jt; SRE Rp 10,1–19,6jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Program DevOps Dibimbing masih berstatus Batch 1 (program perintis yang belum memiliki track record lulusan/alumni teruji), mentor baru terdaftar dari 2 perusahaan, dan pembelajaran hanya 2-3 sesi seminggu berbasis video rekaman LMS.",
      revouEdge: "RevoU FSSE memiliki kurikulum software engineering & cloud deployment yang matang dan teruji bersama AWS Partner, didukung 15.000+ alumni di top company, 100% live class harian, dan 12 minggu Virtual Internship arsitektur riil.",
      acTalkingPoint: "Program DevOps di Dibimbing baru berjalan batch pertama (Batch 1) kak, sehingga rekam jejak alumni dan portofolio industrinya masih sangat muda dan mentornya baru dari 2 institusi. Kalau di RevoU FSSE, materi containerization Docker, CI/CD automated deployment, dan cloud infrastructure AWS diajarkan secara komprehensif dalam ekosistem Full Stack Software Engineering yang sudah teruji meluluskan ribuan alumni di top tech company, didukung 100% live class harian dan 12 minggu Virtual Internship!"
    },

    // 6. Quality Assurance (Batch 4)
    {
      id: "db-qa",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Quality Assurance Bootcamp",
      badge: "Batch 4 (Muda) · Online",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (all-in mencakup Full Stack Engineering, Testing Automation, CI/CD Test Gates, 3 bulan Virtual Internship, & Career+).\n• Cicilan: Opsi cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita.",
          competitorValue: "• Biaya Program: Bayar Hari Ini (biaya via WA 081227741541; tanpa refund dana, ada benefit gratis mengulang batch seumur hidup).",
          highlight: false
        },
        {
          parameter: "Kedalaman Arsitektur vs Testing Terisolasi",
          categoryTag: "ARSITEKTUR KODING",
          revouValue: "Memahami software arsitektur secara holistik (Front-End, Back-End API, Database, CI/CD automated testing pipeline, Unit/Integration/E2E testing), sehingga mampu menulis test script automation yang kokoh (level SDET).",
          competitorValue: "Fokus terisolasi pada Foundation QA, manual testing, API & DB testing, web/mobile automation dengan Selenium & Appium tanpa mendalami koding software development end-to-end.",
          highlight: true
        },
        {
          parameter: "Format Belajar & Alur Waktu",
          categoryTag: "FORMAT & DURASI",
          revouValue: "100% Live Instruction interaktif malam (19:00–21:00 WIB) Senin–Kamis (210+ jam live) bersama praktisi senior + bimbingan code review.",
          competitorValue: "Pre-bootcamp mandiri + 24 minggu bootcamp + 2 post + 4 Job Connect (±7,5 bulan). Sesi live Zoom 2–3x seminggu. Catatan: meta-description menyebut '5 bulan' vs alur 24 minggu; meta hiring partner tertulis '700+' vs body '1.100+'. Batch: Batch 4.",
          highlight: true
        },
        {
          parameter: "Tools & Testing Framework",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Automated test framework, Jest, Cypress/Playwright, Postman API testing, GitHub Actions CI/CD test gates, AWS Cloud, & AI code auditing.",
          competitorValue: "Jira, Miro, MySQL, VS Code, Selenium, Appium, GitHub, JMeter.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "**12 Minggu Virtual Internship** melakukan automated testing & QA pada sistem software enterprise nyata korporasi mitra.",
          competitorValue: "Studi kasus latihan dan portofolio tugas akhir mandiri/kelompok.",
          highlight: true
        },
        {
          parameter: "Mentor & Klaim Gaji",
          categoryTag: "KARIR & MENTOR",
          revouValue: "Software Development Engineer in Test (SDET) / Software Engineer dengan daya tawar gaji premium di tech unicorn didampingi Career+ 1-on-1.",
          competitorValue: "Job Connect 4 minggu. Mentor dari OCBC, NOICE, BCI Central, GoTo Financial, Stockbit, Chronicle. Klaim gaji: Manual Tester Rp 3–4jt, Software Tester Rp 7–8jt, QA Automation Rp 8–15jt, QA Engineer Rp 7–8,5jt, QA Lead Rp 10–20jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Program QA Dibimbing masih relatif muda (Batch 4), terdapat ketidaksinkronan data (meta sebut durasi 5 bulan vs alur 24 minggu, partner di meta 700+ vs body 1.100+), dan belajarnya hanya 2-3 sesi per minggu via video rekaman LMS.",
      revouEdge: "Di RevoU siswa memahami rekayasa software end-to-end sehingga penguasaan automated testing jauh lebih kokoh (level SDET), didukung 100% live class harian, dan 12 minggu Virtual Internship software riil.",
      acTalkingPoint: "Program QA Dibimbing baru batch ke-4 kak, belajarnya 2-3 sesi seminggu dengan video rekaman LMS dan ada inkonsistensi durasi di web mereka (meta 5 bulan vs alur 24 minggu). Nah di industri teknologi saat ini, perusahaan lebih mengutamakan SDET (Software Development Engineer in Test) yang paham arsitektur koding software end-to-end. Di RevoU FSSE, kakak menguasai software engineering lengkap sekaligus automated testing dan CI/CD pipeline dengan 100% live class harian dan 12 minggu Virtual Internship portofolio riil!"
    },

    // 7. Back-End Development (Batch 6+)
    {
      id: "db-be",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Back-End Development Bootcamp",
      badge: "Batch 6+ · Online",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Pembatasan Program",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (all-in mencakup Full Stack Back-End + Front-End + Cloud AWS + AI Agent, 3 bulan Virtual Internship, & Career+).\n• Cicilan: Opsi cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita.",
          competitorValue: "• Biaya Program: Bayar Hari Ini (biaya via admission WA 081227741541; estimasi promo Rp 7jt–15jt).\n• Pembatasan: Hanya mencakup Back-End terpisah tanpa modul Front-End (tidak full-stack).",
          highlight: false
        },
        {
          parameter: "Cakupan Arsitektur Software",
          categoryTag: "ARSITEKTUR KODING",
          revouValue: "Full Stack Engineering: Back-End API arsitektur mendalam (Node.js, Express, PostgreSQL, Database relational modeling, Auth/Security, Docker, AWS) PLUS Front-End modern (React, Next.js).",
          competitorValue: "Hanya Back-End terpisah: JavaScript dasar, Java, Spring Framework, MySQL, MongoDB, Docker. (Tidak mempelajari Front-End atau integrasi UI).",
          highlight: true
        },
        {
          parameter: "Format Belajar & Intensitas Kelas Live",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif malam (19:00–21:00 WIB) Senin–Kamis (210+ jam live) bersama praktisi senior + review kode baris-per-baris.",
          competitorValue: "Online (Batch 6+). Pre-bootcamp mandiri + 24 minggu bootcamp + 2 post + 4 Job Connect (±7,5 bulan). Sesi live Zoom 2–3x seminggu. Catatan: Footer halaman web masih pakai nama lama 'Data Science & AI Machine Learning', rating tertulis 4.9/5 SwitchUp & 4K+ lulusan (beda dari 10K+ di program lain).",
          highlight: true
        },
        {
          parameter: "Tech Stack & Integrasi Cloud",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "Node.js, Express, PostgreSQL, RESTful API, Docker, **AWS Partner Cloud Infrastructure**, & AI Coding Agents (Claude Code, Cursor).",
          competitorValue: "Draw.io, VS Code, MySQL, MongoDB, Git, Docker, JavaScript, Java, Spring Framework, GPT.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "Proyek mandiri standar industri + **12 Minggu Virtual Internship** mendeploy backend service skala enterprise untuk perusahaan partner riil.",
          competitorValue: "Tugas akhir mandiri/kelompok dan talent showcase ke partner.",
          highlight: true
        },
        {
          parameter: "Mentor & Klaim Gaji",
          categoryTag: "KARIR & MENTOR",
          revouValue: "Career+ 1-on-1 Personal Career Coach selama 7-8 bulan penuh sampai hired di top company. 15.000+ alumni.",
          competitorValue: "Job Connect 4 minggu. Mentor dari AccelByte, bynsm.io, GovTech Procurement, Srw&co, ParagonCorp, Amartha, Apotek Digital. Klaim gaji: BE Developer Rp 7–14jt, BE Engineer Rp 6–12jt, Software Engineer Rp 7–12jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Modul Back-End dijual terpisah dari Front-End (tidak full-stack), format pembelajaran 2-3 sesi seminggu dengan materi dominan rekaman video LMS, dan footer halaman masih mencantumkan nama program lama serta perbedaan statistik lulusan (4K+ vs 10K+).",
      revouEdge: "Di RevoU siswa langsung menguasai Full Stack Software Engineering lengkap dengan 210+ jam live instruction harian, bimbingan code review intensif, kemitraan cloud resmi AWS Partner, dan 12 minggu Virtual Internship backend enterprise riil.",
      acTalkingPoint: "Di Dibimbing, Back-End dipisah tersendiri dan belajarnya 2-3 sesi per minggu via materi rekaman LMS. Di era AI saat ini, tech company mencari engineer yang paham Full Stack end-to-end. Di RevoU FSSE, kakak menguasai arsitektur Back-End database dan API sekaligus Front-End dan Cloud AWS, didukung 100% live class interaktif setiap hari, dan 12 minggu Virtual Internship membangun backend sistem nyata perusahaan mitra sampai dapat kerja!"
    },

    // 8. Full-Stack Web Development (Online Batch 11, Offline JKT Batch 1)
    {
      id: "db-fs",
      competitorId: "dibimbing",
      competitorName: "Dibimbing",
      programTitle: "Full-Stack Web Development Bootcamp",
      badge: "Online (Batch 11) + Offline JKT (Batch 1)",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Opsi Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "• Biaya Program: Rp 19.500.000 – Rp 22.500.000 (Rp 19.5jt – 22.5jt all-in termasuk kurikulum AI, AWS Cloud Partner, 3 bulan Virtual Internship, & Career+ sampai hired).\n• Cicilan: Opsi cicilan fleksibel 3x sampai 12x via kartu kredit & Danacita.\n• Bebas Biaya Tambahan: Bebas biaya registrasi tersembunyi & tanpa biaya akomodasi kos.",
          competitorValue: "• Biaya Program: Bayar Hari Ini atau Cicilan (harga di-render dinamis via JS / estimasi promo Rp 7jt – Rp 15jt via WA 081227741541).\n• Refund: Non-refundable (tidak ada garansi refund dana).\n• Keunggulan: Opsi cicilan tersedia & gratis mengulang batch seumur hidup.",
          highlight: false
        },
        {
          parameter: "Format Belajar & Lokasi Kelas",
          categoryTag: "FORMAT KELAS",
          revouValue: "100% Live Online interaktif dua arah malam hari (19:00–21:00 WIB) Senin–Kamis (210+ jam live) bersama praktisi senior + 24/7 AI Learning Assistant. Fleksibel tanpa biaya kos.",
          competitorValue: "Pilihan Online (Batch 11), Offline Jakarta (BARU - Batch 1), atau Private Session. Sesi online 2–3x seminggu kombinasi rekaman video LMS.",
          highlight: true
        },
        {
          parameter: "Durasi & Kedalaman Kurikulum",
          categoryTag: "DURASI & KURIKULUM",
          revouValue: "8 Bulan komprehensif (5 Bulan Live Classes & 210+ Jam Kelas LIVE + 3 Bulan Virtual Internship / Real Company Project). 4 Fase AI-Native Software Engineering.",
          competitorValue: "Pre-bootcamp mandiri → 24 minggu bootcamp → 2 minggu post → 4 minggu Job Connect (total ±7,5 bulan). Batch: Online Batch 11, Offline Jakarta Batch 1.",
          highlight: true
        },
        {
          parameter: "Tech Stack & Integrasi Cloud",
          categoryTag: "TECH STACK & TOOLS",
          revouValue: "React, Next.js, TypeScript, Node.js, Express, PostgreSQL, REST API, Docker, **AWS Partner Cloud Infrastructure**, & AI Coding Agents (Claude Code, Cursor).",
          competitorValue: "VS Code, JavaScript, HTML, CSS, MySQL, MongoDB, React, Docker, Netlify, GitHub (MERN stack konvensional).",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek (Virtual Internship)",
          categoryTag: "PROYEK NYATA",
          revouValue: "**12 Minggu Virtual Internship** membangun dan mendeploy software web aplikasi skala enterprise untuk perusahaan partner riil.",
          competitorValue: "Tugas akhir mandiri/kelompok dan talent showcase ke 1.100+ hiring partner.",
          highlight: true
        },
        {
          parameter: "Mentor & Klaim Gaji",
          categoryTag: "KARIR & MENTOR",
          revouValue: "Career+ 1-on-1 Personal Career Coach selama 7-8 bulan penuh + AI Career Engine CV/LinkedIn + Mock Interview Hiring Manager. 15.000+ alumni di 1.000+ top company.",
          competitorValue: "Job Connect 4 minggu (Konsultasi 1-on-1, review CV & LinkedIn, talent showcase). Mentor dari bynsm.io, GovTech, Srw&co, ParagonCorp, Amartha, PrivyID, Apotek Digital, ex-BitHealth. Klaim gaji: Full-Stack Rp 5–10jt, FE Rp 6–10jt, BE Rp 6–12jt/bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Format offline Jakarta baru berjalan angkatan pertama (Batch 1), sesi online hanya 2–3 kali seminggu via rekaman materi LMS, stack masih MERN konvensional tanpa Next.js/TypeScript enterprise atau integrasi cloud AWS resmi, dan portofolio hanya tugas akhir tanpa virtual internship klien korporasi.",
      revouEdge: "8 Bulan komprehensif dengan 100% live class interaktif setiap malam (210+ jam live coding), kurikulum modern Next.js/TypeScript bersama AWS Partner, live code review baris-per-baris, dan 12 minggu Virtual Internship membangun software riil korporasi.",
      acTalkingPoint: "Dibimbing Full-Stack baru membuka offline Jakarta batch ke-1 dan format onlinenya hanya 2-3 sesi per minggu via materi rekaman LMS dengan MERN stack dasar. Di RevoU FSSE, kakak belajar 8 bulan komprehensif dengan 100% live class harian (210+ jam live interaktif), kurikulum modern Next.js dan TypeScript bersama AWS Partner, live code review baris-per-baris, dan 12 minggu Virtual Internship membangun software riil korporasi mitra serta bimbingan karir Career+ 1-on-1 sampai dapat kerja!"
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
  ],

  // ── 5. REWORK ACADEMY (Audit Scrape 13 Nov 2026) ──
  rework: [
    {
      id: "rw-ai",
      competitorId: "rework",
      competitorName: "Rework Academy",
      programTitle: "AI Engineering Bootcamp (Batch 5 Des 2026)",
      badge: "After-Work Live (12 Minggu / 20+ Sesi)",
      revouMatchProgram: "x BINUS: Applied AI, Analytics & Automation",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Fasilitas Karir",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 15.000.000 (Alumni/Mahasiswa: Rp 12.750.000) All-In termasuk sertifikasi resmi BINUS University & bimbingan karir terintegrasi.",
          competitorValue: "Normal Rp 10.000.000 (Final Seat Rp 2.499.900, hemat 75%). Cicilan mulai Rp 625rb/bln. Catatan: Career support 1:1 & magang TIDAK ADA (dijual terpisah di Career Accelerator).",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari (19:00–21:00 WIB) ramah pekerja & profesional tanpa perlu resign.",
          competitorValue: "Selasa & Jumat 19:30–22:00 WIB (~5 jam live/minggu, after-work).",
          highlight: false
        },
        {
          parameter: "Durasi & Total Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "12 Minggu komprehensif membedah strategi AI enterprise, automasi workflow n8n, AI Agents, dan Claude Code.",
          competitorValue: "12 Minggu (20 modul teknis + 3 minggu project kelompok).",
          highlight: false
        },
        {
          parameter: "Kurikulum & Tools AI",
          categoryTag: "KURIKULUM & AI",
          revouValue: "Kurikulum AI-Native Software Engineering & AI Executive: Python, Flask, Next.js, LLM API, Vector DB, Kiro AI spec-driven, Claude Code workflow, dan 12 minggu Virtual Internship.",
          competitorValue: "Kurikulum AI Engineering 20 modul teknis: Python, PyTorch, Deep Learning, Hugging Face, Gemini API, LangChain, LangGraph, Vector Search (FAISS/Pinecone), Docker, GCP Cloud Run, dan enterprise AI project 3 minggu.",
          highlight: true
        },
        {
          parameter: "Format Belajar & Tools",
          categoryTag: "METODE BELAJAR",
          revouValue: "100% Live Online dua arah + 24/7 AI Learning Assistant + modul AI-Native AWS Cloud.",
          competitorValue: "Online Zoom + rekaman lifetime. Kelas malam 19:30–22:00 WIB.",
          highlight: false
        },
        {
          parameter: "Proyek Portofolio Nyata",
          categoryTag: "PORTOFOLIO",
          revouValue: "Proyek automasi bisnis nyata korporasi & deployment production-ready AI solution.",
          competitorValue: "3 minggu project kelompok berbasis enterprise case (contoh: AI Customer Service Agent / Personal Finance Assistant).",
          highlight: true
        },
        {
          parameter: "Career Support & Penyaluran",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ didampingi 1:1 Personal Career Coach hingga siap kerja & mock interview hiring manager.",
          competitorValue: "TIDAK ADA di paket ini (mentoring karir 1:1 dan magang 1-3 bulan dialihkan ke Career Accelerator berbayar lain).",
          highlight: true
        },
        {
          parameter: "Sertifikasi & Kredensial Resmi",
          categoryTag: "KREDENSIAL",
          revouValue: "Professional Certificate resmi BINUS University bertaraf nasional & transfer SKS Magister.",
          competitorValue: "Official Certificate Rework Academy (PT. Tempat Bertumbuh Indonesia), tanpa kemitraan universitas.",
          highlight: true
        }
      ],
      competitorLimitation: "Fasilitas bimbingan karir 1-on-1 dan magang 1-3 bulan TIDAK ADA di paket Professional Bootcamp (dijual terpisah di paket Career Accelerator yang harganya dirahasiakan di web).",
      revouEdge: "Program RevoU x BINUS memberikan sertifikasi resmi universitas bergengsi BINUS University, modul automasi bisnis n8n & multi-agent enterprise, serta pendampingan karir all-in tanpa biaya tambahan tersembunyi.",
      acTalkingPoint: "Rework Academy harganya memang Rp 2,5 jutaan kak, tapi di paket tersebut belum termasuk bimbingan karir 1-on-1 maupun penyaluran magang (mereka pisahkan ke paket Career Accelerator berbayar lagi). Di RevoU x BINUS, kakak mendapatkan sertifikasi resmi BINUS University, kurikulum strategi AI & automasi bisnis enterprise, dan bimbingan karir all-in tanpa biaya tambahan."
    },
    {
      id: "rw-cyber",
      competitorId: "rework",
      competitorName: "Rework Academy",
      programTitle: "Cyber Security Bootcamp (Batch 15 Jan 2027)",
      badge: "After-Work Live (12 Minggu / 20+ Sesi)",
      revouMatchProgram: "x BINUS: Applied Cybersecurity & Cloud Protection",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Kemitraan Kampus",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Kemitraan resmi BINUS University & AWS Cloud Protection, transfer SKS akademik.",
          competitorValue: "Normal Rp 10.000.000 (Earlybird Rp 1.999.900, cicilan mulai Rp 500rb/bln). Sertifikat internal tanpa mitra kampus.",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Malam hari konsisten 19:00–21:00 WIB ramah profesional.",
          competitorValue: "Senin & Kamis 19:30–22:00 WIB (~5 jam/minggu).",
          highlight: false
        },
        {
          parameter: "Durasi & Kurikulum",
          categoryTag: "DURASI PROGRAM",
          revouValue: "12 Minggu terstruktur standar industri perbankan & cloud architecture bersama AWS.",
          competitorValue: "12 Minggu (20 modul: Red/Blue Team, Linux, Web Pentest, Burp Suite, SQLi, XSS, RCE, SOC, Wazuh).",
          highlight: false
        },
        {
          parameter: "Proyek Portofolio Nyata",
          categoryTag: "PORTOFOLIO",
          revouValue: "Portofolio enterprise cloud security audit & defense architecture.",
          competitorValue: "2 minggu kelompok: Website Security Assessment (peran Red Team) pada website mitra.",
          highlight: false
        },
        {
          parameter: "Career Support & Penyaluran",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career support terintegrasi untuk posisi cybersecurity analyst & SOC engineer.",
          competitorValue: "TIDAK ADA di paket ini (dialihkan ke paket Career Accelerator berbayar terpisah).",
          highlight: true
        },
        {
          parameter: "Sertifikasi & Kredensial",
          categoryTag: "KREDENSIAL",
          revouValue: "Sertifikat resmi BINUS University + Kemitraan AWS.",
          competitorValue: "Official Certificate & Cyber Security Badge internal Rework.",
          highlight: true
        }
      ],
      competitorLimitation: "Career support 1:1 dan magang dipisah ke paket berbayar lain; sertifikat murni internal tanpa kemitraan universitas.",
      revouEdge: "RevoU bermitra resmi dengan BINUS University dan AWS, kurikulum terakreditasi dengan transfer SKS Magister, serta bimbingan karir menyeluruh.",
      acTalkingPoint: "Di Rework Cyber Security biayanya sekitar Rp 2 juta kak, tapi belum ada penyaluran magang atau bimbingan karir 1-on-1 (harus upgrade ke paket lain). Kalau di RevoU x BINUS, programnya bermitra resmi dengan BINUS University dan AWS, kurikulum standar industri, dan portofolio enterprise langsung diakui recruiter."
    },
    {
      id: "rw-da",
      competitorId: "rework",
      competitorName: "Rework Academy",
      programTitle: "Data Analyst Bootcamp (Batch 15 Nov 2026)",
      badge: "After-Work Live (12 Minggu / 20+ Sesi)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 All-In 7 bulan komprehensif termasuk 12 minggu Virtual Internship & Career+.",
          competitorValue: "Normal Rp 10.000.000 (Earlybird Rp 1.999.900). Tanpa fasilitas karir di paket ini.",
          highlight: true
        },
        {
          parameter: "Durasi & Jam Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7-8 Bulan komprehensif (>210 jam live coding & konsultasi harian).",
          competitorValue: "12 Minggu (20 sesi live Zoom, 2x seminggu malam 19:30–22:00 WIB).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "SQL BigQuery, Python Pandas, Tableau, Looker Studio, Problem Solving C-level, dan Apache Airflow Automated ETL.",
          competitorValue: "Excel, PostgreSQL, pgAdmin, Looker Studio, Tableau, Python dasar, Gemini/ChatGPT.",
          highlight: true
        },
        {
          parameter: "Proyek Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship memegang dataset bisnis riil korporasi enterprise (Telkom OCA, Zurich).",
          competitorValue: "2 minggu simulasi dataset (diakui di web sebagai business case simulasi, bukan data perusahaan nyata).",
          highlight: true
        },
        {
          parameter: "Bimbingan Karir 1-on-1",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 Personal Career Coach selama 7-8 bulan hingga ditempatkan kerja.",
          competitorValue: "TIDAK ADA di paket ini (dijual di paket Career Accelerator terpisah).",
          highlight: true
        }
      ],
      competitorLimitation: "Durasi hanya 12 minggu (20+ sesi), proyek akhir berbasis dataset simulasi bukan perusahaan nyata, dan tidak ada bimbingan karir 1-on-1 di paket reguler.",
      revouEdge: "RevoU FSDA adalah program karir komprehensif 7 bulan dengan 12 minggu Virtual Internship memegang data korporat nyata dan bimbingan 1-on-1 Career+ hingga hired.",
      acTalkingPoint: "Rework Data Analyst itu program singkat 12 minggu dengan 20-an sesi dan tugas akhir simulasi tanpa bimbingan karir kak. Di RevoU FSDA, kita mendampingi 7 bulan penuh, ada 12 minggu Virtual Internship memegang data bisnis riil perusahaan seperti Telkom OCA/Zurich, dan didampingi Career Coach 1-on-1 sampai kakak tembus kerja!"
    }
  ],

  // ── 6. TEMPATBELAJAR (Audit Scrape 13 Nov 2026) ──
  tempatbelajar: [
    {
      id: "tb-dm-accelerator",
      competitorId: "tempatbelajar",
      competitorName: "TempatBelajar",
      programTitle: "Career Accelerator Digital Marketing Bootcamp",
      badge: "4 Bulan (2 Project + Magang Remote)",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Biaya & Skema Tier",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 14.900.000 – Rp 17.900.000 All-In (sudah termasuk Career+ 1-on-1 selama 7-8 bulan dan 12 minggu Virtual Internship).",
          competitorValue: "Normal Rp 30.000.000 (Earlybird Rp 6.999.900, Reguler Rp 9.999.900). Cicilan 2–4x via WA.",
          highlight: true
        },
        {
          parameter: "Jadwal & Format Kelas",
          categoryTag: "JADWAL KELAS",
          revouValue: "Senin–Jumat 19:00–21:00 WIB (100% Live interaktif setiap malam).",
          competitorValue: "Senin & Kamis 19:30–21:30 WIB (live Zoom 2x/minggu) + modul video rekaman mandiri (Sel, Rab, Jum).",
          highlight: true
        },
        {
          parameter: "Durasi & Total Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan komprehensif (12 modul end-to-end + 12 minggu Virtual Internship).",
          competitorValue: "4 Bulan (16 minggu: 8 mgg belajar + 8 mgg 2 project, 60+ sesi total).",
          highlight: false
        },
        {
          parameter: "Kurikulum, Silabus & Tools",
          categoryTag: "KURIKULUM & AI",
          revouValue: "12 Modul Digital Marketing AI-Native (Full-funnel Strategy, Social Media Organic, Paid Meta Ads, Google Ads, TikTok Ads, CRM Lifecycle, Technical SEO, Data Analytics GA4) + integrasi AI automation harian.",
          competitorValue: "18 Lesson (SEO 5 sesi, Landing Page Elementor 3 sesi, Marketplace 4 sesi, Social Media 4 sesi, Meta Ads 3 sesi, TikTok Ads 4 sesi, Google Ads 3 sesi, CRM 3 sesi, KOL 1 sesi, AI-Powered DM 5 sesi, Freelancing 2 sesi).",
          highlight: true
        },
        {
          parameter: "Skala Portofolio & Ads Budget",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship menangani campaign brand korporat besar dengan budget iklan jutaan rupiah.",
          competitorValue: "2 Project UMKM: Project 1 Strategi (2 minggu) + Project 2 Handle campaign UMKM (6 minggu) dengan budget s.d. Rp 1.000.000.",
          highlight: true
        },
        {
          parameter: "Dukungan Karir & Magang",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 Personal Career Coach selama 7-8 bulan hingga ditempatkan kerja + AI Career Engine & mock interview.",
          competitorValue: "6 minggu intensive private mentoring 1-on-1 pasca graduation + penyaluran magang remote (WFH) 1-3 bulan di agency mitra.",
          highlight: false
        },
        {
          parameter: "Kredensial & Kemitraan",
          categoryTag: "KREDENSIAL",
          revouValue: "RevoU Certificate + Kemitraan Universitas Top (ITB, BINUS, UI).",
          competitorValue: "Sertifikat PT. Tempat Berkarya Indonesia & rapor penilaian (tanpa kemitraan kampus).",
          highlight: true
        }
      ],
      competitorLimitation: "Sesi live hanya 2x seminggu (dominan video modul rekaman); skala portofolio dibatasi pada UMKM mikro budget 1jt; bimbingan karir dibatasi 6 minggu setelah kelulusan.",
      revouEdge: "RevoU FSDM mendampingi 7 bulan penuh dengan 5x live class intensif per minggu, 12 minggu Virtual Internship memegang budget ads jutaan rupiah brand enterprise, dan pendampingan 1:1 Career Coach selama 7-8 bulan sampai ditempatkan kerja.",
      acTalkingPoint: "Di TempatBelajar ada versi Professional 3 bulan (Rp 4jt-an) tapi belum ada magang dan bimbingan 1:1, sedangkan versi Career Accelerator 4 bulan biayanya Rp 7jt – Rp 10jt dengan budget iklan UMKM 1 juta. Kalau di RevoU FSDM, program kita 7 bulan intensif, 100% live class setiap hari, memegang real ads budget jutaan rupiah untuk brand enterprise, dan didampingi 1:1 Career Coach selama 7-8 bulan sampai hired!"
    },
    {
      id: "tb-dm-pro",
      competitorId: "tempatbelajar",
      competitorName: "TempatBelajar",
      programTitle: "Professional Digital Marketing Bootcamp",
      badge: "3 Bulan (Upskilling Tanpa Magang)",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Biaya & Keterbatasan Paket",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 14.900.000 – Rp 17.900.000 All-In komprehensif termasuk karir dan Virtual Internship.",
          competitorValue: "Normal Rp 20.000.000 (Earlybird Rp 3.999.900, 2nd Wave Rp 4.999.900 – Rp 5.999.900). Mentoring karir 1:1 dan magang TIDAK ADA.",
          highlight: true
        },
        {
          parameter: "Durasi & Total Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan komprehensif + 12 minggu Virtual Internship brand besar.",
          competitorValue: "3 Bulan (12 minggu: 8 mgg belajar + 4 mgg 1 project UMKM budget Rp 700rb, 54+ sesi total).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Cakupan Materi",
          categoryTag: "KURIKULUM & TOOLS",
          revouValue: "12 Modul full-funnel digital marketing komprehensif + hands-on budget campaign nyata & live mentoring harian.",
          competitorValue: "14 Lesson materi dasar upskilling (tanpa materi AI intensif 5 sesi, tanpa materi freelancing, dan tanpa modul campaign lanjutan).",
          highlight: true
        },
        {
          parameter: "Portofolio yang Dihasilkan",
          categoryTag: "PORTOFOLIO",
          revouValue: "Hingga 13 portofolio nyata terverifikasi (termasuk Virtual Internship 12 minggu memecahkan real case partner korporasi besar).",
          competitorValue: "Hanya 1 project strategi UMKM (4 minggu) dengan budget ads terbatas s.d. Rp 700.000.",
          highlight: true
        },
        {
          parameter: "Career Support",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 Personal Career Coach 7-8 bulan sampai dapat kerja.",
          competitorValue: "TIDAK ADA di paket Professional (harus upgrade ke Career Accelerator).",
          highlight: true
        }
      ],
      competitorLimitation: "Paket Professional 3 bulan sama sekali tidak memiliki fasilitas bimbingan karir 1-on-1 maupun penyaluran magang; kuota kelas besar ± 55 peserta.",
      revouEdge: "RevoU selalu menyertakan Career+ bimbingan 1:1 penuh dan 12 minggu Virtual Internship tanpa memotong fasilitas penting untuk karir.",
      acTalkingPoint: "Paket TempatBelajar yang Rp 3,9 juta itu versi Professional tanpa bimbingan karir 1-on-1 maupun magang kak. Kalau di RevoU, investasi sudah all-in 7 bulan lengkap dengan 12 minggu Virtual Internship dan pendampingan kerja Career+ sampai hired."
    },
    {
      id: "tb-hr-accelerator",
      competitorId: "tempatbelajar",
      competitorName: "TempatBelajar",
      programTitle: "Career Accelerator Human Resource Bootcamp",
      badge: "4 Bulan (2 Project + Demo HRIS + Magang)",
      revouMatchProgram: "Strategic HR with AI",
      revouMatchBadge: "Strategic HR",
      tableRows: [
        {
          parameter: "Biaya & Level Target Karir",
          categoryTag: "INVESTASI & LEVEL TARGET",
          revouValue: "Program strategis untuk profesional yang ingin naik kelas menjadi HRBP, Organization Development (OD), People Analytics, atau Head of HR.",
          competitorValue: "• Career Accelerator: Normal Rp 30jt | Earlybird Rp 6.999.900 | Reguler Rp 8.999.900 (fokus staf HR operasional & administrasi). \n• Professional: Rp 3.499.900 (tanpa karir/magang).",
          highlight: true
        },
        {
          parameter: "Integrasi AI & Tools Modern",
          categoryTag: "KURIKULUM & AI",
          revouValue: "AI diajarkan sejak Minggu 0 sebagai metodologi kerja harian HR (AI Hiring workflow, prompt engineering, People Strategy C-level).",
          competitorValue: "Materi HR operasional konvensional (UU ketenagakerjaan, payroll PPh 21, demo Gajihub/Gaji.id) + 1 lesson pengenalan AI for HR.",
          highlight: true
        },
        {
          parameter: "Portofolio yang Dihasilkan",
          categoryTag: "PORTOFOLIO",
          revouValue: "7 portofolio strategis nyata (People Strategy Proposal, OD Case, Talent Map 9-box & Succession, Integrated Capstone 6 bulan).",
          competitorValue: "2 project: HRM Strategy 4 minggu + Recruitment Simulation (screening & interview) 4 minggu.",
          highlight: true
        },
        {
          parameter: "Profil Mentor Pengajar",
          categoryTag: "MENTOR & INSTRUKTUR",
          revouValue: "Senior HR Leaders dengan pengalaman 10+ tahun yang aktif memimpin divisi HR di korporasi besar Indonesia.",
          competitorValue: "24 mentor praktisi HR campuran (recruiter, HR specialist, HR analyst).",
          highlight: false
        },
        {
          parameter: "Career Support & Penyaluran",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Pendampingan karir strategis untuk promosi manajerial / HRBP.",
          competitorValue: "6 minggu mentoring private 1-on-1 + magang remote (WFH) 1-3 bulan.",
          highlight: false
        }
      ],
      competitorLimitation: "Fokus pada peran staf HR operasional/entry-level (administrasi, payroll, screening CV dasar, demo software HRIS); materi AI hanya 1 lesson tambahan.",
      revouEdge: "RevoU Strategic HR with AI dirancang untuk mencetak HRBP, Manager, dan Head of HR dengan penguasaan AI workflows harian, 7 portofolio strategis C-level, dan mentoring oleh Senior HR Leaders.",
      acTalkingPoint: "TempatBelajar HR itu bagus untuk teman-teman yang baru mau masuk ke level staf administrasi HR operasional (payroll, absensi, screening CV) seharga Rp 7jt-an di paket Career Accelerator kak. Namun kalau tujuan kakak ingin naik kelas menjadi HRBP, Senior HR, atau Head of HR yang dipercaya manajemen C-level, RevoU Strategic HR with AI melatih kakak menguasai Organization Design, Talent Strategy, dan AI Workflows harian dengan 7 portofolio strategis nyata yang dibimbing langsung oleh Senior HR Director!"
    },
    {
      id: "tb-hr-pro",
      competitorId: "tempatbelajar",
      competitorName: "TempatBelajar",
      programTitle: "Professional Human Resource Bootcamp",
      badge: "3 Bulan (Upskilling Tanpa Magang)",
      revouMatchProgram: "Strategic HR with AI",
      revouMatchBadge: "Strategic HR",
      tableRows: [
        {
          parameter: "Biaya & Keterbatasan Paket",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "RevoU Strategic HR: 4 Bulan intensif membedah peran strategis HRBP & People Strategy C-level.",
          competitorValue: "Normal Rp 20.000.000 (Earlybird Rp 3.499.900, 2nd Wave Rp 4.999.900). Mentoring karir 1:1 dan magang TIDAK ADA.",
          highlight: true
        },
        {
          parameter: "Durasi & Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "4 Bulan (3 sesi live malam/minggu, 10–12 jam/minggu, 50+ jam live instruction).",
          competitorValue: "3 Bulan (30+ sesi gabungan live Zoom Sel & Jum + video rekaman).",
          highlight: false
        },
        {
          parameter: "Kurikulum & Cakupan Materi",
          categoryTag: "KURIKULUM & AI",
          revouValue: "Kurikulum Strategic HR with AI (People Analytics, Org Development, Talent Management 9-Box, AI Hiring workflow, C-level People Strategy).",
          competitorValue: "12 Lesson dasar operasional HR (UU Ketenagakerjaan dasar, PPh 21, demo HRIS Gajihub) tanpa modul People Analytics mendalam dan tanpa AI workflow.",
          highlight: true
        },
        {
          parameter: "Portofolio yang Dihasilkan",
          categoryTag: "PORTOFOLIO",
          revouValue: "7 portofolio strategis nyata (People Strategy Proposal, OD Case, Talent Map 9-box & Succession, Integrated Capstone).",
          competitorValue: "Hanya 1 project simulasi strategi HRM (4 minggu); project recruitment simulation ditiadakan di paket Professional.",
          highlight: true
        },
        {
          parameter: "Dukungan Karir",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Mentoring karir level pimpinan / HRBP.",
          competitorValue: "TIDAK ADA di paket Professional ini.",
          highlight: true
        }
      ],
      competitorLimitation: "Tanpa pendampingan karir 1:1 dan tanpa penyaluran magang; kurikulum terbatas pada administrasi staf operasional.",
      revouEdge: "RevoU melatih leadership HR menyeluruh dengan 7 portofolio strategis siap presentasi ke C-level.",
      acTalkingPoint: "Paket TempatBelajar HR Rp 3,5 juta itu hanya modul teori dan 1 proyek tanpa fasilitas magang atau bimbingan karir kak. Di RevoU Strategic HR with AI, kakak dilatih langsung oleh Senior HR Director untuk naik level ke posisi HRBP & Head of HR."
    }
  ],

  // ── 7. DICODING BOOTCAMP (Audit Scrape 13 Nov 2026) ──
  dicoding: [
    {
      id: "dc-web",
      competitorId: "dicoding",
      competitorName: "Dicoding",
      programTitle: "Bangun Aplikasi Web Lengkap dengan React + Django",
      badge: "Self-Paced 20 Minggu (Batch 18, 11 Jan 2027)",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Format Belajar & Live Sessions",
          categoryTag: "METODE BELAJAR",
          revouValue: "100% Live Instruction interaktif harian (>210 jam live coding) bersama praktisi industri aktif.",
          competitorValue: "Dominan Self-Paced membaca teks modul & quiz di LMS, hanya 10+ sesi tatap muka online dalam 20 minggu (1 sesi per 2 minggu).",
          highlight: true
        },
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 19.500.000 – Rp 22.500.000 All-In dengan Career+ 1:1 personal coach untuk semua siswa eligible.",
          competitorValue: "Normal Rp 14.000.000 (Promo 11.11 bayar penuh Rp 5.040.000; Cicil 3x Rp 5.320.000; Cicil 5x Rp 5.600.000).",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Senin–Jumat 19:00–21:00 WIB (kelas malam konsisten, tidak perlu resign).",
          competitorValue: "Self-paced komitmen 5-6 jam/hari membaca modul platform Dicoding.",
          highlight: false
        },
        {
          parameter: "Durasi & Materi Teknis",
          categoryTag: "DURASI PROGRAM",
          revouValue: "8 Bulan komprehensif (5 Bulan Live Class + 3 Bulan Virtual Internship software riil).",
          competitorValue: "20 Minggu (326 jam teknis mandiri: Web dasar, JS, React, Python, Django, bonus Back-end).",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship mengerjakan software riil perusahaan mitra + kurikulum AI-Native bersama AWS.",
          competitorValue: "Capstone project tim 90 jam (aplikasi web mandiri seperti platform food waste / web kos).",
          highlight: false
        },
        {
          parameter: "Dukungan Karir & Screening",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 coaching menyeluruh untuk seluruh siswa eligible hingga dapat kerja.",
          competitorValue: "Career prep 2 jam; screening awal hiring partner diprioritaskan HANYA untuk lulusan terbaik.",
          highlight: true
        },
        {
          parameter: "Sertifikasi & Kredensial",
          categoryTag: "KREDENSIAL",
          revouValue: "Sertifikat RevoU bertaraf internasional + AWS Cloud Partner.",
          competitorValue: "Sertifikat Kelulusan Dicoding Akademi (Google Authorized Training Partner).",
          highlight: false
        }
      ],
      competitorLimitation: "Format 90% self-paced mandiri membaca modul teks dengan hanya 10 sesi live selama 5 bulan, rentan kejenuhan belajar dan screening karir hanya difokuskan pada lulusan terbaik.",
      revouEdge: "RevoU FSSE berbasis 100% live coding harian bersama praktisi, kurikulum AI-Native bersama AWS, 12 minggu Virtual Internship, dan bimbingan karir 1:1 untuk seluruh siswa eligible.",
      acTalkingPoint: "Dicoding platform belajar yang bagus kalau kakak tipe otodidak mandiri membaca modul teks 5-6 jam sehari kak, karena sesi live-nya hanya sekitar 10 kali dalam 5 bulan. Di RevoU, kita 100% live interaktif setiap hari, ada bimbingan langsung dua arah, 12 minggu Virtual Internship, dan pendampingan 1-on-1 Career+ sampai dapat kerja."
    },
    {
      id: "dc-ds",
      competitorId: "dicoding",
      competitorName: "Dicoding",
      programTitle: "Kuasai Data Science dari Analisis hingga Machine Learning",
      badge: "Self-Paced 20 Minggu (Batch 18, 11 Jan 2027)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema Pembayaran",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 All-In 7 bulan komprehensif termasuk 12 minggu Virtual Internship data riil.",
          competitorValue: "Normal Rp 14.000.000 (Promo 11.11 bayar penuh Rp 5.040.000; Cicil 3x Rp 5.320.000; Cicil 5x Rp 5.600.000).",
          highlight: true
        },
        {
          parameter: "Format & Interaktivitas",
          categoryTag: "METODE BELAJAR",
          revouValue: "100% Live Instruction interaktif setiap hari (4-5 sesi live/minggu, >80 sesi live interaktif).",
          competitorValue: "Self-paced 317 jam materi teks + hanya 10+ sesi live tatap muka bersama praktisi dalam 20 minggu.",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Senin–Jumat 19:00–21:00 WIB (didampingi Section Manager & Mentor harian).",
          competitorValue: "Mandiri 5-6 jam/hari di platform Dicoding.",
          highlight: false
        },
        {
          parameter: "Cakupan Materi & ETL",
          categoryTag: "KURIKULUM",
          revouValue: "SQL BigQuery, Python Pandas, Tableau, Looker Studio, Problem Solving bisnis C-level, dan Apache Airflow ETL.",
          competitorValue: "Dasar data science, Python (60 jam), Visualisasi (16 jam), Machine Learning (90 jam), Analisis Fundamental (70 jam), Matematika DS (70 jam).",
          highlight: true
        },
        {
          parameter: "Proyek Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship memegang dataset bisnis riil enterprise (Telkom OCA, Zurich).",
          competitorValue: "Capstone project tim 90 jam (contoh: Arah Belajar AI rekomendasi belajar).",
          highlight: false
        },
        {
          parameter: "Dukungan Karir",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 Personal Career Coach selama 7-8 bulan penuh untuk semua siswa eligible.",
          competitorValue: "Career prep 2 jam; screening awal partner diprioritaskan hanya untuk lulusan terbaik.",
          highlight: true
        }
      ],
      competitorLimitation: "Sangat minim interaksi langsung (hanya 10 sesi tatap muka dalam 20 minggu), materi didominasi modul teks mandiri di LMS.",
      revouEdge: "Format 100% live interaktif harian dengan review kode baris-per-baris, kurikulum analitik bisnis komprehensif, dan portofolio nyata bersama mitra enterprise.",
      acTalkingPoint: "Dicoding sangat bagus untuk pembelajar mandiri yang disiplin membaca modul kak. Tapi untuk data science, diskusi logika bisnis dan live review kode harian di RevoU jauh lebih efektif untuk memastikan pemahaman mendalam tanpa rasa jenuh!"
    }
  ],

  // ── 8. MYSKILL (Audit Scrape 13 Nov 2026) ──
  myskill: [
    {
      id: "ms-da",
      competitorId: "myskill",
      competitorName: "MySkill",
      programTitle: "Data Analysis: Fullstack Intensive Bootcamp (Batch 31)",
      badge: "Live Zoom 7 Minggu (25 Nov 2026 - 15 Jan 2027)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Transparansi",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 All-In 7 bulan tanpa biaya tambahan tersembunyi.",
          competitorValue: "Rp 650.000 (Late Sale Rp 1.100.000). Catatan: Final project tim opsional dengan BIAYA TAMBAHAN terpisah.",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Senin–Jumat 19:00–21:00 WIB (4-5 sesi live interaktif setiap minggu).",
          competitorValue: "Senin, Rabu, Jumat 19:30–21:30 WIB (16 sesi live Zoom total).",
          highlight: false
        },
        {
          parameter: "Durasi & Jam Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan komprehensif (>210 jam live instruction + 12 minggu Virtual Internship data riil).",
          competitorValue: "±7 Minggu (16 sesi live Zoom, rekaman tersedia).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "SQL BigQuery, Python Pandas/Numpy, Tableau, Looker Studio, Problem Solving C-level, Apache Airflow ETL.",
          competitorValue: "PostgreSQL, Python (Numpy, Pandas dasar), Google Data Studio / Looker Studio.",
          highlight: false
        },
        {
          parameter: "Proyek Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship memegang dataset bisnis riil perusahaan mitra (Telkom OCA, Zurich).",
          competitorValue: "Latihan tugas per sesi; final project tim opsional dengan biaya tambahan terpisah.",
          highlight: true
        },
        {
          parameter: "Dukungan Karir",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 Personal Career Coach selama 7 bulan penuh hingga ditempatkan kerja.",
          competitorValue: "1 sesi Career Class (review HR CV & interview) + template CV/surat lamaran. Tanpa bimbingan 1-on-1.",
          highlight: true
        },
        {
          parameter: "Sertifikasi",
          categoryTag: "KREDENSIAL",
          revouValue: "Sertifikasi Resmi Universitas Top (ITB, BINUS, UI) + RevoU Certificate.",
          competitorValue: "e-Certificate MySkill (PT. Linimuda Inspirasi Negeri).",
          highlight: true
        }
      ],
      competitorLimitation: "Format kursus kilat 7 minggu (16 sesi); final project dikenakan biaya tambahan terpisah; tanpa bimbingan karir 1-on-1 intensif.",
      revouEdge: "Program karir komprehensif dari nol hingga siap kerja di top company dengan 12 minggu Virtual Internship data riil dan pendampingan Career+ 1:1.",
      acTalkingPoint: "MySkill itu bagus untuk pengenalan dasar 1,5 bulan seharga ratusan ribu kak. Tapi materinya masih sangat dasar, untuk final project ada biaya tambahan, dan tidak ada bimbingan karir 1-on-1. Di RevoU FSDA, kita dampingi 7 bulan penuh, ada 12 minggu Virtual Internship data perusahaan riil, dan didampingi Career Coach sampai dapat kerja."
    },
    {
      id: "ms-dm",
      competitorId: "myskill",
      competitorName: "MySkill",
      programTitle: "Digital Marketing: Fullstack Intensive Bootcamp (Batch 39)",
      badge: "Live Zoom 6 Minggu (18 Nov - 30 Des 2026)",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Biaya & Final Project",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 14.900.000 – Rp 17.900.000 All-In komprehensif termasuk ads budget jutaan rupiah.",
          competitorValue: "Rp 650.000 (Late Sale Rp 1.100.000). Final project tim opsional dengan BIAYA TAMBAHAN terpisah.",
          highlight: true
        },
        {
          parameter: "Jadwal & Komitmen Waktu",
          categoryTag: "JADWAL KELAS",
          revouValue: "Senin–Jumat 19:00–21:00 WIB (5x live seminggu).",
          competitorValue: "Senin, Rabu, Jumat 19:30–21:30 WIB (18 sesi live Zoom total).",
          highlight: false
        },
        {
          parameter: "Durasi & Jam Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan (12 modul end-to-end + 12 minggu Virtual Internship) mencakup Performance, SEO/GEO, CRM, Analytics.",
          competitorValue: "±6 Minggu (18 sesi live Zoom kilat, Sen, Rab, Jum 19:30–21:30 WIB).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools Digital Marketing",
          categoryTag: "KURIKULUM & TOOLS",
          revouValue: "12 Modul full-funnel digital marketing (Meta Ads, Google Ads, TikTok Ads, SEO/GEO, CRM, Analytics GA4, AI Copywriting) + real ads budget jutaan rupiah.",
          competitorValue: "18 sesi pengantar: Social Media Organic, Copywriting, Ads overview (Meta & Google), Basic SEO, dan Basic Reporting (tanpa hands-on ads budget nyata).",
          highlight: true
        },
        {
          parameter: "Portofolio & Ads Budget",
          categoryTag: "PORTOFOLIO",
          revouValue: "Menangani campaign riil brand korporasi dengan budget jutaan rupiah secara mandiri.",
          competitorValue: "Mini portofolio di tiap kelas + final project tim opsional dengan biaya tambahan.",
          highlight: true
        },
        {
          parameter: "Dukungan Karir",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "16 sesi LIVE Career Coach + 1:1 Personal Career Coach selama 7-8 bulan penuh.",
          competitorValue: "1 sesi Career Class: CV & Interview Preparation + template CV (ID/EN).",
          highlight: true
        }
      ],
      competitorLimitation: "Kursus kilat 6 minggu, final project tim dikenakan biaya tambahan, tanpa bimbingan 1:1 career coach.",
      revouEdge: "Pendidikan digital marketing paling teruji di SEA dengan 12 minggu Virtual Internship memegang budget ads jutaan rupiah dan bimbingan karir intensif.",
      acTalkingPoint: "MySkill itu kursus kilat 6 minggu yang cocok untuk overview pengenalan dasar kak. Di RevoU FSDM, kakak dilatih 7 bulan komprehensif memegang real ads budget jutaan rupiah, tanpa biaya tambahan untuk final project, dan didampingi 1:1 Career Coach sampai tembus kerja di top company."
    },
    {
      id: "ms-lovable",
      competitorId: "myskill",
      competitorName: "MySkill",
      programTitle: "Website Development with Lovable AI (Batch 16)",
      badge: "Live Zoom 5 Minggu (3 Des 2026 - 7 Jan 2027)",
      revouMatchProgram: "Full Stack Software Engineering (FSSE)",
      revouMatchBadge: "FSSE",
      tableRows: [
        {
          parameter: "Biaya & Model Belajar",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 19.500.000 – Rp 22.500.000 program karir software engineering profesional siap kerja.",
          competitorValue: "Rp 230.000 (Early Sale Rp 500rb, Late Sale Rp 1.000.000).",
          highlight: true
        },
        {
          parameter: "Durasi & Total Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "8 Bulan komprehensif (>210 jam live instruction + 3 bulan Virtual Internship).",
          competitorValue: "±5 Minggu (hanya 8 sesi live class, Selasa & Kamis 19:30–21:30 WIB).",
          highlight: true
        },
        {
          parameter: "Cakupan Materi & Engineering",
          categoryTag: "KURIKULUM",
          revouValue: "8 Bulan Software Engineering AI-Native x AWS (Python, Flask, Next.js, TypeScript, Cloud Architecture).",
          competitorValue: "8 sesi live class ringkas fokus pada prompt builder website no-code (Lovable AI, HTML, CSS dasar).",
          highlight: true
        },
        {
          parameter: "Tingkat Kesiapan Kerja",
          categoryTag: "OUTCOME KERJA",
          revouValue: "Kualifikasi Software Engineer profesional yang siap kerja di tech unicorns & perbankan.",
          competitorValue: "Pembuatan website prototipe portofolio mini untuk non-IT.",
          highlight: true
        }
      ],
      competitorLimitation: "Hanya 8 sesi pengenalan prompt builder web no-code (Lovable AI), tidak mencukupi untuk kualifikasi Software Engineer profesional.",
      revouEdge: "RevoU FSSE adalah program AI-Native Software Engineering pertama di Indonesia bersama AWS Cloud, melatih dari fondasi algoritma hingga fullstack enterprise.",
      acTalkingPoint: "Kelas MySkill Lovable itu kursus no-code 8 sesi untuk eksplorasi AI builder kak. Kalau kakak ingin jadi Software Engineer profesional yang dicari recruiter teknologi, di RevoU FSSE kakak belajar 8 bulan mendalam bersama AWS Cloud dan portofolio software riil!"
    }
  ],

  // ── 9. FULL STACK BANGALORE (Audit Scrape 13 Nov 2026) ──
  fullstackbangalore: [
    {
      id: "fsb-da",
      competitorId: "fullstackbangalore",
      competitorName: "Full Stack Bangalore",
      programTitle: "Bootcamp Data Analyst & Visualization",
      badge: "Live Zoom 4 Minggu (10 Sesi)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Transparansi Mentor",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 17.900.000 – Rp 20.900.000 diajar praktisi lead terverifikasi dari tech unicorns (nama & perusahaan transparan).",
          competitorValue: "Promo Rp 149.000 (Normal Rp 599.000) via Lynk.id dengan mentor anonim (nama pengajar tidak dicantumkan di web).",
          highlight: true
        },
        {
          parameter: "Durasi & Jam Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan komprehensif (>210 jam live instruction harian + 12 minggu Virtual Internship).",
          competitorValue: "4 Minggu (10 sesi live Zoom, weekday malam + weekend).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "SQL BigQuery, Python Pandas, Tableau, Looker Studio, Problem Solving C-level, Apache Airflow ETL.",
          competitorValue: "CRISP-DM, SQL (SELECT, WHERE, JOIN, GROUP BY), Python (Pandas, Matplotlib, Seaborn), Power BI Dashboard, mini pitching.",
          highlight: true
        },
        {
          parameter: "Proyek Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship memegang dataset bisnis riil perusahaan mitra (Telkom OCA, Zurich).",
          competitorValue: "1 mini project end-to-end.",
          highlight: false
        },
        {
          parameter: "Career Support",
          categoryTag: "DUKUNGAN KARIR",
          revouValue: "Career+ 1:1 Personal Career Coach selama 7-8 bulan sampai ditempatkan kerja.",
          competitorValue: "Free kelas career preparation (webinar/materi umum).",
          highlight: true
        }
      ],
      competitorLimitation: "Workshop pengenalan kilat 10 sesi dengan mentor anonim tanpa nama, tanpa 1-on-1 bimbingan karir atau akreditasi resmi.",
      revouEdge: "7 bulan komprehensif dari nol hingga profesional, instruktur terverifikasi, 12 minggu Virtual Internship data riil, dan Career+ 1:1.",
      acTalkingPoint: "FSB itu workshop kilat 10 sesi seharga 149 ribu untuk melihat demo tools kak. Di RevoU, kakak belajar 7 bulan intensif bersama instruktur terverifikasi dari top unicorn, ada 12 minggu Virtual Internship, dan bimbingan 1-on-1 Career+ sampai dapat kerja!"
    },
    {
      id: "fsb-de",
      competitorId: "fullstackbangalore",
      competitorName: "Full Stack Bangalore",
      programTitle: "Bootcamp Data Engineer",
      badge: "Live Zoom 4 Minggu (10 Sesi)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Model Belajar",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Program karir komprehensif 7 bulan dengan Apache Airflow & Automated ETL.",
          competitorValue: "Promo Rp 149.000 (Normal Rp 599.000).",
          highlight: true
        },
        {
          parameter: "Durasi & Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan (>80 sesi live interaktif harian).",
          competitorValue: "4 Minggu (10 sesi live Zoom).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "Production ETL, Data Pipeline, Apache Airflow, SQL Data Warehouse.",
          competitorValue: "Python Pandas, PostgreSQL, API JSON integration, cron automation, mini DWH star schema, Metabase/Grafana, preview Airflow DAG.",
          highlight: false
        },
        {
          parameter: "Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship enterprise dataset.",
          competitorValue: "1 pipeline end-to-end showcase project.",
          highlight: false
        }
      ],
      competitorLimitation: "Hanya 10 sesi demo pengenalan tools data engineering, mentor anonim tanpa nama di web.",
      revouEdge: "RevoU mengintegrasikan automated ETL dengan pemahaman bisnis nyata korporasi dan pendampingan kerja Career+.",
      acTalkingPoint: "Kelas Data Engineer FSB seharga 149 ribu itu pengenalan ringkas tools seperti PostgreSQL dan cron selama 4 minggu kak. Di RevoU, otomatisasi ETL dipelajari secara mendalam bersama studi kasus bisnis riil dan pendampingan karir 1-on-1."
    },
    {
      id: "fsb-ai",
      competitorId: "fullstackbangalore",
      competitorName: "Full Stack Bangalore",
      programTitle: "Bootcamp AI Engineer",
      badge: "Live Zoom 4 Minggu (10 Sesi)",
      revouMatchProgram: "x BINUS: Applied AI, Analytics & Automation",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Kredensial",
          categoryTag: "INVESTASI & KREDENSIAL",
          revouValue: "Professional Certificate resmi BINUS University (72 jam pembelajaran terakreditasi).",
          competitorValue: "Promo Rp 149.000 (Normal Rp 599.000). Sertifikat FSB tanpa akreditasi.",
          highlight: true
        },
        {
          parameter: "Durasi & Format",
          categoryTag: "DURASI PROGRAM",
          revouValue: "3 Bulan (12 Minggu) komprehensif membedah strategi AI enterprise, automasi n8n, AI Agents.",
          competitorValue: "4 Minggu (10 sesi live Zoom, rekaman selamanya).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "AI Agents, Claude Code, automasi proses bisnis, etika & keamanan data korporasi.",
          competitorValue: "Python, scikit-learn, TensorFlow/Keras lite, Streamlit, Hugging Face Spaces, MLflow, GitHub.",
          highlight: false
        },
        {
          parameter: "Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "Working AI agent & automation solution untuk workflow bisnis korporasi.",
          competitorValue: "1 AI web app dideploy ke Streamlit / Hugging Face Spaces.",
          highlight: false
        }
      ],
      competitorLimitation: "Workshop pengenalan dasar 10 sesi dengan mentor anonim; copy di halaman bahkan masih tertulis sisa copy 'siap jadi Data Engineer pemula'.",
      revouEdge: "RevoU x BINUS memberikan kredensial universitas bergengsi dan keterampilan automasi AI yang langsung dapat diimplementasikan di tempat kerja.",
      acTalkingPoint: "Kelas AI Engineer FSB itu workshop pengenalan 10 sesi seharga 149 ribu kak. Di RevoU x BINUS, kakak diajarkan strategi implementasi AI & automasi bisnis enterprise dengan sertifikasi resmi BINUS University yang bernilai tinggi!"
    },
    {
      id: "fsb-ds",
      competitorId: "fullstackbangalore",
      competitorName: "Full Stack Bangalore",
      programTitle: "Bootcamp Data Scientist & Machine Learning",
      badge: "Live Zoom 4 Minggu (10 Sesi)",
      revouMatchProgram: "Full Stack Data Analytics (FSDA)",
      revouMatchBadge: "FSDA",
      tableRows: [
        {
          parameter: "Biaya & Skema",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Program karir komprehensif 7 bulan dengan bimbingan 1:1 Career+.",
          competitorValue: "Promo Rp 149.000 (Normal Rp 599.000).",
          highlight: true
        },
        {
          parameter: "Durasi & Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan (>210 jam live instruction harian).",
          competitorValue: "4 Minggu (10 sesi live Zoom).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "SQL BigQuery, Python, Tableau, Looker Studio, Problem Solving bisnis.",
          competitorValue: "CRISP-DM, Pandas fundamental, EDA Matplotlib/Seaborn, Regresi/KNN, Streamlit Cloud.",
          highlight: false
        },
        {
          parameter: "Portofolio",
          categoryTag: "PORTOFOLIO",
          revouValue: "12 Minggu Virtual Internship enterprise dataset.",
          competitorValue: "1 AI app live di internet (Streamlit Cloud).",
          highlight: false
        }
      ],
      competitorLimitation: "Kursus kilat 10 sesi, tanpa mentor bernama, tanpa pendampingan karir intensif.",
      revouEdge: "RevoU membekali kemampuan memecahkan masalah bisnis strategis C-level, bukan sekadar deploy app Streamlit sederhana.",
      acTalkingPoint: "FSB Data Scientist itu kursus demo 10 sesi seharga 149 ribu kak. Di RevoU FSDA, kakak belajar komprehensif 7 bulan dari nol hingga siap kerja di top tech company!"
    },
    {
      id: "fsb-dm",
      competitorId: "fullstackbangalore",
      competitorName: "Full Stack Bangalore",
      programTitle: "Bootcamp Digital Marketing",
      badge: "Live Zoom 4 Minggu (10 Sesi)",
      revouMatchProgram: "Full Stack Digital Marketing (FSDM)",
      revouMatchBadge: "FSDM",
      tableRows: [
        {
          parameter: "Biaya & Skema",
          categoryTag: "INVESTASI & BIAYA",
          revouValue: "Rp 14.900.000 – Rp 17.900.000 All-In termasuk real budget ads jutaan rupiah.",
          competitorValue: "Promo Rp 149.000 (Normal Rp 599.000).",
          highlight: true
        },
        {
          parameter: "Durasi & Jam Belajar",
          categoryTag: "DURASI PROGRAM",
          revouValue: "7 Bulan (12 modul end-to-end + 12 minggu Virtual Internship brand besar).",
          competitorValue: "4 Minggu (10 sesi live Zoom kilat).",
          highlight: true
        },
        {
          parameter: "Kurikulum & Tools",
          categoryTag: "KURIKULUM",
          revouValue: "Full-Funnel Performance Marketing, Meta Ads, Google Ads, TikTok Ads, SEO/GEO, CRM, Analytics.",
          competitorValue: "TOFU-MOFU-BOFU, Copywriting, Meta Ads, Google Search Ads, dasar SEO, A/B Testing.",
          highlight: false
        },
        {
          parameter: "Portofolio Proyek",
          categoryTag: "PORTOFOLIO",
          revouValue: "Memegang real ads budget jutaan rupiah untuk campaign brand korporat nyata.",
          competitorValue: "Mini campaign project latihan mandiri (tanpa alokasi ads budget nyata).",
          highlight: true
        }
      ],
      competitorLimitation: "Workshop kilat 4 minggu tanpa alokasi budget iklan nyata dan tanpa pendampingan karir 1-on-1.",
      revouEdge: "RevoU FSDM adalah sekolah digital marketing terdepan di Asia Tenggara dengan real ads budget jutaan rupiah dan bimbingan Career+ sampai hired.",
      acTalkingPoint: "FSB Digital Marketing itu kursus teori 4 minggu seharga 149 ribu kak. Di RevoU FSDM, kakak memegang uang jutaan rupiah untuk praktek beriklan langsung di Meta, Google, dan TikTok serta didampingi 1:1 Career Coach sampai tembus kerja!"
    },
    {
      id: "fsb-n8n",
      competitorId: "fullstackbangalore",
      competitorName: "Full Stack Bangalore",
      programTitle: "Bootcamp N8N Automation",
      badge: "Live Zoom 3 Minggu (5 Sesi)",
      revouMatchProgram: "x BINUS: Applied AI, Analytics & Automation",
      revouMatchBadge: "BINUS",
      tableRows: [
        {
          parameter: "Biaya & Kredensial",
          categoryTag: "INVESTASI & KREDENSIAL",
          revouValue: "Professional Certificate resmi BINUS University (72 jam pembelajaran terakreditasi).",
          competitorValue: "Rp 149.000 (Promo) sertifikat internal tanpa akreditasi kampus atau industri.",
          highlight: true
        },
        {
          parameter: "Durasi & Sesi",
          categoryTag: "DURASI PROGRAM",
          revouValue: "3 Bulan (12 Minggu) komprehensif membedah strategi AI enterprise & automasi bisnis.",
          competitorValue: "3 Minggu (5 sesi live Zoom, 2x seminggu).",
          highlight: true
        },
        {
          parameter: "Kedalaman Materi",
          categoryTag: "KURIKULUM",
          revouValue: "Strategi AI Korporasi, automasi bisnis n8n, AI Agents, data governance & security.",
          competitorValue: "Dasar trigger/node, logic IF/ELSE, API webhook, ChatGPT API, mini automation project.",
          highlight: true
        },
        {
          parameter: "Portofolio Proyek",
          categoryTag: "PORTOFOLIO",
          revouValue: "Solusi automasi workflow terintegrasi untuk bisnis enterprise.",
          competitorValue: "Mini project (auto-send invoice, auto-summary report).",
          highlight: false
        }
      ],
      competitorLimitation: "Hanya 5 sesi live singkat seputar trigger/node dasar n8n tanpa sertifikasi akademik resmi.",
      revouEdge: "Program Executive RevoU x BINUS memadukan otomatisasi n8n dengan strategic thinking manajerial dan kredensial resmi BINUS University.",
      acTalkingPoint: "FSB N8N itu demo kilat 5 pertemuan seharga 149 ribu kak. Di RevoU x BINUS, otomatisasi n8n diajarkan dalam konteks efisiensi bisnis enterprise dengan sertifikat resmi BINUS University!"
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
  rework?: string;
  tempatbelajar?: string;
  dicoding?: string;
  myskill?: string;
  fullstackbangalore?: string;
  selfPaced: string;
  revouHighlight?: boolean;
  [key: string]: any;
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
    dibimbing: "Online (seluruh program) · Offline Jakarta (Data Analytics & Full-Stack) · Private Session (Full-Stack)",
    dqlab: "Bootcamp live class virtual + belajar mandiri via modul",
    rework: "Live Online via Zoom + Hands-on Lab & Proyek Korporat B2B",
    tempatbelajar: "2 Tier: Career Accelerator (Live Zoom 2x/minggu + Magang) vs Professional (Live Zoom 1x/minggu tanpa magang)",
    dicoding: "Hybrid Self-Paced (LMS Interaktif Dicoding Academy) + Sesi Live mingguan & Code Review 1-on-1",
    myskill: "Intensive Bootcamp Live Zoom + Akses ratusan materi e-learning rekaman video mandiri",
    fullstackbangalore: "Live Online Bootcamp interaktif via Google Meet / Zoom + Hands-on coding lab",
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
    dibimbing: "Bayar Hari Ini atau Cicilan (harga dinamis via JS / estimasi promo Rp 7jt–15jt via WA 081227741541), gratis mengulang batch seumur hidup",
    dqlab: "Rp 699rb – Rp 3,8jt (Bootcamp single Rp 699rb–2,5jt, Ujian BNSP Rp 1,9jt–2,5jt, Bundle Rp 1,2jt–3,8jt)",
    rework: "Rp 12jt – Rp 18jt (Opsi ISA / Cicilan bertahap; ada seleksi komitmen awal)",
    tempatbelajar: "• Career Accelerator: Normal Rp 30jt | Earlybird Rp 6.999.900 | Reguler Rp 8.999.900\n• Professional: Rp 3.499.900 (tanpa karir/magang)",
    dicoding: "Rp 1.500.000 – Rp 2.500.000 (Sistem langganan / token modul Dicoding Academy)",
    myskill: "Rp 1.500.000 – Rp 2.500.000 per bootcamp intensive (Sering diskon flash sale)",
    fullstackbangalore: "Rp 5.999.000 – Rp 14.000.000 (Tergantung trek: DA, DE, AI, DS, DM, n8n Automation)",
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
    dibimbing: "Weekday malam atau Weekend (frekuensi 2–3 sesi per minggu kombinasi rekaman LMS)",
    dqlab: "2x seminggu malam (19:00–21:30 WIB) atau weekend pagi (10:00–12:00)",
    rework: "Malam hari (19:30–21:30 WIB) & Weekend; ramah pekerja tech/korporasi",
    tempatbelajar: "Malam hari (19:30–21:30 WIB) 1–2x seminggu; fleksibel untuk pemula & staf junior",
    dicoding: "Fleksibel mandiri (Self-paced) + live sharing opsional weekend / malam",
    myskill: "2–3x seminggu malam (19:30–21:30 WIB) atau weekend",
    fullstackbangalore: "Malam hari (19:30–21:30 WIB) atau Weekend intensif",
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
    dibimbing: "Pre-bootcamp + 24 minggu bootcamp + 2 post + 4 Job Connect (±7,5 bulan; meta FE/QA sebut 5 bulan)",
    dqlab: "10 – 17 sesi singkat (durasi 1,5 – 2,5 bulan, total 20–42,5 jam)",
    rework: "12 – 16 minggu (3 – 4 bulan intensif)",
    tempatbelajar: "4 Bulan (2-3 bulan kelas + 1 bulan magang untuk Accelerator) | Professional 2-3 bulan",
    dicoding: "30 – 90 hari tergantung kecepatan belajar mandiri peserta",
    myskill: "4 – 8 minggu (1 – 2 bulan singkat per batch)",
    fullstackbangalore: "8 – 16 minggu (2 – 4 bulan per trek spesifik)",
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
    rework: "2–3x per minggu bersama praktisi korporat & instruktur industri",
    tempatbelajar: "1–2x per minggu saat sesi live Zoom berlangsung",
    dicoding: "Forum diskusi Q&A asynchronous + feedback code review dari reviewer Dicoding",
    myskill: "Sesi Q&A di akhir webinar Zoom + grup Telegram/WhatsApp batch",
    fullstackbangalore: "Live Q&A interaktif saat sesi kelas berlangsung bersama instruktur praktisi",
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
    dibimbing: "8 Program Tech (DE, DA, AI, FE, DevOps, QA, BE, Full-Stack) dengan tugas mandiri/kelompok",
    dqlab: "Metode HERO (Hands-On, Experiential Learning, Outcome-based); studi kasus relevan industri",
    rework: "Fokus Cyber Security (SOC Analyst, ISO 27001), AI Engineering & Data Analytics korporat",
    tempatbelajar: "Fokus operasional praktis staf (DM: Meta/TikTok Ads, SEO; HR: UU Ketenagakerjaan, Payroll PPh 21, Gajihub)",
    dicoding: "Standar Google Developer di Front-End Web, Android, Data Science, dan Machine Learning",
    myskill: "Materi dasar hingga intermediate (Data Analytics, DM, Lovable AI); studi kasus terstruktur singkat",
    fullstackbangalore: "Fokus mendalam ke tools modern: Data Engineering (dbt, Kafka, Airflow), AI/ML, dan n8n Automation",
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
    rework: "Instruktur industri + Teaching Assistant teknis (tanpa team lead & section manager khusus)",
    tempatbelajar: "24 mentor praktisi HR/DM + admin kelas (tanpa dedicated career coach harian)",
    dicoding: "Reviewer kode profesional (code review baris per baris) + admin forum",
    myskill: "Praktisi pengajar webinar + moderator kelas (tanpa Section Manager & Team Lead 1-on-1)",
    fullstackbangalore: "Instruktur engineer praktisi + Discord community group",
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
    rework: "Capstone project simulasi korporasi (tanpa virtual internship multi-partner 12 minggu)",
    tempatbelajar: "1–2 portofolio per modul + magang 1 bulan (hanya paket Accelerator; paket Professional tanpa magang)",
    dicoding: "Submission proyek aplikasi/model data mandiri (tanpa virtual internship partner korporasi 12 minggu)",
    myskill: "Portofolio tugas akhir mini capstone (tanpa real budget ads jutaan & tanpa virtual internship 12 minggu)",
    fullstackbangalore: "Proyek teknis pipeline data & bot workflow (tanpa virtual internship partner multi-korporasi)",
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
    rework: "CV Review & bimbingan profil teknis + koneksi hiring partner B2B",
    tempatbelajar: "Career mentoring & review CV (hanya paket Accelerator; paket Professional Rp 3,5jt tanpa karir)",
    dicoding: "Dicoding Jobs portal (job match listing mandiri tanpa 1:1 dedicated personal coach 7-8 bulan)",
    myskill: "Sesi webinar persiapan karir & template CV ATS (tanpa personal coach 1:1 selama 7-8 bulan)",
    fullstackbangalore: "Konsultasi karir portofolio teknis GitHub & LinkedIn",
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
    rework: "Non-refundable / ISA contract terikat perjanjian kerja",
    tempatbelajar: "Non-refundable; penyaluran magang mitra UMKM & startup TempatBelajar",
    dicoding: "Non-refundable token; sertifikat kelulusan per track kelulusan",
    myskill: "Non-refundable; sertifikat kelulusan per program",
    fullstackbangalore: "Non-refundable; sertifikat kelulusan Full Stack Bangalore",
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
    dibimbing: "Diakui Kemendikti; 4.96/5 SwitchUp (BE: 4.9/5), 4.81 Course Report; Forbes 30 Under 30 Asia 2025",
    dqlab: "E-certificate per modul; Sertifikasi BNSP DA; naungan Yayasan Multimedia Nusantara & Xeratic",
    rework: "Sertifikat Kelulusan Rework Academy (tanpa kemitraan kampus universitas top seperti ITB/BINUS/UI)",
    tempatbelajar: "Sertifikat Kelulusan TempatBelajar (tanpa akreditasi kampus universitas)",
    dicoding: "Google Authorized Training Partner; Sertifikat Kompetensi Dicoding (tanpa sertifikat universitas ITB/BINUS/UI)",
    myskill: "Sertifikat MySkill terakreditasi industri (tanpa kemitraan kampus resmi ITB/BINUS/UI)",
    fullstackbangalore: "Sertifikat kelulusan lembaga (tanpa kemitraan resmi universitas ITB/BINUS/UI)",
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
    dibimbing: "10K+ alumni (Back-End: 4K+); 100.000+ digital learners; 1.100+ hiring partners (meta QA: 700+)",
    dqlab: "500.000+ pengguna; 30+ mitra hiring & corporate training",
    rework: "1.500+ lulusan fokus industri IT, Cyber, dan Enterprise B2B",
    tempatbelajar: "3.000+ member komunitas digital & hiring network mitra startup/agency",
    dicoding: "500.000+ developer terdaftar di platform Dicoding Indonesia",
    myskill: "1.000.000+ member platform e-learning & puluhan ribu peserta bootcamp",
    fullstackbangalore: "Komunitas engineer & data tech enthusiasts",
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
    rework: "Seleksi wawancara motivasi & komitmen dasar",
    tempatbelajar: "Terbuka umum tanpa seleksi tes kemampuan awal",
    dicoding: "Terbuka umum (kecuali program beasiswa IDCamp / DBS Foundation)",
    myskill: "Tanpa tes seleksi masuk; pendaftaran langsung terbuka untuk umum",
    fullstackbangalore: "Terbuka umum (direkomendasikan memiliki logika dasar komputer atau data)",
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
  const tooltipId = useId();

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
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={tooltipId}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) {
            e.stopPropagation();
            setIsOpen(false);
          }
        }}
        className="inline p-0 m-0 border-0 bg-transparent font-inherit text-[length:inherit] leading-[inherit] text-left align-baseline appearance-none underline decoration-dotted decoration-[#1F7A4D]/60 underline-offset-3 cursor-pointer font-semibold text-inherit hover:text-[#165836] hover:decoration-[#1F7A4D] transition-colors"
        title={`Info keunggulan ${toolData.name}`}
      >
        {children}
      </button>

      {/* Pop-up Box Minimalis */}
      {isOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-[260px] sm:w-[280px] max-w-[calc(100vw-32px)] p-3 bg-white text-[#141412] rounded-xl border border-[#E8E8E4] kiro-popover-animate block text-left pointer-events-auto after:content-[''] after:absolute after:top-full after:left-0 after:right-0 after:h-2"
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
              <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#EBF7EE] text-[#1F7A4D] border border-[#D4EDDA] shrink-0">
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
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[6px] border-transparent border-t-white" />
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#E8E8E4] -z-10" />
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
      <span className={cn("leading-relaxed text-xs sm:text-[13px]", isRevou ? "font-semibold text-[#1F7A4D]" : "font-normal text-[#2A2A26]")}>
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
            <div key={idx} className={cn("flex items-start gap-1.5", isSubBullet ? "pl-3.5" : "pl-0.5")}>
              <span className={cn("shrink-0 select-none text-[12px] font-bold mt-0.5", isRevou ? "text-[#1F7A4D]" : "text-[#73736C]")}>
                •
              </span>
              <span className={cn("flex-1", isRevou ? "font-medium text-[#1F7A4D]" : "text-[#2A2A26]")}>
                {renderBoldText(cleanContent, isRevou)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className={cn("font-bold text-pretty", isRevou ? "text-[#165836]" : "text-[#141412]")}>
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
  labelId?: string;
}

function AnimatedSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  buttonClassName = "",
  labelId,
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listboxId = useId();

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

  const focusOptionAtIndex = (index: number) => {
    if (options.length === 0) return;
    const clamped = ((index % options.length) + options.length) % options.length;
    optionRefs.current[clamped]?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const selectedIdx = options.findIndex((opt) => opt.value === value);
      const initialIdx =
        selectedIdx >= 0
          ? selectedIdx
          : e.key === "ArrowDown"
            ? 0
            : Math.max(0, options.length - 1);
      if (!isOpen) {
        setIsOpen(true);
        requestAnimationFrame(() => {
          focusOptionAtIndex(initialIdx);
        });
      } else {
        focusOptionAtIndex(initialIdx);
      }
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn("w-full min-w-0 flex items-center justify-between text-left transition-all duration-200 cursor-pointer select-none", buttonClassName, isOpen && "ring-2 ring-[#FFD84D]/60 border-[#FFD84D] shadow-sm"
          )}
        title={selectedOption ? selectedOption.label : placeholder}
      >
        <span className={cn("truncate min-w-0 mr-2 flex-1 block", !selectedOption ? "text-[#60605B]" : "text-[#141412]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 text-[#141412] stroke-[2.5] shrink-0 transition-transform duration-200 ease-out", isOpen ? "rotate-180" : "rotate-0"
            )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top center" }}
            className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[#141412] rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isPlaceholder = opt.value === "";
              return (
                <button
                  key={opt.value || "__placeholder__"}
                  ref={(el) => {
                    optionRefs.current[idx] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      focusOptionAtIndex(idx + 1);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      focusOptionAtIndex(idx - 1);
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      focusOptionAtIndex(0);
                    } else if (e.key === "End") {
                      e.preventDefault();
                      focusOptionAtIndex(options.length - 1);
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }
                  }}
                  className={cn("w-full min-w-0 text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer select-none", isPlaceholder
                    ? "text-[#73736C] hover:bg-[#F5F5F2] italic border-b border-[#E8E8E4] mb-0.5"
                    : isSelected
                      ? "bg-[#FFF6D1] text-[#141412] font-bold"
                      : "text-[#2A2A26] hover:bg-[#F5F5F2] font-medium"
                    )}
                  title={opt.label}
                >
                  <span className="truncate min-w-0 flex-1">{opt.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {opt.badge && !isPlaceholder && (
                      <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#EDEDEA] text-[#4B4B46]">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && !isPlaceholder && (
                      <Check aria-hidden="true" className="size-3.5 text-[#A15C00] stroke-[2.5]" />
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

// ── PROGRAM-SPECIFIC BATTLECARD RESOLVER ──
export interface ProgramBattlecardDetail {
  id: string;
  programTitle: string;
  competitorName: string;
  badge: string;
  revouMatchProgram: string;
  revouMatchBadge: string;
  tagline: string;
  competitorPrice: string;
  revouPrice: string;
  durationTextComp: string;
  durationTextRevoU: string;
  competitorFormat: string;
  revouFormat: string;
  curriculumComp: string;
  curriculumRevoU: string;
  toolsComp: string[];
  toolsRevoU: string[];
  portfolioComp: string;
  portfolioRevoU: string;
  careerSupportComp: string;
  careerSupportRevoU: string;
  competitorCert: string;
  revouCert: string;
  honestStrength: string;
  revouWins: string[];
  proofPoint: string;
  acScriptTemplate: string;
  competitorLimitation: string;
}

// ── EXPLICIT PROGRAM TOOLS & TECH STACK MAPPING ──
const EXPLICIT_PROGRAM_TOOLS: Record<string, { comp: string[]; revou: string[] }> = {
  // TempatBelajar
  "tb-dm-accelerator": {
    comp: ["Meta Ads", "TikTok Ads (GMV Max)", "Google Ads", "GA4", "GTM", "WordPress", "Elementor", "Mailchimp", "ManyChat", "NotebookLM", "Gemini"],
    revou: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "GA4", "Looker Studio", "GTM", "Ahrefs", "Semrush", "HubSpot CRM", "Mailchimp", "ChatGPT Plus", "Claude 3.5", "Midjourney"]
  },
  "tb-dm-pro": {
    comp: ["Meta Ads", "TikTok Ads", "Google Ads", "WordPress", "Elementor", "GA4", "ManyChat", "Mailchimp"],
    revou: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "GA4", "Looker Studio", "GTM", "Ahrefs", "Semrush", "HubSpot CRM", "Mailchimp", "ChatGPT Plus", "Claude 3.5", "Midjourney"]
  },
  "tb-hr-accelerator": {
    comp: ["Demo HRIS (Gajihub, Gaji.id)", "UU Ketenagakerjaan RI", "Payroll PPh 21", "BPJS Ketenagakerjaan & Kesehatan", "Coretax / Ortax", "Google Workspace", "ChatGPT", "Gemini", "NotebookLM"],
    revou: ["AI Hiring Workflows (ChatGPT/Claude)", "Prompt Engineering for HR", "People Analytics (Python/Sheets)", "9-Box Talent Matrix", "HRIS Architecture", "ATS Optimization", "Org Design Suite"]
  },
  "tb-hr-pro": {
    comp: ["Demo HRIS (Gajihub)", "UU Ketenagakerjaan dasar", "Payroll PPh 21", "BPJS", "Google Workspace"],
    revou: ["AI Hiring Workflows (ChatGPT/Claude)", "Prompt Engineering for HR", "People Analytics (Python/Sheets)", "9-Box Talent Matrix", "HRIS Architecture", "ATS Optimization", "Org Design Suite"]
  },

  // Full Stack Bangalore
  "fsb-da": {
    comp: ["SQL Queries", "Python dasar", "Power BI", "Microsoft Excel"],
    revou: ["SQL (BigQuery & PostgreSQL)", "Python (Pandas, NumPy)", "Tableau", "Looker Studio", "Apache Airflow (ETL)", "Spreadsheet Modeling", "Claude Code"]
  },
  "fsb-de": {
    comp: ["Python", "PostgreSQL", "Metabase", "Apache Airflow (demo)", "dbt", "Apache Kafka"],
    revou: ["Python", "Apache Airflow (Automated ETL)", "SQL BigQuery", "dbt", "PostgreSQL", "Docker", "AWS Cloud (S3, RDS, EC2)", "Claude Code"]
  },
  "fsb-ai": {
    comp: ["Python", "Streamlit", "Scikit-learn", "Hugging Face", "MLflow", "LangChain", "OpenAI API"],
    revou: ["Python", "Flask", "Next.js 15", "LLM APIs (OpenAI/Claude)", "Vector DB (Pinecone/Chroma)", "Kiro AI (Spec-driven)", "Claude Code", "AWS Cloud"]
  },
  "fsb-ds": {
    comp: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "Streamlit", "Jupyter Notebook"],
    revou: ["Python", "Scikit-Learn", "Statistical Rigor FTI ITB", "BigQuery", "Streamlit", "Claude Code AI Coding", "Tableau"]
  },
  "fsb-dm": {
    comp: ["Meta Ads Manager", "Google Ads (Search)", "Audience Targeting", "Canva"],
    revou: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "GA4", "Looker Studio", "Ahrefs", "Semrush", "HubSpot", "ChatGPT Plus", "Midjourney"]
  },
  "fsb-n8n": {
    comp: ["n8n (Self-hosted & Cloud)", "Webhooks", "REST API", "Telegram Bot", "WhatsApp Bot"],
    revou: ["n8n Enterprise Automation", "Multi-Agent AI Systems", "Make / Zapier", "LangChain", "OpenAI API", "Vector Database", "PostgreSQL"]
  },

  // MySkill
  "ms-da": {
    comp: ["PostgreSQL", "Python (NumPy, Pandas)", "Google Data Studio (Looker Studio)", "Microsoft Excel"],
    revou: ["SQL (BigQuery & PostgreSQL)", "Python (Pandas, NumPy, Scikit-learn)", "Tableau", "Looker Studio", "Apache Airflow", "Advanced Excel", "Claude Code"]
  },
  "ms-dm": {
    comp: ["Meta Ads", "Google Ads", "SEO dasar", "Copywriting", "Social Media Organic", "Reporting"],
    revou: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "GA4", "Looker Studio", "GTM", "Ahrefs", "Semrush", "HubSpot CRM", "ChatGPT Plus", "Midjourney"]
  },
  "ms-lovable": {
    comp: ["Lovable AI", "HTML", "CSS", "Prompt Engineering"],
    revou: ["Next.js 15 (App Router)", "TypeScript", "Python", "Flask", "PostgreSQL", "Tailwind CSS", "AWS Cloud", "Docker", "Kiro AI", "Claude Code"]
  },

  // Dicoding
  "dc-web": {
    comp: ["React.js", "Python", "Django", "JavaScript (ES6+)", "PostgreSQL", "GCP (Google Cloud)", "Postman", "Web Components", "Git"],
    revou: ["Next.js 15 (App Router)", "TypeScript", "Python", "Flask", "PostgreSQL", "Tailwind CSS", "AWS (EC2, S3, RDS)", "Docker", "Kiro AI", "Claude Code"]
  },
  "dc-ds": {
    comp: ["Python", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "Jupyter Notebook", "Google Colab"],
    revou: ["Python (Pandas, NumPy, Scikit-learn)", "SQL BigQuery", "Apache Airflow ETL", "Tableau", "Looker Studio", "Statistical Rigor ITB", "Claude Code"]
  },

  // Rework Academy
  "rw-ai": {
    comp: ["Python", "PyTorch", "Hugging Face", "Gemini API", "LangChain", "LangGraph", "Vector DB (FAISS/Pinecone)", "FastAPI", "Docker", "GCP Cloud Run"],
    revou: ["n8n Enterprise Automation", "Multi-Agent AI Systems", "LangChain", "OpenAI API", "Python", "Flask", "Next.js 15", "Vector DB", "AWS Cloud"]
  },
  "rw-cyber": {
    comp: ["Linux Ubuntu", "Burp Suite", "Nmap", "Wireshark", "Wazuh SIEM", "SQLMap", "DVWA", "Metasploit"],
    revou: ["AWS Cloud Security Labs", "SIEM (Splunk)", "Wazuh", "Linux CLI", "Python Security Scripting", "Wireshark", "Blue Team Threat Detection"]
  },
  "rw-da": {
    comp: ["PostgreSQL", "pgAdmin", "Python", "Pandas", "Tableau", "Looker Studio", "Microsoft Excel"],
    revou: ["SQL BigQuery", "Python (Pandas, NumPy)", "Tableau", "Looker Studio", "Apache Airflow (Automated ETL)", "Claude Code", "C-Level Problem Solving"]
  }
};

function resolveProgramTools(program: CompetitorProgramItem): { toolsComp: string[]; toolsRevoU: string[] } {
  if (EXPLICIT_PROGRAM_TOOLS[program.id]) {
    return {
      toolsComp: EXPLICIT_PROGRAM_TOOLS[program.id].comp,
      toolsRevoU: EXPLICIT_PROGRAM_TOOLS[program.id].revou
    };
  }

  // Fallbacks by program category
  if (program.revouMatchBadge === "FSDM" || program.revouMatchProgram.includes("Marketing")) {
    return {
      toolsComp: ["Meta Ads", "Google Ads", "TikTok Ads", "GA4", "Canva", "SEO Tools"],
      toolsRevoU: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "GA4", "Looker Studio", "GTM", "Ahrefs", "Semrush", "HubSpot CRM", "Mailchimp", "ChatGPT Plus", "Claude 3.5", "Midjourney"]
    };
  }
  if (program.revouMatchBadge === "FSDA" || program.revouMatchProgram.includes("Data")) {
    return {
      toolsComp: ["SQL", "Python", "Tableau / Power BI", "Excel"],
      toolsRevoU: ["SQL (BigQuery & PostgreSQL)", "Python (Pandas, NumPy, Scikit-learn)", "Tableau", "Looker Studio", "Apache Airflow", "Spreadsheets", "Git / GitHub", "Claude Code"]
    };
  }
  if (program.revouMatchBadge === "FSSE" || program.revouMatchProgram.includes("Software") || program.revouMatchProgram.includes("Developer")) {
    return {
      toolsComp: ["JavaScript", "React", "Node.js", "PostgreSQL", "Git"],
      toolsRevoU: ["Next.js 15 (App Router)", "TypeScript", "Python", "Flask", "PostgreSQL", "Tailwind CSS", "AWS (EC2, S3, RDS)", "Docker", "Kiro AI", "Claude Code"]
    };
  }
  if (program.revouMatchBadge === "Strategic HR" || program.revouMatchProgram.includes("HR")) {
    return {
      toolsComp: ["Demo HRIS", "UU Ketenagakerjaan", "Payroll PPh 21", "Google Sheets"],
      toolsRevoU: ["AI Hiring Workflows (ChatGPT/Claude)", "Prompt Engineering for HR", "People Analytics (Python/Sheets)", "9-Box Talent Matrix", "HRIS Architecture", "ATS Optimization", "Org Design Suite"]
    };
  }
  if (program.revouMatchBadge === "BINUS") {
    return {
      toolsComp: ["Linux", "Wireshark", "Burp Suite", "Security Tools"],
      toolsRevoU: ["AWS Cloud Security Labs", "SIEM (Splunk)", "Wazuh", "n8n Enterprise Automation", "Make / Zapier", "LangChain", "OpenAI API", "Python Security"]
    };
  }
  if (program.revouMatchBadge === "ITB") {
    return {
      toolsComp: ["Python", "Scikit-Learn", "Pandas", "Jupyter"],
      toolsRevoU: ["Python", "Scikit-Learn", "Streamlit", "Claude Code AI Coding", "SQL BigQuery", "Pandas", "Statistical Modeling FTI ITB"]
    };
  }

  return {
    toolsComp: ["Tools sesuai silabus program kompetitor"],
    toolsRevoU: ["AI-Native Enterprise Tools", "Claude 3.5 Sonnet", "ChatGPT Plus", "Virtual Internship Real Tools"]
  };
}

function buildProgramBattlecard(
  program: CompetitorProgramItem,
  macroBattlecard?: CompetitorBattlecard
): ProgramBattlecardDetail {
  const findRow = (catKeywords: string[], paramKeywords: string[]) => {
    return program.tableRows.find((r) => {
      const cat = (r.categoryTag || "").toLowerCase();
      const param = (r.parameter || "").toLowerCase();
      return (
        catKeywords.some((k) => cat.includes(k.toLowerCase())) ||
        paramKeywords.some((k) => param.includes(k.toLowerCase()))
      );
    });
  };

  const priceRow = findRow(["investasi", "biaya"], ["biaya", "investasi", "harga", "skema"]);
  const scheduleRow = findRow(["jadwal"], ["jadwal", "komitmen", "waktu"]);
  const durationRow = findRow(["durasi"], ["durasi", "sesi", "minggu"]);
  const formatRow = findRow(["metode", "format"], ["format", "metode", "lokasi"]);
  const certRow = findRow(["kredensial", "sertifikasi"], ["sertifikasi", "kredensial", "sertifikat"]);
  const careerRow = findRow(["karir", "career", "magang", "dukungan"], ["karir", "career", "magang", "job", "bimbingan"]);
  const curriculumRow = findRow(["kurikulum", "materi", "tools", "silabus", "ai"], ["kurikulum", "materi", "tools", "cakupan", "silabus", "engineering"]);
  const portfolioRow = findRow(["portofolio", "proyek", "project"], ["portofolio", "proyek", "project", "budget", "capstone"]);

  // Tools & Tech Stack
  const resolvedTools = resolveProgramTools(program);

  // Price
  const competitorPrice = priceRow?.competitorValue || macroBattlecard?.price || "Lihat tabel komparasi detail";
  const revouPrice = priceRow?.revouValue || "Rp 14.9jt – Rp 22.5jt (opsi cicilan 3x–12x via kartu kredit/Danacita, tanpa biaya kos).";

  // Duration & Schedule
  const durationTextComp = [
    durationRow ? durationRow.competitorValue : null,
    scheduleRow ? `Jadwal: ${scheduleRow.competitorValue}` : null,
  ].filter(Boolean).join("\n\n") || macroBattlecard?.duration || "12–24 minggu";

  const durationTextRevoU = [
    durationRow ? durationRow.revouValue : null,
    scheduleRow ? `Jadwal: ${scheduleRow.revouValue}` : null,
  ].filter(Boolean).join("\n\n") || "6–9 bulan komprehensif (termasuk 3 bulan Virtual Internship & Career+), kelas malam 19:00–21:00 WIB.";

  // Format
  const competitorFormat = formatRow?.competitorValue || macroBattlecard?.format || "Online / Offline";
  const revouFormat = formatRow?.revouValue || "100% Live Online interaktif dua arah (5x/minggu sesi tanya jawab & diskusi) + Akses rekaman selamanya.";

  // Certification
  const competitorCert = certRow?.competitorValue || macroBattlecard?.certification || "Sertifikat Kelulusan Resmi";
  const revouCert = certRow?.revouValue || "RevoU Certificate of Completion bertaraf internasional + Sertifikasi Resmi Universitas Terkemuka (ITB, BINUS x AWS, UI).";

  // Honest Strength
  const honestStrength = program.badge
    ? `${program.competitorName} ${program.programTitle} (${program.badge}): ${macroBattlecard?.honestStrength || "Fokus pada kurikulum teknis spesifik dan format belajar yang terstruktur."}`
    : macroBattlecard?.honestStrength || "Memiliki spesialisasi materi teknis di bidang ini.";

  // Where RevoU Wins
  const revouWins: string[] = [];
  if (program.revouEdge) {
    revouWins.push(program.revouEdge);
  }
  revouWins.push("Jadwal kelas malam (19:00–21:00 WIB) ramah pekerja & mahasiswa — peserta tidak perlu resign dari kantor saat masa belajar.");
  revouWins.push("12 Minggu Virtual Internship: Portofolio nyata memecahkan real business problem dengan partner korporasi nyata (Telkom OCA, Zurich, dll).");
  revouWins.push("Dukungan karir intensif Career+ (1:1 Personal Career Coach, AI Career Engine, dan simulasi interview dengan Hiring Manager).");

  // Proof Point
  const proofPoint = macroBattlecard?.proofPoint || "15.000+ alumni RevoU di 1.000+ top company & 93% completion rate resmi (transparan vs kompetitor).";

  return {
    id: program.id,
    programTitle: program.programTitle,
    competitorName: program.competitorName,
    badge: program.badge,
    revouMatchProgram: program.revouMatchProgram,
    revouMatchBadge: program.revouMatchBadge,
    tagline: `Battlecard Head-to-Head: RevoU ${program.revouMatchProgram} vs ${program.competitorName} ${program.programTitle}`,
    competitorPrice,
    revouPrice,
    durationTextComp,
    durationTextRevoU,
    competitorFormat,
    revouFormat,
    toolsComp: resolvedTools.toolsComp,
    toolsRevoU: resolvedTools.toolsRevoU,
    curriculumComp: curriculumRow?.competitorValue || macroBattlecard?.curriculum || "Kurikulum standar teknis dan studi kasus dasar program.",
    curriculumRevoU: curriculumRow?.revouValue || "Kurikulum AI-Native teruji industri SEA dengan studi kasus nyata, real budget ads, dan AI learning assistant harian.",
    portfolioComp: portfolioRow?.competitorValue || "1–2 project simulasi internal / mini project mandiri.",
    portfolioRevoU: portfolioRow?.revouValue || "Hingga 13 portofolio nyata terverifikasi memecahkan real business challenge korporasi mitra (Virtual Internship 12 minggu).",
    careerSupportComp: careerRow?.competitorValue || macroBattlecard?.careerSupport || "Career support & bimbingan kerja.",
    careerSupportRevoU: careerRow?.revouValue || "RevoU Career+ (1:1 Personal Career Coach selama 7-8 bulan, AI Career Engine, & simulasi interview Hiring Manager).",
    competitorCert,
    revouCert,
    honestStrength,
    revouWins,
    proofPoint,
    acScriptTemplate: program.acTalkingPoint,
    competitorLimitation: program.competitorLimitation,
  };
}

// ── FEATURE TOGGLES ──
// Set ke `true` jika tim AC ingin mengaktifkan kembali tab General Comparison (Level Institusi/Makro)
const SHOW_GENERAL_COMPARISON = false;

export interface ComparisonViewProps {
  onTrackActivity?: (
    actionType: string,
    topic?: string,
    snippet?: string,
    meta?: any
  ) => void;
}

export default function ComparisonView({ onTrackActivity }: ComparisonViewProps = {}) {
  const [activeTab, setActiveTab] = useState<"bootcamp" | "general" | "battlecards">("bootcamp");
  const [institutionViewMode, setInstitutionViewMode] = useState<"headToHead" | "allCompetitors">("headToHead");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyAnnouncement, setCopyAnnouncement] = useState<string>("");

  // ── DUAL DROPDOWN STATES (RevoU vs [Kompetitor] -> [Pilih Program]) ──
  const [selectedCompetitorKey, setSelectedCompetitorKey] = useState<CompetitorId>("hacktiv8");

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
      handleSelectProgramId(found.firstProgramId);
    }
  };

  // Handle change of Dropdown 1 (Competitor)
  const handleCompetitorChange = (newComp: CompetitorId) => {
    setSelectedCompetitorKey(newComp);
    setSelectedProgramId(""); // Reset program selection so user chooses program for new competitor
  };

  const handleSelectProgramId = (progId: string) => {
    setSelectedProgramId(progId);
    if (!progId || progId === selectedProgramId) return;
    const detail = availableProgramsForSelectedComp.find((p) => p.id === progId);
    if (detail && onTrackActivity) {
      onTrackActivity(
        "view_comparison",
        `Komparasi vs ${detail.competitorName}`,
        `RevoU ${detail.revouMatchProgram} vs ${detail.competitorName} ${detail.programTitle}`,
        {
          competitor: detail.competitorName,
          programId: detail.id,
          revouProgram: detail.revouMatchProgram,
        }
      );
    }
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (onTrackActivity) {
        onTrackActivity(
          "copy_script",
          activeProgramDetail ? `Komparasi vs ${activeProgramDetail.competitorName}` : "Komparasi Kompetitor",
          text,
          { type: "copy_comparison_script", id }
        );
      }
      setCopiedId(id);
      setCopyAnnouncement("Tersalin");
      setTimeout(() => {
        setCopiedId(null);
        setCopyAnnouncement("");
      }, 2000);
    } catch {
      setCopiedId(null);
      setCopyAnnouncement("Gagal menyalin teks");
      setTimeout(() => {
        setCopyAnnouncement("");
      }, 2000);
    }
  };

  const competitorDisplayNames: Record<CompetitorId, string> = {
    hacktiv8: "Hacktiv8",
    purwadhika: "Purwadhika",
    dibimbing: "Dibimbing",
    dqlab: "DQLab",
    rework: "Rework Academy",
    tempatbelajar: "TempatBelajar",
    dicoding: "Dicoding",
    myskill: "MySkill",
    fullstackbangalore: "Full Stack Bangalore"
  };

  const competitorOptions = useMemo(() => [
    { value: "hacktiv8", label: "Hacktiv8" },
    { value: "purwadhika", label: "Purwadhika" },
    { value: "dibimbing", label: "Dibimbing" },
    { value: "dqlab", label: "DQLab" },
    { value: "rework", label: "Rework Academy" },
    { value: "tempatbelajar", label: "TempatBelajar" },
    { value: "dicoding", label: "Dicoding" },
    { value: "myskill", label: "MySkill" },
    { value: "fullstackbangalore", label: "Full Stack Bangalore" },
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
      label: prog.programTitle,
    })),
  ], [availableProgramsForSelectedComp, competitorDisplayNames, selectedCompetitorKey]);

  const activeBattlecard = BATTLECARDS.find((b) => b.id === selectedCompetitorKey) || BATTLECARDS[0];

  const activeProgramBattlecard = useMemo(() => {
    if (!activeProgramDetail) return null;
    return buildProgramBattlecard(activeProgramDetail, activeBattlecard);
  }, [activeProgramDetail, activeBattlecard]);

  return (
    <div className="space-y-6">
      <span role="status" aria-live="polite" className="sr-only">
        {copyAnnouncement}
      </span>
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
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border-2 border-[#141412] rounded-xl p-4 sm:p-5 shadow-sm space-y-4 card-interactive"
      >

        {/* ── BARIS 1: LEMBAGA KAMI vs PILIH KOMPETITOR ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] gap-3 sm:gap-4 items-center">
          {/* Sisi Kiri: Lembaga kami */}
          <div className="min-w-0">
            <p className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
              <span>Lembaga kami</span>
              <span className="font-mono text-[11px] uppercase font-bold text-[#1F7A4D] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#D4EDDA]">
                Utama
              </span>
            </p>
            <div className="w-full min-w-0 flex items-center justify-between bg-[#F5F5F2] text-[#141412] font-display font-bold text-sm sm:text-base rounded-xl px-3.5 py-2.5 border border-[#E8E8E4] cursor-default select-none shadow-sm">
              <span className="truncate">RevoU</span>
              <CheckCircle2 className="size-4 text-[#1F7A4D] shrink-0" />
            </div>
          </div>

          {/* Tengah: vs */}
          <div className="flex items-center justify-center pt-0 md:pt-5 shrink-0">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-[#60605B] select-none px-2.5 py-1 bg-[#F5F5F2] rounded-md border border-[#E8E8E4]">
              vs
            </span>
          </div>

          {/* Sisi Kanan: Pilih Kompetitor */}
          <div className="min-w-0">
            <label id="label-select-competitor" className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
              <span>Pilih Kompetitor</span>
              <span className="font-mono text-[11px] uppercase font-bold text-[#A15C00] bg-[#FFF6D1] px-2 py-0.5 rounded-full border border-[#FFD84D]/60 motion-safe:animate-pulse">
                Pilih
              </span>
            </label>
            <AnimatedSelect
              labelId="label-select-competitor"
              value={selectedCompetitorKey}
              onChange={(val) => handleCompetitorChange(val as any)}
              options={competitorOptions}
              buttonClassName="bg-[#EAEAE6] hover:bg-[#E0E0DC] text-[#141412] font-display font-bold text-sm sm:text-base rounded-xl px-3.5 py-2.5 border border-[#D4D4CE] hover:border-[#FFD84D] shadow-sm"
            />
          </div>
        </div>

        {/* ── BARIS 2 (DI BAWAHNYA): PROGRAM KAMI vs PROGRAM KOMPETITOR ── */}
        <div className="pt-3.5 border-t border-[#E8E8E4]">
          {SHOW_GENERAL_COMPARISON && activeTab === "general" && (
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#EBF7EE] border border-[#D4EDDA] flex items-center gap-2 text-[11.5px] text-[#1F7A4D]">
              <Info className="size-3.5 shrink-0 text-[#1F7A4D]" />
              <span>
                <strong>Mode Makro Lembaga:</strong> Tab Matriks Komparasi Lembaga langsung menampilkan standar institusi secara menyeluruh. Pilihan program di bawah ini digunakan saat Anda membuka tab <strong>Komparasi Spesifik Program</strong>.
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] gap-3 sm:gap-4 items-center">
            {/* Sisi Kiri: Program kami */}
            <div className="min-w-0">
              <label id="label-select-revou-program" className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
                <span>Program kami</span>
                <span className={cn("font-mono text-[11px] uppercase font-bold px-2 py-0.5 rounded-full border", activeProgramDetail ? "text-[#1F7A4D] bg-[#EBF7EE] border-[#D4EDDA]" : "text-[#A15C00] bg-[#FFF6D1] border-[#FFD84D]/60 motion-safe:animate-pulse")}>
                  {activeProgramDetail ? "Terpilih" : "Wajib Pilih"}
                </span>
              </label>
              <AnimatedSelect
                labelId="label-select-revou-program"
                value={activeProgramDetail?.revouMatchProgram || ""}
                onChange={(val) => handleRevoUMatchChange(val)}
                options={revouProgramOptions}
                placeholder="— Pilih Program RevoU —"
                buttonClassName="bg-[#F5F5F2] hover:bg-[#EDEDEA] text-[#141412] font-display font-medium text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#D4D4CE] hover:border-[#FFD84D] shadow-sm"
              />
            </div>

            {/* Tengah: vs */}
            <div className="flex items-center justify-center pt-0 md:pt-4 shrink-0">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#60605B] select-none px-2.5 py-1 bg-[#F5F5F2] rounded-md border border-[#E8E8E4]">
                vs
              </span>
            </div>

            {/* Sisi Kanan: Program kompetitor */}
            <div className="min-w-0">
              <label id="label-select-comp-program" className="block text-xs sm:text-sm font-bold text-[#141412] mb-1.5 flex items-center justify-between">
                <span>Program {competitorDisplayNames[selectedCompetitorKey]}</span>
                <span className={cn("font-mono text-[11px] uppercase font-bold px-2 py-0.5 rounded-full border", activeProgramDetail ? "text-[#1F7A4D] bg-[#EBF7EE] border-[#D4EDDA]" : "text-[#A15C00] bg-[#FFF6D1] border-[#FFD84D]/60 motion-safe:animate-pulse")}>
                  {activeProgramDetail ? "Terpilih" : "Wajib Pilih"}
                </span>
              </label>
              <AnimatedSelect
                labelId="label-select-comp-program"
                value={selectedProgramId}
                onChange={(val) => handleSelectProgramId(val)}
                options={compProgramOptions}
                placeholder={`— Pilih Program ${competitorDisplayNames[selectedCompetitorKey]} —`}
                buttonClassName="bg-[#F5F5F2] hover:bg-[#EDEDEA] text-[#141412] font-display font-medium text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-[#D4D4CE] hover:border-[#FFD84D] shadow-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-NAVIGATION TABS (Komparasi Spesifik, Matriks Lembaga, Battlecard) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Mode tampilan komparasi"
        className={cn("grid gap-1 sm:gap-2 border-b-2 border-[#E8E8E4] -mb-[2px]", SHOW_GENERAL_COMPARISON ? "grid-cols-3" : "grid-cols-2")}
      >
        <button
          id="tab-bootcamp"
          type="button"
          role="tab"
          aria-selected={activeTab === "bootcamp"}
          aria-controls="tabpanel-bootcamp"
          onClick={() => setActiveTab("bootcamp")}
          className={cn("group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0", activeTab === "bootcamp"
            ? "bg-[#F5F5F0] text-[#141412] border-[#FFD84D]"
            : "bg-transparent text-[#60605B] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            )}
        >
          <Layers aria-hidden="true" className={cn("size-3.5 sm:size-4 shrink-0", activeTab === "bootcamp" ? "text-[#A15C00]" : "text-[#60605B]")} />
          <span className="truncate">Spesific Comparison</span>
        </button>

        {SHOW_GENERAL_COMPARISON && (
          <button
            id="tab-general"
            type="button"
            role="tab"
            aria-selected={activeTab === "general"}
            aria-controls="tabpanel-general"
            onClick={() => setActiveTab("general")}
            className={cn("group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0", activeTab === "general"
              ? "bg-[#F5F5F0] text-[#141412] border-[#1F7A4D]"
              : "bg-transparent text-[#60605B] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
              )}
          >
            <Scale aria-hidden="true" className={cn("size-3.5 sm:size-4 shrink-0", activeTab === "general" ? "text-[#1F7A4D]" : "text-[#60605B]")} />
            <span className="truncate">General Comparison</span>
          </button>
        )}

        <button
          id="tab-battlecards"
          type="button"
          role="tab"
          aria-selected={activeTab === "battlecards"}
          aria-controls="tabpanel-battlecards"
          onClick={() => setActiveTab("battlecards")}
          className={cn("group flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-bold rounded-t-xl transition-all border-b-[3px] cursor-pointer select-none min-w-0", activeTab === "battlecards"
            ? "bg-[#F5F5F0] text-[#141412] border-[#B76E00]"
            : "bg-transparent text-[#60605B] border-transparent hover:text-[#141412] hover:bg-[#F5F5F0]/60"
            )}
        >
          <Award aria-hidden="true" className={cn("size-3.5 sm:size-4 shrink-0", activeTab === "battlecards" ? "text-[#B76E00]" : "text-[#60605B]")} />
          <span className="truncate">One-Pager Battlecard</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TAB: TABEL KOMPARASI SPESIFIK (FORMAT TABEL SEPERTI GENERAL) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "bootcamp" && (
        activeProgramDetail ? (
          <motion.div
            id="tabpanel-bootcamp"
            role="tabpanel"
            aria-labelledby="tab-bootcamp"
            key={activeProgramDetail.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Header Info Komparasi Spesifik */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E8E4] shadow-sm space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#141412] text-[#FFD84D]">
                  MIKRO · PROGRAM HEAD-TO-HEAD
                </span>
                <span className="font-mono text-xs bg-[#FFF4E5] text-[#A15C00] border border-[#FFE2B8] font-bold px-2.5 py-0.5 rounded-full">
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
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 rounded-xl border border-[#D9D9D4] bg-[#FAFAF8] p-3 sm:p-4 shadow-sm overflow-hidden"
              >
                {/* Top Overline Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#E8E8E4]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#141412] bg-[#E8E8E4] px-2 py-0.5 rounded">
                      MATCHING PROGRAM
                    </span>
                  </div>
                </motion.div>

                {/* Duel Scorecard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-2">
                  {/* Left Contender: RevoU (Slide in from Left + Micro-lift on hover) */}
                  <motion.div
                    key={`revou-${activeProgramDetail.id}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}

                    className="bg-white rounded-lg border-l-4 border-l-[#1F7A4D] border border-[#E8E8E4] p-3 shadow-sm hover:shadow-sm hover:border-[#D0D0CB] transition-colors cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#1F7A4D]">
                        [01] PROGRAM RevoU
                      </span>
                      <span className="font-mono text-[11px] font-bold bg-[#EBF7EE] text-[#1F7A4D] px-1.5 py-0.5 rounded">
                        {activeProgramDetail.revouMatchBadge || "RevoU"}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xs sm:text-[13.5px] text-[#141412] leading-snug text-balance">
                      RevoU {activeProgramDetail.revouMatchProgram}
                    </h4>
                  </motion.div>

                  {/* Center VS Connector (Crisp Spring Pop-in + Micro-tilt on hover) */}
                  <div className="flex items-center justify-center my-0.5 md:my-0">
                    <div className="flex md:flex-col items-center justify-center gap-1">
                      <div className="hidden md:block w-px h-2 bg-[#D9D9D4]"></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}

                        className="size-7 rounded-full bg-[#141412] text-[#FFD84D] font-mono text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm shrink-0 select-none"
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
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}

                    className="bg-white rounded-lg border-l-4 border-l-[#B76E00] border border-[#E8E8E4] p-3 shadow-sm hover:shadow-sm hover:border-[#D0D0CB] transition-colors cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#60605B]">
                        [02] PROGRAM KOMPETITOR YANG SESUAI
                      </span>
                      <span className="font-mono text-[11px] font-bold bg-[#FFF4E5] text-[#A15C00] px-1.5 py-0.5 rounded">
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
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/4 font-bold border-r border-white/10">
                      Parameter Komparasi
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-[#FEF08A]" />
                        <span>RevoU {activeProgramDetail.revouMatchProgram}</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#2A2A26] text-white">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-[#FFD84D]" />
                        <span>{activeProgramDetail.competitorName} – {activeProgramDetail.programTitle}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E4]">
                  {activeProgramDetail.tableRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={cn("transition-colors", row.highlight ? "bg-[#FFFDF5]/80 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50"
                        )}
                    >
                      <td className="p-3.5 sm:p-4 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top">
                        <div>
                          <span className="text-xs sm:text-[13px]">{row.parameter}</span>
                          <span className="block font-mono text-[11px] text-[#60605B] font-normal uppercase mt-0.5 tracking-wider">
                            {row.categoryTag}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-[#1F7A4D] shrink-0 mt-0.5" />
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
              <div className="bg-[#FAFAF8] border border-[#E8E8E4] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E4] pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📸</span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-[#141412] text-balance">
                        Acuan Visual Silabus &amp; Stack ({activeProgramDetail.competitorName} {activeProgramDetail.programTitle})
                      </h4>
                    </div>
                    <p className="text-xs text-[#73736C] text-pretty">
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
                      className="rounded-xl border border-[#E8E8E4] bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-sm hover:border-[#141412]/30 transition-all"
                    >
                      <div className="p-3 bg-[#F5F5F2]/70 border-b border-[#E8E8E4] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white text-[#141412] border border-[#E8E8E4]">
                            Fase {idx + 1}
                          </span>
                          <span className="font-mono text-[11px] font-medium text-[#60605B]">
                            {refImg.tools.length} Tools
                          </span>
                        </div>
                        <h5 className="font-display font-bold text-xs sm:text-[13px] text-[#141412] text-balance">
                          {refImg.title}
                        </h5>
                        {refImg.subtitle && (
                          <p className="text-[11px] text-[#73736C] leading-snug text-pretty">
                            {refImg.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-white flex items-center justify-center min-h-[110px] max-h-[140px] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={refImg.url}
                          alt={refImg.title}
                          className="max-h-[100px] w-auto object-contain rounded"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-2.5 mt-auto bg-[#FAFAF8] border-t border-[#E8E8E4] flex flex-wrap gap-1">
                        {refImg.tools.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white text-[#4B4B46] border border-[#E8E8E4]"
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
                  <CheckCircle2 className="size-4 text-[#1F7A4D]" />
                  <span>Keunggulan Mutlak RevoU ({activeProgramDetail.revouMatchProgram})</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] font-medium leading-relaxed text-pretty">
                  {activeProgramDetail.revouEdge}
                </p>
                <div className="text-[11.5px] text-[#1F7A4D] space-y-1 pt-1 border-t border-[#D4EDDA]/80">
                  <p className="text-pretty">✓ 100% Live Instruction malam (19:00–21:00 WIB) — tidak perlu resign kerja</p>
                  <p className="text-pretty">✓ 12 Minggu Virtual Internship mengerjakan real client & real budget/dataset (bukan sekadar tugas simulasi internal)</p>
                  <p className="text-pretty">✓ Pendampingan Karir Intensif Career+ (1:1 Coaching sampai Hired)</p>
                </div>
              </div>

              {/* Keterbatasan Program Kompetitor */}
              <div className="p-4 sm:p-5 rounded-xl border border-[#FFD84D]/80 bg-[#FFFDF0] space-y-2.5 card-interactive">
                <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                  <AlertTriangle className="size-4 text-[#A15C00]" />
                  <span>Keterbatasan {activeProgramDetail.competitorName} yang Perlu Diketahui AC</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#141412] leading-relaxed text-pretty">
                  {activeProgramDetail.competitorLimitation}
                </p>
                <p className="text-[11px] text-[#60605B] italic pt-1 border-t border-[#FFD84D]/40 text-pretty">
                  💡 Gunakan poin ini secara elegan saat calon siswa menanyakan perbandingan spesifik program ini.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            id="tabpanel-bootcamp"
            role="tabpanel"
            aria-labelledby="tab-bootcamp"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border-2 border-dashed border-[#D9D9D4] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-sm card-interactive"
          >
            <div className="size-14 rounded-2xl bg-[#FFF6D1] text-[#A15C00] mx-auto flex items-center justify-center border border-[#FFD84D] shadow-sm">
              <Layers className="size-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-lg sm:text-xl text-[#141412] text-balance">
                Pilih Program untuk Membuka Tabel Komparasi Spesifik
              </h4>
              <p className="text-sm text-[#60605B] max-w-[56ch] mx-auto leading-relaxed text-pretty">
                Pilih salah satu program {competitorDisplayNames[selectedCompetitorKey]} di bawah ini atau melalui dropdown di atas untuk membuka perbandingan detail parameter per parameter.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {availableProgramsForSelectedComp.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProgramId(p.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9D9D4] bg-[#FAFAF8] text-xs font-semibold text-[#141412] hover:bg-[#FFF6D1] hover:border-[#FFD84D] transition-all cursor-pointer shadow-2xs select-none"
                >
                  <span>{p.programTitle}</span>
                  <span className="font-mono text-[10px] text-[#60605B] bg-[#EDEDEA] px-1.5 py-0.5 rounded">
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TAB: MATRIKS KOMPARASI LEMBAGA (MAKRO EKOSISTEM BELAJAR)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {SHOW_GENERAL_COMPARISON && activeTab === "general" && (
        <motion.div
          id="tabpanel-general"
          role="tabpanel"
          aria-labelledby="tab-general"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {/* Header Info & View Mode Toggle */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E8E4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <h3 className="font-display font-bold text-base sm:text-lg text-[#141412] pt-1 text-balance">
                Matriks Perbandingan Standar Mutu Lembaga
              </h3>
              <p className="text-xs text-[#60605B] max-w-[72ch] leading-relaxed text-pretty">
                Perbandingan makro sistem pendidikan, support system belajar, jaminan refund, sertifikasi universitas, dan tingkat seleksi RevoU vs kompetitor.
              </p>
            </div>

            {/* Toggle Mode: Head-to-Head vs Semua Lembaga */}
            <div className="flex items-center gap-1 bg-[#F5F5F2] p-1 rounded-xl border border-[#E8E8E4] shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => setInstitutionViewMode("headToHead")}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5", institutionViewMode === "headToHead"
                  ? "bg-[#141412] text-[#FFD84D] shadow-sm"
                  : "text-[#60605B] hover:text-[#141412]"
                  )}
              >
                <span>RevoU vs {competitorDisplayNames[selectedCompetitorKey]}</span>
              </button>
              <button
                type="button"
                onClick={() => setInstitutionViewMode("allCompetitors")}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5", institutionViewMode === "allCompetitors"
                  ? "bg-[#141412] text-[#FFD84D] shadow-sm"
                  : "text-[#60605B] hover:text-[#141412]"
                  )}
              >
                <Layers className="size-3.5" />
                <span>Semua Lembaga (Bird&apos;s-Eye)</span>
              </button>
            </div>
          </div>

          {/* ── TABEL MATRIKS ── */}
          {institutionViewMode === "headToHead" ? (
            /* Mode 1: Head-to-Head Lembaga (RevoU vs Selected Competitor) */
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/4 font-bold border-r border-white/10">
                      Parameter &amp; Standar Lembaga
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-[#FEF08A]" />
                        <span>RevoU (Standar Mutu Utama)</span>
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 w-3/8 font-bold bg-[#2A2A26] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-[#FFD84D]" />
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
                      className={cn("transition-colors", row.revouHighlight ? "bg-[#FFFDF5]/70 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50")}
                    >
                      <td className="p-3.5 sm:p-4 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top">
                        <div>
                          <span className="text-xs sm:text-[13px]">{row.feature}</span>
                          <span className="block font-mono text-[11px] text-[#60605B] font-normal uppercase mt-0.5">
                            {row.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#141412] font-medium border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-[#1F7A4D] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            {renderComparisonCell(row.revou, true)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed font-normal bg-[#FAFAF8]/60 text-xs sm:text-[13px]">
                        {renderComparisonCell(row[selectedCompetitorKey] || row.general, false)}
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#60605B] align-top leading-relaxed text-xs">
                        {row.selfPaced}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Mode 2: Matriks Semua Lembaga (RevoU vs Hacktiv8 vs Purwadhika vs Dibimbing vs DQLab) */
            <div className="overflow-x-auto rounded-xl border border-[#E8E8E4] bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse min-w-[1900px]">
                <thead>
                  <tr className="bg-[#141412] text-white font-display text-xs sm:text-sm">
                    <th className="p-3.5 sm:p-4 w-1/6 font-bold border-r border-white/10 sticky left-0 bg-[#141412] z-10">
                      Parameter Lembaga
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/5 font-bold bg-[#1F7A4D] border-r border-white/10 text-white">
                      <div className="flex items-center gap-1">
                        <Sparkles className="size-3.5 text-[#FEF08A]" />
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
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      DQLab
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      Rework
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      TempatBelajar
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      Dicoding
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold border-r border-white/10 bg-[#2A2A26] text-white">
                      MySkill
                    </th>
                    <th className="p-3.5 sm:p-4 w-1/6 font-semibold bg-[#2A2A26] text-white">
                      FS Bangalore
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E4]">
                  {GENERAL_COMPARISON_DATA.map((row, idx) => (
                    <tr
                      key={idx}
                      className={cn("transition-colors", row.revouHighlight ? "bg-[#FFFDF5]/70 hover:bg-[#FFF9E6]" : "hover:bg-[#F5F5F2]/50")}
                    >
                      <td className="p-3 sm:p-3.5 font-semibold text-[#141412] border-r border-[#E8E8E4]/70 align-top sticky left-0 bg-white z-10 shadow-sm">
                        <span className="text-xs sm:text-[12.5px]">{row.feature}</span>
                        <span className="block font-mono text-[11px] text-[#60605B] font-normal uppercase mt-0.5">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] font-medium border-r border-[#E8E8E4]/70 bg-[#EBF7EE]/40 align-top">
                        <div className="flex items-start gap-1">
                          <CheckCircle2 className="size-3 text-[#1F7A4D] shrink-0 mt-0.5" />
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
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.dqlab, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.rework || row.general, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.tempatbelajar || row.general, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.dicoding || row.general, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] border-r border-[#E8E8E4]/70 align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.myskill || row.general, false)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#141412] align-top leading-relaxed text-xs">
                        {renderComparisonCell(row.fullstackbangalore || row.general, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Catatan Verifikasi Data Kompetitor */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-xs text-[#60605B] leading-relaxed">
            <Info className="size-4 text-[#A15C00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#141412] font-semibold">Catatan Transparansi &amp; Validasi Data (Audit Website Resmi Okt 2026): </strong>
              Completion rate tidak dipublikasikan oleh satu pun kompetitor di halaman website resmi mereka (kandidat sumber sekunder: laporan CIRR Hacktiv8 PDF dan Outcomes Report Dibimbing). RevoU transparan mempublikasikan 93% completion rate resmi. Untuk perbandingan detail teknis kurikulum, biaya paket, dan modul per program, silakan buka tab <strong>Komparasi Spesifik Program</strong>.
            </div>
          </div>

          {/* ── 5 PILAR STANDAR KEUNGGULAN LEMBAGA REVOU (MAKRO SELLING POINTS) ── */}
          <div className="bg-white rounded-2xl border border-[#E8E8E4] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#A15C00]" />
              <h4 className="font-display font-bold text-sm sm:text-base text-[#141412] text-balance">
                5 Pilar Standar Mutu Lembaga RevoU (Kunci Diferensiasi Makro AC)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="size-3.5 text-[#1F7A4D]" />
                  <span>1. Seleksi Ketat (&lt;10% Penerimaan)</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed text-pretty">
                  Menjamin peer group dan circle belajar yang memiliki komitmen tinggi, saling memotivasi, dan suportif hingga lulus.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="size-3.5 text-[#1F7A4D]" />
                  <span>2. 100% Live Instruction Interaktif 5x/Minggu</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed text-pretty">
                  Bukan menonton video rekaman mandiri. Setiap malam dipandu praktisi aktif industri dengan sesi tanya-jawab langsung dua arah.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="size-3.5 text-[#1F7A4D]" />
                  <span>3. 12 Minggu Virtual Internship (Real Client &amp; Dataset)</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed text-pretty">
                  Bukan sekadar tugas simulasi internal. Peserta memegang anggaran iklan jutaan rupiah riil atau menganalisis dataset bisnis riil perusahaan partner (Telkom OCA, Zurich, dll).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="size-3.5 text-[#1F7A4D]" />
                  <span>4. Kemitraan Kampus Top (ITB, BINUS, UI)</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed text-pretty">
                  Kredensial dan sertifikat resmi universitas teknik &amp; bisnis nomor satu di Indonesia yang diakui luas oleh para perekrut.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-1.5 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 font-display font-bold text-xs text-[#1F7A4D]">
                  <CheckCircle2 className="size-3.5 text-[#1F7A4D]" />
                  <span>5. Bimbingan Karir Intensif Career+</span>
                </div>
                <p className="text-xs text-[#4B4B46] leading-relaxed text-pretty">
                  Pendampingan 1:1 Personal Career Coach selama 7-8 bulan, AI Career Engine untuk CV/LinkedIn, dan simulasi interview langsung bersama Hiring Manager hingga siap kerja.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. TAB: ONE-PAGER BATTLECARD (TERHUBUNG LANGSUNG KE DROPDOWN) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "battlecards" && (
        <div
          id="tabpanel-battlecards"
          role="tabpanel"
          aria-labelledby="tab-battlecards"
          className="space-y-6"
        >
          {/* Quick Program Switcher Bar */}
          <div className="bg-white border border-[#E8E8E4] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E8E4] pb-3">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-[#A15C00]" />
                <span className="font-display font-bold text-sm text-[#141412]">
                  Koleksi Battlecard: {competitorDisplayNames[selectedCompetitorKey]}
                </span>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FAFAF8] text-[#60605B] border border-[#E8E8E4]">
                  {availableProgramsForSelectedComp.length} Program Terverifikasi
                </span>
              </div>
              {selectedProgramId && (
                <button
                  type="button"
                  onClick={() => setSelectedProgramId("")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#A15C00] hover:underline cursor-pointer"
                >
                  <span>Lihat One-Pager Macro Lembaga</span>
                  <ArrowRight className="size-3" />
                </button>
              )}
            </div>

            {/* Horizontal program selector chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSelectedProgramId("")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none",
                  !selectedProgramId
                    ? "bg-[#141412] text-white border-[#141412] shadow-sm"
                    : "bg-[#FAFAF8] text-[#60605B] border-[#E8E8E4] hover:bg-[#F0F0EC] hover:text-[#141412]"
                )}
              >
                📋 One-Pager Macro ({competitorDisplayNames[selectedCompetitorKey]})
              </button>
              {availableProgramsForSelectedComp.map((prog) => {
                const isSelected = prog.id === selectedProgramId;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleSelectProgramId(prog.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none",
                      isSelected
                        ? "bg-[#1F7A4D] text-white border-[#1F7A4D] shadow-sm"
                        : "bg-[#FAFAF8] text-[#141412] border-[#E8E8E4] hover:bg-[#FFF6D1] hover:border-[#FFD84D]"
                    )}
                  >
                    <span>{prog.programTitle}</span>
                    <span className={cn(
                      "font-mono text-[10px] px-1.5 py-0.2 rounded",
                      isSelected ? "bg-white/20 text-white" : "bg-[#EDEDEA] text-[#60605B]"
                    )}>
                      {prog.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {!activeProgramDetail || !activeProgramBattlecard ? (
            /* ── VIEW A: ONE-PAGER MACRO BATTLECARD LEMBAGA ── */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="bg-white border border-[#E8E8E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
                {/* Header info */}
                <div className="border-b border-[#E8E8E4] pb-4 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase font-bold tracking-wider bg-[#FFF4E5] text-[#A15C00] border border-[#FFE2B8] px-2.5 py-0.5 rounded-full">
                        ONE-PAGER MACRO BATTLECARD LEMBAGA
                      </span>
                      <span className="font-mono text-[11px] bg-[#EBF7EE] text-[#1F7A4D] font-bold px-2 py-0.5 rounded-full border border-[#D4EDDA]">
                        Verified Audit Scrape 13 Nov 2026
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141412] pt-1 text-balance">
                    RevoU <span className="text-[#60605B] font-normal">vs</span> {activeBattlecard.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60605B] text-pretty">
                    {activeBattlecard.tagline}
                  </p>
                </div>

                {/* 5 Core Dimensions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Price */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <DollarSign className="size-4 text-[#A15C00]" />
                      <span>1. Price & Skema Pembayaran</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed whitespace-pre-line">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeBattlecard.name}: </strong>
                        {activeBattlecard.price}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        Rp 16jt – 25jt (Program Karir) | Rp 15jt – 16,99jt (Program Eksekutif). Cicilan 0% s.d. 12-18 bulan via kartu kredit/Danacita, tanpa biaya kos.
                      </p>
                    </div>
                  </div>

                  {/* 2. Duration & Schedule */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <Clock className="size-4 text-[#A15C00]" />
                      <span>2. Duration and Schedule</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed whitespace-pre-line">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeBattlecard.name}: </strong>
                        {activeBattlecard.duration}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        7 – 8 bulan komprehensif (Modul Live + 12 Minggu Virtual Internship + Career+), kelas malam 19:00–21:00 WIB (tidak perlu resign).
                      </p>
                    </div>
                  </div>

                  {/* 3. Format */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <Video className="size-4 text-[#A15C00]" />
                      <span>3. Format Pembelajaran</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeBattlecard.name}: </strong>
                        {activeBattlecard.format}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        100% Live Online interaktif dua arah (tanya jawab langsung) + akses rekaman selamanya + 24/7 AI Learning Assistant.
                      </p>
                    </div>
                  </div>

                  {/* 4. Career Support */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <Briefcase className="size-4 text-[#A15C00]" />
                      <span>4. Career Support & Outcomes</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeBattlecard.name}: </strong>
                        {activeBattlecard.careerSupport}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        RevoU Career+ (1:1 Personal Career Coach selama 7-8 bulan, AI Career Engine optimasi CV/LinkedIn, dan Mock Interview bersama Hiring Manager).
                      </p>
                    </div>
                  </div>

                  {/* 5. Kurikulum & Karakteristik Belajar */}
                  {activeBattlecard.curriculum && (
                    <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2 md:col-span-2">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A15C00] font-bold">
                        <Layers className="size-4 text-[#A15C00]" />
                        <span>5. Kurikulum &amp; Karakteristik Pembelajaran</span>
                      </div>
                      <div className="text-xs text-[#141412] space-y-2 leading-relaxed">
                        <p className="text-pretty">
                          <strong className="text-[#60605B] font-semibold">{activeBattlecard.name}: </strong>
                          {activeBattlecard.curriculum}
                        </p>
                        <p className="text-pretty">
                          <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                          Kurikulum AI-Native teruji industri SEA dengan 12 minggu Virtual Internship mengerjakan real business case partner korporasi, real budget ads, dan kemitraan universitas top (ITB, BINUS x AWS, UI).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tools & Ekosistem Teknologi Lembaga */}
                  {activeBattlecard.tools && activeBattlecard.tools.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-3 md:col-span-2 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 border-b border-[#E8E8E4] pb-2">
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A15C00] font-bold">
                          <Sparkles className="size-4 text-[#A15C00]" />
                          <span>Tools &amp; Ekosistem Teknologi yang Dipelajari</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#60605B]">
                          Spektrum Tools Lembaga
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        <div className="space-y-2 p-3 rounded-xl bg-white border border-[#E8E8E4]">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#60605B]">
                              {activeBattlecard.name} ({activeBattlecard.tools.length} Tools)
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F5F2] text-[#60605B]">
                              Fokus Silabus
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {activeBattlecard.tools.map((t, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F5F5F2] text-[#2A2A26] border border-[#E8E8E4]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 p-3 rounded-xl bg-[#EBF7EE]/40 border border-[#D4EDDA]">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#1F7A4D]">
                              RevoU Ecosystem (AI-Native &amp; Enterprise Cloud)
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1F7A4D]/10 text-[#1F7A4D] font-bold">
                              Industry Benchmark
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {[
                              "BigQuery & SQL",
                              "Python (Data & Backend)",
                              "Next.js 15 (App Router)",
                              "AWS Cloud Partner",
                              "Tableau & GA4",
                              "Meta & Google Ads",
                              "Apache Airflow (ETL)",
                              "Kiro AI (Spec-driven)",
                              "Claude Code & ChatGPT Plus",
                              "12 Minggu Virtual Internship Tools"
                            ].map((t, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-[#1F7A4D] border border-[#C3E6CB] shadow-2xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Certification */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <ShieldCheck className="size-4 text-[#A15C00]" />
                      <span>6. Certification &amp; Kemitraan Kampus</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-1.5 leading-relaxed">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeBattlecard.name}: </strong>
                        {activeBattlecard.certification}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        RevoU Certificate bertaraf internasional (Course Report 4.94, SwitchUp 4.93) + Kemitraan Resmi AWS Partner + Universitas Top (#1 ITB, BINUS x AWS, UI).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Honest Strengths & Where RevoU Wins */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 sm:p-5 rounded-xl border border-[#FFD84D]/70 bg-[#FFFDF0] space-y-2">
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                      <Lightbulb className="size-4 text-[#A15C00]" />
                      <span>6. What They Genuinely Do Better (Kelebihan Jujur)</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#141412] leading-relaxed text-pretty">
                      &quot;{activeBattlecard.honestStrength}&quot;
                    </p>
                    <p className="text-[11px] text-[#60605B] italic text-pretty">
                      💡 Tips AC: Akui keunggulan ini secara jujur. Jangan pernah membantah, melainkan angkat kebutuhan holistik prospek (apakah butuh sekadar teori/tools dasar atau karir menyeluruh).
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-2">
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                      <CheckCircle2 className="size-4 text-[#1F7A4D]" />
                      <span>7. Where RevoU Wins (Keunggulan Telak RevoU)</span>
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
                    <ShieldCheck className="size-4 text-[#0E62FE]" />
                    <span>8. One Proof Point (1 Bukti Konkret Wajib)</span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-[#141412] font-medium leading-relaxed text-pretty">
                    🎯 {activeBattlecard.proofPoint}
                  </p>
                </div>

                {/* WhatsApp Script Template */}
                <div className="p-4 sm:p-5 rounded-xl border-2 border-[#1F7A4D]/40 bg-[#F4FAF6] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-md bg-[#1F7A4D] text-white flex items-center justify-center">
                        <MessageSquare className="size-3.5" />
                      </div>
                      <span className="font-display font-bold text-xs sm:text-sm text-[#141412]">
                        Script WhatsApp AC (Siap Kirim ke Prospek)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(activeBattlecard.acScriptTemplate, `macro-${activeBattlecard.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F7A4D] text-white text-xs font-semibold hover:bg-[#18623D] transition-colors cursor-pointer shadow-sm select-none"
                    >
                      {copiedId === `macro-${activeBattlecard.id}` ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Salin Script</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#D4EDDA] text-xs text-[#141412] leading-relaxed whitespace-pre-line font-sans">
                    {activeBattlecard.acScriptTemplate}
                  </div>
                </div>

                {/* Program Cards Grid (Quick Access to Program-level battlecards) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-[#141412]">
                      Daftar {availableProgramsForSelectedComp.length} Program Spesifik {activeBattlecard.name}
                    </h4>
                    <span className="text-xs text-[#60605B]">Klik kartu untuk membuka Battlecard Spesifik</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableProgramsForSelectedComp.map((prog) => (
                      <div
                        key={prog.id}
                        onClick={() => handleSelectProgramId(prog.id)}
                        className="p-3.5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] hover:bg-[#FFFDF5] hover:border-[#FFD84D] transition-all cursor-pointer space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-xs text-[#141412] group-hover:text-[#A15C00] transition-colors line-clamp-1">
                            {prog.programTitle}
                          </span>
                          <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#EDEDEA] text-[#4B4B46] shrink-0">
                            {prog.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#60605B] line-clamp-2">
                          Padanan RevoU: <strong>{prog.revouMatchProgram}</strong>
                        </p>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1F7A4D] group-hover:translate-x-0.5 transition-transform">
                          <span>Buka Battlecard Program</span>
                          <ArrowRight className="size-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── VIEW B: ONE-PAGER BATTLECARD PER PROGRAM ── */
            <motion.div
              key={activeProgramDetail.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="bg-white border border-[#E8E8E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
                {/* Header info */}
                <div className="border-b border-[#E8E8E4] pb-4 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase font-bold tracking-wider bg-[#FFF4E5] text-[#A15C00] border border-[#FFE2B8] px-2.5 py-0.5 rounded-full">
                        ONE-PAGER BATTLECARD PER PROGRAM
                      </span>
                      <span className="font-mono text-[11px] bg-[#EBF7EE] text-[#1F7A4D] font-bold px-2 py-0.5 rounded-full border border-[#D4EDDA]">
                        Verified Data 13 Nov 2026
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProgramId("")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#A15C00] hover:underline cursor-pointer"
                    >
                      <span>← Kembali ke Macro Battlecard</span>
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#141412] pt-1 text-balance">
                    RevoU {activeProgramBattlecard.revouMatchProgram} <span className="text-[#60605B] font-normal">vs</span> {activeProgramBattlecard.competitorName} {activeProgramBattlecard.programTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60605B] text-pretty">
                    {activeProgramBattlecard.badge} · Padanan resmi kurikulum industri RevoU vs {activeProgramBattlecard.competitorName}
                  </p>
                </div>

                {/* 5 Core Dimensions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Price */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <DollarSign className="size-4 text-[#A15C00]" />
                      <span>1. Price & Skema Cicilan (Instalments)</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed whitespace-pre-line">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.competitorPrice}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.revouPrice}
                      </p>
                    </div>
                  </div>

                  {/* 2. Duration & Schedule */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <Clock className="size-4 text-[#A15C00]" />
                      <span>2. Duration and Schedule</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed whitespace-pre-line">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.durationTextComp}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.durationTextRevoU}
                      </p>
                    </div>
                  </div>

                  {/* 3. Format */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <Video className="size-4 text-[#A15C00]" />
                      <span>3. Format Belajar (Live or Recorded / Offline)</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.competitorFormat}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.revouFormat}
                      </p>
                    </div>
                  </div>

                  {/* 4. Career Support & Claims */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <Briefcase className="size-4 text-[#A15C00]" />
                      <span>4. Career Support and Placement Claims</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.careerSupportComp}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.careerSupportRevoU}
                      </p>
                    </div>
                  </div>

                  {/* 5. Kurikulum, Silabus & Tools */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A15C00] font-bold">
                      <Layers className="size-4 text-[#A15C00]" />
                      <span>5. Kurikulum, Silabus &amp; Cakupan Tools Modern</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed whitespace-pre-line">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.curriculumComp}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.curriculumRevoU}
                      </p>
                    </div>
                  </div>

                  {/* Tools & Teknologi yang Dipelajari (Program-Level) */}
                  <div className="p-4 sm:p-5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-3 md:col-span-2 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-[#E8E8E4] pb-2">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A15C00] font-bold">
                        <Sparkles className="size-4 text-[#A15C00]" />
                        <span>Tools &amp; Teknologi yang Dipelajari (Tech Stack)</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#60605B]">
                        Head-to-head Tools RevoU vs {activeProgramBattlecard.competitorName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {/* Competitor Tools */}
                      <div className="space-y-2 p-3 rounded-xl bg-white border border-[#E8E8E4]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[#60605B]">
                            {activeProgramBattlecard.competitorName} ({activeProgramBattlecard.toolsComp.length} Tools)
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F5F2] text-[#60605B]">
                            Tools Silabus
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {activeProgramBattlecard.toolsComp.map((tool, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F5F5F2] text-[#2A2A26] border border-[#E8E8E4]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* RevoU Tools */}
                      <div className="space-y-2 p-3 rounded-xl bg-[#EBF7EE]/40 border border-[#D4EDDA]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[#1F7A4D]">
                            RevoU {activeProgramBattlecard.revouMatchProgram} ({activeProgramBattlecard.toolsRevoU.length} Tools)
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1F7A4D]/10 text-[#1F7A4D] font-bold">
                            AI-Native &amp; Enterprise
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {activeProgramBattlecard.toolsRevoU.map((tool, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-[#1F7A4D] border border-[#C3E6CB] shadow-2xs"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Portofolio & Real Projects */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <CheckCircle2 className="size-4 text-[#A15C00]" />
                      <span>6. Portofolio &amp; Real Projects</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed whitespace-pre-line">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.portfolioComp}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.portfolioRevoU}
                      </p>
                    </div>
                  </div>

                  {/* 7. Certification */}
                  <div className="p-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#60605B] font-bold">
                      <ShieldCheck className="size-4 text-[#A15C00]" />
                      <span>7. Certification &amp; Kredensial Resmi</span>
                    </div>
                    <div className="text-xs text-[#141412] space-y-2 leading-relaxed">
                      <p className="text-pretty">
                        <strong className="text-[#60605B] font-semibold">{activeProgramBattlecard.competitorName}: </strong>
                        {activeProgramBattlecard.competitorCert}
                      </p>
                      <p className="text-pretty">
                        <strong className="text-[#1F7A4D] font-semibold">RevoU: </strong>
                        {activeProgramBattlecard.revouCert}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Strategic Differentiators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 sm:p-5 rounded-xl border border-[#FFD84D]/70 bg-[#FFFDF0] space-y-2">
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#A15C00]">
                      <Lightbulb className="size-4 text-[#A15C00]" />
                      <span>6. What They Genuinely Do Better (Stated Honestly)</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#141412] leading-relaxed text-pretty">
                      &quot;{activeProgramBattlecard.honestStrength}&quot;
                    </p>
                    <p className="text-[11px] text-[#60605B] italic text-pretty">
                      💡 Tips AC: Jangan pernah membantah poin ini. Akui kelebihan ini secara elegan, lalu arahkan kembali ke relevansi target karir prospek.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl border border-[#D4EDDA] bg-[#EBF7EE]/60 space-y-2">
                    <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-[#1F7A4D]">
                      <CheckCircle2 className="size-4 text-[#1F7A4D]" />
                      <span>7. Where RevoU Wins (Keunggulan Telak RevoU)</span>
                    </div>
                    <ul className="text-xs text-[#141412] space-y-1.5 list-disc pl-4 leading-relaxed">
                      {activeProgramBattlecard.revouWins.map((win, idx) => (
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
                    <ShieldCheck className="size-4 text-[#0E62FE]" />
                    <span>8. One Proof Point (1 Bukti Konkret Wajib)</span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-[#141412] font-medium leading-relaxed text-pretty">
                    🎯 {activeProgramBattlecard.proofPoint}
                  </p>
                </div>

                {/* WhatsApp Script Template (Program-specific) */}
                {activeProgramBattlecard.acScriptTemplate && (
                  <div className="p-4 sm:p-5 rounded-xl border-2 border-[#1F7A4D]/40 bg-[#F4FAF6] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-md bg-[#1F7A4D] text-white flex items-center justify-center">
                          <MessageSquare className="size-3.5" />
                        </div>
                        <span className="font-display font-bold text-xs sm:text-sm text-[#141412]">
                          Script WhatsApp AC (Spesifik Program {activeProgramBattlecard.programTitle})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(activeProgramBattlecard.acScriptTemplate, `prog-${activeProgramBattlecard.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F7A4D] text-white text-xs font-semibold hover:bg-[#18623D] transition-colors cursor-pointer shadow-sm select-none"
                      >
                        {copiedId === `prog-${activeProgramBattlecard.id}` ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Salin Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#D4EDDA] text-xs text-[#141412] leading-relaxed whitespace-pre-line font-sans">
                      {activeProgramBattlecard.acScriptTemplate}
                    </div>
                  </div>
                )}

                {/* Catatan Verifikasi Data Kompetitor */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] text-xs text-[#60605B] leading-relaxed">
                  <Info className="size-4 text-[#A15C00] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#141412] font-semibold">Catatan Data Website Resmi Kompetitor (Audit 13 Nov 2026): </strong>
                    Completion rate tidak dipublikasikan oleh kompetitor di website resmi. Data biaya, durasi, dan jadwal di atas disinkronkan langsung dari halaman resmi program {activeProgramBattlecard.competitorName} {activeProgramBattlecard.programTitle}.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}    </div>
  );
}
