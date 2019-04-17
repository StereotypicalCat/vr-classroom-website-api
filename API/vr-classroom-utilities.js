String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function sanitize(stringToSanitize){
    if(stringToSanitize != null && stringToSanitize != undefined){
        stringToSanitize = stringToSanitize.replaceAll("'", `\\'`).replaceAll(`"`, `\\"`).replaceAll(`\\*`, `\\*`);
    }
    return stringToSanitize;
}

module.exports = {
    sanitize
};