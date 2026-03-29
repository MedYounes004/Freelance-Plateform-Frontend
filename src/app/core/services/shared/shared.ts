import { Injectable } from '@angular/core';
import { HomePage } from 'src/app/pages/home/home.page';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  private static isGuest: boolean = true;
  OnchangeGuestStatus(isGuest: boolean) {
    Shared.isGuest = isGuest;
  }
  getGuestStatus(): boolean {
    return Shared.isGuest;
  }
}
