import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  objUsuario={
    email:'',
    pass1:''
  }
  constructor(private _sAuth:AuthService) { }

  ngOnInit() {
  }

  onSubmit(){
    this._sAuth.iniciarSesion(this.objUsuario.email,this.objUsuario.pass1).subscribe((data)=>{
      console.log(data);
      
    },(error)=>{
      console.log(error);
      
    });
  }
}
