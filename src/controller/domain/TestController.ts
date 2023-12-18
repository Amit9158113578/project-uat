import { BaseController } from '../baseController';
import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { URLConstants } from '../../constants/urlConstants';


@injectable()
export class TestController extends BaseController {
    constructor() {
        super();
        this.router.get(`${URLConstants.URL_Tests}`, this.testAPI);
    }

    private testAPI = async (req: Request, res: Response) => {
        res.send('Server is UP and Running')
    }

}