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
  contraseña: string;  // Backend espera español, no "password"
  biometria?: string;
  adn?: string;
  rol: number;  // Backend espera "rol", no "id_rol"
}

// Helper function to get auth headers with Authorization Bearer token
const getAuthHeaders = (): HeadersInit => {
  const token = getStoredAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// HU-05: Consultar usuarios - Obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/user`, {
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }
  
  const data = await res.json();
  console.log("📥 [userService] Raw data from /user:", data);
  
  // Normalizar respuesta (puede ser array directo o {data: [...]})
  let users: any[] = [];
  if (Array.isArray(data)) users = data;
  else if (data && typeof data === "object") {
    if (Array.isArray(data.data)) users = data.data;
    else if (Array.isArray(data.users)) users = data.users;
    else if (Array.isArray(data.usuarios)) users = data.usuarios;
  }
  
  // 🔧 Normalizar: buscar ID en múltiples posibles nombres de campo
  const normalizedUsers = users.map(u => {
    // Buscar el ID del usuario en múltiples variantes posibles
    const idUsuario = u.id_usuario ?? 
                      u.id ?? 
                      u.userId ?? 
                      u.user_id ?? 
                      u.idUser ?? 
                      u.idusuario ??
                      u.IdUsuario ??
                      u.ID ??
                      undefined;
    
    // Buscar el ID del rol en múltiples variantes
    const idRol = u.id_rol ?? 
                   u.rol_id ?? 
                   u.role_id ?? 
                   u.rolId ??
                   u.idRol ??
                   u.id_rol_usuario ??
                   undefined;
    
    return {
      ...u,
      id_usuario: idUsuario,
      id_rol: idRol,
    };
  });
  
  console.log("📥 [userService] Normalized users:", normalizedUsers.map(u => ({ 
    nombre: u.nombre, 
    id_usuario: u.id_usuario,
    id_rol: u.id_rol
  })));
  
  // Verificar si hay usuarios sin ID - mostrar datos completos para diagnóstico
  const usersSinId = normalizedUsers.filter(u => !u.id_usuario);
  if (usersSinId.length > 0) {
    console.error("❌ [userService] Usuarios SIN ID encontrados:", usersSinId.length);
    usersSinId.forEach((u, idx) => {
      console.error(`❌ [userService] Usuario ${idx + 1} sin ID:`, {
        nombre: u.nombre,
        allKeys: Object.keys(u),
        allValues: Object.entries(u).reduce((acc, [k, v]) => {
          acc[k] = typeof v === 'string' ? v.substring(0, 30) : v;
          return acc;
        }, {} as any)
      });
    });
  }
  
  return normalizedUsers;
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
  // Validar que los IDs no sean undefined
  if (userId === undefined || userId === null || Number.isNaN(userId)) {
    throw new Error(`ID de usuario inválido: ${userId}`);
  }
  if (newRoleId === undefined || newRoleId === null || Number.isNaN(newRoleId)) {
    throw new Error(`ID de rol inválido: ${newRoleId}`);
  }
  
  // Endpoint: /api/v1/users/{id}/role (PATCH)
  const url = `${API_URL}/users/${Number(userId)}/role`;
  const body = JSON.stringify({ id_rol: Number(newRoleId) });
  const headers = getAuthHeaders();
  
  console.log("🔄 PATCH updateUserRole:", { url, body, userId, newRoleId });
  
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
// El backend no tiene endpoint /roles, usar lista local
export const getAllRoles = async (): Promise<Role[]> => {
  return [
    { id_rol: 1, nombre_rol: "Administrador", nivel_seguridad: "Nivel 5 - Acceso Total" },
    { id_rol: 2, nombre_rol: "Directora de Innovacion", nivel_seguridad: "Nivel 4 - Estratégico" },
    { id_rol: 3, nombre_rol: "Experto en tecnologia extraterrestre", nivel_seguridad: "Nivel 5 - Clasificado Especial" },
    { id_rol: 4, nombre_rol: "Especialista en seguridad", nivel_seguridad: "Nivel 4 - Táctico" },
    { id_rol: 5, nombre_rol: "Inventor/Tester", nivel_seguridad: "Nivel 3 - Operativo" },
    { id_rol: 6, nombre_rol: "Gestor de proyectos", nivel_seguridad: "Nivel 3 - Operativo" },
    { id_rol: 7, nombre_rol: "Usuario", nivel_seguridad: "Nivel 1 - Básico" },
  ];
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
