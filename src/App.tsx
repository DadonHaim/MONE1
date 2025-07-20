import { useEffect, useRef, useState } from 'react'
import './App.css'
import type { IPage } from './interface/IPage';
import { GET } from './tools';
import type { IData } from './interface/IMone';
import ListPage from './components/list/ListPage';
import MonePage from './components/mone/MonePage';
import Search from './components/list/search';
import ShowPage from './components/show/showPage';

function App() {
    let AlertRef = useRef(null)
    const [page , setPage] = useState<IPage>("listPage");
    const [mones , setMones] = useState<IData>();
    const [categories , setCategories] = useState<string[]>([]);
    const [activeMone , setActiveMone] = useState<string>("");
    const [activeCategory , setActiveCategory] = useState<string>("");
    const [reads ,setReads] = useState({})

    function setAlert(text:string,color="black"){
        AlertRef.current.innerHTML = text
        AlertRef.current.style.color = color
        setTimeout(()=>{
            AlertRef.current.innerHTML = ""
            AlertRef.current.style.color = "black"
        },2500)
    }

    const store = {setAlert,reads ,setReads,activeCategory,setActiveCategory,page,setPage,mones,setMones,categories,setCategories,activeMone,setActiveMone};

    useEffect(()=>{
        console.log("App-useEffect")
        GET("/getData")
        .then((data)=>{
            console.log(data)
            setMones(data as IData);
            setCategories(Object.keys(data as IData))
        })
        .catch(err=>{
            console.log("err",err)
        })
    },[])

    return(
        <>
            <div id="Alert" ref={AlertRef}></div>
            {page == "listPage" && <> <Search  store={store}/> <ListPage  store={store} /></>}
            {page == "monePage" && <MonePage  store={store} />}
            {page == "showCategoryPage" && <ShowPage  store={store} />}
        </>
    )

}

export default App


