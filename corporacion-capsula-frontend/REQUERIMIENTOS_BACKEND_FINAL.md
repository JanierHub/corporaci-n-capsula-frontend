# 🔧 REQUERIMIENTOS BACKEND - Capsule Corp

**Para:** Líder Backend  
**De:** Janier (Frontend Lead)  
**Fecha:** 2026-04-23  
**Prioridad:** ALTA  
**Nota:** Los módulos del frontend ya están listos, solo se necesitan estos endpoints para completar la integración.

---

## 🚨 PRIORIDAD 1: Estados de Artefactos (URGENTE)

### Problema Actual:
El frontend tiene botones de "Activar/Desactivar" pero el estado no persiste en el backend. Al recargar la página, los artefactos vuelven a su estado original.

### Solución Requerida:

#### 1. PATCH /artifacts/:id - Actualizar estado
```http
PATCH http://localhost:3000/artifacts/123
Content-Type: application/json
Authorization: Bearer <token>

{
  "estado": false   // false = obsoleto/inactivo, true = activo
}
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "nombre_artefacto": "Capsula Hoi Poi",
    "estado": "obsoleto",
    "updated_at": "2026-04-23T12:00:00Z"
  }
}
```

#### 2. Verificar GET /artifacts incluya estado
```http
GET http://localhost:3000/artifacts
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "nombre_artefacto": "Capsula Hoi Poi",
      "descripcion": "Almacenamiento dimensional",
      "id_categoria": 1,
      "origen": "TERRICOLA",
      "nivel_peligrosidad": 1,
      "estado": "obsoleto",  // ← DEBE venir de la BD
      "inventor": "Bulma",
      "fecha_creacion": "2026-04-20"
    }
  ]
}
```

### Cambios en BD:
```sql
-- Asegurar que exista la columna estado
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS estado BOOLEAN DEFAULT true;

-- O si es string/varchar:
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'activo';
-- Valores: 'activo', 'obsoleto', 'en_pruebas'
```

---

## 🟡 PRIORIDAD 2: Logs de Auditoría (Para Carlos)

### Requerimiento:
El módulo de Auditoría necesita registrar eventos del sistema. Frontend ya tiene mock data, necesita endpoint real.

### Endpoints:

#### 1. GET /audit-logs - Listar logs
```http
GET http://localhost:3000/audit-logs?desde=2026-04-01&hasta=2026-04-23&usuario=Bulma&accion=CREATE
Authorization: Bearer <token>
```

**Query params (opcionales):**
- `desde` - Fecha inicio (YYYY-MM-DD)
- `hasta` - Fecha fin (YYYY-MM-DD)
- `usuario` - Nombre de usuario
- `accion` - CREATE, UPDATE, DELETE, LOGIN
- `modulo` - Artefactos, Usuarios, Auth
- `page` - Número de página
- `limit` - Resultados por página (10, 25, 50)

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "fecha": "2026-04-23T10:30:00Z",
        "usuario": "Bulma",
        "rol": "Administrador",
        "accion": "CREATE",
        "modulo": "Artefactos",
        "descripcion": "Creó artefacto 'Capsula Médica v2.0'",
        "detalles": {
          "artefactoId": 45,
          "nombre": "Capsula Médica v2.0",
          "cambios": null
        },
        "ip": "192.168.1.100",
        "status": "success"
      },
      {
        "id": 2,
        "fecha": "2026-04-23T11:15:00Z",
        "usuario": "Dr. Brief",
        "rol": "Experto en tecnología extraterrestre",
        "accion": "UPDATE",
        "modulo": "Artefactos",
        "descripcion": "Actualizó nivel de peligrosidad",
        "detalles": {
          "artefactoId": 12,
          "cambios": {
            "nivel_peligrosidad": { "antes": 3, "despues": 5 }
          }
        },
        "ip": "192.168.1.105",
        "status": "success"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156,
      "totalPages": 16
    },
    "stats": {
      "totalHoy": 24,
      "usuariosActivos": 5,
      "tasaExito": 98.5
    }
  }
}
```

#### 2. POST /audit-logs - Crear log (uso interno)
```http
POST http://localhost:3000/audit-logs
Content-Type: application/json
Authorization: Bearer <token>

{
  "accion": "DELETE",
  "modulo": "Artefactos",
  "descripcion": "Desactivó artefacto #123",
  "detalles": {
    "artefactoId": 123,
    "nombre": "Capsula Hoi Poi",
    "razon": "Obsoleto"
  },
  "status": "success"
}
```

**Nota:** El backend debe auto-completar:
- `usuario` desde el token JWT
- `fecha` timestamp actual
- `ip` desde la request

### Esquema de BD:
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  usuario VARCHAR(100),
  rol VARCHAR(100),
  accion VARCHAR(20) CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW')),
  modulo VARCHAR(50),
  descripcion TEXT,
  detalles JSONB,
  ip_address INET,
  status VARCHAR(20) DEFAULT 'success',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para filtros
CREATE INDEX idx_audit_logs_user ON audit_logs(usuario);
CREATE INDEX idx_audit_logs_action ON audit_logs(accion);
CREATE INDEX idx_audit_logs_module ON audit_logs(modulo);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### Middleware de auto-logging:
Sugerencia: Crear middleware que capture automáticamente:
```javascript
// En cada POST/PUT/DELETE, registrar automáticamente
app.use('/artifacts', auditMiddleware('Artefactos'));
app.use('/users', auditMiddleware('Usuarios'));
```

---

## 🟢 PRIORIDAD 3: Verificación Biométrica (Opcional)

### Requerimiento:
El módulo Biométrico simula verificación de alta seguridad.

### Endpoint:

#### POST /auth/biometric - Verificar acceso
```http
POST http://localhost:3000/auth/biometric
Content-Type: application/json
Authorization: Bearer <token>

{
  "artefactoId": 123,
  "nivelRequerido": 2,  // 1, 2 o 3 según seguridad del artefacto
  "verificaciones": {
    "huella": "verified",      // verified | failed
    "facial": "verified",      // verified | failed | null (si nivel < 2)
    "adn": null                // verified | failed | null (si nivel < 3)
  }
}
```

**Respuesta (éxito):**
```json
{
  "success": true,
  "data": {
    "accesoConcedido": true,
    "nivelVerificado": 2,
    "artefacto": {
      "id": 123,
      "nombre": "Cápsula de Contención",
      "datosClasificados": "..."
    },
    "sesionExpiraEn": 1800  // segundos (30 min)
  }
}
```

**Respuesta (fallo):**
```json
{
  "success": false,
  "error": {
    "code": "BIOMETRIC_FAILED",
    "message": "Verificación biométrica fallida",
    "intentosRestantes": 2,
    "bloqueadoHasta": null  // o timestamp si es 3er intento
  }
}
```

---

## 📋 RESUMEN RÁPIDO

| Prioridad | Endpoint | Método | Descripción | Frontend listo |
|-----------|----------|--------|-------------|----------------|
| 🔴 URGENTE | `/artifacts/:id` | PATCH | Cambiar estado activo/obsoleto | ✅ Botón listo |
| 🔴 URGENTE | `/artifacts` | GET | Incluir campo `estado` | ✅ Lee estado |
| 🟡 MEDIA | `/audit-logs` | GET | Listar logs con filtros | ✅ Mock data |
| 🟡 MEDIA | `/audit-logs` | POST | Crear log | ⏳ Por llamar |
| 🟢 OPCIONAL | `/auth/biometric` | POST | Verificar acceso | ✅ Simulado |

---

## ⏱️ TIMELINE SUGERIDO

| Fecha | Meta |
|-------|------|
| **Hoy (23 Abril)** | Commit inicial, estructura de tablas |
| **24 Abril AM** | PATCH /artifacts/:id funcionando |
| **24 Abril PM** | GET /artifacts incluye estado |
| **25 Abril** | Tabla audit_logs y GET /audit-logs |
| **26 Abril** | POST /audit-logs y middleware |
| **28 Abril** | Testing completo con frontend |

---

## 🧪 TESTING CON FRONTEND

### Test 1: Activar/Desactivar
```bash
# 1. Abrir frontend: http://localhost:5173
# 2. Ir a: /artefactos
# 3. Seleccionar un artefacto
# 4. Click en "Desactivar"
# 5. Verificar: POSTMAN GET /artifacts debe mostrar estado cambiado
# 6. Recargar página (F5)
# 7. Verificar: estado persiste
```

### Test 2: Auditoría
```bash
# 1. Abrir frontend: http://localhost:5173/auditoria
# 2. Verificar: logs se cargan desde endpoint
# 3. Cambiar filtros
# 4. Verificar: query params cambian en Network tab
```

---

## 📞 CONTACTO

**Frontend Lead:** Janier  
**Repositorio Frontend:** https://github.com/JanierHub/corporaci-n-capsula-frontend  

**Canales:**
- Discord: [Enlace del servidor del equipo]
- WhatsApp: [Grupo del equipo]

---

## ✅ CHECKLIST PARA BACKEND

### Estados de Artefactos:
- [ ] Columna `estado` existe en tabla `artifacts`
- [ ] PATCH /artifacts/:id actualiza el estado
- [ ] GET /artifacts retorna el campo `estado`
- [ ] El estado persiste tras recargar el frontend

### Auditoría:
- [ ] Tabla `audit_logs` creada con índices
- [ ] GET /audit-logs retorna logs paginados
- [ ] Filtros por fecha, usuario, acción funcionan
- [ ] POST /audit-logs crea registros
- [ ] Middleware captura eventos automáticamente

### General:
- [ ] CORS configurado para localhost:5173
- [ ] JWT authentication funciona en todos los endpoints
- [ ] Documentación Swagger actualizada (opcional)

---

## 🚀 COMANDOS DE REFERENCIA (PostgreSQL)

```sql
-- Verificar columna estado
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'artifacts' AND column_name = 'estado';

-- Actualizar estado manualmente (test)
UPDATE artifacts SET estado = 'obsoleto' WHERE id = 123;

-- Ver logs
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;

-- Estadísticas de hoy
SELECT accion, COUNT(*) FROM audit_logs 
WHERE DATE(created_at) = CURRENT_DATE 
GROUP BY accion;
```
