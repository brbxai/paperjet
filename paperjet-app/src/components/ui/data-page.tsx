"use client";

import React from "react";

export const SidebarHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ElementType;
}) => {
  const Icon = icon;
  return (
    <div className="flex items-end gap-2 border-b py-2 text-sm">
      <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
        <div className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-sm">
          <Icon className="h-3.5 w-3.5 shrink-0" />
        </div>
        <div className="line-clamp-1 flex-1 pr-2 font-medium">{title}</div>
      </div>
    </div>
  );
};

export const DataPage = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
  return (
    <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
      <SidebarHeader icon={icon} title={title} />
      <div className="p-2">{children}</div>
    </main>
  );
};
