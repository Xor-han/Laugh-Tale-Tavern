import { Link } from "react-router-dom";

export const PageCard = ({ page }: { page: any }) => {
const imageUrl = page.entityData?.image?.[0]?.url

  return (
    <Link
      to={`/${page.slug}`}
      className="group block h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={page.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-black uppercase tracking-widest mb-3">
          {page.entityType}
        </span>

        <h2 className="text-xl font-extrabold text-gray-950 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
          {page.title}
        </h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
          {page.content}
        </p>
      </div>
    </Link>
  );
};
