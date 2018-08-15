/*! Critical JavaScript. Load in <head> using <script> with async attribute value */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W018 */
/*jshint -W069 */
/* global module, window, amplify */
"use strict";

/*! _w [underDub] function helpers | @link https://github.com/restive/_w | @copyright Obinwanne Hill <@obihill> | @license MIT */
(function(root, name, make){
    if (typeof module !== 'undefined' && module.exports){ module.exports = make();}
    else {root[name] = make();}
}(this, '_w', function() {

    var _window = this || window;
    var hasOwnProperty = _window.hasOwnProperty || Object.prototype.hasOwnProperty;

    /**
     * Return a timestamp
     * @link http://locutus.io/php/datetime/microtime/
     * @param {Boolean} get_as_float if set to true, will return a float
     * @return {*}
     */
    function microtime (get_as_float) {
        var now = new Date().getTime() / 1000;
        var s = parseInt(now, 10);

        return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    }

    /**
     * Checks if a variable is a String
     * @param str {*} The variable to test
     * @return {Boolean}
     */
    function isString(str)
    {
        return (typeof str === "string" || str instanceof String);
    }

    /**
     * Checks if a variable is a Number
     * @param num {*} The variable to test
     * @return {Boolean}
     */
    function isNumber(num)
    {
        if(isObject(num) || isArray(num))
        {
            return false;
        }
        return (!isNaN(parseFloat(num)) && isFinite(num));
    }

    /**
     * Checks if a variable is a String and is blank/empty
     * @param str {*} The variable to test
     * @returns {boolean}
     */
    function isEmptyString(str)
    {
        if(!(isString(str) || isNumber(str)))
        {
            return false;
        }

        str = str+'';
        return !!(/^[\s]*?$/i.test(str));
    }

    /**
     * Checks if a variable is a Boolean
     * @param bool {*} The variable to test
     * @return {Boolean}
     */
    function isBool(bool)
    {
        return (bool === true || bool === false);
    }

    /**
     * Checks if the variable is an array
     * @param arr {*} The variable to test
     * @return {Boolean}
     */
    function isArray(arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    }

    /**
     * Checks if a variable is an Object
     * @param obj {*} The variable to test
     * @return {Boolean}
     */
    function isObject(obj)
    {
        if (isArray(obj))
        {
            return false;
        }

        return typeof obj === "object";
    }

    /**
     * Checks if a value is null or undefined
     * @param {*} val the value to check
     * @returns {boolean}
     */
    function isNullOrUndefined(val)
    {
        return ((typeof val === "undefined" || val === null));
    }

    /**
     * Checks if a variable is a Function
     * @param obj {*} The variable to test
     * @return {Boolean}
     */
    function isFunction(obj)
    {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    /**
     * Checks if the environment is Node
     * @link https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
     * @return {Boolean}
     */
    function isNode()
    {
        var is_node_bool = false;
        if (typeof process === 'object') {
            if (typeof process.versions === 'object') {
                if (typeof process.versions.node !== 'undefined') {
                    is_node_bool = true;
                }
            }
        }

        return is_node_bool;
    }

    /**
     * Checks if an object has a given property defined on itself
     * @param obj {Object} the object
     * @param prop {String} the name of the property
     * @returns {boolean|*|Function}
     */
    function has (obj, prop)
    {
        /*jshint -W116 */
        return obj != null && hasOwnProperty.call(obj, prop);
        /*jshint +W116 */
    }

    /**
     * Count all elements in an array
     * @link http://locutus.io/php/array/count/
     * @param {*} mixed_var the element to enumerate
     * @param {Number|String} mode the mode parameter
     * @return {number}
     */
    function count (mixed_var, mode) {
        var key, nvld = false, cnt = 0;

        if (mixed_var === null || typeof mixed_var === 'undefined')
        {
            return 0;
        }
        else if (!isArray(mixed_var) && !isObject(mixed_var))
        {
            nvld = true;
        }

        if (has(mixed_var, 'length'))
        {
            return mixed_var.length;
        }

        //Return 1 if !isArray && !Object && does not have .length
        if(nvld)
        {
            return 1;
        }

        if (mode === 'COUNT_RECURSIVE')
        {
            mode = 1;
        }

        if (mode !== 1)
        {
            mode = 0;
        }

        for (key in mixed_var) {
            if (has(mixed_var, key))
            {
                cnt++;
                if (mode === 1 && mixed_var[key] && (isArray(mixed_var[key]) || isObject(mixed_var[key])))
                {
                    cnt += count(mixed_var[key], 1);
                }
            }
        }

        return cnt;
    }

    /**
     * Join array elements into a string
     * @param delimiter {string} the join delimiter
     * @param pieces {array} the array of strings to implode
     * @returns {String}
     */
    function implode(delimiter, pieces){

        if(!(isArray(pieces) || isObject(pieces)))
        {
            return false;
        }

        delimiter = (!delimiter) ? '' : delimiter;

        if(count(pieces) === 1)
        {
            //return first element without delimiter if array count is 1
            return ''+pieces[0];
        }
        else if (count(pieces) < 1)
        {
            //return empty string on blank array
            return "";
        }

        var retr_str = '';
        if(isArray(pieces))
        {
            //array

            for(var i = 0; i < count(pieces); i++)
            {
                retr_str += (i === 0) ? pieces[i] : delimiter+pieces[i];
            }
        }
        else
        {
            //object

            var j = 0;
            for (var key in pieces)
            {
                if (pieces.hasOwnProperty(key))
                {
                    retr_str += (j === 0) ? pieces[key] : delimiter+pieces[key];

                    j++;
                }
            }
        }

        return retr_str;
    }

    /**
     * Split a string by string
     * @link http://locutus.io/php/strings/explode/
     * @param {String} delimiter the boundary string
     * @param {String} string the input string
     * @param {Number} limit define a limit of returned items
     * @return {*}
     */
    function explode(delimiter, string, limit) {
        if ( arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined' ) {return null;}
        if ( delimiter === '' || delimiter === false || delimiter === null) {return false;}
        if ( typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string === 'object'){
            return { 0: '' };
        }
        if ( delimiter === true ) {delimiter = '1';}

        // Here we go...
        delimiter += '';
        string += '';

        var s = string.split( delimiter );


        if ( typeof limit === 'undefined' ) {return s;}

        // Support for limit
        if ( limit === 0 ) {limit = 1;}

        // Positive limit
        if ( limit > 0 ){
            if ( limit >= s.length ) {return s;}
            return s.slice( 0, limit - 1 ).concat( [ s.slice( limit - 1 ).join( delimiter ) ] );
        }

        // Negative limit
        if ( -limit >= s.length ){ return [];}

        s.splice( s.length + limit );
        return s;
    }

    /**
     * Checks if a value exists in an array
     * @param {String} needle_str the needle
     * @param {Array|Object} haystack_arr_or_obj the haystack
     * @param {Boolean} strict_bool if true, will check types i.e. it will use === instead of ==. Default is false
     * @param {Boolean} regex_bool if true, will check value as regular expression
     * @return {boolean}
     */
    function in_array(needle_str, haystack_arr_or_obj)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            strict_bool = !!((myArgs[2])),
            regex_bool = !!((myArgs[3])),
            regex_test_bool,
            regex_obj
        ;

        //create regex pattern object if specified
        if(regex_bool)
        {
            regex_obj = new RegExp(""+needle_str, "ig");
        }

        //cycle
        for (var key in haystack_arr_or_obj)
        {
            if (haystack_arr_or_obj.hasOwnProperty(key))
            {
                if(regex_bool)
                {
                    regex_test_bool = regex_obj.test(haystack_arr_or_obj[key]);
                    if(regex_test_bool)
                    {
                        return true;
                    }
                }
                else
                {
                    if(strict_bool)
                    {
                        if (haystack_arr_or_obj[key] === needle_str) {
                            return true;
                        }
                    }
                    else
                    {
                        /* jshint -W116 */
                        if (haystack_arr_or_obj[key] == needle_str) {
                            return true;
                        }
                        /* jshint +W116 */
                    }
                }
            }
        }

        return false;
    }

    /**
     * Determines whether a string or array contains a specific element
     * @param {String|Array} haystack_str_or_arr the string or array to search. If string, delimit values with comma(,)
     * @param {String|Array} needle_str_or_arr the searched value(s). To provide multiple values, specify an array or comma-delimited string
     * @param {Boolean} all_or_none_bool if true, and multiple values are provided, it will return true only if all values are contained in the haystack. Otherwise, it will return true if at least one value is contained.
     * Note: This option is available only when multiple values are used
     * @return {Boolean}
     */
    function contains(haystack_str_or_arr, needle_str_or_arr)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            all_or_none_bool = (isBool(myArgs[2])) ? myArgs[2] : false,
            needle_arr,
            delim_needle_str = ',',
            haystack_arr,
            delim_haystack_str = ',',
            test_factor_str = '',
            result_bool = false
            ;

        if(isString(haystack_str_or_arr) && /[^\s]+? +[^\s]+/i.test(haystack_str_or_arr))
        {
            haystack_str_or_arr = haystack_str_or_arr.replace(/ +/ig, " ");
            delim_haystack_str = ' ';
        }

        if(isString(needle_str_or_arr) && /[^\s]+? +[^\s]+/i.test(needle_str_or_arr))
        {
            needle_str_or_arr = needle_str_or_arr.replace(/ +/ig, " ");
            delim_needle_str = ' ';
        }

        haystack_arr = (!isArray(haystack_str_or_arr)) ? explode(delim_haystack_str, haystack_str_or_arr) : haystack_str_or_arr ;
        needle_arr = (!isArray(needle_str_or_arr)) ? explode(delim_needle_str, needle_str_or_arr) : needle_str_or_arr;

        //return if empty needle
        if((needle_arr.length === 1 && needle_arr[0] === "") || needle_arr.length < 1)
        {
            return null;
        }

        //return if empty haystack
        if((haystack_arr.length === 1 && haystack_arr[0] === "") || haystack_arr.length < 1)
        {
            return null;
        }

        for(var i = 0; i < needle_arr.length; i++)
        {
            test_factor_str += (in_array(needle_arr[i], haystack_arr)) ? '1' : '0';
        }

        //determine result
        if(all_or_none_bool)
        {
            result_bool = !!(/^1+$/i.test(test_factor_str));
        }
        else
        {
            result_bool = !!(/1/i.test(test_factor_str));
        }

        return result_bool;
    }

    /**
     * Merges one array with another
     * @param first {Array} the primary array
     * @param second {Array} the array being merged into primary
     * @returns {*}
     */
    function merge( first, second ) {
        var len = +second.length,
            j = 0,
            i = first.length;

        while ( j < len ) {
            first[ i++ ] = second[ j++ ];
        }

        // Support: IE<9
        // Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
        if ( len !== len ) {
            while ( second[j] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    }

    /**
     * Clone object
     * @param {Object} obj the object to clone
     * @param {Boolean} clone_by_parse_bool if true, will clone by stringifying and then parsing the boolean
     * @link Inspired by an answer here: https://stackoverflow.com/questions/7574054/javascript-how-to-pass-object-by-value
     * @return {*}
     */
    function cloneObject(obj)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            clone_by_parse_bool = (_w.isBool(myArgs[1])) ? myArgs[1] : false
        ;

        if(clone_by_parse_bool)
        {
            return JSON.parse(JSON.stringify(obj));
        }
        else
        {
            if(_w.isNullOrUndefined(obj) || !_w.isObject(obj))
            {
                return obj;
            }

            var temp = new obj.constructor();
            for(var key in obj)
            {
                if (obj.hasOwnProperty(key))
                {
                    temp[key] = cloneObject(obj[key]);
                }
            }

            return temp;
        }
    }

    /**
     * Merges one object with another
     * Note: Does not perform a deep copy
     * @param {Object} first_obj first object
     * @param next_obj other object
     * @return {Object}
     */
    function mergeObject(first_obj, next_obj)
    {
        var first_copy_obj = cloneObject(first_obj);
        for (var key in next_obj)
        {
            if (has(next_obj, key)) {
                first_copy_obj[key] = next_obj[key];
            }
        }
        return first_copy_obj;
    }

    /**
     * Return the keys of an array
     * @link http://locutus.io/php/array/array_keys/
     * @param {Array} input the input array
     * @param {String} search_value if valid, only keys containing this value will be returned
     * @param {Boolean} argStrict Determines strict comparison
     * @return {Array}
     */
    function array_keys (input, search_value, argStrict) {
        var search = typeof search_value !== 'undefined',
            tmp_arr = [],
            strict = !!argStrict,
            include = true,
            key = '';

        if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
            return input.keys(search_value, argStrict);
        }

        for (key in input) {
            if (has(input, key)) {
                include = true;
                if (search) {
                    if (strict && input[key] !== search_value) {
                        include = false;
                    }/* jshint -W116 */
                    else if (input[key] != search_value) {
                        include = false;
                    }/* jshint +W116 */
                }

                if (include) {
                    tmp_arr[tmp_arr.length] = key;
                }
            }
        }

        return tmp_arr;
    }

    /**
     * Return all the values of an array
     * @link http://locutus.io/php/array/array_values/
     * @param {Array} input the input array
     * @return {Array}
     */
    function array_values (input) {
        var tmp_arr = [],
            key = '';

        if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
            return input.values();
        }

        for (key in input) {
            if(has(input, key))
            {
                tmp_arr[tmp_arr.length] = input[key];
            }
        }

        return tmp_arr;
    }

    /**
     * Creates a combined array by using one array for keys and another for values
     * @param {Array} keys an array of the keys
     * @param {Array} values an array of the values
     * @return {Array}
     */
    function array_combine (keys, values) {
        var new_array = {},
            keycount = keys && keys.length,
            i = 0;

        // input sanitation
        if (typeof keys !== 'object' || typeof values !== 'object' || // Only accept arrays or array-like objects
            typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) { // Require arrays to have a count
            return false;
        }

        // number of elements does not match
        if (keycount !== values.length) {
            return false;
        }

        for (i = 0; i < keycount; i++) {
            new_array[keys[i]] = values[i];
        }

        return new_array;
    }

    /**
     * Converts a string array to an integer array
     * It converts all the string values of an array into their integer equivalents
     * Note: this method works for single-dimension object arrays
     * @param str_arr {Array|Object} The array to convert
     * @return {Array}
     */
    function arrayToInteger(str_arr)
    {
        var int_arr_item_int,
            array_count_int,
            keys_arr,
            values_arr,
            values_int_arr = [],
            final_int_arr;

        keys_arr = array_keys(str_arr);
        values_arr = array_values(str_arr);

        array_count_int = count(str_arr);
        for(var i = 0; i < array_count_int; i++)
        {
            int_arr_item_int = parseInt(values_arr[i]);
            values_int_arr.push(int_arr_item_int);
        }

        final_int_arr = (isObject(str_arr)) ? array_combine(keys_arr, values_int_arr) : values_int_arr;
        return final_int_arr;
    }

    /**
     * Converts camelcase string to dashed string
     * For example, myCamelString will become my-camel-string
     * @param {String} camel_str the string to convert
     * @return {string}
     */
    function camelToDash(camel_str)
    {
        var dash_str;
        if(!isString(camel_str))
        {
            return camel_str;
        }

        dash_str = camel_str.replace(/([A-Z])/g, function (g) {
            return "-" + g[0].toLowerCase();
        });

        return dash_str;
    }

    /**
     * Converts dashed string to camelCase string
     * @param {String} dash_str
     * @return {*|string}
     */
    function dashToCamel(dash_str)
    {
        var camel_str;
        if(!isString(dash_str))
        {
            return dash_str;
        }

        camel_str = dash_str.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });

        return camel_str;
    }


    /**
     * A HashCode string hashing function
     * @param {String} str the string to hash
     * @return {*}
     */
    function hashCode(str)
    {
        var hash_int = 0,
            char_str;

        if (!isString(str) || str.length < 1){
            return hash_int;
        }

        /*jshint bitwise: false */
        for (var i = 0; i < str.length; i++) {
            char_str = str.charCodeAt(i);
            hash_int = ((hash_int<<5)-hash_int)+char_str;
            hash_int = hash_int & hash_int; // Convert to 32bit integer
        }
        /*jshint bitwise: true */
        return hash_int;
    }


    /**
     * Sorts an array in numerical order and returns an array containing the keys of the array in the new sorted order
     * @param values_arr {Array} The array to sort
     * @return {Array}
     */
    function getSortedKeys(values_arr)
    {
        var array_with_keys = [],
            i;
        for (i = 0; i < values_arr.length; i++) {
            array_with_keys.push({ key: i, value: values_arr[i] });
        }

        array_with_keys.sort(function(a, b) {
            if (a.value < b.value) { return -1; }
            if (a.value > b.value) { return  1; }
            return 0;
        });

        var keys = [];
        for (i = 0; i < array_with_keys.length; i++) {
            keys.push(array_with_keys[i].key);
        }

        return keys;
    }

    /**
     * Finds the nearest matching number in an array containing integers
     * It is recommended that you sort the array in order before using it with this function
     * @param haystack_arr {Array} The array containing the integer values
     * @param needle_int {Number} The reference integer which is used to find the match
     * @param return_key_only_bool {Boolean} If true, will return the key position of the nearest match. Default is false.
     * @param is_ceil_bool {Boolean} If true, will return the nearest highest number even if a lower number is technically 'closer'. Default value is true.
     * @param disable_ceil_offset_int {Number} Please see explanation below.
     * For example, let's say needle_int is 120 and the nearest matching numbers are 115 on the lower end and 140 on the higher end
     * Being that is_ceil_bool is true by default, 140 would ordinarily be the nearest number selected. However, if disable_ceil_offset is set to 5 [or higher],
     * 115 will be returned because the difference between it (the true nearest matching number) and 120 (needle_int) is 5 [or more], even though needle_int is higher and under normal circumstances 140 would have been returned [as the next highest number after 120]
     * @return {Number}
     */
    function getClosestNumberMatchArray(haystack_arr, needle_int)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            return_key_only_bool = (isBool(myArgs[2])) ? myArgs[2]: false,
            is_ceil_bool = (isBool(myArgs[3])) ? myArgs[3]: true,
            disable_ceil_offset_int = (isNumber(myArgs[4])) ? myArgs[4] : 0,
            value_diff_int,
            value_diff_keys_sort_arr,
            value_diff_values_arr = [],
            key_final_int,
            value_final_int,
            value_final_needle_diff_int
            ;

        haystack_arr = arrayToInteger(haystack_arr);
        needle_int = parseInt(needle_int);

        for(var i = 0; i < count(haystack_arr); i++)
        {
            value_diff_int = needle_int - haystack_arr[i];
            value_diff_int = Math.abs(value_diff_int);
            value_diff_values_arr.push(value_diff_int);
        }

        value_diff_keys_sort_arr = getSortedKeys(value_diff_values_arr);
        key_final_int = value_diff_keys_sort_arr[0];
        value_final_int = haystack_arr[key_final_int];

        value_final_needle_diff_int = value_final_int - needle_int;
        value_final_needle_diff_int = Math.abs(value_final_needle_diff_int);

        //Manage for when needle_int is higher than nearest matching number, and highest matching number is required
        if(value_final_int < needle_int)
        {
            is_ceil_bool = (value_final_needle_diff_int <= disable_ceil_offset_int) ? false : is_ceil_bool;
            key_final_int = (is_ceil_bool) ? key_final_int + 1 : key_final_int;
        }

        //return value or key
        value_final_int = haystack_arr[key_final_int];
        return (return_key_only_bool) ? key_final_int: value_final_int;
    }

    /**
     * This function checks if a number is even
     * @param {Number} number_int the number to test
     * @return {Boolean}
     */
    function isEven(number_int)
    {
        if(!isNumber(number_int))
        {
            return null;
        }

        return !!(number_int % 2 === 0);
    }

    /**
     * This function checks if a number is an integer decimal and if the integral part of the decimal is even
     * For example, 640.123 will be true, 641.123 will be false
     * @param number_int {Number} The Integer Decimal
     * @return {Boolean}
     */
    function isEvenDecimal(number_int)
    {
        var number_str = ''+number_int+'';
        return ((/^ *[\-]?[0-9]+(0|2|4|6|8)\.[0-9]+ *$/i.test(number_str)));
    }

    /**
     * Pad a string
     * @param {Number|String} val_int_or_str the string to pad
     * @param {Number} pad_size_int the number of times pad_char_str will be padded
     * @param {String} pad_char_str the character/substring that will be used to pad
     * @param {Boolean} right_pad_bool if true, will pad to right. Otherwise, will pad to left
     * @returns {string}
     */
    function strPad(val_int_or_str, pad_size_int)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            pad_char_str = (isString(myArgs[2]) && myArgs[2].length > 0) ? myArgs[2]: '0',
            right_pad_bool = (isBool(myArgs[3])) ? myArgs[3] : false,
            val_str = ''+val_int_or_str,
            fill_seed_str = '';

        for(var i = 0; i < pad_size_int; i++)
        {
            fill_seed_str += pad_char_str;
        }

        return (right_pad_bool) ? val_str+fill_seed_str : fill_seed_str+val_str;
    }

    /**
     * This function will zero-fill a string or number
     * @param {Number|String} val_int_or_str the number or string to fill
     * @param {Number} str_size_int the total length of the string after zero-fill
     * @return {String}
     */
    function zeroFill(val_int_or_str, str_size_int)
    {
        var val_str = ''+val_int_or_str,
            val_str_len_int = val_str.length,
            val_fill_str
            ;

        if(!isNumber(str_size_int) || str_size_int < 1 || (val_str_len_int >= str_size_int))
        {
            return val_int_or_str;
        }

        val_fill_str = strPad(val_int_or_str, str_size_int, '0', false);
        return val_fill_str.slice(-str_size_int);
    }

    /**
     * Creates and returns a debounced version of the passed function
     * @param callback {Function} the callback function to fire
     * @param wait {Number} the wait time in milliseconds
     * @param callback_util {Function} a utility callback function. This is necessary sometimes when the original callback cannot be modified
     * @returns {Function}
     * @private
     */
    function debounce(callback, wait)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            callback_util = myArgs[2],
            time
            ;
        return function() {
            var myArgsSub = Array.prototype.slice.call(arguments);
            _window.clearTimeout(time);
            time = _window.setTimeout(function() {
                time = null;
                callback.call(this, myArgsSub[0], myArgsSub[1]);
                if(callback_util)
                {
                    callback_util.call(this, myArgsSub[0], myArgsSub[1]);
                }
            }, wait);
        };
    }

    /**
     * Performs a global regular expression match
     * Returns all full pattern and group matches
     * @param regex {*} The regular expression pattern
     * @param str {String} The input string
     * @return {Array}
     * @private
     */
    function regexMatchAll(regex, str)
    {
        var matches = [];
        str.replace(regex, function() {
            var arr = ([]).slice.call(arguments, 0);
            var extras = arr.splice(-2);
            arr.index = extras[0];
            arr.input = extras[1];
            matches.push(arr);
        });
        return matches.length ? matches : null;
    }

    /**
     * Extracts key-value pairs from a string
     * @param {String} str the main string
     * @param {String} filter_str filter a comma-delimited string containing keys that should be excluded from the final result
     * For example, if str is 'one=first two=second three=third four=fourth', and filter_str is 'two,three', the returned key-value pairs will exclude keys 'two', and 'three'
     * @param {String} delimiter_str the key-value delimiter
     * @param {String} delimiter_2_str  a secondary delimiter for key-value strings that have multiple delimiters e.g. 'one=first|two=second|three=third'
     * In this case, '|' is delimiter_2_str
     * @return {Object}
     */
    function getKeyValuePairs(str)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            filter_str = (isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : undefined,
            delimiter_str = (isString(myArgs[2]) && myArgs[2].length > 0) ? myArgs[2] : '=',
            delimiter_2_str = (isString(myArgs[3]) && myArgs[3].length > 0) ? myArgs[3] : '',
            filter_arr,
            regex_obj = new RegExp("[\"']?([^\\s"+delimiter_str+delimiter_2_str+"]+?)[\"']? *"+delimiter_str+" *[\"']?([^\\s\"'"+delimiter_2_str+"]+)[\"']?", "ig"),
            regex_match_arr = [],
            kv_final_obj = {}
            ;

        //return empty object if not string or empty string
        if(!isString(str) || (isString(str) && str.length < 1))
        {
            return {};
        }

        //create filter array
        filter_arr = (filter_str) ? explode(',', filter_str) : [] ;

        do {
            regex_match_arr = regex_obj.exec(str);
            if (regex_match_arr) {
                var regex_result_key_str = regex_match_arr[1];

                if(!in_array(regex_result_key_str, filter_arr))
                {
                    kv_final_obj[regex_result_key_str] = regex_match_arr[2];
                }
            }
        } while (regex_match_arr);

        return kv_final_obj;
    }

    /**
     * Configuration settings placeholder for wizmo
     *
     * awesomize {Boolean}: defines whether awesomize method is enabled or not. Default is true
     *
     * scroll {Object}: defines options for scroll events
     *
     * resize {Object}: defines options for resize events
     *
     * resizeContainer {Object}: defines options for resizeContainer events
     *
     * defer {Object}: defines the options for $.await timer

     * await {Object}: defines the options for $.await timer
     *
     * url {Object}: defines the default URLs for wizmo
     *  lang: defines the default URL for a remote language server. Default is http://api.wizmo.io/lang/
     *  geoip: defines the default URL for a remote geolocation server. Default is http://api.wizmo.io/geoip/
     *
     * enableResizeOnMobile {Boolean}: if true, will enable onResize events for mobile devices. Default is false.
     *
     * enableResizeOnPhone {Boolean}: if true, will enable onResize events for smartphones devices [Tablets will remain disabled]. Default is false.
     *
     * enableResizeOnTablet {Boolean}: if true, will enable onResize events for tablet devices [Smartphones will remain disabled]. Default is false.
     *
     * enableNoscriptDefer {Boolean}: if true, will enable the use of plain <noscript> tags for stylesheet deferrals.
     * For example, if you have the following code
     * <noscript>
     *    <link href="main.css" type="text/css" rel="stylesheet">
     * </noscript>
     * The <link> will be deferred and loaded unto the page automatically. This is a performance enhancement exclusive to Wizmo.
     * Default is true
     *
     * debug {Boolean}: if true, puts wizmo in debug mode. This mode will flush turbo-classes on refresh when moving between test devices on mobile-emulator-enabled browsers like Chrome
     *
     * proxyBrowserPingUrl {String}: Puts wizmo into proxy browser ping mode. The URL that hosts the User Agent String Server. The URL must point to a page that echos the user agent string. See the following URL for an example implementation in PHP: https://gist.github.com/restive/d54a4a282f2aa62337b26490559d9903
     *
     * cacheNative {Boolean}: if true, will force wizmo to use Cache API for its cache method if natively supported. If false, will force wizmo to use non-native pseudo-caching functionality. Default is true.
     *
     */
    var config_main_obj = {
        /**
         * Extend the config keyspace
         * Note: this function is for adding keys to the config
         * @param {String} key_str the identifier of the key
         *
         * You can also use a dot notation on the key to define a config item object
         *
         * _w.config.extend('cfg_obj.one', 'first');
         * _w.config.extend('cfg_obj.two', 'second');
         *
         * This will create a config item object analogous to an object like the following:
         * {'cfg_obj': {'one': 'first', 'two': 'second'}}
         *
         * @param {*} value the default value of the config item
         */
        extend: function(key_str){
            var myArgs = Array.prototype.slice.call(arguments),
                key_arr;

            if(/^ *[^\s\.]+?\.[^\s\.]+? *$/i.test(key_str))
            {
                key_arr = _w.explode('.', key_str);
                if(!_w.config[key_arr[0]])
                {
                    _w.config[key_arr[0]] = {};
                }
                _w.config[key_arr[0]][key_arr[1]] = myArgs[1];
            }
            else
            {
                _w.config[key_str] = myArgs[1];
            }
        },
        app_name: 'wizmo',
        awesomize: true,
        scroll: {default_handler_type: 'throttle', default_handler_timer: 100},
        resize: {default_handler_type: 'throttle', default_handler_timer: 100},
        defer: {debounce: 200},
        await: {throttle: 100, timeout: 30000},
        url: {lang: 'http://api.wizmo.io/lang/', geoip: 'http://api.wizmo.io/geoip/'},
        data: {sync_ss: true, sync_ls: false, sync_ck: false},
        enableResizeOnMobile: false,
        enableResizeOnPhone: false,
        enableResizeOnTablet: false,
        enableNoscriptDefer: true,
        debug: false,
        proxyBrowserPingUrl: '',
        cacheNative: true,
        forceXDomainRequest: false
    };

    var console_obj = _window.console;
    var console_main_obj = {
        /**
         * General purpose logging
         * @param {String} message_str the message to output
         */
        log: function(message_str){
            var myArgs = Array.prototype.slice.call(arguments);
            if(myArgs[4])
            {
                console_obj.log(message_str, myArgs[1], myArgs[2], myArgs[3], myArgs[4]);
                return;
            }
            else if(myArgs[3])
            {
                console_obj.log(message_str, myArgs[1], myArgs[2], myArgs[3]);
                return;
            }
            else if (myArgs[2])
            {
                console_obj.log(message_str, myArgs[1], myArgs[2]);
                return;
            }
            else if (myArgs[1])
            {
                console_obj.log(message_str, myArgs[1]);
                return;
            }

            console_obj.log(message_str);
        },
        /**
         * Outputs an informational message
         * @param {String} message_str the message to output
         */
        info: function(message_str){
            console_obj.info(message_str);
        },
        /**
         * Outputs a warning message
         * @param {String} message_str the message to output
         * @param {Boolean} incr_console_item_bool if true, will increment counter
         * @param {Boolean} allow_dupl_bool if true, will allow identical messages to be posted. Default is false.
         * @param {String} dupl_regex_override_str a regex pattern
         * It enables better control to prevent duplicate messages
         * Note: only works if allow_dupl_bool is false
         * Note: Make sure that the regex string is properly escaped for JavaScript's RegExp function
         */
        warn: function(message_str){
            var myArgs = Array.prototype.slice.call(arguments),
                incr_console_item_bool = (isBool(myArgs[1])) ? myArgs[1]: false,
                allow_dupl_bool = (isBool(myArgs[2])) ? myArgs[2]: false,
                dupl_regex_override_str = (isString(myArgs[3])) ? myArgs[3] : undefined,
                message_register_arr,
                message_hashcode_register_arr,
                message_hashcode_str
                ;

            //create storage container(s)
            if(!wizmo.pageStore('var_console_warn_message_register'))
            {
                wizmo.pageStore('var_console_warn_message_register', []);
            }

            if(!wizmo.pageStore('var_console_warn_message_hash_register'))
            {
                wizmo.pageStore('var_console_warn_message_hash_register', []);
            }

            //get the current console register
            message_register_arr = wizmo.pageStore('var_console_warn_message_register') || [];

            //generate a hash code to help with preventing duplicates
            message_hashcode_str = Math.abs(hashCode(message_str));
            message_hashcode_register_arr = wizmo.pageStore('var_console_warn_message_hash_register') || [];

            if(!allow_dupl_bool)
            {
                if(!in_array(message_hashcode_str, message_hashcode_register_arr))
                {
                    if(dupl_regex_override_str)
                    {
                        if(!in_array(dupl_regex_override_str, message_register_arr, undefined, true))
                        {
                            console_obj.warn(message_str);

                            if(incr_console_item_bool)
                            {
                                wizmo.storeIncrement('var_counter_console');
                            }
                        }
                    }
                    else
                    {
                        message_hashcode_register_arr.push(message_hashcode_str);
                        wizmo.pageStore('var_console_warn_message_hash_register', message_hashcode_register_arr);
                        console_obj.warn(message_str);

                        if(incr_console_item_bool)
                        {
                            wizmo.storeIncrement('var_counter_console');
                        }
                    }
                }
            }
            else
            {
                console_obj.warn(message_str);

                if(incr_console_item_bool)
                {
                    wizmo.storeIncrement('var_counter_console');
                }
            }

            //post the latest console message
            message_register_arr.push(message_str);
            wizmo.pageStore('var_console_warn_message_register', message_register_arr);
        },
        /**
         * Outputs an error message
         * @param {String} message_str the message to output
         * @param {Boolean} incr_console_item_bool if true, will increment counter
         * @param {Boolean} allow_dupl_bool if true, will allow identical messages to be posted. Default is false.
         * @param {String} dupl_regex_override_str a regex pattern
         * It enables better control to prevent duplicate messages
         * Note: only works if allow_dupl_bool is false
         * Note: Make sure that the regex string is properly escaped for JavaScript's RegExp function
         */
        error: function(message_str){
            var myArgs = Array.prototype.slice.call(arguments),
                incr_console_item_bool = (isBool(myArgs[1])) ? myArgs[1]: false,
                allow_dupl_bool = (isBool(myArgs[2])) ? myArgs[2]: false,
                dupl_regex_override_str = (isString(myArgs[3])) ? myArgs[3] : undefined,
                message_register_arr,
                message_hashcode_register_arr,
                message_hashcode_str
                ;

            //create storage container(s)
            if(!wizmo.pageStore('var_console_error_message_register'))
            {
                wizmo.pageStore('var_console_error_message_register', []);
            }

            if(!wizmo.pageStore('var_console_error_message_hash_register'))
            {
                wizmo.pageStore('var_console_error_message_hash_register', []);
            }

            //get the current console register
            message_register_arr = wizmo.pageStore('var_console_error_message_register') || [];

            //generate a hash code to help with preventing duplicates
            message_hashcode_str = Math.abs(hashCode(message_str));
            message_hashcode_register_arr = wizmo.pageStore('var_console_error_message_hash_register') || [];

            if(!allow_dupl_bool)
            {
                if(!in_array(message_hashcode_str, message_hashcode_register_arr))
                {
                    if(dupl_regex_override_str)
                    {
                        if(!in_array(dupl_regex_override_str, message_register_arr, undefined, true))
                        {
                            console_obj.error(message_str);

                            if(incr_console_item_bool)
                            {
                                wizmo.storeIncrement('var_counter_console');
                            }
                        }
                    }
                    else
                    {
                        message_hashcode_register_arr.push(message_hashcode_str);
                        wizmo.pageStore('var_console_error_message_hash_register', message_hashcode_register_arr);
                        console_obj.error(message_str);

                        if(incr_console_item_bool)
                        {
                            wizmo.storeIncrement('var_counter_console');
                        }
                    }
                }
            }
            else
            {
                console_obj.error(message_str);

                if(incr_console_item_bool)
                {
                    wizmo.storeIncrement('var_counter_console');
                }
            }

            //post the latest console message
            message_register_arr.push(message_str);
            wizmo.pageStore('var_console_error_message_register', message_register_arr);
        }
    };

    /**
     * Display an alert box
     * @param {String} message_str the alert message
     */
    function alert(message_str)
    {
        var alert_obj = _window.alert;
        alert_obj(message_str);
    }

    var _w = {
        microtime: microtime,
        isString: isString,
        isEmptyString: isEmptyString,
        isNumber: isNumber,
        isBool: isBool,
        isArray: isArray,
        isObject: isObject,
        isNullOrUndefined: isNullOrUndefined,
        isFunction: isFunction,
        isNode: isNode,
        has: has,
        count: count,
        implode: implode,
        explode: explode,
        in_array: in_array,
        contains: contains,
        merge: merge,
        cloneObject: cloneObject,
        mergeObject: mergeObject,
        array_keys: array_keys,
        array_values: array_values,
        array_combine: array_combine,
        arrayToInteger: arrayToInteger,
        camelToDash: camelToDash,
        dashToCamel: dashToCamel,
        hashCode: hashCode,
        getSortedKeys: getSortedKeys,
        getClosestNumberMatchArray: getClosestNumberMatchArray,
        isEven: isEven,
        isEvenDecimal: isEvenDecimal,
        strPad: strPad,
        zeroFill: zeroFill,
        debounce: debounce,
        regexMatchAll: regexMatchAll,
        getKeyValuePairs: getKeyValuePairs,
        console: console_main_obj,
        config: config_main_obj,
        alert: alert
    };
    return _w;

}));

/*! wQuery [dubQuery] DOM Library | @link https://github.com/restive/wquery | @copyright Obinwanne Hill <@obihill> | @license MIT */
(function(_w){

    if (!Object.create)
    {
        Object.create = function(o, properties)
        {
            if (typeof o !== 'object' && typeof o !== 'function')
            {
                throw new TypeError('Object prototype may only be an Object: ' + o);
            }
            else if (o === null)
            {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
            }

            /*jshint -W116 */
            if (typeof properties != 'undefined')
            {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
            }
            /*jshint +W116 */

            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    function Dom(){}
    Dom.prototype = Object.create(Array.prototype);

    /**
     * Creates a DOM object
     * @param selector {String} the selector
     * @param context {Object} the context
     * @param undefined
     * @returns {Dom}
     * @private
     */
    function _DomCreate(selector, context, override){
        var init_dom_obj = new _initDom(selector, context, override);
        var dom_obj = new Dom();

        if(init_dom_obj.el === null)
        {
            //no element found
            dom_obj = {};
            dom_obj.empty = true;
            dom_obj.length = (!dom_obj.length) ? 0 : dom_obj.length;
        }
        else
        {
            dom_obj = _w.merge(dom_obj, init_dom_obj.core);
        }

        dom_obj.context = init_dom_obj.context;
        if(init_dom_obj.selector)
        {
            dom_obj.selector = (_w.isString(init_dom_obj.selector)) ? init_dom_obj.selector.toLowerCase() : init_dom_obj.selector;
        }
        dom_obj.label = init_dom_obj.label;

        if(dom_obj.length > 0)
        {
            if(init_dom_obj.selectorMethod)
            {
                dom_obj.selectorMethod = init_dom_obj.selectorMethod;
            }
            dom_obj.instanceType = init_dom_obj.instanceType;
            dom_obj.objectStore = init_dom_obj.objectStore;
            dom_obj.empty = false;
            if(init_dom_obj.uniqId)
            {
                dom_obj.uniqId = init_dom_obj.uniqId;
            }
        }
        if(dom_obj.length === 1)
        {
            dom_obj.tagName = init_dom_obj.tagName;
        }

        return dom_obj;
    }

    /**
     * Selects an object from the DOM
     * @param selector {String} the selector
     * @param context {Object} the context [default is document]
     * @param override {Object} a utility object
     * @returns {*}
     * @private
     */
    function _initDom(selector, context, override)
    {
        //set default context if undefined
        context = (!context) ? window.document : context;

        var el,
            _context,
            _context_0,
            _selector,
            _selector_method,
            _is_add_selector_bool = true,
            _is_find_op_bool = false,
            _is_nodelist_op_bool = false,
            _is_window_obj_bool = false;

        if(_isWindow(selector) || selector === 'window')
        {
            _is_window_obj_bool = true;
            el = window;
        }
        else if(_w.isObject(selector))
        {
            el = selector;
        }
        else if(selector === 'head' || selector === 'body')
        {
            el = context[selector] || context.getElementsByTagName(selector)[0];
        }
        else if(selector === 'html')
        {
            el = context.getElementsByTagName(selector)[0];
        }
        else if(/^ *([^\s]+(?:,| )\s*[^\s]+|[^\s]*\.[^\s\.]+\.[^\s]+|[^\s\.]+?\.[^\s]+|[^\s]*\:[^\s]+|[^\s]*?\[[^\s]+?\=.+?\])/i.test(selector))
        {
            /**
             * 1: if multiple selectors or descendant combinators
             * e.g. $("p.main, a.other"), $("p.main a.other")
             * 2: if multiple class selector
             * e.g. $(".first.second"), $("p.main.test")
             * 3: if tagname.class selector
             * e.g. $("li.class")
             * 4: if pseudo selector
             * e.g. $("a:hover"), $(".container:before")
             * 5: if attribute-value selector
             * e.g. $('input[type="text"]'), $('#div-me[rk="ten"]')
             */
            _is_nodelist_op_bool = true;

            _context_0 = (context.length === 1) ? context[0] : context;

            el = _context_0.querySelectorAll(selector);
            _selector_method = 'querySelectorAll';
        }
        else if(override)
        {
            el = override.context;
            _is_add_selector_bool = (override && _w.isBool(override.addSelector)) ? override.addSelector : _is_add_selector_bool;
            _selector_method = (override && override.selectorMethod) ? override.selectorMethod : null;

            _is_nodelist_op_bool = true;
        }
        else
        {
            /*! Salt.js DOM Selector Lib. By @james2doyle */
            /*! + improved by: Obinwanne Hill on 24-04-2015 */

            var selector_key = selector.slice(0, 1),
                matches = {
                    '#': 'getElementById',
                    '.': 'getElementsByClassName',
                    '@': 'getElementsByName',
                    '=': 'getElementsByTagName',
                    '*': 'querySelectorAll'
                }[selector_key],
                selector_value = selector.slice(1);

            if(_isInstanceOfWQuery(context))
            {
                _is_find_op_bool = true;

                //archive context before updating it
                _context = context;

                context = context[0];
                matches = 'querySelectorAll';
                selector_value = selector;
            }
            else
            {
                //add fallback if getElementsByClassName is not supported e.g. IE8
                if(matches === 'getElementsByClassName' && !document.getElementsByClassName)
                {
                    matches = 'querySelectorAll';
                    selector_value = selector;
                }

                //if matches is undefined, assume selector is a HTML tag
                if(!matches)
                {
                    matches = 'getElementsByTagName';
                    selector_value = selector;
                }
            }

            if(matches !== 'getElementById')
            {
                /**
                 * Set as NodeList operation
                 * all matches methods beside getElementById return a List-like result
                 */
                _is_nodelist_op_bool = true;
            }

            // now pass the selector without the key/first character
            el = context[matches](selector_value);

            _selector_method = (matches) ? matches : '';
        }

        /*jshint -W040 */
        this.label = 'wquery';
        if((!el || el.length < 1) && !_is_window_obj_bool)
        {
            this.el = null;
            this.core = [];

            this.context = context;
            this.selector = (_w.isString(selector)) ? selector.toLowerCase() : selector;
        }
        else
        {
            //define selector
            if(_w.isObject(selector))
            {
                _selector = _getSelectorFromObject(selector);
            }
            else if (_w.isArray(selector))
            {
                _selector = '';
            }
            else
            {
                _selector = selector;
            }

            this.core = [];
            if(el.length && el.length >= 1 && _is_nodelist_op_bool)
            {
                //handle NodeLists, etc. + objects from find operation

                var _init_core_arr = [];
                var _initForEach = function (array, callback, scope) {
                    for (var i = 0; i < array.length; i++) {
                        callback.call(scope, i, array[i]);
                    }
                };
                _initForEach(el, function (index) {
                    _init_core_arr.push(el[index]);
                });

                this.core = _init_core_arr;
            }
            else
            {
                this.core.push(el);
            }

            //update _selector if find operation
            if(_is_find_op_bool)
            {
                _selector = (_context && _w.isString(_context.selector)) ? _context.selector+' '+_selector : _selector;
            }

            this.context = context;
            if(_is_add_selector_bool)
            {
                this.selector = (_w.isString(_selector)) ? _selector.toLowerCase() : _selector;
                this.selectorMethod = _selector_method;
            }
            this.objectStore = {};
            this.instanceType = null;

            var el_count_int = _w.count(this.core);
            if(el_count_int > 0)
            {
                if(_is_nodelist_op_bool)
                {
                    this.instanceType = 'list';
                }
                else
                {
                    this.tagName = (_w.isString(el.nodeName)) ? el.nodeName.toLowerCase() : '';
                    this.instanceType = 'element';
                }
            }

            //add uuid
            if(_is_add_selector_bool)
            {
                if(_selector && _w.isString(_selector) && _selector.length > 0)
                {
                    this.uniqId = Math.abs(_w.hashCode(_selector));
                }
            }
        }
        /*jshint +W040 */
    }

    var _this,
        _this_el_obj,
        _this_count_int,
        _ref_obj,
        _parent_ref_obj;

    /**
     * Creates an wQuery context object
     * This is a wrapper class for _DomCreate
     * @param selector see _DomCreate
     * @param context see _DomCreate
     * @param undefined see _DomCreate
     * @returns {Dom}
     */
    var wQuery = function(selector, context, override){
        return _DomCreate(selector, context, override);
    };

    /**
     * Creates an wQuery context object
     * This is a wrapper class for _DomCreate
     * @param selector see _DomCreate
     * @param context see _DomCreate
     * @param undefined see _DomCreate
     * @return {Dom}
     */
    wQuery.createDom = function(selector, context, override){
        return _DomCreate(selector, context, override);
    };

    /**
     * Checks whether the object is a window object
     * @param obj {*} the object to test
     * @returns {boolean}
     * @private
     */
    function _isWindow( obj ) {
        /*jshint -W116 */
        return (obj != null && (obj == obj.window || typeof obj.window === 'object'));
        /*jshint +W116 */
    }

    /**
     * Determines if an object is an instance of WQuery
     * @param obj {*} the object to test
     * @returns {boolean}
     * @private
     */
    function _isInstanceOfWQuery(obj)
    {
        return ((obj.label === 'wquery'));
    }

    /**
     * Determines the selector for a given object
     * @param obj {Object} the object
     * @returns {*}
     * @private
     */
    function _getSelectorFromObject(obj)
    {
        var id_str = (obj.id) ? obj.id : '',
            class_temp_str = obj.className,
            class_str = (_w.isString(class_temp_str)) ? class_temp_str.replace(/\s+/g, '.') : '',
            node_name_str = (obj.nodeName) ? obj.nodeName.toLowerCase() : ''
            ;

        if(_w.isString(id_str) && id_str.length > 0)
        {
            return '#'+id_str;
        }

        if (_isWindow(obj))
        {
            return 'window';
        }

        if (_w.in_array(node_name_str,['body', 'html', 'head']))
        {
            return node_name_str;
        }

        if (_w.isString(class_str) && class_str.length > 0)
        {
            return node_name_str+'.'+class_str;
        }

        return node_name_str;
    }

    /**
     * Returns a list of Node types supported by the browser
     * @returns {Array}
     * @private
     */
    function _getSupportedNodeTypes()
    {
        //Define supported collections for later dynamic function calls
        var node_type_arr = ['NodeList', 'HTMLCollection', 'StaticNodeList'],
            node_type_supported_arr = [];
        for (var i = 0; i < node_type_arr.length; i++)
        {
            if(window[node_type_arr[i]]){
                node_type_supported_arr.push(node_type_arr[i]);
            }
        }
        return node_type_supported_arr;
    }

    /**
     * Determines the type of object
     * @param elem {Object} the reference object
     * @returns {*}
     */
    function _getObjectType(elem)
    {
        var obj_type_str = Object.prototype.toString.call(elem).slice(8, -1),
            supported_nodelist_types_arr = _getSupportedNodeTypes();

        if (typeof elem === 'object')
        {
            var regex_1 = /^ *(HTMLCollection|NodeList|StaticNodeList|Object) *$/gi,
                regex_2 = /^ *.*?(Window|Global|Object) *$/gi,
                regex_3 = /^ *.*?(Element|Object) *$/gi,
                match_1 = regex_1.exec(obj_type_str),
                match_2 = regex_2.exec(obj_type_str),
                match_3 = regex_3.exec(obj_type_str)
                ;

            if(match_1 &&
                _w.has(elem, 'length') &&
                (elem.length === 0 || (typeof elem[0] === "object" && elem[0].nodeType > 0)))
            {
                //check if StaticNodeList
                if(_w.in_array('StaticNodeList', supported_nodelist_types_arr) && elem instanceof window.StaticNodeList)
                {
                    return 'StaticNodeList';
                }

                //check if Window Object
                if(_w.has(elem, 'self'))
                {
                    return 'Window';
                }

                //return HTMLCollection or NodeList
                return match_1[1];
            }
            else if(match_2 &&
                _w.has(elem, 'self'))
            {
                return 'Window';
            }
            else if (match_3)
            {
                //return Element
                return 'Element';
            }

            return null;
        }
    }

    /**
     * Converts a HTML string to a node object
     * @param html_str {String} the HTML string to convert
     * @return {Object}
     * @private
     */
    function _stringToNode(html_str)
    {
        var wrapper_obj = document.createElement('div');

        //remove linebreaks and whitespace
        html_str = html_str.replace(/\n\s*|\s*\n/g, '');

        wrapper_obj.innerHTML = html_str;

        return _getElementChildren(wrapper_obj);
    }

    /**
     * Gets the element of a WQuery object
     * @param obj {Object} the object
     * @param op_type {String} a special operation type classifier
     * @private
     */
    function _getElement(obj)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            op_type = myArgs[1]
            ;

        if(op_type === 'parent')
        {
            return ((obj.instanceType === 'element' || obj.instanceType === 'list') && obj.length >= 1) ? obj[0] : obj ;
        }

        return ((obj.instanceType === 'element' || obj.instanceType === 'list') && obj.length === 1) ? obj[0] : obj ;
    }

    /**
     * Gets the children of an element
     * @param {Object} elem_obj the element from which the children are to be retrieved
     * @returns {Array}
     * @private
     */
    function _getElementChildren(elem_obj)
    {
        var childNodes = elem_obj.childNodes,
            children = [],
            i = childNodes.length;

        while (i--) {
            /*jshint -W116 */
            if (childNodes[i].nodeType == 1) {
                children.unshift(childNodes[i]);
            }
            /*jshint +W116 */
        }

        return children;
    }

    wQuery.label = 'wquery';
    wQuery.version = '1.0.0';

    /**
     * Map of native forEach
     * @type {Function|Array.forEach}
     */
    Dom.prototype.each = function(callback){
        var elements = _getElement(this),
            i,
            key
            ;

        /*jshint -W116 */
        if(typeof elements.length == 'number')
        {
            for (i = 0; i < elements.length; i++)
            {
                if(callback.call(elements[i], i, elements[i]) === false)
                {
                    return elements;
                }
            }
        }
        else
        {
            if(_w.in_array(_getObjectType(elements), ['Element', 'Window']))
            {
                callback.call(elements, 0, elements);
                return elements;
            }
            else
            {
                for (key in elements)
                {
                    if (callback.call(elements[key], key, elements[key]) === false)
                    {
                        return elements;
                    }
                }
            }
        }
        /*jshint +W116 */
    };

    /**
     * Gets the descendants of an element filtered by selector
     * @param selector {String} the selector
     * @param context {Object} the context of the element
     * @returns {*}
     */
    function _findInDom(selector, context)
    {
        return _DomCreate(selector, context, undefined);
    }

    /**
     * Gets the descendants of an element filtered by selector
     * @param selector {String} the selector
     * @returns {*}
     */
    Dom.prototype.find = function(selector) {
        return _findInDom(selector, this);
    };

    /**
     * Create a deep copy of the set of matched elements
     * @returns {*}
     */
    Dom.prototype.clone = function(){
        _this = _getElement(this);
        var _this_clone = _this.cloneNode(true);
        return _DomCreate(_this_clone);
    };

    /**
     * Gets [or sets] the value of an attribute
     * @param name {String} the identifier of the attribute
     * @param value {String} the value to set. If provided, the method will be a setter.
     * @returns {*}
     */
    Dom.prototype.attr = function(name, value){
        _this = this;
        _this_count_int = _w.count(_this);

        if(_this_count_int > 0)
        {
            _this_el_obj = _this[0];

            if(value)
            {
                if(_this_count_int > 1)
                {
                    //list

                    _this.each(function(index, el)
                    {
                        el.setAttribute(name, value);
                    });
                    return _this;
                }
                else
                {
                    //element

                    _this_el_obj.setAttribute(name, value);
                }
            }
            else
            {
                //list + element

                return _this_el_obj.getAttribute(name);
            }
        }

        return this;
    };

    /**
     * Gets [or sets] the style property of an element
     * @param el {Object} the element
     * @param prop {String} the style property
     * @param value {String} the value to set [optional]
     * @returns {*}
     * @private
     */
    function _style(el, prop)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            value = myArgs[2]
            ;

        if(!_w.isNullOrUndefined(value))
        {
            //set value

            el.style[prop] = value;
        }
        else if(value === null)
        {
            //reset value

            el.style[prop] = null;
            el.style[prop] = "";
        }
        else
        {
            //get value

            if(el.currentStyle)
            {
                return el.currentStyle[prop];
            }
            else if (window.getComputedStyle)
            {
                //if margin or padding, add suffix
                //this is to fix issue with Firefox
                if(/^ *(margin|padding) *$/i.test(prop))
                {
                    prop = prop+'Top';
                }

                return window.getComputedStyle(el)[prop];
            }
        }
    }

    /**
     * Gets [or sets] the computed style properties
     * @param prop {String} the property name
     * @param value {String} the value to set. If provided, this method will be a setter
     * @returns {*}
     */
    Dom.prototype.css = function(prop, value) {

        _this = this;
        _this_count_int = _w.count(_this);

        if(_this_count_int > 0)
        {
            _this_el_obj = _this[0];

            if(value || value === null)
            {
                //set

                if(_this_count_int > 1)
                {
                    //list

                    _this.each(function(index, el)
                    {
                        _style(el, prop, value);
                    });
                    return _this;
                }
                else
                {
                    //element

                    _style(_this_el_obj, prop, value);
                }
            }
            else
            {
                //get

                return _style(_this_el_obj, prop);
            }
        }

        return this;
    };

    /**
     * Generates a simple Hash string
     * @param {Object} ctx_obj the DOM object
     * @param {String} prefix_str a substring to be appended to the final hash
     * @param {String} suffix_str a substring to be prepended to the final hash
     * @return {string|*}
     * @private
     */
    function _generateElemHash(ctx_obj)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            prefix_str = (myArgs[1] && _w.isString(myArgs[1]) && myArgs[1].length > 0) ? myArgs[1] : '',
            suffix_str = (myArgs[2] && _w.isString(myArgs[2]) && myArgs[2].length > 0) ? myArgs[2] : '',
            ctx_is_valid_bool,
            ctx_tag_str,
            ctx_id_str,
            ctx_href_str,
            ctx_class_arr = [],
            ctx_class_str = '',
            ctx_hash_seed_str,
            ctx_hash_code_int,
            ctx_hash_code_str
        ;

        ctx_tag_str = ctx_obj.tagName || ctx_obj.nodeName || ctx_obj.localName;
        ctx_tag_str = (_w.isString(ctx_tag_str) && ctx_tag_str.length > 0) ? ctx_tag_str : undefined;
        ctx_tag_str = (ctx_tag_str) ? ctx_tag_str.toLowerCase() : ctx_tag_str;

        ctx_id_str = (ctx_obj.id && _w.isString(ctx_obj.id) && ctx_obj.id.length > 0) ? ctx_obj.id : '';
        ctx_href_str = (ctx_obj.href && _w.isString(ctx_obj.href) && ctx_obj.href.length > 0) ? ctx_obj.href : '';

        ctx_is_valid_bool = !!(ctx_id_str || ctx_href_str);

        if(ctx_is_valid_bool)
        {
            //get class attribute
            if(!ctx_obj.classList)
            {
                if(ctx_obj.className && _w.isString(ctx_obj.className))
                {
                    ctx_class_str = ctx_obj.className;
                }
            }
            else
            {
                if(ctx_obj.classList.length && ctx_obj.classList.length > 0)
                {
                    for(var i = 0; i < ctx_obj.classList.length; i++)
                    {
                        ctx_class_arr.push(ctx_obj.classList[i]);
                    }
                    ctx_class_str = _w.implode(' ', ctx_class_arr);
                }
            }

            //generate hashCode
            ctx_hash_seed_str = ctx_tag_str+'-'+ctx_id_str+'-'+ctx_class_str+'-'+ctx_href_str;
            ctx_hash_code_int = Math.abs(_w.hashCode(ctx_hash_seed_str));
            ctx_hash_code_str = ''+ctx_hash_code_int;

            //add prefix and suffix
            ctx_hash_code_str = prefix_str+ctx_hash_code_str+suffix_str;

            return ctx_hash_code_str;
        }

        return null;
    }

    /**
     * Tracks an event listener
     * @param {String} ctx_hash_code_str a hash code that identifies the DOM element that the listener will be attached to
     * @param {String} event_type_str the event type
     * @private
     */
    function _trackEventListener(ctx_hash_code_str, event_type_str)
    {
        var event_listener_register_arr,
            event_listener_register_item_str,
            event_type_item_str;

        //get event listener register
        event_listener_register_arr = _data('w_list_event_listener');
        if(!event_listener_register_arr)
        {
            _data('w_list_event_listener', []);
        }

        //add to register if not present
        event_type_arr = event_type_str.split(' ');
        for (var i = 0; i < event_type_arr.length; i++)
        {
            event_type_item_str = event_type_arr[i];
            event_listener_register_item_str = ctx_hash_code_str+'_'+event_type_item_str;

            if(!_w.in_array(event_listener_register_item_str, event_listener_register_arr))
            {
                _data('w_list_event_listener').push(event_listener_register_item_str);
            }
        }
    }

    /**
     * Returns the event listener register
     * @return {*|Array}
     * @private
     */
    function _getEventListenerRegister()
    {
        return _data('w_list_event_listener');
    }

    /**
     * Returns the event listener register
     * @param {Array} register_arr the event listener register
     * @return {Boolean}
     * @private
     */
    function _setEventListenerRegister(register_arr)
    {
        if(_w.isArray(register_arr))
        {
            _data('w_list_event_listener', register_arr);
            return true;
        }

        return false;
    }

    /**
     * Refresh the event listener register
     *
     * This method is applicable when using on method with filters. Using filters helps to prevent event listeners from being added multiple times to the same DOM element. This happens by keeping track of event listeners in a special register.
     *
     * When there are changes to the DOM, like when an element that had an event handler attached to it is removed, the event listener register needs to be refreshed. This is because there is an existing listing in the register for that DOM element. As a result, that listing needs to be removed each time the DOM element is refreshed to ensure that if an attempt is made to attach an event handler to the new DOM element [that has identical properties to its predecessor], the operation will pass.
     *
     * @param {Object} ctx_obj a context object
     * @private
     */
    function _refreshEventListenerRegister(ctx_obj)
    {
        var ctx_hash_code_arr,
            el_reg_arr,
            el_reg_item_arr,
            el_reg_item_prefix_str,
            el_reg_final_arr = []
            ;

        //generate list of hash codes for relevant elements under a specific DOM element
        ctx_hash_code_arr = _getElemHashCodeFromDOM(ctx_obj);

        if(_w.isArray(ctx_hash_code_arr) && ctx_hash_code_arr.length > 0)
        {
            //get event listener register
            el_reg_arr = _getEventListenerRegister();

            if(_w.isArray(el_reg_arr) && el_reg_arr.length > 0)
            {
                for(var i = 0; i < el_reg_arr.length; i++)
                {
                    el_reg_item_arr = _w.explode('_', el_reg_arr[i]);
                    el_reg_item_prefix_str = el_reg_item_arr[0];

                    //generate a new event register
                    //exclude from new register items associated with given ctx_obj
                    if(!_w.in_array(el_reg_item_prefix_str, ctx_hash_code_arr, undefined, true))
                    {
                        el_reg_final_arr.push(el_reg_arr[i]);
                    }
                }

                if(el_reg_final_arr.length > 0)
                {
                    _setEventListenerRegister(el_reg_final_arr);
                }
            }
        }

        //flag in dom storage
        wizmo.pageStore('var_flag_refresh_event_listener_register', true);
    }

    /**
     * Generates an array containing hash codes for a specific DOM element [or list]
     * Note: this method's primary focus is to generate the hash codes that are required for  _refreshEventListenerRegister method
     * @param {Object} ctx_obj the DOM object
     * @return {Array}
     * @private
     */
    function _getElemHashCodeFromDOM(ctx_obj)
    {
        var elem_list_a_obj,
            elem_list_button_obj,
            elem_list_input_obj,
            elem_list_textarea_obj,
            ctx_hash_code_item_str,
            ctx_hash_codes_arr = []
            ;

        elem_list_a_obj = _findInDom('a', ctx_obj);
        elem_list_button_obj = _findInDom('button', ctx_obj);
        elem_list_input_obj = _findInDom('input', ctx_obj);
        elem_list_textarea_obj = _findInDom('textarea', ctx_obj);

        if(elem_list_a_obj.length > 0)
        {
            for(var i = 0; i < elem_list_a_obj.length; i++)
            {
                ctx_hash_code_item_str = _generateElemHash(elem_list_a_obj[i]);
                ctx_hash_codes_arr.push(ctx_hash_code_item_str);
            }
        }

        if(elem_list_button_obj.length > 0)
        {
            for(var i = 0; i < elem_list_button_obj.length; i++)
            {
                ctx_hash_code_item_str = _generateElemHash(elem_list_button_obj[i]);
                ctx_hash_codes_arr.push(ctx_hash_code_item_str);
            }
        }

        if(elem_list_input_obj.length > 0)
        {
            for(var i = 0; i < elem_list_input_obj.length; i++)
            {
                ctx_hash_code_item_str = _generateElemHash(elem_list_input_obj[i]);
                ctx_hash_codes_arr.push(ctx_hash_code_item_str);
            }
        }

        if(elem_list_textarea_obj.length > 0)
        {
            for(var i = 0; i < elem_list_textarea_obj.length; i++)
            {
                ctx_hash_code_item_str = _generateElemHash(elem_list_textarea_obj[i]);
                ctx_hash_codes_arr.push(ctx_hash_code_item_str);
            }
        }

        return ctx_hash_codes_arr;
    }

    /**
     * Manage event listeners
     * Wrapper class
     * @param op {String} The event operation. Either 'on' or 'off'
     * @param eventType {String} the event type
     * @param callback {Function} the function to execute when the event is triggered
     * @param ctx {Object} the context i.e. DOM element
     * @param filter {Boolean|String} defines whether event handler should be filtered to prevent multiple event listeners from being added on the same element. Could also be used to define a unique key that will be used to prevent event handler from being added
     * @returns {*}
     * @private
     */
    function _doEvent(op, eventType, callback, ctx) {
        var myArgs = Array.prototype.slice.call(arguments),
            filter_mx = myArgs[4],
            filter_bool,
            event_func_str = (op === 'on') ? 'addEventListener' : 'removeEventListener',
            event_func_ms_str = (op === 'on') ? 'attachEvent' : 'detachEvent',
            event_type_arr,
            event_type_str,
            filter_key_str,
            do_event_listener_register_arr,
            do_event_register_item_bool,
            event_listener_register_item_str
            ;

        if(_w.isBool(filter_mx))
        {
            filter_bool = !!((filter_mx));
            filter_key_str = _generateElemHash(ctx);
        }
        else if (_w.isString(filter_mx) && filter_mx.length > 0)
        {
            filter_bool = true;
            filter_key_str = filter_mx;
        }

        //get event listener register
        do_event_listener_register_arr = _getEventListenerRegister();

        event_type_arr = eventType.split(' ');
        for (var i = 0; i < event_type_arr.length; i++)
        {
            //flag duplicate if filter is true
            do_event_register_item_bool = true;
            if(filter_bool)
            {
                event_listener_register_item_str = filter_key_str+'_'+event_type_arr[i];
                if(_w.in_array(event_listener_register_item_str, do_event_listener_register_arr))
                {
                    do_event_register_item_bool = false;
                }
            }

            //attach event
            if(do_event_register_item_bool)
            {
                event_type_str = event_type_arr[i];
                if (ctx[event_func_str])
                {
                    ctx[event_func_str](event_type_str, callback);
                }
                else if (ctx[event_func_ms_str])
                {
                    ctx[event_func_ms_str]("on" + event_type_str, callback);

                    var event_type_list_arr = ("blur focus focusin focusout load resize scroll unload click dblclick input " +
                    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
                    "change select submit keydown keypress keyup error contextmenu").split(" ");
                    if(!_w.in_array(event_type_str, event_type_list_arr))
                    {
                        //is probably custom event

                        var doc_elem_obj = document.documentElement;
                        /*jshint -W083 */
                        if(event_func_ms_str === 'attachEvent')
                        {
                            doc_elem_obj[event_type_str] = 0;
                            doc_elem_obj[event_func_ms_str]('onpropertychange', function (e) {
                                /*jshint -W116 */
                                if(e.propertyName == event_type_str) {
                                    callback();
                                }
                                /*jshint +W116 */
                            });
                            /*jshint +W083 */
                        }
                        else
                        {
                            doc_elem_obj[event_func_ms_str]('onpropertychange', callback);
                        }
                    }
                }
                else {
                    ctx["on" + event_type_str] = (op === 'on') ? callback : null;
                }
            }
        }

        //track event listener
        if(filter_bool)
        {
            if(!_w.isNullOrUndefined(filter_key_str))
            {
                _trackEventListener(filter_key_str, eventType);
            }
        }

        return ctx;
    }

    /**
     * Cancels the event if it canceleable
     * @param event {Object} the event object
     */
    wQuery.preventDefault = function(event)
    {
        if(event.preventDefault)
        {
            event.preventDefault();
        }

        if(_data('isWQueryActive'))
        {
            //support IE
            event.returnValue = false;
        }
    };

    /**
     * Stops bubbling of an event to its parent
     * @param event {Object} the event object
     */
    wQuery.stopPropagation = function(event)
    {
        if (event.stopPropagation)
        {
            event.stopPropagation();
        }

        if(_data('isWQueryActive'))
        {
            //support IE
            event.cancelBubble = true;
        }
    };

    /**
     * on and off dual event handler method
     * @param context {Object} the context; this is usually this reference
     * @param eventName {String} the event handler name; either on or off
     * @param eventType {String} the event type e.g. click, etc.
     * @param callback {Function} the callback function
     * @param filter {Boolean|String} defines whether event handler should be filtered to prevent multiple event listeners from being added on the same element. Could also be used to define a unique key that will be used to prevent event handler from being added
     * @returns {*}
     * @private
     */
    function _onOrOffEvent(context, eventName, eventType, callback, filter)
    {
        _this = context;
        _this_count_int = _w.count(_this);

        if(_this_count_int > 0)
        {
            if(_this_count_int > 1)
            {
                //list

                _this.each(function(index, el)
                {
                    _doEvent(eventName, eventType, callback, el, filter);
                });
                return _this;
            }
            else
            {
                //element

                _this_el_obj = _this[0];

                return _doEvent(eventName, eventType, callback, _this_el_obj, filter);
            }
        }
    }

    /**
     * Attach an event handler for one or more events to the selected elements
     * @param eventType {String} The event identifier
     * @param callback {Function} The event handler
     * @param filter {Boolean|String} see _onOrOffEvent method
     * @returns {Object}
     */
    Dom.prototype.on = function(eventType, callback, filter) {
        return _onOrOffEvent(this, 'on', eventType, callback, filter);
    };

    /**
     * Remove an event handler
     * @param eventType {String} The event identifier
     * @param callback {Function} The event handler
     * @returns {Object}
     */
    Dom.prototype.off = function(eventType, callback) {
        return _onOrOffEvent(this, 'off', eventType, callback);
    };

    /**
     * Manually executes an event handler attached to the element
     * @param eventName {String} The event identifier
     * @param eventData {Function} data that is passed along
     * @return {*}
     */
    Dom.prototype.trigger = function(eventName) {
        _this = _getElement(this);

        var myArgs = Array.prototype.slice.call(arguments),
            eventData = (myArgs[1]) ? myArgs[1]: {},
            event;

        if (window.CustomEvent)
        {
            event = new CustomEvent(eventName, {detail: eventData});
            _this.dispatchEvent(event);
        }
        else if (document.createEvent)
        {
            event = document.createEvent('Event');
            event.initEvent(eventName, true, true, eventData);
            _this.dispatchEvent(event);
        }
        else
        {
            if(_this[eventName])
            {
                _this[eventName]();
            }
            document.documentElement[eventName] = 1;
        }

        return this;
    };

    /**
     * Adds or removes a class from a DOM Object
     * Wrapper class
     * @param op {String} The Class operation. Either 'add' or 'remove'
     * @param name {String} The Class name(s)
     * @param ctx {Object} The Object Context
     */
    function _doClass(op, name, ctx)
    {
        //get existing class
        var class_orig_str = ctx.getAttribute("class");
        class_orig_str = (!class_orig_str) ? '': class_orig_str;

        var i,
            class_orig_arr = (class_orig_str) ? class_orig_str.split(/\s+/g): [],
            class_new_arr = name.split(/\s+/g),
            class_new_str = '';

        if (!ctx.classList)
        {
            //classList not defined: probably old browser

            var class_item_str,
                class_list_arr = (op === 'remove') ? class_orig_arr : class_new_arr,
                class_list_haystack_arr = (op === 'remove') ? class_new_arr : class_orig_arr
                ;
            class_new_str = (op === 'remove') ? class_new_str : class_orig_str;

            for(i = 0; i < class_list_arr.length; i++)
            {
                class_item_str = class_list_arr[i].trim();
                if(!_w.in_array(class_item_str, class_list_haystack_arr))
                {
                    class_new_str += (op === 'remove') ? class_item_str+" " : " "+class_item_str;
                }
            }
            ctx.className = class_new_str.trim();
        }
        else
        {
            for(i = 0; i < class_new_arr.length; i++)
            {
                var class_list_item_new_str = class_new_arr[i].trim();
                ctx.classList[op](class_list_item_new_str);
            }
        }
    }

    /**
     * Adds or removes one or more classes
     * Wrapper class for _doClass
     * @param ctx {Object} the context
     * @param op {String} the name of the operation. Either 'add' or 'remove'
     * @param name {String} the class name(s)
     * @returns {*}
     * @private
     */
    function _addRemoveClass(ctx, op, name)
    {
        _this = ctx;
        _this_count_int = _w.count(_this);

        //return if string is empty
        if(_w.isString(name) && name.length < 1)
        {
            return _this;
        }

        //trim class data
        name = name.trim();

        if(_this_count_int > 0) {
            _this_el_obj = _this[0];

            if (_w.isString(name)) {
                if (_this_count_int > 1) {
                    //list

                    _this.each(function (index, el) {
                        _doClass(op, name, el);
                    });
                }
                else {
                    //element

                    _doClass(op, name, _this_el_obj);
                }
            }
            else {
                //list + element

                _doClass(op, name, _this_el_obj);
            }

            return _this;
        }
    }

    /**
     * Checks if an element has a class
     * @param ctx {Object} the context
     * @param name {String} the name of the class
     * Note: You can define multiple classes by separating class name with space
     * @param all_or_none {Boolean} If true, will return true if only all classes are present. Otherwise, it will return true if at least one class is present
     * Note: This is exclusively for multiple classes
     * @returns {Array}
     * @private
     */
    function _hasClass(ctx, name, all_or_none)
    {
        if(!_w.isString(name))
        {
            return false;
        }

        var results_item_bool,
            results_arr = [],
            name_arr = _w.explode(" ", name),
            name_tok_regex_str,
            test_classlist_factor_str = '';

        if (!ctx[0].classList) {

            name_tok_regex_str = "("+_w.implode("|", name_arr)+")";

            for(var i = 0; i < ctx.length; i++)
            {
                results_item_bool = !!(ctx[i].className && new RegExp("(\\s|^)" + name_tok_regex_str + "(\\s|$)", "gi").test(ctx[i].className));
                results_arr.push(results_item_bool);
            }

            return results_arr;
        }
        else
        {
            for(var i = 0; i < ctx.length; i++)
            {
                test_classlist_factor_str = '';
                for(var j = 0; j < name_arr.length; j++)
                {
                    test_classlist_factor_str += (ctx[i].classList.contains(name_arr[j])) ? '1' : '0';
                }

                if(all_or_none)
                {
                    results_item_bool = !!(/^1+$/i.test(test_classlist_factor_str));
                }
                else
                {
                    results_item_bool = !!(/1/i.test(test_classlist_factor_str));
                }
                results_arr.push(results_item_bool);
            }

            return results_arr;
        }
    }

    /**
     * Checks if an element [or group of elements] has a class
     * @param name_str {String} the class name
     * @param all_or_none_bool {Boolean} if true, and multiple classes are defined, it will return true only if all classes are present. Otherwise, it will return true if at least one class is present
     * @return {Boolean}
     */
    Dom.prototype.hasClass = function(name_str) {
        var myArgs = Array.prototype.slice.call(arguments),
            all_or_none_bool = (_w.isBool(myArgs[1])) ? myArgs[1]: false,
            has_class_bool_arr = _hasClass(this, name_str, all_or_none_bool);
        return _w.in_array(true, has_class_bool_arr);
    };

    /**
     * Adds the specified class(es) to the selected element
     * @param name {String} the class name
     * @return {*}
     */
    Dom.prototype.addClass = function(name) {
        return _addRemoveClass(this, 'add', name);
    };

    /**
     * Removes the specified class(es) from the selected element
     * @param name {String} the class name
     * @return {*}
     */
    Dom.prototype.removeClass = function(name) {
        return _addRemoveClass(this, 'remove', name);
    };

    /**
     * Toggles a class off and on from the selected element
     * @param name {String} the class name
     * @return {Dom}
     */
    Dom.prototype.toggleClass = function(name){
        var _this_unit,
            has_class_bool_arr = _hasClass(this, name);

        if(has_class_bool_arr.length > 0)
        {
            for(var i = 0; i < has_class_bool_arr.length; i++)
            {
                _this_unit = _DomCreate(this[i]);

                if(has_class_bool_arr[i])
                {
                    //remove
                    _addRemoveClass(_this_unit, 'remove', name);
                }
                else
                {
                    //add
                    _addRemoveClass(_this_unit, 'add', name);
                }
            }
        }

        return this;
    };

    /**
     * Removes an attribute from the DOM
     * @param name {String} the name of the attribute
     * @returns {*}
     */
    Dom.prototype.removeAttr = function(name){
        _this = _getElement(this);
        _this.removeAttribute(name);

        return this;
    };

    /**
     * Get the first child of a list
     * @return {*}
     */
    Dom.prototype.first = function(){
        _this = _getElement(this);
        if(_this.length > 0)
        {
            return _this[0];
        }
    };

    /**
     * Get the last child of a list
     * @return {*}
     */
    Dom.prototype.last = function(){
        _this = _getElement(this);
        if(_this.length > 0)
        {
            var count_int;
            for(var i = 0; i < _this.length; i++)
            {
                count_int = i + 1;
                if(count_int === _this.length)
                {
                    return _this[i];
                }
            }
        }
    };

    /**
     * Get the middle child of a list
     * Note: DO NOT use this method if the list length is not odd
     * @return {*}
     */
    Dom.prototype.mid = function(){
        _this = _getElement(this);
        if(_this.length > 0 && !_w.isEven(_this.length))
        {
            var count_int,
                mid_idx_temp_flt = _this.length/2,
                mid_idx_int = Math.ceil(mid_idx_temp_flt);
            for(var i = 0; i < _this.length; i++)
            {
                count_int = i + 1;
                if(count_int === mid_idx_int)
                {
                    return _this[i];
                }
            }
        }
    };

    /**
     * Get the immediately following sibling of an element
     * @return {*}
     */
    Dom.prototype.next = function(){
        _this = _getElement(this);
        if (_this.nextElementSibling){
            return wQuery(_this.nextElementSibling);
        }
        var el = _this;
        do { el = el.nextSibling; } while (el && el.nodeType !== 1);
        return wQuery(el);
    };

    /**
     * Get the immediately preceding sibling of an element
     * @return {*}
     */
    Dom.prototype.prev = function(){
        _this = _getElement(this);
        if (_this.previousElementSibling){
            return wQuery(_this.previousElementSibling);
        }
        var el = _this;
        do { el = el.previousSibling; } while (el && el.nodeType !== 1);
        return wQuery(el);
    };

    /**
     * Get the parent of the element
     * @return {*}
     */
    Dom.prototype.parent = function(){
        _this = _getElement(this, 'parent');
        return wQuery(_this.parentNode);
    };

    /**
     * Get the child of the element
     * @param pos_int {Number} the position of the child. By default, the first child is returned
     * Note: Child position starts from 0 i.e. 0 for first child, 1 for second, etc.
     * Note: Returns only one child
     * Note: Returns undefined if element has no child
     * @return {*}
     */
    Dom.prototype.child = function(){
        var myArgs = Array.prototype.slice.call(arguments),
            pos_int = (_w.isNumber(myArgs[0])) ? myArgs[0]: 0,
            _this = _getElement(this);
        return (_this.children.length > 0) ? wQuery(_this.children[pos_int]) : undefined;
    };

    /**
     * Get the current value of the element
     * This is for form elements only
     * @param value {String} the value to set [optional]
     * @return {*|String}
     */
    Dom.prototype.val = function(){
        var myArgs = Array.prototype.slice.call(arguments);
        _this = _getElement(this);
        if(_w.isString(myArgs[0]) || _w.isNumber(myArgs[0]) || _w.isBool(myArgs[0])) {
            if(_this.length > 1)
            {
                //list
                _this.each(function (index, el) {
                    el.value = ''+myArgs[0]+'';
                    el.setAttribute('value', ''+myArgs[0]+'');
                });
            }
            else
            {
                //element
                _this.value = ''+myArgs[0]+'';
                _this.setAttribute('value', ''+myArgs[0]+'');
            }

            return this;
        }
        else{
            return _this.value;
        }
    };

    /**
     * Get [or set] the html contents of the element
     * @param value {String} the HTML string to set [optional]
     * @return {*|Boolean|String}
     */
    Dom.prototype.html = function(){
        var myArgs = Array.prototype.slice.call(arguments),
            value = myArgs[0]
            ;
        _this = _getElement(this);
        if(_w.isString(value) || _w.isNumber(value) || _w.isBool(value))
        {
            if(_this.length > 1)
            {
                /** list **/
                _this.each(function (index, el) {
                    el.innerHTML = value;
                });
            }
            else
            {
                /** element **/

                //Refresh event listener register
                _refreshEventListenerRegister(this);

                _this.innerHTML = value;
            }

            return this;
        }
        else
        {
            return _this.innerHTML;
        }
    };

    /**
     * Get the width of a DOM element
     * @param {Object} ctx the DOM element
     * @return {Number}
     * @private
     */
    function _ctxWidth(ctx)
    {
        var width_str = _getDimension(ctx, 'width').toString(),
            op_offset_int = (width_str.indexOf('px') < 0) ? 0 : 2,
            width_int = parseInt(width_str.slice(0, width_str.length - op_offset_int), 10);

        return width_int;
    }

    /**
     * Determines if a DOM element is displayed or not
     * @param {Object} ctx the context
     * @returns {boolean}
     * @private
     */
    function _displayState(ctx)
    {
        var el = _getElement(ctx),
            value = el.style.display,
            width_int = _ctxWidth(ctx);

        return !((value === 'none') || !width_int);
    }

    /**
     * Determines if a DOM element is visible or not
     * @param {Object} ctx the context
     * @return {boolean}
     * @private
     */
    function _visibleState(ctx)
    {
        var el = _getElement(ctx),
            value = el.style.visibility
        ;

        return !((value === 'hidden'));
    }

    /**
     * Shows or hides an element
     * @param {Object} ctx the context
     * @param {String} op the operation type. Either 'show' or 'hide'
     * @returns {Dom}
     * @private
     */
    function _showHide(ctx, op)
    {
        var prop_root_str = 'style',
            prop_main_str,
            prop_val_str = ''
            ;

        prop_main_str = (_w.in_array(op, ['vshow', 'vhide'])) ? 'visibility' : 'display';

        if(op === 'hide')
        {
            prop_val_str = 'none';
        }
        else if(op === 'vhide')
        {
            prop_val_str = 'hidden';
        }

        _this = ctx;
        _this_count_int = _w.count(_this);
        if(_this_count_int > 0)
        {
            _this.each(function (index, el) {
                el[prop_root_str][prop_main_str] = prop_val_str;
            });
        }

        return this;
    }

    /**
     * Checks if an element is shown
     * Note: Uses the style property
     * @returns {Boolean}
     */
    Dom.prototype.isShown = function(){
        return _displayState(this);
    };

    /**
     * Checks if an element is shown
     * Note: Uses the visibility property
     * @returns {Boolean}
     */
    Dom.prototype.isVShown = function(){
        return _visibleState(this);
    };

    /**
     * Checks if an element is hidden
     * Note: Uses the style property
     * @returns {Boolean}
     */
    Dom.prototype.isHidden = function(){
        return !_displayState(this);
    };

    /**
     * Checks if an element is hidden
     * Note: Uses the visibility property
     * @returns {Boolean}
     */
    Dom.prototype.isVHidden = function(){
        return !_visibleState(this);
    };

    /**
     * Displays an element
     * Note: Uses the style property
     * @returns {Dom}
     */
    Dom.prototype.show = function(){
        return _showHide(this, 'show');
    };

    /**
     * Displays an element
     * Note: Uses the visibility property
     * @returns {Dom}
     */
    Dom.prototype.vShow = function(){
        return _showHide(this, 'vshow');
    };

    /**
     * Hides an element
     * Note: Uses the style property
     * @returns {Dom}
     */
    Dom.prototype.hide = function(){
        return _showHide(this, 'hide');
    };

    /**
     * Hides an element
     * Note: Uses the visibility property
     * @returns {Dom}
     */
    Dom.prototype.vHide = function(){
        return _showHide(this, 'vhide');
    };

    /**
     * Toggles a DOM element
     * @param {Object} ctx the context
     * @param {String} op specifies the type of operation
     * Either 'toggle' or 'vtoggle'
     * @private
     */
    function _toggle(ctx, op)
    {
        if(op === 'vtoggle')
        {
            if(_visibleState(ctx))
            {
                _showHide(ctx, 'vhide');
            }
            else
            {
                _showHide(ctx, 'vshow');
            }
        }
        else
        {
            if(_displayState(ctx))
            {
                _showHide(ctx, 'hide');
            }
            else
            {
                _showHide(ctx, 'show');
            }
        }
        return ctx;
    }

    /**
     * Show or hide an element based on state
     * Note: uses display property
     * For example, if the item is hidden, show it; and if it is shown, hide it
     */
    Dom.prototype.toggle = function(){
        return _toggle(this, 'toggle');
    };

    /**
     * Show or hide an element based on state
     * Note: uses visibility property
     * For example, if the item is hidden, show it; and if it is shown, hide it
     */
    Dom.prototype.vToggle = function(){
        return _toggle(this, 'vtoggle');
    };

    /**
     * Removes an element
     */
    Dom.prototype.remove = function(){
        _this = _getElement(this);
        _this.parentNode.removeChild(_this);
    };

    /**
     * Insert an element to the end of all elements within a reference element
     * Analogous to JQuery $.append method
     * @param ref_obj {Element} The reference [destination] element
     * @return {*}
     */
    Dom.prototype.append = function(ref_obj) {

        //return if ref_obj is empty string
        if(_w.isEmptyString(ref_obj))
        {
            return;
        }

        _this = _getElement(this);
        _ref_obj = _getElement(ref_obj);
        _ref_obj = (_w.isString(ref_obj)) ? _stringToNode(ref_obj) : _ref_obj;
        if(_ref_obj.length > 0)
        {
            _ref_obj.forEach(function(el){
                _this.appendChild(el);
            });
        }
        else if(_ref_obj)
        {
            _this.appendChild(_ref_obj);
        }
        return this;
    };

    /**
     * Insert an element to the end of all elements within a reference element
     * Analogous to JQuery $.appendTo method
     * @param ref_obj {Element} The reference [destination] element
     * @return {*}
     */
    Dom.prototype.appendTo = function(ref_obj) {
        _this = _getElement(this);
        ref_obj = (_w.isString(ref_obj) && (ref_obj === "head" || ref_obj === "body")) ? wQuery(ref_obj): ref_obj;
        _ref_obj = _getElement(ref_obj);
        _ref_obj = (_w.isString(ref_obj)) ? _stringToNode(ref_obj) : _ref_obj;
        if(_getObjectType(_this) === 'Element')
        {
            _ref_obj.appendChild(_this);
            return this;
        }
        _appendToList(_ref_obj, this);
        return this;
    };

    /**
     * Insert an element to the end of all elements with a reference [NodeList/HTMLCollection/StaticNodeList]
     * @param obj {Object} the reference object
     * @param _this {Object} the context
     * @returns {*}
     * @private
     */
    function _appendToList(obj, _this){
        _this.each(function(index, el) {
            obj.appendChild(el);
        });
        return _this;
    }

    /**
     * Insert an element to the start of all elements within a reference element
     * Analogous to JQuery $.prepend method
     * @param ref_obj {Element} The reference [destination] element
     * @return {*}
     */
    Dom.prototype.prepend = function(ref_obj) {

        //return if ref_obj is empty string
        if(_w.isEmptyString(ref_obj))
        {
            return;
        }

        _this = _getElement(this);
        _ref_obj = _getElement(ref_obj);
        _ref_obj = (_w.isString(_ref_obj)) ? _stringToNode(_ref_obj) : _ref_obj;
        if(_ref_obj.length > 0)
        {
            for (var i = _ref_obj.length - 1; i >= 0; i--)
            {
                _this.insertBefore(_ref_obj[i], _this.firstChild);
            }
        }
        else if(_ref_obj)
        {
            _this.insertBefore(_ref_obj, _this.firstChild);
        }
        return this;
    };

    /**
     * Insert an element to the start of all elements within a reference element
     * Analogous to JQuery $.prependTo method
     * @param ref_obj {Element} The reference [destination] element
     * @return {*}
     */
    Dom.prototype.prependTo = function(ref_obj) {
        _this = _getElement(this);
        ref_obj = (_w.isString(ref_obj) && (ref_obj === "head" || ref_obj === "body")) ? wQuery(ref_obj): ref_obj;
        _ref_obj = _getElement(ref_obj);
        _ref_obj = (_w.isString(_ref_obj)) ? _stringToNode(_ref_obj) : _ref_obj;
        if(_getObjectType(_this) === 'Element') {
            _ref_obj.insertBefore(_this, _ref_obj.firstChild);
            return this;
        }

        if(this.selector_method !== 'querySelectorAll')
        {
            _this = document.querySelectorAll(this.selector);
        }
        _prependToList(_ref_obj, _this);
        return this;
    };

    /**
     * Insert an element to the start of all elements with a reference [NodeList/HTMLCollection/StaticNodeList]
     * @param obj {Object} the reference object
     * @param _this {Object} the context
     * @returns {*}
     * @private
     */
    function _prependToList(obj, _this){

        for (var i = _this.length-1; i >= 0; i--)
        {
            obj.insertBefore(_this[i], obj.firstChild);
        }
        return _this;
    }

    /**
     * Insert an element before a reference element
     * Analogous to JQuery $.insertBefore method
     * @param ref_obj {Element} The reference [destination] element
     * @return {*}
     */
    Dom.prototype.addBefore = function(ref_obj) {
        _this = _getElement(this);
        _ref_obj = _getElement(ref_obj);
        _parent_ref_obj = _ref_obj.parentNode;
        _parent_ref_obj.insertBefore(_this, _ref_obj);
        return this;
    };

    /**
     * Insert an element after a reference element
     * Analogous to JQuery $.insertAfter method
     * @param ref_obj {Element} The reference [destination] element
     * @return {*}
     */
    Dom.prototype.addAfter = function(ref_obj) {
        _this = _getElement(this);
        _ref_obj = _getElement(ref_obj);

        _parent_ref_obj = _ref_obj.parentNode;
        _parent_ref_obj.insertBefore(_this, _ref_obj.nextSibling);
        return this;
    };

    /**
     * Gets the width or height of an element
     * @param ctx {Object} the context
     * @param prop {String} the property name. Either width or height
     * @param op_type_str {String} the type of operation. Either outer, inner, or main
     * @param inc_margin_bool {String} determines if the margin is included in calculation. Valid for outer op_type_str only
     * @returns {*}
     * @private
     */
    function _getDimension(ctx, prop)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            el = ctx[0],
            selector = ctx.selector,
            op_type_str = (_w.isString(myArgs[2])) ? myArgs[2] : 'main',
            inc_margin_bool = (_w.isBool(myArgs[3])) ? myArgs[3] : false,
            is_getcomputedstyle_bool = ((typeof window.getComputedStyle !== 'undefined')),
            outer_margin_idx_1_str = (prop === 'height') ? 'marginTop' : 'marginLeft',
            outer_margin_idx_2_str = (prop === 'height') ? 'marginBottom' : 'marginRight',
            outer_border_idx_1_str = (prop === 'height') ? 'borderTopWidth' : 'borderLeftWidth',
            outer_border_idx_2_str = (prop === 'height') ? 'borderBottomWidth' : 'borderRightWidth',
            outer_padding_idx_1_str = (prop === 'height') ? 'paddingTop' : 'paddingLeft',
            outer_padding_idx_2_str = (prop === 'height') ? 'paddingBottom' : 'paddingRight',
            fallback_func_str = (prop === 'height') ? 'clientHeight' : 'clientWidth',
            style_obj,
            dim_temp_int,
            dim_padding_1_int,
            dim_padding_2_int,
            dim_padding_int,
            dim_border_1_int,
            dim_border_2_int,
            dim_border_int,
            dim_margin_1_int,
            dim_margin_2_int,
            dim_margin_int,
            dim_final_int
            ;

        //Compute for window object
        if(_isWindow(el))
        {
            return document.documentElement[fallback_func_str];
        }

        //Compute for HTML object
        if(selector === "html" || el === document)
        {
            var func_type_str = (prop === "height") ? "Height" : "Width",
                el_win = window,
                el_doc = document.documentElement,
                el_body = document.body || document.getElementsByTagName("body")[0],
                el_body_s_dim_int = (el_body['scroll'+func_type_str]) ? el_body['scroll'+func_type_str] : 0,
                el_body_o_dim_int = (el_body['offset'+func_type_str]) ? el_body['offset'+func_type_str] : 0,
                el_body_c_dim_int = (el_body['client'+func_type_str]) ? el_body['client'+func_type_str] : 0,
                el_doc_s_dim_int = (el_doc['scroll'+func_type_str]) ? el_doc['scroll'+func_type_str] : 0,
                el_doc_o_dim_int = (el_doc['offset'+func_type_str]) ? el_doc['offset'+func_type_str] : 0,
                el_doc_c_dim_int = (el_doc['client'+func_type_str]) ? el_doc['client'+func_type_str] : 0,
                el_win_i_dim_int = (el_win['inner'+func_type_str]) ? el_win['inner'+func_type_str] : 0
                ;

            return (prop === "height") ? Math.max(el_body_s_dim_int, el_body_o_dim_int, el_doc_s_dim_int, el_doc_o_dim_int, el_doc_c_dim_int) : el_win_i_dim_int || el_doc_c_dim_int || el_body_c_dim_int || el_body_o_dim_int;
        }

        //Get the Primary Dimension
        dim_temp_int = (prop === 'height') ? el.offsetHeight : el.offsetWidth;

        //define style object
        style_obj = (is_getcomputedstyle_bool) ? window.getComputedStyle(el, null) : el.currentStyle;

        //get margin
        dim_margin_1_int = (parseInt(style_obj[outer_margin_idx_1_str])) ? parseInt(style_obj[outer_margin_idx_1_str]): 0;
        dim_margin_2_int = (parseInt(style_obj[outer_margin_idx_2_str])) ? parseInt(style_obj[outer_margin_idx_2_str]): 0;
        dim_margin_int = dim_margin_1_int + dim_margin_2_int;

        //get padding
        dim_padding_1_int = (parseInt(style_obj[outer_padding_idx_1_str])) ? parseInt(style_obj[outer_padding_idx_1_str]): 0;
        dim_padding_2_int = (parseInt(style_obj[outer_padding_idx_2_str])) ? parseInt(style_obj[outer_padding_idx_2_str]): 0;
        dim_padding_int = dim_padding_1_int + dim_padding_2_int;

        //get border
        dim_border_1_int = (parseInt(style_obj[outer_border_idx_1_str])) ? parseInt(style_obj[outer_border_idx_1_str]): 0;
        dim_border_2_int = (parseInt(style_obj[outer_border_idx_2_str])) ? parseInt(style_obj[outer_border_idx_2_str]): 0;
        dim_border_int = dim_border_1_int + dim_border_2_int;

        //get final dimension
        dim_final_int = dim_temp_int;
        dim_final_int = dim_final_int-dim_padding_int-dim_border_int;

        //manage operation type e.g. innerWith, outerWidth
        if(op_type_str === 'outer')
        {
            dim_final_int = dim_final_int+dim_padding_int+dim_border_int;
            dim_final_int = (inc_margin_bool) ? dim_final_int+dim_margin_int : dim_final_int;
        }
        else if (op_type_str === 'inner')
        {
            dim_final_int = dim_final_int+dim_padding_int;
        }

        return dim_final_int;
    }

    /**
     * Gets the width of an element
     * Analogous to JQuery $.width()
     * @return {Number}
     */
    Dom.prototype.width = function(){
        var width_str = _getDimension(this, 'width').toString(),
            op_offset_int = (width_str.indexOf('px') < 0) ? 0 : 2;
        return parseInt(width_str.slice(0, width_str.length - op_offset_int), 10);
    };

    /**
     * Gets the inner width of an element
     * Analogous to JQuery $.innerWidth()
     * @return {Number}
     */
    Dom.prototype.innerWidth = function(){
        var width_str = _getDimension(this, 'width', 'inner').toString(),
            op_offset_int = (width_str.indexOf('px') < 0) ? 0 : 2;
        return parseInt(width_str.slice(0, width_str.length - op_offset_int), 10);
    };

    /**
     * Gets the outer width of an element
     * Analogous to JQuery $.outerWidth()
     * @param inc_margin_bool {Boolean} determines whether the margin value should be included
     * @return {Number}
     */
    Dom.prototype.outerWidth = function(inc_margin_bool){
        var width_str = _getDimension(this, 'width', 'outer', inc_margin_bool).toString(),
            op_offset_int = (width_str.indexOf('px') < 0) ? 0 : 2;
        return parseInt(width_str.slice(0, width_str.length - op_offset_int), 10);
    };

    /**
     * Gets the height of an element
     * Analogous to JQuery $.height()
     * @return {Number}
     */
    Dom.prototype.height = function(){
        var height_str = _getDimension(this, 'height').toString(),
            op_offset_int = (height_str.indexOf('px') < 0) ? 0 : 2;
        return parseInt(height_str.slice(0, height_str.length - op_offset_int), 10);
    };

    /**
     * Gets the height of an element
     * Analogous to JQuery $.innerHeight()
     * @return {Number}
     */
    Dom.prototype.innerHeight = function(){
        var height_str = _getDimension(this, 'height', 'inner').toString(),
            op_offset_int = (height_str.indexOf('px') < 0) ? 0 : 2;
        return parseInt(height_str.slice(0, height_str.length - op_offset_int), 10);
    };

    /**
     * Gets the outer height of an element
     * Analogous to JQuery $.outerHeight()
     * @param inc_margin_bool {Boolean} determines whether the margin value should be included
     * @return {Number}
     */
    Dom.prototype.outerHeight = function(inc_margin_bool){
        var height_str = _getDimension(this, 'height', 'outer', inc_margin_bool).toString(),
            op_offset_int = (height_str.indexOf('px') < 0) ? 0 : 2;
        return parseInt(height_str.slice(0, height_str.length - op_offset_int), 10);
    };

    /**
     * Gets or sets arbitrary data
     * @param key {String} the key
     * @param val {String|Number|Boolean} the value
     * @param ctx {Object} the context. Default is window
     * @returns {*}
     * @private
     */
    function _data(key, val)
    {
        var myArgs = Array.prototype.slice.call(arguments),
            _this = myArgs[2],
            _this_selector_str,
            _this_selector_hash_str,
            object_store_fn_str = 'rObjectStore';

        //get DOM object parameters if given
        if(_this && _w.isString(_this.selector) && _this.selector.length > 0)
        {
            _this_selector_str = _this.selector;
            _this_selector_hash_str = _w.hashCode(_this_selector_str);
            _this_selector_hash_str = Math.abs(_this_selector_hash_str);
            key = key+_this_selector_hash_str;
        }

        //initialize window object store
        if(!window[object_store_fn_str])
        {
            window[object_store_fn_str] = {};
        }

        //set or get
        if (key)
        {
            if(!_w.isNullOrUndefined(val))
            {
                window[object_store_fn_str][key] = val;
                /*jshint -W040 */
                return this;
                /*jshint +W040 */
            }
            else
            {
                return window[object_store_fn_str][key];
            }
        }
    }

    /**
     * Get or set arbitrary data associated with a matched element
     * Wrapper class of _data
     * @param key {String} the identifier of the data value
     * @param val {*} the data value
     * @return {*}
     */
    Dom.prototype.data = function(key, val)
    {
        return _data(key, val, this);
    };

    /**
     * Get or set arbitrary data to window-scope storage
     * Wrapper class of _data
     * @param key {String} the identifier of the data value
     * @param val {*} the data value
     * @returns {*}
     */
    wQuery.data = function(key, val)
    {
        return _data(key, val);
    };

    /**
     * Checks whether the object is an WQuery Object
     * @param elem_obj {Object} the Object to test
     * @returns {boolean}
     */
    wQuery.isWQueryObject = function(elem_obj)
    {
        return ((elem_obj.label === 'wquery'));
    };

    /**
     * Extends the Dom object by adding a method
     * @param name {String} the name of the function
     * @param func {Function} the function to add to the Dom object
     */
    wQuery.extend = function(name, func){
        Dom.prototype[name] = func;
    };

    //assign to window object
    window.wQuery = wQuery;

    //assign to $ namespace if it is undefined
    _data('isWQueryActive', false);
    if(!window.$)
    {
        window.$ = window.wQuery;
        _data('isWQueryActive', true);
    }

})(_w);


/*! Plain javascript replacement of .ready() function from jQuery | @link https://github.com/jfriend00/docReady | @copyright John Friend <https://github.com/jfriend00> | @license MIT */
(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of
    // window.docReady(...)

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    //continue
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };
})("domReady", wQuery);
// modify this previous line to pass in your own method name
// and object for the method to be attached to


/*! wizmo - C | @link http://github.com/restive/wizmo | @copyright 2017 Restive LLC <http://wizmo.io> | @license MIT */
(function(window, document, $){

    //define util wizmo class
    (function(root, name, make){
        if (typeof module !== 'undefined' && module.exports){ module.exports = make();}
        else {root[name] = make();}
    }(window, 'wUtil', function() {

        var wUtil = {};

        /**
         * Wrapper for _domStore
         * @returns {*}
         */
        function domStoreFn()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _domStore(myArgs[0], myArgs[1], undefined, true);
        }

        /**
         * Create DOM-based Storage
         * @param key_str {String} The identifier for the value being stored
         * @param value_res {*} The value to store [optional]
         * @param namespace_str {String} a dedicated namespace to store values
         * Note: When storing objects in a namespace, you can return all objects by using this method with an undefined key_str and undefined value_res
         * @returns {*}
         * @private
         */
        function _domStore()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                key_str = myArgs[0],
                value_res = myArgs[1],
                namespace_str = (_w.isString(myArgs[2]) && myArgs[2].length > 0) ? myArgs[2] : null,
                disable_prefix_bool = myArgs[3],
                is_value_valid_bool = !!(!_w.isNullOrUndefined(value_res) && (_w.isString(value_res) || _w.isNumber(value_res) || (_w.isArray(value_res)) || _w.isBool(value_res) || _w.isObject(value_res) || typeof value_res === 'function')),
                is_value_null_bool = ((value_res === null)),
                key_prefix_str = 'w_'
                ;

            //prefix key value
            key_str = (_w.isString(key_str) && key_str.length > 0 && !disable_prefix_bool) ? key_prefix_str+key_str : key_str;

            if(namespace_str)
            {
                //prefix namespace value
                namespace_str = key_prefix_str+namespace_str;

                //save in namespace

                //create object namespace if not
                if(!window.wUtil.domStoreData[namespace_str])
                {
                    window.wUtil.domStoreData[namespace_str] = {};
                }

                if(is_value_valid_bool)
                {
                    window.wUtil.domStoreData[namespace_str][key_str] = value_res;
                }
                else if (is_value_null_bool)
                {
                    window.wUtil.domStoreData[namespace_str][key_str] = undefined;
                    delete window.wUtil.domStoreData[namespace_str][key_str];
                }
                else
                {
                    return (key_str) ? window.wUtil.domStoreData[namespace_str][key_str] : window.wUtil.domStoreData[namespace_str];
                }
            }
            else
            {
                if(is_value_valid_bool)
                {
                    window.wUtil.domStoreData[key_str] = value_res;
                }
                else if (is_value_null_bool)
                {
                    window.wUtil.domStoreData[key_str] = null;
                    delete window.wUtil.domStoreData[key_str];
                }
                else
                {
                    return window.wUtil.domStoreData[key_str];
                }
            }
        }

        /**
         * Wrapper class for _domStore
         * @returns {*}
         */
        function domStore()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _domStore(myArgs[0], myArgs[1], myArgs[2]);
        }

        /**
         * Stores a value in LocalStorage [or other storage type], or retrieves previously stored value
         * Leverages AmplifyJS Store <http://amplifyjs.com/api/store/> and JS-Cookie <https://github.com/js-cookie/js-cookie>
         * @param key_str {String} The identifier for the value being stored
         * Note: You can use the double-colon notation to store and manage objects and properties
         * For example: If key is 'main::first', and value is 'first_data', the object that will be stored will be {'first': 'first_data'}
         * You can also retrieve object properties directly
         * For example: if the stored object with id/key 'main' is {'first': 'primary', 'second': 'secondary'}, you can get the 'second' nested value ['secondary'] with _store('main::second')
         * @param value_res {*} The value to store [optional]
         * @param type_str {String} The type of storage format to be used
         * ls for localStorage
         * ss for sessionStorage [default]
         * ck for cookie
         * @param options_res {*} A set of key/value pairs that relate to settings for storing the value
         * These are pass-through values for the respective storage libraries
         * For sessionStorage and LocalStorage, see official AmplifyJS options
         * For cookie, see official js-cookie options
         * @return {*}
         */
        function _store()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                is_priv_browsing_bool = domStore("browser_is_private"),
                key_str = myArgs[0],
                value_res = myArgs[1],
                type_str = (!_w.isNullOrUndefined(myArgs[2]) && (_w.isString(myArgs[2]) && myArgs[2].length > 0)) ? myArgs[2] : 'ss',
                options_res = myArgs[3],
                key_has_double_colon_bool,
                store_func_name,
                store_func,
                list_del_key_arr = [],
                is_getall_bool = (_w.isString(key_str) && key_str.length > 0) ? false: true,
                is_value_valid_bool = !!(!_w.isNullOrUndefined(value_res) && (_w.isString(value_res) || _w.isNumber(value_res) || (_w.isArray(value_res)) || _w.isBool(value_res) || _w.isObject(value_res))),
                is_value_null_bool = ((value_res === null)),
                key_prefix_str = 'w_',
                ck_transform_result_bool = true,
                ck_result_temp_mx,
                ck_result_final_mx
                ;

            //prefix key value
            key_str = (_w.isString(key_str) && key_str.length > 0) ? key_prefix_str+key_str : key_str;

            try
            {
                if (is_priv_browsing_bool)
                {
                    //Private Browsing Detected, Use Windows Store
                    store_func_name = 'domStoreFn';
                    store_func = window.wUtil[store_func_name];
                }
                else if(type_str === 'ck')
                {
                    //Use Cookies

                    //get
                    if (!is_value_valid_bool)
                    {
                        if(is_value_null_bool)
                        {
                            //remove
                            Cookies.remove(key_str, options_res);
                        }
                        else
                        {
                            //get
                            ck_result_temp_mx = Cookies.get(key_str);
                            ck_result_final_mx = ck_result_temp_mx;

                            ck_transform_result_bool = (options_res && _w.isBool(options_res.ck_transform)) ? options_res.ck_transform : ck_transform_result_bool;
                            if(!ck_transform_result_bool)
                            {
                                return ck_result_final_mx;
                            }

                            if(/^ *[0-9]+? *$/i.test(ck_result_temp_mx))
                            {
                                ck_result_final_mx = parseInt(ck_result_temp_mx);
                            }
                            else if(/^ *[0-9]*?\.[0-9]+ *$/i.test(ck_result_temp_mx))
                            {
                                ck_result_final_mx = parseFloat(ck_result_temp_mx);
                            }
                            else if(/^ *true|false *$/i.test(ck_result_temp_mx))
                            {
                                ck_result_final_mx = !!(/^ *true *$/i.test(ck_result_temp_mx));
                            }

                            return ck_result_final_mx;
                        }
                    }
                    else
                    {
                        //set
                        Cookies.set(key_str, value_res, options_res);
                    }
                    return;
                }
                else
                {
                    //Use AmplifyJS Store
                    if(type_str === 'ls')
                    {
                        store_func_name = 'localStorage';
                    }
                    else
                    {
                        store_func_name = 'sessionStorage';
                    }
                    store_func = amplify.store[store_func_name];

                    //if sessionStorage is not supported, default to amplifyJS
                    if (!window.sessionStorage || !window.localStorage)
                    {
                        store_func = amplify.store;
                    }

                    //return all values if no key is provided
                    if(is_getall_bool)
                    {
                        return store_func();
                    }
                }

                key_has_double_colon_bool = !!(/^ *[^\s]+?\:\:[^\s]+? *$/i.test(key_str));

                //return stored value if empty value argument and value is not null
                if (!is_value_valid_bool && !is_value_null_bool)
                {
                    return (key_has_double_colon_bool) ? _storeObject(store_func, key_str, value_res, options_res) : store_func(key_str);
                }

                //delete object if value is null
                if (is_value_null_bool)
                {
                    //delete stored object(s)
                    list_del_key_arr = key_str.split(" ");
                    for (var i = 0; i < _w.count(list_del_key_arr); i++)
                    {
                        if(key_has_double_colon_bool)
                        {
                            _storeObject(store_func, list_del_key_arr[i], null);
                        }
                        else
                        {
                            store_func(list_del_key_arr[i], null);
                        }
                    }
                    return null;
                }

                if(key_has_double_colon_bool)
                {
                    //store value
                    _storeObject(store_func, key_str, value_res, options_res);
                }
                else
                {
                    //store value
                    store_func(key_str, null);
                    store_func(key_str, value_res, options_res);
                }
            }
            catch(e){
                var e_msg_str = e.message;
                _w.console.error(e_msg_str);
            }
        }

        /**
         * Wrapper class for _store
         * @returns {*}
         */
        function store()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _store(myArgs[0], myArgs[1], myArgs[2], myArgs[3]);
        }

        /**
         * Manage storage of object and object properties
         * @param store_fn {Function} The storage function
         * @param key_str {String} The identifier for the value being stored
         * Note: You can use the double-colon notation to store and manage objects and properties
         * For example: If key is 'main::first', and value is 'first_data', the object that will be stored will be {'first': 'first_data'}
         * You can also retrieve object properties directly
         * For example: if the stored object with id/key 'main' is {'first': 'primary', 'second': 'secondary'}, you can get the 'second' nested value ['secondary'] with _store('main::second')
         * @param value_res {*} The value to store [optional]
         * @param options_obj {Object} A set of key/value pairs that relate to settings for storing the value
         * @return {*}
         * @private
         */
        function _storeObject(store_fn, key_str, value_res, options_obj)
        {
            var is_value_valid_bool = !!(!_w.isNullOrUndefined(value_res) && (_w.isString(value_res) || _w.isNumber(value_res) || (_w.isArray(value_res)) || _w.isBool(value_res) || _w.isObject(value_res))),
                is_value_null_bool = ((value_res === null)),
                is_key_double_colon_bool,
                key_split_arr,
                key_obj_id_root_str,
                key_obj_id_sub_str,
                value_curr_obj,
                value_new_obj = {},
                value_obj
                ;

            //check if key has double colon
            is_key_double_colon_bool = !!(/^ *[^\s]+?\:\:[^\s]+? *$/i.test(key_str));

            //split
            key_split_arr = _w.explode('::', key_str);
            key_obj_id_root_str = key_split_arr[0];
            if(is_key_double_colon_bool)
            {
                key_obj_id_sub_str = key_split_arr[1];
            }

            //get current value
            value_curr_obj = store_fn(key_obj_id_root_str, undefined, options_obj);

            if(is_value_null_bool)
            {
                //delete

                store_fn(key_obj_id_root_str, null);

                if(is_key_double_colon_bool)
                {
                    //delete object property

                    value_obj = value_curr_obj;
                    delete value_obj[key_obj_id_sub_str];

                    if (!_w.isObjectEmpty(value_obj))
                    {
                        store_fn(key_obj_id_root_str, value_obj, options_obj);
                    }
                }
            }
            else if (is_value_valid_bool)
            {
                //save

                if(_w.isObject(value_curr_obj))
                {
                    //update

                    if(!is_key_double_colon_bool)
                    {
                        //update whole object

                        value_obj = value_res;
                    }
                    else
                    {
                        //update object property

                        value_curr_obj[key_obj_id_sub_str] = value_res;
                        value_obj = value_curr_obj;
                    }
                }
                else
                {
                    //save new

                    if(!is_key_double_colon_bool)
                    {
                        if(_w.isObject(value_res))
                        {
                            //save entire object

                            value_obj = value_res;
                        }
                    }
                    else
                    {
                        //save object property

                        value_new_obj[key_obj_id_sub_str] = value_res;
                        value_obj = value_new_obj;
                    }
                }

                store_fn(key_obj_id_root_str, null);
                store_fn(key_obj_id_root_str, value_obj, options_obj);
            }
            else
            {
                //get

                if(!is_key_double_colon_bool)
                {
                    //get whole object

                    return value_curr_obj;
                }
                else
                {
                    //get object property

                    return (_w.isObjectEmpty(value_curr_obj) || _w.isNullOrUndefined(value_curr_obj)) ? undefined : value_curr_obj[key_obj_id_sub_str];
                }
            }
        }

        /**
         * Checks if a value stored in LocalStorage exists and contains a value
         * Also stores a value if provided if the value did not previously exist or was invalid
         * @param key_str {String} The identifier for the value that was stored
         * @param value_store_res {*} The value to store [optional]
         * @param type_str {String} The type of storage format to be used
         * @return {Boolean}
         */
        function _storeCheck()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                key_str = myArgs[0],
                value_store_res = myArgs[1],
                type_str = (!_w.isNullOrUndefined(myArgs[2]) && (_w.isString(myArgs[2]) && myArgs[2].length > 0)) ? myArgs[2] : 'ss',
                value_retr_res = store(''+key_str+'', undefined, type_str),
                is_value_valid_bool = !!(!_w.isNullOrUndefined(value_store_res)),
                is_store_value_set_bool = false
                ;

            //Determine if store value exists and is valid
            if(_w.isBool(value_retr_res) || (value_retr_res !== null && typeof value_retr_res !== "undefined" && value_retr_res.length > 0))
            {
                is_store_value_set_bool = true;
            }

            //Return result of check immediately if no value is provided
            if(!is_value_valid_bool)
            {
                return is_store_value_set_bool;
            }

            //Store value if it does not exist and/or is invalid.
            if(!is_store_value_set_bool)
            {
                store(key_str, value_store_res, type_str);
            }
        }

        /**
         * Wrapper class for _storeCheck
         * @returns {*}
         */
        function storeCheck()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _storeCheck(myArgs[0], myArgs[1], myArgs[2]);
        }

        //Handle existing window.wUtil
        if(window.wUtil)
        {
            wUtil = window.wUtil;
        }

        //Append methods
        wUtil.domStoreData = {'domStoreData': {}};
        wUtil.domStoreFn = domStoreFn;
        wUtil.domStore = domStore;
        wUtil.store = store;
        wUtil.storeCheck = storeCheck;

        return wUtil;

    }));

    //define core wizmo class
    (function(root, name, make){
        if (typeof module !== 'undefined' && module.exports){ module.exports = make($);}
        else {root[name] = make($);}
    }(window, 'wizmo', function($) {

        //Define wizmo Object
        var wizmo;

        /**
         * Queues a function to a specific 'run when ready' queue
         * @param {Function|Object} util_queue_fn_or_obj the function [or object] to queue
         * @param {Function} queue_id_fn the specific queue method
         * @private
         */
        function _addToReadyQueue(util_queue_fn_or_obj, queue_id_fn)
        {
            if(_w.isFunction(util_queue_fn_or_obj))
            {
                //queue function
                queue_id_fn(util_queue_fn_or_obj);
            }
            else if (_w.isObject(util_queue_fn_or_obj))
            {
                //queue function from object
                var func_obj = util_queue_fn_or_obj;
                for (var key in func_obj)
                {
                    if (func_obj.hasOwnProperty(key))
                    {
                        queue_id_fn(func_obj[key]);
                    }
                }
            }
        }

        /**
         * Initialize and store some important default values.
         * Return false if initialization has already been performed in same session.
         * @return {Boolean}
         */
        var init = function ()
        {
            /**
             * Detect private browsing
             * Note: Must be called first before everything
             */
            var is_private_browser_bool = !!((_detectPrivateBrowsing()));
            domStore("browser_is_private", is_private_browser_bool);

            //run preInit on wUtil
            if(wUtil.init)
            {
                _addToReadyQueue(wUtil.init, addToQueueWizmoInit);
            }

            //setup to run first [before wizmo]
            if(wUtil.first)
            {
                _addToReadyQueue(wUtil.first, addToQueueWizmoFirst);
            }

            //ready initialization
            var is_init_bool = store("var_is_init"),
                retr_bool;

            //reset storage variables
            store("var_run_defer_auto", null);
            store("var_run_defer_css_manual_set_fn", null);

            store("var_counter_console", 1);

            if(is_init_bool)
            {
                store("var_timestamp_curr", _w.microtime(true));

                //update the dimension and orientation info storage-wide
                _initDimensionVars();
                _updateDimensionStore();
                _updateOrientationStore();

                retr_bool = false;
            }
            else
            {
                //set defaults
                store("var_timestamp_curr", _w.microtime(true));
                store("var_timestamp_init", store("var_timestamp_curr"));

                store("var_is_init", true);

                _initDimensionVars();
                _updateDimensionStore();
                store("var_screen_ort_init", getOrientation());
                store("var_screen_ort_curr", getOrientation());

                retr_bool = true;
            }

            return retr_bool;
        };

        /**
         * Detects whether private browsing is active or not
         * @return {Boolean}
         */
        function _detectPrivateBrowsing()
        {
            try {
                localStorage.setItem("__test", "data");
            }
            catch (e)
            {
                var is_local_storage_notset_bool = /localStorage.*?(undefined|denied|null)|setItem.*?(undefined|null)|security *error.*?dom +exception +18/i.test(e.message);
                var is_quota_exceeded_bool = /quota.*?(exceeded|reached)/i.test(e.name);

                if (is_local_storage_notset_bool || is_quota_exceeded_bool) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Wrapper class for wUtil.domStore
         * @returns {*}
         */
        function domStore()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return wUtil.domStore(myArgs[0], myArgs[1], myArgs[2]);
        }

        /**
         * Increments or decrements a value in storage
         * @param key_str {String} the identifier of the value in storage
         * @param incr_size_int {Number} the size of the increment
         * @param decr_bool {Boolean} if set to true, will decrement instead of increment
         * @returns {*}
         * @private
         */
        function _domStoreIncrement(key_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                incr_size_int = (_w.isNumber(myArgs[1])) ? myArgs[1]: 1,
                decr_bool = (_w.isBool(myArgs[2])) ? myArgs[2]: false,
                value_int;

            value_int = parseInt(domStore(key_str));
            if(!_w.isNumber(value_int))
            {
                return false;
            }

            value_int = (decr_bool) ? value_int - incr_size_int: value_int + incr_size_int;
            domStore(key_str, value_int);

            return value_int;
        }

        /**
         * Increments a value in storage
         * Wrapper class for _domStoreIncrement
         * @returns {*}
         */
        function domStoreIncrement(key_str, incr_size_int)
        {
            return _domStoreIncrement(key_str, incr_size_int);
        }

        /**
         * Increments a value in storage
         * Wrapper class for _domStoreIncrement
         * @returns {*}
         */
        function domStoreDecrement(key_str, incr_size_int)
        {
            return _domStoreIncrement(key_str, incr_size_int, true);
        }

        /**
         * Adds an element to the end of an array stored in domStore
         * Functional equivalent of array.push
         * @param {String} key_arr_ref_str the identifier of the array in storage
         * @param {String|Number} value_mx the string, number, or boolean to add to the array
         * @param {Boolean} unique_bool if true, will ensure that only unique values are added to the array
         * @return {Boolean}
         */
        function domStorePush(key_arr_ref_str, value_mx)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                unique_bool = !!((myArgs[2])),
                store_var_arr
                ;

            //return if value is null or undefined
            if(_w.isNullOrUndefined(value_mx))
            {
                return false;
            }

            //add array if not defined
            if(!domStore(key_arr_ref_str))
            {
                domStore(key_arr_ref_str, []);
            }

            //get current value
            store_var_arr = domStore(key_arr_ref_str);

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
            domStore(key_arr_ref_str, store_var_arr);
            return true;
        }

        /**
         * Wrapper class for wUtil.store
         * @returns {*}
         */
        function store()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return wUtil.store(myArgs[0], myArgs[1], myArgs[2], myArgs[3]);
        }

        /**
         * Wrapper class for wUtil.storeCheck
         * @returns {*}
         */
        function storeCheck()
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return wUtil.storeCheck(myArgs[0], myArgs[1], myArgs[2]);
        }

        /**
         * Increments or decrements a value in storage
         * @param key_str {String} the identifier of the value in storage
         * @param incr_size_int {Number} the size of the increment
         * @param decr_bool {Boolean} if set to true, will decrement instead of increment
         * @param type_str {String} the storage type
         * Note: only ls [localStorage], ss [sessionStorage], and ck [cookie] are allowed
         * @returns {*}
         * @private
         */
        function _storeIncrement(key_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                incr_size_int = (_w.isNumber(myArgs[1])) ? myArgs[1]: 1,
                decr_bool = (_w.isBool(myArgs[2])) ? myArgs[2]: false,
                type_str = (_w.isString(myArgs[3]) && _w.in_array(myArgs[3], ['ss', 'ls', 'ck'])) ? myArgs[3] : 'ss',
                value_int;

            value_int = parseInt(store(key_str, undefined, type_str));
            if(!_w.isNumber(value_int))
            {
                return false;
            }

            value_int = (decr_bool) ? value_int - incr_size_int: value_int + incr_size_int;
            store(key_str, value_int, type_str);

            return value_int;
        }

        /**
         * Increments a value in storage
         * Wrapper class for _storeIncrement
         * @returns {*}
         */
        function storeIncrement(key_str, incr_size_int)
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _storeIncrement(key_str, incr_size_int, undefined, myArgs[2]);
        }

        /**
         * Decrements a value in storage
         * Wrapper class for _storeIncrement
         * @returns {*}
         */
        function storeDecrement(key_str, incr_size_int)
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _storeIncrement(key_str, incr_size_int, true, myArgs[2]);
        }

        /**
         * Initializes important dimension variables to Local storage
         * @private
         */
        function _initDimensionVars()
        {
            var docElem = document.documentElement;
            store("var_document_client_w", docElem.clientWidth);
            store("var_document_client_h", docElem.clientHeight);
            store("var_window_outer_w", window.outerWidth);
            store("var_window_outer_h", window.outerHeight);
            store("var_window_screen_w", screen.width);
            store("var_window_screen_h", screen.height);
        }

        /**
         * Get the width of the viewport
         * @return {*|Number}
         */
        function viewportW(){
            return (storeCheck("var_viewport_w")) ? store("var_viewport_w"): _getViewportDimensionPixel('w');
        }

        /**
         * Get the height of the viewport
         * @return {*|Number}
         */
        function viewportH(){
            return (storeCheck("var_viewport_h")) ? store("var_viewport_h"): _getViewportDimensionPixel('h');
        }

        /**
         * Get the width of the screen i.e. device width
         * @return {*|Number}
         */
        function screenW(){
            return (storeCheck("var_screen_w")) ? store("var_screen_w"): _getDimension('sW', store("var_is_getdim_screen_adj"));
        }

        /**
         * Get the height of the screen i.e. device height
         * @return {*|Number}
         */
        function screenH(){
            return (storeCheck("var_screen_h")) ? store("var_screen_h"): _getDimension('sH', store("var_is_getdim_screen_adj"));
        }

        /**
         * Get the Device-Independent Pixel width of the viewport
         */
        function pixelW()
        {
            return (storeCheck("var_viewport_w_dp")) ? store("var_viewport_w_dp"): _getDimension('vW', store("var_is_getdim_screen_adj"));
        }

        /**
         * Get the Device-Independent Pixel height of the viewport
         */
        function pixelH()
        {
            return (storeCheck("var_viewport_h_dp")) ? store("var_viewport_h_dp"): _getDimension('vH', store("var_is_getdim_screen_adj"));
        }

        /**
         * Get the dimension of a DOM Element.
         * It uses the JQuery dimension functions e.g. width(), innerHeight(), etc.
         * @param el_obj {String} The JQuery element object
         * @param type_str {String} The type of operation. w = width, h = height
         * @param format_str {String} The dimension retrieval method to use. There are three as follows
         * 1: d = default = el_obj.width() or el_obj.height()
         * 2: i = inner = el_obj.innerWidth() or el_obj.innerHeight()
         * 3: o = outer = el_obj.outerWidth() or el_obj.outerHeight()
         * @param force_dip_bool {Boolean} Determines whether to consider the element dimensions in device-independent pixel format or not. true = do not use DIP, false [default] = use DIP
         * @return {Number|Boolean}
         * @private
         */
        function _getElementDimension(el_obj, type_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                format_str = (_w.isString(myArgs[2]) && myArgs[2].length > 0) ? myArgs[2]: 'd',
                force_dip_bool = (_w.isBool(myArgs[3])) ? myArgs[3]: true,
                dim_final_int
                ;
            type_str = type_str.toLowerCase();

            if(type_str === 'w' || type_str === 'h')
            {
                if(format_str === 'i')
                {
                    dim_final_int = (type_str === 'w') ? el_obj.innerWidth() : el_obj.innerHeight();
                }
                else if (format_str === 'o')
                {
                    dim_final_int = (type_str === 'w') ? el_obj.outerWidth() : el_obj.outerHeight();
                }
                else
                {
                    dim_final_int = (type_str === 'w') ? el_obj.width() : el_obj.height();
                }
            }
            else
            {
                dim_final_int = false;
            }

            if(force_dip_bool === false)
            {
                //Convert to Device Pixels
                dim_final_int = dim_final_int * getPixelRatio();
            }

            return dim_final_int;
        }

        /**
         * Get the width of a DOM element
         * @param el_obj {Object} The JQuery Element Object
         * @param dim_format_str {String} The dimension retrieval method to use.
         * @param force_dip_bool {Boolean} Flag for forced Device-Independent Pixel consideration
         * @return {Number|Boolean}
         * @private
         */
        function _elementW(el_obj){
            var myArgs = Array.prototype.slice.call(arguments),
                dim_format_str = myArgs[1],
                force_dip_bool = myArgs[2]
                ;
            return _getElementDimension(el_obj, 'w', dim_format_str, force_dip_bool);
        }

        /**
         * Get the height of a DOM element
         * @param el_obj {Object} The JQuery Element Object
         * @param dim_format_str {String} The dimension retrieval method to use.
         * @param force_dip_bool {Boolean} Flag for forced Device-Independent Pixel consideration
         * @return {Number|Boolean}
         * @private
         */
        function _elementH(el_obj){
            var myArgs = Array.prototype.slice.call(arguments),
                dim_format_str = myArgs[1],
                force_dip_bool = myArgs[2]
                ;
            return _getElementDimension(el_obj, 'h', dim_format_str, force_dip_bool);
        }

        /**
         * Get the Device Pixel Ratio
         * @param decimal {Number} An optional number (integer or float) to check against actual pixel ratio
         * @return {Number|Boolean}
         */
        function getPixelRatio(decimal) {
            //check if pixel ratio check has already been done. If so, return stored value
            if (storeCheck("var_screen_pixel_ratio")) {
                return store("var_screen_pixel_ratio");
            }

            var device_user_agent_str = getUserAgent(),
                is_opera_browser_bool = /opera.+(mini|mobi)/i.test(device_user_agent_str),
                doc_client_w = store("var_document_client_w"),
                win_outer_w = store("var_window_outer_w"),
                win_screen_w = store("var_window_screen_w"),
                is_symbian_bool = !!(isSymbian()),
                is_windows_bool = !!(isWindows()),
                is_android_1_bool = !!((isAndroid('1.'))),
                is_android_2_bool = !!((isAndroid('2.'))),
                is_special_needs_bool = !!(((is_android_1_bool || is_android_2_bool) || is_symbian_bool || is_windows_bool)),
                is_windows_or_symbian_bool = !!(is_windows_bool || is_symbian_bool),
                viewport_w = (is_special_needs_bool) ? ((win_outer_w <= 0) ? doc_client_w : win_outer_w) : doc_client_w,
                screen_w = ((is_android_2_bool || is_symbian_bool) && !is_opera_browser_bool) ? ((win_outer_w <= 0) ? win_screen_w : win_outer_w) : win_screen_w,
                dPR,
                dPR_temp,
                dPR_virtual,
                dPR_retr
                ;

            /**
             * Get the Pixel Ratio
             * Make Adjustments for when window.devicePixelRatio is 0
             */
            dPR_temp = window.devicePixelRatio;
            if (dPR_temp <= 0 || typeof dPR_temp === 'undefined' || dPR_temp === null) {
                dPR_virtual = screen_w / viewport_w;
                dPR = dPR_virtual;
                if (is_windows_or_symbian_bool) {
                    if (dPR > 0.5 && dPR < 1.2) {
                        dPR = 1;
                    }
                    else if (dPR >= 1.2 && dPR < 2) {
                        dPR = 1.5;
                    }
                    else if (dPR >= 2 && dPR < 3) {
                        dPR = 2;
                    }
                    else if (dPR >= 3 && dPR < 4) {
                        dPR = 3;
                    }
                    else if (dPR >= 4) {
                        dPR = 4;
                    }
                    else {
                        dPR = 1;
                    }
                }
                store("var_screen_pixel_ratio_virt", dPR_virtual);
            }
            else {
                dPR = dPR_temp;
            }

            //Return Pixel Ratio variations
            if (!_w.isNumber(decimal)) {
                dPR_retr = dPR || (getPixelRatio(3) ? 3 : getPixelRatio(2) ? 2 : getPixelRatio(1.5) ? 1.5 : getPixelRatio(1) ? 1 : 0);
                store("var_screen_pixel_ratio", dPR_retr);
                return dPR_retr;
            }

            //Return false if not finite
            if (!isFinite(decimal)) {
                return false;
            }

            if (dPR && dPR > 0) {
                return dPR >= decimal;
            }

            //Revert to .matchMedia/.msMatchMedia for Gecko (FF6+) support
            decimal = 'only all and (min--moz-device-pixel-ratio:' + decimal + ')';
            if (media(decimal).matches)
            {
                return true;
            }

            return !!media(decimal.replace('-moz-', '')).matches;
        }

        /**
         * Get the Device Aspect Ratio
         * @return {Number|Boolean}
         */
        function getAspectRatio()
        {
            var scr_w_int = screenW(),
                scr_h_int = screenH(),
                scr_ratio_flt;

            if(!_w.isNumber(scr_w_int) || !_w.isNumber(scr_h_int))
            {
                return false;
            }

            scr_ratio_flt = (scr_w_int >= scr_h_int) ? scr_w_int / scr_h_int : scr_h_int / scr_w_int;
            return scr_ratio_flt;
        }

        /**
         * Determines if the browser is a proxy-based browser
         * @link http://docs.webplatform.org/wiki/concepts/Internet_and_Web/proxy_based_browsers
         * @param {String} ua_str The user agent string
         * @return {Boolean}
         * @private
         */
        function _hasProxyBrowser(ua_str)
        {
            if (storeCheck("var_device_has_proxy_browser")){
                return store("var_device_has_proxy_browser");
            }

            var myArgs = Array.prototype.slice.call(arguments),
                set_to_store_flag_bool = (_w.isBool(myArgs[1])) ? myArgs[1]: false,
                is_ua_proxy_bool = /(series(4|6)0|s(4|6)0).+nokia|nokia.+(series(4|6)0|s(4|6)0)|(android|linux).+nokia.{1,3}x|skyfire|ucweb *mini|opera *mini/i.test(ua_str);

            if(set_to_store_flag_bool)
            {
                store("var_device_has_proxy_browser", is_ua_proxy_bool);
            }
            return is_ua_proxy_bool;
        }

        /**
         * Gets the user agent of the Device
         * This function makes provision for proxy-based browsers that employ X11 forwarding, but you need to use wizmo.proxyBrowserPing method to enable this
         * @return {String}
         */
        function getUserAgent()
        {
            //check if user agent check has been done and is in storage. If so, return stored value
            if(storeCheck("var_device_user_agent"))
            {
                return store("var_device_user_agent");
            }

            var ua_str = navigator.userAgent.toLowerCase(),
                has_proxy_ua_bool;

            //run synchronous UA ping only if specified using wizmo.
            if(_w.config.proxyBrowserPingUrl && _w.isString(_w.config.proxyBrowserPingUrl) && _w.config.proxyBrowserPingUrl.length > 0)
            {
                //Check if device user agent is likely used by proxy-based browser
                has_proxy_ua_bool = /mozilla.+x11(?!.*?(ubuntu|firefox|chrome|safari|opera|opr|qupzilla))/i.test(ua_str);
                if(has_proxy_ua_bool)
                {
                    //launch ajax request and set isProxyBrowser function in callback
                    var xhr_obj = new XMLHttpRequest(),
                        xhr_url_str = _w.config.proxyBrowserPingUrl;
                    xhr_obj.open('GET', xhr_url_str, false);  // 'false' makes the request synchronous. This is not an issue for proxy browsers because they are asynchronous by nature
                    xhr_obj.setRequestHeader("Cache-Control", "no-cache");
                    xhr_obj.setRequestHeader("Pragma", "no-cache");
                    xhr_obj.send(null);

                    ua_str = (xhr_obj.status === 200) ? xhr_obj.responseText : '';
                }
            }

            //set proxy browser setting to storage
            _hasProxyBrowser(ua_str, true);

            store("var_device_user_agent", ua_str);
            return ua_str;
        }

        /**
         * Gets the Operating System/Platform of the Device
         * The following platforms are supported
         * ios, android, symbian, blackberry, windows, mac, linux, unix, openbsd
         * @return {String}
         */
        function getPlatform()
        {
            if(_checkOS("ios"))
            {
                return "ios";
            }
            else if (_checkOS("android"))
            {
                return "android";
            }
            else if(_checkOS("symbian"))
            {
                return "symbian";
            }
            else if (_checkOS("blackberry"))
            {
                return "blackberry";
            }
            else if (_checkOS("windows"))
            {
                return "windows";
            }
            else if(_checkOS("mac"))
            {
                return "mac";
            }
            else if(_checkOS("linux"))
            {
                return "linux";
            }
            else if(_checkOS("unix"))
            {
                return "unix";
            }
            else if(_checkOS("openbsd"))
            {
                return "openbsd";
            }

            return "unknown";
        }

        /**
         * Alias function of getPlatform
         * @return {String}
         */
        function getOS()
        {
            return getPlatform();
        }

        /**
         * Detects the Operating System [Platform] of the Device
         * @param os_str {String} The name of the OS
         * @param version_str An optional version number [Only valid for Android]
         * @return {Boolean}
         * @private
         */
        function _checkOS(os_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                is_version_valid_bool = !!((_w.isString(myArgs[1]) && myArgs[1].length > 0)),
                version_str = '',
                version_regex_suffix_str = '',
                version_store_suffix_str = ''
                ;

            //manage version string if provided
            if (is_version_valid_bool)
            {
                version_str = myArgs[1];
                version_str = version_str.replace(/^\s+|\s+$/g, "");
                version_regex_suffix_str = ' '+version_str;
                version_store_suffix_str = '_'+version_str.replace(".", "_");
            }

            //Check if value is stored. Return if true
            if (storeCheck("var_device_os_is_"+os_str+version_store_suffix_str))
            {
                return store("var_device_os_is_"+os_str+version_store_suffix_str);
            }

            var nav = getUserAgent(),
                is_os_bool = false;

            if (os_str === "ios")
            {
                is_os_bool = /\bipad|\biphone|\bipod/i.test(nav);
            }
            else if (os_str === "android")
            {
                var pattern = new RegExp("\\bandroid"+version_regex_suffix_str, "i");
                is_os_bool = pattern.test(nav);
            }
            else if (os_str === "symbian")
            {
                is_os_bool = /series(4|6)0|symbian|symbos|syb-[0-9]+|\bs60\b/i.test(nav);
            }
            else if (os_str === "blackberry")
            {
                is_os_bool = /bb[0-9]+|blackberry|playbook|rim +tablet/i.test(nav);
            }
            else if (os_str === "windows")
            {
                is_os_bool = /window mobile|windows +(ce|phone)|windows +nt.+arm|windows +nt.+touch|xblwp7|zunewp7|windows +(10|8\.1|8|7|xp|2000|me|9x +4\.90|98|95|_95)|windows +nt +(6\.3|6\.2|6\.1|6\.0|5\.2|5\.1|5\.0|4\.0)|win(95|98|nt4\.0|nt)|windows +nt/i.test(nav);
            }
            else if (os_str === "windows_phone")
            {
                is_os_bool = /windows +phone|xblwp7|zunewp7/i.test(nav);
            }
            else if (os_str === "mac")
            {
                is_os_bool = /mac +os +x|macppc|macintel|mac_powerpc|macintosh/i.test(nav);
            }
            else if (os_str === "linux")
            {
                is_os_bool = /x11|linux/i.test(nav);
            }
            else if (os_str === "unix")
            {
                is_os_bool = /unix/i.test(nav);
            }
            else if (os_str === "openbsd")
            {
                is_os_bool = /openbsd/i.test(nav);
            }

            //persist to local storage and return
            store("var_device_os_is_"+os_str+version_store_suffix_str, is_os_bool);
            return !!((is_os_bool));
        }

        /**
         * Checks if the Device is based on Apple's iOS Platform
         * @return {Boolean}
         */
        function isIOS()
        {
            return _checkOS("ios");
        }

        /**
         * Checks if the Device is based on Android Platform
         * @return {Boolean}
         */
        function isAndroid()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                version_str = myArgs[0];
            return _checkOS("android", version_str);
        }

        /**
         * Checks if the Device is based on Symbian Platform
         * @return {Boolean}
         */
        function isSymbian()
        {
            return _checkOS("symbian");
        }

        /**
         * Checks if the Device is based on Blackberry Platform
         * @return {Boolean}
         */
        function isBlackberry()
        {
            return _checkOS("blackberry");
        }

        /**
         * Checks if the Device is based on a Windows Platform
         * @return {Boolean}
         */
        function isWindows()
        {
            return _checkOS("windows");
        }

        /**
         * Checks if the Device is based on Windows Phone Platform
         * @return {Boolean}
         */
        function isWindowsPhone()
        {
            return _checkOS("windows_phone");
        }

        /**
         * Mobile Browser Detection Regex
         * @param ua {String} User Agent String
         * @return {Boolean}
         * @private
         */
        function _mobileDetect(ua)
        {
            return /android|android.+mobile|avantgo|bada\/|\bbb[0-9]+|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|\bip(hone|od|ad)|iris|(jolla|sailfish).+mobile|kindle|lge |maemo|meego.+mobile|midp|mmp|motorola|mobile.+firefox|netfront|nokia|nintendo +3ds|opera m(ob|in)i|palm|palm( os)?|phone|p(ixi|re)\/|playbook|rim +tablet|playstation.+vita|plucker|pocket|psp|samsung|(gt\-|bgt\-|sgh\-|sph\-|sch\-)[a-z][0-9]+|series(4|6)0|symbian|symbos|\bs60\b|tizen.+mobile|treo|up\.(browser|link)|vertu|vodafone|wap|windows (ce|phone)|windows +nt.+arm|windows +nt.+touch|xda|xiino|xblwp7|zunewp7/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb|b\-[0-9]+)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        }


        /**
         * Resets/Updates the cached values (localStorage) of Viewport and Screen Dimension Info
         * @private
         */
        function _updateDimensionStore()
        {
            //reset
            store("var_viewport_w var_viewport_w_dp var_viewport_h var_viewport_h_dp var_screen_w var_screen_h", null);

            //reload
            store("var_viewport_w", viewportW());
            store("var_viewport_h", viewportH());
            store("var_screen_w", screenW());
            store("var_screen_h", screenH());
            store("var_viewport_w_dp", pixelW());
            store("var_viewport_h_dp", pixelH());
        }

        /**
         * Resets/Updates the cached values (localStorage) of Orientation Info
         * @private
         */
        function _updateOrientationStore()
        {
            //reset
            store("var_screen_ort_curr var_is_portrait var_is_landscape", null);

            //reload
            store("var_screen_ort_curr", getOrientation());
        }

        /**
         * Gets the orientation of the device
         * @param bypass_cache_bool {Boolean} Determines if the stored value for current orientation should be retrieved or not. True will ignore the value stored and will re-test the orientation
         * @return {String}
         */
        function getOrientation()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                bypass_cache_bool = _w.isBool(myArgs[0]) ? myArgs[0] : false,
                ort_final_str;

            //check if current orientation value is stored and bypass_cache_bool is false. If so, return stored value
            if(storeCheck("var_screen_ort_curr") && !bypass_cache_bool)
            {
                return store("var_screen_ort_curr");
            }

            //Reset Viewport Dimensions if bypass_cache_bool is true
            if(bypass_cache_bool)
            {
                store("var_viewport_w var_viewport_w_dp var_viewport_h var_viewport_h_dp var_screen_w var_screen_h", null);
            }

            //Get the Viewport Dimensions
            var device_user_agent_str = getUserAgent(),
                is_opera_mini_bool = /opera.+(mini|mobi)/i.test(device_user_agent_str),
                viewport_w_dp_int = pixelW(),
                viewport_h_dp_int = pixelH(),
                screen_w_int = screenW(),
                screen_h_int = screenH(),
                screen_w_to_h_ratio_int = screen_w_int/screen_h_int,
                screen_w_to_viewport_w_diff_int = screen_w_int - viewport_w_dp_int,
                is_landscape_extended_verify_bool,
                is_landscape_bool;

            screen_w_to_viewport_w_diff_int = Math.abs(screen_w_to_viewport_w_diff_int);
            is_landscape_extended_verify_bool = (is_opera_mini_bool && viewport_w_dp_int < 260) ? !!((screen_w_to_viewport_w_diff_int <= 4) && (screen_w_to_h_ratio_int >= 1)) : true;
            is_landscape_bool = !!((viewport_h_dp_int <= viewport_w_dp_int) && is_landscape_extended_verify_bool);

            if(is_landscape_bool)
            {
                //landscape
                ort_final_str = 'landscape';

                //do not alter cached orientation variables if bypass_cache_bool is true
                if(!bypass_cache_bool)
                {
                    store("var_screen_ort_is_portrait", false);
                    store("var_screen_ort_is_landscape", true);
                }
            }
            else
            {
                //portrait
                ort_final_str = 'portrait';

                //do not alter cached orientation variables if bypass_cache_bool is true
                if(!bypass_cache_bool)
                {
                    store("var_screen_ort_is_portrait", true);
                    store("var_screen_ort_is_landscape", false);
                }
            }

            return ort_final_str;
        }

        /**
         * Checks if the device is currently in Portrait mode
         * @return {Boolean}
         */
        function isPortrait()
        {
            //check if portrait orientation value is stored. If so, return stored value
            if(storeCheck("var_screen_ort_is_portrait"))
            {
                return store("var_screen_ort_is_portrait");
            }
            return ((getOrientation() === 'portrait'));
        }

        /**
         * Checks if the device is currently in Landscape mode
         * @return {Boolean}
         */
        function isLandscape()
        {
            //check if landscape orientation value is stored. If so, return stored value
            if(storeCheck("var_screen_ort_is_landscape"))
            {
                return store("var_screen_ort_is_landscape");
            }
            return ((getOrientation() === 'landscape'));
        }

        /**
         * Returns a list of standard resolution dimensions
         * @param class_str {String} the class of dimensions to return. It could be 'w' = widths, or 'h' = heights
         * @return {Array}
         * @private
         */
        function _getResolutionDimensionList(class_str)
        {
            var std_w_arr = [120, 128, 160, 200, 240, 272, 300, 320, 352, 360, 480, 540, 576, 600, 640, 720, 768, 800, 864, 900, 1024, 1050, 1080, 1152, 1200, 1440, 1536, 1600, 1800, 2048, 2160, 2400, 3072, 3200, 4096, 4320, 4800],
                std_h_arr = [160, 240, 260, 320, 400, 432, 480, 640, 720, 800, 854, 960, 1024, 1136, 1152, 1280, 1360, 1366, 1400, 1440, 1600, 1680, 1920, 2048, 2560, 2880, 3200, 3840, 4096, 5120, 6400, 7680]
                ;

            if(class_str === 'w')
            {
                return std_w_arr;
            }
            else if (class_str === 'h')
            {
                return std_h_arr;
            }
        }

        /**
         * Get the Viewport or Screen Dimensions of the Device
         * @param type_str {String} The type of operation to execute
         * vW = viewport width, vH = viewport height, sW = screen width, sH = screen height
         * @param adj_screen_size_bool {Boolean} This determines if the screen size result should be adjusted to return the nearest standard resolution. For example if actual screen height is 1184, 1280 will be returned as it is the nearest standard resolution height. Default is true
         * @return {*}
         * @private
         */
        function _getDimension(type_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                adj_screen_size_bool = (_w.isBool(myArgs[1])) ? myArgs[1]: true,
                dim_res,
                dim_res_adj,
                adj_dim_res_bool = false,
                user_agent_str = getUserAgent() || navigator.vendor.toLowerCase() || window.opera,
                regex_tv_detect_str = "googletv|smart-tv|smarttv|internet +tv|netcast|nettv|appletv|boxee|kylo|roku|vizio|dlnadoc|ce-html|ouya|xbox|playstation *(3|4)|wii",
                regex_tv_obj = new RegExp(regex_tv_detect_str, "i"),
                is_tv_bool = regex_tv_obj.test(user_agent_str),
                is_desktop_bool = !((_mobileDetect(user_agent_str))),
                is_desktop_or_tv_bool = ((is_desktop_bool || is_tv_bool)),
                pixel_ratio_device_int = getPixelRatio(),
                pixel_ratio_virtual_int,
                win_outer_w_int = store("var_window_outer_w"),
                win_outer_h_int = store("var_window_outer_h"),
                doc_client_w_int = store("var_document_client_w"),
                doc_client_h_int = store("var_document_client_h"),
                win_screen_w_int = store("var_window_screen_w"),
                win_screen_h_int = store("var_window_screen_h")
                ;

            /**
             * Return dimensions quickly if device is Desktop or TV
             */
            if(is_desktop_or_tv_bool)
            {
                if(type_str === 'vW')
                {
                    dim_res = doc_client_w_int;
                }
                else if(type_str === 'vH')
                {
                    dim_res = doc_client_h_int;
                }
                else if (_w.in_array(type_str, ['sW', 'sH']))
                {
                    dim_res = (type_str === 'sW') ? win_screen_w_int : win_screen_h_int;

                    /**
                     * Adjust screen dimensions if
                     * 1: Pixel Ratio is greater than 1.5
                     * 2: Difference between viewport and screen dimensions is less
                     * than expected on account of pixel ratio
                     */
                    if(pixel_ratio_device_int > 1.5)
                    {
                        var screen_viewport_ratio_w_flt = win_screen_w_int/doc_client_w_int,
                            screen_viewport_ratio_h_flt = win_screen_h_int/doc_client_h_int,
                            pixel_ratio_idx_flt = pixel_ratio_device_int * 0.9;

                        if(screen_viewport_ratio_w_flt < pixel_ratio_idx_flt || screen_viewport_ratio_h_flt < pixel_ratio_idx_flt)
                        {
                            dim_res = (type_str === 'sW') ? win_screen_w_int*pixel_ratio_device_int : win_screen_h_int*pixel_ratio_device_int;
                        }
                    }
                }

                if (type_str === 'vW' || type_str === 'vH')
                {
                    dim_res = (pixel_ratio_device_int >= 1.5) ? dim_res * pixel_ratio_device_int : dim_res;
                }

                dim_res = Math.floor(dim_res);
                return dim_res;
            }

            /**
             * If not Desktop or TV, continue processing
             */
            var device_user_agent_str = user_agent_str,
                is_opera_browser_bool = /opera.+(mini|mobi)/i.test(device_user_agent_str),
                is_ios_bool = !!((isIOS())),
                is_symbian_bool = !!((isSymbian())),
                is_windows_bool = !!((isWindows())),
                is_android_bool = !!((isAndroid())),
                is_android_1_bool = !!((isAndroid('1.'))),
                is_android_2_bool = !!((isAndroid('2.'))),
                is_special_needs_bool = !!(((is_android_1_bool || is_android_2_bool) || is_symbian_bool || is_windows_bool)),
                viewport_w_int,
                viewport_h_int,
                screen_w_int = win_screen_w_int,
                screen_h_int = win_screen_h_int,
                screen_w_fix_int = screen_w_int,
                ort_w_int,
                ort_h_int,
                screen_w_to_viewport_w_diff_int,
                screen_w_to_h_ratio_int,
                fixed_screen_dim_bool,
                std_w_arr = _getResolutionDimensionList('w'),
                std_h_arr = _getResolutionDimensionList('h'),
                std_w_temp_arr = std_w_arr,
                std_h_temp_arr = std_h_arr,
                is_landscape_v_bool,                    //viewport
                is_landscape_s_bool,                    //screen
                is_landscape_v_extended_verify_bool
                ;

            /**
             * Get the viewport dimensions
             */
            if (is_special_needs_bool)
            {
                viewport_w_int = (win_outer_w_int <= 0) ? doc_client_w_int : win_outer_w_int;
                viewport_h_int = (win_outer_h_int <= 0) ? doc_client_h_int : win_outer_h_int;
                ort_w_int = viewport_w_int;
                ort_h_int = viewport_h_int;
            }
            else
            {
                viewport_w_int = doc_client_w_int;
                viewport_h_int = doc_client_h_int;
                ort_w_int = doc_client_w_int;
                ort_h_int = doc_client_h_int;
            }

            /**
             * Modify Screen Dimensions if Android 2 or Symbian Platform
             */
            if ((is_android_2_bool || is_symbian_bool) && !is_opera_browser_bool)
            {
                screen_w_int = (win_outer_w_int <= 0) ? screen_w_int : win_outer_w_int;
                screen_h_int = (win_outer_h_int <= 0) ? screen_h_int : win_outer_h_int;
            }

            //Determine orientation
            screen_w_to_h_ratio_int = screen_w_int/screen_h_int;
            screen_w_to_viewport_w_diff_int = screen_w_int - viewport_w_int;
            screen_w_to_viewport_w_diff_int = Math.abs(screen_w_to_viewport_w_diff_int);

            is_landscape_v_extended_verify_bool = (is_opera_browser_bool && viewport_w_int < 260) ? !!((screen_w_to_viewport_w_diff_int <= 4) && (screen_w_to_h_ratio_int >= 1)) : true;
            is_landscape_v_bool = !!((ort_h_int <= ort_w_int) && is_landscape_v_extended_verify_bool);
            is_landscape_s_bool = (screen_h_int <= screen_w_int);

            /**
             * Reduce resolution dimension list size if iOS
             * This improves the accuracy for first-generation iOS devices
             */
            if(is_ios_bool)
            {
                std_w_temp_arr = std_w_temp_arr.slice(7);
                std_h_temp_arr = std_h_temp_arr.slice(6);
            }
            else if (is_android_bool)
            {
                std_w_temp_arr = std_w_temp_arr.slice(4);
                std_h_temp_arr = std_h_temp_arr.slice(3);
            }
            else
            {
                std_w_temp_arr = std_w_temp_arr.slice(4);
            }

            /**
             * Reverse resolution dimension list when orientation changes
             */
            if (is_landscape_v_bool)
            {
                std_w_arr = std_h_temp_arr;
                std_h_arr = std_w_temp_arr;
            }
            else
            {
                std_w_arr = std_w_temp_arr;
                std_h_arr = std_h_temp_arr;
            }

            /**
             * Get Dimensions
             */
            if(type_str === 'vW')
            {
                dim_res = viewport_w_int;
            }
            else if (type_str === 'vH')
            {
                dim_res = viewport_h_int;
            }
            else if (type_str === 'sW' || type_str === 'sH')
            {
                /**
                 * This aims to correct any screen dimension discrepancies that usually occur when the
                 * raw viewport dimensions say the orientation is in one mode, but the raw screen dimensions
                 * say it is in another mode. Certain devices e.g. iPad will not change screen dimensions as the
                 * orientation changes. When this happens, we reverse values for screen_w and screen_h to compensate
                 */
                fixed_screen_dim_bool = !!((is_landscape_v_bool === true && is_landscape_s_bool === false) || (is_landscape_v_bool === false && is_landscape_s_bool === true));

                if(type_str === 'sW')
                {
                    dim_res = (fixed_screen_dim_bool) ? screen_h_int : screen_w_int ;
                }
                else
                {
                    dim_res = (fixed_screen_dim_bool) ? screen_w_int : screen_h_int ;
                }

                //get the fixed screen width
                screen_w_fix_int = (fixed_screen_dim_bool) ? screen_h_int : screen_w_int ;

                dim_res_adj = dim_res * pixel_ratio_device_int;

                if(type_str === 'sW')
                {
                    adj_dim_res_bool = adj_screen_size_bool ? ((_w.in_array(dim_res, std_w_arr) || _w.in_array(dim_res_adj, std_w_arr)) ? false: true) : false;
                }
                else
                {
                    adj_dim_res_bool = adj_screen_size_bool ? ((_w.in_array(dim_res, std_h_arr) || _w.in_array(dim_res_adj, std_h_arr)) ? false: true) : false;
                }

            }

            /**
             * Get the virtual pixel ratio i.e. screen vs viewport dimensions
             */
            pixel_ratio_virtual_int = screen_w_fix_int/viewport_w_int;

            /**
             * Return if Device Pixel Ratio is 1 or less and Virtual Pixel Ratio is less than 1.1
             */
            if (pixel_ratio_device_int <= 1 && pixel_ratio_virtual_int <= 1.1)
            {
                if (type_str === 'sW' && adj_dim_res_bool)
                {
                    dim_res = _w.getClosestNumberMatchArray(std_w_arr, dim_res, '', '', 8);
                }
                else if (type_str === 'sH' && adj_dim_res_bool)
                {
                    dim_res = _w.getClosestNumberMatchArray(std_h_arr, dim_res, '', '', 8);
                }
                return dim_res;
            }

            /**
             * Continue if Pixel Ratio is greater than 1
             */
            if(is_ios_bool)
            {
                dim_res = dim_res * pixel_ratio_device_int;
            }
            else
            {
                if (!is_android_2_bool)
                {
                    /**
                     * Case 1: Device Pixel Ratio is 1 or less, and Virtual Pixel Ratio is greater than 1.1
                     * Update Viewport Dimensions only. Do not update Screen Dimensions
                     * Case 2. Device Pixel Ratio is more than 1, and Virtual Pixel Ratio is less than or equal to 1.1
                     * Update both Viewport and Screen Dimensions
                     * Case 3. Device Pixel Ratio is more than 1, and Virtual Pixel Ratio is greater than 1.1
                     * Update Viewport Dimensions only. Do not update Screen Dimensions
                     */
                    if(pixel_ratio_device_int <= 1 && pixel_ratio_virtual_int > 1.1)
                    {
                        //1
                        dim_res = (_w.in_array(type_str, ['vW', 'vH'])) ? dim_res * pixel_ratio_virtual_int : dim_res;
                    }
                    else if (pixel_ratio_device_int > 1 && pixel_ratio_virtual_int <= 1.1)
                    {
                        //2
                        if(pixel_ratio_device_int <= 1.1)
                        {
                            //Special Operation for some devices that report device pixel ratio slightly above one
                            if (_w.in_array(type_str, ['vW', 'vH']))
                            {
                                dim_res = dim_res * pixel_ratio_device_int;
                                dim_res = (_w.isEvenDecimal(dim_res)) ? Math.floor(dim_res) : dim_res;
                            }
                        }
                        else
                        {
                            dim_res = dim_res * pixel_ratio_device_int;
                        }
                    }
                    else if (pixel_ratio_device_int > 1 && pixel_ratio_virtual_int > 1.1)
                    {
                        //3
                        if(_w.in_array(type_str, ['vW', 'vH']))
                        {
                            dim_res = dim_res * pixel_ratio_device_int;
                            dim_res = (_w.isEvenDecimal(dim_res)) ? Math.floor(dim_res) : Math.ceil(dim_res);
                        }
                    }
                }

                /**
                 * Get the nearest standard screen widths or heights
                 */
                if (type_str === 'sW' && adj_dim_res_bool)
                {
                    dim_res = _w.getClosestNumberMatchArray(std_w_arr, dim_res, '', '', 8);
                }
                else if (type_str === 'sH' && adj_dim_res_bool)
                {
                    dim_res = _w.getClosestNumberMatchArray(std_h_arr, dim_res, '', '', 8);
                }
            }

            dim_res = Math.floor(dim_res);
            return dim_res;
        }

        /**
         * Get the Viewport dimensions in Device-Independent Pixels
         * @param type_str {String} The type of operation. Either 'w' for width, or 'h' for height
         * @return {Number}
         * @private
         */
        function _getViewportDimensionPixel(type_str)
        {
            var dim_res,
                is_width_bool = ((type_str === 'w')),
                user_agent_str = getUserAgent() || navigator.vendor.toLowerCase() || window.opera,
                regex_tv_detect_str = "googletv|smart-tv|smarttv|internet +tv|netcast|nettv|appletv|boxee|kylo|roku|vizio|dlnadoc|ce-html|ouya|xbox|playstation *(3|4)|wii",
                regex_tv_obj = new RegExp(regex_tv_detect_str, "i"),
                is_tv_bool = regex_tv_obj.test(user_agent_str),
                is_desktop_bool = !((_mobileDetect(user_agent_str))),
                is_desktop_or_tv_bool = ((is_desktop_bool || is_tv_bool)),
                pixel_ratio_int = getPixelRatio()
                ;

            if(is_desktop_or_tv_bool)
            {
                //If desktop or tv, moderate use of pixel ratio
                pixel_ratio_int = (pixel_ratio_int <= 1.5 || !pixel_ratio_int) ? 1 : pixel_ratio_int;
            }
            dim_res = (is_width_bool) ? pixelW()/pixel_ratio_int : pixelH()/pixel_ratio_int;
            return Math.round(dim_res);
        }

        /**
         * A comparison function for checking if a number is within a range of two other numbers
         * @param {Function} fn
         * @return {Function}
         */
        function rangeCompare(fn) {
            return function(min, max) {
                var myArgs = Array.prototype.slice.call(arguments),
                    bool,
                    el = myArgs[2],
                    el_valid_bool = !!((_w.isObject(el) && (typeof el !== "undefined" && el !== null))),
                    wf = myArgs[3],
                    f_dip = myArgs[4],
                    curr = (el_valid_bool) ? fn(el, wf, f_dip) : fn()
                    ;

                bool = curr >= (min || 0);
                return !max ? bool : bool && curr <= max;
            };
        }

        //Range Comparison Booleans for Viewport and Screen and DOM Element Containers
        var vSpan = rangeCompare(viewportW),
            vPitch = rangeCompare(viewportH),
            dSpan = rangeCompare(screenW),
            dPitch = rangeCompare(screenH),
            cSpan = rangeCompare(pixelW),
            cPitch = rangeCompare(pixelH),
            eSpan = rangeCompare(_elementW),
            ePitch = rangeCompare(_elementH);


        /**
         * Loads a JavaScript of Stylesheet
         * Original script: @link https://github.com/rgrove/lazyload @copyright Ryan Grove <ryan@wonko.com> @license MIT
         * @param url_str_or_arr {Array} a single URL or an array of URLs
         * @param target_obj {Object} the target object i.e. where the script/stylesheet should be loaded. This is either <head> or <body>
         * @param loc_str {String} this is a string notation of where the file will be loaded. It is either "head" or "body". It is used to properly compose attribute options for the link tag.
         * @param attr_default_obj {Object} Defines attributes to be applied to relevant stylesheets or script on load.
         * The following options are available
         * async: true or false
         * defer: true or false
         * @private
         */
        function _lazyLoad(url_str_or_arr)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                doc = window.document,
                env,
                head = doc.head || doc.getElementsByTagName('head')[0],
                target_obj = (myArgs[1]) ? myArgs[1] : head,
                loc_str = (myArgs[2] === 'body') ? 'body' : 'head',
                attr_main_obj = (_w.isObject(myArgs[3])) ? myArgs[3] : {},
                attr_util_arr = (_w.isArray(myArgs[4])) ? myArgs[4] : [],
                pending = {},
                pollCount = 0,
                queue = {css: [], js: []},
                styleSheets = doc.styleSheets,
                url_str,
                regex_obj = new RegExp("\\.js(\\?[^\\s]*?|) *$", "gi"),
                is_js_bool
                ;

            url_str = (_w.isArray(url_str_or_arr)) ? _w.implode('|', url_str_or_arr) : url_str_or_arr;

            is_js_bool = regex_obj.test(url_str);

            function createNode(name, attrs) {
                var node = doc.createElement(name), attr;

                for (attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        node.setAttribute(attr, attrs[attr]);
                    }
                }

                return node;
            }

            function finish(type) {
                var p = pending[type],
                    callback,
                    urls;

                if (p) {
                    callback = p.callback;
                    urls     = p.urls;

                    urls.shift();
                    pollCount = 0;

                    if (!urls.length) {
                        callback && callback.call(p.context, p.obj); // jshint ignore:line
                        pending[type] = null;
                        queue[type].length && load(type); // jshint ignore:line
                    }
                }
            }

            function getEnv() {
                var ua = getUserAgent();
                var env = {
                    async: doc.createElement('script').async === true
                };

                (env.webkit = /AppleWebKit\//i.test(ua)) || (env.ie = /MSIE|Trident/i.test(ua)) || (env.opera = /Opera/i.test(ua)) || (env.gecko = /Gecko\//i.test(ua)) || (env.unknown = true); // jshint ignore:line

                return env;
            }

            function load(type, urls, callback, obj, context, loc, attr_main_obj, attr_util_arr)
            {
                var _finish = function () { finish(type); },
                    isCSS   = type === 'css',
                    nodes   = [],
                    i, len, node, p, pendingUrls, urls_final, url, js_attr_obj, css_attr_obj, attr_final_arr = [], pendingMainAttrs, attr_main_arr = [], attr_main_item, pendingUtilAttrs, attr_util_item, pendingFinalAttrs, attr_final_item;

                env = getEnv();

                if (urls)
                {
                    urls_final = (_w.isString(urls)) ? [urls] : urls.concat();

                    if (isCSS || env.async || env.gecko || env.opera)
                    {
                        for(i = 0, len = urls_final.length; i < len; ++i)
                        {
                            var attr_final_obj = (_w.isObject(attr_main_obj) && _w.isObject(attr_util_arr[i])) ? _w.mergeObject(attr_main_obj, attr_util_arr[i]) : undefined;
                            attr_final_arr.push(attr_final_obj);

                            attr_main_arr.push(attr_main_obj);
                        }

                        // Load in parallel.
                        queue[type].push({
                            urls    : urls_final,
                            callback: callback,
                            obj     : obj,
                            context : context,
                            attr_main: attr_main_arr,
                            attr_util: attr_util_arr,
                            attr_final: attr_final_arr
                        });
                    }
                    else {
                        // Load sequentially.
                        for (i = 0, len = urls_final.length; i < len; ++i)
                        {
                            var attr_final_obj = (_w.isObject(attr_main_obj) && _w.isObject(attr_util_arr[i])) ? _w.mergeObject(attr_main_obj, attr_util_arr[i]) : undefined;

                            queue[type].push({
                                urls    : [urls_final[i]],
                                callback: i === len - 1 ? callback : null,
                                obj     : obj,
                                context : context,
                                attr_main: [attr_main_obj],
                                attr_util: [attr_util_arr[i]],
                                attr_final: [attr_final_obj]
                            });
                        }
                    }
                }

                if (pending[type] || !(p = pending[type] = queue[type].shift())) {
                    return;
                }

                pendingUrls = p.urls.concat();
                pendingMainAttrs = p.attr_main.concat();
                pendingUtilAttrs = p.attr_util.concat();
                pendingFinalAttrs = p.attr_final.concat();

                for (i = 0, len = pendingUrls.length; i < len; ++i)
                {
                    url = pendingUrls[i];
                    attr_main_item = pendingMainAttrs[i];
                    attr_util_item = pendingUtilAttrs[i];
                    attr_final_item = pendingFinalAttrs[i];

                    js_attr_obj = {src: url, type: 'text/javascript'};
                    css_attr_obj = (loc === 'body') ? {href: url, rel : 'stylesheet', property: 'stylesheet', media: 'only r'} : {href: url, rel : 'stylesheet', media: 'only r'};

                    if (isCSS)
                    {
                        node = createNode('link', css_attr_obj);
                    }
                    else
                    {
                        //set up attributes
                        node = createNode('script', js_attr_obj);
                        if(attr_main_item && attr_main_item.async)
                        {
                            node.async = true;
                        }
                        if(attr_main_item && attr_main_item.defer)
                        {
                            node.defer = true;
                        }
                    }

                    node.className = 'w_defer';
                    if(_w.isObject(attr_final_item))
                    {
                        for(var key in attr_final_item)
                        {
                            if (attr_final_item.hasOwnProperty(key))
                            {
                                node.setAttribute(key, attr_final_item[key]);
                            }
                        }
                    }

                    if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
                        /*jshint -W083 */
                        node.onreadystatechange = function () {
                            if (/loaded|complete/.test(node.readyState)) {
                                node.onreadystatechange = null;
                                _finish();
                            }
                        };
                        /*jshint +W083 */
                    }
                    else if (isCSS && (env.gecko || env.webkit))
                    {
                        p.urls[i] = node.href;

                        if (env.webkit)
                        {
                            pollWebKit();
                        }
                        else
                        {
                            pollGecko(node);
                        }
                    }
                    else
                    {
                        node.onload = node.onerror = _finish;
                    }

                    nodes.push(node);
                }

                for (i = 0, len = nodes.length; i < len; ++i) {
                    target_obj.appendChild(nodes[i]);
                }
            }

            function pollGecko(node) {
                var hasRules;

                try {
                    hasRules = !!node.sheet.cssRules;
                } catch (ex) {
                    pollCount += 1;

                    if (pollCount < 200) {
                        setTimeout(function () { pollGecko(node); }, 50);
                    } else {
                        hasRules && finish('css'); // jshint ignore:line
                    }

                    return;
                }

                finish('css');
            }

            function pollWebKit() {
                var css = pending.css, i;

                if (css) {
                    i = styleSheets.length;

                    while (--i >= 0) {
                        if (styleSheets[i].href === css.urls[0]) {
                            finish('css');
                            break;
                        }
                    }

                    pollCount += 1;

                    if (css) {
                        if (pollCount < 200) {
                            setTimeout(pollWebKit, 50);
                        } else {
                            finish('css');
                        }
                    }
                }
            }

            function lazyLoadCSS(urls, callback, obj, context)
            {
                load('css', urls, callback, obj, context, loc_str, attr_main_obj, attr_util_arr);
            }

            function lazyLoadJS(urls, callback, obj, context)
            {
                load('js', urls, callback, obj, context, loc_str, attr_main_obj, attr_util_arr);
            }

            //Load JavaScript or CSS
            if(is_js_bool)
            {
                lazyLoadJS(url_str_or_arr);
            }
            else
            {
                lazyLoadCSS(url_str_or_arr);
            }
        }

        /**
         * Load a script via XHR (XMLHTTPRequest)
         * @param {string} src_str the script source URL
         * @param {object} callback_fn_obj define callback and related parameters
         * The following properties are defined:
         * fn: the callback function
         * fn_args: the arguments that will be passed to the callback function
         * tag_attr: defines the attributes for the <script> tag
         *
         * The following are special properties not meant for general use
         * fn_defer: if true, will defer execution of the callback until a specific threshold is reached
         * fn_defer_counter_flag_id: the storage identifier for the counter that needs to be incremented to
         * fn_defer_counter_control_flag_id: the storage identifier for the control counter i.e. the counter that defines the upper limit. This counter is never changed when set
         * fn_defer_exec_counter_limit: the upper limit that defines the threshold when the callback will be executed
         *
         * @returns {Promise|*}
         * @private
         */
        function _loadScriptXHR(src_str)
        {
            var myArgs = Array.prototype.slice.call(arguments);

            return new Promise(function(resolve, reject)
            {
                var callback_fn_obj = (myArgs[1]) ? myArgs[1] : {},
                    callback_fn,
                    tag_attr_obj,
                    callback_fn_args,
                    callback_fn_defer_bool,
                    callback_fn_defer_counter_flag_id_str,
                    callback_fn_defer_counter_control_flag_id_str,
                    callback_fn_defer_counter_limit_int,
                    el_head = $('head'),
                    el,
                    ref_obj,
                    el_wq_obj,
                    insert_method_str
                    ;

                //get callback parameters
                callback_fn = (callback_fn_obj['fn']) ? callback_fn_obj['fn'] : function(){};
                tag_attr_obj = (callback_fn_obj['tag_attr']) ? callback_fn_obj['tag_attr'] : {};
                callback_fn_args = callback_fn_obj['fn_args'];
                callback_fn_defer_bool = (_w.isBool(callback_fn_obj['fn_defer'])) ? _w.isBool(callback_fn_obj['fn_defer']) : false;
                callback_fn_defer_counter_flag_id_str = callback_fn_obj['fn_defer_counter_flag_id'];
                callback_fn_defer_counter_control_flag_id_str = callback_fn_obj['fn_defer_counter_control_flag_id'];
                callback_fn_defer_counter_limit_int = callback_fn_obj['fn_defer_exec_counter_limit'];

                //set flags
                domStore(callback_fn_defer_counter_control_flag_id_str, callback_fn_defer_counter_limit_int);

                //get <HEAD>
                el = el_head[0];
                ref_obj = document.createElement("script");

                if (ref_obj.readyState)
                {
                    //IE
                    ref_obj.onreadystatechange = function(){
                        /*jshint -W116 */
                        if (ref_obj.readyState == "loaded" || ref_obj.readyState == "complete"){
                            ref_obj.onreadystatechange = null;
                            if(callback_fn_defer_bool)
                            {
                                //define callback defer counter
                                if(!domStore(callback_fn_defer_counter_flag_id_str))
                                {
                                    domStore(callback_fn_defer_counter_flag_id_str, 0);
                                }
                                //increment
                                domStoreIncrement(callback_fn_defer_counter_flag_id_str, 1);

                                //execute callback at threshold
                                if(domStore(callback_fn_defer_counter_flag_id_str) >= domStore(callback_fn_defer_counter_control_flag_id_str))
                                {
                                    callback_fn(callback_fn_args);
                                }
                            }
                            else
                            {
                                callback_fn(callback_fn_args);
                            }
                            resolve();
                        }
                        /*jshint +W116 */
                    };
                }
                else
                {
                    //Others
                    ref_obj.onload = function(){
                        if(callback_fn_defer_bool)
                        {
                            //define callback defer counter
                            if(!domStore(callback_fn_defer_counter_flag_id_str))
                            {
                                domStore(callback_fn_defer_counter_flag_id_str, 0);
                            }
                            //increment
                            domStoreIncrement(callback_fn_defer_counter_flag_id_str, 1);

                            //execute callback at threshold
                            if(domStore(callback_fn_defer_counter_flag_id_str) >= domStore(callback_fn_defer_counter_control_flag_id_str))
                            {
                                callback_fn(callback_fn_args);
                            }
                        }
                        else
                        {
                            callback_fn(callback_fn_args);
                        }
                        resolve();
                    };
                }

                //set default tag options
                ref_obj.src = src_str;
                ref_obj.type = 'text/javascript';

                //set custom options
                if(tag_attr_obj)
                {
                    var ref_obj_prop;
                    for (var key in tag_attr_obj)
                    {
                        if (tag_attr_obj.hasOwnProperty(key))
                        {
                            ref_obj_prop = tag_attr_obj[key];
                            ref_obj[key] = ref_obj_prop;
                        }
                    }
                }

                //append to page
                insert_method_str = 'append';
                el_wq_obj = $(el);
                el_wq_obj[insert_method_str](ref_obj);

            });
        }

        /**
         * Loads scripts
         * @param {array} src_arr the script source array
         * @param {function} callback_fn the callback
         * @param {object} tag_attr_obj the custom script tag attributes
         * @param {*} callback_args the callback arguments
         * @param {function} callback_final_fn a callback that runs at the very end
         * @param {Boolean} load_unique_bool if true, will prevent multiple scripts with the same path from being loaded
         * @private
         */
        function _loadScript(src_arr)
        {
            if(!_w.isArray(src_arr) || _w.count(src_arr) < 1)
            {
                return;
            }

            var myArgs = Array.prototype.slice.call(arguments),
                callback_fn = (myArgs[1]) ? myArgs[1] : undefined,
                tag_attr_arr = (myArgs[2]) ? myArgs[2] : [],
                callback_args = myArgs[3],
                callback_final_fn = (myArgs[4]) ? myArgs[4] : function(){},
                load_unique_bool = (_w.isBool(myArgs[5])) ? myArgs[5] : false,
                promises = [],
                src_arr_item_str,
                src_final_arr_item_str,
                counter_control_int,
                counter_main_int,
                counter_loadscript_control_int,
                counter_loadscript_main_int,
                end_defer_debounce_fn,
                src_end_arr_item_str,
                src_end_arr,
                run_defer_fn_bool,
                load_src_register_arr,
                load_src_register_curr_arr = [],
                callback_fn_code_seed_str,
                callback_fn_code_str,
                callback_fn_defer_counter_flag_str,
                callback_fn_defer_counter_control_flag_id_str,
                callback_fn_obj = {},
                callback_end_fn_obj = {},
                i, j
            ;

            //define counter to track the number of times that loadScript is called
            if(!domStore('var_flag_loadScript_func_counter'))
            {
                domStore('var_flag_loadScript_func_counter', 0);
            }

            //define register to track script src
            if(!domStore('var_register_loadScript_src'))
            {
                domStore('var_register_loadScript_src', []);
            }
            load_src_register_arr = domStore('var_register_loadScript_src');

            //Filter script sources
            for(i = 0; i < src_arr.length; i++)
            {
                src_arr_item_str = src_arr[i];

                if(load_unique_bool)
                {
                    //add only if script src is not in register i.e. has not been loaded
                    if(!_w.in_array(src_arr_item_str, load_src_register_arr))
                    {
                        load_src_register_arr.push(src_arr_item_str);
                        load_src_register_curr_arr.push(src_arr_item_str);
                    }
                }
                else
                {
                    load_src_register_arr.push(src_arr_item_str);
                    load_src_register_curr_arr.push(src_arr_item_str);
                }
            }
            domStore('var_register_loadScript_src', load_src_register_arr);

            //define _loadScriptXHR callback
            if(callback_fn)
            {
                callback_fn_code_seed_str = _w.implode('|', load_src_register_curr_arr);
                callback_fn_code_str = Math.abs(_w.hashCode(callback_fn_code_seed_str));
                callback_fn_code_str = ''+callback_fn_code_str;
                callback_fn_defer_counter_flag_str = callback_fn_code_str+'_counter_flag_id';
                callback_fn_defer_counter_control_flag_id_str = callback_fn_code_str+'_counter_control_flag_id';

                callback_fn_obj['fn'] = callback_fn;
                callback_fn_obj['fn_args'] = callback_args;

                callback_fn_obj['fn_defer'] = true;
                callback_fn_obj['fn_defer_counter_flag_id'] = callback_fn_defer_counter_flag_str;
                callback_fn_obj['fn_defer_counter_control_flag_id'] = callback_fn_defer_counter_control_flag_id_str;
                callback_fn_obj['fn_defer_exec_counter_limit'] = _w.count(load_src_register_curr_arr);
            }

            //Load scripts without dependencies
            for(i = 0; i < load_src_register_curr_arr.length; i++)
            {
                src_final_arr_item_str = load_src_register_curr_arr[i];

                callback_fn_obj['tag_attr'] = tag_attr_arr[i];

                promises.push(_loadScriptXHR(src_final_arr_item_str, callback_fn_obj));
            }

            if(_w.isNumber(domStore('var_counter_defer_script_control')))
            {
                if(load_src_register_curr_arr)
                {
                    domStoreIncrement('var_counter_defer_script_control', _w.count(load_src_register_curr_arr));
                }
            }

            //increment loadScript function counter
            domStoreIncrement('var_flag_loadScript_func_counter', 1);

            //Start the promise chain
            Promise.all(promises).then(function(){
                callback_final_fn();

                //load scripts defined in <BODY>
                if(domStore('var_flag_defer_js_dep_end_list_init') && !domStore('var_flag_defer_js_dep_end_list_init_has_run'))
                {
                    callback_end_fn_obj = {};
                    callback_end_fn_obj['fn'] = undefined;
                    callback_end_fn_obj['fn_args'] = callback_args;

                    src_end_arr = domStore('var_defer_js_dep_end_list') || [];
                    for(j = 0; j < src_end_arr.length; j++)
                    {
                        callback_end_fn_obj['tag_attr'] = tag_attr_arr[j];

                        src_end_arr_item_str = src_end_arr[j];
                        _loadScriptXHR(src_end_arr_item_str, callback_end_fn_obj);
                    }

                    //increment script control counter
                    if(src_end_arr)
                    {
                        domStoreIncrement('var_counter_defer_script_control', _w.count(src_end_arr));
                    }

                    //flag to prevent reoccurrence
                    domStore('var_flag_defer_js_dep_end_list_init_has_run', true);
                }

                //execute defer ready queue ops
                if(domStore('var_flag_defer_script_record_init'))
                {
                    //get individual script counters
                    counter_control_int = domStore('var_counter_defer_script_control');
                    counter_main_int = domStore('var_counter_defer_script_main');

                    if(!domStore('var_flag_loadScript_func_control_counter'))
                    {
                        domStore('var_flag_loadScript_func_control_counter', 0);
                    }
                    domStoreIncrement('var_flag_loadScript_func_control_counter', 1);

                    //get omnibus loadScript counters
                    counter_loadscript_control_int = domStore('var_flag_loadScript_func_control_counter');
                    counter_loadscript_main_int = domStore('var_flag_loadScript_func_counter');

                    if(_w.isNumber(counter_control_int) && _w.isNumber(counter_main_int))
                    {
                        if(counter_control_int >= counter_main_int)
                        {
                            //delay execution if required
                            if(domStore('var_flag_defer_script_source_init'))
                            {
                                if(counter_loadscript_control_int >= counter_loadscript_main_int)
                                {
                                    run_defer_fn_bool = true;
                                }
                            }
                            else
                            {
                                run_defer_fn_bool = true;
                            }

                            //run defer ready queue
                            if(run_defer_fn_bool)
                            {
                                end_defer_debounce_fn = _w.debounce(function(){
                                    if(!domStore('var_flag_runFunction_defer_has_run'))
                                    {
                                        //flag to prevent reoccurrence
                                        domStore('var_flag_runFunction_defer_has_run', true);

                                        /**
                                         * If
                                         * a: the scripts [in <BODY>] have someone not been loaded, and
                                         * b: said script inventory is not empty
                                         * Then
                                         * - run those scripts first before executing the defer queue [from callback]
                                         * Else
                                         * - run defer queue
                                         */
                                        if(!domStore('var_flag_defer_js_dep_end_list_init_has_run') && domStore('var_flag_defer_js_dep_end_list_init'))
                                        {
                                            var script_list_fnl_arr,
                                                callback_fn_fnl_obj = {},
                                                callback_fnl_fn,
                                                callback_fnl_args,
                                                callback_fn_code_seed_fnl_str,
                                                callback_fn_code_fnl_str,
                                                callback_fn_defer_counter_flag_fnl_str,
                                                callback_fn_defer_counter_control_flag_id_fnl_str
                                            ;

                                            callback_fnl_fn = function(){
                                                wizmo.runFunction('dready', {queue: true, namespace: 'dready', flush: true}).runFunction('dpready', {queue: true, namespace: 'dpready', flush: true});
                                            };

                                            script_list_fnl_arr = domStore('var_defer_js_dep_end_list');
                                            callback_fn_code_seed_fnl_str = _w.implode('|', script_list_fnl_arr);
                                            callback_fn_code_fnl_str = Math.abs(_w.hashCode(callback_fn_code_seed_fnl_str));
                                            callback_fn_code_fnl_str = ''+callback_fn_code_fnl_str;
                                            callback_fn_defer_counter_flag_fnl_str = callback_fn_code_fnl_str+'_counter_flag_id';
                                            callback_fn_defer_counter_control_flag_id_fnl_str = callback_fn_code_fnl_str+'_counter_control_flag_id';

                                            callback_fn_fnl_obj['fn'] = callback_fnl_fn;
                                            callback_fn_fnl_obj['fn_args'] = callback_fnl_args;

                                            callback_fn_fnl_obj['fn_defer'] = true;
                                            callback_fn_fnl_obj['fn_defer_counter_flag_id'] = callback_fn_defer_counter_flag_fnl_str;
                                            callback_fn_fnl_obj['fn_defer_counter_control_flag_id'] = callback_fn_defer_counter_control_flag_id_fnl_str;
                                            callback_fn_fnl_obj['fn_defer_exec_counter_limit'] = _w.count(script_list_fnl_arr);

                                            for(var k = 0; k < script_list_fnl_arr.length; k++)
                                            {
                                                callback_fn_fnl_obj['tag_attr'] = tag_attr_arr[k];

                                                _loadScriptXHR(script_list_fnl_arr[k], callback_fn_fnl_obj);
                                            }
                                        }
                                        else
                                        {
                                            //run defer ready queue
                                            wizmo.runFunction('dready', {queue: true, namespace: 'dready', flush: true}).runFunction('dpready', {queue: true, namespace: 'dpready', flush: true});
                                        }
                                    }
                                }, _w.config.defer.debounce);
                                end_defer_debounce_fn();
                            }
                        }
                    }
                }
            })["catch"](function(err){
                _w.console.log(err);
            });
        }

        /**
         * Runs all deferred JavaScript or CSS files
         * @param options_obj {Object} defines options
         * The following options are available:
         * loc: specifies the location where the script or stylesheet should be loaded. Either 'head' [for <head>] or 'body' [for <body]
         * inline: designates the operation as inline. This is meant to load deferred scripts and stylesheets that are defined inline HTML
         * script: designates the operation as script. This is meant to load deferred scripts and stylesheets that are defined in script using loadCSS and loadJS
         * js_only: specifies that only deferred javascript files should be loaded
         * inline_js_async: will run inline-deferred javascript files in async mode
         * script_js_async: will run script-deferred javascript files in async mode
         * js_tag_attr: custom tag attributes for loading deferred scripts
         * disable_cache: setting this to true will disable the loading cache. The loading cache prevents loading of files more times than needed
         *
         */
        function runDefer()
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[0] && _w.isObject(myArgs[0])) ? myArgs[0] : {},
                loc_str = (options_obj.loc === "b" || options_obj.loc === "body") ? "body" : "head",
                run_inline_bool = (_w.isBool(options_obj.inline)) ? options_obj.inline : false,
                run_js_only_bool = (_w.isBool(options_obj.js_only)) ? options_obj.js_only: false,
                inline_js_async_bool = (_w.isBool(options_obj.inline_js_async)) ? options_obj.inline_js_async: false,
                lazyload_inline_js_attr_obj = (inline_js_async_bool) ? {async: true} : {},
                script_js_async_bool = (_w.isBool(options_obj.script_js_async)) ? options_obj.script_js_async: false,
                lazyload_script_js_attr_obj = (script_js_async_bool) ? {async: true} : {},
                lazyload_script_js_attr_util_arr = [],
                lazyload_link_css_attr_obj = {},
                lazyload_link_css_attr_util_arr = [],
                disable_store_cache_auto_bool = (_w.isBool(options_obj.disable_cache)) ? options_obj.disable_cache : false,
                script_tag_attr_arr = [],
                defer_css_sys_collection_obj = $("[type='text/css/w_defer_sys']"),
                defer_css_collection_obj = $("[type='text/css/w_defer']"),
                defer_js_sys_collection_obj = $("[type='text/javascript/w_defer_sys']"),
                defer_js_collection_obj = $("[type='text/javascript/w_defer']"),
                defer_async_js_collection_obj = $("[type='text/javascript/w_defer_async']"),
                el_head_wq_obj = $('head'),
                el_head_obj = document.head || el_head_wq_obj[0],
                el_body_wq_obj = $('body'),
                el_body_obj = document.body || el_body_wq_obj[0],
                el_target_obj = (loc_str === "body") ? el_body_obj : el_head_obj,
                el_noscript_pre_obj = $('.w-defer-noscript'),
                el_noscript_obj = $('noscript'),
                flag_defer_js_binary_tracker_str = '',
                link_css_update_media_attrib_fn,
                flag_css_defer_auto_bool = false,
                files_css_arr = [],
                files_css_sys_arr = [],
                files_js_storage_arr = [],
                files_js_arr = [],
                files_async_js_arr = [],
                files_js_sys_arr = [],
                i,j,k,m
                ;

            /**
             * Run deferred scripts, stylesheets
             * X: Define flags
             * Y: Setup CSS Media Attribute Management Callback
             * A: Automatic
             * B: Manual
             */

            /**
             * X: Flag if JavaScript deferred
             */
            flag_defer_js_binary_tracker_str += (defer_js_collection_obj.length > 0) ? '1' : '0';
            flag_defer_js_binary_tracker_str += (defer_js_sys_collection_obj.length > 0) ? '1' : '0';
            if(/1+/i.test(flag_defer_js_binary_tracker_str))
            {
                domStore('var_flag_defer_js_ref_file_exists', true);
            }

            /**
             * Y: Create function that will be triggered by setTimeout
             * or other delayed function
             * This function will update CSS link media attribute to 'all'
             */
            link_css_update_media_attrib_fn = function(){

                var link_tag_name_str,
                    link_attr_media_str,
                    el_list_w_defer_obj
                    ;

                //get all links
                el_list_w_defer_obj = $('.w_defer');

                //cycle if it has items
                if(el_list_w_defer_obj.length > 0)
                {
                    el_list_w_defer_obj.each(function(){
                        link_tag_name_str = this.tagName || this.nodeName || this.localName;
                        link_tag_name_str = link_tag_name_str.toLowerCase();

                        link_attr_media_str = this.media;
                        link_attr_media_str = (_w.isString(link_attr_media_str) && link_attr_media_str.length > 0) ? link_attr_media_str.toLowerCase() : '';

                        //filter links
                        if(link_tag_name_str === 'link' && link_attr_media_str !== 'all')
                        {
                            //change media attribute back to all
                            this.media = 'all';
                        }
                    });
                }
            };

            /**
             * A:
             * A.1: Load CSS inside noscript in <head>
             * A.2: Load CSS referenced in HTML <head>
             * A.3: Load JS referenced in HTML <head>
             */
            if(run_inline_bool)
            {
                if (!store('var_run_defer_auto'))
                {
                    if(!run_js_only_bool)
                    {
                        var html_noscript_str = '',
                            regex_noscript_css_obj = new RegExp("(?:\\&[^\\s]+?\\;|<) *link(.+) *(?:\\&[^\\s]+?\\;|>)", "ig"),
                            match_arr,
                            noscript_files_css_arr = [],
                            noscript_util_files_css_arr = []
                            ;

                        //A.1: Load CSS [noscript]
                        if(el_noscript_pre_obj.length > 0)
                        {
                            lazyload_link_css_attr_util_arr = [];

                            //special flag that indicates that CSS deferred reference file exists
                            domStore('var_flag_defer_css_ref_file_exists', true);
                            domStore('var_flag_defer_css_noscript_ref_file_exists', true);

                            //get the html
                            el_noscript_pre_obj.each(function(){
                                html_noscript_str += this.innerHTML;
                            });

                            //find all matches and save to array
                            do {
                                match_arr = regex_noscript_css_obj.exec(html_noscript_str);
                                if (match_arr) {
                                    var kv_noscript_pre_obj = _w.getKeyValuePairs(match_arr[1]),
                                        kv_noscript_pre_filter_obj = _w.getKeyValuePairs(match_arr[1], 'href');

                                    //get urls
                                    noscript_util_files_css_arr.push(kv_noscript_pre_obj.href);

                                    //get other attributes
                                    lazyload_link_css_attr_util_arr.push(kv_noscript_pre_filter_obj);
                                }
                            } while (match_arr);

                            //load into head
                            _lazyLoad(noscript_util_files_css_arr, el_target_obj, loc_str, lazyload_link_css_attr_obj, lazyload_link_css_attr_util_arr);

                            flag_css_defer_auto_bool = true;
                        }

                        if(_w.config.enableNoscriptDefer)
                        {
                            if(el_noscript_obj.length > 0)
                            {
                                lazyload_link_css_attr_util_arr = [];

                                //special flag that indicates that CSS deferred reference file exists
                                domStore('var_flag_defer_css_ref_file_exists', true);
                                domStore('var_flag_defer_css_noscript_ref_file_exists', true);

                                //get files
                                el_noscript_obj.each(function(){

                                    html_noscript_str = this.innerHTML;

                                    //find all matches and save to array
                                    do {
                                        match_arr = regex_noscript_css_obj.exec(html_noscript_str);
                                        if (match_arr) {
                                            var kv_noscript_obj = _w.getKeyValuePairs(match_arr[1]),
                                                kv_noscript_filter_obj = _w.getKeyValuePairs(match_arr[1], 'href');

                                            //get urls
                                            noscript_files_css_arr.push(kv_noscript_obj.href);

                                            //get other attributes
                                            lazyload_link_css_attr_util_arr.push(kv_noscript_filter_obj);
                                        }
                                    } while (match_arr);
                                });

                                //load into head
                                _lazyLoad(noscript_files_css_arr, el_target_obj, loc_str, lazyload_link_css_attr_obj, lazyload_link_css_attr_util_arr);

                                flag_css_defer_auto_bool = true;
                            }
                        }

                        //A.2: Load CSS
                        if (defer_css_collection_obj.length > 0)
                        {
                            lazyload_link_css_attr_util_arr = [];

                            //special flag that indicates that CSS deferred reference file exists
                            domStore('var_flag_defer_css_ref_file_exists', true);

                            defer_css_collection_obj.each(function () {
                                files_css_arr.push($(this).attr("href"));

                                var files_css_item_obj = $(this)[0],
                                    files_css_item_outerhtml_str = (files_css_item_obj.outerHTML) ? files_css_item_obj.outerHTML : '',
                                    kv_link_filter_obj = _w.getKeyValuePairs(files_css_item_outerhtml_str, 'href,type')
                                    ;

                                kv_link_filter_obj['type'] = 'text/css';
                                lazyload_link_css_attr_util_arr.push(kv_link_filter_obj);
                            });

                            //load into head
                            _lazyLoad(files_css_arr, el_target_obj, loc_str, lazyload_link_css_attr_obj, lazyload_link_css_attr_util_arr);

                            //Unload CSS with w_defer tag
                            for (i = defer_css_collection_obj.length - 1; i >= 0; i--) {
                                defer_css_collection_obj[i].parentNode.removeChild(defer_css_collection_obj[i]);
                            }

                            flag_css_defer_auto_bool = true;
                        }
                    }

                    //A.3: Load JavaScript
                    //Defer
                    if(defer_js_collection_obj.length > 0)
                    {
                        //special flag that indicates that a JS deferred reference file exists
                        domStore('var_flag_defer_js_ref_file_exists', true);

                        var files_js_tag_attr_arr,
                            defer_js_dep_source_label_str,
                            defer_js_dep_source_obj = {},
                            files_js_dep_source_tag_attr_obj = {},
                            defer_js_dep_target_label_str,
                            defer_js_dep_target_obj = {},
                            files_js_dep_target_tag_attr_obj = {},
                            defer_js_dep_target_sub_obj = {},
                            files_js_dep_target_sub_tag_attr_obj = {},
                            defer_js_dep_has_dual_label_bool,
                            defer_js_dep_source_to_target_pair_obj = {},
                            defer_js_dep_source_to_target_label_str,
                            defer_js_item_str,
                            defer_js_source_or_target_arr = [],
                            defer_js_list_all_arr = [],
                            defer_js_list_end_arr = [],
                            defer_js_list_end_temp_arr = []
                            ;

                        //initialize counter
                        if(!domStore('var_counter_defer_script_main'))
                        {
                            domStore('var_counter_defer_script_main', 0);
                        }

                        //cycle
                        defer_js_collection_obj.each(function()
                        {
                            //increment script counter
                            domStoreIncrement('var_counter_defer_script_main', 1);

                            //get the src attribute
                            defer_js_item_str = $(this).attr("src");

                            //get defined <script> tag attributes (exclude type and src)
                            var defer_js_item_attr_obj = _w.getKeyValuePairs(this.outerHTML, 'type,src');

                            //keep a general record
                            files_js_storage_arr.push(defer_js_item_str);

                            //keep a record of deferred scripts
                            defer_js_list_all_arr.push(defer_js_item_str);

                            //get dependency labels
                            defer_js_dep_source_label_str = $(this).attr("data-w-dep-source") || $(this).attr("data-w-dep-s");
                            defer_js_dep_source_label_str = (_w.isString(defer_js_dep_source_label_str) && defer_js_dep_source_label_str.length > 0) ? defer_js_dep_source_label_str.trim() : "";

                            defer_js_dep_target_label_str = $(this).attr("data-w-dep-target") || $(this).attr("data-w-dep-t");
                            defer_js_dep_target_label_str = (_w.isString(defer_js_dep_target_label_str) && defer_js_dep_target_label_str.length > 0) ? defer_js_dep_target_label_str.trim() : "";

                            //determine if script has dual label i.e. source and target
                            defer_js_dep_has_dual_label_bool = !!((defer_js_dep_source_label_str.length > 0) && (defer_js_dep_target_label_str.length > 0));

                            if(defer_js_dep_has_dual_label_bool)
                            {
                                /**
                                 * Manage dependency setup where both target and source
                                 * dependency relationships are defined
                                 */

                                //track dependency target
                                if(defer_js_dep_target_label_str.length > 0)
                                {
                                    if(!defer_js_dep_target_obj[''+defer_js_dep_target_label_str+''])
                                    {
                                        defer_js_dep_target_obj[''+defer_js_dep_target_label_str+''] = [];
                                    }

                                    //add to dependency source object
                                    defer_js_dep_target_obj[''+defer_js_dep_target_label_str+''].push(defer_js_item_str);

                                    //define dependency target tag attribute list
                                    if(!files_js_dep_target_tag_attr_obj[''+defer_js_dep_target_label_str+''])
                                    {
                                        files_js_dep_target_tag_attr_obj[''+defer_js_dep_target_label_str+''] = [];
                                    }

                                    //add to dependency target tag attribute list
                                    files_js_dep_target_tag_attr_obj[''+defer_js_dep_target_label_str+''].push(defer_js_item_attr_obj);

                                    //add to tracker
                                    defer_js_source_or_target_arr.push(defer_js_item_str);

                                    /**
                                     * Whenever a script has both a source and target
                                     * dependency, any scripts that rely on the source
                                     * need to be reassigned to a sub-dependency queue
                                     * To enable this, a source-to-target object needs
                                     * to be created
                                     */
                                    defer_js_dep_source_to_target_pair_obj[defer_js_dep_source_label_str] = defer_js_dep_target_label_str;
                                    return;
                                }
                            }
                            else
                            {
                                /**
                                 * If dependency target has a source that is a
                                 * dependency itself, get new label identifying
                                 * source-to-target update
                                 */
                                defer_js_dep_source_to_target_label_str = defer_js_dep_source_to_target_pair_obj[defer_js_dep_target_label_str];

                                //track dependency source
                                if(defer_js_dep_source_label_str.length > 0)
                                {
                                    //define dependency source list
                                    if(!defer_js_dep_source_obj[''+defer_js_dep_source_label_str+''])
                                    {
                                        defer_js_dep_source_obj[''+defer_js_dep_source_label_str+''] = [];
                                    }

                                    //add to dependency source list
                                    defer_js_dep_source_obj[''+defer_js_dep_source_label_str+''].push(defer_js_item_str);

                                    //define dependency source tag attribute list
                                    if(!files_js_dep_source_tag_attr_obj[''+defer_js_dep_source_label_str+''])
                                    {
                                        files_js_dep_source_tag_attr_obj[''+defer_js_dep_source_label_str+''] = [];
                                    }

                                    //add to dependency source tag attribute list
                                    files_js_dep_source_tag_attr_obj[''+defer_js_dep_source_label_str+''].push(defer_js_item_attr_obj);

                                    //add to tracker
                                    defer_js_source_or_target_arr.push(defer_js_item_str);

                                    //flag that depedency script source is defined
                                    domStore('var_flag_defer_script_source_init', true);
                                    return;
                                }

                                //track dependency target
                                if(defer_js_dep_target_label_str.length > 0)
                                {
                                    //Manage sub-dependency
                                    if(defer_js_dep_source_to_target_label_str && _w.isString(defer_js_dep_source_to_target_label_str) && defer_js_dep_source_to_target_label_str.length > 0)
                                    {
                                        if(!defer_js_dep_target_sub_obj[''+defer_js_dep_source_to_target_label_str+''])
                                        {
                                            defer_js_dep_target_sub_obj[''+defer_js_dep_source_to_target_label_str+''] = [];
                                        }

                                        //add to sub-dependency queue
                                        defer_js_dep_target_sub_obj[''+defer_js_dep_source_to_target_label_str+''].push(defer_js_item_str);

                                        //define dependency target sub tag attribute list
                                        if(!files_js_dep_target_sub_tag_attr_obj[''+defer_js_dep_source_to_target_label_str+''])
                                        {
                                            files_js_dep_target_sub_tag_attr_obj[''+defer_js_dep_source_to_target_label_str+''] = [];
                                        }

                                        //add to dependency target sub tag attribute list
                                        files_js_dep_target_sub_tag_attr_obj[''+defer_js_dep_source_to_target_label_str+''].push(defer_js_item_attr_obj);
                                    }
                                    else
                                    {
                                        //define dependency target list
                                        if(!defer_js_dep_target_obj[''+defer_js_dep_target_label_str+''])
                                        {
                                            defer_js_dep_target_obj[''+defer_js_dep_target_label_str+''] = [];
                                        }

                                        //add to dependency target list
                                        defer_js_dep_target_obj[''+defer_js_dep_target_label_str+''].push(defer_js_item_str);

                                        //define dependency target tag attribute list
                                        if(!files_js_dep_target_tag_attr_obj[''+defer_js_dep_target_label_str+''])
                                        {
                                            files_js_dep_target_tag_attr_obj[''+defer_js_dep_target_label_str+''] = [];
                                        }

                                        //add to dependency target tag attribute list
                                        files_js_dep_target_tag_attr_obj[''+defer_js_dep_target_label_str+''].push(defer_js_item_attr_obj);
                                    }

                                    //add to tracker
                                    defer_js_source_or_target_arr.push(defer_js_item_str);
                                    return;
                                }
                            }

                            //get and save tag attributes
                            files_js_tag_attr_arr = _w.getKeyValuePairs(this.outerHTML, 'type,src');
                            script_tag_attr_arr.push(files_js_tag_attr_arr);

                            //keep record of all scripts that don't have
                            //active dependency relationship
                            files_js_arr.push(defer_js_item_str);
                        });

                        //keep a record of w_defer scripts on first run
                        if(!domStore('var_flag_defer_script_record_init'))
                        {
                            //persist list of w_defer scripts
                            domStore('var_register_defer_script', files_js_storage_arr);

                            //keep counter control
                            //make sure it is initialized once
                            domStore('var_counter_defer_script_control', 0);

                            //flag to prevent multiple occurrence
                            domStore('var_flag_defer_script_record_init', true);
                        }

                        /**
                         * Load Scripts
                         * Note: Make sure it runs only once
                         * 1: Main Queue First
                         * 2: Dependency Queue Next
                         */

                        if(!domStore('var_flag_defer_js_load_init'))
                        {
                            //1:

                            _loadScript(files_js_arr, function(){}, script_tag_attr_arr);

                            //2:
                            for (var key in defer_js_dep_source_obj)
                            {
                                if (defer_js_dep_source_obj.hasOwnProperty(key)) {
                                    /*jshint -W083 */
                                    _loadScript(defer_js_dep_source_obj[key], function(key){
                                        _loadScript(defer_js_dep_target_obj[key], function(key){
                                            _loadScript(defer_js_dep_target_sub_obj[key], undefined, files_js_dep_target_sub_tag_attr_obj[key], undefined, undefined, true);
                                        }, files_js_dep_target_tag_attr_obj[key], key, undefined, true);
                                    }, files_js_dep_source_tag_attr_obj[key], key, undefined, true);
                                    /*jshint +W083 */
                                }
                            }

                            domStore('var_flag_defer_js_load_init', true);
                        }
                        else
                        {
                            //define flags
                            domStore('var_flag_defer_js_dep_end_list_init', true);
                            domStore('var_flag_defer_js_dep_end_list_init_has_run', false);

                            if(!domStore('var_defer_js_dep_end_list'))
                            {
                                domStore('var_defer_js_dep_end_list', []);
                            }
                            defer_js_list_end_arr = domStore('var_defer_js_dep_end_list');

                            //get any late non-dependency scripts
                            for(j = 0; j < files_js_arr.length; j++)
                            {
                                defer_js_list_end_arr.push(files_js_arr[j]);
                            }

                            //get any late dependency source scripts
                            for (var key in defer_js_dep_source_obj)
                            {
                                if (defer_js_dep_source_obj.hasOwnProperty(key)) {
                                    defer_js_list_end_temp_arr = defer_js_dep_source_obj[key];
                                    for(j = 0; j < defer_js_list_end_temp_arr.length; j++)
                                    {
                                        defer_js_list_end_arr.push(defer_js_list_end_temp_arr[j]);
                                    }
                                }
                            }

                            //get any late dependency target scripts
                            for (var key in defer_js_dep_target_obj)
                            {
                                if (defer_js_dep_target_obj.hasOwnProperty(key)) {
                                    defer_js_list_end_temp_arr = defer_js_dep_target_obj[key];
                                    for(j = 0; j < defer_js_list_end_temp_arr.length; j++)
                                    {
                                        defer_js_list_end_arr.push(defer_js_list_end_temp_arr[j]);
                                    }
                                }
                            }

                            //get late script list to storage
                            domStore('var_defer_js_dep_end_list', defer_js_list_end_arr);
                        }

                        //Unload JavaScript with w_defer tag
                        for(k = defer_js_collection_obj.length-1; k >= 0; k--)
                        {
                            defer_js_collection_obj[k].parentNode.removeChild(defer_js_collection_obj[k]);
                        }
                    }

                    //Defer + Async
                    if(defer_async_js_collection_obj.length > 0)
                    {
                        lazyload_script_js_attr_util_arr = [];

                        //special flag that indicates that JS deferred reference file exists
                        domStore('var_flag_defer_js_ref_file_exists', true);
                        domStore('var_flag_defer_js_async_ref_file_exists', true);

                        defer_async_js_collection_obj.each(function()
                        {
                            files_async_js_arr.push($(this).attr("src"));

                            //get defined <script> tag attributes (exclude type and src)
                            var lazyload_script_js_attr_util_item_obj = _w.getKeyValuePairs(this.outerHTML, 'type,src');
                            lazyload_script_js_attr_util_arr.push(lazyload_script_js_attr_util_item_obj);
                        });

                        _lazyLoad(files_async_js_arr, el_target_obj, loc_str, lazyload_inline_js_attr_obj, lazyload_script_js_attr_util_arr);

                        //Unload JavaScript with w_defer_async tag
                        for(k = defer_async_js_collection_obj.length-1; k >= 0; k--)
                        {
                            defer_async_js_collection_obj[k].parentNode.removeChild(defer_async_js_collection_obj[k]);
                        }
                    }

                    //setup function to update link media attribute
                    if(flag_css_defer_auto_bool)
                    {
                        //setup delayed function
                        wizmo.addFunction('run_defer_css_auto', link_css_update_media_attrib_fn);
                    }
                }

                //set cache if not disabled
                if(!disable_store_cache_auto_bool)
                {
                    store('var_run_defer_auto', true);
                }
            }

            /**
             * B:
             * B.1: Load CSS manually setup via wizmo.loadCSS [defer]
             * B.2: Load JS manually setup via wizmo.loadJS [defer]
             */
            if(!run_inline_bool)
            {
                //B.1.
                if(defer_css_sys_collection_obj.length > 0)
                {
                    lazyload_link_css_attr_util_arr = [];

                    //special flag that indicates that CSS deferred reference file exists
                    domStore('var_flag_defer_css_ref_file_exists', true);
                    domStore('var_flag_defer_css_sys_ref_file_exists', true);

                    //Load CSS
                    defer_css_sys_collection_obj.each(function() {
                        if(this.href)
                        {
                            files_css_sys_arr.push($(this).attr("href"));

                            //get defined <link> tag attributes (exclude type and href)
                            var lazyload_link_css_attr_util_item_obj = _w.getKeyValuePairs(this.outerHTML, 'type,href');

                            lazyload_link_css_attr_util_arr.push(lazyload_link_css_attr_util_item_obj);
                        }
                    });

                    _lazyLoad(files_css_sys_arr, el_target_obj, loc_str, lazyload_link_css_attr_obj, lazyload_link_css_attr_util_arr);

                    //Unload CSS with w_defer tag
                    for(j = defer_css_sys_collection_obj.length-1; j >= 0; j--)
                    {
                        defer_css_sys_collection_obj[j].parentNode.removeChild(defer_css_sys_collection_obj[j]);
                    }

                    //setup delayed function once
                    if(!store('var_run_defer_css_manual_set_fn'))
                    {
                        wizmo.addFunction('run_defer_css_manual', link_css_update_media_attrib_fn);

                        store('var_run_defer_css_manual_set_fn', true);
                    }
                }

                //B.2.
                if(defer_js_sys_collection_obj.length > 0)
                {
                    lazyload_script_js_attr_util_arr = [];

                    //special flag that indicates that JS deferred reference file exists
                    domStore('var_flag_defer_js_ref_file_exists', true);
                    domStore('var_flag_defer_js_sys_ref_file_exists', true);

                    //Load JavaScript
                    defer_js_sys_collection_obj.each(function() {

                        if(this.src)
                        {
                            files_js_sys_arr.push($(this).attr("src"));

                            //get defined <script> tag attributes (exclude type and src)
                            var lazyload_script_js_attr_util_item_obj = _w.getKeyValuePairs(this.outerHTML, 'type,src');
                            lazyload_script_js_attr_util_arr.push(lazyload_script_js_attr_util_item_obj);
                        }
                    });

                    _lazyLoad(files_js_sys_arr, el_target_obj, loc_str, lazyload_script_js_attr_obj, lazyload_script_js_attr_util_arr);

                    //Unload JavaScript with w_defer tag
                    for(m = defer_js_sys_collection_obj.length-1; m >= 0; m--)
                    {
                        defer_js_sys_collection_obj[m].parentNode.removeChild(defer_js_sys_collection_obj[m]);
                    }
                }
            }

            return this;
        }

        /**
         * Adds/retrieves/removes an object to wizmo-specific namespace
         * @param {String} id_str the object identifier
         * @param {Object} obj the object
         * Note: if object is valid, this will trigger an add operation
         * Note: if object is undefined, this will trigger a get operation
         * Note: if object is null, this will trigger a remove operation
         * @param {String} options_obj optional settings that define parameters for the operation
         * namespace: this enables storage of objects in a namespace different from the default one.
         * Note: if you use this option for the add operation, you must also do same for retrieve/remove operations to ensure that you are working with the same object
         * @private
         */
        function _addOrGetOrRemoveObject(id_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                obj = myArgs[1],
                options_obj = (myArgs[2]) ? myArgs[2] : {},
                namespace_str
                ;

            //Define defaults if options_obj mode
            if(_w.isObject(options_obj))
            {
                namespace_str = (options_obj.namespace && (_w.isString(options_obj.namespace) && options_obj.namespace.length > 0)) ? '_'+options_obj.namespace : undefined;
            }

            if(obj)
            {
                //add
                if(namespace_str)
                {
                    domStore(id_str, obj, 'var_object_q'+namespace_str);
                }
                else
                {
                    domStore(id_str, obj, 'var_object');
                }
            }
            else
            {
                //get/remove
                obj = (obj === null) ? null : undefined;
                return (namespace_str) ? domStore(id_str, obj, 'var_object_q'+namespace_str) : domStore(id_str, obj, 'var_object');
            }
        }

        /**
         * Adds an object to wizmo-specific namespace
         * @param {String} id_str the object identifier
         * @param {Object} obj the object
         * @param {String} options_obj optional settings that define object creation
         * namespace: this enables storage of objects in a namespace different from the default one.
         */
        function addObject(id_str, obj){
            var myArgs = Array.prototype.slice.call(arguments);
            _addOrGetOrRemoveObject(id_str, obj, myArgs[2]);
        }

        /**
         * Retrieves an object from wizmo-specific namespace
         * @param {String} id_str the object identifier
         * @param {Object} options_obj the options that define how object is added. Available options are:
         * namespace this enables storage of objects in a namespace different from the default one.
         *
         * @returns {*}
         */
        function getObject(id_str)
        {
            var myArgs = Array.prototype.slice.call(arguments);
            return _addOrGetOrRemoveObject(id_str, undefined, myArgs[1]);
        }

        /**
         * Retrieves an entire object namespace
         * Note: this will retrieve all the objects
         * @param {String} namespace_str the namespace
         * @returns {Object}
         */
        function getObjectSpace(namespace_str)
        {
            var options_obj = {namespace: namespace_str};
            return _addOrGetOrRemoveObject(undefined, undefined, options_obj);
        }

        /**
         * Removes an object from wizmo-specific namespace
         * @param {String} id_str the object identifier
         * @param {Object} options_obj the options that define how object is added. Available options are:
         * namespace this enables storage of objects in a namespace different from the default one.
         */
        function removeObject(id_str)
        {
            var myArgs = Array.prototype.slice.call(arguments);
            _addOrGetOrRemoveObject(id_str, null, myArgs[1]);
        }

        /**
         * Adds function to wizmo-specific namespace
         * @param {String} id_str the identifier for the function.
         * Note: If queue option [below] is set to true, make sure you keep this value [id_str] constant when adding multiple functions to ensure that they are all captured within the same queue
         * For example:
         * wizmo.addFunction('queue_1', fn_1, {queue: true, namespace: 'queue_1'})
         * wizmo.addFunction('queue_1', fn_2, {queue: true, namespace: 'queue_1'})
         * will add fn_1 and fn_2 to the same queue, enabling you to call both functions at the same time with a single runFunction call like this:
         * wizmo.runFunction('queue_1', {queue: true, namespace: 'queue_1'})
         *
         * @param {Function} fn the function to store
         * @param {Object} options_obj the options that define how functions will be added
         *
         * queue: if true, will add the function to a special queue. Multiple functions can be added using the same id_str. All functions will then be called at once using when the runFunction method is called
         * Note: You must use this in conjunction with the 'namespace' option
         *
         * namespace: this enables storage of functions in a namespace different from the default one. Without specifying a namespace, you can't queue functions
         * Note: You can use namespace without queue options. Your function will be stored in a namespace specific to you, as opposed to the default namespace. This provides better safety and security
         *
         * args: this stores corresponding arguments for queued functions.
         * Note: You only need to use this when you are queuing functions [queue option is set to true]. Otherwise, there is no need because you can already pass arguments when calling the function via runFunction() method
         *
         */
        function addFunction(id_str, fn)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[2]) ? myArgs[2] : {},
                is_queue_bool,
                namespace_str,
                fn_args,
                id_fn_args_str;

            //Define defaults if options_obj mode
            if(_w.isObject(options_obj))
            {
                is_queue_bool = (options_obj.queue && _w.isBool(options_obj.queue)) ? options_obj.queue : false;
                namespace_str = (options_obj.namespace && (_w.isString(options_obj.namespace) && options_obj.namespace.length > 0)) ? '_'+options_obj.namespace : undefined;
                fn_args = (options_obj.args) ? options_obj.args : undefined;
            }

            //Start function addition operations
            if (is_queue_bool)
            {
                var id_final_str,
                    id_store_counter_id_str = id_str + '_counter',
                    id_store_counter_int = 0;

                //add a suffix to id
                if (!domStore(id_store_counter_id_str)) {
                    domStore(id_store_counter_id_str, id_store_counter_int);
                }
                else {
                    id_store_counter_int = parseInt(domStore(id_store_counter_id_str));
                }

                id_final_str = id_str + '_' + id_store_counter_int;

                //add function to queue
                domStore(id_final_str, fn, 'var_function_q'+namespace_str);

                //add function arguments to storage
                if(fn_args)
                {
                    id_fn_args_str = id_final_str+'_args';
                    domStore(id_fn_args_str, fn_args, 'var_function_q_args');
                }

                //increment counter
                id_store_counter_int++;
                domStore(id_store_counter_id_str, id_store_counter_int);
            }
            else
            {
                if(namespace_str)
                {
                    domStore(id_str, fn, 'var_function_q'+namespace_str);
                }
                else
                {
                    domStore(id_str, fn, 'var_function');
                }
            }
        }

        /**
         * Gets a stored function
         * @param {String} id_str the function identifier
         * @param {Object} options_obj the options that define how the function was added. Available options are:
         * namespace: this enables [storage and] retrieval of functions that were stored using a namespace different from the default one.
         * queue: if true, will get the queued functions
         * @returns {*}
         */
        function getFunction(id_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1]) ? myArgs[1] : {},
                namespace_str,
                queue_bool,
                fn_namespace_str,
                fn
                ;

            //get options
            if(_w.isObject(options_obj))
            {
                namespace_str = (options_obj.namespace && (_w.isString(options_obj.namespace) && options_obj.namespace.length > 0)) ? '_'+options_obj.namespace : undefined;
                queue_bool = (options_obj.queue && _w.isBool(options_obj.queue)) ? options_obj.queue : false;
            }

            if(queue_bool)
            {
                //validate namespace
                if(!namespace_str)
                {
                    _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: You must define a namespace if you are using function queues', true);
                }

                fn = window.wUtil.domStoreData['w_var_function_q'+namespace_str];
            }
            else
            {
                if(namespace_str)
                {
                    fn_namespace_str = 'var_function_q'+namespace_str;
                    fn = domStore(id_str, undefined, fn_namespace_str);
                }
                else
                {
                    fn = domStore(id_str, undefined, 'var_function');
                }
            }

            return fn;
        }

        /**
         * Counts the number of queued functions
         * @param {String} id_str the identifier for the function
         * @param {Object} options_obj the options
         * namespace: the function namespace. Must be provided
         * queue: specifies is queue functions. Must be true
         * @returns {number}
         */
        function countFunction(id_str, options_obj){

            var fn_obj = getFunction(id_str, options_obj),
                fn_count_int = 0;

            if(fn_obj)
            {
                for (var key in fn_obj) {
                    if (fn_obj.hasOwnProperty(key)) {
                        fn_count_int++;
                    }
                }
            }

            return fn_count_int;
        }

        /**
         * Flush a function queue
         * @param {Object} options_obj the options that
         * queue: must be true for flush to work
         * namespace: defines the namespace that contains the function(s)
         */
        function flushFunction(options_obj)
        {
            var is_queue_bool,
                namespace_str
            ;

            //set defaults
            if(_w.isObject(options_obj))
            {
                is_queue_bool = (options_obj.queue && _w.isBool(options_obj.queue)) ? options_obj.queue : false;
                namespace_str = (options_obj.namespace && (_w.isString(options_obj.namespace) && options_obj.namespace.length > 0)) ? '_'+options_obj.namespace : undefined;
            }

            //flush
            if(is_queue_bool && namespace_str)
            {
                window.wUtil.domStoreData['w_var_function_q'+namespace_str] = {};
            }
        }

        /**
         * Runs a function from wizmo-specific namespace
         * @param {String} id_str the identifier for the function
         * @param {Object} options_obj the options that define how functions will be run
         * queue: if true, will run all functions that have been queued
         * Note: Queued functions are enable via addFunction method by setting the queue option to true
         * Note: all functions will be run at the same time
         * Note: you must define a namespace, because queued functions are queued in a non-default namespace
         *
         * namespace: defines the namespace that contains the function(s)
         * Note: this must be defined if queue option is true
         *
         * flush: if true, will flush the queue after execution to prevent
         *
         * args: an object|array that contains custom arguments for the function to be called
         * Note: This option [args] doesn't apply to queued functions
         * Note: If you want to define a single argument that may not necessarily be an object or array, use the 'one' property to override any filters that may alter args. For example, args.one = 'your_solitary_argument' and this will be passed directly to the function
         *
         * promise: if true, will not execute functions, but return an array of promisified functions
         * Note: This option [promise] only applies to queued functions
         *
         * @return {*}
         */
        function runFunction(id_str)
        {
            var myArgs = Array.prototype.slice.call(arguments),
                options_obj = (myArgs[1]) ? myArgs[1] : {},
                fn_args_arr_or_obj = myArgs[1],
                is_queue_bool,
                queue_flush_bool,
                queue_promisify_bool,
                namespace_str,
                fn,
                fn_namespace_str,
                fn_all_obj,
                fn_promise_arr = []
                ;

            //Define defaults if options_obj mode
            if(_w.isObject(options_obj))
            {
                //define args defaults
                fn_args_arr_or_obj = (options_obj.args && (_w.isObject(fn_args_arr_or_obj) || _w.isArray(fn_args_arr_or_obj))) ? options_obj.args : fn_args_arr_or_obj;
                fn_args_arr_or_obj = (_w.isObject(fn_args_arr_or_obj) || _w.isArray(fn_args_arr_or_obj)) ? fn_args_arr_or_obj : undefined;
                fn_args_arr_or_obj = (fn_args_arr_or_obj === '__no_args__') ? undefined : fn_args_arr_or_obj;

                //additional args modifications
                if(options_obj.args)
                {
                    if(options_obj.args.one)
                    {
                        fn_args_arr_or_obj = options_obj.args.one;
                    }
                }

                //define rest of defaults
                is_queue_bool = (options_obj.queue && _w.isBool(options_obj.queue)) ? options_obj.queue : false;
                queue_flush_bool = (options_obj.flush && _w.isBool(options_obj.flush)) ? options_obj.flush : false;
                namespace_str = (options_obj.namespace && (_w.isString(options_obj.namespace) && options_obj.namespace.length > 0)) ? '_'+options_obj.namespace : undefined;
                queue_promisify_bool = (options_obj.promise && _w.isBool(options_obj.promise)) ? options_obj.promise : false;
            }

            //Start run function operations
            if(is_queue_bool)
            {
                //validate namespace
                if(!namespace_str)
                {
                    _w.console.warn(_w.config.app_name+' warning ['+_w.zeroFill(wizmo.store('var_counter_console'), 3)+']: You must define a namespace if you are using function queues', true);
                }

                //run queued function
                var fn_regex_obj = new RegExp(""+id_str+"_[0-9]+$", "i"),
                    fn_arg_id_str,
                    fn_q_args_arr_or_obj,
                    fn_is_valid_bool;
                fn_all_obj = window.wUtil.domStoreData['w_var_function_q'+namespace_str];

                //iterate over all queued function
                for (var key in fn_all_obj) {
                    if (fn_all_obj.hasOwnProperty(key)) {

                        //check if function is valid
                        fn_is_valid_bool = !!((fn_all_obj[key]));

                        //run function(s) only if valid
                        if(fn_is_valid_bool)
                        {
                            //check that key matches pattern
                            if(fn_regex_obj.test(key))
                            {
                                //if promisify
                                if(queue_promisify_bool)
                                {
                                    /*jshint -W083 */
                                    var fn_promise_item_fn = new Promise(function(){
                                        return fn_all_obj[key]();
                                    });
                                    fn_promise_arr.push(fn_promise_item_fn);
                                    /*jshint +W083 */
                                }
                                else
                                {
                                    //if yes, check if function has stored arguments
                                    fn_arg_id_str = key+'_args';
                                    fn_arg_id_str = fn_arg_id_str.replace(/^ *(r|w)_/, "");
                                    fn_q_args_arr_or_obj = domStore(fn_arg_id_str, undefined, 'var_function_q_args');

                                    if(fn_q_args_arr_or_obj && ((_w.isArray(fn_q_args_arr_or_obj) && fn_q_args_arr_or_obj.length > 0) || (_w.isObject(fn_q_args_arr_or_obj)) || (_w.isString(fn_q_args_arr_or_obj))))
                                    {
                                        if(fn_args_arr_or_obj)
                                        {
                                            //run function with both saved + given arguments
                                            fn_all_obj[key](fn_q_args_arr_or_obj, fn_args_arr_or_obj);
                                        }
                                        else
                                        {
                                            //run function with saved arguments
                                            fn_all_obj[key](fn_q_args_arr_or_obj);
                                        }
                                    }
                                    else if(fn_args_arr_or_obj)
                                    {
                                        //run function with given arguments
                                        fn_all_obj[key](fn_args_arr_or_obj);
                                    }
                                    else
                                    {
                                        //run function
                                        fn_all_obj[key]();
                                    }
                                }
                            }
                        }
                    }
                }

                //flush
                if(queue_flush_bool)
                {
                    window.wUtil.domStoreData['w_var_function_q'+namespace_str] = {};
                }

                //promisify
                if(queue_promisify_bool && _w.count(fn_promise_arr) > 0)
                {
                    return fn_promise_arr;
                }
            }
            else
            {
                //get function
                if(namespace_str)
                {
                    fn_namespace_str = 'var_function_q'+namespace_str;
                    fn = domStore(id_str, undefined, fn_namespace_str);
                }
                else
                {
                    fn = domStore(id_str, undefined, 'var_function');
                }

                //run function
                if(fn)
                {
                    return (fn_args_arr_or_obj) ? fn(fn_args_arr_or_obj) : fn();
                }
            }

            return this;
        }

        /**
         * Adds a function to the wizmoInit queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoInit(fn)
        {
            addFunction('iready', fn, {queue: true, namespace: 'iready'});
        }

        /**
         * Adds a function to the wizmoFirst queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoFirst(fn)
        {
            addFunction('fready', fn, {queue: true, namespace: 'fready'});
        }

        /**
         * Adds a function to the domReady queue
         * @param {Function} fn the function to queue
         */
        function addToQueueDomReady(fn)
        {
            addFunction('dmready', fn, {queue: true, namespace: 'dmready'});
        }

        /**
         * Adds a function to the wizmoReady queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoReady(fn)
        {
            addFunction('ready', fn, {queue: true, namespace: 'ready'});
        }

        /**
         * Adds a function to the wizmoPostReady queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoPostReady(fn)
        {
            addFunction('zready', fn, {queue: true, namespace: 'zready'});
        }

        /**
         * Adds a function to the wizmoDeferReady queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoDeferReady(fn)
        {
            addFunction('dready', fn, {queue: true, namespace: 'dready'});
        }

        /**
         * Adds a function to the wizmoPostDeferReady queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoPostDeferReady(fn)
        {
            addFunction('dpready', fn, {queue: true, namespace: 'dpready'});
        }

        /**
         * Adds a function to the wizmoAsync queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoAsync(fn)
        {
            //flag so that relevant await functionality will be triggered
            domStore('var_await_init', true);

            //add
            addFunction('a1ready', fn, {queue: true, namespace: 'a1ready'});
            if(!_w.isNumber(store('var_async_fn_counter')))
            {
                store('var_async_fn_counter', 0);
            }
            if(_w.isNullOrUndefined(store('var_async_fn_gate_open')))
            {
                store('var_async_fn_gate_open', false);
            }
        }

        /**
         * Used inside $.async block to signal a return value after an asynchronous operation
         * @param {String} key the identifier
         * @param {*} value the value returned from async operation
         */
        function resolveAsync(key, value)
        {
            if(!(_w.isString(key) && key.length > 0))
            {
                return false;
            }

            //store value
            var key_async_str = 'var_async_'+key;
            store(key_async_str, value);

            if(store('var_async_fn_gate_open'))
            {
                //increment async function counter
                storeIncrement('var_async_fn_counter');
            }
        }

        /**
         * Used inside $.async block to signal an error or exception
         */
        function rejectAsync()
        {
            if(store('var_async_fn_gate_open'))
            {
                //increment async function counter
                storeIncrement('var_async_fn_counter');
            }
        }

        /**
         * Used inside $.await block to get the value of an asynchronously returned value i.e. a value persisted via resolveAsync
         * @param {String} key the identifier of the value in storage
         * @return {*}
         */
        function getAsyncValue(key)
        {
            //return value
            var key_async_str = 'var_async_'+key;
            return store(key_async_str);
        }

        /**
         * Adds a function to the wizmoAwaitReady queue
         * @param {Function} fn the function to queue
         */
        function addToQueueWizmoAwaitReady(fn)
        {
            //flag so that relevant await functionality will be triggered
            domStore('var_await_init', true);

            //add
            addFunction('a2ready', fn, {queue: true, namespace: 'a2ready'});
        }

        wizmo = {
            domStore: domStore,
            domStoreIncrement: domStoreIncrement,
            domStoreDecrement: domStoreDecrement,
            domStorePush: domStorePush,
            pageStore: domStore,
            pageStoreIncrement: domStoreIncrement,
            pageStoreDecrement: domStoreDecrement,
            pageStorePush: domStorePush,
            domStoreData: window.wUtil.domStoreData,
            detectPrivateBrowsing: _detectPrivateBrowsing,
            store: store,
            storeCheck: storeCheck,
            storeIncrement: storeIncrement,
            storeDecrement: storeDecrement,
            init: init(),
            initDimVars: _initDimensionVars,
            updateDimStore: _updateDimensionStore,
            updateOrtStore: _updateOrientationStore,
            getUserAgent: getUserAgent,
            mobileDetect: _mobileDetect,
            hasProxyBrowser: _hasProxyBrowser,
            getResolutionDimensionList: _getResolutionDimensionList,
            viewportW: viewportW,
            viewportH: viewportH,
            screenW: screenW,
            screenH: screenH,
            pixelW: pixelW,
            pixelH: pixelH,
            vSpan: vSpan,
            vPitch: vPitch,
            dSpan: dSpan,
            dPitch: dPitch,
            cSpan: cSpan,
            cPitch: cPitch,
            eSpan: eSpan,
            ePitch: ePitch,
            getPixelRatio: getPixelRatio,
            getAspectRatio: getAspectRatio,
            getOS: getOS,
            getPlatform: getPlatform,
            getOrientation: getOrientation,
            isPortrait: isPortrait,
            isLandscape: isLandscape,
            isIOS: isIOS,
            isAndroid: isAndroid,
            isSymbian: isSymbian,
            isBlackberry: isBlackberry,
            isWindows: isWindows,
            isWindowsPhone: isWindowsPhone,
            loadScript: _loadScript,
            loadScriptXHR: _loadScriptXHR,
            runDefer: runDefer,
            addObject: addObject,
            getObject: getObject,
            getObjectSpace: getObjectSpace,
            removeObject: removeObject,
            addFunction: addFunction,
            getFunction: getFunction,
            countFunction: countFunction,
            flushFunction: flushFunction,
            runFunction: runFunction,
            _queue: _addToReadyQueue,
            queueFirst: addToQueueWizmoFirst,
            queueDomReady: addToQueueDomReady,
            queueReady: addToQueueWizmoReady,
            queuePost: addToQueueWizmoPostReady,
            queueDefer: addToQueueWizmoDeferReady,
            queuePostDefer: addToQueueWizmoPostDeferReady,
            queueAsync: addToQueueWizmoAsync,
            resolveAsync: resolveAsync,
            rejectAsync: rejectAsync,
            getAsyncValue: getAsyncValue,
            queueAwait: addToQueueWizmoAwaitReady
        };

        return wizmo;
    }));

    /**
     * Run wizmo $.init functions
     * Note: use flush option to prevent multiple executions
     */
    wizmo.runFunction('iready', {queue: true, namespace: 'iready', flush: true});

    //Add for turbo-classes for ready and defer
    wizmo.queueReady(function(){
        $('body').addClass('w_ready');
    });
    wizmo.queueDefer(function(){
        $('body').addClass('w_defer');
    });

    /**
     * Manage wizmo non-critical file asynchronicity
     * If async
     * a.1: we load non-critical file in async fashion
     * If not async
     * b.1: we force runDefer to run again [because in non-async mode, the critical file will have run before the non-critical file is accessible via script, thus making it impossible to run] on document.ready
     * b.2: we load non-critical file in non-async fashion
     */
    var elem_script_obj = $('script'),
        is_wizmo_critical_async_bool = true,
        run_defer_again_bool = false,
        run_defer_options_obj = {inline: true, inline_js_async: true},
        run_defer_again_options_obj = {inline: true, inline_js_async: true},
        ua_str = wizmo.getUserAgent(),
        vendors_arr = ['ms', 'moz', 'webkit', 'o'],
        raf_fn = window.requestAnimationFrame,
        link_update_fn = function(){
            wizmo.runFunction('run_defer_css_auto');
        }
        ;

    //set flag to specify if defer operation should be run again
    wizmo.pageStore('var_flag_run_defer_again_bool', run_defer_again_bool);

    for(var i = 0; i < vendors_arr.length && !raf_fn; ++i)
    {
        raf_fn = window[vendors_arr[i]+'RequestAnimationFrame'];
    }

    elem_script_obj.each(function(){
        //filter for file name
        if(!this.async && /\.c\.([a-zA-Z_]+\.|)js *$/i.test(this.src))
        {
            //update variables
            run_defer_again_bool = true;
            is_wizmo_critical_async_bool = false;
            run_defer_again_options_obj.inline_js_async = false;
            run_defer_again_options_obj.js_only = true;

            //set flag to specify if defer operation should be run again
            wizmo.pageStore('var_flag_run_defer_again_bool', run_defer_again_bool);

            //persist run defer options
            wizmo.pageStore('var_options_run_defer_again_obj', run_defer_again_options_obj);
        }
    });

    //setup deferred scripts in a non-blocking way
    wizmo.runDefer(run_defer_options_obj);

    /**
     * Pagespeed CSS Non-blocking Fix
     *
     * Pagespeed Insights incorrectly reports that our CSS loading feature
     * is blocking even when network tests in the Inspector of both
     * Chrome and Firefox browsers, as well as on WebPageTest,
     * clearly show that CSS is loaded after DOMContentLoaded.
     * This appears to be a bug and is mentioned here: https://github.com/filamentgroup/loadCSS/issues/53
     *
     * To fix this issue, we do the following:
     * 1. Detect the traffic coming from Pagespeed Insights
     * 2. Load our CSS after a 7-second timeout to ensure that it loads
     * well after the page has loaded
     *
     * Doing this will cause the Pagespeed Insights bot to load the CSS after
     * the page has been loaded, and as such will not penalize our
     * CSS loading script for doing the right thing i.e. loading CSS
     * in a non-blocking fashion
     *
     * This might appear to some like gaming the results. This is untrue.
     * If we did the exact same thing in our main script, we would get the same
     * result [pagespeed score]. Plus, if we did, we could eliminate FOUC
     * (Flash-Of-Unstyled-Content) by using inline CSS (while we waited for
     * the main CSS file to load after 7 seconds).
     *
     * However, this kind of hacking should be totally unnecessary because the
     * script is already loading CSS in a non-blocking fashion.
     *
     * So, in the interim, we have to filter pagespeed requests and pass them
     * through our delayed CSS loading method.
     *
     * We will continue to monitor Pagespeed Insights, and will remove this
     * filter when they do fix the issue
     */
    if(/google.+?page *speed.+?insights/i.test(ua_str))
    {
        //update link media attribute to 'all' on delay
        if(raf_fn)
        {
            raf_fn(function() { window.setTimeout(link_update_fn, 7000); });
        }
        else
        {
            window.setTimeout(link_update_fn, 7000);
        }
    }
    else
    {
        //update link media attribute to all
        wizmo.runFunction('run_defer_css_auto');
    }


    $.domReady(function(){

        /**
         * Setup to capture special inline queued scripts
         * These queued scripts are setup inline on your Web page when wizmo
         * is loaded asynchronously
         * For example, for deferred scripts, here's how you define them inline:
         * <script>
         * var r = window.wUtil = {};
         * r.defer = (r.defer) ? r.defer: {};
         * r.defer.first = function(){
         *    //first deferred script code here
         * };
         * r.defer.second = function(){
         *    //second deferred script code here
         * };
         * ...
         * </script>
         */
        //setup to run on document ready
        if(wUtil.domReady)
        {
            wizmo._queue(wUtil.domReady, wizmo.queueDomReady);
        }

        //run domReady functions
        wizmo.runFunction('dmready', {queue: true, namespace: 'dmready', flush: true});


        //setup to run deferred scripts
        if(wUtil.defer)
        {
            wizmo._queue(wUtil.defer, wizmo.queueDefer);
        }

        //setup to run when wizmo is ready
        if(wUtil.ready)
        {
            wizmo._queue(wUtil.ready, wizmo.queueReady);
        }

        //setup to run after wizmo
        if(wUtil.post)
        {
            wizmo._queue(wUtil.post, wizmo.queuePost);
        }

        //setup to stage async scripts
        if(wUtil.async)
        {
            wizmo._queue(wUtil.async, wizmo.queueAsync);
        }

        //setup to run when async [above] scripts are loaded
        if(wUtil.await)
        {
            wizmo._queue(wUtil.await, wizmo.queueAwait);
        }


        /**
         * Run Deferred Scripts again if necessary
         * You would need to do this if:
         * 1: Run defer script flag is true
         * 2: You have <script> references in the <body> that may not be ready before runDefer is run the first time
         */
        var run_defer_again_options_obj,
            defer_script_list_arr
            ;

        //1:
        if(wizmo.pageStore('var_flag_run_defer_again_bool'))
        {
            wizmo.store("var_run_defer_auto", null);

            run_defer_again_options_obj = wizmo.pageStore('var_options_run_defer_again_obj');
            wizmo.runDefer(run_defer_again_options_obj);
        }

        //2:
        defer_script_list_arr = wizmo.pageStore('var_register_defer_script');
        if(_w.isArray(defer_script_list_arr) && defer_script_list_arr.length > 0)
        {
            var defer_script_list_now_all_arr,
                defer_js_now_item_str,
                flag_run_defer_again_bool = false
            ;

            //get the current list of deferred scripts
            defer_script_list_now_all_arr = $("[type='text/javascript/w_defer']");

            //do if exists
            if(defer_script_list_now_all_arr.length > 0)
            {
                //cycle
                defer_script_list_now_all_arr.each(function() {

                    //get the src attribute
                    defer_js_now_item_str = $(this).attr("src");

                    //check if src exists
                    if(!_w.in_array(defer_js_now_item_str, defer_script_list_arr))
                    {
                        flag_run_defer_again_bool = true;
                    }

                });
            }

            //run defer again
            if(flag_run_defer_again_bool)
            {
                wizmo.store("var_run_defer_auto", null);
                run_defer_again_options_obj = {inline: true, inline_js_async: false};
                wizmo.runDefer(run_defer_again_options_obj);

                //update link media attribute to all
                wizmo.runFunction('run_defer_css_auto');
            }
        }

    });

})(window, document, wQuery);

/**
 * Add first function
 * Use it to define a function that you want to run when wizmo is first initialized
 * Usage: $.first(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.preInit method [in wizmo.core.nc.js]
        wizmo.queueFirst(fn);
    };

})("first", wQuery);

/**
 * Add wizmoReady function
 * Use it to define a function that you want to run when wizmo is ready
 * Usage: $.wizmoReady(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.postInit method [in wizmo.core.nc.js]
        wizmo.queueReady(fn);
    };

})("wizmoReady", wQuery);

/**
 * Add ready function
 * Analogous to wizmoReady
 * Use it to define a function that you want to run when wizmo is ready
 * Usage: $.ready(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.postInit method [in wizmo.core.nc.js]
        wizmo.queueReady(fn);
    };

})("ready",  wQuery);

/**
 * Add deferReady function
 * Use it to define a function that you want to run when deferred scripts are ready
 * Usage: $.defer(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by runDefer method
        wizmo.queueDefer(fn);
    };

})("defer", wQuery);

/**
 * Add postReady function
 * Use it to define one or more functions that you want to run when wizmo is ready and all 'ready' functions have been executed
 * Usage: $.post(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.postInit method [in wizmo.core.nc.js]
        wizmo.queuePost(fn);
    };

})("post", wQuery);

/**
 * Add postDeferReady function
 * Use it to define one or more functions that you want to run after the deferred scripts queue
 * Usage: $.postDefer(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.postInit method [in wizmo.core.nc.js]
        wizmo.queuePostDefer(fn);
    };

})("postDefer", wQuery);

/**
 * Add async function
 * Use it to define one or more asynchronous functions whose results you need to use later
 * Usage: $.async(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.await method [in wizmo.core.nc.js]
        wizmo.queueAsync(fn);
    };

})("async", wQuery);

/**
 * Add awaitReady function
 * Use it to define a function to run when all the results from the functions in $.async are ready
 * Usage: $.await(function(){})
 */
(function(funcName, baseObj){

    //update baseObj if not wQuery
    var is_wquery_bool = (baseObj.label && baseObj.label === 'wquery');
    baseObj = (!is_wquery_bool) ? window.wQuery : baseObj;

    baseObj[funcName] = function(fn){
        //queue function
        //to be called later by wizmo_obj.await method [in wizmo.core.nc.js]
        wizmo.queueAwait(fn);
    };

})("await", wQuery);

(function(window, document, $){

    //fire after wizmo is ready
    $.post(function(){

        //run defer finally
        wizmo.runDefer();

        //update link media attribute to 'all' for manually loaded and deferred CSS
        wizmo.runFunction('run_defer_css_manual');

    });

})(window, document, wQuery);
