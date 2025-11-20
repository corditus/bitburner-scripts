/** @param {NS} ns **/
export async function main(ns) {
  const visited = new Set();
  const stack = ["home"];


  function tryOpenPorts(host) {
    if (ns.fileExists("BruteSSH.exe","home")) ns.brutessh(host);
    if (ns.fileExists("FTPCrack.exe","home")) ns.ftpcrack(host);
    if (ns.fileExists("relaySMTP.exe","home")) ns.relaysmtp(host);
    if (ns.fileExists("HTTPWorm.exe","home")) ns.httpworm(host);
    if (ns.fileExists("SQLInject.exe","home")) ns.sqlinject(host);
  }


  while (stack.length) {
    const host = stack.pop();
    if (visited.has(host)) continue;
    visited.add(host);


    // push neighbours (so we still fully scan)
    for (const n of ns.scan(host)) {
      if (!visited.has(n)) stack.push(n);
    }


    // skip hosts we shouldn't nuke
    if (host === "home" || host === "darkweb") continue;


    // If we already have root, no need to nuke
    if (ns.hasRootAccess(host)) {
      // ns.tprint(`already have root on ${host}`);
      continue;
    }


    // try open ports if possible, then nuke
    tryOpenPorts(host);
    try {
      ns.nuke(host);
      if (ns.hasRootAccess(host)) ns.print(`nuked ${host} -> root acquired`);
      else ns.tprint(`ns.nuke() attempted on ${host} but still no root`);
    } catch (err) {
      ns.print(`nuke error on ${host}: ${err}`);
      console.log(`[scan-and-nuke] nuke error on ${host}: ${err}`);
    }
  }


  ns.tprint(`Scan complete. Visited hosts: ${Array.from(visited).length}`);
  console.log(`[scan-and-nuke] Scan complete. Visited hosts:`,{visited})
}