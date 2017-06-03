// packages not needed in browser.
// to do: convert map_deep for browser.
const deep_sort = require('deep-sort-object');
const jstpc = require('json-stringify-pretty-compact');
const fs = require('fs');
const kindof = require('./src/kindof.js');
var data = JSON.parse(fs.readFileSync('./src/as_data.json'));
const map_deep = require('map-keys-deep-lodash');


var utag_vs = {
    /**
     *  adds a char to numeric obj keys to prevent NaN values in webkit
     *  @method  map
     *  @param   {obj}  source  : parsed data returned from vs.
     *  @param   {obj}  target  : optional obj to be mapped to.
     *  @return  {obj}          : returns a new obj, with new key values.
     */
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
    /**
     *  handles reverse mapping logic while read from localStorage
     *  @method  read
     *  @param   {obj}  source  : parsed localStorage value.
     *  @return  {obj}          : converts remapped obj back to orignal form.
     */
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


// what the data looks like on get and set in browser.
var to_storage = jstpc(utag_vs.map(deep_sort(data)));
var from_storage = jstpc(utag_vs.read(utag_vs.map(deep_sort(data))));

// write data to file.
fs.writeFileSync('./dest/to_storage.json', to_storage, 'utf8');
fs.writeFileSync('./dest/from_storage.json', from_storage, 'utf8');


