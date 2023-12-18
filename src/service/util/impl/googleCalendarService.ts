import { injectable, inject } from 'inversify';
import { ICalendarService } from '../iCalendarService';
import { CreateCalendarEvent, UpdateCalendarEvent } from '../../../types/request';
import { ILoggerService } from '../iLoggerService';
import { BaseIdentifiers } from '../../../config/baseIdentifiers';
import { ServiceException } from '../../../exception/serviceException';
import { ErrorCodes } from '../../../constants/errorCodes';
import { google } from 'googleapis';
import { CalendarEvent } from '../../../types/entity';
import { AppVariables } from '../../../config/appVariables';

/**

 * @description Google Calendar service interface

 */
@injectable()
export class GoogleCalendarService implements ICalendarService {


    @inject(BaseIdentifiers.LoggerService)
    private iLoggerService: ILoggerService;

    @inject(BaseIdentifiers.AppVariables)
    private appVariables: AppVariables;

    private googleJWTClient = new google.auth.JWT(
        'GooglePrivateKey.client_email',
        '../../../private/google_privatekey',
        'GooglePrivateKey.private_key',
        null,
        null,
        'GooglePrivateKey.private_key_id',
    );

    /**

     * @description create calendar event and send update to all participants
     * @param createCalendarEvent {CreateCalendarEvent} - CreateCalendarEvent object
     * @returns CreateCalendarEventResponse
     * @throws ServiceException if failed to create calendar event
     */
    public async createEvent(createCalendarEvent: CreateCalendarEvent): Promise<CalendarEvent> {
        try {
            this.iLoggerService.debug('GoogleCalendarService::createEvent - Request :', createCalendarEvent);
            const credentials = await this.getCredentials();
            this.googleJWTClient.setCredentials(credentials);
            this.iLoggerService.debug('GoogleCalendarService::createEvent - Google authorize result :', credentials);
            const calendarClient = google.calendar('v3');
            const insertEventResult = await calendarClient.events.insert({
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
                const calendarEvent: CalendarEvent = {
                    eventId: insertEventResult.data.id,
                };
                return calendarEvent;
            }
        } catch (error) {
            this.iLoggerService.error('GoogleCalendarService::createEvent - Error while calendar event', JSON.stringify(error));
            console.error(error);
            throw new ServiceException([], ErrorCodes.ERR_CALENDAR_EVENT_CREATE_EXCEPTION, 500);
        }
    }

    /**
     
     * @description updates the calendar event
     * @param updateCalendarEvent {UpdateCalendarEvent}
     * @returns CalendarEvent
     * @throws ServiceException if failed to reschdule calendar event
     */
    public async updateEvent(updateCalendarEvent: UpdateCalendarEvent): Promise<CalendarEvent> {
        try {
            this.iLoggerService.debug('GoogleCalendarService::updateEvent - Request :', updateCalendarEvent);
            const credentials = await this.getCredentials();
            this.googleJWTClient.setCredentials(credentials);
            this.iLoggerService.debug('GoogleCalendarService::updateEvent - Google authorize result :', credentials);
            const calendarClient = google.calendar('v3');
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
            const updateEventResult = await calendarClient.events.patch(patchRequest);
            this.iLoggerService.debug('GoogleCalendarService::updateEvent - updateEventResult', updateEventResult.status);
            if (updateEventResult.data) {
                const calendarEvent: CalendarEvent = {
                    eventId: updateEventResult.data.id,
                };
                return calendarEvent;
            }
        } catch (error) {
            this.iLoggerService.error('GoogleCalendarService::updateEvent - Error while updating calendar event',
                JSON.stringify(error));
            console.error(error);
            throw new ServiceException([], ErrorCodes.ERR_API_RESCHEDULE_CALENDAR_EVENT_EXCEPTION, 500);
        }
    }

    /**
     
     * @description canceles calendar event
     * @param eventId {string} - Calendar Event ID
     * @returns statusCode
     * @throws ServiceException if failed to cancel calendar event
     */
    public async cancelEvent(eventId: string): Promise<any> {
        try {
            const credentials = await this.getCredentials();
            this.googleJWTClient.setCredentials(credentials);
            const calendarClient = google.calendar('v3');
            const deleteCalendarEvent = await calendarClient.events.delete({
                auth: this.googleJWTClient,
                calendarId: 'primary',
                eventId,
                sendNotifications: true,
                sendUpdates: 'all'
            });
            this.iLoggerService.log('GoogleCalendarService::cancelEvent - cancelEvent response', deleteCalendarEvent.status);
            if (deleteCalendarEvent.status === 204) {
                return deleteCalendarEvent;
            } else {
                this.iLoggerService.error('GoogleCalendarService::cancelEvent - Error while canceling calendar event',
                    deleteCalendarEvent.status);
                throw 'Failed to cancel event';
            }
        } catch (error) {
            this.iLoggerService.error('GoogleCalendarService::cancelEvent - Error while canceling calendar event', error.status);
            throw new ServiceException([], ErrorCodes.ERR_API_CANCEL_CALENDAR_EVENT_EXCEPTION, 500);
        }
    }

    /**
     * @description gets calendar event
     * @param eventId {string} - Calendar Event ID
     * @returns Calendar Event
     * @throws ServiceException if failed to cancel calendar event
     */
    public async getEvent(eventId: string): Promise<any> {
        try {
            const credentials = await this.getCredentials();
            this.googleJWTClient.setCredentials(credentials);
            const calendarClient = google.calendar('v3');
            const calendarEvent = await calendarClient.events.get({
                auth: this.googleJWTClient,
                calendarId: 'primary',
                eventId
            });
            this.iLoggerService.log('GoogleCalendarService::getEvent - getEvent response', calendarEvent.status);
            if (calendarEvent.status === 200) {
                return calendarEvent.data;
            } else {
                this.iLoggerService.error('GoogleCalendarService::getEvent - Error while getting calendar event',
                    calendarEvent.status);
                throw 'Failed to get event';
            }
        } catch (error) {
            this.iLoggerService.error('GoogleCalendarService::getEvent - Error while getting calendar event', error.status);
            throw new ServiceException([], ErrorCodes.ERR_API_GET_CALENDAR_EVENT_EXCEPTION, 500);
        }
    }

    /**
     
     * @description gets google credentials
     * @returns Google credential
     */
    private async getCredentials(): Promise<any> {
        this.googleJWTClient.subject = this.appVariables.googleConfiguration.calendarEmail;
        this.googleJWTClient.scopes = this.appVariables.googleConfiguration.calendarScopes;
        const credentials = await this.googleJWTClient.authorize();
        return credentials;
    }
}
