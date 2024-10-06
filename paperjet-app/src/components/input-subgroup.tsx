import React from 'react';

interface InputSubgroupProps {
  title: string;
  children: React.ReactNode;
}

export function InputSubgroup({ title, children }: InputSubgroupProps) {
  return (
    <div className="mb-6">
      <h4 className="text-md font-medium mb-2">{title}</h4>
      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        {children}
      </div>
    </div>
  );
}
