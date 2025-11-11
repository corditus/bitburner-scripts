import {toDecimal,formatCurrencyShorthand} from 'utils/formatting'
/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];
  const host = ns.args[1]
  if (!target) { ns.tprint("Usage: run grow.js <target>"); return; }
  const actioned = await ns.grow(target)
  // console.log(`[ ${host.padStart(12)} -> ${target.padStart(12)} ] [ grow ] ${String(actioned).padStart(14)}`)
console.log(`[grow][${host}] ${formatCurrencyShorthand(actioned)} -> ${target}`,{target,actioned,host})
}