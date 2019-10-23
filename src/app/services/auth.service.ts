import { Injectable } from '@angular/core';
//IMPORTANDO SERVICIO PARA EL CONSUMO DE RECURSOS HTTP
import {HttpClient, HttpHeaders} from'@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _sHttp:HttpClient) { }
  crearUsuario(correo,contras){
    let url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAO27J8iaXrG4JCTSIUnztZPKZeQSEmpbI";
    let data={
      email:correo,
      password:contras,
      returnSecureToken:true,
    }
    let misHeaders=new HttpHeaders().set("Content-type","application/json");
    return this._sHttp.post(url,JSON.stringify(data),{headers:misHeaders});
  }
  iniciarSesion(correo,contras){
    let url="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAO27J8iaXrG4JCTSIUnztZPKZeQSEmpbI";
    let data={
      email:correo,
      password:contras,
      returnSecureToken:true,
    }
    let misHeaders=new HttpHeaders().set("Content-type","application/json");
    return this._sHttp.post(url,JSON.stringify(data),{headers:misHeaders});
  }


}
