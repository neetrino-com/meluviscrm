import { prisma } from '@/lib/prisma';
import { FileType } from '@prisma/client';

export const attachmentService = {
  async create(
    apartmentId: number,
    fileType: FileType,
    fileUrl: string,
    fileName?: string,
    fileSize?: number,
    md5Hash?: string
  ) {
    return await prisma.apartmentAttachment.create({
      data: {
        apartmentId,
        fileType,
        fileUrl,
        fileName,
        fileSize,
        md5Hash,
      },
    });
  },

  async delete(id: number) {
    return await prisma.apartmentAttachment.delete({
      where: { id },
    });
  },

  async getByApartmentId(apartmentId: number) {
    return await prisma.apartmentAttachment.findMany({
      where: { apartmentId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: number) {
    return await prisma.apartmentAttachment.findUnique({
      where: { id },
    });
  },
};
