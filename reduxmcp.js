import {analyze,getAllHosts} from 'utils/scan'
import {runScript} from 'utils/run'
import {hashingFunction} from 'utils/general'
// import * as someNamespace from 'yourScript.js'
// someNamespace.someFunc() 

const DELAY_TICK = 20;
const DELAY_TICKCYCLE = 1000; //1000;
const TURN_ORDER = ["scan","buy","spread","bots"]
let DEBUG = true
let MEMORY = {
  servers:{
    bots:{},
    targets:{
      all:{},
      primary:""
    },
    byVal:[]
  },
  preferences:{
    mode:"swarm",//swarm,spread
    turns:TURN_ORDER,//[]
  },
  scripts:{
    filenames:[
      "utils/run.js",
      "utils/scan.js",
      "utils/formatting.js"
    ],
    ram:{
      
    },
  },
}

// const Botnet = (ns)=>{
//   // bot:()=>{},
// };
async function Factions(ns,factionName){}
async function Gang(ns){}
async function HacknetNodes(ns){
  return await {
    
  }
}


//Classes for managing botnet
// 

async function Botnet(ns){
  // if(DEBUG)console.log(`[tick] tacking a tick.`);
  return await {
    "server":(botName)=>{
      return {
        hasFiles:(files)=>{
          if(!files)files=MEMORY.scripts.filenames;
          //if files is a string and not array then mk array
          console.log(`[Botnet][server][${botName}] hasFiles`,{files})
          return ns.hasFiles(files,botName);
        },
        getFiles:(files,soureServerName)=>{
          if(!files)files=MEMORY.scripts.filenames;
          return ns.scp(files,botName,soureServerName)
        },
        runScript:(fileName,threads,targetName)=>{
          if(!ns.hasRootAccess(host))return;
          if(Botnet(ns).server(botName).hasFiles([fileName])){Botnet(ns).server(botName).getFiles([fileName]);};
          if(!targetName)targetName=botName;
          if(!threads||threads=="auto"){
            threads = 1
            // const scriptRam = ns.getScriptRam(fileName,botName)
            // const availRam = ns.getAv
            // getServerMaxRam(host)
            // getServerUsedRam(host)
          }
          ns.exec(fileName, botName, threads, targetName, botName);
        },
      };
      // aggregate & assess targets
      // choose targets & assign bots
      // release bots
    },
    "scan":async()=>{
      // scan all servers
      // analyze each server
      //
      //update memory
    },
    // "crawl"
    "buy":async()=>{
      // buy purchaseable programs
      // buy purchaseable servers
      // buy hacker nodes
      // ? buy purchaseable upgrades
      // 
    }
  }
}



async function Tick(ns){
  // if(DEBUG)console.log(`[tick] tacking a tick.`);
  const tickThis = this;
  return await {
    "bot":async(hostName)=>{
      // prep
      const whatIsThis = this;
      console.log(`[Tick][bot] ${hostName}`,{whatIsThis,tickThis})
      let hasFiles = Botnet(ns).server(hostName).hasFiles(MEMORY.scripts.filenames)
      if (!hasFiles)Botnet(ns).server(hostName).getFiles(MEMORY.scripts.filenames);

      // aggregate & assess targets
      // choose targets & assign bots
      // release bots
    },
    "scan":async()=>{
      // scan all servers
      // analyze each server
      //
      //update memory
    },
    // "crawl"
    "buy":async()=>{
      // buy purchaseable programs
      // buy purchaseable servers
      // buy hacker nodes
      // ? buy purchaseable upgrades
      // 
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  /*# Init
    actions that only need to be taken once before turn loop i.e.; launch crawler script
  */
  const flags = ns.flags([
    ["debug",true]
  ])
  DEBUG = flags.debug
  const scriptHost = await ns.getHostname();
  console.log(`[main] initiating reduxmcp`,{
    player:await ns.getPlayer(),
    server:await ns.getServer(),
    hackingLvl:await ns.getHackingLevel(),
    hackingMultipliers:await ns.getHackingMultipliers(),
    moneySources:await ns.getMoneySources(),
    servers:{
      purchased:await ns.getPurchasedServers(),
      limit:await ns.getPurchasedServerLimit()
    },
    hasTor:await ns.hasTorRouter(),
    files: await ns.ls(scriptHost)
  })

  const servers = getAllHosts(ns);
  const analyzedServers = await analyze(ns)
  // for (const server of servers) {
  //   scannedServers
  // };
  console.log(`[main] initial scan`,{
    servers,
    analyzedServers
  })
  // for(const serv )
  /*# Pre-Turn
    actions that only need to be taken once before turn loop i.e.; launch crawler script
  */
  // ns.run(crawler)

  /*# Turn Ticks

  */

  // let ticks = 0;
  let turnIndex = 0
  while(true){
    const turn = MEMORY.preferences.turns[turnIndex]
    // MEMORY.preferences.turns.length 
    // if(DEBUG)console.log(`[main] starting game tick. turn: ${turn}`);
    await Tick(ns)[turn];
    // switch (turn) {
    //   case "scan":
    //     // Code to execute if expression === value1
    //     break;
    //   case "bots":
    //     // Code to execute if expression === value2
    //     break;
    //   // ... more cases
    //   default:
    //     // Code to execute if no case matches
    //     tick(ns)[turn];
    // }

    //setup next turn
    turnIndex++
    if(turnIndex>=MEMORY.preferences.turns.length){
      turnIndex=0
      await ns.sleep(DELAY_TICKCYCLE);
    }else{
      await ns.sleep(DELAY_TICK);
    };
    /* Post-Turn
      stuff that runs after every turn
    */
    // share() spare RAM with faction
  };
  /* Post-Tick
    stuff that runs after every tick
  */
}