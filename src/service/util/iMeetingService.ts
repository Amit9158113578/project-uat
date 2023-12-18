import { CreateMeetingRequest, UpdateMeetingRequest } from '../../types/request';
import { Meeting } from '../../types/entity';

/**
 
 * @description Meeting Service interface

 */
export interface IMeetingService {

    /**
     
     * @description create meeting
     * @param createMeetingRequest {CreateMeetingRequest} - meeting details
     * @returns Meeting
     * @throws ServiceException if failed to schedule meeting
     */
    createMeeting(createMeetingRequest: CreateMeetingRequest): Promise<Meeting>;

    /**
     
     * @description updates meeting
     * @param updateMeetingRequest {UpdateMeetingRequest} - meeting details
     * @returns status 204
     * @throws ServiceException if failed to update meeting
     */
    updateMeeting(updateMeetingRequest: UpdateMeetingRequest): Promise<Meeting>;

    /**
     * @description deletes meeting
     * @param meetingId {string} - meeting id
     * @returns status code 204
     * @throws ServiceException if failed to delete meeting
     */
    deleteMeeting(meetingId: string): Promise<any>;

    /**
     *
     * @description get ended meeting instances
     * @param meetingId {string} - meeting id
     * @returns status code 200
     * @throws ServiceException if failed to get meeting instances
    */
    getEndedMeetingInstances(meetingId: string): Promise<any>;

    /**
     *
     * @description get meeting details
     * @param meetingUUID {string} - meeting UUID
     * @returns status code 200
     * @throws ServiceException if failed to get meeting  details
    */
    getPastMeetingDetails(meetingUUID: string): Promise<any>;

}
