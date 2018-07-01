import idb from 'idb';

if(!window.indexedDB){
    window.alert("Your browser does not support IndexedDB, the app may not work offline.");
}

const dbPromise = idb.open('currency-converter-db', 1, upgradeDB => {
    let converterStore = upgradeDB.createObjectStore('currencies', {keyPath: "id"});
    converterStore.createIndex("id", "id");
});

const currencyDB = {
    set(data){
        return dbPromise.then( db => {
            let tx = db.transaction('currencies', 'readwrite');
            for(item in data){
                tx.objectStore('currencies').put({id: data[item], currencyName: data[item].currencyName, currencySymbol: data[item].currencySymbol});

            }
            return tx.complete;
        });
    },
    get(){
        return dbPromise.then(db => {
            return db.transaction('currencies').objectStore('currencies').getAll();
        });
    },
    clear(){
        return dbPromise.then(db => {
            const tx = db.transaction("currencies", "readwrite");
            tx.objectStore("currencies").clear();
            return tx.complete;
        });
    }
}

const rateDB = {
    set(values){
        return dbPromise.then(db => {
            const tx = db.transaction('c_rates', 'readwrite');
            if(values){
                tx.objectStore('c_rates').put(values);
            }
            return tx.complete;
        });
    }
}