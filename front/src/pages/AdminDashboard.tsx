import { DevilFruitDB } from "../components/DevilFruitDB";

export const AdminDashboard = () => {


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic uppercase">Dashboard</h1>
            <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">
              Admin Panel
            </p>
          </div>
        </div>
            <DevilFruitDB/>
      </div>
    </div>
  );
};
