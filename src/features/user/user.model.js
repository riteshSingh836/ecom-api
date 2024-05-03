
export default class userModel {
    constructor (name, email, password, type, id) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this._id = id;
    }
    
    static getAll() {
        return users;
    }
}

let users = [ {
    id: 1,
    name: 'Seller User',
    email: 'seller@com.com',
    password: 'Password1',
    type: 'seller'
},  {
    id: 2,
    name: 'customer User',
    email: 'customer@com.com',
    password: 'Password1',
    type: 'customer'
},];