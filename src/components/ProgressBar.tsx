'use client';

import { useEffect, useState } from 'react';

type Props = {
  value: number;
};

const ProgressBar = (props: Props) => {
  //console.log('interval is: ', value);
  return (
    <div className='w-full bg-secondary rounded-full h-2.5'>
      <div
        className='bg-primary h-2.5 rounded-md'
        style={{
          width: `${props.value}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
