import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Http, Headers } from '@angular/http'
import { Title } from '@angular/platform-browser'

export class User {

  constructor (route, http, titler) {
    this.route = route
    this.http = http
    this.titler = titler
    this.uid = route.snapshot.url[1].path
    let ngHeaders = new Headers()
    ngHeaders.append('Content-Type', 'application/json')
    this.headers = { headers: ngHeaders }
  }

  ngOnInit () {
    let body = { uid: this.uid }
    this.subscription = this.http.post('/api/user/get', JSON.stringify(body), this.headers)
      .map(res => res.json())
      .subscribe(res => {
        this.user = res
        this.titler.setTitle(this.user.name)
      })
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
  }

  static get parameters () {
    return [[ActivatedRoute], [Http], [Title]]
  }

  static get annotations () {
    return [
      new Component({
        selector: 'app',
        styleUrls: ['styles/user.css', 'styles/devices.css'],
        templateUrl: 'templates/user.html'
      })
    ]
  }
}
