import { Link } from "react-router-dom";
import { ArcDB } from "../components/ArcDB";
import { CharacterDB } from "../components/CharacterDB";
import { DevilFruitDB } from "../components/DevilFruitDB";
import { OrganisationDB } from "../components/OrganisationDB";
import { EquipageDB } from "../components/EquipageDB";
import { useState } from "react";
import { Logo } from "../components/Logo";

type TabType = "characters" | "fruits" | "arcs" | "crews" | "organisations" | null;

export const AdminDashboard = () => {
const [activeTab, setActiveTab] = useState<TabType>("characters");
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="text-2xl font-black italic uppercase">
            <Logo/>
          </Link>
          <div>
            <h1 className="text-4xl font-black italic uppercase">Dashboard</h1>
            <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">
              Admin Panel
            </p>
          </div>
        </div>
        {/* NAVIGATION (BOUTONS) */}
        <div className="flex justify-between text-xl border-b pb-4 mb-6">
          <button 
            onClick={() => setActiveTab("characters")} 
            className={`cursor-pointer font-bold ${activeTab === "characters" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Personnages
          </button>
          
          <button 
            onClick={() => setActiveTab("fruits")} 
            className={`cursor-pointer font-bold ${activeTab === "fruits" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Fruits
          </button>

          <button 
            onClick={() => setActiveTab("arcs")} 
            className={`cursor-pointer font-bold ${activeTab === "arcs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Arcs
          </button>

          <button 
            onClick={() => setActiveTab("crews")} 
            className={`cursor-pointer font-bold ${activeTab === "crews" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Équipages
          </button>

          <button 
            onClick={() => setActiveTab("organisations")} 
            className={`cursor-pointer font-bold ${activeTab === "organisations" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Organisations
          </button>
        </div>

        {/* AFFICHAGE CONDITIONNEL */}
        <div className="mt-6">
          {activeTab === "characters" && <CharacterDB/>}
          {activeTab === "fruits" && <DevilFruitDB/>}
          {activeTab === "arcs" && <ArcDB/>}
          {activeTab === "crews" && <EquipageDB/>}
          {activeTab === "organisations" && <OrganisationDB/>}
        </div>
      </div>
    </div>
  );
};
