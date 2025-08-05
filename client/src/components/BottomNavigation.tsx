import { Link, useLocation } from "wouter";
import { Home, Ship, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { icon: Home, label: "Home", route: "/home" },
  { icon: Ship, label: "My Boats", route: "/my-boats" },
  { icon: TrendingUp, label: "Own a Yacht", route: "/ownership-opportunities" },
  { icon: User, label: "Profile", route: "/profile" }
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {tabs.map(({ icon: Icon, label, route }) => {
          const isActive = location === route;
          return (
            <Link key={route} href={route}>
              <button
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-xl transition-colors",
                  isActive
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
