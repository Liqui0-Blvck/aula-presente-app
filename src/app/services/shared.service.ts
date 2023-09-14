import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Carrera, Horarios, Profesor, Curso } from '../models'

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private carreraSubject = new BehaviorSubject<Carrera | null>(null);
  private horariosSubject = new BehaviorSubject<Horarios | null>(null);
  private profesorSubject = new BehaviorSubject<Profesor | null>(null)
  private cursosSubject = new BehaviorSubject<Curso | null>(null)

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  setCarrera(carrera: Carrera) {
    this.carreraSubject.next(carrera);
  }

  getCarrera(): Observable<Carrera | null> {
    return this.carreraSubject.asObservable();
  }

  setHorarios(horarios: Horarios) {
    this.horariosSubject.next(horarios);
  }

  getHorarios(): Observable<Horarios | null> {
    return this.horariosSubject.asObservable();
  }

  setProfesor(profesor: Profesor){
    this.profesorSubject.next(profesor)
  }

  getProfesor(): Observable<Profesor | null> {
    return this.profesorSubject.asObservable();
  }

  setCurso(curso: Curso){
    this.cursosSubject.next(curso)
  }

  getCurso(): Observable<Curso | null> {
    return this.cursosSubject.asObservable()
  }
}