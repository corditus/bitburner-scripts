function shuffle(array) {
  // Create a copy to avoid mutating the original
  const shuffled = [...array];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  
  return shuffled;
}
/**
 * Formats a number into an Australian Dollar currency string.
 * @param {number} amount The number to format.
 * @returns {string} The formatted currency string, e.g., "$123,456.78".
 */
function formatAUD(amount) {
  return amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
}

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






/** @param {NS} ns */
export async function main(ns) {
  // Defines the "target server", which is the server
  // that we're going to hack. In this case, it's "n00dles"
  // Parse command-line flags and arguments
  // const flags = ns.flags([
  //   // ['target', 'n00dles'], // --target <hostname>
  //   // ['host','unkown'],
  //   // ['hack', true],
  //   // ['grow', true],
  //   // ['weaken', true],
  //   // ['dry']
  // ]);

  let scan = await ns.scan();
  scan = shuffle(scan);
  //loop scan array of targets and scan each of those ns.scan(target[i])

  for (const target of scan) {
    const moneyThresh = ns.getServerMaxMoney(target);
    const securityThresh = ns.getServerMinSecurityLevel(target);
    if (ns.fileExists("BruteSSH.exe", "home")) {
      ns.brutessh(target);
    }
    const nuke = await ns.nuke(target);
    logger.log(ns, {nuke})
    // Infinite loop that continously hacks/grows/weakens the target server
    while (true) {
      if (ns.getServerSecurityLevel(target) > securityThresh) {
        // If the server's security level is above our threshold, weaken it
        const weaken = await ns.weaken(target);
        //  const executeRunner = await ns.exec("main-runner.js", serv, 12);
        logger.log(ns, {weaken})
      } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
        // If the server's money is less than our threshold, grow it
        const grow = await ns.grow(target);
        logger.log(ns, {grow})
      } else {
        // Otherwise, hack it
        const hack = await ns.hack(target);
        logger.log(ns, {hack})
      }
    }
    // const target = flags.target;//"n00dles";
  };
  // Defines how much money a server should have before we hack it
  // In this case, it is set to the maximum amount of money.

  // Defines the minimum security level the target server can
  // have. If the target's security level is higher than this,
  // we'll weaken it before doing anything else

  // If we have the BruteSSH.exe program, use it to open the SSH Port
  // on the target server

  // Get root access to target server

}