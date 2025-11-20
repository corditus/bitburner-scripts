/** @param {NS} ns */
export async function analyze(ns, servers, host, mode) {
  if (!host) host = await ns.getHostname();
  if (!mode) mode = "all"
  if (!servers) servers = getAllHosts(ns)
  // const flags = ns.flags([])
  console.log(`[${host}][utils] analyze`,{servers,mode})
  let asrvd = {};
  for (const server of servers) {
    asrvd[server]={};
    // console.log(element); // Direct access to element value
    asrvd[server].hostname = server
    asrvd[server].server = await ns.getServer(server)
    asrvd[server].hasRootAccess = await ns.hasRootAccess(server)
    switch (mode) {
      case("all"):
        asrvd[server].growTime = await ns.getGrowTime(server)
        asrvd[server].hackTime = await ns.getHackTime(server)
        asrvd[server].weakenTime = await ns.getWeakenTime(server)
        asrvd[server].hackAnalyzeChance = await ns.hackAnalyzeChance(server)
        // asrvd[server].server
        asrvd[server].serverGrowth = await ns.getServerGrowth(server)
        asrvd[server].serverMaxMoney = await ns.getServerMaxMoney(server)
        asrvd[server].serverMaxRam = await ns.getServerMaxRam(server)
        asrvd[server].serverMoneyAvailable = await ns.getServerMoneyAvailable(server)
        
        asrvd[server].serverNumPortsRequired = await ns.getServerNumPortsRequired(server)
        asrvd[server].serverSecurityLevel = await ns.getServerSecurityLevel(server)
        asrvd[server].serverRequiredHackingLevel = await ns.getServerRequiredHackingLevel(server)
        asrvd[server].serverUsedRam = await ns.getServerUsedRam(server)
        asrvd[server].files = await ns.ls(server)
        break;
      case ("hacks"):
        // Code to execute if expression === value1
        asrvd[server].growTime = await ns.getGrowTime(server)
        asrvd[server].hackTime = await ns.getHackTime(server)
        asrvd[server].weakenTime = await ns.getWeakenTime(server)
        asrvd[server].hackAnalyzeChance = await ns.hackAnalyzeChance(server)
        // asrvd[server].server
        asrvd[server].serverGrowth = await ns.getServerGrowth(server)
        asrvd[server].serverMaxMoney = await ns.getServerMaxMoney(server)
        asrvd[server].serverMaxRam = await ns.getServerMaxRam(server)
        break;
      case ("exploit"):
        // Code to execute if expression === value2
        asrvd[server].serverNumPortsRequired = await ns.getServerNumPortsRequired(server)
        asrvd[server].serverSecurityLevel = await ns.getServerSecurityLevel(server)
        asrvd[server].serverRequiredHackingLevel = await ns.getServerRequiredHackingLevel(server)
        asrvd[server].serverUsedRam = await ns.getServerUsedRam(server)
        break;
        // asrvd[server].server
        // asrvd[server].server

      // ... more cases
      // default:
      //   // Code to execute if no case matches
      //   asrvd[server].hostname = server
      //   asrvd[server].server = await ns.getServer(server)
      //   asrvd[server].hasRootAccess = await ns.hasRootAccess(server)
    }
    // allServerDetails[server] = srvd
  }
  if(servers.length>0){return asrvd}else{return asrvd[servers[0]]}
}

export function getAllHosts(ns) {
    const visited = new Set();
    const q = ["home"];
    while (q.length) {
      const h = q.shift();
      if (visited.has(h)) continue;
      visited.add(h);
      for (const n of ns.scan(h)) if (!visited.has(n)) q.push(n);
    }
    // ns.tprint(visited);
    return Array.from(visited);
  }