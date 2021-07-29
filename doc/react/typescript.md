# 使用typescript
`Srejs` 默认使用`babel-loader`搭配插件`@babel/preset-typescript`进行ts编译,但不做类型校验，类型校验可以使用ts或者`vs code`插件

## 安装typescript
```
yarn add  typescript;
```

## 新增tsconfig.json

```js
// web/tsconfig.json
{
    "compilerOptions": {
      "jsx": "react",
      // Target latest version of ECMAScript.
      "target": "esnext",
      // Search under node_modules for non-relative imports.
      "moduleResolution": "node",
      // Process & infer types from .js files.
      "allowJs": true,
      // Don't emit; allow Babel to transform files.
      "noEmit": true,
      // Enable strictest settings like strictNullChecks & noImplicitAny.
      "strict": true,
      // Disallow features that require cross-file information for emit.
      "isolatedModules": true,
      // Import non-ES modules as default imports.
      "esModuleInterop": true
    },
    "include": ["web"]
  }

```

## 创建页面组件

```ts
// web/pages/list/index.tsx

import React from 'react';
type typeProps = {
    ListData :[string]
}
export default function (props:typeProps){
     const {ListData} = props;
    return (
        <div className="list" style={{textAlign: 'center'}}>
            <h3>列表</h3>
            <ul>
                {ListData.map((item,value)=>{
                    return (
                        <li key={value}>
                           <div className="item">{item}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
```