import { float } from "aws-sdk/clients/cloudfront";
import { double } from "aws-sdk/clients/lightsail";

export interface BaseEntity {
  id?: string;
  createdDate?: Date;
  modifiedDate?: Date;
  createdBy?: string;
  modifiedBy?: string;
}

export interface User extends BaseEntity {
  fullname?: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  employeeCode: string;
  jobTitle: string;
  status: string;
  token?: string;
  userRole: string;
}

export interface Role extends BaseEntity {
  name: string;
}

export interface JobTitle extends BaseEntity {
  name: string;
}

export interface Department extends BaseEntity {
  name: string;
}

export interface Category extends BaseEntity {
  name: string;
}

export interface Resource extends BaseEntity {
  state: boolean
  employeeCode: string,
  fullname: string,
  email: string,
  status: string,
  jobTitle: string,
  joiningDate: Date,
  costPerDay: number,
  createdDate: Date,
  modifiedDate: Date,
  createdBy: string,
  modifiedBy: string,
  department: string,
  id: string
}

export interface ResourceMng extends BaseEntity {
  employeeCode: string,
  fullname: string,
  email: string,
  status: string,
  jobTitle: string,
  joiningDate: Date,
  costPerDay: number,
  createdDate: Date,
  modifiedDate: Date,
  createdBy: string,
  modifiedBy: string,
  department: string,
  id: string
  resourcesdetails: ProjectResourcedetails[];
}

export interface ResourceDetails extends BaseEntity {
  id: string;
  employeeCode: string;
  fullname: string;
  email: string;
  status: string;
  jobTitle: string;
  joiningDate: Date;
  costPerDay: number;
  department: string;
}

export interface Client extends BaseEntity {
  name: string;
  contact: Contact[];
  createdBy: string;
  locationName: string;
  address: Address;
  modifiedBy: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  designation: string;
  position: string;
  contactType: string,
}

export interface CalendarEvent {
  eventId: string;
}

export interface Address {
  fullAddress: string;
  city?: string;
  locality?: string;
  subLocality?: string;
  state?: string;
  zip?: string;
  landmark?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface Assignment {
  invitees: string[];
  rejectedInvitees: { userId: string, reason: string }[];
  transporters?: string[];
  interpreterId?: string;
  history: Array<{
    status: RequestStatus;
    userId: string;
    timestamp: number;
  }>;
}

export interface Document {
  filename: string;
  name: string;
  resourceId: string;
  description?: string;
  uploadedOn: number;
  verified: boolean;
  expirationDate?: number;
  verifiedBy: string;
  verifiedOn?: number;
}

export interface Project extends BaseEntity {
  title: string;
  department: Department;
  category: Category;
  client: Client;
  owner: User;
  manager: User;
  state: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
  proposedDate: Date;
  cost: number;
  purchaseOrder: string;
  profitLoss: number;
  renewalDate: Date;
  resources: ProjectResource[];
  documents: ProjectDocuments[];
  deliverables: Deliverables[];
  milestones: Milestones[];
  proposals: ProjectProposal[];
  createdBy: string;
  modifiedBy: string;
}


export interface ProjectWiseResource {
  title: string;
  client: string;
  resources: ProjectResource[];
}

export interface ProjectWiseResourceBillable {
  title: string;
  client: string;
  resourceName: string;
  bu: string;
  billableDetails: BillableDetails[];
}

export interface BillableDetails {
  label: string;
  billable: number;
}

export interface PendingProspect {
  client: string;
  project: string;
  cost: number;
  startDate: Date;
  endDate: Date;
  proposalDate: Date;
  id: string;
}

export interface UpcomingMilestone {
  name: string;
  client: string;
  project: string;
  cost: number;
  date: string;
  progress: string;
  id: string;
}

export interface ProjectHealth {
  client: string;
  project: string;
  startDate: string;
  endDate: string;
  status: string;
  actualStartDate: Date;
  actualEndDate: Date;
  id: string;
}

export interface ActiveProjects {
  client: string;
  project: string;
  cost: number;
  startDate: Date;
  endDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
  id: string;
}

export interface CompletedProject {
  client: string;
  project: string;
  cost: number;
  startDate: Date;
  endDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
  id: string;
}

export interface UpcomingDeliverablesData {
  client: string;
  project: string;
  name: string;
  status: string;
  deliveryDate: Date;
  startDate: Date;
  endDate: Date;
  progress: string;
  id: string;
}

export interface ResourceUtilizationReport {
  employeeId: string;
  name: string;
  department: string;
  utilization: string;
  billable: string;
  cost: number;
  profit: number;
}

export interface ResourceMatrix {
  total: number;
  billable: number;
  benched: number;
}

export interface Milestones extends BaseEntity {
  name: string;
  description: string;
  targetDate: Date;
  deliverables: MilestoneDeliverables[];
  cost: number;
  createdBy: string;
  modifiedBy: string;
  progress: string;
}

export interface MilestoneDeliverables {
  id: string;
}

export interface ProjectProposal extends BaseEntity {
  proposalDate: Date;
  cost: number;
  mandays: number;
  proposedBy: string;
  status: string;
  createdBy: string;
  modifiedBy: string;
}

export interface ProjectResource extends BaseEntity {
  resourceId: string;
  resourceName: string;
  cost: number;
  utilization: number;
  createdBy: string;
  modifiedBy: string;
  startDate: Date;
  endDate: Date;
}

export interface ProjectResourcedetails extends BaseEntity {
projectName: string,
client: string,
cost: number,
utilization: number,
startDate: Date,
endDate: Date,
actualStartDate: Date,
actualEndDate: Date,
}

export interface ProjectDocuments extends BaseEntity {
  type: string;
  documentUrl: string;
  createdBy: string;
  modifiedBy: string;
}

export interface Deliverables extends BaseEntity {
  name: string;
  details: string;
  startDate: Date;
  endDate: Date;
  deliveryDate: Date;
  status: Status;
  createdBy: string;
  modifiedBy: string;
  actualStartDate: Date;
  actualEndDate: Date;
  progress: string;
}

export interface Meeting {
  id: string;
  password: string;
  joinLink: string;
  meetingLink: string;
  endedMeetings?: any[];
}

export interface ResponseMatrixData {
  totalResources: number;
  resourcesBilliable: number;
  resourcesOnBentch: number;
}

export interface BilliableResourcesData {
  resourceId: string;
  resourceName: string;
  cost: double;
  utilization: float;
}

export interface BilliableDetails {
  cost: double;
  utilization: float;
}

export interface benchDetail {
  resourceId: string;
}

export interface ResourceById {
  name: string;
  projectName: string;
}

export interface ResourceProjectDetails {
  id: string;
  projectName: string;
  cost: double;
  utilization: float;
}

export interface ProjectResourceUtilazation {
  projectName: string;
  cost: double;
  utilization: float;
  startDate: Date;
  endDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
}

export interface ResourceProjectDetailsInfo {
  resourceName: string;
  resourceProjectDetails: ProjectResourceUtilazation[];
}

export interface BuDetails {
  designation: string,
  department: string,
  buHead: string;
  resourceDetails: ResourceProjectAllocation[];
}

export interface ResourceProjectAllocation {
  employeeCode: string,
  fullname: string,
  email: string,
  department: string,
  jobTitle: string,
  joiningDate: Date,
  costPerDay: number,
  status: string,
  createdDate: Date,
  modifiedDate: Date,
  createdBy: string,
  modifiedBy: string,
  id: string,
  resourceProjectDetails: ProjectResourceUtilazation[],
}

export interface BenchResourcesData extends BaseEntity {
  id: string;
  employeeCode: string;
  fullname: string;
  email: string;
  status: string;
  jobTitle: string;
  joiningDate: Date;
  costPerDay: number;
  department: string;
}

export type Status = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
export type ProjectStatus = 'GREEN' | 'AMBER' | 'RED';

export type SubscriptionPlan = 'FREE' | 'GENERAL' | 'TELEMEDICINE';

export type Scope = 'ADMIN' | 'PM' | 'BU' | 'ACCOUNT' | 'TOPMANAGEMENT' | 'HR';

export type UserStatus = 'SETUP_PENDING' | 'ACTIVE' | 'BLOCKED' | 'DEACTIVATED' | 'PENDING_VERIFICATION';

export type MemberType = 'ORG_ADMIN' | 'ORG_USER' | 'INDIVIDUAL';

export type RequestStatus = 'Pending' | 'Assigned' | 'Confirmed' | 'Completed' | 'Canceled';

export type RouteStatus = 'Pending' | 'Accepted' | 'Completed';

export type InvoiceMode = 'Immediate' | 'Bi-Weekly' | 'Monthly';

export type CustomerType = 'T1' | 'Gold' | 'Platinum' | 'T2' | 'T3' | 'T4';
