var admin = require("firebase-admin");

var serviceAccount = require("../config/firestore-key.json");

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}

class ContenedorFirebase {
    constructor(table) {
        this.db = admin.firestore();
        this.collection = this.db.collection(table);

    }
    save = async (objeto) => {
        const obj = await this.getById(objeto.id);
        if (obj) {
            const ref = this.collection.doc(obj.id)
            const updated = await ref.update(objeto);
            return { ...objeto, id: obj.id };
        } else {
            const docRef = await this.collection.add(objeto)
            return await docRef.get().then(d => {
                const data = d.data()
                return { ...data, id: docRef.id }
            })
        }

    }

    async getById(id) {
        const doc = await this.collection.doc(id);
        const obj = await doc.get();
        const data = obj.data();
        if (data) {
            return { ...data, id: doc.id };
        }
        return null
    }

    async getAll() {
        const querySnapshot = await this.collection.get();
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { ...data, id: doc.id };
        });
    }

    async deleteById(id) {
        const doc = this.collection.doc(id);
        const obj = await doc.delete();
    }

    async deleteAll() {
        await this.collection.deleteAll();
    }
}

module.exports = {
    Contenedor: ContenedorFirebase,
};