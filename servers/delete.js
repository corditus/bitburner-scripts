export async function main(ns) {

let target;

target = ns.args[0];

await ns.killall(target);
await ns.deleteServer(target);
}