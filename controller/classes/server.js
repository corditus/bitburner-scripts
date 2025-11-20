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
  constructor(ns, name, server=ns.getServer(name)) {
    this.ns = ns;
    this.name = name;
    this.ports = {
        "ssh":server?.sshPortOpen||false,
        "ftp":server?.ftpPortOpen||false,
        "smtp":server?.smtpPortOpen||false,
        "http":server?.httpPortOpen||false,
        "sql":server?.sqlPortOpen||false,
    }
  }

  gainRootAccess(){
    if (this.ns.hasRootAccess(this.name)){
        this.ns.toast(`[${this.name}] already has root access`,'info',2000);
        return true;
    }
    const req_ports = this.ns.getServerNumPortsRequired(this.name);
    let opened_ports = 0;
    for (const port in this.ports){
        if (this.ports[port]===true){
            opened_ports += 1;
        }
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
            command:(targetName=this.name)=>{return this.ns.ftpcrack(targetName)},
        },
        "smtp":{
            file:"relaySMTP.exe",
            command:this.ns.relaysmtp(this.name),
        },
        "http":{
            file:"HTTPWorm.exe",
            command:this.ns.httpworm(this.name),
        },
        "sql":{
            file:"SQLInject.exe",
            command:this.ns.sqlinject(this.name),
        }
    };
    for (const portType of portTypes){
        if (this.ns.fileExists(portCracks[portType].file,this.name)){
            const portCracked = portCracks[portType].command();
            if (portCracked===true){
                this.ports[portType]=true;
                ns.toast(`[${this.name}] opened port: ${portType}`,'success',2000);
            }else{
                ns.toast(`[${this.name}] failed opening port: ${portType}`,'error',2000);
            }
        }
    };

  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

// export class PurchasedServer extends Server {
//     constructor(ns, name) {
//         super(ns, name);
//         this.ns = ns;
//         this.name = name;
//         this.maxRam = ns.getServerMaxRam(name);
//         this.usedRam = ns.getServerUsedRam(name);
//         this.availableRam = this.maxRam - this.usedRam;
//     } 


// }