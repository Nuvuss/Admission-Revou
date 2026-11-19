export interface MaintenanceConfig {
  enabled: boolean;
  allowOwnerBypass: boolean;
  eta: string;
  hasCustomEta: boolean;
  message: string;
}

const DEFAULT_MESSAGE =
  "Kami sedang melakukan pemeliharaan sistem dan peningkatan performa Admission Assistant. Seluruh layanan akan kembali normal setelah proses selesai.";

export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE?.trim().toLowerCase() === "true";
}

export function isOwnerBypassEnabled(): boolean {
  return process.env.MAINTENANCE_ALLOW_OWNER?.trim().toLowerCase() !== "false";
}

export function getMaintenanceConfig(): MaintenanceConfig {
  const rawEta = process.env.MAINTENANCE_ETA?.trim() ?? "";
  const rawMessage = process.env.MAINTENANCE_MESSAGE?.trim() ?? "";

  return {
    enabled: isMaintenanceMode(),
    allowOwnerBypass: isOwnerBypassEnabled(),
    eta: rawEta || "Segera kembali (pantau berkala)",
    hasCustomEta: rawEta.length > 0,
    message: rawMessage || DEFAULT_MESSAGE,
  };
}
