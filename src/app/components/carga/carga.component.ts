import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaimagenesService } from '../../services/cargaimagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  // Aqui se guardan los archivos que se van a subir
  archivos: FileItem [] = [];

  // Bandera para saber si hay archivos de DROOP
  estasobroelement = false;

  constructor(public imagesservices: CargaimagenesService) { }

  cargarimages()
  {
    this.imagesservices.cargarimganes(this.archivos);
  }

  ngOnInit() {
  }

  limpiarArchivos()
  {
    this.archivos = []
  }

  // pruebaelemento(event)
  // {
  //   console.log("Este es el evento: ", event);

  //   if(event)
  //   {
  //     this.estasobrodrop =  event;
  //   }
  //   else
  //   {
  //     this.estasobrodrop =  event;
  //   }
  // }

}
