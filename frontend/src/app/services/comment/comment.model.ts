// * ////////////////////
// *  Entity 
// * ////////////////////

export interface CommentSimple {
    id: string;
    author: {
        id: string;
        username: string;
    }
    content: string;
    created_at: Date;
}