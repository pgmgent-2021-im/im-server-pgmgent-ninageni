import { Vehicle } from "./Vehicle.js";

const MAX_SPEED = 250;
const MIN_SPEED = 0;
const SPEED_ACCELERATE = 1;
const SPEED_DECELERATE = -1;
const SPEED_INCREMENT = 0.45;

export class Speedometer {
  #direction = SPEED_ACCELERATE;
  #speed;
  #vehicle;

  constructor(time = Date.now()) {
    this.#vehicle = new Vehicle(time);
  }

  get speed() {
    return this.#speed;
  }

  set speed(speed) {
    this.#speed = speed * 3.6; // m/s -> km/h
  }

  /**
   * Fake
   * Fake data using simple formula.
   */
  fake() {
    this.speed += SPEED_INCREMENT * this.#direction;

    if (this.speed < MIN_SPEED) {
      this.speed = MIN_SPEED;
      this.#direction = SPEED_ACCELERATE;
    } else if (MAX_SPEED < this.speed) {
      this.speed = MAX_SPEED;
      this.#direction = SPEED_DECELERATE;
    }

    return this.speed;
  }

  /**
   * Simulate
   * Simulate data using physics engine.
   *
   * @param {Date} time
   */
  simulate(time) {
    this.#vehicle.simulate(time);
    this.speed = this.#vehicle.speed;

    return this.speed;
  }
}