import { API_URL } from "../../../config/api";
import { getStoredAccessToken } from "../../auth/utils/roles";

export interface AuditLog {
  id_auditoria?: number;
  id_registro: number;
  nombre_tabla: string;
  accion: "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
  id_usuario?: number;
  id_artefacto?: number;
  valor_anterior?: string;
  valor_nuevo?: string;
  fecha_operacion?: string;
}

// 🔥 Sistema de EventEmitter simple para refrescar auditoría desde cualquier parte
// Esto permite que las acciones CRUD notifiquen a la vista de auditoría
const auditRefreshListeners: Array<() => void> = [];

export const onAuditRefresh = (callback: () => void) => {
  auditRefreshListeners.push(callback);
  return () => {
    const index = auditRefreshListeners.indexOf(callback);
    if (index > -1) auditRefreshListeners.splice(index, 1);
  };
};

export const triggerAuditRefresh = () => {
  console.log("🔄 [Audit] Triggering refresh, listeners:", auditRefreshListeners.length);
  auditRefreshListeners.forEach(callback => {
    try {
      callback();
    } catch (e) {
      console.error("Error en audit refresh listener:", e);
    }
  });
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getStoredAccessToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  console.log("📡 [Audit] Fetching:", url, options.method || "GET");
  const res = await fetch(url, { 
    ...options, 
    headers,
  });
  console.log("📡 [Audit] Response status:", res.status, res.statusText);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("❌ [Audit] Error response:", err);
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
console.log("✅ [Audit] Data received, records:", Array.isArray(data) ? data.length : "N/A");
console.log("✅ [Audit] Estructura real:", JSON.stringify(data).slice(0, 200)); // ← solo agrega esta
return data;
};

// Endpoint /audit según el backend real (inglés)
export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
  console.log("🔄 [Audit] Getting all audit logs...");
  try {
    const data = await fetchWithAuth(`${API_URL}/audit-logs`);
    const logs = Array.isArray(data) 
    ? data 
    : data.data ?? data.logs ?? data.audit_logs ?? data.records ?? [];
    console.log("✅ [Audit] Logs loaded:", logs.length, "records");
    return logs;
  } catch (error) {
    console.error("❌ [Audit] Error loading logs:", error);
    throw error;
  }
};

export const getAuditLogsByTable = async (table: string): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/audit-logs/table/${table}`);
};

export const getAuditLogsByUser = async (userId: number): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/audit-logs/user/${userId}`);
};

export const getAuditLogsByAction = async (action: string): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/audit-logs/action/${action}`);
};

export const createAuditLog = async (log: Omit<AuditLog, "id_auditoria" | "fecha_operacion">): Promise<AuditLog> => {
  return fetchWithAuth(`${API_URL}/audit-logs`, {
    method: "POST",
    body: JSON.stringify(log),
  });
};

export const clearOldAuditLogs = async (days: number): Promise<void> => {
  return fetchWithAuth(`${API_URL}/audit-logs/clear/${days}`, {
    method: "DELETE",
  });
};
