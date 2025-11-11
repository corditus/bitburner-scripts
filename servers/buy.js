/** @param {NS} ns */
export async function main(ns) {

let serverName;
let memorySize;

serverName = ns.args[0]
memorySize = ns.args[1]

const purchased = ns.purchaseServer(serverName, memorySize);
ns.tprint(purchased)
}