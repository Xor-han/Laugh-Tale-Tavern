import { Profession,type ProfessionType } from "../interfaces/profession.interface";


export interface ProfessionOption {
  value: ProfessionType;
  label: string;
  category: string;
}

export const PROFESSION_OPTIONS: ProfessionOption[] = [
  // --- ÉQUIPAGE PIRATE ---
  { value: Profession.roi_des_pirates, label: "👑 Roi des Pirates", category: "Pirate" },
  { value: Profession.empereur, label: "⚓ Empereur (Yonko)", category: "Pirate" },
  { value: Profession.capitaine, label: "Capitaine", category: "Pirate" },
  { value: Profession.second, label: "Second", category: "Pirate" },
  { value: Profession.navigateur, label: "Navigateur", category: "Pirate" },
  { value: Profession.cuisinier, label: "Cuisinier", category: "Pirate" },
  { value: Profession.medecin, label: "Médecin", category: "Pirate" },
  { value: Profession.tireur_d_elite, label: "Tireur d'élite", category: "Pirate" },
  { value: Profession.charpentier, label: "Charpentier", category: "Pirate" },
  { value: Profession.musicien, label: "Musicien", category: "Pirate" },
  { value: Profession.archeologue, label: "Archéologue", category: "Pirate" },
  { value: Profession.timonier, label: "Timonier", category: "Pirate" },
  { value: Profession.mousse, label: "Mousse", category: "Pirate" },
  { value: Profession.combattant, label: "Combattant", category: "Pirate" },

  // --- MARINE & GOUVERNEMENT ---
  { value: Profession.amiral_en_chef, label: "🎖️ Amiral en Chef", category: "Marine" },
  { value: Profession.amiral, label: "Amiral", category: "Marine" },
  { value: Profession.vice_amiral, label: "Vice-Amiral", category: "Marine" },
  { value: Profession.contre_amiral, label: "Contre-Amiral", category: "Marine" },
  { value: Profession.commodore, label: "Commodore", category: "Marine" },
  { value: Profession.colonel, label: "Colonel", category: "Marine" },
  { value: Profession.lieutenant, label: "Lieutenant", category: "Marine" },
  { value: Profession.enseigne, label: "Enseigne", category: "Marine" },
  { value: Profession.matelot, label: "Matelot", category: "Marine" },
  { value: Profession.agent_du_cp, label: "Agent du CP (Cipher Pol)", category: "Gouvernement" },
  { value: Profession.gardien_de_prison, label: "Gardien de Prison", category: "Gouvernement" },

  // --- ARMÉE RÉVOLUTIONNAIRE ---
  { value: Profession.chef_supreme, label: "🚩 Chef Suprême", category: "Révolutionnaire" },
  { value: Profession.commandant_en_chef, label: "Commandant en Chef", category: "Révolutionnaire" },
  { value: Profession.commandant_d_armee, label: "Commandant d'Armée", category: "Révolutionnaire" },
  { value: Profession.officier_revolutionnaire, label: "Officier", category: "Révolutionnaire" },
  { value: Profession.agent_d_infiltration, label: "Agent d'Infiltration", category: "Révolutionnaire" },
  { value: Profession.stratege, label: "Stratège", category: "Révolutionnaire" },
  { value: Profession.inventeur, label: "Inventeur", category: "Révolutionnaire" },

  // --- CIVILS & MÉTIERS DU MONDE ---
  { value: Profession.tenancier_de_bar, label: "🍺 Tenancier de Bar", category: "Civil" },
  { value: Profession.journaliste, label: "Journaliste", category: "Civil" },
  { value: Profession.scientifique, label: "Scientifique", category: "Civil" },
  { value: Profession.forgeron, label: "Forgeron", category: "Civil" },
  { value: Profession.chasseur_de_primes, label: "Chasseur de Primes", category: "Civil" },
  { value: Profession.marchand, label: "Marchand", category: "Civil" },
  { value: Profession.roi, label: "Roi", category: "Royauté" },
  { value: Profession.reine, label: "Reine", category: "Royauté" },
  { value: Profession.prince, label: "Prince", category: "Royauté" },
  { value: Profession.princesse, label: "Princesse", category: "Royauté" },
  { value: Profession.citoyen, label: "Citoyen", category: "Civil" },
  { value: Profession.pecheur, label: "Pêcheur", category: "Civil" },
  { value: Profession.voleur, label: "Voleur", category: "Civil" },
  { value: Profession.esclave, label: "Esclave", category: "Civil" },

  // --- AUTRES / SPÉCIFIQUES ---
  { value: Profession.courtier_de_l_ombre, label: "⚖️ Courtier de l'Ombre", category: "Autre" },
  { value: Profession.dragon_celeste, label: "🪐 Dragon Céleste", category: "Autre" },
];