import { CreateCalendarEvent, UpdateCalendarEvent } from '../../types/request';
import { CalendarEvent } from '../../types/entity';

/**

 * @description Calendar service interface

 */
export interface ICalendarService {

    /**

     * @description create calendar event and send update to all participants
     * @param createCalendarEvent {CreateCalendarEvent} - CreateCalendarEvent object
     * @returns CalendarEvent
     * @throws ServiceException if failed to create calendar event
     */
    createEvent(createCalendarEvent: CreateCalendarEvent): Promise<CalendarEvent>;

    /**
     
     * @description updates the calendar event
     * @param updateCalendarEvent {UpdateCalendarEvent}
     * @returns CalendarEvent
     * @throws ServiceException if failed to reschdule calendar event
     */
    updateEvent(updateCalendarEvent: UpdateCalendarEvent): Promise<CalendarEvent>;

    /**
     * @description canceles calendar event
     * @param eventId {string} - Calendar Event ID
     * @returns statusCode
     * @throws ServiceException if failed to cancel calendar event
     */
    cancelEvent(eventId: string): Promise<any>;

    /**
     * @description gets calendar event
     * @param eventId {string} - Calendar Event ID
     * @returns Calendar Event
     * @throws ServiceException if failed to cancel calendar event
     */
    getEvent(eventId: string): Promise<any>;

}
