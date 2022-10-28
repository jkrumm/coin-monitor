import React from 'react';
import { H3 } from '@blueprintjs/core';

interface ICardProps {
  heading: string;
  children: any;
}

export function Card(props: ICardProps) {
  const { heading, children } = props;

  return (
    <div className="card-content">
      <div className="border-b w-full border-bBorder px-3 py-2">
        <H3 className="m-0">{heading}</H3>
      </div>
      <div>{children}</div>
    </div>
  );
}
