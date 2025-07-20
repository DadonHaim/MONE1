import { useEffect, useRef, useState } from "react"
import { IStore } from "../../interface/IStore"
import IMone from "../../interface/IMone"
import { loadImageFromIndexedDB } from "../../tools"

export default function ShowPage({store}:IShowProps){

    // let [] = useState()

    return(
        <div className="ShowPage">
            {store.mones[store.activeCategory].map((mone:IMone,i)=>{
                if( !mone.read && mone.unRead == "--") return <></>
                if(i==0) return <></>
                return <Itemm {...mone} />
            })}
        </div>
    ) 
}


function Itemm(mone:IMone){
    let imgRef = useRef(null);
    useEffect(()=>{
        loadImageFromIndexedDB(mone.id)
        .then((localImage)=>{
            imgRef.current.src=localImage
        })
    },[])
    return (
        <div className="Itemm">
            <h2>מספר מונה:  {mone.id}</h2>
            {mone.unRead &&<p>הודעת האי קריאה :{mone.unRead}</p>}
            <p>הודעה : {mone.message}</p>
            <img ref={imgRef}/>
        </div>
    )
}


interface IShowProps{
    store:IStore
}