import { API_URL } from "../../../config/api";
import { getStoredAccessToken } from "../utils/roles";

export interface User {
  id_usuario: number;
  nombre: string;
  edad?: number;
  biometria?: string;
  adn?: string;
  password?: string;
  estado?: boolean;
  id_rol: number;
  rol?: {
    id_rol: number;
    nombre_rol: string;
    nivel_seguridad: string;
  };
}

export interface Role {
  id_rol: number;
  nombre_rol: string;
  nivel_seguridad: string;
}

export interface CreateUserData {
  nombre: string;
  edad: number;
  password: string;
  biometria?: string;
  adn?: string;
  id_rol: number;
}

const getAuthHeaders = () => {
  const token = getStoredAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

// HU-05: Consultar usuarios - Listar todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/user`, {
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }
  
  const data = await res.json();
  // Normalizar respuesta (puede ser array directo o {data: [...]})
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.usuarios)) return data.usuarios;
  }
  return [];
};

// HU-05: Consultar usuarios - Obtener usuario por ID
export const getUserById = async (id: number): Promise<User | null> => {
  const res = await fetch(`${API_URL}/user/${id}`, {
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) return null;
  return res.json();
};

// HU-01: Registro de usuario - Crear nuevo usuario
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const res = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }
  
  return res.json();
};

// HU-04: Gestión de roles - Actualizar rol de usuario
export const updateUserRole = async (userId: number, newRoleId: number): Promise<User> => {
  const url = `${API_URL}/user/${userId}/role`;
  const body = JSON.stringify({ id_rol: newRoleId });
  const headers = getAuthHeaders();
  
  console.log("🔄 PATCH updateUserRole:", { url, body, headers });
  
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body,
  });
  
  console.log("📡 Response status:", res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error response:", errorText);
    throw new Error(`Error ${res.status}: ${errorText || res.statusText}`);
  }
  
  const data = await res.json();
  console.log("✅ Success response:", data);
  return data;
};

// Obtener todos los roles disponibles
export const getAllRoles = async (): Promise<Role[]> => {
  const res = await fetch(`${API_URL}/rol`, {
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    // Si el endpoint no existe, retornar roles hardcodeados temporalmente
    console.warn("Endpoint /rol no disponible, usando roles locales");
    return [
      { id_rol: 1, nombre_rol: "Administrador", nivel_seguridad: "Nivel 5 - Acceso Total" },
      { id_rol: 2, nombre_rol: "Directora de Innovacion", nivel_seguridad: "Nivel 4 - Estratégico" },
      { id_rol: 3, nombre_rol: "Experto en tecnologia extraterrestre", nivel_seguridad: "Nivel 5 - Clasificado Especial" },
      { id_rol: 4, nombre_rol: "Especialista en seguridad", nivel_seguridad: "Nivel 4 - Táctico" },
      { id_rol: 5, nombre_rol: "Inventor/Tester", nivel_seguridad: "Nivel 3 - Operativo" },
      { id_rol: 6, nombre_rol: "Gestor de proyectos", nivel_seguridad: "Nivel 3 - Operativo" },
      { id_rol: 7, nombre_rol: "Usuario", nivel_seguridad: "Nivel 1 - Básico" },
    ];
  }
  
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.roles)) return data.roles;
  }
  return [];
};

// Validar si un nombre de usuario ya existe
export const checkUserExists = async (nombre: string): Promise<boolean> => {
  try {
    const users = await getAllUsers();
    return users.some(u => u.nombre.toLowerCase() === nombre.toLowerCase());
  } catch {
    return false;
  }
};
