export interface FactCard {
  id: string;
  title: string;
  tags: string[];
  body: string;
}

export const FACTS: FactCard[] = [
  {
    id: "donut-what",
    title: "What DonutSMP is",
    tags: ["donut", "donutsmp", "smp", "server", "what", "about"],
    body: `DonutSMP is a public Minecraft Survival Multiplayer server owned by the American creator DrDonutt (often written DrDonut). It is a semi-anarchy SMP: grinding, trading, PvP, raiding, stealing, and griefing are part of the game mode. Java and Bedrock players share the same world (crossplay).`,
  },
  {
    id: "join",
    title: "How to join DonutSMP",
    tags: ["join", "ip", "port", "java", "bedrock", "xbox", "playstation", "switch", "mobile", "address"],
    body: `Official address: **donutsmp.net**\n\n- Java: Multiplayer → Add Server → Server Address \`donutsmp.net\` (default port 25565).\n- Bedrock / Pocket / consoles: \`donutsmp.net\` port **19132**.\n- Cracked launchers are not allowed.\n- Official how-to: https://www.youtube.com/watch?v=mPbVIS5wL6A`,
  },
  {
    id: "discord-official",
    title: "Official DonutSMP Discord",
    tags: ["discord", "official", "invite", "ticket", "ban", "appeal", "market"],
    body: `Official Discord invite: **https://discord.gg/donutsmp**\nCreated April 7, 2017. Used for chat, tickets, news, and in-game item trading talk.\nNever share passwords or login codes. Do not trade real money.`,
  },
  {
    id: "discord-others",
    title: "Other DonutSMP-related Discords",
    tags: ["discord", "fan", "community", "unofficial", "market"],
    body: `Start at https://discord.gg/donutsmp. Any other Donut Discord is unofficial unless official staff links it. Fan and market Discords change often and are easy scam targets.`,
  },
  {
    id: "economy",
    title: "DonutSMP economy",
    tags: ["money", "shards", "economy", "shop", "auction", "ah"],
    body: `Money is the main currency. Shards buy premium shard / amethyst items. Auction House and player trades are the usual markets. Commands change — check /help and Discord announcements.`,
  },
];

const OFF_TOPIC =
  "I only answer Minecraft and DonutSMP questions (including Donut Discords). Ask me something in that world.";

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+#/.\\s-]/g, " ").replace(/\\s+/g, " ").trim();
}

function isOnTopic(q: string) {
  const n = normalize(q);
  if (!n) return true;
  const hits = ["minecraft", "mc", "donut", "smp", "discord", "drdonut", "java", "bedrock", "creeper", "diamond", "nether", "redstone", "spawner", "shard", "pvp", "server", "ip", "join", "raid", "base", "mob"];
  if (hits.some((h) => n.includes(h))) return true;
  if (/^(hi|hey|hello|yo|sup|help|what can you do|who are you)\\b/.test(n)) return true;
  return false;
}

export function answerDonut(question: string): string {
  const q = question.trim() || "What is DonutSMP?";
  if (!isOnTopic(q)) return OFF_TOPIC;
  const n = normalize(q);
  if (/^(hi|hey|hello|yo|sup)\\b/.test(n)) {
    return "Hey. I only talk Minecraft and DonutSMP. Try asking how to join, what shards are, or what the official Discord is.";
  }
  const ranked = FACTS.map((c) => {
    let s = 0;
    for (const tag of c.tags) if (n.includes(tag)) s += 2;
    return { c, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  if (!ranked.length) {
    return "IP: **donutsmp.net**. Bedrock port: **19132**. Official Discord: https://discord.gg/donutsmp";
  }
  return ranked.slice(0, 3).map((x) => `### ${x.c.title}\n${x.c.body}`).join("\n\n");
}

export async function streamExpert(question: string, onDelta: (text: string) => void, signal?: AbortSignal) {
  const text = answerDonut(question);
  const chunks = text.split(/(\s+)/);
  for (const chunk of chunks) {
    if (signal?.aborted) return;
    onDelta(chunk);
    await new Promise((r) => setTimeout(r, 8));
  }
}
