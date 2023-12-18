import { Address, SubscriptionPlan, InvoiceMode, PendingProspect, UpcomingMilestone, ProjectHealth, ResourceMatrix, ActiveProjects, UpcomingDeliverablesData, CompletedProject } from './entity';

export interface Response<T> {
    success: boolean;
    errorCode?: string;
    data?: T;
    totalCount?: number;
}

export interface SendEmailResponse {
    success: boolean;
    messageId?: string;
}

export interface MemberProfile {
    memberId: string;
    organization?: {
        id: string;
        name: string,
        address: Address,
        accessCode?: string;
    };
    location?: {
        id: string;
        name: string;
        address: Address;
        settings?: {
            dateFormat?: string;
            notifiers?: string[];
        };
    };
    fullname: string;
    email: string;
    phone: string;
    paymentCustomerId?: string;
    memberType: string;
    addedOn: number;
    timezone: string;
    subscriptionPlan?: SubscriptionPlan;
    invoiceMode?: InvoiceMode;
}

export interface PaymentCustomerResponse {
    customerId: string;
    data?: any;
}

export interface GetDistanceResponse {
    distance: {
        text: string,
        value: number; // Value in meters
    };
    duration: {
        text: string;
        value: number; // Value in seconds
    };
}

export interface SaveFileResponse {
    fileName: string;
    metaData?: any;
}

export interface CreatePayableResponse {
    payableAccountId: string;
}

export interface CreateBillResponse {
    billId: string;
}



export interface AdminLoginResponse {
    token: string;
    host: string;
}

export interface PendingInvoiceItem {
    id: string;
    dueAmount: number;
    dueDate: number;
    name: string;
    typeOfService: string;
    invoiceId: string;
    orderId: string;
}

export interface DashboardDataResponse {
    activeProject: number;
    prospect: number;
    pipelineProspectCost: number;
    activeCost: number;
    completed: number;
    completedProjectCost: number;
    pendingProspectData?: PendingProspect[];
    upcomingMilestonesData?: UpcomingMilestone[];
    projectHealthData?: ProjectHealth[];
    resourceMatrix?: ResourceMatrix;
    activeProjectData?: ActiveProjects[];
    completedProjectData?:CompletedProject[];
    upcomingDeliverableData?: UpcomingDeliverablesData[];
}
