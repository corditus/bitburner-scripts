
  const scanDelay = 1000;
  const RATIOS = {weaken: 0.3, grow: 0.3, hack: 0.4};
  let MEM_PRIMARYTARGET = null
  let MEM_AVAILABLETARGETS = []
  let MEM_BOTACTIONS = {}; // tracks {bot: {action: target}}
  // Get all reachable hosts
  function getAllHosts(ns) {
    const visited = new Set();
    const q = ["home"];
    while (q.length) {
      const h = q.shift();
      if (visited.has(h)) continue;
      visited.add(h);
      for (const n of ns.scan(h)) if (!visited.has(n)) q.push(n);
    }
    return Array.from(visited);
  }

// const 
async function runScript(ns, scriptFile, bot, threads, target) {
    return await ns.exec(scriptFile, bot, threads, target, bot);
  }
async function actionByMemory(ns, target, bot, action, threads) {
        if (threads <= 0) return 0;
        // console.log(`[actionByMemory][${bot}]`,{target, bot, action, threads})
        const scriptFile = `hacking/${action}.js`;
        const currentTarget = MEM_BOTACTIONS[bot][action];
        const isRunning = await ns.scriptRunning(scriptFile, bot);
        
        // If target changed or script stopped, restart
        if (currentTarget !== target || !isRunning) {
          // console.log(`[botnet-deploy][${bot}] target changed or script stopped, restart`,{isRunning,currentTarget,target})
          ns.scriptKill(scriptFile, bot);
          const pid = await runScript(ns, scriptFile, bot, threads, target);
          if (pid > 0) MEM_BOTACTIONS[bot][action] = target;
          return pid;
        }
        return 0; // Already running on correct target
      };

/** @param {NS} ns **/
export async function main(ns) {
  const workerFiles = ["hacking/weaken.js","hacking/grow.js","hacking/hack.js","utils/formatting.js"];
  const targetArg = ns.args[0]; // optional target hostname or "auto"


  

  // Verify worker files exist
  for (const f of workerFiles) {
    if (!ns.fileExists(f, "home")) {
      ns.tprint(`ERROR: ${f} missing on home.`);
      return;
    }
  }

  ns.tprint("[botnet-deployer] started. Ctrl-C to stop.");
  console.log(`[botnet-deployer] started. Ctrl-C to stop.`)
  while (true) {
    const hosts = getAllHosts(ns);

    // Build sorted target list
    let targets = [];
    if (!targetArg || targetArg === "auto") {
      for (const h of hosts) {
        // Filter hackable targets
        if (ns.getServerMaxMoney(h) <= 0) continue;
        if (ns.getServerRequiredHackingLevel(h) > ns.getHackingLevel()) continue;
        if (!ns.hasRootAccess(h)) continue;
        
        targets.push(h);
      }
      // Sort by max money descending
      targets.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    } else {
      targets = [targetArg];
    }
    const arraysMatch = (arr1, arr2)=>{
      if (arr1.length !== arr2.length) {
        return false; // Arrays of different lengths cannot match
      }
      return arr1.every((value, index) => value === arr2[index]);
    }
    if(!arraysMatch(targets,MEM_AVAILABLETARGETS)){
      console.log(`[botnet-deploy] new taregt list`,{targets});
      MEM_AVAILABLETARGETS = targets;
    }

    // else{
    // console.log(`[botnet-deploy] targets available`,{targets})

    // }

    if (targets.length === 0) {
      ns.tprint("[botnet-deploy] No valid targets found");
      await ns.sleep(scanDelay);
      continue;
    }

    // All bots attack the most valuable target (first in sorted list)
    const primaryTarget = targets[0];
    if(primaryTarget!=MEM_PRIMARYTARGET){
      console.log(`[botnet-deploy] new primaryTarget`,{primaryTarget});
      MEM_PRIMARYTARGET = primaryTarget;
    }

    // Deploy to each bot
    for (const bot of hosts) {
      // console.log(`[botnet-deploy] bot`,{bot,hosts})
      if (!ns.hasRootAccess(bot)) continue;

      const maxRam = ns.getServerMaxRam(bot);
      const usedRam = ns.getServerUsedRam(bot);
      const freeRam = maxRam - usedRam;
      if (freeRam < 1) continue;

      // Copy workers
      try {
        await ns.scp(workerFiles, bot,"home");
        await ns.sleep(100)
      } catch (e) {
        ns.tprint(`scp failed to ${bot}: ${e}`);
        continue;
      }

      const chosen = primaryTarget;

      // Calculate thread allocations
      const ramWeaken = await ns.getScriptRam('hacking/weaken.js', bot);
      const ramGrow = await ns.getScriptRam('hacking/grow.js', bot);
      const ramHack = await ns.getScriptRam('hacking/hack.js', bot);
      // console.log(`[botnet-deploy][${bot}]`,{
      //   maxRam,usedRam,freeRam,ramWeaken,ramGrow,ramHack,
      //   files:await ns.ls(bot)
      //   })
      if (!ramWeaken || !ramGrow || !ramHack) continue;

      const allocWeaken = Math.floor((freeRam * RATIOS.weaken) / ramWeaken);
      const allocGrow   = Math.floor((freeRam * RATIOS.grow) / ramGrow);
      const allocHack   = Math.floor((freeRam * RATIOS.hack) / ramHack);

      // Initialize memory tracking
      if (!MEM_BOTACTIONS[bot]) {
        MEM_BOTACTIONS[bot] = {grow: null, weaken: null, hack: null};
      }
      // console.log(`[botnet-deploy] MEM init`,{MEM_BOTACTIONS})
      // Launch actions if target changed or script not running
      

      let launched = 0;
      if (allocWeaken > 0) {
        const pid = await actionByMemory(ns, chosen, bot, "weaken", allocWeaken);
        if (pid > 0) launched++;
      }
      if (allocGrow > 0) {
        const pid = await actionByMemory(ns, chosen, bot, "grow", allocGrow);
        if (pid > 0) launched++;
      }
      if (allocHack > 0) {
        const pid = await actionByMemory(ns, chosen, bot, "hack", allocHack);
        if (pid > 0) launched++;
      }

      if (launched > 0) {
        // ns.tprint(`[${bot}] -> ${chosen} (${ns.formatNumber(ns.getServerMaxMoney(chosen))}): launched ${launched}`);
        // console.log(`[botnet-deploy][${bot}] -> ${chosen} (${ns.formatNumber(ns.getServerMaxMoney(chosen))}): launched ${launched}`,{
        //   allocWeaken, allocGrow, allocHack, maxRam,usedRam,freeRam,ramWeaken,ramGrow,ramHack,
        //   // files:await ns.ls(bot)
        // })
      }

      await ns.sleep(20);
    }

    await ns.sleep(scanDelay);
  }
}