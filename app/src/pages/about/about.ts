import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {KulturarvService} from "../../services/kulturarv.service";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, private kulturarvService: KulturarvService) {
    this.kulturarvService.getKulturarv();
  }

}
