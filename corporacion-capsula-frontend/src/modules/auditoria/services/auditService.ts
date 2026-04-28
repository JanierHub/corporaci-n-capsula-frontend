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

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getStoredAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
  return fetchWithAuth(`${API_URL}/audit-logs`);
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
