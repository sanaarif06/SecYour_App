import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from './models/file-upload.model';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  user = new User();
  userDetail = this.user.GetUserDetails();
  private basePathSecure = '/uploads/' + this.user.UserID + '/SecYour/';
  private basePath = '/uploads/' + this.user.UserID + '/General/';


  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  pushFileToStorage(fileUpload: FileUpload, isSecure: boolean): Observable<number | undefined> {
    const filePath = isSecure ? `${this.basePathSecure}/${fileUpload.file.name}` : `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);  //upload method is in AngularFireStorage

    //promises upload task
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload, isSecure);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload, isSecure: boolean): void {
    this.db.list(isSecure ? this.basePathSecure : this.basePath).push(fileUpload);
  }

  getFiles(numberItems: number, isSecure: boolean): AngularFireList<FileUpload> {
    return this.db.list(isSecure ? this.basePathSecure : this.basePath, ref => ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload, isSecure:boolean): void {
    this.deleteFileDatabase(fileUpload.key, isSecure)
      .then(() => {
        this.deleteFileStorage(fileUpload.name, isSecure);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string, isSecure:boolean): Promise<void> {
    return this.db.list(isSecure ? this.basePathSecure : this.basePath).remove(key);
  }

  private deleteFileStorage(name: string, isSecure:boolean): void {
    const storageRef = this.storage.ref(isSecure ? this.basePathSecure : this.basePath);
    storageRef.child(name).delete();
  }
}