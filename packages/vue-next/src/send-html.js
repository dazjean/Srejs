import generateETag from 'etag';
import fresh from 'fresh';

export function sendHTML(ctx, html, { generateEtags }) {
    let { req, res } = ctx;
    function isResSent(res) {
        return res.finished || res.headersSent;
    }

    if (isResSent(res)) return;
    if (typeof html == 'object') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        ctx.body = html;
    } else {
        const etag = generateEtags ? generateETag(html) : undefined;

        if (fresh(req.headers, { etag })) {
            res.statusCode = 304;
            res.end();
            return;
        }

        if (etag) {
            res.setHeader('ETag', etag);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.end(req.method === 'HEAD' ? null : html);
    }
}
