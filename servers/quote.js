export async function main(ns) {
	let memorySize;
	let serverCost;
	let memoryPowered;
	for (memorySize = 1; memorySize <= 20; memorySize++) {
		memoryPowered = Math.pow(2, memorySize);
		serverCost = ns.getPurchasedServerCost(memoryPowered);
		ns.tprint("Size: " + ns.nFormat(memorySize, '0,0').padStart(2) + " RAM: " + ns.nFormat(memoryPowered, '0,0').padStart(9) + "GB Cost: " + ns.nFormat(serverCost, '$0.0,0a').padStart(9));
	}
}