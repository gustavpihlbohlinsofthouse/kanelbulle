import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {KulturarvService} from "../../services/kulturarv.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private kulturarvService: KulturarvService) {
    this.kulturarvService.getKulturarv();
  }

}
