import { useState } from 'react';
const books = [
    { name: '语文', id: '1', state: '0' },
    { name: '数学', id: '2', state: '1' },
    { name: '英文', id: '3', state: '0' }
];
let APP = () => {
    const [book, setBooks] = useState(() => {
        let findBook = {};
        books.map((_book, _index) => {
            if (_book.state == '1') {
                findBook = _book;
            }
        });
        return findBook;
    });
    return (
        <div>
            <div>
                <span>索引: {book.id}</span>
                <span>书名: {book.name}</span>
                <span>状态: {book.name}</span>
            </div>
        </div>
    );
};
module.exports = APP;
