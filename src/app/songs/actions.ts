'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSong(formData: FormData) {
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const content = formData.get('content') as string;
    const key = formData.get('key') as string;

    if (!title || !artist || !content) {
        throw new Error('Missing required fields');
    }

    const song = await prisma.song.create({
        data: {
            title,
            artist,
            content,
            key,
        },
    });

    revalidatePath('/');
    return song;
}

export async function updateSong(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const content = formData.get('content') as string;
    const key = formData.get('key') as string;

    await prisma.song.update({
        where: { id },
        data: {
            title,
            artist,
            content,
            key,
        },
    });

    revalidatePath(`/songs/${id}`);
    revalidatePath('/');
}

export async function deleteSong(id: string) {
    await prisma.song.delete({
        where: { id },
    });
    revalidatePath('/');
}
