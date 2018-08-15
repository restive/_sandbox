/*! Non-Critical JavaScript. Load in <HEAD> or <BODY> using <script> tag with "text/javascript/w_defer" type attribute value */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W069 */
/*jshint -W018 */
/*jshint devel: true, nonew: false, bitwise: false */
/*global window, XMLHttpRequest, ActiveXObject, wizmo */
//"use strict";

/*! _w - wizmo functional helpers - Extend */
(function(_w_obj){

    "use strict";

    /**
     * URL-encode a string
     * @link http://locutus.io/php/url/urlencode/
     * @param {String} str the string to encode
     * @return {string}
     */
    _w_obj.urlencode = function(str)
    {
        str = (str + '').toString();

        // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
        // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    };

    /**
     * Find the position of the last occurrence of a substring in a string
     * @link http://locutus.io/php/strings/strrpos/
     * @param {String} haystack the string to search in
     * @param {String} needle the search term
     * @param {Number} offset the offset
     * @return {*}
     */
    _w_obj.strrpos = function (haystack, needle, offset) {
        var i = -1;
        if (offset) {
            i = (haystack + '').slice(offset).lastIndexOf(needle); // strrpos' offset indicates starting point of range till end,
            // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
            if (i !== -1) {
                i += offset;
            }
        } else {
            i = (haystack + '').lastIndexOf(needle);
        }
        return i >= 0 ? i : false;
    };

    /**
     * Determine if a string is like a number e.g. '12', '12.5'
     * @param {String} num_str the string to test
     * @returns {boolean}
     */
    _w_obj.isNumberString = function(num_str)
    {
        if(!_w.isString(num_str))
        {
            return false;
        }

        if(/^ *\-?([0-9]+|[0-9]+\.[0-9]+) *$/i.test(num_str))
        {
            return true;
        }

        return false;
    };

    /**
     * Determine if number is negative
     * @param {Number} num_int the number to check
     * @returns {boolean}
     */
    _w_obj.isNegative = function(num_int){

        //return false if not number
        if(!_w.isNumber(num_int))
        {
            return false;
        }

        return ((num_int < 0));
    };

    /**
     * Escapes a string for use in a regular expression
     * @param str {String} the String to escape
     * @param excl_all_but_slashes_bool {Boolean} if true, will only escape the slash characters
     * @returns {*|string}
     */
    _w_obj.escapeRegExp = function(str) {
        var myArgs = Array.prototype.slice.call(arguments),
            excl_all_but_slashes_bool = (_w.isBool(myArgs[1])) ? myArgs[1] : false
            ;

        return (excl_all_but_slashes_bool) ? str.replace(/([\/\\])/g, "\\$1") : str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    /**
     * Replace all occurrences of the search string with the replacement string
     * @param str {String} The string being searched and replaced on
     * @param find {String} The value being searched for
     * @param replace {String} The replacement value
     * @returns {*|string}
     */
    _w_obj.replaceAll = function(str, find, replace) {
        return str.replace(new RegExp(_w.escapeRegExp(find), 'g'), replace);
    };

    /**
     * Sort an array with a user-defined comparison function and maintain index association
     * @link http://locutus.io/php/array/uasort/
     * @param {Array} inputArr the input array
     * @param {*} sorter the comparison function
     * @return {boolean|{}}
     */
    _w_obj.uasort = function(inputArr, sorter) {
        var ctx = window,
            valArr = [],
            k = '',
            i = 0,
            strictForIn = false,
            populateArr = {};

        if (typeof sorter === 'string')
        {
            sorter = ctx[sorter];
        }
        else if (Object.prototype.toString.call(sorter) === '[object Array]')
        {
            sorter = ctx[sorter[0]][sorter[1]];
        }

        // BEGIN REDUNDANT
        ctx.php_js = ctx.php_js || {};
        ctx.php_js.ini = ctx.php_js.ini || {};
        // END REDUNDANT
        strictForIn = ctx.php_js.ini['phpjs.strictForIn'] && ctx.php_js.ini['phpjs.strictForIn'].local_value && ctx.php_js
                .ini['phpjs.strictForIn'].local_value !== 'off';
        populateArr = strictForIn ? inputArr : populateArr;

        for (k in inputArr) {
            // Get key and value arrays
            if (inputArr.hasOwnProperty(k)) {
                valArr.push([k, inputArr[k]]);
                if (strictForIn) {
                    delete inputArr[k];
                }
            }
        }
        valArr.sort(function(a, b) {
            return sorter(a[1], b[1]);
        });

        for (i = 0; i < valArr.length; i++) {
            // Repopulate the old array
            populateArr[valArr[i][0]] = valArr[i][1];
        }

        return strictForIn || populateArr;
    };

    /**
     * Searches the array for a given value and returns the first corresponding key if successful
     * @link http://locutus.io/php/array/array_search/
     * @param {String} needle the searched value
     * @param {Array} haystack the array
     * @return {*}
     */
    _w_obj.array_search = function(needle, haystack) {
        var myArgs = Array.prototype.slice.call(arguments),
            match_all_bool = (_w.isBool(myArgs[2])) ? myArgs[2] : false,
            strict = !!myArgs[3],
            key = '',
            key_all_arr = [];

        if (haystack && typeof haystack === 'object' && haystack.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
            return haystack.search(needle, argStrict);
        }
        if (typeof needle === 'object' && needle.exec) { // Duck-type for RegExp
            if (!strict) { // Let's consider case sensitive searches as strict
                var flags = 'i' + (needle.global ? 'g' : '') +
                    (needle.multiline ? 'm' : '') +
                    (needle.sticky ? 'y' : ''); // sticky is FF only
                needle = new RegExp(needle.source, flags);
            }
            for (key in haystack) {
                if (needle.test(haystack[key])) {
                    if(match_all_bool)
                    {
                        key_all_arr.push(key);
                    }
                    else
                    {
                        return key;
                    }
                }
            }
            return false;
        }

        for (key in haystack) {
            /* jshint -W116 */
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                if(match_all_bool)
                {
                    key_all_arr.push(key);
                }
                else
                {
                    return key;
                }
            }
            /* jshint +W116 */
        }

        return (match_all_bool) ? key_all_arr : false;
    };

    /**
     * Reverses the order of elements in an array
     * @param arr {Array} the array to reverse
     * @return {Array}
     */
    _w_obj.array_reverse = function(arr) {
        if(!arr || _w.count(arr) < 1)
        {
            return [];
        }

        return arr.reverse();
    };

    /**
     * Checks to see if array has duplicate values
     * @param arr {Array} the array to check
     * @return {Boolean}
     */
    _w_obj.arrayHasDuplicates = function(arr) {
        var valuesSoFar = {},
            array_count_int = _w.count(arr);

        for (var i = 0; i < array_count_int; ++i) {
            var value = arr[i];
            if (Object.prototype.hasOwnProperty.call(valuesSoFar, value)) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    };

    /**
     * Gets the number of times a value occurs in an array
     * @param needle_str {String} needle
     * @param haystack_arr {Array} haystack
     * @return {Number}
     */
    _w_obj.arrayValueCount = function(needle_str, haystack_arr) {

        if(!_w.isArray(haystack_arr))
        {
            return 0;
        }

        //trim needle
        needle_str = (_w.isString(needle_str)) ? needle_str.trim() : needle_str ;

        var counter_int = 0,
            haystack_item_str;
        for (var i = 0; i < _w.count(haystack_arr); i++)
        {
            haystack_item_str = haystack_arr[i];
            if(needle_str === haystack_item_str)
            {
                counter_int++;
            }
        }

        return counter_int;
    };

    /**
     * Converts a key-value tokenized string into a simple or associative array
     * A string with value "value1,value2,value3" becomes ['value1', 'value2', 'value3']
     * A string with value "key1=value1&key2=value2&key3=value3" becomes {'key1': 'value1', 'key2': 'value2', 'key3': 'value3'}
     * @param tok_str {String} The input string
     * @param delim_1_str {String} The first boundary string/delimiter. Default is '&'
     * @param delim_2_str {String} The second boundary string/delimiter. Default is '='
     * @param url_decode_bool {Boolean} Url decode values before adding them
     * @return {Object|Array}
     */
    _w_obj.stringToArray = function(tok_str)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            delim_1_str = (_w.isString(myArgs[1])) ? myArgs[1]: ',',
            delim_2_str = (_w.isString(myArgs[2])) ? myArgs[2]: null,
            url_decode_bool = (_w.isBool(myArgs[3])) ? myArgs[3]: false,
            tok_arr = {},
            tok_1_arr = [],
            tok_2_arr = []
            ;

        tok_1_arr = _w.explode(delim_1_str, tok_str);
        if (!_w.isArray(tok_1_arr))
        {
            //return empty array
            if(delim_2_str === null)
            {
                return [];
            }
            else
            {
                return {};
            }
        }

        if(delim_2_str === null)
        {
            return tok_1_arr;
        }
        else
        {
            for(var i = 0; i < _w.count(tok_1_arr); i++)
            {
                tok_2_arr = _w.explode(delim_2_str, tok_1_arr[i]);
                tok_arr[""+tok_2_arr[0]+""] = (url_decode_bool) ? decodeURIComponent(tok_2_arr[1]) : tok_2_arr[1];
            }

            return tok_arr;
        }
    };

    /**
     * Checks if a variable is an object and is empty
     * Returns null if variable is not object
     * @param obj {*} The variable to test
     * @return {Boolean|Null}
     */
    _w_obj.isObjectEmpty = function(obj)
    {
        if (_w.isObject(obj))
        {
            var is_empty_obj_bool;
            for ( var p in obj )
            {
                if (obj.hasOwnProperty(p))
                {
                    is_empty_obj_bool = false;
                    break;
                }
            }
            is_empty_obj_bool = (_w.isBool(is_empty_obj_bool)) ? is_empty_obj_bool: true;
            return is_empty_obj_bool;
        }
        else
        {
            return null;
        }
    };

    /**
     * Count the number of substring occurrences
     * @param haystack {String} the string to search in
     * @param needle {String} the substring to search for
     * @return {Number}
     */
    _w_obj.substr_count = function(haystack, needle)
    {
        var needle_esc = needle.replace(/(?=[\\^$*+?.\(\)|{\}[\]])/g, "\\");
        var pattern = new RegExp(""+needle_esc+"", "g");
        var count = haystack.match(pattern);
        return count ? count.length : 0;
    };

    /**
     * Converts an array into a simple or name-value tokenized string
     * @param tok_arr {Array} The input array
     * @param delim_1_str {String} The first boundary string/delimiter. Default is '&'
     * @param delim_2_str {String} The second boundary string/delimiter. Default is '='
     * @return {String}
     */
    _w_obj.arrayToString = function(tok_arr)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            delim_1_str = (_w.isString(myArgs[1])) ? myArgs[1]: ',',
            delim_2_str = (_w.isString(myArgs[2])) ? myArgs[2]: null,
            tok_str,
            tok_arr_keys_arr,
            tok_arr_values_arr,
            tok_str_arr = []
            ;

        //return empty string if object array or standard array is empty
        if (_w.isObjectEmpty(tok_arr) || _w.count(tok_arr) < 1)
        {
            return '';
        }

        if (delim_2_str === null)
        {
            tok_str = _w.implode(delim_1_str, tok_arr);
        }
        else
        {
            tok_arr_keys_arr = _w.array_keys(tok_arr);
            tok_arr_values_arr = _w.array_values(tok_arr);

            for (var i = 0; i < _w.count(tok_arr_values_arr); i++)
            {
                tok_str_arr.push(tok_arr_keys_arr[i]+delim_2_str+tok_arr_values_arr[i]);
            }
            tok_str = _w.implode(delim_1_str, tok_str_arr);
        }

        return tok_str;
    };

    /**
     * Fill an array with values
     * @param {Number} num_int the number of elements to insert
     * @param {Number|String} val the value to use for filling
     * @param {Number} start_int the first index of the returned array
     * @param {Boolean} return_object_array_bool
     * @return {Array|Boolean}
     */
    _w_obj.array_fill = function(num_int, val)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            start_int = (_w.isNumber(myArgs[2])) ? myArgs[2] : 0,
            return_object_array_bool = (_w.isBool(myArgs[3])) ? myArgs[3] : false,
            temp_arr = (return_object_array_bool) ? {} : []
        ;

        if(_w.isNumber(start_int) && _w.isNumber(num_int))
        {
            for(var i = 0; i < num_int; i++)
            {
                if(return_object_array_bool)
                {
                    temp_arr[(start_int + i)] = val;
                }
                else
                {
                    temp_arr.push(val);
                }
            }

            return temp_arr;
        }

        return false;
    };

    /**
     * Detects whether browser is Internet Explorer
     * If true, returns browser version
     * @return {Number|Boolean}
     * @private
     */
    _w_obj.isIE = function()
    {
        var ua = wizmo.getUserAgent(),
            msie = ua.indexOf('msie ');

        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('edge/');
        if (edge > 0) {
            // IE 12 => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    };

    /**
     * Creates and returns a throttled version of the passed function
     * @param callback {Function} the callback function to fire
     * @param wait {Number} the wait time in milliseconds
     * @returns {Function}
     * @param callback_util {Function} a utility callback function. This is necessary sometimes when the original callback cannot be modified
     * @private
     */
    _w_obj.throttle = function(callback, wait)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            callback_util = myArgs[2],
            time,
            go = true;
        return function() {
            var myArgsSub = Array.prototype.slice.call(arguments);
            if(go) {
                go = false;
                time = window.setTimeout(function(){
                    time = null;
                    go = true;
                    callback.call(this, myArgsSub[0], myArgsSub[1]);
                    if(callback_util)
                    {
                        callback_util.call(this, myArgsSub[0], myArgsSub[1]);
                    }
                }, wait);
            }
        };
    };

    /**
     * Calculate the md5 hash of a string
     * @param {String} str the string to convert
     * @returns {*}
     */
    _w_obj.md5 = function(str)
    {
        return md5(str);
    };

    /**
     * Pads the elements of an array with a sub-string
     * @param {Array} arr the array containing strings to pad
     * @param {String} sub_str the string to pad the array elements with
     * @param {String} dir_str direction of pad
     * 'l' or '<<' for left [default]
     * 'r' or '>>' for right
     * 'b' or '<>'
     * @return {Array}
     */
    _w_obj.padArray = function(arr, sub_str)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            dir_str = (_w.isString(myArgs[2]) && _w.in_array(myArgs[2], ['l', '<<', 'r', '>>', 'b', '<>'])) ? myArgs[2] : 'l',
            arr_item_str,
            final_arr = []
            ;

        if(_w.isArray(arr) && arr.length > 0)
        {
            for(var i = 0; i < arr.length; i++)
            {
                arr_item_str = '';
                if(dir_str === 'r' || dir_str === '>>')
                {
                    arr_item_str = arr[i]+sub_str;
                }
                else if(dir_str === 'b' || dir_str === '<>')
                {
                    arr_item_str = sub_str+arr[i]+sub_str;
                }
                else
                {
                    arr_item_str = sub_str+arr[i];
                }

                final_arr.push(arr_item_str);
            }

            return final_arr;
        }
    };

    /**
     * Flattens an object
     * @link https://gist.github.com/penguinboy/762197
     * @param {Object} unflat_obj the object to flatten
     * @param {String} delimiter_str the delimiter that separates the keys
     * @return {Object}
     */
    _w_obj.flattenObject = function(unflat_obj)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            delimeter_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : '.',
            flat_obj = {};

        for (var i in unflat_obj)
        {
            if (!unflat_obj.hasOwnProperty(i)) {continue;}

            if (_w.isObject(unflat_obj[i]) && !_w.isNullOrUndefined(unflat_obj[i]))
            {
                var flat_temp_obj = _w.flattenObject(unflat_obj[i]);
                for (var x in flat_temp_obj)
                {
                    if (!flat_temp_obj.hasOwnProperty(x)){continue;}

                    flat_obj[i + delimeter_str + x] = flat_temp_obj[x];
                }
            }
            else
            {
                flat_obj[i] = unflat_obj[i];
            }
        }
        return flat_obj;
    };

    /**
     * Unflattens an object
     * @link Inspired by an answer here: https://stackoverflow.com/questions/42694980/how-to-unflatten-a-javascript-object-in-a-daisy-chain-dot-notation-into-an-objec
     * @param {Object} flat_obj the object to unflatten
     * @param {String} delimiter_str the delimiter that separates the keys
     * @return {Object}
     */
    _w_obj.unflattenObject = function(flat_obj)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            delimeter_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : '.',
            unflat_obj = {};

        for (var i in flat_obj)
        {
            if (!flat_obj.hasOwnProperty(i)) {continue;}

            var keys = i.split(delimeter_str);
            /*jshint loopfunc: true */
            /* jshint -W116 */
            keys.reduce(function(r, e, j)
            {
                return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? flat_obj[i] : {}) : []);
            }, unflat_obj);
            /* jshint +W116 */
        }
        return unflat_obj;
    };

    /**
     * Updates an object's value
     * @param {Object} main_obj the object to update
     * @param {String} key_str the object property to update
     * @param {*} value_mx the value that will be
     * @return {Object}
     */
    _w_obj.updateObject = function(main_obj, key_str, value_mx)
    {
        //return if not object
        if(!_w.isObject(main_obj))
        {
            return main_obj;
        }

        var regex_key_arr = _w.regexMatchAll(/^ *([^\s\:]+?)(\:\:[^\s]+?|) *$/i, key_str),
            regex_key_prefix_str = regex_key_arr[0][1],
            regex_key_method_str = regex_key_arr[0][2],
            regex_key_method_sub_arr,
            array_put_str,
            array_put_int,
            flat_obj,
            unflat_obj
            ;

        //flatten object
        flat_obj = _w.flattenObject(main_obj);

        //update object by flat key
        if(_w.isString(regex_key_prefix_str) && regex_key_prefix_str.length > 0)
        {
            if(_w.isString(regex_key_method_str) && /put/i.test(regex_key_method_str))
            {
                //put
                regex_key_method_sub_arr = _w.regexMatchAll(/^ *\:\:(put)\-\>([0-9]+) *$/i, regex_key_method_str);

                array_put_str = regex_key_method_sub_arr[0][2];
                if(_w.isNumberString(array_put_str))
                {
                    array_put_int = parseInt(regex_key_method_sub_arr[0][2]);
                    flat_obj[regex_key_prefix_str][array_put_int] = value_mx;
                }
            }
            else if(_w.isString(regex_key_method_str) && /push/i.test(regex_key_method_str))
            {
                //push
                flat_obj[regex_key_prefix_str].push(value_mx);
            }
            else if(_w.isString(regex_key_method_str) && /unshift/i.test(regex_key_method_str))
            {
                //unshift
                flat_obj[regex_key_prefix_str].unshift(value_mx);
            }
            else
            {
                flat_obj[regex_key_prefix_str] = value_mx;
            }
        }

        //unflatten and return
        unflat_obj = _w.unflattenObject(flat_obj);
        return unflat_obj;
    };

    /**
     * Extend the functionality of _w by adding functions and objects to the namespace
     * @param {String} name the identifier of the function/object
     * @param {Function|Object} func_or_obj the function/object
     */
    _w_obj.extend = function(name_str, func_or_obj){
        _w[name_str] = func_or_obj;
    };

})(_w);

/*! Map and Reduce Polyfill **/
(function(){
    "use strict";

    /*jshint freeze: false */
    var is_ie_int = _w.isIE();
    if(is_ie_int && is_ie_int < 9)
    {
        //@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Map?v=example
        Array.prototype.map = function(fn) {
            var result_arr = [],
                result_temp_mx;
            for (var i = 0; i < this.length; i++)
            {
                result_temp_mx = fn(this[i]);
                result_arr.push(result_temp_mx);
            }
            return result_arr;
        };

        //@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=example
        Array.prototype.reduce = function(callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError( 'Array.prototype.reduce ' +
                    'called on null or undefined' );
            }
            if (typeof callback !== 'function') {
                throw new TypeError( callback +
                    ' is not a function');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // Steps 3, 4, 5, 6, 7
            var k = 0;
            var value;

            if (arguments.length >= 2) {
                value = arguments[1];
            } else {
                while (k < len && !(k in o)) {
                    k++;
                }

                // 3. If len is 0 and initialValue is not present,
                //    throw a TypeError exception.
                if (k >= len) {
                    throw new TypeError( 'Reduce of empty array ' +
                        'with no initial value' );
                }
                value = o[k++];
            }

            // 8. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kPresent be ? HasProperty(O, Pk).
                // c. If kPresent is true, then
                //    i.  Let kValue be ? Get(O, Pk).
                //    ii. Let accumulator be ? Call(
                //          callbackfn, undefined,
                //          « accumulator, kValue, k, O »).
                if (k in o) {
                    value = callback(value, o[k], k, o);
                }

                // d. Increase k by 1.
                k++;
            }

            // 9. Return accumulator.
            return value;
        };
    }
})();

/*! Custom Event Polyfill | @link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill **/
(function () {
    "use strict";

    var is_ie_int = _w.isIE();
    function CustomEvent ( event, params )
    {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    if(is_ie_int && is_ie_int >= 9)
    {
        if (typeof window.CustomEvent === "function") {return false;}

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }

})();

/*jshint bitwise: true */

/*! wizmo - NC | @link http://github.com/restive/wizmo | @copyright 2016 Restive LLC <http://wizmo.io> | @license MIT */
(function(window, document, $, _w){
    "use strict";

    /**
     * Gets a value from an array derived after a tokenized string is exploded
     * @param str {String} the tokenized string that will be exploded to an array
     * @param delim {String} the delimiter
     * @param key {Integer} the position of the array to return
     * @return {String}
     */
    function getValueAfterExplode(str, delim, key)
    {
        var arr = _w.explode(delim, str);
        return arr[key];
    }

    /**
     * Generates a random string containing alphabets or numbers or both
     * @param num_chars_or_seed {Number|String} the number of characters or the
     * random string seed format.
     * The seed is a string of any length that only contains the letters 'a', 'A', or 'n'
     * a == lowercase alphabet character
     * A == uppercase alphabet character
     * n = numeric character
     * Example 1: if 'annaann', the random string could be d78mh42
     * Example 2: if 'nnAAnanaA', the random string could be 39XE7s5wM
     * @param type_str {String} the type of random string to generate
     * This is used only if num_chars_or_seed is a number
     * 1. a = only alphabet characters
     * 2. n = only numberic characters
     * 3. an = alphanumeric characters [default]
     * @return
     */
    function generateRandomString(num_chars_or_seed)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            type_str = (_w.isString(myArgs[1])) ? myArgs[1] : 'an',
            format_str = (_w.isString(myArgs[0])) ? myArgs[0] : null,
            format_item_char_str,
            result = '',
            seed_all_str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            seed_alphabet_lc_str = 'abcdefghijklmnopqrstuvwxyz',
            seed_alphabet_uc_str = seed_alphabet_lc_str.toUpperCase(),
            seed_numeric_str = '0123456789';

        if(format_str)
        {
            num_chars_or_seed = format_str.length;

            for (var i = 0; i < num_chars_or_seed; i++)
            {
                format_item_char_str = format_str[i];

                result += (format_item_char_str === 'a') ? seed_alphabet_lc_str[Math.round(Math.random() * (seed_alphabet_lc_str.length - 1))] : (format_item_char_str === 'A') ? seed_alphabet_uc_str[Math.round(Math.random() * (seed_alphabet_uc_str.length - 1))] : (format_item_char_str === 'n') ? seed_numeric_str[Math.round(Math.random() * (seed_numeric_str.length - 1))] : format_item_char_str;
            }
        }
        else
        {
            for (var j = 0; j < num_chars_or_seed; j++)
            {
                result += (type_str === 'a') ? seed_alphabet_lc_str[Math.round(Math.random() * (seed_alphabet_lc_str.length - 1))] : (type_str === 'n') ? seed_numeric_str[Math.round(Math.random() * (seed_numeric_str.length - 1))] : seed_all_str[Math.round(Math.random() * (seed_all_str.length - 1))];
            }
        }

        return result;
    }

    /**
     * Merge the contents of two given objects
     * @param from {Object} The first object
     * @param to {Object} The second object. If null, a deep copy of from is returned
     * @returns {*}
     */
    function extend(from, to)
    {
        /* jshint -W116 */
        if (from == null || typeof from != "object")
        {
            return from;
        }

        if (from.constructor != Object && from.constructor != Array) {
            return from;
        }

        if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
            from.constructor == String || from.constructor == Number || from.constructor == Boolean){
            return new from.constructor(from);
        }

        to = to || new from.constructor();

        for (var name in from)
        {
            if (from.hasOwnProperty(name)) {
                to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
            }
        }

        return to;
        /* jshint +W116 */
    }

    /**
     * Extend wizmo Class
     */
    (function(wizmo_obj){

        //Gets the content of a function
        /*jshint freeze: false */
        Function.prototype.getFuncBody = function()
        {
            // Get content between first { and last }
            var m = this.toString().match(/\{([\s\S]*)\}/m)[1];
            // Strip comments
            return m.replace(/^\s*\/\/.*$/mg,'');
        };


        /**
         * Extend the functionality of wizmo by adding functions and objects to the wizmo root namespace
         * @param {String} name the identifier of the function/object
         * @param {Function|Object} func_or_obj the function/object
         * @private
         */
        function _extend(name, func_or_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                ctx = myArgs[2],
                has_reserved_word_bool,
                reserved_words_arr = _listWizmoMethods(false, ctx);

            //check if name is reserved keyword
            if(_w.isArray(reserved_words_arr) && reserved_words_arr.length > 0)
            {
                has_reserved_word_bool = !!((_w.in_array(name, reserved_words_arr)));
            }

            if(has_reserved_word_bool)
            {
                _w.console.error(_w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: '+name+' cannot be used because it is an official wizmo method, or it already exists in the wizmo method namespace. Please use another name.', true);
                return;
            }

            //add to name space
            wizmo[name] = func_or_obj;
        }

        /**
         * Extend the functionality of wizmo by adding functions to the wizmo root namespace
         * Wrapper for _extend
         * @param {String} name_str the name of the function
         * @param {Function|Object} func_or_obj the function or object to add
         */
        wizmo_obj.extend = function(name_str, func_or_obj)
        {
            _extend(name_str, func_or_obj, this);
        };

        /**
         * Adds a Plugin to wizmo
         * Wrapper for _extend
         * @param {String} name_str the name of the plugin
         * @param {Function|Object} func_or_obj the function or object to add
         */
        wizmo.addPlugin = function(name_str, func_or_obj)
        {
            _extend(name_str, func_or_obj, this);
        };

        /**
         * Removes function from wizmo-specific namespace
         * @param {String} id_str the identifier of the function
         * @param {Object} options_obj the options that define how functions will be removed
         *
         * queue: if true, will remove queued functions
         *
         * namespace: if defined, will remove functions in a specific namespace
         * Note: if queue is true, this must not be undefined
         *
         * fn: an function
         * If the function is within a queue, only the defined function will be removed, leaving other functions in the queue intact
         * Note: the function will be removed only if there is one copy of the function in the queue. If there are multiple functions with the same toString equivalent, then nothing happens
         * Note: if queue is true, namespace is set, and no fn option is defined, the entire namespace will be disabled, preventing all functions in said namespace from being called by runFunction
         *
         */
        wizmo_obj.removeFunction = function(id_str){
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1],
                fn,
                is_queue_bool,
                namespace_str;

            //Define defaults if options_obj mode
            if(_w.isObject(options_obj) && (options_obj.fn || options_obj.queue || options_obj.namespace))
            {
                fn = (options_obj.fn) ? options_obj.fn : undefined;
                is_queue_bool = (options_obj.queue && _w.isBool(options_obj.queue)) ? options_obj.queue : false;
                namespace_str = (options_obj.namespace && (_w.isString(options_obj.namespace) && options_obj.namespace.length > 0)) ? '_'+options_obj.namespace : '';
            }

            //Start remove operations
            if (is_queue_bool) {
                var id_final_str,
                    id_store_counter_id_str = id_str + '_counter',
                    id_store_counter_int = 0,
                    fn_str = '' + fn,
                    temp_fn,
                    temp_fn_str,
                    id_fn_remove_str,
                    remove_match_bool = false,
                    remove_match_counter_int = 0;

                if (fn) {
                    //remove matching function

                    //add a suffix to id
                    id_store_counter_int = parseInt(wizmo.domStore(id_store_counter_id_str));

                    for (var i = 0; i < id_store_counter_int; i++) {
                        id_final_str = id_str + '_' + i;

                        temp_fn = wizmo.domStore(id_final_str, undefined, 'var_function_q' + namespace_str);
                        temp_fn_str = '' + temp_fn;

                        /*jshint -W116 */
                        if (fn_str == temp_fn_str) {
                            id_fn_remove_str = id_final_str;
                            remove_match_bool = true;
                            remove_match_counter_int++;
                        }
                        /*jshint +W116 */
                    }

                    //remove function
                    if (remove_match_bool) {
                        if (remove_match_counter_int === 1) {
                            //one copy of reference function found. disable/remove

                            wizmo.domStore(id_fn_remove_str, null, 'var_function_q' + namespace_str);
                        }
                    }
                }
                else {
                    //remove all functions in namespace by disabling the namespace
                    wizmo.domStore('var_function_q' + namespace_str, null);
                }
            }
            else
            {
                if(namespace_str)
                {
                    wizmo.domStore(id_str, null, 'var_function_q'+namespace_str);
                }
                else
                {
                    wizmo.domStore(id_str, null, 'var_function');
                }
            }
        };

        /**
         * Adds an element to the end of an array stored in sessionStorage or localStorage
         * Functional equivalent of array.push
         * @param {String} key_arr_ref_str the identifier of the array in storage
         * @param {String|Number} value_mx the string, number, or boolean to add to the array
         * @param {String} store_type_str the storage type. Either 'ss' for sessionStorage [default], or 'ls' for localStorage
         * @param {Boolean} unique_bool if true, will ensure that only unique values are added to the array
         * @return {Boolean}
         */
        wizmo_obj.storePush = function(key_arr_ref_str, value_mx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                store_type_str = (_w.isString(myArgs[2]) && _w.in_array(myArgs[2], ['ss', 'ls'])) ? myArgs[2] : 'ss',
                unique_bool = !!((myArgs[3])),
                store_var_arr;

            //return if value is null or undefined
            if(_w.isNullOrUndefined(value_mx))
            {
                return false;
            }

            //add array if not defined
            if(!wizmo.store(key_arr_ref_str, undefined, store_type_str))
            {
                wizmo.store(key_arr_ref_str, [], store_type_str);
            }

            //get current value
            store_var_arr = wizmo.store(key_arr_ref_str, undefined, store_type_str);

            if(_w.isString(value_mx) || _w.isNumber(value_mx) || _w.isBool(value_mx))
            {
                //push then persist
                if (unique_bool) {
                    if (_w.in_array(value_mx, store_var_arr)) {
                        return false;
                    }
                }
            }

            //persist
            store_var_arr.push(value_mx);
            wizmo.store(key_arr_ref_str, store_var_arr, store_type_str);
            return true;
        };

        /**
         * Removes an element from an array
         * Functional equivalent of array.push
         * @param {String} key_arr_ref_str the identifier of the array in storage
         * @param {String|Number} value_mx the string, number, or boolean to add to the array
         * @param {String} store_type_str the storage type. Either 'ss' for sessionStorage [default], or 'ls' for localStorage
         * @return {Boolean}
         */
        wizmo_obj.storePull = function(key_arr_ref_str, value_mx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                store_type_str = (_w.isString(myArgs[2]) && _w.in_array(myArgs[2], ['ss', 'ls'])) ? myArgs[2] : 'ss',
                store_var_orig_arr,
                store_var_arr = [];

            //return if value is null or undefined
            if(_w.isNullOrUndefined(value_mx))
            {
                return false;
            }

            store_var_orig_arr = wizmo.store(key_arr_ref_str, undefined, store_type_str);
            if(_w.isArray(store_var_orig_arr) && store_var_orig_arr.length > 0)
            {
                for(var i = 0; i < store_var_orig_arr.length; i++)
                {
                    if(value_mx !== store_var_orig_arr[i])
                    {
                        store_var_arr.push(store_var_orig_arr[i]);
                    }
                }

                //persist
                wizmo.store(key_arr_ref_str, store_var_arr, store_type_str);
                return true;
            }

            return false;
        };

        /**
         * Check if a value exists in a stored array
         * It works just like _w.in_array
         * @param {String} key_haystack_str the key to the haystack in storage
         * @param {String|Number} needle_mx the value to search for
         * @param {String} store_type_str the storage type. Either 'ss' for sessionStorage [default], or 'ls' for localStorage
         * @return {Boolean}
         */
        wizmo_obj.storeInArray = function(key_haystack_str, needle_mx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                store_type_str = (_w.isString(myArgs[2]) && _w.in_array(myArgs[2], ['ss', 'ls'])) ? myArgs[2] : 'ss',
                store_arr
            ;

            store_arr = wizmo.store(key_haystack_str, undefined, store_type_str);

            if(_w.isArray(store_arr) && store_arr.length > 0)
            {
                return _w.in_array(needle_mx, store_arr);
            }

            return false;
        };

        /**
         * Stores, retrieves, and remove cookies
         * Powered by js-cookie
         * Note: to remove a cookie, simply define its value as null
         * @param {String} key_str the identifier of the value being stored
         * @param {*} value_res the value being stored
         * @param {Object} options_obj the options. See js-cookie
         * The following is a special utility option
         * ck_transform: if true [default], will transform string values to integer, float, or boolean before returning them. Valid only for get operations.
         * For example, '12' will become 12, '12.4' will become 12.4, 'true' will become true
         * @returns {*}
         */
        wizmo_obj.cookieStore = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return wizmo.store(myArgs[0], myArgs[1], 'ck', myArgs[2]);
        };

        /**
         * Initializes important device variables in storage
         * @private
         */
        function _initDeviceVars()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                reset_bool = ((myArgs[0]))
                ;

            if(reset_bool)
            {
                //reset
                wizmo.store("var_device_os_is_ios var_device_os_is_android var_device_os_is_symbian var_device_os_is_blackberry var_device_os_is_windows var_device_os_is_windows_phone var_device_os_is_mac var_device_os_is_linux var_device_os_is_unix var_device_os_is_openbsd var_device_user_agent var_device_is_phone var_device_is_tablet var_device_is_tv var_device_is_desktop var_device_browser_name var_device_browser_version", null);

                //update
                wizmo.updateOrtStore();
            }

            //load
            wizmo.getPlatform();
            wizmo.store("var_device_os_is_ios", wizmo.isIOS());
            wizmo.store("var_device_os_is_android", wizmo.isAndroid());
            wizmo.store("var_device_os_is_symbian", wizmo.isSymbian());
            wizmo.store("var_device_os_is_blackberry", wizmo.isBlackberry());
            wizmo.store("var_device_os_is_windows", wizmo.isWindows());
            wizmo.store("var_device_os_is_windows_phone", wizmo.isWindowsPhone());

            wizmo.store("var_device_user_agent", wizmo.getUserAgent());
            wizmo.store("var_device_is_phone", wizmo.isPhone());
            wizmo.store("var_device_is_tablet", wizmo.isTablet());
            wizmo.store("var_device_is_tv", wizmo.isTV());
            wizmo.store("var_device_is_desktop", wizmo.isDesktop());

            wizmo.store("var_device_browser_name", wizmo.getBrowserName());
            wizmo.store("var_device_browser_version", wizmo.getBrowserVersion());
        }

        /**
         * Gets the Form Factor of the device
         * There are only three form factors available
         * (1) Phone, (2) Tablet, (3) TV, (4) Desktop
         * @return {String}
         */
        wizmo_obj.getFormFactor = function()
        {
            var form_factor_str = "";

            if(wizmo.isTablet())
            {
                form_factor_str = "tablet";
            }
            else if (wizmo.isTV())
            {
                form_factor_str = "tv";
            }
            else
            {
                if (wizmo.isPhone())
                {
                    form_factor_str = "phone";
                }
                else
                {
                    form_factor_str = "desktop";
                }
            }

            return form_factor_str;
        };

        /**
         * Check if the Device is a Phone
         * @return {Boolean}
         */
        wizmo_obj.isPhone = function()
        {
            //check if phone check has already been done. If so, return stored value
            if(wizmo.storeCheck("var_device_is_phone"))
            {
                return wizmo.store("var_device_is_phone");
            }

            //Check if Device is a Tablet
            if (wizmo.isTablet(true) || wizmo.isTV())
            {
                //is not phone
                wizmo.store("var_device_is_phone", false);
                return false;
            }

            //Check if it is a phone
            if (wizmo.mobileDetect(wizmo.getUserAgent() || navigator.vendor.toLowerCase() || window.opera))
            {
                wizmo.store("var_device_is_phone", true);
                return true;
            }

            wizmo.store("var_device_is_phone", false);
            return false;
        };

        /**
         * Check if the Device is a Tablet
         * @param bypass_storage_bool {Boolean} Prevent this method from caching its result in local storage
         * @return {Boolean}
         */
        wizmo_obj.isTablet = function() {
            var myArgs = Array.prototype.slice.call(arguments),
                bypass_storage_bool = _w.isBool(myArgs[0]) ? myArgs[0] : false
                ;

            //check if tablet check has already been done. If so, return stored value
            if (wizmo.storeCheck("var_device_is_tablet"))
            {
                return wizmo.store("var_device_is_tablet");
            }

            var regex_raw_str,
                regex,
                is_tablet_bool,
                nav = wizmo.getUserAgent(),
                pixel_w_int = parseInt(wizmo.store("var_viewport_w_dp")),
                pixel_h_int = parseInt(wizmo.store("var_viewport_h_dp")),
                pixel_dim_int = (wizmo.store("var_screen_ort_is_portrait")) ? pixel_w_int : pixel_h_int
                ;

            //if iPad or Blackberry Playbook, return true
            regex = new RegExp("ipad|playbook|rim +tablet", "i");
            is_tablet_bool = regex.test(nav);
            if(is_tablet_bool)
            {
                if(!bypass_storage_bool){ wizmo.store("var_device_is_tablet", true); }
                return true;
            }

            //if Windows Surface, return true
            regex = new RegExp("windows +nt.+arm|windows +nt.+touch", "i");
            is_tablet_bool = regex.test(nav);

            if(is_tablet_bool)
            {
                if(_w.isNumber(pixel_dim_int) && (pixel_dim_int <= 520))
                {
                    if(!bypass_storage_bool){
                        wizmo.store("var_device_is_tablet", false);
                        if(wizmo.store("var_device_is_phone") === false){ wizmo.store("var_device_is_phone", true);}
                    }
                    return false;
                }
                else
                {
                    if(!bypass_storage_bool){ wizmo.store("var_device_is_tablet", true); }
                    return true;
                }
            }

            /**
             * Check Other Known Tablets
             *
             * 1. Amazon Kindle: android.+kindle|kindle +fire|android.+silk|silk.*accelerated
             * 2. Google Nexus Tablet: android.+nexus +(7|10)
             * 3. Samsung Tablet: samsung.*tablet|galaxy.*tab|sc-01c|gt-p1000|gt-p1003|gt-p1010|gt-p3105|gt-p6210|gt-p6800|gt-p6810|gt-p7100|gt-p7300|gt-p7310|gt-p7500|gt-p7510|sch-i800|sch-i815|sch-i905|sgh-i957|sgh-i987|sgh-t849|sgh-t859|sgh-t869|sph-p100|gt-p3100|gt-p3108|gt-p3110|gt-p5100|gt-p5110|gt-p6200|gt-p7320|gt-p7511|gt-n8000|gt-p8510|sgh-i497|sph-p500|sgh-t779|sch-i705|sch-i915|gt-n8013|gt-p3113|gt-p5113|gt-p8110|gt-n8010|gt-n8005|gt-n8020|gt-p1013|gt-p6201|gt-p7501|gt-n5100|gt-n5110|shv-e140k|shv-e140l|shv-e140s|shv-e150s|shv-e230k|shv-e230l|shv-e230s|shw-m180k|shw-m180l|shw-m180s|shw-m180w|shw-m300w|shw-m305w|shw-m380k|shw-m380s|shw-m380w|shw-m430w|shw-m480k|shw-m480s|shw-m480w|shw-m485w|shw-m486w|shw-m500w|gt-i9228|sch-p739|sch-i925|gt-i9200|gt-i9205|gt-p5200|gt-p5210|sm-t311|sm-t310|sm-t210|sm-t210r|sm-t211|sm-p600|sm-p601|sm-p605|sm-p900|sm-t217|sm-t217a|sm-t217s|sm-p6000|sm-t3100|sgh-i467|xe500
             * 4. HTC Tablet: htc flyer|htc jetstream|htc-p715a|htc evo view 4g|pg41200
             * 5. Motorola Tablet: xoom|sholest|mz615|mz605|mz505|mz601|mz602|mz603|mz604|mz606|mz607|mz608|mz609|mz615|mz616|mz617
             * 6. Asus Tablet: transformer|^.*padfone((?!mobile).)*$|tf101|tf201|tf300|tf700|tf701|tf810|me171|me301t|me302c|me371mg|me370t|me372mg|me172v|me173x|me400c|slider *sl101
             * 7. Nook Tablet: android.+nook|nookcolor|nook browser|bnrv200|bnrv200a|bntv250|bntv250a|bntv400|bntv600|logicpd zoom2
             * 8. Acer Tablet: android.*\b(a100|a101|a110|a200|a210|a211|a500|a501|a510|a511|a700|a701|w500|w500p|w501|w501p|w510|w511|w700|g100|g100w|b1-a71|b1-710|b1-711|a1-810)\b|w3-810
             * 9. Toshiba Tablet: android.*(at100|at105|at200|at205|at270|at275|at300|at305|at1s5|at500|at570|at700|at830)|toshiba.*folio
             * 10. LG Tablet: \bl-06c|lg-v900|lg-v905|lg-v909
             * 11. Yarvik Tablet: android.+(xenta.+tab|tab210|tab211|tab224|tab250|tab260|tab264|tab310|tab360|tab364|tab410|tab411|tab420|tab424|tab450|tab460|tab461|tab464|tab465|tab467|tab468|tab469)
             * 12. Medion Tablet: android.+\boyo\b|life.*(p9212|p9514|p9516|s9512)|lifetab
             * 13. Arnova Tablet: an10g2|an7bg3|an7fg3|an8g3|an8cg3|an7g3|an9g3|an7dg3|an7dg3st|an7dg3childpad|an10bg3|an10bg3dt
             * 14. Archos Tablet: android.+archos|\b(101g9|80g9|a101it)\b|qilive 97r|
             * 15. Ainol Tablet: novo7|novo7aurora|novo7basic|novo7paladin|novo8|novo9|novo10
             * 16. Sony Tablet: sony tablet|sony tablet s|sgpt12|sgpt121|sgpt122|sgpt123|sgpt111|sgpt112|sgpt113|sgpt211|sgpt213|ebrd1101|ebrd1102|ebrd1201|sgpt311|sgpt312|sonyso-03e
             * 17. Cube Tablet: android.*(k8gt|u9gt|u10gt|u16gt|u17gt|u18gt|u19gt|u20gt|u23gt|u30gt)|cube u8gt
             * 18. Coby Tablet: mid1042|mid1045|mid1125|mid1126|mid7012|mid7014|mid7034|mid7035|mid7036|mid7042|mid7048|mid7127|mid8042|mid8048|mid8127|mid9042|mid9740|mid9742|mid7022|mid7010
             * 19. SMiTTablet: android.*(\bmid\b|mid-560|mtv-t1200|mtv-pnd531|mtv-p1101|mtv-pnd530)
             * 20. RockchipTablet: android.*(rk2818|rk2808a|rk2918|rk3066)|rk2738|rk2808a
             * 21. TelstraTablet: t-hub2
             * 22. FlyTablet: iq310|fly vision
             * 23. bqTablet: bq.*(elcano|curie|edison|maxwell|kepler|pascal|tesla|hypatia|platon|newton|livingstone|cervantes|avant)
             * 24. HuaweiTablet: mediapad|ideos s7|s7-201c|s7-202u|s7-101|s7-103|s7-104|s7-105|s7-106|s7-201|s7-slim
             * 25. NecTablet: \bn-06d|\bn-08d
             * 26. Pantech: pantech.*p4100
             * 27. BronchoTablet: broncho.*(n701|n708|n802|a710)
             * 28. VersusTablet: touchpad.*[78910]|\btouchtab\b
             * 29. Zynctablet: z1000|z99 2g|z99|z930|z999|z990|z909|z919|z900
             * 30. Positivo: tb07sta|tb10sta|tb07fta|tb10fta
             * 31. NabiTablet: android.*\bnabi
             * 32. Playstation: playstation.*(portable|vita)
             * 33. Dell: dell.*streak
             * 34. Milagrow: milagrow +tab.*top
             * 35. Lenovo: android.+(ideapad|ideatab|lenovo +a1|s2110|s6000|k3011|a3000|a1000|a2107|a2109|a1107)
             * 37. UPad: android.+f8-sup
             * 38. Kobo: android.+(k080|arc|vox)
             * 39. MSI: android.*(msi.+enjoy|enjoy +7|enjoy +10)
             * 40. Agasio: dropad.+a8
             * 41. Acho: android.+c906
             * 42. Iberry: android.+iberry.+auxus
             * 43. Aigo: android.+aigopad
             * 44. Airpad: android.*(airpad|liquid metal)
             * 45. HCL: android.+hcl.+tablet|connect-3g-2.0|connect-2g-2.0|me tablet u1|me tablet u2|me tablet g1|me tablet x1|me tablet y2|me tablet sync
             * 46. Karbonn: android.*(a39|a37|a34|st8|st10|st7|smarttab|smart +tab)
             * 47. Micromax: android.*(micromax.+funbook|funbook|p250|p275|p300|p350|p362|p500|p600)|micromax.*(p250|p275|p350|p362|p500|p600)|funbook
             * 48. Penta: android.+penta
             * 49. Celkon: android.*(celkon.+ct|ct-[0-9])
             * 50. Intex: android.+i-buddy
             * 51. Viewsonic: android.*(viewbook|viewpad)
             * 52: ZTE: android.*(v9|zte.+v8110|light tab|light pro|beeline|base.*tab)
             * 53. Pegatron: chagall
             * 54. Advan: android.*(vandroid|t3i)
             * 55. Creative: android.*(ziio7|ziio10)
             * 56. OlivePad: android.*(v-t100|v-tw100|v-tr200|v-t300)
             * 57. Vizio: android.+vtab1008
             * 58. Bookeen: bookeen|cybook
             * 59. Medion: android.*lifetab_(s9512|p9514|p9516)
             * 60. IRU Tablet: m702pro
             * 61. IRULU: irulu-al101
             * 62. Prestigio: pmp3170b|pmp3270b|pmp3470b|pmp7170b|pmp3370b|pmp3570c|pmp5870c|pmp3670b|pmp5570c|pmp5770d|pmp3970b|pmp3870c|pmp5580c|pmp5880d|pmp5780d|pmp5588c|pmp7280c|pmp7280|pmp7880d|pmp5597d|pmp5597|pmp7100d|per3464|per3274|per3574|per3884|per5274|per5474|pmp5097cpro|pmp5097|pmp7380d|pmp5297c|pmp5297c_quad
             * 63. AllView: allview.*(viva|alldro|city|speed|all tv|frenzy|quasar|shine|tx1|ax1|ax2)
             * 64: Megafon: megafon v9
             * 65: Lava: android.+(z7c|z7h|z7s)
             * 66: iBall: android.+iball.+slide.+(3g *7271|3g *7334|3g *7307|3g *7316|i7119|i7011)|android.+iball.+i6012
             * 67. Tabulet: android.+(tabulet|troy +duos)
             * 68. Texet Tablet: navipad|tb-772a|tm-7045|tm-7055|tm-9750|tm-7016|tm-7024|tm-7026|tm-7041|tm-7043|tm-7047|tm-8041|tm-9741|tm-9747|tm-9748|tm-9751|tm-7022|tm-7021|tm-7020|tm-7011|tm-7010|tm-7023|tm-7025|tm-7037w|tm-7038w|tm-7027w|tm-9720|tm-9725|tm-9737w|tm-1020|tm-9738w|tm-9740|tm-9743w|tb-807a|tb-771a|tb-727a|tb-725a|tb-719a|tb-823a|tb-805a|tb-723a|tb-715a|tb-707a|tb-705a|tb-709a|tb-711a|tb-890hd|tb-880hd|tb-790hd|tb-780hd|tb-770hd|tb-721hd|tb-710hd|tb-434hd|tb-860hd|tb-840hd|tb-760hd|tb-750hd|tb-740hd|tb-730hd|tb-722hd|tb-720hd|tb-700hd|tb-500hd|tb-470hd|tb-431hd|tb-430hd|tb-506|tb-504|tb-446|tb-436|tb-416|tb-146se|tb-126se
             * 69. GalapadTablet: android.*\bg1\b
             * 70. GUTablet: tx-a1301|tx-m9002|q702
             * 71. GT-Pad: ly-f528
             * 72. Danew: android.+dslide.*\b(700|701r|702|703r|704|802|970|971|972|973|974|1010|1012)\b
             * 73. MIDTablet: m9701|m9000|m9100|m806|m1052|m806|t703|mid701|mid713|mid710|mid727|mid760|mid830|mid728|mid933|mid125|mid810|mid732|mid120|mid930|mid800|mid731|mid900|mid100|mid820|mid735|mid980|mid130|mid833|mid737|mid960|mid135|mid860|mid736|mid140|mid930|mid835|mid733
             * 74. Fujitsu: android.*\b(f-01d|f-05e|f-10d|m532|q572)\b
             * 75. GPad: android.+casiatab8
             * 76. Tesco Hudl: android.+hudl
             * 77. Polaroid: android.*(polaroid.*tablet|pmid1000|pmid10c|pmid800|pmid700|pmid4311|pmid701c|pmid701i|pmid705|pmid706|pmid70dc|pmid70c|pmid720|pmid80c|pmid901|ptab7200|ptab4300|ptab750|midc010|midc407|midc409|midc410|midc497|midc700|midc800|midc801|midc802|midc901)
             * 78. Eboda: e-boda.+(supreme|impresspeed|izzycomm|essential)
             * 79. HP Tablet: hp slate 7|hp elitepad 900|hp-tablet|elitebook.*touch
             * 80. AllFineTablet: fine7 genius|fine7 shine|fine7 air|fine8 style|fine9 more|fine10 joy|fine11 wide
             * 81. Sanei: android.*\b(n10|n10-4core|n78|n79|n83|n90 ii)\b
             * 82: ProScan Tablet: \b(pem63|plt1023g|plt1041|plt1044|plt1044g|plt1091|plt4311|plt4311pl|plt4315|plt7030|plt7033|plt7033d|plt7035|plt7035d|plt7044k|plt7045k|plt7045kb|plt7071kg|plt7072|plt7223g|plt7225g|plt7777g|plt7810k|plt7849g|plt7851g|plt7852g|plt8015|plt8031|plt8034|plt8036|plt8080k|plt8082|plt8088|plt8223g|plt8234g|plt8235g|plt8816k|plt9011|plt9045k|plt9233g|plt9735|plt9760g|plt9770g)\b
             * 83: YonesTablet : bq1078|bc1003|bc1077|rk9702|bc9730|bc9001|it9001|bc7008|bc7010|bc708|bc728|bc7012|bc7030|bc7027|bc7026
             * 84: ChangJiaTablet: tpc7102|tpc7103|tpc7105|tpc7106|tpc7107|tpc7201|tpc7203|tpc7205|tpc7210|tpc7708|tpc7709|tpc7712|tpc7110|tpc8101|tpc8103|tpc8105|tpc8106|tpc8203|tpc8205|tpc8503|tpc9106|tpc9701|tpc97101|tpc97103|tpc97105|tpc97106|tpc97111|tpc97113|tpc97203|tpc97603|tpc97809|tpc97205|tpc10101|tpc10103|tpc10106|tpc10111|tpc10203|tpc10205|tpc10503
             * 85: RoverPad: android.*(roverpad|rp3wg70)
             * 86. PointofView Tablet: tab-p506|tab-navi-7-3g-m|tab-p517|tab-p-527|tab-p701|tab-p703|tab-p721|tab-p731n|tab-p741|tab-p825|tab-p905|tab-p925|tab-pr945|tab-pl1015|tab-p1025|tab-pi1045|tab-p1325|tab-protab[0-9]+|tab-protab25|tab-protab26|tab-protab27|tab-protab26xl|tab-protab2-ips9|tab-protab30-ips9|tab-protab25xxl|tab-protab26-ips10|tab-protab30-ips10
             * 87: Overmax: android.*ov-(steelcore|newbase|basecore|baseone|exellen|quattor|edutab|solution|action|basictab|teddytab|magictab|stream|tb-08|tb-09)
             * 88: DPS Tablet: dps dream 9|dps dual 7
             * 89: Visture Tablet: v97 hd|i75 3g|visture v4( hd)?|visture v5( hd)?|visture v10
             * 90: Cresta Tablet: ctp(-)?810|ctp(-)?818|ctp(-)?828|ctp(-)?838|ctp(-)?888|ctp(-)?978|ctp(-)?980|ctp(-)?987|ctp(-)?988|ctp(-)?989
             * 91: Xiaomi: mi *pad
             * 200. Generic Tablet: android.*\b97d\b|tablet(?!.*pc)|viewpad7|lg-v909|mid7015|bntv250a|logicpd zoom2|\ba7eb\b|catnova8|a1_07|ct704|ct1002|\bm721\b|rk30sdk|\bevotab\b|smarttabii10|smarttab10
             */
            regex_raw_str = ""+
                "android.+kindle|kindle +fire|android.+silk|silk.*accelerated|"+
                "android.+nexus +(7|10)|"+
                "samsung.*tablet|galaxy.*tab|sc-01c|gt-p1000|gt-p1003|gt-p1010|gt-p3105|gt-p6210|gt-p6800|gt-p6810|gt-p7100|gt-p7300|gt-p7310|gt-p7500|gt-p7510|sch-i800|sch-i815|sch-i905|sgh-i957|sgh-i987|sgh-t849|sgh-t859|sgh-t869|sph-p100|gt-p3100|gt-p3108|gt-p3110|gt-p5100|gt-p5110|gt-p6200|gt-p7320|gt-p7511|gt-n8000|gt-p8510|sgh-i497|sph-p500|sgh-t779|sch-i705|sch-i915|gt-n8013|gt-p3113|gt-p5113|gt-p8110|gt-n8010|gt-n8005|gt-n8020|gt-p1013|gt-p6201|gt-p7501|gt-n5100|gt-n5110|shv-e140k|shv-e140l|shv-e140s|shv-e150s|shv-e230k|shv-e230l|shv-e230s|shw-m180k|shw-m180l|shw-m180s|shw-m180w|shw-m300w|shw-m305w|shw-m380k|shw-m380s|shw-m380w|shw-m430w|shw-m480k|shw-m480s|shw-m480w|shw-m485w|shw-m486w|shw-m500w|gt-i9228|sch-p739|sch-i925|gt-i9200|gt-i9205|gt-p5200|gt-p5210|sm-t311|sm-t310|sm-t210|sm-t210r|sm-t211|sm-p600|sm-p601|sm-p605|sm-p900|sm-t217|sm-t217a|sm-t217s|sm-p6000|sm-t3100|sgh-i467|xe500|"+
                "htc flyer|htc jetstream|htc-p715a|htc evo view 4g|pg41200|"+
                "xoom|sholest|mz615|mz605|mz505|mz601|mz602|mz603|mz604|mz606|mz607|mz608|mz609|mz615|mz616|mz617|"+
                "transformer|^.*padfone((?!mobile).)*$|tf101|tf201|tf300|tf700|tf701|tf810|me171|me301t|me302c|me371mg|me370t|me372mg|me172v|me173x|me400c|slider *sl101|"+
                "android.+nook|nookcolor|nook browser|bnrv200|bnrv200a|bntv250|bntv250a|bntv400|bntv600|logicpd zoom2|"+
                "android.*\\b(a100|a101|a110|a200|a210|a211|a500|a501|a510|a511|a700|a701|w500|w500p|w501|w501p|w510|w511|w700|g100|g100w|b1-a71|b1-710|b1-711|a1-810)\\b|w3-810|"+
                "android.*(at100|at105|at200|at205|at270|at275|at300|at305|at1s5|at500|at570|at700|at830)|toshiba.*folio|"+
                "\\bl-06c|lg-v900|lg-v905|lg-v909|"+
                "android.+(xenta.+tab|tab210|tab211|tab224|tab250|tab260|tab264|tab310|tab360|tab364|tab410|tab411|tab420|tab424|tab450|tab460|tab461|tab464|tab465|tab467|tab468|tab469)|"+
                "android.+\\boyo\\b|life.*(p9212|p9514|p9516|s9512)|lifetab|"+
                "an10g2|an7bg3|an7fg3|an8g3|an8cg3|an7g3|an9g3|an7dg3|an7dg3st|an7dg3childpad|an10bg3|an10bg3dt|"+
                "android.+archos|\\b(101g9|80g9|a101it)\\b|qilive 97r|"+
                "novo7|novo7aurora|novo7basic|novo7paladin|novo8|novo9|novo10|"+
                "sony tablet|sony tablet s|sgpt12|sgpt121|sgpt122|sgpt123|sgpt111|sgpt112|sgpt113|sgpt211|sgpt213|ebrd1101|ebrd1102|ebrd1201|sgpt311|sgpt312|sonyso-03e|"+
                "android.*(k8gt|u9gt|u10gt|u16gt|u17gt|u18gt|u19gt|u20gt|u23gt|u30gt)|cube u8gt|"+
                "mid1042|mid1045|mid1125|mid1126|mid7012|mid7014|mid7034|mid7035|mid7036|mid7042|mid7048|mid7127|mid8042|mid8048|mid8127|mid9042|mid9740|mid9742|mid7022|mid7010|"+
                "android.*(\\bmid\\b|mid-560|mtv-t1200|mtv-pnd531|mtv-p1101|mtv-pnd530)|"+
                "android.*(rk2818|rk2808a|rk2918|rk3066)|rk2738|rk2808a|"+
                "t-hub2|"+
                "iq310|fly vision|"+
                "bq.*(elcano|curie|edison|maxwell|kepler|pascal|tesla|hypatia|platon|newton|livingstone|cervantes|avant)|"+
                "mediapad|ideos s7|s7-201c|s7-202u|s7-101|s7-103|s7-104|s7-105|s7-106|s7-201|s7-slim|"+
                "\\bn-06d|\\bn-08d|"+
                "pantech.*p4100|"+
                "broncho.*(n701|n708|n802|a710)|"+
                "touchpad.*[78910]|\\btouchtab\\b|"+
                "z1000|z99 2g|z99|z930|z999|z990|z909|z919|z900|"+
                "tb07sta|tb10sta|tb07fta|tb10fta|"+
                "android.*\\bnabi|"+
                "playstation.*(portable|vita)|"+
                "dell.*streak|"+
                "milagrow +tab.*top|"+
                "android.+(ideapad|ideatab|lenovo +a1|s2110|s6000|k3011|a3000|a1000|a2107|a2109|a1107)|"+
                "android.+f8-sup|"+
                "android.*(k080|arc|vox)|"+
                "android.*(msi.+enjoy|enjoy +7|enjoy +10)|"+
                "dropad.+a8|"+
                "android.+c906|"+
                "android.+iberry.+auxus|"+
                "android.+aigopad|"+
                "android.*(airpad|liquid metal)|"+
                "android.+hcl.+tablet|connect-3g-2.0|connect-2g-2.0|me tablet u1|me tablet u2|me tablet g1|me tablet x1|me tablet y2|me tablet sync|"+
                "android.*(a39|a37|a34|st8|st10|st7|smarttab|smart +tab)|"+
                "android.*(micromax.+funbook|funbook|p250|p275|p300|p350|p362|p500|p600)|micromax.*(p250|p275|p350|p362|p500|p600)|funbook|"+
                "android.+penta|"+
                "android.*(celkon.+ct|ct-[0-9])|"+
                "android.+i-buddy|"+
                "android.*(viewbook|viewpad)|"+
                "android.*(v9|zte.+v8110|light tab|light pro|beeline|base.*tab)|"+
                "chagall|"+
                "android.*(vandroid|t3i)|"+
                "android.*(ziio7|ziio10)|"+
                "android.*(v-t100|v-tw100|v-tr200|v-t300)|"+
                "android.+vtab1008|"+
                "bookeen|cybook|"+
                "android.*lifetab_(s9512|p9514|p9516)|"+
                "m702pro|"+
                "irulu-al101|"+
                "pmp3170b|pmp3270b|pmp3470b|pmp7170b|pmp3370b|pmp3570c|pmp5870c|pmp3670b|pmp5570c|pmp5770d|pmp3970b|pmp3870c|pmp5580c|pmp5880d|pmp5780d|pmp5588c|pmp7280c|pmp7280|pmp7880d|pmp5597d|pmp5597|pmp7100d|per3464|per3274|per3574|per3884|per5274|per5474|pmp5097cpro|pmp5097|pmp7380d|pmp5297c|pmp5297c_quad|"+
                "allview.*(viva|alldro|city|speed|all tv|frenzy|quasar|shine|tx1|ax1|ax2)|"+
                "megafon +v9|"+
                "android.+(z7c|z7h|z7s)|"+
                "android.+iball.+slide.+(3g *7271|3g *7334|3g *7307|3g *7316|i7119|i7011)|android.+iball.+i6012|"+
                "navipad|tb-772a|tm-7045|tm-7055|tm-9750|tm-7016|tm-7024|tm-7026|tm-7041|tm-7043|tm-7047|tm-8041|tm-9741|tm-9747|tm-9748|tm-9751|tm-7022|tm-7021|tm-7020|tm-7011|tm-7010|tm-7023|tm-7025|tm-7037w|tm-7038w|tm-7027w|tm-9720|tm-9725|tm-9737w|tm-1020|tm-9738w|tm-9740|tm-9743w|tb-807a|tb-771a|tb-727a|tb-725a|tb-719a|tb-823a|tb-805a|tb-723a|tb-715a|tb-707a|tb-705a|tb-709a|tb-711a|tb-890hd|tb-880hd|tb-790hd|tb-780hd|tb-770hd|tb-721hd|tb-710hd|tb-434hd|tb-860hd|tb-840hd|tb-760hd|tb-750hd|tb-740hd|tb-730hd|tb-722hd|tb-720hd|tb-700hd|tb-500hd|tb-470hd|tb-431hd|tb-430hd|tb-506|tb-504|tb-446|tb-436|tb-416|tb-146se|tb-126se|"+
                "android.*\\bg1\\b|"+
                "tx-a1301|tx-m9002|q702|"+
                "ly-f528|"+
                "android.+dslide.*\\b(700|701r|702|703r|704|802|970|971|972|973|974|1010|1012)\\b|"+
                "m9701|m9000|m9100|m806|m1052|m806|t703|mid701|mid713|mid710|mid727|mid760|mid830|mid728|mid933|mid125|mid810|mid732|mid120|mid930|mid800|mid731|mid900|mid100|mid820|mid735|mid980|mid130|mid833|mid737|mid960|mid135|mid860|mid736|mid140|mid930|mid835|mid733|"+
                "android.*\\b(f-01d|f-05e|f-10d|m532|q572)\\b|"+
                "android.+casiatab8|"+
                "android.+hudl|"+
                "android.*(polaroid.*tablet|pmid1000|pmid10c|pmid800|pmid700|pmid4311|pmid701c|pmid701i|pmid705|pmid706|pmid70dc|pmid70c|pmid720|pmid80c|pmid901|ptab7200|ptab4300|ptab750|midc010|midc407|midc409|midc410|midc497|midc700|midc800|midc801|midc802|midc901)|"+
                "e-boda.+(supreme|impresspeed|izzycomm|essential)|"+
                "hp slate 7|hp elitepad 900|hp-tablet|elitebook.*touch|"+
                "fine7 genius|fine7 shine|fine7 air|fine8 style|fine9 more|fine10 joy|fine11 wide|"+
                "android.*\\b(n10|n10-4core|n78|n79|n83|n90 ii)\\b|"+
                "\\b(pem63|plt1023g|plt1041|plt1044|plt1044g|plt1091|plt4311|plt4311pl|plt4315|plt7030|plt7033|plt7033d|plt7035|plt7035d|plt7044k|plt7045k|plt7045kb|plt7071kg|plt7072|plt7223g|plt7225g|plt7777g|plt7810k|plt7849g|plt7851g|plt7852g|plt8015|plt8031|plt8034|plt8036|plt8080k|plt8082|plt8088|plt8223g|plt8234g|plt8235g|plt8816k|plt9011|plt9045k|plt9233g|plt9735|plt9760g|plt9770g)\\b|"+
                "bq1078|bc1003|bc1077|rk9702|bc9730|bc9001|it9001|bc7008|bc7010|bc708|bc728|bc7012|bc7030|bc7027|bc7026|"+
                "tpc7102|tpc7103|tpc7105|tpc7106|tpc7107|tpc7201|tpc7203|tpc7205|tpc7210|tpc7708|tpc7709|tpc7712|tpc7110|tpc8101|tpc8103|tpc8105|tpc8106|tpc8203|tpc8205|tpc8503|tpc9106|tpc9701|tpc97101|tpc97103|tpc97105|tpc97106|tpc97111|tpc97113|tpc97203|tpc97603|tpc97809|tpc97205|tpc10101|tpc10103|tpc10106|tpc10111|tpc10203|tpc10205|tpc10503|"+
                "android.*(roverpad|rp3wg70)|"+
                "tab-p506|tab-navi-7-3g-m|tab-p517|tab-p-527|tab-p701|tab-p703|tab-p721|tab-p731n|tab-p741|tab-p825|tab-p905|tab-p925|tab-pr945|tab-pl1015|tab-p1025|tab-pi1045|tab-p1325|tab-protab[0-9]+|tab-protab25|tab-protab26|tab-protab27|tab-protab26xl|tab-protab2-ips9|tab-protab30-ips9|tab-protab25xxl|tab-protab26-ips10|tab-protab30-ips10|"+
                "android.*ov-(steelcore|newbase|basecore|baseone|exellen|quattor|edutab|solution|action|basictab|teddytab|magictab|stream|tb-08|tb-09)|"+
                "dps dream 9|dps dual 7|"+
                "v97 hd|i75 3g|visture v4( hd)?|visture v5( hd)?|visture v10|"+
                "ctp(-)?810|ctp(-)?818|ctp(-)?828|ctp(-)?838|ctp(-)?888|ctp(-)?978|ctp(-)?980|ctp(-)?987|ctp(-)?988|ctp(-)?989|"+
                "mi *pad|"+
                "android.*\\b97d\\b|tablet(?!.*pc)|viewpad7|lg-v909|mid7015|bntv250a|logicpd zoom2|\\ba7eb\\b|catnova8|a1_07|ct704|ct1002|\\bm721\\b|rk30sdk|\\bevotab\\b|smarttabii10|smarttab10"+
                "";

            //Check Main Tablet
            regex = new RegExp(regex_raw_str, "i");
            is_tablet_bool = regex.test(nav);
            if(is_tablet_bool)
            {
                if(!bypass_storage_bool){ wizmo.store("var_device_is_tablet", true); }
                return true;
            }

            //Check Android Tablet
            var regex_1_bool = /android/i.test(nav),
                regex_2_bool = !/mobile/i.test(nav)
                ;

            if(regex_1_bool)
            {
                /**
                 * if tablet has either:
                 * 1. Device independent viewport width between 520px and 800px when in portrait
                 * 2. Device independent viewport height between 520px and 800px when in landscape
                 */
                if(_w.isNumber(pixel_dim_int) && (pixel_dim_int >= 520 && pixel_dim_int <= 810))
                {
                    if(!bypass_storage_bool){
                        wizmo.store("var_device_is_tablet", true);
                        if(wizmo.store("var_device_is_phone")){ wizmo.store("var_device_is_phone", false);}
                    }
                    return true;
                }

                //if user agent is Android but 'mobile' keyword is absent
                if(regex_2_bool)
                {
                    if(!bypass_storage_bool){ wizmo.store("var_device_is_tablet", true); }
                    return true;
                }

            }

            //Return false if otherwise
            if(!bypass_storage_bool){ wizmo.store("var_device_is_tablet", false); }
            return false;
        };

        /**
         * Determines the device category of a specific device using the user agent and a regex string
         * @param type_str {String} the device type key
         * @param regex_raw_str {String} The regex string
         * @return {Boolean}
         * @private
         */
        function _isDeviceType(type_str, regex_raw_str)
        {
            //check if device type test has already been done. If so, return stored value
            if(wizmo.storeCheck("var_device_is_"+type_str))
            {
                return wizmo.store("var_device_is_"+type_str);
            }

            //get the user agent
            var nav = wizmo.getUserAgent();

            /**
             * Check for known Device Type
             */
            var regex = new RegExp(regex_raw_str, "i");
            var is_device_type_bool = regex.test(nav);

            if(is_device_type_bool)
            {
                wizmo.store("var_device_is_"+type_str, true);
                return true;
            }

            wizmo.store("var_device_is_"+type_str, false);
            return false;
        }

        /**
         * Check if the device is a TV
         * @return {Boolean}
         */
        wizmo_obj.isTV = function()
        {
            var regex_str = "googletv|smart-tv|smarttv|internet +tv|netcast|nettv|appletv|boxee|kylo|roku|vizio|dlnadoc|ce-html|ouya|xbox|playstation *(3|4)|wii";
            return _isDeviceType('tv', regex_str);
        };

        /**
         * Checks if the device is a Personal Computer
         * @return {Boolean}
         */
        wizmo_obj.isDesktop = function()
        {
            //check if Desktop check has already been done. If so, return stored value
            if(wizmo.storeCheck("var_device_is_desktop"))
            {
                return wizmo.store("var_device_is_desktop");
            }

            if(wizmo.isMobile() === false && wizmo.isTV() === false)
            {
                wizmo.store("var_device_is_desktop", true);
                return true;
            }

            wizmo.store("var_device_is_desktop", false);
            return false;
        };

        /**
         * Checks if the device is a mobile device
         * @return {Boolean}
         */
        wizmo_obj.isMobile = function()
        {
            //check if device is phone or tablet
            return !!(wizmo.isPhone() || wizmo.isTablet(true));
        };

        /**
         * Checks if the device is a mobile device
         * Identical to isMobile. Duplicated for utility
         * @return {Boolean}
         */
        wizmo_obj.isMobileUtil = function()
        {
            //check if device is phone or tablet
            return !!(wizmo.isPhone() || wizmo.isTablet(true));
        };

        /**
         * Checks if the device is a non-mobile device
         * @return {Boolean}
         */
        wizmo_obj.isNonMobile = function()
        {
            //check if device is not phone or mobile
            return (!wizmo.isMobile());
        };

        /**
         * Checks if the device is a Retina-device i.e. it has a Pixel Ratio of 2 or greater
         * @return {Boolean}
         */
        wizmo_obj.isRetina = function()
        {
            var pixel_ratio_int = wizmo.getPixelRatio();
            return ((pixel_ratio_int >= 2));
        };


        /**
         * Gets the Browser of the device
         * Wrapper Class
         * IE, Chrome, Firefox, Safari, Opera
         */
        function _getBrowserInfo()
        {
            //detect IE
            var ie_str = _w.isIE();

            if (!ie_str)
            {
                //not IE

                /*jshint -W116 */
                var ua_str = wizmo.getUserAgent(),
                    tem,
                    M = ua_str.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
                    ;
                if(M[1]==='chrome')
                {
                    tem = ua_str.match(/\bOPR\/(\d+)/i);

                    if(tem!=null)
                    {
                        return {name:'opera', version:tem[1]};
                    }
                }

                M = M[2] ? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem = ua_str.match(/version\/(\d+)/i))!=null)
                {
                    M.splice(1,1,tem[1]);
                }
                return {
                    name: M[0],
                    version: M[1]
                };
                /*jshint +W116 */
            }
            else
            {
                //is IE
                return {
                    name: 'ie',
                    version: ''+ie_str+''
                };
            }
        }

        /**
         * Gets the Browser Info by key name
         * It also caches the value for faster returns later
         * @param key_str {String} the identifier of the required value
         * @returns {*}
         * @private
         */
        function _getBrowserInfoStore(key_str)
        {
            if(wizmo.storeCheck("var_device_browser_"+key_str))
            {
                return wizmo.store("var_device_browser_"+key_str);
            }

            var browser_info = _getBrowserInfo();
            wizmo.store("var_device_browser_"+key_str, browser_info[key_str]);
            return browser_info[key_str];
        }

        /**
         * Gets the Browser Name
         * @returns {*}
         */
        wizmo_obj.getBrowserName = function()
        {
            return _getBrowserInfoStore('name');
        };

        /**
         * Gets the Browser Version
         * @returns {*}
         */
        wizmo_obj.getBrowserVersion = function()
        {
            return _getBrowserInfoStore('version');
        };

        /**
         * Gets the online status
         * Returns true [if online] or false [if offline]
         * @param {Object} options_obj the configuration options
         * These options are specific to Offline.js
         * See Offline.js docs (http://github.hubspot.com/offline) for details
         * @return {Boolean}
         * @private
         */
        function _getOnlineStatus()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[0]) ? myArgs[0] : undefined;

            if(options_obj)
            {
                Offline.options = options_obj;
            }
            var network_state_str = Offline.state;
            return !!((network_state_str === 'up'));
        }

        /**
         * Gets the network status
         * Returns 'online' or 'offline
         * @param {Object} options_obj the configuration options
         * These options are specific to Offline.js
         * See Offline.js docs (http://github.hubspot.com/offline) for details
         * @returns {boolean}
         * @private
         */
        function _getNetworkStatus()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[0]) ? myArgs[0] : undefined;
            var network_check_bool = (_getOnlineStatus(options_obj));
            return (network_check_bool) ? 'online' : 'offline';
        }

        /**
         * Gets the network status
         * Note: this will also save the value to storage
         * Returns 'online' or 'offline
         * @returns {boolean}
         * @private
         */
        function _getNetworkStatusStore()
        {
            var network_status_str = _getNetworkStatus();
            wizmo.store("var_device_network", network_status_str);
            return network_status_str;
        }

        /**
         * Generates and applies turbo classes and attributes
         * @param context_obj {Object} The context. Default is the <body> object
         * @param is_attr_bool {Boolean} Determines if turbo-classes or turbo-attributes should be used. If true, the latter
         * @param prefix_class_str {String} Provides a prefix to the class names
         * @param prefix_attr_str {String} Provides a prefix to the attribute names
         * @private
         */
        function _turboClassesAndAttributes()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                is_init_bool = (_w.isBool(myArgs[0])) ? myArgs[0] : false,
                context_obj = (myArgs[1]) ? myArgs[1]: $('body'),
                is_attr_bool = (_w.isBool(myArgs[2])) ? myArgs[2]: false,
                prefix_class_str = (_w.isString(myArgs[3])) ? myArgs[3] : 'w_',
                prefix_attr_str = (_w.isString(myArgs[4])) ? myArgs[4] : 'data-w-',
                key_name_arr = ['mobile', 'mobile-native', 'retina', 'pixel-ratio', 'factor', 'os', 'orientation', 'viewport-w', 'viewport-h', 'viewport-w-dp', 'viewport-h-dp', 'browser-name', 'browser-version', 'css-anim', 'svg', 'font-face'],
                func_name_arr = ['isMobile', 'isMobileUtil', 'isRetina', 'getPixelRatio', 'getFormFactor', 'getPlatform', 'getOrientation', 'viewportW', 'viewportH', 'pixelW', 'pixelH', 'getBrowserName', 'getBrowserVersion', 'detectCSSTransition', 'detectSVG', 'detectFontFace'],
                class_list_arr = [],
                class_list_excl_arr = ['w_tablet', 'w_phone', 'w_mobi'],
                attr_list_key_arr = [],
                attr_list_value_arr = [],
                key_name_str,
                func_name_str,
                list_value_str,
                class_list_str,
                class_list_curr_str,
                class_list_curr_arr,
                class_list_curr_remove_arr = [],
                class_list_curr_remove_str = '',
                regex_class_obj,
                regex_class_match_arr,
                class_list_remove_arr = [],
                class_list_remove_str
                ;

            //generate turbo classes
            for(var i = 0; i < _w.count(key_name_arr); i++)
            {
                key_name_str = key_name_arr[i];
                func_name_str = func_name_arr[i];

                //push values to attributes array
                list_value_str = wizmo[func_name_str]();
                attr_list_key_arr.push(prefix_attr_str+key_name_str+'');
                attr_list_value_arr.push(list_value_str);

                //push values to classes array

                //update key names for specific method calls
                if (func_name_str === 'isMobile')
                {
                    list_value_str = (list_value_str) ? 'mobi' : 'nonmobi';
                }
                else if (func_name_str === 'isMobileUtil')
                {
                    list_value_str = (list_value_str) ? 'mobi_native' : 'nonmobi_native';
                }
                else if (func_name_str === 'isRetina')
                {
                    list_value_str = (list_value_str) ? 'retina' : 'nonretina';
                }
                else if (func_name_str === 'getPixelRatio')
                {
                    if(_w.isNumberString(list_value_str))
                    {
                        list_value_str = parseFloat(list_value_str);
                    }
                    list_value_str = Math.round(list_value_str);
                    list_value_str = list_value_str+'x';
                }
                else if (func_name_str === 'viewportW')
                {
                    list_value_str = list_value_str+'w';
                }
                else if (func_name_str === 'viewportH')
                {
                    list_value_str = list_value_str+'h';
                }
                else if (func_name_str === 'pixelW')
                {
                    list_value_str = list_value_str+'w_dp';
                }
                else if (func_name_str === 'pixelH')
                {
                    list_value_str = list_value_str+'h_dp';
                }
                else if (func_name_str === 'getBrowserName')
                {
                    list_value_str = 'browser_n_'+list_value_str;
                }
                else if (func_name_str === 'getBrowserVersion')
                {
                    list_value_str = 'browser_v_'+list_value_str;
                }
                else if (func_name_str === 'detectCSSTransition')
                {
                    list_value_str = 'css_trans';
                }
                else if (func_name_str === 'detectSVG')
                {
                    list_value_str = 'svg';
                }
                else if (func_name_str === 'detectFontFace')
                {
                    list_value_str = 'font_face';
                }
                class_list_arr.push(prefix_class_str+list_value_str);
            }

            //add special classes for internet explorer to show browsers less than 7, 8, 9, 10
            var browser_info_obj = _getBrowserInfo(),
                browser_info_name_str = browser_info_obj.name,
                browser_info_version_int = parseInt(browser_info_obj.version),
                ie_browser_lt_arr = ['7', '8', '9', '10'],
                ie_browser_num_item_int;
            for (var j = 0; j < _w.count(ie_browser_lt_arr); j++)
            {
                ie_browser_num_item_int = parseInt(ie_browser_lt_arr[j]);
                if(browser_info_name_str === 'ie' && ie_browser_num_item_int < browser_info_version_int)
                {
                    class_list_arr.push(prefix_class_str+'ie_lt_'+browser_info_version_int);
                }
            }

            //add class constants
            class_list_arr.push(prefix_class_str+'turbo');


            if(is_attr_bool)
            {
                //add attributes
                for (var k = 0; k < _w.count(attr_list_key_arr); k++)
                {
                    list_value_str = attr_list_value_arr[k];
                    if(attr_list_key_arr[k] === 'data-w-pixel-ratio')
                    {
                        if(_w.isNumberString(list_value_str))
                        {
                            list_value_str = parseFloat(list_value_str);
                        }
                        list_value_str = Math.round(list_value_str);
                    }

                    context_obj.attr(attr_list_key_arr[k], list_value_str);
                }
            }
            else
            {
                //add to class attribute

                class_list_str = _w.implode(' ', class_list_arr);

                if(is_init_bool)
                {
                    //remove any invalid pre-defined classes first before adding turbo classes

                    //get current class(es)
                    class_list_curr_str = context_obj.attr('class');
                    class_list_curr_str = (_w.isString(class_list_curr_str) && class_list_curr_str.length > 0) ? class_list_curr_str.trim() : '';

                    //remove multiple spaces if any
                    class_list_curr_str = class_list_curr_str.replace(/\s\s+/g, ' ');
                    class_list_curr_arr = _w.explode(' ', class_list_curr_str);

                    //check if classes exist in list of turbo classes to be added
                    //if not, mark them for removal
                    if (_w.count(class_list_curr_arr) > 0) {
                        for (var m = 0; m < class_list_curr_arr.length; m++) {
                            if (!_w.in_array(class_list_curr_arr[m], class_list_arr) && /^ *w_/i.test(class_list_curr_arr[m]) && _w.in_array(class_list_curr_arr[m], class_list_excl_arr)) {
                                class_list_curr_remove_arr.push(class_list_curr_arr[m]);
                            }
                        }

                        if (class_list_curr_remove_arr.length > 0) {
                            class_list_curr_remove_str = _w.implode(' ', class_list_curr_remove_arr);
                        }
                    }

                    //add turbo classes
                    //remove pre-defined classes if need be
                    context_obj.removeClass(class_list_curr_remove_str).addClass(class_list_str);
                }
                else if(wizmo.storeCheck('var_data_ctx_body_class_list_remove'))
                {
                    //remove certain turbo classes first
                    context_obj.removeClass(wizmo.store('var_data_ctx_body_class_list_remove')).addClass(class_list_str);
                }
                else
                {
                    if(!wizmo.domStore('var_data_turbo_class_reset_init') && _w.config.debug)
                    {
                        context_obj.removeAttr('class').addClass(class_list_str);

                        wizmo.domStore('var_data_turbo_class_reset_init', true);
                    }
                    else
                    {
                        //add turbo classes
                        context_obj.addClass(class_list_str);
                    }
                }

                //generate list of classes to be removed before main class additions
                regex_class_obj = new RegExp("(w_[0-9]+(?:w_dp|h_dp|h|w)|w_(?:portrait|landscape))", "gi");
                regex_class_match_arr = _w.regexMatchAll(regex_class_obj, class_list_str);

                if(regex_class_match_arr.length > 0)
                {
                    //generate remove class list

                    for(var m = 0; m < regex_class_match_arr.length; m++)
                    {
                        class_list_remove_arr.push(regex_class_match_arr[m][1]);
                    }

                    class_list_remove_str = _w.implode(' ', class_list_remove_arr);

                    //save
                    wizmo.store('var_data_ctx_body_class_list_remove', class_list_remove_str);
                }
            }
        }

        /**
         * Generates and applies turbo classes for resize and scroll events
         * @param {String} event_type_str the event type. The two options are 'resize' and 'scroll'
         * @param {Object} context_obj the context
         * @param {String} prefix_class_str the string to prefix the classes with. Default is w_
         * @param {String} prefix_attr_str the string to prefix the attributes with. Default is data-w-
         * @private
         */
        function _turboClassesAndAttributesResizeAndScroll(event_type_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                context_obj = (myArgs[1]) ? myArgs[1]: $('body'),
                prefix_class_str = (_w.isString(myArgs[2])) ? myArgs[2] : 'w_',
                prefix_attr_str = (_w.isString(myArgs[3])) ? myArgs[3] : 'data-w-',
                prefix_class_f_str = prefix_class_str+event_type_str+'_',
                prefix_attr_f_str = prefix_attr_str+event_type_str+'-',
                class_list_start_end_arr = [prefix_class_f_str+'on', prefix_class_f_str+'off'],
                class_list_start_end_str = _w.implode(' ', class_list_start_end_arr),
                class_list_direction_arr,
                class_list_direction_str,
                class_list_direction_active_arr,
                class_list_direction_active_str,
                class_list_direction_curr_str = '',
                direction_h_str,
                direction_v_str,
                direction_h_idx_str,
                direction_v_idx_str,
                direction_h_left_suffix_str,
                direction_h_right_suffix_str,
                turbo_fn,
                turbo_start_fn,
                turbo_end_fn,
                domstore_varname_str
                ;

            //return false if event_type_str is invalid
            if(!_w.in_array(event_type_str, ['resize', 'scroll']))
            {
                return false;
            }

            //create dom store variable for tracking operations
            domstore_varname_str = 'var_event_'+event_type_str+'_turbo_init';

            //Set up
            if(!wizmo.domStore(domstore_varname_str))
            {
                //determine direction suffix based on event_type_str
                //used to minimize if conditionals later
                direction_h_left_suffix_str = (event_type_str === 'resize') ? 'in' : 'left';
                direction_h_right_suffix_str = (event_type_str === 'resize') ? 'out' : 'right';

                class_list_direction_arr = [prefix_class_f_str+direction_h_left_suffix_str, prefix_class_f_str+direction_h_right_suffix_str, prefix_class_f_str+'up', prefix_class_f_str+'down'];

                class_list_direction_str = _w.implode(' ', class_list_direction_arr);

                //set up functions
                turbo_fn = function(){

                    class_list_direction_active_arr = [];

                    //get scroll direction
                    direction_h_str = (event_type_str === 'resize') ? _getResizeDirection("h") : _getScrollDirection("h");
                    direction_v_str = (event_type_str === 'resize') ? _getResizeDirection("v") : _getScrollDirection("v");

                    //get scroll direction character
                    direction_h_idx_str = direction_h_str.slice(0, 1);
                    direction_v_idx_str = direction_v_str.slice(0, 1);

                    //push to class list
                    if(direction_h_idx_str === 'l' || direction_h_idx_str === 'i')
                    {
                        class_list_direction_active_arr.push(prefix_class_f_str+direction_h_left_suffix_str);
                    }
                    else if(direction_h_idx_str === 'r' || direction_h_idx_str === 'o')
                    {
                        class_list_direction_active_arr.push(prefix_class_f_str+direction_h_right_suffix_str);
                    }

                    //push to class list
                    if(direction_v_idx_str === 'u')
                    {
                        class_list_direction_active_arr.push(prefix_class_f_str+"up");
                    }
                    else if(direction_v_idx_str === 'd')
                    {
                        class_list_direction_active_arr.push(prefix_class_f_str+"down");
                    }

                    //generate class string
                    class_list_direction_active_str = _w.implode(' ', class_list_direction_active_arr);

                    //add classes or attributes on changes only
                    if(class_list_direction_active_str !== class_list_direction_curr_str)
                    {
                        //add classes
                        if(_w.isString(class_list_direction_active_str) && class_list_direction_active_str.length > 0)
                        {
                            context_obj.removeClass(class_list_direction_str).addClass(class_list_direction_active_str);
                        }

                        //add attributes
                        context_obj.attr(prefix_attr_f_str+'direction-h', direction_h_str);
                        context_obj.attr(prefix_attr_f_str+'direction-v', direction_v_str);

                        //set current
                        class_list_direction_curr_str = class_list_direction_active_str;
                    }
                };

                turbo_start_fn = function(){
                    //add classes
                    context_obj.removeClass(class_list_start_end_str).addClass(prefix_class_f_str+'on');

                    //add attributes
                    context_obj.attr(prefix_attr_f_str+'state', 'on');
                };

                turbo_end_fn = function(){
                    //add classes
                    context_obj.removeClass(class_list_start_end_str).addClass(prefix_class_f_str+'off');

                    //add attributes
                    context_obj.attr(prefix_attr_f_str+'state', 'off');
                };

                //initialize functions
                if(event_type_str === 'resize')
                {
                    //for resize
                    _onResize(turbo_fn, _w.config.resize.default_handler_type, _w.config.resize.default_handler_timer);
                    _onResizeStart(turbo_start_fn);
                    _onResizeEnd(turbo_end_fn);
                }
                else
                {
                    //for scroll
                    _onScroll(turbo_fn, _w.config.scroll.default_handler_type, _w.config.scroll.default_handler_timer);
                    _onScrollStart(turbo_start_fn);
                    _onScrollEnd(turbo_end_fn);
                }

                //mark true to prevent running multiple times
                wizmo.domStore(domstore_varname_str, true);
            }
        }

        /**
         * Generates and applies turbo classes for network connectivity events
         * @param {Object} context_obj the context
         * @param {String} prefix_class_str the string to prefix the classes with. Default is w_
         * @param {String} prefix_attr_str the string to prefix the attributes with. Default is data-w-
         * @private
         */
        function _turboClassesAndAttributesNetwork()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                context_obj = (myArgs[0]) ? myArgs[0]: $('body'),
                prefix_class_str = (_w.isString(myArgs[1])) ? myArgs[1] : 'w_',
                prefix_attr_str = (_w.isString(myArgs[2])) ? myArgs[2] : 'data-w-',
                class_list_main_arr = [prefix_class_str+'online', prefix_class_str+'offline', prefix_class_str+'reconnect', prefix_class_str+'reconnect_fail'],
                class_list_main_str = _w.implode(' ', class_list_main_arr),
                network_status_str,
                turbo_network_up_fn,
                turbo_network_down_fn,
                turbo_network_reconnect_fn,
                turbo_network_reconnect_fail_fn,
                domstore_varname_str
                ;

            //create dom store variable for tracking operations
            domstore_varname_str = 'var_event_network_turbo_init';

            //Set up
            if(!wizmo.domStore(domstore_varname_str))
            {
                //on network up
                turbo_network_up_fn = function()
                {
                    //add classes
                    context_obj.removeClass(class_list_main_str).addClass(prefix_class_str+'online');

                    //add attributes
                    context_obj.attr(prefix_attr_str+'network', 'online');
                    context_obj.attr(prefix_attr_str+'network-reconnect', 'false');

                    //update local storage values
                    wizmo.store('var_device_network', 'online');
                    wizmo.store('var_device_network_reconnect', false);
                };

                //on network down
                turbo_network_down_fn = function()
                {
                    //add classes
                    context_obj.removeClass(class_list_main_str).addClass(prefix_class_str+'offline');

                    //add attributes
                    context_obj.attr(prefix_attr_str+'network', 'offline');

                    //update local storage values
                    wizmo.store('var_device_network', 'offline');
                };

                //on network reconnect
                turbo_network_reconnect_fn = function()
                {
                    //add classes
                    context_obj.removeClass('').addClass(prefix_class_str+'reconnect');

                    //add attributes
                    context_obj.attr(prefix_attr_str+'network-reconnect', 'true');

                    //update local storage values
                    wizmo.store('var_device_network_reconnect', true);
                };

                //on network reconnect fail
                turbo_network_reconnect_fail_fn = function()
                {
                    //add classes
                    context_obj.removeClass('').addClass(prefix_class_str+'reconnect_fail');
                };

                //add classes and attributes on first run
                network_status_str = _getNetworkStatusStore();
                context_obj.removeClass(class_list_main_str).addClass(prefix_class_str+network_status_str);
                context_obj.attr(prefix_attr_str+'network', network_status_str);

                //set event handlers
                _onNetworkUp(turbo_network_up_fn);
                _onNetworkDown(turbo_network_down_fn);
                _onNetworkReconnect(turbo_network_reconnect_fn);
                _onNetworkReconnectFail(turbo_network_reconnect_fail_fn);

                //mark true to prevent running multiple times
                wizmo.domStore(domstore_varname_str, true);
            }
        }

        /**
         * Generates and applies turbo classes for resize events
         * Wrapper class for _turboClassesAndAttributesResizeAndScroll
         * @private
         */
        function _turboClassesAndAttributesResize()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            _turboClassesAndAttributesResizeAndScroll('resize', myArgs[0], myArgs[1], myArgs[2]);
        }

        /**
         * Generates and applies turbo classes for scroll events
         * Wrapper class for _turboClassesAndAttributesResizeAndScroll
         * @private
         */
        function _turboClassesAndAttributesScroll()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            _turboClassesAndAttributesResizeAndScroll('scroll', myArgs[0], myArgs[1], myArgs[2]);
        }


        /**
         * Adds turbo classes to the <body> tag
         * @private
         */
        function _turboClasses()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            _turboClassesAndAttributes(myArgs[0]);
        }

        /**
         * Adds turbo attributes to the <body> tag
         * @private
         */
        function _turboAttributes()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            _turboClassesAndAttributes(myArgs[0], null, true);
        }


        /**
         * Composes and Saves a List of Standard Graphic Resolutions
         * @return {Array}
         * @private
         */
        function _getResolutionList()
        {
            //Check if Resolution List is Stored
            if(wizmo.storeCheck("var_data_cache_res_list"))
            {
                return wizmo.store("var_data_cache_res_list");
            }

            var $res_arr = [
                'qqvga', 'qqvgax1', 'hqvga', 'hqvgax1', 'hqvgax2', 'hvgax1', 'qvga', 'wqvga', 'wqvga1', 'hvga',
                'hvga1', 'hvga2', 'hvga3', 'hvgax1', 'hvgax2', 'vga', 'wvga', 'wvgax1', 'fwvga', 'svga',
                'dvga', 'dvgax1', 'wsvga', 'wsvga1', 'xga', 'wxga', 'wxga1', 'wxga2', 'wxga3', 'wxga4', 'wxga5',
                'xga+', 'wxga+', 'sxga', 'sxga+', 'wsxga+', 'uxga', 'wuxga', 'qwxga', 'qxga', 'wqxga',
                'qsxga', 'wqsxga', 'quxga', 'wquxga', 'hxga', 'whxga', 'hsxga', 'whsxga', 'huxga', 'whuxga',
                'nhd', 'nhdx1', 'qhd', 'hd', '720p', 'fhd', '1080p', '1080i', 'wqhd', 'mbprhd', '4kuhd', '8kuhd'
            ];

            wizmo.store("var_data_cache_res_list", $res_arr);
            return $res_arr;
        }

        /**
         * Composes and Saves a Resolution Matrix (Resolution to Dimensions)
         * @return {Array|Object}
         * @private
         */
        function _getResolutionMatrix()
        {
            //Check if Resolution Matrix is Stored
            if(wizmo.storeCheck("var_data_cache_res_matrix"))
            {
                return wizmo.store("var_data_cache_res_matrix");
            }

            var $res_matrix_arr = {
                'qqvga': '120_160', 'qqvgax1': '128_160', 'hqvga': '160_240', 'hqvgax1': '240_240', 'hqvgax2': '240_260',
                'qvga': '240_320', 'wqvga': '240_400', 'wqvga1': '240_432', 'hvga': '320_480',
                'hvga1': '360_480', 'hvga2': '272_480', 'hvga3': '240_640', 'hvgax1': '200_640', 'hvgax2': '300_640',
                'hvgax3': '360_400',
                'vga': '480_640', 'wvga': '480_800', 'wvgax1': '352_800', 'fwvga': '480_854', 'svga': '600_800',
                'dvga': '640_960', 'dvgax1': '640_1136', 'wsvga': '576_1024', 'wsvga1': '600_1024', 'xga': '768_1024',
                'wxga': '768_1280', 'wxga1': '720_1280', 'wxga2': '800_1280', 'wxga3': '768_1360', 'wxga4': '768_1366',
                'wxga5': '720_720',
                'xga+': '864_1152', 'wxga+': '900_1440', 'sxga': '1024_1280', 'sxga+': '1050_1400', 'wsxga+': '1050_1680',
                'uxga': '1200_1600', 'wuxga': '1200_1920', 'qwxga': '1152_2048', 'qxga': '1536_2048', 'wqxga': '1600_2560',
                'wqxga+': '1800_3200',
                'qsxga': '2048_2560', 'wqsxga': '2048_3200', 'quxga': '2400_3200', 'wquxga': '2400_3840', 'hxga': '3072_4096',
                'whxga': '3200_5120', 'hsxga': '4096_5120', 'whsxga': '4096_6400', 'huxga': '4800_6400', 'whuxga': '4800_7680',
                'nhd': '360_640', 'nhdx1': '320_640', 'qhd': '540_960', 'hd': '720_1280', '720p': '720_1280', 'fhd': '1080_1920',
                '1080p': '1080_1920', '1080i': '1080_1920', 'wqhd': '1440_2560', 'mbprhd': '1800_2880', '4kuhd': '2160_3840',
                '8kuhd': '4320_7680'
            };

            wizmo.store("var_data_cache_res_matrix", $res_matrix_arr);
            return $res_matrix_arr;
        }

        /**
         * Gets the Standard Display Resolution of the given device
         * @return {String}
         */
        wizmo_obj.getResolution = function()
        {
            var is_landscape_bool = wizmo.isLandscape(),
                screen_w = wizmo.screenW(),
                screen_h = wizmo.screenH(),
                std_w_arr = (is_landscape_bool) ? wizmo.getResolutionDimensionList('h') :wizmo.getResolutionDimensionList('w'),
                std_h_arr = (is_landscape_bool) ? wizmo.getResolutionDimensionList('w'): wizmo.getResolutionDimensionList('h'),
                screen_w_std = _w.getClosestNumberMatchArray(std_w_arr, screen_w),
                screen_h_std = _w.getClosestNumberMatchArray(std_h_arr, screen_h),
                screen_res_str,
                screen_res_matrix_arr = _getResolutionMatrix(),
                screen_res_name_str
                ;

            if(screen_w_std >= screen_h_std)
            {
                screen_res_str = screen_h_std+'_'+screen_w_std;
            }
            else
            {
                screen_res_str = screen_w_std+'_'+screen_h_std;
            }

            screen_res_name_str = _w.array_search(screen_res_str, screen_res_matrix_arr);

            return screen_res_name_str;
        };

        /**
         * Converts various types of breakpoints into pixel breakpoints
         * 1. Viewport breakpoints: 300 = 300 pixels wide
         * 2. Resolution breakpoints: SVGA = 800 pixels wide
         * 3. Orientation breakpoints: 300-p = 300 pixels wide only in portrait orientation
         * 4. Dual viewport breakpoints: 300x320 = 300 pixels wide by 320 pixels high
         * @param bp_arr {Array} the main breakpoint values
         * @param bp_class_arr {Array} the corresponding CSS classes to be added
         * to the DOM on breakpoint match. Array count must tally with bp_arr
         * @param bp_attr_arr {Array} the corresponding attribute values to be added
         * to the DOM on breakpoint match. Array count must tally with bp_arr
         * @param bp_scroll_isset_bool {Boolean} set to true if breakpoints are for scroll [as opposed to viewport]
         * @return {Array}
         * @private
         */
        function _getBreakpoints(bp_arr)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                bp_arr_count_int = _w.count(bp_arr),
                bp_class_arr = (myArgs[1]) ? myArgs[1] : [],
                bp_class_count_int = _w.count(bp_class_arr),
                bp_class_arr_isset_bool = ((bp_class_count_int > 0)),
                bp_attr_arr = (_w.isArray(myArgs[2])) ? myArgs[2] : [],
                bp_attr_count_int = _w.count(bp_attr_arr),
                bp_attr_arr_isset_bool = ((bp_attr_count_int > 0)),
                bp_scroll_isset_bool = (_w.isBool(myArgs[3])) ? myArgs[3] : false,
                bp_scroll_distance_arr = [],
                bp_scroll_direction_arr = [],
                bp_scroll_offset_arr = [],
                bp_item_str,
                list_res_arr,
                matrix_res_arr,
                ort_marker_str = '',
                ort_marker_key_str = '',
                error_marker_str = '',
                bp_temp_w_arr = [],
                bp_item_w_temp_int = '',
                bp_temp_h_arr = [],
                bp_item_h_temp_int = '',
                bp_item_regex_w_h_obj = /^[0-9]+x[0-9]+$/i,
                bp_item_regex_w_obj = /[0-9]+/i,
                bp_item_regex_s_obj = /^([0-9]+|#[^\s@,]+)@*(up|down|right|left|u|d|r|l|),?(\-?[0-9]+|)$/i,
                bp_item_regex_s_match_arr = [],
                bp_item_scroll_distance_str,
                bp_item_scroll_direction_str,
                bp_item_scroll_offset_str,
                bp_temp_type_arr = [],
                bp_ort_marker_temp_arr = [],
                bp_final_arr = [],
                bp_item_final_str,
                bp_item_v_temp_arr = []
                ;

            //Create variables for counter functionality
            var counter_int = 0,
                counter_alpha_str = '',
                counter_alpha_arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai',
                    'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax'
                ],
                counter_alpha_pre_arr = [],
                counter_alpha_post_arr = [],
                bp_item_w_temp_final_int,
                bp_item_h_temp_final_int;

            try{

                /**
                 * validate arguments provided
                 */

                //ensure that the breakpoints are provided in an array
                if(!_w.isArray(bp_arr))
                {
                    throw new Error ("Breakpoints must be provided in array format!");
                }

                //ensure that the breakpoints are not empty
                if(bp_arr_count_int < 1)
                {
                    throw new Error ("Breakpoints can't be empty!");
                }

                if(!bp_scroll_isset_bool)
                {
                    //do only if not scroll breakpoints
                    //ensure that either classes or attributes are provided
                    if(bp_class_count_int < 1 && bp_attr_count_int < 1)
                    {
                        throw new Error ("You have to provide either a set of classes or a set of attribute values!");
                    }

                    //ensure that the breakpoints and classes (if provided) match in size
                    if(bp_class_count_int > 0 && (bp_class_count_int !== bp_arr_count_int))
                    {
                        throw new Error("The breakpoints array and the classes array must match in size!");
                    }

                    //ensure that the breakpoints and attributes (if provided) match in size
                    if(bp_attr_count_int > 0 && (bp_attr_count_int !== bp_arr_count_int))
                    {
                        throw new Error("The breakpoints array and the attributes array must match in size!");
                    }
                }


                //Get Breakpoint Reference Data
                list_res_arr = _getResolutionList();
                matrix_res_arr = _getResolutionMatrix();

                //iterate over breakpoints
                for(var i = 0; i < bp_arr_count_int; i++)
                {
                    bp_item_str = bp_arr[i];

                    counter_alpha_str = counter_alpha_arr[i];

                    //ensure that the orientation markers are valid i.e. only -p and -l if any
                    //NOTE: ignore for scroll breakpoints
                    if(!bp_scroll_isset_bool)
                    {
                        if(/-+/i.test(bp_item_str) && !/^[^-]*-[^-]*$/i.test(bp_item_str))
                        {
                            //error in the way orientation markers are defined
                            error_marker_str += '2';
                        }
                    }

                    //find out if there are any resolution markers e.g. -l or -p
                    ort_marker_str = '';
                    ort_marker_key_str = '';
                    if(_w.substr_count(bp_item_str, '-p') > 0)
                    {
                        ort_marker_str = 'p';
                        ort_marker_key_str = '-p';

                        bp_ort_marker_temp_arr.push('p');
                    }
                    else if (_w.substr_count(bp_item_str, '-l') > 0)
                    {
                        ort_marker_str = 'l';
                        ort_marker_key_str = '-l';

                        bp_ort_marker_temp_arr.push('l');
                    }
                    else{
                        bp_ort_marker_temp_arr.push('x');
                    }

                    //reset the breakpoint i.e. remove any resolution markers
                    bp_item_final_str = bp_item_str.replace(''+ort_marker_key_str+'', '');

                    //find out which class of breakpoint i.e. viewport, device, or resolution
                    if(_w.in_array(bp_item_final_str, list_res_arr))
                    {
                        //is resolution breakpoint. Get viewport dimensions
                        bp_item_v_temp_arr = _w.arrayToInteger(_w.explode('_', matrix_res_arr[''+bp_item_final_str+'']));

                        bp_item_w_temp_int = parseInt(bp_item_v_temp_arr[0]);
                        bp_item_h_temp_int = parseInt(bp_item_v_temp_arr[1]);

                        //consider landscape orientation markers
                        bp_item_w_temp_final_int = bp_item_w_temp_int;
                        bp_item_h_temp_final_int = bp_item_h_temp_int;

                        if(ort_marker_str === 'l')
                        {
                            bp_item_w_temp_final_int = bp_item_h_temp_int;
                            bp_item_h_temp_final_int = bp_item_w_temp_int;
                        }

                        bp_temp_w_arr[counter_alpha_str] = bp_item_w_temp_final_int;
                        bp_temp_h_arr[counter_alpha_str] = bp_item_h_temp_final_int;

                        //set breakpoint type as resolution
                        bp_temp_type_arr.push('r');
                    }
                    else if(bp_item_regex_w_h_obj.test(bp_item_final_str))
                    {
                        //is viewport dual breakpoint i.e. horizontal and vertical
                        bp_item_v_temp_arr = _w.explode('x', bp_item_final_str);

                        bp_temp_w_arr[counter_alpha_str] = parseInt(bp_item_v_temp_arr[0]);
                        bp_temp_h_arr[counter_alpha_str] = parseInt(bp_item_v_temp_arr[1]);

                        //set breakpoint type as viewport
                        bp_temp_type_arr.push('v');
                    }
                    else if (bp_scroll_isset_bool)
                    {
                        bp_item_regex_s_match_arr = _w.regexMatchAll(bp_item_regex_s_obj, bp_item_final_str);

                        bp_item_scroll_distance_str = bp_item_regex_s_match_arr[0][1];
                        bp_item_scroll_direction_str = bp_item_regex_s_match_arr[0][2];
                        bp_item_scroll_offset_str = bp_item_regex_s_match_arr[0][3];

                        //define scroll direction setting
                        if(bp_item_scroll_direction_str === 'u' || bp_item_scroll_direction_str === 'up')
                        {
                            bp_item_scroll_direction_str = 'u';
                        }
                        else if(bp_item_scroll_direction_str === 'l' || bp_item_scroll_direction_str === 'left')
                        {
                            bp_item_scroll_direction_str = 'l';
                        }
                        else if (bp_item_scroll_direction_str === 'r' || bp_item_scroll_direction_str === 'right')
                        {
                            bp_item_scroll_direction_str = 'r';
                        }
                        else
                        {
                            bp_item_scroll_direction_str = 'd';
                        }

                        bp_temp_w_arr[counter_alpha_str] = 1;
                        bp_temp_h_arr[counter_alpha_str] = 0;

                        //set scroll breakpoint direction
                        bp_scroll_distance_arr.push(bp_item_scroll_distance_str);
                        bp_scroll_direction_arr.push(bp_item_scroll_direction_str);
                        bp_scroll_offset_arr.push(bp_item_scroll_offset_str);

                        //set breakpoint type as scroll
                        bp_temp_type_arr.push('s');
                    }
                    else if (bp_item_regex_w_obj.test(bp_item_final_str))
                    {
                        //is viewport breakpoint
                        bp_temp_w_arr[counter_alpha_str] = parseInt(bp_item_final_str);
                        bp_temp_h_arr[counter_alpha_str] = 0;

                        //set breakpoint type as viewport
                        bp_temp_type_arr.push('v');
                    }
                    else
                    {
                        //mark error
                        error_marker_str += '1';
                    }

                    counter_alpha_pre_arr.push(counter_alpha_str);
                    counter_int++;
                }

                //check if there are any errors. If yes, throw error
                if (/[1]+/i.test(error_marker_str))
                {
                    throw new Error("There are errors in your 'Breakpoints' settings!");
                }

                if (/[2]+/i.test(error_marker_str))
                {
                    throw new Error("There are errors in your 'Breakpoints' settings with regard to the way you have defined orientation markers e.g. -p or -l!");
                }

                //compose breakpoints
                var cmp = function ($a, $b) {
                    if ($a === $b) {
                        return 0;
                    }
                    return ($a < $b) ? -1 : 1;
                };

                var bp_temp_w_sort_arr = [],
                    bp_temp_h_sort_arr = [],
                    bp_temp_h_sort_raw_arr = [],
                    bp_temp_w_sort_int,
                    bp_temp_w_sort_juxta_key_int,
                    bp_type_arr = [],
                    bp_temp_ort_sort_arr = [],
                    bp_temp_class_arr = [],
                    bp_temp_attr_arr = [],
                    bp_temp_scroll_distance_arr = [],
                    bp_temp_scroll_direction_arr = [],
                    bp_temp_scroll_offset_arr = []
                    ;

                //sort viewport width breakpoints
                bp_temp_w_sort_arr = _w.uasort(bp_temp_w_arr, cmp);

                //sort other arrays in an identical fashion to viewport width breakpoints
                counter_alpha_post_arr = _w.array_keys(bp_temp_w_sort_arr);
                var bp_temp_w_sort_arr_size_int = _w.count(bp_temp_w_sort_arr);

                //sort and arrange breakpoint values
                for(var j = 0; j < bp_temp_w_sort_arr_size_int; j++)
                {
                    bp_temp_w_sort_int = counter_alpha_post_arr[j];
                    bp_temp_w_sort_juxta_key_int = _w.array_search(bp_temp_w_sort_int, counter_alpha_pre_arr);

                    //sort breakpoint heights array
                    bp_temp_h_sort_arr[bp_temp_w_sort_int] = bp_temp_h_arr[bp_temp_w_sort_int];

                    //sort breakpoint type array
                    bp_type_arr[j] = bp_temp_type_arr[bp_temp_w_sort_juxta_key_int];

                    //sort the orientation marker array
                    bp_temp_ort_sort_arr[j] = bp_ort_marker_temp_arr[bp_temp_w_sort_juxta_key_int];

                    //sort the classes and attributes array
                    bp_temp_class_arr[j] = bp_class_arr[bp_temp_w_sort_juxta_key_int];
                    bp_temp_attr_arr[j] = bp_attr_arr[bp_temp_w_sort_juxta_key_int];

                    //sort the scroll array
                    bp_temp_scroll_distance_arr[j] = bp_scroll_distance_arr[bp_temp_w_sort_juxta_key_int];
                    bp_temp_scroll_direction_arr[j] = bp_scroll_direction_arr[bp_temp_w_sort_juxta_key_int];
                    bp_temp_scroll_offset_arr[j] = bp_scroll_offset_arr[bp_temp_w_sort_juxta_key_int];
                }

                //Save Primary Results Data to Array

                //width
                bp_final_arr.bp_w = _w.implode('|', bp_temp_w_sort_arr);

                //height
                bp_temp_h_sort_raw_arr = _w.array_values(bp_temp_h_sort_arr);
                bp_final_arr.bp_h = _w.implode('|', bp_temp_h_sort_raw_arr);
                if(!bp_scroll_isset_bool)
                {
                    //orientation
                    bp_final_arr.bp_o = _w.implode('|', bp_temp_ort_sort_arr);
                }

                //type
                bp_final_arr.bp_t = _w.implode('|', bp_type_arr);

                //add data for classes (if set)
                if(bp_class_arr_isset_bool)
                {
                    bp_final_arr.bp_c = _w.implode('|', bp_temp_class_arr);
                }

                //add data for attributes (if set)
                if(bp_attr_arr_isset_bool)
                {
                    bp_final_arr.bp_a = _w.implode('|', bp_temp_attr_arr);
                }

                //add data for scroll (if set)
                if(bp_scroll_isset_bool)
                {
                    bp_final_arr.bp_s_dst = _w.implode('|', bp_temp_scroll_distance_arr);
                    bp_final_arr.bp_s_dir = _w.implode('|', bp_temp_scroll_direction_arr);
                    bp_final_arr.bp_s_ofs = _w.implode('|', bp_temp_scroll_offset_arr);
                }

                return bp_final_arr;
            }
            catch(e)
            {
                var e_msg_str = _w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: '+e.message;
                _w.console.error(e_msg_str, true);
            }
        }

        /**
         * Determines the basis for responsiveness
         * The only two possible results are:
         * 1. viewport i.e. track the viewport
         * 2. container i.e. track a block level element
         * If the given context is a child element of <body>, then the basis is
         * 'container' or 'c'
         * If the given context is not a child element of <body>, then the basis is
         * 'viewport' or 'v'
         * @param ctx {Object} a DOM object
         * @returns {*}
         * @private
         */
        function _getResponsiveBasis(ctx){
            /**
             * This determines the basis for responsiveness i.e. viewport or container
             * 1: If context does not have a tag name of HTML, BODY, SCRIPT, STYLE, META or LINK, then the selector must be under
             * <BODY>, and basis is 'container' or 'c'
             * 2: If above is false, basis is 'viewport' or 'v'
             */
            var ctx_tag_str = (wQuery.isWQueryObject(ctx)) ? ctx.tagName : ctx.prop("nodeName").toLowerCase(),
                ctx_is_child_of_body_bool = /^((?!(window|html|head|meta|script|link|style|body)).*)$/i.test(ctx_tag_str)
                ;

            return (ctx_is_child_of_body_bool) ?  'c' : 'v';
        }

        /**
         * Determines if there is a scroll breakpoint match and sets the corresponding class
         * @param ctx {Object} the context
         * @param bp_arr {Array} the breakpoints data
         * @param options {*} the options provided in the wizmo constructor
         * @private
         */
        function _setBreakpointsScroll(ctx, bp_arr, options)
        {
            //Extract Data to Array
            /*jshint -W069 */
            var bp_scroll_classes_arr = (bp_arr["bp_c"]) ? _w.explode("|", bp_arr["bp_c"]) : null,
                bp_scroll_distance_arr = (bp_arr["bp_s_dst"]) ? _w.explode("|", bp_arr["bp_s_dst"]) : null,
                bp_scroll_direction_arr = (bp_arr["bp_s_dir"]) ? _w.explode("|", bp_arr["bp_s_dir"]) : null,
                bp_scroll_offset_arr = (bp_arr["bp_s_ofs"]) ? _w.explode("|", bp_arr["bp_s_ofs"]) : null,
                bp_arr_count_int = _w.count(bp_scroll_distance_arr)
                ;

            //Get Viewport Scroll Information
            var scroll_pos_top_curr_int = parseInt(wizmo.store("var_viewport_scroll_t")),
                scroll_pos_top_prev_int = parseInt(wizmo.store("var_viewport_scroll_t_prev")),
                scroll_pos_left_curr_int = parseInt(wizmo.store("var_viewport_scroll_l")),
                scroll_pos_left_prev_int = parseInt(wizmo.store("var_viewport_scroll_l_prev")),
                scroll_dir_h_str = _getScrollDirection("h"),
                scroll_dir_v_str = _getScrollDirection("v")
                ;

            //get scroll direction character
            scroll_dir_h_str = scroll_dir_h_str.slice(0, 1);
            scroll_dir_v_str = scroll_dir_v_str.slice(0, 1);

            /*jshint +W069 */

            //Define trackers
            var bp_scr_dir_item_str,
                bp_scr_dst_item_str,
                bp_scr_dst_item_temp_str,
                bp_scr_dst_item_temp_int,
                bp_scr_dst_item_select_int,
                bp_scr_dst_item_select_prev_int,
                bp_scr_ofs_item_str,
                bp_scr_ofs_item_int,
                bp_item_elem_obj,
                bp_item_elem_offset_obj,      //elem.offset()
                bp_item_elem_scroll_pos_obj,
                bp_item_elem_offset_top_int,
                bp_item_elem_offset_left_int,
                bp_item_elem_scroll_pos_top_int,
                bp_item_elem_scroll_pos_left_int,
                bp_item_elem_scroll_pos_top_e_int,
                bp_item_elem_scroll_pos_left_e_int,
                bp_item_elem_scroll_pos_offset_int = 0,
                bp_item_class_str,
                bp_item_attr_str,
                bp_item_dom_store_var_str,
                bp_item_dom_store_var_isset_str
                ;

            for(var i = 0; i < bp_arr_count_int; i++)
            {
                //get scroll breakpoint info
                bp_scr_dir_item_str = bp_scroll_direction_arr[i];
                bp_scr_dst_item_temp_str = bp_scroll_distance_arr[i];
                bp_scr_dst_item_str = bp_scr_dst_item_temp_str;
                bp_scr_ofs_item_str = bp_scroll_offset_arr[i];
                bp_scr_ofs_item_int = (_w.isNumberString(bp_scr_ofs_item_str)) ? parseInt(bp_scr_ofs_item_str) : 0;

                //manage element-level breakpoints
                if(/^ *\#[^\s]+? *$/i.test(bp_scr_dst_item_temp_str))
                {
                    if(_w.isString(bp_scr_ofs_item_str) && bp_scr_ofs_item_str.length > 0)
                    {
                        bp_item_elem_scroll_pos_offset_int = bp_scr_ofs_item_int;
                    }

                    bp_item_elem_obj = $(bp_scr_dst_item_temp_str);

                    bp_item_elem_offset_obj = bp_item_elem_obj.offset();
                    bp_item_elem_offset_top_int = bp_item_elem_offset_obj.top;
                    bp_item_elem_offset_left_int = bp_item_elem_offset_obj.left;

                    //get scroll positions
                    bp_item_elem_scroll_pos_obj = bp_item_elem_obj.scrollPosition();
                    bp_item_elem_scroll_pos_top_int = bp_item_elem_scroll_pos_obj.top;
                    bp_item_elem_scroll_pos_left_int = bp_item_elem_scroll_pos_obj.left;
                    bp_item_elem_scroll_pos_top_e_int = bp_item_elem_scroll_pos_obj.top_e;
                    bp_item_elem_scroll_pos_left_e_int = bp_item_elem_scroll_pos_obj.left_e;

                    bp_scr_dst_item_temp_str = (bp_scr_dir_item_str === 'l' || bp_scr_dir_item_str === 'r') ? ""+bp_item_elem_offset_left_int+"" : ""+bp_item_elem_offset_top_int+"" ;
                }

                //parse to integer
                bp_scr_dst_item_temp_int = parseInt(bp_scr_dst_item_temp_str);

                //manage offset
                bp_scr_dst_item_temp_int = bp_scr_dst_item_temp_int+bp_item_elem_scroll_pos_offset_int;

                bp_scr_dst_item_select_int = (bp_scr_dir_item_str === 'l' || bp_scr_dir_item_str === 'r') ? scroll_pos_left_curr_int : scroll_pos_top_curr_int;
                bp_scr_dst_item_select_prev_int = (bp_scr_dir_item_str === 'l' || bp_scr_dir_item_str === 'r') ? scroll_pos_left_prev_int : scroll_pos_top_prev_int;

                //define classes and attributes
                if(bp_scroll_classes_arr)
                {
                    //conventional classes are defined
                    bp_item_class_str = bp_scroll_classes_arr[i];
                }
                else
                {
                    //conventional classes are not defined
                    //auto-generate
                    bp_item_class_str = 'w_scroll_bp_'+bp_scr_dst_item_str;
                    bp_item_class_str += (bp_scr_dir_item_str !== 'd') ? "_"+bp_scr_dir_item_str : '_d';
                    bp_item_class_str = bp_item_class_str.replace(",", "");
                    bp_item_class_str = bp_item_class_str.replace(/[\s\-]+/ig, "_");
                    bp_item_class_str = bp_item_class_str.replace(/#+/i, "id_");
                    bp_item_attr_str = bp_scr_dst_item_str;
                }

                //define DOM storage variable name
                bp_item_dom_store_var_str = bp_item_class_str+'_ds_enabled';
                bp_item_dom_store_var_isset_str = bp_item_class_str+'_ds_isset';

                var scroll_dir_none_bool = (scroll_dir_v_str === 'n' && scroll_dir_h_str === 'n'),
                    scroll_dir_v_match_bool,
                    scroll_dir_h_match_bool
                    ;

                //set tracker
                if(!wizmo.domStore(bp_item_dom_store_var_isset_str))
                {
                    wizmo.domStore(bp_item_dom_store_var_str, false);
                    wizmo.domStore(bp_item_dom_store_var_isset_str, true);
                }

                if(bp_scr_dst_item_select_int >= bp_scr_dst_item_temp_int)
                {
                    //scroll position [left or top] is greater or equal to scroll breakpoint
                    scroll_dir_v_match_bool = (bp_scr_dir_item_str === 'd');
                    scroll_dir_h_match_bool = (bp_scr_dir_item_str === 'r');

                    if(scroll_dir_v_str === 'd' || scroll_dir_h_str === 'r')
                    {
                        //scrolling down or right

                        //breakpoint match
                        if(scroll_dir_v_match_bool || scroll_dir_h_match_bool)
                        {
                            //add class
                            if(!ctx.hasClass(bp_item_class_str))
                            {
                                ctx.addClass(bp_item_class_str);
                                _callbackTrigger(options, ['addclass', bp_item_class_str]);
                            }
                        }
                        else
                        {
                            //remove class
                            if(ctx.hasClass(bp_item_class_str))
                            {
                                ctx.removeClass(bp_item_class_str);
                                _callbackTrigger(options, ['removeclass', bp_item_class_str]);
                            }
                        }
                    }
                    else if(scroll_dir_none_bool)
                    {
                        //no movement

                        if(scroll_dir_v_match_bool || scroll_dir_h_match_bool)
                        {
                            //add class
                            if(!ctx.hasClass(bp_item_class_str))
                            {
                                ctx.addClass(bp_item_class_str);
                                _callbackTrigger(options, ['addclass', bp_item_class_str]);
                            }
                        }
                    }
                }
                else if (bp_scr_dst_item_select_int <= bp_scr_dst_item_temp_int)
                {
                    //scroll position [left or top] is less than or equal to scroll breakpoint

                    //mark tracker
                    if((bp_scr_dst_item_select_prev_int >= bp_scr_dst_item_temp_int) && (!wizmo.domStore(bp_item_dom_store_var_str)))
                    {
                        wizmo.domStore(bp_item_dom_store_var_str, true);
                    }

                    scroll_dir_v_match_bool = (bp_scr_dir_item_str === 'u' && wizmo.domStore(bp_item_dom_store_var_str));
                    scroll_dir_h_match_bool = (bp_scr_dir_item_str === 'l' && wizmo.domStore(bp_item_dom_store_var_str));

                    if(scroll_dir_v_str === 'u' || scroll_dir_h_str === 'l')
                    {
                        //scrolling up or left

                        //breakpoint match
                        if(scroll_dir_v_match_bool || scroll_dir_h_match_bool)
                        {
                            //add class
                            if(!ctx.hasClass(bp_item_class_str))
                            {
                                ctx.addClass(bp_item_class_str);
                                _callbackTrigger(options, ['addclass', bp_item_class_str]);
                            }
                        }
                        else
                        {
                            //reset dom store var
                            wizmo.domStore(bp_item_dom_store_var_str, false);

                            //remove class
                            if(ctx.hasClass(bp_item_class_str))
                            {
                                ctx.removeClass(bp_item_class_str);
                                _callbackTrigger(options, ['removeclass', bp_item_class_str]);
                            }
                        }
                    }
                    else if(scroll_dir_none_bool)
                    {
                        //no movement

                        if(bp_scr_dir_item_str === 'u' || bp_scr_dir_item_str === 'l')
                        {
                            //add class
                            if(!ctx.hasClass(bp_item_class_str))
                            {
                                ctx.addClass(bp_item_class_str);
                                _callbackTrigger(options, ['addclass', bp_item_class_str]);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Determines if there is a breakpoint match and then sets the corresponding classes and/or attributes
         * @param ctx {Object} the context
         * @param bp_arr {Array} the breakpoints
         * @param options {Object}
         * @private
         */
        function _setBreakpoints(ctx, bp_arr, options){
            var myArgs = Array.prototype.slice.call(arguments);
            var settings_obj = myArgs[3],
                event_status_str = myArgs[4],
                is_ort_change_bool,
                is_resize_container_bool,
                resp_basis_str = settings_obj.responsive_basis,
                is_resp_basis_container_bool = ((resp_basis_str === 'c')),
                set_data_obj = {}
                ;

            //Note orientation change
            is_ort_change_bool = !!((event_status_str === 'co'));

            //Note container resize
            is_resize_container_bool = !!((event_status_str === 'rc'));

            //Extract Data to Array
            /*jshint -W069 */
            var bp_width_arr = _w.arrayToInteger(_w.explode("|", bp_arr["bp_w"])),
                bp_height_arr = _w.arrayToInteger(_w.explode("|", bp_arr["bp_h"])),
                bp_ort_arr = _w.explode("|", bp_arr["bp_o"]),
                bp_type_arr = _w.explode("|", bp_arr["bp_t"]),
                bp_class_arr = (bp_arr["bp_c"]) ? _w.explode("|", bp_arr["bp_c"]) : null,
                bp_attrib_arr = (bp_arr["bp_a"]) ? _w.explode("|", bp_arr["bp_a"]) : null,
                bp_width_arr_count_int = _w.count(bp_width_arr),
                viewport_w_int = wizmo.viewportW(),
                viewport_w_active_int = viewport_w_int
                ;

            //Get Device and Orientation Options and Information
            var device_platform_str = wizmo.getPlatform(),
                device_formfactor_str = wizmo.getFormFactor(),
                options_platform_str = (options.platform) ? options.platform : 'all',
                options_formfactor_str = (options.formfactor) ? options.formfactor : 'all',
                options_force_dip_bool = (_w.isBool(options.force_dip)) ? options.force_dip: true,
                options_dim_format_str = (_w.isString(options.dim_format)) ? options.dim_format: 'x',
                is_portrait_bool = wizmo.isPortrait(),
                is_landscape_bool = (is_portrait_bool !== true);

            /*jshint +W069 */

            //Define trackers
            var is_breakpoint_match_bool = false,
                is_breakpoint_match_hit_bool = false,
                is_breakpoint_match_os_bool = true,
                is_breakpoint_match_ff_bool = true,
                is_curr_bp_in_ort_range_bool = true,
                is_prev_bp_in_ort_range_bool = true,
                is_ort_marker_set_init_bool = false,        //this indicates whether orientation markers have been used at least once
                bp_width_arr_has_dupl_bool,
                bp_width_dupl_tracker_tok_str = '',              //used for tracking breakpoints that have duplicate values
                bp_width_no_dupl_tracker_tok_str = '',              //used for tracking breakpoints that do not have duplicate values
                bp_width_min_tracker_tok_str = '',        //used for tracking the starting widths of all breakpoints values
                bp_width_max_tracker_tok_str = '',        //used for tracking the ending widths of all breakpoints values
                bp_width_hasheight_tracker_tok_str = '',        //used for tracking the widths of breakpoints that have both width and height values
                bp_width_hasnoheight_tracker_tok_str = '',      //used for tracking the widths of breakpoints that have only width values
                bp_width_match_tracker_tok_str = '',
                bp_height_match_tracker_tok_str = '',
                bp_break_on_match_bool,
                span_range_bool,
                span_range_int_str,
                pitch_range_bool,
                pitch_range_int_str,
                dim_range_bool,
                ort_range_bool,
                bp_width_x_height_str,
                bp_width_x_height_prev_str,
                bp_width_int,
                bp_width_min_int,
                bp_width_max_int,
                bp_width_start_int,
                bp_width_start_temp_int,
                bp_width_prev_int,
                bp_width_prev_ort_marker_int,
                bp_height_int,
                bp_height_prev_int,
                bp_height_min_int,
                bp_height_max_int,
                bp_width_diff_r_int,                        //the difference between current viewport width and bp_width_max_int
                bp_width_diff_r_abs_int,                    //the absolute difference between current viewport width and bp_width_max_int
                bp_width_diff_l_int,                        //the difference between current viewport width and bp_width_min_int
                bp_width_diff_r_comp_int,
                bp_type_str,
                bp_ort_str,
                bp_class_str,
                bp_class_last_sel_str,
                bp_attrib_str,
                bp_attrib_last_sel_str,
                i_prev
                ;

            //check if there are duplicate width values
            bp_width_arr_has_dupl_bool = _w.arrayHasDuplicates(bp_width_arr);
            bp_break_on_match_bool = (!bp_width_arr_has_dupl_bool);


            /**
             * Iterate over individual breakpoints
             */
            for(var i = 0; i < bp_width_arr_count_int; i++)
            {
                i_prev = i - 1;

                /**
                 * Filter for
                 * 1: Platform
                 * 2: Form Factor
                 * Breakout of for loop if no match
                 */

                //1:
                if((options_platform_str !== 'all') && (options.platform !== device_platform_str))
                {
                    is_breakpoint_match_os_bool = false;
                }

                //2:
                if((options_formfactor_str !== 'all') && (options.formfactor !== device_formfactor_str))
                {
                    is_breakpoint_match_ff_bool = false;
                }

                //break out of for loop if match is not found
                /*jshint -W116 */
                if(!is_breakpoint_match_os_bool || !is_breakpoint_match_ff_bool) break;
                /*jshint +W116 */


                //Get width, height, type, and orientation values
                bp_width_int = bp_width_arr[i];
                bp_height_int = bp_height_arr[i];
                bp_type_str = bp_type_arr[i];
                bp_ort_str = bp_ort_arr[i];

                //track previous breakpoint width
                if(i > 0)
                {
                    bp_width_prev_int = bp_width_arr[i_prev];
                }
                else{
                    bp_width_prev_int = 0;
                    bp_width_prev_ort_marker_int = 0;
                }

                //track previous breakpoint height
                if(i > 0)
                {
                    bp_height_prev_int = bp_height_arr[i_prev];
                }
                else{
                    bp_height_prev_int = 0;
                }

                //Get the full breakpoint in string representation
                bp_width_x_height_str = bp_width_int+'x'+bp_height_int;
                bp_width_x_height_prev_str = bp_width_prev_int+'x'+bp_height_prev_int;

                //Consider orientation markers
                is_prev_bp_in_ort_range_bool = is_curr_bp_in_ort_range_bool;
                if (bp_ort_str === "p" || bp_ort_str === "l")
                {
                    is_ort_marker_set_init_bool = true;

                    ort_range_bool = (bp_ort_str === "p") ? ((is_portrait_bool)) : ((is_landscape_bool));
                    is_curr_bp_in_ort_range_bool = ort_range_bool;
                    bp_width_no_dupl_tracker_tok_str = (!is_prev_bp_in_ort_range_bool) ? bp_width_prev_ort_marker_int: bp_width_no_dupl_tracker_tok_str;
                }
                else
                {
                    /**
                     * If is_prev_bp_in_ort_range_bool is false,
                     * it means that the previous breakpoint had an
                     * orientation marker ('-p' or '-l') that did not match the current
                     * orientation of the viewport.
                     * And if is_ort_marker_set_init_bool is true, then there has been
                     * a transition from a breakpoint with
                     * an orientation marker to one without one.
                     */
                    bp_width_no_dupl_tracker_tok_str = ((is_ort_marker_set_init_bool) && (!is_prev_bp_in_ort_range_bool)) ? bp_width_prev_ort_marker_int: bp_width_no_dupl_tracker_tok_str;

                    bp_width_prev_ort_marker_int = (i > 0) ? bp_width_int: 0;
                    ort_range_bool = true;
                    is_curr_bp_in_ort_range_bool = ort_range_bool;
                }

                //Manage combination of breakpoints with and without vertical settings
                /**
                 * Manage start and end widths i.e. the effective breakpoint ranges
                 * 1: Take duplicate values into consideration
                 * 2: Take breakpoint settings that have height values into consideration
                 */
                if(i >= 1)
                {
                    //1:
                    if(bp_width_int === bp_width_prev_int)
                    {
                        //duplicates found

                        bp_width_dupl_tracker_tok_str = (bp_width_dupl_tracker_tok_str === '') ? bp_width_int : bp_width_int+'-!'+bp_width_dupl_tracker_tok_str;
                        bp_width_start_temp_int = parseInt(getValueAfterExplode(bp_width_min_tracker_tok_str, '-!', 0));

                        //track breakpoint widths (both those that have height or don't have heights)
                        if (bp_height_int > 0)
                        {
                            bp_width_hasheight_tracker_tok_str = (bp_width_hasheight_tracker_tok_str === '') ? bp_width_int : bp_width_int+'-!'+bp_width_hasheight_tracker_tok_str;
                        }
                        else
                        {
                            bp_width_hasnoheight_tracker_tok_str = (bp_width_hasnoheight_tracker_tok_str === '') ? bp_width_int :
                                bp_width_int+'-!'+bp_width_hasnoheight_tracker_tok_str;
                        }
                    }
                    else
                    {
                        //no duplicates

                        bp_width_no_dupl_tracker_tok_str = bp_width_int+'-!'+bp_width_no_dupl_tracker_tok_str;
                        //bp_width_start_temp_int = parseInt(getValueAfterExplode(bp_width_no_dupl_tracker_tok_str, '-!', 1));

                        //2:
                        if(bp_height_int > 0)
                        {
                            //breakpoint has height values

                            bp_width_hasheight_tracker_tok_str = (bp_width_hasheight_tracker_tok_str === '') ? bp_width_int : bp_width_int+'-!'+bp_width_hasheight_tracker_tok_str;

                            //Get the width value of last breakpoint without a height value
                            bp_width_start_temp_int = parseInt(getValueAfterExplode(bp_width_hasnoheight_tracker_tok_str, '-!', 0));
                        }
                        else
                        {
                            //breakpoint has no height values

                            bp_width_hasnoheight_tracker_tok_str = (bp_width_hasnoheight_tracker_tok_str === '') ? bp_width_int :
                                bp_width_int+'-!'+bp_width_hasnoheight_tracker_tok_str;

                            //Get the width value of last breakpoint
                            bp_width_start_temp_int = parseInt(getValueAfterExplode(bp_width_max_tracker_tok_str, '-!', 0));
                        }
                    }

                    //define start width
                    bp_width_start_int = bp_width_start_temp_int;

                    //track start and end widths
                    bp_width_min_tracker_tok_str = bp_width_start_int+'-!'+bp_width_min_tracker_tok_str;
                    bp_width_max_tracker_tok_str = bp_width_int+'-!'+bp_width_max_tracker_tok_str;
                }
                else
                {
                    bp_width_hasheight_tracker_tok_str = (bp_height_int > 0) ? bp_width_int : '';
                    bp_width_hasnoheight_tracker_tok_str = (bp_height_int <= 0) ? bp_width_int : '';
                    //define start width
                    bp_width_start_int = 0;

                    //track start and end widths
                    bp_width_min_tracker_tok_str = ''+bp_width_start_int+'';
                    bp_width_max_tracker_tok_str = ''+bp_width_int+'';

                    //track duplicate and non-duplicate values
                    bp_width_no_dupl_tracker_tok_str = bp_width_int;
                    bp_width_dupl_tracker_tok_str = '';
                }

                //Define classes and attributes
                bp_class_str = (bp_class_arr) ? bp_class_arr[i] : '';
                bp_attrib_str = (bp_attrib_arr) ? bp_attrib_arr[i] : '';

                //set the breakpoint range widths
                if(i === 0)
                {
                    bp_width_min_int = bp_width_start_int;
                    bp_width_max_int = bp_width_int;
                }
                else {
                    bp_width_min_int = (bp_width_start_int === 0) ? bp_width_start_int : bp_width_start_int + 1;
                    bp_width_max_int = bp_width_int;
                }

                /**
                 * Check for Matching Breakpoints
                 * 1. Do for Container Basis
                 * 2. Do for Viewport Basis. Make sure to consider force_dip option
                 * 2.1 Vertical Breakpoints and Horizontal Breakpoints
                 * 2.2 Vertical Breakpoints only
                 * 2.3 Track matches
                 */
                if(is_resp_basis_container_bool)
                {
                    //1
                    span_range_bool = wizmo.eSpan(bp_width_min_int, bp_width_max_int, ctx, options_dim_format_str, options_force_dip_bool);

                    dim_range_bool = ((span_range_bool));
                }
                else
                {
                    //2
                    if(bp_height_int > 0)
                    {
                        //2.1
                        //set breakpoint range heights
                        bp_height_min_int = 0;
                        bp_height_max_int = bp_height_int;

                        span_range_bool = (options_force_dip_bool) ? wizmo.vSpan(bp_width_min_int, bp_width_max_int) : wizmo.cSpan(bp_width_min_int, bp_width_max_int);

                        pitch_range_bool = (options_force_dip_bool) ? (wizmo.vPitch(bp_height_min_int, bp_height_max_int)) : (wizmo.cPitch(bp_height_min_int, bp_height_max_int));

                        dim_range_bool = ((span_range_bool && pitch_range_bool));
                    }
                    else
                    {
                        //2.2
                        span_range_bool = (options_force_dip_bool) ? wizmo.vSpan(bp_width_min_int, bp_width_max_int) : wizmo.cSpan(bp_width_min_int, bp_width_max_int);

                        pitch_range_bool = false;

                        dim_range_bool = ((span_range_bool));
                    }

                    //2.3
                    span_range_int_str = (span_range_bool) ? '1': '0';
                    pitch_range_int_str = (pitch_range_bool) ? '1': '0';

                    //make -1 if no match and breakpoint has height value
                    pitch_range_int_str = (bp_height_int > 0 && pitch_range_int_str === '0') ? '-1': pitch_range_int_str;

                    bp_width_match_tracker_tok_str = (bp_width_match_tracker_tok_str === '') ? span_range_int_str : span_range_int_str+'-!'+bp_width_match_tracker_tok_str;

                    bp_height_match_tracker_tok_str = (bp_height_match_tracker_tok_str === '') ? pitch_range_int_str : pitch_range_int_str+'-!'+bp_height_match_tracker_tok_str;

                }

                /**
                 * Set Breakpoints
                 * A. For Container Basis
                 *
                 * B. For Viewport Basis
                 * Status codes as follows:
                 * 1: Viewport matched breakpoint with clean hit on initialization i.e. viewport is virtually identical to breakpoint
                 * 2: Viewport matched breakpoint with clean hit after orientation change
                 * 3: Viewport matched breakpoint but not with a clean hit i.e. margin between viewport width and upper limit of matched breakpoint range is significant
                 * 4: Viewport matched breakpoint after orientation change but not with a clean hit i.e. margin between viewport width and upper limit of matched breakpoint range is significant
                 */
                if(dim_range_bool && ort_range_bool)
                {
                    if(is_resp_basis_container_bool)
                    {
                        //A:
                        is_breakpoint_match_bool = true;
                    }
                    else
                    {
                        //B:
                        bp_width_diff_r_int = bp_width_max_int - viewport_w_active_int;
                        bp_width_diff_r_abs_int = Math.abs(bp_width_diff_r_int);
                        bp_width_diff_l_int = viewport_w_active_int - bp_width_min_int;

                        bp_width_diff_r_comp_int = bp_width_max_int*0.1;
                        bp_width_diff_r_comp_int = Math.round(bp_width_diff_r_comp_int);

                        is_breakpoint_match_bool = true;

                        //Capture class and attribute values of last hit
                        if(is_breakpoint_match_bool)
                        {
                            //set class and attribute
                            is_breakpoint_match_hit_bool = true;
                            bp_class_last_sel_str = bp_class_str;
                            bp_attrib_last_sel_str = bp_attrib_str;

                            if(bp_ort_str !== "x"){
                                bp_break_on_match_bool = true;
                            }
                        }
                    }
                }
                else
                {
                    is_breakpoint_match_bool = false;
                }

                //break out of for loop if match is found
                /*jshint -W116 */
                if(is_breakpoint_match_bool && bp_break_on_match_bool) break;
                /*jshint +W116 */
            }

            //Perform adjustment of breakpoint match value to compensate for if bp_break_on_match_bool is false
            if(is_breakpoint_match_hit_bool && !bp_break_on_match_bool)
            {
                is_breakpoint_match_bool = true;

                var counter_alpha_arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax'
                    ],
                    counter_alpha_pre_arr = [],
                    bp_width_match_tracker_arr = _w.explode("-!", bp_width_match_tracker_tok_str),
                    bp_height_match_tracker_arr = _w.explode("-!", bp_height_match_tracker_tok_str),
                    bp_match_score_arr = [],
                    bp_match_score_sort_arr,
                    bp_match_score_sort_keys_arr,
                    bp_match_score_item_int,
                    bp_match_score_width_item_int,
                    bp_match_score_height_item_int,
                    bp_match_sel_key_idx_str,
                    bp_match_sel_idx_str,
                    bp_match_sel_idx_int
                    ;

                //reverse
                bp_width_match_tracker_arr.reverse();
                bp_height_match_tracker_arr.reverse();

                //find the best match
                /**
                 * Find the best match
                 * 1. Matching width and height = 100 points
                 * 2. Matching width = 50 points
                 */
                var counter_alpha_item_str,
                    bp_match_width_idx_str,
                    bp_match_height_idx_str;

                for(var j = 0; j < _w.count(bp_width_match_tracker_arr); j++)
                {
                    bp_match_width_idx_str = bp_width_match_tracker_arr[j];
                    bp_match_height_idx_str = bp_height_match_tracker_arr[j];

                    bp_match_score_width_item_int = (bp_match_width_idx_str === '1') ? 100 : 0;
                    if(bp_match_height_idx_str === '1')
                    {
                        bp_match_score_height_item_int = 50;
                    }
                    else if (bp_match_height_idx_str === '-1')
                    {
                        bp_match_score_height_item_int = -50;
                    }
                    else
                    {
                        bp_match_score_height_item_int = 0;
                    }


                    bp_match_score_item_int = bp_match_score_width_item_int + bp_match_score_height_item_int;

                    //bp_match_score_arr.push(bp_match_score_item_int);
                    counter_alpha_item_str = counter_alpha_arr[j];
                    bp_match_score_arr[counter_alpha_item_str] = bp_match_score_item_int;

                    counter_alpha_pre_arr.push(counter_alpha_item_str);
                }

                var cmp = function ($a, $b) {
                    if ($a === $b) {
                        return 0;
                    }
                    return ($a < $b) ? 1 : -1;
                };

                //sort viewport width breakpoints
                bp_match_score_sort_arr = _w.uasort(bp_match_score_arr, cmp);

                //sort other arrays in an identical fashion to viewport width breakpoints

                bp_match_score_sort_keys_arr = _w.array_keys(bp_match_score_sort_arr);

                bp_match_sel_key_idx_str = bp_match_score_sort_keys_arr[0];
                bp_match_sel_idx_str = _w.array_search(bp_match_sel_key_idx_str, counter_alpha_pre_arr);
                bp_match_sel_idx_int = parseInt(bp_match_sel_idx_str);

                bp_class_str = bp_class_arr[bp_match_sel_idx_int];
                bp_attrib_str = bp_attrib_arr[bp_match_sel_idx_int];
            }

            //Set Class and/or Attribute
            set_data_obj.classes = '';
            if(_w.isString(bp_class_str) && bp_class_str.length > 0)
            {
                set_data_obj.classes = bp_class_str;
            }

            set_data_obj.attributes = '';
            if(_w.isString(bp_attrib_str) && bp_attrib_str.length > 0)
            {
                set_data_obj.attributes = bp_attrib_str;
            }

            //Add Class and/or Attributes
            if(!is_breakpoint_match_bool)
            {
                //no breakpoint match

                //remove/reset any classes and attributes
                _unsetElement(ctx, options);

                //adjust for orientation change
                if (is_ort_change_bool)
                {
                    _setElement(ctx, set_data_obj, options);
                }

                //persist
                wizmo.store("var_breakpoint_match_curr", false);
            }
            else
            {
                //breakpoint match
                _setElement(ctx, set_data_obj, options);

                //persist
                wizmo.store("var_breakpoint_match_curr", true);
            }

            //Exit true for Matched Breakpoint
            return !!((is_breakpoint_match_bool));
        }

        /**
         * Gets the text value of the selector used to get the object
         * @param el {Object}
         * @private
         */
        function _getSelector(el)
        {
            if (wQuery.isWQueryObject(el))
            {
                return el.selector;
            }
        }

        /**
         * Adds relevant classes and/or attributes on an element
         * @param ctx {*} the context
         * @param set_obj {Object} the main settings object
         * @param options {Object} the options as set in the wizmo constructor
         * @private
         */
        function _setElement(ctx, set_obj, options)
        {
            var options_breakpoints_res = (options.breakpoints) ? options.breakpoints : [],
                options_breakpoints_scroll_res = (options.breakpointsScroll) ? options.breakpointsScroll : [],
                data_key_seed_str = _getSelector(ctx)+'|'+options_breakpoints_res.toString()+'|'+options_breakpoints_scroll_res.toString(),
                data_key_str = ''+Math.abs(_w.hashCode(data_key_seed_str)),
                set_class_store_id_str = "var_breakpoint_class_"+data_key_str,
                set_attr_store_id_str = "var_breakpoint_attr_"+data_key_str,
                set_class_str = set_obj.classes,
                class_isset_bool = (_w.isString(set_class_str) && set_class_str.length > 0),
                set_class_cache_str = wizmo.store(set_class_store_id_str),
                set_attr_str = set_obj.attributes,
                attr_isset_bool = ((_w.isString(set_attr_str) && set_attr_str.length > 0)),
                set_attr_cache_str = wizmo.store(set_attr_store_id_str),
                op_addclass_bool = false,
                op_addandremoveclass_bool = false
                ;

            var set_class_cache_bool = ((_w.isString(set_class_cache_str) && set_class_cache_str.length > 0));

            if(class_isset_bool)
            {
                if(set_class_cache_bool)
                {
                    if(set_class_cache_str !== set_class_str)
                    {
                        //add class [on change], but remove old one first
                        ctx.removeClass(set_class_cache_str).addClass(set_class_str);
                        op_addandremoveclass_bool = true;
                    }
                    else if (options.init)
                    {
                        //add class on initialization
                        ctx.addClass(set_class_str);
                        op_addclass_bool = true;
                    }
                }
                else
                {
                    //add class
                    ctx.addClass(set_class_str);
                    op_addclass_bool = true;
                }

                //callback trigger + manage store
                if(op_addclass_bool || op_addandremoveclass_bool)
                {
                    wizmo.store(set_class_store_id_str, set_class_str);

                    if(op_addandremoveclass_bool)
                    {
                        _callbackTrigger(options, ['removeclass', set_class_cache_str]);
                    }
                    _callbackTrigger(options, ['addclass', set_class_str]);
                }
            }

            if(attr_isset_bool)
            {
                if(set_attr_cache_str !== set_attr_str)
                {
                    //modify breakpoint attribute on change
                    ctx.attr('data-w-breakpoint', set_attr_str);

                    //fire callback if old and new class differ
                    _callbackTrigger(options, ['removeattr', set_attr_cache_str]);
                }
                else if (options.init)
                {
                    //add breakpoint attribute on initialization
                    ctx.attr('data-w-breakpoint', set_attr_str);
                }

                wizmo.store(set_attr_store_id_str, set_attr_str);
                _callbackTrigger(options, ['addattr', set_attr_str]);
            }
        }

        /**
         * Removes relevant classes and/or attributes from an element
         * @param ctx {*} the context
         * @param options {Object} the options as set in the $.wizmo constructor
         * @private
         */
        function _unsetElement(ctx, options)
        {
            var options_breakpoints_res = (options.breakpoints) ? options.breakpoints : [],
                options_breakpoints_scroll_res = (options.breakpointsScroll) ? options.breakpointsScroll : [],
                data_key_seed_str = _getSelector(ctx)+'|'+options_breakpoints_res.toString()+'|'+options_breakpoints_scroll_res.toString(),
                data_key_str = ''+Math.abs(_w.hashCode(data_key_seed_str)),
                set_class_store_id_str = "var_breakpoint_class_"+data_key_str,
                set_attr_store_id_str = "var_breakpoint_attr_"+data_key_str,
                set_class_cache_str = wizmo.store(set_class_store_id_str),
                set_attr_cache_str = wizmo.store(set_attr_store_id_str),
                set_class_cache_bool = ((_w.isString(set_class_cache_str) && set_class_cache_str.length > 0)),
                set_attr_cache_bool = ((_w.isString(set_attr_cache_str) && set_attr_cache_str.length > 0))
                ;

            if(set_class_cache_bool)
            {
                ctx.removeClass(set_class_cache_str);
                _callbackTrigger(options, ['removeclass', set_class_cache_str]);

                //reset class cache
                wizmo.store(set_class_store_id_str, null);
            }

            if(set_attr_cache_bool)
            {
                ctx.attr('data-w-breakpoints', 'off');
                _callbackTrigger(options, ['removeattr', set_attr_cache_str]);

                //reset attr cache
                wizmo.store(set_attr_store_id_str, null);
            }
        }

        /**
         * Manages callbacks
         * @param options {Object} the wizmo options
         * @param callback_settings {Array} Callback settings
         * @private
         */
        function _callbackTrigger()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options = myArgs[0],
                callback_settings = myArgs[1],
                $on_func,
                $on_func_body_count
                ;

            //Execute onReady
            if(_w.in_array('ready', callback_settings))
            {
                var $on_ready = options.onReady,
                    $on_ready_body_count = options.onReady.getFuncBody().length;
                if(_w.isFunction($on_ready) && ($on_ready_body_count > 0))
                {
                    //Execute Callback
                    $on_ready();
                }
            }

            //Scroll Callbacks
            if (_w.in_array('scroll', callback_settings))
            {
                var $on_scroll = options.onScroll,
                    $on_scroll_body_count = options.onScroll.getFuncBody().length,
                    $on_scroll_left = options.onScrollLeft,
                    $on_scroll_left_body_count = options.onScrollLeft.getFuncBody().length,
                    $on_scroll_right = options.onScrollRight,
                    $on_scroll_right_body_count = options.onScrollRight.getFuncBody().length,
                    $on_scroll_up = options.onScrollUp,
                    $on_scroll_up_body_count = options.onScrollUp.getFuncBody().length,
                    $on_scroll_down = options.onScrollDown,
                    $on_scroll_down_body_count = options.onScrollDown.getFuncBody().length
                    ;

                //get scroll direction over horizontal and vertical plane
                var $scroll_direction_h_str = _getScrollDirection('h'),
                    $scroll_direction_v_str = _getScrollDirection('v');

                //on scroll
                if(_w.isFunction($on_scroll) && ($on_scroll_body_count > 0))
                {
                    //Execute Callback
                    $on_scroll();
                }

                //on scroll left
                if(_w.isFunction($on_scroll_left) && ($on_scroll_left_body_count > 0) && $scroll_direction_h_str === 'left')
                {
                    $on_scroll_left();
                }

                //on scroll right
                if(_w.isFunction($on_scroll_right) && ($on_scroll_right_body_count > 0) && $scroll_direction_h_str === 'right')
                {
                    $on_scroll_right();
                }

                //on scroll up
                if(_w.isFunction($on_scroll_up) && ($on_scroll_up_body_count > 0) && $scroll_direction_v_str === 'up')
                {
                    $on_scroll_up();
                }

                //on scroll down
                if(_w.isFunction($on_scroll_down) && ($on_scroll_down_body_count > 0) && $scroll_direction_v_str === 'down')
                {
                    $on_scroll_down();
                }
            }

            //Resize Callbacks
            if (_w.in_array('resize', callback_settings))
            {
                var $on_resize = options.onResize,
                    $on_resize_body_count = options.onResize.getFuncBody().length,
                    $on_resize_in = options.onResizeIn,
                    $on_resize_in_body_count = options.onResizeIn.getFuncBody().length,
                    $on_resize_out = options.onResizeOut,
                    $on_resize_out_body_count = options.onResizeOut.getFuncBody().length,
                    $on_resize_up = options.onResizeUp,
                    $on_resize_up_body_count = options.onResizeUp.getFuncBody().length,
                    $on_resize_down = options.onResizeDown,
                    $on_resize_down_body_count = options.onResizeDown.getFuncBody().length
                    ;

                //get resize direction over horizontal and vertical plane
                var $resize_direction_h_str = _getResizeDirection('h'),
                    $resize_direction_v_str = _getResizeDirection('v');

                //on resize
                if(_w.isFunction($on_resize) && ($on_resize_body_count > 0))
                {
                    //Execute Callback
                    $on_resize();
                }

                //on resize in
                if(_w.isFunction($on_resize_in) && ($on_resize_in_body_count > 0) && $resize_direction_h_str === 'in')
                {
                    $on_resize_in();
                }

                //on resize out
                if(_w.isFunction($on_resize_out) && ($on_resize_out_body_count > 0) && $resize_direction_h_str === 'out')
                {
                    $on_resize_out();
                }

                //on resize up
                if(_w.isFunction($on_resize_up) && ($on_resize_up_body_count > 0) && $resize_direction_v_str === 'up')
                {
                    $on_resize_up();
                }

                //on resize down
                if(_w.isFunction($on_resize_down) && ($on_resize_down_body_count > 0) && $resize_direction_v_str === 'down')
                {
                    $on_resize_down();
                }
            }

            //Rotate/Orientation Callbacks
            if(_w.in_array('rotate', callback_settings))
            {
                var ort_curr_str = wizmo.getOrientation(),
                    $on_rotate = options.onRotate,
                    $on_rotate_body_count = options.onRotate.getFuncBody().length,
                    $on_rotate_to_p = options.onRotateToP,
                    $on_rotate_to_p_body_count = options.onRotateToP.getFuncBody().length,
                    $on_rotate_to_l = options.onRotateToL,
                    $on_rotate_to_l_body_count = options.onRotateToL.getFuncBody().length
                    ;

                if(_w.isFunction($on_rotate) && ($on_rotate_body_count > 0))
                {
                    //Execute Callback
                    $on_rotate();
                }

                if(_w.isFunction($on_rotate_to_p) && ($on_rotate_to_p_body_count > 0) && ort_curr_str === 'portrait')
                {
                    //Execute Callback
                    $on_rotate_to_p();
                }

                if(_w.isFunction($on_rotate_to_l) && ($on_rotate_to_l_body_count > 0) && ort_curr_str === 'landscape')
                {
                    //Execute Callback
                    $on_rotate_to_l();
                }
            }

            //Add/Remove Class and Attribute Callbacks
            if(_w.in_array('addclass', callback_settings) || _w.in_array('removeclass', callback_settings) || _w.in_array('addattr', callback_settings) || _w.in_array('removeattr', callback_settings))
            {
                var $callback_type_str = callback_settings[0],
                    $callback_type_args = callback_settings[1],
                    $callback_data_arr = {'addclass': 'onAddClass', 'removeclass': 'onRemoveClass', 'addattr': 'onAddAttr', 'removeattr': 'onRemoveAttr'}
                    ;
                $on_func = options[$callback_data_arr[''+$callback_type_str+'']];
                $on_func_body_count = $on_func.getFuncBody().length;

                if (_w.isFunction($on_func) && ($on_func_body_count > 0))
                {
                    //Execute Callback
                    $on_func($callback_type_args);
                }
            }

            //Initialization Callbacks
            if(_w.in_array('init', callback_settings))
            {
                var callback_name_arr = [
                        'onPortrait', 'onLandscape', 'onRetina', 'onPhone', 'onTablet', 'onDesktop', 'onTV', 'onIOS', 'onAndroid', 'onSymbian', 'onBlackberry', 'onWindows', 'onWindowsPhone', 'onMobile', 'onNonMobile'
                    ],
                    func_name_arr = [
                        'isPortrait', 'isLandscape', 'isRetina', 'isPhone', 'isTablet', 'isDesktop', 'isTV', 'isIOS', 'isAndroid', 'isSymbian', 'isBlackberry', 'isWindows', 'isWindowsPhone', 'isMobile', 'isNonMobile'
                    ];

                for(var i = 0; i < _w.count(func_name_arr); i++)
                {
                    $on_func = options[callback_name_arr[i]];
                    $on_func_body_count = $on_func.getFuncBody().length;

                    if(_w.isFunction($on_func) && ($on_func_body_count > 0))
                    {
                        var $on_func_res = wizmo[func_name_arr[i]],
                            $on_func_bool = $on_func_res();
                        if($on_func_bool)
                        {
                            $on_func();
                        }
                    }
                }
            }
        }

        /**
         * Special wizmo Callback for Resize Event
         * This will be staged for execution by _onResize when callback_fn argument is === 'prime'
         * @private
         */
        function _resizeFnPrime()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                elem_win_obj = $(window),
                trigger_suffix_str = myArgs[0]
                ;

            //get viewport info before they are reset in storage
            var viewport_w_prev_int = wizmo.store("var_viewport_w"),
                viewport_h_prev_int = wizmo.store("var_viewport_h");

            //set to storage
            wizmo.store("var_viewport_w_prev", viewport_w_prev_int);
            wizmo.store("var_viewport_h_prev", viewport_h_prev_int);

            //re-initialize dimension variables
            wizmo.initDimVars();

            //get current and active and define local variables
            var is_mobile_bool = wizmo.isMobile(),
                is_mobile_phone_bool = wizmo.isPhone(),
                is_mobile_tablet_bool = wizmo.isTablet(),
                ort_active_str = wizmo.getOrientation(true),
                ort_curr_str = wizmo.store("var_screen_ort_curr"),
                viewport_w_curr_int,
                viewport_h_curr_int,
                viewport_w_diff_int,
                viewport_w_diff_abs_int,
                viewport_w_diff_pc_int,
                viewport_h_diff_int,
                viewport_h_diff_abs_int,
                viewport_h_diff_pc_int,
                is_softkey_bool = false;

            //Update stored values for dimensions
            wizmo.updateDimStore();

            /**
             * Perform soft keyboard check
             * This manages for mobile devices that resize the viewport when the soft keyboard is initialized
             * This scenario will sometimes result in a pseudo-orientation change which is unwanted
             */
            if(is_mobile_bool)
            {
                viewport_w_curr_int = wizmo.store("var_viewport_w");
                viewport_h_curr_int = wizmo.store("var_viewport_h");
                viewport_w_diff_int = viewport_w_curr_int-viewport_w_prev_int;
                viewport_h_diff_int = viewport_h_curr_int-viewport_h_prev_int;
                viewport_w_diff_abs_int = Math.abs(viewport_w_diff_int);
                viewport_h_diff_abs_int = Math.abs(viewport_h_diff_int);

                //get the percentage changes in viewport width and height
                viewport_w_diff_pc_int = (viewport_w_diff_abs_int/viewport_w_prev_int)*100;
                viewport_h_diff_pc_int = (viewport_h_diff_abs_int/viewport_h_prev_int)*100;

                if (viewport_w_diff_pc_int < 1)
                {
                    /**
                     * Set soft keyboard flag to true on the following conditions
                     * 1: soft keyboard is opening
                     * 2: soft keyboard is closing - start
                     * 3: soft keyboard is closing - end
                     */
                    is_softkey_bool = !!(((viewport_h_diff_pc_int > 35 && viewport_h_diff_int < 0) || (viewport_h_diff_pc_int > 35 && viewport_h_diff_int > 0) || (viewport_h_diff_pc_int > 12 && viewport_h_diff_pc_int <= 35 && viewport_h_diff_int > 0)));
                }
            }

            /**
             * Trigger events only if soft keyboard action is not detected
             */
            if(!is_softkey_bool)
            {
                if (ort_curr_str !== ort_active_str)
                {
                    //orientation has changed. Update stored values for dimensions and orientation
                    wizmo.updateOrtStore();

                    elem_win_obj.trigger("change_orientation" + trigger_suffix_str);
                }
                else
                {
                    /**
                     * Trigger resize viewport event
                     * Note: By default, this event is not triggered on mobile devices
                     * However, it can be enabled via config setting
                     */
                    if(_w.config.enableResizeOnMobile)
                    {
                        elem_win_obj.trigger("resize_viewport" + trigger_suffix_str);
                    }
                    else if (_w.config.enableResizeOnPhone)
                    {
                        //trigger for all except tablets
                        if (!is_mobile_tablet_bool) {
                            elem_win_obj.trigger("resize_viewport" + trigger_suffix_str);
                        }
                    }
                    else if (_w.config.enableResizeOnTablet)
                    {
                        //trigger for all except phones
                        if (!is_mobile_phone_bool) {
                            elem_win_obj.trigger("resize_viewport" + trigger_suffix_str);
                        }
                    }
                    else
                    {
                        //trigger for all except mobile devices
                        if (!is_mobile_bool) {
                            elem_win_obj.trigger("resize_viewport" + trigger_suffix_str);
                        }
                    }
                }
            }
        }

        /**
         * Sets up a resize event handler to run queued functions
         * Note: These are functions that have been previously queued using onResize method
         * @private
         */
        function __resize()
        {
            var resize_fn = function(){
                //run queued resize functions
                wizmo.runFunction('resize_fn', {queue: true, namespace: 'resize_fn'});
                //run queued resize_start and resize_end functions
                wizmo.runFunction('resize_fn_start', {queue: true, namespace: 'resize_fn_start'});
                wizmo.runFunction('resize_fn_end', {queue: true, namespace: 'resize_fn_end'});
            };
            _resize(resize_fn);
        }

        /**
         * Attach an event handler to the resize event
         * @param {Function} callback_fn the callback function to run
         * @param {String} event_handler_mode_str the event handler mode. Either 'debounce', 'throttle', or 'none'
         * @param {Number} event_handler_timer_int the timer to use for event handler mode
         * @param {String} trigger_suffix_str the suffix to differentiate the event trigger
         * @private
         */
        function _onResize(callback_fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                resize_handler_fn,
                is_prime_handler_bool = ((callback_fn === 'prime')),
                event_handler_fn = (is_prime_handler_bool) ? _resizeFnPrime : callback_fn,
                event_handler_type_str = (_w.isString(myArgs[1])) ? myArgs[1]: 'throttle',
                event_handler_timer_int = (_w.isNumber(myArgs[2])) ? myArgs[2]: 100,
                trigger_suffix_str = (_w.isString(myArgs[3]) && myArgs[3].length > 0) ? "_"+myArgs[3]: "",
                resize_monit_fn
                ;

            //stage event handler
            if(is_prime_handler_bool)
            {
                resize_monit_fn = function()
                {
                    //trigger viewport event handler
                    event_handler_fn(trigger_suffix_str);
                };

                //mark if prime
                wizmo.domStore('var_event_listener_prime_resize', true);
            }
            else
            {
                resize_monit_fn = function()
                {
                    //trigger viewport event handler
                    event_handler_fn();
                };
            }

            //create the event handler
            if(event_handler_type_str === "throttle")
            {
                resize_handler_fn = _w.throttle(resize_monit_fn, event_handler_timer_int);
            }
            else if (event_handler_type_str === "debounce")
            {
                resize_handler_fn = _w.debounce(resize_monit_fn, event_handler_timer_int);
            }
            else
            {
                resize_handler_fn = resize_monit_fn;
            }

            //add to resize function queue
            wizmo.addFunction('resize_fn', resize_handler_fn, {queue: true, namespace: 'resize_fn'});
        }

        /**
         * Adds a function to be called when the resize event is fired
         * Wrapper of _onResize
         */
        wizmo_obj.onResize = function(callback_fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onResize(callback_fn, myArgs[1], myArgs[2], myArgs[3]);
        };

        /**
         * Executes a function [once] when a resize event is started
         * @param fn {Function} the callback function
         * @param timer_int {Number} an optional wait timer for the event throttler. Default is 50ms
         */
        function _onResizeStart(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                timer_int = (_w.isNumber(myArgs[1])) ? myArgs[1]: 50,
                rand_str = generateRandomString('aAannanAnanAa'),
                handler_tag_str = 'var_event_resize_start_fn_tag_'+rand_str,
                handler_fn = _getEventStartHandler(fn, timer_int, handler_tag_str);

            //add start event handler tag to storage
            //it will be cleared later to enable proper operation of start event for resize
            if(!wizmo.domStore('var_event_resize_start_fn_tags'))
            {
                wizmo.domStore('var_event_resize_start_fn_tags', []);
            }
            wizmo.domStore('var_event_resize_start_fn_tags').push(handler_tag_str);

            //add to scroll_start function queue
            wizmo.addFunction('resize_fn_start', handler_fn, {queue: true, namespace: 'resize_fn_start'});
        }

        /**
         * Wrapper class for _onResizeStart
         */
        wizmo_obj.onResizeStart = function(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onResizeStart(fn, myArgs[1]);
            return this;
        };


        /**
         * Executes a function [once] when a resize event completes
         * @param fn {Function} the callback function
         * @param timer_int {Number} an optional wait timer for the event debouncer. Default is 500ms
         * @private
         */
        function _onResizeEnd(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                timer_int = (_w.isNumber(myArgs[1])) ? myArgs[1]: 500,
                handler_fn = _getEventEndHandler(fn, timer_int),
                handler_cleanup_temp_fn,
                handler_cleanup_fn;

            //add a cleanup function on first init
            //to make sure that onStartScroll tags are set to false
            //onStartScroll won't work properly without it
            if(!wizmo.domStore('var_event_resize_start_handler_fn_tags_flush'))
            {
                handler_cleanup_temp_fn = function(){
                    var event_start_tags_arr = wizmo.domStore('var_event_resize_start_fn_tags'),
                        i;
                    if(_w.count(event_start_tags_arr) > 0)
                    {
                        for(i = 0; i < event_start_tags_arr.length; i++)
                        {
                            wizmo.domStore(event_start_tags_arr[i], false);
                        }
                    }

                    wizmo.domStore('var_event_resize_start_handler_fn_tags_flush', true);
                };
                handler_cleanup_fn = _getEventEndHandler(handler_cleanup_temp_fn, timer_int);

                //add to scroll_end function queue
                wizmo.addFunction('resize_fn_end', handler_cleanup_fn, {queue: true, namespace: 'resize_fn_end'});
            }

            //add to scroll_end function queue
            wizmo.addFunction('resize_fn_end', handler_fn, {queue: true, namespace: 'resize_fn_end'});
        }

        /**
         * Wrapper class for _onResizeEnd
         */
        wizmo_obj.onResizeEnd = function(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onResizeEnd(fn, myArgs[1]);
            return this;
        };

        /**
         * Manages event handlers for resize
         * @param ctx {Object} the context
         * @param options {Object} the options from wizmo constructor
         * @param event_name {String} the event name
         * @param settings_obj {Object} special settings data
         * @private
         */
        function _resizeEventManager(ctx, options, event_name, settings_obj)
        {
            var win_obj = $(window),
                breakpoint_arr = settings_obj.breakpoints_array;

            //set event handler
            win_obj.on(event_name, function(){
                _resizeEventTrigger(ctx, breakpoint_arr, options, settings_obj);
            });
        }

        /**
         * Triggers an event handler [resize]
         * @param ctx {Object} the context
         * @returns {*}
         * @private
         */
        function _resizeEventTrigger(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                bp_arr = myArgs[1],
                options = myArgs[2],
                settings_obj = myArgs[3],
                callback_id_arr = settings_obj.callback_id_array,
                event_status_str = settings_obj.event_status,
                bp_settings_obj = {}
                ;

            bp_settings_obj.responsive_basis = settings_obj.responsive_basis;

            try{
                return ctx.each(function(ix, el)
                {
                    if(bp_arr)
                    {
                        //run only if breakpoints are provided

                        var _this = $(el);

                        //match breakpoints + set classes and attributes
                        _setBreakpoints(_this, bp_arr, options, bp_settings_obj, event_status_str);
                    }

                    //fire turbo methods if set
                    if (options.turbo_refresh)
                    {
                        _turboAttributes();
                        _turboClasses();
                    }

                    //fire relevant callbacks
                    _callbackTrigger(options, callback_id_arr);
                });
            }
            catch(e){
                var e_msg_str = _w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: '+e.message;
                _w.console.error(e_msg_str, true);
            }
        }

        /**
         * Attach an event handler for the resize event
         * @param {Function} fn The function to execute
         * @return object
         * @private
         */
        function _resize(fn)
        {
            $(window).on('resize', fn);
            return wizmo;
        }

        /**
         * Special wizmo Callback for ResizeContainer Event
         * This will be staged for execution by _onResizeContainer when callback_fn argument is === 'prime'
         * @private
         */
        function _resizeContainerFnPrime()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                elem_win_obj = $(window),
                trigger_suffix_str = myArgs[0];

            elem_win_obj.trigger("resize_container"+trigger_suffix_str);
        }

        /**
         * Attach an event handler to the resize container event
         * @param {Object} elem_obj the DOM object that will be tracked for resize
         * @param {Function} callback_fn the callback function to run
         * @param {String} event_handler_mode_str the event handler mode. Either 'debounce', 'throttle', or 'none'
         * @param {Number} event_handler_timer_int the timer to use for event handler mode
         * @param {String} trigger_suffix_str the suffix to differentiate the event trigger
         * @private
         */
        function _onResizeContainer(elem_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                resize_container_handler_fn,
                elem_core_obj = elem_obj[0],
                callback_fn = (myArgs[1]) ? myArgs[1]: function(){},
                is_prime_handler_bool = ((callback_fn === 'prime')),
                event_handler_fn = (is_prime_handler_bool) ? _resizeContainerFnPrime : callback_fn,
                event_handler_mode_str = (_w.isString(myArgs[2])) ? myArgs[2]: 'throttle',
                event_handler_timer_int = (_w.isNumber(myArgs[3])) ? myArgs[3]: 50,
                trigger_suffix_str = (_w.isString(myArgs[4]) && myArgs[4].length > 0) ? "_"+myArgs[4]: "",
                is_mobile_bool = wizmo.isMobile(),
                resize_container_monit_fn
                ;

            //stage event handler
            if(is_prime_handler_bool)
            {
                resize_container_monit_fn = function(){

                    //trigger event handler
                    event_handler_fn(trigger_suffix_str);
                };

                //mark if prime
                wizmo.domStore('var_event_listener_prime_resize_container', true);
            }
            else
            {
                resize_container_monit_fn = function(){

                    //trigger event handler
                    event_handler_fn();
                };
            }

            //Double wait time for mobile devices
            event_handler_timer_int = (is_mobile_bool) ? event_handler_timer_int * 2 : event_handler_timer_int;

            //execute
            if(event_handler_mode_str === "throttle")
            {
                resize_container_handler_fn = _w.throttle(resize_container_monit_fn, event_handler_timer_int);
                _resizeContainer(elem_core_obj, resize_container_handler_fn);
            }
            else if (event_handler_mode_str === "debounce")
            {
                resize_container_handler_fn = _w.debounce(resize_container_monit_fn, event_handler_timer_int);
                _resizeContainer(elem_core_obj, resize_container_handler_fn);
            }
            else
            {
                _resizeContainer(elem_core_obj, resize_container_monit_fn);
            }
        }

        /**
         * Attach an event handler for the resize container event
         * Wrapper of _onResizeContainer
         */
        wizmo_obj.onResizeContainer = function(el_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onResizeContainer(el_obj, myArgs[1], myArgs[2], myArgs[3], myArgs[4]);
        };

        /**
         * Manages event handlers for container events
         * @param ctx {Object} the context
         * @param options {Object} the options from wizmo constructor
         * @param event_name {String} the event name
         * @param settings_obj {Object} special settings data
         * @private
         */
        function _resizeContainerEventManager(ctx, options, event_name, settings_obj)
        {
            var win_obj = $(window),
                breakpoint_arr = settings_obj.breakpoints_array;

            //set event handler
            win_obj.on(event_name, function(){
                _resizeContainerEventTrigger(ctx, breakpoint_arr, options, settings_obj);
            });
        }

        /**
         * Triggers an event handler [container]
         * @param ctx {Object} the context
         * @returns {*}
         * @private
         */
        function _resizeContainerEventTrigger(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                bp_arr = myArgs[1],
                options = myArgs[2],
                settings_obj = myArgs[3],
                event_status_str = settings_obj.event_status
                ;

            try{
                return ctx.each(function(ix, el)
                {
                    var _this = $(el);

                    //match breakpoints + set classes and attributes
                    _setBreakpoints(_this, bp_arr, options, settings_obj, event_status_str);

                });
            }
            catch(e){
                var e_msg_str = _w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: '+e.message;
                _w.console.error(e_msg_str, true);
            }
        }

        /**
         * Attach an event handler for the resizecontainer event
         * @param {Object} el the object
         * @param {Function} fn The function to execute
         * @return object
         * @private
         */
        function _resizeContainer(el, fn)
        {
            return new ResizeSensor(el, fn);
        }

        /**
         * Gets the direction that a flexible browser window was resized
         * @param plane_str {string} the plane under consideration i.e. horizontal ('h') or vertical ('v')
         * @return {string|null}
         * @private
         */
        function _getResizeDirection(plane_str)
        {
            var resize_direction_str = 'none',
                viewport_w_int = parseInt(wizmo.store("var_viewport_w")),
                viewport_h_int = parseInt(wizmo.store("var_viewport_h")),
                viewport_w_prev_int = parseInt(wizmo.store("var_viewport_w_prev")),
                viewport_h_prev_int = parseInt(wizmo.store("var_viewport_h_prev"))
                ;

            if (plane_str === 'h')
            {
                //determine resize direction over horizontal plane
                if(viewport_w_int < viewport_w_prev_int)
                {
                    //resize in
                    resize_direction_str = 'in';
                }
                else if (viewport_w_int > viewport_w_prev_int)
                {
                    //resize out
                    resize_direction_str = 'out';
                }
            }
            else if (plane_str === 'v')
            {
                //determine resize direction over vertical plane
                if(viewport_h_int < viewport_h_prev_int)
                {
                    //resize in
                    resize_direction_str = 'up';
                }
                else if (viewport_h_int > viewport_h_prev_int)
                {
                    //resize out
                    resize_direction_str = 'down';
                }
            }

            return resize_direction_str;
        }

        /**
         * Activates scroll tracking
         * This will also set variables that allow measurement of scroll direction
         * @private
         */
        function _scrollDirectionTracking()
        {
            /**
             * Update scroll variables as they change
             * 1: Get previous values and save to storage
             * 2: Refresh original scroll variable values
             */

            //1:
            wizmo.store("var_viewport_scroll_t_prev", wizmo.store("var_viewport_scroll_t"));
            wizmo.store("var_viewport_scroll_l_prev", wizmo.store("var_viewport_scroll_l"));

            //2:
            _initScrollVars();
        }

        /**
         * Special wizmo Callback for Scroll Event
         * This will be staged for execution by _onScroll when callback_fn argument is === 'prime'
         * @private
         */
        function _scrollFnPrime()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                elem_win_obj = $(window),
                trigger_suffix_str = myArgs[0];

            elem_win_obj.trigger("scroll_viewport" + trigger_suffix_str);
        }

        /**
         * Sets up a scroll event handler to run queued functions
         * Note: These are functions that have been previously queued using _onScroll method
         * Note: contains double-underscore prefix
         * @private
         */
        function __scroll()
        {
            var scroll_fn = function(){
                //run queued scroll functions
                wizmo.runFunction('scroll_fn', {queue: true, namespace: 'scroll_fn'});
                //run queued scroll_start and scroll_end functions
                wizmo.runFunction('scroll_fn_start', {queue: true, namespace: 'scroll_fn_start'});
                wizmo.runFunction('scroll_fn_end', {queue: true, namespace: 'scroll_fn_end'});
            };
            _scroll(scroll_fn);
        }

        /**
         * Adds a function to be called when the scroll event is fired
         * @param {Function} callback_fn the callback function
         * @param {String} event_handler_mode_str the event handler mode. Either 'debounce', 'throttle', or 'none'
         * @param {Number} event_handler_timer_int the timer to use for event handler mode
         * @param {String} trigger_suffix_str the suffix to differentiate the event trigger
         * @private
         */
        function _onScroll(callback_fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                scroll_handler_fn,
                is_prime_handler_bool = ((callback_fn === 'prime')),
                event_handler_fn = (is_prime_handler_bool) ? _scrollFnPrime : callback_fn,
                event_handler_mode_str = (_w.isString(myArgs[1])) ? myArgs[1]: 'throttle',
                event_handler_timer_int = (_w.isNumber(myArgs[2])) ? myArgs[2]: 100,
                trigger_suffix_str = (_w.isString(myArgs[3]) && myArgs[3].length > 0) ? "_"+myArgs[3]: "",
                is_mobile_bool = wizmo.isMobile(),
                scroll_monit_fn
                ;

            if(is_prime_handler_bool)
            {
                //mark if prime
                wizmo.domStore('var_event_listener_prime_scroll', true);
            }

            //stage event handler
            if(!wizmo.domStore('var_run_scroll_event_init'))
            {
                scroll_monit_fn = function(){

                    //enable scroll direction tracking
                    _scrollDirectionTracking();

                    //trigger scroll event handler
                    event_handler_fn(trigger_suffix_str);
                };

                wizmo.domStore('var_run_scroll_event_init', true);
            }
            else
            {
                scroll_monit_fn = function(){

                    //trigger scroll event handler
                    event_handler_fn();
                };
            }

            //Double wait time for mobile devices
            event_handler_timer_int = (is_mobile_bool) ? event_handler_timer_int * 2 : event_handler_timer_int;

            //create the event handler
            if(event_handler_mode_str === "throttle")
            {
                scroll_handler_fn = _w.throttle(scroll_monit_fn, event_handler_timer_int);
            }
            else if (event_handler_mode_str === "debounce")
            {
                scroll_handler_fn = _w.debounce(scroll_monit_fn, event_handler_timer_int);
            }
            else
            {
                scroll_handler_fn = scroll_monit_fn;
            }

            //add to scroll function queue
            wizmo.addFunction('scroll_fn', scroll_handler_fn, {queue: true, namespace: 'scroll_fn'});
        }

        /**
         * Attach an event handler for the scroll event
         * It can be used multiple times to attach multiple handlers
         * Wrapper function of _onScroll
         * @param {Function} callback_fn
         */
        wizmo_obj.onScroll = function(callback_fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onScroll(callback_fn, myArgs[1], myArgs[2], myArgs[3]);
            return this;
        };

        /**
         * Executes a function [once] when a scroll event is started
         * @param fn {Function} the callback function
         * @param timer_int {Number} an optional wait timer for the event throttler. Default is 50ms
         * @private
         */
        function _onScrollStart(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                timer_int = (_w.isNumber(myArgs[1])) ? myArgs[1]: 50,
                rand_str = generateRandomString('aAannanAnanAa'),
                handler_tag_str = 'var_event_scroll_start_fn_tag_'+rand_str,
                handler_fn = _getEventStartHandler(fn, timer_int, handler_tag_str);

            //add start event handler tag to storage
            //it will be cleared later to enable proper operation of start event for scroll
            if(!wizmo.domStore('var_event_scroll_start_fn_tags'))
            {
                wizmo.domStore('var_event_scroll_start_fn_tags', []);
            }
            wizmo.domStore('var_event_scroll_start_fn_tags').push(handler_tag_str);

            //add to scroll_start function queue
            wizmo.addFunction('scroll_fn_start', handler_fn, {queue: true, namespace: 'scroll_fn_start'});
        }

        /**
         * Executes a function [once] when a scroll event is started
         * @param fn {Function} the callback function
         * @param timer_int {Number} an optional wait timer for the event throttler. Default is 50ms
         */
        wizmo_obj.onScrollStart = function(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onScrollStart(fn, myArgs[1]);
            return this;
        };

        /**
         * Executes a function [once] when a scroll event completes
         * @param fn {Function} the callback function
         * @param timer_int {Number} an optional wait timer for the event debouncer. Default is 500ms
         * @private
         */
        function _onScrollEnd(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                timer_int = (_w.isNumber(myArgs[1])) ? myArgs[1]: 500,
                handler_fn = _getEventEndHandler(fn, timer_int),
                handler_cleanup_temp_fn,
                handler_cleanup_fn;

            //add a cleanup function on first init
            //to make sure that onStartScroll tags are set to false
            //onStartScroll won't work properly without it
            if(!wizmo.domStore('var_event_scroll_start_handler_fn_tags_flush'))
            {
                handler_cleanup_temp_fn = function(){
                    var event_start_tags_arr = wizmo.domStore('var_event_scroll_start_fn_tags'),
                        i;
                    if(_w.count(event_start_tags_arr) > 0)
                    {
                        for(i = 0; i < event_start_tags_arr.length; i++)
                        {
                            wizmo.domStore(event_start_tags_arr[i], false);
                        }
                    }

                    wizmo.domStore('var_event_scroll_start_handler_fn_tags_flush', true);
                };
                handler_cleanup_fn = _getEventEndHandler(handler_cleanup_temp_fn, timer_int);

                //add to scroll_end function queue
                wizmo.addFunction('scroll_fn_end', handler_cleanup_fn, {queue: true, namespace: 'scroll_fn_end'});
            }

            //add to scroll_end function queue
            wizmo.addFunction('scroll_fn_end', handler_fn, {queue: true, namespace: 'scroll_fn_end'});
        }

        /**
         * Wrapper class for _onScrollEnd
         */
        wizmo_obj.onScrollEnd = function(fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onScrollEnd(fn, myArgs[1]);
            return this;
        };

        /**
         * Manages the event handler for scroll events
         * @param ctx {Object} the context
         * @param options {Object} the options from wizmo constructor
         * @param event_name {String} the event name
         * @param settings_obj {Object} special settings data
         * @private
         */
        function _scrollEventManager(ctx, options, event_name, settings_obj)
        {
            var win_obj = $(window),
                breakpoint_arr = settings_obj.breakpoints_array;

            //set event handler
            win_obj.on(event_name, function(){
                _scrollEventTrigger(ctx, breakpoint_arr, options, settings_obj);
            });
        }

        /**
         * Triggers an event handler [scroll]
         * @param ctx {Object} the context
         * @returns {*}
         * @private
         */
        function _scrollEventTrigger(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                bp_arr = myArgs[1],
                options = myArgs[2],
                settings_obj = myArgs[3],
                callback_id_arr = settings_obj.callback_id_array,
                event_status_str = settings_obj.event_status,
                bp_settings_obj = {}
                ;

            bp_settings_obj.responsive_basis = settings_obj.responsive_basis;

            try{
                return ctx.each(function(ix, el)
                {
                    if(bp_arr)
                    {
                        //run only if breakpoints are provided

                        var _this = $(el);

                        //match breakpoints + set classes and attributes
                        _setBreakpointsScroll(_this, bp_arr, options, bp_settings_obj, event_status_str);
                    }

                    //fire relevant callbacks
                    _callbackTrigger(options, callback_id_arr);

                });
            }
            catch(e){
                var e_msg_str = _w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: '+e.message;
                _w.console.error(e_msg_str, true);
            }
        }

        /**
         * Attach an event handler for the scroll event
         * @param {Function} fn The function to execute
         * @return object
         * @private
         */
        function _scroll(fn)
        {
            $(window).on('scroll', fn);
            return wizmo;
        }

        /**
         * Gets the direction that a browser is scrolling
         * @param plane_str {string} the plane under consideration i.e. horizontal ('h') or vertical ('v')
         * @return {string|null}
         * @private
         */
        function _getScrollDirection(plane_str)
        {
            var scroll_direction_str = null,
                scroll_top_int = parseInt(wizmo.store("var_viewport_scroll_t")),
                scroll_left_int = parseInt(wizmo.store("var_viewport_scroll_l")),
                scroll_top_prev_int = parseInt(wizmo.store("var_viewport_scroll_t_prev")),
                scroll_left_prev_int = parseInt(wizmo.store("var_viewport_scroll_l_prev"))
                ;

            if (plane_str === 'h')
            {
                //determine resize direction over horizontal plane
                if(scroll_left_int < scroll_left_prev_int)
                {
                    //scroll left
                    scroll_direction_str = 'left';
                }
                else if (scroll_left_int > scroll_left_prev_int)
                {
                    //scroll right
                    scroll_direction_str = 'right';
                }
                else
                {
                    //no scroll
                    scroll_direction_str = 'none';
                }
            }
            else if (plane_str === 'v')
            {
                //determine resize direction over vertical plane
                if(scroll_top_int < scroll_top_prev_int)
                {
                    //scroll up
                    scroll_direction_str = 'up';
                }
                else if (scroll_top_int > scroll_top_prev_int)
                {
                    //scroll down
                    scroll_direction_str = 'down';
                }
                else
                {
                    //no scroll
                    scroll_direction_str = 'none';
                }
            }

            return scroll_direction_str;
        }

        /**
         * Executes a function at the start of a specific event
         * @param fn {Function} the callback function
         * @param timer_int {Number} a wait timer [in ms] for the event throttler
         * @param var_dom_name_str {String} the name for the DOM store variable that will
         * be used to track status
         * @returns {Function}
         * @private
         */
        function _getEventStartHandler(fn, timer_int, var_dom_name_str)
        {
            var handler_fn = function()
            {
                if(!wizmo.domStore(var_dom_name_str))
                {
                    fn();

                    //set marker to true to prevent multiple firing
                    wizmo.domStore(var_dom_name_str, true);
                }
            };

            return _w.throttle(handler_fn, timer_int);
        }

        /**
         * Executes a function at the end of a specific event
         * @param fn {Function} the callback function
         * @param timer_int {Number} a wait timer [in ms] for the event debouncer
         * @param var_dom_name_str {String} the name for the DOM store variable that will be used to track status
         * @returns {Function}
         * @private
         */
        function _getEventEndHandler(fn, timer_int, var_dom_name_str)
        {
            var fn_util = function()
            {
                if(wizmo.domStore(var_dom_name_str))
                {
                    //set marker to false to reset for _getEventStartHandler calls
                    wizmo.domStore(var_dom_name_str, false);
                }
            };

            return _w.debounce(fn, timer_int, fn_util);
        }

        /**
         * Initializes scroll variables to local storage
         * @private
         */
        function _initScrollVars()
        {
            var elem_body_obj = $('body');
            wizmo.store("var_viewport_scroll_t", elem_body_obj.scrollTop());
            wizmo.store("var_viewport_scroll_l", elem_body_obj.scrollLeft());
        }

        /**
         * Attach an event handler for network events
         * Powered by Offline.js <https://github.com/HubSpot/offline>
         * @param {String} event_str the event identifier
         * @param {Function} fn the function to execute
         * @param {Object} options_obj the options
         * @param {Boolean} off_bool if true, will unbind
         * @return object
         * @private
         */
        function _network(event_str, fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[2],
                off_bool = myArgs[3];

            if(options_obj)
            {
                Offline.options = options_obj;
            }

            if(off_bool)
            {
                //unbind
                Offline.off(event_str, fn);
            }
            else
            {
                //bind
                Offline.on(event_str, fn);
            }

            return wizmo;
        }

        /**
         * Schedules a function to run on a network connectivity event
         * @param {String} event_str the event identifier
         * event_str is analogous to offline.js official event bindings. See https://github.com/hubspot/offline
         * The available values are:
         * up: analogous to up
         * down: analogous to down
         * confirm_up: analogous to confirmed-up
         * confirm_down: analogous to confirmed-down
         * reconnect: analogous to reconnect:connecting
         * reconnect_start: analogous to reconnect:started
         * reconnect_fail: analogous to reconnect:failure
         * reconnect_stop: analogous to reconnect:stopped
         *
         * @param {Function} fn the callback function
         * @private
         */
        function _onNetwork(event_str, fn)
        {
            if(!_w.in_array(event_str, ['up', 'down', 'confirm_up', 'confirm_down', 'reconnect', 'reconnect_start', 'reconnect_fail', 'reconnect_stop']))
            {
                return false;
            }

            wizmo.addFunction('network_fn_'+event_str, fn, {queue: true, namespace: 'network_fn_'+event_str});

            //enable main network connectivity event manager
            __network();
        }

        /**
         * Executes a function [once] when the network connection goes from offline to online
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkUp(fn)
        {
            _onNetwork('up', fn);
        }

        /**
         * Executes a function [once] when a network connection test succeeds
         * The function is fired even if the connection is already up
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkConfirmUp(fn)
        {
            _onNetwork('confirm_up', fn);
        }

        /**
         * Executes a function [once] when the network connection goes from online to offline
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkDown(fn)
        {
            _onNetwork('down', fn);
        }

        /**
         * Executes a function [once] when a network connection test fails
         * The function is fired even if the connection is already down
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkConfirmDown(fn)
        {
            _onNetwork('confirm_down', fn);
        }

        /**
         * Executes a function [once] when the network connection attempts to reconnect
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkReconnect(fn)
        {
            _onNetwork('reconnect', fn);
        }

        /**
         * Executes a function [once] when the network connection's attempt to reconnect starts
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkReconnectStart(fn)
        {
            _onNetwork('reconnect_start', fn);
        }

        /**
         * Executes a function [once] when the network connection's attempt to reconnect failed
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkReconnectFail(fn)
        {
            _onNetwork('reconnect_fail', fn);
        }

        /**
         * Executes a function [once] when the network connection's attempt to reconnect is stopped
         * @param fn {Function} the callback function
         * @private
         */
        function _onNetworkReconnectStop(fn)
        {
            _onNetwork('reconnect_stop', fn);
        }

        /**
         * Unbinds an event
         * @param {String} event_str the event identifier
         * up: analogous to up
         * down: analogous to down
         * confirm_up: analogous to confirmed-up
         * confirm_down: analogous to confirmed-down
         * reconnect: analogous to reconnect:connecting
         * reconnect_start: analogous to reconnect:started
         * reconnect_fail: analogous to reconnect:failure
         * reconnect_stop: analogous to reconnect:stopped
         *
         * @param {Function} fn the callback function that was initially passed to _onNetwork method
         * @private
         */
        function _offNetwork(event_str, fn)
        {
            if(!_w.in_array(event_str, ['up', 'down', 'confirm_up', 'confirm_down', 'reconnect', 'reconnect_start', 'reconnect_fail', 'reconnect_stop']))
            {
                return false;
            }

            wizmo.removeFunction('network_fn_'+event_str, {fn: fn, queue: true, namespace: 'network_fn_'+event_str});
        }

        /**
         * Sets up a network event handler to run queued functions
         * Note: These are functions that have been previously queued using _onNetwork method
         * Note: contains double-underscore prefix
         * @private
         */
        function __network()
        {
            //create handlers
            var network_up_fn = function(){
                //run queued network up functions
                wizmo.runFunction('network_fn_up', {queue: true, namespace: 'network_fn_up'});
            };
            var network_confirm_up_fn = function(){
                //run queued network confirm up functions
                wizmo.runFunction('network_fn_confirm_up', {queue: true, namespace: 'network_fn_confirm_up'});
            };
            var network_down_fn = function(){
                //run queued network down functions
                wizmo.runFunction('network_fn_down', {queue: true, namespace: 'network_fn_down'});
            };
            var network_confirm_down_fn = function(){
                //run queued network confirm down functions
                wizmo.runFunction('network_fn_confirm_down', {queue: true, namespace: 'network_fn_confirm_down'});
            };
            var network_reconnect_fn = function(){
                //run queued network reconnect functions
                wizmo.runFunction('network_fn_reconnect', {queue: true, namespace: 'network_fn_reconnect'});
            };
            var network_reconnect_start_fn = function(){
                //run queued network reconnect start functions
                wizmo.runFunction('network_fn_reconnect_start', {queue: true, namespace: 'network_fn_reconnect_start'});
            };
            var network_reconnect_stop_fn = function(){
                //run queued network reconnect stop functions
                wizmo.runFunction('network_fn_reconnect_stop', {queue: true, namespace: 'network_fn_reconnect_stop'});
            };
            var network_reconnect_fail_fn = function(){
                //run queued network reconnect fail functions
                wizmo.runFunction('network_fn_reconnect_fail', {queue: true, namespace: 'network_fn_reconnect_fail'});
            };

            //attach only once
            if(!wizmo.domStore('var_network_manager_init'))
            {
                _network('up', network_up_fn);
                _network('confirmed-up', network_confirm_up_fn);
                _network('down', network_down_fn);
                _network('confirmed-down', network_confirm_down_fn);
                _network('reconnect:connecting', network_reconnect_fn);
                _network('reconnect:started', network_reconnect_start_fn);
                _network('reconnect:stopped', network_reconnect_stop_fn);
                _network('reconnect:failure', network_reconnect_fail_fn);

                wizmo.domStore('var_network_manager_init', true);
            }
        }

        /**
         * Network connectivity functionality
         * Powered by Offline.js <https://github.com/HubSpot/offline>
         */
        wizmo_obj.network = {

            /**
             *
             * @returns {Boolean}
             */
            isUp: function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = (myArgs[0]) ? myArgs[0] : undefined;

                return (_getOnlineStatus(options_obj));
            },
            /**
             *
             * @returns {boolean}
             */
            isDown: function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = (myArgs[0]) ? myArgs[0] : undefined;

                return !(_getOnlineStatus(options_obj));
            },
            /**
             * Gets the status of connectivity
             * Either online or offline
             * @returns {string}
             */
            status: function(){
                return _getNetworkStatus();
            },
            /**
             *
             * @param {String} event_str the event identifier
             *
             * The following options are available and they pair to the official offline.js options. See Offline.js docs (http://github.hubspot.com/offline) for details
             *
             * up: analogous to 'up'
             * down: analogous to 'down'
             * confirm_up: analogous to 'confirmed-up'
             * confirm_down: analogous to 'confirmed-down'
             * reconnect: analogous to 'reconnect:connecting'
             * reconnect_start: analogous to 'reconnect:started'
             * reconnect_stop: analogous to 'reconnect:stopped'
             * reconnect_fail: analogous to 'reconnect:failure'
             *
             * @param {Function} fn a callback function
             */
            on: function (event_str, fn) {

                if(event_str === 'up')
                {
                    _onNetworkUp(fn);
                }
                else if(event_str === 'down')
                {
                    _onNetworkDown(fn);
                }
                else if(event_str === 'confirm_up')
                {
                    _onNetworkConfirmUp(fn);
                }
                else if(event_str === 'confirm_down')
                {
                    _onNetworkConfirmDown(fn);
                }
                else if(event_str === 'reconnect')
                {
                    _onNetworkReconnect(fn);
                }
                else if(event_str === 'reconnect_start')
                {
                    _onNetworkReconnectStart(fn);
                }
                else if(event_str === 'reconnect_stop')
                {
                    _onNetworkReconnectStop(fn);
                }
                else if(event_str === 'reconnect_fail')
                {
                    _onNetworkReconnectFail(fn);
                }
            },
            /**
             * Schedule a function to run when connection state is online
             * @param {Function} fn the function to be run
             */
            onUp: function(fn){
                _onNetworkUp(fn);
            },
            /**
             * Schedule a function to run when connection state is online
             * @param {Function} fn the function to be run
             */
            onConfirmUp: function(fn){
                _onNetworkConfirmUp(fn);
            },
            /**
             * Schedule a function to run when connection state is offline
             * @param {Function} fn the function to be run
             */
            onDown: function(fn){
                _onNetworkDown(fn);
            },
            /**
             * Schedule a function to run when connection state is offline
             * @param {Function} fn the function to be run
             */
            onConfirmDown: function(fn){
                _onNetworkConfirmDown(fn);
            },
            /**
             * Schedule a function to run when connection is reconnecting
             * @param {Function} fn the function to be run
             */
            onReconnect: function(fn){
                _onNetworkReconnect(fn);
            },
            /**
             * Schedule a function to run when connection is reconnecting
             * @param {Function} fn the function to be run
             */
            onReconnectStart: function(fn){
                _onNetworkReconnectStart(fn);
            },
            /**
             * Schedule a function to run when connection is reconnecting
             * @param {Function} fn the function to be run
             */
            onReconnectStop: function(fn){
                _onNetworkReconnectStop(fn);
            },
            /**
             * Schedule a function to run when connection reconnection failed
             * @param {Function} fn the function to be run
             */
            onReconnectFail: function(fn){
                _onNetworkReconnectFail(fn);
            },
            /**
             *
             * @param fn
             */
            off: function(event_str, fn){
                _offNetwork(event_str, fn);
            }
        };

        /**
         * Inserts a file or source code into <head> or <body> of a HTML page
         * @param file_path_or_code_str {String} the file path of the file or raw data
         * @param options_obj {Object}
         *
         * The following options are available:
         *
         * unique {Boolean}: if true, duplicate file references cannot be loaded
         *
         * metatag {Object}: defines metatag object. If valid, a metatag will be loaded
         *
         * load_loc {String}: the location where the file or source code should be inserted. 'h' or 'head' for '<head>' [default]; 'b' or 'body' for '<body>'
         *
         * load_pos {Number}: determines the insertion point of the content [to be inserted] among its cohorts. Default is 1.
         * Scenario 1: If load_pos_int is 1 and prepend_bool is false, the content will be inserted after the first element
         * Scenario 2: If load_pos_int is 1 and prepend_bool is false, the content will be inserted before the first element
         *
         * prepend {Boolean}: if true, content will be prepended; if false [default], content will be appended
         *
         * tag_attr {Object}: defines the attributes of the loaded script/stylesheet tag
         * If CSS file, default tag_attr_obj is
         * {rel: "stylesheet", type: "text/css", media: "all"}
         * If JS file, default tag_attr_obj is {type: "text/javascript", async: false}
         * You can also define id to add an id attribute with value
         * {id: "my_id"} will add an id attribute with value "my_id"
         *
         * tag_attr_set_manual {Boolean}: if true, default tag attributes will not be set. You have to set tag attributes manually
         *
         * defer {Boolean}: if true, will defer the loaded file
         *
         * defer_suffix {String}: defines the suffix for the script/stylesheet type
         * attribute i.e. text/javascript/<defer_suffix_str>. Only valid if defer_bool is true
         *
         * is_xhr {Boolean}: if true, the file will be loaded via XHR
         *
         * xhr_options {Object}: defines the options for the XHR request
         * Note: this is only applicable for loading HTML content
         *
         * callback {Function}: defines a callback function that will be executed
         * when a script is loaded
         *
         * @private
         */
        function _loadCore(file_path_or_code_str)
        {
            /**
             * 1: Detect if file is path or raw source code
             * 2: If file path, check js or css, then append accordingly
             * 3: If NOT file path, check if CSS. If not, append accordingly
             */

            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1],
                unique_bool,
                loc_str,
                is_body_bool,
                prepend_bool,
                replace_bool,
                load_pos_int,
                load_pos_idx_int,
                load_pos_bool,
                tag_attr_css_default_obj = {type: "text/css", rel: "stylesheet", media: "all"},
                tag_attr_js_default_obj = {type: "text/javascript", async: false},
                tag_attr_obj,
                tag_attr_css_obj,
                tag_attr_js_obj,
                tag_attr_meta_obj,
                tag_attr_set_manual_bool,
                defer_bool,
                defer_suffix_str,
                is_xhr_bool,
                xhr_options_obj,
                callback_fn,
                callback_fn_id_hash_str,
                callback_fn_id_str,
                insert_method_str,
                insert_relative_to_cohort_bool = false,     //defines whether content will be inserted relative to an existing element
                insert_obj_type_str,
                el_head = $('head'),
                el_body = $('body'),
                el,
                el_wq_obj,
                el_target_js,
                el_target_css,
                el_target_script,
                el_target_meta,
                el_target_js_cohort_count_int = 0,
                el_target_css_link_cohort_count_int = 0,
                el_target_meta_cohort_count_int = 0,
                ref_obj,
                ref_wq_obj,
                ref_obj_text_node_obj,
                is_ie_int = _w.isIE(),
                is_wquery_bool = ((el_head.label === 'wquery')),
                find_ref_path_bool,
                do_load_bool = true
                ;

            //define defaults
            unique_bool = (_w.isBool(options_obj.unique)) ? options_obj.unique : false;
            loc_str = (options_obj.load_loc && !_w.isEmptyString(options_obj.load_loc)) ? options_obj.load_loc : undefined;
            prepend_bool = (_w.isBool(options_obj.prepend)) ? options_obj.prepend : false;
            replace_bool = (_w.isBool(options_obj.replace)) ? options_obj.replace : false;
            load_pos_int = (options_obj.load_pos && _w.isNumber(options_obj.load_pos) && options_obj.load_pos > 0) ? options_obj.load_pos : 1;
            load_pos_bool = !!((options_obj.load_pos && _w.isNumber(options_obj.load_pos) && options_obj.load_pos > 0));
            tag_attr_obj = (options_obj.tag_attr) ? options_obj.tag_attr: {};
            tag_attr_css_obj = _w.cloneObject(tag_attr_obj);
            tag_attr_js_obj = _w.cloneObject(tag_attr_obj);
            tag_attr_meta_obj = _w.cloneObject(tag_attr_obj);
            tag_attr_set_manual_bool = (_w.isBool(options_obj.tag_attr_set_manual)) ? options_obj.tag_attr_set_manual: false;
            defer_bool = (_w.isBool(options_obj.defer)) ? options_obj.defer: false;
            defer_suffix_str = (options_obj.defer_suffix && _w.isString(options_obj.defer_suffix)) ? options_obj.defer_suffix: 'w_defer_sys';
            is_xhr_bool = (_w.isBool(options_obj.xhr)) ? options_obj.xhr : false;
            callback_fn = (options_obj.callback) ? options_obj.callback : undefined;
            xhr_options_obj = (_w.isObject(options_obj.xhr_options)) ? options_obj.xhr_options : undefined;

            //preset variables dependent on defaults
            load_pos_idx_int = load_pos_int - 1;
            insert_method_str = (prepend_bool) ? 'prependTo': 'appendTo';
            is_body_bool = !!((loc_str === 'b' || loc_str === 'body'));

            /**
             * Checks whether a file path reference exists
             * @param {String} path_str the file path reference
             * @return {Boolean}
             * @private
             */
            var _findPathRef = function(path_str)
            {
                var regex_obj,
                    is_js_bool,
                    ref_tag_str,
                    ref_obj,
                    ref_path_str,
                    ref_path_arr = [],
                    path_exists_bool
                    ;

                regex_obj = new RegExp("\\.js(\\?[^\\s]*?|) *$", "gi");
                is_js_bool = regex_obj.test(path_str);

                ref_tag_str = (is_js_bool) ? 'script' : 'link';
                ref_obj = document.getElementsByTagName(ref_tag_str);

                for(var i = 0; i < ref_obj.length; i++)
                {
                    ref_path_str = (is_js_bool) ? ref_obj[i]['src'] : ref_obj[i]['href'];
                    ref_path_str = (_w.isString(ref_path_str)) ? ref_path_str : '';
                    ref_path_str = ref_path_str.trim();

                    if(ref_path_str.length > 0)
                    {
                        ref_path_arr.push(ref_path_str);
                    }
                }

                path_exists_bool = _w.in_array(path_str, ref_path_arr);
                return path_exists_bool;
            };

            //setup defer parameters
            if(defer_bool)
            {
                //set CSS and Javascript to non-standard types to force browser ignore
                tag_attr_js_obj.type = "text/javascript/"+defer_suffix_str;
                tag_attr_css_obj.type = "text/css/"+defer_suffix_str;
            }

            //get actual DOM element of head or body
            if(el_head)
            {
                el = (is_body_bool) ? el_body[0]: el_head[0];
            }
            else
            {
                return false;
            }

            //create regex to check if content is file or text
            var regex_1 = new RegExp("^ *[^\\s]+?\\.([a-zA-Z0-9]+)((?:\\?|)[^\\s]*?|) *$", "gi"),
                is_filename_bool = regex_1.test(file_path_or_code_str)
                ;

            if (is_filename_bool)
            {
                //2:
                var regex_2 = new RegExp("\\.js(\\?[^\\s]*?|) *$", "gi");
                var is_filename_js_bool = regex_2.test(file_path_or_code_str);

                if(is_filename_js_bool)
                {
                    /**
                     * Add JavaScript
                     */

                    el_target_js = el.getElementsByTagName('script');

                    for (var key in el_target_js)
                    {
                        if (el_target_js.hasOwnProperty(key))
                        {
                            if(/^ *[^\s]+? *$/i.test(el_target_js[key].src) && /^ *[0-9]+? *$/i.test(key))
                            {
                                el_target_js_cohort_count_int++;
                            }
                        }
                    }

                    //count script cohorts
                    if(el_target_js_cohort_count_int > 0)
                    {
                        insert_relative_to_cohort_bool = true;

                        //script tag cohorts present
                        if(!load_pos_bool)
                        {
                            //manage load position
                            load_pos_idx_int = (prepend_bool) ? 0 : el_target_js_cohort_count_int-1;
                        }
                        else
                        {
                            //reset load position if provided value is too high that it prevents load
                            load_pos_idx_int = (load_pos_int > el_target_js_cohort_count_int) ? el_target_js_cohort_count_int-1 : load_pos_idx_int;
                        }

                        el = el_target_js[load_pos_idx_int];
                    }

                    insert_obj_type_str = 'js_file_script';
                }
                else
                {
                    var regex_3 = new RegExp("(?:htm|html) *$", "gi");
                    var is_filename_html_bool = regex_3.test(file_path_or_code_str);

                    if(is_filename_html_bool)
                    {
                        /**
                         * Add HTML
                         */
                        //classify object to be inserted
                        insert_obj_type_str = 'html_file_link';
                    }
                    else
                    {
                        /**
                         * Add CSS
                         * 1: in <BODY> with @import
                         * 2: in <HEAD> using <link>
                         */

                        //get link, style, or metatag elements i.e. cohorts in target
                        el_target_css = (is_body_bool) ? el.getElementsByTagName('style') : el.getElementsByTagName('link');
                        el_target_script = el.getElementsByTagName('script');

                        var el_target_css_check_bool = ((el_target_css && el_target_css.length > 0));
                        el_target_meta = el.getElementsByTagName('meta');
                        var el_target_meta_check_bool = ((el_target_meta && el_target_meta.length > 0));

                        if(el_target_css_check_bool || el_target_meta_check_bool)
                        {
                            //flag that insert operation is cohort-relative
                            insert_relative_to_cohort_bool = true;

                            //seed target element
                            var el_target_css_mixed = (el_target_css_check_bool) ? el_target_css : el_target_meta;

                            //count link/meta cohorts
                            el_target_css_link_cohort_count_int = el_target_css.length;
                            el_target_meta_cohort_count_int = el_target_meta.length;

                            if(el_target_css_link_cohort_count_int > 0)
                            {
                                //link tag cohorts present
                                if(!load_pos_bool)
                                {
                                    //manage load position
                                    load_pos_idx_int = (prepend_bool) ? 0 : el_target_css_link_cohort_count_int-1;
                                }
                                else
                                {
                                    //reset load position if provided value is too high that it prevents load
                                    load_pos_idx_int = (load_pos_int > el_target_css_link_cohort_count_int) ? el_target_css_link_cohort_count_int-1 : load_pos_idx_int;
                                }
                            }
                            else
                            {
                                //no link tag cohorts present
                                // anchor on meta tags
                                if(prepend_bool)
                                {
                                    if(el_target_script)
                                    {
                                        //script elements present
                                        //anchor to script tags
                                        load_pos_idx_int = 0;
                                        el_target_css_mixed = el_target_script;
                                    }
                                }
                                else
                                {
                                    load_pos_idx_int = el_target_meta_cohort_count_int-1;
                                }
                            }

                            el = el_target_css_mixed[load_pos_idx_int];
                        }

                        //classify object to be inserted
                        insert_obj_type_str = (is_body_bool) ? 'css_file_style' : 'css_file_link';
                    }
                }
            }
            else
            {
                //3:

                if(_w.isString(file_path_or_code_str))
                {
                    var regex_4 = new RegExp("[\\w\\-]+ *\\{\\s*[\\w\\-]+\\s*\\:\\s*.*?\\;");
                    var is_text_css_bool = regex_4.test(file_path_or_code_str);

                    if(is_text_css_bool)
                    {
                        //classify object to be inserted
                        insert_obj_type_str = 'css_text_style';
                    }
                    else
                    {
                        ref_obj = (is_body_bool) ? document.createElement("div") : document.createElement("style");
                        ref_obj.innerHTML = file_path_or_code_str;
                    }
                }
                else
                {
                    //file_path_or_code_str is null

                    if(tag_attr_meta_obj.name && tag_attr_meta_obj.content)
                    {
                        el_target_meta = el.getElementsByTagName('meta');

                        //count link/meta cohorts
                        el_target_meta_cohort_count_int = el_target_meta.length;

                        if(el_target_meta_cohort_count_int > 0)
                        {
                            insert_relative_to_cohort_bool = true;

                            //meta tag cohorts present
                            if(!load_pos_bool)
                            {
                                //manage load position
                                load_pos_idx_int = (prepend_bool) ? 0 : el_target_meta_cohort_count_int-1;
                            }
                            else
                            {
                                //reset load position if provided value is too high that it prevents load
                                load_pos_idx_int = (load_pos_int > el_target_meta_cohort_count_int) ? el_target_meta_cohort_count_int-1 : load_pos_idx_int;
                            }

                            el = el_target_meta[load_pos_idx_int];
                        }

                        //classify object to be inserted
                        insert_obj_type_str = 'meta_tag';
                    }
                }
            }

            //create element
            if(insert_obj_type_str === 'js_file_script')
            {
                //create script element
                ref_obj = document.createElement("script");

                if(!tag_attr_set_manual_bool)
                {
                    ref_obj.type = (_w.isString(tag_attr_js_obj.type)) ? tag_attr_js_obj.type: tag_attr_js_default_obj.type;
                    ref_obj.async = (_w.isBool(tag_attr_js_obj.async)) ? tag_attr_js_obj.async: tag_attr_js_default_obj.async;
                }

                for(var key_js in tag_attr_js_obj)
                {
                    if (tag_attr_js_obj.hasOwnProperty(key_js)) {
                        ref_obj[key_js] = tag_attr_js_obj[key_js];
                    }
                }

                //create callback
                callback_fn_id_hash_str = _w.hashCode(file_path_or_code_str);
                callback_fn_id_str = '_loadCoreCallback_'+callback_fn_id_hash_str;
                wizmo.addFunction(callback_fn_id_str, callback_fn, {queue: true, namespace: '_loadCoreCallback'});

                if(is_xhr_bool)
                {
                    if (ref_obj.readyState)
                    {
                        //IE
                        ref_obj.onreadystatechange = function(){
                            /*jshint -W116 */
                            if (ref_obj.readyState == "loaded" || ref_obj.readyState == "complete"){
                                ref_obj.onreadystatechange = null;
                                wizmo.runFunction(callback_fn_id_str, {queue: true, namespace: '_loadCoreCallback', flush: true});
                            }
                            /*jshint +W116 */
                        };
                    }
                    else
                    {
                        //Others
                        ref_obj.onload = function(){
                            wizmo.runFunction(callback_fn_id_str, {queue: true, namespace: '_loadCoreCallback', flush: true});
                        };
                    }
                }

                ref_obj.src = file_path_or_code_str;

                //check whether this file path already exists
                find_ref_path_bool = _findPathRef(file_path_or_code_str);

                //exit if unique options is true and the path reference exists
                if(unique_bool && find_ref_path_bool)
                {
                    do_load_bool = false;
                }
            }
            else if (insert_obj_type_str === 'css_file_style')
            {
                //create style element with import link
                ref_obj = document.createElement("style");

                if(!tag_attr_set_manual_bool)
                {
                    ref_obj.type = (_w.isString(tag_attr_css_obj.type)) ? tag_attr_css_obj.type: tag_attr_css_default_obj.type;
                }

                //set custom attributes
                for(var key_css in tag_attr_css_obj)
                {
                    if (tag_attr_css_obj.hasOwnProperty(key_css)) {
                        ref_obj[key_css] = tag_attr_css_obj[key_css];
                    }
                }

                if(is_ie_int && is_ie_int < 9)
                {
                    //fix IE insert <style> issue
                    if (insert_relative_to_cohort_bool)
                    {
                        insert_method_str = (prepend_bool) ? 'addBefore': 'addAfter';

                        ref_wq_obj = $(ref_obj);
                        ref_wq_obj[insert_method_str](el);
                    }
                    else
                    {
                        insert_method_str = (prepend_bool) ? 'prepend': 'append';

                        el_wq_obj = $(el);
                        el_wq_obj[insert_method_str](ref_obj);
                    }

                    ref_obj.styleSheet.cssText = "@import url(\""+file_path_or_code_str+"\");";
                    return;
                }

                ref_obj_text_node_obj = document.createTextNode("@import url(\""+file_path_or_code_str+"\");");
                ref_obj.appendChild(ref_obj_text_node_obj);
            }
            else if (insert_obj_type_str === 'css_text_style')
            {
                //create style element with text
                ref_obj = document.createElement("style");

                if(!tag_attr_set_manual_bool)
                {
                    ref_obj.rel = (_w.isString(tag_attr_css_obj.rel)) ? tag_attr_css_obj.rel: tag_attr_css_default_obj.rel;
                    ref_obj.type = (_w.isString(tag_attr_css_obj.type)) ? tag_attr_css_obj.type: tag_attr_css_default_obj.type;
                }

                //set custom attributes
                for(var key_css in tag_attr_css_obj)
                {
                    if (tag_attr_css_obj.hasOwnProperty(key_css)) {
                        ref_obj[key_css] = tag_attr_css_obj[key_css];
                    }
                }

                if(is_ie_int && is_ie_int < 9)
                {
                    ref_obj.styleSheet.cssText = file_path_or_code_str;
                }
                else
                {
                    ref_obj_text_node_obj = document.createTextNode(file_path_or_code_str);
                    ref_obj.appendChild(ref_obj_text_node_obj);
                }
            }
            else if (insert_obj_type_str === 'css_file_link')
            {
                //create link element
                ref_obj = document.createElement("link");

                if(!tag_attr_set_manual_bool)
                {
                    ref_obj.rel = (_w.isString(tag_attr_css_obj.rel)) ? tag_attr_css_obj.rel: tag_attr_css_default_obj.rel;
                    ref_obj.type = (_w.isString(tag_attr_css_obj.type)) ? tag_attr_css_obj.type: tag_attr_css_default_obj.type;
                    ref_obj.media = (_w.isString(tag_attr_css_obj.media)) ? tag_attr_css_obj.media: tag_attr_css_default_obj.media;
                }

                //set custom attributes
                for(var key_css in tag_attr_css_obj)
                {
                    if (tag_attr_css_obj.hasOwnProperty(key_css)) {
                        ref_obj[key_css] = tag_attr_css_obj[key_css];
                    }
                }

                //delete ref_obj.media;
                ref_obj.href = file_path_or_code_str;

                //check whether this file path already exists
                find_ref_path_bool = _findPathRef(file_path_or_code_str);

                //exit if unique options is true and the path reference exists
                if(unique_bool && find_ref_path_bool)
                {
                    do_load_bool = false;
                }
            }
            else if(insert_obj_type_str === 'html_file_link')
            {
                var insert_op_name_str = (prepend_bool) ? 'prepend' : 'append';

                $.ajax(file_path_or_code_str, xhr_options_obj).then(function(xhr)
                {
                    if(!is_body_bool)
                    {
                        insert_op_name_str = (replace_bool) ? 'html' : insert_op_name_str;

                        //append or prepend to element
                        $(loc_str)[insert_op_name_str](xhr);
                    }
                    else
                    {
                        //append or prepend to body
                        el_body[insert_op_name_str](xhr);
                    }
                });

                return;
            }
            else if (insert_obj_type_str === 'meta_tag')
            {
                //create meta element
                ref_obj = document.createElement("meta");

                ref_obj.name = tag_attr_meta_obj.name;
                ref_obj.content = tag_attr_meta_obj.content;
            }

            //add custom tag attributes
            if(_w.isObject(tag_attr_obj))
            {
                for (var key in tag_attr_obj)
                {
                    if (tag_attr_obj.hasOwnProperty(key))
                    {
                        ref_obj[key] = tag_attr_obj[key];
                    }
                }
            }

            //load if not disabled
            if(do_load_bool)
            {
                //finalize insert methods
                if(insert_relative_to_cohort_bool)
                {
                    ref_wq_obj = $(ref_obj);
                    if(is_wquery_bool)
                    {
                        //wQuery
                        insert_method_str = (prepend_bool) ? 'addBefore': 'addAfter';
                    }
                    else
                    {
                        insert_method_str = (prepend_bool) ? 'insertBefore': 'insertAfter';
                    }

                    ref_wq_obj[insert_method_str](el);
                }
                else
                {
                    insert_method_str = (prepend_bool) ? 'prepend': 'append';

                    if(!is_wquery_bool)
                    {
                        //if not wQuery (e.g. jQuery) then force appendChild
                        //note: this is because jQuery uses AJAX to fetch and
                        //run script even when the type attribute is non-standard
                        el.appendChild(ref_obj);
                    }
                    else
                    {
                        //append or prepend
                        el_wq_obj = $(el);
                        el_wq_obj[insert_method_str](ref_obj);
                    }
                }

                //force ie8 or less repaint for <style> insert
                if((is_ie_int && is_ie_int < 9) && (insert_obj_type_str === 'css_file_style'))
                {
                    el_body = document.getElementsByTagName('body')[0];
                    el_body.className = el_body.className;
                }
            }
        }


        /**
         * Loads CSS or JS into the '<head>' of the HTML page
         * @param file_path_str {String} the file path to the file
         * @param options_obj {Object} the load options
         *
         * The options are:
         *
         * load_delay {Number}: If set, will delay load execution by the given number of seconds
         * load_filter {String}: provides a way to define pre-conditions for load execution
         * For example, load a JavaScript file only if the browser is IE less than version 8
         * The following options are available:
         * isDesktop: load file only if device is desktop
         * isTablet: load file only if device is tablet
         * isPhone: load file only if device is smartphone
         * isTV: load file only if device is TV
         * isMobile: load file only if device is mobile (tablet or smartphone)
         * isNonMobile: load file only if device is non-mobile (desktop or TV)
         * isIOS: load file only if device is based on IOS
         * isAndroid: load file only if device is based on Android
         * isWindows: load file only if device is based on Windows
         * isSymbian: load file only if device is based on Symbian
         * isBlackberry: load file only if device is based on Blackberry
         * isIE: load file only if browser is Internet Explorer
         * isChrome: load file only if browser is Chrome
         * isSafari: load file only if browser is Safari
         * isFirefox: load file only if browser is Firefox
         * isOpera: load file only if browser is Opera
         * lt_ie<version_number>: load file only if browser is Internet Explorer
         * and is less than <version_number> e.g. lt_ie8
         * lte_ie<version_number>: load file only if browser is Internet Explorer
         * and is less than or equal to <version_number> e.g. lte_ie8
         * gt_ie<version_number>: load file only if browser is Internet Explorer
         * and is greater than <version_number> e.g. gt_ie9
         * gte_ie<version_number>: load file only if browser is Internet Explorer
         * and is greater than or equal to <version_number> e.g. gte_ie8
         *
         * Note: all options are passed through to the _loadCore method
         *
         * @private
         */
        function _load(file_path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1]) ? myArgs[1] : {},
                load_delay_int = (_w.isNumber(options_obj.load_delay) && options_obj.load_delay > 0) ? options_obj.load_delay * 1000 : null,
                load_filter_str = (_w.isString(options_obj.load_filter)) ? options_obj.load_filter : "",
                regex_browser_ie = new RegExp("^((?:lt|gt)[e]?)_(ie)([0-9]+)$", "i"),
                regex_device = new RegExp("^is(desktop|tablet|phone|tv|mobile|nonmobile|ios|android|windows|symbian|blackberry|ie|chrome|safari|firefox|opera)$", "i"),
                regex_browser = new RegExp("^is(ie|chrome|safari|firefox|opera)$", "i"),
                filter_test_bool
                ;

            //manage load filter
            if(load_filter_str !== "")
            {
                //do only if a filter is set

                if(regex_browser_ie.test(load_filter_str))
                {
                    //internet explorer
                    var browser_ie_version_int = _w.isIE();
                    var browser_ie_match_arr = _w.regexMatchAll(regex_browser_ie, load_filter_str);
                    var browser_ie_match_operator_str = browser_ie_match_arr[0][1];
                    var browser_ie_match_version_int = parseInt(browser_ie_match_arr[0][3]);

                    if(browser_ie_version_int)
                    {
                        if(browser_ie_match_operator_str === 'lt')
                        {
                            filter_test_bool = (browser_ie_version_int < browser_ie_match_version_int);
                            if(!filter_test_bool)
                            {
                                return;
                            }
                        }
                        else if(browser_ie_match_operator_str === 'lte')
                        {
                            filter_test_bool = (browser_ie_version_int <= browser_ie_match_version_int);
                            if(!filter_test_bool)
                            {
                                return;
                            }
                        }
                        else if(browser_ie_match_operator_str === 'gt')
                        {
                            filter_test_bool = (browser_ie_version_int > browser_ie_match_version_int);
                            if(!filter_test_bool)
                            {
                                return;
                            }
                        }
                        else if(browser_ie_match_operator_str === 'gte')
                        {
                            filter_test_bool = (browser_ie_version_int >= browser_ie_match_version_int);
                            if(!filter_test_bool)
                            {
                                return;
                            }
                        }
                    }
                }
                else if (regex_device.test(load_filter_str))
                {
                    //device
                    var device_match_arr = _w.regexMatchAll(regex_device, load_filter_str),
                        device_test_method_str = device_match_arr[0][1];

                    if(regex_browser.test(load_filter_str))
                    {
                        //browsers
                        /*jshint -W116 */
                        device_test_method_str = device_test_method_str.toLowerCase();
                        var device_is_browser_bool = (device_test_method_str == wizmo.getBrowserName());
                        /*jshint +W116 */

                        if(!device_is_browser_bool)
                        {
                            return;
                        }
                    }
                    else
                    {
                        //other

                        var device_is_bool = wizmo['is'+device_test_method_str]();
                        if(!device_is_bool)
                        {
                            return;
                        }
                    }
                }
            }

            //load files
            if(load_delay_int)
            {
                window.setTimeout(function(){_loadCore(file_path_str, options_obj);}, load_delay_int);
            }
            else
            {
                _loadCore(file_path_str, options_obj);
            }
        }

        /**
         * Unloads a CSS or JS file
         * @param {String} file_ref_str either the file name or the tag identifier
         * @private
         */
        function _unload(file_ref_str)
        {
            var is_file_bool = ((/\.(js|css)\s*$/i.test(file_ref_str))),
                file_ext_str,
                ref_elem_obj,
                ref_elem_tag_name_str,
                ref_elem_tag_attr_str,
                ref_elem_all_obj
                ;

            if(!is_file_bool)
            {
                //Use Tag ID

                ref_elem_obj = document.getElementById(file_ref_str);

                if(ref_elem_obj)
                {
                    ref_elem_obj.parentNode.removeChild(ref_elem_obj);
                }
            }
            else
            {
                //Use File Name

                file_ext_str = file_ref_str.split('.').pop();
                if(file_ext_str === 'js')
                {
                    ref_elem_tag_name_str = 'script';
                    ref_elem_tag_attr_str = 'src';
                }
                else
                {
                    ref_elem_tag_name_str = 'link';
                    ref_elem_tag_attr_str = 'href';
                }

                //get all script or sheets
                ref_elem_all_obj = document.getElementsByTagName(ref_elem_tag_name_str);

                if(ref_elem_all_obj.length > 0)
                {
                    for(var i = ref_elem_all_obj.length-1; i >= 0; i--)
                    {
                        /*jshint -W116 */
                        if (ref_elem_all_obj[i] && ref_elem_all_obj[i].getAttribute(ref_elem_tag_attr_str) != null && ref_elem_all_obj[i].getAttribute(ref_elem_tag_attr_str).indexOf(file_ref_str) != -1)
                        {
                            ref_elem_all_obj[i].parentNode.removeChild(ref_elem_all_obj[i]);
                        }
                        /*jshint +W116 */
                    }
                }
            }
        }

        /**
         * Gets a DOM Element from another DOM Element
         * @param node_obj {Object} The main element
         * @param id_str {String} The identifier of the DOM element to retrieve
         * @returns {*}
         * @private
         */
        function _getElementByIdFromNode(node_obj, id_str) {
            for (var i = 0; i < node_obj.childNodes.length; i++) {
                var child_obj = node_obj.childNodes[i];
                if (child_obj.nodeType !== 1)
                {
                    continue;   // ELEMENT_NODE
                }
                if (child_obj.id === id_str)
                {
                    return child_obj;
                }
                child_obj = _getElementByIdFromNode(child_obj, id_str);
                if (child_obj !== null) {
                    return child_obj;
                }
            }
            return null;
        }


        /**
         * Converts a HTML string to a DOM Element
         * Retrieves a sub-DOM element if identifier is provided
         * @param {String} html_str_or_obj the HTML String containing elements
         * Note: If you are passing a HTML string, ensure that its object representation can only have one parent i.e. no siblings
         * For example:
         *
         * This is GOOD:
         * <div id="parent"><div id="child-1"><div id="grandchild-1"></div></div><div id="child-2"><div id="grandchild-2"></div><div id="grandchild-3"></div></div></div>
         *
         * This is BAD:
         * <div id="sibling-1"><div id="sibling-1-child"></div></div><div id="sibling-2"><div id="sibling-2-child"></div></div>
         *
         * @param {String} obj_id_str the identifier of the DOM element to retrieve
         * @param {Boolean} use_tagname_bool if true, obj_id_str will be considered a tag name
         * @returns {Object}
         * @private
         */
        function _parse(html_str_or_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                obj_id_str = (_w.isString(myArgs[1])) ? myArgs[1] : null,
                use_tagname_bool = (_w.isBool(myArgs[2])) ? myArgs[2]: false,
                selector_str = (use_tagname_bool) ? obj_id_str : "#" + obj_id_str,
                elem_obj,
                elem_dom_obj,
                frag_final_obj,
                html_str;

            //Convert to DOM element
            if(_w.isString(html_str_or_obj))
            {
                //Sanitize String
                html_str = html_str_or_obj.replace(/(\r\n|\n|\r)/gm, " ");
                html_str = html_str.trim();

                //Convert
                elem_obj = document.createElement("div");
                elem_obj.innerHTML = html_str;
                elem_dom_obj = elem_obj.firstChild;
                elem_dom_obj = $(elem_dom_obj);
            }
            else
            {
                elem_dom_obj = (wQuery.isWQueryObject(html_str_or_obj)) ? html_str_or_obj : $(html_str_or_obj);
            }

            //If selector is present, filter element
            if(obj_id_str)
            {
                //Filter elements by tag name
                if(use_tagname_bool)
                {
                    return elem_dom_obj.find(selector_str);
                }

                //For Legacy Browsers like IE7
                var frag_obj = document.createDocumentFragment();
                if (frag_obj.getElementById) {
                    frag_obj.appendChild(elem_dom_obj[0]);
                    frag_final_obj = frag_obj.getElementById(obj_id_str);
                    return $(frag_final_obj);
                }

                // Anything else just in case
                return _getElementByIdFromNode(elem_dom_obj, obj_id_str);
            }

            return elem_dom_obj;
        }

        /**
         * Wrapper class for _parse
         */
        wizmo_obj.parse = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _parse(myArgs[0], myArgs[1], myArgs[2]);
        };

        /**
         * Converts a HTML string to DOM element and inserts it to the DOM
         * @param {String} html_str the HTML String containing elements
         * Note: Ensure that the object representation of the HTML string that you provide has a single root parent i.e. no siblings
         * For example:
         *
         * This is GOOD:
         * <div id="parent-root">
         *     <div id="child-1"><div id="grandchild-1"></div></div>
         *     <div id="child-2">
         *         <div id="grandchild-2"></div>
         *         <div id="grandchild-3"></div>
         *     </div>
         * </div>
         *
         * This is BAD:
         * <div id="sibling-1">
         *     <div id="sibling-1-child"></div>
         * </div>
         * <div id="sibling-2">
         *     <div id="sibling-2-child"></div>
         * </div>
         *
         * If you provide HTML that doesn't have a single parent, it will cause issues when using the fragment option.
         *
         * @param {Object} options_obj the options that define how the method will work
         *
         * target: the identifier for the DOM element that will receive the HTML
         * For example, if you want your HTML to be inserted into the following element:
         * <div id="my-target"></div>
         * assign 'my-target' as the value for target
         *
         * template: a template object that will be used to transform HTML content containing {{}} placeholders
         * For example, if you have a html_str like this:
         * <div id="main">
         *     <div id="header">{{myHeader}}</div>
         *     <div id="content">{{myContent}}</div>
         * </div>
         *
         * and your template is an object like this:
         * {myHeader: 'Home', myContent: 'Home Content'}
         *
         * then the following will be inserted into the DOM:
         * <div id="main">
         *     <div id="header">Home</div>
         *     <div id="content">Home Content</div>
         * </div>
         *
         * postmode: specifies how the HTML will be inserted into the DOM. The possible options are: append [default], prepend, replace, after, and before
         * Note: when either after or before is used, the HTML inserted will essentially become a sibling of the target, as opposed to a child
         * Note: after and before will work only when target is defined
         *
         * fragment: the identifer of a fragment within the main HTML, which will be pulled and inserted into the DOM
         * For example, if your html_str is:
         * <div id="main">
         *     <div id="header">Home</div>
         *     <div id="content">Home Content</div>
         * </div>
         *
         * and your fragment === 'header', the HTML inserted will be:
         * <div id="header">Home</div>
         *
         * Note: the rest of the HTML will be discarded
         * Note: this fragment will be pulled after any template transforms are applied
         *
         * @private
         */
        function _port(html_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1]) ? myArgs[1] : {},
                options_fragment_id_str,
                options_target_id_str,
                options_post_method_str,
                options_template_obj,
                port_target_obj,
                html_obj,
                html_frag_str,
                post_op_method_str
                ;

            //define option defaults
            options_target_id_str = (_w.isString(options_obj.target)) ? options_obj.target : '';
            options_post_method_str = (_w.isString(options_obj.postmode) && _w.in_array(options_obj.postmode, ['append', 'replace', 'prepend', 'after', 'before'])) ? options_obj.postmode : 'append';
            options_template_obj = (options_obj.template) ? options_obj.template : undefined;
            options_fragment_id_str = (_w.isString(options_obj.fragment)) ? options_obj.fragment : '';

            //sanitize
            options_target_id_str = (/^ *#.*? *$/i.test(options_target_id_str)) ? options_target_id_str.slice(1) : options_target_id_str;
            options_fragment_id_str = (/^ *#.*? *$/i.test(options_fragment_id_str)) ? options_fragment_id_str.slice(1) : options_fragment_id_str;

            port_target_obj = (options_target_id_str.length > 0) ? $('#'+options_target_id_str) : $('body');

            //compile
            if(options_template_obj)
            {
                html_str = _compile(html_str, options_template_obj);
            }

            //parse HTML to object
            html_obj = _parse(html_str, options_fragment_id_str);
            html_frag_str = (html_obj && html_obj.length > 0) ? html_obj[0].innerHTML : html_str;

            //append, prepend, or replace
            if(options_post_method_str === 'append' || options_post_method_str === 'prepend')
            {
                //append or prepend
                post_op_method_str = (options_post_method_str === 'prepend') ? 'prependTo' : 'appendTo';
                html_obj[post_op_method_str](port_target_obj);
            }
            else if(options_post_method_str === 'after' || options_post_method_str === 'before')
            {
                if(options_target_id_str.length > 0)
                {
                    post_op_method_str = (options_post_method_str === 'after') ? 'addAfter' : 'addBefore';
                    html_obj[post_op_method_str](port_target_obj);
                }
            }
            else
            {
                //replace
                post_op_method_str = 'html';
                port_target_obj[post_op_method_str](html_frag_str);
            }
        }

        /**
         * Wrapper class for _port
         */
        wizmo_obj.port = function(html_str)
        {
            var myArgs = Array.prototype.slice.call(arguments);
            _port(html_str, myArgs[1]);
        };

        /**
         * Loads a metatag into a HTML page
         * @param name_str {String} the metatag name value
         * @param content_str {String} the metatag content value
         */
        wizmo_obj.loadMeta = function(name_str, content_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[2]) ? myArgs[2] : {}
                ;

            options_obj.tag_attr = {'name': name_str, 'content': content_str};

            _load(undefined, options_obj);
            return this;
        };

        /**
         * Loads CSS into a HTML page
         * @param file_path_str {String} see _load
         * @param options_obj {Object} see _load
         */
        wizmo_obj.loadCSS = function(file_path_str, options_obj)
        {
            _load(file_path_str, options_obj);
            return this;
        };

        /**
         * Unloads CSS from a HTML page
         * @param file_ref_str {String} see _unload
         */
        wizmo_obj.unloadCSS = function(file_ref_str)
        {
            _unload(file_ref_str);
            return this;
        };

        /**
         * Refresh CSS on a HTML page
         * This method will add new CSS inline only if it did not previously exist
         * Note: This is for inline CSS only
         * @param {String} new_css_str the CSS code
         * @param {String} file_ref_str the identifier of the inline CSS to refresh; this must be an id attribute [on a <style> tag]. If none is provided, then new_css_str will be appended in <HEAD>
         * @param {Object} refresh_mode_str defines how CSS will be added
         * new: the new CSS will replace the old CSS completely
         * diff_update: Duplicates of CSS rules in old css will be removed [the latest record will be kept], and the new CSS rules [also de-deplicated likewise] will appended to the old CSS [to supercede specificity]
         * diff_replace: All rules in the old CSS that also exist in the new CSS will be removed i.e. only unique rules across both old and new CSS
         * diff_remove: removes new CSS rules from old CSS
         */
        function _refresh(new_css_str)
        {
            if(!_w.isString(new_css_str) || _w.isEmptyString(new_css_str))
            {
                return false;
            }

            var myArgs = Array.prototype.slice.call(arguments),
                file_ref_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : undefined,
                refresh_mode_str = (_w.isString(myArgs[2]) && myArgs[2].length > 0) ? myArgs[2] : 'diff_update',
                is_mode_new_bool = !!(refresh_mode_str === 'new'),
                is_mode_diff_update_bool = !!(refresh_mode_str === 'diff_update'),
                is_mode_diff_replace_bool = !!(refresh_mode_str === 'diff_replace'),
                is_mode_diff_remove_bool = !!(refresh_mode_str === 'diff_remove'),
                is_dedup_bool = !!(_w.isBool(myArgs[2])),
                file_ref_obj = $('#'+file_ref_str),
                old_css_str,
                refresh_css_str,
                regex_old_css_arr,
                old_css_arr = [],
                old_css_selector_arr = [],
                old_css_min_arr = [],
                old_css_arr_item_selector_str,
                old_css_arr_item_selector_min_str,
                old_css_arr_item_decl_str,
                old_css_arr_item_decl_min_str,
                old_css_arr_item_str,
                old_css_arr_item_min_str,
                old_css_temp_reverse_arr = [],
                old_css_temp_selector_reverse_arr = [],
                old_css_temp_arr = [],
                old_css_temp_selector_arr = [],
                regex_new_css_arr,
                new_css_arr = [],
                new_css_selector_arr = [],
                new_css_arr_item_str,
                new_css_arr_item_min_str,
                new_css_min_arr = [],
                new_css_arr_item_selector_str,
                new_css_arr_item_selector_min_str,
                new_css_arr_item_decl_str,
                new_css_arr_item_decl_min_str,
                new_css_temp_reverse_arr = [],
                new_css_temp_selector_reverse_arr = [],
                new_css_temp_arr = [],
                new_css_temp_selector_arr = [],
                final_temp_selector_arr = [],
                final_temp_arr = [],
                final_diff_css_reverse_arr = [],
                final_diff_css_selector_reverse_arr = [],
                final_diff_css_arr = [],
                final_new_css_arr = [],
                new_css_final_str
                ;

            if(!file_ref_obj.empty && file_ref_str)
            {
                //refresh CSS

                //get current CSS info
                old_css_str = file_ref_obj.html();
                regex_old_css_arr = _w.regexMatchAll(/((?:\#|\.|[a-z]).+?)\s*\{(.*?)\}/igm, old_css_str);

                //get the old CSS rules and CSS selectors to separate arrays
                for(var i = 0; i < _w.count(regex_old_css_arr); i++)
                {
                    old_css_arr_item_selector_str = regex_old_css_arr[i][1];
                    old_css_arr_item_decl_str = regex_old_css_arr[i][2];

                    old_css_arr_item_selector_min_str = old_css_arr_item_selector_str.replace(/  +/g, ' ');
                    old_css_arr_item_decl_min_str = old_css_arr_item_decl_str.replace(/ +/g, '');

                    old_css_arr_item_str = old_css_arr_item_selector_str+' {'+old_css_arr_item_decl_str+'}';
                    old_css_arr_item_min_str = old_css_arr_item_selector_min_str+' {'+old_css_arr_item_decl_min_str+'}';

                    old_css_arr.push(old_css_arr_item_str);
                    old_css_selector_arr.push(old_css_arr_item_selector_min_str);
                    old_css_min_arr.push(old_css_arr_item_min_str);
                }

                //de-duplicate old CSS giving preference to later items
                for(var m = old_css_selector_arr.length-1; m >= 0; m--)
                {
                    if(!_w.in_array(old_css_selector_arr[m], old_css_temp_selector_reverse_arr))
                    {
                        old_css_temp_selector_reverse_arr.push(old_css_selector_arr[m]);
                        old_css_temp_reverse_arr.push(old_css_min_arr[m]);
                    }
                }

                //reverse
                old_css_temp_selector_arr = _w.array_reverse(old_css_temp_selector_reverse_arr);
                old_css_temp_arr = _w.array_reverse(old_css_temp_reverse_arr);

                //get new CSS info
                regex_new_css_arr = _w.regexMatchAll(/((?:\#|\.|[a-z]).+?)\s*\{(.*?)\}/igm, new_css_str);

                //get the old CSS rules and CSS selectors to separate arrays
                for(var j = 0; j < _w.count(regex_new_css_arr); j++)
                {
                    new_css_arr_item_selector_str = regex_new_css_arr[j][1];
                    new_css_arr_item_decl_str = regex_new_css_arr[j][2];

                    new_css_arr_item_selector_min_str = new_css_arr_item_selector_str.replace(/  +/g, ' ');
                    new_css_arr_item_decl_min_str = new_css_arr_item_decl_str.replace(/ +/g, '');

                    new_css_arr_item_str = new_css_arr_item_selector_str+' {'+new_css_arr_item_decl_str+'}';
                    new_css_arr_item_min_str = new_css_arr_item_selector_min_str+' {'+new_css_arr_item_decl_min_str+'}';

                    new_css_arr.push(new_css_arr_item_str);
                    new_css_selector_arr.push(new_css_arr_item_selector_min_str);
                    new_css_min_arr.push(new_css_arr_item_min_str);
                }

                //de-duplicate new CSS giving preference to later items
                for(var p = new_css_selector_arr.length-1; p >= 0; p--)
                {
                    if(!_w.in_array(new_css_selector_arr[p], new_css_temp_selector_reverse_arr))
                    {
                        new_css_temp_selector_reverse_arr.push(new_css_selector_arr[p]);
                        new_css_temp_reverse_arr.push(new_css_min_arr[p]);
                    }
                }

                //reverse
                new_css_temp_selector_arr = _w.array_reverse(new_css_temp_selector_reverse_arr);
                new_css_temp_arr = _w.array_reverse(new_css_temp_reverse_arr);

                //get final css for new mode
                final_new_css_arr = new_css_temp_arr;

                //merge old and new arrays
                final_temp_selector_arr = old_css_temp_selector_arr.concat(new_css_temp_selector_arr);
                final_temp_arr = old_css_temp_arr.concat(new_css_temp_arr);

                //perform diff
                if(is_mode_diff_replace_bool || is_mode_diff_update_bool)
                {
                    for(var x = final_temp_selector_arr.length-1; x >= 0; x--)
                    {
                        if (is_mode_diff_replace_bool)
                        {
                            //replace
                            if (!_w.in_array(final_temp_selector_arr[x], final_diff_css_selector_reverse_arr)) {
                                final_diff_css_reverse_arr.push(final_temp_arr[x]);
                                final_diff_css_selector_reverse_arr.push(final_temp_selector_arr[x]);
                            }
                        }
                        else
                        {
                            //update
                            final_diff_css_reverse_arr.push(final_temp_arr[x]);
                        }
                    }
                }
                else if (is_mode_diff_remove_bool)
                {
                    for(var x = old_css_temp_selector_arr.length-1; x >= 0; x--)
                    {
                        //remove
                        if (!_w.in_array(old_css_temp_selector_arr[x], new_css_temp_selector_arr))
                        {
                            final_diff_css_reverse_arr.push(old_css_temp_arr[x]);
                            final_diff_css_selector_reverse_arr.push(old_css_temp_selector_arr[x]);
                        }
                    }
                }

                //reverse
                final_diff_css_arr = _w.array_reverse(final_diff_css_reverse_arr);

                //compose and add CSS
                if(is_mode_new_bool)
                {
                    new_css_final_str = _w.implode("\n", final_new_css_arr);

                    //replace old CSS and add new CSS
                    wizmo.unloadCSS(file_ref_str).loadCSS(new_css_final_str, {tag_attr: {id: ''+file_ref_str+''}});
                }
                else if (is_mode_diff_replace_bool || is_mode_diff_update_bool || is_mode_diff_remove_bool)
                {
                    refresh_css_str = _w.implode("\n", final_diff_css_arr);

                    //refresh move old CSS and load updated CSS
                    wizmo.unloadCSS(file_ref_str).loadCSS(refresh_css_str, {tag_attr: {id: ''+file_ref_str+''}});
                }
            }
            else
            {
                //load new CSS
                regex_new_css_arr = _w.regexMatchAll(/((?:\#|\.|[a-z]).+?)\s*\{(.*?)\}/igm, new_css_str);

                //get the old CSS rules and CSS selectors to separate arrays
                for(var k = 0; k < _w.count(regex_new_css_arr); k++)
                {
                    new_css_arr_item_selector_str = regex_new_css_arr[k][1];
                    new_css_arr_item_decl_str = regex_new_css_arr[k][2];

                    new_css_arr_item_selector_min_str = new_css_arr_item_selector_str.replace(/  +/g, ' ');
                    new_css_arr_item_decl_min_str = new_css_arr_item_decl_str.replace(/ +/g, '');

                    new_css_arr_item_str = new_css_arr_item_selector_str+' {'+new_css_arr_item_decl_str+'}';
                    new_css_arr_item_min_str = new_css_arr_item_selector_min_str+' {'+new_css_arr_item_decl_min_str+'}';

                    //new_css_arr.push(new_css_arr_item_str);
                    new_css_selector_arr.push(new_css_arr_item_selector_min_str);
                    new_css_min_arr.push(new_css_arr_item_min_str);
                }

                new_css_arr = new_css_min_arr;

                //dedup
                if(is_dedup_bool)
                {
                    for(var y = new_css_selector_arr.length-1; y >= 0; y--)
                    {
                        if(!_w.in_array(new_css_selector_arr[y], new_css_temp_selector_reverse_arr))
                        {
                            new_css_temp_selector_reverse_arr.push(new_css_selector_arr[y]);
                            new_css_temp_reverse_arr.push(new_css_min_arr[y]);
                        }
                    }

                    new_css_arr = _w.array_reverse(new_css_temp_reverse_arr);
                }

                //compose and add CSS
                new_css_str = _w.implode("\n", new_css_arr);

                if(file_ref_str)
                {
                    wizmo.loadCSS(new_css_str, {tag_attr: {id: ''+file_ref_str+''}});
                }
                else
                {
                    wizmo.loadCSS(new_css_str);
                }
            }
        }

        /**
         * Refresh CSS on a HTML page
         * @param {String} new_css_str see _refresh
         * @param {String} file_ref_str see _refresh
         * @param {Object} refresh_mode_str see _refresh
         * @returns {wizmo}
         */
        wizmo_obj.refreshCSS = function(new_css_str)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _refresh(new_css_str, myArgs[1], myArgs[2]);
            return this;
        };

        /**
         * Loads JavaScript into a HTML page
         * @param file_path_str {String} see _load
         * @param options_obj {Object} see _load
         */
        wizmo_obj.loadJS = function(file_path_str, options_obj)
        {
            _load(file_path_str, options_obj);
            return this;
        };

        /**
         * Unloads JavaScript from a HTML page
         * @param file_ref_str {String} see _unload
         */
        wizmo_obj.unloadJS = function(file_ref_str)
        {
            _unload(file_ref_str);
            return this;
        };

        /**
         * Compiles a HTML template to plain HTML using a template context
         * It works similar to HandlebarsJS
         * @param html_str_or_obj {String|Object} the template HTML
         * @param template_ctx {Object} the template context object
         * @return {String}
         * @private
         */
        function _compile(html_str_or_obj, template_ctx)
        {
            var html_str = html_str_or_obj,
                ctx_value,
                regex_block_exp = /\{\{#(.*?)\s+(\w+)}}[\s]*([\s\S]*?)[\s]*\{\{\/.*?}}/gi
                ;

            if(!_w.isString(html_str_or_obj))
            {
                //convert to HTML string
                html_str = (wQuery.isWQueryObject(html_str_or_obj)) ? html_str_or_obj.html() : $(html_str_or_obj).html();
            }

            /**
             * 1: Manage Block Expressions
             */
            var matches_arr = _w.regexMatchAll(regex_block_exp, html_str),
                match_block_tag_str,
                match_block_id_str,
                match_block_html_str,
                template_ctx_node,
                template_ctx_node_item,
                template_ctx_node_item_value,
                html_ctx_node_item_str,
                html_ctx_node_str = "",
                html_ctx_block_str = "",
                html_str_clean_list_tag_open_regex,
                html_str_clean_list_tag_close_regex,
                i,
                j;

            //iterate of block expression matches
            for(i = 0; i < _w.count(matches_arr); i++)
            {
                //reset values
                html_ctx_node_str = "";

                //get block expression string components
                match_block_tag_str = matches_arr[i][1];
                match_block_id_str = matches_arr[i][2];
                match_block_html_str = matches_arr[i][3];

                template_ctx_node = template_ctx[match_block_id_str];

                //iterate over template context node value [array]
                for(j = 0; j < _w.count(template_ctx_node); j++)
                {
                    html_ctx_node_item_str = match_block_html_str;
                    template_ctx_node_item = template_ctx_node[j];

                    //generate individual HTML substrings for each list item
                    for (var template_ctx_node_item_key in template_ctx_node_item) {
                        if (template_ctx_node_item.hasOwnProperty(template_ctx_node_item_key)) {
                            template_ctx_node_item_value = template_ctx_node_item[template_ctx_node_item_key];

                            html_ctx_node_item_str = html_ctx_node_item_str.replace("{{"+template_ctx_node_item_key+"}}", template_ctx_node_item_value);
                        }
                    }

                    //append HTML substring to main substring
                    html_ctx_node_str += html_ctx_node_item_str;
                }

                //get final HTML replacement text from main substring
                html_ctx_block_str = match_block_html_str.replace(match_block_html_str, html_ctx_node_str);

                //replace HTML
                if(template_ctx_node)
                {
                    //replace HTML only if template context has valid named node
                    html_str = html_str.replace(match_block_html_str, html_ctx_block_str);

                    //remove any block expression tags
                    html_str_clean_list_tag_open_regex = new RegExp("{{#"+match_block_tag_str+"\\s+"+match_block_id_str+"}}", "i");
                    html_str_clean_list_tag_close_regex = new RegExp("{{\\/"+match_block_tag_str+"}}", "i");

                    html_str = html_str.replace(html_str_clean_list_tag_open_regex, "");
                    html_str = html_str.replace(html_str_clean_list_tag_close_regex, "");
                }
            }

            /**
             * 2: Basic Expressions
             */
            for (var ctx_key in template_ctx) {
                if (template_ctx.hasOwnProperty(ctx_key)) {
                    ctx_value = template_ctx[ctx_key];

                    if(_w.isString(ctx_value))
                    {
                        //run only if template context value is a string
                        html_str = html_str.replace("{{"+ctx_key+"}}", ctx_value);
                    }
                }
            }

            return html_str;
        }

        /**
         * Wrapper class for _compile
         */
        wizmo_obj.compile = function(html_str_or_obj, template_ctx_obj)
        {
            return _compile(html_str_or_obj, template_ctx_obj);
        };

        /**
         * Fetches a file
         * @param {String} path_str the path to the file to fetch
         * @param {Object} options_obj the fetch options
         *
         * cache {boolean}: Defines whether fetched object should be cached. Either true or false. Default is false
         *
         * expiry {number}: Defines the expiry of a cached object in milliseconds. Default is infinity.
         *
         * storage {string}: Defines the storage method used for caching
         * - ls for localStorage
         * - ss for sessionStorage [Default]
         * - ds for domStorage
         * Note: there is no cache_expiry for cached items in DOM storage. All cached items using DOM storage will be refreshed on page reload
         *
         * headers {object}: this enables HTTP headers to be defined. Define using objects e.g. {'Cache-Control': 'no-cache'}
         *
         * @returns {Promise}
         * @private
         */
        function _fetch(path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1]) ? myArgs[1] : {},
                options_cache_bool = !!(options_obj.cache),
                options_cache_expiry_int = (options_obj.expiry) ? options_obj.expiry : undefined,
                options_cache_storage_str = (options_obj.storage) ? options_obj.storage : undefined,
                path_hash_str = _w.md5(path_str);

            if(options_cache_bool)
            {
                options_obj.cache_key = path_hash_str;
                options_obj.cache_expiry = options_cache_expiry_int;
                options_obj.cache_storage = options_cache_storage_str;
            }

            return $.ajax(path_str, options_obj);
        }

        /**
         * Fetches a file
         * Wrapper for _fetch
         * @param {String} path_str the path to the file to fetch
         * @param {Object} options_obj the fetch options
         * @returns {Promise}
         */
        wizmo_obj.fetch = function(path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1]
                ;

            return _fetch(path_str, options_obj);
        };

        /**
         * Post data to a URL
         * @param {String} path_str the path to post to
         * @param {String} data_str_or_obj the data to post
         * @param {Object} options_obj the post options
         * @return {Promise}
         * @private
         */
        function _post(path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                data_str_or_obj = myArgs[1],
                options_obj = (myArgs[2]) ? myArgs[2] : {}
                ;

            //set method
            options_obj.method = 'POST';

            //manage data and headers
            if(_w.isObject(data_str_or_obj))
            {
                //set data
                options_obj.data = data_str_or_obj;

                //set headers
                options_obj.headers = (options_obj.headers) ? options_obj.headers : {};
                options_obj['headers']['Content-type'] = 'application/json';
            }
            else if(_w.isString(data_str_or_obj))
            {
                if(/[^\s]+?\=/i.test(data_str_or_obj))
                {
                    //is query string

                    options_obj.data = undefined;

                    //add to url
                    if(/^.+?\?.+?$/i.test(path_str))
                    {
                        path_str += '&'+data_str_or_obj;
                    }
                    else
                    {
                        path_str += '?'+data_str_or_obj;
                    }
                }
            }

            return $.ajax(path_str, options_obj);
        }

        /**
         * Post data to a URL
         * @param {String} path_str the path to post to
         * @param {String|Object} data_str_or_obj the data to post
         * @param {Object} options_obj the post options
         * @return {*}
         */
        wizmo_obj.post = function(path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                data_str_or_obj = myArgs[1],
                options_obj = myArgs[2]
                ;

            return _post(path_str, data_str_or_obj, options_obj);
        };

        /**
         * Watches a DOM object for changes
         * Leverages mutation observers
         * @param model_obj {Object} the object [model] to watch
         * @param callback_fn {Function|String} callback function to execute when a change is detected. You can also define as 'off' to disconnect the observer
         * The callback function is passed the mutation object
         * @param observer_config_obj {Object} the Mutation observer options
         * @private
         */
        function _watch(model_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                callback_fn = (myArgs[1]) ? myArgs[1] : function(){},
                model_elem_obj = (_w.count(model_obj) > 0) ? model_obj[0] : model_obj,
                observer_config_obj = (myArgs[2]) ? myArgs[2] : {attributes: true, childList: true, characterData: true, subtree: true, attributeOldValue: true, characterDataOldValue: true},
                observer_obj
                ;

            //define callback
            var callback_container_fn = function(mutations_arr){
                mutations_arr.forEach(function(mutation) {
                    callback_fn(mutation);
                });
            };

            //define observer and config
            observer_obj = new MutationObserver(callback_container_fn);

            //disconnect
            if(callback_fn === 'off')
            {
                observer_obj.disconnect();
                return;
            }

            observer_obj.observe(model_elem_obj, observer_config_obj);
        }

        /**
         * Watches a DOM object for changes
         * Wrapper for _watch
         * @param {Object} model_obj the DOM object to watch
         * @param {Function} callback_fn the function to execute when a change occurs
         * @param {Object} observer_config_obj the Mutation observer options
         * @returns {wizmo}
         */
        wizmo_obj.watch = function(model_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                callback_fn = myArgs[1],
                observer_config_obj = myArgs[2]
                ;

            _watch(model_obj, callback_fn, observer_config_obj);
            return this;
        };

        /**
         * Defines the data required to configure firebase
         * @param {Object} config_obj the main firebase configuration object
         * It must contain the following properties
         *  - script: the path to the firebase script e.g. https://www.gstatic.com/firebasejs/4.8.1/firebase.js
         *  - script2: the path to the firebase script e.g. https://www.gstatic.com/firebasejs/4.8.1/firebase-firestore.js
         *  - apikey: the firebase Web API key
         *  - domain: the auth domain e.g. <projectId>.firebaseapp.com
         *  - url: the database URL e.g. https://<databaseName>.firebaseio.com
         *  - bucket: the storage bucket e.g. <bucket>.appspot.com
         *  - project: the Project ID
         *  - sender: the Messaging Sender ID
         *  @return {Boolean}
         */
        function _configFirebase(config_obj)
        {
            var config_test_arr = ['script', 'script2', 'apikey', 'domain', 'url', 'bucket', 'project', 'sender'],
                config_test_error_bool = false;

            if(_w.isObject(config_obj) && _w.isObjectEmpty(config_obj))
            {
                config_test_error_bool = true;
                _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: The provided object for firebase config must be an object, and it must not be empty.', true);
            }

            for (var key_str in config_obj) {
                if (config_obj.hasOwnProperty(key_str)) {
                    if(!_w.in_array(key_str, config_test_arr))
                    {
                        config_test_error_bool = true;
                        _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: A given object property (\''+key_str+'\') is not a valid property for the firebase config object.', true);
                    }
                }
            }

            if(config_test_error_bool)
            {
                return false;
            }

            //save firebase config
            wizmo.store('var_firebase_config', config_obj);

            return true;
        }

        /**
         * Loads the firebase script in the <HEAD>
         * @param {Object} options_obj the options
         *  script: the firebase script URL. Default is https://www.gstatic.com/firebasejs/4.8.1/firebase.js
         *  Note: This is optional. You can define this using wizmo.firebase.config method
         *  config: the firebase configuration object. It must contain the following:
         *    - apikey: the firebase API key
         *    - domain: the firebase Auth domain
         *    - url: the firebase database URL
         *    - bucket: the firebase storage bucket
         *    - project: the project ID
         *    - sender: the messaging sender ID
         *  Note: This is optional. You can define this using wizmo.firebase.config. If this is provided, the firebase realtime DB will be initialized i.e. via firebase.initializeApp
         *  callback: a function that will be run when firebase has been loaded
         *  callback_signin: a function that will be run when a firebase user is auth'd
         *  callback_signout: a function that will be run when a firebase user is unauth'd
         * @private
         */
        function _loadFirebase()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[0]) ? myArgs[0] : {},
                firebase_script_url_str,
                firebase_script2_url_str,
                firebase_config_ss_obj = wizmo.store('var_firebase_config') || {},
                baas_config_obj,
                firebase_baas_config_obj = {},
                firebase_auth_observer_fn,
                callback_fn,
                callback_signin_fn,
                callback_signout_fn,
                elem_body_obj = $('body')
            ;

            return new Promise(function(resolve)
            {
                //get the firebase script path
                firebase_script_url_str = (options_obj.script && _w.isString(options_obj.script) && options_obj.script.length > 0) ? options_obj.script : undefined;
                firebase_script_url_str = (!firebase_script_url_str && (firebase_config_ss_obj.script && _w.isString(firebase_config_ss_obj.script) && firebase_config_ss_obj.script.length > 0)) ? firebase_config_ss_obj.script : 'https://www.gstatic.com/firebasejs/4.8.1/firebase.js';

                //get the firebase script2 path
                firebase_script2_url_str = (options_obj.script2 && _w.isString(options_obj.script2) && options_obj.script2.length > 0) ? options_obj.script2 : undefined;
                firebase_script2_url_str = (!firebase_script2_url_str && (firebase_config_ss_obj.script2 && _w.isString(firebase_config_ss_obj.script2) && firebase_config_ss_obj.script2.length > 0)) ? firebase_config_ss_obj.script2 : undefined;

                //save callback
                callback_fn = (options_obj.callback && _w.isFunction(options_obj.callback)) ? options_obj.callback : function(){};
                callback_signin_fn = (options_obj.callback_signin && _w.isFunction(options_obj.callback_signin)) ? options_obj.callback_signin : function(){};
                callback_signout_fn = (options_obj.callback_signout && _w.isFunction(options_obj.callback_signout)) ? options_obj.callback_signout : function(){};

                //add to function queue
                wizmo.addFunction('firebase_load_callback_fn', callback_fn, {queue: true, namespace: 'firebase_load_callback_fn'});
                wizmo.addFunction('firebase_load_callback_signin_fn', callback_signin_fn, {queue: true, namespace: 'firebase_load_callback_signin_fn'});
                wizmo.addFunction('firebase_load_callback_signout_fn', callback_signout_fn, {queue: true, namespace: 'firebase_load_callback_signout_fn'});

                //get and setup firebase config
                baas_config_obj = options_obj.config || firebase_config_ss_obj;
                if(_w.isObject(baas_config_obj))
                {
                    firebase_baas_config_obj.apiKey = baas_config_obj.apikey;
                    firebase_baas_config_obj.authDomain = baas_config_obj.domain;
                    firebase_baas_config_obj.databaseURL = baas_config_obj.url;
                    firebase_baas_config_obj.storageBucket = baas_config_obj.bucket;
                    firebase_baas_config_obj.projectId = baas_config_obj.project;
                    firebase_baas_config_obj.messagingSenderId = baas_config_obj.sender;
                }
                else
                {
                    _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: You must configure Firebase before you load it. See wizmo.firebase.config method or use config property.', true);
                    return;
                }

                //load firebase if script load not yet attempted
                if(!wizmo.domStore('var_flag_firebase_script_init'))
                {
                    //flag mark that load process is started
                    wizmo.domStore('var_flag_firebase_script_init', true);

                    //create main initialization function [to run later]
                    wizmo.addFunction('fn_firebase_load_inline_script_init', function(){
                        //initialize Firebase App
                        if(firebase_baas_config_obj.apiKey)
                        {
                            if(!wizmo.domStore('var_flag_firebase_app_init'))
                            {
                                firebase.initializeApp(firebase_baas_config_obj);

                                //mark init
                                wizmo.domStore('var_flag_firebase_app_init', true);
                            }
                        }

                        //setup observer
                        if(!wizmo.domStore('var_flag_firebase_observe_init'))
                        {
                            //setup observer/callback for changes in auth state
                            firebase_auth_observer_fn = firebase.auth().onAuthStateChanged(function(user)
                            {
                                //run auth callback
                                wizmo.runFunction('firebase_load_callback_auth_fn', {queue: true, namespace: 'firebase_load_callback_auth_fn'});

                                if(user)
                                {
                                    //add class to body
                                    elem_body_obj.addClass('w_firebase_auth').addClass('w_firebase_auth_signin');

                                    //run signin callback
                                    wizmo.runFunction('firebase_load_callback_signin_fn', {queue: true, namespace: 'firebase_load_callback_signin_fn', args: user});

                                    //reset flag
                                    wizmo.domStore('var_flag_firebase_auth_disable_redirect', false);
                                }
                                else
                                {
                                    //add class to body
                                    elem_body_obj.removeClass('w_firebase_auth').removeClass('w_firebase_auth_signin');

                                    //run signout callback
                                    wizmo.runFunction('firebase_load_callback_signout_fn', {queue: true, namespace: 'firebase_load_callback_signout_fn'});

                                    //reset flag
                                    wizmo.domStore('var_flag_firebase_auth_disable_redirect', false);

                                    //unsubscribe observer if defined
                                    if(wizmo.domStore('var_flag_firebase_auth_observer_unsub'))
                                    {
                                        firebase_auth_observer_fn();

                                        //reset flag
                                        wizmo.domStore('var_flag_firebase_auth_observer_unsub', false);
                                    }
                                }
                            });

                            //flag init
                            wizmo.domStore('var_flag_firebase_observe_init', true);
                        }
                    });

                    //Run Firebase
                    if(firebase_script2_url_str)
                    {
                        //Load Firebase and Firebase Cloud Store
                        wizmo.loadScript([''+firebase_script_url_str+''], function(){
                            wizmo.loadScript([''+firebase_script2_url_str+''], function(){
                                //flag
                                wizmo.domStore('var_flag_firebase_script_loaded', true);

                                //add firebase class to body
                                elem_body_obj.addClass('w_firebase_loaded').addClass('w_firebase_rdb_loaded').addClass('w_firebase_cfs_loaded');

                                //run callback
                                wizmo.runFunction('fn_firebase_load_inline_script_init');
                                wizmo.runFunction('firebase_load_callback_fn', {queue: true, namespace: 'firebase_load_callback_fn', flush: true});

                                resolve(true);
                            });
                        });
                    }
                    else
                    {
                        //Load Firebase
                        _load(firebase_script_url_str, {
                            xhr: true, unique: true,
                            callback: function () {
                                //flag
                                wizmo.domStore('var_flag_firebase_script_loaded', true);

                                //add firebase class to body
                                elem_body_obj.addClass('w_firebase_loaded').addClass('w_firebase_rdb_loaded');

                                //run callback(s)
                                wizmo.runFunction('fn_firebase_load_inline_script_init');
                                wizmo.runFunction('firebase_load_callback_fn', {queue: true, namespace: 'firebase_load_callback_fn', flush: true});

                                resolve(true);
                            }
                        });
                    }
                }
                else
                {
                    //initialize Firebase App if Firebase script is already loaded

                    if(firebase_baas_config_obj.apiKey)
                    {
                        if(!wizmo.domStore('var_flag_firebase_app_init'))
                        {
                            firebase.initializeApp(firebase_baas_config_obj);

                            //mark init
                            wizmo.domStore('var_flag_firebase_app_init', true);
                        }
                    }

                    //run callback
                    wizmo.runFunction('firebase_load_callback_fn', {queue: true, namespace: 'firebase_load_callback_fn', flush: true});

                    resolve(true);
                }
            });
        }

        /**
         * Checks if the Firebase script is loaded
         * @return {Boolean}
         * @private
         */
        function _isFirebaseLoaded()
        {
            var is_loaded_bool = wizmo.domStore('var_flag_firebase_script_loaded');
            return !!(is_loaded_bool);
        }

        /**
         * Firebase class
         */
        wizmo_obj.firebase = {
            /**
             * Defines the data required to configure firebase
             * @param {Object} config_obj the main firebase configuration object
             * see _configFirebase
             *  @return {Boolean}
             */
            config: function(config_obj){
                _configFirebase(config_obj);
            },
            /**
             * Loads Firebase
             * See _loadFirebase
             * @return {Promise}
             */
            load: function(){
                var myArgs = Array.prototype.slice.call(arguments);
                return _loadFirebase(myArgs[0]);
            },
            /**
             * Checks if Firebase is loaded
             * See _isFirebaseLoaded
             * @return {Boolean}
             */
            isLoaded: function(){
                return _isFirebaseLoaded();
            },
            /**
             * Set up a callback function to run on firebase connect
             * @param {Function} callback_fn a callback to run when you connect to firebase
             */
            onConnect: function(callback_fn){
                wizmo.addFunction('firebase_load_callback_fn', callback_fn, {queue: true, namespace: 'firebase_load_callback_fn'});
            }
        };

        /**
         * Creates a data-bind relationship
         *
         * @param model_str_or_obj {Object|String} the object [model] that is the source
         * of the data to be added to the DOM
         *
         * @param view_str_or_obj {Object} the object [view] that is the target of
         * data to be added to the DOM. The view is usually what is visible to the user
         *
         * @param options_obj {Object} specific bind options
         *
         * mode {String}: defines a mode of data-binding. This is for multi-way data-binding e.g. 3-way, 4-way, etc. The following values are available:
         * 'baas' is for data-binding to a backend-as-a-service. Firebase is the only BaaS currently supported
         * 'xhr' is for data-binding via AJAX
         * 'func' is for data-binding to a namespaced function
         *
         * sync {Boolean}: defines how the model will handle value mutation after page refreshes and remote model updates (in the case of 3-way binding). For 2-way data-binding, if sync is true, the last mutated value of the model will be stored and applied when the page is manually refreshed. If false, the default value will be applied. For 3-way data-binding, if sync is true, the last mutated value of the model will be stored and applied when the page is manually refreshed. In addition, the local model will be synced with the remote model, so if the remote model is updated, the local model will be updated, and vice versa.
         * Default value is true.
         *
         * sync_in {Boolean}: defines whether the remote value is synced with the local value when a bind relationship/connection is first established. If true, the remote model will override the local model on first connect.
         * Default value is true.
         * Note: This option is only valid when sync is true
         *
         * baas_config {Object}: contains the configuration data for the firebase backend-as-a-service
         *
         *  - script: defines the url to the firebase script e.g. https://www.gstatic.com/firebasejs/4.8.1/firebase.js
         *  - apikey: defines the firebase API key
         *  - domain: defines the firebase auth domain
         *  - url: defines the firebase database url
         *  - bucket: defines the firebase storage bucket
         *  - project: defines the firebase project ID
         *  - sender: defines the firebase messenger sender ID
         *
         * baas_ref {String}: defines the specific location in your firebase database where data is stored. Defined as a path e.g. 'root/child'
         *
         * force_value_to_string {Boolean}: if true, all model values will be converted to a string before persisted to remote or local storage. Does not apply when 'mode' is 'xhr'. Default is false.
         *
         * callback_mutation {Function}: defines a callback that will be fired and receive the data from
         *
         * input_event {String}: The name of the event trigger
         * Can be 'keyup' or 'keydown' [default]
         * Note: this is applicable only if the model is an input element e.g. textbox, textarea.
         *
         * input_throttle {Number}: The number of milliseconds to wait before the event is fired
         * Note: this is applicable only if the model is an input element e.g. textbox, textarea.
         *
         * @returns {wizmo}
         */
        function _bindAdd(model_str_or_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                view_str_or_obj = myArgs[1],
                options_obj = (myArgs[2]) ? myArgs[2] : {},
                model_ref_str,
                model_obj,
                view_ref_str,
                view_obj = view_str_or_obj,
                firebase_config_ss_obj = wizmo.store('var_firebase_config')
                ;

            //set option defaults
            options_obj.sync = (_w.isBool(options_obj.sync)) ? options_obj.sync : true;
            options_obj.sync_in = (_w.isBool(options_obj.sync_in)) ? options_obj.sync_in : true;

            //if baas_config option not set, use config info from firebase
            if(!options_obj.baas_config || !_w.isObject(options_obj.baas_config))
            {
                //add baas_config
                if(_w.isObject(firebase_config_ss_obj))
                {
                    options_obj.baas_config = firebase_config_ss_obj;
                }
            }

            //manage model reference
            if(_w.isString(model_str_or_obj) && model_str_or_obj.length > 0)
            {
                model_ref_str = (/^ *\#[^\s]+?$/i.test(model_str_or_obj)) ? model_str_or_obj : undefined;
            }
            model_obj = (model_ref_str) ? $(model_ref_str) : model_str_or_obj;

            //manage view reference
            if(_w.isString(view_str_or_obj) && view_str_or_obj.length > 0)
            {
                view_ref_str = (/^ *\#[^\s]+?$/i.test(view_str_or_obj)) ? view_str_or_obj : undefined;
            }
            view_obj = (view_ref_str) ? $(view_ref_str) : view_str_or_obj;

            //define nodes
            var model_obj_tag_name_str = model_obj.nodeName || model_obj.tagName,
                model_obj_is_input_bool = ((_w.in_array(model_obj_tag_name_str, ['input', 'textarea']))),
                model_obj_is_data_bool = !!(options_obj.model_is_data),
                view_obj_value_str = (_w.isObject(view_obj) && !model_obj_is_data_bool) ? view_obj.html() : '',
                view_obj_is_template_bool = ((/\{\{.*?}}/i.test(view_obj_value_str))),
                model_obj_view_tag_str = (_w.isObject(model_obj) && model_obj.length > 0) ? model_obj.attr('w-model') || model_obj.attr('data-w-model') : undefined,
                view_obj_value_new_str,
                baas_database_obj,
                baas_database_ref_obj,
                bind_meta_data_item_obj = {},
                data_key_str,
                data_key_root_str
                ;

            if(model_obj_is_data_bool)
            {
                data_key_str = model_obj;
                data_key_root_str = data_key_str.replace(/^ *data_sync_fb_/, "");
            }

            //define baas sync enable callback
            var callback_baas_sync_enable_fn = function(baas_database_ref_obj, baas_database_sync_callback_fn){
                var myFnArgs = Array.prototype.slice.call(arguments),
                    sync_metadata_obj = myFnArgs[2],
                    return_value_str
                    ;

                return new Promise(function(resolve)
                {
                    //setup firebase data event handler

                    baas_database_ref_obj.once('value').then(function(snapshot)
                    {
                        return_value_str = baas_database_sync_callback_fn(snapshot, sync_metadata_obj);
                        resolve(return_value_str);
                    });
                });
            };

            //define baas sync operation callback
            var callback_baas_sync_op_fn = function(sync_snaphot, sync_metadata_obj){
                var template_ctx = {},
                    model_sync_obj = sync_metadata_obj['model'],
                    view_sync_obj = sync_metadata_obj['view'],
                    view_obj_value_str = sync_metadata_obj['view_value'],
                    model_obj_view_tag_str = sync_metadata_obj['model_view_tag'],
                    view_obj_is_template_bool = sync_metadata_obj['view_is_template'],
                    model_obj_is_input_bool = sync_metadata_obj['model_is_input'],
                    model_obj_is_data_bool = sync_metadata_obj['model_is_data'],
                    model_obj_value_str = (model_obj_is_data_bool) ? sync_metadata_obj['data_value'] : sync_metadata_obj['model_value'],
                    model_is_sync_in_bool = sync_metadata_obj['model_sync_in'],
                    set_data_options_obj = {},
                    data_key_root_str,
                    data_view_id_str,
                    data_view_tag_str,
                    data_view_attr_str,
                    data_baas_ref_path_str
                    ;

                //get snapshot
                var sync_snapshot_val_str = sync_snaphot.val();

                //update snapshot value based on sync_in option
                if(!model_is_sync_in_bool)
                {
                    //use local model value
                    sync_snapshot_val_str = (!_w.isNullOrUndefined(model_obj_value_str)) ? model_obj_value_str : sync_snapshot_val_str ;
                }
                else
                {
                    //use local model value if remote value is null or undefined
                    //and local model value is not
                    sync_snapshot_val_str = (_w.isNullOrUndefined(sync_snapshot_val_str) && !_w.isNullOrUndefined(model_obj_value_str)) ? model_obj_value_str : sync_snapshot_val_str ;
                }

                //update model
                if(model_obj_is_input_bool)
                {
                    model_sync_obj.val(sync_snapshot_val_str);
                }
                else if(model_obj_is_data_bool)
                {
                    data_key_root_str = sync_metadata_obj['data_key_root'];
                    data_view_id_str = sync_metadata_obj['data_view_id'];
                    data_view_tag_str = sync_metadata_obj['data_view_tag'];
                    data_view_attr_str = sync_metadata_obj['data_view_attr'];
                    data_baas_ref_path_str = sync_metadata_obj['data_baas_ref_path'];

                    //define _setData options
                    set_data_options_obj.baas_ref_path = data_baas_ref_path_str;
                    set_data_options_obj.v_id = data_view_id_str;
                    set_data_options_obj.v_tag = data_view_tag_str;
                    set_data_options_obj.v_attr = data_view_attr_str;
                    set_data_options_obj.disable_trigger_bind_rinit = true;

                    _setData(data_key_root_str, sync_snapshot_val_str, set_data_options_obj);
                }
                else
                {
                    model_sync_obj.html(sync_snapshot_val_str);
                }

                //update view if available and valid
                if(_w.isObject(view_sync_obj) && !model_obj_is_data_bool)
                {
                    //create template context
                    template_ctx[model_obj_view_tag_str] = sync_snapshot_val_str;
                    view_obj_value_new_str = (view_obj_is_template_bool) ? _compile(view_obj_value_str, template_ctx) : sync_snapshot_val_str;

                    view_sync_obj.html(view_obj_value_new_str);
                }

                return sync_snapshot_val_str;
            };

            //define model synchronization method
            var model_sync_fn = function(model_obj, model_bind_mode_str){

                var myArgs = Array.prototype.slice.call(arguments),
                    model_sync_options_obj = myArgs[2],
                    is_sync_bool,
                    mutation_item_obj,
                    data_key_root_str,
                    model_obj_value_str,
                    model_id_str,
                    model_value_last_res,
                    model_value_last_flag_bool;

                //get options
                is_sync_bool = model_sync_options_obj.sync;
                mutation_item_obj = model_sync_options_obj.mutation;
                data_key_root_str = model_sync_options_obj.data_key_root;

                //get the id of the model
                model_id_str = (_w.isObject(model_obj)) ? model_obj.attr('id') : model_obj;

                /**
                 * This block is meant to prevent flash of non-initialized data for multi-way bind operations where the last stored value is different from the value of the input element. When this is the case, you want the last stored value to be initialized, not the value in the "value" attribute.
                 * This will check whether there is a previously stored value and then use that. It does this only once when the page is loaded.
                 */
                model_value_last_res = wizmo.store('var_bind_model_value_last::'+model_id_str) || wizmo.store('var_bind_model_value_last::'+model_id_str, undefined, 'ls');
                model_value_last_flag_bool = wizmo.store('var_bind_model_value_last_flag::'+model_id_str) || wizmo.store('var_bind_model_value_last_flag::'+model_id_str, undefined, 'ls');

                if(is_sync_bool && !wizmo.domStore('var_bind_model_sync_init_'+model_id_str) && model_value_last_res && model_value_last_flag_bool)
                {
                    model_obj_value_str = model_value_last_res;

                    if(model_bind_mode_str === 'input')
                    {
                        model_obj.val(model_obj_value_str);
                    }
                    else if(model_bind_mode_str === 'mutate')
                    {
                        model_obj.html(model_obj_value_str);
                    }
                }
                else
                {
                    if(model_bind_mode_str === 'mutate')
                    {
                        if(mutation_item_obj)
                        {
                            //get model data from mutation record
                            if(mutation_item_obj.addedNodes.length > 0)
                            {
                                model_obj_value_str = mutation_item_obj.addedNodes[0].data;
                            }
                            else
                            {
                                model_obj_value_str = mutation_item_obj.target.data || mutation_item_obj.target.nodeValue;
                            }
                        }
                        else
                        {
                            //get model value from DOM
                            model_obj_value_str = model_obj.html();
                        }
                    }
                    else if(model_bind_mode_str === 'input')
                    {
                        model_obj_value_str = model_obj.val();
                    }
                    else if(model_bind_mode_str === 'data')
                    {
                        model_obj_value_str = _getData(data_key_root_str);
                    }
                }

                //store model value to storage
                //do not store if bind mode is 'data'
                if(is_sync_bool && model_bind_mode_str !== 'data')
                {
                    //store model value [session + local]
                    wizmo.store('var_bind_model_value_last::'+model_id_str, model_obj_value_str);
                    wizmo.store('var_bind_model_value_last::'+model_id_str, model_obj_value_str, 'ls');

                    //mark that model value is stored [session + local]
                    wizmo.store('var_bind_model_value_last_flag::'+model_id_str, true);
                    wizmo.store('var_bind_model_value_last_flag::'+model_id_str, true, 'ls');
                }

                //mark that model sync is initialized
                if(!wizmo.domStore('var_bind_model_sync_init_'+model_id_str))
                {
                    wizmo.domStore('var_bind_model_sync_init_'+model_id_str, true);
                }

                return model_obj_value_str;
            };

            //sanitizes the model value
            var model_value_clean_fn = function(model_value){

                var model_value_clean,
                    model_value_str;

                //cast to string
                model_value_str = ''+model_value+'';

                //trim
                model_value_str = model_value_str.trim();

                //remove opening and closing quotes
                if(/^["'].+?["']$/i.test(model_value_str))
                {
                    model_value_str = model_value_str.slice(1, -1);
                }

                //recast if required
                if(/^ *[0-9]+ *$/i.test(model_value_str))
                {
                    model_value_clean = parseInt(model_value_str);
                }
                else if(/^ *[0-9]+\.[0-9]+ *$/i.test(model_value_str))
                {
                    model_value_clean = parseFloat(model_value_str);
                }
                else if(/^ *(true|false) *$/i.test(model_value_str))
                {
                    model_value_clean = ((/^ *true *$/i.test(model_value_str)));
                }
                else
                {
                    model_value_clean = model_value_str;
                }

                return model_value_clean;
            };

            //define callback for input
            var callback_2way_input_fn = function()
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    model_obj = myArgs[0],
                    view_obj = myArgs[1],
                    options_obj = myArgs[2],
                    is_config_sync_bool,
                    is_config_sync_in_bool,
                    method_str = options_obj.method,
                    model_obj_value_str,
                    view_obj_is_template_bool = (_w.isBool(options_obj.view_is_template)) ? options_obj.view_is_template : false,
                    model_value_force_string_bool = ((_w.isBool(options_obj.force_value_to_string))),
                    model_obj_view_tag_str = options_obj.model_view_tag,
                    template_ctx = {},
                    metadata_obj = {},
                    model_sync_options_obj = {}
                    ;

                is_config_sync_bool = !!(options_obj.sync);
                is_config_sync_in_bool = !!(options_obj.sync_in);

                //get synced model value
                model_sync_options_obj.sync = is_config_sync_bool;
                model_obj_value_str = model_sync_fn(model_obj, 'input', model_sync_options_obj);

                //create template context
                template_ctx[model_obj_view_tag_str] = model_obj_value_str;
                view_obj_value_new_str = (view_obj_is_template_bool) ? _compile(view_obj_value_str, template_ctx) : model_obj_value_str;

                //add value to view
                view_obj.html(view_obj_value_new_str);

                //create metadata object
                metadata_obj['method'] = method_str;
                metadata_obj['model'] = model_obj;
                metadata_obj['model_id'] = model_obj.attr('id');
                metadata_obj['model_value'] = (model_value_force_string_bool) ? model_obj_value_str : model_value_clean_fn(model_obj_value_str);
                metadata_obj['model_view_tag'] = model_obj_view_tag_str;
                metadata_obj['model_is_input'] = model_obj_is_input_bool;
                metadata_obj['model_sync'] = is_config_sync_bool;
                metadata_obj['model_sync_in'] = is_config_sync_in_bool;
                metadata_obj['view'] = view_obj;
                metadata_obj['view_value'] = view_obj_value_str;
                metadata_obj['view_is_template'] = view_obj_is_template_bool;

                //co-opt 3-way and 4-way data-binding if active

                //3-way (BaaS)
                if(method_str === '3way_baas')
                {
                    if(wizmo.domStore('var_flag_firebase_script_init'))
                    {
                        callback_3way_baas_fn(metadata_obj, options_obj);
                    }
                }

                //3-way (non-BaaS)
                if(method_str === '3way')
                {
                    if(wizmo.domStore('var_bind_method_3way_init'))
                    {
                        callback_3way_fn(metadata_obj, options_obj);
                    }
                }

                //4-way
                if(method_str === '4way')
                {
                    if(wizmo.domStore('var_bind_method_4way_init'))
                    {
                        callback_4way_fn(metadata_obj, options_obj);
                    }
                }
            };

            //define callback for mutation observer
            var callback_2way_fn = function(mutations_arr)
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    model_obj = myArgs[1],
                    view_obj = myArgs[2],
                    options_obj = myArgs[3],
                    is_config_sync_bool,
                    is_config_sync_in_bool,
                    method_str = options_obj.method,
                    model_obj_value_str,
                    model_obj_is_data_bool = !!(_w.isString(model_obj) && model_obj.length > 0),
                    view_obj_is_template_bool = (_w.isBool(options_obj.view_is_template)) ? options_obj.view_is_template : false,
                    model_obj_view_tag_str = options_obj.model_view_tag,
                    model_value_force_string_bool = ((_w.isBool(options_obj.force_value_to_string))),
                    template_ctx = {},
                    metadata_obj = {},
                    data_key_str,
                    data_key_root_str,
                    data_value_mx = view_obj,
                    data_view_id_str = options_obj.model_is_data_view_id,
                    data_view_tag_str = options_obj.model_is_data_view_tag,
                    data_view_attr_str = options_obj.model_is_data_view_attr,
                    data_baas_ref_path_str = options_obj.model_is_data_baas_ref_path,
                    model_sync_options_obj = {}
                    ;

                is_config_sync_bool = !!(options_obj.sync);
                is_config_sync_in_bool = !!(options_obj.sync_in);

                if(model_obj_is_data_bool)
                {
                    //set key and value inside callback
                    data_key_str = model_obj;
                    data_value_mx = view_obj;

                    data_key_root_str = data_key_str.replace(/^ *data_sync_fb_/, "");

                    //get synced data value
                    model_sync_options_obj.sync = is_config_sync_bool;
                    model_sync_options_obj.data_key_root = data_key_root_str;
                    model_obj_value_str = model_sync_fn(model_obj, 'data', model_sync_options_obj);
                }
                else
                {
                    if(mutations_arr)
                    {
                        //update view on mutation

                        mutations_arr.forEach(function(mutation){

                            //get synced model value
                            model_sync_options_obj.sync = is_config_sync_bool;
                            model_sync_options_obj.mutation = mutation;
                            model_obj_value_str = model_sync_fn(model_obj, 'mutate', model_sync_options_obj);

                            //use template if necessary
                            template_ctx[model_obj_view_tag_str] = model_obj_value_str;
                            view_obj_value_new_str = (view_obj_is_template_bool) ? _compile(view_obj_value_str, template_ctx) : model_obj_value_str;

                            //add value to view
                            view_obj.html(view_obj_value_new_str);
                        });
                    }
                    else
                    {
                        //update view

                        //get synced model value
                        model_sync_options_obj.sync = is_config_sync_bool;
                        model_obj_value_str = model_sync_fn(model_obj, 'mutate', model_sync_options_obj);

                        if(!model_obj_value_str || /^\s*$/i.test(model_obj_value_str))
                        {
                            model_obj_value_str = '';
                        }

                        //use template if necessary
                        template_ctx[model_obj_view_tag_str] = model_obj_value_str;
                        view_obj_value_new_str = (view_obj_is_template_bool) ? _compile(view_obj_value_str, template_ctx) : model_obj_value_str;

                        //add value to view
                        if(!(_w.isEmptyString(view_obj_value_new_str) && !_w.isEmptyString(view_obj_value_str)))
                        {
                            view_obj.html(view_obj_value_new_str);
                        }
                    }
                }

                //create metadata object
                metadata_obj['method'] = method_str;
                metadata_obj['model'] = model_obj;
                metadata_obj['model_id'] = (model_obj_is_data_bool) ? Math.abs(_w.hashCode(model_obj)) : model_obj.attr('id');
                metadata_obj['model_value'] = (model_value_force_string_bool) ? model_obj_value_str : model_value_clean_fn(model_obj_value_str);
                metadata_obj['model_view_tag'] = model_obj_view_tag_str;
                metadata_obj['model_is_input'] = model_obj_is_input_bool;
                metadata_obj['model_is_data'] = model_obj_is_data_bool;
                metadata_obj['model_sync'] = is_config_sync_bool;
                metadata_obj['model_sync_in'] = is_config_sync_in_bool;
                metadata_obj['view'] = view_obj;
                metadata_obj['view_value'] = view_obj_value_str;
                metadata_obj['view_is_template'] = view_obj_is_template_bool;
                metadata_obj['data_key'] = data_key_str;
                metadata_obj['data_key_root'] = data_key_root_str;
                metadata_obj['data_value'] = data_value_mx;
                metadata_obj['data_view_id'] = data_view_id_str;
                metadata_obj['data_view_tag'] = data_view_tag_str;
                metadata_obj['data_view_attr'] = data_view_attr_str;
                metadata_obj['data_baas_ref_path'] = data_baas_ref_path_str;

                //co-opt 3-way and 4-way data-binding if active

                //3-way (BaaS)
                if(method_str === '3way_baas')
                {
                    if(wizmo.domStore('var_flag_firebase_script_init'))
                    {
                        callback_3way_baas_fn(metadata_obj, options_obj);
                    }
                }

                //3-way (non-BaaS)
                if(method_str === '3way')
                {
                    if(wizmo.domStore('var_bind_method_3way_init'))
                    {
                        callback_3way_fn(metadata_obj, options_obj);
                    }
                }

                //4-way
                if(method_str === '4way')
                {
                    if(wizmo.domStore('var_bind_method_4way_init'))
                    {
                        callback_4way_fn(metadata_obj, options_obj);
                    }
                }
            };

            //define callback for 3-way binding (non-BaaS)
            var callback_3way_fn = function(metadata_obj, options_obj)
            {
                var mode_str = options_obj.mode,
                    baas_ref_str = options_obj.baas_ref,
                    model_obj = metadata_obj['model'],
                    model_is_input_bool = metadata_obj['model_is_input'],
                    model_id_str = metadata_obj['model_id'],
                    model_value_str = metadata_obj['model_value'],
                    model_value_force_string_bool = ((_w.isBool(options_obj.force_value_to_string))),
                    is_config_sync_bool = !!(options_obj.sync)
                    ;

                if (mode_str === 'xhr') {
                    //xhr mode

                    var is_firebase_bool,
                        xhr_url_str = options_obj.xhr_url,
                        xhr_callback_fn = (options_obj.xhr_callback) ? options_obj.xhr_callback : false,
                        xhr_callback_error_fn = (options_obj.xhr_callback_error) ? options_obj.xhr_callback_error : false,
                        xhr_valid_headers_str = (options_obj.xhr_valid_headers) ? options_obj.xhr_valid_headers : '200,201,202,203,204,301,304';

                    //add query string prefix
                    xhr_url_str += (/.+?\?.+?\=/i.test(xhr_url_str)) ? '&' : '?';

                    //add value and baas path
                    xhr_url_str += 'w_bind_value=' + model_value_str;
                    xhr_url_str += '&r_baas_ref=' + baas_ref_str;

                    //check if the xhr is for firebase
                    is_firebase_bool = ((/\=firebase/i.test(xhr_url_str)) || options_obj.xhr_firebase);

                    //mark url to signify that sync is in effect
                    if(is_firebase_bool && is_config_sync_bool)
                    {
                        xhr_url_str += '&r_sync=true';
                    }

                    //mark url the first time this XHR is run
                    if(!wizmo.domStore('var_bind_xhr_init_'+model_id_str))
                    {
                        xhr_url_str += '&r_first_run=true';

                        wizmo.domStore('var_bind_xhr_init_'+model_id_str, true);
                    }

                    //Run XHR
                    $.ajax(xhr_url_str, {
                        response: false,
                        response_valid_headers: xhr_valid_headers_str,
                        method: 'POST'
                    }).then(function (xhr) {
                        //resolve: execute callback if defined

                        //get and clean response
                        var xhr_response_str = xhr.response;
                        xhr_response_str = model_value_clean_fn(xhr_response_str);

                        //mark the first time XHR response is received
                        if(xhr_response_str && !wizmo.domStore('var_bind_xhr_init_response_'+model_id_str))
                        {
                            //update model
                            if(model_is_input_bool)
                            {
                                model_obj.val(xhr_response_str);
                            }
                            else
                            {
                                model_obj.html(xhr_response_str);
                            }

                            wizmo.domStore('var_bind_xhr_init_response_'+model_id_str, true);
                        }

                        //run callback
                        if (xhr_callback_fn) {
                            xhr_callback_fn(xhr);
                        }

                    }, function (xhr) {
                        //reject: execute callback if defined
                        if (xhr_callback_error_fn) {
                            xhr_callback_error_fn(xhr);
                        }
                    });
                }
                else if (mode_str === 'func') {
                    //function mode

                    var func_name_str = options_obj.func_name,
                        func_args = options_obj.func_args,
                        func_args_obj,
                        func_namespace_str = options_obj.func_namespace,
                        model_value_clean
                        ;

                    model_value_clean = (model_value_force_string_bool) ? model_value_str : model_value_clean_fn(model_value_str);

                    //create function argument object
                    func_args_obj = {
                        model_value: model_value_clean,
                        fn_args: func_args
                    };

                    //run object
                    if(func_namespace_str)
                    {
                        wizmo.runFunction(func_name_str, {args: func_args_obj, namespace: func_namespace_str});
                    }
                    else
                    {
                        wizmo.runFunction(func_name_str, {args: func_args_obj});
                    }
                }
            };

            //define callback for 3-way binding (BaaS)
            var callback_3way_baas_fn = function(metadata_obj, options_obj)
            {
                var model_id_str = metadata_obj['model_id'],
                    baas_data_value_str,
                    baas_config_firebase_main_obj,
                    baas_config_firebase_live_obj,
                    baas_sync_bool,
                    baas_script_str,
                    baas_apikey_str,
                    baas_domain_str,
                    baas_url_str,
                    baas_bucket_str,
                    baas_project_str,
                    baas_sender_str,
                    baas_ref_str,
                    baas_callback_fn
                    ;

                //define data to be saved
                baas_data_value_str = (metadata_obj['model_is_data']) ? metadata_obj['data_value'] : metadata_obj['model_value'];

                //get firebase config data
                baas_config_firebase_main_obj = options_obj.baas_config;

                baas_sync_bool = !!(options_obj.sync);
                baas_script_str = (_w.isString(baas_config_firebase_main_obj.script)) ? baas_config_firebase_main_obj.script : options_obj.baas_script;
                baas_apikey_str = (_w.isString(baas_config_firebase_main_obj.apikey)) ? baas_config_firebase_main_obj.apikey : options_obj.baas_apikey;
                baas_domain_str = (_w.isString(baas_config_firebase_main_obj.domain)) ? baas_config_firebase_main_obj.domain : options_obj.baas_domain;
                baas_url_str = (_w.isString(baas_config_firebase_main_obj.url)) ? baas_config_firebase_main_obj.url : options_obj.baas_url;
                baas_bucket_str = (_w.isString(baas_config_firebase_main_obj.bucket)) ? baas_config_firebase_main_obj.bucket : options_obj.baas_bucket;
                baas_project_str = (_w.isString(baas_config_firebase_main_obj.project)) ? baas_config_firebase_main_obj.project : options_obj.baas_project;
                baas_sender_str = (_w.isString(baas_config_firebase_main_obj.sender)) ? baas_config_firebase_main_obj.sender : options_obj.baas_sender;
                baas_ref_str = (_w.isString(baas_config_firebase_main_obj.ref)) ? baas_config_firebase_main_obj.ref : options_obj.baas_ref;
                baas_callback_fn = options_obj.baas_callback;


                if (/firebase/i.test(baas_script_str))
                {
                    //check if already init
                    if(!wizmo.domStore('var_flag_firebase_app_init'))
                    {
                        //setup baas config
                        baas_config_firebase_live_obj = {
                            apiKey: baas_apikey_str,
                            authDomain: baas_domain_str,
                            databaseURL: baas_url_str,
                            storageBucket: baas_bucket_str,
                            projectId: baas_project_str,
                            messagingSenderId: baas_sender_str
                        };

                        firebase.initializeApp(baas_config_firebase_live_obj);

                        //mark init
                        wizmo.domStore('var_flag_firebase_app_init', true);
                    }

                    //replace $uid with actual uid reference if:
                    // firebase is loaded
                    // firebase user is signed in
                    if(wizmo.domStore('var_flag_firebase_app_init'))
                    {
                        baas_ref_str = (firebase.auth().currentUser && firebase.auth().currentUser.uid && _w.isString(firebase.auth().currentUser.uid) && /\$uid/i.test(baas_ref_str)) ? baas_ref_str.replace('$uid', firebase.auth().currentUser.uid) : baas_ref_str;
                    }

                    //setup firebase object and reference
                    baas_database_obj = firebase.database();
                    baas_database_ref_obj = baas_database_obj.ref(baas_ref_str);

                    if(!wizmo.domStore('var_bind_3way_firebase_trans_init_'+model_id_str))
                    {
                        //run once for each firebase session

                        //setup sync
                        if (baas_sync_bool) {
                            callback_baas_sync_enable_fn(baas_database_ref_obj, callback_baas_sync_op_fn, metadata_obj).then(function(result_data){

                                //save to firebase
                                baas_data_value_str = result_data;
                                baas_database_ref_obj.transaction(function(post) {

                                    //setup on handler to receive data
                                    if(!wizmo.domStore('var_bind_3way_firebase_on_handler_init_'+model_id_str))
                                    {
                                        baas_database_ref_obj.on('value', function(snapshot){
                                            callback_baas_sync_op_fn(snapshot, metadata_obj);
                                        });

                                        wizmo.domStore('var_bind_3way_firebase_on_handler_init_'+model_id_str, true);
                                    }

                                    //return value to update
                                    return baas_data_value_str;
                                }, baas_callback_fn);
                            });
                        }
                        else
                        {
                            //save to firebase

                            baas_database_ref_obj.transaction(function(post) {
                                return baas_data_value_str;
                            }, baas_callback_fn);
                        }

                        wizmo.domStore('var_bind_3way_firebase_trans_init_'+model_id_str, true);
                    }
                    else
                    {
                        //save to firebase

                        baas_database_ref_obj.transaction(function(post) {
                            return baas_data_value_str;
                        }, baas_callback_fn);
                    }
                }
            };

            //define callback for 4-way [and more] binding
            var callback_4way_fn = function(metadata_obj, options_obj)
            {
                var model_value_str = metadata_obj['model_value'],
                    s_key_str = options_obj.s_key,
                    s_type_str = options_obj.s_type,
                    s_expiry_str = options_obj.s_expiry,
                    s_expiry_int = parseInt(s_expiry_str),
                    s_expiry_option_obj = (s_expiry_int) ? {expires: s_expiry_int} : null
                    ;

                //do 4-way [or more] data binding

                var s_type_arr = _w.explode('|', s_type_str);
                if(_w.in_array('ds', s_type_arr))
                {
                    wizmo.domStore(s_key_str, model_value_str);
                }

                if(_w.in_array('ss', s_type_arr))
                {
                    wizmo.store(s_key_str, model_value_str, 'ss', s_expiry_option_obj);
                }

                if(_w.in_array('ls', s_type_arr))
                {
                    wizmo.store(s_key_str, model_value_str, 'ls', s_expiry_option_obj);
                }

                if(_w.in_array('ck', s_type_arr))
                {
                    wizmo.store(s_key_str, model_value_str, 'ck', s_expiry_option_obj);
                }
            };

            //Initialize bind metadata
            if(!wizmo.domStore('var_bind_metadata_init'))
            {
                wizmo.domStore('var_bind_metadata', []);
                wizmo.domStore('var_bind_method_flag', {is_2way: false, is_3way: false, is_3way_baas: false, is_4way: false});

                //DOM cache
                wizmo.domStore('var_bind_metadata_init', true);
            }

            //define bind metadata
            bind_meta_data_item_obj['model'] = model_obj;
            bind_meta_data_item_obj['model_selector'] = model_obj['selector'];
            bind_meta_data_item_obj['view'] = view_obj;
            bind_meta_data_item_obj['view_selector'] = (_w.isObject(view_obj) && view_obj.length > 0) ? view_obj['selector'] : '';
            bind_meta_data_item_obj['is_input'] = model_obj_is_input_bool;
            bind_meta_data_item_obj['is_data'] = model_obj_is_data_bool;
            bind_meta_data_item_obj['view_is_template'] = view_obj_is_template_bool;
            bind_meta_data_item_obj['model_view_tag'] = model_obj_view_tag_str;
            bind_meta_data_item_obj['data_key'] = data_key_str;
            bind_meta_data_item_obj['data_key_root'] = data_key_root_str;
            bind_meta_data_item_obj['is_firebase_loaded'] = (_isFirebaseLoaded());
            bind_meta_data_item_obj['is_bound_to_remote'] = false;


            //add options and mutation observer callback if defined
            if(options_obj)
            {
                bind_meta_data_item_obj['options'] = options_obj;
            }
            if(options_obj.callback_mutation)
            {
                bind_meta_data_item_obj['callback_mutation'] = options_obj.callback_mutation;
            }

            //define callback
            if(model_obj_is_input_bool)
            {
                bind_meta_data_item_obj['callback'] = callback_2way_input_fn;
            }
            else
            {
                bind_meta_data_item_obj['callback'] = callback_2way_fn;
            }

            //determine what binding method i.e. 2-way, 3-way, etc.
            if(view_obj)
            {
                bind_meta_data_item_obj['method'] = '2way';
                wizmo.domStore('var_bind_method_flag')['is_2way'] = true;
            }

            if(options_obj)
            {
                if(options_obj.mode)
                {
                    if(options_obj.mode === 'baas')
                    {
                        bind_meta_data_item_obj['method'] = '3way_baas';
                        wizmo.domStore('var_bind_method_flag')['is_3way_baas'] = true;
                    }
                    else
                    {
                        bind_meta_data_item_obj['method'] = '3way';
                        wizmo.domStore('var_bind_method_flag')['is_3way'] = true;
                    }
                }
                else if(options_obj.s_key)
                {
                    bind_meta_data_item_obj['method'] = '4way';
                    wizmo.domStore('var_bind_method_flag')['is_4way'] = true;
                }
            }

            //persist bind metadata
            //prevent duplicate entries
            var bind_metadata_local_arr = wizmo.domStore('var_bind_metadata'),
                bind_metadata_local_item_obj,
                bind_metadata_add_bool = true;

            for(var i = 0; i < bind_metadata_local_arr.length; i++)
            {
                bind_metadata_local_item_obj = bind_metadata_local_arr[i];
                if(model_obj_is_data_bool)
                {
                    bind_metadata_add_bool = (bind_metadata_local_item_obj.data_key === model_obj) ? false : bind_metadata_add_bool;
                }
                else
                {
                    bind_metadata_add_bool = (bind_metadata_local_item_obj.model_selector === model_obj['selector']) ? false : bind_metadata_add_bool;
                }
            }

            if(bind_metadata_add_bool)
            {
                wizmo.domStore('var_bind_metadata').push(bind_meta_data_item_obj);
            }

            //set flag for bind run
            if(!wizmo.domStore('var_bind_add_op_flag'))
            {
                wizmo.domStore('var_bind_run_op_flag', false);
                wizmo.domStore('var_bind_add_op_flag', true);
            }

            return this;
        }

        /**
         * Executes all previously defined bind operations
         * Bind operations are created by _bindAdd method
         * @private
         */
        function _bindRun()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                bind_run_is_manual_bool = (_w.isBool(myArgs[0])) ? myArgs[0] : false,
                bind_run_has_run_once_bool = wizmo.domStore('var_bind_run_init_op_flag'),
                bind_run_is_enabled_bool,
                bind_metadata_arr,
                bind_method_flag_obj
                ;

            //cancel if manual call to _bindRun wants to run before main auto call
            if(bind_run_is_manual_bool && !bind_run_has_run_once_bool)
            {
                return false;
            }

            //get bind data
            bind_metadata_arr = wizmo.domStore('var_bind_metadata');
            bind_method_flag_obj = wizmo.domStore('var_bind_method_flag');

            //flag for proper execution between _bindAdd and _bindRun
            if(!wizmo.domStore('var_bind_run_op_flag'))
            {
                bind_run_is_enabled_bool = true;
                wizmo.domStore('var_bind_add_op_flag', false);
                wizmo.domStore('var_bind_run_op_flag', true);

                //flag that _bindRun has executed at least once
                wizmo.domStore('var_bind_run_init_op_flag', true);
            }

            //return if not enabled
            if(!bind_run_is_enabled_bool)
            {
                return false;
            }

            //return if no data bind object set
            if(!bind_metadata_arr)
            {
                return false;
            }

            /**
             * Main callback function
             */
            var callback_run_fn = function(args)
            {
                var callback_container_bind_rinit_fn,
                    callback_container_mo_fn,
                    callback_fn = args['callback'],
                    callback_mutation_fn = args['callback_mutation'],
                    callback_fn_args_1,
                    callback_fn_args_2,
                    callback_fn_args_3,
                    method_str = args['method'],
                    model_obj = args['model'],
                    model_elem_obj = (_w.count(model_obj) > 0) ? model_obj[0] : model_obj,
                    model_is_input_bool = args['is_input'],
                    model_is_data_bool = args['is_data'],
                    view_obj = args['view'],
                    view_is_template_bool = args['view_is_template'],
                    model_obj_view_tag_str = args['model_view_tag'],
                    options_obj = args['options'],
                    data_key_str = args['data_key'],
                    is_ie_9_bool = _w.isIE() === 9,
                    input_event_name_str,
                    input_on_event_obj,
                    input_throttle_int,
                    key_hashcode_str,
                    observer_obj,
                    observer_config_obj,
                    callback_fn_data_set_trigger_bind_rinit_ns_str,
                    flag_store_data_set_trigger_bind_rinit_str
                    ;

                //create options object if non-existent
                options_obj = (!options_obj) ? {} : options_obj;

                //mark if view is templated
                if(_w.isBool(view_is_template_bool))
                {
                    options_obj.view_is_template = view_is_template_bool;
                }

                //mark if there is a model-view tag
                if(model_obj_view_tag_str)
                {
                    options_obj.model_view_tag = model_obj_view_tag_str;
                }

                //define callback args
                callback_fn_args_1 = model_obj;
                callback_fn_args_2 = view_obj;
                callback_fn_args_3 = options_obj;

                //add method to options
                callback_fn_args_3['method'] = method_str;


                if(model_is_input_bool)
                {
                    //...for input binding

                    //set event variables
                    input_event_name_str = (_w.isString(options_obj.input_event) && _w.in_array(options_obj.input_event, ['keyup', 'keydown'])) ? options_obj.input_event : 'keydown';
                    input_on_event_obj = ('oninput' in document.documentElement && !is_ie_9_bool) && 'input blur change' || input_event_name_str+' blur change';
                    input_throttle_int = (_w.isNumber(options_obj.input_throttle)) ? options_obj.input_throttle : false;

                    //create callback
                    callback_container_bind_rinit_fn = function(e)
                    {
                        if(e)
                        {
                            if(e.type === input_event_name_str)
                            {
                                window.setTimeout(function(){callback_fn(callback_fn_args_1, callback_fn_args_2, callback_fn_args_3);}, 0);
                            }
                            else
                            {
                                callback_fn(callback_fn_args_1, callback_fn_args_2, callback_fn_args_3);
                            }
                        }
                        else
                        {
                            callback_fn(callback_fn_args_1, callback_fn_args_2, callback_fn_args_3);
                        }
                    };

                    //initialize on first run
                    callback_container_bind_rinit_fn();

                    //throttle if defined
                    if(input_throttle_int)
                    {
                        callback_container_bind_rinit_fn = _w.throttle(callback_container_bind_rinit_fn, input_throttle_int);
                    }

                    //add event handler
                    model_obj.on(input_on_event_obj, callback_container_bind_rinit_fn, true);

                    //add mutation observer
                    //define callback
                    callback_container_mo_fn = function(mutation){
                        if(callback_mutation_fn)
                        {
                            callback_mutation_fn(mutation);
                        }
                        callback_fn(callback_fn_args_1, callback_fn_args_2, callback_fn_args_3);
                    };
                    //define observer and config
                    observer_obj = new MutationObserver(callback_container_mo_fn);
                    observer_config_obj = {attributes: true, childList: true, characterData: true, subtree: true, attributeOldValue: true, characterDataOldValue: true};
                    observer_obj.observe(model_elem_obj, observer_config_obj);
                }
                else if (model_is_data_bool)
                {
                    //...for data binding

                    callback_container_bind_rinit_fn = function(e){
                        var data_key_root_str = model_obj.replace(/^ *data_sync_fb_/, "");

                        //update data value i.e. view value
                        callback_fn_args_2 = _getData(data_key_root_str);

                        //set to null on condition
                        callback_fn_args_2 = (_w.isNullOrUndefined(callback_fn_args_2)) ? null : callback_fn_args_2;

                        //call
                        callback_fn([], callback_fn_args_1, callback_fn_args_2, callback_fn_args_3);
                    };

                    //initialize on first run
                    callback_container_bind_rinit_fn();

                    //create hashcode from key
                    key_hashcode_str = Math.abs(_w.hashCode(data_key_str));
                    key_hashcode_str += '';

                    /**
                     * Create universal callback to trigger when data is set
                     * This callback
                     * 1: Trigger to enable bind/sync operations for data key
                     */

                    //1:
                    callback_fn_data_set_trigger_bind_rinit_ns_str = 'fn_data_set_trigger_bind_rinit_ns_'+key_hashcode_str;
                    flag_store_data_set_trigger_bind_rinit_str = 'var_flag_data_set_bind_rinit_'+key_hashcode_str;

                    //queue function for data_set trigger
                    if(!wizmo.domStore(flag_store_data_set_trigger_bind_rinit_str))
                    {
                        wizmo.addFunction('fn_bind_rinit_data_set_callback_trigger', callback_container_bind_rinit_fn, {queue: true, namespace: callback_fn_data_set_trigger_bind_rinit_ns_str});

                        wizmo.domStore(flag_store_data_set_trigger_bind_rinit_str, true);
                    }
                }
                else
                {
                    //...for object binding

                    //define callback
                    callback_container_bind_rinit_fn = function(mutation){
                        callback_fn(mutation, callback_fn_args_1, callback_fn_args_2, callback_fn_args_3);
                    };

                    //initialize on first run
                    callback_container_bind_rinit_fn();

                    //define observer and config
                    observer_obj = new MutationObserver(callback_container_bind_rinit_fn);
                    observer_config_obj = {attributes: true, childList: true, characterData: true, subtree: true, attributeOldValue: true, characterDataOldValue: true};
                    observer_obj.observe(model_elem_obj, observer_config_obj);
                }
            };
            wizmo.domStore('var_bind_callback_run_fn', callback_run_fn);

            /**
             * Setup init callback
             * 1: 3-way data binding (Baas only)
             *
             * Flag for
             * 2: 3-way data binding (non-Baas)
             * 3: 4-way data binding
             */

            //1:

            if(bind_method_flag_obj.is_3way_baas)
            {
                //setup callback to run when firebase is initialized

                var callback_3way_baas_fn = function()
                {
                    var callback_bind_metadata_arr = wizmo.domStore('var_bind_metadata'),
                        callback_bind_metadata_item_method_str,
                        callback_bind_metadata_item_ibtr_bool,
                        callback_run_fn = wizmo.domStore('var_bind_callback_run_fn');
                    for(var i = 0; i < _w.count(callback_bind_metadata_arr); i++)
                    {
                        /**
                         * Filter
                         * 1: 3-way baas operations
                         * 2: Data not yet bound to remote
                         */
                        callback_bind_metadata_item_method_str = callback_bind_metadata_arr[i].method;
                        callback_bind_metadata_item_ibtr_bool = callback_bind_metadata_arr[i].is_bound_to_remote;
                        if(callback_bind_metadata_item_method_str === '3way_baas' && !callback_bind_metadata_item_ibtr_bool)
                        {
                            callback_run_fn(callback_bind_metadata_arr[i]);

                            //update bind metadata store
                            wizmo.domStore('var_bind_metadata')[i]['is_bound_to_remote'] = true;
                        }
                    }
                };

                //add to main firebase callback queue to ensure that
                //callback runs when firebase is loaded
                wizmo.addFunction('firebase_load_callback_fn', callback_3way_baas_fn, {queue: true, namespace: 'firebase_load_callback_fn'});

                //load Firebase if not loaded
                if(!wizmo.domStore('var_flag_firebase_script_init') && !wizmo.domStore('var_flag_firebase_script_loaded_bind_run_init'))
                {
                    _loadFirebase();
                    wizmo.domStore('var_flag_firebase_script_loaded_bind_run_init', true);
                }
            }

            //2:
            if(bind_method_flag_obj.is_3way)
            {
                wizmo.domStore('var_bind_method_3way_init', true);
            }

            //3:
            if(bind_method_flag_obj.is_4way)
            {
                wizmo.domStore('var_bind_method_4way_init', true);
            }

            //run main callback(s)
            if(_w.isArray(bind_metadata_arr) && bind_metadata_arr.length > 0)
            {
                var bind_metadata_item_method_str,
                    bind_metadata_item_ibtr_bool,
                    bind_metadata_item_ifbl_bool
                    ;
                for(var j = 0; j < _w.count(bind_metadata_arr); j++)
                {
                    bind_metadata_item_method_str = bind_metadata_arr[j]['method'];
                    bind_metadata_item_ibtr_bool = bind_metadata_arr[j]['is_bound_to_remote'];
                    bind_metadata_item_ifbl_bool = bind_metadata_arr[j]['is_firebase_loaded'];

                    if(!_w.in_array(bind_metadata_item_method_str, ['3way', '3way_baas']))
                    {
                        callback_run_fn(bind_metadata_arr[j]);
                    }
                    else if(bind_metadata_item_method_str === '3way_baas' && bind_metadata_item_ifbl_bool && !bind_metadata_item_ibtr_bool)
                    {
                        callback_run_fn(bind_metadata_arr[j]);

                        //update bind metadata
                        wizmo.domStore('var_bind_metadata')[j]['is_bound_to_remote'] = true;
                    }
                }
            }
        }

        /**
         * Bind class
         */
        wizmo_obj.bind = {
            /**
             * Creates a data-bind relationship
             * @param {Object} model_obj see _bindAdd
             * @param {Object} view_obj see _bindAdd
             * @param {Object} options_obj see _bindAdd
             * @return {wizmo}
             */
            add: function(model_obj){
                var myArgs = Array.prototype.slice.call(arguments),
                    view_obj = myArgs[1],
                    options_obj = myArgs[2]
                    ;
                return _bindAdd(model_obj, view_obj, options_obj);
            },
            /**
             * Runs all previously defined bind operations
             */
            run: function(){
                var myArgs = Array.prototype.slice.call(arguments);
                _bindRun(myArgs[0]);
            }
        };

        /**
         * Gets data
         * @param {String} key_str the data identifier
         * @param {Object} options_obj the options
         *  - type: the type of storage from where the data will be retrieved from
         *      obj [default], ss [sessionStorage], ls [localStorage], ck [cookie]
         *  - transform: a function that transforms the data before it is set. The function must return a value
         *  - disable_backup_get: a utility option to disable a value from being retrieved from backup stores when the value retrieved from the primary store is null or undefined
         * @return {*}
         * @private
         */
        function _getData(key_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (_w.isObject(myArgs[1])) ? myArgs[1] : {},
                type_str,
                transform_fn,
                disable_backup_get_bool,
                key_sync_ss_str,
                key_sync_ls_str,
                key_sync_ck_str,
                key_options_ss_str,
                key_options_ls_str,
                namespace_str = 'local_store',
                value_mx,
                value_ss_mx,
                value_ls_mx,
                value_ck_mx,
                options_set_obj,
                options_ss_obj,
                options_ls_obj
            ;

            //get options
            type_str = (_w.isString(options_obj.type)) ? options_obj.type : 'obj';
            transform_fn = (options_obj.transform) ? options_obj.transform : undefined;
            disable_backup_get_bool = (_w.isBool(options_obj.disable_backup_get)) ? options_obj.disable_backup_get : false;

            //define storage keys for data
            key_sync_ss_str = 'data_sync_ss_'+key_str;
            key_sync_ls_str = 'data_sync_ls_'+key_str;
            key_sync_ck_str = 'data_sync_ck_'+key_str;

            //define storage keys for options
            key_options_ss_str = 'data_sync_ss_options_'+key_str;
            key_options_ls_str = 'data_sync_ls_options_'+key_str;

            //get local data
            if(type_str === 'ss')
            {
                value_mx = wizmo.store(key_sync_ss_str, undefined, 'ss');
            }
            else if(type_str === 'ls')
            {
                value_mx = wizmo.store(key_sync_ls_str, undefined, 'ls');
            }
            else if(type_str === 'ck')
            {
                value_mx = wizmo.store(key_sync_ck_str, undefined, 'ck');
            }
            else
            {
                value_mx = wizmo.domStore(key_str, undefined, 'var_data_'+namespace_str);

                /**
                 * If data is not available
                 * Get from backup stores if available
                 */
                if(_w.isNullOrUndefined(value_mx) && disable_backup_get_bool)
                {
                    //get data from backup stores
                    value_ss_mx = wizmo.store(key_sync_ss_str, undefined, 'ss');
                    value_ls_mx = wizmo.store(key_sync_ls_str, undefined, 'ls');
                    value_ck_mx = wizmo.store(key_sync_ck_str, undefined, 'ck');

                    options_ss_obj = wizmo.store(key_options_ss_str, undefined, 'ss');
                    options_ls_obj = wizmo.store(key_options_ls_str, undefined, 'ls');

                    if(!_w.isNullOrUndefined(value_ss_mx))
                    {
                        value_mx = value_ss_mx;
                        options_set_obj = options_ss_obj;
                    }
                    else if(!_w.isNullOrUndefined(value_ls_mx))
                    {
                        value_mx = value_ls_mx;
                        options_set_obj = options_ls_obj;
                    }
                    else if (!_w.isNullOrUndefined(value_ck_mx))
                    {
                        value_mx = value_ck_mx;
                    }

                    //re-set
                    if(!_w.isNullOrUndefined(value_mx))
                    {
                        //set
                        _setData(key_str, value_mx, options_set_obj);

                        //get
                        value_mx = wizmo.domStore(key_str, undefined, 'var_data_'+namespace_str);
                    }
                }
            }

            //transform
            if(_w.isFunction(transform_fn) && !_w.isNullOrUndefined(value_mx))
            {
                value_mx = transform_fn(value_mx);
            }

            return value_mx;
        }

        /**
         * Set data
         * @param {String} key_str the data identifier
         * @param {*} value_mx the data value to store
         * @param {Object} options_obj the options
         *  - v_id: the identifier of a DOM element that will serve as a view.
         *    For example:
         *    <div id="my-view-1"></div>
         *    If the above markup represents your view, v_id is 'my-view-1'
         *    Note: Define a view only if it can receive the data being set e.g. if value_mx is a string, number, or boolean
         *  - v_tag: the identifier of the curly brace expression that will be replaced with value_mx. For example, if the html content in the view is "Hello {{first-name}}", the v_tag is 'first-name'
         *  - v_attr: the identifier of the attribute that will be updated with data
         *    For example:
         *    <div id="my-view-2" data-attr="{{attr-value}}">View Content</div>
         *    If the above markup represents your view, v_attr is 'data-attr'
         *    Note: When using v_attr, you must always define v_id [my-view-2] and v_tag [attr-value]
         *  - transform: a function that transforms the data before it is set. The function must return a value
         *  - callback: a function to run anytime data is set. This function will be passed the key and value. You only need to define a callback once.
         *  - callback_run_init: if true, will run this callback the first time it is defined. Default is false.
         *  - disable_trigger_bind_rinit: if true, will disable the custom event trigger that fires each time this method is called for a specific key. For remote data-bind operations only
         *
         * @return {Boolean}
         * @private
         */
        function _setData(key_str, value_mx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[2]) ? myArgs[2] : {},
                view_id_str,
                view_tag_str,
                view_attr_str,
                disable_trigger_bind_rinit_bool,
                delete_op_bool,
                transform_fn,
                callback_fn,
                callback_fn_run_init_bool,
                callback_fn_store_key_str,
                callback_fn_init_key_str,
                view_map_obj,
                view_isset_bool,
                view_tag_isset_bool,
                view_attr_isset_bool,
                view_attr_val_is_style_bool,
                bind_options_obj = {},
                namespace_str = 'local_store',
                key_sync_ss_str,
                key_sync_ls_str,
                key_sync_ck_str,
                key_sync_fb_str,
                key_options_ss_str,
                key_options_ls_str,
                key_data_isset_flag_str,
                el_view_obj,
                el_view_orig_value_str,
                store_key_orig_value_str,
                value_view_str,
                key_hashcode_str,
                callback_fn_data_set_trigger_bind_rinit_ns_str
                ;


            //retrieve option parameters
            view_id_str = (options_obj['v_id']) ? options_obj['v_id'] : undefined;
            view_tag_str = (options_obj['v_tag']) ? options_obj['v_tag'] : undefined;
            view_attr_str = (options_obj['v_attr']) ? options_obj['v_attr'] : undefined;
            disable_trigger_bind_rinit_bool = !!(options_obj.disable_trigger_bind_rinit);
            delete_op_bool = !!(options_obj.is_delete);
            transform_fn = (options_obj.transform) ? options_obj.transform : undefined;
            callback_fn = (options_obj.callback) ? options_obj.callback : undefined;
            callback_fn_run_init_bool = (_w.isBool(options_obj.callback_run_init)) ? options_obj.callback_run_init : true;

            //sanitize html id
            if(_w.isString(view_id_str) && /^ *\#[^\s]+/i.test(view_id_str))
            {
                view_id_str = view_id_str.slice(1);
            }

            //check if the key_str is mapped and get map data if so
            view_map_obj = _getDataMap(key_str);
            if(view_map_obj)
            {
                view_id_str = (view_map_obj['v_id']) ? view_map_obj['v_id'] : undefined;
                view_tag_str = (view_map_obj['v_tag']) ? view_map_obj['v_tag'] : undefined;
                view_attr_str = (view_map_obj['v_attr']) ? view_map_obj['v_attr'] : undefined;
            }

            //define booleans for view element
            view_isset_bool = !!(_w.isString(view_id_str) && view_id_str.length > 0);
            view_tag_isset_bool = !!(_w.isString(view_tag_str) && view_tag_str.length > 0);
            view_attr_isset_bool = !!(_w.isString(view_attr_str) && view_attr_str.length > 0);
            view_attr_val_is_style_bool = !!(_w.isString(view_attr_str) && /^ *style *$/i.test(view_attr_str));

            if(_w.isString(key_str) && key_str.length > 0)
            {
                //transform
                if(_w.isFunction(transform_fn))
                {
                    value_mx = transform_fn(value_mx);
                }

                //callback
                callback_fn_init_key_str = key_str+'_callback_fn_init_key';
                callback_fn_store_key_str = key_str+'_callback_fn_store_key';

                //run saved callback first
                wizmo.runFunction(callback_fn_store_key_str, {args: {key: key_str, value: value_mx}});

                if(_w.isFunction(callback_fn))
                {
                    if(!wizmo.pageStore(callback_fn_init_key_str))
                    {
                        //save callback
                        wizmo.addFunction(callback_fn_store_key_str, callback_fn);

                        //run callback on init if required
                        if(callback_fn_run_init_bool)
                        {
                            wizmo.runFunction(callback_fn_store_key_str, {args: {key: key_str, value: value_mx}});
                        }

                        //flag
                        wizmo.pageStore(callback_fn_init_key_str, true);
                    }
                }

                //persist
                wizmo.domStore(key_str, value_mx, 'var_data_'+namespace_str);

                //update view
                if(_w.isString(view_id_str) && view_id_str.length > 0)
                {
                    if(!_w.isObject(value_mx))
                    {
                        el_view_obj = $('#'+view_id_str);
                        el_view_obj.html();
                    }
                }

                //define storage keys
                key_sync_ss_str = 'data_sync_ss_'+key_str;
                key_sync_ls_str = 'data_sync_ls_'+key_str;
                key_sync_ck_str = 'data_sync_ck_'+key_str;
                key_sync_fb_str = 'data_sync_fb_'+key_str;

                //define storage keys for options
                key_options_ss_str = 'data_sync_ss_options_'+key_str;
                key_options_ls_str = 'data_sync_ls_options_'+key_str;

                //sync local
                if(_w.config.data.sync_ss)
                {
                    wizmo.store(key_sync_ss_str, value_mx, 'ss');
                }
                if(_w.config.data.sync_ls)
                {
                    wizmo.store(key_sync_ls_str, value_mx, 'ls');
                }
                if(_w.config.data.sync_ck)
                {
                    if(_w.isString(value_mx) || _w.isNumber(value_mx) || _w.isBool(value_mx) || value_mx === null)
                    {
                        //add cookie
                        wizmo.store(key_sync_ck_str, value_mx, 'ck');
                    }
                }

                //save options locally
                if(!_w.isObjectEmpty(options_obj))
                {
                    if(_w.config.data.sync_ss)
                    {
                        wizmo.store(key_options_ss_str, options_obj, 'ss');
                    }
                    if(_w.config.data.sync_ls)
                    {
                        wizmo.store(key_options_ls_str, options_obj, 'ls');
                    }
                }

                //add key to register
                if(!wizmo.domStore('var_data_register'))
                {
                    wizmo.domStore('var_data_register', []);
                }

                //do not add to register if delete operation
                //DO NOT REMOVE
                if(!delete_op_bool)
                {
                    //add to register if not already
                    if(!_w.in_array(key_str, wizmo.domStore('var_data_register')))
                    {
                        wizmo.domStore('var_data_register').push(key_str);
                    }
                }

                //Define data parameters for bind options
                bind_options_obj.model_is_data = true;
                bind_options_obj.model_is_data_view_id = view_id_str;
                bind_options_obj.model_is_data_view_tag = view_tag_str;
                bind_options_obj.model_is_data_view_attr = view_attr_str;

                //update the view
                if(view_isset_bool)
                {
                    //create persistent register to keep track of keys that have been set
                    //1: setup
                    store_key_orig_value_str = 'var_data_view_orig_value_register';

                    if(delete_op_bool)
                    {
                        //remove from data map
                        _flushDataMap(key_str);

                        //remove key from register
                        wizmo.storePull(store_key_orig_value_str, key_str);
                    }
                    else
                    {
                        el_view_obj = $('#'+view_id_str);
                        value_view_str = ''+value_mx;

                        var el_view_post_html_bool,
                            el_view_html_or_attr_str,
                            view_template_ctx_obj = {},
                            store_key_view_tag_html_init_str,
                            store_key_view_tag_html_value_str
                            ;

                        store_key_view_tag_html_init_str = 'var_data_set_view_html_init_'+key_str;
                        store_key_view_tag_html_value_str = 'var_data_set_view_html_value_'+key_str;

                        if(view_tag_isset_bool)
                        {
                            /**
                             * Get HTML
                             * 1: First time get from view
                             * 2: Subsequently get from storage
                             */
                            if(!wizmo.domStore(store_key_view_tag_html_init_str))
                            {
                                //1:
                                if(view_attr_isset_bool)
                                {
                                    el_view_html_or_attr_str = (view_attr_val_is_style_bool) ? el_view_obj.css(view_tag_str) : el_view_obj.attr(view_attr_str);
                                }
                                else
                                {
                                    el_view_html_or_attr_str = el_view_obj.html();
                                }

                                wizmo.domStore(store_key_view_tag_html_value_str, el_view_html_or_attr_str);

                                //flag to disable reoccurence
                                wizmo.domStore(store_key_view_tag_html_init_str, true);
                            }
                            else
                            {
                                //2:
                                el_view_html_or_attr_str = wizmo.domStore(store_key_view_tag_html_value_str);
                            }

                            //compose template context
                            //but not for style attribute ops
                            if(!view_attr_val_is_style_bool)
                            {
                                view_template_ctx_obj[''+view_tag_str+''] = ''+value_mx;

                                //compile
                                value_view_str = _compile(el_view_html_or_attr_str, view_template_ctx_obj);
                            }
                        }

                        el_view_post_html_bool = (view_attr_isset_bool) ? false : true;

                        if(el_view_post_html_bool)
                        {
                            //update view
                            el_view_orig_value_str = el_view_obj.html();
                            el_view_obj.html(value_view_str);
                        }
                        else
                        {
                            //update attribute
                            if(view_attr_val_is_style_bool)
                            {
                                el_view_orig_value_str = el_view_obj.attr('style');
                                el_view_obj.css(view_tag_str, value_view_str);
                            }
                            else
                            {
                                el_view_orig_value_str = el_view_obj.attr(view_attr_str);
                                el_view_obj.attr(view_attr_str, value_view_str);
                            }
                        }

                        //set map
                        var view_map_save_obj = {};
                        view_map_save_obj['last_val'] = value_mx;
                        view_map_save_obj['v_id'] = view_id_str;
                        view_map_save_obj['v_tag'] = view_tag_str;
                        view_map_save_obj['v_attr'] = view_attr_str;

                        if(_w.isString(el_view_orig_value_str) && !wizmo.storeInArray(store_key_orig_value_str, key_str))
                        {
                            view_map_save_obj['data_key'] = key_str;
                            view_map_save_obj['v_orig_val'] = el_view_orig_value_str;

                            //create persistent register to keep track of keys that have been set
                            //2: persist
                            wizmo.storePush(store_key_orig_value_str, key_str, undefined, true);
                        }

                        _setDataMap(key_str, view_map_save_obj);
                    }
                }

                //sync remote
                key_data_isset_flag_str = 'var_data_remote_isset_'+key_str;
                if(!wizmo.domStore(key_data_isset_flag_str))
                {
                    //bind only if object is not null
                    if(!_w.isNullOrUndefined(value_mx))
                    {
                        _bindAdd(key_sync_fb_str, value_mx, bind_options_obj);

                        wizmo.domStore(key_data_isset_flag_str, true);
                    }
                }

                //trigger data_set event for data-bind ops
                if(!disable_trigger_bind_rinit_bool)
                {
                    //generate hash code from key
                    key_hashcode_str = Math.abs(_w.hashCode(key_sync_fb_str));
                    key_hashcode_str += '';

                    //generate queue function namespace
                    callback_fn_data_set_trigger_bind_rinit_ns_str = 'fn_data_set_trigger_bind_rinit_ns_'+key_hashcode_str;

                    //run function
                    wizmo.runFunction('fn_bind_rinit_data_set_callback_trigger', {queue: true, namespace: callback_fn_data_set_trigger_bind_rinit_ns_str});
                }

                return true;
            }

            return false;
        }

        /**
         * Update a data object
         * @param {String} key_str the data identifier
         * @param {String} update_obj_prop_str the object property to update
         *
         * 1. For a single dimensional object like:
         * {'first': 'one', 'second': 'two', 'third': 'three'}
         * you define the object property by specifying the key e.g. 'second'
         *
         * 2. For a multi-dimensional object like:
         * {'first': 'one', 'second': {'second_sub_1': 'one', 'second_sub_2': 'two', 'second_sub_3': 'three'}, 'third': 'three'}
         * you define the object property using a dot delimiter e.g. 'second.second_sub_3'
         *
         * 3. To update a single or multi-dimensional object property that is an array, you use a double-colon specifier as a suffix
         * For example, if you have a multi-dimensional array like:
         * {'first': 'one', 'second': {'second_sub_1': 'one', 'second_sub_2': 'two', 'second_sub_3': ['1st', '2nd']}, 'third': 'three'}
         *
         * 'second.second_sub_3::put->1' will update the array by replacing the second value of the array
         * 'second.second_sub_3::push' will update the array by adding the value to the end of the array
         * 'second.second_sub_3::unshift' will update the array by adding the value to the beginning of the array
         *
         * @param {*} update_value_mx the value to update
         * @param {Object} options_obj the options see _setData
         * @return {Boolean}
         */
        function _updateDataObject(key_str, update_obj_prop_str, update_value_mx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[3],
                value_orig_obj,
                value_updated_obj
                ;

            //get the latest
            value_orig_obj = _getData(key_str, {disable_backup_get: true});

            //return false if value to be updated is not object
            if(!_w.isObject(value_orig_obj))
            {
                return false;
            }

            //update object
            value_updated_obj = _w.updateObject(value_orig_obj, update_obj_prop_str, update_value_mx);

            //set data
            _setData(key_str, value_updated_obj, options_obj);

            return true;
        }

        /**
         * Keep data locked to the view on refresh
         * When data is set and bound to a view off-script [e.g. in the console, after asynchronous operation, etc.], and then the page is refreshed, the view will not be updated with the last set value [by default].
         * To ensure that the views are kept current with the data that was last saved, call this method at the top of your data operations code
         */
        function _lockDataToViewOnRefresh()
        {
            var map_register_arr = wizmo.store('var_data_map_key_view_register'),
                map_register_item_obj,
                map_register_item_chunk_obj
                ;
            if(_w.isArray(map_register_arr) && map_register_arr.length > 0)
            {
                for(var i = 0; i < map_register_arr.length; i++)
                {
                    map_register_item_obj = map_register_arr[i];
                    for(var key_str in map_register_item_obj)
                    {
                        if (map_register_item_obj.hasOwnProperty(key_str))
                        {
                            map_register_item_chunk_obj = map_register_item_obj[key_str];

                            //set data
                            _setData(key_str, map_register_item_chunk_obj.last_val);
                        }
                    }
                }
            }
        }

        /**
         * Finds a record of a relationship between a data item and view element
         * @param {String} key_str the identifier of the data item
         * @return {Object|Boolean}
         * @private
         */
        function _getDataMap(key_str)
        {
            var map_register_arr = wizmo.store('var_data_map_key_view_register'),
                map_item_obj,
                map_item_obj_view_obj
                ;

            //return false if key is invalid
            if(!_w.isString(key_str) || key_str.length < 1)
            {
                return false;
            }

            //get map object
            if(_w.isArray(map_register_arr) && map_register_arr.length > 0)
            {
                for (var i = 0; i < map_register_arr.length; i++)
                {
                    map_item_obj = map_register_arr[i];
                    map_item_obj_view_obj = map_item_obj[key_str];

                    if(_w.isObject(map_item_obj_view_obj))
                    {
                        return map_item_obj_view_obj;
                    }
                }
            }

            return false;
        }

        /**
         * Define a relationship between a data item and a view element
         * @param {String} key_str the identifier of the data item
         * @param {Object} map_obj the map object
         *  - v_id: the identifier of the view. This is the value of the 'id' attribute
         *  - v_tag: the identifier of the curly brace expression that will be replaced with value_mx. For example, if the html content in the view is "Hello {{first-name}}", the v_tag is 'first-name'
         *  - v_attr: the identifier of the attribute that will be updated with data
         *    For example:
         *    <div id="my-view-2" data-attr="{{attr-value}}">View Content</div>
         *    If the above markup represents your view, v_attr is 'data-attr'
         *    Note: When using v_attr, you must always define v_id [my-view-2] and v_tag [attr-value]
         * @private
         */
        function _setDataMap(key_str, map_obj)
        {
            var map_register_arr,
                map_orig_obj,
                map_final_obj = {},
                new_entry_bool = true
                ;

            if(!_w.isString(key_str) || key_str.length < 1)
            {
                return false;
            }

            //flush map register on refresh
            if(!wizmo.store('var_data_map_key_view_register'))
            {
                wizmo.store('var_data_map_key_view_register', []);
            }
            map_register_arr = wizmo.store('var_data_map_key_view_register');

            for(var i = 0; i < map_register_arr.length; i++)
            {
                map_orig_obj = map_register_arr[i][key_str];
                if(_w.isObject(map_orig_obj))
                {
                    //flag
                    new_entry_bool = false;

                    //update
                    map_final_obj = _w.mergeObject(map_orig_obj, map_obj);
                    map_register_arr[i][key_str] = map_final_obj;
                }
            }

            if(new_entry_bool)
            {
                //add to register
                map_final_obj[key_str] = map_obj;
                map_register_arr.push(map_final_obj);
            }

            //persist to storage
            wizmo.store('var_data_map_key_view_register', map_register_arr);
        }

        /**
         * Update the view based on map object
         * @param {Object} map_obj the map object
         * @private
         */
        function _updateViewDataMap(map_obj)
        {
            if(_w.isObject(map_obj))
            {
                var map_obj_view_orig_val_str = map_obj['v_orig_val'],
                    map_obj_view_id_str = map_obj['v_id'],
                    map_obj_view_attr_str = map_obj['v_attr'],
                    view_obj_selector_str,
                    view_obj
                    ;

                view_obj_selector_str = '#'+map_obj_view_id_str;
                view_obj = $(view_obj_selector_str);

                if(map_obj_view_attr_str && _w.isString(map_obj_view_attr_str))
                {
                    //update attribute

                    if(map_obj_view_attr_str === 'style')
                    {
                        view_obj.attr('style', map_obj_view_orig_val_str);
                    }
                    else
                    {
                        view_obj.attr(map_obj_view_attr_str, map_obj_view_orig_val_str);
                    }
                }
                else
                {
                    //update html value

                    if(_w.isString(map_obj_view_orig_val_str) && map_obj_view_orig_val_str.length > 0)
                    {
                        view_obj.html(map_obj_view_orig_val_str);
                    }
                }
            }
        }

        /**
         * Flush the data map
         * @param {String} key_str an optional key to flush. If key is not provided, the entire map is flushed
         * @return {Boolean}
         * @private
         */
        function _flushDataMap()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                key_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0] : null,
                map_register_arr,
                map_register_item_obj,
                map_register_flush_arr = []
                ;

            if(!_w.isNullOrUndefined(key_str))
            {
                //flush only specified key
                map_register_arr = wizmo.store('var_data_map_key_view_register');

                if(_w.isArray(map_register_arr) && map_register_arr.length > 0)
                {
                    for(var i = 0; i < map_register_arr.length; i++)
                    {
                        map_register_item_obj = map_register_arr[i][key_str];
                        if(!_w.isObject(map_register_item_obj))
                        {
                            //push to new [to keep]
                            map_register_flush_arr.push(map_register_arr[i]);
                        }
                        else
                        {
                            //reset view
                            _updateViewDataMap(map_register_item_obj);
                        }
                    }

                    wizmo.store('var_data_map_key_view_register', map_register_flush_arr);

                    return true;
                }

                return false;
            }
            else
            {
                //flush entire map
                wizmo.store('var_data_map_key_view_register', []);

                return true;
            }
        }

        /**
         * Scans the entire data-set to find keys and their values in the data-set
         * @param {String} key_stub_str the key prefix
         * @return {Object}
         * @private
         */
        function _scanData(key_stub_str)
        {
            var namespace_str = 'local_store',
                data_store_obj = window.wUtil.domStoreData['w_var_data_'+namespace_str],
                regex_scan_obj,
                scan_result_obj = {}
                ;

            if(!_w.isString(key_stub_str) || key_stub_str.length < 1)
            {
                return false;
            }

            regex_scan_obj = new RegExp("^w_"+key_stub_str+"", "i");

            for (var data_item in data_store_obj)
            {
                if(data_store_obj.hasOwnProperty(data_item))
                {
                    if(regex_scan_obj.test(data_item))
                    {
                        scan_result_obj[data_item] = data_store_obj[data_item];
                    }
                }
            }

            return scan_result_obj;
        }

        /**
         * Delete data
         * @param {String} key_str the identifier of the data item to delete
         * Note: use '--all--' as the key to delete all data points
         * @private
         */
        function _deleteData(key_str)
        {
            var key_register_arr,
                key_register_item_str,
                key_register_item_opt_ss_str,
                key_register_item_opt_ls_str,
                key_register_item_data_isset_flag_str
                ;

            if(key_str === '--all--')
            {
                //delete all data points

                key_register_arr = wizmo.domStore('var_data_register');
                if(_w.isArray(key_register_arr) && key_register_arr.length > 0)
                {
                    for(var i = 0; i < key_register_arr.length; i++)
                    {
                        //get and generate storage keys
                        key_register_item_str = key_register_arr[i];

                        key_register_item_opt_ss_str = 'data_sync_ss_options_'+key_register_item_str;
                        key_register_item_opt_ls_str = 'data_sync_ls_options_'+key_register_item_str;
                        key_register_item_data_isset_flag_str = 'var_data_remote_isset_'+key_register_item_str;

                        //delete data point
                        _setData(key_register_item_str, null, {is_delete: true});

                        //delete data options
                        wizmo.store(key_register_item_opt_ss_str, null, 'ss');
                        wizmo.store(key_register_item_opt_ls_str, null, 'ls');

                        //delete flag(s)
                        wizmo.domStore(key_register_item_data_isset_flag_str, null);
                    }

                    //clear register
                    wizmo.domStore('var_data_register', null);
                }
            }
            else
            {
                //delete single data point

                _setData(key_str, null, {is_delete: true});

                //get and generate storage keys
                key_register_item_opt_ss_str = 'data_sync_ss_options_'+key_str;
                key_register_item_opt_ls_str = 'data_sync_ls_options_'+key_str;
                key_register_item_data_isset_flag_str = 'var_data_remote_isset_'+key_str;

                //delete data options
                wizmo.store(key_register_item_opt_ss_str, null, 'ss');
                wizmo.store(key_register_item_opt_ls_str, null, 'ls');

                //delete flag(s)
                wizmo.domStore(key_register_item_data_isset_flag_str, null);
            }
        }

        /** A Central and Managed data-store for wizmo **/
        wizmo_obj.data = {
            /**
             * Get data
             * @param {String} key_str the data identifier
             * @param {Object} options_obj the options. see _getData
             * @return {*}
             */
            get: function(key_str){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = myArgs[1]
                    ;
                return _getData(key_str, options_obj);
            },
            /**
             * Set data
             * @param {String} key_str the data identifier
             * @param {*} value_mx the data value
             * @param {Object} options_obj the options see _setData
             * @return {Boolean}
             */
            set: function(key_str, value_mx)
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = myArgs[2]
                    ;
                return _setData(key_str, value_mx, options_obj);
            },
            /**
             * Update data object
             * Wrapper class for _updateDataObject
             * @param {String} key_str the data identifer
             * @param {String} update_obj_prop_str the object property to update
             * @param {*} update_value_mx the value to update
             * @param {Object} options_obj the options for _setData
             * @return {Boolean}
             */
            updateObject: function(key_str, update_obj_prop_str, update_value_mx)
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = myArgs[3]
                    ;

                return _updateDataObject(key_str, update_obj_prop_str, update_value_mx, options_obj);
            },
            /**
             * Keep data locked to the view on refresh
             * When data is set and bound to a view off-script [e.g. in the console, after asynchronous operation, etc.], and then the page is refreshed, the view will not be updated with the last set value [by default].
             * To ensure that the views are kept current with the data that was last saved, call this method at the top of your data operations code
             */
            lockView: function()
            {
                return _lockDataToViewOnRefresh();
            },
            /**
             * Define a relationship between a data item and a DOM element
             * @param {String} key_str the data identifier. See _setDataMap
             * @param {Object} map_obj the map object. See _setDataMap
             * @return {Boolean}
             */
            map: function(key_str, map_obj)
            {
                return _setDataMap(key_str, map_obj);
            },
            /**
             * Gets a specific map for a data item
             * @param {String} key_str the data identifier. See _getDataMap
             * @return {Object|Boolean}
             */
            getMap: function(key_str)
            {
                return _getDataMap(key_str);
            },
            /**
             * Remove the contents of the data map
             * @param {String} key_str an optional key. If key is provided, only data associated with said key is flushed. If not key is provided, entire map is flushed
             * @return {Boolean}
             */
            flushMap: function()
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    key_str = myArgs[0]
                ;

                return _flushDataMap(key_str);
            },
            /**
             * Delete data
             * @param {String} key_str the data identifier
             * Note: use '--all--' as the key to delete all data points
             * @return {Boolean}
             */
            remove: function(key_str)
            {
                return _deleteData(key_str);
            },
            /**
             * Scans the entire data-set to find keys and their values in the data-set
             * @param {String} key_stub_str the key prefix
             * @return {Object}
             */
            scan: function(key_stub_str)
            {
                return _scanData(key_stub_str);
            }
        };


        /**
         * Provides routing functionality
         *
         * @param {string} path_str the route path e.g. url.com/#path. Define the path without the hash character e.g. path becomes '#path'
         * @param {Object} options_obj the route options
         *
         * hash_char: the character(s) that will prefix the path_str. Default is '#/'
         *
         * callback: a callback function to be called when the route is executed. It will be passed callback_args (see below) as the first argument. If fetch_url is valid, it will be passed as the second argument
         *
         * callback_args: an array or object that is passed to the callback function. It is passed as the first argument
         *
         * add_click: specifies whether click handlers will be added links that have the path_str in their href attribute
         * For example, if add_click is true [default], path_str == 'route_1', hash_char == '#/', and there is a link element like '<a href="#/route_1">Link to Route</a>, then it will be automatically activated to execute the route when it is clicked
         * Set this to false to disable this behavior
         *
         * go: this instantly routes to the given path when set to true.
         *
         * fetch_url: the URL to a HTML file to fetch and inject into the DOM
         * Note: the contents of the file will be inserted
         *
         * fetch_target: the identifier of the DOM element where the fetched file will be inserted
         *
         * fetch_post_method: the method that will be used for the insertion
         * Options are:
         * - append: will append the contents of the fetched file to existing contents of the fetch_target
         * - prepend: will append the contents of the fetched file to existing contents of the fetch_target
         * - replace: will replace the existing contents of the fetch_target with the contents of the fetched file
         *
         * fetch_post_block: a regular expression string that will prevent the view from being inserted if it resolves to true. This is used to prevent a view from being inserted multiple times on multiple calls/clicks.
         *
         * fetch_cache_expiry: the lifetime (in seconds) of the cache for the fetched item. Whenever the view is fetched, it is also cached in storage. Value must be an integer. When not defined, lifetime is unlimited
         *
         * fetch_callback_pre: a callback function to be executed before the file is fetched
         *
         * fetch_callback_post: a callback function to be executed after the file is fetched
         *
         * fetch_callback_args: the arguments that will be passed as the first argument to fetch_callback_pre and fetch_callback_post
         *
         * scroll_route: if true, will activate scroll animation to the fetch_target
         *
         * scroll_target: defines the scroll target. If fetch_target is already defined and scroll_route is true, you can skip this
         *
         * scroll_offset: defines the scroll offset. See scrollTo method
         *
         * scroll_speed: defines the scroll speed in seconds. See scrollTo method
         *
         * scroll_callback: defines a callback function that will be executed when scrolling is over
         *
         * nohashchange: if true, the URL in the address bar will not be hashed. Default is false
         *
         * noscroll: if true, all scroll actions will be disabled regardless of other scroll settings
         *
         * @private
         */
        function _route(path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1],
                options_meta_obj,
                url_str = _getUrl(),
                options_hash_char_str,
                options_callback_fn,
                options_callback_args_arr_or_obj,
                options_add_click_bool,
                options_fetch_route_bool,
                options_fetch_url_str,
                options_fetch_url_base_str,
                options_fetch_target_str,
                options_fetch_post_method_str,
                options_fetch_post_block_str,
                options_fetch_cache_expiry_int,
                options_fetch_template_obj,
                options_fetch_callback_pre_fn,
                options_fetch_callback_post_fn,
                options_fetch_callback_args_arr_or_obj,
                options_fetch_linkport_bool,
                options_go_route_bool,
                options_disable_hashchange_bool,
                options_disable_scroll_bool,
                options_scroll_route_bool,
                options_scroll_target_str,
                options_scroll_offset_int_or_str,
                options_scroll_speed_int_or_str,
                options_scroll_callback_fn,
                path_hash_str,
                elem_win_obj = $(window),
                elem_body_obj = $('body'),
                elem_a_obj,
                elem_a_obj_length_int,
                data_route_obj = wQuery.data('w_var_routes_id'),
                route_data_id_arr,
                route_data_meta_arr,
                route_data_history_str,
                elem_a_item_obj,
                elem_a_item_obj_href_str
                ;

            //set route option defaults
            options_hash_char_str = (_w.isString(options_obj.hash_char) && options_obj.hash_char.length > 0) ? options_obj.hash_char : '#/';
            options_callback_fn = (options_obj.callback) ? options_obj.callback : null;
            options_callback_args_arr_or_obj = (options_obj.callback_args) ? options_obj.callback_args : null;
            options_add_click_bool = (_w.isBool(options_obj.add_click)) ? options_obj.add_click : true;
            options_fetch_route_bool = ((options_obj.fetch_route));
            options_fetch_url_str = (_w.isString(options_obj.fetch_url) && options_obj.fetch_url.length > 0) ? options_obj.fetch_url : null;
            options_fetch_url_base_str = wizmo.store('var_url_base') || _getUrl();
            options_fetch_target_str = (_w.isString(options_obj.fetch_target) && options_obj.fetch_target.length > 0) ? options_obj.fetch_target : null;
            options_fetch_post_method_str = (_w.isString(options_obj.fetch_post_method) && options_obj.fetch_post_method.length > 0 && _w.in_array(options_obj.fetch_post_method, ['html', 'replace', 'append', 'prepend'])) ? options_obj.fetch_post_method : 'append';
            options_fetch_cache_expiry_int = (_w.isNumber(options_obj.fetch_cache_expiry) && options_obj.fetch_cache_expiry > 0) ? options_obj.fetch_cache_expiry : 0;
            options_fetch_template_obj = (!_w.isObjectEmpty(options_obj.fetch_template)) ? options_obj.fetch_template : null;
            options_fetch_post_block_str = (_w.isString(options_obj.fetch_post_block) && options_obj.fetch_post_block.length > 0) ? options_obj.fetch_post_block : null;
            options_fetch_callback_pre_fn = (options_obj.fetch_callback_pre) ? options_obj.fetch_callback_pre : null;
            options_fetch_callback_post_fn = (options_obj.fetch_callback_post) ? options_obj.fetch_callback_post : null;
            options_fetch_callback_args_arr_or_obj = (options_obj.fetch_callback_args) ? options_obj.fetch_callback_args : null;
            options_fetch_linkport_bool = (options_obj.fetch_linkport) ? options_obj.fetch_linkport : false;

            options_go_route_bool = ((options_obj.go));
            options_disable_hashchange_bool = ((options_obj.nohashchange));
            options_disable_scroll_bool = ((options_obj.noscroll));

            options_scroll_route_bool = ((options_obj.scroll_route));
            options_scroll_target_str = (_w.isString(options_obj.scroll_target) && options_obj.scroll_target.length > 0) ? options_obj.scroll_target : null;
            options_scroll_offset_int_or_str = ((_w.isString(options_obj.scroll_offset) && options_obj.scroll_offset.length > 0) || _w.isNumber(options_obj.scroll_offset)) ? options_obj.scroll_offset : null;
            options_scroll_speed_int_or_str = ((_w.isString(options_obj.scroll_speed) && options_obj.scroll_speed.length > 0) || _w.isNumber(options_obj.scroll_speed)) ? options_obj.scroll_speed : null;
            options_scroll_callback_fn = (options_obj.scroll_callback) ? options_obj.scroll_callback : null;

            //define options meta
            options_meta_obj = {
                hash_char: options_hash_char_str,
                callback: options_callback_fn,
                callback_args: options_callback_args_arr_or_obj,
                add_click: options_add_click_bool,
                fetch_route: options_fetch_route_bool,
                fetch_url: options_fetch_url_str,
                fetch_url_base: options_fetch_url_base_str,
                fetch_target: options_fetch_target_str,
                fetch_post_method: options_fetch_post_method_str,
                fetch_cache_expiry: options_fetch_cache_expiry_int,
                fetch_post_block: options_fetch_post_block_str,
                fetch_template: options_fetch_template_obj,
                fetch_callback_pre: options_fetch_callback_pre_fn,
                fetch_callback_post: options_fetch_callback_post_fn,
                fetch_callback_args: options_fetch_callback_args_arr_or_obj,
                fetch_linkport: options_fetch_linkport_bool,
                scroll_route: options_scroll_route_bool,
                scroll_target: options_scroll_target_str,
                scroll_speed: options_scroll_speed_int_or_str,
                scroll_offset: options_scroll_offset_int_or_str,
                scroll_callback: options_scroll_callback_fn,
                disable_hashchange: options_disable_hashchange_bool,
                disable_scroll: options_disable_scroll_bool
            };

            //create path hash
            path_hash_str = options_hash_char_str+path_str;

            /**
             * This is the callback that will be fired on hashchange
             * @param {Boolean} is_forward_evented_bool this allows us to specify that the mode of the hashchange. When the hashchange callback is fired on account of a click, fetch, or other action, it is considered a 'forward' event, so this method is passed a true value. Otherwise, it is considered a 'backward' event, and is passed a false value e.g. click the 'Back' button
             * @param {Boolean} disable_hashchange_bool this disables the hashchange
             */
            var hashchange_main_fn = function(){

                //get current location info
                var myArgs = Array.prototype.slice.call(arguments),
                    is_forward_evented_bool = ((myArgs[0])),
                    hashchange_main_fn_path_hash_str = myArgs[1],
                    hash_char_len_int = options_hash_char_str.length,
                    hashchange_main_fn_path_str = (hashchange_main_fn_path_hash_str && _w.isString(hashchange_main_fn_path_hash_str) && hashchange_main_fn_path_hash_str.length > 0) ? hashchange_main_fn_path_hash_str.slice(hash_char_len_int, hashchange_main_fn_path_hash_str.length) : '',
                    location_href_str = window.location.href,
                    location_href_hash_str = _getUrl('hs'),
                    location_hash_route_arr = _w.explode(options_hash_char_str, location_href_str),
                    location_hash_route_str = (_w.isString(location_href_hash_str) && location_href_hash_str.length > 0) ? location_href_hash_str.slice(hash_char_len_int, location_href_hash_str.length) : location_hash_route_arr.slice(-1)[0],
                    route_search_int,
                    hashchange_main_fn_route_id_str,
                    route_data_history_str
                    ;

                //get stored route data
                route_data_id_arr = wQuery.data('w_var_routes_id');
                route_data_meta_arr = wQuery.data('w_var_routes_meta');

                //get the route identifier
                hashchange_main_fn_route_id_str = (_w.isString(hashchange_main_fn_path_str) && hashchange_main_fn_path_str.length > 0) ? hashchange_main_fn_path_str : location_hash_route_str ;
                route_search_int = _w.array_search(hashchange_main_fn_route_id_str, route_data_id_arr);

                //execute route function if route_id is found
                if(route_search_int)
                {
                    //get callback info
                    var _callback_fn = route_data_meta_arr[route_search_int]['callback'];
                    var _callback_fn_args_arr_or_obj = route_data_meta_arr[route_search_int]['callback_args'];

                    //execute route callback if defined
                    if(_callback_fn)
                    {
                        if(options_fetch_route_bool)
                        {
                            _callback_fn(_callback_fn_args_arr_or_obj, options_fetch_url_str);
                        }
                        else
                        {
                            _callback_fn(_callback_fn_args_arr_or_obj);
                        }
                    }

                    /**
                     * Fetch
                     */
                    var _fetch_url_str = route_data_meta_arr[route_search_int]['fetch_url'];
                    var _fetch_url_base_str = route_data_meta_arr[route_search_int]['fetch_url_base'];

                    var _fetch_target_str = route_data_meta_arr[route_search_int]['fetch_target'];
                    var _fetch_post_method_str = route_data_meta_arr[route_search_int]['fetch_post_method'];
                    var _fetch_cache_expiry_int = route_data_meta_arr[route_search_int]['fetch_cache_expiry'];
                    var _fetch_post_block_str = route_data_meta_arr[route_search_int]['fetch_post_block'];
                    var _fetch_template_obj = route_data_meta_arr[route_search_int]['fetch_template'];

                    var _fetch_callback_pre_fn = route_data_meta_arr[route_search_int]['fetch_callback_pre'];
                    var _fetch_callback_post_fn = route_data_meta_arr[route_search_int]['fetch_callback_post'];
                    var _fetch_callback_args_arr_or_obj = route_data_meta_arr[route_search_int]['fetch_callback_args'];


                    var _fetch_linkport_bool = route_data_meta_arr[route_search_int]['fetch_linkport'];

                    if(_fetch_url_str)
                    {
                        var _fetch_url_final_str = _resolveDirectoryToURL(_fetch_url_str),
                            _fetch_url_final_mid_slash_str = (_w.isString(_fetch_url_final_str) && /^ *\//i.test(_fetch_url_final_str)) ? '' : '/',
                            html_content_arr,
                            view_content_str,
                            elem_target_obj,
                            view_target_content_str,
                            _fetch_post_block_regex_obj,
                            insert_view_bool = true;

                        if(/^ *[^\/][^\s\:\?]+?\.[a-zA-Z]+ *$/i.test(_fetch_url_str))
                        {
                            //file or local path reference. prepend current url
                            _fetch_url_final_str = _getUrl('basedir', _fetch_url_base_str)+_fetch_url_final_mid_slash_str+_fetch_url_str;
                        }

                        //run pre-callback
                        if(_fetch_callback_pre_fn)
                        {
                            _fetch_callback_pre_fn(_fetch_callback_args_arr_or_obj, _fetch_url_final_str);
                        }

                        _cacheAddHTML(_fetch_url_final_str, {expiry: _fetch_cache_expiry_int, cache_stub: false}).then(function(html_str){

                            //process view
                            if(/<html.*?\>|<body.*?\>/igm.test(html_str))
                            {
                                //get html content inside body
                                html_content_arr = _w.regexMatchAll(/<body.*?\>([\s\S]*)<\/body>/igm, html_str);
                                view_content_str = html_content_arr[0][1];
                                view_content_str = view_content_str.trim();
                            }
                            else
                            {
                                //get all html if stub
                                view_content_str = html_str;
                            }

                            //linkport
                            if(_fetch_linkport_bool)
                            {
                                //get content from response
                                html_content_arr = _w.regexMatchAll(/^\s*<\!\-\- *(.+?) *\-\-\>\s*([\s\S]*)$/igm, html_str);

                                //override target for linkport from HTML comments
                                _fetch_target_str = (_fetch_target_str) ? _fetch_target_str : html_content_arr[0][1];

                                //remove hash from target id
                                _fetch_target_str = _fetch_target_str.replace(/^#/, '');

                                //get html content
                                view_content_str = html_content_arr[0][2];
                            }

                            //compile
                            if(_fetch_template_obj)
                            {
                                view_content_str = _compile(view_content_str, _fetch_template_obj);
                            }

                            //create target
                            elem_target_obj = (_fetch_target_str) ? $('#'+_fetch_target_str) : elem_body_obj;

                            //post block
                            if(_fetch_post_block_str)
                            {
                                _fetch_post_block_regex_obj = new RegExp(_fetch_post_block_str, "igm");

                                //get html of target
                                view_target_content_str = elem_target_obj.html();
                                insert_view_bool = (_fetch_post_block_regex_obj.test(view_target_content_str)) ? false : true;
                            }

                            //insert if allowed
                            if(insert_view_bool)
                            {
                                _fetch_post_method_str = (_fetch_post_method_str === 'replace') ? 'html': _fetch_post_method_str;
                                elem_target_obj[_fetch_post_method_str](view_content_str);
                            }

                            //run post-callback
                            if(_fetch_callback_post_fn)
                            {
                                _fetch_callback_post_fn(_fetch_callback_args_arr_or_obj, _fetch_url_final_str, elem_target_obj, html_str, view_content_str);
                            }

                        });
                    }

                    /**
                     * Scroll
                     */
                    var _scroll_route_bool = route_data_meta_arr[route_search_int]['scroll_route'];
                    var _scroll_target_str = route_data_meta_arr[route_search_int]['scroll_target'];
                    var _scroll_speed_int = route_data_meta_arr[route_search_int]['scroll_speed'];
                    var _scroll_offset_int = route_data_meta_arr[route_search_int]['scroll_offset'];
                    var _scroll_callback_fn = route_data_meta_arr[route_search_int]['scroll_callback'];

                    //execute scroll if not globally disabled
                    if(!options_disable_scroll_bool)
                    {
                        var _scroll_target_obj,
                            _scroll_options_obj = {speed: _scroll_speed_int, offset: _scroll_offset_int, callback: _scroll_callback_fn};

                        if(is_forward_evented_bool)
                        {
                            /**
                             * is_forward_evented_bool is a flag passed to hashchange to signify that the route was activated manually and is intended to proceed in the forward direction i.e. it should not be fired by the back button
                             */

                            if(_scroll_target_str)
                            {
                                _scroll_target_obj = $('#'+_scroll_target_str);
                                elem_body_obj.scrollTo(_scroll_target_obj, _scroll_options_obj);
                            }
                            else if(_scroll_route_bool && _fetch_target_str)
                            {
                                _scroll_target_obj = $('#'+_fetch_target_str);
                                elem_body_obj.scrollTo(_scroll_target_obj, _scroll_options_obj);
                            }
                        }
                        else
                        {
                            /**
                             * For back button
                             * reverse scroll
                             */
                            if(_scroll_target_str)
                            {
                                _scroll_target_obj = $('#'+_scroll_target_str);
                                elem_body_obj.scrollTo(_scroll_target_obj, _scroll_options_obj);
                            }
                        }
                    }

                    //get local route history ticker
                    route_data_history_str = wizmo.pageStore('var_routes_history_ticker');

                    /*jshint -W116 */
                    if(route_data_history_str != location_href_str)
                    {
                        //update local history ticker
                        wizmo.pageStore('var_routes_history_ticker', location_href_str);
                    }
                    /*jshint +W116 */
                }
                else
                {
                    //scroll to top if navigating back and scroll
                    var _scroll_target_alt_str = route_data_meta_arr[0]['scroll_target'];
                    if(!is_forward_evented_bool && _scroll_target_alt_str)
                    {
                        //scroll to top
                        elem_body_obj.scrollTo(0);
                    }
                }
            };

            //define core route func
            var route_main_fn = function(){

                var myArgs = Array.prototype.slice.call(arguments),
                    is_forward_evented_bool = ((myArgs[0])),
                    route_main_fn_path_hash_str = ((myArgs[1])),
                    disable_hashchange_bool = !!((myArgs[2])),
                    disable_hashchange_local_bool,
                    route_main_fn_disable_hashchange_bool,
                    location_href_all_str = _getUrl(),
                    location_href_base_str = _getUrl('bp'),
                    location_href_query_str = _getUrl('q'),
                    route_main_fn_path_str,
                    route_main_fn_data_id_arr,
                    route_main_fn_data_meta_arr,
                    route_main_fn_search_int,
                    path_hash_full_str,
                    regex_test_url_pattern_str = "[^\s]+?"+route_main_fn_path_hash_str,
                    regex_test_url_obj
                    ;

                //create regex to test url
                regex_test_url_pattern_str = _w.escapeRegExp(regex_test_url_pattern_str, true);
                regex_test_url_obj = new RegExp(regex_test_url_pattern_str, "i");

                //get
                route_main_fn_path_str = route_main_fn_path_hash_str.replace(options_hash_char_str, '');

                //get stored route data
                route_main_fn_data_id_arr = wQuery.data('w_var_routes_id');
                route_main_fn_data_meta_arr = wQuery.data('w_var_routes_meta');

                //check if current route exists in record
                route_main_fn_search_int = _w.array_search(route_main_fn_path_str, route_main_fn_data_id_arr);

                if(route_main_fn_search_int)
                {
                    //get the local value of disable_hashchange if available
                    //this is the value that was set when route was created
                    disable_hashchange_local_bool = route_main_fn_data_meta_arr[route_main_fn_search_int]['disable_hashchange'];
                }

                /**
                 * local value of disable_hashchange should override global but only if go option is false or undefined
                 * The reason for this is that the go option is a global setting and implies that you want a hashchange. Ergo, if no hash change occurs on account of a local setting, this may not be ideal
                 */
                if(_w.isBool(disable_hashchange_local_bool))
                {
                    route_main_fn_disable_hashchange_bool = disable_hashchange_local_bool;
                    if(options_go_route_bool)
                    {
                        route_main_fn_disable_hashchange_bool = disable_hashchange_bool;
                    }
                }

                //check history.pushState support
                if(window.history.pushState)
                {
                    //create the full path + hash
                    path_hash_full_str = location_href_base_str+location_href_query_str+route_main_fn_path_hash_str;

                    //manage route history
                    if(!wizmo.pageStore('var_routes_history_ticker'))
                    {
                        //create history ticker variable if not defined
                        wizmo.pageStore('var_routes_history_ticker', '');
                    }

                    route_data_history_str = wizmo.pageStore('var_routes_history_ticker');

                    if(!regex_test_url_obj.test(location_href_all_str))
                    {
                        //push state to history
                        if(!route_main_fn_disable_hashchange_bool)
                        {
                            window.history.pushState({page: path_str}, "", path_hash_full_str);
                            //push to local history ticker
                            wizmo.pageStore('var_routes_history_ticker', path_hash_full_str);
                        }
                    }
                }
                else
                {
                    //update hash
                    path_hash_full_str = (_w.isString(route_main_fn_path_hash_str)) ? route_main_fn_path_hash_str : path_hash_str;

                    if(!route_main_fn_disable_hashchange_bool)
                    {
                        window.location.hash = path_hash_full_str;
                    }
                }

                hashchange_main_fn(is_forward_evented_bool, route_main_fn_path_hash_str);
            };

            //save route path in window storage
            if(!data_route_obj)
            {
                //initialize
                wQuery.data('w_var_routes_id', []);
                wQuery.data('w_var_routes_meta', []);

                data_route_obj = wQuery.data('w_var_routes_id');
            }

            //check if route path has been saved
            if(!_w.in_array(path_str, data_route_obj)) {
                //persist route data
                wQuery.data('w_var_routes_id').push(path_str);
                wQuery.data('w_var_routes_meta').push(options_meta_obj);
            }

            //get all links
            elem_a_obj = elem_body_obj.find('a');
            elem_a_obj_length_int = elem_a_obj.length;

            //create function to detect changes in DOM links
            var domLinkChangeDetectFn = function(elem_link_obj)
            {
                var elem_link_item_obj,
                    elem_link_item_obj_href_str,
                    elem_link_item_obj_href_arr = [],
                    elem_link_item_obj_class_str,
                    elem_link_item_obj_class_arr = [],
                    elem_link_item_obj_id_str,
                    elem_link_item_obj_id_arr = [],
                    elem_link_obj_hash_str = '',
                    elem_link_obj_len_int = elem_link_obj.length,
                    elem_link_change_hash_register_arr,
                    result_bool = false
                    ;

                //create register if not exists
                elem_link_change_hash_register_arr = wQuery.data('w_dom_link_change_hash_register');
                if(!elem_link_change_hash_register_arr)
                {
                    wQuery.data('w_dom_link_change_hash_register', []);
                }

                //do only if link exists
                if(elem_link_obj_len_int > 0)
                {
                    elem_link_obj.each(function()
                    {
                        //get href, class, and id
                        elem_link_item_obj = $(this);
                        elem_link_item_obj_href_str = (elem_link_item_obj.attr('href')) ? elem_link_item_obj.attr('href') : '';
                        elem_link_item_obj_class_str = (elem_link_item_obj.attr('class')) ? elem_link_item_obj.attr('class') : '';
                        elem_link_item_obj_id_str = (elem_link_item_obj.attr('id')) ? elem_link_item_obj.attr('id') : '';

                        //post to array
                        elem_link_item_obj_href_arr.push(elem_link_item_obj_href_str);
                        elem_link_item_obj_class_arr.push(elem_link_item_obj_class_str);
                        elem_link_item_obj_id_arr.push(elem_link_item_obj_id_str);
                    });

                    //implode to string hash
                    elem_link_obj_hash_str = _w.implode('-', elem_link_item_obj_href_arr)+'|'+_w.implode('-', elem_link_item_obj_class_arr)+'|'+_w.implode('-', elem_link_item_obj_id_arr);

                    //persist if not exists
                    if(!_w.in_array(elem_link_obj_hash_str, elem_link_change_hash_register_arr))
                    {
                        wQuery.data('w_dom_link_change_hash_register').push(elem_link_obj_hash_str);
                        result_bool = true;
                    }
                }

                return result_bool;
            };

            //manage click handler
            if(domLinkChangeDetectFn(elem_a_obj) || wizmo.domStore('var_flag_refresh_event_listener_register'))
            {
                if(elem_a_obj_length_int > 0 && options_add_click_bool)
                {
                    var link_with_route_hash_exists_bool,
                        link_regex_pattern_str = ""+options_hash_char_str+"(|[^\\s]*) *$",
                        link_regex_obj = new RegExp(link_regex_pattern_str, "i")
                        ;

                    elem_a_obj.each(function()
                    {
                        //get link object
                        elem_a_item_obj = $(this);

                        //check if there are links
                        elem_a_item_obj_href_str = elem_a_item_obj.attr('href');

                        /**
                         * Add click handler
                         * 1: if href is not blank
                         * 2: link with route hash character detected
                         */
                        link_with_route_hash_exists_bool = link_regex_obj.test(elem_a_item_obj_href_str);
                        if(_w.isString(elem_a_item_obj_href_str) && elem_a_item_obj_href_str.length > 0 && link_with_route_hash_exists_bool)
                        {
                            //elem_a_item_obj.on('click', elem_a_obj_handler_fn, true);
                            elem_a_item_obj.on('click', function(event)
                            {
                                var elem_click_href_str = $(this).attr('href');

                                //prevent default action
                                wQuery.preventDefault(event);

                                //run route
                                route_main_fn(true, elem_click_href_str);

                            }, true);
                        }
                    });
                }

                //flag
                wizmo.domStore('var_flag_refresh_event_listener_register', false);
            }

            //run route manually if specified
            if(options_go_route_bool)
            {
                route_main_fn(true, path_hash_str, options_disable_hashchange_bool);
            }

            //initialize hash change event handler once
            if(!wizmo.domStore('var_route_init_event_handler_hashchange'))
            {
                //setup event handler once
                elem_win_obj.on('hashchange', function() {
                    hashchange_main_fn();
                });

                wizmo.domStore('var_route_init_event_handler_hashchange', true);
            }

            //initialize route on load
            if(!wizmo.domStore('var_route_init_url_is_routed'))
            {
                var regex_test_str = ""+path_hash_str+"(|\\?[^\\s]*) *$";
                var regex_test_obj = new RegExp(regex_test_str, "i");
                var is_routed_url_to_path_bool = regex_test_obj.test(url_str);
                if(is_routed_url_to_path_bool)
                {
                    //run route manually
                    route_main_fn(true, path_hash_str);
                }

                //flag
                wizmo.domStore('var_route_init_url_is_routed', true);
            }
        }


        /**
         * Provides simple to advanced routing functionality
         */
        wizmo_obj.route = {
            /**
             * Adds a route and activates a click handler
             * Usage: wizmo.route.add("/route_1", function(){console.log("");})
             * This method will automatically attach itself to a click handler
             * For example, if you have <a href="#/route_1">Route 1</a> in your code and add a route with path_str == "route_1", clicking on the link will automatically trigger the route
             * @param path_str {String} the route id
             * @param options_obj {Object} the options
             * See _route method for details
             */
            click: function(path_str){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = (myArgs[1]) ? myArgs[1] : {}
                    ;

                //set defaults
                options_obj.add_click = (options_obj.add_click) ? options_obj.add_click : true;

                //add route
                _route(path_str, options_obj);
                return this;
            },
            /**
             * Triggers a route manually
             * Usage: wizmo.route.go("#/route_1", function(){console.log("");})
             * This method will navigate directly to a route
             * @param path_str {String} the route id
             * @param options_obj {Object} the options
             * See _route method for details
             */
            go: function(path_str){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = (myArgs[1]) ? myArgs[1] : {}
                    ;

                //set defaults
                options_obj.go = true;

                //add route
                _route(path_str, options_obj);
            },
            /**
             * Runs a route + fetches a view and adds it to the DOM
             * @param {String} path_str the route identifier
             * @param {String} fetch_url_str the URL of the path to fetch
             * @param {Object} options_obj the options
             *
             * target: The identifier of the DOM element where the fetched view will be inserted. For example, if you want the view injected into "<div id='my-view-target'></div>", then the value is 'my-view-target'
             *
             * template: This is an object that can be used to pre-compile [or pre-process] HTML before it is injected
             * Assuming your view file has the following contents
             * <p>{{first_name}}</p>
             * <p>{{last_name}}</p>
             *
             * And your template object is:
             *
             * {first_name: 'Joe', last_name: 'Moe'}
             *
             * The final HTML will be:
             *
             * <p>Joe</p>
             * <p>Moe</p>
             *
             * post_method: This specifies how the contents of the fetched file will be injected into the DOM.
             * The valid options are:
             *  - replace (default)
             *  - append
             *  - prepend
             *
             * post_block: a regular expression string that will prevent the view from being inserted if it resolves to true. This is used to prevent a view from being inserted multiple times on multiple calls.
             *
             * cache_expiry: the lifetime (in seconds) of the cache of the fetched item. Whenever the view is fetched, it is also cached in storage. Value must be an integer. When not defined, lifetime is unlimited
             *
             * scroll: If true, will scroll to target after routing
             *
             * scroll_offset: The offset of the scroll
             *
             * scroll_speed: The speed of the scroll in seconds
             *
             * scroll_callback: The callback that will be executed post-scroll
             *
             * callback_pre: a callback function to be executed before the view is fetched and injected. The function will be passed one argument:
             * 1. the URL to the fetched view
             *
             * callback_post: a callback function to be executed after the view is fetched and injected. The function will be passed four arguments:
             * 1. the URL to the fetched view
             * 2. the target object
             * 3. the fetched HTML of the view
             * 4. the final HTML to be injected
             *
             */
            fetch: function(path_str, fetch_url_str){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = myArgs[2],
                    options_final_obj;

                //initialize options if not set
                if(!options_obj)
                {
                    options_obj = {};
                }

                options_final_obj = options_obj;

                //set defaults
                options_final_obj.hash_char = (!options_obj.hash_char) ? '#/' : options_obj.hash_char;
                options_final_obj.fetch_url = (!options_obj.fetch_url) ? fetch_url_str : options_obj.fetch_url;

                //set options
                options_final_obj.fetch_target = (options_obj.target) ? options_obj.target : undefined;
                options_final_obj.fetch_post_method = (options_obj.post_method) ? options_obj.post_method : undefined;
                options_final_obj.fetch_cache_expiry = (options_obj.cache_expiry) ? options_obj.cache_expiry : undefined;
                options_final_obj.fetch_post_block = (options_obj.post_block) ? options_obj.post_block : undefined;
                options_final_obj.fetch_template = (options_obj.template) ? options_obj.template : undefined;
                options_final_obj.fetch_callback_pre = (options_obj.callback_pre) ? options_obj.callback_pre : undefined;
                options_final_obj.fetch_callback_post = (options_obj.callback_post) ? options_obj.callback_post : undefined;
                options_final_obj.scroll_route = !!((options_obj.scroll));
                options_final_obj.scroll_offset = (options_obj.scroll_offset) ? options_obj.scroll_offset : undefined;
                options_final_obj.scroll_speed = (options_obj.scroll_speed) ? options_obj.scroll_speed : undefined;
                options_final_obj.scroll_callback = (options_obj.scroll_callback) ? options_obj.scroll_callback : undefined;

                //run
                _route(path_str, options_final_obj);
            },
            /**
             * Enables a special routing feature called link-porting
             * Linkporting lets you use a specially-formatted URL to fetch and inject content into the DOM automatically
             *
             * There are two components to this:
             * 1. The URL: the URL provides an embedded reference to the view file which is to be fetched
             * For example, say we have the following url:
             * http://wizmo.io/index.html#my-view-file
             * #my-view-file is a reference to the HTML file named my-view-file.html
             * 2. The View: the view is a HTML file that is referenced in the hash section of the URL.
             * This view file must have the following format
             *
             * <!-- #target -->
             * <!-- rest of the HTML -->
             *
             * Note: <!-- rest of the HTML --> must be replaced with actual HTML content
             *
             * A valid example would be:
             *
             * <!-- #target -->
             * <div></div>
             *
             * Note: The first line must be a HTML comment identifying where the reference is to be injected. The above comment specifies that the HTML will be injected into a DOM element with id="target"
             *
             * @param {Object} options_obj the options
             *
             * basedir: The base directory of the view file. If your view file is located in a sub-directory e.g. my_views, then supply the value 'my_views' as the basedir
             * You can also use a document-relative path
             * for example, if your current url is:
             *
             * http://wizmo.io/dir_1/dir_2/dir_3/index.html
             *
             * and your basedir is '../dir_4', the directory that will be accessed to get the view will be:
             *
             * http://wizmo.io/dir_1/dir_2/dir_4
             *
             *
             * target: This specifies where the view should be injected. Simply provide the identifier of the DOM element. For example, if you want the view injected into "<div id='my-view-target'></div>", then the value is 'my-view-target'
             *
             * Note: This value overrides the value that is in the view file by convention
             *
             * post_method: This specifies how the contents of the view file will be injected into the DOM.
             * The valid options are:
             *  - replace (default)
             *  - append
             *  - prepend
             *
             * template: This is an object that can be used to pre-compile [or pre-process] HTML before it is injected
             * Assuming your view file has the following contents
             * <!-- #target -->
             * <p>{{first_name}}</p>
             * <p>{{last_name}}</p>
             *
             * And your template object is
             *
             * {first_name: 'Joe', last_name: 'Moe'}
             *
             * The final HTML will be:
             *
             * <p>Joe</p>
             * <p>Moe</p>
             *
             * You can also activate the template using the query string of the link.
             * For example, say you navigate to http://wizmo.io/index.html?first_name=Joe&last_name=Public#my-view-file
             *
             * A template object will be automatically generated to look like this:
             *
             * {first_name: 'Joe', last_name: 'Public'}
             *
             * callback_pre: a callback function to be executed before the view is fetched and injected. The function will be passed one argument:
             * 1. the URL to the view
             *
             * callback_post: a callback function to be executed after the view is fetched and injected. The function will be passed four arguments:
             * 1. the URL to the view
             * 2. the target object
             * 3. the fetched HTML of the view
             * 4. the final HTML to be injecte
             *
             */
            linkport: function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = (myArgs[0]) ? myArgs[0] : {},
                    url_str = (_w.isString(options_obj.url) && options_obj.url.length > 0) ? options_obj.url : _getUrl(),
                    url_query_str = _getUrl('query', url_str),
                    url_hash_str = _getUrl('hash', url_str),
                    template_ctx_obj = (_w.isObject(options_obj.template)) ? options_obj.template : undefined,
                    basedir_str = (_w.isString(options_obj.basedir) && options_obj.basedir.length > 0) ? options_obj.basedir : '_view',
                    target_str = (_w.isString(options_obj.target) && options_obj.target.length > 0) ? options_obj.target : undefined,
                    post_method_str = (_w.isString(options_obj.post_method) && options_obj.post_method.length > 0) ? options_obj.post_method : 'replace',
                    pre_callback_fn = (options_obj.callback_pre) ? options_obj.callback_pre : null,
                    post_callback_fn = (options_obj.callback_post) ? options_obj.callback_post : null,
                    options_final_obj = {},
                    url_query_value_str,
                    url_hash_value_str,
                    url_fetch_str
                    ;

                //return false if hash is not valid
                if(!/^.+?\#.+?/i.test(url_str))
                {
                    return false;
                }

                //get the hash value i.e. without hash character
                url_hash_value_str = url_hash_str.replace(/^#/, '');

                //compose fetch url
                url_fetch_str = basedir_str+'/'+ url_hash_value_str+'.html';

                //convert url query to template object
                if(url_query_str && !template_ctx_obj)
                {
                    url_query_value_str = url_query_str.replace(/^\?/, '');
                    template_ctx_obj = _w.stringToArray(url_query_value_str, '&', '=', true);
                }

                //define options
                options_final_obj.fetch_url = url_fetch_str;
                options_final_obj.fetch_target = target_str;
                options_final_obj.fetch_post_method = post_method_str;
                options_final_obj.fetch_template = template_ctx_obj;
                options_final_obj.fetch_callback_pre = pre_callback_fn;
                options_final_obj.fetch_callback_post = post_callback_fn;

                options_final_obj.fetch_linkport = true;
                options_final_obj.go = true;
                options_final_obj.nohashchange = true;

                //run
                _route('_no_route', options_final_obj);
            },
            /**
             * Enables single-page routing functionality
             * @param {String} path_str the route
             * @param {Object} options_obj the options
             *
             * source: the URL [or HTML] of the view
             *
             * target: an identifier specifying where the view is inserted
             * For example, if you wanted the view to be inserted in
             * '<div id="my-target"></div>', then target === 'my-target'
             *
             * super_target: This is identical to the target option. However, it is used to apply the option across all individual calls in a '.when' chain.
             *
             * So, instead of writing this
             *
             * wizmo.route
             *  .when('/', {source: 'first.html', target: 'my-target'})
             *  .when('/second', {source: 'second.html', target: 'my-target'})
             *  .when('/third', {source: 'third.html', target: 'my-target'})
             *
             * you can write this
             *
             * wizmo.route
             *  .when('/', {source: 'first.html', super_target: 'my-target'})
             *  .when('/second', {source: 'second.html'})
             *  .when('/third', {source: 'third.html'})
             *
             *
             * postmode: defines how the view will be inserted into the target
             * Either 'append', 'prepend', or 'replace' [Default]
             * Note that when no target is provided, 'append' is the default condition
             *
             * super_postmode: This is identical to the postmode option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * template: This is an object that can be used to pre-compile [or pre-process] HTML before it is injected
             * Assuming your target file has the following contents
             * <p>{{first_name}}</p>
             * <p>{{last_name}}</p>
             *
             * And your template object is
             *
             * {first_name: 'Joe', last_name: 'Moe'}
             *
             * The final HTML will be:
             *
             * <p>Joe</p>
             * <p>Moe</p>
             *
             * super_template: This is identical to the template option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * scroll: if true, will scroll
             *
             * super_scroll: This is identical to the scroll option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * scroll_offset: the scroll offset (in pixels)
             *
             * super_scroll_offset: This is identical to the scroll_offset option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * scroll_speed: the scroll speed (in milliseconds)
             *
             * super_scroll_speed: This is identical to the scroll_speed option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * scroll_callback: a callback function to run post-scroll
             *
             * super_scroll_callback: This is identical to the scroll_callback option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * callback: a callback function to run pre-fetch
             *
             * super_callback: This is identical to the callback option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * callback_post: a callback function to run post-fetch
             *
             * super_callback_post: This is identical to the callback_post option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * callback_args: the arguments that will be passed to callback and/or callback_post
             *
             * super_callback_args: This is identical to the callback_args option. However, it is used to apply the option across all individual calls in a '.when' chain. See example in super_target
             *
             * @return this
             */
            when: function(path_str, options_obj){

                var url_str = _getUrl(),
                    url_hash_str = _getUrl('hs', url_str),
                    url_hash_clean_str,
                    links_elem_obj,
                    links_href_arr = [],
                    is_click_route_bool,
                    is_routed_url_to_path_bool,
                    regex_test_str,
                    regex_test_obj,
                    path_clean_str,
                    path_route_str,
                    options_final_obj = {},
                    target_super_str = wizmo.domStore('var_route_when_target_super'),
                    template_super_str = wizmo.domStore('var_route_when_template_super'),
                    postmode_super_str = wizmo.domStore('var_route_when_postmode_super'),
                    scroll_super_str = wizmo.domStore('var_route_when_scroll_super'),
                    scrolloffset_super_str = wizmo.domStore('var_route_when_scrolloffset_super'),
                    scrollcallback_super_str = wizmo.domStore('var_route_when_scrollcallback_super'),
                    scrollspeed_super_str = wizmo.domStore('var_route_when_scrollspeed_super'),
                    hash_char_super_str = wizmo.domStore('var_route_when_hash_char_super'),
                    callback_super_str = wizmo.domStore('var_route_when_callback_super'),
                    callback_post_super_str = wizmo.domStore('var_route_when_callback_post_super'),
                    callback_args_super_str = wizmo.domStore('var_route_when_callback_args_super'),
                    exec_route_bool
                    ;

                //set route option defaults
                options_final_obj.fetch_url = (options_obj.source) ? options_obj.source : undefined;
                options_final_obj.fetch_target = (options_obj.target) ? options_obj.target : undefined;
                options_final_obj.fetch_template = (options_obj.template) ? options_obj.template : undefined;
                options_final_obj.fetch_post_method = (options_obj.postmode) ? options_obj.postmode : 'replace';
                options_final_obj.fetch_callback_pre = (options_obj.callback) ? options_obj.callback : undefined;
                options_final_obj.fetch_callback_post = (options_obj.callback_post) ? options_obj.callback_post : undefined;
                options_final_obj.fetch_callback_args = (options_obj.callback_args) ? options_obj.callback_args : undefined;
                options_final_obj.hash_char = '#/';
                options_final_obj.scroll_route = !!((options_obj.scroll));

                //set other route options
                options_final_obj.scroll_offset = options_obj.scroll_offset;
                options_final_obj.scroll_speed = options_obj.scroll_speed;
                options_final_obj.scroll_callback = options_obj.scroll_callback;

                //clean path and url hash i.e. remove route/hash character(s)
                path_clean_str = path_str.replace(options_final_obj.hash_char, '');
                url_hash_clean_str = url_hash_str.replace(options_final_obj.hash_char, '');

                //get link data
                links_elem_obj = $('a');
                if(links_elem_obj.length > 0)
                {
                    links_elem_obj.each(function(){
                        links_href_arr.push($(this).attr('href'));
                    });
                }

                //determine if there are click references for routes
                is_click_route_bool = !!((links_href_arr.length > 0 && _w.in_array(path_str, links_href_arr)));


                //set super options
                //super_target
                if(options_obj.super_target)
                {
                    wizmo.domStore('var_route_when_target_super', options_obj.super_target);
                    target_super_str = options_obj.super_target;
                }

                //super_template
                if(options_obj.super_template)
                {
                    wizmo.domStore('var_route_when_template_super', options_obj.super_template);
                    template_super_str = options_obj.super_template;
                }

                //postmode
                if(options_obj.super_postmode)
                {
                    wizmo.domStore('var_route_when_postmode_super', options_obj.super_postmode);
                    postmode_super_str = options_obj.super_postmode;
                }

                //callback
                if(options_obj.super_callback)
                {
                    wizmo.domStore('var_route_when_callback_super', options_obj.super_callback);
                    callback_super_str = options_obj.super_callback;
                }

                //callback_post
                if(options_obj.super_callback_post)
                {
                    wizmo.domStore('var_route_when_callback_post_super', options_obj.super_callback_post);
                    callback_post_super_str = options_obj.super_callback_post;
                }

                //callback_args
                if(options_obj.super_callback_args)
                {
                    wizmo.domStore('var_route_when_callback_args_super', options_obj.super_callback_args);
                    callback_args_super_str = options_obj.super_callback_args;
                }

                //hash_char
                if(options_obj.super_hash_char)
                {
                    wizmo.domStore('var_route_when_hash_char_super', options_obj.super_hash_char);
                    hash_char_super_str = options_obj.super_hash_char;
                }

                //scroll
                if(options_obj.super_scroll)
                {
                    wizmo.domStore('var_route_when_scroll_super', options_obj.super_scroll);
                    scroll_super_str = options_obj.super_scroll;
                }

                //scroll_callback
                if(options_obj.super_scroll_callback)
                {
                    wizmo.domStore('var_route_when_scrollcallback_super', options_obj.super_scroll_callback);
                    scrollcallback_super_str = options_obj.super_scroll_callback;
                }

                //scroll_offset
                if(options_obj.super_scroll_offset)
                {
                    wizmo.domStore('var_route_when_scrolloffset_super', options_obj.super_scroll_offset);
                    scrolloffset_super_str = options_obj.super_scroll_offset;
                }

                //scroll_speed
                if(options_obj.super_scroll_speed)
                {
                    wizmo.domStore('var_route_when_scrollspeed_super', options_obj.super_scroll_speed);
                    scrollspeed_super_str = options_obj.super_scroll_speed;
                }


                //override target, template, postmode, callback_pre, callback_post, callback_args, hash_char, scroll_route, scroll_callback, scroll_offset, scroll_speed
                options_final_obj.fetch_target = (target_super_str && !options_final_obj.fetch_target) ? target_super_str : options_final_obj.fetch_target;
                options_final_obj.fetch_template = (template_super_str && !options_final_obj.fetch_template) ? template_super_str : options_final_obj.fetch_template;
                options_final_obj.fetch_post_method = (postmode_super_str && !options_final_obj.fetch_post_method) ? postmode_super_str : options_final_obj.fetch_post_method;
                options_final_obj.fetch_callback_pre = (callback_super_str && !options_final_obj.fetch_callback_pre) ? callback_super_str : options_final_obj.fetch_callback_pre;
                options_final_obj.fetch_callback_post = (callback_post_super_str && !options_final_obj.fetch_callback_post) ? callback_post_super_str : options_final_obj.fetch_callback_post;
                options_final_obj.fetch_callback_args = (callback_args_super_str && !options_final_obj.fetch_callback_args) ? callback_args_super_str : options_final_obj.fetch_callback_args;
                options_final_obj.hash_char = (hash_char_super_str && !options_final_obj.hash_char) ? hash_char_super_str : options_final_obj.hash_char;
                options_final_obj.scroll_route = (scroll_super_str && !options_final_obj.scroll_route) ? scroll_super_str : options_final_obj.scroll_route;
                options_final_obj.scroll_callback = (scrollcallback_super_str && !options_final_obj.scroll_callback) ? scrollcallback_super_str : options_final_obj.scroll_callback;
                options_final_obj.scroll_offset = (scrolloffset_super_str && !options_final_obj.scroll_offset) ? scrolloffset_super_str : options_final_obj.scroll_offset;
                options_final_obj.scroll_speed = (scrollspeed_super_str && !options_final_obj.scroll_speed) ? scrollspeed_super_str : options_final_obj.scroll_speed;

                //ensure postmode cannot be 'replace' when target option is not defined. This prevents the whole $('body') from being replaced
                if(!options_final_obj.fetch_target && !target_super_str)
                {
                    options_final_obj.fetch_post_method = 'append';
                }

                //determine whether the url is currently routed
                regex_test_str = "\\#\\/"+path_clean_str+"$";
                regex_test_obj = new RegExp(regex_test_str, "i");
                is_routed_url_to_path_bool = regex_test_obj.test(url_str);

                //check if current url has route path
                if(is_routed_url_to_path_bool)
                {
                    path_route_str = url_hash_clean_str;

                    exec_route_bool = true;
                }

                //check if click references for routes exist
                if (is_click_route_bool)
                {
                    path_route_str = path_clean_str;

                    options_final_obj.add_click = true;
                    exec_route_bool = true;
                }

                //execute route if required
                if(exec_route_bool)
                {
                    _route(path_route_str, options_final_obj);
                }

                return this;
            }
        };

        /**
         * Registers a url in the non-native cache register
         * @param {String} url_str the url to add to the register
         * @private
         */
        function _cacheAddToRegister(url_str)
        {
            if(_w.isString(url_str) && url_str.length > 0)
            {
                //add to register
                wizmo.storePush('var_cache_register', url_str, undefined, true);
            }
        }

        /**
         * Gets the non-native cache register
         * @private
         */
        function _cacheGetRegister()
        {
            return wizmo.store('var_cache_register');
        }

        /**
         * Deletes the non-native cache register
         * @private
         */
        function _cacheDeleteRegister()
        {
            return wizmo.store('var_cache_register', []);
        }

        /**
         * Clears the non-native cache register
         * @param {String} url_str_or_arr a single url, or a list of urls to remove
         * Note: This is optional. If undefined, the whole register is deleted
         * @returns {Boolean}
         * @private
         */
        function _cacheClearRegister()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                url_str_or_arr = myArgs[0],
                url_arr = [],
                url_fqdn_arr = [],
                url_arr_fqdn_item_str,
                is_clear_all_bool = false,
                cache_register_arr,
                cache_register_item_str,
                cache_register_item_regex_str,
                cache_register_updated_arr = []
                ;

            if(!(_w.isArray(url_str_or_arr) || _w.isString(url_str_or_arr)))
            {
                is_clear_all_bool = true;
            }
            else
            {
                url_arr = (_w.isString(url_str_or_arr)) ? url_str_or_arr.split(',') : url_str_or_arr;
            }

            //get cache register
            cache_register_arr = _cacheGetRegister();

            //clear cache register
            if(is_clear_all_bool)
            {
                _cacheDeleteRegister();
            }
            else
            {
                if(_w.isArray(cache_register_arr) || cache_register_arr.length > 0)
                {
                    //generate fqdn url list
                    for(var h = 0; h < url_arr.length; h++)
                    {
                        url_arr_fqdn_item_str = _resolveDirectoryToURL(url_arr[h]);
                        url_fqdn_arr.push(url_arr_fqdn_item_str);
                    }

                    //refresh cache register
                    for(var i = 0; i < cache_register_arr.length; i++)
                    {
                        cache_register_item_str = cache_register_arr[i];
                        cache_register_item_regex_str = cache_register_item_str+'[^\s]*? *$';

                        if(!_w.in_array(cache_register_item_regex_str, url_fqdn_arr, undefined, true))
                        {
                            cache_register_updated_arr.push(cache_register_item_str);
                        }
                    }

                    //update cache register
                    if(cache_register_updated_arr.length > 0)
                    {
                        wizmo.store('var_cache_register', cache_register_updated_arr);
                    }
                }
            }
        }

        /**
         * Creates a store key for cache register entries
         * @param {String} url_str the url of the file to be cached
         * @returns {*}
         * @private
         */
        function _cacheUrlStoreHashKey(url_str)
        {
            var url_hash_code_str,
                store_hash_key_str,
                url_filename_str,
                url_filename_hash_str;

            //generate hash code
            url_hash_code_str = Math.abs(_w.hashCode(url_str));
            url_hash_code_str = ''+url_hash_code_str;

            //get filename
            url_filename_str = _getUrl('f', url_str);
            url_filename_hash_str = url_filename_str.replace(/\:\/\/|[\.\/\=]/ig, "_");

            store_hash_key_str = 'var_cache_url_'+url_hash_code_str+'_'+url_filename_hash_str;

            return store_hash_key_str;
        }

        /**
         * Caches an item
         * @param {String|Array} url_str_or_arr the url, or list of urls to cache
         * @param {Boolean} unique_bool If true, will not re-cache already cached items
         * @return {Boolean}
         * @private
         */
        function _cacheAdd(url_str_or_arr)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                unique_bool = (_w.isBool(myArgs[1])) ? myArgs[1] : true,
                url_arr,
                url_fqdn_arr = [],
                url_arr_item_str,
                url_arr_item_fqdn_str,
                cache_req_item_str,
                cache_req_url_arr = [],
                unique_cache_arr = [],
                cache_list_arr,
                cache_register_arr
                ;

            if(!(_w.isArray(url_str_or_arr) || _w.isString(url_str_or_arr)))
            {
                return false;
            }

            //cast url(s) to array
            url_arr = (_w.isString(url_str_or_arr)) ? url_str_or_arr.split(',') : url_str_or_arr;

            //normalize url array
            for(var i = 0; i < url_arr.length; i++)
            {
                url_arr_item_str = url_arr[i];

                //get full resolved path
                url_arr_item_fqdn_str = _resolveDirectoryToURL(url_arr_item_str);
                url_fqdn_arr.push(url_arr_item_fqdn_str);
            }

            if(('caches' in window) && _w.config.cacheNative)
            {
                //native cache support

                caches.open('w-cache').then(function(cache_obj){

                    //get all cached requests
                    cache_obj.keys().then(function(cache_req_arr){

                        if(_w.isArray(cache_req_arr) && cache_req_arr.length > 0)
                        {
                            for(var i = 0; i < cache_req_arr.length; i++)
                            {
                                cache_req_item_str = cache_req_arr[i]['url'];
                                cache_req_url_arr.push(cache_req_item_str);
                            }
                        }

                        for(var i = 0; i < url_fqdn_arr.length; i++)
                        {
                            url_arr_item_fqdn_str = url_fqdn_arr[i];
                            if(!_w.in_array(url_arr_item_fqdn_str, cache_req_url_arr))
                            {
                                unique_cache_arr.push(url_arr_item_fqdn_str);
                            }
                        }

                        //add to cache
                        cache_obj.addAll(url_fqdn_arr).then(function(){});

                        //add to non-native cache register
                        for(var i = 0; i < url_fqdn_arr.length; i++)
                        {
                            _cacheAddToRegister(url_fqdn_arr[i]);
                        }
                    });
                });
            }
            else
            {
                //no native cache support - fallback

                //get all cached requests
                cache_register_arr = _cacheGetRegister();
                cache_register_arr = (_w.isArray(cache_register_arr) && cache_register_arr.length > 0) ? cache_register_arr : [];

                for(var i = 0; i < url_fqdn_arr.length; i++)
                {
                    url_arr_item_fqdn_str = url_fqdn_arr[i];
                    if(!_w.in_array(url_arr_item_fqdn_str, cache_register_arr))
                    {
                        unique_cache_arr.push(url_arr_item_fqdn_str);
                    }
                }

                //generate cache list
                cache_list_arr = (unique_bool) ? unique_cache_arr : url_fqdn_arr;

                //pseudo cache asset
                for(var i = 0; i < cache_list_arr.length; i++)
                {
                    //cache the asset
                    _cacheAddAsset(cache_list_arr[i]);
                }
            }
        }

        /**
         * Gets the content of a cached asset
         * @param {String} url_str the url of the cacheable asset
         * @return {String}
         * @private
         */
        function _cacheGet(url_str)
        {
            //return if no url
            if(!_w.isString(url_str))
            {
                return;
            }

            //create variables
            var url_fqdn_str = _resolveDirectoryToURL(url_str),
                url_fqdn_regex_str = url_fqdn_str+'[^\s]*? *$',
                cache_req_item_str,
                cache_req_url_arr = []
                ;

            return new Promise(function(resolve)
            {
                if(('caches' in window) && _w.config.cacheNative)
                {
                    //native cache support

                    caches.open('w-cache').then(function(cache_obj) {

                        //get all cached requests
                        cache_obj.keys().then(function (cache_req_arr) {

                            //get list of urls in cache
                            if(_w.isArray(cache_req_arr) && cache_req_arr.length > 0)
                            {
                                for(var i = 0; i < cache_req_arr.length; i++)
                                {
                                    cache_req_item_str = cache_req_arr[i]['url'];
                                    cache_req_url_arr.push(cache_req_item_str);
                                }
                            }

                            //get only if in cache
                            if(_w.in_array(url_fqdn_regex_str, cache_req_url_arr, undefined, true))
                            {
                                $.ajax(url_str).then(function(response){
                                    resolve(response);
                                });
                            }
                            else
                            {
                                resolve(null);
                            }
                        });
                    });
                }
                else
                {
                    //native cache support

                    var cache_store_key_str = _cacheUrlStoreHashKey(url_fqdn_str);
                    var cache_item_type_str = _cacheGetAssetType(url_fqdn_str);

                    if(cache_item_type_str === 'html' || cache_item_type_str === 'data')
                    {
                        resolve(wizmo.store(cache_store_key_str));
                    }

                    resolve(false);
                }
            });
        }

        /**
         * Checks if an asset is cached
         * @param {String} url_str the url to the cacheable asset
         * @return {Boolean|*}
         * @private
         */
        function _cacheCheck(url_str)
        {
            //return null if not valid url
            if(!(_w.isString(url_str) && url_str.length > 0))
            {
                return null;
            }

            //generate fully-qualified URL
            var cache_register_arr,
                url_fqdn_str = _resolveDirectoryToURL(url_str)
                ;

            //get all cached requests
            cache_register_arr = _cacheGetRegister();
            cache_register_arr = (_w.isArray(cache_register_arr) && cache_register_arr.length > 0) ? cache_register_arr : [];

            if(cache_register_arr.length > 0)
            {
                return (_w.in_array(url_fqdn_str, cache_register_arr));
            }

            return false;
        }

        /**
         * Determine the type of the cacheable asset
         * @param {String} url_str the url of the cacheable asset
         * @private
         */
        function _cacheGetAssetType(url_str)
        {
            var cache_asset_type_str;

            if(/\.(?:htm|html)(\?[^\s]*?|) *$/i.test(url_str))
            {
                cache_asset_type_str = 'html';
            }
            else if(/\.(?:png|gif|jpg|css|js)(\?[^\s]*?|) *$/i.test(url_str))
            {
                cache_asset_type_str = 'file';
            }
            else if(/\.(?:json|csv|xml)(\?[^\s]*?|) *$/i.test(url_str))
            {
                cache_asset_type_str = 'data';
            }

            return cache_asset_type_str;
        }

        /**
         * Adds an asset to the cache
         * @param {String} url_str the url of the cacheable asset
         * @param {String} options_obj the cache options
         * @private
         */
        function _cacheAddAsset(url_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1],
                cache_asset_type_str
            ;

            cache_asset_type_str = _cacheGetAssetType(url_str);

            if(cache_asset_type_str === 'html')
            {
                return _cacheAddHTML(url_str, options_obj);
            }
            else if (cache_asset_type_str === 'file')
            {
                return _cacheAddFile(url_str, options_obj);
            }
            else if(cache_asset_type_str === 'data')
            {
                return _cacheAddData(url_str, options_obj);
            }

            return false;
        }

        /**
         * Cache a HTML file to sessionStorage/localStorage
         * It will also retrieve cached value if data_str is undefined
         * @param {String} url_str the URL to the HTML file to cache
         * @param {Object} options_obj the options
         * cache_stub: defines what portion of HTML will be cached. If true [default], it will cache everything inside <body></body>. If false, will cache entire HTML page
         * expiry: the cache duration in seconds. Default is 0 [forever]
         * store_type: the storage type/method to use. Either 'ls' for localStorage, or 'ss' for sessionStorage [default]
         * @return String|Promise
         * @private
         */
        function _cacheAddHTML(url_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1],
                cache_stub_bool = true,
                expiry_int = 0,
                store_type_str = '',
                store_options_obj,
                cache_store_key_str,
                data_result_str
                ;

            if(_w.isObject(options_obj))
            {
                cache_stub_bool = (_w.isBool(options_obj.cache_stub)) ? options_obj.cache_stub : cache_stub_bool;
                expiry_int = (options_obj.expiry && _w.isNumber(options_obj.expiry) && options_obj.expiry > 0) ? options_obj.expiry : expiry_int;
                store_type_str = (options_obj.store_type && _w.isString(options_obj.store_type) && options_obj.store_type.length > 0) ? options_obj.store_type : store_type_str;
            }

            //setup options
            if(expiry_int > 0)
            {
                expiry_int = expiry_int * 1000;
                store_options_obj = {expires: expiry_int};
            }

            //set default storage type
            if(!_w.in_array(store_type_str, ['ls', 'ss']))
            {
                store_type_str = 'ss';
            }

            //create core caching function
            var _cache_fn = function(url_str, data_str, cache_stub_bool, store_type_str, options_obj)
            {
                if(!wizmo.store('var_cache_counter'))
                {
                    wizmo.store('var_cache_counter', 0);
                }

                cache_store_key_str = _cacheUrlStoreHashKey(url_str);

                if(!data_str)
                {
                    //if data value is not provided and cached value exists, then return it
                    return (wizmo.store(cache_store_key_str)) ? wizmo.store(cache_store_key_str) : false;
                }

                if(!wizmo.storeCheck(cache_store_key_str))
                {
                    //increment cache counter
                    wizmo.storeIncrement('var_cache_counter');

                    if(cache_stub_bool)
                    {
                        var html_all_arr,
                            html_stub_str
                            ;
                        if (/<html.*?\>|<body.*?\>/igm.test(data_str)) {
                            //get html content inside body
                            html_all_arr = _w.regexMatchAll(/<body.*?\>([\s\S]*)<\/body>/igm, data_str);
                            html_stub_str = html_all_arr[0][1];
                            data_str = html_stub_str.trim();
                        }
                    }

                    //save data
                    wizmo.store(cache_store_key_str, data_str, store_type_str, options_obj);

                    //register
                    _cacheAddToRegister(url_str);

                    return false;
                }
                else
                {
                    //cached data is available
                    return true;
                }
            };

            return new Promise(function(resolve)
            {
                data_result_str = _cache_fn(url_str);
                if(data_result_str)
                {
                    //data already saved
                    resolve(data_result_str);
                }
                else
                {
                    //fetch new data
                    $.ajax(url_str)
                        .then(function(xhr_response_str){
                            _cache_fn(url_str, xhr_response_str, cache_stub_bool, store_type_str, store_options_obj);
                            resolve(xhr_response_str);
                        });
                }
            });
        }

        /**
         * Adds a block inside the HTML page that is used for pseudo-caching
         * @private
         */
        function _cacheAddAppendZone()
        {
            if(!wizmo.domStore('var_cache_pseudo_append_zone_init'))
            {
                var html_str = '<div id="w-cache-pseudo-append-zone" style="display: none;"></div>';
                $('body').append(html_str);

                wizmo.domStore('var_cache_pseudo_append_zone_init', true);
            }
        }

        /**
         * Caches a Web asset
         * Note: It pseudo-caches the asset by loading it onto the <body> of the page in a non-blocking fashion
         * @param {String} url_str the url to the cacheable asset
         * @param {Object} options_obj the cache options
         *  - tag_close: html code that will be added just before the <image> tag is closed.
         *  Note: this option applies only for cached images
         * @private
         */
        function _cacheAddFile(url_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (_w.isObject(myArgs[1])) ? myArgs[1] : {},
                tag_close_str,
                html_str,
                append_zone_obj,
                valid_file_bool = true,
                append_bool = false
                ;

            //define options
            tag_close_str = (_w.isString(options_obj.tag_close) && options_obj.tag_close.length > 0) ? ''+options_obj.tag_close : '';

            if(/\.(?:png|gif|jpg)(\?[^\s]*?|) *$/i.test(url_str))
            {
                //create append zone for pseudo-caching
                _cacheAddAppendZone();
                append_zone_obj = $('#w-cache-pseudo-append-zone');

                //setup html to be added to the zone
                html_str = '<img src="'+url_str+'"'+tag_close_str+'>';
                append_bool = true;
            }
            else if(/\.css(\?[^\s]*?|) *$/i.test(url_str))
            {
                //load

                wizmo.loadCSS(url_str, {load_loc: 'body'});
            }
            else if (/\.js(\?[^\s]*?|) *$/i.test(url_str))
            {
                //load

                wizmo.loadJS(url_str, {load_loc: 'body'});
            }
            else
            {
                valid_file_bool = false;
            }

            //Append
            if(valid_file_bool && append_bool)
            {
                append_zone_obj.append(html_str);
            }
        }

        /**
         * Cache a data file
         * @param {String} url_str the url to the cacheable data file
         * @param {Object} options_obj the options
         * @private
         */
        function _cacheAddData(url_str)
        {
            var cache_store_key_str = _cacheUrlStoreHashKey(url_str),
                data_value_str,
                store_type_str,
                options_data_obj = {}
                ;

            return new Promise(function(resolve)
            {
                //fetch new data
                $.ajax(url_str)
                    .then(function(xhr_response_str){
                        //save data
                        data_value_str = xhr_response_str;
                        wizmo.store(cache_store_key_str, data_value_str, store_type_str, options_data_obj);

                        //add to cache register
                        _cacheAddToRegister(url_str);

                        resolve(xhr_response_str);
                    });
            });
        }

        /**
         * Caches a link
         * When online, the link will act like a normal hyperlink
         * When offline, the cached content (i.e. the HTML content that the link referenced) will either be appended to the body [default behavior], or it will be added to a specific DOM element if provided in options via the target value
         * @param {String} id_str the DOM identifier of the link(s)
         * Two options are available
         * Hash prefix e.g. #my-link-id, or 'my-link-id' will get a specific link element
         * Dot prefix e.g. .cool-links will get all links with the class 'cool-links'
         * @param {Object} options_obj the options
         * target: the id of the DOM element that will receive the cached HTML when the link is clicked. Default behavior is append to body
         * stub: if true [default], will display only the HTML inside the <body> tag
         * template: the template context object that enables compilation. If provided, it will be applied on the HTML before said HTML is inserted into target
         * callback: the callback function. This callback function will be passed the cached HTML string, and the target (if provided) i.e. callback(html_str, target_str)
         * Note that when both target and callback options are defined, the default action of posting cached HTML to a target DOM element is disabled. Instead, the target reference is passed to the callback function
         * @private
         */
        function _cacheAddLink(id_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[1],
                cache_html_options_obj = {},
                target_str,
                stub_bool = true,
                template_obj,
                callback_fn,
                link_obj,
                link_obj_size_int,
                link_obj_href_str
                ;

            //define options
            if(_w.isObject(options_obj))
            {
                target_str = (options_obj.target && _w.isString(options_obj.target) && options_obj.target.length > 0) ? options_obj.target : target_str;
                stub_bool = (_w.isBool(options_obj.stub)) ? options_obj.stub : stub_bool;
                template_obj = (options_obj.template) ? options_obj.template : template_obj;
                callback_fn = (options_obj.callback) ? options_obj.callback : callback_fn;
            }

            //exit if id_str is not string
            if(_w.isEmptyString(id_str))
            {
                return;
            }

            //get link object(s)
            if(/^ *\.[^\s]+? *$/i.test(id_str))
            {
                link_obj = $(id_str);
            }
            else if(/^ *(\#|[^\. ])[^\s]+? *$/i.test(id_str))
            {
                var first_char_str = id_str.slice(0, 1);
                link_obj = (first_char_str === '#') ? $(id_str) : $('#'+id_str);
            }
            else
            {
                return;
            }

            //get link object size
            link_obj_size_int = link_obj.length;

            if(link_obj_size_int > 1)
            {
                //Cycle to cache
                link_obj.each(function()
                {
                    //get href
                    link_obj_href_str = $(this).attr('href');
                    link_obj_href_str = _resolveDirectoryToURL(link_obj_href_str);

                    //cache
                    cache_html_options_obj.cache_stub = stub_bool;
                    _cacheAddHTML(link_obj_href_str, cache_html_options_obj);
                });

                //Add event handler
                link_obj.on('click', function(e)
                {
                    wQuery.preventDefault(e);

                    link_obj_href_str = $(this).attr('href');
                    link_obj_href_str = _resolveDirectoryToURL(link_obj_href_str);

                    _cacheLinkClick(link_obj_href_str, target_str, stub_bool, template_obj, callback_fn);
                });
            }
            else
            {
                //get href value
                link_obj_href_str = link_obj.attr('href');

                //cache
                link_obj_href_str = _resolveDirectoryToURL(link_obj_href_str);

                cache_html_options_obj.cache_stub = stub_bool;
                _cacheAddHTML(link_obj_href_str, cache_html_options_obj);

                link_obj.on('click', function(e){

                    wQuery.preventDefault(e);

                    _cacheLinkClick(link_obj_href_str, target_str, stub_bool, template_obj, callback_fn);
                });
            }
        }

        /**
         * Manages link functionality for cached links
         * @param {String} url_str the URL of the link
         * @param {String} target_str the DOM element target that will receive the cached content
         * @param {Boolean} stub_bool if true, will use only a stub of the HTML content that was cached i.e. everything inside <body></body>
         * @param {Object} template_obj a template context object that will be used to pre-compile the cached HTML
         * @param {Function} callback_fn a callback function to replace the standard functionality
         * @private
         */
        function _cacheLinkClick(url_str, target_str, stub_bool, template_obj, callback_fn)
        {
            var url_hash_key_str = _cacheUrlStoreHashKey(url_str),
                store_var_name_str = 'var_cache_link_'+url_hash_key_str;

            if(!_getOnlineStatus())
            {
                //leverage offline link cache

                _cacheAddHTML(url_str).then(function(html_str) {

                    if(stub_bool)
                    {
                        //get HTML stub

                        if (/<html.*?\>|<body.*?\>/igm.test(html_str)) {
                            //get html content inside body
                            var html_all_arr = _w.regexMatchAll(/<body.*?\>([\s\S]*)<\/body>/igm, html_str);
                            html_str = html_all_arr[0][1];
                            html_str = html_str.trim();
                        }
                    }

                    //compile
                    html_str = (template_obj) ? _compile(html_str, template_obj) : html_str;

                    //add to DOM
                    if(target_str)
                    {
                        if(callback_fn)
                        {
                            callback_fn(html_str, target_str);
                        }
                        else
                        {
                            $('#'+target_str).html(html_str);
                        }
                    }
                    else
                    {
                        //flag that the content was appended to prevent multiplicity
                        if(callback_fn)
                        {
                            callback_fn(html_str);
                        }
                        else
                        {
                            if(!wizmo.domStore(store_var_name_str)) {

                                $('body').append(html_str);

                                wizmo.domStore(store_var_name_str, true);
                            }
                        }
                    }
                });
            }
            else
            {
                window.location.href = url_str;
            }
        }

        /**
         * Clears one or more [or all] items from the cache
         * @param {String|Array} url_str_or_arr the url, or list of urls to the cacheable item(s)
         * Note: if url_str_or_arr is undefined, then the entire cache will be deleted
         * Note: This does not actually clear the browser cache
         * @private
         */
        function _cacheClear()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                url_str_or_arr = myArgs[0],
                url_arr,
                is_clear_all_bool = false,
                url_arr_item_fqdn_str,
                cache_req_item_str,
                url_fqdn_arr = [],
                cache_req_url_arr = [],
                url_to_delete_arr = [],
                url_cache_store_key_str,
                store_all_obj,
                store_vars_remove_str,
                store_all_key_arr = []
            ;

            if(!(_w.isArray(url_str_or_arr) || _w.isString(url_str_or_arr)))
            {
                is_clear_all_bool = true;
            }
            else
            {
                url_arr = (_w.isString(url_str_or_arr)) ? url_str_or_arr.split(',') : url_str_or_arr;

                //generate fqdn url list
                for(var h = 0; h < url_arr.length; h++)
                {
                    url_arr_fqdn_item_str = _resolveDirectoryToURL(url_arr[h]);
                    url_fqdn_arr.push(url_arr_fqdn_item_str);
                }
            }

            if(('caches' in window) && _w.config.cacheNative)
            {
                //native cache support

                if(is_clear_all_bool)
                {
                    //clear all [IE8 safe]
                    caches['delete']('w-cache');

                    //clear non-native register
                    _cacheClearRegister();
                }
                else
                {
                    //clear some

                    caches.open('w-cache').then(function(cache_obj){

                        cache_obj.keys().then(function(cache_req_arr){

                            if(_w.isArray(cache_req_arr) && cache_req_arr.length > 0)
                            {
                                for(var i = 0; i < cache_req_arr.length; i++)
                                {
                                    cache_req_item_str = cache_req_arr[i]['url'];
                                    cache_req_url_arr.push(cache_req_item_str);
                                }

                                for(var i = 0; i < url_fqdn_arr.length; i++)
                                {
                                    url_arr_item_fqdn_str = url_fqdn_arr[i];

                                    if(_w.in_array(url_arr_item_fqdn_str, cache_req_url_arr))
                                    {
                                        url_to_delete_arr.push(url_arr_item_fqdn_str);

                                        //delete [IE8 safe]
                                        cache_obj['delete'](url_arr_item_fqdn_str);
                                    }
                                }

                                //clear non-native register
                                _cacheClearRegister(url_to_delete_arr);
                            }
                        });
                    });
                }
            }
            else
            {
                //no native cache support - fallback

                if (is_clear_all_bool)
                {
                    //clear all

                    store_all_obj = wizmo.store();
                    for (var store_key in store_all_obj)
                    {
                        if(store_all_obj.hasOwnProperty(store_key))
                        {
                            if(/^ *var_cache_url_/i.test(store_key))
                            {
                                store_all_key_arr.push(store_key);
                            }
                        }
                    }
                    store_vars_remove_str = _w.implode(' ', store_all_key_arr);
                    wizmo.store(store_vars_remove_str, null);

                    //clear register
                    _cacheClearRegister();
                }
                else
                {
                    //clear some

                    for(var i = 0; i < _w.count(url_fqdn_arr); i++)
                    {
                        url_cache_store_key_str = _cacheUrlStoreHashKey(url_fqdn_arr[i]);
                        wizmo.store(url_cache_store_key_str, null);
                    }

                    //clear register
                    _cacheClearRegister(url_fqdn_arr);
                }
            }
        }

        /**
         * Caches content
         */
        wizmo_obj.cache = {
            /**
             * Caches an asset
             * Note: This method leverages the Cache API by default. When the Cache API is not supported, it falls back to a custom pseudo-caching approach powered by sessionStorage
             * @param {String|Array} url_str_or_arr a single file, or a list of files to cache.
             * Cacheable files include:
             * html, htm, css, js, jpg, gif, png, json, xml, csv
             * @param {Boolean} unique_bool If true, will prevent files that have already been cached from being added again
             */
            add: function(url_str_or_arr){
                var myArgs = Array.prototype.slice.call(arguments),
                    unique_bool = myArgs[1];
                _cacheAdd(url_str_or_arr, unique_bool);
            },
            /**
             * Caches a link
             * @param {String} id_str the DOM identifier of the link(s). See _cacheAddLink
             * @param {Object} options_obj the options. See _cacheAddLink
             * @return
             */
            addLink: function(id_str){
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = myArgs[1]
                    ;
                return _cacheAddLink(id_str, options_obj);
            },
            /**
             * Gets a cached item
             * Note: only applicable for html, json, xml, etc.
             * @param {String} url_str the url to the cacheable asset
             */
            get: function(url_str){
                return _cacheGet(url_str);
            },
            /**
             * Checks if an item is cached or not
             * @param {String} url_str the url to the cacheable item
             * @return {Boolean}
             */
            check: function(url_str){
                return _cacheCheck(url_str);
            },
            /**
             * Clear the cache
             * Note: This doesn't actually clear the browser cache
             * @param {String|Array} url_str_or_arr a single url, or a list of urls to delete from the cache
             * Note: if url_str_or_arr is not provided, the entire cache will be deleted
             */
            clear: function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    url_str_or_arr = myArgs[0]
                ;
                _cacheClear(url_str_or_arr);
            }
        };

        /**
         * Adds one or more files to the Service Worker assets cache
         * @param {String|Array} file_path_str_or_arr the path to the files to cache
         * @private
         */
        function _addToSWCache(file_path_str_or_arr)
        {
            if(!wizmo.pageStore('rs_var_sw_cache_list') || !_w.isArray(wizmo.pageStore('rs_var_sw_cache_list')))
            {
                wizmo.pageStore('rs_var_sw_cache_list', []);
            }

            //get cache list to local
            var cache_list_arr = wizmo.pageStore('rs_var_sw_cache_list');

            if(_w.isArray(file_path_str_or_arr) && file_path_str_or_arr.length > 0)
            {
                for(var i = 0; i < file_path_str_or_arr.length; i++)
                {
                    cache_list_arr.push(file_path_str_or_arr[i]);
                }
            }
            else if(_w.isString(file_path_str_or_arr) && file_path_str_or_arr.length > 0)
            {
                if(/.+?,.+/i.test(file_path_str_or_arr))
                {
                    var file_path_arr = _w.explode(',', file_path_str_or_arr);
                    for(var i = 0; i < file_path_arr.length; i++)
                    {
                        cache_list_arr.push(file_path_arr[i]);
                    }
                }
                else
                {
                    cache_list_arr.push(file_path_str_or_arr);
                }
            }

            //save
            wizmo.pageStore('rs_var_sw_cache_list', cache_list_arr);
        }

        /**
         * Service worker interface
         */
        wizmo_obj.sworker = {
            /**
             * Sets the name of the service worker cache
             * @param {String} name_str the name of the service worker cache
             */
            setName: function(name_str){
                wizmo.pageStore('rs_var_sw_cache_name', name_str);
            },
            /**
             * Sets the service worker URL
             * @param {String} url_str the URL to the service worker
             */
            setURL: function(url_str){
                wizmo.pageStore('rs_var_sw_register_url', url_str);
            },
            /**
             * Adds a file to the cache
             * @param {String|Array} file_path_str_or_arr
             */
            add: function(file_path_str_or_arr){
                return _addToSWCache(file_path_str_or_arr);
            },
            /**
             * Defines a fallback file to serve when the user is offline
             * Note: Should be html file
             * @param {String} file_path_str the path to the fallback file
             */
            addFallback: function(file_path_str){
                if(_w.isString(file_path_str) && file_path_str.length > 0)
                {
                    wizmo.pageStore('rs_var_sw_cache_offline_fallback', file_path_str);
                }
            },
            /**
             * Start the Service Worker
             * @param {String} sw_scope_str the service worker registration scope
             * @param {Function} sw_fallback_fn an optional fallback function that will be executed if service workers is not supported. Function will be passed cache list, name, and offline fallback path
             * @param {Object} sw_fallback_fn_args_obj the main argument for the fallback function. This object will be available under the property, fn_args, of the actual passed argument object
             */
            start: function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    sw_scope_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0] : './',
                    sw_fallback_fn = (_w.isFunction(myArgs[1])) ? myArgs[1] : function(){},
                    sw_fallback_fn_args_obj = (myArgs[2]) ? myArgs[2] : {},
                    sw_scope_arg_obj = {scope: sw_scope_str}
                    ;
               if('serviceWorker' in navigator)
               {
                   //service workers supported

                   var sw_pre_obj,
                       flag_sw_in_control_bool,
                       url_register_str = (!wizmo.pageStore('rs_var_sw_register_url')) ? '/wizmo.sw.js' : wizmo.pageStore('rs_var_sw_register_url'),
                       sw_cache_name_str = (!wizmo.pageStore('rs_var_sw_cache_name')) ? 'wizmo' : wizmo.pageStore('rs_var_sw_cache_name'),
                       sw_cache_list_arr = wizmo.pageStore('rs_var_sw_cache_list'),
                       sw_cache_offline_fallback_str = wizmo.pageStore('rs_var_sw_cache_offline_fallback')
                       ;

                   //determine if service worker is in control
                   sw_pre_obj = navigator.serviceWorker.controller;
                   flag_sw_in_control_bool = (sw_pre_obj) ? true : false;

                   //register service worker
                   navigator.serviceWorker.register(url_register_str, sw_scope_arg_obj).then(function(registration)
                   {
                       //registration success
                       _w.console.info(_w.config.app_name+' info ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: Service worker registration succeeded. Scope is '+registration.scope+'.', true);

                       var sw_obj = registration.installing || navigator.serviceWorker.controller || registration.active;
                       var message_payload_obj = {'cache_name': sw_cache_name_str, 'cache_list': sw_cache_list_arr, 'cache_offline_fallback': sw_cache_offline_fallback_str, 'flag_sw_in_control': flag_sw_in_control_bool};

                       //post message
                       sw_obj.postMessage(message_payload_obj);

                   }, function(err){
                       //registration failed
                       _w.console.error(_w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: Service worker registration failed! - '+err, true);
                   });
               }
               else
               {
                   //service workers not supported

                   _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: Service workers are not supported!', true);

                   //define argument object
                   var arg_obj = {};
                   arg_obj['cache_offline_fallback'] = wizmo.pageStore('rs_var_sw_cache_offline_fallback');
                   arg_obj['cache_list'] = wizmo.pageStore('rs_var_sw_cache_list');
                   arg_obj['cache_name'] = wizmo.pageStore('rs_var_sw_cache_name');
                   arg_obj['fn_args'] = sw_fallback_fn_args_obj;

                   //run fallback callback
                   sw_fallback_fn(arg_obj);
               }
            }
        };

        /**
         * Provides simple scroll trigger functionality
         * Scrollpost will execute a callback function when the user scrolls past a specific point in a specific direction
         * @param name_str {String} the name that will identify the scrollpost
         *
         * @param pos_str {String} the scrollpost position parameters
         * 1. x or y coordinates e.g. 300 [defaults to x], 20y, etc.
         * 2. x,y coordinates e.g. 300x,30y or 250y,40x
         * 3. id tag e.g. #div-number-1 [active when the element comes into view]. Alternatively, an offset can be provided
         * 3.1. #div-number-2|+40
         * 3.2. #div-number
         *
         * @param options_obj {Object} the options
         *
         * callback: the callback function that will be executed when the scrollpost is reached
         *
         * callback_once: If true, will force callback to run only once. Default action is that callback will run each time the scrollpost condition is matched
         *
         * route_path: A route path that will be executed when a scroll post matches
         *
         * route_hash: The hash string for the route path. Default is '#/'.
         *
         * scrollpostmark_class_track_elem: special option used by _scrollPostMark method
         *
         * scrollpostmark_id_tag_elem: special option used by _scrollPostMark method
         *
         * scrollpostmark_class_tag_elem: special option used by _scrollPostMark
         *
         * @param callback_fn {Function} the callback function that will be executed when the milepost is reached
         * @param post_fn_run_once_bool {Boolean} forces callback_fn to run only once. Default action is that callback_fn will run each time the scrollpost condition is matched
         * @returns {wizmo}
         */
        function _scrollPost(name_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                pos_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : false,
                options_obj = myArgs[2],
                callback_fn,
                callback_once_bool,
                callback_route_path_str,
                callback_route_hash_str,
                elem_ref_obj,
                elem_ref_obj_selector_str,
                elem_tag_obj_selector_str,
                pos_str_elem_regex_arr = [],
                data_scrollpost_obj = wQuery.data('w_var_scrollposts'),
                scrollpost_data_arr,
                scrollpost_data_item_str,
                scrollpost_data_item_uuid_str,
                scrollpost_data_pos_arr,
                scrollpost_data_fn_arr,
                scrollpost_data_marker_arr,
                scrollpost_ref_obj_sel_arr,
                scrollpost_tag_obj_sel_arr,
                scrollpost_fn_run_once_arr,
                scrollpost_fn_run_once_bool,
                scrollpost_fn_run_once_uuid_str,
                scrollpost_route_path_arr,
                scrollpost_route_hash_arr,
                scrollpost_item_match_bool,
                scrollpost_item_marker_bool,
                scroll_v_int,
                scroll_h_int,
                pos_regex_arr = [],
                scrollpost_config_obj = {},
                el_offset_obj,
                scroll_pos_obj,
                scrollpostmark_track_elem_class_str,
                scrollpostmark_tag_elem_id_str,
                scrollpostmark_tag_elem_class_str
                ;

            //return if pos_str is invalid
            if(!pos_str)
            {
                return false;
            }

            //define options
            if(_w.isObject(options_obj))
            {
                callback_fn = (options_obj.callback) ? options_obj.callback : undefined;
                callback_once_bool = !!((options_obj.callback_once));
                callback_route_path_str = (options_obj.route_path && _w.isString(options_obj.route_path) && options_obj.route_path.length > 0) ? options_obj.route_path : undefined;
                callback_route_hash_str = (options_obj.route_hash && _w.isString(options_obj.route_hash) && options_obj.route_hash.length > 0) ? options_obj.route_hash : undefined;

                scrollpostmark_track_elem_class_str = (options_obj.scrollpostmark_class_track_elem) ? options_obj.scrollpostmark_class_track_elem : undefined;
                scrollpostmark_tag_elem_id_str = (options_obj.scrollpostmark_id_tag_elem) ? options_obj.scrollpostmark_id_tag_elem : undefined;
                scrollpostmark_tag_elem_class_str = (options_obj.scrollpostmark_class_tag_elem) ? options_obj.scrollpostmark_class_tag_elem : undefined;
            }

            //get body or get selected element
            if(/^ *(\#.+?) *(?:\|.+?|) *$/i.test(pos_str))
            {
                pos_str_elem_regex_arr = _w.regexMatchAll(/^ *(\#.+?) *(?:\|.+?|) *$/i, pos_str);

                elem_ref_obj_selector_str = pos_str_elem_regex_arr[0][1];
                elem_ref_obj = $(elem_ref_obj_selector_str);
            }
            else
            {
                elem_ref_obj_selector_str = 'body';
                elem_ref_obj = $(elem_ref_obj_selector_str);
            }

            //get tag objector selector stub. this is for _scrollPostMark functionality
            elem_tag_obj_selector_str = (scrollpostmark_tag_elem_id_str) ? '#'+scrollpostmark_tag_elem_id_str : '';

            //compose function for scrollpost matching
            var scrollpost_match_fn = function(scrollpost_config_obj)
            {
                var scrollpost_pos_str = scrollpost_config_obj.scrollpost_data,
                    scroll_dir_h_str = scrollpost_config_obj.scroll_dir_h,
                    scroll_dir_v_str = scrollpost_config_obj.scroll_dir_v,
                    scroll_x_int = scrollpost_config_obj.scroll_pos_x,
                    scroll_x_prev_int = scrollpost_config_obj.scroll_pos_x_prev,
                    scroll_y_int = scrollpost_config_obj.scroll_pos_y,
                    scroll_y_prev_int = scrollpost_config_obj.scroll_pos_y_prev,
                    scroll_x_el_int = scrollpost_config_obj.scroll_pos_el_x,
                    scroll_y_el_int = scrollpost_config_obj.scroll_pos_el_y,
                    el_x_offset_int = parseInt(scrollpost_config_obj.el_offset_x),
                    el_x_offset_diff_scroll_x_prev_int = el_x_offset_int-scroll_x_prev_int,
                    el_y_offset_int = parseInt(scrollpost_config_obj.el_offset_y),
                    el_y_offset_diff_scroll_y_prev_int = el_y_offset_int-scroll_y_prev_int,
                    scrollpost_pos_uuid_str = scrollpost_config_obj.uuid,
                    viewport_w_str = wizmo.viewportW(),
                    viewport_w_int = (viewport_w_str) ? parseInt(viewport_w_str) : 0,
                    viewport_h_str = wizmo.viewportH(),
                    viewport_h_int = (viewport_h_str) ? parseInt(viewport_h_str) : 0,
                    scrollpost_pos_val_str,
                    scrollpost_pos_val_int,
                    scrollpost_pos_val_axis_str,
                    scrollpost_pos_val_dir_str,
                    scrollpost_pos_val_ls_int,
                    scrollpost_pos_val_rs_int,
                    scrollpost_x_int,
                    scrollpost_x_dir_str = 'right',
                    scrollpost_y_int,
                    scrollpost_y_dir_str = 'down',
                    scrollpost_value_perc_factor_int,
                    scrollpost_value_perc_factor_y_int,
                    scrollpost_value_perc_factor_x_int,
                    is_elem_scrollpost_obj = false,
                    is_valid_scroll_past_x_left_var_str = 'var_is_valid_scroll_past_x_left_'+scrollpost_pos_uuid_str,
                    is_valid_scroll_past_x_right_var_str = 'var_is_valid_scroll_past_x_right_'+scrollpost_pos_uuid_str,
                    is_valid_scroll_past_y_up_var_str = 'var_is_valid_scroll_past_y_up_'+scrollpost_pos_uuid_str,
                    is_valid_scroll_past_y_down_var_str = 'var_is_valid_scroll_past_y_down_'+scrollpost_pos_uuid_str,
                    is_valid_scroll_past_idx_str,
                    is_rtl_bool = false
                    ;

                //update scroll_x if negative on account of rtl or other
                if(scroll_x_int < 0 || scroll_x_prev_int < 0)
                {
                    is_rtl_bool = true;

                    scroll_x_int = Math.abs(scroll_x_int);
                    scroll_x_prev_int = Math.abs(scroll_x_prev_int);
                }

                //use regex to get milepost position data
                if(/^ *([0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(?:\#(up|down|left|right)|) *$/i.test(scrollpost_pos_str))
                {
                    //e.g. '100y', '100y#up', '200x', '200x#left', '300%y'

                    pos_regex_arr = _w.regexMatchAll(/^ *([0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(?:\#(up|down|left|right)|) *$/i, scrollpost_pos_str);

                    scrollpost_pos_val_str = pos_regex_arr[0][1];
                    scrollpost_pos_val_int = parseInt(scrollpost_pos_val_str);
                    scrollpost_pos_val_axis_str = (!_w.isEmptyString(pos_regex_arr[0][3])) ? pos_regex_arr[0][3] : 'y';
                    scrollpost_pos_val_dir_str = pos_regex_arr[0][4];

                    scrollpost_x_int = (scrollpost_pos_val_axis_str === 'y') ? 0 : scrollpost_pos_val_int;
                    scrollpost_y_int = (scrollpost_pos_val_axis_str === 'y') ? scrollpost_pos_val_int : 0;

                    if(pos_regex_arr[0][2] === '%')
                    {
                        //use viewport dimensions

                        scrollpost_value_perc_factor_int = scrollpost_pos_val_int / 100;

                        scrollpost_x_int = (scrollpost_y_int === 0) ? scrollpost_value_perc_factor_int * viewport_w_int : scrollpost_x_int;
                        scrollpost_y_int = (scrollpost_x_int === 0) ? scrollpost_value_perc_factor_int * viewport_h_int : scrollpost_y_int;

                    }

                    scrollpost_x_dir_str = (scrollpost_pos_val_dir_str === 'left') ? 'left' : 'right';
                    scrollpost_y_dir_str = (scrollpost_pos_val_dir_str === 'up') ? 'up' : 'down';
                }
                else if(/^ *([0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *, *([0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *$/i.test(scrollpost_pos_str))
                {
                    //e.g. '100y,200x', '100y#up,200x#right', etc.

                    pos_regex_arr = _w.regexMatchAll(/^ *([0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *, *([0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *$/i, scrollpost_pos_str);

                    scrollpost_pos_val_ls_int = parseInt(pos_regex_arr[0][1]);
                    scrollpost_pos_val_rs_int = parseInt(pos_regex_arr[0][5]);

                    scrollpost_x_int = (pos_regex_arr[0][3] === 'y') ? scrollpost_pos_val_rs_int : scrollpost_pos_val_ls_int;
                    scrollpost_y_int = (pos_regex_arr[0][7] === 'y') ? scrollpost_pos_val_rs_int : scrollpost_pos_val_ls_int;

                    if(pos_regex_arr[0][2] === '%' || pos_regex_arr[0][6] === '%')
                    {
                        //use viewport dimensions

                        if((pos_regex_arr[0][2] === '%' && pos_regex_arr[0][3] === 'x') || (pos_regex_arr[0][6] === '%' && pos_regex_arr[0][7] === 'x'))
                        {
                            scrollpost_value_perc_factor_x_int = (pos_regex_arr[0][3] === 'y') ? scrollpost_pos_val_rs_int / 100 : scrollpost_pos_val_ls_int / 100  ;
                            scrollpost_x_int = scrollpost_value_perc_factor_x_int * viewport_w_int;
                        }

                        if((pos_regex_arr[0][2] === '%' && pos_regex_arr[0][3] === 'y') || (pos_regex_arr[0][6] === '%' && pos_regex_arr[0][7] === 'y'))
                        {
                            scrollpost_value_perc_factor_y_int = (pos_regex_arr[0][7] === 'y') ? scrollpost_pos_val_rs_int / 100 : scrollpost_pos_val_ls_int / 100  ;
                            scrollpost_y_int = scrollpost_value_perc_factor_y_int * viewport_h_int;
                        }

                    }

                    scrollpost_x_dir_str = ((pos_regex_arr[0][3] === 'x' && pos_regex_arr[0][4] === '#left') || (pos_regex_arr[0][7] === 'x' && pos_regex_arr[0][8] === '#left')) ? 'left' : 'right';
                    scrollpost_y_dir_str = ((pos_regex_arr[0][3] === 'y' && pos_regex_arr[0][4] === '#up') || (pos_regex_arr[0][7] === 'y' && pos_regex_arr[0][8] === '#up')) ? 'up' : 'down';

                }
                else if(/^ *(\#.+?) *\| *((?:\-|\+|)[0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|right|left)|) *$/i.test(scrollpost_pos_str))
                {
                    //e.g. '#container', '#container|100y', '#container|100y#up'

                    is_elem_scrollpost_obj = true;

                    pos_regex_arr = _w.regexMatchAll(/^ *(\#.+?) *\| *((?:\-|\+|)[0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|right|left)|) *$/i, scrollpost_pos_str);

                    scrollpost_pos_val_int = parseInt(pos_regex_arr[0][2]);
                    scrollpost_x_int = (pos_regex_arr[0][4] === 'y') ? 0 : scrollpost_pos_val_int;
                    scrollpost_y_int = (pos_regex_arr[0][4] === 'y') ? scrollpost_pos_val_int : 0;

                    if(pos_regex_arr[0][3] === '%')
                    {
                        //use viewport dimensions

                        scrollpost_value_perc_factor_int = scrollpost_pos_val_int / 100;

                        scrollpost_x_int = (scrollpost_y_int === 0) ? scrollpost_value_perc_factor_int * viewport_w_int : scrollpost_x_int;
                        scrollpost_y_int = (scrollpost_x_int === 0) ? scrollpost_value_perc_factor_int * viewport_h_int : scrollpost_y_int;

                    }

                    scrollpost_x_dir_str = ((pos_regex_arr[0][4] === 'x' && pos_regex_arr[0][5] === '#left')) ? 'left' : 'right';
                    scrollpost_y_dir_str = ((pos_regex_arr[0][4] === 'y' && pos_regex_arr[0][5] === '#up')) ? 'up' : 'down';

                }
                else if(/^ *(\#.+?) *\| *((?:\-|\+|)[0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *, *((?:\-|\+|)[0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *$/i.test(scrollpost_pos_str))
                {
                    //e.g. '#container|100y,50x', '#container|25%y#up,50x#right', etc.

                    is_elem_scrollpost_obj = true;

                    pos_regex_arr = _w.regexMatchAll(/^ *(\#.+?) *\| *((?:\-|\+|)[0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *, *((?:\-|\+|)[0-9]+(?:\.[0-9]+|))(\%?)(x|y|) *(\#(?:up|down|left|right)|) *$/i, scrollpost_pos_str);

                    scrollpost_pos_val_ls_int = parseInt(pos_regex_arr[0][2]);
                    scrollpost_pos_val_rs_int = parseInt(pos_regex_arr[0][6]);

                    scrollpost_x_int = (pos_regex_arr[0][4] === 'y') ? scrollpost_pos_val_rs_int : scrollpost_pos_val_ls_int;
                    scrollpost_y_int = (pos_regex_arr[0][8] === 'y') ? scrollpost_pos_val_rs_int : scrollpost_pos_val_ls_int;

                    if(pos_regex_arr[0][3] === '%' || pos_regex_arr[0][7] === '%')
                    {
                        //use viewport dimensions

                        if((pos_regex_arr[0][3] === '%' && pos_regex_arr[0][4] === 'x') || (pos_regex_arr[0][7] === '%' && pos_regex_arr[0][8] === 'x'))
                        {
                            scrollpost_value_perc_factor_x_int = (pos_regex_arr[0][4] === 'y') ? scrollpost_pos_val_rs_int / 100 : scrollpost_pos_val_ls_int / 100  ;
                            scrollpost_x_int = scrollpost_value_perc_factor_x_int * viewport_w_int;
                        }

                        if((pos_regex_arr[0][3] === '%' && pos_regex_arr[0][4] === 'y') || (pos_regex_arr[0][7] === '%' && pos_regex_arr[0][8] === 'y'))
                        {
                            scrollpost_value_perc_factor_y_int = (pos_regex_arr[0][8] === 'y') ? scrollpost_pos_val_rs_int / 100 : scrollpost_pos_val_ls_int / 100  ;
                            scrollpost_y_int = scrollpost_value_perc_factor_y_int * viewport_h_int;
                        }

                    }

                    scrollpost_x_dir_str = ((pos_regex_arr[0][4] === 'x' && pos_regex_arr[0][5] === '#left') || (pos_regex_arr[0][8] === 'x' && pos_regex_arr[0][9] === '#left')) ? 'left' : 'right';
                    scrollpost_y_dir_str = ((pos_regex_arr[0][4] === 'y' && pos_regex_arr[0][5] === '#up') || (pos_regex_arr[0][8] === 'y' && pos_regex_arr[0][9] === '#up')) ? 'up' : 'down';

                }

                //make sure scrollpost x and y are integers
                scrollpost_x_int = (scrollpost_x_int) ? parseInt(scrollpost_x_int) : scrollpost_x_int;
                scrollpost_y_int = (scrollpost_y_int) ? parseInt(scrollpost_y_int) : scrollpost_y_int;

                // define DOM variables for tracking
                // this is used for accurate measurement of scrolls
                // in the opposite direction e.g. up and left
                if(!wQuery.data(is_valid_scroll_past_x_left_var_str))
                {
                    wQuery.data(is_valid_scroll_past_x_left_var_str, '0');
                }

                if(!wQuery.data(is_valid_scroll_past_x_right_var_str))
                {
                    wQuery.data(is_valid_scroll_past_x_right_var_str, '0');
                }

                if(!wQuery.data(is_valid_scroll_past_y_up_var_str))
                {
                    wQuery.data(is_valid_scroll_past_y_up_var_str, '0');
                }

                if(!wQuery.data(is_valid_scroll_past_y_down_var_str))
                {
                    wQuery.data(is_valid_scroll_past_y_down_var_str, '0');
                }

                //main scrollpost test
                if(is_elem_scrollpost_obj)
                {
                    //reference is element

                    if((_w.isNumber(scrollpost_x_int) && scrollpost_x_int !== 0) && (_w.isNumber(scrollpost_y_int) && scrollpost_y_int !== 0))
                    {
                        //match for x,y intercept

                        if(scrollpost_y_dir_str === 'up')
                        {
                            if ((scroll_dir_v_str === 'up' || scroll_dir_h_str === 'left') && (scrollpost_y_dir_str === 'up' && scrollpost_x_dir_str === 'left') && (scroll_y_el_int >= scrollpost_y_int && scroll_x_el_int >= scrollpost_x_int))
                            {
                                //up + left

                                return true;
                            }
                            else if ((scroll_dir_v_str === 'up' || scroll_dir_h_str === 'right') && (scrollpost_y_dir_str === 'up' && scrollpost_x_dir_str === 'right') && (scroll_y_el_int >= scrollpost_y_int && scroll_x_el_int <= scrollpost_x_int))
                            {
                                //up + right

                                return true;
                            }
                        }
                        else
                        {
                            if((scroll_dir_v_str === 'down' || scroll_dir_h_str === 'left') && (scrollpost_y_dir_str === 'down' && scrollpost_x_dir_str === 'left') && (scroll_y_el_int <= scrollpost_y_int && scroll_x_el_int >= scrollpost_x_int))
                            {
                                //down and left

                                return true;
                            }
                            else if((scroll_dir_v_str === 'down' || scroll_dir_h_str === 'right') && (scrollpost_y_dir_str === 'down' && scrollpost_x_dir_str === 'right') && (scroll_y_el_int <= scrollpost_y_int && scroll_x_el_int <= scrollpost_x_int))
                            {
                                //down and right

                                return true;
                            }
                        }
                    }
                    else if (_w.isNumber(scrollpost_x_int) && scrollpost_x_int !== 0)
                    {
                        //match for x

                        //horizontal constraint
                        if(scrollpost_x_dir_str === 'left')
                        {
                            if(scroll_dir_h_str === 'left' && scroll_x_el_int >= scrollpost_x_int && el_x_offset_diff_scroll_x_prev_int < scrollpost_x_int)
                            {
                                return true;
                            }
                        }
                        else if(scroll_x_el_int <= scrollpost_x_int)
                        {
                            return true;
                        }
                    }
                    else if (_w.isNumber(scrollpost_y_int) && scrollpost_y_int !== 0)
                    {
                        //match for y

                        //vertical constraint
                        if(scrollpost_y_dir_str === 'up')
                        {
                            if(scroll_dir_v_str === 'up' && scroll_y_el_int >= scrollpost_y_int && el_y_offset_diff_scroll_y_prev_int < scrollpost_y_int)
                            {
                                return true;
                            }
                        }
                        else if(scroll_y_el_int <= scrollpost_y_int)
                        {
                            return true;
                        }
                    }
                }
                else
                {
                    //reference is viewport

                    if(scrollpost_x_int > 0 && scrollpost_y_int > 0)
                    {
                        //match for x,y intercept

                        if(scrollpost_y_dir_str === 'up')
                        {
                            if((scroll_dir_v_str === 'up' || scroll_dir_h_str === 'left') && (scrollpost_y_dir_str === 'up' && scrollpost_x_dir_str === 'left') && (scroll_y_int <= scrollpost_y_int && scroll_x_int <= scrollpost_x_int))
                            {
                                //up + left

                                wQuery.data(is_valid_scroll_past_y_up_var_str, '1');
                                if(is_rtl_bool)
                                {
                                    wQuery.data(is_valid_scroll_past_x_right_var_str, '1');
                                }
                                else
                                {
                                    wQuery.data(is_valid_scroll_past_x_left_var_str, '1');
                                }
                            }
                            else if ((scroll_dir_v_str === 'up' || scroll_dir_h_str === 'right') && (scrollpost_y_dir_str === 'up' && scrollpost_x_dir_str === 'right') && (scroll_y_int <= scrollpost_y_int && scroll_x_int >= scrollpost_x_int))
                            {
                                //up + right

                                wQuery.data(is_valid_scroll_past_y_up_var_str, '1');
                                if(is_rtl_bool)
                                {
                                    wQuery.data(is_valid_scroll_past_x_left_var_str, '1');
                                }
                                else
                                {
                                    wQuery.data(is_valid_scroll_past_x_right_var_str, '1');
                                }
                            }
                        }
                        else
                        {
                            if((scroll_dir_v_str === 'down' || scroll_dir_h_str === 'left') && (scrollpost_y_dir_str === 'down' && scrollpost_x_dir_str === 'left') && (scroll_y_int >= scrollpost_y_int && scroll_x_int <= scrollpost_x_int))
                            {
                                //down + left

                                wQuery.data(is_valid_scroll_past_y_down_var_str, '1');
                                if(is_rtl_bool)
                                {
                                    wQuery.data(is_valid_scroll_past_x_right_var_str, '1');
                                }
                                else
                                {
                                    wQuery.data(is_valid_scroll_past_x_left_var_str, '1');
                                }
                            }
                            else if ((scroll_dir_v_str === 'down' || scroll_dir_h_str === 'right') && (scrollpost_y_dir_str === 'down' && scrollpost_x_dir_str === 'right') && (scroll_y_int >= scrollpost_y_int && scroll_x_int >= scrollpost_x_int))
                            {
                                //down + right

                                wQuery.data(is_valid_scroll_past_y_down_var_str, '1');
                                if(is_rtl_bool)
                                {
                                    wQuery.data(is_valid_scroll_past_x_left_var_str, '1');
                                }
                                else
                                {
                                    wQuery.data(is_valid_scroll_past_x_right_var_str, '1');
                                }
                            }
                        }

                        //set scroll post index markers
                        if(scrollpost_x_dir_str === 'right' && scrollpost_y_dir_str === 'up')
                        {
                            is_valid_scroll_past_idx_str = wQuery.data(is_valid_scroll_past_x_right_var_str)+""+wQuery.data(is_valid_scroll_past_y_up_var_str);
                        }
                        else if (scrollpost_x_dir_str === 'left' && scrollpost_y_dir_str === 'up')
                        {
                            is_valid_scroll_past_idx_str = wQuery.data(is_valid_scroll_past_x_left_var_str)+""+wQuery.data(is_valid_scroll_past_y_up_var_str);
                        }
                        else if (scrollpost_x_dir_str === 'right' && scrollpost_y_dir_str === 'down')
                        {
                            is_valid_scroll_past_idx_str = wQuery.data(is_valid_scroll_past_x_right_var_str)+""+wQuery.data(is_valid_scroll_past_y_down_var_str);
                        }
                        else if (scrollpost_x_dir_str === 'left' && scrollpost_y_dir_str === 'down')
                        {
                            is_valid_scroll_past_idx_str = wQuery.data(is_valid_scroll_past_x_left_var_str)+""+wQuery.data(is_valid_scroll_past_y_down_var_str);
                        }

                        //reset and match
                        if(is_valid_scroll_past_idx_str === '11')
                        {
                            wQuery.data(is_valid_scroll_past_x_left_var_str, '0');
                            wQuery.data(is_valid_scroll_past_x_right_var_str, '0');
                            wQuery.data(is_valid_scroll_past_y_up_var_str, '0');
                            wQuery.data(is_valid_scroll_past_y_down_var_str, '0');
                            return true;
                        }
                    }
                    else if (scrollpost_x_int > 0)
                    {
                        //match for x

                        if(scrollpost_x_dir_str === 'left')
                        {
                            if(scroll_dir_h_str === 'left' && scroll_x_int < scrollpost_x_int && scroll_x_prev_int >= scrollpost_x_int)
                            {
                                return true;
                            }
                            else if(is_rtl_bool && scroll_dir_h_str === 'right' && scroll_x_int < scrollpost_x_int && scroll_x_prev_int >= scrollpost_x_int)
                            {
                                //reverse for rtl

                                return true;
                            }
                        }
                        else if (scrollpost_x_dir_str === 'right')
                        {
                            if(scroll_dir_h_str === 'right' && scroll_x_int >= scrollpost_x_int)
                            {
                                return true;
                            }
                            else if(is_rtl_bool && scroll_dir_h_str === 'left' && scroll_x_int >= scrollpost_x_int)
                            {
                                //reverse for rtl

                                return true;
                            }
                        }
                    }
                    else if (scrollpost_y_int > 0)
                    {
                        //match for y

                        if(scrollpost_y_dir_str === 'up')
                        {
                            if (scroll_dir_v_str === 'up' && scroll_y_int < scrollpost_y_int && scroll_y_prev_int >= scrollpost_y_int)
                            {
                                return true;
                            }
                        }
                        else if (scrollpost_y_dir_str === 'down')
                        {
                            if (scroll_dir_v_str === 'down' && scroll_y_int >= scrollpost_y_int)
                            {
                                return true;
                            }
                        }
                    }
                }

                return false;
            };

            //define main scrollpost function
            var post_main_fn = function()
            {
                scrollpost_config_obj = {};

                //get scroll direction
                scrollpost_config_obj.scroll_dir_h = _getScrollDirection('h');
                scrollpost_config_obj.scroll_dir_v = _getScrollDirection('v');

                //get previous scroll x and y
                scrollpost_config_obj.scroll_pos_x_prev = parseInt(wizmo.store("var_viewport_scroll_l_prev"));
                scrollpost_config_obj.scroll_pos_y_prev = parseInt(wizmo.store("var_viewport_scroll_t_prev"));

                //get scrollpostmark data
                scrollpost_config_obj.scrollpostmark_track_elem_class = scrollpostmark_track_elem_class_str;
                scrollpost_config_obj.scrollpostmark_tag_elem_class = scrollpostmark_tag_elem_class_str;

                //get stored scrollpost data
                scrollpost_data_arr = wQuery.data('w_var_scrollposts');
                scrollpost_data_pos_arr = wQuery.data('w_var_scrollposts_pos');
                scrollpost_data_fn_arr = wQuery.data('w_var_scrollposts_fn');
                scrollpost_data_marker_arr = wQuery.data('w_var_scrollposts_marker');
                scrollpost_ref_obj_sel_arr = wQuery.data('w_var_scrollposts_ref_obj_sel');
                scrollpost_tag_obj_sel_arr = wQuery.data('w_var_scrollposts_tag_obj_sel');
                scrollpost_fn_run_once_arr = wQuery.data('w_var_scrollposts_fn_run_once');
                scrollpost_route_path_arr = wQuery.data('w_var_scrollposts_route_path');
                scrollpost_route_hash_arr = wQuery.data('w_var_scrollposts_route_hash');


                if(_w.count(scrollpost_data_arr) > 0)
                {
                    var scrollpost_match_tracker_fn = function(iterator_int)
                    {
                        scrollpost_data_item_str = scrollpost_data_arr[iterator_int];
                        scrollpost_data_item_uuid_str = _w.md5(scrollpost_data_item_str);

                        //get the reference element
                        elem_ref_obj = $(scrollpost_ref_obj_sel_arr[iterator_int]);
                        scrollpost_config_obj.ref_obj_sel = scrollpost_ref_obj_sel_arr[iterator_int];
                        scrollpost_config_obj.tag_obj_sel = scrollpost_tag_obj_sel_arr[iterator_int];

                        //get offset
                        el_offset_obj = elem_ref_obj.offset();
                        scrollpost_config_obj.el_offset_x = el_offset_obj.left;
                        scrollpost_config_obj.el_offset_y = el_offset_obj.top;

                        //get scroll position
                        scroll_pos_obj = elem_ref_obj.scrollPosition();
                        scrollpost_config_obj.scroll_pos_x = scroll_pos_obj.left;
                        scrollpost_config_obj.scroll_pos_y = scroll_pos_obj.top;
                        scrollpost_config_obj.scroll_pos_el_x = scroll_pos_obj.left_e;
                        scrollpost_config_obj.scroll_pos_el_y = scroll_pos_obj.top_e;

                        //get scrollpost data
                        scrollpost_config_obj.scrollpost_data = scrollpost_data_pos_arr[iterator_int];
                        scrollpost_config_obj.uuid = scrollpost_data_item_uuid_str;

                        scrollpost_item_match_bool = scrollpost_match_fn(scrollpost_config_obj);

                        scrollpost_item_marker_bool = scrollpost_data_marker_arr[iterator_int];

                        //match
                        if(scrollpost_item_match_bool && !scrollpost_item_marker_bool)
                        {
                            //run scrollpost callback
                            scrollpost_fn_run_once_bool = scrollpost_fn_run_once_arr[iterator_int];
                            scrollpost_fn_run_once_uuid_str = scrollpost_data_item_uuid_str+'_fn_id';

                            if(scrollpost_fn_run_once_bool)
                            {
                                if(!wQuery.data(scrollpost_fn_run_once_uuid_str))
                                {
                                    scrollpost_data_fn_arr[iterator_int](scrollpost_config_obj);

                                    wQuery.data(scrollpost_fn_run_once_uuid_str, true);
                                }
                            }
                            else
                            {
                                scrollpost_data_fn_arr[iterator_int](scrollpost_config_obj);
                            }

                            //run scrollpost route
                            if(scrollpost_route_path_arr[iterator_int])
                            {
                                //setup route
                                _route(scrollpost_route_path_arr[iterator_int], {hash_char: scrollpost_route_hash_arr[iterator_int], go: true, noscroll: true});
                            }
                            else
                            {
                                //remove route

                                if(window.history.pushState)
                                {
                                    //modify address bar for browsers with pushState support
                                    window.history.pushState("", document.title, window.location.pathname + window.location.search);

                                    /**
                                     * Flush route history ticker
                                     * This makes sure that the route history records when the route is no longer hashed
                                     */
                                    wizmo.pageStore('var_routes_history_ticker', '');
                                }
                                else
                                {
                                    //modify address bar for browsers without pushState support
                                    // Prevent scrolling by storing the page's current scroll offset
                                    scroll_v_int = document.body.scrollTop;
                                    scroll_h_int = document.body.scrollLeft;

                                    window.location.hash = "";

                                    // Restore the scroll offset, should be flicker free
                                    document.body.scrollTop = scroll_v_int;
                                    document.body.scrollLeft = scroll_h_int;
                                }
                            }

                            scrollpost_data_marker_arr[iterator_int] = true;
                        }
                        else if (!scrollpost_item_match_bool && scrollpost_item_marker_bool)
                        {
                            // reset marker when scrollpost marker is set to true
                            // but there is no scrollpost match

                            scrollpost_data_marker_arr[iterator_int] = false;
                        }

                        wQuery.data('w_var_scrollposts_marker', scrollpost_data_marker_arr);
                    };


                    /**
                     * change iterator direction based on scroll direction
                     * this needs to happen to prevent misplaced matching for container-based scrollpost marking (see _scrollpostmark) when scrolling up
                     * For example, if you have three containers [#container-1, #container-2, and #container-3], and you have a callback that updates the class of a container, everything works great when scroll is in the downward direction.
                     * However, when scrolling, especially when the scroll is very quick, the class update may apply to previous container (i.e. from down to up) because the iterator used in matching is counting in the opposite direction.
                     * To fix this, a positive iterator is used for down-scrolling, and a negative iterator is used for up-scrolling
                     */
                    if(scrollpost_config_obj.scroll_dir_v === 'down')
                    {
                        for(var m = 0; m < _w.count(scrollpost_data_arr); m++)
                        {
                            scrollpost_match_tracker_fn(m);
                        }
                    }
                    else if (scrollpost_config_obj.scroll_dir_v === 'up')
                    {
                        for (var n = scrollpost_data_arr.length - 1; n >= 0; n--)
                        {
                            scrollpost_match_tracker_fn(n);
                        }
                    }
                }
            };

            if(callback_fn)
            {
                //save scrollpost path to storage
                if(!data_scrollpost_obj)
                {
                    //initialize
                    wQuery.data('w_var_scrollposts', []);
                    wQuery.data('w_var_scrollposts_pos', []);
                    wQuery.data('w_var_scrollposts_fn', []);
                    wQuery.data('w_var_scrollposts_marker', []);
                    wQuery.data('w_var_scrollposts_ref_obj_sel', []);
                    wQuery.data('w_var_scrollposts_tag_obj_sel', []);
                    wQuery.data('w_var_scrollposts_fn_run_once', []);
                    wQuery.data('w_var_scrollposts_route_path', []);
                    wQuery.data('w_var_scrollposts_route_hash', []);
                }

                //add to record of scrollposts
                wQuery.data('w_var_scrollposts').push(name_str);
                wQuery.data('w_var_scrollposts_pos').push(pos_str);
                wQuery.data('w_var_scrollposts_fn').push(callback_fn);
                wQuery.data('w_var_scrollposts_marker').push(false);
                wQuery.data('w_var_scrollposts_ref_obj_sel').push(elem_ref_obj_selector_str);
                wQuery.data('w_var_scrollposts_tag_obj_sel').push(elem_tag_obj_selector_str);
                wQuery.data('w_var_scrollposts_fn_run_once').push(callback_once_bool);
                wQuery.data('w_var_scrollposts_route_path').push(callback_route_path_str);
                wQuery.data('w_var_scrollposts_route_hash').push(callback_route_hash_str);

            }

            //add scroll callback for this method
            //make sure it's added once

            if(!wizmo.domStore('var_scrollpost_is_init'))
            {
                _onScroll(post_main_fn, 'throttle', 100);

                wizmo.domStore('var_scrollpost_is_init', true);
            }
        }

        /**
         * Provides simple scroll trigger functionality
         * @param name_str {String} the name that will identify the scrollpost
         * @param pos_str {String} the scrollpost position parameters
         * @returns {wizmo}
         */
        wizmo_obj.scrollPost = function(name_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                pos_str = myArgs[1],
                options_obj = myArgs[2]
                ;

            _scrollPost(name_str, pos_str, options_obj);
            return this;
        };

        /**
         * Provides simple scroll marking functionality that marks (adds a class) or unmarks (removes a class) a specific element as it passes a specific scroll
         * Powered by _scrollPost
         * @param {Array} id_arr an array containing the ids of the elements that should be tracked and marked
         * @param {Object} options_obj the options
         *
         * track_class: this is the class identifier for the DOM element(s) to be tracked e.g. containers that will be tracked for scrollpost events
         *
         * tag_class: this is the class identifier for the DOM element(s) to be tagged e.g. links that will be tagged as 'active'
         *
         * tag_flag: the class to be added to the DOM element(s) to be tagged. Default value is 'active'
         *
         * route_click: determines whether click handlers should be setup for tag_class elements. If true, then click handlers that activate Default is true
         *
         * route_scroll: determines whether scroll is active. Default is true
         *
         * route_scroll_speed: sets the scroll speed
         *
         * route_scroll_offset: The scroll offset. If the offset is 100pixels, the element will be marked when it is 100 pixels from the top of the viewport. You can also use percentages e.g. 15% === 15% of viewport height. Default is 15%
         *
         * @returns {boolean}
         * @private
         */
        function _scrollPostMark(options_obj)
        {
            var elem_track_obj,
                elem_track_item_id_str,
                elem_tag_obj,
                elem_tag_alt_obj,
                elem_tag_alt_class_str,
                elem_tag_item_obj,
                elem_tag_item_id_str,
                elem_tag_item_href_str,
                scrollpost_pos_1_str,
                scrollpost_pos_2_str,
                scrollpost_options_1_obj,
                scrollpost_options_2_obj,
                options_route_path_str,
                options_route_hash_str,
                options_route_scroll_bool,
                options_route_scroll_speed_int_or_str,
                options_route_scroll_offset_str,
                options_route_click_bool,
                options_class_track_elem_str,
                options_class_tag_elem_str,
                options_class_tag_flag_str,
                options_route_str,
                options_route_regex_arr,
                options_route_hash_arr = [],
                options_route_hash_str,
                options_route_path_arr = [],
                options_route_path_str,
                options_route_hash_up_str,
                options_route_path_up_str,
                index_prev_int = 0,
                route_scroll_offset_str
                ;

            //return if options_obj is invalid
            if(!options_obj)
            {
                return false;
            }

            //define options
            if(_w.isObject(options_obj))
            {
                options_route_click_bool = (_w.isBool(options_obj.route_click)) ? options_obj.route_click : true;
                options_route_scroll_bool = (_w.isBool(options_obj.route_scroll)) ? options_obj.route_scroll : true;
                options_route_scroll_speed_int_or_str = (options_obj.route_scroll_speed) ? options_obj.route_scroll_speed : undefined;
                options_route_scroll_offset_str = (options_obj.route_scroll_offset && _w.isString(options_obj.route_scroll_offset) && options_obj.route_scroll_offset.length > 0) ? options_obj.route_scroll_offset : '15%';

                options_class_track_elem_str = (options_obj.track_class && _w.isString(options_obj.track_class)) ? options_obj.track_class : undefined;
                options_class_tag_elem_str = (options_obj.tag_class && _w.isString(options_obj.tag_class)) ? options_obj.tag_class : undefined;
                options_class_tag_flag_str = (options_obj.tag_flag && _w.isString(options_obj.tag_flag)) ? options_obj.tag_flag : 'active';
            }

            //return if relevant classes are not provided
            if(!options_class_track_elem_str || !options_class_tag_elem_str)
            {
                return false;
            }

            //set the route scroll offset
            route_scroll_offset_str = options_route_scroll_offset_str;

            //get objects for tracking and tagging
            elem_track_obj = $('.'+options_class_track_elem_str);
            elem_tag_obj = $('.'+options_class_tag_elem_str);

            if(elem_track_obj.length < 1 || elem_tag_obj.length < 1)
            {
                //track object or tag object must have length
                _w.console.error(_w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: When using scrollPostMark, your track object and tag object must have size!', true);
                return false;
            }

            if(elem_track_obj.length !== elem_tag_obj.length)
            {
                //track object length and tag object length must be equal
                _w.console.error(_w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: When using scrollPostMark, your track object length and tag object length must be equivalent!', true);
                return false;
            }

            var scrollpost_callback_fn = function(info_obj){
                elem_tag_alt_class_str = info_obj.scrollpostmark_tag_elem_class;
                elem_tag_item_obj = $(info_obj.tag_obj_sel);
                elem_tag_alt_obj = $('.'+elem_tag_alt_class_str);

                if(elem_tag_alt_obj.length > 0)
                {
                    //update class
                    if(!elem_tag_item_obj.hasClass(options_class_tag_flag_str))
                    {
                        elem_tag_alt_obj.removeClass(options_class_tag_flag_str);
                        elem_tag_item_obj.addClass(options_class_tag_flag_str);
                    }
                }
            };

            if(options_route_click_bool)
            {
                /**
                 * Adjust the scroll offset for click actions
                 * This needs to be done to ensure that when a link is clicked, and a scroll is triggered, it passes the scrollpost and triggers the hash change. Otherwise, it will just rest above the scrollpost and require just a little nudge to pass it [which is not what we want]
                 * Ergo, the scroll offset is adjusted down by 0.05%
                 * For example, if options_route_scroll_offset_str === '15%', the scroll offset will be '14.25%'. This will guarantee that it will scroll just past the scrollpost and trigger the hash change
                 */
                var options_offset_int,
                    options_offset_value_str,
                    options_offset_unit_str = '';
                if(/^ *([0-9]+(?:\.[0-9]+|))(\%) *$/i.test(options_route_scroll_offset_str))
                {
                    options_route_scroll_offset_str = options_route_scroll_offset_str.trim();
                    options_offset_value_str = options_route_scroll_offset_str.slice(0, -1);
                    options_offset_unit_str = options_route_scroll_offset_str.slice(-1);
                    options_offset_int = parseInt(options_offset_value_str);
                }
                else
                {
                    options_offset_int = parseInt(options_route_scroll_offset_str);
                }

                var options_offset_scroll_adj_num = options_offset_int*0.95;
                route_scroll_offset_str = options_offset_scroll_adj_num+options_offset_unit_str;
            }

            //cycle
            elem_tag_obj.each(function(index){

                index_prev_int = index-1;

                elem_track_item_id_str = $(elem_track_obj[index]).attr('id');

                elem_tag_item_id_str = $(this).attr('id');
                elem_tag_item_href_str = $(this).attr('href');

                //manage routes
                options_route_str = elem_tag_item_href_str;
                if(_w.isString(options_route_str) && /^ *([\#\!\/]+?)([^\s\/]+?) *$/i.test(options_route_str))
                {
                    options_route_regex_arr = _w.regexMatchAll(/^ *([\#\!\/]+?)([^\s\/]+?) *$/i, options_route_str);

                    options_route_hash_str = options_route_regex_arr[0][1];
                    options_route_path_str = options_route_regex_arr[0][2];

                    options_route_hash_arr.push(options_route_hash_str);
                    options_route_path_arr.push(options_route_path_str);

                    if(index === 0)
                    {
                        options_route_hash_up_str = undefined;
                        options_route_path_up_str = undefined;
                    }
                    else
                    {
                        options_route_hash_up_str = options_route_hash_arr[index_prev_int];
                        options_route_path_up_str = options_route_path_arr[index_prev_int];
                    }
                }

                //setup scrollpost
                scrollpost_pos_1_str = '#'+elem_track_item_id_str+'|'+options_route_scroll_offset_str+'y#up';
                scrollpost_options_1_obj = {callback: scrollpost_callback_fn, scrollpostmark_class_track_elem : options_class_track_elem_str, scrollpostmark_class_tag_elem : options_class_tag_elem_str, scrollpostmark_id_tag_elem : elem_tag_item_id_str, route_path: options_route_path_up_str, route_hash: options_route_hash_up_str};
                _scrollPost(elem_track_item_id_str, scrollpost_pos_1_str, scrollpost_options_1_obj);

                scrollpost_pos_2_str = '#'+elem_track_item_id_str+'|'+options_route_scroll_offset_str+'y#down';
                scrollpost_options_2_obj = {callback: scrollpost_callback_fn, scrollpostmark_class_track_elem : options_class_track_elem_str, scrollpostmark_class_tag_elem : options_class_tag_elem_str, scrollpostmark_id_tag_elem : elem_tag_item_id_str, route_path: options_route_path_str, route_hash: options_route_hash_str};
                _scrollPost(elem_track_item_id_str, scrollpost_pos_2_str, scrollpost_options_2_obj);

                if(options_route_click_bool)
                {
                    //initialize route options
                    var route_options_obj = {hash_char: options_route_hash_str, nohashchange: true};

                    if(options_route_scroll_bool)
                    {
                        //enable scroll in options
                        route_options_obj.scroll_target = elem_track_item_id_str;
                        route_options_obj.scroll_speed = options_route_scroll_speed_int_or_str;
                        route_options_obj.scroll_offset = route_scroll_offset_str;
                    }

                    //activate route
                    _route(options_route_path_str, route_options_obj);
                }

            });
        }

        /**
         * Provides simple scroll trigger functionality
         * @param params_arr {Array} the name that will identify the scrollpost
         * @param options_obj {Object}
         * @returns {wizmo}
         */
        wizmo_obj.scrollPostMark = function(options_obj)
        {
            _scrollPostMark(options_obj);
            return this;
        };


        /**
         * Detects font-face support
         * @private
         */
        function _detectFontFaceSupport()
        {
            var ua_str = wizmo.getUserAgent(),
                doc = document,
                head = doc.head || doc.getElementsByTagName( "head" )[ 0 ] || doc.documentElement,
                style = doc.createElement( "style" ),
                rule = "@font-face { font-family: 'webfont'; src: 'https://'; }",
                supportFontFace = false,
                sheet
                ;

            //if proxy browser, return false
            if(wizmo.hasProxyBrowser())
            {
                return false;
            }

            //if certain devices match, return false
            if(/(Android +(1.0|1.1|1.5|1.6|2.0|2.1))|(Nokia)|(Opera +(Mini|Mobi))|(w(eb)?OSBrowser)|(UCWEB)|(Windows +Phone.*?7)|(XBLWP)|(ZuneWP)/i.test(ua_str))
            {
                return false;
            }

            // main font-face detection test
            // + original by: Chris Ferdinandi <https://gist.github.com/cferdinandi/6269067>
            // + updated by: Obinwanne Hill <>
            style.type = "text/css";
            style.id = "detect_font_face";
            head.insertBefore( style, head.firstChild );
            sheet = style.sheet || style.styleSheet;

            if (!!sheet) {
                try
                {
                    sheet.insertRule( rule, 0 );
                    supportFontFace = sheet.cssRules[ 0 ].cssText && ( /webfont/i ).test( sheet.cssRules[ 0 ].cssText );
                    sheet.deleteRule( sheet.cssRules.length - 1 );
                }
                catch( e ) { }
                finally
                {
                    //remove style
                    sheet = document.getElementById("detect_font_face");
                    sheet.parentNode.removeChild(sheet);
                }
            }

            return supportFontFace;
        }

        /**
         * Wrapper class for _detectFontFaceSupport
         * @returns {Boolean}
         */
        wizmo_obj.detectFontFace = function()
        {
            if(wizmo.storeCheck("var_device_browser_font_face"))
            {
                return wizmo.store("var_device_browser_font_face");
            }

            var is_retr_val_bool = _detectFontFaceSupport();
            wizmo.store("var_device_browser_font_face", is_retr_val_bool);
            return is_retr_val_bool;
        };

        /**
         * Adds a font to the loading queue
         * Uses FontObserver script
         * @param {String} font_family_str the font-family name
         * @param {Object} options_obj an object describing the variation
         *
         * weight: the font-weight [as defined in CSS]
         * style: the font-style [as defined in CSS]
         * stretch: the font-stretch [as defined in CSS]
         *
         * Example: {weight: 300, style: "italic"}
         * Note: You would only need to use options if you need to load the same font-family with different weights and/or styles
         * Note: Make sure your CSS font-face declarations match with the provided options
         *
         * @return
         */
        wizmo_obj.addFont = function (font_family_str){
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (!_w.isObjectEmpty(myArgs[1])) ? myArgs[1] : {},
                font_obj
                ;

            //create font object
            font_obj = {'font-family': font_family_str, 'font-options': options_obj};

            //create queue if not set
            if(!wQuery.data('w_var_font_load_queue'))
            {
                wQuery.data('w_var_font_load_queue', []);
            }

            //add to queue
            wQuery.data('w_var_font_load_queue').push(font_obj);
            return this;
        };

        /**
         * Loads a web font
         * @param {Function} callback_fn a function to execure when the font is loaded
         */
        wizmo_obj.loadFont = function()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                callback_fn = myArgs[0],
                font_store_arr_obj = wQuery.data('w_var_font_load_queue'),
                elem_body_obj = $('body')
                ;

            function loadFontSub(font_obj)
            {
                var font_obj_family_str = font_obj['font-family'];
                var font_obj_options_obj = font_obj['font-options'];

                var font_load_obj = new FontFaceObserver(font_obj_family_str, font_obj_options_obj);

                return font_load_obj.load();
            }

            Promise.all(font_store_arr_obj.map(loadFontSub)).then(function (){
                //add class if not added
                if(!elem_body_obj.hasClass('w_fonts_loaded'))
                {
                    elem_body_obj.addClass('w_fonts_loaded');
                }

                //run callback if provided
                if(callback_fn)
                {
                    callback_fn();
                }
            });
        };

        /**
         * Detect whether SVG is supported
         * @return {Boolean}
         * @private
         */
        function _detectSVGSupport()
        {
            /* jshint -W116 */
            return ((typeof SVGRect != "undefined"));
            /* jshint +W116 */
        }

        /**
         * Wrapper class for _detectSVGSupport
         * @returns {Boolean}
         */
        wizmo_obj.detectSVG = function()
        {
            if(wizmo.storeCheck("var_device_browser_svg"))
            {
                return wizmo.store("var_device_browser_svg");
            }

            var is_retr_val_bool = _detectSVGSupport();
            wizmo.store("var_device_browser_svg", is_retr_val_bool);
            return is_retr_val_bool;
        };

        /**
         * Detect whether CSS Transitions is supported
         * @return {Boolean}
         * @private
         */
        function _detectCSSTransitionSupport()
        {
            var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
                v = ['ms','O','Moz','Webkit','webkit','Khtml']; // 'v' for vendor

            /* jshint -W116 */
            if( s.transition == '' ){ return true; } // check first for prefixed-free support
            /* jshint +W116 */
            // now go over the list of vendor prefixes and check support until one is found
            while( v.length )
            {
                if( v.pop() + 'Transition' in s ) { return true; }
            }
            return false;
        }

        /**
         * Wrapper class for _detectCSSTransitionSupport
         * @returns {Boolean}
         */
        wizmo_obj.detectCSSTransition = function()
        {
            if(wizmo.storeCheck("var_device_browser_css_trans"))
            {
                return wizmo.store("var_device_browser_css_trans");
            }

            var is_retr_val_bool = _detectCSSTransitionSupport();
            wizmo.store("var_device_browser_css_trans", is_retr_val_bool);
            return is_retr_val_bool;
        };

        /**
         * Simple Feature Detection
         */
        wizmo_obj.detect = {
            /**
             * Detect CSS Transition Support
             * Wrapper for wizmo.detectCSSTransition
             * @returns {Boolean}
             */
            cssTransition: function(){
                return wizmo.detectCSSTransition();
            },
            /**
             * Detect SVG Support
             * Wrapper for wizmo.detectSVG
             * @returns {Boolean}
             */
            svg: function(){
                return wizmo.detectSVG();
            },
            /**
             * Detect Font-face Support
             * Wrapper for wizmo.detectFontFace
             * @returns {Boolean}
             */
            fontFace: function(){
                return wizmo.detectFontFace();
            }
        };

        /**
         * Loads HTML into the HTML page
         * @param path_str {String} the path to the HTML file
         * @param options_obj {Object} the load options
         * - target: the DOM element that will receive the loaded HTML
         * - prepend: if true, will prepend content
         * - replace: if true, will replace content
         * - template: a template object to transform loaded HTML
         *
         * Note: you can also use _load options as they will pass-through to _load method
         *
         * @return {wizmo}
         */
        wizmo_obj.loadHTML = function(path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1] && _w.isObject(myArgs[1])) ? myArgs[1] : {},
                options_final_obj = {}
                ;

            //define default options
            options_final_obj.load_loc = (_w.isString(options_obj.load_loc)) ? options_obj.load_loc : 'body';
            options_final_obj.load_loc = (_w.isString(options_obj.target)) ? options_obj.target : 'body';
            options_final_obj.prepend = (_w.isBool(options_obj.prepend)) ? options_obj.prepend : false;
            options_final_obj.replace = (_w.isBool(options_obj.replace)) ? options_obj.replace : false;
            options_final_obj.xhr_options = (options_obj.xhr_options && _w.isObject(options_obj.xhr_options)) ? options_obj.xhr_options : {};
            if(options_obj.template && _w.isObject(options_obj.template))
            {
                options_final_obj.xhr_options.response_template = options_obj.template;
            }

            _load(path_str, options_final_obj);
            return this;
        };

        /**
         * Creates a copy of HTML in a string
         * @param html_str_or_obj {String|Object} the HTML String or DOM object
         * @param options_obj {Object} the options
         * Options are:
         * filter_id {String}: Used to filter content from the original HTML.
         * For example, to get the HTML of a sub-element within the original HTML identified by $('#main'), set filter_id to 'main'. Optional
         * target_id {String}: This is where the cloned HTML will be inserted. By default, the HTML is appended to the element. Default target is <body>. Optional
         * prepend {Boolean}: If set to true, cloned HTML will be prepended to <body>, or element identified by target_id if defined
         * template {Object}: the template context
         *
         * @return {wizmo}
         */
        wizmo_obj.cloneHTML = function(html_str_or_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1]) ? myArgs[1] : {},
                elem_source_id_str = (_w.isString(options_obj.source_id)) ? options_obj.source_id : null,
                elem_target_id_str = (_w.isString(options_obj.target_id)) ? options_obj.target_id : null,
                prepend_bool = (_w.isBool(options_obj.prepend)) ? options_obj.prepend : false,
                template_ctx = (options_obj.template) ? options_obj.template : null
                ;

            //manage template
            if(template_ctx)
            {
                html_str_or_obj = _compile(html_str_or_obj, template_ctx);
            }

            //push to DOM
            _port(html_str_or_obj, elem_source_id_str, elem_target_id_str, prepend_bool);

            return this;
        };

        /**
         * Retrieves the URL of the current page/document
         * Also extracts extra URL parameters
         * @param option_flag_str {String} If present, specifies a specific part of the URL to return
         * The following option flags available are:
         * 1. h [hostname]: will return 'wizmo.io' if URL is 'http://wizmo.io/index.html'
         * 2. hp [hostpath]: will return 'http://wizmo.io' if URL is 'http://wizmo.io/index.html'. Note: will include port number if provided
         * 3. s [scheme]: will return 'http://' if URL is 'http://wizmo.io/index.html'
         * 4. p [protocol]: will return 'http' if URL is 'http://wizmo.io/index.html'
         * 5. po [port]: will return '8080' if URL is 'http://wizmo.io:8080/index.html'
         * 6. pn [pathname]: will return 'path' if URL is 'http://wizmo.io/path'
         * 7. f [filename]: will return 'index.html' if URL is 'http://wizmo.io/index.html'
         * 8. fb [filebase]: will return 'index' if URL is 'http://wizmo.io/index.html'
         * 9. ld [lastdir]: will return the last directory.
         * - If URL is 'http://wizmo.io/dir_1/dir_2', the last directory will be 'dir_2'
         * - If URL is 'http://wizmo.io/dir_1/dir_2/index.html', the last directory will be 'dir_2'
         * - If URL is 'http://wizmo.io/dir_1/dir_2/', the last directory will be '/'
         * 10. bp [basepath] - Will return 'http://wizmo.io/index.html' if current URL is 'http://wizmo.io/index.html?id=1234'
         * 11. cp [corepath] - Will return 'wizmo.io/index.html' if current URL is 'http://wizmo.io/index.html?id=1234'. Note: scheme is not included
         * 12. bd [basedir] - Will return 'http://wizmo.io/test' if current URL is 'http://wizmo.io/test/index.html?id=4'
         * 13. q [query] - Will return '?id=1234' if current URL is 'http://wizmo.io/index.html?id=1234'
         * 14. hs [hash] - Will return '#my-hash' if current URL is 'http://wizmo.io/index.html#my-hash'
         * @param url_str {String} By default, this function uses document.URL or window.location.href to capture the URL. You can provide your own custom url using this parameter
         * @return {String}
         */
        function _getUrl()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                option_flag_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0]: '',
                url_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : document.URL || window.location.href,
                url_temp_str,
                url_temp_file_str,
                url_temp_dir_str,
                url_temp_arr = [],
                url_temp_sub_arr = [],
                url_temp_q_str,
                url_q_str,
                url_temp_hash_arr = [],
                is_url_has_q_bool = /\?+/.test(url_str),
                is_url_has_hash_bool = /\#+/.test(url_str),
                url_match_arr = _w.regexMatchAll(/^([h|f]{1}[t]{0,1}tp[s]{0,1}\:\/\/|)([^ ]+?)([\?\#]([^ ]*)|)$/i, url_str)
                ;

            if(option_flag_str === 'hostname' || option_flag_str === 'h')
            {
                url_temp_str = url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_sub_arr = _w.explode(':', url_temp_arr[0]);
                return url_temp_sub_arr[0];
            }
            else if(option_flag_str === 'hostpath' || option_flag_str === 'hp')
            {
                url_temp_str = url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_sub_arr = _w.explode(':', url_temp_arr[0]);
                return url_match_arr[0][1]+url_temp_arr[0];
            }
            else if(option_flag_str === 'scheme' || option_flag_str === 's')
            {
                return url_match_arr[0][1];
            }
            else if(option_flag_str === 'protocol' || option_flag_str === 'p')
            {
                url_temp_str = url_match_arr[0][1];
                url_temp_str = url_temp_str.slice(0, -3);
                return url_temp_str;
            }
            if(option_flag_str === 'port' || option_flag_str === 'po')
            {
                url_temp_str = url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_sub_arr = _w.explode(':', url_temp_arr[0]);
                return (url_temp_sub_arr[1] && _w.isString(url_temp_sub_arr[1]) && url_temp_sub_arr[1].length > 0) ? url_temp_sub_arr[1] : '';
            }
            else if(option_flag_str === 'pathname' || option_flag_str === 'pn')
            {
                url_temp_str = url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_arr.shift();
                return _w.implode('/', url_temp_arr);
            }
            else if (option_flag_str === 'filename' || option_flag_str === 'f')
            {
                url_temp_str = url_match_arr[0][1]+url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_str = url_temp_arr.pop();
                return url_temp_str;
            }
            else if (option_flag_str === 'filebase' || option_flag_str === 'fb')
            {
                url_temp_str = url_match_arr[0][1]+url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_str = url_temp_arr.pop();

                if(!_w.isEmptyString(url_temp_str))
                {
                    //do only if value is not blank

                    url_temp_arr = _w.regexMatchAll(/^ *([^ ]+?)(\.[^ \.]+?) *$/i, url_temp_str);
                    url_temp_str = url_temp_arr[0][1];
                }

                return url_temp_str;
            }
            else if(option_flag_str === 'lastdir' || option_flag_str === 'ld')
            {
                url_temp_str = url_match_arr[0][2];
                url_temp_arr = _w.explode('/', url_temp_str);

                url_temp_file_str = url_temp_arr.pop();
                url_temp_dir_str = url_temp_arr.pop();

                url_temp_str = '';
                if(/^ *$/i.test(url_temp_file_str))
                {
                    //root

                    url_temp_str = '/';
                }
                else if (/^ *[^ ]+?\.[a-zA-Z0-9]+? *$/i.test(url_temp_file_str))
                {
                    //filename

                    url_temp_str = url_temp_dir_str;
                }
                else if (/^ *[^ \.]+? *$/i.test(url_temp_file_str))
                {
                    //directory

                    url_temp_str = url_temp_file_str;
                }

                return url_temp_str;
            }
            else if (option_flag_str === 'basepath' || option_flag_str === 'bp')
            {
                return (is_url_has_q_bool || is_url_has_hash_bool) ? url_match_arr[0][1]+url_match_arr[0][2] : url_str;
            }
            else if (option_flag_str === 'corepath' || option_flag_str === 'cp')
            {
                return (is_url_has_q_bool || is_url_has_hash_bool) ? url_match_arr[0][2] : url_str;
            }
            else if (option_flag_str === 'basedir' || option_flag_str === 'bd')
            {
                url_temp_str = (is_url_has_q_bool || is_url_has_hash_bool) ? url_match_arr[0][1]+url_match_arr[0][2] : url_str;
                url_temp_arr = _w.explode('/', url_temp_str);
                url_temp_arr.pop();

                return _w.implode('/', url_temp_arr);
            }
            else if (option_flag_str === 'query' || option_flag_str === 'q')
            {
                url_temp_q_str = url_match_arr[0][3];

                //remove hash if present
                url_q_str = url_temp_q_str.replace(/\#.*?$/i, '');

                return (is_url_has_q_bool) ? url_q_str: "";
            }
            else if (option_flag_str === 'hash' || option_flag_str === 'hs')
            {
                url_temp_q_str = url_match_arr[0][3];

                if(/[^ ]+?\#.+?$/i.test(url_temp_q_str))
                {
                    url_temp_hash_arr = _w.explode('#', url_temp_q_str);
                    return '#'+url_temp_hash_arr[1];
                }
                else
                {
                    return (is_url_has_hash_bool) ? url_temp_q_str : "";
                }
            }
            else
            {
                return url_str;
            }
        }

        /**
         * Uses a regex to test a URL
         * Returns true if it matches the condition
         * @param regex_str {String} the regular expression. This string will be injected using new RegExp() method so it should be escaped appropriately
         * @param option_flag_str {String} If present, specifies a specific part of the URL to return. See _getURL for more on option flags
         * @param url_str {String} By default, this function uses document.URL or window.location.href to capture the URL. You can provide your own custom url using this parameter
         * @returns {boolean|*}
         * @private
         */
        function _testUrl()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                regex_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0]: '',
                option_flag_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1]: '',
                url_str = myArgs[2],
                regex_obj = new RegExp(regex_str, "i"),
                url_final_str,
                url_test_bool
                ;

            url_final_str = _getUrl(option_flag_str, url_str);
            url_test_bool = regex_obj.test(url_final_str);

            return url_test_bool;
        }

        /**
         * Resolves a directory to a full URL given a reference URL
         * @param {String} dir_path_str the directory path
         * The directory path should appear like one of the following:
         * 1. '../../dir_1/dir_2'
         * 2: '/dir_1/dir_2'
         * @param {String} url_str the URL to resolve against. If not provided, the current URL will be used
         * @example If dir_path_str == '../../dir_1/dir_2' and url_str == 'http://mydomain.com/dir_a/dir_b/dir_c/index.html', the final URL returned will be 'http://mydomain.com/dir_a/dir_1/dir_2'
         * @return {String}
         */
        function _resolveDirectoryToURL(dir_path_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                url_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : _getUrl(),
                url_basedir_str = _getUrl('basedir', url_str),
                url_host_str = _getUrl('hostpath', url_str),
                url_basedir_arr = [],
                url_basedir_final_str,
                count_updir_int,
                url_final_str;

            //do only if directory-like
            if(/^ *(\.\.|\/)[^\s]+/i.test(dir_path_str))
            {
                //compose the final url
                url_final_str = url_basedir_str+'/'+dir_path_str;

                //manage step-ups in directory if required
                count_updir_int = _w.substr_count(dir_path_str, '../');

                if(count_updir_int > 0)
                {
                    url_basedir_arr = _w.explode('/', url_basedir_str);

                    for (var i = 0; i < count_updir_int; i++)
                    {
                        url_basedir_arr.pop();
                    }

                    //create new base dir
                    url_basedir_final_str = _w.implode('/', url_basedir_arr);

                    //create new view base dir
                    dir_path_str = dir_path_str.replace(/\.\.\//g, "");

                    url_final_str = url_basedir_final_str+'/'+dir_path_str;
                }
                else if (/^ *\/[^\s]*/i.test(dir_path_str))
                {
                    //leading forward slash. use host path

                    url_final_str = url_host_str+dir_path_str;
                }

                return url_final_str;
            }
            else
            {
                return dir_path_str;
            }
        }

        /**
         * URL functions
         */
        wizmo_obj.url = {
            /**
             * Navigates to the current URL
             * @param {String} url_str the URL to navigate to
             */
            go: function(url_str)
            {
                window.location.href = url_str;
            },
            /**
             * Retrieves the current URL
             * Wrapper class for _getUrl. See _getUrl for more information
             * @returns {String}
             */
            get: function(){
                var myArgs = Array.prototype.slice.call(arguments);
                return _getUrl(myArgs[0], myArgs[1]);
            },
            /**
             * Resolves a directory to a full URL given a reference directory
             * Wrapper class for _resolveDirectoryToURL. See _resolveDirectoryToURL for more information
             * @return {String}
             */
            resolveDir: function(){
                var myArgs = Array.prototype.slice.call(arguments);
                return _resolveDirectoryToURL(myArgs[0], myArgs[1]);
            },
            /**
             * Uses a regex to test a URL
             * Returns true if it matches the condition
             * @param regex_str {String} the regular expression. This string will be injected using new RegExp() method so it should be escaped appropriately
             * @param option_flag_str {String} If present, specifies a specific part of the URL to return. See _getURL for more on option flags
             * @param url_str {String} By default, this function uses document.URL or window.location.href to capture the URL. You can provide your own custom url using this parameter
             * @return {Boolean}
             */
            test: function()
            {
                var myArgs = Array.prototype.slice.call(arguments);
                return _testUrl(myArgs[0], myArgs[1], myArgs[2]);
            },
            /**
             * Marks a DOM element [with a class] if the current URL matches a given pattern [regex]
             * @param {String} regex_str the regex pattern to test for
             * @param {String} flag_str the class to add to DOM element
             * @param {String} option_flag_str see _getUrl method. Default is 'filebase'
             * @param {String} ctx_ref_str the DOM element reference. Default is 'body'
             * @return wizmo
             */
            flag: function(regex_str, flag_str)
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    option_flag_str = (!_w.isEmptyString(myArgs[2])) ? myArgs[2] : 'filebase',
                    ctx_ref_str = (!_w.isEmptyString(myArgs[3])) ? myArgs[3] : 'body',
                    ctx_obj = $(ctx_ref_str)
                    ;

                if(_testUrl(regex_str, option_flag_str))
                {
                    ctx_obj.addClass(flag_str);
                }

                return this;
            }
        };

        /**
         * Builds a URL query from a form data object
         * @param {Object} form_data_obj the form data in a key-value object form e.g. {first: 'one', second: 'two'}
         * @returns {*}
         * @private
         */
        function _buildFormSubmitQuery(form_data_obj)
        {
            if(!_w.isObject(form_data_obj))
            {
                return false;
            }

            var key_fix_str,
                form_data_item_tok_str,
                form_data_item_tok_arr = [],
                form_data_tok_str
                ;

            for (var key in form_data_obj)
            {
                if (form_data_obj.hasOwnProperty(key)) {

                    //replace post-bracket counters e.g. item[]0
                    key_fix_str = key.replace(/(.+\[ *\])[0-9]+/i, "$1");

                    //push to data item array
                    form_data_item_tok_str = key_fix_str+'='+form_data_obj[key];
                    form_data_item_tok_arr.push(form_data_item_tok_str);
                }
            }

            form_data_tok_str = _w.implode('&', form_data_item_tok_arr);
            return form_data_tok_str;
        }

        /**
         * Submits a form using AJAX and retrives the result
         * Note: This method will submit only form data from <input>, <select>, and <textarea>
         * @param {String} elem_form_id_str the form identifier i.e. the id attribute value of the form
         * @param {String} url_str the URL where the form will be submitted
         * Note: If no URL is provided, or URL is '#', then the form will not be posted to a URL; form values will be posted to done_fn callback on click of submit button
         * @param {Function} done_fn a callback function to be executed if the form is submitted successfully. The XHR object will be passed as the first argument
         * @param {Function} fail_fn a callback function to be executed if the form encounters an error. The XHR object will be passed as the first argument
         * @private
         */
        function _submitForm()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                elem_form_id_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0]: '',
                url_str = (_w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1]: '',
                done_fn = (myArgs[2]) ? myArgs[2] : null,
                fail_fn = (myArgs[3]) ? myArgs[3] : null,
                done_fn_args_arr = (myArgs[4]) ? myArgs[4] : [],
                fail_fn_args_arr = (myArgs[5]) ? myArgs[5] : [],
                elem_form_obj,
                elem_form_item_input_arr,
                elem_form_item_select_arr,
                elem_form_item_textarea_arr,
                elem_form_item_type_str,
                elem_form_item_name_str,
                elem_form_item_value_str,
                form_data_obj,
                form_data_tok_str,
                counter_elem_form_item_checkbox_int = 0,
                url_is_hash_or_blank_bool = (/^ *(\#|) *$/i.test(url_str))
                ;

            //create function to get form data
            var getFormData = function(form_obj)
            {
                var form_data_obj = {};

                //get form element items
                elem_form_item_input_arr = form_obj.find('input');
                elem_form_item_select_arr = form_obj.find('select');
                elem_form_item_textarea_arr = form_obj.find('textarea');

                //get <input> form data
                if(elem_form_item_input_arr.length > 0)
                {
                    elem_form_item_input_arr.each(function()
                    {
                        elem_form_item_type_str = $(this).attr('type');
                        elem_form_item_name_str = $(this).attr('name');
                        elem_form_item_value_str = (url_is_hash_or_blank_bool) ? $(this).val() : encodeURIComponent($(this).val());
                        if(elem_form_item_type_str === 'radio')
                        {
                            if(this.checked)
                            {
                                form_data_obj[elem_form_item_name_str] = elem_form_item_value_str;
                            }
                        }
                        else if (elem_form_item_type_str === 'checkbox')
                        {
                            if(this.checked)
                            {
                                form_data_obj[elem_form_item_name_str+counter_elem_form_item_checkbox_int] = elem_form_item_value_str;
                            }
                            counter_elem_form_item_checkbox_int++;
                        }
                        else
                        {
                            form_data_obj[elem_form_item_name_str] = elem_form_item_value_str;
                        }
                    });
                }

                //get <select> form data
                if(elem_form_item_select_arr.length > 0)
                {
                    elem_form_item_select_arr.each(function(){
                        elem_form_item_name_str = $(this).attr('name');
                        elem_form_item_value_str = (url_is_hash_or_blank_bool) ? $(this).val() : encodeURIComponent($(this).val());

                        form_data_obj[elem_form_item_name_str] = elem_form_item_value_str;
                    });
                }

                //get <textarea> form data
                if(elem_form_item_textarea_arr.length > 0)
                {
                    elem_form_item_textarea_arr.each(function(){
                        elem_form_item_name_str = $(this).attr('name');
                        elem_form_item_value_str = (url_is_hash_or_blank_bool) ? $(this).val() : encodeURIComponent($(this).val());

                        form_data_obj[elem_form_item_name_str] = elem_form_item_value_str;
                    });
                }

                return form_data_obj;
            };

            //get form element object
            elem_form_obj = $('#'+elem_form_id_str);

            //if url is hash or empty
            if(url_is_hash_or_blank_bool)
            {
                //dont post

                elem_form_obj.find("[type='submit']").on('click', function(event){
                    wQuery.preventDefault(event);

                    //get form data
                    form_data_obj = getFormData(elem_form_obj);

                    //run callback
                    done_fn(form_data_obj, done_fn_args_arr);
                });
            }
            else
            {
                //post

                //get form data
                form_data_obj = getFormData(elem_form_obj);

                //convert to name-value pair
                form_data_tok_str = _buildFormSubmitQuery(form_data_obj);

                //add to url
                if(/^.+?\?.+?$/i.test(url_str))
                {
                    url_str += '&'+form_data_tok_str;
                }
                else
                {
                    url_str += '?'+form_data_tok_str;
                }

                //execute via AJAX
                $.ajax(url_str, {method: 'POST', response: false}).then(function(xhr){
                    done_fn(xhr, done_fn_args_arr);
                }, function(xhr){
                    fail_fn(xhr, fail_fn_args_arr);
                });
            }
        }

        /**
         * Resets a form
         * @param {String} elem_form_id_str the form identifier i.e. the id attribute value of the form
         * @param {Object} default_value_obj an object containing default values to use to populate
         * @private
         */
        function _resetForm()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                elem_form_id_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0]: '',
                default_values_obj = (_w.isObject(myArgs[1])) ? myArgs[1]: {},
                elem_form_obj,
                elem_form_item_input_arr,
                elem_form_item_select_arr,
                elem_form_item_textarea_arr,
                elem_form_item_type_str,
                elem_form_item_name_str,
                elem_form_item_value_str,
                checkbox_allowed_index_arr = [],
                counter_elem_form_item_checkbox_int = 0
                ;

            //get form element object
            elem_form_obj = $('#'+elem_form_id_str);

            //get form element items
            elem_form_item_input_arr = elem_form_obj.find('input');
            elem_form_item_select_arr = elem_form_obj.find('select');
            elem_form_item_textarea_arr = elem_form_obj.find('textarea');

            //get <input> form data
            if(elem_form_item_input_arr.length > 0)
            {
                elem_form_item_input_arr.each(function(){

                    elem_form_item_type_str = $(this).attr('type');
                    elem_form_item_name_str = $(this).attr('name').trim();
                    elem_form_item_value_str = encodeURIComponent($(this).val());
                    if(elem_form_item_type_str === 'radio')
                    {
                        this.checked = false;
                        if(default_values_obj[elem_form_item_name_str] === ''+elem_form_item_value_str+'')
                        {
                            this.checked = true;
                        }
                    }
                    else if (elem_form_item_type_str === 'checkbox')
                    {
                        this.checked = false;
                        if(default_values_obj[elem_form_item_name_str])
                        {
                            checkbox_allowed_index_arr = _w.explode(',', default_values_obj[elem_form_item_name_str]);
                            if(_w.in_array(''+counter_elem_form_item_checkbox_int+'', checkbox_allowed_index_arr)) {
                                this.checked = true;
                            }
                            counter_elem_form_item_checkbox_int++;
                        }
                    }
                    else
                    {
                        $(this).val("");
                        if(default_values_obj[elem_form_item_name_str])
                        {
                            $(this).val(default_values_obj[elem_form_item_name_str]);
                        }
                    }
                });
            }

            //get <select> form data
            if(elem_form_item_select_arr.length > 0)
            {
                elem_form_item_select_arr.each(function(){
                    elem_form_item_name_str = $(this).attr('name');

                    this.selectedIndex = 0;
                    if(default_values_obj[elem_form_item_name_str])
                    {
                        this.value = default_values_obj[elem_form_item_name_str];
                    }
                });
            }

            //get <textarea> form data
            if(elem_form_item_textarea_arr.length > 0)
            {
                elem_form_item_textarea_arr.each(function(){
                    elem_form_item_name_str = $(this).attr('name');
                    $(this).val("");
                    if(default_values_obj[elem_form_item_name_str])
                    {
                        $(this).val(default_values_obj[elem_form_item_name_str]);
                    }
                });
            }
        }

        /**
         * Form functions
         */
        wizmo_obj.form = {
            /**
             * Resets a form
             * Wrapper for _resetForm method
             * See _resetForm for more information
             */
            reset: function(){
                var myArgs = Array.prototype.slice.call(arguments);
                _resetForm(myArgs[0], myArgs[1]);
            },
            /**
             * Submits a form using AJAX
             * Wrapper for _submitForm method
             * See _submitForm for more information
             */
            submit: function(){
                var myArgs = Array.prototype.slice.call(arguments);
                _submitForm(myArgs[0], myArgs[1], myArgs[2], myArgs[3], myArgs[4], myArgs[5]);
            }
        };

        /**
         * Parses a datetime value to component parts
         * @param {String} datetime_str the datetime value
         * @return {Object}
         * @private
         */
        function _parseDateTime(datetime_str)
        {
            var datetime_final_obj = {},
                datetime_temp_utc_str;

            //validate datetime
            if(!/^ *([0-9]{4}\-[0-9]{2}\-[0-9]{2})(?:T| +)([0-9]{2}\:[0-9]{2}\:[0-9]{2})(?:Z|) *$/i.test(datetime_str))
            {
                return datetime_str;
            }

            //generate UTC time
            datetime_temp_utc_str = datetime_str.replace(/([0-9]{4}\-[0-9]{2}\-[0-9]{2}) +([0-9]{2}\:[0-9]{2}\:[0-9]{2})/i, '$1T$2Z');

            //populate datetime object
            datetime_final_obj['datetime_utc'] = datetime_temp_utc_str;
            datetime_final_obj['date'] = datetime_str.slice(0, 10);
            datetime_final_obj['year'] = datetime_str.slice(0, 4);
            datetime_final_obj['month'] = datetime_str.slice(5, 7);
            datetime_final_obj['day'] = datetime_str.slice(8, 10);
            datetime_final_obj['time'] = datetime_str.slice(11, 19);
            datetime_final_obj['hour'] = datetime_str.slice(11, 13);
            datetime_final_obj['minute'] = datetime_str.slice(14, 16);
            datetime_final_obj['second'] = datetime_str.slice(17, 19);

            return datetime_final_obj;
        }

        /**
         * Filters a datetime value
         * @param {String} datetime_str the datetime value
         * @param {String} type_key_str the type key determines what to return
         * If no value is provided, the datetime in ISO-8601 format will be returned e.g. 2014-27-07T12:20:15Z
         * date - date only in YYYY-MM-DD format
         * day - day in DD format
         * month - month in MM format
         * year - year in YY format
         * time - time only in HH:mm:ss format
         * hour - hour in HH format
         * minute - minute in mm format
         * second - second in ss format
         * @returns {*}
         * @private
         */
        function _filterDateTime(datetime_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                type_str = (_w.isString(myArgs[1])) ? myArgs[1]: '',
                datetime_final_str = datetime_str,
                datetime_temp_str;

            //validate datetime
            if(!/^ *([0-9]{4}\-[0-9]{2}\-[0-9]{2})(?:T| +)([0-9]{2}\:[0-9]{2}\:[0-9]{2})(?:Z|) *$/i.test(datetime_str))
            {
                return datetime_str;
            }

            //convert datetime to iso
            datetime_temp_str = datetime_str.trim();
            datetime_temp_str = datetime_temp_str.replace(/ +/g, ' ');

            switch(true)
            {
                case (type_str === 'datetime_utc'):
                    datetime_final_str = datetime_str.replace(/([0-9]{4}\-[0-9]{2}\-[0-9]{2})[^0-9]+([0-9]{2}\:[0-9]{2}\:[0-9]{2})/i, '$1T$2Z');
                    break;

                case (type_str === 'datetime'):
                    datetime_temp_str = datetime_str.replace('T', ' ');
                    datetime_final_str = datetime_temp_str.replace('Z', '');
                    break;

                case (type_str === 'date'):
                    datetime_final_str = datetime_str.slice(0, 10);
                    break;

                case (type_str === 'year'):
                    datetime_final_str = datetime_str.slice(0, 4);
                    break;

                case (type_str === 'month'):
                    datetime_final_str = datetime_str.slice(5, 7);
                    break;

                case (type_str === 'day'):
                    datetime_final_str = datetime_str.slice(8, 10);
                    break;

                case (type_str === 'time'):
                    datetime_final_str = datetime_str.slice(11, 19);
                    break;

                case (type_str === 'hour'):
                    datetime_final_str = datetime_str.slice(11, 13);
                    break;

                case (type_str === 'minute'):
                    datetime_final_str = datetime_str.slice(14, 16);
                    break;

                case (type_str === 'second'):
                    datetime_final_str = datetime_str.slice(17, 19);
                    break;

                default:
                    datetime_final_str = datetime_str;
            }

            return datetime_final_str;
        }

        /**
         * Gets the current date and time
         * @param type_str {String} determines what to return. Multiple options available as follows:
         * If no value is provided, the datetime in ISO-8601 format will be returned e.g. 2014-27-07T12:20:15Z
         * date - date only in YYYY-MM-DD format
         * day - day in DD format
         * month - month in MM format
         * year - year in YY format
         * time - time only in HH:mm:ss format
         * hour - hour in HH format
         * minute - minute in mm format
         * second - second in ss format
         * @param utc_offset_bool {Boolean} specifies whether UTC offset should be used for time
         * @return {String}
         */
        function _getDateTime()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                type_str = (_w.isString(myArgs[0])) ? myArgs[0]: '',
                utc_offset_bool = (_w.isBool(myArgs[1])) ? myArgs[1]: false,
                date_obj = new Date(),
                date_year,
                date_month,
                date_day,
                time_hour,
                time_minute,
                time_second,
                date_final_str;

            if(utc_offset_bool)
            {
                date_year = date_obj.getUTCFullYear().toString();
                date_month = (date_obj.getUTCMonth()+1).toString();
                date_day = date_obj.getUTCDate().toString();
                time_hour = date_obj.getUTCHours().toString();
                time_minute = date_obj.getUTCMinutes().toString();
                time_second = date_obj.getUTCSeconds().toString();
            }
            else
            {
                date_year = date_obj.getFullYear().toString();
                date_month = (date_obj.getMonth()+1).toString();
                date_day = date_obj.getDate().toString();
                time_hour = date_obj.getHours().toString();
                time_minute = date_obj.getMinutes().toString();
                time_second = date_obj.getSeconds().toString();
            }

            date_month = (date_month.length < 2) ? '0'+date_month : date_month;
            date_day = (date_day.length < 2) ? '0'+date_day : date_day;
            time_hour = (time_hour.length < 2) ? '0'+time_hour : time_hour;
            time_minute = (time_minute.length < 2) ? '0'+time_minute : time_minute;
            time_second = (time_second.length < 2) ? '0'+time_second : time_second;

            date_final_str = ''+date_year+'-'+date_month+'-'+date_day+'T'+time_hour+':'+time_minute+':'+time_second+'Z';

            return _filterDateTime(date_final_str, type_str);
        }

        /**
         * Converts a time, date, or datetime value to UNIX timestamp
         * @param {String} time_or_date_or_datetime_str an optional time, date or datetime string. Uses current date and time if not provided
         * @returns {*}
         * @private
         */
        function _dateTimeToTimestamp()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                time_or_date_or_datetime_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0] : _getDateTime('datetime'),
                date_str,
                date_arr,
                time_str,
                time_arr,
                datetime_arr = [],
                datetime_obj;

            if(/^ *[0-9]{4}\-[0-9]{2}\-[0-9]{2} +[0-9]{2}\:[0-9]{2}\:[0-9]{2} *$/i.test(time_or_date_or_datetime_str))
            {
                //is datetime

                datetime_arr = _w.regexMatchAll(/^ *([0-9]{4}\-[0-9]{2}\-[0-9]{2}) +([0-9]{2}\:[0-9]{2}\:[0-9]{2}) *$/i, time_or_date_or_datetime_str);

                date_str = datetime_arr[0][1];
                time_str = datetime_arr[0][2];

                date_arr = date_str.split('-');
                time_arr = time_str.split(':');

                datetime_obj = new Date(date_arr[0], parseInt(date_arr[1], 10) - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
            }
            else if (/^ *[0-9]{4}\-[0-9]{2}\-[0-9]{2} *$/i.test(time_or_date_or_datetime_str))
            {
                //is date

                date_str = time_or_date_or_datetime_str.trim();

                date_arr = date_str.split('-');
                datetime_obj = new Date(date_arr[0], parseInt(date_arr[1], 10) - 1, date_arr[2], 0, 0, 0);
            }
            else if(/^ *[0-9]{2}\:[0-9]{2}\:[0-9]{2} *$/i.test(time_or_date_or_datetime_str))
            {
                //is time

                date_str = _getDateTime('date');
                time_str = time_or_date_or_datetime_str.trim();

                date_arr = date_str.split('-');
                time_arr = time_str.split(':');

                datetime_obj = new Date(date_arr[0], parseInt(date_arr[1], 10) - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
            }
            else
            {
                //invalid
                return false;
            }

            return datetime_obj.getTime();
        }

        /**
         * Gets the time period from a time or datetime
         * @param {String} time_or_datetime_str the time or datetime value
         * @returns {Boolean|String}
         * @private
         */
        function _getTimePeriod()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                time_or_datetime_str = (_w.isString(myArgs[0]) && myArgs[0].length > 0) ? myArgs[0] : _getDateTime('datetime'),
                hour_str,
                hour_int,
                time_period_str
                ;

            //convert time to datetime
            if(/^ *[0-9]{2}\:[0-9]{2}\:[0-9]{2} *$/i.test(time_or_datetime_str))
            {
                //is time
                time_or_datetime_str = '2017-01-01 '+time_or_datetime_str;
            }

            //get the hour value
            hour_str = _filterDateTime(time_or_datetime_str, 'hour');

            //get the hour value
            hour_int = parseInt(hour_str);

            if(!_w.isNumber(hour_int))
            {
                return false;
            }

            //determine time period
            if(hour_int >= 6 && hour_int < 12)
            {
                time_period_str = 'morning';
            }
            else if (hour_int >= 12 && hour_int < 17)
            {
                time_period_str = 'afternoon';
            }
            else if (hour_int >= 17 && hour_int < 21)
            {
                time_period_str = 'evening';
            }
            else
            {
                time_period_str = 'night';
            }

            return time_period_str;
        }

        /**
         * Parses a date time value to component parts
         * For exampleParses the current date and time
         * See _filterDateTime
         * @returns {Object}
         */
        wizmo_obj.parseDateTime = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _parseDateTime(myArgs[0]);
        };

        /**
         * Filters a component of a date time value
         * For example, get the time value component of a datetime value
         * See _filterDateTime
         * @returns {*}
         */
        wizmo_obj.filterDateTime = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _filterDateTime(myArgs[0], myArgs[1]);
        };

        /**
         * Gets the current date and time
         * See _getDateTime
         * @returns {String}
         */
        wizmo_obj.getDateTime = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _getDateTime(myArgs[0], myArgs[1]);
        };

        /**
         * Gets the UNIX timestamp of a given datetime value
         * If datetime value is not provided, current datetime is provided
         * @param {String} datetime_str an optional datetime string
         * @returns {*}
         */
        wizmo_obj.getTimestamp = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _dateTimeToTimestamp(myArgs[0]);
        };

        /**
         * Gets the current date and time
         * For example, 'morning'
         * @returns {String}
         */
        wizmo_obj.getTimePeriod = function()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _getTimePeriod(myArgs[0]);
        };

        /**
         * Populates the wizmo options with empty functions for undefined callbacks
         * @param options {Object} wizmo options
         * @returns {*}
         * @private
         */
        function _setDefaultOptionCallback(options)
        {
            var default_arr = [
                    'onReady', 'onResize', 'onResizeIn', 'onResizeOut', 'onResizeUp', 'onResizeDown',
                    'onScroll', 'onScrollLeft', 'onScrollRight', 'onScrollUp', 'onScrollDown',
                    'onRotate', 'onRotateToP', 'onRotateToL', 'onPortrait', 'onLandscape',
                    'onRetina', 'onPhone', 'onTablet', 'onDesktop', 'onTV',
                    'onIOS', 'onAndroid', 'onSymbian', 'onBlackberry', 'onWindowsPhone',
                    'onWindows', 'onMobile', 'onNonMobile',
                    'onAddClass', 'onRemoveClass', 'onAddAttr', 'onRemoveAttr'
                ],
                default_item_str;

            for (var i = 0; i < default_arr.length; i++)
            {
                default_item_str = default_arr[i];
                if(!options[default_item_str])
                {
                    options[default_item_str] = function(){};
                }
            }

            return options;
        }

        /**
         * Initializes automated awesomeness
         * @param ctx {Object} the context
         * @param options {Object} a JSON object
         * @private
         */
        function _run(ctx, options)
        {
            var ctx_body_or_html,
                options_init = extend(options, null),   //create copy of options
                opt_breakpoints_obj = options.breakpoints,
                opt_breakpoints_isset_bool = ((options.breakpoints)),
                breakpoint_obj,
                opt_classes_obj = options.classes,
                opt_attributes_obj = options.attributes,
                opt_breakpoints_scroll_obj = options.breakpointsScroll || options.breakpointScroll || options.scrollBreakpoints,
                opt_classes_scroll_obj = options.classesScroll || options.scrollClasses,
                opt_breakpoints_scroll_isset_bool = ((opt_breakpoints_scroll_obj)),
                opt_event_trigger_mode_str = (_w.isString(options.event_trigger_mode)) ? options.event_trigger_mode : 'throttle' ,
                opt_event_trigger_timer_int = (_w.isNumber(options.event_trigger_timer)) ? options.event_trigger_timer : 100,
                opt_disable_turbo_resize_bool = !!((options.disableTurboResize)),
                opt_disable_turbo_scroll_bool = !!((options.disableTurboScroll)),
                opt_disable_turbo_network_bool = !!((options.disableTurboNetwork)),
                opt_debug_bool = ((options.debug)),
                settings_obj = {},
                settings_beh_obj = function(){
                    this.responsive_basis = 'v';
                    this.breakpoints_array = {};
                },
                settings_beh_rc_obj = new settings_beh_obj(),
                settings_beh_rv_obj = new settings_beh_obj(),
                settings_beh_co_obj = new settings_beh_obj(),
                settings_beh_sc_obj = new settings_beh_obj()
                ;

            //define html or body
            ctx_body_or_html = (ctx.selector && _w.in_array(ctx.selector, ['body', 'html'])) ? ctx : $('body');

            //set turbo_refresh to true by default
            options.turbo_refresh = (_w.isBool(options.turbo_refresh)) ? options.turbo_refresh : true;

            //if debug option is set, reset device vars
            if(opt_debug_bool)
            {
                _initDeviceVars(true);
            }

            //get responsive basis
            settings_obj.responsive_basis = _getResponsiveBasis(ctx);

            //track viewport and scroll if not tracking
            if(!wizmo.domStore('var_event_listener_prime_resize'))
            {
                _onResize('prime', opt_event_trigger_mode_str, opt_event_trigger_timer_int);
            }
            if(!wizmo.domStore('var_event_listener_prime_scroll'))
            {
                _onScroll('prime', opt_event_trigger_mode_str, opt_event_trigger_timer_int);
            }

            if(settings_obj.responsive_basis === 'c')
            {
                /**
                 * Track Container
                 */
                breakpoint_obj = _getBreakpoints(opt_breakpoints_obj, opt_classes_obj, opt_attributes_obj);

                if(!wizmo.domStore('var_event_listener_prime_resize_container'))
                {
                    _onResizeContainer(ctx, 'prime', opt_event_trigger_mode_str, opt_event_trigger_timer_int);
                }

                settings_beh_rc_obj.responsive_basis = settings_obj.responsive_basis;
                settings_beh_rc_obj.breakpoints_array = breakpoint_obj;
                settings_beh_rc_obj.event_status = 'rc';

                _resizeContainerEventManager(ctx, options, 'resize_container', settings_beh_rc_obj);

                //mark that the _setBreakpoints operation is initial i.e. onLoad
                options_init.init = true;

                //set breakpoints
                _setBreakpoints(ctx, breakpoint_obj, options_init, settings_obj);
            }
            else
            {
                /**
                 * Track viewport + scroll
                 * 1: If viewport breakpoints are set
                 * 2: If scroll breakpoints are set
                 */

                //Set initial callbacks
                _callbackTrigger(options, ['ready', 'init']);

                breakpoint_obj = null;
                if(opt_breakpoints_isset_bool) {
                    breakpoint_obj = _getBreakpoints(opt_breakpoints_obj, opt_classes_obj, opt_attributes_obj);
                }

                settings_beh_rv_obj.responsive_basis = settings_beh_co_obj.responsive_basis = settings_obj.responsive_basis;
                settings_beh_rv_obj.breakpoints_array = settings_beh_co_obj.breakpoints_array = breakpoint_obj;

                //enable event manager for resize events
                settings_beh_rv_obj.event_status = 'rv';
                settings_beh_rv_obj.callback_id_array = ['resize'];
                _resizeEventManager(ctx, options, 'resize_viewport', settings_beh_rv_obj);

                //enable event manager for orientation events
                settings_beh_co_obj.event_status = 'co';
                settings_beh_co_obj.callback_id_array = ['rotate'];
                _resizeEventManager(ctx, options, 'change_orientation', settings_beh_co_obj);

                /**
                 * Enable event manager for scroll events if scroll breakpoints are not set. This prevents them from being called twice when breakpoints are indeed set. Calling the scroll event manager twice will fire the callback manager twice, which will fire onScroll_ events twice instead of once
                 */
                if(!opt_breakpoints_scroll_isset_bool)
                {
                    //enable event manager for scroll events
                    settings_beh_sc_obj.event_status = 'sc';
                    settings_beh_sc_obj.callback_id_array = ['scroll'];
                    _scrollEventManager(ctx, options, 'scroll_viewport', settings_beh_sc_obj);
                }

                if(opt_breakpoints_isset_bool)
                {
                    //mark that the _setBreakpoints operation is initial i.e. should run onLoad
                    options_init.init = true;

                    //set breakpoints for viewport [initialize]
                    _setBreakpoints(ctx, breakpoint_obj, options_init, settings_obj);
                }


                if(opt_breakpoints_scroll_isset_bool)
                {
                    //2:

                    //set scroll breakpoints
                    settings_beh_sc_obj.breakpoints_array = _getBreakpoints(opt_breakpoints_scroll_obj, opt_classes_scroll_obj, null, true);

                    /**
                     * Enable event manager for scroll events
                     * This should only be called once
                     */
                    settings_beh_sc_obj.event_status = 'sc';
                    settings_beh_sc_obj.callback_id_array = ['scroll'];
                    _scrollEventManager(ctx, options, 'scroll_viewport', settings_beh_sc_obj);

                    //mark that the _setBreakpointsScroll operation is initial i.e. should run onLoad
                    options_init.init = true;

                    //set breakpoints for scroll [initialize]
                    _setBreakpointsScroll(ctx, settings_beh_sc_obj.breakpoints_array, options_init, {}, settings_beh_sc_obj.event_status);
                }
            }

            //set up turbo classes and attributes for resize and scroll states
            //run only if not specifically disabled
            if(!opt_disable_turbo_resize_bool)
            {
                _turboClassesAndAttributesResize(ctx_body_or_html);
            }
            if(!opt_disable_turbo_scroll_bool)
            {
                _turboClassesAndAttributesScroll(ctx_body_or_html);
            }
            if(!opt_disable_turbo_network_bool)
            {
                _turboClassesAndAttributesNetwork(ctx_body_or_html);
            }

            //increment run counter
            wizmo.storeIncrement('var_run_counter');
        }

        /**
         * Initialize wizmo magic
         * @param ctx {Object} the context
         * @param options {Object} the options
         */
        wizmo_obj.run = function(ctx, options){

            options = (options) ? options : {};
            var options_default_callback = _setDefaultOptionCallback(options);
            _run(ctx, options_default_callback);
        };

        /**
         * Initialize wizmo awesomeness
         * Alternate method of run()
         * @param {Object} options the options
         * @param {Object} ctx the context object
         * @returns {wizmo}
         */
        wizmo_obj.awesomize = function(options){

            if(_w.config.awesomize)
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    options = (options) ? options : {},
                    ctx = (myArgs[1]) ? myArgs[1] : $('body'),
                    options_default_callback = _setDefaultOptionCallback(options);

                _run(ctx, options_default_callback);
            }

            return this;
        };

        /**
         * Runs $.async function queue
         * @private
         */
        function _runAsync()
        {
            //run all $.async functions
            wizmo.runFunction('a1ready', {queue: true, namespace: 'a1ready'});
        }

        /**
         * Creates a timer to wait for $.async function queue completion
         * @private
         */
        function _runAwaitTimer()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[0] && _w.isObject(myArgs[0])) ? myArgs[0]: {},
                throttle_interval_int,
                timeout_interval_int
            ;

            /**
             * open async function gate
             * When the async function gate is closed before the async queue
             * returns results, resolveAsync and rejectAsync methods will not
             * increment their result counters.
             * This is necessary to prevent $.async results from being counted more than necessary and instantly trigerring async completion on page refreshes
             */
            wizmo.store('var_async_fn_gate_open', true);

            //set defaults
            throttle_interval_int = (options_obj.throttle && _w.isNumber(options_obj.throttle) && options_obj.throttle > 0) ? options_obj.throttle : 100;
            timeout_interval_int = (options_obj.timeout && _w.isNumber(options_obj.timeout) && options_obj.timeout > 0) ? options_obj.timeout : 30000;

            //normalize timeout
            timeout_interval_int = timeout_interval_int/1000;

            var t = window.setInterval(function()
            {
                var async_fn_result_count_int = wizmo.store('var_async_fn_counter'),
                    async_fn_count_int = wizmo.countFunction('a1ready', {queue: true, namespace: 'a1ready'}),
                    async_all_done_bool = !!(_w.isNumber(async_fn_count_int) && _w.isNumber(async_fn_result_count_int) && (async_fn_count_int <= async_fn_result_count_int)),
                    timestamp_curr_flt = _w.microtime(true),
                    timestamp_init_flt = wizmo.store('var_timestamp_ready'),
                    timestamp_diff_flt = timestamp_curr_flt - timestamp_init_flt,
                    async_timer_limit_bool = ((timestamp_diff_flt > timeout_interval_int))
                ;

                //clear interval when results are returned or time limit reached
                if(async_all_done_bool || async_timer_limit_bool)
                {
                    clearInterval(t);

                    if(async_timer_limit_bool)
                    {
                        _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: The async operation was terminated because it took more time than the specified limit ['+timeout_interval_int+' seconds] to finish.', true);
                    }

                    //run $.await function
                    wizmo.runFunction('a2ready', {queue: true, namespace: 'a2ready', flush: true});
                    //flush $.async queue
                    wizmo.flushFunction({queue: true, namespace: 'a1ready'});

                    //reset async function counter
                    wizmo.store('var_async_fn_counter', 0);

                    //close the async function gate
                    wizmo.store('var_async_fn_gate_open', false);
                }

            }, throttle_interval_int);
        }

        /**
         * Runs $.await functions
         * @param {Object} options the await options
         * throttle: this is the time interval [in milliseconds] between calls of the built-in await callback function. Default is 100 milliseconds
         * timeout: this is the total wait time [in milliseconds] that $.await will wait before. Default is 30000 milliseconds
         * Note: You can define these options using
         * _w.config.await = {throttle: 50, timeout: 5000}
         * Make sure you call this inside a $.first function block
         */
        wizmo_obj.runAwait = function(){
            var myArgs = Array.prototype.slice.call(arguments),
                options = myArgs[0];
            _runAwaitTimer(options);
            _runAsync();
        };

        /**
         * Adds a function to be called when the $.await handler is fired
         * @param {Function} callback_fn the callback function to run
         * @param {Array|Object} args_arr the arguments that will be passed to the callback when it is called
         * @private
         */
        function _onAwait(callback_fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                args_arr_or_obj = (myArgs[1]) ? myArgs[1] : [],
                await_handler_fn
                ;

            await_handler_fn = function(args_1)
            {
                //trigger callback
                callback_fn(args_1);
            };

            //add to $.await queue
            wizmo.addFunction('a2ready', await_handler_fn, {queue: true, namespace: 'a2ready', args: args_arr_or_obj});
        }

        /**
         * Adds a function to be called when $.await is executed
         * Wrapper function of _onAwait
         */
        wizmo_obj.onAwait = function(callback_fn)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            _onAwait(callback_fn, myArgs[1]);
            return this;
        };

        /**
         * Enables turbo classes and attributes for resize events
         * @returns {wizmo}
         */
        wizmo_obj.runTurboResize = function(){
            var myArgs = Array.prototype.slice.call(arguments);
            _turboClassesAndAttributesResize(myArgs[0], myArgs[1], myArgs[2]);
            return this;
        };

        /**
         * Enables turbo classes and attributes for scroll events
         * @returns {wizmo}
         */
        wizmo_obj.runTurboScroll = function(){
            var myArgs = Array.prototype.slice.call(arguments);
            _turboClassesAndAttributesScroll(myArgs[0], myArgs[1], myArgs[2]);
            return this;
        };

        /**
         * Defines an initialization script to run before the document is ready
         */
        wizmo_obj.preInit = function(){

            //set storage variables
            wizmo.store("var_run_counter", 0);

            //primes resize and scroll event handling
            __resize();
            __scroll();

            /**
             * Run wizmo $.first functions
             * Note: use flush option to prevent multiple executions
             */
            wizmo.runFunction('fready', {queue: true, namespace: 'fready', flush: true});
        };

        /**
         * Defines an initialization script to run when the document is ready
         */
        wizmo_obj.postInit = function(){

            //define ready timestamp
            wizmo.store("var_timestamp_ready", _w.microtime(true));

            //define base url
            wizmo.store('var_url', wizmo.url.get());
            wizmo.store('var_url_base', wizmo.url.get('basepath'));

            //initialize device variables
            if(_w.config.debug)
            {
                _initDeviceVars(true);
            }
            else
            {
                _initDeviceVars();
            }

            //set scroll variables
            _initScrollVars();

            //run turbo classes and attributes methods
            //enable initialization flag using first argument
            _turboClasses(true);
            _turboAttributes(true);

            //queue utility ready function
            if(wizmo.domStore('var_flag_defer_js_ref_file_exists'))
            {
                //deferred scripts detection
                wizmo.queuePostDefer(function(){
                    //run bind ops
                    if(!wizmo.domStore('var_bind_run_op_flag'))
                    {
                        _bindRun();
                    }
                });
            }
            else
            {
                //no deferred scripts
                wizmo.queuePost(function(){
                    //run bind ops
                    if(!wizmo.domStore('var_bind_run_op_flag'))
                    {
                        _bindRun();
                    }
                });
            }

            //run wizmoReady + wizmoPostReady functions
            wizmo.runFunction('ready', {queue: true, namespace: 'ready', flush: true}).runFunction('zready', {queue: true, namespace: 'zready', flush: true});

            //run wizmoAwait functions
            if(wizmo.domStore('var_await_init'))
            {
                wizmo.runAwait(_w.config.await);
            }
        };

        /**
         * List all wizmo methods
         * @param {Boolean} exclude_util_methods_bool exclude utility methods from list. Default is true
         * @return {Array}
         * @private
         */
        function _listWizmoMethods()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                exclude_util_methods_bool = (_w.isBool(myArgs[0])) ? myArgs[0] : true,
                ctx = myArgs[1],
                methods_arr = [],
                methods_excl_arr = ['domStoreData', 'init', 'initDimVars', 'updateDimStore', 'updateOrtStore', 'mobileDetect', 'getResolutionDimensionList', 'queueFirst', 'queueReady', 'queuePost', 'queueAsync', 'queueAwait'],
                methods_object_arr = ['network', 'bind', 'route', 'cache', 'sworker', 'detect', 'url', 'form', 'firebase', 'data'];

            //remove methods for exclusion if so specified
            methods_excl_arr = (exclude_util_methods_bool) ? methods_excl_arr : [];

            for (var key in ctx)
            {
                if (ctx.hasOwnProperty(key))
                {
                    if(!_w.in_array(key, methods_excl_arr))
                    {
                        if(_w.in_array(key, methods_object_arr))
                        {
                            var method_sub_key_str,
                                method_sub_obj = ctx[key];
                            for (var key2 in method_sub_obj) {
                                if (method_sub_obj.hasOwnProperty(key2)) {
                                    method_sub_key_str = key+'.'+key2;
                                    methods_arr.push(method_sub_key_str);
                                }
                            }
                        }
                        else
                        {
                            methods_arr.push(key);
                        }
                    }
                }
            }

            return methods_arr;
        }

        /**
         * List all wizmo methods
         * Wrapper class for _listWizmoMethods
         * @returns {Array}
         */
        wizmo_obj.listMethods = function(){
            var myArgs = Array.prototype.slice.call(arguments);
            return _listWizmoMethods(myArgs[0], this);
        };

    })(wizmo);

    //fire before DOM
    wizmo.preInit();

    //fire when DOM is ready
    $.domReady(function(){

        //execute post initialization
        wizmo.postInit();

    });

    /**
     * 1. Extend $ for JQuery, Zepto, or WQuery [Add wizmo method]
     * 2. Extend wQuery [Add scroll methods]
     */

    (function($_obj){

        /**
         * Fades in an element
         * @param {Object} ctx the element to fade
         * @param {Number} duration_int the duration of the animation [in seconds]
         * @param {Function} callback_fn a callback to execute on fade in
         * @private
         */
        function _fadeIn(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                duration_int = (_w.isNumber(myArgs[1])) ? myArgs[1] : 1,
                callback_fn = myArgs[2],
                st_factor_int = (1000/60)*duration_int,
                raf_factor_int = (window.requestAnimationFrame) ? (1 / duration_int) : 1,
                opacity_int = (ctx.style.opacity && ctx.style.opacity > 0.05) ? ctx.style.opacity : 0.05,
                fade_hash_code_str,
                flag_fadeout_store_prefix_str = 'flag_wquery_fadeout_cancel_',
                flag_fadein_store_prefix_str = 'flag_wquery_fadein_cancel_'
                ;

            //cast to float if string
            opacity_int = (_w.isNumberString(opacity_int)) ? parseFloat(opacity_int) : opacity_int ;

            //flag to stop active fadeOut
            fade_hash_code_str = ''+_w.hashCode('wquery_fade_'+ctx.id);
            wizmo.pageStore(flag_fadeout_store_prefix_str+fade_hash_code_str, true);

            //set initial opacity
            ctx.style.opacity = opacity_int;
            ctx.style.filter = 'alpha(opacity=' + opacity_int * 100 + ")";

            //show element if hidden/not visible
            if(ctx.style.display === 'none')
            {
                ctx.style.display = '';
            }
            if(ctx.style.visibility === 'hidden')
            {
                ctx.style.visibility = '';
            }

            function __fadeIn()
            {
                opacity_int += opacity_int * 0.05 * raf_factor_int;
                ctx.style.opacity = opacity_int;
                ctx.style.filter = 'alpha(opacity=' + opacity_int * 100 + ")";
                if (opacity_int >= 1)
                {
                    ctx.style.opacity = 1;
                    if(callback_fn)
                    {
                        callback_fn(ctx);
                    }

                    //reset fadeout op flag
                    wizmo.pageStore(flag_fadeout_store_prefix_str+fade_hash_code_str, false);
                    return true;
                }

                if(wizmo.pageStore(flag_fadein_store_prefix_str+fade_hash_code_str))
                {
                    wizmo.pageStore(flag_fadein_store_prefix_str+fade_hash_code_str, false);
                    return true;
                }

                if(window.requestAnimationFrame)
                {
                    window.requestAnimationFrame(__fadeIn);
                }
                else
                {
                    setTimeout(__fadeIn, st_factor_int);
                }
            }
            __fadeIn();
        }

        /**
         * Fades out an element
         * @param {Object} ctx the element to fade
         * @param {Number} duration_int the duration of the animation [in seconds]
         * @param {Function} callback_fn a callback to execute on fade out
         * @private
         */
        function _fadeOut(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                duration_int = (_w.isNumber(myArgs[1])) ? myArgs[1] : 1,
                callback_fn = myArgs[2],
                st_factor_int = (1000/60)*duration_int,
                raf_factor_int = (window.requestAnimationFrame) ? (1 / duration_int) : 1,
                opacity_int = (ctx.style.opacity) ? ctx.style.opacity : 1,
                fade_hash_code_str,
                flag_fadeout_store_prefix_str = 'flag_wquery_fadeout_cancel_',
                flag_fadein_store_prefix_str = 'flag_wquery_fadein_cancel_'
                ;

            //cast to float if string
            opacity_int = (_w.isNumberString(opacity_int)) ? parseFloat(opacity_int) : opacity_int ;

            //flag to stop active fadeOut
            fade_hash_code_str = ''+_w.hashCode('wquery_fade_'+ctx.id);
            wizmo.pageStore(flag_fadein_store_prefix_str+fade_hash_code_str, true);

            function __fadeOut()
            {
                opacity_int -= opacity_int * 0.05 * raf_factor_int;
                ctx.style.opacity = opacity_int;
                ctx.style.filter = 'alpha(opacity=' + opacity_int * 100 + ")";
                if (opacity_int <= 0.05)
                {
                    ctx.style.opacity = 0;
                    if(callback_fn)
                    {
                        callback_fn(ctx);
                    }

                    //reset fadein op flag
                    wizmo.pageStore(flag_fadein_store_prefix_str+fade_hash_code_str, false);
                    return true;
                }

                if(wizmo.pageStore(flag_fadeout_store_prefix_str+fade_hash_code_str))
                {
                    wizmo.pageStore(flag_fadeout_store_prefix_str+fade_hash_code_str, false);
                    return true;
                }

                if(window.requestAnimationFrame)
                {
                    window.requestAnimationFrame(__fadeOut);
                }
                else
                {
                    setTimeout(__fadeOut, st_factor_int);
                }
            }
            __fadeOut();
        }

        /**
         * Get or set the current vertical position of the scroll bar
         * @param value {Number} an integer indicating the new position to set the scroll bar to [optional]
         * @returns {Number}
         * @private
         */
        function _scrollTop()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                value = (_w.isNumber(myArgs[0])) ? myArgs[0] : false,
                ctx = (myArgs[1]) ? myArgs[1] : $('body'),
                _ctx = (ctx.length && ctx.length > 0) ? ctx[0] : ctx,
                scroll_top_int,
                scroll_top_elem_int,
                doc_scroll_obj,
                ctx_is_body_or_html_bool = false,
                _ctx_rect_obj
                ;

            //get the scroll object
            doc_scroll_obj = (document.documentElement && _w.isNumber(document.documentElement.scrollTop)) ? document.documentElement : document.body;

            /*jshint -W116 */
            if(typeof window.pageYOffset != 'undefined')
            {
                scroll_top_int = window.pageYOffset;
            }
            else if(document.documentElement && _w.isNumber(document.documentElement.scrollTop))
            {
                scroll_top_int = document.documentElement.scrollTop;
            }
            else
            {
                scroll_top_int = document.body.scrollTop;
            }
            /*jshint +W116 */

            if(ctx.selector === 'body' || ctx.selector === 'html')
            {
                ctx_is_body_or_html_bool = true;
            }
            else
            {
                _ctx_rect_obj = _ctx.getBoundingClientRect();
                scroll_top_elem_int = _ctx_rect_obj.top;

                doc_scroll_obj = _ctx;
            }

            if(_w.isNumber(value))
            {
                doc_scroll_obj.scrollTop = value;
                return value;
            }

            return (ctx_is_body_or_html_bool) ? parseInt(scroll_top_int): parseInt(scroll_top_elem_int);
        }

        /**
         * Get or set the current horizontal position of the scroll bar
         * @param value {Number} an integer indicating the new position to set the scroll bar to [optional]
         * @returns {Number}
         * @private
         */
        function _scrollLeft()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                value = (_w.isNumber(myArgs[0])) ? myArgs[0] : false,
                ctx = (myArgs[1]) ? myArgs[1] : $('body'),
                _ctx = (ctx.length && ctx.length > 0) ? ctx[0] : ctx,
                scroll_left_int,
                scroll_left_elem_int,
                doc_scroll_obj,
                ctx_is_body_or_html_bool = false,
                _ctx_rect_obj
                ;

            //get the scroll object
            doc_scroll_obj = (document.documentElement && _w.isNumber(document.documentElement.scrollLeft)) ? document.documentElement : document.body;

            /*jshint -W116 */
            if(typeof window.pageXOffset != 'undefined')
            {
                scroll_left_int = window.pageXOffset;
            }
            else if(document.documentElement && _w.isNumber(document.documentElement.scrollLeft))
            {
                scroll_left_int = document.documentElement.scrollLeft;
            }
            else
            {
                scroll_left_int = document.body.scrollLeft;
            }
            /*jshint +W116 */

            if(ctx.selector === 'body' || ctx.selector === 'html')
            {
                ctx_is_body_or_html_bool = true;
            }
            else
            {
                _ctx_rect_obj = _ctx.getBoundingClientRect();
                scroll_left_elem_int = _ctx_rect_obj.left;

                doc_scroll_obj = _ctx;
            }

            if(_w.isNumber(value))
            {
                doc_scroll_obj.scrollLeft = value;
                return value;
            }

            return (ctx_is_body_or_html_bool) ? parseInt(scroll_left_int): parseInt(scroll_left_elem_int);
        }

        /**
         * Get the current coordinates of the first element in the set of matched elements, relative to the document
         * @param ctx {*} the context [must be DOM element within <body>]
         * @returns {*}
         * @private
         */
        function _offset(ctx)
        {
            var _ctx = (ctx.selector) ? ctx[0] : ctx,
                _rect_obj = _ctx.getBoundingClientRect(),
                _scroll_left_int = _scrollLeft(),
                _scroll_top_int = _scrollTop()
                ;

            return {left: _rect_obj.left+_scroll_left_int, top: _rect_obj.top+_scroll_top_int};
        }

        /**
         * Scroll via animation
         * Script inspiration: https://gist.github.com/andjosh/6764939 and https://gist.github.com/james2doyle/5694700
         * @param {Object} ctx_obj the context [document.body]
         * @param {Number|String|Object} target_pos_or_name_or_obj the position, object id/name, or object to scroll to
         * @param {Object} options_obj the options that define the scroll action
         *
         * speed: the scroll speed in pixels per second. You can override speed and use duration instead by prepending 'd' to the value. For example, 'd1000' will force scroll duration of 1000 milliseconds
         *
         * offset: the offset value. This will create an offset on the target scroll position. For example, an offset of 100 will stop scroll 100 pixels before target position. This will be vice versa when offset is, say, -100
         * You can also use percentages e.g. '15%'. When you do this, the offset value will be calculated relative to the viewport height. So, if the viewport height is 640 pixels, and you define an offset of '10%', the actual offset value will be
         *
         * callback: the callback function to be executed after scroll
         *
         * easing: the name of the easing for
         * the available options are:
         * - mathEaseInOutQuad [Default]
         * - mathEaseInCubic
         * - mathInOutQuintic
         *
         * easing_fn: a custom easing function
         * this function will be passed the following arguments:
         * - t [incrementing time value in milliseconds]
         * - b [the start position]
         * - c [the end position]
         * - d [the duration of scroll]
         * see _scrollTo code for more detail
         *
         * @private
         */
        function _scrollTo(ctx_obj, target_pos_or_obj)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = myArgs[2],
                speed_int = 1000,
                offset_str_or_int = 0,
                callback_fn,
                easing_str = 'mathEaseInOutQuad',
                easing_fn,
                offset_perc_regex_arr,
                offset_perc_value_str,
                offset_perc_unit_str,
                duration_int,
                start_int = _scrollTop(ctx_obj),
                target_obj = (target_pos_or_obj.selector) ? target_pos_or_obj[0] : target_pos_or_obj,
                target_obj_offset_obj,
                target_obj_pos_top_int,
                target_obj_pos_top_final_int,
                diff_int,
                diff_abs_int,
                currentTime = 0,
                increment = 20,
                _val;

            //define options
            if(_w.isObject(options_obj))
            {
                speed_int = (options_obj.speed && (_w.isNumber(options_obj.speed) || _w.isNumberString(options_obj))) ? parseInt(options_obj.speed) : options_obj.speed;
                offset_str_or_int = (options_obj.offset && (_w.isNumber(options_obj.offset) || _w.isString(options_obj.offset))) ? options_obj.offset : 0;
                callback_fn = (options_obj.callback) ? options_obj.callback : undefined;
                easing_str = (options_obj.easing && _w.isString(options_obj.easing) && _w.in_array(options_obj.easing, ['mathEaseInOutQuad', 'mathEaseInCubic', 'mathInOutQuintic'])) ? options_obj.easing : 'mathEaseInOutQuad';
                easing_fn = (options_obj.easing_fn) ? options_obj.easing_fn : undefined;
            }

            //calculate the change in distance
            if(_w.isNumber(target_pos_or_obj) || _w.isNumberString(target_pos_or_obj))
            {
                //subtract

                target_obj_pos_top_int = parseFloat(target_pos_or_obj);
                diff_int = target_obj_pos_top_int - start_int;
            }
            else if(_w.isObject(target_obj) || _w.isString(target_obj))
            {
                //get position of target object before subtract

                if(_w.isString(target_obj))
                {
                    target_pos_or_obj = $('#'+target_obj);
                }

                target_obj_offset_obj = _offset(target_pos_or_obj);
                target_obj_pos_top_int = target_obj_offset_obj.top;
                diff_int = target_obj_pos_top_int - start_int;
            }
            else
            {
                return false;
            }
            diff_int = parseFloat(diff_int);

            //manage percentage offset
            if(_w.isString(offset_str_or_int))
            {
                if(/^ *\-?[0-9]+(?:\.[0-9]+|)\%? *$/i.test(offset_str_or_int))
                {
                    //percentage - use viewport
                    offset_perc_regex_arr = _w.regexMatchAll(/^ *(\-?[0-9]+(?:\.[0-9]+|))(\%?) *$/i, offset_str_or_int);

                    offset_perc_value_str = offset_perc_regex_arr[0][1];
                    offset_perc_unit_str = offset_perc_regex_arr[0][2];

                    if(offset_perc_unit_str && !_w.isEmptyString(offset_perc_unit_str))
                    {
                        var viewport_height_int = parseFloat(wizmo.viewportH());
                        var offset_perc_value_int = parseFloat(offset_perc_value_str);

                        offset_str_or_int = viewport_height_int * (offset_perc_value_int / 100);
                    }
                }
            }
            offset_str_or_int = offset_str_or_int/-1;

            //get the difference between start and end points considering offset
            diff_int += offset_str_or_int;

            //get the absolute value
            diff_abs_int = Math.abs(diff_int);

            //get the position of target object considering offset
            target_obj_pos_top_final_int = target_obj_pos_top_int+offset_str_or_int;

            //manage speed
            if(_w.isNumber(speed_int) && speed_int > 0)
            {
                duration_int = (diff_int / speed_int) * 1000;
            }
            else if (_w.isString(speed_int) && /^ *d[0-9]+ */i.test(speed_int))
            {
                duration_int = speed_int.slice(1);
            }
            else
            {
                duration_int = 1000;
            }
            duration_int = parseInt(duration_int);
            duration_int = Math.abs(duration_int);

            //define motion functions
            var easing_obj = {
                mathEaseInOutQuad: function (t, b, c, d) {
                    t /= d/2;
                    if (t < 1) {
                        return c/2*t*t + b;
                    }
                    t--;
                    return -c/2 * (t*(t-2) - 1) + b;
                },
                mathEaseInCubic: function(t, b, c, d) {
                    var tc = (t/=d)*t*t;
                    return b+c*(tc);
                },
                mathInOutQuintic: function(t, b, c, d) {
                    var ts = (t/=d)*t,
                        tc = ts*t;
                    return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
                }
            };

            //add custom easing function
            if(easing_fn)
            {
                easing_obj['mathEaseCustom'] = easing_fn;
                easing_str = 'mathEaseCustom';
            }

            var move = function(amount) {
                document.documentElement.scrollTop = amount;
                document.body.parentNode.scrollTop = amount;
                document.body.scrollTop = amount;
            };

            // requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
            var requestAnimFrame = (function(){
                return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
            })();

            //animate
            var animateScroll = function() {

                // increment the time
                currentTime += increment;

                // find the value with the quadratic in-out easing function
                _val = easing_obj[easing_str](currentTime, start_int, diff_int, duration_int);

                /**
                 * There is an issue when using this method more than once to scroll to the same location.
                 * For example, if you:
                 * 1. Attach this method to a click handler [or link]
                 * 2. Setup a link at both the start position and end position
                 * 3. Click on the link at the start position to go to the end position
                 * 4. Click on the link at the end position
                 *
                 * Instead of the document to remain in the same position on the second click, it scrolls to another position. This happens because of the easing function, which generates the position values used by the animated scroll
                 * To fix this, the animated scroll feature using the easing functions are only used when the absolute scroll distance is of a sufficient size [in this case 60 pixels]
                 */
                if(diff_abs_int <= 60)
                {
                    //jump straight to position i.e. no animation
                    move(target_obj_pos_top_final_int);

                    if (callback_fn) {
                        //animation complete. run callback
                        callback_fn();
                    }
                }
                else
                {
                    //animate scroll
                    if(_w.isNumber(_val))
                    {
                        // move the document.body
                        move(_val);

                        //run animation
                        if (currentTime < duration_int)
                        {
                            requestAnimFrame(animateScroll);
                        }
                        else
                        {
                            if (callback_fn) {
                                //animation complete. run callback
                                callback_fn();
                            }
                        }
                    }
                }

            };
            animateScroll();
        }

        /**
         * Gets the scroll area offset of the element
         * The scroll area offset provides the vertical and horizontal positions of all four vertices of a block-level element
         * The element's vertices are each assigned an alphabet key
         * a = top left, b = top right, c = bottom right, d = bottom left
         * Returns an JSON object
         * a_top
         * @param ctx {Object} the context
         * @return {*}
         * @private
         */
        function _scrollAreaOffset(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                dim_format_key_str = myArgs[1],
                dim_format_w_str = (dim_format_key_str === 'o') ? 'outerWidth' : (dim_format_key_str === 'i') ? 'innerWidth' : 'width',
                dim_format_h_str = (dim_format_key_str === 'o') ? 'outerHeight' : (dim_format_key_str === 'i') ? 'innerHeight' : 'height',
                _ctx_elem = ctx[0],
                _offset_obj = _offset(_ctx_elem),
                _scrolltop_int = _scrollTop(),
                _scrollleft_int = _scrollLeft(),
                _scroll_vertex_a_top_int = _offset_obj.top - _scrolltop_int,
                _scroll_vertex_a_left_int = _offset_obj.left - _scrollleft_int,
                _scroll_vertex_b_top_int,
                _scroll_vertex_b_left_int,
                _scroll_vertex_c_top_int,
                _scroll_vertex_c_left_int,
                _scroll_vertex_d_top_int,
                _scroll_vertex_d_left_int,
                _elem_width_int = ctx[dim_format_w_str](),
                _elem_height_int = ctx[dim_format_h_str]()
                ;

            //Get scroll offsets for 3 other b, c, d
            _scroll_vertex_b_top_int = _scroll_vertex_a_top_int;
            _scroll_vertex_b_left_int = _scroll_vertex_a_left_int + _elem_width_int;
            _scroll_vertex_c_top_int = _scroll_vertex_a_top_int + _elem_height_int;
            _scroll_vertex_c_left_int = _scroll_vertex_b_left_int;
            _scroll_vertex_d_top_int = _scroll_vertex_c_top_int;
            _scroll_vertex_d_left_int =  _scroll_vertex_a_left_int;


            return {a_left: _scroll_vertex_a_left_int, a_top: _scroll_vertex_a_top_int , b_left: _scroll_vertex_b_left_int, b_top: _scroll_vertex_b_top_int, c_left: _scroll_vertex_c_left_int , c_top: _scroll_vertex_c_top_int , d_left: _scroll_vertex_d_left_int , d_top: _scroll_vertex_d_top_int};
        }

        /**
         * Determines if an element is within the viewport, or is within a specific viewzone inside the viewport
         * @param ctx {Object} the element context
         * @param viewzone_obj {Object} the vertices of the viewzone as a JSON object
         * A viewzone object identifies a specific zone within a viewport
         * It has the following structure
         * {a_left: 100, a_top: 400, b_left: 400, b_top: 400, c_left: 400, c_top: 600, d_left: 100, d_top: 600;}
         * The above represents a [viewzone] rectangle 300 pixels wide by 200 pixels high
         * sitting 400 pixels below the top of the viewport and 100 pixels left-padding
         * a, b, c, and d represent the top-left, top-right, bottom-right, and bottom-left
         * vertex positions [respectively] of the viewzone relative to the viewport
         * For brevity, you only need to provide a_left, a_top, b_left, c_top values; the rest
         * will be calculated automatically
         * Note: The viewzone must represent a rectangle
         * @param contain_bool {Boolean} this determines whether the viewport/viewzone must
         * contain the given element context completely or not. If set to true, this method
         * will return true only if all of the element is within the viewport/viewzone
         * @param debug_bool {Boolean} if true, will display the viewzone in the viewport
         * as a visual aid
         * @return {Boolean}
         */
        function _inView(ctx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                viewzone_obj = (myArgs[1]) ? myArgs[1] : null,
                contain_bool = (_w.isBool(myArgs[2])) ? myArgs[2] : false,
                debug_bool = (_w.isBool(myArgs[3])) ? myArgs[3] : false,
                viewzone_basis_bool = ((viewzone_obj)),
                viewport_w_int = wizmo.viewportW(),
                viewport_h_int = wizmo.viewportH(),
                scroll_area_offset_obj = _scrollAreaOffset(ctx),
                area_a_left_int = scroll_area_offset_obj.a_left,
                area_a_top_int = scroll_area_offset_obj.a_top,
                area_b_left_int = scroll_area_offset_obj.b_left,
                area_b_top_int = scroll_area_offset_obj.b_top,
                area_c_left_int = scroll_area_offset_obj.c_left,
                area_c_top_int = scroll_area_offset_obj.c_top,
                area_d_left_int = scroll_area_offset_obj.d_left,
                area_d_top_int = scroll_area_offset_obj.d_top,
                viewzone_a_left_int,
                viewzone_a_top_int,
                viewzone_b_left_int,
                viewzone_b_top_int,
                viewzone_c_left_int,
                viewzone_c_top_int,
                viewzone_d_left_int,
                viewzone_d_top_int,
                a_vertex_inviewzone_bool,
                b_vertex_inviewzone_bool,
                c_vertex_inviewzone_bool,
                d_vertex_inviewzone_bool
                ;

            if(viewzone_basis_bool)
            {
                //viewzone basis

                viewzone_a_left_int = viewzone_obj.a_left;
                viewzone_a_top_int = viewzone_obj.a_top;
                viewzone_b_left_int = viewzone_obj.b_left;
                viewzone_b_top_int = (viewzone_obj.b_top) ? viewzone_obj.b_top : viewzone_a_top_int;
                viewzone_c_left_int = (viewzone_obj.c_left) ? viewzone_obj.c_left : viewzone_b_left_int;
                viewzone_c_top_int = viewzone_obj.c_top;
                viewzone_d_left_int = (viewzone_obj.d_left) ? viewzone_obj.d_left : viewzone_a_left_int;
                viewzone_d_top_int = (viewzone_obj.d_top) ? viewzone_obj.d_top : viewzone_c_top_int;

                if(debug_bool)
                {
                    //show area
                    var elem_body_obj = $('body'),
                        elem_guide_width_int = viewzone_b_left_int - viewzone_a_left_int,
                        elem_guide_height_int = viewzone_d_top_int - viewzone_a_top_int,
                        elem_guide_id_str = generateRandomString('aaannnn'),
                        elem_guide_html_wrapper_attr_str = ' id="w_debug_viewzone_'+elem_guide_id_str+'" style="box-sizing: border-box; position: fixed; top: '+viewzone_a_top_int+'px; left: '+viewzone_a_left_int+'px; width: '+elem_guide_width_int+'px; height: '+elem_guide_height_int+'px;"',
                        elem_guide_html_inner_1_attr_str = ' style="position: absolute; top: 10px; right: 10px; z-index: 100001; color: #000; font-family: sans-serif; font-size: 14px; opacity: 0.7;"',
                        elem_guide_html_inner_2_attr_str = ' style="position: absolute; width: '+elem_guide_width_int+'px; height: '+elem_guide_height_int+'px; background-color: #FF0000; z-index: 100000; opacity: 0.25;"';
                    elem_body_obj.append('<div'+elem_guide_html_wrapper_attr_str+'><div'+elem_guide_html_inner_1_attr_str+'>viewzone:&nbsp;'+elem_guide_id_str+'</div><div'+elem_guide_html_inner_2_attr_str+'></div></div>');
                }
            }
            else
            {
                //viewport basis

                viewzone_a_left_int = 0;
                viewzone_a_top_int = 0;
                viewzone_b_left_int = viewport_w_int;
                viewzone_b_top_int = 0;
                viewzone_c_left_int = viewzone_b_left_int;
                viewzone_c_top_int = viewport_h_int;
                viewzone_d_left_int = viewzone_a_left_int;
                viewzone_d_top_int = viewzone_c_top_int;
            }

            a_vertex_inviewzone_bool = ((area_a_top_int >= viewzone_a_top_int) && (area_a_top_int <= viewzone_d_top_int) && (area_a_left_int >= viewzone_a_left_int) && (area_a_left_int <= viewzone_b_left_int));
            b_vertex_inviewzone_bool = ((area_b_top_int >= viewzone_b_top_int) && (area_b_top_int <= viewzone_c_top_int) && (area_b_left_int >= viewzone_a_left_int) && (area_b_left_int <= viewzone_b_left_int));
            c_vertex_inviewzone_bool = ((area_c_top_int >= viewzone_b_top_int) && (area_c_top_int <= viewzone_c_top_int) && (area_c_left_int >= viewzone_d_left_int) && (area_c_left_int <= viewzone_c_left_int));
            d_vertex_inviewzone_bool = ((area_d_top_int >= viewzone_a_top_int) && (area_d_top_int <= viewzone_d_top_int) && (area_d_left_int >= viewzone_d_left_int) && (area_d_left_int <= viewzone_c_left_int));


            if(contain_bool)
            {
                return (a_vertex_inviewzone_bool && b_vertex_inviewzone_bool && c_vertex_inviewzone_bool && d_vertex_inviewzone_bool);
            }
            else
            {
                return (a_vertex_inviewzone_bool || b_vertex_inviewzone_bool || c_vertex_inviewzone_bool || d_vertex_inviewzone_bool);
            }
        }

        /**
         * Executes a JSONP HTTP Request
         * @param url {String} the URL
         * @param callback {Function} the JSONP Callback function
         * @param cache_key_str {String} the cache key
         * @param cache_storage_str {String} the cache storage type
         * @param store_options_obj {Object} the cache storage options
         * @param cache_and_fetch_bool {Boolean} if true, will cache value regardless of existing status
         * @private
         */
        function _jsonp(url, callback)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                cache_key_str = (_w.isString(myArgs[2]) && myArgs[2] !== "") ? myArgs[2]: null,
                cache_storage_str = myArgs[3],
                store_options_obj = myArgs[4],
                cache_and_fetch_bool = myArgs[5],
                callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random()),
                el_body_obj = $('body'),
                el_body_core_obj = el_body_obj[0];

            return new Promise(function(resolve)
            {
                window[callbackName] = function(data)
                {
                    delete window[callbackName];
                    el_body_core_obj.removeChild(script);

                    if(cache_key_str && (!wizmo.store(cache_key_str, undefined, cache_storage_str) || cache_and_fetch_bool))
                    {
                        //cache
                        wizmo.store(cache_key_str, data, cache_storage_str, store_options_obj);
                    }
                    resolve(callback(data));
                };

                var script = document.createElement('script');
                script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
                el_body_core_obj.appendChild(script);
            });
        }


        /**
         * Reduces a set of matched elements given a filter key
         * @param {String} filter_expr the filter expression
         * @param {Object} context the DOM context object
         * @return {*}
         * @private
         */
        function _filter(filter_expr, context)
        {
            var context_item_test_value_str,
                context_item_test_temp_bool,
                context_item_test_bool,
                context_item_test_negate_bool,
                filter_option_regex_arr,
                filter_option_type_str,
                filter_key_neg_str,
                filter_key_prefix_str,
                filter_key_regex_str,
                filter_key_str,
                filter_key_arr = [],
                filter_regex_obj,
                filter_arr = [],
                filter_obj,
                filter_createdom_override_obj;

            //return if not valid
            if(_w.isBool(context) || _w.isNullOrUndefined(context) || context.length < 1)
            {
                return context;
            }

            //filter
            if(_w.isString(filter_expr) && filter_expr.length > 0)
            {
                filter_option_regex_arr = _w.regexMatchAll(/^ *([\!]?)([\#\.]?)(?:\(?)(.+?)(?:\)?) *$/i, filter_expr);

                filter_key_neg_str = filter_option_regex_arr[0][1];
                filter_key_prefix_str = filter_option_regex_arr[0][2];
                filter_key_str = filter_option_regex_arr[0][3];

                //check for multiple key declaration
                if(/,/i.test(filter_key_str))
                {
                    filter_key_arr = _w.explode(',', filter_key_str);
                }
                else
                {
                    filter_key_arr.push(filter_key_str);
                }

                //compose filter key regular expression substring
                filter_key_regex_str = _w.implode('|', filter_key_arr);

                //define class/id regex
                if(filter_key_prefix_str === '.')
                {
                    filter_option_type_str = 'class';
                    filter_regex_obj = new RegExp("^ *(?:|.*? +?)(?:"+filter_key_regex_str+")(?:| +?.*?) *$", "i");
                }
                else if (filter_key_prefix_str === '#')
                {
                    filter_option_type_str = 'id';
                    filter_regex_obj = new RegExp("^ *(?:"+filter_key_regex_str+") *$", "i");
                }

                //flag for negation
                context_item_test_negate_bool = (filter_key_neg_str === '!') ? true : false;

                //cycle through
                context.each(function(index, el)
                {
                    if(filter_option_type_str === 'class')
                    {
                        //get class
                        context_item_test_value_str = el.getAttribute('class');
                    }
                    else if (filter_option_type_str === 'id')
                    {
                        //get id
                        context_item_test_value_str = el.getAttribute('id');
                    }

                    context_item_test_value_str = (context_item_test_value_str) ? context_item_test_value_str : '';
                    context_item_test_temp_bool = filter_regex_obj.test(context_item_test_value_str);

                    context_item_test_bool = (context_item_test_negate_bool) ? !context_item_test_temp_bool : context_item_test_temp_bool;

                    if(context_item_test_bool)
                    {
                        filter_arr.push(el);
                    }
                });

                //create filter array
                filter_createdom_override_obj = {context: filter_arr, selectorMethod: 'filter', addSelector: false};
                filter_obj = wQuery.createDom(undefined, undefined, filter_createdom_override_obj);
            }

            return filter_obj;
        }

        /**
         * Check the current matched element against a selector
         * @param {String} selector_str
         * :hidden - check if the element is hidden
         * :visible - check if the element is visible
         * :inview - check if the element is within the viewport
         * :inviewall - check if the whole element is within the viewport
         * @return {Boolean}
         * @private
         */
        function _is(selector_str, context_obj)
        {
            if(!_w.isString(selector_str) || selector_str.length < 1)
            {
                return;
            }

            if(context_obj.empty)
            {
                return;
            }

            var _ctx = context_obj[0],
                style_display_str = ''+_ctx.style.display,
                style_visibility_str = ''+_ctx.style.visibility,
                css_display_str = context_obj.css('display'),
                css_visibility_str = context_obj.css('visibility');

            if(/^ *\:[^\s]+? *$/i.test(selector_str))
            {
                if(selector_str === ':hidden')
                {
                    return (/^ *hidden *$/i.test(style_visibility_str) || /^ *hidden *$/i.test(css_visibility_str) || /^ *none *$/i.test(style_display_str) || /^ *none *$/i.test(css_display_str));
                }
                else if (selector_str === ':visible')
                {
                    if((_w.isString(style_visibility_str) && style_visibility_str.length > 0) || (_w.isString(css_visibility_str) && css_visibility_str.length > 0) || (_w.isString(style_display_str) && style_display_str.length > 0) || (_w.isString(css_display_str) && css_display_str.length > 0))
                    {
                        if(/^ *none *$/i.test(style_display_str) || /^ *none *$/i.test(css_display_str))
                        {
                            return false;
                        }

                        return !!(/^ *(visible|initial) *$/i.test(style_visibility_str) || /^ *(visible|initial) *$/i.test(css_visibility_str));
                    }

                    return !!( _ctx.offsetWidth || _ctx.offsetHeight || _ctx.getClientRects().length );
                }
                else if (/^ *\:inview/i.test(selector_str))
                {
                    if(selector_str === ':inviewall')
                    {
                        return !!(context_obj.inViewport(true));
                    }

                    return !!(context_obj.inViewport());
                }
            }
        }

        //if jQuery or Zepto, $.extend
        if($_obj === window.jQuery)
        {
            //JQuery
            $_obj.fn.extend({
                wizmo: function(options){
                    wizmo.run(this, options);
                }
            });
        }
        else if ($_obj === window.Zepto)
        {
            //Zepto
            $_obj.extend($_obj.fn, {
                wizmo: function(options){
                    wizmo.run(this, options);
                }
            });
        }
        else if ($_obj === window.wQuery)
        {
            //WQuery
            $_obj.extend('wizmo', function(options){
                wizmo.run(this, options);
            });

            //1: Add Utility Methods

            /**
             * Fades in an element
             * @param {Number} duration_int the duration of the animation [in seconds]
             * @param {Function} callback_fn a callback function to execute on fade in
             * @returns {*}
             */
            $_obj.extend('fadeIn', function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    _this = this[0];
                return _fadeIn(_this, myArgs[0], myArgs[1]);
            });

            /**
             * Fades out an element
             * @param {Number} duration_int the duration of the animation [in seconds]
             * @param {Function} callback_fn a callback function to execute on fade out
             * @returns {*}
             */
            $_obj.extend('fadeOut', function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    _this = this[0];
                return _fadeOut(_this, myArgs[0], myArgs[1]);
            });

            /**
             * Reduces a set of matched elements given a filter key
             * @param {String} filter_expr_str An expression that defines how things should be filtered
             * The filter expression could be in the following format:
             * .class: gets the elements that have a specific class
             * #id: gets the element that have a specific id
             *
             * You can also use a negation prefix
             * !.class: gets the elements that do not have a specific class
             * !#id: gets the element(s) that do not have a specific id
             *
             * You can also negate multiple classes or ids using brackets and commas
             * !.(class_1,class_2): gets the elements that do not match the listed classes
             * !#(id-1,id-2): gets the elements that do not match the listed ids
             *
             * Example 1: $('li').filter('!.test'), will get all <li> elements, and then return all elements that do not have 'test' as a class
             *
             * Example 2: $('li').filter('.first').filter('!.later'), will get all <li> elements, and then return all elements that have 'first' as a class, and then filter further to return the elements within that set that do not have 'later' as a class
             *
             * @return {Object}
             */
            $_obj.extend('filter', function(filter_expr_str){
                return _filter(filter_expr_str, this);
            });


            /**
             * Check the current matched element against a selector
             * @param {String} selector_str
             * :hidden - check if the element is hidden
             * :visible - check if the element is visible
             * :inview - check if the element is within the viewport
             * :inviewall - check if the whole element is within the viewport
             * @return {Boolean}
             * @private
             */
            $_obj.extend('is', function(selector_str){
                return _is(selector_str, this);
            });

            //2: Add Event Handlers

            /**
             * Event handler for CSS Transitions
             * Script inspired by Osvaldas Valutis (https://osvaldas.info/detecting-css-animation-transition-end-with-javascript)
             * @param {Function} callback_fn the function to execute once the transition is complete. It will be passed the locally scoped this reference
             */
            $_obj.extend('onCSSTransitionEnd', function(callback_fn)
            {
                var _this = this[0],
                    body_obj = $('body'),
                    _body_obj = body_obj[0],
                    _body_style_obj = _body_obj.style,
                    prefix_transition_str = '',
                    callback_main_fn = function(e){
                        callback_fn(this);
                        $(this).off(e.type, callback_main_fn);
                    }
                    ;

                //set prefix support prefixes
                if(!_w.isNullOrUndefined(_body_style_obj.WebkitTransition)){prefix_transition_str = '-webkit-';}
                if(!_w.isNullOrUndefined(_body_style_obj.MozTransition)){prefix_transition_str = '-moz-';}
                if(!_w.isNullOrUndefined(_body_style_obj.OTransition)){prefix_transition_str = '-o-';}
                if(!_w.isNullOrUndefined(_body_style_obj.MSTransition)){prefix_transition_str = '-ms-';}

                if(!_w.isNullOrUndefined(_body_style_obj.transition))
                {
                    //native support
                    this.on('transitionend', callback_main_fn);
                }
                else
                {
                    //fallback to prefixed support
                    this.on('webkitTransitionEnd', callback_main_fn);
                    this.on('mozTransitionEnd', callback_main_fn);
                    this.on('oTransitionEnd', callback_main_fn);
                    this.on('msTransitionEnd', callback_main_fn);
                }

                /* jshint -W116 */

                if( ( prefix_transition_str === '' && !( 'transition' in _body_style_obj ) ) || getComputedStyle( _this )[ prefix_transition_str + 'transition-duration' ] == '0s' )
                {
                    callback_fn(this);
                }

                /* jshint +W116 */

                return this;
            });

            /**
             * Event handler for CSS Animations
             * Script inspired by Osvaldas Valutis (https://osvaldas.info/detecting-css-animation-transition-end-with-javascript)
             * @param {Function} callback_fn the function to execute once the animation is complete
             */
            $_obj.extend('onCSSAnimationEnd', function(callback_fn){

                var _this = this[0],
                    body_obj = $('body'),
                    _body_obj = body_obj[0],
                    _body_style_obj = _body_obj.style,
                    prefix_animation_str = '',
                    callback_main_fn = function(e){
                        callback_fn(this);
                        $(this).off(e.type, callback_main_fn);
                    }
                    ;

                //set prefix support prefixes
                if(!_w.isNullOrUndefined(_body_style_obj.WebkitAnimation)){prefix_animation_str = '-webkit-';}
                if(!_w.isNullOrUndefined(_body_style_obj.MozAnimation)){prefix_animation_str = '-moz-';}
                if(!_w.isNullOrUndefined(_body_style_obj.OAnimation)){prefix_animation_str = '-o-';}
                if(!_w.isNullOrUndefined(_body_style_obj.MSAnimation)){prefix_animation_str = '-ms-';}

                if(!_w.isNullOrUndefined(_body_style_obj.animation))
                {
                    //native support
                    this.on('animationend', callback_main_fn);
                }
                else
                {
                    //fallback to prefixed support
                    this.on('webkitAnimationEnd', callback_main_fn);
                    this.on('mozAnimationEnd', callback_main_fn);
                    this.on('oAnimationEnd', callback_main_fn);
                    this.on('oanimationEnd', callback_main_fn);
                    this.on('msAnimationEnd', callback_main_fn);
                }

                /* jshint -W116 */

                if( ( prefix_animation_str === '' && !( 'animation' in _body_style_obj ) ) || getComputedStyle( _this )[ prefix_animation_str + 'animation-duration' ] == '0s' )
                {
                    callback_fn(this);
                }

                /* jshint +W116 */

                return this;
            });


            //3: Add Scroll Methods

            /**
             * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent
             * Returns an object containing the properties top and left
             * @returns {*}
             */
            $_obj.extend('position', function(){
                var _this = this[0];
                return {left: _this.offsetLeft, top: _this.offsetTop};
            });

            /**
             * Get the current coordinates of the first element in the set of matched elements, relative to the document
             * Returns an object containing the properties top and left
             * @returns {*}
             */
            $_obj.extend('offset', function(){
                var _this = this[0];
                return _offset(_this);
            });

            /**
             * Get or set the current vertical position of the scroll bar
             * Wrapper class for _scrollTop()
             * @returns {Number}
             */
            $_obj.extend('scrollTop', function(value){
                return _scrollTop(value, this);
            });

            /**
             * Get or set the current horizontal position of the scroll bar
             * Wrapper class for _scrollTop()
             * @returns {Number}
             */
            $_obj.extend('scrollLeft', function(value){
                return _scrollLeft(value, this);
            });

            /**
             * Scroll the document to a specific position
             * @param {Number|Object} target_pos_or_obj the y- position [or the target object reference] to scroll to
             *
             * @param {Object} options_obj the options that define the scroll action
             * speed: the scroll speed in pixels per second. You can override speed and use duration instead by prepending 'd' to the value. For example, 'd1000' will force scroll duration of 1000 milliseconds
             *
             * offset: the offset value. This will create an offset on the target scroll position. For example, an offset of 100 will stop scroll 100 pixels after target position. This will be vice versa when offset is, say, -100
             * You can also use percentages e.g. '15%'. When you do this, the offset value will be calculated relative to the viewport height. So, if the viewport height is 640 pixels, and you define an offset of '10%', the actual offset value will be
             *
             * callback: the callback function to be executed after scroll
             *
             * easing: the name of the easing for
             * the available options are:
             * - mathEaseInOutQuad [Default]
             * - mathEaseInCubic
             * - mathInOutQuintic
             *
             * easing_fn: a custom easing function
             * this function will be passed the following arguments:
             * - t [incrementing time value in milliseconds]
             * - b [the start position]
             * - c [the end position]
             * - d [the duration of scroll]
             * see _scrollTo code for more detail
             *
             */
            $_obj.extend('scrollTo', function(){
                var myArgs = Array.prototype.slice.call(arguments),
                    _ctx;

                if(this.selector === 'body' || this.selector === 'html')
                {
                    _ctx = (document.documentElement && _w.isNumber(document.documentElement.scrollTop)) ? document.documentElement : document.body;

                    _scrollTo(_ctx, myArgs[0], myArgs[1]);
                }
            });

            /**
             * Wrapper class for _scrollAreaOffset
             * @returns {*}
             */
            $_obj.extend('scrollAreaOffset', function(){
                return _scrollAreaOffset(this);
            });

            /**
             * Gets the scroll position
             * Returns an object containing the viewport and object scroll positions
             * Example: {top: 20, left: 8, top_e: 240, left_e: 0 }
             * top: the viewport scroll position relative to the top of the document
             * left: the viewport scroll position relative to the left of the viewport
             * top_e: the element's scroll position relative to the top viewport
             * scroll position
             * left_e: the element's scroll position relative to the left viewport
             * scroll position
             * @return {Object}
             */
            $_obj.extend('scrollPosition', function(){
                var _this = this[0],
                    _offset_obj = _offset(_this),
                    _scroll_top_int = _scrollTop(),
                    _scroll_left_int = _scrollLeft(),
                    _scroll_top_el_int = _offset_obj.top - _scroll_top_int,
                    _scroll_left_el_int = _offset_obj.left - _scroll_left_int
                    ;

                return {top: _scroll_top_int, left: _scroll_left_int, top_e: _scroll_top_el_int, left_e: _scroll_left_el_int};
            });

            /**
             * Determines if the element is within the viewport
             * @param contain_bool {Boolean} this determines whether the viewport/viewzone must contain the given element completely or not. See _inView
             * @return {Boolean}
             */
            $_obj.extend('inViewport', function(contain_bool){
                return _inView(this, null, contain_bool);
            });

            /**
             * Determines if the element is within a specific zone of the viewport
             * @param viewzone_obj {Object} the specific viewzone object.
             * See _inView for more
             * @param contain_bool {Boolean} this determines whether the viewport/viewzone must contain the given element completely or not. See _inView
             * @param debug_bool {Boolean} if true, will display the viewzone in the viewport as a visual aid
             * @returns {Boolean}
             */
            $_obj.extend('inViewzone', function(viewzone_obj, contain_bool, debug_bool){
                return _inView(this, viewzone_obj, contain_bool, debug_bool);
            });


            /**
             * Performs an asynchronous HTTP (AJAX) Request
             * Designed for GET and POST requests
             * Uses JavaScript Promises functionality
             * @param url_str {String} The URL to which the request should be sent
             * @param options_obj {Object} A set of key/value pairs that configure the AJAX request
             * It has the following options
             *
             * method {string}: the HTTP method to use. Default value is GET
             *
             * async {boolean}: indicates whether the operation will be performed asynchronously. Default is true
             *
             * data {string|object}: the data payload to be sent with the request. This is for POST operations
             *
             * headers {object}: Defines the HTTP headers to be sent in the request. Defined as an array with key as header and value as value e.g. {'Cache-Control': 'no-cache'}
             *
             * cache_key {string}: specifies an identifier for a previously cached AJAX request. By specifying a cache key, you are requesting that the AJAX Request should be cached. Only successful requests will be cached
             *
             * cache_expiry {number}: specifies the lifetime of the cached item in milliseconds
             *
             * cache_storage {string}: the storage method. The following values are valid
             * - 'ls' for localStorage
             * - 'ss' for sessionStorage [default]
             * - 'ds' for dom-based storage
             * Note that dom-based storage does not persist past page refreshes
             *
             * cache_and_fetch {boolean}: defines whether an AJAX request should be made when a cached value already exists
             *
             * response {boolean}: Returns the response entity body instead of the entire HTTP request. For example, if response is true, the value returned will be xhr.response instead of xhr. Default is true
             *
             * response_key {string}: If response is true, this serves as an identifier to retrieve a subset of xhr.response. For example, if response_key is 'code_name', the result returned will be xhr.response['code_name'] instead of xhr.response
             *
             * response_valid_headers {string}: Defines valid response header codes that define a successful HTTP response e.g. if 200 and 301 are given, then if the XHR response has a 400 error, then the promise will be rejected (as opposed to resolved). Values should be provided in comma-delimited format e.g. 200,304
             * Default values are 200, 201, 202, 203, 204, and 304.
             *
             * response_template {object}: a template object that will be applied on the XHR response before it is returned
             * Note: same template object as wizmo.compile
             *
             * parse_json {boolean}: this specifies whether the response should be JSON parsed before applying the response_key
             *
             * jsonp {boolean}: determines if JSONP functionality should be invoked
             *
             * jsonp_callback {Function}: the JSONP callback
             *
             * onerror: a custom callback function for the onerror XHR handler
             *
             * ontimeout: a custom callback function for the ontimeout XHR handler
             *
             * This function returns a Promise so when using it, you should do so as follows:
             * Example: $.ajax('http://your_url', {method: 'GET'}).then(function(response){});
             * .then() takes two arguments:
             * 1. first argument is a callback for the success/resolve case
             * 2. second argument is a callback for the failure/reject case
             *
             * override_mime_type: a value to override the MIME type
             *
             * @return {Promise}
             */
            $_obj.ajax = function(url_str)
            {
                var myArgs = Array.prototype.slice.call(arguments),
                    options_obj = (!_w.isNullOrUndefined(myArgs[1])) ? myArgs[1]: {},
                    url_q_str,
                    url_q_arr,
                    send_params_str,
                    method_str = (_w.isString(options_obj.method) && options_obj.method.trim().length > 0) ? options_obj.method : "GET",
                    is_async_bool = (_w.isBool(options_obj.async)) ? options_obj.async : true,
                    data_str_or_obj = (options_obj.data) ? options_obj.data : undefined,
                    headers_obj = (typeof options_obj.headers !== 'undefined') ? options_obj.headers: {},
                    cache_data_str,
                    cache_key_str = (_w.isString(options_obj.cache_key) && options_obj.cache_key.trim().length > 0) ? options_obj.cache_key : '',
                    cache_key_final_str,
                    cache_bool = !(_w.isEmptyString(cache_key_str)),
                    cache_is_enabled_bool,
                    cache_expiry_int = (_w.isNumber(options_obj.cache_expiry) || _w.isNumberString(options_obj.cache_expiry)) ? parseInt(options_obj.cache_expiry) : 0,
                    store_options_obj = (cache_expiry_int > 0) ? {expires: cache_expiry_int} : {},
                    cache_storage_str = (!_w.isEmptyString(options_obj.cache_storage) && _w.in_array(options_obj.cache_storage, ['ss', 'ls', 'ds'])) ? options_obj.cache_storage : 'ss',
                    cache_and_fetch_bool = (_w.isBool(options_obj.cache_and_fetch)) ? options_obj.cache_and_fetch : true,
                    is_xhr_response_bool = (_w.isBool(options_obj.response)) ? options_obj.response : true,
                    is_xhr_response_template_obj = (_w.isObject(options_obj.response_template)) ? options_obj.response_template : undefined,
                    xhr_response_key = (_w.isString(options_obj.response_key) && options_obj.response_key.trim().length > 0) ? options_obj.response_key : '',
                    is_xhr_response_key_bool = !!(xhr_response_key.length > 0),
                    is_xhr_response_parse_json_bool = !!(options_obj.parse_json),
                    xhr_response_valid_headers_arr = (options_obj.response_valid_headers) ? _w.explode(',', options_obj.response_valid_headers): ['200', '201', '202', '203', '204', '304'],
                    xhr_onerror_fn = (options_obj.onerror) ? options_obj.onerror : function(){_w.console.error(_w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: XHR onerror default callback for request to '+url_str+'', true); return false;},
                    xhr_ontimeout_fn = (options_obj.ontimeout) ? options_obj.ontimeout : function(){_w.console.error(_w.config.app_name+' error ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: XHR timeout default callback for request to '+url_str+'', true); return false;},
                    is_jsonp_request_bool = (_w.isBool(options_obj.jsonp)) ? options_obj.jsonp : false,
                    jsonp_callback_fn = (_w.isFunction(options_obj.jsonp_callback)) ? options_obj.jsonp_callback : function(){var e_msg_str = _w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: No JSONP callback function defined';_w.console.warn(e_msg_str, true);},
                    response_filter_options_obj = {},
                    override_mime_type_str = (options_obj.override_mime_type && _w.isString(options_obj.override_mime_type) && options_obj.override_mime_type.length > 0) ? options_obj.override_mime_type : undefined,
                    is_xdomain_bool = false,
                    xhr_response_data_str
                    ;

                //make method uppercase
                method_str = method_str.toUpperCase();

                //get query parameters if defined
                url_q_arr = url_str.split('?');
                url_q_str = (url_q_arr[1]) ? url_q_arr[1] : '';

                //set send parameters based HTTP Verb
                if(method_str === 'GET')
                {
                    send_params_str = null;
                }
                else
                {
                    url_str = url_q_arr[0];
                    send_params_str = url_q_str;

                    //set data if defined
                    if(data_str_or_obj)
                    {
                        send_params_str = (_w.isObject(data_str_or_obj)) ? JSON.stringify(data_str_or_obj) : data_str_or_obj ;
                    }

                    //if POST, define default Content-Type header
                    if(method_str === 'POST' && !headers_obj['Content-type'])
                    {
                        headers_obj['Content-type'] = 'application/x-www-form-urlencoded';
                    }
                }

                //define response filter options
                response_filter_options_obj.is_xhr_response = is_xhr_response_bool;
                response_filter_options_obj.is_xhr_response_key = is_xhr_response_key_bool;
                response_filter_options_obj.xhr_response_key = xhr_response_key;
                response_filter_options_obj.is_xhr_response_parse_json = is_xhr_response_parse_json_bool;
                response_filter_options_obj.is_xhr_response_template = is_xhr_response_template_obj;

                return new Promise(function(resolve, reject)
                {
                    function responseFilter(xhr, options_obj)
                    {
                        var is_xhr_response_bool = options_obj.is_xhr_response,
                            is_xhr_response_key_bool = options_obj.is_xhr_response_key,
                            xhr_response_key_str = options_obj.xhr_response_key,
                            is_xhr_response_parse_json_bool = options_obj.is_xhr_response_parse_json,
                            is_xhr_response_template = options_obj.is_xhr_response_template
                        ;

                        if(is_xhr_response_bool)
                        {
                            var xhr_ctx = (xhr.response || xhr.responseText) ? xhr.response || xhr.responseText : xhr,
                                xhr_ctx_r;

                            if(is_xhr_response_key_bool)
                            {
                                if (is_xhr_response_parse_json_bool)
                                {
                                    try
                                    {
                                        var response_json_obj = JSON.parse(xhr_ctx);
                                        return response_json_obj[''+xhr_response_key_str+''];
                                    }
                                    catch(e)
                                    {
                                        return xhr_ctx;
                                    }
                                }
                                else
                                {
                                    if(_w.isObject(xhr_ctx) || _w.isArray(xhr_ctx))
                                    {
                                        xhr_ctx_r = xhr_ctx[''+xhr_response_key_str+''];

                                        if(_w.isString(xhr_ctx_r))
                                        {
                                            //compile if required
                                            if(_w.isObject(is_xhr_response_template))
                                            {
                                                xhr_ctx_r = wizmo.compile(xhr_ctx_r, is_xhr_response_template);
                                            }
                                        }
                                        return xhr_ctx_r;
                                    }
                                    else
                                    {
                                        return xhr_ctx;
                                    }
                                }
                            }
                            else
                            {
                                if (is_xhr_response_parse_json_bool)
                                {
                                    try
                                    {
                                        return JSON.parse(xhr_ctx);
                                    }
                                    catch(e)
                                    {
                                        return xhr_ctx;
                                    }
                                }
                                else
                                {
                                    if(_w.isString(xhr_ctx))
                                    {
                                        //compile if required
                                        if(_w.isObject(is_xhr_response_template))
                                        {
                                            xhr_ctx = wizmo.compile(xhr_ctx, is_xhr_response_template);
                                        }
                                    }
                                    return xhr_ctx;
                                }
                            }
                        }
                        else
                        {
                            if(_w.isString(xhr))
                            {
                                //compile if required
                                if(_w.isObject(is_xhr_response_template))
                                {
                                    xhr = wizmo.compile(xhr, is_xhr_response_template);
                                }
                            }
                            return xhr;
                        }
                    }

                    /**
                     * 1: Check if there is a cached value
                     * 2: If not, execute XHR
                     */
                    cache_key_final_str = 'var_xhr_cache_'+cache_key_str;
                    cache_data_str = (cache_storage_str === 'ds') ? wizmo.domStore(cache_key_final_str) : wizmo.store(cache_key_final_str, undefined, cache_storage_str);
                    cache_is_enabled_bool = !!(cache_bool && cache_data_str);

                    if(cache_is_enabled_bool)
                    {
                        //1:

                        if(is_jsonp_request_bool)
                        {
                            //get cached JSONP
                            resolve(jsonp_callback_fn(cache_data_str));
                        }
                        else
                        {
                            //resolve cached data
                            resolve(responseFilter(cache_data_str, response_filter_options_obj));
                        }
                        return;
                    }
                    if(!cache_is_enabled_bool || (cache_is_enabled_bool && cache_and_fetch_bool))
                    {
                        //2:

                        if(is_jsonp_request_bool)
                        {
                            //use JSON-P
                            var cache_key_json_str = (cache_bool) ? cache_key_final_str : false;
                            resolve(_jsonp(url_str, jsonp_callback_fn, cache_key_json_str, cache_storage_str, store_options_obj, cache_and_fetch_bool));
                        }
                        else
                        {
                            var xhr;
                            if (window.XDomainRequest && _w.config.forceXDomainRequest)
                            {
                                is_xdomain_bool = true;
                                xhr = new window.XDomainRequest();
                                xhr.contentType = "text/plain";
                            }
                            else if (window.XMLHttpRequest)
                            {
                                xhr = new XMLHttpRequest();
                            }
                            else
                            {
                                xhr = new ActiveXObject("Microsoft.XMLHTTP");
                            }

                            //execute asynchronous requests
                            if(is_async_bool)
                            {
                                if(!is_xdomain_bool)
                                {
                                    xhr.onreadystatechange = function() {
                                        /* jshint -W116 */
                                        if (xhr.readyState == 4) {

                                            if(_w.in_array(xhr.status, xhr_response_valid_headers_arr))
                                            {
                                                if(cache_bool)
                                                {
                                                    xhr_response_data_str = xhr.response || xhr.responseText;

                                                    //persist
                                                    if(cache_storage_str === 'ds')
                                                    {
                                                        wizmo.domStore(cache_key_final_str, xhr_response_data_str);
                                                    }
                                                    else
                                                    {
                                                        wizmo.store(cache_key_final_str, xhr_response_data_str, cache_storage_str, store_options_obj);
                                                    }
                                                }

                                                resolve(responseFilter(xhr, response_filter_options_obj));
                                            }
                                            else
                                            {
                                                reject({
                                                    xhrStatus: xhr.status,
                                                    xhrStatusText: xhr.statusText,
                                                    xhrResponse: xhr.response,
                                                    xhrResponseText: xhr.responseText,
                                                    errorMessage: 'asynchronous XHR error for request to '+url_str+''
                                                });
                                            }
                                            return;
                                        }
                                        /* jshint +W116 */
                                    };
                                }
                            }

                            //Set onerror and ontimeout callbacks
                            if(!is_xdomain_bool)
                            {
                                xhr.onerror = xhr_onerror_fn;
                                xhr.ontimeout = xhr_ontimeout_fn;
                            }

                            //override mime type
                            if(override_mime_type_str)
                            {
                                xhr.overrideMimeType(override_mime_type_str);
                            }

                            //open request
                            if(is_xdomain_bool)
                            {
                                xhr.open(method_str, url_str);

                                xhr.onprogress = function(){};
                                xhr.ontimeout = xhr_ontimeout_fn;

                                xhr.onload = function(){
                                    if(cache_bool)
                                    {
                                        //persist
                                        if(cache_storage_str === 'ds')
                                        {
                                            wizmo.domStore(cache_key_final_str, xhr.responseText);
                                        }
                                        else
                                        {
                                            wizmo.store(cache_key_final_str, xhr.responseText, cache_storage_str, store_options_obj);
                                        }
                                    }

                                    resolve(responseFilter(xhr.responseText, response_filter_options_obj));
                                };

                                xhr.onerror = xhr_onerror_fn;
                            }
                            else
                            {
                                xhr.open(method_str, url_str, is_async_bool);

                                //set request headers
                                if(_w.count(headers_obj) > 0)
                                {
                                    var headers_keys_arr = _w.array_keys(headers_obj),
                                        headers_values_arr = _w.array_values(headers_obj);
                                    for(var i = 0; i < _w.count(headers_obj); i++)
                                    {
                                        xhr.setRequestHeader(""+headers_keys_arr[i]+"", ""+headers_values_arr[i]+"");
                                    }
                                }
                            }

                            //send request
                            xhr.send(send_params_str);

                            //execute callbacks for synchronous requests
                            if(!is_async_bool)
                            {
                                if(_w.in_array(xhr.status, xhr_response_valid_headers_arr))
                                {
                                    if(cache_bool)
                                    {
                                        xhr_response_data_str = xhr.response || xhr.responseText;

                                        //persist
                                        if(cache_storage_str === 'ds')
                                        {
                                            wizmo.domStore(cache_key_final_str, xhr_response_data_str);
                                        }
                                        else
                                        {
                                            wizmo.store(cache_key_final_str, xhr_response_data_str, cache_storage_str, store_options_obj);
                                        }
                                    }

                                    resolve(responseFilter(xhr, response_filter_options_obj));
                                }
                                else
                                {
                                    reject({
                                        xhrStatus: xhr.status,
                                        xhrStatusText: xhr.statusText,
                                        xhrResponse: xhr.response,
                                        xhrResponseText: xhr.responseText,
                                        errorMessage: 'synchronous XHR error for request to '+url_str+''
                                    });
                                }
                            }
                        }
                    }
                });
            };
        }

    })($);

})(window, document, wQuery, _w);
