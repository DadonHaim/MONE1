import { useRef } from "react"
import { IStore } from "../../interface/IStore";

export default function Search({store}:ISearchProps){
    let inpRef = useRef(null)

    function inputHandler(){
        let val = inpRef.current.value;

        if(val.length == 5){
            for(let key in store.mones){
                for(let i=1 ; i<store.mones[key].length;i++){
                    //@ts-ignore
                    if(store.mones[key][i].number == val){
                        //@ts-ignore
                        store.setActiveMone(store.mones[key][i].id)
                        store.setPage("monePage")             
                        return           
                    }
                }
            }
            store.setAlert("מונה לא נמצא","red")
        }
    }

    return(
        <div className="search">
            <input type="number" id="searchInp" placeholder="חפש" ref={inpRef} onInput={inputHandler} />
            <button onClick={()=>{inpRef.current.value=""}} className="clearSearch">X</button>
        </div>
    )
}

interface ISearchProps{
    store:IStore;
}