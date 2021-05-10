const GET_TIME = 'GET_TIME';
const RESET_TIME = 'RESET_TIME';
const ADD_TIME = 'ADD_TIME';

const getTime = time => {
    return {
        type: GET_TIME,
        time
    };
};

const resetTime = time => {
    return {
        type: RESET_TIME,
        time
    };
};

const addTime = () => {
    return {
        type: ADD_TIME
    };
};

const fetchTime = async () => {
    //异步处理  返回的是一个promise对象 通过then接收action
    let response = await fetch('http://localhost:9991/mock/count.json');
    let listData = await response.json();
    return getTime(listData.count);
};

export { GET_TIME, RESET_TIME, ADD_TIME, getTime, resetTime, addTime, fetchTime };
