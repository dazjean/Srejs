# css modules
>  使用前请查看官方对于css模块化的介绍。[css-modules](https://github.com/css-modules/css-modules)


## 如何使用
> `Srejs`按照样式文件名称进行开启和关闭css modules，样式文件规则为：`xxx.modules.(less|scss|css)`。


### 页面组件
```ts
import style from './index.module.less';
import React from 'react';
type typeProps = {
    msg: string;
};
export default function (props: typeProps) {
    return (
        <div className={style.home}>
            <p>css modules</p>
            <pre className={style.text}>{props.msg}</pre>
        </div>
    );
}
```


### 样式文件
```css
.home{
    color:red;
}
```