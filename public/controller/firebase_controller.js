import * as Constant from '../model/constant.js'
import { Thread } from '../model/thread.js';

export async function signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
    await firebase.auth().signOut();
}

export async function addThread(thread) {
    const ref = await firebase.firestore().collection(Constant.collectionNames.THREADS).add(thread.serialize());
    return ref.id; // SQL => primary key
}

export async function getThreadList() {
    let threadList = []
    const snapShot = await firebase.firestore().collection(Constant.collectionNames.THREADS).orderBy('timestamp', 'desc').get();

    snapShot.forEach(doc => {
        const t = new Thread(doc.data())
        t.docId = doc.id
        threadList.push(t);
    });
    return threadList;
}

export async function getOneThread(threadId) {
    const ref = await firebase.firestore().collection(Constant.collectionNames.THREADS).doc(threadId).get();
    if (!ref.exists) return null;
    const t = new Thread(ref.data());
    t.docId = threadId;
    return t;
}