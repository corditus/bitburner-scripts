import {toDecimal} from 'utils/formatting'
/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];
  const host = ns.args[1]
  if (!target) { ns.tprint("Usage: run weaken.js <target>"); return; }
  const actioned = await ns.weaken(target);
  // ns.tprint(`[ ${host.padStart(12)} -> ${target.padStart(12)} ] [ weakened ] ${String(actioned).padStart(14)}`)
  console.log(`[weakened][${host}] ${String(toDecimal(actioned,4))} -> ${target.padStart(12)}`)
}