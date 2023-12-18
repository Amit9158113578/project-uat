import * as express from 'express';
import { Server } from '../src/server';
export class TestConstants {

    public static CLIENT_ID = '5e118ef459d9157e1f5dea7a';
    public static CONTENT_TYPE_JSON = 'application/json';
    private static app: express.Application;
    private static server = new Server();

    public static async getApp() {
        if (!this.app) {
            this.app = await this.server.start();
            this.app.set('views', __dirname + '/../src/views');
        }
        return this.app;
    }
}
