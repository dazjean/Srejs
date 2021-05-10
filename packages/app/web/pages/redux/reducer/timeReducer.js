import { GET_TIME, RESET_TIME, ADD_TIME } from './../action/timeAction';

const timeReducer = (state, action) => {
    // state当前状态 action下面的是参数可转换到state中去更新
    let handleGetTime = () => {
        return Object.assign({}, state, {
            time: action.time
        });
    };

    let handleResetTime = () => {
        return Object.assign({}, state, {
            time: action.time
        });
    };

    let handleAddTime = () => {
        return Object.assign({}, state, {
            time: state.time + 1
        });
    };
    switch (action.type) {
        case GET_TIME:
            return handleGetTime();
        case RESET_TIME:
            return handleResetTime();
        case ADD_TIME:
            return handleAddTime();
        default:
            return state;
    }
};

module.exports = timeReducer;
