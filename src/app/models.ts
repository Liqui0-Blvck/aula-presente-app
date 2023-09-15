export interface User {
  uid: string
  email: string
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
  asistenciaActual: number; // Número de asistencias registradas hasta el momento
  alumnosInscritos: Alumno[];
}

// export interface Profesor {
//   uid: string;
//   cursos: Clase[];
// }

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

export interface Alumno {
  uid: string;           // Identificador único del alumno
  nombre: string;        // Nombre completo del alumno
  asistencias: number;   // Número de clases a las que ha asistido
  estadoAsistencia: boolean;  // Registro de asistencia (true para asistencia, false para ausencia)
}
