const deep_sort = require('deep-sort-object');
const jstpc = require('json-stringify-pretty-compact');
const fs = require('fs');
const kindof = require('./src/kindof.js');
var data = JSON.parse(fs.readFileSync('./src/as_data.json'));

var re_map = function(source, target) {
    target = target || {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if (kindof(source[key]) === 'object') {
                if (!isNaN(parseInt(key))) {
                    target['_' + key] = {};
                } else {
                    target[key] = {};
                }
                re_map(source[key], target[key]);
            } else {
                if (!isNaN(parseInt(key))) {
                    target['_' + key] = source[key];
                } else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

fs.writeFile('./dest/output.json', jstpc(re_map(deep_sort(data))), 'utf8', function(err, data) {
    if (err) console.log(err);
})
