import { useRef } from "react";

export default function Textarea({
    id="",
    center=false,
    holder="",
    val="",
    onInput,
    readonly=false,
    width=-100,
    size = 16,
    bolder = false

}:ITextareaProps)
{
    let ref = useRef(null)
    return(
        <textarea 
            readOnly={readonly}
            style={{
                width:width<0? (width*-1)+"%":width,
                textAlign:center?"center":"right",
                fontSize: size,
                fontWeight: bolder ? "bold":"normal"
            }}  
            ref={ref}
            className="TextareaComponent" 
            id={id} 
            onInput={()=>onInput(ref)} 
            defaultValue={val} 
            placeholder={holder}
        ></textarea>
    )
}


interface ITextareaProps{
    row?: boolean;
    readonly?: boolean;
    center?: boolean;
    id ?: string;
    val ?: string|number;
    onInput? : (ref:React.RefObject<any>)=>void;
    holder?:string;
    width?:number;
    size?:number;
    bolder?:boolean;
}