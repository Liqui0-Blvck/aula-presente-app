export interface User {
  uid: string
  email: string
  fullname: string
  institucion: string
  carrera: string
  horario: string
  rol: string
  datos_personales: {
    apellido: string
    nombre: string
    direccion: string
    cuidad: string
    numero_celular: string
  }
}

export interface Carrera {
  asignaturas: Asignatura[];
  nombre: string;
}

export interface Asignatura {
  carrera: string;
  codigo: string;
  nombre: string;
}

export interface Horarios {
  horario: Horario[],
  uid: string
}

export interface HorarioCurso {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  aula: string;
}

export interface AsistenciaAlumno {
  nombre: string;
  asistencias: number;
}

export interface Curso {
  codigo: string;
  nombre: string;
  descripcion: string;
  horario: HorarioCurso[];
  cantidad_alumnos: number;
  asistencias_alumnos: AsistenciaAlumno[];
}

export interface Profesor {
  uid: string;
  cursos: Curso[];
}


export interface Horario {
  fecha_clase: {
    hora_final: string;
    hora_inicio: string;
    dia: string;
    clase_impartida: number
  }[];
  clases_impartida: number;
  codigo: string;
  aula: string;
  profesor: string;
  curso: string;
  asistencia: number;
}



export interface AppPage {
  title: string;
  url: string;
  icon: string;
}