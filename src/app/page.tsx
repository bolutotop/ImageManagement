import { getImages } from "./actions";
import ImageManagerClient from "./ImageManagerClient";

export const revalidate = 0;

export default async function ImageManager() {
  const initialImages = await getImages();

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* 头部区域 */}
        <header className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Image</h1>
            <p className="text-gray-500 mt-1.5 text-sm">A total of {initialImages.length} images.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-mono text-sm text-gray-500">
            IMG
          </div>
        </header>

        {/* 客户端交互区域 */}
        <ImageManagerClient initialImages={initialImages} />

      </div>
    </main>
  );
}