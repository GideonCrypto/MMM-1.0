import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly service: NotesService) {}

    @Post('createNote')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateNoteDto],
        })
    createNote(@Body() createNoteDto: CreateNoteDto) {
        try {
            return this.service.createNote(createNoteDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Patch('updateNote')
    @ApiOkResponse({
            description: 'Success',
            type: [UpdateNoteDto],
        })
    updateNote(@Body() updateNoteDto: UpdateNoteDto) {
        try {
            return this.service.updateNote(updateNoteDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':noteId')
    @ApiOkResponse({ description: 'Note deleted successfully' })
    async deleteNote(@Param('noteId') noteId: string) {
        try {
            const result = await this.service.deleteNote(noteId);
            return result;
        } catch (error) {
            console.error('Delete note error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('link/:linkId')
    @ApiOkResponse({
        description: 'Note by link id',
        example: {
            id: '5d8cf74b-2395-4719-ba4f-84a97d70ca7a',
            name: 'Test',
            userId: '08ffce73-4e68-4c90-8e09-c77722dc6c80',
            createdAt: '2025-10-14T11:37:52.683Z',
            updatedAt: '2025-10-14T11:52:44.784Z',
            isArchived: false,
            linkedTo: '08ffce73-4e68-4c90-8e09-c77722dc6c80',
            path: 'C:\\Users\\*****\\Desktop\\MoneyMovementMonitor\\mmm-1\\apps\\backend\\vault\\notes\\Test.md',
            marks: [
                '35198333-3ff5-46c7-8eef-3c97d6b7652f',
                '034caa3f-042b-4f36-a0dd-f1cd2f2e6c31',
            ],
        },
    })
    async getNoteByLink(@Param('linkId') linkId: string) {
        try {
            const result = await this.service.getNoteByLink(linkId);
            return result;
        } catch (error) {
            console.error('Delete note error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('note/:noteId')
    @ApiOkResponse({
        description: 'Note by note id',
        example: {
            id: '5d8cf74b-2395-4719-ba4f-84a97d70ca7a',
            name: 'Test',
            userId: '08ffce73-4e68-4c90-8e09-c77722dc6c80',
            createdAt: '2025-10-14T11:37:52.683Z',
            updatedAt: '2025-10-14T11:52:44.784Z',
            isArchived: false,
            linkedTo: '08ffce73-4e68-4c90-8e09-c77722dc6c80',
            path: 'C:\\Users\\*****\\Desktop\\MoneyMovementMonitor\\mmm-1\\apps\\backend\\vault\\notes\\Test.md',
            marks: [
                '35198333-3ff5-46c7-8eef-3c97d6b7652f',
                '034caa3f-042b-4f36-a0dd-f1cd2f2e6c31',
            ],
        },
    })
    async getNoteById(@Param('noteId') noteId: string) {
        try {
            const result = await this.service.getNoteById(noteId);
            return result;
        } catch (error) {
            console.error('Delete note error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('user/:userId')
    @ApiOkResponse({
        description: 'Notes by user id',
        example: {
            id: '5d8cf74b-2395-4719-ba4f-84a97d70ca7a',
            name: 'Test',
            userId: '08ffce73-4e68-4c90-8e09-c77722dc6c80',
            createdAt: '2025-10-14T11:37:52.683Z',
            updatedAt: '2025-10-14T11:52:44.784Z',
            isArchived: false,
            linkedTo: '08ffce73-4e68-4c90-8e09-c77722dc6c80',
            path: 'C:\\Users\\*****\\Desktop\\MoneyMovementMonitor\\mmm-1\\apps\\backend\\vault\\notes\\Test.md',
            marks: [
                '35198333-3ff5-46c7-8eef-3c97d6b7652f',
                '034caa3f-042b-4f36-a0dd-f1cd2f2e6c31',
            ],
        },
    })
    async getNoteByUser(@Param('userId') userId: string) {
        try {
            const result = await this.service.getNoteByUser(userId);
            return result;
        } catch (error) {
            console.error('Delete note error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
