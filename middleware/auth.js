import bcrypt from 'bcrypt';


async function hashPassword (plainPassword, saltRounds){
try{
    let hash = await bcrypt.hash(plainPassword, saltRounds)
    return hash
}
catch(e){
    console.error(`Došlo je do greške prilikom hashiranja lozinke: ${e}`);
    return null;
}
}

async function comparePasswords(plainPassword, hashedPassword){
    try{
        let rezultat = await bcrypt.compare(plainPassword, hashedPassword)
        return rezultat
    } 
    catch(e){
        console.error(`Ni okej, ${e}`)
        return false
    }
}

export {hashPassword, comparePasswords}