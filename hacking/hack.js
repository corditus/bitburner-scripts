import {formatAUD,toDecimal,formatCurrencyShorthand} from 'utils/formatting'

// function formatAUD(amount) {
//   return amount.toLocaleString('en-AU', {
//     style: 'currency',
//     currency: 'AUD',
//   });
// }
/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];
  const host = ns.args[1]
  // ns.tprint(`hacking script args:`)
  // ns.tprint(ns.args)
  
  if (!target) { ns.tprint("Usage: run hack.js <target>"); return; }
  const hacked = await ns.hack(target);
  if(hacked===0)return;
  console.log(`[hacked][${host}] ${formatCurrencyShorthand(hacked).padStart(8)} -> ${target.padStart(12)}`)
}