/* Classes for managing servers
useage:
const aServer = new Server(ns,"Buddy");
myAnimal.speak(); // Output: Buddy makes a noise.
*/
// import {analyze,getAllHosts} from 'controller/data/bitburner'
/** @param {NS} ns */
export class Server {
  constructor(ns, name) {
    this.ns = ns;
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

export class PurchasedServer extends Server {
    constructor(ns, name) {
        super(ns, name);
        this.ns = ns;
        this.name = name;
        this.maxRam = ns.getServerMaxRam(name);
        this.usedRam = ns.getServerUsedRam(name);
        this.availableRam = this.maxRam - this.usedRam;
    }

    
}