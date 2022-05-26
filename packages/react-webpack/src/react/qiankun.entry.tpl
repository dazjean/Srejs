'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

let App = '$injectApp$';
App = App.default ? App.default : App;

let Layout = false;
//-layout-
Layout = '$injectLayout$';
Layout = Layout.default ? Layout.default : Layout;
//-layout-
const rootNode = '$rootNode$';

const RootComponent = ({ params, layout }) => {
    return Layout && layout ? (
        <Layout {...params}>
            <App {...params} />
        </Layout>
    ) : (
        <App {...params} />
    );
};

let exportApp =  hot(RootComponent);

if(process.env.NODE_ENV==="production"){
    exportApp = RootComponent;
}

export { App };
export default exportApp;

export async function bootstrap() {
    console.log('[react16] react app bootstraped');
}
export async function mount(props) {
    console.log('[react16] props from main framework', props, window.__SSR_DATA__);
    let {baseRouter = '', baseRequest = ''} = props;
    if(baseRequest) { window.__baseRequest = baseRequest; }
    window.__SSR_DATA__ = window.__SSR_DATA__ || {};
    const root = document.getElementById(`${rootNode}`);
    if (!root) {
        let rootDom = document.createElement('div');
        rootDom.id = `${rootNode}`;
        document.body.prepend(rootDom);
    }
    const { ssr, baseName, layout = true } = window.__SSR_DATA__?.options;
    const params = {
        ...window.__SSR_DATA__.initProps,
        path: window.__SSR_DATA__.path || '',
        page: window.__SSR_DATA__.page || '',
        query: window.__SSR_DATA__.query || ''
    };
    ReactDom.render(
        <Router basename={`${baseRouter}${baseName}`}>
            <RootComponent params={params} layout={layout} />
        </Router>,
        document.getElementById(`${rootNode}`)
    );
}
export async function unmount(props) {
    console.log('[react16] props from main unmount', props);
    const { container } = props;
    ReactDom.unmountComponentAtNode(container ? container.querySelector(`#${rootNode}`) : document.querySelector(`#${rootNode}`));
}
export async function update(props) {
    console.log('[react16] props from main update', props);
}