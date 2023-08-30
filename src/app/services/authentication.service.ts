import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private sessionClosedSubject = new Subject<void>();

  constructor(public authe: AngularFireAuth) {
    this.getProfile()
   }


  async registerUser(email: string, password: string) {
    return await this.authe.createUserWithEmailAndPassword(email, password)
  }

  async loginUser(email: string, password: string){
    return await this.authe.signInWithEmailAndPassword(email, password)
  }


  async resetPassword(email: string){
    return await this.authe.sendPasswordResetEmail(email)
  }

  async signOut(){
    await this.authe.signOut()
    this.sessionClosedSubject.asObservable()
  }

  async getProfile(){
    const user = await this.authe.currentUser
    if (user === null){
      return null
    }else {
      return user.uid
    }
  }

  stateAuth() {
    return this.authe.authState;
  }

  sessionClosed$() {
    return this.sessionClosedSubject.asObservable();
  }
}
