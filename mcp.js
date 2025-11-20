/** 
 * @param {NS} ns 
 **/



const SEC_DIF = 5
const MON_PERC = 0.5
const SLEEP_TIME = 1
let SERVERS = {
	"crush-fitness": { "action": null, "servers": ["CSEC"] }, // 0 B
	"johnson-ortho": { "action": null, "servers": ['avmnite-02h'] }, // 0 B
	"computek": { "action": null, "servers": ["I.I.I.I"] }, // 0 B
	"snap-fitness": { "action": null, "servers": ["run4theh111z"] }, // 0 B
	"syscore": { "action": null, "servers": [] }, // 0 B TODO: change to serv0
	"applied-energetics": { "action": null, "servers": [] }, // 0 B
	"4sigma": { "action": null, "servers": [] }, // 0 B
	"fulcrumassets": { "action": null, "servers": [] },
	"nwo": { "action": null, "servers": [] },
}
let MEMORY = {
  "servername":{
    "action":null,
    "memoryHash":null,//a hash made at last memory change, check against to prove memory edit
  },
};
const EXECUTE_SCRIPT = "scripts/execute.js"

function disable_logs(ns) {
	let logs = ["scan", "run", 'getServerSecurityLevel', 'getServerMoneyAvailable', 'getServerMoneyAvailable', 'getServerMaxMoney', 'getServerMinSecurityLevel']
	for (let i in logs) {
		ns.disableLog(logs[i])
	}
}

function get_action(ns, host) {
	let actions = ns.ps(host)
	if (actions.length == 0) {
		ns.print(host, " has no scripts.")
		return null
	}
	return actions[0].filename.replace("scripts/", "").replace(".js", "")
}

function get_all_servers(ns) {
	let servers = ["home"]
  // get purchased servers at add to array
  // const purchasedServers = ns.getPurchasedServers(); //string[]
  // .concat(purchasedServers)
  // servers
	let result = []
	let i = 0
	while (i < servers.length) {
		let server = servers[i]
		let s = ns.scan(server)
		for (let j in s) {
			let con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
				result.push(con)
			}
		}
		i += 1
	}
	return result
}

function getAllHosts(ns) {
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

function updateMemory_servers(ns, SERVERS) {
	let all_servers = getAllHosts(ns); //get_all_servers(ns)
	for (let i in all_servers) {
		let server = all_servers[i]
		if (parseInt(ns.getServerMaxMoney(server)) == 0) { 
      // ? check if server can hold? why? it will skip purchased servers
			ns.print(`Skipping ${server}`)
			continue 
		}
		SERVERS[server] = { "action": null, "servers": [] }
		SERVERS[server]["action"] = get_action(ns, server)
	}
}

function determine_action(ns, server){	
	let money = ns.getServerMoneyAvailable(server)	
	let mon_perc = money / ns.getServerMaxMoney(server)	
	let sec_dif = ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server)	
	// determine action	
	if (sec_dif >= SEC_DIF) { return "weaken" }	
	else if (mon_perc < MON_PERC) { return "grow" }	
	else { return "hack" }
}


async function executeAction(ns, action, target, bot){
					const _pid = ns.run(EXECUTE_SCRIPT, 1, action, target, bot);
					await ns.sleep(500)
          return _pid
};


async function botBatchExecuteAction(ns, action, targetServer, bots){
  for (let i in bots) {
          let bot = bots[i]
          // run executor on servers 
          executeAction(ns,action, targetServer, bot)
				}
}

async function targetAction(ns, action, target){
  // if (!ns.hasRootAccess(target)) {
  //   ns.print(`No root access for ${target}.`)
  //   return 
  // } else {
    // const MEMORY_SERVER = SERVERS[target]
    if (SERVERS[target]["action"] != action) {
      SERVERS[target]["action"] = action
      // MEMORY_SERVER = action

      await executeAction(ns,action, target, target)
      const bots = SERVERS[target]["servers"]
      await botBatchExecuteAction(ns,action,target,bots)
      // dedicated, named servers for target
      // if (ns.serverExists(server + "-serv")) {
      // ns.run(EXECUTE_SCRIPT, 1, action, server, server + "-serv")
      // }
    } else {
      ns.print(`No action taken for ${target}. ${SERVERS[target]["action"]} == ${action}`)
    }        
  // };
};



function sortTargetsByVal(ns,hosts){
  const targetArg = "auto"//ns.args[0]; // optional target hostname or "auto"
    // build candidate target list if "auto" or unspecified
    let targets = [];
    if (!targetArg || targetArg === "auto") {
      // pick all servers with money > 0 (and you can nuke if needed)
      for (const h of hosts) {
        if (ns.getServerMaxMoney(h) > 0) targets.push(h);
      }
      // sort by max money desc so bots attack juicy targets first
      targets.sort((a,b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));
    } else {
      targets = [targetArg];
    }


return targets
};

/** 
 * @param {NS} ns 
**/
export async function main(ns) {
	disable_logs(ns)
	updateMemory_servers(ns, SERVERS) // updates memory state for mcp
  // creates SERVERS array populated with empty ().servers[]
  
  // let targets = []
  // let bots = []

	while (true) {
    // playbook ticks
    
    /* Manage targets for botnet
    */
    
    // get next most val target
    // const 
    
    const targets = await sortTargetsByVal(ns,Object.keys(SERVERS))
    // await ns.tprint(`[mcp] targets: ${targets}`)
    console.log(`[mcp] targets: ${targets}`)
		for (let i in targets) {//SERVERS
      const target = targets[i]
    // for (let target in targets) {
      // skip if target has no root (? can also target non-root devices)
      
      // await ns.tprint(`[mcp] targetting: ${target}`)
      console.log(`[mcp] targetting: ${target}`)
			if (!ns.hasRootAccess(target)) {
				continue
			}
    
			let action = determine_action(ns, target)
			// execute action if the current action is different.
			await targetAction(ns, action, target)
      // if (SERVERS[server]["action"] != action) {
			// 	SERVERS[server]["action"] = action
      //   executeAction(ns,action, server, bot)
      //   const bots = SERVERS[server]["servers"]
      //   botBatchExecuteAction(ns,action,server,bots)
      //   // dedicated, named servers for target
			// 	// if (ns.serverExists(server + "-serv")) {
			// 	// ns.run(EXECUTE_SCRIPT, 1, action, server, server + "-serv")
			// 	// }
			// } else {
			// 	ns.print(`No action taken for ${server}. ${SERVERS[server]["action"]} == ${action}`)
			// }
		}
		await ns.sleep(60000 * SLEEP_TIME)
	}
}