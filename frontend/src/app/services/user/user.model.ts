export interface User {
  id: string;
  email: string;
  username: string;
  bio: string;
  profilePicture: string;
}

export interface UserFull extends User {
  role: string;
  comments: Comment[];
  createdRessources: Ressource[];
  createdEvents: Event[];
}

export interface Comment {
  message: string;
  createdAd: Date;
  author: string;
  comments: Comment[];
  ressourceId: string;
}

export interface Ressource {
  id: string;
  title: string;
  contentText: string;
  contentLink: string;
  ressourceType: string;
  visibility: string;
  status: string;
  like: number;
  createdAt: Date;
  category?: string;
}

export interface Event {
  id: string;
  title: string;
  content: string;
  tchat: string;
}
