import React from 'react';
import { H3 } from '@blueprintjs/core';

interface ICardProps {
  heading: string;
  children: any;
}

// interface ICardState {
// 	myRef: any;
// }

export function Card(props: ICardProps) {
  const { heading, children } = props;

  return (
    <div className="box-content">
      {/*<div className="p-0 h-full border-bBorder border-2">*/}
      {/*<div className="p-0 h-full bg-bDarkGray-3 border-bBorder border-2">*/}
      <div className="border-b w-full border-bBorder p-3 pt-2 pb-2">
        <H3 className="m-0">{heading}</H3>
      </div>
      <div className="p-3 pt-2 pb-2">{children}</div>
    </div>
  );
}
