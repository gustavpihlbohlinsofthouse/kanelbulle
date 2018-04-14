export class Kulturarv {
  title: string;
  description: string;
  coordinate: Coordinate;
  imageUrl: string;

  constructor(title: string, description: string, coordinate: string, imageUrl: string) {
    this.title = title;
    this.description = description;

    let coordinatesArray = coordinate.split(",");
    let latitude: number = Number.parseFloat(coordinatesArray[1]);
    let longitude: number = Number.parseFloat(coordinatesArray[0]);
    this.coordinate = new Coordinate(latitude, longitude);

    this.imageUrl = imageUrl;

  }
}

export class Coordinate {

  constructor(public latitude: number, public longitude: number) {

  }
}
