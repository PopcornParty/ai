const PASS="FERRARI1";
const WOODS=["oak","spruce","birch","jungle","acacia","dark oak","mangrove","cherry","pale oak","bamboo","crimson","warped"];
const COLORS=["white","orange","magenta","light blue","yellow","lime","pink","gray","light gray","cyan","purple","blue","brown","green","red","black"];
const TOOLM=["wood","stone","iron","gold","diamond","netherite"];
const NICE={planks:"Planks",cobblestone:"Cobble",stick:"Stick",iron_ingot:"Iron",gold_ingot:"Gold",diamond:"Diamond",netherite_ingot:"Netherite",coal:"Coal",redstone:"Redstone",string:"String",leather:"Leather",paper:"Paper",book:"Book",wheat:"Wheat",apple:"Apple",wool:"Wool",obsidian:"Obsidian",ender_pearl:"Pearl",blaze_powder:"Blaze powder",blaze_rod:"Blaze rod",gunpowder:"Gunpowder",sand:"Sand",chest:"Chest",flint:"Flint",feather:"Feather",bowl:"Bowl",slimeball:"Slime",glass:"Glass",nether_star:"Star",quartz:"Quartz",stone:"Stone"};
function nice(id){return id?(NICE[id]||id.replace(/_/g," ")):""}
const RECIPES=[];
function shaped(out,n,s,m){RECIPES.push({o:out,n:n,s:s,m:m})}
function shapeless(out,n,l){RECIPES.push({o:out,n:n,l:l})}
shaped("crafting table",1,["PP","PP"],{P:"planks"});
shaped("stick",4,["P","P"],{P:"planks"});
shaped("chest",1,["PPP","P P","PPP"],{P:"planks"});
shaped("furnace",1,["CCC","C C","CCC"],{C:"cobblestone"});
shaped("torch",4,["C","S"],{C:"coal",S:"stick"});
shaped("ladder",3,["S S","SSS","S S"],{S:"stick"});
shaped("bowl",4,["P P"," P "],{P:"planks"});
shaped("bucket",1,["I I"," I "],{I:"iron_ingot"});
shaped("shears",1,[" I","I "],{I:"iron_ingot"});
shaped("flint and steel",1,["I "," F"],{I:"iron_ingot",F:"flint"});
shaped("compass",1,[" I ","IRI"," I "],{I:"iron_ingot",R:"redstone"});
shaped("clock",1,[" G ","GRG"," G "],{G:"gold_ingot",R:"redstone"});
shaped("fishing rod",1,["  S"," S#","S #"],{S:"stick","#":"string"});
shaped("bow",1,[" #S","# S"," #S"],{S:"stick","#":"string"});
shaped("arrow",4,["F","S","f"],{F:"flint",S:"stick",f:"feather"});
shaped("shield",1,["PIP","PPP"," P "],{P:"planks",I:"iron_ingot"});
shaped("hopper",1,["I I","ICI"," I "],{I:"iron_ingot",C:"chest"});
shaped("piston",1,["PPP","CIC","CRC"],{P:"planks",C:"cobblestone",I:"iron_ingot",R:"redstone"});
shaped("sticky piston",1,["L","P"],{L:"slimeball",P:"piston"});
shaped("observer",1,["CCC","RRQ","CCC"],{C:"cobblestone",R:"redstone",Q:"quartz"});
shaped("redstone torch",1,["R","S"],{R:"redstone",S:"stick"});
shaped("lever",1,["S","C"],{S:"stick",C:"cobblestone"});
shaped("enchanting table",1,[" B ","DOD","OOO"],{B:"book",D:"diamond",O:"obsidian"});
shaped("brewing stand",1,[" B ","CCC"],{B:"blaze_rod",C:"cobblestone"});
shaped("cauldron",1,["I I","I I","III"],{I:"iron_ingot"});
shaped("beacon",1,["GGG","GNG","OOO"],{G:"glass",N:"nether_star",O:"obsidian"});
shaped("ender chest",1,["OOO","OEO","OOO"],{O:"obsidian",E:"ender_eye"});
shaped("bookshelf",1,["PPP","BBB","PPP"],{P:"planks",B:"book"});
shaped("jukebox",1,["PPP","PDP","PPP"],{P:"planks",D:"diamond"});
shaped("anvil",1,["BBB"," I ","III"],{B:"iron_block",I:"iron_ingot"});
shaped("tnt",1,["GSG","SGS","GSG"],{G:"gunpowder",S:"sand"});
shaped("minecart",1,["I I","III"],{I:"iron_ingot"});
shaped("rail",16,["I I","ISI","I I"],{I:"iron_ingot",S:"stick"});
shaped("golden apple",1,["GGG","GAG","GGG"],{G:"gold_ingot",A:"apple"});
shaped("golden carrot",1,["NNN","NCN","NNN"],{N:"gold_nugget",C:"carrot"});
shapeless("ender eye",1,["ender_pearl","blaze_powder"]);
shapeless("book",1,["paper","paper","paper","leather"]);
shapeless("paper",3,["sugar_cane","sugar_cane","sugar_cane"]);
shapeless("bread",1,["wheat","wheat","wheat"]);
shapeless("mushroom stew",1,["red_mushroom","brown_mushroom","bowl"]);
WOODS.forEach(w=>{
  shaped(w+" planks",4,[w==="bamboo"?"BB":"L"],{L:w+" log",B:w+" block"});
  shaped(w+" stairs",4,["P  ","PP ","PPP"],{P:w+" planks"});
  shaped(w+" slab",6,["PPP"],{P:w+" planks"});
  shaped(w+" door",3,["PP","PP","PP"],{P:w+" planks"});
  shaped(w+" trapdoor",2,["PPP","PPP"],{P:w+" planks"});
  shaped(w+" fence",3,["PSP","PSP"],{P:w+" planks",S:"stick"});
  shaped(w+" fence gate",1,["SPS","SPS"],{P:w+" planks",S:"stick"});
  shaped(w+" sign",3,["PPP","PPP"," S "],{P:w+" planks",S:"stick"});
  shaped(w+" boat",1,["P P","PPP"],{P:w+" planks"});
  shaped(w+" pressure plate",1,["PP"],{P:w+" planks"});
  shaped(w+" button",1,["P"],{P:w+" planks"});
});
const MAT={wood:"planks",stone:"cobblestone",iron:"iron_ingot",gold:"gold_ingot",diamond:"diamond",netherite:"netherite_ingot"};
TOOLM.forEach(m=>{const I=MAT[m];
  shaped(m+" sword",1,["M","M","S"],{M:I,S:"stick"});
  shaped(m+" pickaxe",1,["MMM"," S "," S "],{M:I,S:"stick"});
  shaped(m+" axe",1,["MM","MS"," S"],{M:I,S:"stick"});
  shaped(m+" shovel",1,["M","S","S"],{M:I,S:"stick"});
  shaped(m+" hoe",1,["MM"," S"," S"],{M:I,S:"stick"});
});
["leather","iron","gold","diamond"].forEach(m=>{
  const I=m==="leather"?"leather":m==="iron"?"iron_ingot":m==="gold"?"gold_ingot":"diamond";
  shaped(m+" helmet",1,["MMM","M M"],{M:I});
  shaped(m+" chestplate",1,["M M","MMM","MMM"],{M:I});
  shaped(m+" leggings",1,["MMM","M M","M M"],{M:I});
  shaped(m+" boots",1,["M M","M M"],{M:I});
});
COLORS.forEach(c=>{shaped(c+" bed",1,["WWW","PPP"],{W:c+" wool",P:"planks"});shaped(c+" carpet",3,["WW"],{W:c+" wool"});shaped(c+" banner",1,["WWW","WWW"," S "],{W:c+" wool",S:"stick"});});
["iron","gold","diamond","emerald","coal","redstone","lapis","netherite"].forEach(x=>{shaped(x+" block",1,["XXX","XXX","XXX"],{X:x==="lapis"?"lapis":x==="netherite"?"netherite_ingot":x==="iron"?"iron_ingot":x==="gold"?"gold_ingot":x});shapeless(x==="iron"?"iron ingot":x==="gold"?"gold ingot":x==="netherite"?"netherite ingot":x,9,[x+" block"]);});
const PICK={fist:1,wood:2,stone:4,iron:6,gold:12,diamond:8,netherite:9};
function mineSec(h,tool,can){if(h<0)return "unbreakable";const spd=can?PICK[tool]:1;const t=(1.5*h)/spd;if(t<=0.05&&can)return "instant";return (Math.round(t*100)/100)+"s";}
function canPick(need,tool){const order={fist:0,wood:1,stone:2,iron:3,gold:2,diamond:4,netherite:4};if(need===0)return tool!=="fist";return order[tool]>=need;}
const TIER=["fist","wood","stone","iron","diamond","netherite","gold"];
const BLOCKS=[["Stone",1.5,"pick",1],["Cobblestone",2,"pick",1],["Granite",1.5,"pick",1],["Diorite",1.5,"pick",1],["Andesite",1.5,"pick",1],["Deepslate",3,"pick",1],["Cobbled deepslate",3,"pick",1],["Dirt",0.5,"shovel",1],["Grass block",0.6,"shovel",1],["Sand",0.5,"shovel",1],["Gravel",0.6,"shovel",1],["Clay",0.6,"shovel",1],["Oak log",2,"axe",1],["Spruce log",2,"axe",1],["Birch log",2,"axe",1],["Oak planks",2,"axe",1],["Crafting table",2.5,"axe",1],["Chest",2.5,"axe",1],["Coal ore",3,"pick",1],["Iron ore",3,"pick",2],["Copper ore",3,"pick",2],["Gold ore",3,"pick",3],["Redstone ore",3,"pick",3],["Lapis ore",3,"pick",2],["Diamond ore",3,"pick",3],["Emerald ore",3,"pick",3],["Ancient debris",30,"pick",4],["Obsidian",50,"pick",4],["Crying obsidian",50,"pick",4],["Netherrack",0.4,"pick",1],["Soul sand",0.5,"shovel",1],["Glowstone",0.3,"any",1],["End stone",3,"pick",1],["Glass",0.3,"any",0],["Wool",0.8,"shears",1],["Concrete",1.8,"pick",1],["Iron block",5,"pick",2],["Gold block",3,"pick",3],["Diamond block",5,"pick",3],["Netherite block",50,"pick",4],["Sculk",0.2,"hoe",1],["Bedrock",-1,"none",0],["Spawner",5,"pick",1],["Enchanting table",5,"pick",1],["Anvil",5,"pick",1],["Hopper",3,"pick",2],["TNT",0,"any",1],["Leaves",0.2,"shears",1],["Cobweb",4,"sword",1],["Ice",0.5,"pick",1],["Blue ice",2.8,"pick",1],["Magma block",0.5,"pick",1],["Blackstone",1.5,"pick",1],["Basalt",1.25,"pick",1],["Respawn anchor",50,"pick",4],["Reinforced deepslate",55,"none",0],["Sandstone",0.8,"pick",1],["Bricks",2,"pick",1],["Netherrack",0.4,"pick",1],["End stone bricks",3,"pick",1],["Amethyst block",1.5,"pick",1],["Budding amethyst",1.5,"pick",0],["Lantern",3.5,"pick",1],["Campfire",2,"axe",1],["Mud",0.5,"shovel",1],["Farmland",0.6,"shovel",1]];
const ITEMS=[["Stick","stack 64","Used in almost every tool."],["Coal","stack 64","Smelts 8 items. Crafts torches."],["Diamond","stack 64","Armor, tools, enchanting table."],["Iron ingot","stack 64","Armor, tools, rails, hoppers, buckets."],["Gold ingot","stack 64","Clocks, powered rails, golden apples."],["Netherite ingot","stack 64","Upgrade diamond gear. Fireproof."],["Emerald","stack 64","Villager currency."],["Redstone dust","stack 64","Power and machines."],["Lapis lazuli","stack 64","Enchanting fuel and blue dye."],["Ender pearl","stack 16","Teleport. Crafts ender eyes."],["Blaze rod","stack 64","Fuel and brewing stands."],["Gunpowder","stack 64","TNT and fireworks."],["String","stack 64","Bows, fishing rods, wool."],["Leather","stack 64","Books and leather armor."],["Arrow","stack 64","Bow ammo."],["Wheat","stack 64","Bread and breeding."],["Bread","stack 64","Restores 5 hunger."],["Apple","stack 64","Crafts golden apples."],["Golden apple","stack 64","Absorption and regen."],["Enchanted golden apple","stack 64","Not crafted in modern survival."],["Elytra","stack 1","End ship item frame. Repair with membrane."],["Totem of undying","stack 1","Evoker drop. Saves you once."],["Trident","stack 1","Drowned drop."],["Bow","stack 1","Power, Punch, Flame, Infinity or Mending."],["Crossbow","stack 1","Quick Charge, Multishot, Piercing."],["Shield","stack 1","Blocks melee and arrows."],["Name tag","stack 64","Stops mob despawn."],["Saddle","stack 1","Not crafted."],["Phantom membrane","stack 64","Repair elytra."],["Nether star","stack 64","Wither drop. Beacon."],["Shulker shell","stack 64","Shulker boxes."],["Slimeball","stack 64","Sticky pistons and leads."]];
const ARMOR=[["Leather helmet","1","0","0","55","leather"],["Leather chestplate","3","0","0","80","leather"],["Leather leggings","2","0","0","75","leather"],["Leather boots","1","0","0","65","leather"],["Chainmail helmet","2","0","0","165","iron"],["Chainmail chestplate","5","0","0","240","iron"],["Chainmail leggings","4","0","0","225","iron"],["Chainmail boots","1","0","0","195","iron"],["Iron helmet","2","0","0","165","iron"],["Iron chestplate","6","0","0","240","iron"],["Iron leggings","5","0","0","225","iron"],["Iron boots","2","0","0","195","iron"],["Gold helmet","2","0","0","77","gold"],["Gold chestplate","5","0","0","112","gold"],["Gold leggings","3","0","0","105","gold"],["Gold boots","1","0","0","91","gold"],["Diamond helmet","3","2","0","363","diamond"],["Diamond chestplate","8","2","0","528","diamond"],["Diamond leggings","6","2","0","495","diamond"],["Diamond boots","3","2","0","429","diamond"],["Netherite helmet","3","3","0.1","407","netherite"],["Netherite chestplate","8","3","0.1","592","netherite"],["Netherite leggings","6","3","0.1","555","netherite"],["Netherite boots","3","3","0.1","481","netherite"],["Turtle helmet","2","0","0","275","scute"],["Elytra","0","0","0","432","phantom membrane"]];
const ENCH=[["Protection","IV","armor","Cuts most damage."],["Fire Protection","IV","armor","Fire and lava."],["Blast Protection","IV","armor","Explosions."],["Projectile Protection","IV","armor","Arrows and fireballs."],["Feather Falling","IV","boots","Fall damage."],["Respiration","III","helmet","Longer breath."],["Aqua Affinity","I","helmet","Mine faster underwater."],["Thorns","III","armor","Damages attackers."],["Depth Strider","III","boots","Faster in water."],["Frost Walker","II","boots","Ice underfoot."],["Soul Speed","III","boots","Faster on soul blocks."],["Swift Sneak","III","leggings","Faster sneaking. Ancient city."],["Sharpness","V","sword axe","Extra melee damage."],["Smite","V","sword axe","Undead damage."],["Bane of Arthropods","V","sword axe","Spiders and bugs."],["Knockback","II","sword","Pushes mobs."],["Fire Aspect","II","sword","Sets targets on fire."],["Looting","III","sword","More mob drops."],["Sweeping Edge","III","sword","Java sweep. Not Bedrock."],["Efficiency","V","tools","Mine faster."],["Silk Touch","I","tools","Block drops itself."],["Fortune","III","tools","More ore drops."],["Unbreaking","III","most gear","Ignores some durability use."],["Mending","I","most gear","XP repairs the item."],["Power","V","bow","More arrow damage."],["Punch","II","bow","Arrow knockback."],["Flame","I","bow","Burning arrows."],["Infinity","I","bow","Arrows not consumed. Conflicts with Mending."],["Multishot","I","crossbow","Three shots. Conflicts with Piercing."],["Piercing","IV","crossbow","Goes through mobs."],["Quick Charge","III","crossbow","Faster reload."],["Loyalty","III","trident","Returns. Conflicts with Riptide."],["Channeling","I","trident","Lightning in storms."],["Riptide","III","trident","Dash in water or rain."],["Impaling","V","trident","Extra water-mob damage."],["Luck of the Sea","III","rod","Better treasure."],["Lure","III","rod","Faster bites."],["Curse of Binding","I","armor","Cannot take off."],["Curse of Vanishing","I","any","Gone on death."]];
function talk(raw){
  const q=String(raw).toLowerCase();
  if(/^(hi|hey|hello|yo|sup)$/.test(q.trim())) return "Use the tabs: Craft, Blocks, Items, Armor, Enchants.";
  if(/axolotl/.test(q)&&/rare|chance|odds/.test(q)) return "Blue axolotls do not spawn in the wild. Breeding two axolotls gives a blue baby 1 time in 1200.";
  if(/axolotl/.test(q)) return "Axolotls live in lush-cave water. Blue is 1 in 1200 from breeding.";
  if(/elytra/.test(q)&&/ah|price|cost/.test(q)) return "Donut AH elytra have been around 450M-480M lately. Check /ah search elytra.";
  if(/discord/.test(q)) return "Official Discord is discord.gg/donutsmp.";
  if(/port|bedrock|xbox|phone/.test(q)) return "Bedrock: donutsmp.net port 19132.";
  if(/\bip\b/.test(q)) return "The IP is donutsmp.net.";
  const b=BLOCKS.find(x=>q.includes(x[0].toLowerCase()));
  if(b) return b[0]+" hardness "+b[1]+". Best tool: "+b[2]+". Diamond pick: "+mineSec(b[1],"diamond",b[2]==="pick"?canPick(b[3],"diamond"):true)+".";
  const a=ARMOR.find(x=>q.includes(x[0].toLowerCase()));
  if(a) return a[0]+": "+a[1]+" armor, "+a[2]+" toughness, "+a[3]+" knockback resist, "+a[4]+" durability.";
  const e=ENCH.find(x=>q.includes(x[0].toLowerCase()));
  if(e) return e[0]+" "+e[1]+" on "+e[2]+". "+e[3];
  const it=ITEMS.find(x=>q.includes(x[0].toLowerCase()));
  if(it) return it[0]+" ("+it[1]+"). "+it[2];
  return "Try the Blocks, Items, Armor, or Enchants tab.";
}
const log=document.getElementById("log");
function add(role,text){const el=document.createElement("div");el.className="msg "+role;el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight}
document.getElementById("st").textContent=RECIPES.length+" recipes • "+BLOCKS.length+" blocks • "+ITEMS.length+" items • "+ARMOR.length+" armor • "+ENCH.length+" enchants";
add("bot","Open Craft for recipes. Blocks has break times. Armor and Enchants have stats.");
document.getElementById("f").onsubmit=e=>{e.preventDefault();const q=document.getElementById("q").value.trim();if(!q)return;document.getElementById("q").value="";add("user",q);add("bot",talk(q));};
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("on"));document.querySelectorAll(".pane").forEach(x=>x.classList.remove("on"));b.classList.add("on");document.getElementById(b.dataset.tab).classList.add("on");});
const grid=Array(9).fill(""); let hand="";
const gEl=document.getElementById("g");
function drawGrid(){gEl.innerHTML="";grid.forEach((v,i)=>{const d=document.createElement("button");d.type="button";d.className="slot"+(v?" on":"");d.textContent=nice(v)||v;d.onclick=()=>{grid[i]=hand||"";drawGrid();detect();};gEl.appendChild(d);});}
function detect(){const out=document.getElementById("out");for(const r of RECIPES){if(r.l){if(r.l.slice().sort().join(",")===grid.filter(Boolean).slice().sort().join(",")){out.textContent=r.o+(r.n>1?" x"+r.n:"");return;}}else if(r.s){const cells=[];for(let y=0;y<3;y++){const row=((r.s[y]||"")+"   ").slice(0,3);for(let x=0;x<3;x++){const ch=row[x];cells.push(ch===" "?"":(r.m[ch]||""));}}if(cells.every((c,i)=>c===grid[i])){out.textContent=r.o+(r.n>1?" x"+r.n:"");return;}}}out.textContent=grid.some(Boolean)?"No match":"?";}
function showRecipe(r){grid.fill("");if(r.l)r.l.forEach((it,i)=>{if(i<9)grid[i]=it});else if(r.s)r.s.forEach((row,y)=>{for(let x=0;x<3;x++){const ch=(row+"   ")[x];if(ch&&ch!==" ")grid[y*3+x]=r.m[ch];}});drawGrid();detect();}
["planks","cobblestone","stick","iron_ingot","gold_ingot","diamond","coal","redstone","string","leather","book","wool","sand","gunpowder","ender_pearl","blaze_powder","obsidian","wheat","apple"].forEach(k=>{const b=document.createElement("button");b.type="button";b.textContent=nice(k);b.onclick=()=>{hand=hand===k?"":k;[...document.getElementById("pal").children].forEach(x=>x.style.outline="");if(hand)b.style.outline="2px solid var(--yes)";};document.getElementById("pal").appendChild(b);});
function renderRecipes(filter){const box=document.getElementById("rlist");box.innerHTML="";const f=(filter||"").toLowerCase();const hits=RECIPES.filter(r=>!f||r.o.includes(f));document.getElementById("rcnt").textContent=hits.length+" / "+RECIPES.length+" recipes";hits.slice(0,80).forEach(r=>{const b=document.createElement("button");b.type="button";b.textContent=r.o+(r.n>1?" x"+r.n:"");b.onclick=()=>showRecipe(r);box.appendChild(b);});}
renderRecipes("");document.getElementById("rs").oninput=e=>renderRecipes(e.target.value);
document.getElementById("clearG").onclick=()=>{grid.fill("");hand="";drawGrid();detect();};drawGrid();
function renderBlocks(filter){const box=document.getElementById("blist");box.innerHTML="";const f=(filter||"").toLowerCase();BLOCKS.filter(b=>!f||b[0].toLowerCase().includes(f)).forEach(b=>{const d=document.createElement("div");d.className="card";const rows=TIER.map(t=>"<tr><td>"+t+" pick</td><td>"+mineSec(b[1],t,b[2]==="pick"?canPick(b[3],t):(t==="fist"?false:true))+"</td></tr>").join("");d.innerHTML="<b>"+b[0]+"</b><div class=hint>Hardness "+b[1]+" • tool: "+b[2]+"</div><table><tr><th>Tool</th><th>Break time</th></tr>"+rows+"</table>";box.appendChild(d);});}
renderBlocks("");document.getElementById("bs").oninput=e=>renderBlocks(e.target.value);
function renderItems(filter){const box=document.getElementById("ilist");box.innerHTML="";const f=(filter||"").toLowerCase();ITEMS.filter(i=>!f||i.join(" ").toLowerCase().includes(f)).forEach(i=>{const d=document.createElement("div");d.className="card";d.innerHTML="<b>"+i[0]+"</b><div class=hint>"+i[1]+"</div>"+i[2];box.appendChild(d);});}
renderItems("");document.getElementById("is").oninput=e=>renderItems(e.target.value);
function renderArmor(filter){const box=document.getElementById("alist");box.innerHTML="";const f=(filter||"").toLowerCase();ARMOR.filter(a=>!f||a[0].toLowerCase().includes(f)||a[5].includes(f)).forEach(a=>{const d=document.createElement("div");d.className="card";d.innerHTML="<b>"+a[0]+"</b>Armor "+a[1]+" • toughness "+a[2]+" • KB resist "+a[3]+"<br>Durability "+a[4]+" • repair with "+a[5];box.appendChild(d);});}
renderArmor("");document.getElementById("as").oninput=e=>renderArmor(e.target.value);
function renderEnch(filter){const box=document.getElementById("elist");box.innerHTML="";const f=(filter||"").toLowerCase();ENCH.filter(e=>!f||e.join(" ").toLowerCase().includes(f)).forEach(e=>{const d=document.createElement("div");d.className="card";d.innerHTML="<b>"+e[0]+" "+e[1]+"</b><div class=hint>"+e[2]+"</div>"+e[3];box.appendChild(d);});}
renderEnch("");document.getElementById("es").oninput=e=>renderEnch(e.target.value);
const mask=document.getElementById("mask"),panel=document.getElementById("panel");
document.getElementById("devBtn").onclick=()=>{mask.style.display="block";panel.style.display="block"};
function closeP(){mask.style.display="none";panel.style.display="none"}
document.getElementById("close1").onclick=closeP;document.getElementById("close2").onclick=closeP;mask.onclick=closeP;
document.getElementById("unlock").onclick=()=>{if(document.getElementById("devPass").value!==PASS){document.getElementById("err").textContent="Wrong password.";return}document.getElementById("tools").style.display="block"};
document.getElementById("clearChat").onclick=()=>{log.innerHTML="";add("bot","Chat cleared.");};
