import {promises as fs} from 'fs';
import  {nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';

const productAll = new ProductManager


class CartManager{
constructor () {
    this.path = "./src/models/carts.json";
}
readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
}

writeCarts = async (carts) => {
    await fs.writeFile(this.path,JSON.stringify(carts));
}

exist = async (id) => {
    let carts = await this.readCarts();
   return carts.find(cart => cart.id === id)
}

addCarts = async () => {
    let cartsOld = await this.readCarts();
    let id = nanoid ()
    let cartsConcat = [{id : id, products : []}, ...cartsOld]
    await this.writeCarts(cartsConcat)
    return "Carrito agregado"
}

getCartsById = async (id) =>{
    let cartById = await this.exist(id)
    if(!cartById) return "Producto no encontrado"
    return cartById
 };

 addProductInCart = async (cartId, productId) => {
    let cartById = await this.exist(cartId)
    if(!cartById) return "Producto no encontrado"
    let productById = await productAll.exist(productId)
    if(!cartById) return "Producto no encontrado"
    

    let cartsAll = await this.readCarts()
    let cartFilter = cartsAll.filter(prod => prod.id != productId) 


    if(cartById.products.some(prod => prod.id === productId)){
        let productInCart = cartById.proucts.find(prod => prod.id === productId)
        productInCart.cantidad++
        let cartsConcat = [productInCart, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto sumado al carrito"
    
    }

    
    
    let cartsConcat = [{id:cartId, products : [{id:productById.id, cantidad: 1}]}, ...cartFilter]
    await this.writeCarts(cartsConcat)
    return "Producto Agregado al carrito"

 }
}

export default CartManager 