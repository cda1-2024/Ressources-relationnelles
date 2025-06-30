import { CommentSimple } from "../comment/comment.model";

// * ////////////////////
// *  Entity 
// * ////////////////////

export interface RessourceSimple {
  id: string;
  title: string;
  category: string;
  content_link: string;
  content_text: string;
  created_at: Date;
  creator: {
    id: string;
    username: string;
  }
  status: {
    id: string;
    label: string;
  }
  visibility: {
    id: string;
    label: string;
  }
  type: {
    id: string;
    label: string;
  }
}

export interface Ressource extends Omit<RessourceSimple, 'category'> {
    validator: {
        id: string;
        username: string;
    }
    comments: CommentSimple[];
    category: {
        id: string;
        title: string;
    }
}

// * ////////////////////
// *  Responses 
// * ////////////////////

export interface SingleRessourceResponse extends Ressource {}

export interface MultipleRessourceResponse {
    ressources: RessourceSimple[];
    pageNumber: number;
    pageSize: number;
    totalNumberRessources: number;
    totalPages: number;
}

// * ////////////////////
// *  Requests 
// * ////////////////////

// Requete de creation d'une ressource
export interface CreateRessourceRequest {
    title: string;
    content_text: string;
    content_link: string;
    category: string;
    visibility: number;
    type: number;
}

// Requete de modification d'une ressource
export interface UpdateRessourceRequest {
    title: string;
    content_text: string;
    content_link: string;
    category: string;
    visibility: number;
    status: number;
}

// Requete d'action sur une ressource (like, bookmark, favorite, etc.)
export interface CollectRessourceRequest {
    type: string;
}

// Requete de validation d'une ressource par un admin
export interface ValidateRessourceRequest{
    validate: boolean;
}

