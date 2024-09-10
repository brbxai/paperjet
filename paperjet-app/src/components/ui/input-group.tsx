import { cn } from '@/lib/utils';
import React from 'react';

interface InputGroupProps {
  title: string;
  children: React.ReactNode;
  withSubgroups?: boolean;
}

export function InputGroup({ title, children, withSubgroups = false }: InputGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className={cn(
        !withSubgroups && "grid grid-cols-3 gap-x-4 gap-y-2",
      )}>
        {children}
      </div>
    </div>
  );
}
