"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarService = void 0;
const inversify_1 = require("inversify");
const baseIdentifiers_1 = require("../../../config/baseIdentifiers");
const serviceException_1 = require("../../../exception/serviceException");
const errorCodes_1 = require("../../../constants/errorCodes");
const googleapis_1 = require("googleapis");
const appVariables_1 = require("../../../config/appVariables");
/**

 * @description Google Calendar service interface

 */
let GoogleCalendarService = class GoogleCalendarService {
    constructor() {
        this.googleJWTClient = new googleapis_1.google.auth.JWT('GooglePrivateKey.client_email', '../../../private/google_privatekey', 'GooglePrivateKey.private_key', null, null, 'GooglePrivateKey.private_key_id');
    }
    /**

     * @description create calendar event and send update to all participants
     * @param createCalendarEvent {CreateCalendarEvent} - CreateCalendarEvent object
     * @returns CreateCalendarEventResponse
     * @throws ServiceException if failed to create calendar event
     */
    createEvent(createCalendarEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('GoogleCalendarService::createEvent - Request :', createCalendarEvent);
                const credentials = yield this.getCredentials();
                this.googleJWTClient.setCredentials(credentials);
                this.iLoggerService.debug('GoogleCalendarService::createEvent - Google authorize result :', credentials);
                const calendarClient = googleapis_1.google.calendar('v3');
                const insertEventResult = yield calendarClient.events.insert({
                    auth: this.googleJWTClient,
                    calendarId: 'primary',
                    requestBody: {
                        attendees: createCalendarEvent.participants,
                        description: createCalendarEvent.description,
                        end: createCalendarEvent.endTime,
                        guestsCanInviteOthers: false,
                        guestsCanModify: false,
                        guestsCanSeeOtherGuests: false,
                        reminders: {
                            overrides: [
                                { 'method': 'email', 'minutes': 24 * 60 },
                                { 'method': 'popup', 'minutes': 30 },
                            ],
                            useDefault: false,
                        },
                        start: createCalendarEvent.startTime,
                        summary: createCalendarEvent.summary,
                    },
                    sendNotifications: true,
                    sendUpdates: 'all',
                });
                if (insertEventResult.data.id) {
                    const calendarEvent = {
                        eventId: insertEventResult.data.id,
                    };
                    return calendarEvent;
                }
            }
            catch (error) {
                this.iLoggerService.error('GoogleCalendarService::createEvent - Error while calendar event', JSON.stringify(error));
                console.error(error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_CALENDAR_EVENT_CREATE_EXCEPTION, 500);
            }
        });
    }
    /**
     
     * @description updates the calendar event
     * @param updateCalendarEvent {UpdateCalendarEvent}
     * @returns CalendarEvent
     * @throws ServiceException if failed to reschdule calendar event
     */
    updateEvent(updateCalendarEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.iLoggerService.debug('GoogleCalendarService::updateEvent - Request :', updateCalendarEvent);
                const credentials = yield this.getCredentials();
                this.googleJWTClient.setCredentials(credentials);
                this.iLoggerService.debug('GoogleCalendarService::updateEvent - Google authorize result :', credentials);
                const calendarClient = googleapis_1.google.calendar('v3');
                const patchRequest = {
                    auth: this.googleJWTClient,
                    calendarId: 'primary',
                    eventId: updateCalendarEvent.eventId,
                    requestBody: {
                        end: updateCalendarEvent.endTime,
                        start: updateCalendarEvent.startTime,
                    },
                    sendNotifications: true,
                };
                if (updateCalendarEvent.attendees) {
                    patchRequest.requestBody['attendees'] = updateCalendarEvent.attendees;
                }
                const updateEventResult = yield calendarClient.events.patch(patchRequest);
                this.iLoggerService.debug('GoogleCalendarService::updateEvent - updateEventResult', updateEventResult.status);
                if (updateEventResult.data) {
                    const calendarEvent = {
                        eventId: updateEventResult.data.id,
                    };
                    return calendarEvent;
                }
            }
            catch (error) {
                this.iLoggerService.error('GoogleCalendarService::updateEvent - Error while updating calendar event', JSON.stringify(error));
                console.error(error);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_RESCHEDULE_CALENDAR_EVENT_EXCEPTION, 500);
            }
        });
    }
    /**
     
     * @description canceles calendar event
     * @param eventId {string} - Calendar Event ID
     * @returns statusCode
     * @throws ServiceException if failed to cancel calendar event
     */
    cancelEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = yield this.getCredentials();
                this.googleJWTClient.setCredentials(credentials);
                const calendarClient = googleapis_1.google.calendar('v3');
                const deleteCalendarEvent = yield calendarClient.events.delete({
                    auth: this.googleJWTClient,
                    calendarId: 'primary',
                    eventId,
                    sendNotifications: true,
                    sendUpdates: 'all'
                });
                this.iLoggerService.log('GoogleCalendarService::cancelEvent - cancelEvent response', deleteCalendarEvent.status);
                if (deleteCalendarEvent.status === 204) {
                    return deleteCalendarEvent;
                }
                else {
                    this.iLoggerService.error('GoogleCalendarService::cancelEvent - Error while canceling calendar event', deleteCalendarEvent.status);
                    throw 'Failed to cancel event';
                }
            }
            catch (error) {
                this.iLoggerService.error('GoogleCalendarService::cancelEvent - Error while canceling calendar event', error.status);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_CANCEL_CALENDAR_EVENT_EXCEPTION, 500);
            }
        });
    }
    /**
     * @description gets calendar event
     * @param eventId {string} - Calendar Event ID
     * @returns Calendar Event
     * @throws ServiceException if failed to cancel calendar event
     */
    getEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = yield this.getCredentials();
                this.googleJWTClient.setCredentials(credentials);
                const calendarClient = googleapis_1.google.calendar('v3');
                const calendarEvent = yield calendarClient.events.get({
                    auth: this.googleJWTClient,
                    calendarId: 'primary',
                    eventId
                });
                this.iLoggerService.log('GoogleCalendarService::getEvent - getEvent response', calendarEvent.status);
                if (calendarEvent.status === 200) {
                    return calendarEvent.data;
                }
                else {
                    this.iLoggerService.error('GoogleCalendarService::getEvent - Error while getting calendar event', calendarEvent.status);
                    throw 'Failed to get event';
                }
            }
            catch (error) {
                this.iLoggerService.error('GoogleCalendarService::getEvent - Error while getting calendar event', error.status);
                throw new serviceException_1.ServiceException([], errorCodes_1.ErrorCodes.ERR_API_GET_CALENDAR_EVENT_EXCEPTION, 500);
            }
        });
    }
    /**
     
     * @description gets google credentials
     * @returns Google credential
     */
    getCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            this.googleJWTClient.subject = this.appVariables.googleConfiguration.calendarEmail;
            this.googleJWTClient.scopes = this.appVariables.googleConfiguration.calendarScopes;
            const credentials = yield this.googleJWTClient.authorize();
            return credentials;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.LoggerService),
    __metadata("design:type", Object)
], GoogleCalendarService.prototype, "iLoggerService", void 0);
__decorate([
    (0, inversify_1.inject)(baseIdentifiers_1.BaseIdentifiers.AppVariables),
    __metadata("design:type", appVariables_1.AppVariables)
], GoogleCalendarService.prototype, "appVariables", void 0);
GoogleCalendarService = __decorate([
    (0, inversify_1.injectable)()
], GoogleCalendarService);
exports.GoogleCalendarService = GoogleCalendarService;
