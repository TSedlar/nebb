import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Http, Headers } from '@angular/http'
import { Title } from '@angular/platform-browser'

export class Thread {

  constructor (route, http, titler) {
    this.route = route
    this.http = http
    this.titler = titler
    this.category = route.snapshot.url[1].path
    this.thread = route.snapshot.url[2].path
    if (route.snapshot.url.length > 3) {
      this.comment = route.snapshot.url[3].path
    }
    let ngHeaders = new Headers()
    ngHeaders.append('Content-Type', 'application/json')
    this.headers = { headers: ngHeaders }
  }

  ngOnInit () {
    let body = { category: this.category, thread: this.thread }
    this.subscription = this.http.post('/api/thread/get', JSON.stringify(body), this.headers)
      .map(res => res.json())
      .subscribe(res => {
        this.thread = res
        this.titler.setTitle(this.thread.name)
        this.views = this.thread.views
      })
    this.viewSub = this.http.post('/api/thread/view', JSON.stringify(body), this.headers)
      .map(res => res.json())
      .subscribe(res => this.views = res.views)
      // if (this.comment) { scrollToComment() }
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
    this.viewSub.unsubscribe()
  }

  static get parameters () {
    return [[ActivatedRoute], [Http], [Title]]
  }

  static get annotations () {
    return [
      new Component({
        selector: 'app',
        styleUrls: ['styles/thread.css', 'styles/devices.css'],
        templateUrl: 'templates/thread.html'
      })
    ]
  }
}
