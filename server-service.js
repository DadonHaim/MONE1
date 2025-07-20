
import fs from "fs"
import path from "path"
import Tesseract from "tesseract.js"
let list = [];
let count = 0;
const city = "גדעונה"

function log(text=""){
    let worlds = text.split(" ")
    let result = ""
    worlds.forEach(word=>{
        result+= word.split("").reverse().toString() .replaceAll(",","") + " "
    })
    console.log( result )
}
const map = {
    "0025":["aa",6],
    "0028":["aa",6],
    "0100":["aa",6],
    "0132":["aa",6],
    "0143":["aa",6],
    "0145":["aa",6],
    "0147":["aa",6],
    "0373":["aa",6],
    "0374":["aa",6],
    "0380":["aa",6],
    "0439":["aa",6],
    "0440":["aa",6],
    "0441":["aa",6],
    "0442":["aa",6],
    "0443":["aa",6],
    "0446":["aa",6],
    "0491":["aa",6],
    "0492":["aa",6],
    "0493":["aa",6],
    "0494":["aa",6],
    "0495":["aa",6],
}


async function Main(folderPath="./mone-source") {
    const files = fs.readdirSync(folderPath).filter(f =>/\.(jpg|jpeg|png)$/i.test(f));
    const results = [];

    for (const file of files) {
        const fullPath = path.join(folderPath, file);
        const { data: { text } } = await Tesseract.recognize(fullPath, 'heb+eng', {logger: m => {}});
        const items = extractItems(text);
        results.push(...items);
    }

    return results;
}


// פונקציה לקריאת התמונה מחזירה כתובת תז וטלפון
function extractItems(text) {
  const _lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const lines = _lines.filter(str=>!str.includes("שובץ"))
  const items = [];
  for (let i = 0; i < lines.length; i++) {
        let address = ""
        let phone = ""
        let id = ""

        let line = lines[i];
        if(line.includes(city)){
            address = line;
            try{
                const matchID = lines[i+1].match(/\d{4}-\d{8}/);
                if(matchID)
                    id = matchID[0]
            }
            catch{}
            try{
                const matchPhone = lines[i+2].match(/05\d{8}/);
                if (matchPhone) {
                    phone = matchPhone[0]
                    count++;
                }
            }
            catch{}

            console.log({address,phone,id})
            items.push({address,phone,id})
        }
    }
  
    
    items.forEach((mone=>{
        if(!mone.id) return
        let listFind = list.find(v=>v.id==mone.id);
        if(listFind) {
            if(!listFind.phone1){
                listFind.phone1 = mone.phone
            }
            return
        }

        let {apartment,streetNumber,floor,street,entry} = parseAddress(mone.address)
        
        let mapData = map[mone.id.substring(0,4)] || ["--",0]
        list.push(
            {
              id          : mone.id, 
              moneType    : mapData[0] , 
              number      : mone.id.substring(mone.id.length-5,mone.id.length), 
              number4      : mone.id.substring(mone.id.length-4,mone.id.length), 
              len         : mapData[1],
              name        : "",
              typeHouse   : "",
              address     : mone.address,
              city        : city,
              street      : street ||"ללא",
              streetNumber: streetNumber ||-1,
              house       : apartment, 
              floor       : floor,
              entry       : entry,
              phone1      : mone.phone,
              phone2      : "",
              readNumber   : "",
              read        : false,
              unRead      : "--",
              location    : "--",
              message     : "",
              images      : [],
              GPS         : [],
              date        : "",
              call   : false,
              msg     :false,
          }
        )
    }))

    let json = JSON.stringify(list)
    fs.writeFileSync("data.json",json)
  return items;
}


function parseAddress(addressStr) {
        let floor="--" ,apartment="",  street="--" ,_streetNumber="--", streetNumber="--" , entry="--";
        let address = addressStr 
        .replace(/[^\u0590-\u05FF0-9\s]/g, "")  
        .replace(/\s+/g, " ")      
        .replaceAll(".","")             
        .trim();

     
        let arr = address.split(" ");
        if(!isNumber(arr[1][0])){
            address=address.replace(" ","-")
            arr = address.split(" ");
        }
        street = arr[0];
        if( !isNumber(last(arr[1])) ){
            streetNumber = arr[1].substring(0,arr[1].length-1)
            entry = last(arr[1])
        }
        else{
            streetNumber = arr[1]
        }


        arr.forEach((v)=>{
            if(v.startsWith("ד")){
                apartment = v.substring(1,v.length)
            }
            else if(v.startsWith("ק")){
                floor = v.substring(1,v.length)
            }
        })

        return{
            street,
            streetNumber,
            entry,
            floor,
            apartment
        }


}




console.log('start...:');
Main().then(result => {
  console.log('✅ sumOfPhone:', count);
});



function Or(value , ...arr){
    for(let i=0;i<arr.length;i++){
        if(value == arr[i])
            return true
    }
    return false
}

function isNumber(value){
    return Or(value , '0','1','2','3','4','5','6','7','8','9')
}

function last(val , num=0){
    return val[val.length-1-num]
}

function sort(arr){
    let newArr = [];
    arr.forEach(v=>{
        if(Number(v)){
            newArr.push(Number(v))
        }
    })

    newArr.sort((a,b)=>a-b)
    return newArr.reverse()

}