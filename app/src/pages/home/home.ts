import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {KulturarvService} from "../../services/kulturarv.service";
import {Observable} from "rxjs/Observable";
import {Kulturarv} from '../../services/entities/kulturarv';
import {DetailsPage} from "../details/details";

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
    this.loadMap().then(() => {
      this.kulturarv$.forEach(arv => {
        arv.forEach(a => {
          this.addMarker(a);
        });
      })
    });
  }


  loadMap() {

    return this.geolocation.getCurrentPosition().then((position) => {
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
    /*new google.maps.InfoWindow({
      content: '<h1>' + kulturarv.title + '</h1><p>' + kulturarv.description + '</p><img src="' + kulturarv.thumbnailURL + '"/>'
    });*/

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(kulturarv.coordinate.latitude, kulturarv.coordinate.longitude)
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.navCtrl.push(DetailsPage, {
        //item: new Kulturarv("Test", "Lorem ipsum det här är en lång beskrivning det här är en lång beskrivning. det här är en lång beskrivning, det här är en lång beskrivning.", "56.1807692238188,15.589905191971411", "http://www.kmart.com.au/wcsstore/Kmart/images/ncatalog/f/8/42269878-1-f.jpg")
        item: kulturarv
      });
      //infoWindow.open(this.map, marker);
    });
  }
}
