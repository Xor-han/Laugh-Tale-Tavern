import headerBG from "../assets/header_background.svg";

export const Header = () => {
  return (
    <header
      className="flex justify-center items-center flex-col gap-8 bg-center bg-no-repeat bg-cover py-50 px-24 max-md:h-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${headerBG}')`,
      }}
    >
      <h1 className="text-4xl font-bold text-white max-md:text-xl max-md:text-center">
        Bienvenue dans la taverne de Laugh Tale
      </h1>
    </header>
  );
};
