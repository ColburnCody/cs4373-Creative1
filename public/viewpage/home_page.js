import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners() {
    Element.menuHome.addEventListener('click', () => {
        history.pushState(null, null, Route.routePath.HOME);
        home_page();
    })
}

export function home_page() {
    if (!Auth.currentUser) {
        Element.root.innerHTML = '<h1>Access not allowed</h1>'
        return;
    }
    Element.root.innerHTML = '<h1>Home page</h1>'
}