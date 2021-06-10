import * as About from '../viewpage/about_page.js';
import * as Home from '../viewpage/home_page.js'
import * as ThreadPage from '../viewpage/thread_page.js'
import * as Search from '../viewpage/search_page.js'
import * as EditThread from '../viewpage/edit_thread_page.js'

export const routePath = {
    HOME: '/',
    ABOUT: '/about',
    THREAD: '/thread',
    SEARCH: '/search',
    EDIT_THREAD: '/edit_thread',
}

export const routes = [
    { path: routePath.HOME, page: Home.home_page },
    { path: routePath.ABOUT, page: About.about_page },
    { path: routePath.THREAD, page: ThreadPage.thread_page },
    { path: routePath.SEARCH, page: Search.search_page },
    { path: routePath.EDIT_THREAD, page: EditThread.edit_page },
];

export function routing(pathname, hash) {
    const route = routes.find(r => r.path == pathname);
    if (route) {
        if (hash && hash.length > 1)
            route.page(hash.substring(1));
        else
            route.page();
    } else routes[0].page();
}