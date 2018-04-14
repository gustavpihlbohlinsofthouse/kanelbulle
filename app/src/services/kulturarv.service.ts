import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class KulturarvService {
  private url = "http://kulturarvsdata.se/ksamsok/api?method=search&x-api=test&query=boundingBox=/WGS84+%2215.588544384554211 56.17562894058903 15.609959141329114 56.19716749533957%22";

  private domParser = new DOMParser();
  constructor(private http: HttpClient) {

  }

  getKulturarv(): void {
    this.http.get(this.url).subscribe((response: any) => {
      console.log("Hello world");
      console.log(response.result.records[0].record['@graph']);//['ns5:coordinates']);
      let coordinateXml = response.result.records[0].record['@graph'].find(x => x['@type'] == 'ns5:Context')['ns5:coordinates']['@value'];
      console.log(this.domParser.parseFromString(coordinateXml, "application/xml").childNodes[0].childNodes[0].innerHTML);


    }, (error2) => {
      console.log(error2);
    })
  }
}
