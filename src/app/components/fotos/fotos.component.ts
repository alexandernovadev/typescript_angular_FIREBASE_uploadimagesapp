import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { nombre: string; url: string; }
@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css']
})
export class FotosComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  fotos: Observable<Item[]>;

  constructor(private afs: AngularFirestore ) {
    this.itemsCollection = afs.collection<Item>('imagenes');
    this.fotos = this.itemsCollection.valueChanges();
  }

  ngOnInit() {
  }

}
