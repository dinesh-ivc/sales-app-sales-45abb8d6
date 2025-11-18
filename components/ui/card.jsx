'use client';

import React from 'react';
import { Card as ShadcnCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Card({ title, description, children, actions, className = '', ...props }) {
  return (
    <ShadcnCard className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} {...props}>
      <CardHeader>
        {title && <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>}
        {description && <CardDescription className="text-sm text-gray-600">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {actions && <CardFooter className="flex justify-end space-x-2">{actions}</CardFooter>}
    </ShadcnCard>
  );
}

export default Card;