import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import logo from "@/assets/Logo.svg";

export function Header() {
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
      <img src={logo} alt="Financy" className="h-8" />

      <nav className="flex items-center gap-8 h-full">
        {[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Transações", path: "/transactions" },
          { name: "Categorias", path: "/categories" },
        ].map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`relative text-sm font-inter font-semibold h-full flex items-center transition-colors ${
              isActive(item.path) ? "text-brand-base" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {item.name}
            {isActive(item.path) && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-base animate-in fade-in slide-in-from-bottom-1" />
            )}
          </Link>
        ))}
      </nav>

      <Link 
        to="/profile" 
        className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 font-bold hover:bg-gray-200 transition-all overflow-hidden"
      >
        {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
      </Link>
    </header>
  );
}