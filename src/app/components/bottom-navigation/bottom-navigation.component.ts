import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  homeOutline,
  home,
  chatbubbleOutline,
  chatbubble,
  briefcaseOutline,
  briefcase,
  personOutline,
  person,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class BottomNavigationComponent {
  @Input() currentTab: string = 'home';
  @Output() tabChange = new EventEmitter<string>();

  tabs: Tab[] = [
    { id: 'home',     label: 'Home',     icon: 'home'       },
    { id: 'messages', label: 'Messages', icon: 'chatbubble' },
    { id: 'projects', label: 'Projects', icon: 'briefcase'  },
    { id: 'profile',  label: 'Profile',  icon: 'person'     },
  ];

  constructor() {
    // 👇 register every icon variant you use
    addIcons({
      home,
      'home-outline': homeOutline,
      chatbubble,
      'chatbubble-outline': chatbubbleOutline,
      briefcase,
      'briefcase-outline': briefcaseOutline,
      person,
      'person-outline': personOutline,
    });
  }

  onTabChange(tabId: string): void {
    this.tabChange.emit(tabId);
  }
}