import type { IData } from "./IMone";
import type { IPage } from "./IPage";

export interface  IStore{
    page : IPage,
    mones : IData,
    categories: string[];
    activeMone: string;
    activeCategory: string;
    reads: any;
    setPage : React.Dispatch<React.SetStateAction<IPage>>,
    setMones : React.Dispatch<React.SetStateAction<IData>>,
    setCategories : React.Dispatch<React.SetStateAction<string[]>>,
    setActiveMone : React.Dispatch<React.SetStateAction<string>>,
    setActiveCategory : React.Dispatch<React.SetStateAction<string>>,
    setReads : React.Dispatch<React.SetStateAction<any>>,
    setAlert : any,


} 