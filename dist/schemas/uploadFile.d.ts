export default class UploadFile {
    path: string | string[];
    type: string | string[];
    folder: string | string[];
    filename: string | string[];
    size: number | number[];
    url: string | string[];
    static serialize(uploadFile: UploadFile): string | any[];
    static serialize2(uploadFile: any): any[];
}
