import React, { useEffect } from "react";
import type { IStore } from "../../interface/IStore";
import Category from "./Category";

function ListPage({store}:IListPageProps){

    useEffect(()=>{
        const el = document.getElementById("category-"+store.activeCategory);
        if (el) {
            el.scrollIntoView({ behavior: "instant", block: "start" });
        }
    },[])

    return(
        <div className="ListPage"> 
           
            {store.categories.map((category,i)=>{
                if(store.activeCategory == category){

                }
                return <Category 
                    store={store}
                    category={category}
                    key={i}
                />
            })}


        </div>
    ) 
}

export default React.memo(ListPage)

interface IListPageProps{
    store:IStore,
}