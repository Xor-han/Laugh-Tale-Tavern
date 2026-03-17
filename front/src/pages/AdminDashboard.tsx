import { Link } from "react-router-dom";
import { ArcDB } from "../components/ArcDB";
import { CharacterDB } from "../components/CharacterDB";
import { DevilFruitDB } from "../components/DevilFruitDB";

export const AdminDashboard = () => {


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="text-2xl font-black italic uppercase">Laugh Tale Tavern</Link>
          <div>
            <h1 className="text-4xl font-black italic uppercase">Dashboard</h1>
            <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">
              Admin Panel
            </p>
          </div>
        </div>
            <CharacterDB/>
            <DevilFruitDB/>
            <ArcDB/>
      </div>
    </div>
  );
};
