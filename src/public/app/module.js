import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteModule } from './routing'
import { HTTP_PROVIDERS } from '@angular/http'
import { Title } from '@angular/platform-browser'
import { AppComponent } from './component'
import { Categories } from '../components/categories'
import { ThreadListing } from '../components/thread-listing'
import { Thread } from '../components/thread'
import { User } from '../components/user'

export class AppModule {

  static get annotations () {
    return [
      new NgModule({
        imports: [ BrowserModule, RouteModule ],
        providers: [ HTTP_PROVIDERS, Title ],
        declarations: [ AppComponent, Categories, ThreadListing, Thread, User ],
        bootstrap: [ AppComponent ]
      })
    ]
  }
}
