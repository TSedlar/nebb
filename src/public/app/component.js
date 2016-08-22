import { Component } from '@angular/core'
import { ROUTER_DIRECTIVES } from '@angular/router'

export class AppComponent {

  constructor () {}

  static get annotations () {
    return [
      new Component({
        selector: 'app',
        template: `<router-outlet></router-outlet>`,
        directives: [ROUTER_DIRECTIVES]
      })
    ]
  }
}
