import { BaseController ,Path} from '@umajs/core';
import { Result } from '@umajs/plugin-react-ssr'

@Path('/')
export default class Index extends BaseController {
    @Path()
    index() {
        return Result.reactView('index',{counter:{value: 3,
            status: 'idle',amount:5}});
    }
}
