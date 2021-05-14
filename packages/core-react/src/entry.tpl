'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
let App = $injectApp$;
App = App.default ? App.default : App;
const rootNode = '$rootNode$';

const inBrowser = typeof window !== 'undefined';
if (inBrowser) {
    window.__SSR_DATA__ = window.__SSR_DATA__ || {};
    const root = document.getElementById(`${rootNode}`);
    if (!root) {
        let rootDom = document.createElement('div');
        rootDom.id = `${rootNode}`;
        document.body.appendChild(rootDom);
    }
}
inBrowser &&
    ReactDom.hydrate(
        <Router basename="/__SSR_DATA__pathname">
            <App
                {...window.__SSR_DATA__.initProps}
                path={window.__SSR_DATA__.path || ''}
                page={window.__SSR_DATA__.page || ''}
                query={window.__SSR_DATA__.query || ''}
            />
        </Router>,
        document.getElementById(`${rootNode}`)
    );
module.exports = hot(App);
