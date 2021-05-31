import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'

export function addEventListeners() {
    Element.formSignin.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            await FirebaseController.signIn(email, password);
        } catch (e) {
            console.log(e);
        }
    });
}