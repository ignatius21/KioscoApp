import { useState,useEffect,createContext } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { useRouter } from "next/router"; 

const QuioscoContext = createContext();

const QuioscoProvider = ({children}) =>{
    const [categorias,setCategorias] = useState([])
    const [categoriaActual,setCategoriaActual] = useState({})
    const [producto,setProducto] = useState({})
    const [modal,setModal] = useState(false)
    const [pedido,setPedido] =useState([])
    const [nombre,setNombre] = useState('')
    const [total,setTotal] = useState(0)
    const router = useRouter();


    const obtenerCategorias = async ()=>{
        const {data} = await axios('/api/categorias') 
        setCategorias(data)
    }
    useEffect(()=>{
        obtenerCategorias()
    },[])

    useEffect(()=>{
        setCategoriaActual(categorias[0])
    },[categorias])

    useEffect(()=>{
        const nuevoTotal = pedido.reduce((total,producto) =>(producto.precio * producto.cantidad) + total,0)
        setTotal(nuevoTotal)
    },[pedido])

    const handleClickCategoria = id =>{
        const categoria = categorias.filter(cat=> cat.id === id)
        setCategoriaActual(categoria[0])
        router.push('/')
    }

    const handleSetProducto = producto =>{
        setProducto(producto)
    }

    const handleChangeModal = ()=>{
        setModal(!modal)
    }

    const handleAgregarPedido = ({categoriaId,...producto})=>{
        // COMPROBAR SI EL PRODUCTO YA ESTA AGREGADO AL PEDIDO
        if(pedido.some(productoState =>productoState.id === producto.id)){
            // Actualizar el producto con la cantidad
            const pedidoActualizado = pedido.map(productoState=> productoState.id === producto.id ? producto : productoState)
            setPedido(pedidoActualizado)
            toast.success('Pedido Guardado')
        }else{
            setPedido([...pedido,producto])
            toast.success('Pedido agregado')
        }

        setModal(false)
        
    }

    const handleEditarCantidades = id =>{
        const productoActualizar = pedido.filter(producto =>producto.id === id)
        setProducto(productoActualizar[0])
        setModal(!modal)
    }
    const handleEliminarProducto = id =>{
        const productoEliminar = pedido.filter(producto =>producto.id !== id)
        setPedido(productoEliminar)
    }

    const colocarOrden = async (e) =>{
        e.preventDefault()
        try {
            await axios.post('/api/ordenes',{pedido,nombre,total,fecha:Date.now().toString()})
            // Resetear aplicacion
            setCategoriaActual(categorias[0]);
            setPedido([])
            setNombre('')
            setTotal(0)
            // Mensaje al realizar el pedido
            toast.success('Pedido realizado correctamente')

            //Llevar al usuario a la pagina principal
            setTimeout(()=>{
                router.push('/')
            },3000)
        } catch (error) {
            console.log(error)
        }
    }





    return(
        <QuioscoContext.Provider value={{categorias,handleClickCategoria,categoriaActual,producto,handleSetProducto,modal,handleChangeModal,handleAgregarPedido,pedido,handleEditarCantidades,handleEliminarProducto,nombre,setNombre,colocarOrden,total}}>{children}</QuioscoContext.Provider>
    )
}

export {
    QuioscoProvider
}

export default QuioscoContext;