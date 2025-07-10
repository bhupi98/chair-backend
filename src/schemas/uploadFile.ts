export default class UploadFile {

    path: string | string[];

    type: string | string[];

    folder: string | string[];

    filename: string | string[];

    size: number | number[];

    url: string | string[];

    static serialize(uploadFile: UploadFile) {
        if (!uploadFile) return null;
        if (typeof uploadFile.path === "string" && uploadFile.folder && uploadFile.path) return `https://${uploadFile.folder}.s3.amazonaws.com/${uploadFile.path}`
        else if (uploadFile.path && uploadFile.path.constructor === Array) {
            const images = [];
            uploadFile.path.forEach((imgPath, index) => {
                images.push(`https://${uploadFile.folder[index]}.s3.amazonaws.com/${imgPath}`);
            })
            return images;
        }
        return null;
    }

    static serialize2(uploadFile) {   
        if (!uploadFile) return null;
        const images = [];
        uploadFile.forEach((item, index) => {
            images.push(`https://${item.folder}.s3.amazonaws.com/${item.path}`);
        })
        return images;  
    }
}
