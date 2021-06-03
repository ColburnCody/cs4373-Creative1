import * as Auth from '../controller/auth.js'
import * as Element from './element.js'
import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'

export function addViewButtonListener() {
    const viewButtonForms = document.getElementsByClassName('thread-view-form');
    for (let i = 0; i < viewButtonForms.length; i++) {
        addViewFormSubmitEvent(viewButtonForms[i])
    }
}

export function addViewFormSubmitEvent(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const threadId = e.target.threadId.value;
        thread_page(threadId);
    })
}

async function thread_page(threadId) {
    if (!Auth.currentUser) {
        Element.root.innerHTML = '<h1>Protected page</h1>'
        return
    }

    // 1. get thread from Firestore by id
    // 2. get all replies to this thread
    // 3. display this thread
    // 4. display all reply messages
    // 5. add a form for a new reply

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

    let html = `
        <h4 class="bg-primary text-white">${thread.title}</h4>
        <div>${thread.email} (At ${new Date(thread.timestamp).toString()}</div>
        <div class="bg-secondary text-white">${thread.content}</div>
        <hr>
    `;

    Element.root.innerHTML = html;
}