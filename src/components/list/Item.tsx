import type IMone from "../../interface/IMone";
import type { IStore } from "../../interface/IStore";
import { messageRead, messageUnRead } from "../../message";
import { POST } from "../../tools";

export default function Item(mone: IItemProps){
    
    let cls = ""
    if(mone.read || mone.store.reads[mone.id]=="read")
        cls+=" read"
    if(mone.unRead!="--" || mone.store.reads[mone.id]=="unRead")
        cls+=" unRead"

    function clickItem(){
        mone.store.setActiveMone(mone.id);
        mone.store.setActiveCategory(mone.street);
        mone.store.setPage("monePage");
        console.log(`mone - ${mone.id} ${mone.street} click`)
    }

    function msg(e){
        e.stopPropagation()
        let confirm1 = window.confirm(`מצאתי או לא מצאתי`)
        let confirm2;
        let message;
        if(confirm1)
            message= messageRead(mone)
        else
            message = messageUnRead(mone)
        confirm2 = window.confirm(message)
        if(confirm2)
        POST("/sendWhathapp",{phone:mone.phone1,moneId:mone.id,message}).then(()=>{
            mone.store.setAlert("ההודעה נשלחה בהצלחה","green")
        }).catch(()=>{
            mone.store.setAlert("ההודעה נכשלה","red")
        })
    }

    function call(e){
        e.stopPropagation()
        if(mone.phone1)
            window.location.href=`tel:${mone.phone1}`;
    }
    function waze(e){
        e.stopPropagation()
        const encodedAddress = encodeURIComponent(mone.city +" " +mone.street +" "+mone.streetNumber);
        const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        window.open(url, '_blank'); // פותח בלשונית חדשה
    }

    return(
        <div 
            id={`mone-${mone.number}`} 
            className={`mone-item  ${cls}`}  
            onClick={()=>clickItem()}
        >
            <div className="col1">
                <div className="row">
                    <div className="">({mone.streetNumber}) {mone.number}</div>
                    <div className="itemName">{mone.name}</div> | 
                    <div className="itemLocation">{mone.location}</div>
                </div>
            
                <div className="itemAddress">{mone.address}</div>
                <div className="">{mone.street} {mone.streetNumber} ד{mone.house} כ{mone.entry} ק{mone.floor}</div>
            </div>
            
            <div className="col2">
                <button className={`${mone.phone1?"":"disable"}`} onClick={call}>call</button>
                <button className={`${mone.phone1?"":"disable"}`} onClick={msg}>msg</button>
                <button onClick={waze}>waze</button>
            </div>

        </div>
    )
}



interface IItemProps extends IMone{
    store : IStore;
}