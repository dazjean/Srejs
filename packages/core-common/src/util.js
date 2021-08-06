const replaceSpecialStr = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '&nbsp;')
        .replace("'", '&#39;')
        .replace('"', '&quot;')
        .replace(/{{/g, '')
        .replace(/}}/g, '');
};

export const filterXssByJson = (json) => {
    for (let key in json) {
        if (json[key] instanceof Array) {
            json[key] = json[key].map((item) => {
                return replaceSpecialStr(item);
            });
        } else {
            json[key] = replaceSpecialStr(json[key]);
        }
    }
    return json;
};
