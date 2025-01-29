import KR_CITIES from "@utils/cities";
import p5 from "p5";
import topoData from "@data/korea/provinces-topo-simple.json";
import cityData from "@data/korea/cities.json";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import "nerdamer/Algebra";
import "nerdamer/Solve";
import { Filter } from "@data/useData";

type CityRenderData = {
  left?: Array<KR_CITIES>;
  top?: Array<KR_CITIES>;
  right?: Array<KR_CITIES>;
  bottom?: Array<KR_CITIES>;
  unit: number;
  size: number;
  x: number;
  y: number;
};

const MIN_SIZE = 10;

const MAX_SIZE = 100;

export class SupplyBubbleMapCanvas {
  p5: p5;
  data: Map<KR_CITIES, number>;
  cityRenderData: Map<KR_CITIES, CityRenderData>;
  padding: number = 10;
  maxUnit: number = 0;
  minUnit: number = 0;
  offset: { x: number; y: number } = { x: 0, y: 0 };
  renderedFlag: Map<KR_CITIES, boolean> = new Map();
  cityProjectionPoints: Map<KR_CITIES, [number, number]> = new Map();
  hoveredCity: KR_CITIES | null = null;
  selectedCity: KR_CITIES | null = null;
  setFilter: (newFilter: Filter) => void;
  filter: Filter;

  constructor(
    p5: p5,
    data: Map<KR_CITIES, number>,
    width: number,
    height: number,
    setFilter: (newFilter: Filter) => void,
    filter: Filter
  ) {
    this.p5 = p5;
    this.data = data;
    this.cityRenderData = new Map();
    this.initializeCityLocation();
    this.setFilter = setFilter;
    this.filter = filter;
  }

  intialize(data: Map<KR_CITIES, number>, minVal: number, maxVal: number) {
    // use this data
    this.data = data;
    // now we have to set the size for each city
    for (const [city, value] of this.data) {
      //   console.log(city, size);
      // check if cityRenderData has this city
      this.cityRenderData.get(city)!.unit = value;
    }
    this.maxUnit = maxVal;
    this.minUnit = minVal;
    this.updateProjectionPoints();
  }

  initializeCityLocation() {
    // incheon should be rendered first
    this.cityRenderData.set(KR_CITIES.INCHEON, {
      right: [KR_CITIES.GYEONGGI, KR_CITIES.SEOUL],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });

    this.cityRenderData.set(KR_CITIES.SEOUL, {
      bottom: [KR_CITIES.GYEONGGI],
      left: [KR_CITIES.INCHEON],
      right: [KR_CITIES.GANGWON],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });

    this.cityRenderData.set(KR_CITIES.CHUNGBUK, {
      top: [KR_CITIES.GYEONGGI, KR_CITIES.GANGWON],
      left: [KR_CITIES.DAEJEON_CHUNGNAM],
      right: [KR_CITIES.DAEGU_GYEONGBUK],
      bottom: [KR_CITIES.JEONBUK],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
    this.cityRenderData.set(KR_CITIES.GANGWON, {
      left: [KR_CITIES.GYEONGGI, KR_CITIES.SEOUL],
      bottom: [KR_CITIES.CHUNGBUK, KR_CITIES.DAEGU_GYEONGBUK],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });

    this.cityRenderData.set(KR_CITIES.DAEJEON_CHUNGNAM, {
      top: [KR_CITIES.GYEONGGI],
      right: [KR_CITIES.CHUNGBUK],
      bottom: [KR_CITIES.JEONBUK],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });

    this.cityRenderData.set(KR_CITIES.DAEGU_GYEONGBUK, {
      top: [KR_CITIES.GANGWON],
      left: [KR_CITIES.CHUNGBUK],
      bottom: [KR_CITIES.GYEONGNAM, KR_CITIES.ULSAN],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
    this.cityRenderData.set(KR_CITIES.JEONBUK, {
      top: [KR_CITIES.CHUNGBUK, KR_CITIES.DAEJEON_CHUNGNAM],
      left: [KR_CITIES.DAEGU_GYEONGBUK],
      right: [KR_CITIES.GYEONGNAM],
      bottom: [KR_CITIES.JEONNAM],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });

    this.cityRenderData.set(KR_CITIES.GYEONGNAM, {
      top: [KR_CITIES.DAEGU_GYEONGBUK],
      left: [KR_CITIES.JEONBUK, KR_CITIES.JEONNAM],
      right: [KR_CITIES.BUSAN, KR_CITIES.ULSAN],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
    this.cityRenderData.set(KR_CITIES.BUSAN, {
      top: [KR_CITIES.ULSAN],
      left: [KR_CITIES.GYEONGNAM],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
    this.cityRenderData.set(KR_CITIES.ULSAN, {
      top: [KR_CITIES.DAEGU_GYEONGBUK],
      left: [KR_CITIES.GYEONGNAM],
      bottom: [KR_CITIES.BUSAN],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });

    this.cityRenderData.set(KR_CITIES.JEONNAM, {
      top: [KR_CITIES.JEONBUK],
      right: [KR_CITIES.GYEONGNAM],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
    this.cityRenderData.set(KR_CITIES.JEJU, {
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
    this.cityRenderData.set(KR_CITIES.GYEONGGI, {
      top: [KR_CITIES.SEOUL],
      left: [KR_CITIES.INCHEON],
      right: [KR_CITIES.GANGWON],
      bottom: [KR_CITIES.CHUNGBUK, KR_CITIES.DAEJEON_CHUNGNAM],
      unit: 0,
      size: 0,
      x: 0,
      y: 0,
    });
  }

  getCitySize(city: KR_CITIES) {
    const maxSize = Math.max(this.p5.width, this.p5.height) / 4;
    const minSize = Math.min(this.p5.width, this.p5.height) / 16;

    const cityData = this.cityRenderData.get(city)!;
    const size = this.p5.map(
      cityData.unit,
      this.minUnit,
      this.maxUnit,
      MIN_SIZE,
      MAX_SIZE
    );
    return size;
  }

  updateProjectionPoints() {
    const width = this.p5.width;
    const height = this.p5.height;
    const geojson: any = topojson.feature(
      topoData as any,
      topoData.objects["provinces-geo"] as any
    );

    const center = d3.geoCentroid(geojson as any);
    const projection = d3
      .geoMercator()
      .center(center)
      .scale(2600)
      .translate([width / 2, height / 2]);

    cityData.forEach((city: any) => {
      const x = projection([city.lon, city.lat])![0];
      const y = projection([city.lon, city.lat])![1];
      this.cityProjectionPoints.set(city.name as KR_CITIES, [x, y]);
    });
  }

  setSelectedCity(city: KR_CITIES | null) {
    this.selectedCity = city;
  }

  updateFilter(filter: Filter) {
    this.filter = filter;
  }

  updateSetFilter(setFilter: (newFilter: Filter) => void) {
    this.setFilter = setFilter;
  }

  renderCity(city: KR_CITIES) {
    // draw the city as square
    this.p5.push();
    if (!this.selectedCity || this.selectedCity === city) {
      this.p5.fill(255, 0, 0, 100);
    }
    const { x, y, size } = this.cityRenderData.get(city)!;
    // this.p5.fill(255, 0, 0);
    this.p5.circle(x, y, size);
    // add text
    const textSize = this.p5.map(size, MIN_SIZE, MAX_SIZE, 8, 20);
    this.p5.textSize(textSize);
    // this.p5.fill(0);
    // center the text
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    const textWithoutSlash = city.split("/")[0];
    this.p5.fill("black");
    this.p5.text(textWithoutSlash, x, y);
    this.renderedFlag.set(city, true);
    this.p5.pop();
  }

  getClosestCities(city: KR_CITIES, renderedFlag: Map<KR_CITIES, boolean>) {
    // check if the city has been rendered
    const renderedCities = Array.from(renderedFlag.keys()).filter((city) =>
      renderedFlag.get(city)
    );
    const cityProjection = this.cityProjectionPoints.get(city)!;
    const cityDistances = new Map<KR_CITIES, number>();

    if (renderedCities.length === 0) {
      return [];
    } else if (renderedCities.length === 1) {
      // const renderedCityProjection = this.cityProjectionPoints.get(
      //   renderedCities[0]
      // )!;
      // const distance = Math.sqrt(
      //   Math.pow(cityProjection[0] - renderedCityProjection[0], 2) +
      //     Math.pow(cityProjection[1] - renderedCityProjection[1], 2)
      // );
      // cityDistances.set(renderedCities[0], distance);
      return [renderedCities[0]];
    }
    for (const renderedCity of renderedCities) {
      const renederCityProjection =
        this.cityProjectionPoints.get(renderedCity)!;
      const distance = Math.sqrt(
        Math.pow(cityProjection[0] - renederCityProjection[0], 2) +
          Math.pow(cityProjection[1] - renederCityProjection[1], 2)
      );
      cityDistances.set(renderedCity, distance);
    }
    const sortedCities = Array.from(cityDistances).sort((a, b) => a[1] - b[1]);
    return sortedCities.slice(0, 1).map((city) => city[0]);
  }

  getXYForCityFromCities(cities: KR_CITIES[], targetCity: KR_CITIES) {
    const citiesData = cities.map((city) => ({
      ...this.cityRenderData.get(city)!,
      name: city,
    }));
    const targetCityProjection = this.cityProjectionPoints.get(targetCity)!;
    const targetCityData = this.cityRenderData.get(targetCity)!;
    if (citiesData.length === 0) {
      throw new Error("No cities data");
    } else if (citiesData.length === 1) {
      if (!targetCityProjection) {
        return { x: 0, y: 0 };
      }
      const city = citiesData[0].name;
      const compareProjection = this.cityProjectionPoints.get(city)!;
      // calculate the angle between the two cities
      const angle = Math.atan2(
        targetCityProjection[1] - compareProjection[1],
        targetCityProjection[0] - compareProjection[0]
      );
      // check if you should offset to the left or right
      const compareDistance = citiesData[0].size + targetCityData.size;
      const x = citiesData[0].x + (compareDistance / 2) * Math.cos(angle);
      const y = citiesData[0].y + (compareDistance / 2) * Math.sin(angle);
      return { x, y };
      //
    } else {
      throw new Error("Too many cities");
    }
  }

  calculateRenderInfo() {
    const renderInfoRecorded = new Map<KR_CITIES, boolean>();

    const incheon = this.cityRenderData.get(KR_CITIES.INCHEON)!;
    this.cityRenderData.get(KR_CITIES.INCHEON)!.x =
      this.cityProjectionPoints.get(KR_CITIES.INCHEON)![0];
    this.cityRenderData.get(KR_CITIES.INCHEON)!.y =
      this.cityProjectionPoints.get(KR_CITIES.INCHEON)![1];
    const incheonSize = this.getCitySize(KR_CITIES.INCHEON);
    this.cityRenderData.get(KR_CITIES.INCHEON)!.size = incheonSize;

    renderInfoRecorded.set(KR_CITIES.INCHEON, true);

    // now we have to find the x, y for each city
    for (const [city, cityData] of this.cityRenderData) {
      if (city === KR_CITIES.INCHEON) {
        continue;
      }
      const closestCities = this.getClosestCities(city, renderInfoRecorded);
      const size = this.getCitySize(city);
      this.cityRenderData.get(city)!.size = size;
      const { x, y } = this.getXYForCityFromCities(closestCities, city);
      this.cityRenderData.get(city)!.x = x;
      this.cityRenderData.get(city)!.y = y;
      renderInfoRecorded.set(city, true);
    }

    const leftMostX = Math.min(
      ...Array.from(this.cityRenderData.values()).map(
        (cityData) => cityData.x - cityData.size
      )
    );
    const rightMostX = Math.max(
      ...Array.from(this.cityRenderData.values()).map(
        (cityData) => cityData.x + cityData.size
      )
    );
    const topMostY = Math.min(
      ...Array.from(this.cityRenderData.values()).map(
        (cityData) => cityData.y - cityData.size
      )
    );
    const bottomMostY = Math.max(
      ...Array.from(this.cityRenderData.values()).map(
        (cityData) => cityData.y + cityData.size
      )
    );

    return {
      leftMostX,
      rightMostX,
      topMostY,
      bottomMostY,
    };
  }

  getCityByXY(x: number, y: number) {
    for (const [city, cityData] of this.cityRenderData) {
      // city is circle
      const distance = Math.sqrt(
        Math.pow(x - cityData.x, 2) + Math.pow(y - cityData.y, 2)
      );
      if (distance < cityData.size / 2) {
        return city;
      }
    }
    return undefined;
  }

  render() {
    this.updateProjectionPoints();
    const { leftMostX, topMostY, rightMostX, bottomMostY } =
      this.calculateRenderInfo();
    const mapWidth = rightMostX - leftMostX;
    const mapHeight = bottomMostY - topMostY;
    this.p5.translate(
      this.p5.width / 2 - mapWidth / 2 - leftMostX,
      this.p5.height / 2 - mapHeight / 2 - topMostY
    );
    this.offset.x = this.p5.width / 2 - mapWidth / 2 - leftMostX;
    this.offset.y = this.p5.height / 2 - mapHeight / 2 - topMostY;
    // this.p5.push();
    // this.p5.noFill();
    // this.p5.stroke(0);
    // this.p5.rect(leftMostX, topMostY, mapWidth, mapHeight);
    // this.p5.pop();

    // color rect

    for (const [city] of this.cityRenderData) {
      this.renderedFlag.set(city, false);
    }
    // we have to find center point through incheon, seoul, gangwon
    const maxSize = Math.max(this.p5.width, this.p5.height) / 4;

    // render incheon first
    // this.renderCities();

    this.cityRenderData.get(KR_CITIES.INCHEON)!.x =
      this.cityProjectionPoints.get(KR_CITIES.INCHEON)![0];
    this.cityRenderData.get(KR_CITIES.INCHEON)!.y =
      this.cityProjectionPoints.get(KR_CITIES.INCHEON)![1];
    const incheonSize = this.getCitySize(KR_CITIES.INCHEON);
    this.cityRenderData.get(KR_CITIES.INCHEON)!.size = incheonSize;
    this.renderCity(KR_CITIES.INCHEON);

    // now we have to find the x, y for each city
    for (const [city, cityData] of this.cityRenderData) {
      if (city === KR_CITIES.INCHEON) {
        continue;
      }
      const closestCities = this.getClosestCities(city, this.renderedFlag);
      const size = this.getCitySize(city);
      this.cityRenderData.get(city)!.size = size;
      const { x, y } = this.getXYForCityFromCities(closestCities, city);
      this.cityRenderData.get(city)!.x = x;
      this.cityRenderData.get(city)!.y = y;
      this.renderCity(city);
    }
    // this.p5.fill(255, 0, 0);
    // this.p5.rect(0, 0, mapWidth, mapHeight);
    if (this.hoveredCity) {
      const cityData = this.cityRenderData.get(this.hoveredCity)!;
      this.p5.push();
      this.p5.noFill();
      this.p5.strokeWeight(2);
      this.p5.circle(cityData.x, cityData.y, cityData.size);
      this.p5.pop();
    }
  }

  mouseClicked() {
    const x = this.p5.mouseX - this.offset.x;
    const y = this.p5.mouseY - this.offset.y;
    const city = this.getCityByXY(x, y);
    if (city) {
      console.log("jijiji");
      this.setFilter({
        ...this.filter,
        city: city,
      });
    }
  }

  mouseMoved() {
    const x = this.p5.mouseX - this.offset.x;
    const y = this.p5.mouseY - this.offset.y;
    const city = this.getCityByXY(x, y);
    if (city) {
      // change pointer
      this.p5.cursor(this.p5.HAND);
      this.hoveredCity = city;
    } else {
      this.p5.cursor(this.p5.ARROW);
      this.hoveredCity = null;
    }
  }
}
