import multer from "multer";

import { fileFilter } from "./filter";

export const upload = multer({
    // storage: createStorage(),
    storage: multer.memoryStorage(), // using in-memory upload as we are sending blob to imgBB for this project
    fileFilter: fileFilter,
});

// const example = upload.fields([{ name: "galleryImage", maxCount: 5 }]);

// const anotherExample = upload.single("avatar");

// const uploadRefunds = multer({ storage: createStorage("refund") });

// const uploadMultiple = uploadRefunds.fields([
//   { name: "galleryImage", maxCount: 5 },
// ]);
