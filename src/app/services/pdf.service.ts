import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = 'http://127.0.0.1:5000'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  convertPdfToJson(pdfFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    return this.http.post<any>(this.apiUrl, formData);
  }
}
