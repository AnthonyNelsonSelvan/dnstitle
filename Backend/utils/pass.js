import argon2 from 'argon2';

async function handleVerifyPass(hashedPassword,password){
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (error) {
        console.error("Error verifying password:", error);
        return false; // Return false on error to prevent crashes
    }
}

export {handleVerifyPass}