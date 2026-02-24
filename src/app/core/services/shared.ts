import { Injectable } from '@angular/core';
import { HomePage } from 'src/app/pages/home/home.page';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  OnchangeGuestStatus(isGuest: boolean) {
    HomePage.prototype.isGuest = isGuest;
  }
  getGuestStatus(): boolean {
    return HomePage.prototype.isGuest;
  }
}
