import CANNON from "cannon-es";

const GRAVITATIONAL_ACCELERATION = 9.807;

export class Odometer {
  #distance = 0;
  #time;
  #world = new CANNON.World();

  constructor(time = new Date()) {
    this.#time = time;
    this.#world.gravity.set(0, 0, -GRAVITATIONAL_ACCELERATION);
  }

  get distance() {
    return this.#distance;
  }

  set distance(distance) {
    this.#distance = distance;
  }

  fake() {
    this.distance += 0.01;

    return this.distance;
  }

  simulate() {
    return this.distance;
  }
}
