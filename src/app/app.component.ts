import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // Array.prototype.groupBy = function(prop) {
  //   return this.reduce(function(groups, item) {
  //     const val = item[prop];
  //     groups[val] = groups[val] || [];
  //     groups[val].push(item);
  //     return groups;
  //   }, {});
  // };
}
