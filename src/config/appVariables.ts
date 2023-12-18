import { inject, injectable } from 'inversify';
import { S3 } from 'aws-sdk';
import { ILoggerService } from '../service/util/iLoggerService';
import { BaseIdentifiers } from './baseIdentifiers';
/**

 * @description Application config variables

 */
@injectable()
export class AppVariables {

    /**
     * Email Config
     */
    private emailConfig: EmailConfig;

    /**
     * Stripe configuration
     */
    private stripeConfig: StripeConfig;

    /**
     * Google configuration
     */
    private googleConfig: GoogleConfig;

    /**
     * Google configuration
     */
    private awsConfig: AwsConfig;

    /**
     * Zoom Meet configuration
     */
    private zoomConfig: ZoomConfig;

    /**
     * Zoom Meet configuration
     */
    private appConfig: AppConfig;

    /**
     * DB configuration
     */
    private dbConfig: DbConfig;

    /**
     * Bill configuration
     */
    private billConfig: BillConfig;

    /**
     * Twilio configuration
     */
    private twilioConfig: TwilioConfig;

    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    public get emailConfiguration(): EmailConfig {
        return this.emailConfig;
    }

    public get stripeConfiguration(): StripeConfig {
        return this.stripeConfig;
    }

    public get googleConfiguration(): GoogleConfig {
        return this.googleConfig;
    }

    public get awsConfiguration(): AwsConfig {
        return this.awsConfig;
    }
    public get zoomConfiguration(): ZoomConfig {
        return this.zoomConfig;
    }

    public get appConfiguration(): AppConfig {
        return this.appConfig;
    }

    public get dbConfiguration(): DbConfig {
        return this.dbConfig;
    }

    public get billConfiguration(): BillConfig {
        return this.billConfig;
    }

    public get twilioConfiguration(): TwilioConfig {
        return this.twilioConfig;
    }

    // Load configuration file from cloud location
    public async loadConfiguration() {
        const s3Client = new S3();
        const enviroment = process.env.NODE_ENV ? process.env.NODE_ENV : 'staging';
        const filename = `${enviroment}-configuration.json`;
        this.iLoggerService.debug('loadConfiguration:: File Name - ', filename);
        const getObjectOutput = await s3Client.getObject({
            Bucket: 'medtransgo-config',
            Key: filename,
        }).promise();
        const config = JSON.parse(getObjectOutput.Body.toString('utf8'));
        this.emailConfig = config.emailConfig;
        this.stripeConfig = config.stripeConfig;
        this.googleConfig = config.googleConfig;
        this.awsConfig = config.awsConfig;
        this.zoomConfig = config.zoomConfig;
        this.appConfig = config.appConfig;
        this.dbConfig = config.dbConfig;
        this.billConfig = config.billConfig;
        this.twilioConfig = config.twilioConfig;
    }
}

export interface EmailConfig {
    service: string;
    userEmail: string;
    userEmailPassword: string;
    from: string;
}

export interface StripeConfig {
    secretKey: string;
}

export interface GoogleConfig {
    apiKey: string;
    calendarEmail: string;
    calendarScopes: string[];
}

export interface AwsConfig {
    resourceBucketName: string;
    sendSmsLambdaArn: string;
    region: string;
}

export interface ZoomConfig {
    accessKeyId: string;
    secretKey: string;
    userId: string;
}

export interface AppConfig {
    partnerPortalHost: string;
    jwtPrivateKey: string;
    requestPortalHost: string;
}

export interface DbConfig {
    url: string;
    username: string;
    password: string;
}

export interface BillConfig {
    orgId: string;
    devKey: string;
    username: string;
    password: string;
    url: string;
}

export interface TwilioConfig {
    accountId: string;
    authToken: string;
    fromPhoneNo: string;
}
