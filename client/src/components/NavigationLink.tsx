import { Link } from "wouter";
import { ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
  const handleClick = () => {
    // Force scroll to top immediately when navigation link is clicked
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href}>
      <div className={className} onClick={handleClick}>
        {children}
      </div>
    </Link>
  );
}