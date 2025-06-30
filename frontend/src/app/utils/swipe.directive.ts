import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[appSwipeScroll]' })
export class SwipeScrollDirective {
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // curseur “grab” par défaut
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(evt: MouseEvent) {
    this.isDown = true;
    this.startX = evt.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    evt.preventDefault();
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    this.isDown = false;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(evt: MouseEvent) {
    if (!this.isDown) return;
    const x = evt.pageX - this.el.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // ajustez la vitesse
    this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
    evt.preventDefault();
  }
}