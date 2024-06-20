import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class FileDownloadService {
    constructor() {}
   
    public async downloadFromURL(url: Blob, fileName: string) {
        const link = window.URL.createObjectURL(url);
        const ahref = document.createElement('a');

        document.body.append(ahref);
        ahref.setAttribute('style', 'display: none');
        ahref.href = link;
        ahref.download = fileName;
        ahref.click();

        window.URL.revokeObjectURL(link);
        ahref.remove();
    }
}
