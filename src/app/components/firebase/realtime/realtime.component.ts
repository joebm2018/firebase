import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database'
import { DatabaseReference, DataSnapshot } from '@angular/fire/database/interfaces';
import Swal from 'sweetalert2';
// importando clases para formulrios reactivos
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Logs } from 'selenium-webdriver';

import{ AngularFireStorage} from '@angular/fire/storage';
// import { url } from 'inspector';
@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.css']
})
export class RealtimeComponent implements OnInit {

  //VARIABLES PARA LA CARGA DE IMAGENES
  imagePath;
  imgUrl;

  //VARIABLES PARA LA CARGA DE IMAGENES

  // const Swal = require('sweetalert2')
  modoTabla:Boolean=true;
  refUsuarios:DatabaseReference;
  listaUsuarios:Array<any>;
  formulario:FormGroup;
  constructor(private _srealtime:AngularFireDatabase,
              private _szone:NgZone,
              private _storage: AngularFireStorage) { 
    this.refUsuarios=this._srealtime.database.ref("usuarios");
    //INICIALIZANDO EL FORMULARIO REACTIVO
    this.formulario=new FormGroup(
      //ESPEJO DE TODO LOS CONTROLES DE LA VISTA
      {
        "campo_nombre":new FormControl('',Validators.required),
        "campo_apellido":new FormControl('',Validators.required),
        "campo_imagen":new FormControl('null',Validators.required),
        "campo_email":new FormControl('',[
                                          Validators.required,
                                          Validators.pattern("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$")
                                         ]),
      }
    );
  }
  // elemento submit del forulario reactivo
  onSubmit(miimg){
    console.log(miimg.files[0]);
    
    Swal.fire({
      title:'Espere',
      text:'Estamos creando el registro',
      type:'info',
      showConfirmButton:false,
      allowOutsideClick:false
    })
    console.log(this.formulario);
    //OBTENER EL OBJETO USUARIO DEL FORMUALRIO
    console.log(this.formulario.value);
    // OBTENER LA REFERENCIA DEL IMPUT EMAIL
    this.formulario.get('campo_email');
    console.log(this.formulario.get('campo_email').value);
    //sUBIR IMG A FIREBASE

    //AFMAR EL OBJETO PARA ENVIAR A FIREBASE
    // 1.- CREAR UN ID A PARTIR DE LA REFERENCIA AL NODO USUARIOS
    let key=this.refUsuarios.push().key;

    let archivo=miimg.files[0];
    const tarea=this._storage.upload(key,archivo);
    tarea.then(()=>{
      //en este scope la img ya c subio con el nombre del key original
      //ahora obtendremos la url
      this._storage.ref(key).getDownloadURL().subscribe((url_imagen)=>{
        // 2. CREAR UNA REFERENCIA AL NODO 'USUARIOS'=>'KEY'
      let refkey=this.refUsuarios.child(key);
      // 3. ARMAR EL JSON
      // 4. ENVIAR EL OBJETO A SU REFERENCIA
      refkey.set({
        nombre:this.formulario.get('campo_nombre').value,
        apellido:this.formulario.get('campo_apellido').value,
        imagen:url_imagen,
        email:this.formulario.get('campo_email').value
      }).then(()=>{
        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'Datos grabados correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      });
      // console.log(key);
      
        //RESET blanquea los campos
        this.formulario.reset();
        //si quiero que se cargue algun texto por defecto
        // this.formulario.reset({
        //   "campo_imagen":'sin-image'
        // })
      })
      })

    
    
    
  }
  ngOnInit() {
    
    // this.traerDataconOnce();
    //this.traerDataconOn();
    this.traerUsuariosConOn();
  }
  // otra forma de traer los datos con ON y itera con foreach
  traerUsuariosConOn(){
    this.refUsuarios.on('value',(usuariosSnaps:DataSnapshot)=>{
      let usuariosTmp=[];
      usuariosSnaps.forEach(usuario=>{
        let objUsuarioTmp={
          id:usuario.key,
          nombre:usuario.val().nombre,
          apellido:usuario.val().apellido,
          imagen:usuario.val().imagen
        }
        // console.log(objUsuarioTmp);
        usuariosTmp.push(objUsuarioTmp);
        
          
      })
      this._szone.run(()=>{
        this.listaUsuarios=usuariosTmp;
      })
    })
  }

  // trae la data con la funcion on e itera la los objetos con un ciclo for in
  traerDataconOn(){
    this.refUsuarios.on('value',(data:DataSnapshot)=>{
      let objUsuarios=data.toJSON();  
      for(const key in objUsuarios){
        console.log(objUsuarios[key]);        
      }
    });
  }
  traerDataconOnce(){
    //key- de la referencia donde se encuentran
    console.log(this.refUsuarios.key);
    // referencia.on ('evento',(data)=>{}) trae la data del nodo cada vez que el 'evento' sucede
   
    // referencia.once('evento').then(()=>{})
    console.log(this.refUsuarios.once('value').then((data:DataSnapshot)=>{
      // console.log(data.toJSON());     //MUESTRA LOS DATOS D LA TABLA
    let objUsuarios=data.toJSON();  
      //iterando el objeto
      for(const key in objUsuarios){
        console.log(`llave:${key}`); // MUESTRA USU1 Y USU2
        console.log(objUsuarios[key]);        
      }
    }));
  }
  eliminarUsuario(id){
    // db->usuarios->id(del registro a borrar)
    Swal.fire({
      title: 'Esta Seguro de Borrar?',
      text: "no hay marcha atras!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((rpta) => {
      if (rpta.value) {
        this.refUsuarios.child(id).remove().then(()=>{
          Swal.fire(
            'Deleted!',
            'Registro Borrado Correctamente.',
            'success'
            
          )
        }) 
        
      }
    })

    // this.refUsuarios.child(id).remove().then(()=>{
    //   console.log("Registro Borrado Correctamente");
    // });
    
  }
  previsualizarFoto(event){
    console.log(event);
    let archivo=event.target.files[0];
    let reader=new FileReader();
    // this.imagePath=event.target.files;
    reader.readAsDataURL(archivo);
    reader.onload=()=>{
      this.imgUrl=reader.result;
      console.log(this.imgUrl);
    }
    
  }

}
