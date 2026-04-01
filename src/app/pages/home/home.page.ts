import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuestBannerComponent } from '../../components/guest-banner/guest-banner.component';
import { BottomNavigationComponent } from 'src/app/components/bottom-navigation/bottom-navigation.component';
import { star, notifications, locationOutline, chevronForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavController } from '@ionic/angular/standalone';
import { Shared } from 'src/app/core/services/shared/shared';
interface Category {
  name: string;
  icon: string;
  color: string;
}

interface Freelancer {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  image: string;
  skills: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [GuestBannerComponent,CommonModule,FormsModule,IonicModule, BottomNavigationComponent]
})
export class HomePage {
  @Output() freelancerClick = new EventEmitter<number>();
  @Output() categoryClick = new EventEmitter<string>();
  @Output() signIn = new EventEmitter<void>();

  categories: Category[] = [
    { name: 'Design', icon: '🎨', color: 'purple' },
    { name: 'Development', icon: '💻', color: 'blue' },
    { name: 'Writing', icon: '✍️', color: 'green' },
    { name: 'Marketing', icon: '📊', color: 'orange' },
    { name: 'Video', icon: '🎥', color: 'red' },
    { name: 'Music', icon: '🎵', color: 'pink' }
  ];

  featuredFreelancers: Freelancer[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'UI/UX Designer',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 85,
      location: 'San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1765648684604-fd0accdbe617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGZyZWVsYW5jZXJ8ZW58MXx8fHwxNzcwMTk5NDkyfDA&ixlib=rb-4.1.0&q=80&w=400',
      skills: ['Figma', 'Adobe XD', 'Sketch']
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      rating: 5.0,
      reviews: 203,
      hourlyRate: 95,
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1752170080622-18196de87763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzcwMTQ4NjM1fDA&ixlib=rb-4.1.0&q=80&w=400',
      skills: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: 3,
      name: 'Emma Davis',
      title: 'Content Writer',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 65,
      location: 'Austin, TX',
      image: 'https://images.unsplash.com/photo-1769694609721-98f8bab9735a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHdyaXRlcnxlbnwxfHx8fDE3NzAxOTk0OTR8MA&ixlib=rb-4.1.0&q=80&w=400',
      skills: ['SEO', 'Copywriting', 'Blogging']
    },
    {
      id: 4,
      name: 'Alex Martinez',
      title: 'Graphic Designer',
      rating: 4.9,
      reviews: 156,
      hourlyRate: 75,
      location: 'Los Angeles, CA',
      image: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTAyN3ww&ixlib=rb-4.1.0&q=80&w=400',
      skills: ['Illustrator', 'Photoshop', 'Branding']
    }
  ];
  
  constructor(private navCtrl: NavController, private shared: Shared) {
    addIcons({ star, notifications, locationOutline, chevronForwardOutline });
  }
  activeTab = 'home';
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }
  onFreelancerClick(id: number): void {
    this.freelancerClick.emit(id);
  }

  onCategoryClick(category: string): void {
    this.categoryClick.emit(category);
  }

  onSignInClick(): void {
    this.navCtrl.navigateForward('/login');
    this.signIn.emit();
  }

  get isGuest(): boolean {
    return this.shared.getGuestStatus();
  }

  set isGuest(value: boolean) {
    this.shared.OnchangeGuestStatus(value);
  }

  ngOnInit(): void {
    console.log('Guest status:', this.shared.getGuestStatus());
  }
}
