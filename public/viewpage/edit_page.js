import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Route from '../controller/route.js'
import * as Element from './element.js'

export function addEventListeners(threadId) {
    document.getElementById('button-edit-thread').addEventListener('click', () => {
        history.pushState(null, null, Route.routePath.EDIT + '#' + threadId);
        edit_page(threadId);
    })
}

export async function edit_page(threadId) {
    if (!Auth.currentUser) {
        Element.root.innerHTML = '<h1>Access not allowed</h1>'
        return;
    }
    let thread
    try {
        thread = await FirebaseController.getOneThread(threadId)
        if (!thread) {
            Util.info('Error', 'Thread does not exist');
            return;
        }
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e))
        return;
    }

    Element.root.innerHTML = `<h1>
    <div>
    <textarea id="textarea-edit-thread" placeholder="${thread.content}"></textarea>
    </div>
    </h1>`
}