import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> } 
) {
  const resolvedParams = await params;
  const filename = resolvedParams.filename;
  const filePath = join(process.cwd(), "storage", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    const ext = filename.split('.').pop()?.toLowerCase();
    
    // MIME 映射字典
    const mimeTypes: Record<string, string> = {
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      jpg: "image/jpeg",
      jpeg: "image/jpeg"
    };
    const contentType = mimeTypes[ext || ""] || "application/octet-stream";

    // 核心：构建带有 CORS 和缓存控制的响应头
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        // 允许任何外部域名访问、读取该图片资源
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}