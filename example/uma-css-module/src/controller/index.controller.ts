import { BaseController, Path } from '@umajs/core';
import { Result } from '@umajs/plugin-react-ssr';

@Path('/')
export default class Index extends BaseController {
    @Path()
    @Path('/less')
    index() {
        return Result.reactView(
            'less',
            { des: '使用前请查看官方对于css模块化的介绍。https://github.com/css-modules/css-modules' },
            { cache: false },
        );
    }

    @Path('/css')
    css() {
        return Result.reactView(
            'css',
            { des: '使用前请查看官方对于css模块化的介绍。https://github.com/css-modules/css-modules' },
            { cache: false },
        );
    }

    @Path('/scss')
    scss() {
        return Result.reactView(
            'scss',
            { des: '使用前请查看官方对于css模块化的介绍。https://github.com/css-modules/css-modules' },
            { cache: false },
        );
    }
}
