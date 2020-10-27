import CANNON from "cannon-es";

const GRAVITATIONAL_ACCELERATION = 9.807;

export class Speedometer {
  #acceleration = 1.6;
  #direction = 1;
  #speed = 0;
  #time;
  #world = new CANNON.World();

  constructor(time = Date.now()) {
    this.#time = time;
    this.#world.gravity.set(0, 0, -GRAVITATIONAL_ACCELERATION);
  }

  get speed() {
    return this.#speed;
  }

  set speed(speed) {
    this.#speed = speed;
  }

  fake() {
    const minSpeed = 0;
    const maxSpeed = 250;

    this.speed += this.#acceleration * this.#direction;

    if (this.speed < minSpeed) {
      this.speed = minSpeed;
      this.#direction = 1;
    } else if (maxSpeed < this.speed) {
      this.speed = maxSpeed;
      this.#direction = -1;
    }
    return this.speed;
  }

  simulate() {
    return this.speed;
  }
}
