import React, { useEffect, useState } from "react";
import type IMone from "../../interface/IMone";
import type { IStore } from "../../interface/IStore";
import Item from "./Item";
import Num from "./Num";
import { POST } from "../../tools";
import { messageRead } from "../../message";

function Category({store , category,onClick}:ICategoryProps){
    let [display, setDisplay] = useState(false)

    useEffect(()=>{
        setDisplay(store.activeCategory==category)
    },[])

    function onClickCategory(){
        console.log(111)
        setDisplay(!display)
        onClick? onClick():""
    }

    function onClickNum(moneId:string){
        store.setActiveMone(moneId);
        store.setPage("monePage")
    }

    function navHandler(e){
        e.stopPropagation()
        let addresses = []
        store.mones[category].forEach((mone:IMone,i)=>{
            if(i==0) return
            if(!mone) return
            if(!mone.city) return
            if(!mone.street) return
            if(!mone.streetNumber) return
            addresses.push(`${mone.city}, ${mone.street} ${mone.streetNumber}`)
        })
        const destination = encodeURIComponent(addresses[addresses.length - 1]);
        const waypoints = addresses.slice(0, -1).map(encodeURIComponent).join('|');
        let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        if (waypoints) 
            url += `&waypoints=${waypoints}`;
        url += `&travelmode=driving`;
        window.open(url, '_blank');
    }
    function showHandler(e){
        e.stopPropagation()
        let confir = confirm("האם אתה רוצה להציג את כל המונים שנקראו?")
        if(!confir) return
        store.setActiveCategory(category);
        store.setPage("showCategoryPage")

    }
    function msgAllHandler(e){
        e.stopPropagation()
        let confir = confirm("אתה בטוח שאתה רוצה לשלוח לכולם הודעה");
        if(confir){
            store.mones[category].forEach((mone:IMone,i)=>{
                if(i==0)return
                if(!mone.phone1) return;
                if(mone.read) return;
                if(mone.unRead != "--") return;
                if(store.reads.find(v=>v.id==mone.id)) return;
                POST("/sendWhathapp",{phone:mone.phone1,moneId:mone.id,message:messageRead(mone)}).then(()=>{
                    store.setAlert("ההודעה נשלחה בהצלחה","green")
                }).catch(()=>{
                    store.setAlert("ההודעה נכשלה","red")
                })
                
            })
        }
    }

    return(
        <div>
            <div id={`category-${category}`} className="category" onClick={onClickCategory}>
                <button onClick={navHandler} className="navCategorty">נווט</button>
                <button onClick={showHandler} className="showCategorty">הצג</button>
                <button onClick={msgAllHandler} className="msgCategorty">מסר</button>
                <div className="category-name">{category}</div>
                <div className="category-nums">
                {
                    store.mones[category][0].map((data,i)=>{
                        // if(i==0){return <React.Fragment key={i}></React.Fragment>}
                        if(store.reads[data.moneId] || data.read )
                            return <span className="nums" key={i} onClick={()=>onClickNum(data.moneId)}> <Num clas="red" {...data} store={store}/> ,</span>
                        return <span className="nums" key={i} onClick={()=>onClickNum(data.moneId)}> <Num {...data} store={store}/> ,</span>
                    })
                }
                </div>
            </div>
            <div className={`category-list  ${display?"":"none"}`} >
                {
                    store.mones[category].map((mone:IMone,i)=>{
                        if(i==0){return <React.Fragment key={i}></React.Fragment>}
                        return <Item key={i} {...mone} store={store}/>
                    })
                }
            </div>
        </div>
    )

}
export default React.memo(Category)


interface ICategoryProps{
    store:IStore,
    category:string,
    onClick?:()=>void
}