import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Kulturarv} from "./entities/kulturarv";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class KulturarvService {
  //boundingBox=/WGS84+%2215.588544384554211 56.17562894058903 15.609959141329114 56.19716749533957%22
  private url = "http://kulturarvsdata.se/ksamsok/api?method=search&x-api=test&query=geoDataExists=%22j%22+and+serviceName=%22bbrb%22+and+create_toTime>=1700+and+create_fromTime<=1799+and+thumbnailExists=j";

  private domParser = new DOMParser();

  private readonly kulturarv$: BehaviorSubject<Kulturarv[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {

  }

  getKulturarv() {
    return this.http.get(this.url).subscribe((response: any) => {

      this.kulturarv$.next(this.transformKulturarv(response));

    }, (error2) => {
      console.log(error2);
    });
  }

  private transformKulturarv(response: any) {
    return response.result.records.map(record => {
      console.log(record);
      //console.log(record.record['@graph'].find(x => x['@type'] == 'ns5:Context'));
      //record['@graph'].find(x => x['@type'] == 'ns5:Context')['ns5:coordinates']['@value'];

      let graph = record.record['@graph'];

      let imageUrl = graph.find(x => x['@type'] == 'ns5:Image')['ns5:lowresSource'];

      let context = graph.find(x => x['@type'] == 'ns5:Context' && x['ns5:coordinates'] != undefined);
      if(context) {
        let coordinateXml = context['ns5:coordinates'];
        let coordinateXmlValue = coordinateXml['@value'];
        let coordinate: string = this.domParser.parseFromString(coordinateXmlValue, "application/xml").childNodes[0].childNodes[0]['innerHTML'];

        let entity = graph.find(x => x['@type'] == 'ns5:Entity' && x['ns5:itemLabel'] != undefined);
        if(entity) {
          let label = entity['ns5:itemLabel'];

          let historik = graph.find(x => x['ns5:type'] == 'Historik' && x['ns5:desc'] != undefined);
          if(historik) {
            return new Kulturarv(label, historik['ns5:desc'], coordinate, imageUrl);
          }
        }
      }
    }).filter(x => x != undefined);
  }

  get kulturarv(): Observable<Kulturarv[]> {
    return this.kulturarv$.asObservable();
  }
}
