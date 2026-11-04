export function normalizeTopic(rawTopic?: string | null, snippet?: string | null, mode?: string | null): string | null {
  const userSnippet = (snippet || "").toLowerCase().trim();
  const fallbackTopic = (rawTopic || "").toLowerCase().trim();
  const primaryText = userSnippet || fallbackTopic;

  if (!primaryText && mode !== "comparison") return null;

  if (mode === "comparison") {
    if (/\bpurwadhika\b/.test(primaryText)) return "Komparasi vs Purwadhika";
    if (/\bdibimbing\b/.test(primaryText)) return "Komparasi vs Dibimbing";
    if (/\b(dqlab|it\s*lab)\b/.test(primaryText)) return "Komparasi vs DQLab";
    if (/\bhacktiv8\b/.test(primaryText)) return "Komparasi vs Hacktiv8";
    return "Komparasi Kompetitor";
  }

  // Prioritaskan analisis langsung dari input_snippet (prompt asli user) dengan word boundary (\b) ketat
  // agar tidak tertipu oleh kata substring seperti "bisa"/"analisa" (isa), "peluang" (uang), "antusias" (usia), atau "sesuai" (ui)
  if (
    /\b(mahal|kemahalan|biaya|biayanya|harga|harganya|cicilan|nyicil|kredit|refund|skema\s+isa|income\s+share|danacita|diskon|promo|budget|angsuran|bayar\s+bertahap|kendala\s+uang|masalah\s+uang|belum\s+ada\s+uang|tidak\s+ada\s+uang)\b/.test(
      primaryText
    )
  ) {
    return "Keberatan Biaya & Skema Cicilan";
  }
  if (
    /\b(sibuk|tidak\s+ada\s+waktu|susah\s+bagi\s+waktu|jadwal|jadwalnya|kelas\s+malam|lembur|sambil\s+kerja|sambil\s+kuliah|bentrok|offline|tatap\s+muka)\b/.test(
      primaryText
    )
  ) {
    return "Kendala Waktu & Jadwal Kelas";
  }
  if (
    /\b(izin\s+atasan|izin\s+kantor|izin\s+bos|izin\s+suami|izin\s+istri|izin\s+orang\s+tua|izin\s+ortu|izin\s+keluarga|tanya\s+suami|tanya\s+istri|tanya\s+orang\s+tua|tanya\s+ortu|tanya\s+atasan|diskusi\s+sama|persetujuan\s+atasan|sponsor\s+kantor|dibayarin\s+kantor|suami|istri|orang\s+tua|ortu)\b/.test(
      primaryText
    )
  ) {
    return "Izin Atasan / Keluarga";
  }
  if (
    /\b(career\s*switch|switch\s*karir|switch\s*career|pindah\s*jalur|pindah\s*karir|non-it|non\s+it|bukan\s+it|tidak\s+ada\s+basic|tanpa\s+basic|gaptek|ragu\s+bisa|takut\s+tidak\s+bisa|faktor\s+usia|faktor\s+umur|terlalu\s+tua|lulusan\s+sma|lulusan\s+smk|ibu\s+rumah\s+tangga|career\s+break)\b/.test(
      primaryText
    )
  ) {
    return "Keraguan Career Switch / Non-IT";
  }

  // Deteksi Program Spesifik dari Prompt User
  const isAlumniMode = mode === "alumni" || /\b(alumni|kisah\s+alumni|bukti\s+alumni)\b/.test(primaryText);
  const progPrefix = isAlumniMode ? "Alumni" : "Pitch Program";
  if (/\b(itb|ai\s+enabled\s+leaders|decision\s+making)\b/.test(primaryText)) {
    return `${progPrefix} RevoU x ITB (AI & Leaders)`;
  }
  if (/\b(binus|cyber\s*security|applied\s+ai)\b/.test(primaryText)) {
    return `${progPrefix} RevoU x BINUS (AI & Cyber)`;
  }
  if (/\b(revou\s*x\s*ui|universitas\s+indonesia|strategic\s+finance|program\s+ui|finance)\b/.test(primaryText)) {
    return `${progPrefix} RevoU x UI (Strategic Finance)`;
  }
  if (/\b(fsse|software\s+engineering|software\s+engineer|coding|full\s*stack\s+developer|web\s+developer)\b/.test(primaryText)) {
    return `${progPrefix} Software Engineering (FSSE)`;
  }
  if (/\b(fsdm|digital\s+marketing|marketing|ads|seo|sosmed|e-commerce)\b/.test(primaryText)) {
    return `${progPrefix} Digital Marketing (FSDM)`;
  }
  if (/\b(fsda|data\s+analytics|data\s+analyst|analisis\s+data|data\s+science|sql|python|tableau)\b/.test(primaryText)) {
    return `${progPrefix} Data Analytics (FSDA)`;
  }

  // Deteksi Profil Prospek / Karir & Alumni
  if (/\b(fresh\s*grad|fresh\s*graduate|baru\s+lulus|mahasiswa|lulusan\s+baru)\b/.test(primaryText)) {
    return "Pitch Prospek Fresh Graduate / Mahasiswa";
  }
  if (
    /\b(jaminan\s+kerja|prospek\s+karir|peluang\s+karir|hiring|gaji|salary|magang|internship|portofolio|bumn|manufaktur|kisah\s+alumni|bukti\s+alumni)\b/.test(
      primaryText
    )
  ) {
    return "Prospek Karir & Bukti Alumni";
  }

  if (mode === "alumni") return "Pencarian Bukti Kisah Alumni";
  return "Konsultasi Pitch Program RevoU";
}
