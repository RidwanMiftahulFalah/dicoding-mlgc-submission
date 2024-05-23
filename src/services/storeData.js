const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();

  const predicCollection = db.collection('predictions');
  return predicCollection.doc(id).set(data);
}

module.exports = storeData;
