import CANNON from "cannon-es";

const AIR_DENSITY = 1.22; // Rho, kg/m^3
const DRAG_COEFFICIENT = 0.4; // Cd
const ENGINE_FORCE = 1500; // N
const FRONTAL_AREA = 0.8; // m^2
const GRAVITATIONAL_ACCELERATION = 36284; // m/s^2
const OBJECT_MASS = 10000; // kg

export class Vehicle {
  #ground;
  #groundMaterial;
  #object;
  #objectMaterial;
  #speed = 0;
  #time;
  #world = new CANNON.World();

  constructor(time = Date.now()) {
    this.#time = time;
    this.setupWorld();
    this.constructMaterials();
    this.constructGround();
    this.constructObject();
  }

  get speed() {
    return this.#speed;
  }

  set speed(speed) {
    this.#speed = speed;
  }

  /**
   * Construct Ground
   * Creates a ground plane.
   */
  constructGround() {
    const shape = new CANNON.Plane();
    const body = new CANNON.Body({
      mass: 0,
      material: this.#groundMaterial,
      shape,
    });
    this.#ground = body;
    this.#world.addBody(this.#ground);
  }

  /**
   * Construct Materials
   * Creates materials and defines what happens when two materials meet.
   */
  constructMaterials() {
    this.#groundMaterial = new CANNON.Material({
      name: "groundMaterial",
    });
    this.#objectMaterial = new CANNON.Material({ name: "objectMaterial" });
    const contactMaterial = new CANNON.ContactMaterial(
      this.#groundMaterial,
      this.#objectMaterial,
      {
        contactEquationStiffness: 10000,
        friction: 0.3,
        restitution: 0.3,
      }
    );
    this.#world.addContactMaterial(contactMaterial);
  }

  /**
   * Construct Object
   * Creates the vehicle.
   */
  constructObject() {
    const shape = new CANNON.Sphere(1);
    const body = new CANNON.Body({
      mass: OBJECT_MASS, // kg
      material: this.#objectMaterial,
      position: new CANNON.Vec3(0, 0, 1), // m
      shape,
    });
    this.#object = body;
    this.#world.addBody(this.#object);
  }

  /**
   * Setup World
   */
  setupWorld() {
    this.#world.gravity.set(0, 0, -GRAVITATIONAL_ACCELERATION);
    this.#world.broadphase = new CANNON.NaiveBroadphase();
  }

  /**
   * Simulate
   * Simulate data using the physics engine.
   *
   * @param {Date} time
   */
  simulate(time) {
    const velocity = this.#object.velocity.x || 0;
    const dragForce =
      (DRAG_COEFFICIENT * AIR_DENSITY * FRONTAL_AREA * velocity ** 2) / 2;
    const force = ENGINE_FORCE - dragForce;

    this.#object.applyForce(
      new CANNON.Vec3(force, 0, 0), // N
      new CANNON.Vec3(0, 0, 1)
    );

    const deltaT = (time - this.#time) / 1000; // s
    this.#time = time; // ms
    const lastX = this.#object.position.x; // m
    this.#world.step(deltaT);
    const currentX = this.#object.position.x; // m
    this.speed = (currentX - lastX) / deltaT; // m/s
  }
}