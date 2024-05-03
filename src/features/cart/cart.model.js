

export default class cartItemsModel {
    constructor (productID, userID, quantity, id) {
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }

    static add (productID, userID, quantity, id) {
        const cartItem = new cartItemsModel(productID, userID, quantity, cartItems.length+1);
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userID) {
       return cartItems.filter((c) => c.userID == userID);
    }

    static delete(cartItemID, userID) {
        const cartItemIndex = cartItems.findIndex((i) => i.id == cartItemID && i.userID == userID);
        if (!cartItemIndex) {
            return "Item not Found";
        }else{
            cartItems.splice(cartItemIndex, 1);
        }
    }
}

let cartItems = [new cartItemsModel (1,2,1,1), new cartItemsModel (1,1,2,2)];