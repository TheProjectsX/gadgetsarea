import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { deleteFile } from "../file/delete";

export const uploadToImgbb = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const files = (
            req.file ? [req.file] : req.files
        ) as Express.Multer.File[];
        console.log(files);

        if (!files) return next();

        const results = await Promise.all(
            files.map(async (file) => {
                const form = new FormData();
                form.append("image", file.buffer.toString("base64"));

                const response = await fetch(
                    `https://api.imgbb.com/1/upload?&key=${config.imgbb.api_key}`,
                    {
                        method: "POST",
                        body: form,
                    },
                );

                const data = await response.json();
                return data;
            }),
        );

        const formatted = results.map((item) => item.data.display_url);

        if (req.file) {
            req.file = formatted[0];
        } else {
            req.files = formatted;
        }

        // Delete Files - Async
        files.forEach((file) => deleteFile(file.filename));

        next();
    } catch (err) {
        next(err);
    }
};
