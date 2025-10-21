// components/Avatar.tsx
import React from "react";

interface AvatarProps {
  type: "user" | "assistant";
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ type, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9", 
    lg: "w-11 h-11"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const avatarClasses = `rounded-full flex items-center justify-center ${sizeClasses[size]}`;

  if (type === "user") {
    return (
      <div className={`${avatarClasses} bg-green-200`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" className="text-green-600"/>
          <circle cx="12" cy="7" r="4" className="text-green-600"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={`${avatarClasses} bg-gray-200`}>
      <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" className="text-gray-600"/>
        <circle cx="12" cy="10" r="3" className="text-gray-600"/>
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" className="text-gray-600"/>
      </svg>
    </div>
  );
}
