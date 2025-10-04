import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzTableModule,
    NzSelectModule,
    NzStatisticModule,
    NzProgressModule,
    NzDividerModule,
    NzButtonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stats = {
    totalSales: 254000,
    totalOrders: 320,
    revenue: 180000,
    profit: 55000,
  };

  // Sales filter
  rangeOptions = ['Weekly', 'Monthly', '3 Months', '6 Months', '1 Year'];
  selectedRange = 'Monthly';

  // Mock sales data
  salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4780 },
    { name: 'May', value: 5890 },
    { name: 'Jun', value: 4390 },
  ];

  // Top 10 items
  topItems = [
    { name: 'Rice 25kg', qty: 120 },
    { name: 'Sugar 1kg', qty: 95 },
    { name: 'Cooking Oil 5L', qty: 85 },
    { name: 'Lentils 2kg', qty: 80 },
    { name: 'Flour 10kg', qty: 70 },
    { name: 'Biscuits', qty: 65 },
    { name: 'Milk 1L', qty: 60 },
    { name: 'Cold Drinks', qty: 55 },
    { name: 'Soap', qty: 50 },
    { name: 'Tea 500g', qty: 45 },
  ];

  // Best salesman
  bestSalesman = {
    name: 'Ramesh Sharma',
    target: 100,
    achieved: 87,
  };

  getAchievedPercent() {
    return (this.bestSalesman.achieved / this.bestSalesman.target) * 100;
  }
}
