import { Component } from '@angular/core'
import { Http } from '@angular/http'

import 'rxjs/add/operator/map'

export class Categories {

  constructor (http) {
    this.http = http
  }

  ngOnInit () {
    this.subscription = this.http.post('/api/categories/get')
      .map(res => res.json())
      .subscribe(res => this.categories = res)
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
  }

  static get parameters () {
    return [[Http]]
  }

  static get annotations () {
    return [
      new Component({
        selector: 'app',
        styleUrls: ['styles/categories.css', 'styles/devices.css'],
        templateUrl: 'templates/categories.html'
      })
    ]
  }
}
