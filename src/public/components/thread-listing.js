import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Http, Headers } from '@angular/http'
import { Title } from '@angular/platform-browser'

export class ThreadListing {

  constructor (route, http, titler) {
    this.route = route
    this.http = http
    this.titler = titler
    this.category = route.snapshot.url[1].path
    let ngHeaders = new Headers()
    ngHeaders.append('Content-Type', 'application/json')
    this.headers = { headers: ngHeaders }
  }

  ngOnInit () {
    let body = { category: this.category }
    this.subscription = this.http.post('/api/thread-listing/get', JSON.stringify(body), this.headers)
      .map(res => res.json())
      .subscribe(res => this.threads = res)
    this.nameSub = this.http.post('/api/categories/name', JSON.stringify(body), this.headers)
      .map(res => res.json())
      .subscribe(res => {
        this.title = res.name
        this.titler.setTitle(this.title)
      })
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
    this.nameSub.unsubscribe()
  }

  static get parameters () {
    return [[ActivatedRoute], [Http], [Title]]
  }

  static get annotations () {
    return [
      new Component({
        selector: 'app',
        styleUrls: ['styles/thread-listing.css', 'styles/devices.css'],
        templateUrl: 'templates/thread-listing.html'
      })
    ]
  }
}
