import { useState } from "react"
import type { FirstItem } from "../../interface/IMone"
import type { IStore } from "../../interface/IStore"

export default function Num(props:INum){
    const [read,setRead] = useState(props.read)
    function click(){
        props.store.setActiveMone(props.moneId)
        props.store.setPage("monePage")
        setRead(true)
    }
    return (
        <span className={`${read?"red":""} ${props.clas||""}`} onClick={()=>{click()}}>
            {props.value}
        </span>
    )
}


interface INum extends FirstItem{
    store:IStore;
    clas?:string;
}