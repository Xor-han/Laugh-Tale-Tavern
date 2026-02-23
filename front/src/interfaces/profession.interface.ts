export const Profession = {
  // --- ÉQUIPAGE PIRATE ---
  roi_des_pirates: "roi_des_pirates",
  empereur: "empereur",
  capitaine: "capitaine",
  second: "second",
  navigateur: "navigateur",
  cuisinier: "cuisinier",
  medecin: "medecin",
  tireur_d_elite: "tireur_d_elite",
  charpentier: "charpentier",
  musicien: "musicien",
  archeologue: "archeologue",
  timonier: "timonier",
  mousse: "mousse",
  combattant: "combattant",

  // --- MARINE & GOUVERNEMENT ---
  amiral_en_chef: "amiral_en_chef",
  amiral: "amiral",
  vice_amiral: "vice_amiral",
  contre_amiral: "contre_amiral",
  commodore: "commodore",
  colonel: "colonel",
  lieutenant: "lieutenant",
  enseigne: "enseigne",
  matelot: "matelot",
  agent_du_cp: "agent_du_cp",
  gardien_de_prison: "gardien_de_prison",

  // --- ARMÉE RÉVOLUTIONNAIRE ---
  chef_supreme: "chef_supreme",
  commandant_en_chef: "commandant_en_chef",
  commandant_d_armee: "commandant_d_armee",
  officier_revolutionnaire: "officier_revolutionnaire",
  agent_d_infiltration: "agent_d_infiltration",
  stratege: "stratege",
  inventeur: "inventeur",

  // --- CIVILS & MÉTIERS DU MONDE ---
  tenancier_de_bar: "tenancier_de_bar",
  journaliste: "journaliste",
  scientifique: "scientifique",
  forgeron: "forgeron",
  chasseur_de_primes: "chasseur_de_primes",
  marchand: "marchand",
  roi: "roi",
  reine: "reine",
  prince: "prince",
  princesse: "princesse",
  citoyen: "citoyen",
  pecheur: "pecheur",
  voleur: "voleur",
  esclave: "esclave",

  // --- AUTRES / SPÉCIFIQUES ---
  courtier_de_l_ombre: "courtier_de_l_ombre",
  dragon_celeste: "dragon_celeste"
} as const;

export type ProfessionType = (typeof Profession)[keyof typeof Profession];