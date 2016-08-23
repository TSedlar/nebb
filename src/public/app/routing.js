import { RouterModule } from '@angular/router'
import { Categories } from '../components/categories'
import { ThreadListing } from '../components/thread-listing'
import { Thread } from '../components/thread'
import { User } from '../components/user'

const appRoutes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: Categories },
  { path: 'thread-listing/:category', component: ThreadListing },
  { path: 'thread/:category/:thread', component: Thread },
  { path: 'thread/:category/:thread/:comment', component: Thread },
  { path: 'users/:id', component: User }
]

export const RouteModule = RouterModule.forRoot(appRoutes, { useHash: true })
