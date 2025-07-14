import User from "./user.js";


async function handleIsBanned(id) {
    const user = await User.findById(id);
    if(user.isBanned){
        return true;
    }else{
        return false;
    }
}

export {handleIsBanned}