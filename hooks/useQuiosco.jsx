import { useContext } from "react";
import QuioscoContext, { QuioscoProvider } from "../context/QuioscoProvider";


const useQuisco = () =>{
    return useContext(QuioscoContext)
};

export default useQuisco;