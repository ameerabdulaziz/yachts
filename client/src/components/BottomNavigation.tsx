import { Link, useLocation } from "wouter";
import { Home, Ship, Anchor, User, PieChart, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { enhancedScrollToTop } from "@/utils/scrollToTop";

const tabs = [
  { icon: Home, label: "Home", route: "/" },
  { icon: Waves, label: "Charter", route: "/charter" },
  { icon: PieChart, label: "Invest", route: "/invest" },
  { icon: Ship, label: "My Boats", route: "/my-boats" },
  { icon: User, label: "Profile", route: "/profile" }
];

export default function BottomNavigation() {
  const [location] = useLocation();
  


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1.5 z-40">
      <div className="flex items-center justify-between px-2">
        {tabs.map(({ icon: Icon, label, route }) => {
          const isActive = location === route || (route === "/" && (location === "" || location === "/hone"));
          return (
            <Link key={route} href={route}>
              <button
                onClick={enhancedScrollToTop}
                className={cn(
                  "flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors",
                  isActive
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
