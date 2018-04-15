import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Kulturarv} from "./entities/kulturarv";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class KulturarvService {
  //boundingBox=/WGS84+%2215.588544384554211 56.17562894058903 15.609959141329114 56.19716749533957%22
  private url = "http://kulturarvsdata.se/ksamsok/api?method=search&x-api=test&query=";
  private query = "geoDataExists=j and thumbnailExists=j";
  private filters = "&recordSchema=presentation";

  //&recordSchema=xml&fields=thumbnail,itemLabel,lon,lat,itemDescription

  private domParser = new DOMParser();

  private readonly kulturarv$: BehaviorSubject<Kulturarv[]> = new BehaviorSubject([]);



  constructor(private http: HttpClient) {

  }

  getKulturarv() {
    return this.http.get(this.url+this.query+this.filters, {
      headers: {'Accept':'application/xml'},
      responseType: 'text'
    }).subscribe((response: any) => {

      this.kulturarv$.next(this.transformKulturarv(response));

    }, (error2) => {
      console.log(error2);
    });
  }

  private transformKulturarv(response: any) {
    let parsed = this.domParser.parseFromString(response, "application/xml");
    let records = Array.from(parsed.getElementsByTagName('result')[0].getElementsByTagName('records')[0].getElementsByTagName('record'));

    return records.map(record => {
      let label = record.getElementsByTagName('pres:itemLabel')[0].innerHTML;
      let description = Array.from(record.getElementsByTagName('pres:description')).map(description => description.innerHTML).pop() || "";
      let imageSources = Array.from(record.getElementsByTagName('pres:image')[0].getElementsByTagName('pres:src'));
      let thumbnail = imageSources.find(src => src.getAttribute('type') == 'thumbnail').innerHTML;
      let lowres = imageSources.find(src => src.getAttribute('type') == 'lowres').innerHTML;

      let coordinate = record.getElementsByTagName('georss:where')[0]
        .getElementsByTagName('gml:Point')[0]
        .getElementsByTagName('gml:coordinates')[0].innerHTML;

      let kulturarv = new Kulturarv(label, description, coordinate, lowres, thumbnail);
      return kulturarv;
    });
  }

  get kulturarv(): Observable<Kulturarv[]> {
    return this.kulturarv$.asObservable();
  }
}
