import { useEffect, useRef, useState } from "react"
import type { IStore } from "../../interface/IStore"
import IMone from "../../interface/IMone"
import { GET, loadImageFromIndexedDB, POST, saveImageToIndexedDB } from "../../tools"
import Input from "../input"
import Br from "../Br"
import Textarea from "../textarea"
import Select from "../select"
import { typeHouse } from "../../interface/ITypeHouse"
import { unReadType } from "../../interface/IUnRead"
import { locationType } from "../../interface/ILocation"

export default function MonePage({store}:IMoneePageProps){
    let cameraInputRef1 = useRef(null);
    let readNumberRef = useRef(null);
    let imgRef = useRef(null);
    let galeryRef = useRef(null);
    let [mone , setMone] = useState<IMone>(null)

    useEffect(() => {(async () => {
        GET("/getMone/" + store.activeMone).then((mone:IMone)=>{
            setMone(mone);
            setTimeout(()=>{loadImageFromIndexedDB(mone.id).then((localImage)=>{imgRef.current.src=localImage})},500)
        }).catch((err)=>{console.error("שגיאה בהבאת המונה או הטעינה מה־IndexedDB", err);})
    })();}, []);



    function updateHandler(){

        POST("/updatMone",mone)
        .then(()=>{
            store.setAlert("עדכון נשלחה בהצלחה", "green")
        })
        .catch(()=>{
            store.setAlert("עדכון נכשל" , "red")
        })

        store.setAlert("עדכון מתבצע", "orange")
    }

    function sendHandler(){
        if(mone.unRead == "--" && readNumberRef.current.value.length <6 ){
            store.setAlert("מספר ספרות שגוי", "red")
            readNumberRef.current.style.color = "red"
            return
        }
        if(mone.unRead == "--"){
            mone.read = true;
        }


        POST("/updatMone",mone)
        .then(()=>{
            if(mone.read){
                store.reads[mone.id] = "read"
                store.setReads({...store.reads })
            }
            else if(mone.unRead != "--"){
                store.reads[mone.id] = "unRead"
                store.setReads({...store.reads })
            }
            store.setAlert("קריאה נשלחה בהצלחה", "green")
            toListHandler();
        })
        .catch(err=>{
            store.setAlert("קריאה נכשלה" , "red")
            console.log(err)
        })

        store.setAlert("קריאה מתבצעת", "orange")
    }


    function cameraHandler1(){
        cameraInputRef1.current.onchange = (event)=>{
            const file = event.target.files[0];
            if (!file) return;

            saveImageToIndexedDB(file, mone.id);

            const reader = new FileReader();
            reader.onload = function () {
                const img = new Image();
                img.src = reader.result as string;
                img.className = "preview";
                galeryRef.current.appendChild(img);
            };
        
            reader.readAsDataURL(file); 
        }
        cameraInputRef1.current.click()
    }
  



    function toListHandler(){
        console.log("toListHandler")
        store.setActiveCategory(mone.street)
        store.setPage("listPage")
    }

    
    if(!mone) return <>wait</>
    

    return(
        <div className="MonePage"> 
            <div className="MoneIdContainer">
                <button onClick={()=>sendHandler()}>Send</button>
                <span className="moneID ltr"> {mone.moneType}-<span className="red">{mone.number}</span> </span>
                <button onClick={()=>toListHandler()}>toList</button>
            </div>

            <Select data={typeHouse}    width={-25} defaltVal="סוג הבית:" selected={mone.typeHouse}  onSelect={(ref)=>{mone.typeHouse = ref.current.value}}/>
            <Select data={locationType} width={-30} defaltVal="מיקום:" selected={mone.unRead}        onSelect={(ref)=>{mone.location = ref.current.value}}/>
            <Select data={unReadType}   width={-45} defaltVal="אי קריאה:" selected={mone.unRead}     onSelect={(ref)=>{mone.unRead = ref.current.value}}/>
            <Br /> 
            <Input val={mone.name}        width={-40} holder="שם לקוח"                        onInput={(ref)=>{mone.name = ref.current.value}} />
            <Input val={mone.phone1}      width={-30} holder="טלפון 1" type="number" center  onInput={(ref)=>{mone.phone1 = ref.current.value}} />
            <Input val={mone.phone2}      width={-30} holder="טלפון 2" type="number" center  onInput={(ref)=>{mone.phone2 = ref.current.value}} />
            
            <Br /> 
            <Input val={mone.readNumber}  ref={readNumberRef}  type="number" width={-40} holder="מספר קריאה"    onInput={(ref)=>{mone.readNumber = ref.current.value}} />
            <button className="cameraBtn"  onClick={()=>cameraHandler1()}> 1צלם </button> 
            <input ref={cameraInputRef1} type="file" accept="image/*" capture="environment" id="cameraInput" style={{display:"none"}} />

            <Input id="address" val={mone.address}       width={-100} holder="כתובת מלאה" readonly onInput={(ref)=>{mone.address = ref.current.value}} />
             
            <Input val={mone.street}        width={-45} holder="רחוב"       onInput={(ref)=>{mone.street = ref.current.value}} />
            <Input val={mone.streetNumber}  width={-15} holder="מס'"  type="number"      onInput={(ref)=>{mone.streetNumber = ref.current.value}} />
            <Input val={mone.entry}         width={-15} holder="כנס"  type="number"      onInput={(ref)=>{mone.entry = ref.current.value}} />
            <Input val={mone.floor}         width={-10} holder="קומ"  type="number"      onInput={(ref)=>{mone.floor = ref.current.value}} />
            <Input val={mone.house}         width={-15} holder="דיר"  type="number"      onInput={(ref)=>{mone.house = ref.current.value}} />
            <Br />
            <Textarea val={mone.message}    holder="הודעה"      onInput={(ref)=>{mone.message = ref.current.value}} />
            <Br />
            <button className="btn" onClick={()=>sendHandler()}>Send</button>
            <button className="btn" onClick={()=>updateHandler()}>updatMone</button>

            <div className="galery" ref={galeryRef}>
                <img className="preview" ref={imgRef}/>
            </div>

        </div>
    ) 
}

interface IMoneePageProps{
    store:IStore
}