import React from 'react';

interface InputGroupProps {
  title: string;
  children: React.ReactNode;
}

export function InputGroup({ title, children }: InputGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        {children}
      </div>
    </div>
  );
}
