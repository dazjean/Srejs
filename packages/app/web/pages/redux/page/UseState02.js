import { useState } from 'react';
let APP = () => {
    const [books, setBooks] = useState({ name: '语文', id: '1' });
    return (
        <div>
            <div>
                <span>索引: {books.id}</span>
                <span>书名: {books.name}</span>
            </div>
            <button onClick={() => setBooks({ name: '数学' })}>修改书名称</button>
            <button
                onClick={() =>
                    setBooks(prevState => {
                        //或者通过Object.assign合并对象
                        return { ...prevState, ...{ name: '数学' } };
                    })
                }>
                修改书名称 索引不变
            </button>
        </div>
    );
};
module.exports = APP;
