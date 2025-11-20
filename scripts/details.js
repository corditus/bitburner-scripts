
const colorLogMsg = (msg, color) => {

  if (!color) return msg
  // const reset = "\u001b[0m";
  const colors = {
    cyan: "\u001b[36m",
    green: "\u001b[32m",
    red: "\u001b[31m",
  };
  let colorHex = colors[color]
  // if(!colors[color]){
  //   colorHex=color
  // }else{
  //   colorHex=colors[color]
  // };

  const colored = `${colorHex}${msg}\u001b[0m` // reset = "\u001b[0m";
  return colored
};
const formatLogMsg = (arg, color) => {
  const formatted = typeof arg === 'object'
    ? JSON.stringify(arg, null, 2)
    : colorLogMsg(arg, color)
  return formatted
};
const logger = {
  // logger.log(`some info`)
  // logger.log({info:"some",more:"somes"})
  log: (ns, args) => {
    // Handle different types and format accordingly
    // const timestamp = new Date().toISOString();
    // const formatted = typeof arg === 'object' 
    //   ? JSON.stringify(arg, null, 2) 
    //   : String(arg);

    // console.log(`[${timestamp}] ${formatted}`);

    ns.tprint(formatLogMsg(args))
  },
  success: (ns, msg) => {
    ns.tprint(formatLogMsg(msg, "green"))
  },
  info: (ns, msg) => {
    ns.tprint(formatLogMsg(msg, "cyan"))
  },
  error: (ns, msg) => {
    // formatLogMsg
    // let printMsg = colorLogMsg(msg,"red") //`${red}printMsg${reset}`
    ns.tprint(formatLogMsg(msg, "red"))
  },
  warn: (ns, msg) => {
    // formatLogMsg
    // let printMsg = colorLogMsg(msg,"red") //`${red}printMsg${reset}`
    ns.tprint(formatLogMsg(msg, "red"))
  }
};
function formatAUD(amount) {
  return amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
}
function cmd_all_servers(ns) {
	let servers = ["home"]
	let result = []
	let i = 0
	while (i < servers.length) {
		let server = servers[i]
		let s = ns.scan(server)
		for (let j in s) {
			let con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
        const serverObj = ns.getServer(con);
				result.push(serverObj)
        // ns.tprint()
        logger.info(ns,`[${con}] server details`)
        ns.tprint(serverObj)
        for (const [key, value] of Object.entries(serverObj)) {
          // console.log(key, value);
          let fkServer={
            "hostname":"megacorp",
            "organizationName":"MegaCorp",
            "ip":"12.0.7.6",
            "purchasedByPlayer":false,
            "hasAdminRights":false,
            "moneyAvailable":57739681141,
            "moneyMax":1443492028525,
            "requiredHackingSkill":1155,
            "ramUsed":0,
            "maxRam":0,
            "sshPortOpen":true,
            "ftpPortOpen":false,
            "smtpPortOpen":false,
            "httpPortOpen":false,
            "sqlPortOpen":false,
            "isConnectedTo":false,
            "cpuCores":12,
            "backdoorInstalled":false,
            "baseDifficulty":99,
            "hackDifficulty":99,
            "minDifficulty":33,
            "numOpenPortsRequired":5,
            "openPortCount":1,
            "serverGrowth":99
            }
          let formattedVal = value
          if(key==="moneyAvailable"||key==="moneyMax")formattedVal = formatAUD(value);
          logger.log(ns,`[${con}] ${key} : ${formattedVal }`)
        }
			}
		}
		i += 1
	}
	return result
}

/** @param {NS} ns **/
export async function main(ns) {
  const flags = ns.flags([
    ['key','all']
  ])
  // const target = ns.args[0];
  // const host = ns.args[1]
  // ns.tprint(`hacking script args:`)
  // ns.tprint(ns.args)
  // const alltargets = ns.get

  // const details = await cmd_all_servers(ns);
  let servers = ["home"]
	let result = []
	let i = 0
	while (i < servers.length) {
		let server = servers[i]
		let s = ns.scan(server)
		for (let j in s) {
			let con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
        const serverObj = ns.getServer(con);
				result.push(serverObj)
        // ns.tprint()
        // logger.info(ns,`[${con}] server details`)
        ns.tprint(serverObj)
        for (const [key, value] of Object.entries(serverObj)) {
          // console.log(key, value);
          let fkServer={
            "hostname":"megacorp",
            "organizationName":"MegaCorp",
            "ip":"12.0.7.6",
            "purchasedByPlayer":false,
            "hasAdminRights":false,
            "moneyAvailable":57739681141,
            "moneyMax":1443492028525,
            "requiredHackingSkill":1155,
            "ramUsed":0,
            "maxRam":0,
            "sshPortOpen":true,
            "ftpPortOpen":false,
            "smtpPortOpen":false,
            "httpPortOpen":false,
            "sqlPortOpen":false,
            "isConnectedTo":false,
            "cpuCores":12,
            "backdoorInstalled":false,
            "baseDifficulty":99,
            "hackDifficulty":99,
            "minDifficulty":33,
            "numOpenPortsRequired":5,
            "openPortCount":1,
            "serverGrowth":99
            }
          let formattedVal = value
          if(!flags.key==="all" && !flags.key===key)continue;
          if(key==="moneyAvailable"||key==="moneyMax")formattedVal = formatAUD(value);
          logger.log(ns,`[${con}] ${key.padStart(9)} : ${formattedVal.padStart(9)}`)
        }
			}
		}
		i += 1
	}
	return result

  // let targets = get_all_servers(ns,);
  // let i = 0;
  // while (i < targets.length) {
  //   const server = targets[i]
  //   ns.getServer(server)
  //   ns.tprint(`${server}:`)
  //   ns.tprint(server)
  // }
  
  // return targets
  // if (!target) { ns.tprint("Usage: run hack.js <target>"); return; }
  // const serv = await ns.getServer(target);
  // ns.tprint(`${target} server details`)
  // ns.tprint(serv)
}


