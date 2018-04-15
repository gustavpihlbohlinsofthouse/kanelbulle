import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Kulturarv} from "../../services/entities/kulturarv";

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  private kulturarv: Kulturarv;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.kulturarv = navParams.get("item");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
    console.log(this.kulturarv)
  }

}
