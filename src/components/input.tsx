import { forwardRef, useImperativeHandle, useRef } from "react";

// export default function Input({
//     id="",
//     center=false,
//     holder="",
//     type="text",
//     val="",
//     onInput,
//     readonly=false,
//     width=100,
//     size = 16,
//     bolder = false

// }:IIntputProps)
// {
//     let ref = useRef(null)
//     return(
//         <input 
//             readOnly={readonly}
//             style={{
//                 width:width<0? (width*-1)+"%":width,
//                 textAlign:center?"center":"right",
//                 fontSize: size,
//                 fontWeight: bolder ? "bold":"normal"
//             }} 
//             type={type} 
//             ref={ref}
//             className="InputComponent" 
//             id={id} 
//             onInput={()=>onInput(ref)} 
//             defaultValue={val} 
//             placeholder={holder}
//         />
//     )
// }


const Input = forwardRef<HTMLInputElement, IIntputProps>(
  (
    {
      id = "",
      center = false,
      holder = "",
      type = "text",
      val = "",
      onInput,
      readonly = false,
      width = 100,
      size = 16,
      bolder = false,
    },
    ref
  ) => {
    const localRef = useRef<HTMLInputElement>(null);

    // Connect internal ref to external ref
    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

    return (
      <input
        readOnly={readonly}
        style={{
          width: width < 0 ? width * -1 + "%" : width,
          textAlign: center ? "center" : "right",
          fontSize: size,
          fontWeight: bolder ? "bold" : "normal",
        }}
        type={type}
        ref={localRef}
        className="InputComponent"
        id={id}
        onInput={() => onInput?.(localRef)}
        defaultValue={val}
        placeholder={holder}
      />
    );
  }
);

export default Input;

interface IIntputProps{
    row?: boolean;
    readonly?: boolean;
    center?: boolean;
    id ?: string;
    val ?: string|number;
    onInput? : (ref:React.RefObject<any>)=>void;
    type ?: "number"|"text"|"phone"|"email"|"password";
    holder?:string;
    width?:number;
    size?:number;
    bolder?:boolean;
}