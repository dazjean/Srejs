import React from 'react';
import { MixStateAndDispatch } from './interface';

const Context = React.createContext<MixStateAndDispatch<any>>({ state: {} });

export default Context;
