export const eventTypeToImageMap: Record<number, string> = {
    0: 'assets/img/presentationPage/imgMorpion.jpg',
    1: 'assets/img/presentationPage/imgMotus.jpg',
    2: 'assets/img/presentationPage/imgSondage.jpg',
  };
  
  export function getImageForEventType(type: number): string {
    return eventTypeToImageMap[type];
  }