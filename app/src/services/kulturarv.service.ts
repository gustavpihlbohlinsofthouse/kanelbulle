import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import * as xml2js from 'xml2js';

@Injectable()
export class KulturarvService {
  private url = "http://kulturarvsdata.se/ksamsok/api?method=search&x-api=test&query=boundingBox=/WGS84+%2215.588544384554211 56.17562894058903 15.609959141329114 56.19716749533957%22";

  private parser = new DOMParser();
  private xmlParser = new xml2js();
  constructor(private http: HttpClient) {

  }

  getKulturarv(): void {
    this.http.get(this.url).subscribe((response: string) => {
      console.log("Hello world");
      console.log(response);
      let dom = this.parser.parseFromString(response, "text/xml");
      console.log(dom.getElementsByTagName("result")[0]);


    }, (error2) => {
      console.log(error2);
    })
  }
}
