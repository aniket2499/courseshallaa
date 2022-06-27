
module.exports = {
    checkString : (strVal, varName) => {
        if (!strVal) throw `Error: You must supply a ${varName}`
        if (typeof strVal !== "string") throw `Error: ${varName} must be string`
        strVal = strVal.trim();
        if (strVal.length === 0) `Error: ${varName} can't be emplty string or string with just spaces`
        if (!isNaN(strVal)) `Error: ${strVal} is not a valid value for ${varName} as it only conatins digits`
        return strVal;
    },
    checkEmail : (mail) => {
    const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regEx.test(mail)) `Error: mail id is not valid`
    return mail;
    },

    checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
    },

    checkNumber(number){
    if(!number) throw "provide a number";
    if(typeof(number) !== Number) throw "Invalid number type";
    }

}
