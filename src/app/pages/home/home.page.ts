import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuestBannerComponent } from '../../components/guest-banner/guest-banner.component';
import { BottomNavigationComponent } from 'src/app/components/bottom-navigation/bottom-navigation.component';
import { star, notifications, locationOutline, chevronForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavController } from '@ionic/angular/standalone';
import { Shared } from 'src/app/core/services/shared/shared';
import { Category, Freelancer } from 'src/app/models/home.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/core/services/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [GuestBannerComponent,CommonModule,FormsModule,IonicModule, BottomNavigationComponent]
})
export class HomePage {
  @Output() freelancerClick = new EventEmitter<string>();
  @Output() categoryClick = new EventEmitter<string>();
  @Output() signIn = new EventEmitter<void>();

  isLoading = false;
  errorMessage = '';
  searchQuery = '';
  selectedCategory = 'All';

  freelancers: Freelancer[] = [];

  categories: Category[] = [
    { name: 'All', icon: '✨', color: 'gray' },
    { name: 'Design', icon: '🎨', color: 'purple' },
    { name: 'Development', icon: '💻', color: 'blue' },
    { name: 'Writing', icon: '✍️', color: 'green' },
    { name: 'Marketing', icon: '📊', color: 'orange' },
    { name: 'Video', icon: '🎥', color: 'red' },
    { name: 'Music', icon: '🎵', color: 'pink' }
  ];

  featuredFreelancers: Freelancer[] = [];
  filteredFreelancers: Freelancer[] = [];
  
  constructor(
    private navCtrl: NavController,
    private shared: Shared,
    private userService: UserService,
  ) {
    addIcons({ star, notifications, locationOutline, chevronForwardOutline });
  }

  activeTab = 'home';

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  onFreelancerClick(id: string): void {
    this.freelancerClick.emit(id);
  }

  onCategoryClick(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
    this.categoryClick.emit(category);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private loadFreelancers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getFreelancers().subscribe({
      next: (users) => {
        const mapped = users.map((user) => this.toFreelancer(user));
        this.freelancers = mapped;
        this.featuredFreelancers = this.selectFeaturedFreelancers(mapped);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load freelancers.';
        this.freelancers = [];
        this.featuredFreelancers = [];
        this.filteredFreelancers = [];
        this.isLoading = false;
      },
    });
  }

  private toFreelancer(user: User): Freelancer {
    return {
      id: user.id,
      name: user.name,
      bio: user.bio || 'Freelancer available for new projects.',
      avatar: user.avatar || 'assets/default-avatar.png',
      subscription: user.subscription || 'free',
      createdAt: user.createdAt,
      category: this.inferCategoryFromBio(user.bio),
    };
  }

  private inferCategoryFromBio(bio: string): string {
    const text = (bio || '').toLowerCase();

    if (/(design|ui|ux|figma|illustrator|photoshop|branding)/.test(text)) return 'Design';
    if (/(develop|frontend|backend|full.?stack|react|angular|node|flutter|mobile|web)/.test(text)) return 'Development';
    if (/(write|writer|content|copy|seo|blog)/.test(text)) return 'Writing';
    if (/(market|marketing|social media|ads|growth)/.test(text)) return 'Marketing';
    if (/(video|edit|animation|premiere|after effects|film)/.test(text)) return 'Video';
    if (/(music|audio|producer|sound|mix|master)/.test(text)) return 'Music';

    return 'Development';
  }

  private selectFeaturedFreelancers(rows: Freelancer[]): Freelancer[] {
    const premium = rows.filter((f) => (f.subscription || '').toLowerCase() === 'premium');
    const latest = [...rows].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const map = new Map<string, Freelancer>();
    premium.forEach((item) => map.set(item.id, item));
    latest.forEach((item) => {
      if (map.size < 12) {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values());
  }

  private applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredFreelancers = this.featuredFreelancers.filter((freelancer) => {
      const matchesCategory =
        this.selectedCategory === 'All' || freelancer.category === this.selectedCategory;

      const matchesSearch =
        !query ||
        freelancer.name.toLowerCase().includes(query) ||
        freelancer.bio.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }

  onSignInClick(): void {
    this.navCtrl.navigateForward('/login');
    this.signIn.emit();
  }

  get isGuest(): boolean {
    return !localStorage.getItem('token');
  }

  set isGuest(value: boolean) {
    this.shared.OnchangeGuestStatus(value);
  }

  ngOnInit(): void {
    this.loadFreelancers();
  }
}
