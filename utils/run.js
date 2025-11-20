/** @param {NS} ns */
// export async function main(ns) {

// }
export async function runScript(ns, scriptFile, bot, threads, target) {
    return await ns.exec(scriptFile, bot, threads, target, bot);
  }