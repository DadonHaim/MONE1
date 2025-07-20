export default function Br({height}:IBrProps){
    return <div style={{
        height:(height || 10)+"px"
    }}></div>
}


interface IBrProps{
    height?:number;
}