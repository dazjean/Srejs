import React from 'react';

export * from './page-index';
export * from './detail-index';
export type ActionType = {
    type: string,
    payload:{
      [key:string]:any
    }
  }

export type MixStateAndDispatch<T> = {
    state: T,
    dispatch?: React.Dispatch<ActionType>
}
