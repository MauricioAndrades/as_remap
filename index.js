const deep_sort = require('deep-sort-object');
const jstpc = require('json-stringify-pretty-compact');
const fs = require('fs');
const kindof = require('./src/kindof.js');
var data = JSON.parse(fs.readFileSync('./src/as_data.json'));
const map_deep = require('map-keys-deep-lodash');


var utag_vs = {
    map: function(source, target) {
        target = target || {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (kindof(source[key]) === 'object') {
                    if (!isNaN(parseInt(key))) {
                        target['@' + key] = {};
                        utag_vs.map(source[key], target['@' + key]);
                    } else {
                        target[key] = {};
                        utag_vs.map(source[key], target[key]);
                    }
                } else {
                    if (!isNaN(parseInt(key))) {
                        target['@' + key] = source[key];
                    } else {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    },
    read: function(source) {
        return map_deep(source, function(value, key) {
            if (/^@/.test(key)) {
                return key.replace(/^@/, '');
            } else {
                return key;
            }
        })
    }
}

var to_storage = jstpc(utag_vs.map(deep_sort(data)));
var from_storage = jstpc(utag_vs.read(utag_vs.map(deep_sort(data))));

fs.writeFileSync('./dest/to_storage.json', to_storage, 'utf8');
fs.writeFileSync('./dest/from_storage.json', from_storage, 'utf8');


