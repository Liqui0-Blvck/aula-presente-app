import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  createDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path)
    return collection.doc(id).set(data)
  }

  getDoc<tipo>(path: string, id: string){
    const collection = this.database.collection<tipo>(path)
    return collection.doc(id).valueChanges()
  }

  deleteDoc(path: string,id: string){
    const collection = this.database.collection(path)
    return collection.doc(id).delete()
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path)
    return collection.doc(id).update(data)
  }

  

  collecionFilter<type>(path: string, field: string, operator: any, value: any){
    return this.database.collection<type>(path, ref => ref.where(field, operator, value)).valueChanges()
  }
}
