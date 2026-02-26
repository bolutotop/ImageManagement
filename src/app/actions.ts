"use server"

import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { existsSync, mkdirSync } from "fs";

const prisma = new PrismaClient();
// [修改项 1]: 将目录移出 public，放在项目根目录的 storage 文件夹
const UPLOAD_DIR = join(process.cwd(), "storage");

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFilename = `${Date.now()}-${safeFilename}`;
  
  const filePath = join(UPLOAD_DIR, uniqueFilename);
  await writeFile(filePath, buffer);

  // URL 保持不变，交由下一步的动态路由处理
  const fileUrl = `/uploads/${uniqueFilename}`;

  await prisma.image.create({
    data: { filename: uniqueFilename, url: fileUrl, size: file.size },
  });

  revalidatePath("/");
}

export async function deleteImage(id: string, filename: string) {
  const filePath = join(UPLOAD_DIR, filename);
  try {
    if (existsSync(filePath)) await unlink(filePath);
  } catch (error) {
    console.error("文件删除失败:", error);
  }
  await prisma.image.delete({ where: { id } });
  revalidatePath("/");
}

export async function getImages() {
  return await prisma.image.findMany({ orderBy: { createdAt: "desc" } });
}