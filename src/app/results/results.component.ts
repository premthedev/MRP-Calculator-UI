// results.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';

interface MRPResult {
  part: string;
  requiredQty: number;
  onHandInventory: number;
  toBeProcured: number;
  level: number;
  components?: MRPResult[];
}

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTreeModule
  ]
})
export class ResultsComponent implements OnInit {
  itemName: string | null = null;
  quantity: number | null = null;
  results: MRPResult[] = [];
  isLoading = true;
  displayedColumns: string[] = ['level', 'part', 'requiredQty', 'onHandInventory', 'toBeProcured'];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.itemName = params['itemName'];
      this.quantity = +params['quantity'];
      console.log('Received params:', params);

      if (this.itemName && this.quantity) {
        this.fetchResults(this.itemName, this.quantity);
      }
    });
  }

  fetchResults(itemName: string, quantity: number) {
    console.log('Fetching results for:', itemName, quantity);
    const url = `http://localhost:8080/api/mrp/calculate?itemName=${itemName}&quantity=${quantity}`;
    
    this.http.get<MRPResult[]>(url).subscribe({
      next: (data) => {
        console.log('Received data:', data);
        this.results = this.flattenResults(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching results:', err);
        this.isLoading = false;
      }
    });
  }

  private flattenResults(data: MRPResult[], level: number = 1): MRPResult[] {
    let flattened: MRPResult[] = [];
    
    for (const item of data) {
      const flatItem = { ...item, level };
      flattened.push(flatItem);
      
      if (item.components && item.components.length > 0) {
        flattened = flattened.concat(this.flattenResults(item.components, level + 1));
      }
    }
    
    return flattened;
  }

  getIndentation(level: number): string {
    return '⤷ '.repeat(level - 1);
  }
  getToBeProcuredClass(value: number): string {
    return value > 0 ? 'procurement-needed' : 'procurement-ok';
  }
}