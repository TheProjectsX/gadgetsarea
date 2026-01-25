import fs from "fs";
import path from "path";

/**
 * Deletes a file from the uploads folder.
 * @param filePath The path of the file to delete.
 */

export const deleteFile = async (filename: string) => {
    try {
        // Extract the filename from the URL
        // const filename = path.basename(new URL(fileUrl).pathname);
        const fullPath = path.join(process.cwd(), "uploads", filename);

        // console.log(filename, fullPath);

        await fs.promises.access(fullPath);
        await fs.promises.unlink(fullPath);
    } catch (error) {
        console.error(`Failed to delete file: ${filename}`, error);
    }
};
