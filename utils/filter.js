


export function filterServer(ns,server) {
  return {
    canHack: ()=>{
      let numCracks = getNumCracks(ns);
      let reqCracks, numPorts = ns.getServerNumPortsRequired(server);
    //   let ramAvail = ns.getServerMaxRam(server);
      //criteria
    if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) return false; //hacking level too low
    if (reqCracks > numCracks) return false; //not enough port crackers

      return true
    },
  };
}