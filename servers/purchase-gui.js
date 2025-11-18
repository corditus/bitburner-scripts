export async function main(ns) {
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
    // make a list of choices to select from
    const userChoice = await ns.prompt("Select server size to purchase", {
        type: 'select',
        choices: serverList.map(s => `Size: ${s.size} RAM: ${s.ram}GB Cost: ${ns.nFormat(s.cost, '$0.0,0a')}`),
    })

    const chosenServer = serverList[serverList.findIndex(s => `Size: ${s.size} RAM: ${s.ram}GB Cost: ${ns.nFormat(s.cost, '$0.0,0a')}` === userChoice)];
    //automate quantity of purchases
    // get user money
    // get quantity of userChoice server purchasable with user money


    const purchased = ns.purchaseServer(serverName, chosenServer.ram);
    ns.tprint(`Purchased server: ${purchased}`);
}