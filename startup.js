/** @param {NS} ns */
export async function main(ns) {
  // const DEFAULTS = {
  //   freeRam:4
  // };
  // const flags = await ns.flags([
  //   ['res-ram',4]
  // ])
  // 
  // const startupOrder = ["hacking/crawler.js","mcp.js"]
  const host = ns.getHostname();
  ns.tprint(`[${host}][startup] Starting up user scripts: crawler, mcp`)
  
  // get avail credits
  // purchase servers if possible
  
  ns.exec("hacking/scan-and-nuke.js",host);
  await ns.sleep(1000);
  
  ns.exec("hacking/crawler.js",host);
  // await ns.sleep(1000);
  // ns.exec("mcp.js",host);
  await ns.sleep(1000);
  ns.exec("hacking/botnet-deploy.js",host);
  //  const pid = ns.exec("hacking/weaken.js", bot, allocWeaken, chosen, bot);
}