import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
// Esta linea de arriba de firebase me la sugurio Angular en la console
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})
export class CargaimagenesService {

  // Asi se va a llamar la carpeta en firebase donde se van
  // a guardar las images
  private IMAGES_FOLD = 'imagenes';

  constructor(private db: AngularFirestore)
  {

  }

  cargarimganes(imagnes: FileItem[]){
    //console.log(imagnes);

    const storageRef = firebase.storage().ref();

    for (const item of imagnes)
    {
      // Validacion
      item.estaSubiendo = true;
      // Interesante como realciona que un objeto se este subiedon con una bandera

      if(item.progreso == 100)
      {
        // Significa esto que el archivo ya se subio
        continue;
        // Sigue con la siguiete iteracion
      }

      const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`${this.IMAGES_FOLD}/${item.nombreArchivo}`)
                  .put(item.archivo);


      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                    // Aqui va cambiando el progreso IN LIVE/ LIVEE
                      // Cuando yo estaba en android esto se repetia en artos modales
                      // y me toco en la misma activity hacer esto
                    item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,

        ( error ) => console.error('Error al subir', error ),

        () => {
          // Este vacio sera success ? CLARO QUE SI
          console.log('Imagen cargada correctamente');


          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

            item.url = downloadURL;
            item.estaSubiendo = false;

            this.saveImages({
              nombre: item.nombreArchivo,
              url: item.url
            });

          });

        });

    }
  }

  private saveImages( imagen: {nombre: string, url: string} )
  {
    this.db.collection(`/${this.IMAGES_FOLD}`)
        .add( imagen );
  }
}
