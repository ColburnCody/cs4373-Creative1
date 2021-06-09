import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Route from '../controller/route.js'
import * as Element from './element.js'

export function addEventListeners() {
    document.getElementById('button-edit-thread').addEventListener('click', () => {
        history.pushState(null, null, Route.routePath.EDIT);
        edit_page();
    })
}

export function edit_page() {
    if (!Auth.currentUser) {
        Element.root.innerHTML = '<h1>Access not allowed</h1>'
        return;
    }
    Element.root.innerHTML = '<h1>About page</h1>'
}