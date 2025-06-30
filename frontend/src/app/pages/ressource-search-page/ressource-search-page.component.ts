import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-ressource-search-page',
  imports: [
    MatChipsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './ressource-search-page.component.html',
  styleUrl: './ressource-search-page.component.scss',
  animations: [
    trigger('slideUp', [
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(-40px)' }))
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RessourceSearchPageComponent {

  totalItems : number = 100; // à remplacer dynamiquement depuis ton API
  pageSize : number = 5;
  currentPage : number = 0;

  categories = [
    {
      'id': '1234-5678-9101-1121',
      'name': 'Books',
      'iconPath': 'book',
      'color': '#f44336'
    },
    {
      'id': '4321-0987-6543-2109',
      'name': 'Articles',
      'iconPath': 'article',
      'color': '#2196f3'
    },
    {
      'id': '789a-bcde-f012-3456',
      'name': 'Videos',
      'iconPath': 'video_library',
      'color': '#4caf50'
    },
    {
      'id': '4321-0987-6543-2109',
      'name': 'Podcasts',
      'iconPath': 'podcasts',
      'color': '#ff9800'
    }
  ]

  articles = [
    {
      'id': '1345-6789-0123-4567',
      'title': 'Angular Basics',
      'content_text': 'Learn the basics of Angular framework.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/287/500/500.jpg?hmac=_3noAomaHvNHwr4FpelZX-90Cw1OEmo2ovuVn6bAHKk',
      'creator': {
        'id': 'creator-1234',
        'username': 'john_doe',
      },
      'created_at': new Date('2023-10-01T12:00:00Z'),
      'isLiked': false,
      'nbLikes': 10,
      'nbComments': 2,
    },
    {
      'id': '2345-6789-0123-4567',
      'title': 'Advanced Angular Techniques',
      'content_text': 'Explore advanced techniques in Angular development.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/916/500/500.jpg?hmac=4UE8crspiGEZy1orHMuK4RaFvIMfah7NGfJol8rA54Q',
      'creator': {
        'id': 'creator-5678',
        'username': 'jane_doe',
      },
      'created_at': new Date('2023-10-02T12:00:00Z'),
      'isLiked': true,
      'nbLikes': 5,
      'nbComments': 1,
    },
    {
      'id': '3456-7890-1234-5678',
      'title': 'Angular Performance Tips',
      'content_text': 'Tips for optimizing Angular applications for better performance.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/1001/500/500.jpg?hmac=u-024f0NoeQ0OX_zZmM_uitzrTCy9Vlk_uyEPfExwfw',
      'creator': {
        'id': 'creator-9101',
        'username': 'alice_smith',
      },
      'created_at': new Date('2023-10-03T12:00:00Z'),
      'isLiked': false,
      'nbLikes': 8,
      'nbComments': 3,
    },
    {
      'id': '4567-8901-2345-6789',
      'title': 'Angular Forms Deep Dive',
      'content_text': 'A deep dive into Angular forms and validation.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/374/500/500.jpg?hmac=UEFinCg6duh6tF4wgW6qS0_BI4nu0eXZ5hIBgM1mTeY',
      'creator': {
        'id': 'creator-1121',
        'username': 'bob_jones',
      },
      'created_at': new Date('2023-10-04T12:00:00Z'),
      'isLiked': true,
      'nbLikes': 12,
      'nbComments': 4,
    },
    {
      'id': '5678-9012-3456-7890',
      'title': 'Building Angular Applications Building Angular Applications Building Angular Applications',
      'content_text': 'A comprehensive guide to building applications with Angular.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/291/500/500.jpg?hmac=3nm3iMtYPcTTOd82KIBKSStqd_rKLblidY6EZrnD-OE',
      'creator': {
        'id': 'creator-1314',
        'username': 'charlie_brown',
      },
      'created_at': new Date('2023-10-05T12:00:00Z'),
      'isLiked': false,
      'nbLikes': 999999,
      'nbComments': 290099,
    },
    {
      'id': '6789-0123-4567-8901',
      'title': 'Angular Routing and Navigation',
      'content_text': 'Understanding routing and navigation in Angular applications.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/939/500/500.jpg?hmac=QRfDqJwmTJlKh70oyaHvoQLZiBkXWim-8C6PtQbaOEs',
      'creator': {
        'id': 'creator-1516',
        'username': 'dave_white',
      },
      'created_at': new Date('2023-10-06T12:00:00Z'),
      'isLiked': true,
      'nbLikes': 20,
      'nbComments': 6,
    },
    {
      'id': '7890-1234-5678-9012',
      'title': 'State Management in Angular',
      'content_text': 'An overview of state management techniques in Angular.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/921/500/500.jpg?hmac=-SjeuviO0v4DmC3seluXVcpz2aBPxIF_HlE5ACoWrV4',
      'creator': {
        'id': 'creator-1718',
        'username': 'eve_black',
      },
      'created_at': new Date('2023-10-07T12:00:00Z'),
      'isLiked': false,
      'nbLikes': 18,
      'nbComments': 5,
    },
    {
      'id': '8901-2345-6789-0123',
      'title': 'Testing Angular Applications',
      'content_text': 'Best practices for testing Angular applications.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/683/500/500.jpg?hmac=JLlUB72gCvxBDgP9QdizkjP0FxF_lJOvE3M-QPsq7hk',
      'creator': {
        'id': 'creator-1920',
        'username': 'frank_green',
      },
      'created_at': new Date('2023-10-08T12:00:00Z'),
      'isLiked': true,
      'nbLikes': 2504,
      'nbComments': 266,
    },
    {
      'id': '9012-3456-7890-1234',
      'title': 'Angular Security Best Practices',
      'content_text': 'Security best practices for Angular applications.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/400/500/500.jpg?hmac=7e6dgXtUAgZ6bNmfdrXTiJjJrDvnEz-gUpwIUFhWIGY',
      'creator': {
        'id': 'creator-2122',
        'username': 'grace_yellow',
      },
      'created_at': new Date('2023-10-09T12:00:00Z'),
      'isLiked': false,
      'nbLikes': 30,
      'nbComments': 10,
    },
    {
      'id': '0123-4567-8901-2345',
      'title': 'Angular Internationalization',
      'content_text': 'Implementing internationalization in Angular applications.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/454/500/500.jpg?hmac=jeGzMQ6lOuO8jN6YOL5KejAD7EF2nrFJ6qk-WnYUyK4',
      'creator': {
        'id': 'creator-2324',
        'username': 'hank_purple',
      },
      'created_at': new Date('2023-10-10T12:00:00Z'),
      'isLiked': true,
      'nbLikes': 45,
      'nbComments': 12,
    },
    {
      'id': '1234-5678-9012-3456',
      'title': 'Angular Animations',
      'content_text': 'Creating animations in Angular applications.',
      'category': 'Articles',
      'imageUrl': 'https://fastly.picsum.photos/id/77/500/500.jpg?hmac=tSoa4RHbrWHe6CfA-uOJZpiHj-3e9OoYJ91vBlFaMD8',
      'creator': {
        'id': 'creator-2526',
        'username': 'ian_cyan',
      },
      'created_at': new Date('2023-05-11T12:00:00Z'),
      'isLiked': false,
      'nbLikes': 60,
      'nbComments': 20,
    }
  ]

  constructor(
    private CategoryService: CategoryService
  ) {}

  // Au lancement du composant, on initialise les articles
  ngOnInit() {
    this.fetchCategories();
    this.fetchRessources();
  }

  // Detecte le clic sur le bouton "like" et inverse l'état du like
  toggleLike(article: any) {
    article.isLiked = !article.isLiked;
    if (article.isLiked) {
      article.nbLikes++;
    }
    else {
      article.nbLikes--;
    }
  }

  // Méthode pour formater le nombre de likes/comments
  formatCount(count: number): string {
    if (count >= 1000000) {
      return Math.floor(count / 100000) / 10 + 'M';
    }
    if (count >= 1000) {
      return Math.floor(count / 1000) + 'k';
    }
    return count.toString();
  }

  // Action pour gérer le changement de page
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchRessources(); // méthode qui fera ton appel API
  }

  // Récupère les categories depuis l'API
  fetchCategories() {
    console.log(`Fetching articles for page ${this.currentPage + 1} with page size ${this.pageSize}`);  
    let categories = this.CategoryService.getAll().subscribe({
      next: (response) => {
        console.log('Categories fetched successfully:', response);
      }
      ,
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });  
  }

  // Récupère les ressources depuis l'API
  fetchRessources() {
  }

}
