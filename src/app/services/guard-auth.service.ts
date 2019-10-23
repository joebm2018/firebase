import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class GuardAuthService {

  constructor() { }
  canActivate(){
    return true;
    // aplication/ CREAMOS LA VARILE 
    // if (localStorage.getItem('sesion')){
    //   return true;
    // }else{
    //   return false;
    // }
  }
}
