import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
    private vaultDir = path.join(process.cwd(), 'vault', 'notes');// storage dir

    constructor(private prisma: PrismaService,) {
        if (!fs.existsSync(this.vaultDir)) {
            fs.mkdirSync(this.vaultDir, { recursive: true });
        }// check and create dir / { recursive: true } - create folder chain
    }

    async createNote(dto: CreateNoteDto){
        const id = uuidv4();//nead for meta in obs and db
        const now = new Date().toISOString();

        let tagNames: string[] = [];
        if (dto.marks?.length) {
            const tags = await this.prisma.marks.findMany({
                where: { id: { in: dto.marks } },
                select: { name: true },
            });
            tagNames = tags.map((t) => t.name);
        }// get tag names by id

        const frontmatter = {
            id,
            name: dto.name,
            linkedTo: dto.linkedTo,
            tags:  tagNames,
            createdAt: now,
            updatedAt: now,
        }//gen meta data for obsidian

        const mdContent = matter.stringify(dto.content || '', frontmatter);//gen file with meta data
        const fileName = dto.name + '.md';
        const filePath = path.join(this.vaultDir, fileName);

        fs.writeFileSync(filePath, mdContent, 'utf8');//save .md file

        const note = await this.prisma.notes.create({
            data: {
                id,
                name: dto.name,
                userId: dto.userId,
                linkedTo: dto.linkedTo,
                createdAt: new Date(now),
                updatedAt: new Date(now),
                path: filePath,
                marks: JSON.stringify(dto.marks)
            },
        });// save meta in db 

        return note;
    }

    async updateNote(dto: UpdateNoteDto){
        const note = await this.prisma.notes.findUnique({ where: { 
            id: dto.id,
            userId: dto.userId
        } });//check db
        if (!note) throw new NotFoundException('Note not found');

        const filePath = note.path;
        if (!fs.existsSync(filePath)) throw new NotFoundException('File not found');

        let tagNames: string[] = [];
        if (dto.marks?.length) {
            const tags = await this.prisma.marks.findMany({
                where: { id: { in: dto.marks } },
                select: { name: true },
            });
            tagNames = tags.map((t) => t.name);
        }// get tag names by id

        const fileContent = fs.readFileSync(filePath, 'utf8');//read file
        const parsed = matter(fileContent);

        const updatedFrontmatter = {
            ...parsed.data,
            name: dto.name ?? parsed.data.name,
            tags: tagNames,
            updatedAt: new Date().toISOString(),
        };// update meta

        const newContent = dto.content ?? parsed.content;
        const updatedFile = matter.stringify(newContent, updatedFrontmatter);// update content and meta

        fs.writeFileSync(filePath, updatedFile, 'utf8');// save .md file

        const updatedNote = await this.prisma.notes.update({
            where: { id: dto.id },
            data: {
                name: updatedFrontmatter.name,
                updatedAt: new Date(),
                marks: JSON.stringify(dto.marks)
            },
        });// update meta in db

        return updatedNote;
    }

    async deleteNote(id: string) {
        const note = await this.prisma.notes.findUnique({ where: { id } });
        if (!note) throw new NotFoundException('Note not found');

        const filePath = note.path;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.prisma.notes.delete({ where: { id } });

        return { success: true, message: 'Note deleted' };
    }

    async getNoteByLink(id: string) {
        const note = await this.prisma.notes.findMany({ where: { linkedTo: id } });
        if (!note) throw new NotFoundException('Note not found');
        return note
    }

    async getNoteById(id: string) {
        const note = await this.prisma.notes.findFirst({ where: { id } });
        if (!note) throw new NotFoundException('Note not found');
        return note
    }

    async getNoteByUser(id: string) {
        const note = await this.prisma.notes.findMany({ where: { userId: id } });
        if (!note) throw new NotFoundException('Note not found');
        return note
    }
}
