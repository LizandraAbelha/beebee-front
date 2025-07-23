import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bee-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bee-rating.html',
  styleUrls: ['./bee-rating.css']
})
export class BeeRating implements OnChanges {
  @Input() rating: number | undefined = 0;

  @Input() maxRating: number = 5;
  bees: boolean[] = [];

  ngOnChanges(): void {
    const currentRating = this.rating || 0;
    this.bees = Array(this.maxRating).fill(false).map((_, i) => i < currentRating);
  }
}
