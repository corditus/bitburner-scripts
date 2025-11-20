export async function hashingFunction(ns,object) {
    return JSON.stringify(object).split("").reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

class Port {
    constructor(ns, portNumber) {
        this.ns = ns;
        this.portNumber = portNumber;
    }
    write(data) {
        this.ns.writePort(this.portNumber, data);
    }
    read() {
        return this.ns.readPort(this.portNumber);
    }
    peek() {
        return this.ns.peekPort(this.portNumber);
    }    
}
export async function main(ns) {

}