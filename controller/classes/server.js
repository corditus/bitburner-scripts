/* Classes for managing servers
useage:
const aServer = new Server(ns,"Buddy");
myAnimal.speak(); // Output: Buddy makes a noise.
*/
// import {analyze,getAllHosts} from 'controller/data/bitburner'

// const cracks = {
//     "ssh":{
//         file:"BruteSSH.exe",
//         command:ns.brutessh,
//     },
// };
/** @param {NS} ns */
export class Server {
  constructor(ns, name) {
    this.ns = ns;
    this.name = name;
    this.ports = {
        "ssh":false,
        "ftp":false,
        "smtp":false,
        "http":false,
        "sql":false,
    }
  }

  openPorts(portTypes=[Object.keys(this.ports)]){
    const portCracks = {
        "ssh":{
            file:"BruteSSH.exe",
            command:this.ns.brutessh,
        },
        "ftp":{
            file:"FTPCrack.exe",
            command:this.ns.ftpcrack,
        },
        "smtp":{
            file:"relaySMTP.exe",
            command:this.ns.relaysmtp,
        },
        "http":{
            file:"HTTPWorm.exe",
            command:this.ns.httpworm,
        },
        "sql":{
            file:"SQLInject.exe",
            command:this.ns.sqlinject,
        }
    };
    for (const portType of portTypes){
        if (this.ns.fileExists(portCracks[portType].file,this.name)){
            const portCracked = portCracks[portType].command(this.name);
            if (portCracked=== true){
                this.ports[portType]=true;
                ns.toast(`[${this.name}] opened port: ${portType}`,'success',2000);
            }else{
                ns.toast(`[${this.name}] failed to open port: ${portType}`,'error',2000);
            }
        }
    };

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