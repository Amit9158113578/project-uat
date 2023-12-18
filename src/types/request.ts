import {
    Address, Scope, UserStatus, MemberType, Document,
    SubscriptionPlan
    
    
} from './entity';
import { Condition } from './queryRequest';

/**

 * @description Login request

 */

/**
 * Type representing login request
 */
export interface LoginRequest {
    /**
     * username can be email/mobileno
     */
    userName: string;
    /**
     * Password
     */
    password: string;
    /**
     * clientId is application ID (Request portal/Admin portal/Partner Portal)
     */
    clientId: string;
}


/**
 * Type representing signup request
 */
export interface SignupRequest {
    /**
     * user fullname
     */
    fullname?: string;
    /**
     * user email
     */
    email: string;

    /**
     * user phone
     */
    phone: string;
    /**
     * Password
     */
    password: string;
    /**
     * clientId is application ID (Request portal/Admin portal/Partner Portal)
     */
    clientId?: string;

    /**
     * Default scope
     */
    role:string;
    
    userRole:string;


    /**
     * Default status
     */
    status: UserStatus;

    firstName: string;
    lastName: string;
    createdBy?: string;
    modifiedBy?:string;
    employeeCode: string;
    jobTitle:string;
}

/**
 * Type representing signup request
 */
export interface UpdateUserRequest {
    userId: string;
    fullname?: string;
    phone?: string;
    password?: string;
    status?: UserStatus;
    role?: string;
    employeeCode?: string;
    jobTitle?:string;   
}


export interface ApiRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    link: string;
    resetcode: string;
  }

/**
 * Type representing create member request
 */
export interface CreateMemberRequest {
    userId: string;
    memberType: MemberType;
    organizationType?: 'NEW_ORG' | 'EXISTING_ORG';
    organizationId?: string;
    locationId?: string;
    organizationName?: string;
    organizationAddress?: Address;
    locationName?: string;
    locationAddress?: Address;
    paymentSource?: string;
    subscriptionPlan?: SubscriptionPlan;
}

export interface CreateOrganizationRequest {
    accessCode: string;
    organizationName?: string;
    organizationAddress?: Address;
    paymentCustomer?: string;
}

export interface CreateOrgLocationRequest {
    organizationId: string;
    locationName: string;
    locationAddress: Address;
}

export interface SendEmailRequest {
    bcc?: string[] | string;
    cc?: string[] | string;
    to: string[] | string;
    template?: string;
    templateData?: any;
    html?: string;
    text?: string;
    subject: string;
    from?: string;
    includeTemplate?: boolean; // Default true
    maskSensitiveData?: boolean;
    fieldsToBeMasked?: string[];
}

export interface CreatePaymentCustomer {
    customerEmail: string;
    customerName: string;
    paymentSource?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    newPassword: string;
    userId: string;
}

export interface GetCustomerPaymentSource {
    customerId: string;
    paymentMethod: 'bank_account' | 'card';
}
export interface AddPaymentSourceRequest {
    customerId: string;
    paymentSource: string;
}

export interface DeletePaymentSourceRequest {
    customerId: string;
    paymentSourceId: string;
}

export interface UpdateDefaultPaymentSourceRequest {
    customerId: string;
    paymentSourceId: string;
}


export interface RequestPreferences {
    transportRequest?: {
        visitType: string;
        conciergeService: boolean;
        vehicleType: string;
        pickupAddress: Address;
        dropoffAddress: Address;
    };
    interpreterRequest?: {
        language: string;
        serviceType: string;
    };
}

export interface LatLng {
    latitude: number;
    longitude: number;
}

export interface GetDistanceRequest {
    origins: LatLng[];
    destinations: LatLng[];
}

export interface ChargePaymentRequest {
    amount: number;
    capture: boolean;
    customerId: string;
    currency: 'usd';
    description: string;
    source?: string;
}

export interface CapturePaymentRequest extends ChargePaymentRequest {
    chargeId: string;
}

export interface ListQueryRequest {
    conditions?: Array<Condition>;
    outputProperties?: Array<string>;
    limit?: number;
    start?: number;
    order?: { [key: string]: 1 | -1; };
    op?: 'and' | 'or';
}

export interface GetServiceRequest extends ListQueryRequest { }
export interface GetDirectionRequest {
    origin: LatLng[];
    destination: LatLng[];
}

/**
 * Type representing add patient request
*/
export interface AddPatientRequest {
    fullName: string;
    email: string;
    phone: string;
    address: Address;
    location: string;
    profilePhoto?: string;
}

export interface UpdatePatientRequest {
    patientId: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: Address;
    location?: string;
    requestPreference?: RequestPreferences;
    status?: 'ACTIVE' | 'DEACTIVE';
}

export interface GetLanguagesRequest {
    serviceType: number;
}

export interface UpdateGeneralSettingRequest {
    userId: string;
    dateFormat: string;
    timeZone: string;
    notifiers: string[];
}

export interface GetMembersRequest extends ListQueryRequest {
    organizationId?: string;
}

export interface AddMemberRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    locationId: string;
    organizationId?: string;
    memberType: 'ORG_USER' | 'ORG_ADMIN';
}

export interface UpdateMemberRequest {
    memberId: string;
    fullname: string;
    email: string;
    phone: string;
    location: string;
    memberType?: 'ORG_USER' | 'ORG_ADMIN';
}

export interface UpdateOrgLocationRequest {
    organizationId: string;
    locationId: string;
    locationName: string;
    locationAddress: Address;
}

export interface RescheduleRequest {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
}

export interface SaveFileRequest {
    fileName: string;
    fileContent: any;
    metaData?: any;
}

export interface GetFileRequest {
    fileName: string;
}

export interface DeleteFileRequest {
    fileName: string;
}


export interface UpdateInvoiceRequest {
    invoiceId: string;
    paymentResponse: PaymentResponse;
    status: 'Pending' | 'Completed';
}

export interface PartnerSignupRequest extends SignupRequest {
    userId: string;
    scopes: Scope[];
}


export interface UpdateCertificateRequest {
    userId: string;
    certificateID: string;
    expireDate: number;
    status: 'VERIFIED' | 'PENDING' | 'EXPIRED';
    auditedBy: string;
}

export interface CreateCalendarEvent {
    participants: Array<{
        displayName?: string;
        email: string;
    }>;
    description: string;
    summary: string;
    startTime: {
        dateTime: string;
        timezone: string;
    };
    endTime?: {
        dateTime: string;
        timezone: string;
    };
}

export interface CreateMeetingRequest {
    agenda: string;
    topic: string;
    startTime: number;
    duration: {
        hours: number;
        minutes: number;
    };
}

export interface UpdateMeetingRequest {
    meetingId?: string;
    startTime?: number;
}

export interface UpdateCalendarEvent {
    attendees?: Array<{
        displayName?: string;
        email: string;
    }>;
    eventId: string;
    startTime: {
        dateTime: string;
        timezone: string;
    };
    endTime?: {
        dateTime: string;
        timezone: string;
    };
}
export interface AssignRequest {
    requestId: string;
    routes?: string[];
    transporterId?: string;
    interpreterId?: string;
}

export interface CancelRequest {
    requestId: string;
    reason: string;
    comments?: string;
}

export interface VerifyPaymentSourceRequest {
    customerId: string;
    paymentSourceId: string;
    amount: {
        firstAmount: number;
        secondAmount: number;
    };
}

export interface RefundRequest {
    requestId?: string;
    chargeId: string;
    amount: number;
    reason: string;
}

export interface CreatePaymentAccountRequest {
    country: 'US';
    type: 'individual';
    currency: 'USD';
    individual: {
        achAccountToken: string;
        firstname: string;
        lastname: string;
        ssn: string;
        dob: number;
        email: string;
        phone: string;
        address: Address;
        businessWebsite: 'https://medtransgo.com';
    };
}

export interface FeedbackRequest {
    requestId: string;
    feedbackId: string;
    rating?: number;
    comments?: string;
}

export interface CompleteRequest {
    requestId: string;
    startTime?: string;
    endTime?: string;
}

export interface SendNotificationRequest {
    message: { [key: string]: string };
    deviceIds: string[];
    userIds?: string[];
}

export interface ActivateSubscriptionRequest {
    plan: SubscriptionPlan;
    userId: string;
}

export interface AddHealthcareProvider {
    fullname: string;
    email: string;
    phone: string;
}

export interface UpdateProviderRequest {
    providerId: string;
    fullname?: string;
    email?: string;
    phone?: string;
    status?: 'ACTIVE' | 'DEACTIVE';
}

export interface QueryRequest {
    conditions?: Array<Condition>;
    outputProperties?: Array<string>;
}

export interface SetSmsReminderRequest {
    id: string;
    smsRequests: Array<{ phoneNo: string; message: string }>;
    timestamp: number;
}

export interface CreatePayableRequest {
    name: string;
    email: string;
}

export interface CreateBillRequest {
    payableAccountId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string; // yyyy-mm-dd
    description: string;
    amount: number;
}

export interface SendSMSRequest {
    countryCode: string;
    message: string;
    phoneNumber: string;
}



export interface CreateLocRequest {
    branchName?: string;
    email?: string;
    phone?: string;
    transporterId?: string;
    locationAddress?: Address;
}

export interface CreateDriverRequest extends SignupRequest {
    transporterId: string;
    address: Address;
    licenceNo: string;
    licenceState: string;
    expireYear: string;
    documents: Document[];
}

export interface UpdateLocRequest {
    locationId: string;
    branchName?: string;
    email?: string;
    phone?: string;
    transporterId?: string;
    locationAddress?: Address;
}

export interface UpdateDriverRequest {
    driverId: string;
    address: Address;
    licenceNo: string;
    licenceState: string;
    expireYear: string;
    fullname: string;
    phone: string;
    userId: string;
}

export interface UpdateOrgRequest {
    organizationName: string;
    customerType: 'Silver' | 'Gold' | 'Platinum';
    invoiceMode: 'Immediate' | 'Bi-Weekly' | 'Monthly';
    stopRecurringExpirationDate?: string;
    startRecurring?: boolean;
}

export interface DocumentVerificationRequest {
    userId: string;
    resourceId: string;
    expirationDate: number;
}



export interface CompleteRouteRequest {
    requestId: string;
    waitingTime: number; // Time in milliseconds
}

export interface AdminLoginRequest {
    organizationId?: string;
    clientId: string;
}
