### ITB: Applied Data Science with AI

#### Tentang Program

##### Program ini beneran kolaborasi ITB? Peran ITB-nya apa?

```text
Iya Kak, ini kolaborasi resmi *RevoU × Institut Teknologi Bandung* 🎓 ITB itu universitas teknik #1 di Indonesia (QS World Rankings #255 dunia, #1 di Indonesia untuk Matematika — disiplin di balik statistik program ini).

Peran ITB bukan sekadar logo: sesi statistik & inference diampu langsung dari ITB, professional certificate diterbitkan oleh ITB, ada opsi *microcredential 1 SKS* dari FTI ITB (ada biaya tambahan kalo mau konversi sks), dan 2 sesi diadakan langsung di kampus ITB Ganesha (Week 1 & Graduation Day).
```

##### Bedanya sama program Data Analytics with AI apa?

```text
Gampangnya gini Kak:
📊 *Data Analytics with AI* = fondasi: SQL, Python dasar, statistik deskriptif, dashboard — jawab "apa yang terjadi & kenapa".
🚀 *Applied Data Science with AI* = level lanjutannya: predictive modeling, validasi statistik, AI-assisted building, sampai data product utk jawab "apa yang akan terjadi & sistem apa yang harus dibangun"
```

#### Prasyarat

##### Aku pemula banget di data, bisa ikut ga?

```text
Aku jujur di awal ya Kak 🙏 Program ini *advanced*, materinya langsung masuk ke predictive modeling & AI, dan kita ga ngajarin SQL/Python dari nol. Kalau dipaksain, Kakak yang rugi karena bakal keteteran dari minggu pertama.

Saranku: mulai dari program *Data Analytics with AI* dulu buat bangun fondasinya (SQL, Python, statistik, dashboard). Lulusannya ada yg lanjut ke program ini, jadi jalurnya udah lebih pas. Mau aku bantu info program itu, Kak?
```

##### Prasyaratnya apa aja? Gimana aku tahu aku siap?

```text
Prasyaratnya 4 hal Kak:
✅ SQL dasar (nyaman bikin query & join)
✅ Python dasar
✅ Terbiasa dgn statistik deskriptif & distribusi
✅ Terbiasa baca dashboard / output analisis

Cek cepatnya: kalau di kerjaan Kakak udah biasa query data sendiri, pernah utak-atik notebook Python, dan ngerti mean/median/distribusi — kemungkinan besar siap 👍 Biasanya cocok buat yang udah 1–5 tahun di analytics/BI/quantitative role.
```

##### Fresh graduate boleh ikut?

```text
Umumnya program ini buat yang udah 1–5+ tahun kerja di analytics Kak. Tapi *advanced fresh graduate* bisa dipertimbangkan — asal beneran lolos gerbang teknisnya: SQL, Python/pandas, statistik deskriptif, dan terbiasa sama analytical workflow.

Jadi bukan soal umur/status, tapi kesiapan teknis. Kalau Kakak fresh grad tapi udah aktif ngerjain project data (skripsi kuantitatif, internship data, kompetisi), boleh banget kita diskusiin 😊
```

#### Konten AI

##### Kalau AI bisa bikinin model, kenapa aku harus belajar bikin manual dulu?

```text
Pertanyaan bagus Kak 😄 Justru itu inti programnya: AI sekarang bisa generate model *lebih cepat dari yang bisa kita review*. Risikonya: output yg keliatan keren tapi salah — statistik fabricated, data leakage, threshold ngawur.

Makanya urutannya disengaja: Week 1–3 bangun AI manual biar Kakak tahu persis seperti apa "benar" itu. Week 4 udh mulai masuk ke Claude Code . Week 7 full delegation udh pegang sendiri coding agent. Dnn saat itu Kakak udh punya standar buat menilai kerjaan si AI. Hasilnya: kecepatan AI + judgment manusia. Itu kombinasi yang dicari perusahaan sekarang.
```

##### Belajar deep learning / NLP / computer vision ga?

```text
Dikenalin, tapi bukan fokusnya Kak. Di Week 7 ada sesi *Modern AI/ML Landscape*: posisi classical ML vs deep learning vs GenAI vs AI agents, termasuk hands-on pakai LLM buat extraction/classification + explainability (SHAP/LIME) untuk black-box model.

Tapi program ini jujur soal scope: *bukan* spesialisasi DL/CV/NLP engineering, dan bukan full MLOps/cloud deployment. Fokusnya: predictive modeling yang defensible + AI-assisted execution + data product — kemampuan inti transisi analyst → applied data scientist.
```

##### Apakah bisa full pakai platform kantor, dengan AI hanya untuk konsultasi coding?

```text
Kakak bisa mengerjakan analisis dan modelling di Jupyter/VS Code kantor, lalu memakai AI hanya untuk konsultasi kode. Program tidak mewajibkan data masuk ke tool AI.

- Mode konsultasi (chat): Kakak menempel kode atau skema, AI menjawab. AI hanya melihat apa yang Kakak tempel. Ini cocok untuk Gemini di Minggu 1–3.
- Mode agent (Claude Code): AI bekerja di folder project, bisa membaca file, menjalankan kode, dan mengubah file. Secara umum ini berarti AI bisa melihat file data yang ada di folder itu.

Jadi kalau Kakak ingin “AI tidak terlibat ke datanya”, pastikan folder project yang dipakai Claude Code hanya berisi kode dan data sintetis atau teranonimkan. Data asli tetap di environment on-premise, di luar folder itu. Ini saran saya berdasarkan cara kerja tool tersebut, bukan aturan tertulis program. Cara praktis menjaga data tetap aman (saran saya). Buat salinan skema dengan data sintetis atau hasil anonimisasi yang disetujui kantor. Kembangkan dan debug kode dengan AI di atas data itu. Jalankan kode final di Jupyter on-premise dengan data asli, tanpa AI. Hanya hasil agregat (metrik model, grafik) yang dibawa ke capstone. Dengan alur ini yang dibagikan ke program adalah kode dan data yang boleh dibagikan, sesuai aturan capstone (anonim, ada disclaimer, tanpa data mentah di GitHub).
```

##### Apakah ada materi Agentic AI / Agentic Analytics?

```text
Ada! Di program ITB Applied Data Science with AI, materi agentic dipelajari secara praktikal pada dua tahap:
- *Week 7 (Modern AI/ML Landscape & Full Delegation):* Memahami posisi classical ML vs deep learning vs GenAI vs *AI agents*, serta full delegation menggunakan *Claude Code* sebagai coding agent (setelah fondasi manual di Week 1–3)
- *Week 10 (Agentic Analytics & Data Product):* Mempelajari *agentic analytics* dan otomatisasi alur kerja, serta mengonversi model matematika menjadi data product interaktif (antarmuka Streamlit + decision memo)
```

#### Capstone

##### Capstone-nya pakai data apa? Bisa pakai case kantorku?

```text
Justru itu yang didorong Kak! 💼 Kakak bawa *masalah nyata dari kerjaan sendiri* dan mengubahnya jadi data product yang tervalidasi — briefnya mulai disusun dari Week 1, jadi capstone-nya matang, bukan kebut semalam.

Kalau data kantor ga boleh keluar, tenang: ada *anchor case* yang disediakan.
```

##### Boleh pakai AI pas ngerjain capstone? Terus dinilainya gimana?

```text
Boleh banget, malah memang begitu cara kerjanya Kak 😄 Claude Code & AI tools aktif dipakai buat akselerasi build. Tapi ada 2 syarat yang bikin hasilnya kredibel:
1️⃣ Semua penggunaan AI *terdokumentasi* (AI-use log + verification record) — setiap klaim penting harus didukung bukti yang Kakak verifikasi sendiri
2️⃣ *Defense-nya tanpa AI di ruangan.* Kakak harus bisa mempertahankan pilihan data, model, metric, limitasi & rekomendasi — sendirian, di depan panel.

Sebelum defense juga ada *red-team review*: project Kakak 'diserang' dulu buat cari kelemahan. Jadi yang lulus beneran ngerti kerjaannya, bukan hasil copy-paste 🔥
```

#### Sertifikat

##### Sertifikatnya apa & diakui ga?

```text
Kakak lulus dengan *Certificate of Completion* yg diterbitkan dan *bisa diverifikasi oleh ITB* setelah semua requirement program selesai. Ini jd kredensial dari salah 1 universitas teknik terkemuka di Asia 🎓

Tapi aku jujur ya Kak: di dunia data, yang paling ngangkat karir itu kombinasi *kredensial + bukti*. Makanya program ini kasih dua-duanya — sertifikat ITB *plus* data product live + repo GitHub + pengalaman defense di depan panel. Pas interview/dicek kantor, Kakak ga cuma nunjukin sertifikat, tapi bisa buka produknya: "ini model yang aku bangun, ini cara aku validasi, dan ini hasil defense-ku."✨
```

##### Microcredential 1 SKS itu apa? Cara dapatnya gimana?

```text
Bisa Kak! Kakak bisa dapat *Microcredential 1 SKS — Metode Statistika* dari FTI (Fakultas Teknologi Industri) ITB 🎓 Cara earn-nya:
1️⃣ Selesaikan program & dapatkan Certificate of Completion
2️⃣ Submit sertifikatnya ke ITB
3️⃣ Ada *additional payment* + ikut *additional assessment di kampus ITB*
4️⃣ Lulus assessment → dapat Microcredential Certificate senilai 1 SKS

Bonusnya: kalau nanti Kakak lanjut ke program degree yang eligible di ITB (misal S2), microcredential ini *bisa dikonversi jadi 1 SKS kredit* — tergantung ketentuan program studinya. Jadi ini bisa jadi batu loncatan akademik juga 😊
```

#### Karir

##### Kalian bantu nyalurin kerja ga?

```text
Izin info ya kak program ini *bukan program job placement*, dan ga ada janji jaminan kerja 🙏 Karena fokus programnya utk upgrade skill. Tapi output-nya didesain kuat buat karir:

1️⃣ *Data product live + repository GitHub* — bukti skill yang bisa langsung ditunjukkin ke recruiter
2️⃣ Pengalaman *panel defense* — latihan persis kayak technical interview level berat
3️⃣ *90-day career roadmap* di Graduation Day: portfolio story + rencana penerapan skill di role sekarang/target
4️⃣ Akses *komunitas alumni & AI community* — networking, event, dan peluang yang sering muncul dari situ
```

#### Jadwal & Format

##### Aku di luar Bandung — wajib datang ke ITB?

```text
Sesi on-campusnya cuma 2 hari aja kak: Week 1 (belajar langsung dari fakultas ITB + networking cohort) dan Week 12 (Graduation Day: presentasi capstone terbaik + seremoni sertifikat di kampus ITB).

Tp sesi offline ga wajib hadir ya, karena ada livestream dan rekaman sesinya jg 🙏
```

##### Kalau aku kelewatan sesi live gimana?

```text
Tenang Kak, *semua sesi live direkam* 🎥 Jadi kalau sesekali berhalangan, bisa catch-up dari recording — assignment-nya tetap dikerjain ya biar evidence & progresnya jalan 😄
```

#### Tentang Program

##### Tugasnya nanti seperti apa? Apakah mingguan atau hanya di akhir program saja?

```text
Ada 3 ritme tugas yang jalan bareng Kak:

1️⃣ Weekly Git checkpoint 👉 mulai Week 3, commit minimal 1x/minggu. Individual. tujuannya bangun habit reproducibility. kualitas Git-nya baru dinilai di Case Study

2️⃣ Case Study 👉 satu di tiap akhir modul: Case Study 1 (akhir Week 3), Case Study 2 (akhir Week 7), Case Study 3 (akhir Week 9). Individual.

3️⃣ Capstone Project 👉 1 project besar yg dibangun bertahap tiap modul lewat 4 Checkpoint.

Jadi ada ritme mingguan (Git), per-modul (Case Study), dan puncaknya di Defense (Capstone) 😊
```

##### mentoringnya gimana kak?

```text
Halo kak utk program ini sistem mentoringnya berikut:
- Profil Mentor: ini profesional yg biasanya pengalaman 3+ years dgn related professional experience data science
- Kalau ada mau tanya ke mentor di luar kelas bisa kak secara asynchronous. Nanti akan ada learning hub, di mana disitu ada semacam fitur forum utk bisa tanya pertanyaan apapun ke mentor. Ini jd bisa liat jg student lain ada nanya apa utk enrich insight-insight juga
- Untuk mentorship yg langsung live akan ada: 3 milestone check-ins dengan mentor + 2x capstone mentorship sessions sebelum panel defense.
```

##### review individual task gitu ada gak kak?

```text
ada review individual yaa kak, tp bukan berupa sesi. nanti reviewnya ada di learning hub-nya. lengkap detailnya:
a. Full feedback tertulis dari mentor
b. Skill breakdown apa aja yg dinilai dan gmn hasil kamu
```

##### Kalo lagi bandingin sama bootcamp Data Science lain

```text
bubble 1
Baik kak paham bgt klo butuh waktu utk pertimbangan/perbandingan ya
Tapi dr cerita kaka, kaka kan udah bisa SQL, Excel, sama Power BI tiap hari. Jd yg kaka butuhin sebenernya bukan belajar data dari awal lagi, tapi naik level dari analyst ke data scientist. Nah di situ bedanya lumayan kerasa ka

Kebanyakan bootcamp Data Science lain itu buat yg mau belajar dati dari 0: SQL dasar, Python dasar, dll. Buat kaka yang udah kerja di data, itu ga efektif. Di Applied Data Science with AI, fokusnya langsung ke advancement skill.

bubble 2
Karena target outcome-nya memang career advancement buat para analyst, instruktur dan mentornya juga dipilih yang seniority-nya lebih tinggi, plus dikombinasiin sama dosen ITB. Poin plusnya, kaka bisa bawa problem nyata di kantor jadi project di course ini. Jadi program ini bukan sesuatu yang kepisah dari kerjaan kaka. Hasilnya bisa langsung kaka tunjukin ke atasan juga

bubble 3
Mungkin ada pertimbangan apa lg kak saat ini? I'm happy to help ya
```

> Note: yg warna biru sesuaikan profil dgn masing-masing lead

##### Data confidentiality di capstone gimana?

```text
Bagus banget Kakak kepikiran ini dari awal 👍

Yang Kakak bawa dari kantor itu masalahnya (business problem-nya), bukan harus data mentahnya. Opsinya bisa:
 1️⃣ Data di-anonymize/masking dulu (hapus nama, ID, angka sensitif)
 2️⃣ Pakai synthetic data yang strukturnya mirip data asli
 3️⃣ Pakai public dataset yang kasusnya sejenis
Jadi value-nya tetap relevan ke kerjaan, tanpa bocorin data perusahaan.

Plus, governance & data handling juga bagian dari materi di program, jadi Kakak belajar cara ngelola data sensitif dengan benar, skill yang kepake banget di kantor juga.
```

##### Kalo kantor aku blokir ChatGPT/Claude gimana?

```text
Kasus seperti ini wajar kak, karena ada perusahaan yg hati-hati soal akses AI 🙏

- Selama program, Kakak belajar pakai laptop & akun pribadi, jadi ga tergantung jaringan/policy kantor. Banyak tools-nya juga berbasis browser.
- Yang Kakak pelajari itu cara kerja bareng AI: framing masalah, validasi output, sampai bisa defend keputusan teknis tanpa AI di ruangan. Skill ini tetap kepake walau tools AI yg di-approve kantor beda, dan jadi modal kalau nanti kantor mulai adopsi AI.

Tp kalau boleh tau, di kantor Kakak sekarang ada tools AI yang di-approve internal, atau memang belum ada sama sekali?
```

##### Contoh capstone

```text
Ini sample capstone output utk Applied Data Science with AI yg disiapkan tim kurikulum agar teman2 ada bayangannya seperti apa:
- Dashboard: https://claude.ai/artifact/MrbewTLqDEwHmcBENjwSG3
- Repo: https://github.com/revou-swe/segar-churn-early-warning

Ini tool utk mendeteksi lebih awal mitra retail yg berisiko berhenti order. Model memprediksi risiko tsb berdasarkan kontribusi revenue, lalu bantu tim sales menentukan prioritas dari 200 kunjungan/bulan. Hasil pengujian menunjukkan cakupan revenue berisiko meningkat dari 43,9% menjadi 68,6%, atau sekitar Rp3 miliar lebih banyak per bulan.

Tujuan utamanya adalah proses yg lengkap, dari data mentah hingga dashboard yg siap digunakan sales manager. AI jg digunakan utk bantu coding, testing, dan simulasi diskusi dgn stakeholder menggunakan Claude Code & Gemini. Semua penggunaan AI dicatat dalam log.
```

##### programnya berbayar atau gak

```text
Untuk program Applied Data Science with AI – RevoU x ITB ini berbayar yaa Kak, karena programnya berlangsung selama 13 minggu dengan materi dan fasilitas yang cukup lengkap, seperti:

- Dual Perspective Faculty dari akademisi ITB dan praktisi industri untuk pembelajaran Data Science dari sisi teori hingga penerapan nyata.
- Hands-on Project menggunakan real case dari pekerjaan atau permasalahan yang ingin Kakak selesaikan.
- Hybrid session di kampus ITB Bandung
- Capstone Project untuk membangun dataset tervalidasi dan predictive system yang diuji secara statistik, sekaligus menjadi portfolio.
- Professional Certificate yang diterbitkan oleh ITB dan dapat diverifikasi.
- Lifetime Access ke materi pembelajaran dan kesempatan networking dengan komunitas profesional.

Jadi, di akhir program Kakak nggak hanya mendapatkan pemahaman teori, tapi juga menghasilkan project Data Science yang bisa dibuktikan secara statistik dan digunakan sebagai portfolio.
```

##### Batasan pakai case dari kantor seperti apa untuk capstone project?

```text
Kakak boleh memakai case dari tempat kerja sendiri. Alternatifnya kalau gamau pake case dr tempat kerja sendiri, bisa pake case anchor yg udh disiapin dari program. Untuk case dari tempat kerja sendiri batasannya adalah berikut:
1. Data harus di-anonimkan dan boleh dibagikan.
2. Data mentah atau rahasia tidak boleh masuk ke repository GitHub.
3. Peserta yang memakai data kantor menambahkan disclaimer bahwa data sudah dianonimkan dan diizinkan untuk dibagikan.

Sebagai contoh, sudah ada 3 case study di sepanjang program (Kirim Cepat, BayarKu, EduTech Cerdas) memakai dataset sintetis yg udh disiapkan dari program, jadi tidak ada data kantor yang dibutuhkan di sini
```

##### database kami disimpan secara on-premise (di server lokal kantor), bukan di cloud. Sudah ketentuan regulasi.

Kalau course ini sepertinya lebih banyak cloud-based ya?

```text
Kakak benar, tool program memang banyak cloud-based: Colab, BigQuery Sandbox, Cloud Shell, GitHub, Streamlit Community Cloud, dan Claude Code. Tapi itu tool untuk materi dan dataset program dan mempermudah proses pembelajaraan.

Untuk capstone, data asli Kakak tidak perlu dipindahkan ke cloud. Bisa mencoba pendekatan: bangun capstone di atas extract yang sudah dianonimkan atau data sintetis dengan skema yang sama dengan data loan Kakak. Dengan begitu repo bisa dijalankan ulang oleh mentor tanpa menyentuh data asli. Setelah program selesai, pipeline yang sama bisa dijalankan ulang di environment on-premise kantor dengan data asli. Capstone memang dirancang jadi sesuatu yang bisa dipakai bisnis di hari Senin setelah program selesai.
```
