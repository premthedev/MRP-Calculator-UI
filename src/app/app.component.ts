import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule
  ]
})
export class AppComponent {
  productionForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.productionForm = this.fb.group({
      itemName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
  }

submitForm() {
  if (this.productionForm.valid) {
    const { itemName, quantity } = this.productionForm.value;
    console.log('Form submitted with:', itemName, quantity);

    // Navigate to results page with query params
    this.router.navigate(['/results'], { 
      queryParams: { 
        itemName, 
        quantity 
      }
    }).then(
      success => console.log('Navigation successful:', success),
      error => console.error('Navigation failed:', error)
    );
  }
}
}