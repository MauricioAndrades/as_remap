module.exports = function(data) {
    var data_type = Object.prototype.toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase().replace(/^html|element/gim, "");
    switch (data_type) {
        case "number":
        return isNaN(data) ? "nan" : "number";
        default:
        return data_type
    }
};
