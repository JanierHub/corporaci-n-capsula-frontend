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
  // La autenticación se maneja por cookies (backend usa req.cookies.token)
  // No enviamos Authorization header
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  console.log(" [Audit] Fetching:", url, options.method || "GET");
  const res = await fetch(url, { 
    ...options, 
    headers,
    credentials: "include" // Enviar cookies para autenticación
  });
  console.log("📡 [Audit] Response status:", res.status, res.statusText);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("❌ [Audit] Error response:", err);
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  console.log("✅ [Audit] Data received, records:", Array.isArray(data) ? data.length : "N/A");
  return data;
};

// 🔧 CORREGIDO: Endpoint es /auditoria (español) no /audit-logs (inglés)
// Basado en patrón del backend: /user, /rol, /artifacts
export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
  console.log("🔄 [Audit] Getting all audit logs...");
  try {
    const data = await fetchWithAuth(`${API_URL}/auditoria`);
    console.log("✅ [Audit] Logs loaded:", data.length || 0, "records");
    return data;
  } catch (error) {
    console.error("❌ [Audit] Error loading logs:", error);
    throw error;
  }
};

export const getAuditLogsByTable = async (table: string): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/auditoria/table/${table}`);
};

export const getAuditLogsByUser = async (userId: number): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/auditoria/user/${userId}`);
};

export const getAuditLogsByAction = async (action: string): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/auditoria/action/${action}`);
};

export const createAuditLog = async (log: Omit<AuditLog, "id_auditoria" | "fecha_operacion">): Promise<AuditLog> => {
  return fetchWithAuth(`${API_URL}/auditoria`, {
    method: "POST",
    body: JSON.stringify(log),
  });
};

export const clearOldAuditLogs = async (days: number): Promise<void> => {
  return fetchWithAuth(`${API_URL}/auditoria/clear/${days}`, {
    method: "DELETE",
  });
};
