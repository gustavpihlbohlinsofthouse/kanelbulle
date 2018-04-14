import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {KulturarvService} from "../../services/kulturarv.service";
import {Observable} from "rxjs/Observable";
import {Coordinate, Kulturarv} from '../../services/entities/kulturarv';
import {Observer} from "rxjs/Observer";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  private kulturarv$: Observable<Kulturarv[]>;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private kulturarvService: KulturarvService) {
    this.kulturarv$ = kulturarvService.kulturarv;
  }

  ionViewDidLoad() {
    this.kulturarvService.getKulturarv();
    this.loadMap();
    this.kulturarv$.forEach(arv => {
      arv.forEach(a => {
        this.addMarker(a);
      })
    })
  }


  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (error) => {
      console.log(error);
    });

  }

  addMarker(kulturarv: Kulturarv) {
    console.log('adding marker');

    let infoWindow = new google.maps.InfoWindow({
      content: '<h1>' + kulturarv.title + '</h1><p>' + kulturarv.description + '</p><img src="' + kulturarv.imageUrl + '"/>'
    });

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(kulturarv.coordinate.latitude, kulturarv.coordinate.longitude)
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });


  }
}
