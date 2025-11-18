export async function main(ns) {
    const player = ns.getPlayer();
    const flags = ns.flags([
        ['budget', player.money],
    // ['target', 'n00dles'], // --target <hostname>
    // ['host','unkown'],
    // ['hack', true],
    // ['grow', true],
    // ['weaken', true],
    // ['dry']
  ]);
  const budget = flags.budget;
  console.log(`[purchase-gui] budget: ${ns.nFormat(flags.budget,'$0.0,0a')}`,{
    flags,
    player
  })
	let memorySize;
    let serverName;
	let memoryPowered;
	let serverCost;
    serverName = "thx";//ns.args[0]
    // memorySize = ns.args[1]
    let serverList = [];
	for (memorySize = 1; memorySize <= 20; memorySize++) {
		memoryPowered = Math.pow(2, memorySize);
		serverCost = ns.getPurchasedServerCost(memoryPowered);
		ns.tprint("Size: " + ns.nFormat(memorySize, '0,0').padStart(2) + " RAM: " + ns.nFormat(memoryPowered, '0,0').padStart(9) + "GB Cost: " + ns.nFormat(serverCost, '$0.0,0a').padStart(9));
        serverList.push({
            size: memorySize,
            ram: memoryPowered,
            cost: serverCost
        });
	}
    //find most expensive node user can afford
    const mostExpensivePurchasable = (budget,serverList) => {
        let affordableServers = serverList.filter(s => s.cost <= budget);
        if (affordableServers.length === 0) {
            return null;
        }
        return affordableServers.reduce((prev, current) => (prev.cost > current.cost) ? prev : current);
    }
    const defaultServer = mostExpensivePurchasable(budget,serverList);

    const serverFormatted = (size, ram, cost) => {
        return `Size: ${size} RAM: ${ram}GB Cost: ${ns.nFormat(cost, '$0.0,0a')}`;
    }
    // make a list of choices to select from
    const userChoice = await ns.prompt("Select server size to purchase", {
        type: 'select',
        choices: serverList.map(s => serverFormatted(s.size,s.ram,s.cost)),
        // default: serverFormatted(defaultServer.size,defaultServer.ram,defaultServer.cost)
    });
    //find chosen server from userChoice
    const chosenServer = serverList.find(s => serverFormatted(s.size,s.ram,s.cost) === userChoice);

    //automate quantity of purchases
    // get user money
    // get quantity of userChoice server purchasable with user money
    const userMoney = budget;
    const maxPurchasable = Math.floor(userMoney / chosenServer.cost);
    // const maxServers = ns.getPurchasedServerLimit() - ns.getPurchasedServers().length;
    const quantityToPurchase = await ns.prompt(`You can afford ${maxPurchasable} of these servers. How many would you like to purchase?`, {
        type: 'text',
        default: maxPurchasable
    });

    for (let i = 0; i < quantityToPurchase; i++) {
        const purchased = ns.purchaseServer(serverName, chosenServer.ram);
        ns.tprint(`Purchased server: ${purchased}`);
    }

}