export interface User {
  uid: string
  email: string
  fullname: string
  institucion: string
  carrera: string
  horario: string
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
  uid_student: string
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


