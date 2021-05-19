import Uma from '@umajs/core';
import { Router } from '@umajs/router';

const uma = Uma.instance({
    Router,
    ROOT: __dirname,
    env: process.argv.indexOf('--production') > -1 ? 'production' : 'development',
});

uma.start(8058);
