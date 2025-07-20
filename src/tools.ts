
let server="http://209.38.250.83:3001"


export async function GET(url:string){
    return new Promise((resolve,reject)=>{
        fetch(server+url).then(d=>d.json()).then(v=>resolve(v)).catch(e=>reject(e))
    })
} 
export function POST(url:string,data:any){
    return new Promise((resolve,reject)=>{
        fetch(server+url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(typeof data=="object" ? data :{data})
        })
        .then(d=>d.json())
        .then(v=>resolve(v))
        .catch(e=>reject(e))
    })
}
export function FROMDATA(url:string,data:any){
    return new Promise((resolve,reject)=>{
        fetch(server+url,{
            method:"POST",
            body:data
        })
        .then(v=>resolve(v))
        .catch(e=>reject(e))
    })
}

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MoneImagesDB", 1);

        request.onupgradeneeded = function () {
            const db = request.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "id" });
                console.log("✔ images object store created");
            }
        };

        request.onsuccess = function () {
            const db = request.result;

            // ודא שהאובייקט-סטור קיים גם לאחר success (אם הדפדפן שמר גרסה ישנה)
            if (!db.objectStoreNames.contains("images")) {
                console.error("⚠️ 'images' store missing – need to delete DB and recreate");
                indexedDB.deleteDatabase("MoneImagesDB"); // תכריח יצירה מחדש בפעם הבאה
                reject(new Error("Missing object store – database reset required"));
                return;
            }

            resolve(db);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}




export function saveImageToIndexedDB(file: File, moneId: string) {
    const reader = new FileReader();

    reader.onload = function () {
        const base64 = reader.result;

        const request = indexedDB.open("MoneImagesDB", 1);

        request.onupgradeneeded = function () {
            const db = request.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "id" });
            }
        };

        request.onsuccess = function () {
            const db = request.result;
            const tx = db.transaction("images", "readwrite");
            const store = tx.objectStore("images");
            store.put({ id: moneId, data: base64 });
            tx.oncomplete = () => {
                console.log("✔ saved image to IndexedDB");
            };
        };
    };

    reader.readAsDataURL(file); // קודם תקרא, ואז תכתוב
}

export async function loadImageFromIndexedDB(moneId: string): Promise<string | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readonly");
        const store = tx.objectStore("images");
        const getReq = store.get(moneId);

        getReq.onsuccess = () => {
            if (getReq.result) resolve(getReq.result.data);
            else resolve(null);
        };

        getReq.onerror = () => {
            reject(getReq.error);
        };
    });
}
