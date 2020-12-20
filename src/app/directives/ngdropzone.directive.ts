import { FileItem } from '../models/file-item';
import { Directive, EventEmitter, ElementRef, HostListener,
         Input, Output} from '@angular/core';

@Directive({
  selector: '[appNgdropzone]'
})
export class NgdropzoneDirective
{

  // Estos son archivos que le mando desde la directiva
  @Input() archivos: FileItem[] = [];

  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  // Esto se relaciona con la variable boolenana que colocamos
  // en la carga de imagenes, Esta severo esto de las directicas

  constructor() {}

    // Aqui detecta si esta sobre el elemento
    @HostListener('dragover', ['$event'])
    public onDragEnter(event: any) {
        this.mouseSobre.emit(true);
        this._prevenirDefecto(event);
    }

    // Aqui detecta si esta afuera el elemento
    @HostListener('dragleave', ['$event'])
      public onDragLeave(event: any) {
          this.mouseSobre.emit(false);
      }


  /**************************** */
  // DROP: Cuando percibe que dejo caer el objeto

  @HostListener('drop', ['$event'])
  public onDrop(event: any)
  {
      // El event de aqui es la data de las imagenes, que son objetos con una metadata
      // Filelist es el que me da esa metadata ?? ya tiene unas propiedades por defecto
        // QUE ES ALGO ASI:
        /*
        0: File
          lastModified: 1555052288777
          lastModifiedDate: Fri Apr 12 2019 01:58:08 GMT-0500 (hora estándar de Colombia)
            __proto__: Object
          name: "descarga.jpg"
          size: 4261
          type: "image/jpeg"
          webkitRelativePath: ""
        */
      const transferencia = this._getTransferencia(event);

      if (!transferencia){return;} // Si la tranferencia en NULA, salgase

      this._extraerArchivos(transferencia.files);
      this._prevenirDefecto(event);

      this.mouseSobre.emit(false);
      // Quitar los punto azules
  }

  // Esta funcion es para extraer los archivos que fueron cargados a
  // el navegador
  private _extraerArchivos(archivosLista: FileList)
  {
    console.log('Estos son los archivos', archivosLista);

    // Object.getOwnPropertyNames obtiene los elemtos clave valor de objeto o array
      for ( const propiedad in Object.getOwnPropertyNames( archivosLista ) ) {

        // Aqui pasa los archivos de de objeto y los add a un arreglo
        // fin de la historia , for in clave valor
        const archivoTemporal = archivosLista[propiedad];

        // valida que el archivo se pueda subir
        if ( this._archivoValido( archivoTemporal ) ) {

          const nuevoArchivo = new FileItem( archivoTemporal );
          this.archivos.push( nuevoArchivo );

        }
      }

  }

  private _getTransferencia(event: any)
  {
    // Esto al parecer es una funcion del navegador para subir archivos

    // Ahora el dataTranfer es una funcion para subir archivos, pero a
    // algunos navegadores no les sirve esa funcion entonces toca hacer
    // la otra funcion original.. bla bla.
    // No olvidemos que esa interrogacion y los dos puntos parece ser un IF.
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    // OBSSERVAR BIEN ESTA LINEA, YA QUE ES LA ENCARGADA DE HACER LA TRANSFERENCIA DE ARCHIVOS
  }

  /**************************** */


    // Validaciones
    private _archivoValido(archivo: File)
    {
      // EN REALIDAD este es el que valida toda la informacion
      // al subir una imagen se ejecuta este codigo imagen por imagen
      if (!this._existeArchivo(archivo.name) && this._esImagen(archivo.type))
      {
          return true;
      }
      else {return false;}
    }

    private _prevenirDefecto(event)
    {
      // Esto es para evitar abrir una imagen en el navegador
      // cuando yo lo suelto en en navegador
      // Porque que por defecto abre una imagen cuando lo arrastro
      // y lo suelto
        event.preventDefault();
        event.stopPropagation();
    }

    private _existeArchivo(nombreArchivo: string): boolean
    {
      // Aqui voy a barrer todos los archivos que ya he cargado
      // y si alguno conicide, pues significa que archivo existe
        for (const archivo of this.archivos)
        {
            if (archivo.nombreArchivo === nombreArchivo)
            {
                console.log(`El archivo ${nombreArchivo} ya está en la lista`);
                return true;
            }
        }

        return false; // No coincide ninguno
    }

    private _esImagen(tipoArchivo: string)
    {
      // BUENO esta esta bien rara,
        // si el archivo es vacio o undefined mande false
         // y el startWith confirma que es un archivo de imagen
         // me imagino que un archivo de imagen tiene unos metadatos
         // que le dicen que tipo de archivo es
        return (tipoArchivo === '' || tipoArchivo === undefined) ? false :
         tipoArchivo.startsWith('image');

         // Esos :  son como un If porque dice algo asi
          // Si los archivos son undefinidos O vacios tome false
          // si no tipoArchivo.startsWith('image');
    }
}
