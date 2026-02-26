import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  // [强制修改 1]: params 类型必须定义为 Promise
  { params }: { params: Promise<{ filename: string }> } 
) {
  // [强制修改 2]: 必须通过 await 异步解析参数
  const resolvedParams = await params;
  const filename = resolvedParams.filename;

  const filePath = join(process.cwd(), "storage", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    
    // MIME Type 推断
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = "image/jpeg";
    if (ext === "png") contentType = "image/png";
    else if (ext === "gif") contentType = "image/gif";
    else if (ext === "webp") contentType = "image/webp";
    else if (ext === "svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}