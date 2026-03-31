import { Nav } from "./Nav";

export const ModalBurgerMenu = () => {
  return (
    <div className="absolute top-full left-0 right-0 -mx-3 md:-mx-5 bg-slate-900/80 z-50 flex flex-col gap-10 pt-12 min-h-screen p-3 text-base items-center">
      <div className="grid gap-20 text-center">
        <p className="text-amber-600 md:text-4xl max-md:text-2xl">Explorer l'univers:</p>
        <nav>
          <ul className="flex flex-col gap-10 text-2xl text-center items-center">
            <Nav/>
          </ul>
        </nav>
      </div>
    </div>
  );
};
