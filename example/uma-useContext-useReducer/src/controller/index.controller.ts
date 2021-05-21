import { BaseController, Path, Param } from '@umajs/core';
import { Result } from '@umajs/plugin-react-ssr';
import ListData from '../mock/index';
import DetailData from '../mock/detail';

@Path('/')
export default class Index extends BaseController {
    @Path()
    index() {
        return Result.reactView('index', { indexData: ListData }, { cache: true });
    }

    @Path('/detail/:id')
    detail(@Param('id') id:string) {
        return Result.reactView(
            'detail',
            { detailData: DetailData.data[id] },
            { cache: false },
        );
    }
}
