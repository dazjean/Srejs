import tools, { SSRKEY } from './tools';
import Logger from './log';

export function getDisplayName(Component) {
    return typeof Component === 'string'
        ? Component
        : Component.displayName || Component.name || 'Unknown';
}
export async function loadGetInitialProps(App, ctx) {
    if (!App.getInitialProps) {
        return {};
    }
    if (tools.isDev()) {
        if (App.prototype && App.prototype.getInitialProps) {
            const message = `"${getDisplayName(
                App
            )}.getInitialProps(ctx ,query,pathname)" is defined as an instance method`;
            throw new Error(message);
        }
    }
    // when npm run output ctx is null
    ctx = ctx || {};

    const res = ctx.res || (ctx.ctx && ctx.ctx.res);

    const props = await App.getInitialProps(
        ctx,
        (ctx[SSRKEY] && ctx[SSRKEY].query) || null,
        (ctx[SSRKEY] && ctx[SSRKEY].pathname) || null
    );

    if (res && (res.finished || res.headersSent)) {
        return props;
    }

    if (!props) {
        const message = `"${getDisplayName(
            App
        )}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw new Error(message);
    }

    if (tools.isDev()) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            Logger.warn(
                `${getDisplayName(
                    App
                )} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization`
            );
        }
    }

    return props;
}
