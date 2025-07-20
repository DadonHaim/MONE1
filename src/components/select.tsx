import { useRef } from "react";

export default function Select({onSelect,data,defaltVal, selected ,width=100,}:ISelectProps){

    let ref = useRef(null)

    return(
        <select 
            className="selectComponent"
            ref={ref} 
            defaultValue={selected}
            onChange={()=>{onSelect(ref); }}
            style={{
                    width:width<0? (width*-1)+"%":width,
                    height:40,
                    padding:5,
                    
            }} 
        >
            {
                data.map((v,i)=>{
                    return(
                        <option 
                            key={i}
                            style={{
                                color:"red"
                            }} 
                            defaultValue={v}>{v=="--"?defaltVal:v}
                        </option>
                    )
                })
            }
        </select>
    )
}

interface ISelectProps{
    data:any[];
    defaltVal : string;
    width?:number;
    selected : string;
    onSelect : (ref: React.RefObject<any> ) =>void
}
