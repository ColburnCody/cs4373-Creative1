import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import { Thread } from '../model/thread.js';
import * as Constant from '../model/constant.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Util from './util.js'
import * as ThreadPage from './thread_page.js'

export function addEventListeners() {

    Element.menuHome.addEventListener('click', () => {
        history.pushState(null, null, Route.routePath.HOME);
        home_page();
    })

    Element.formCreateThread.addEventListener('submit', async e => {
        e.preventDefault();

        Element.formCreateThreadError.title.innerHTML = '';
        Element.formCreateThreadError.content.innerHTML = '';
        Element.formCreateThreadError.keywords.innerHTML = '';

        const title = e.target.title.value.trim();
        const content = e.target.content.value.trim();
        const keywords = e.target.keywords.value.trim();
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now();
        const keywordsArray = keywords.toLowerCase().match(/\S+/g);

        const thread = new Thread({
            uid, title, content, email, timestamp, keywordsArray,
        });

        // validate thread
        let valid = true;
        let error = thread.validate_title();
        if (error) {
            valid = false;
            Element.formCreateThreadError.title.innerHTML = error;
        }
        error = thread.validate_keywords();
        if (error) {
            valid = false;
            Element.formCreateThreadError.keywords.innerHTML = error;
        }
        error = thread.validate_content();
        if (error) {
            valid = false;
            Element.formCreateThreadError.content.innerHTML = error;
        }

        if (!valid) {
            return;
        }

        try {
            const docId = await FirebaseController.addThread(thread);
            thread.docId = docId;
            //home_page(); // we will improve this later
            const trTag = document.createElement('tr'); // <tr></tr>
            trTag.innerHTML = buildThreadView(thread);
            const threadTableBody = document.getElementById('thread-table-body');
            threadTableBody.prepend(trTag);
            const viewForms = document.getElementsByClassName('thread-view-form')
            ThreadPage.addViewFormSubmitEvent(viewForms[0])

            const noThreadFound = document.getElementById('no-thread-found')
            if (noThreadFound)
                noThreadFound.innerHTML = ''
            e.target.reset(); // clears entry in the form

            Util.info('Success', 'A new thread has been added', Element.modalCreateThread);
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Failed to add', JSON.stringify(e), Element.modalCreateThread);
        }
    })
}

export async function home_page() {
    if (!Auth.currentUser) {
        Element.root.innerHTML = '<h1>Access not allowed</h1>'
        return;
    }

    let threadList;
    try {
        threadList = await FirebaseController.getThreadList();
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Error to get thread list', JSON.stringify(e));
    }

    buildHomeScreen(threadList);
}

function buildHomeScreen(threadList) {
    let html = ''
    html += `
        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-create-thread"
        >+ New thread</button>
    `;


    html += `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Action</th>
        <th scope="col">Title</th>
        <th scope="col">Keywords</th>
        <th scope="col">Posted by</th>
        <th scope="col">Content</th>
        <th scope="col">Posted At</th>
      </tr>
    </thead>
    <tbody id="thread-table-body">
    `

    threadList.forEach(thread => {
        html += `
        <tr>
        ${buildThreadView(thread)}
        </tr>
        `
    })

    html += '</tbody></table>'
    Element.root.innerHTML = html;

    if (threadList.length == 0) {
        html += '<h4 id="no-thread-found">No threads found</h4>'
        Element.root.innerHTML = html;
        return;
    }

    ThreadPage.addViewButtonListener();
}

function buildThreadView(thread) {
    return `
    <td>
        <form method="post" class="thread-view-form">
            <input type="hidden" name="threadId" value="${thread.docId}">
            <button type="submit" class="btn btn-outline-primary">View</button>
        </form>
    </td>
    <td>${thread.title}</td>
    <td>${(!thread.keywordsArray || !Array.isArray(thread.keywordsArray)) ? '' : thread.keywordsArray.join(' ')}</td>
    <td>${thread.email}</td>
    <td>${thread.content}</td>
    <td>${new Date(thread.timestamp).toString()}</td>
    `;
}