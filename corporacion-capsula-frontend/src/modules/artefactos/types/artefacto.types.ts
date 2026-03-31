export interface Artefacto {
  id: number;
  nombre: string;
  descripcion: string;

  categoria: 'defensa' | 'transporte' | 'domestico' | 'energia';
  origen: 'terrestre' | 'extraterrestre';

  nivelPeligrosidad: number;
  nivelConfidencialidad: number;

  estado?: 'activo' | 'en_pruebas' | 'obsoleto';
  inventor?: string;

  fechaCreacion?: string;
  fechaActualizacion?: string;
}