describe('Unit Tests', function(){

    beforeAll(function(){
        fixture.setBase('spec/fixture');
        fixture.load('aunit.html');
    });

    describe('Polyfills', function(){

        /**
         * ForEach
         */
        describe('forEach', function(){

            var val_arr,
                val_arr_counter_int,
                val_arr_count_harness_int,
                m;

            beforeAll(function(){
                val_arr_counter_int = 0;
                val_arr = ['10', '20', '30', '40', '50', '60'];
                val_arr_count_harness_int = 6;

                val_arr.forEach(function(){
                    val_arr_counter_int++;
                });

                m = (document.compatMode=='CSS1Compat') ? 'Standards':'Quirks';

                console.log('TEST QUIRKS MODE!');
                console.log(m);
                console.log('---');

            });


            it('should check if forEach iterates over array', function(){
                expect(val_arr_counter_int).toBe(val_arr_count_harness_int);
            });

        });

        /**
         * Trim
         */
        describe('trim', function(){

            var val_str,
                val_trim_str,
                val_harness_str;

            beforeAll(function(){
                val_str = '  obinwanne  ';
                val_trim_str = val_str.trim();
                val_harness_str = 'obinwanne';
            });

            it('should check if string is trimmed', function(){
                expect(val_trim_str).toBe(val_harness_str);
            });

        });

    });

    describe('rHelper (_w)', function(){

        /**
         * Has
         */
        describe('_w.has', function(){

            var has_obj,
                has_op_bool;

            beforeAll(function(){
                has_obj = {name: 'wizmo', prop: 'jasmine'};
                has_op_bool = _w.has(has_obj, 'prop');
            });

            it('should check if object has property', function(){
                expect(has_op_bool).toBe(true);
            });

        });

        /**
         * Count
         */
        describe('_w.count', function(){

            var one_arr,
                one_arr_count_int,
                one_arr_obj,
                one_arr_obj_count_int,
                two_arr_obj,
                two_arr_obj_count_int,
                val_null,
                val_null_count_int,
                val_int,
                val_int_count_int
                ;

            beforeAll(function(){
                one_arr = ['12', '14', '16', '18', '20'];
                one_arr_obj = {one: '12', two: '14', three: '18'};
                two_arr_obj = {one: '12', two: '14', three: '18', four: {four_one: '19', four_two: '98'}};

                one_arr_count_int = _w.count(one_arr);
                one_arr_obj_count_int = _w.count(one_arr_obj);

                two_arr_obj_count_int = _w.count(two_arr_obj, 'COUNT_RECURSIVE');

                val_null = null;
                val_null_count_int = _w.count(val_null);

                val_int = 10;
                val_int_count_int = _w.count(val_int);

            });


            it('should not count element if null or undefined', function(){
                expect(val_null_count_int).toBe(0);
            });

            it('should not count element if not array or object', function(){
                expect(val_int_count_int).toBe(1);
            });

            it('should count number of elements in array', function(){
                expect(one_arr_count_int).toBe(5);
            });

            it('should count number of elements in object', function(){
                expect(one_arr_obj_count_int).toBe(3);
            });

            it('should count number of elements in object recursively', function(){
                expect(two_arr_obj_count_int).toBe(6);
            });

        });

        /**
         * Implode
         */
        describe('_w.implode', function(){

            var implode_a_arr,
                implode_b_arr,
                implode_1_str,
                implode_2_str,
                implode_3_str
                ;

            beforeAll(function(){
                implode_a_arr = [0];
                implode_b_arr = ['my', 'first', 'name', 'is', 'obinwanne'];
                implode_1_str = _w.implode('', implode_a_arr);
                implode_2_str = _w.implode('', implode_b_arr);
                implode_3_str = _w.implode('-', implode_b_arr);
            });

            it('should implode array without single element', function(){
                expect(implode_1_str).toBe('0');
            });

            it('should implode array without delimiter', function(){
                expect(implode_2_str).toBe('myfirstnameisobinwanne');
            });

            it('should implode array with delimiter', function(){
                expect(implode_3_str).toBe('my-first-name-is-obinwanne');
            });

        });

        /**
         * In_Array
         */
        describe('_w.in_array', function(){

            var in_array_1_arr,
                in_array_2_arr,
                in_array_1_1_bool,
                in_array_1_2_bool,
                in_array_2_1_bool,
                in_array_2_2_bool,
                in_array_2_3_bool,
                in_array_2_4_bool
                ;

            beforeAll(function(){
                in_array_1_arr = [1, 2, 3, 4, 5, 6];
                in_array_2_arr = ['my', 'first', 'name', 'is', 'obinwanne'];
                in_array_1_1_bool = _w.in_array('1', in_array_1_arr);
                in_array_1_2_bool = _w.in_array('1', in_array_1_arr, true);
                in_array_2_1_bool = _w.in_array('name', in_array_2_arr);
                in_array_2_2_bool = _w.in_array('names', in_array_2_arr);
                in_array_2_3_bool = _w.in_array('obi', in_array_2_arr);
                in_array_2_4_bool = _w.in_array('obi', in_array_2_arr, undefined, true);
            });

            it('should find item in integer array', function(){
                expect(in_array_1_1_bool).toBe(true);
            });

            it('should find item in integer array with strict', function(){
                expect(in_array_1_2_bool).toBe(false);
            });

            it('should find item in string array', function(){
                expect(in_array_2_1_bool).toBe(true);
            });

            it('should not find item in string array', function(){
                expect(in_array_2_2_bool).toBe(false);
            });

            it('should find item in array', function(){
                expect(in_array_2_3_bool).toBe(false);
            });

            it('should find item in array using regex pattern', function(){
                expect(in_array_2_4_bool).toBe(true);
            });

        });

        /**
         * Contains
         */
        describe('_w.contains', function(){

            var contains_1_str_or_arr,
                contains_2_str_or_arr,
                contains_3_str_or_arr,
                contains_test_1_bool,
                contains_test_2_bool,
                contains_test_3_bool,
                contains_test_4_bool,
                contains_test_5_bool,
                contains_test_6_bool
                ;

            beforeAll(function(){
                contains_1_str_or_arr = 'one';
                contains_2_str_or_arr = 'one,two,three,four,five,six';
                contains_3_str_or_arr = ['one', 'two', 'three', 'four', 'five','six'];
                contains_test_1_bool = _w.contains(contains_1_str_or_arr, 'one');
                contains_test_2_bool = _w.contains(contains_1_str_or_arr, '1');
                contains_test_3_bool = _w.contains(contains_2_str_or_arr, 'one');
                contains_test_4_bool = _w.contains(contains_2_str_or_arr, '1');
                contains_test_5_bool = _w.contains(contains_3_str_or_arr, 'one,two,thre');
                contains_test_6_bool = _w.contains(contains_3_str_or_arr, 'one,two,thre', true);

            });

            it('should check if single value is contained in string', function(){
                expect(contains_test_1_bool).toBe(true);
            });

            it('should check if single value is contained in string [alternate]', function(){
                expect(contains_test_2_bool).toBe(false);
            });

            it('should check if single value is contained in array', function(){
                expect(contains_test_3_bool).toBe(true);
            });

            it('should check if single value is contained in array [alternate]', function(){
                expect(contains_test_4_bool).toBe(false);
            });

            it('should check if multiple values are contained in array', function(){
                expect(contains_test_5_bool).toBe(true);
            });

            it('should check if multiple values are contained in array [all or nothing]', function(){
                expect(contains_test_6_bool).toBe(false);
            });

        });

        /**
         * Merge Arrays
         */
        describe('_w.merge', function(){

            var merge_array_1_arr,
                merge_array_2_arr,
                merge_array_final_harness_arr,
                merge_array_final_arr
                ;

            beforeAll(function(){

                merge_array_1_arr = ['my', 'first', 'name', 'is', 'obinwanne'];
                merge_array_2_arr = ['my', 'last', 'name', 'is', 'hill'];
                merge_array_final_harness_arr = ['my', 'first', 'name', 'is', 'obinwanne', 'my', 'last', 'name', 'is', 'hill'];
                merge_array_final_arr = _w.merge(merge_array_1_arr, merge_array_2_arr);

            });

            it('should merge two arrays', function(){
                expect(merge_array_final_arr).toEqual(merge_array_final_harness_arr);
            });

        });

        /**
         * Merge Objects
         */
        describe('_w.mergeObject', function(){

            var merge_object_1_obj,
                merge_object_2_obj,
                merge_object_final_harness_obj,
                merge_object_final_obj
                ;

            beforeAll(function(){

                merge_object_1_obj = {'first_name': 'Obinwanne', 'last_name': 'Hill'};
                merge_object_2_obj = {'first_name': 'Obinwanne', 'role': 'Simplifier'};
                merge_object_final_harness_obj = {'first_name': 'Obinwanne', 'last_name': 'Hill', 'role': 'Simplifier'};
                merge_object_final_obj = _w.mergeObject(merge_object_1_obj, merge_object_2_obj);

            });

            it('should merge two objects', function(){
                expect(merge_object_final_obj).toEqual(merge_object_final_harness_obj);
            });

        });

        /**
         * Array_keys
         */
        describe('_w.array_keys', function(){

            var main_1_arr,
                main_2_arr,
                main_keys_1_arr,
                main_keys_2_arr,
                main_keys_1_str,
                main_keys_2_str
                ;

            beforeAll(function(){

                main_1_arr = ['obinwanne', 'obowu', 'email@me.com'];
                main_2_arr = {'name': 'obinwanne', 'origin': 'obowu', 'email': 'email@me.com'};
                main_keys_1_arr = _w.array_keys(main_1_arr);
                main_keys_2_arr = _w.array_keys(main_2_arr);
                main_keys_1_str = _w.implode('-', main_keys_1_arr);
                main_keys_2_str = _w.implode('-', main_keys_2_arr);

            });

            it('should get array keys of basic array', function(){
                expect(main_keys_1_str).toBe('0-1-2');
            });

            it('should get array keys of object array', function(){
                expect(main_keys_2_str).toBe('name-origin-email');
            });

        });

        /**
         * Array_values
         */
        describe('_w.array_values', function(){

            var main_1_arr,
                main_2_arr,
                main_values_1_arr,
                main_values_2_arr,
                main_values_1_str,
                main_values_2_str
                ;

            beforeAll(function(){

                main_1_arr = ['obinwanne', 'obowu', 'email@me.com'];
                main_2_arr = {'name': 'obinwanne', 'origin': 'obowu', 'email': 'email@me.com'};
                main_values_1_arr = _w.array_values(main_1_arr);
                main_values_2_arr = _w.array_values(main_2_arr);
                main_values_1_str = _w.implode('-', main_values_1_arr);
                main_values_2_str = _w.implode('-', main_values_2_arr);

            });

            it('should get array values of basic array', function(){
                expect(main_values_1_str).toBe('obinwanne-obowu-email@me.com');
            });

            it('should get array values of object array', function(){
                expect(main_values_2_str).toBe('obinwanne-obowu-email@me.com');
            });
        });

        /**
         * Array_combine
         */
        describe('_w.array_combine', function(){

            var main_keys_arr,
                main_values_arr,
                main_arr,
                main_alt_arr;

            beforeAll(function(){

                main_keys_arr = ['name', 'origin', 'email'];
                main_values_arr = ['obinwanne', 'obowu', 'email@me.com'];
                main_arr = _w.array_combine(main_keys_arr, main_values_arr);
                main_alt_arr = {'name': 'obinwanne', 'origin': 'obowu', 'email': 'email@me.com'};

            });

            it('should combine arrays', function(){
                expect(main_arr).toEqual(main_alt_arr);
            });

        });

        /**
         * Microtime
         */
        describe('_w.microtime', function(){

            var val_1_mt,
                val_2_mt,
                val_1_mt_bool,
                val_2_mt_bool;

            beforeAll(function(){
                val_1_mt = _w.microtime();
                val_2_mt = _w.microtime(true);
                val_1_mt_bool = /^ *[0-9]+?\.[0-9]+? +[0-9]+ *$/i.test(val_1_mt);
                val_2_mt_bool = /^ *[0-9]+\.[0-9]+? *$/i.test(val_2_mt);

            });

            it('should validate microtime', function(){
                expect(val_1_mt_bool).toBe(true);
            });

            it('should validate microtime as float', function(){
                expect(val_2_mt_bool).toBe(true);
            });

        });

        /**
         * Is_String
         */
        describe('_w.isString', function(){

            var val_1_str,
                val_1_is_str_bool,
                val_2_str,
                val_2_is_str_bool
                ;

            beforeAll(function(){

                val_1_str = '';
                val_1_is_str_bool = _w.isString(val_1_str);
                val_2_str = 'test_str';
                val_2_is_str_bool = _w.isString(val_2_str);

            });

            it('should validate empty string', function(){
                expect(val_1_is_str_bool).toBe(true);
            });

            it('should validate non-empty string', function(){
                expect(val_2_is_str_bool).toBe(true);
            });

        });

        /**
         * IsEmptyString
         */
        describe('_w.isEmptyString', function(){

            var val_1_str,
                val_1_is_str_bool,
                val_2_str,
                val_2_is_str_bool
                ;

            beforeAll(function(){

                val_1_str = '';
                val_1_is_str_bool = _w.isEmptyString(val_1_str);
                val_2_str = '       ';
                val_2_is_str_bool = _w.isEmptyString(val_2_str);

            });

            it('should validate zero-character empty string', function(){
                expect(val_1_is_str_bool).toBe(true);
            });

            it('should validate multi-character empty string', function(){
                expect(val_2_is_str_bool).toBe(true);
            });

        });

        /**
         * Is_Number
         */
        describe('_w.isNumber', function(){

            var val_0_int,
                val_0_is_int_bool,
                val_1_int,
                val_1_is_int_bool,
                val_2_int,
                val_2_is_int_bool,
                val_3_int,
                val_3_is_int_bool
                ;

            beforeAll(function(){

                val_0_int = 0;
                val_0_is_int_bool = _w.isNumber(val_0_int);
                val_1_int = 1;
                val_1_is_int_bool = _w.isNumber(val_1_int);
                val_2_int = '1';
                val_2_is_int_bool = _w.isNumber(val_2_int);
                val_3_int = 'test';
                val_3_is_int_bool = _w.isNumber(val_3_int);

            });

            it('should validate 0 as number', function(){
                expect(val_0_is_int_bool).toBe(true);
            });

            it('should validate number', function(){
                expect(val_1_is_int_bool).toBe(true);
            });

            it('should validate number string as number', function(){
                expect(val_2_is_int_bool).toBe(true);
            });

            it('should not validate string as number', function(){
                expect(val_3_is_int_bool).toBe(false);
            });

        });

        /**
         * Is_Bool
         */
        describe('_w.isBool', function(){

            var val_1_bool,
                val_1_is_bool,
                val_2_bool,
                val_2_is_bool
                ;

            beforeAll(function(){

                val_1_bool = true;
                val_1_is_bool = _w.isBool(val_1_bool);
                val_2_bool = 'true';
                val_2_is_bool = _w.isBool(val_2_bool);

            });

            it('should validate boolean', function(){
                expect(val_1_is_bool).toBe(true);
            });

            it('should not validate string boolean', function(){
                expect(val_2_is_bool).toBe(false);
            });

        });

        /**
         * Is_Array
         */
        describe('_w.isArray', function(){

            var val_1_arr,
                val_1_is_arr_bool,
                val_2_arr,
                val_2_is_arr_bool
                ;

            beforeAll(function(){

                val_1_arr = ['one', 'two', 'three'];
                val_1_is_arr_bool = _w.isArray(val_1_arr);
                val_2_arr = {'one': 'first', 'two': 'second', 'three': 'third'};
                val_2_is_arr_bool = _w.isArray(val_2_arr);

            });

            it('should validate basic array', function(){
                expect(val_1_is_arr_bool).toBe(true);
            });

            it('should not validate object array', function(){
                expect(val_2_is_arr_bool).toBe(false);
            });

        });

        /**
         * Is_Object
         */
        describe('_w.isObject', function(){

            var val_1_arr,
                val_1_is_obj_bool,
                val_2_arr,
                val_2_is_obj_bool
                ;

            beforeAll(function(){

                val_1_arr = ['one', 'two', 'three'];
                val_1_is_obj_bool = _w.isObject(val_1_arr);
                val_2_arr = {'one': 'first', 'two': 'second', 'three': 'third'};
                val_2_is_obj_bool = _w.isObject(val_2_arr);

            });

            it('should not validate array', function(){
                expect(val_1_is_obj_bool).toBe(false);
            });

            it('should validate object', function(){
                expect(val_2_is_obj_bool).toBe(true);
            });

        });

        /**
         * IsNullOrUndefined
         */
        describe('_w.isNullOrUndefined', function(){

            var val_null,
                val_null_bool,
                val_undefined,
                val_undefined_bool,
                val_int,
                val_int_bool,
                val_flt,
                val_flt_bool,
                val_str,
                val_str_bool,
                val_truthy,
                val_truthy_bool
                ;

            beforeAll(function(){

                val_null = null;
                val_undefined = undefined;
                val_int = 1;
                val_flt = 1.3;
                val_str = 'test';
                val_truthy = true;

                val_null_bool = _w.isNullOrUndefined(val_null);
                val_undefined_bool = _w.isNullOrUndefined(val_undefined);
                val_int_bool = _w.isNullOrUndefined(val_int);
                val_flt_bool = _w.isNullOrUndefined(val_flt);
                val_str_bool = _w.isNullOrUndefined(val_str);
                val_truthy_bool = _w.isNullOrUndefined(val_truthy);

            });

            it('should validate null', function(){
                expect(val_null_bool).toBe(true);
            });

            it('should validate object', function(){
                expect(val_undefined_bool).toBe(true);
            });

            it('should not validate integer', function(){
                expect(val_int_bool).toBe(false);
            });

            it('should not validate float', function(){
                expect(val_flt_bool).toBe(false);
            });

            it('should not validate string', function(){
                expect(val_str_bool).toBe(false);
            });

            it('should not validate boolean', function(){
                expect(val_truthy_bool).toBe(false);
            });

        });

        /**
         * isFunction
         */
        describe('_w.isFunction', function(){

            var val_fn = function(){},
                is_fn_bool
                ;

            beforeAll(function(){
                is_fn_bool = _w.isFunction(val_fn);
            });

            it('should validate as function', function(){
                expect(is_fn_bool).toBe(true);
            });
        });

        /**
         * Array_to_Integer
         */
        describe('_w.arrayToInteger', function(){

            var val_str_1_arr,
                val_str_2_obj,
                val_int_1_arr,
                val_int_2_obj,
                val_int_1_arr_is_array_bool,
                val_int_2_obj_is_object_bool,
                val_int_1_item_int,
                val_int_2_item_int
                ;

            beforeAll(function(){

                val_str_1_arr = ['10', '20', '30', '40', '50'];
                val_str_2_obj = {first: '10', second: '20', third: '30', fourth: '40', fifth: '50'};
                val_int_1_arr = _w.arrayToInteger(val_str_1_arr);
                val_int_2_obj = _w.arrayToInteger(val_str_2_obj);

                val_int_1_arr_is_array_bool = _w.isArray(val_int_1_arr);
                val_int_2_obj_is_object_bool = _w.isObject(val_int_2_obj);

                val_int_1_item_int = val_int_1_arr[2];
                val_int_2_item_int = val_int_2_obj['fourth'];

            });

            it('should return a valid linear array for array', function(){
                expect(val_int_1_arr_is_array_bool).toBe(true);
            });

            it('should return a valid object for object', function(){
                expect(val_int_2_obj_is_object_bool).toBe(true);
            });

            it('should validate array item [from list array] as integer', function(){
                expect(val_int_1_item_int).toBe(30);
            });

            it('should validate array item [from object array] as integer', function(){
                expect(val_int_2_item_int).toBe(40);
            });

        });

        /**
         * Camel_to_Dash
         */
        describe('_w.camelToDash', function(){

            var val_str_1_str,
                val_str_2_str,
                val_str_1_dash_str,
                val_str_2_dash_str,
                val_str_1_dash_control_str,
                val_str_2_dash_control_str
                ;

            beforeAll(function(){

                val_str_1_str = 'myFirstCamelCaseConversion';
                val_str_2_str = 'myFirstCamelACaseConversion';
                val_str_1_dash_str = _w.camelToDash(val_str_1_str);
                val_str_2_dash_str = _w.camelToDash(val_str_2_str);
                val_str_1_dash_control_str = 'my-first-camel-case-conversion';
                val_str_2_dash_control_str = 'my-first-camel-a-case-conversion';
            });

            it('should convert a camel case string to dash string', function(){
                expect(val_str_1_dash_str).toBe(val_str_1_dash_control_str);
            });

            it('should convert an alternative camel case string to dash string', function(){
                expect(val_str_2_dash_str).toBe(val_str_2_dash_control_str);
            });

        });

        /**
         * Dash_to_Camel
         */
        describe('_w.dashToCamel', function(){

            var val_str_1_str,
                val_str_2_str,
                val_str_1_camel_str,
                val_str_2_camel_str,
                val_str_1_camel_control_str,
                val_str_2_camel_control_str
                ;

            beforeAll(function(){

                val_str_1_str = 'my-first-dash-to-camel-case-conversion';
                val_str_2_str = 'my-first-dash-to-camel-a-case-conversion';
                val_str_1_camel_str = _w.dashToCamel(val_str_1_str);
                val_str_2_camel_str = _w.dashToCamel(val_str_2_str);
                val_str_1_camel_control_str = 'myFirstDashToCamelCaseConversion';
                val_str_2_camel_control_str = 'myFirstDashToCamelACaseConversion';
            });

            it('should convert a dash string to camel case string', function(){
                expect(val_str_1_camel_str).toBe(val_str_1_camel_control_str);
            });

            it('should convert an alternative dash string to camel case string', function(){
                expect(val_str_2_camel_str).toBe(val_str_2_camel_control_str);
            });

        });

        /**
         * getSortedKeys
         */
        describe('_w.getSortedKeys', function(){

            var val_arr,
                val_arr_item_int,
                val_sorted_keys_arr;

            beforeAll(function(){

                val_arr = [10, 100, 1000, 3, 1, 10000, 100000, 200, 2, 20];
                val_sorted_keys_arr = _w.getSortedKeys(val_arr);

                val_arr_item_int = val_sorted_keys_arr[0];
            });

            it('should validate array key of sorted array', function(){
                expect(val_arr_item_int).toBe(4);
            });

        });

        /**
         * getClosestNumberMatchArray
         */
        describe('_w.getClosestNumberMatchArray', function(){

            var val_arr,
                val_arr_closest_match_1_int,
                val_arr_closest_match_2_int,
                val_arr_closest_match_3_int,
                val_arr_closest_match_4_int
                ;

            beforeAll(function(){

                val_arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                val_arr_closest_match_1_int = _w.getClosestNumberMatchArray(val_arr, 11);
                val_arr_closest_match_2_int = _w.getClosestNumberMatchArray(val_arr, 31, true);
                val_arr_closest_match_3_int = _w.getClosestNumberMatchArray(val_arr, 52, false, false);
                val_arr_closest_match_4_int = _w.getClosestNumberMatchArray(val_arr, 74, false, true, 4);

            });

            it('should validate closest number match in sorted array', function(){
                expect(val_arr_closest_match_1_int).toBe(20);
            });

            it('should validate closest number match key position in sorted array', function(){
                expect(val_arr_closest_match_2_int).toBe(3);
            });

            it('should validate closest number match in sorted array with ceiling setting set to false', function(){
                expect(val_arr_closest_match_3_int).toBe(50);
            });

            it('should validate closest number match in sorted array with disable ceiling offset set', function(){
                expect(val_arr_closest_match_4_int).toBe(70);
            });

        });

        /**
         * isEven
         */
        describe('_w.isEven', function(){

            var val_str,
                val_int,
                val_str_is_null,
                val_int_is_even_bool,
                val_int_is_odd_bool;

            beforeAll(function(){

                val_str = 'obi';
                val_str_is_null = _w.isEven(val_str);
                val_int = 24;
                val_int_is_even_bool = _w.isEven(val_int);
                val_int = 27;
                val_int_is_odd_bool = _w.isEven(val_int);

            });

            it('should validate as null if not number', function(){
                expect(val_str_is_null).toBe(null);
            });

            it('should validate as even number', function(){
                expect(val_int_is_even_bool).toBe(true);
            });

            it('should validate as odd number', function(){
                expect(val_int_is_odd_bool).toBe(false);
            });

        });

        /**
         * isEvenDecimal
         */
        describe('_w.isEvenDecimal', function(){

            var val_flt,
                val_flt_is_even_bool,
                val_flt_is_odd_bool;

            beforeAll(function(){

                val_flt = 26.45;
                val_flt_is_even_bool = _w.isEvenDecimal(val_flt);
                val_flt = 27.32;
                val_flt_is_odd_bool = _w.isEvenDecimal(val_flt);

            });

            it('should validate as even decimal', function(){
                expect(val_flt_is_even_bool).toBe(true);
            });

            it('should validate as odd decimal', function(){
                expect(val_flt_is_odd_bool).toBe(false);
            });

        });

        /**
         * _w.strPad
         */
        describe('_w.strPad', function(){

            var val_str,
                val_int,
                val_fill_1_str,
                val_fill_1_control_str,
                val_fill_2_str,
                val_fill_2_control_str,
                val_fill_3_str,
                val_fill_3_control_str,
                val_fill_4_str,
                val_fill_4_control_str,
                val_fill_5_str,
                val_fill_5_control_str
                ;

            beforeAll(function(){

                val_str = 'bucknor';
                val_int = 2408;
                val_fill_1_str = _w.strPad(val_str, 3);
                val_fill_1_control_str = '000bucknor';
                val_fill_2_str = _w.strPad(val_str, 4, '-');
                val_fill_2_control_str = '----bucknor';
                val_fill_3_str = _w.strPad(val_str, 5, '-', true);
                val_fill_3_control_str = 'bucknor-----';
                val_fill_4_str = _w.strPad(val_str, 6, 'xy', false);
                val_fill_4_control_str = 'xyxyxyxyxyxybucknor';
                val_fill_5_str = _w.strPad(val_int, 7, 'xy', false);
                val_fill_5_control_str = 'xyxyxyxyxyxyxy2408';

            });

            it('should pad string with default character', function(){
                expect(val_fill_1_str).toBe(val_fill_1_control_str);
            });

            it('should pad string with custom character', function(){
                expect(val_fill_2_str).toBe(val_fill_2_control_str);
            });

            it('should pad string to right with custom character', function(){
                expect(val_fill_3_str).toBe(val_fill_3_control_str);
            });

            it('should pad string with custom sub-substring', function(){
                expect(val_fill_4_str).toBe(val_fill_4_control_str);
            });

            it('should pad number with custom sub-string', function(){
                expect(val_fill_5_str).toBe(val_fill_5_control_str);
            });

        });

        /**
         * _w.zeroFill
         */
        describe('_w.zeroFill', function(){

            var val_str,
                val_int,
                val_fill_1_str,
                val_fill_1_control_str,
                val_fill_2_str,
                val_fill_2_control_str,
                val_fill_3_str,
                val_fill_3_control_str,
                val_fill_4_str,
                val_fill_4_control_str,
                val_fill_5_str,
                val_fill_5_control_str,
                val_fill_6_str,
                val_fill_6_control_str,
                val_fill_7_str,
                val_fill_7_control_str,
                val_fill_8_str,
                val_fill_8_control_str
                ;

            beforeAll(function(){

                val_str = '2408';
                val_int = 2408;
                val_fill_1_str = _w.zeroFill(val_int, 3);
                val_fill_1_control_str = 2408;
                val_fill_2_str = _w.zeroFill(val_int, 4);
                val_fill_2_control_str = 2408;
                val_fill_3_str = _w.zeroFill(val_int, 5);
                val_fill_3_control_str = '02408';
                val_fill_4_str = _w.zeroFill(val_int, 8);
                val_fill_4_control_str = '00002408';
                val_fill_5_str = _w.zeroFill(val_str, 3);
                val_fill_5_control_str = '2408';
                val_fill_6_str = _w.zeroFill(val_str, 4);
                val_fill_6_control_str = '2408';
                val_fill_7_str = _w.zeroFill(val_str, 5);
                val_fill_7_control_str = '02408';
                val_fill_8_str = _w.zeroFill(val_str, 8);
                val_fill_8_control_str = '00002408';

            });

            it('should zero-fill a number with fill size below number length', function(){
                expect(val_fill_1_str).toBe(val_fill_1_control_str);
            });

            it('should zero-fill a number with fill size equal to number length', function(){
                expect(val_fill_2_str).toBe(val_fill_2_control_str);
            });

            it('should zero-fill a number with fill size just above number length', function(){
                expect(val_fill_3_str).toBe(val_fill_3_control_str);
            });

            it('should zero-fill a number with fill size above number length', function(){
                expect(val_fill_4_str).toBe(val_fill_4_control_str);
            });

            it('should zero-fill a string with fill size below number length', function(){
                expect(val_fill_5_str).toBe(val_fill_5_control_str);
            });

            it('should zero-fill a string with fill size equal to number length', function(){
                expect(val_fill_6_str).toBe(val_fill_6_control_str);
            });

            it('should zero-fill a string with fill size just above number length', function(){
                expect(val_fill_7_str).toBe(val_fill_7_control_str);
            });

            it('should zero-fill a string with fill size above number length', function(){
                expect(val_fill_8_str).toBe(val_fill_8_control_str);
            });

        });

        /**
         * _w.getKeyValuePairs
         */
        describe('_w.getKeyValuePairs', function(){

            var val_1_str,
                val_1_kv_obj,
                val_1_kv_str,
                val_1_kv_control_str,
                val_2_str,
                val_2_kv_obj,
                val_2_kv_str,
                val_2_kv_control_str,
                val_3_str,
                val_3_kv_obj,
                val_3_kv_str,
                val_3_kv_control_str,
                val_4_str,
                val_4_kv_obj,
                val_4_kv_str,
                val_4_kv_control_str
            ;

            beforeAll(function(){

                val_1_str = '<link href="https://fonts.googleapis.com/css?family=PT+Serif:400,700|Signika:300,400,700" rel="stylesheet" type="text/css">';
                val_1_kv_obj = _w.getKeyValuePairs(val_1_str);
                val_1_kv_str = val_1_kv_obj.rel;
                val_1_kv_control_str = 'stylesheet';

                val_2_str = 'one=james|two=henry|three=jerry|four=kevin';
                val_2_kv_obj = _w.getKeyValuePairs(val_2_str, undefined, '=', '|');
                val_2_kv_str = val_2_kv_obj.three;
                val_2_kv_control_str = 'jerry';

                val_3_str = 'one=james|two=henry|three=jerry|four=kevin1';
                val_3_kv_obj = _w.getKeyValuePairs(val_3_str, 'two', '=', '|');
                val_3_kv_str = val_3_kv_obj.four;
                val_3_kv_control_str = 'kevin1';

                val_4_str = 'one=james|two=henry|three=jerry|four=kevin2';
                val_4_kv_obj = _w.getKeyValuePairs(val_4_str, 'two,three', '=', '|');
                val_4_kv_str = val_4_kv_obj.four;
                val_4_kv_control_str = 'kevin2';

            });

            it('should get key-value pairs from a string [single delimiter]', function(){
                expect(val_1_kv_str).toBe(val_1_kv_control_str);
            });

            it('should get key-value pairs from a string [double delimiter]', function(){
                expect(val_2_kv_str).toBe(val_2_kv_control_str);
            });

            it('should get key-value pairs from a string [double delimiter] using filter [single]', function(){
                expect(val_3_kv_str).toBe(val_3_kv_control_str);
            });

            it('should get key-value pairs from a string [double delimiter] using filter [double]', function(){
                expect(val_4_kv_str).toBe(val_4_kv_control_str);
            });

        });

        /**
         * _w.urlencode
         */
        describe('_w.urlencode', function(){

            var val_str = '',
                val_enc_str
            ;

            beforeAll(function(){
                val_str = '$&+,:;=?@';
                val_enc_str = _w.urlencode(val_str);
            });

            it('should url encode string', function(){
                expect(val_enc_str).toBe('%24%26%2B%2C%3A%3B%3D%3F%40');
            });

        });

        /**
         * _w.strrpos
         */
        describe('_w.strrpos', function(){
            var val_haystack_str,
                val_needle_str,
                strrpos_1_int,
                strrpos_2_int
            ;

            beforeAll(function(){
                val_haystack_str = 'this is the end of the this';
                val_needle_str = 'is';
                strrpos_1_int = _w.strrpos(val_haystack_str, val_needle_str);
                strrpos_2_int = _w.strrpos(val_haystack_str, val_needle_str, 26);

            });

            it('should find the position of the last occurrence of a substring in a string', function(){
                expect(strrpos_1_int).toBe(25);
            });

            it('should not find the position of the last occurrence of a substring in a string via offset', function(){
                expect(strrpos_2_int).toBe(false);
            });

        });

        /**
         * _w.isNumberString
         */
        describe('_w.isNumberString', function(){
            var val_int_str,
                val_int_str_is_like_number_bool,
                val_flt_str,
                val_flt_str_is_like_number_bool
                ;

            beforeAll(function(){
                val_int_str = '123456';
                val_flt_str = '123.456';
                val_int_str_is_like_number_bool = _w.isNumberString(val_int_str);
                val_flt_str_is_like_number_bool = _w.isNumberString(val_flt_str);

            });

            it('should check if string looks like an integer e.g. 1234', function(){
                expect(val_int_str_is_like_number_bool).toBe(true);
            });

            it('should check if string looks like a float e.g. 12.34', function(){
                expect(val_flt_str_is_like_number_bool).toBe(true);
            });

        });

        /**
         * _w.isNegative
         */
        describe('_w.isNegative', function(){
            var val_int,
                val_int_is_neg_bool,
                val_flt,
                val_flt_is_neg_bool
                ;

            beforeAll(function(){
                val_int = -123456;
                val_flt = -123.456;
                val_int_is_neg_bool = _w.isNegative(val_int);
                val_flt_is_neg_bool = _w.isNegative(val_flt);
            });

            it('should check if an integer is negative e.g. -1234', function(){
                expect(val_int_is_neg_bool).toBe(true);
            });

            it('should check if a float is negative e.g. -12.34', function(){
                expect(val_flt_is_neg_bool).toBe(true);
            });

        });

        /**
         * _w.escapeRegExp
         */
        describe('_w.escapeRegExp', function(){
            var val_str,
                val_esc_str,
                val_esc_control_str
                ;

            beforeAll(function(){
                val_str = '[my name is ? and my surname is *]';
                val_esc_str = _w.escapeRegExp(val_str);
                val_esc_control_str = '\\[my name is \\? and my surname is \\*\\]';
            });

            it('should check if string is escaped for regex operation', function(){
                expect(val_esc_str).toBe(val_esc_control_str);
            });

        });

        /**
         * _w.replaceAll
         */
        describe('_w.replaceAll', function(){
            var val_str,
                val_replace_str,
                val_replace_control_str
            ;

            beforeAll(function(){
                val_str = 'replace hello and hello and hello with world';
                val_replace_str = _w.replaceAll(val_str, 'hello', 'world');
                val_replace_control_str = 'replace world and world and world with world';
            });

            it('should check if all occurrences of string are replaced', function(){
                expect(val_replace_str).toBe(val_replace_control_str);
            });

        });

        /**
         * _w.explode
         */
        describe('_w.explode', function(){
            var val_str,
                val_expl_1_arr,
                val_expl_2_arr,
                val_expl_3_arr,
                val_expl_1_control_arr,
                val_expl_2_control_arr,
                val_expl_3_control_arr
            ;

            beforeAll(function(){

                val_str = 'this,is,a,string,to,be,exploded';
                val_expl_1_arr = _w.explode(',', val_str);
                val_expl_1_control_arr = ['this', 'is', 'a', 'string', 'to', 'be', 'exploded'];
                val_expl_2_arr = _w.explode(',', val_str, 3);
                val_expl_2_control_arr = ['this', 'is', 'a,string,to,be,exploded'];

                val_expl_3_arr = _w.explode(',', val_str, -1);
                val_expl_3_control_arr = ['this', 'is', 'a', 'string', 'to', 'be'];

            });

            it('should check if string is split properly', function(){
                expect(val_expl_1_arr[3]).toBe(val_expl_1_control_arr[3]);
            });

            it('should check if string is split properly by positive limit', function(){
                expect(val_expl_2_arr[3]).toBe(val_expl_2_control_arr[3]);
            });

            it('should check if string is split properly by negative limit', function(){
                expect(val_expl_3_arr[6]).toBe(val_expl_3_control_arr[6]);
            });

        });

        /**
         * _w.uasort
         */
        describe('_w.uasort', function(){
            var val_arr,
                val_sort_arr,
                val_sort_list_arr = [],
                val_control_arr,
                val_sort_list_control_arr,
                sort_fn
                ;

            beforeAll(function(){

                val_arr = {a: 10, b: -2, c: 4, d: 9, e: -1, f: -12, g: 20, h: 1000, i: -99, j: 8};
                sort_fn = function(a, b){
                    if (a === b) {
                        return 0;
                    }
                    return (a < b) ? -1 : 1;
                };
                val_sort_arr = _w.uasort(val_arr, sort_fn);

                for (var key in val_sort_arr)
                {
                    if (val_sort_arr.hasOwnProperty(key))
                    {
                        val_sort_list_arr.push(val_sort_arr[key]);
                    }
                }

                val_control_arr = {i: -99, f: -12, b: -2, e: -1, c: 4, j: 8, d: 9, a: 10, g: 20, h: 1000};
                val_sort_list_control_arr = [-99, -12, -2, -1, 4, 8, 9, 10, 20, 1000];

            });

            it('should check if array is sorted properly', function(){
                expect(val_sort_list_arr).toEqual(val_sort_list_control_arr);
            });

        });

        /**
         * _w.array_search
         */
        describe('_w.array_search', function(){

            var val_1_arr,
                val_2_arr,
                val_1_search_str,
                val_2_search_str
                ;

            beforeAll(function(){

                val_1_arr = [34, 12, 44, 18, 20, 22, 33, 88, 100, 240];
                val_2_arr = {a: 34, b: 12, c: 44, d: 18, e: 20, f: 22, g: 33, h: 88, i: 100, j: 240};

                val_1_search_str = _w.array_search(18, val_1_arr);
                val_2_search_str = _w.array_search(22, val_2_arr);

            });

            it('should search normal array for a value and return first corresponding key', function(){
                expect(val_1_search_str).toBe('3');
            });

            it('should search object array for a value and return first corresponding key', function(){
                expect(val_2_search_str).toBe('f');
            });

        });

        /**
         * _w.arrayHasDuplicates
         */
        describe('_w.arrayHasDuplicates', function(){

            var val_1_arr,
                val_1_arr_has_dupl_bool,
                val_2_arr,
                val_2_arr_has_dupl_bool
                ;

            beforeAll(function(){

                val_1_arr = [34, 12, 44, 18, 20, 22, 34, 88, 100, 240];
                val_2_arr = [34, 12, 44, 18, 20, 22, 33, 88, 100, 240];

                val_1_arr_has_dupl_bool = _w.arrayHasDuplicates(val_1_arr);
                val_2_arr_has_dupl_bool = _w.arrayHasDuplicates(val_2_arr);
            });

            it('should check if the array has duplicate values', function(){
                expect(val_1_arr_has_dupl_bool).toBe(true);
            });

            it('should check if the array does not have duplicate values', function(){
                expect(val_2_arr_has_dupl_bool).toBe(false);
            });

        });

        /**
         * _w.arrayValueCount
         */
        describe('_w.arrayValueCount', function(){

            var val_1_arr,
                val_1_value_count_int,
                val_2_arr,
                val_2_value_count_int
            ;

            beforeAll(function(){

                val_1_arr = [34, 12, 44, 18, 20, 22, 34, 88, 100, 240];
                val_1_value_count_int = _w.arrayValueCount(34, val_1_arr);

                val_2_arr = ['obinwanne', 'james', 'denzel', 'usain', 'obinwanne', 'brad', 'michael', 'lewis', 'martin', 'john'];
                val_2_value_count_int = _w.arrayValueCount('obinwanne', val_2_arr);
            });

            it('should get the specific value count of an integer array', function(){
                expect(val_1_value_count_int).toBe(2);
            });

            it('should get the specific value count of an string array', function(){
                expect(val_2_value_count_int).toBe(2);
            });

        });

        /**
         * _w.stringToArray
         */
        describe('_w.stringToArray', function(){

            var val_1_str,
                val_1_arr,
                val_2_str,
                val_2_arr
            ;

            beforeAll(function(){
                val_1_str = 'this,string,is,going,to,be,an,array';
                val_1_arr = _w.stringToArray(val_1_str);
                val_2_str = 'one=this,two=string,three=is,four=to,five=be,six=an,seven=array';
                val_2_arr = _w.stringToArray(val_2_str, ',', '=');
            });

            it('should convert comma-delimited string to array', function(){
                expect(val_1_arr[3]).toBe('going');
            });

            it('should convert key-value string to array', function(){
                expect(val_2_arr['three']).toBe('is');
            });

        });

        /**
         * _w.isObjectEmpty
         */
        describe('_w.isObjectEmpty', function(){

            var val_1_obj,
                val_1_is_object_empty_bool,
                val_2_obj,
                val_2_is_object_empty_bool;

            beforeAll(function(){

                val_1_obj = {};
                val_2_obj = {a: 'first', b: 'second', c: 'third'};

                val_1_is_object_empty_bool = _w.isObjectEmpty(val_1_obj);
                val_2_is_object_empty_bool = _w.isObjectEmpty(val_2_obj);

            });

            it('should check if an object is empty', function(){
               expect(val_1_is_object_empty_bool).toBe(true);
            });

            it('should check if an object is not empty', function(){
                expect(val_2_is_object_empty_bool).toBe(false);
            });

        });

        /**
         * _w.substr_count
         */
        describe('_w.substr_count', function(){

            var val_str,
                val_substr_count_int
            ;

            beforeAll(function(){

                val_str = 'this is to check the count of is which is four';
                val_substr_count_int = _w.substr_count(val_str, 'is');

            });

            it('should count the number of substring occurrences', function(){
                expect(val_substr_count_int).toBe(4);
            });

        });

        /**
         * _w.arrayToString
         */
        describe('_w.arrayToString', function(){

            var val_1_str,
                val_1_arr,
                val_1_control_str,
                val_2_str,
                val_2_arr,
                val_2_control_str
                ;

            beforeAll(function(){
                val_1_arr = ['this', 'string', 'is', 'going', 'to', 'be', 'an', 'array'];
                val_1_str = _w.arrayToString(val_1_arr);
                val_1_control_str = 'this,string,is,going,to,be,an,array';

                val_2_arr = {one: 'this', two: 'string', three: 'is', four: 'to', five: 'be', six: 'an', seven: 'array'};
                val_2_str = _w.arrayToString(val_2_arr, ',', '=');
                val_2_control_str = 'one=this,two=string,three=is,four=to,five=be,six=an,seven=array';

            });

            it('should convert array to comma-delimited string', function(){
                expect(val_1_str).toBe(val_1_control_str);
            });

            it('should convert array to key-value string', function(){
                expect(val_2_str).toBe(val_2_control_str);
            });

        });

        /**
         * _w.array_fill
         */
        describe('_w.array_fill', function(){

            var val_1_arr,
                val_1_int,
                val_1_control_int,
                val_2_arr,
                val_2_str,
                val_2_control_str,
                val_3_arr,
                val_3_str,
                val_3_control_str,
                val_4_arr,
                val_4_bool,
                val_4_control_bool
                ;

            beforeAll(function(){

                val_1_arr = _w.array_fill(12, 27);
                val_1_int = val_1_arr[11]
                val_1_control_int = 27;

                val_2_arr = _w.array_fill(18, 'obi');
                val_2_str = val_2_arr[17];
                val_2_control_str = 'obi';

                val_3_arr = _w.array_fill(14, 'obi', -3, true);
                val_3_str = val_3_arr[-2];
                val_3_control_str = 'obi';

                val_4_arr = _w.array_fill('obi', 'obi');
                val_4_bool = val_4_arr;
                val_4_control_bool = false;

            });

            it('should fill an array with numbers', function(){
                expect(val_1_int).toBe(val_1_control_int);
            });

            it('should fill an array with strings', function(){
                expect(val_2_str).toBe(val_2_control_str);
            });

            it('should fill an array with strings and negative start index', function(){
                expect(val_3_str).toBe(val_3_control_str);
            });

            it('should not fill an array', function(){
                expect(val_4_bool).toBe(val_4_control_bool);
            });

        });

        /**
         * _w.regexMatchAll
         */
        describe('_w.regexMatchAll', function(){

            var val_str = 'this is a string containing a lot some is and ng references to test a regex method',
                val_regex_arr,
                val_regex_arr_length_int,
                val_regex_arr_length_control_int,
                val_regex_arr_item_str,
                val_regex_arr_item_control_str
                ;

            beforeAll(function(){
                val_regex_arr = _w.regexMatchAll(/( +is|ng +)/ig, val_str);
                val_regex_arr_length_int = val_regex_arr.length;
                val_regex_arr_length_control_int = 5;
                val_regex_arr_item_str = val_regex_arr[2][1];
                val_regex_arr_item_control_str = 'ng ';
            });

            it('should check that regexMatchAll returns the right number of results', function(){
                expect(val_regex_arr_length_int).toBe(val_regex_arr_length_control_int);
            });

            it('should check that regexMatchAll returns the right result for a specific item', function(){
                expect(val_regex_arr_item_str).toBe(val_regex_arr_item_control_str);
            });

        });

        /**
         * _w.debounce
         */
        describe('_w.debounce', function(){

            var main_fn,
                debounce_fn,
                fn_result_bool;

            beforeAll(function(){

                fn_result_bool = false;
                main_fn = function(){
                    fn_result_bool = true;
                };
                debounce_fn = _w.debounce(function(){
                    fn_result_bool = true;
                }, 200);

                debounce_fn();
            });


            it('should debounce a function', function(){
                expect(fn_result_bool).toBe(false);
            });

        });

        /**
         * _w.throttle
         */
        describe('_w.throttle', function(){

            var main_fn,
                throttle_fn,
                fn_result_bool;

            beforeAll(function(){

                fn_result_bool = false;
                main_fn = function(){
                    fn_result_bool = true;
                };
                throttle_fn = _w.throttle(function(){
                    fn_result_bool = true;
                }, 200);

                throttle_fn();
            });

            it('should throttle a function', function(){
                expect(fn_result_bool).toBe(false);
            });

        });

        /**
         * _w.md5
         */
        describe('_w.md5', function(){

            var val_str,
                val_md5_str,
                val_md5_control_str;

            beforeAll(function(){

                val_str = 'obinwanne';
                val_md5_str = _w.md5(val_str);
                val_md5_control_str = 'bcf3c6ebe0c27dffc662a25d424c65b1';

            });

            it('should calculate the md5 hash of a string', function(){
                expect(val_md5_str).toBe(val_md5_control_str);
            });

        });

        /**
         * _w.padArray
         */
        describe('_w.padArray', function(){
            var val_1_arr,
                val_1_str,
                val_1_control_str,
                val_2_arr,
                val_2_str,
                val_2_control_str,
                val_3_arr,
                val_3_str,
                val_3_control_str,
                val_4_arr,
                val_4_str,
                val_4_control_str
                ;

            beforeAll(function(){

                val_1_arr = _w.padArray(['first1', 'second1', 'third1', 'fourth1'], '-x');
                val_1_str = val_1_arr[2]
                val_1_control_str = '-xthird1';

                val_2_arr = _w.padArray(['first1', 'second1', 'third1', 'fourth1'], '-x', '<<');
                val_2_str = val_2_arr[3]
                val_2_control_str = '-xfourth1';

                val_3_arr = _w.padArray(['first1', 'second1', 'third1', 'fourth1'], '-x', '>>');
                val_3_str = val_3_arr[1]
                val_3_control_str = 'second1-x';

                val_4_arr = _w.padArray(['first1', 'second1', 'third1', 'fourth1'], '-x', '<>');
                val_4_str = val_4_arr[0]
                val_4_control_str = '-xfirst1-x';

            });

            it('should pad the contents of an array with substring [default]', function(){
                expect(val_1_str).toBe(val_1_control_str);
            });

            it('should pad the contents of an array with substring [left-pad]', function(){
                expect(val_2_str).toBe(val_2_control_str);
            });

            it('should pad the contents of an array with substring [right-pad]', function(){
                expect(val_3_str).toBe(val_3_control_str);
            });

            it('should pad the contents of an array with substring [double-pad]', function(){
                expect(val_4_str).toBe(val_4_control_str);
            });

        });

        /**
         * _w.flattenObject
         */
        describe('_w.flattenObject', function(){
            var unflat_1_obj,
                flat_1_obj,
                flat_1_obj_item_str,
                flat_1_obj_item_control_str
                ;

            beforeAll(function(){

                unflat_1_obj = {'one': {'one_sub_1': '10', 'one_sub_2': 23, 'one_sub_3': {'sub_3_1': false, 'sub_3_2': 'sorta_deep1'}}, 'two': 'no_subs', 'three': {'three_sub_1': ['50', 50, 25, '88']}, 'four': [{'four_dot_one': 12}, {'four_dot_two': 13}, {'four_dot_three': 14, 'four_dot_three_sub_1': {'deep_down_1': 'deep_down_value'}}]};
                flat_1_obj = _w.flattenObject(unflat_1_obj);

                flat_1_obj_item_str = flat_1_obj['one.one_sub_3.sub_3_2'];
                flat_1_obj_item_control_str = 'sorta_deep1';

            });

            it('should flatten an object', function(){
                expect(flat_1_obj_item_str).toBe(flat_1_obj_item_control_str);
            });

        });

        /**
         * _w.unflattenObject
         */
        describe('_w.unflattenObject', function(){
            var flat_1_obj,
                unflat_1_obj,
                unflat_1_obj_item_str,
                unflat_1_obj_item_control_str
                ;

            beforeAll(function(){

                flat_1_obj = {"one.one_sub_1":"10","one.one_sub_2":23,"one.one_sub_3.sub_3_1":false,"one.one_sub_3.sub_3_2":"sorta_deep2","two":"no_subs","three.three_sub_1":["50",50,25,"88"],"four":[{"four_dot_one":12},{"four_dot_two":13},{"four_dot_three":14,"four_dot_three_sub_1":{"deep_down_1":"deep_down_value"}}]};
                unflat_1_obj = _w.unflattenObject(flat_1_obj);

                unflat_1_obj_item_str = unflat_1_obj['one']['one_sub_3']['sub_3_2'];
                unflat_1_obj_item_control_str = 'sorta_deep2';

            });

            it('should unflatten an object', function(){
                expect(unflat_1_obj_item_str).toBe(unflat_1_obj_item_control_str);
            });

        });

        /**
         * _w.updateObject
         */
        describe('_w.updateObject', function(){
            var main_1_obj,
                main_2_obj,
                main_3_obj,
                updated_1_obj,
                updated_1_obj_item_str,
                updated_1_obj_item_control_str,
                updated_2_obj,
                updated_2_obj_item_str,
                updated_2_obj_item_control_str,
                updated_3_obj,
                updated_3_obj_item_str,
                updated_3_obj_item_control_str,
                updated_4_obj,
                updated_4_obj_item_str,
                updated_4_obj_item_control_str
                ;

            beforeAll(function(){

                main_1_obj = {'one': {'one_sub_1': '10', 'one_sub_2': 23, 'one_sub_3': {'sub_3_1': false, 'sub_3_2': 'sorta_deep1'}}, 'two': 'no_subs', 'three': {'three_sub_1': ['50', 50, 25, '88']}, 'four': [{'four_dot_one': 12}, {'four_dot_two': 13}, {'four_dot_three': 14, 'four_dot_three_sub_1': {'deep_down_1': 'deep_down_value'}}]};

                main_2_obj = {'one': {'one_sub_1': '10', 'one_sub_2': 23, 'one_sub_3': {'sub_3_1': false, 'sub_3_2': 'sorta_deep1'}}, 'two': 'no_subs', 'three': {'three_sub_1': ['50', 50, 25, '88']}, 'four': [{'four_dot_one': 12}, {'four_dot_two': 13}, {'four_dot_three': 14, 'four_dot_three_sub_1': {'deep_down_1': 'deep_down_value'}}]};

                main_3_obj = {'one': {'one_sub_1': '10', 'one_sub_2': 23, 'one_sub_3': {'sub_3_1': false, 'sub_3_2': 'sorta_deep1'}}, 'two': 'no_subs', 'three': {'three_sub_1': ['50', 50, 25, '88']}, 'four': [{'four_dot_one': 12}, {'four_dot_two': 13}, {'four_dot_three': 14, 'four_dot_three_sub_1': {'deep_down_1': 'deep_down_value'}}]};

                updated_1_obj = _w.updateObject(main_1_obj, 'one.one_sub_3.sub_3_2', 'sorta_deep1_update');
                updated_1_obj_item_str = updated_1_obj['one']['one_sub_3']['sub_3_2'];
                updated_1_obj_item_control_str = 'sorta_deep1_update';

                updated_2_obj = _w.updateObject(main_1_obj, 'three.three_sub_1::put->2', 613);
                updated_2_obj_item_str = updated_2_obj['three']['three_sub_1'][2];
                updated_2_obj_item_control_str = 613;

                updated_3_obj = _w.updateObject(main_2_obj, 'three.three_sub_1::push', 613);
                updated_3_obj_item_str = updated_3_obj['three']['three_sub_1'][4];
                updated_3_obj_item_control_str = 613;

                updated_4_obj = _w.updateObject(main_3_obj, 'three.three_sub_1::unshift', 613);
                updated_4_obj_item_str = updated_4_obj['three']['three_sub_1'][0];
                updated_4_obj_item_control_str = 613;

            });

            it('should update an object [default]', function(){
                expect(updated_1_obj_item_str).toBe(updated_1_obj_item_control_str);
            });

            it('should update an object [via method tag - put]', function(){
                expect(updated_2_obj_item_str).toBe(updated_2_obj_item_control_str);
            });

            it('should update an object [via method tag - push]', function(){
                expect(updated_3_obj_item_str).toBe(updated_3_obj_item_control_str);
            });

            it('should update an object [via method tag - unshift]', function(){
                expect(updated_4_obj_item_str).toBe(updated_4_obj_item_control_str);
            });

        });

    });

    describe('wQuery', function(){

        /**
         * Remove method
         */
        describe('wQuery Remove', function(){

            var elem_0_obj,
                elem_0_first_child_obj,
                elem_0_first_child_attr_str
                ;

            beforeAll(function(){
                elem_0_obj = $('#cntnr-0-remove-1');
                elem_0_obj.remove();
                elem_0_first_child_obj = $('#cntnr-0-remove').child(0);
                elem_0_first_child_attr_str = elem_0_first_child_obj.attr('data-val');
            });

            it('should remove DOM element', function(){
                expect(elem_0_first_child_attr_str).toBe('second_to_remove');
            });

        });

        /**
         * Find method
         */
        describe('wQuery Find', function(){

            var elem_2_obj,
                elem_3_obj,
                elem_sub_2_obj,
                elem_sub_3_obj,
                elem_sub_2_obj_length_int,
                elem_sub_2_obj_selector_str,
                elem_sub_3_obj_length_int,
                elem_sub_3_obj_selector_str;

            beforeAll(function(){
                elem_2_obj = $('#cntnr-2-find');
                elem_3_obj = $('#cntnr-3-find');
                elem_sub_2_obj = elem_2_obj.find('p');
                elem_sub_3_obj = elem_3_obj.find('.alt');

                elem_sub_2_obj_length_int = elem_sub_2_obj.length;
                elem_sub_2_obj_selector_str = elem_sub_2_obj.selector;
                elem_sub_3_obj_length_int = elem_sub_3_obj.length;
                elem_sub_3_obj_selector_str = elem_sub_3_obj.selector;
            });


            it('should find DOM object and validate its size', function(){
                expect(elem_sub_2_obj_length_int).toBe(5);
            });

            it('should find DOM object and validate its selector', function(){
                expect(elem_sub_2_obj_selector_str).toBe('#cntnr-2-find p');
            });

            it('should find DOM object using class selector and validate its size', function(){
                expect(elem_sub_3_obj_length_int).toBe(4);
            });

            it('should find DOM object using class selector and validate its selector', function(){
                expect(elem_sub_3_obj_selector_str).toBe('#cntnr-3-find .alt');
            });

        });

        /**
         * Each method
         */
        describe('wQuery Each', function(){

            var elem_1_obj,
                elem_sub_1_obj,
                counter;

            beforeAll(function(){
                elem_1_obj = $('#cntnr-1-each');
                elem_sub_1_obj = elem_1_obj.find('.alt');
                counter = 0;
                elem_sub_1_obj.each(function(){
                    counter++;
                });
            });

            it('should find DOM Nodelist and using Each method process the correct number of iterations', function(){
                expect(counter).toBe(4);
            });
        });

        /**
         * Clone method
         */
        describe('wQuery Clone', function(){
            var elem_container_main_obj,
                elem_clone_obj,
                elem_clone_find_obj,
                elem_clone_find_obj_length_int,
                elem_clone_1_obj_html_str,
                elem_clone_2_obj_html_str;

            beforeAll(function(){
                elem_container_main_obj = $('#cntnr-wquery');
                elem_clone_obj = $('#cntnr-1-clone');
                elem_clone_obj.clone().appendTo(elem_container_main_obj);

                elem_clone_find_obj = $('.clone');
                elem_clone_find_obj_length_int = elem_clone_find_obj.length;

                elem_clone_1_obj_html_str = elem_clone_find_obj[0].innerHTML;
                elem_clone_2_obj_html_str = elem_clone_find_obj[1].innerHTML;
            });

            it('should clone DOM element', function(){
                expect(elem_clone_find_obj_length_int).toBe(2);
            });

            it('should check if cloned object innerHTML is identical to original', function(){
                expect(elem_clone_1_obj_html_str).toBe(elem_clone_2_obj_html_str);
            });

        });

        /**
         * Attr method
         */
        describe('wQuery Attr', function(){

            var elem_1_attr_obj,
                elem_1_attr_obj_attr_str,
                elem_2_attr_obj,
                elem_2_attr_obj_attr_str,
                elem_3_attr_obj_attr_str,
                elem_4_attr_obj_attr_str,
                elem_5_attr_obj,
                elem_5_attr_obj_item_str,
                elem_5_attr_obj_test_marker_str,
                elem_6_attr_obj,
                elem_6_attr_obj_class_str,
                elem_6_attr_obj_test_marker_str
                ;

            beforeAll(function(){

                elem_1_attr_obj = $('#cntnr-4-1-attr');
                elem_1_attr_obj_attr_str = elem_1_attr_obj.attr('data-var-one');

                elem_2_attr_obj = $('#cntnr-4-2-attr').find('.alt');
                elem_2_attr_obj_attr_str = elem_2_attr_obj.attr('data-var-one');
                $('#cntnr-4-3-attr').attr('data-var-one', 'first_attr_updated');

                elem_3_attr_obj_attr_str = $('#cntnr-4-3-attr').attr('data-var-one');
                $('#cntnr-4-4-attr').attr('data-var-one', 'first_attr_added');

                elem_4_attr_obj_attr_str = $('#cntnr-4-4-attr').attr('data-var-one');

                elem_5_attr_obj = $('#cntnr-4-5-attr').find('.alt');
                elem_5_attr_obj.attr('data-var-one', 'first_attr_added');
                elem_5_attr_obj = $('#cntnr-4-5-attr').find('.alt');

                elem_5_attr_obj_item_str = '';
                elem_5_attr_obj_test_marker_str = '';
                elem_5_attr_obj.each(function(){
                    elem_5_attr_obj_item_str = $(this).attr('data-var-one');
                    elem_5_attr_obj_test_marker_str += (elem_5_attr_obj_item_str === 'first_attr_added') ? '1' : '0';
                });

                elem_6_attr_obj = $('#cntnr-4-6-attr');
                elem_6_attr_obj.removeAttr('class');
                elem_6_attr_obj_class_str = elem_6_attr_obj.attr('class');
                elem_6_attr_obj_test_marker_str = (_w.isNullOrUndefined(elem_6_attr_obj_class_str)) ? '1' : '0';
            });

            it('should get attribute value from DOM element', function(){
                expect(elem_1_attr_obj_attr_str).toBe('first_attr');
            });

            it('should get attribute value from DOM Nodelist as value from first element in list', function(){
                expect(elem_2_attr_obj_attr_str).toBe('paragraph_1');
            });

            it('should update attribute value on DOM element', function(){
                expect(elem_3_attr_obj_attr_str).toBe('first_attr_updated');
            });

            it('should add attribute to DOM element', function(){
                expect(elem_4_attr_obj_attr_str).toBe('first_attr_added');
            });

            it('should add attribute to DOM NodeList', function(){
                expect(elem_5_attr_obj_test_marker_str).toBe('111');
            });

            it('should remove attribute from DOM element', function(){
                expect(elem_6_attr_obj_test_marker_str).toBe('1');
            });

        });

        /**
         * CSS Method
         */
        describe('wQuery CSS', function(){
            var elem_5_1_css_obj,
                elem_5_1_css_prop_str,
                elem_5_2_css_obj,
                elem_5_2_css_prop_str,
                elem_5_3_css_obj,
                elem_5_3_css_prop_str
                ;

            beforeAll(function(){

                elem_5_1_css_obj = $('#cntnr-5-1-css');
                elem_5_1_css_prop_str = elem_5_1_css_obj.css('margin');
                elem_5_1_css_prop_str = elem_5_1_css_prop_str.replace("px", "");

                elem_5_2_css_obj = $('#cntnr-5-2-css');
                elem_5_2_css_obj.css('padding', '29px');
                elem_5_2_css_prop_str = elem_5_2_css_obj.css("padding");
                elem_5_2_css_prop_str = elem_5_2_css_prop_str.replace("px", "");

                elem_5_3_css_obj = $('#cntnr-5-3-css');
                elem_5_3_css_obj.css('padding', null);
                elem_5_3_css_prop_str = elem_5_3_css_obj.css("padding");
                elem_5_3_css_prop_str = elem_5_3_css_prop_str.replace("px", "");

            });

            it('should get CSS property of DOM element', function(){
                expect(elem_5_1_css_prop_str).toBe('10');
            });

            it('should set CSS property of DOM element', function(){
                expect(elem_5_2_css_prop_str).toBe('29');
            });

            it('should reset CSS property of DOM element', function(){
                expect(elem_5_3_css_prop_str).not.toBe('20');
            });

        });

        /**
         * Event Methods - On, Off, Trigger
         */
        describe('wQuery Events', function(){
            var elem_6_1_events_obj,
                elem_6_2_events_obj,
                elem_6_2_events_callback_fn,
                elem_6_2_events_trigger_int = 1,
                elem_6_3_events_obj,
                elem_6_3_events_trigger_bool = false
                ;

            beforeAll(function(){

                elem_6_1_events_obj = $('#cntnr-6-1-events');

                spyOn(elem_6_1_events_obj, 'trigger');

                elem_6_1_events_obj.on('click', function(){
                    console.log('clicked');
                });
                elem_6_1_events_obj.trigger('click');

                elem_6_2_events_obj = $('#cntnr-6-2-events');

                elem_6_2_events_callback_fn = function(){
                    elem_6_2_events_trigger_int += 1;
                };
                elem_6_2_events_obj.on('click', elem_6_2_events_callback_fn);
                elem_6_2_events_obj.off('click', elem_6_2_events_callback_fn);
                elem_6_2_events_obj.trigger('click');

                elem_6_3_events_obj = $('#cntnr-6-3-events');
                elem_6_3_events_obj.on('click', function(){
                    console.log('clicked');
                    elem_6_3_events_trigger_bool = true;
                });
                elem_6_3_events_obj.trigger('click');

            });

            it('should attach event handler to DOM element', function(){
                expect(elem_6_1_events_obj.trigger).toHaveBeenCalled();
            });

            it('should attach and detach event handler to DOM element', function(){
                expect(elem_6_2_events_trigger_int).toBe(1);
            });

            it('should manually trigger event handler on DOM element', function(){
                expect(elem_6_3_events_trigger_bool).toBe(true);
            });

        });

        /**
         * Class Methods
         */
        describe('wQuery Classes', function(){
            var elem_7_1_classes_obj,
                elem_7_2_classes_obj,
                elem_7_3_classes_obj,
                elem_7_4_classes_obj,
                elem_7_5_classes_obj,
                elem_7_6_classes_obj,
                elem_7_1_classes_attr_str,
                elem_7_2_classes_attr_str,
                elem_7_3_classes_attr_str,
                elem_7_4_classes_has_class_bool,
                elem_7_5_classes_has_class_bool,
                elem_7_6_classes_has_class_bool
                ;

            beforeAll(function(){
                elem_7_1_classes_obj = $('#cntnr-7-1-classes');
                elem_7_1_classes_obj.addClass('class_1');
                elem_7_1_classes_attr_str = elem_7_1_classes_obj.attr('class');

                elem_7_2_classes_obj = $('#cntnr-7-2-classes');
                elem_7_2_classes_obj.removeClass('class_3');
                elem_7_2_classes_attr_str = elem_7_2_classes_obj.attr('class');

                elem_7_3_classes_obj = $('#cntnr-7-3-classes');
                elem_7_3_classes_obj.toggleClass('class_2').toggleClass('class_3');
                elem_7_3_classes_attr_str = elem_7_3_classes_obj.attr('class');

                elem_7_4_classes_obj = $('#cntnr-7-4-classes');
                elem_7_4_classes_has_class_bool = elem_7_4_classes_obj.hasClass('class_2');

                elem_7_5_classes_obj = $('#cntnr-7-5-classes');
                elem_7_5_classes_has_class_bool = elem_7_5_classes_obj.hasClass('class_4 class_5');

                elem_7_6_classes_obj = $('#cntnr-7-6-classes');
                elem_7_6_classes_has_class_bool = elem_7_6_classes_obj.hasClass('class_3 class_8 class_87', true);
            });

            it('should add class to DOM element', function(){
                expect(elem_7_1_classes_attr_str).toMatch(/class_1/);
            });

            it('should remove class from DOM element', function(){
                expect(elem_7_2_classes_attr_str).not.toMatch(/class_3/);
            });

            it('should toggle class of DOM element', function(){
                expect(elem_7_3_classes_attr_str).not.toMatch(/class_3/);
            });

            it('should check whether a DOM element has class', function(){
                expect(elem_7_4_classes_has_class_bool).toBe(true);
            });

            it('should check whether a DOM element has multiple classes', function(){
                expect(elem_7_5_classes_has_class_bool).toBe(true);
            });

            it('should check whether a DOM element has multiple classes [with all or none flag set to true]', function(){
                expect(elem_7_6_classes_has_class_bool).toBe(false);
            });

        });

        /**
         * Traversal
         */
        describe('wQuery Traversal', function(){

            var elem_trav_1_curr_obj,
                elem_trav_1_next_obj,
                elem_trav_1_attr_val_str,
                elem_trav_2_curr_obj,
                elem_trav_2_prev_obj,
                elem_trav_2_attr_val_str,
                elem_trav_3_curr_obj,
                elem_trav_3_parent_obj,
                elem_trav_3_child_obj,
                elem_trav_3_child_nth_obj,
                elem_trav_3_1_attr_val_str,
                elem_trav_3_2_attr_val_str,
                elem_trav_3_3_attr_val_str,
                elem_trav_4_obj,
                elem_trav_4_list_obj,
                elem_trav_4_list_jq_obj,
                elem_trav_4_list_item_first_obj,
                elem_trav_4_list_item_first_jq_obj,
                elem_trav_4_list_item_first_attr_val_str,
                elem_trav_4_list_item_last_obj,
                elem_trav_4_list_item_last_jq_obj,
                elem_trav_4_list_item_last_attr_val_str,
                elem_trav_4_list_item_mid_obj,
                elem_trav_4_list_item_mid_jq_obj,
                elem_trav_4_list_item_mid_attr_val_str
                ;

            beforeAll(function(){

                elem_trav_1_curr_obj = $('#cntnr-8-1-trav');
                elem_trav_1_next_obj = elem_trav_1_curr_obj.next();
                elem_trav_1_attr_val_str = elem_trav_1_next_obj.attr('data-val');

                elem_trav_2_curr_obj = $('#cntnr-8-4-trav');
                elem_trav_2_prev_obj = elem_trav_2_curr_obj.prev();
                elem_trav_2_attr_val_str = elem_trav_2_prev_obj.attr('data-val');

                elem_trav_3_curr_obj = $('#cntnr-8-6-trav-child');
                elem_trav_3_parent_obj = elem_trav_3_curr_obj.parent();
                elem_trav_3_child_obj = elem_trav_3_curr_obj.child();
                elem_trav_3_child_nth_obj = elem_trav_3_curr_obj.child(2);
                elem_trav_3_1_attr_val_str = elem_trav_3_parent_obj.attr('data-val');
                elem_trav_3_2_attr_val_str = elem_trav_3_child_obj.attr('data-val');
                elem_trav_3_3_attr_val_str = elem_trav_3_child_nth_obj.attr('data-val');

                elem_trav_4_obj = $('#cntnr-8-7-trav-list');
                elem_trav_4_list_obj = elem_trav_4_obj.find('li');
                elem_trav_4_list_jq_obj = $(elem_trav_4_list_obj);

                elem_trav_4_list_item_first_obj = elem_trav_4_list_jq_obj.first();
                elem_trav_4_list_item_first_jq_obj = $(elem_trav_4_list_item_first_obj);
                elem_trav_4_list_item_first_attr_val_str = elem_trav_4_list_item_first_jq_obj.attr('data-val');

                elem_trav_4_list_item_last_obj = elem_trav_4_list_jq_obj.last();
                elem_trav_4_list_item_last_jq_obj = $(elem_trav_4_list_item_last_obj);
                elem_trav_4_list_item_last_attr_val_str = elem_trav_4_list_item_last_jq_obj.attr('data-val');

                elem_trav_4_list_item_mid_obj = elem_trav_4_list_jq_obj.mid();
                elem_trav_4_list_item_mid_jq_obj = $(elem_trav_4_list_item_mid_obj);
                elem_trav_4_list_item_mid_attr_val_str = elem_trav_4_list_item_mid_jq_obj.attr('data-val');
            });

            it('should get next DOM element', function(){
                expect(elem_trav_1_attr_val_str).toBe('trav8_2');
            });

            it('should get previous DOM element', function(){
                expect(elem_trav_2_attr_val_str).toBe('trav8_3');
            });

            it('should get parent of DOM element', function(){
                expect(elem_trav_3_1_attr_val_str).toBe('trav8_6');
            });

            it('should get child of DOM element', function(){
                expect(elem_trav_3_2_attr_val_str).toBe('trav8_6_grandchild_1');
            });

            it('should get specific child of DOM element', function(){
                expect(elem_trav_3_3_attr_val_str).toBe('trav8_6_grandchild_3');
            });

            it('should get first DOM element of a list', function(){
                expect(elem_trav_4_list_item_first_attr_val_str).toBe('trav8_7_first');
            });

            it('should get last DOM element of a list', function(){
                expect(elem_trav_4_list_item_last_attr_val_str).toBe('trav8_7_ninth');
            });

            it('should get middle DOM element of a list', function(){
                expect(elem_trav_4_list_item_mid_attr_val_str).toBe('trav8_7_fifth');
            });

        });

        /**
         * Forms
         */
        describe('wQuery Forms', function() {

            var elem_forms_9_1_obj,
                elem_forms_9_1_val_str,
                elem_forms_9_2_obj,
                elem_forms_9_2_val_str
                ;

            beforeAll(function(){

                elem_forms_9_1_obj = $('#cntnr-9-forms-text-1');
                elem_forms_9_2_obj = $('#cntnr-9-forms-text-2');

                elem_forms_9_1_val_str = elem_forms_9_1_obj.val();
                elem_forms_9_2_val_str = elem_forms_9_2_obj.val('second_text_box').val();

            });

            it('should get the value of textbox', function(){
                expect(elem_forms_9_1_val_str).toBe('first_text_box');
            });

            it('should set the value of textbox', function(){
                expect(elem_forms_9_2_val_str).toBe('second_text_box');
            });

        });

        /**
         * HTML Content
         */
        describe('wQuery HTML', function() {

            var elem_html_10_1_obj,
                elem_html_10_1_val_str,
                elem_html_10_2_obj,
                elem_html_10_2_val_str,
                elem_html_10_3_obj,
                elem_html_10_3_val_str
                ;

            beforeAll(function(){

                elem_html_10_1_obj = $('#cntnr-10-1-html');
                elem_html_10_2_obj = $('#cntnr-10-2-html');
                elem_html_10_3_obj = $('#cntnr-10-3-html');

                elem_html_10_1_val_str = elem_html_10_1_obj.html();
                elem_html_10_2_val_str = elem_html_10_2_obj.html();
                elem_html_10_3_val_str = elem_html_10_3_obj.html('<span>html_set</span>').html();

                //convert to lower case
                elem_html_10_1_val_str = elem_html_10_1_val_str.toLowerCase();
                elem_html_10_2_val_str = elem_html_10_2_val_str.toLowerCase();
                elem_html_10_3_val_str = elem_html_10_3_val_str.toLowerCase();

            });

            it('should get the text content of DOM element', function(){
                expect(elem_html_10_1_val_str).toBe('text');
            });

            it('should get the html content of DOM element', function(){
                expect(elem_html_10_2_val_str).toBe('<span>html</span>');
            });

            it('should set the html content of DOM element', function(){
                expect(elem_html_10_3_val_str).toBe('<span>html_set</span>');
            });

        });

        /**
         * Manipulation
         */
        describe('wQuery DOM Manipulation', function(){

            var elem_dom_11_1_obj,
                elem_dom_11_1_p_obj,
                elem_dom_11_1_new_obj,
                elem_dom_11_1_new_child_obj,
                elem_dom_11_1_new_child_attr_str,
                elem_dom_11_2_obj,
                elem_dom_11_2_p_obj,
                elem_dom_11_2_new_obj,
                elem_dom_11_2_new_child_obj,
                elem_dom_11_2_new_child_attr_str,
                elem_dom_11_3_obj,
                elem_dom_11_3_p_obj,
                elem_dom_11_3_new_obj,
                elem_dom_11_3_new_child_obj,
                elem_dom_11_3_new_child_attr_str,
                elem_dom_11_4_obj,
                elem_dom_11_4_p_obj,
                elem_dom_11_4_new_obj,
                elem_dom_11_4_new_child_obj,
                elem_dom_11_4_new_child_attr_str,
                elem_dom_11_5_p1_obj,
                elem_dom_11_5_p2_obj,
                elem_dom_11_5_obj,
                elem_dom_11_5_sibling_obj,
                elem_dom_11_5_sibling_attr_str,
                elem_dom_11_6_p1_obj,
                elem_dom_11_6_p2_obj,
                elem_dom_11_6_obj,
                elem_dom_11_6_sibling_obj,
                elem_dom_11_6_sibling_attr_str,
                elem_dom_11_7_obj,
                elem_dom_11_7_p1_obj,
                elem_dom_11_7_p1_obj_width_int,
                elem_dom_11_7_p1_obj_has_width_bool,
                elem_dom_11_7_p1_obj_is_shown_bool,
                elem_dom_11_7_p1_obj_is_hidden_bool,
                elem_dom_11_7_p2_obj,
                elem_dom_11_7_p2_obj_width_int,
                elem_dom_11_7_p2_obj_has_width_bool,
                elem_dom_11_7_p2_obj_is_shown_bool,
                elem_dom_11_7_p2_obj_is_hidden_bool,
                elem_dom_11_7_p3_obj,
                elem_dom_11_7_p3_obj_width_int,
                elem_dom_11_7_p3_obj_has_width_bool,
                elem_dom_11_7_p4_obj,
                elem_dom_11_7_p4_obj_width_int,
                elem_dom_11_7_p4_obj_has_width_bool,
                elem_dom_11_7_p5_obj,
                elem_dom_11_7_p5_obj_width_int,
                elem_dom_11_7_p5_obj_has_width_bool,
                elem_dom_11_7_p5_obj_is_shown_bool,
                elem_dom_11_7_p5_obj_is_hidden_bool,
                elem_dom_11_7_p6_obj,
                elem_dom_11_7_p6_obj_width_int,
                elem_dom_11_7_p6_obj_has_width_bool,
                elem_dom_11_7_p6_obj_is_shown_bool,
                elem_dom_11_7_p6_obj_is_hidden_bool,
                elem_dom_11_7_p7_obj,
                elem_dom_11_7_p7_obj_width_int,
                elem_dom_11_7_p7_obj_has_width_bool,
                elem_dom_11_7_p7_obj_is_shown_bool,
                elem_dom_11_7_p7_obj_is_hidden_bool,
                elem_dom_11_7_p8_obj,
                elem_dom_11_7_p8_obj_width_int,
                elem_dom_11_7_p8_obj_has_width_bool,
                elem_dom_11_7_p8_obj_is_shown_bool,
                elem_dom_11_7_p8_obj_is_hidden_bool,
                elem_dom_11_8_obj,
                elem_dom_11_8_p_obj,
                elem_dom_11_8_new_p_obj,
                elem_dom_11_9_obj,
                elem_dom_11_9_p_obj,
                elem_dom_11_9_new_p_obj

                ;

            beforeAll(function(){

                elem_dom_11_1_obj = $('#cntnr-11-1-dom');
                elem_dom_11_1_p_obj = $('#cntnr-11-util-p-1');
                elem_dom_11_1_obj.append(elem_dom_11_1_p_obj);
                elem_dom_11_1_new_obj = $('#cntnr-11-1-dom');
                elem_dom_11_1_new_child_obj = elem_dom_11_1_new_obj.child(4);
                elem_dom_11_1_new_child_attr_str = elem_dom_11_1_new_child_obj.attr('data-val');

                elem_dom_11_2_obj = $('#cntnr-11-2-dom');
                elem_dom_11_2_p_obj = $('#cntnr-11-util-p-2');
                elem_dom_11_2_p_obj.appendTo(elem_dom_11_2_obj);
                elem_dom_11_2_new_obj = $('#cntnr-11-2-dom');
                elem_dom_11_2_new_child_obj = elem_dom_11_2_new_obj.child(4);
                elem_dom_11_2_new_child_attr_str = elem_dom_11_2_new_child_obj.attr('data-val');

                elem_dom_11_3_obj = $('#cntnr-11-3-dom');
                elem_dom_11_3_p_obj = $('#cntnr-11-util-p-3');
                elem_dom_11_3_obj.prepend(elem_dom_11_3_p_obj);
                elem_dom_11_3_new_obj = $('#cntnr-11-3-dom');
                elem_dom_11_3_new_child_obj = elem_dom_11_3_new_obj.child(0);
                elem_dom_11_3_new_child_attr_str = elem_dom_11_3_new_child_obj.attr('data-val');

                elem_dom_11_4_obj = $('#cntnr-11-4-dom');
                elem_dom_11_4_p_obj = $('#cntnr-11-util-p-4');
                elem_dom_11_4_p_obj.prependTo(elem_dom_11_4_obj);
                elem_dom_11_4_new_obj = $('#cntnr-11-4-dom');
                elem_dom_11_4_new_child_obj = elem_dom_11_4_new_obj.child(0);
                elem_dom_11_4_new_child_attr_str = elem_dom_11_4_new_child_obj.attr('data-val');

                elem_dom_11_5_p1_obj = $('#cntnr-11-5-dom-p');
                elem_dom_11_5_p2_obj = $('#cntnr-11-util-p-5');
                elem_dom_11_5_p2_obj.addBefore(elem_dom_11_5_p1_obj);
                elem_dom_11_5_obj = $('#cntnr-11-5-dom');
                elem_dom_11_5_sibling_obj = elem_dom_11_5_obj.child(0);
                elem_dom_11_5_sibling_attr_str = elem_dom_11_5_sibling_obj.attr('data-val');

                elem_dom_11_6_p1_obj = $('#cntnr-11-6-dom-p');
                elem_dom_11_6_p2_obj = $('#cntnr-11-util-p-6');
                elem_dom_11_6_p2_obj.addAfter(elem_dom_11_6_p1_obj);
                elem_dom_11_6_obj = $('#cntnr-11-6-dom');
                elem_dom_11_6_sibling_obj = elem_dom_11_6_obj.child(1);
                elem_dom_11_6_sibling_attr_str = elem_dom_11_6_sibling_obj.attr('data-val');

                elem_dom_11_7_obj = $('#cntnr-11-7-dom');
                elem_dom_11_7_p1_obj = $('#cntnr-11-7-dom-p1');
                elem_dom_11_7_p2_obj = $('#cntnr-11-7-dom-p2');
                elem_dom_11_7_p3_obj = $('#cntnr-11-7-dom-p3');
                elem_dom_11_7_p4_obj = $('#cntnr-11-7-dom-p4');
                elem_dom_11_7_p5_obj = $('#cntnr-11-7-dom-p5');
                elem_dom_11_7_p6_obj = $('#cntnr-11-7-dom-p6');
                elem_dom_11_7_p7_obj = $('#cntnr-11-7-dom-p7');
                elem_dom_11_7_p8_obj = $('#cntnr-11-7-dom-p8');

                elem_dom_11_7_p1_obj.hide();
                elem_dom_11_7_p1_obj_width_int = elem_dom_11_7_p1_obj.width();

                elem_dom_11_7_p1_obj_is_shown_bool = elem_dom_11_7_p1_obj.isShown();
                elem_dom_11_7_p1_obj_is_hidden_bool = elem_dom_11_7_p1_obj.isHidden();
                elem_dom_11_7_p1_obj_has_width_bool = !!(elem_dom_11_7_p1_obj_width_int);

                elem_dom_11_7_p2_obj.show();
                elem_dom_11_7_p2_obj_width_int = elem_dom_11_7_p2_obj.width();

                elem_dom_11_7_p2_obj_is_shown_bool = elem_dom_11_7_p2_obj.isShown();
                elem_dom_11_7_p2_obj_is_hidden_bool = elem_dom_11_7_p2_obj.isHidden();
                elem_dom_11_7_p2_obj_has_width_bool = !!(elem_dom_11_7_p2_obj_width_int);

                elem_dom_11_7_p3_obj.toggle();
                elem_dom_11_7_p3_obj_width_int = elem_dom_11_7_p3_obj.width();
                elem_dom_11_7_p3_obj_has_width_bool = !!(elem_dom_11_7_p3_obj_width_int);

                elem_dom_11_7_p4_obj.toggle();
                elem_dom_11_7_p4_obj_width_int = elem_dom_11_7_p4_obj.width();
                elem_dom_11_7_p4_obj_has_width_bool = !!(elem_dom_11_7_p4_obj_width_int);


                elem_dom_11_7_p5_obj.vHide();
                elem_dom_11_7_p5_obj_width_int = elem_dom_11_7_p5_obj.width();

                elem_dom_11_7_p5_obj_is_shown_bool = elem_dom_11_7_p5_obj.isVShown();
                elem_dom_11_7_p5_obj_is_hidden_bool = elem_dom_11_7_p5_obj.isVHidden();
                elem_dom_11_7_p5_obj_has_width_bool = !!(elem_dom_11_7_p5_obj_width_int);

                elem_dom_11_7_p6_obj.vShow();
                elem_dom_11_7_p6_obj_width_int = elem_dom_11_7_p6_obj.width();

                elem_dom_11_7_p6_obj_is_shown_bool = elem_dom_11_7_p6_obj.isVShown();
                elem_dom_11_7_p6_obj_is_hidden_bool = elem_dom_11_7_p6_obj.isVHidden();
                elem_dom_11_7_p6_obj_has_width_bool = !!(elem_dom_11_7_p6_obj_width_int);

                elem_dom_11_7_p7_obj.vToggle();
                elem_dom_11_7_p7_obj_is_shown_bool = elem_dom_11_7_p7_obj.isVShown();
                elem_dom_11_7_p7_obj_is_hidden_bool = elem_dom_11_7_p7_obj.isVHidden();
                elem_dom_11_7_p7_obj_has_width_bool = !!(elem_dom_11_7_p7_obj_width_int);

                elem_dom_11_7_p8_obj.vToggle();
                elem_dom_11_7_p8_obj_is_shown_bool = elem_dom_11_7_p8_obj.isVShown();
                elem_dom_11_7_p8_obj_is_hidden_bool = elem_dom_11_7_p8_obj.isVHidden();
                elem_dom_11_7_p8_obj_has_width_bool = !!(elem_dom_11_7_p8_obj_width_int);

                elem_dom_11_8_obj = $('#cntnr-11-8-dom');
                elem_dom_11_8_p_obj = $('.list-util-p-8');
                elem_dom_11_8_p_obj.appendTo(elem_dom_11_8_obj);
                elem_dom_11_8_new_p_obj = $('#cntnr-11-8-dom').find('p');

                elem_dom_11_9_obj = $('#cntnr-11-9-dom');
                elem_dom_11_9_p_obj = $('.list-util-p-9');
                elem_dom_11_9_p_obj.prependTo(elem_dom_11_9_obj);
                elem_dom_11_9_new_p_obj = $('#cntnr-11-9-dom').find('p');

            });

            it('should append DOM object using append function', function(){
                expect(elem_dom_11_1_new_child_attr_str).toBe('last_p1');
            });

            it('should append DOM object using appendTo function', function(){
                expect(elem_dom_11_2_new_child_attr_str).toBe('last_p2');
            });

            it('should append DOM list using appendTo function', function(){
                expect(elem_dom_11_8_new_p_obj.length).toBe(8);
            });

            it('should prepend DOM object using prepend function', function(){
                expect(elem_dom_11_3_new_child_attr_str).toBe('last_p3');
            });

            it('should prepend DOM object using prependTo function', function(){
                expect(elem_dom_11_4_new_child_attr_str).toBe('last_p4');
            });

            it('should append DOM list using prependTo function', function(){
                expect(elem_dom_11_9_new_p_obj.length).toBe(6);
            });

            it('should insert before DOM element', function(){
                expect(elem_dom_11_5_sibling_attr_str).toBe('last_p5');
            });

            it('should insert after DOM element', function(){
                expect(elem_dom_11_6_sibling_attr_str).toBe('last_p6');
            });

            it('should hide DOM element', function(){
                expect(elem_dom_11_7_p1_obj_has_width_bool).toBe(false);
            });

            it('should check if just hidden DOM element is shown', function(){
                expect(elem_dom_11_7_p1_obj_is_shown_bool).toBe(false);
            });

            it('should check if just hidden DOM element is hidden', function(){
                expect(elem_dom_11_7_p1_obj_is_hidden_bool).toBe(true);
            });

            it('should show DOM element', function(){
                expect(elem_dom_11_7_p2_obj_has_width_bool).toBe(true);
            });

            it('should check if just shown DOM element is shown', function(){
                expect(elem_dom_11_7_p2_obj_is_shown_bool).toBe(true);
            });

            it('should check if just shown DOM element is hidden', function(){
                expect(elem_dom_11_7_p2_obj_is_hidden_bool).toBe(false);
            });

            it('should toggle shown DOM element', function(){
                expect(elem_dom_11_7_p3_obj_has_width_bool).toBe(false);
            });

            it('should toggle hidden DOM element', function(){
                expect(elem_dom_11_7_p4_obj_has_width_bool).toBe(true);
            });

            it('should hide DOM element (visibility)', function(){
                expect(elem_dom_11_7_p5_obj_has_width_bool).toBe(true);
            });

            it('should check if just hidden DOM element is shown (visibility)', function(){
                expect(elem_dom_11_7_p5_obj_is_shown_bool).toBe(false);
            });

            it('should check if just hidden DOM element is hidden (visibility)', function(){
                expect(elem_dom_11_7_p5_obj_is_hidden_bool).toBe(true);
            });

            it('should show DOM element (visibility)', function(){
                expect(elem_dom_11_7_p6_obj_has_width_bool).toBe(true);
            });

            it('should check if just shown DOM element is shown (visibility)', function(){
                expect(elem_dom_11_7_p6_obj_is_shown_bool).toBe(true);
            });

            it('should check if just shown DOM element is hidden (visibility)', function(){
                expect(elem_dom_11_7_p6_obj_is_hidden_bool).toBe(false);
            });

            it('should toggle shown DOM element (visibility)', function(){
                expect(elem_dom_11_7_p7_obj_is_shown_bool).toBe(false);
            });

            it('should toggle hidden DOM element (visibility)', function(){
                expect(elem_dom_11_7_p8_obj_is_shown_bool).toBe(true);
            });

        });

        /**
         * Dimensions
         */
        describe('wQuery Dimensions', function(){

            var elem_dim_12_1_obj,
                elem_dim_12_2_obj,
                elem_dim_12_1_width_int,
                elem_dim_12_2_width_int,
                elem_dim_12_1_height_int,
                elem_dim_12_2_height_int,
                elem_dim_12_1_width_inner_int,
                elem_dim_12_2_width_inner_int,
                elem_dim_12_1_height_inner_int,
                elem_dim_12_2_height_inner_int,
                elem_dim_12_1_width_outer_int,
                elem_dim_12_2_width_outer_int,
                elem_dim_12_1_height_outer_int,
                elem_dim_12_2_height_outer_int,
                elem_dim_12_1_width_outer_true_int,
                elem_dim_12_2_width_outer_true_int,
                elem_dim_12_1_height_outer_true_int,
                elem_dim_12_2_height_outer_true_int
                ;

            beforeAll(function()
            {
                elem_dim_12_1_obj = $('#cntnr-12-1-dimensions');
                elem_dim_12_2_obj = $('#cntnr-12-2-dimensions');

                elem_dim_12_1_width_int = elem_dim_12_1_obj.width();
                elem_dim_12_2_width_int = elem_dim_12_2_obj.width();
                elem_dim_12_1_height_int = elem_dim_12_1_obj.height();
                elem_dim_12_2_height_int = elem_dim_12_2_obj.height();
                elem_dim_12_1_width_inner_int = elem_dim_12_1_obj.innerWidth();
                elem_dim_12_2_width_inner_int = elem_dim_12_2_obj.innerWidth();
                elem_dim_12_1_height_inner_int = elem_dim_12_1_obj.innerHeight();
                elem_dim_12_2_height_inner_int = elem_dim_12_2_obj.innerHeight();
                elem_dim_12_1_width_outer_int = elem_dim_12_1_obj.outerWidth();
                elem_dim_12_2_width_outer_int = elem_dim_12_2_obj.outerWidth();
                elem_dim_12_1_height_outer_int = elem_dim_12_1_obj.outerHeight();
                elem_dim_12_2_height_outer_int = elem_dim_12_2_obj.outerHeight();
                elem_dim_12_1_width_outer_true_int = elem_dim_12_1_obj.outerWidth(true);
                elem_dim_12_2_width_outer_true_int = elem_dim_12_2_obj.outerWidth(true);
                elem_dim_12_1_height_outer_true_int = elem_dim_12_1_obj.outerHeight(true);
                elem_dim_12_2_height_outer_true_int = elem_dim_12_2_obj.outerHeight(true);

            });

            it('should get width of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_width_int).toBe(191);
            });

            it('should get width of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_width_int).toBe(213);
            });

            it('should get height of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_height_int).toBe(348);
            });

            it('should get height of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_height_int).toBe(384);
            });

            it('should get inner width of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_width_inner_int).toBe(203);
            });

            it('should get inner width of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_width_inner_int).toBe(225);
            });

            it('should get inner height of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_height_inner_int).toBe(374);
            });

            it('should get inner height of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_height_inner_int).toBe(410);
            });

            it('should get outer width of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_width_outer_int).toBe(213);
            });

            it('should get outer width of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_width_outer_int).toBe(235);
            });

            it('should get outer height of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_height_outer_int).toBe(384);
            });

            it('should get outer height of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_height_outer_int).toBe(420);
            });

            it('should get outer width incl. margin of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_width_outer_true_int).toBe(223);
            });

            it('should get outer width incl. margin of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_width_outer_true_int).toBe(245);
            });

            it('should get outer height incl. margin of the DOM element with box-sizing: border-box', function(){
                expect(elem_dim_12_1_height_outer_true_int).toBe(400);
            });

            it('should get outer height incl. margin of the DOM element with box-sizing: content-box', function(){
                expect(elem_dim_12_2_height_outer_true_int).toBe(436);
            });
        });

        /**
         * Data
         */
        describe('wQuery Data', function(){

            var elem_data_13_1_obj,
                elem_data_13_1_data_str,
                elem_data_13_1_data_str_is_valid_bool,
                elem_data_13_1_data_int,
                elem_data_13_1_data_int_is_valid_bool,
                elem_data_13_1_data_bool,
                elem_data_13_1_data_bool_is_valid_bool,
                elem_data_13_1_data_arr,
                elem_data_13_1_data_arr_is_valid_bool,
                elem_data_13_1_data_obj,
                elem_data_13_1_data_obj_is_valid_bool,
                elem_data_13_2_data_str
                ;

            beforeAll(function(){
                elem_data_13_1_obj = $('#cntnr-13-1-data');

                elem_data_13_1_obj.data('w_data_string', 'data');
                elem_data_13_1_data_str = elem_data_13_1_obj.data('w_data_string');
                elem_data_13_1_data_str_is_valid_bool = _w.isString(elem_data_13_1_data_str);

                elem_data_13_1_obj.data('w_data_integer', 24);
                elem_data_13_1_data_int = elem_data_13_1_obj.data('w_data_integer');
                elem_data_13_1_data_int_is_valid_bool = _w.isNumber(elem_data_13_1_data_int);

                elem_data_13_1_obj.data('w_data_boolean', true);
                elem_data_13_1_data_bool = elem_data_13_1_obj.data('w_data_boolean');
                elem_data_13_1_data_bool_is_valid_bool = _w.isBool(elem_data_13_1_data_bool);

                elem_data_13_1_obj.data('w_data_array', ['one', 'two', 'three', 'four']);
                elem_data_13_1_data_arr = elem_data_13_1_obj.data('w_data_array');
                elem_data_13_1_data_arr_is_valid_bool = _w.isArray(elem_data_13_1_data_arr);

                elem_data_13_1_obj.data('w_data_object', {root:{member_1: 'first', member_2: 'second', member_3: 'third'}});
                elem_data_13_1_data_obj = elem_data_13_1_obj.data('w_data_object');
                elem_data_13_1_data_obj_is_valid_bool = ((_w.isObject(elem_data_13_1_data_obj)) && (elem_data_13_1_data_obj.root.member_2 === 'second'));

                wQuery.data('w_core_data_object', 'core_data');
                elem_data_13_2_data_str = wQuery.data('w_core_data_object');

            });

            it('should set and get DOM element string data', function(){
                expect(elem_data_13_1_data_str_is_valid_bool).toBe(true);
            });

            it('should set and get DOM element integer data', function(){
                expect(elem_data_13_1_data_int_is_valid_bool).toBe(true);
            });

            it('should set and get DOM element boolean data', function(){
                expect(elem_data_13_1_data_bool_is_valid_bool).toBe(true);
            });

            it('should set and get DOM element array data', function(){
                expect(elem_data_13_1_data_arr_is_valid_bool).toBe(true);
            });

            it('should set and get DOM element object data', function(){
                expect(elem_data_13_1_data_obj_is_valid_bool).toBe(true);
            });

            it('should set and get DOM element string data using wQuery core', function(){
                expect(elem_data_13_2_data_str).toEqual('core_data');
            });

        });

        /**
         * Offset
         */
        describe('wQuery Offset', function() {

            var elem_offset_14_1_obj,
                elem_offset_14_1_pos_obj,
                elem_offset_14_1_pos_top_str,
                elem_offset_14_1_pos_left_str,
                elem_offset_14_2_obj,
                elem_offset_14_2_offset_obj,
                elem_offset_14_2_offset_top_str,
                elem_offset_14_2_offset_left_str
                ;

            beforeAll(function(){

                elem_offset_14_1_obj = $('#cntnr-14-1-offset');
                elem_offset_14_1_pos_obj = elem_offset_14_1_obj.position();
                elem_offset_14_1_pos_top_str = elem_offset_14_1_pos_obj.top;
                elem_offset_14_1_pos_left_str = elem_offset_14_1_pos_obj.left;
                elem_offset_14_2_obj = $('#cntnr-14-2-offset');
                elem_offset_14_2_offset_obj = elem_offset_14_2_obj.offset();
                elem_offset_14_2_offset_top_str = elem_offset_14_2_offset_obj.top;
                elem_offset_14_2_offset_left_str = elem_offset_14_2_offset_obj.left;

            });

            it('should get top position of DOM element', function(){
                expect(elem_offset_14_1_pos_top_str).toBe(20);
            });

            it('should get left position of DOM element', function(){
                expect(elem_offset_14_1_pos_left_str).toBe(12);
            });

            it('should get top offset of DOM element', function(){
                expect(elem_offset_14_2_offset_top_str).toBe(3400);
            });

            it('should get left offset of DOM element', function(){
                expect(elem_offset_14_2_offset_left_str).toBe(16);
            });


        });

        /**
         * Ajax
         */
        describe('wQuery Ajax', function() {

            describe('wQuery Ajax GET', function(){

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

                var ajax_fn,
                    url,
                    settings,
                    ajax_get_response_str,
                    ajax_get_response_control_str,
                    xhr_response_obj;

                beforeAll(function(done){
                    ajax_fn = $.ajax;
                    url = 'https://httpbin.org/get?title=Rabbi&fname=Moshe&lname=Ben%20Maimon&nickname=rambam';
                    settings = {method: 'GET'};

                    ajax_fn(url, settings).then(function(xhr_response_str){
                        xhr_response_obj = JSON.parse(xhr_response_str);

                        ajax_get_response_str = xhr_response_obj.args.nickname;
                        ajax_get_response_control_str = 'rambam';

                        done();
                    });
                });

                it('should execute a GET request ', function(){
                    expect(ajax_get_response_str).toBe(ajax_get_response_control_str);
                });

            });

            describe('wQuery Ajax POST', function(){

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

                var ajax_fn,
                    url,
                    settings,
                    ajax_post_response_str,
                    ajax_post_response_control_str,
                    xhr_response_obj;

                beforeAll(function(done){
                    ajax_fn = $.ajax;
                    url = 'https://httpbin.org/post?title=Rabbi&fname=Moshe&lname=Ben%20Maimon&nickname=rambam';
                    settings = {method: 'POST'};

                    ajax_fn(url, settings).then(function(xhr_response_str){
                        xhr_response_obj = JSON.parse(xhr_response_str);

                        ajax_post_response_str = xhr_response_obj.form.fname;
                        ajax_post_response_control_str = 'Moshe';

                        done();
                    });
                });

                it('should execute a POST request ', function(){
                    expect(ajax_post_response_str).toBe(ajax_post_response_control_str);
                });

            });

        });

        /**
         * Filter
         */
        describe('wQuery Filter', function() {

            var elem_filter_obj,
                elem_filter_1_obj,
                elem_filter_1_count_int,
                elem_filter_1_count_control_int,
                elem_filter_2_obj,
                elem_filter_2_count_int,
                elem_filter_2_count_control_int,
                elem_filter_3_obj,
                elem_filter_3_count_int,
                elem_filter_3_count_control_int,
                elem_filter_4_obj,
                elem_filter_4_count_int,
                elem_filter_4_count_control_int,
                elem_filter_5_obj,
                elem_filter_5_count_int,
                elem_filter_5_count_control_int,
                elem_filter_6_obj,
                elem_filter_6_count_int,
                elem_filter_6_count_control_int,
                elem_filter_7_obj,
                elem_filter_7_count_int,
                elem_filter_7_count_control_int,
                elem_filter_8_obj,
                elem_filter_8_count_int,
                elem_filter_8_count_control_int
                ;

            beforeAll(function(){

                elem_filter_obj = $('#cntnr-15-1-filter-list').find('li');

                elem_filter_1_obj = elem_filter_obj.filter('.filter');
                elem_filter_1_count_int = elem_filter_1_obj.length;
                elem_filter_1_count_control_int = 4;

                elem_filter_2_obj = elem_filter_obj.filter('#cntnr-15-1-filter-list-5');
                elem_filter_2_count_int = elem_filter_2_obj.length;
                elem_filter_2_count_control_int = 1;

                elem_filter_3_obj = elem_filter_obj.filter('!.filter');
                elem_filter_3_count_int = elem_filter_3_obj.length;
                elem_filter_3_count_control_int = 5;

                elem_filter_4_obj = elem_filter_obj.filter('!#cntnr-15-1-filter-list-5');
                elem_filter_4_count_int = elem_filter_4_obj.length;
                elem_filter_4_count_control_int = 8;

                elem_filter_5_obj = elem_filter_obj.filter('!.(filter,test)');
                elem_filter_5_count_int = elem_filter_5_obj.length;
                elem_filter_5_count_control_int = 3;

                elem_filter_6_obj = elem_filter_obj.filter('!#(cntnr-15-1-filter-list-5,cntnr-15-1-filter-list-9)');
                elem_filter_6_count_int = elem_filter_6_obj.length;
                elem_filter_6_count_control_int = 7;

                elem_filter_7_obj = elem_filter_obj.filter('.filter').filter('.test');
                elem_filter_7_count_int = elem_filter_7_obj.length;
                elem_filter_7_count_control_int = 1;

                elem_filter_8_obj = elem_filter_obj.filter('.filter').filter('!.test');
                elem_filter_8_count_int = elem_filter_8_obj.length;
                elem_filter_8_count_control_int = 3;

            });

            it('should filter DOM collection by class selector', function(){
                expect(elem_filter_1_count_int).toBe(elem_filter_1_count_control_int);
            });

            it('should filter DOM collection by ID selector', function(){
                expect(elem_filter_2_count_int).toBe(elem_filter_2_count_control_int);
            });

            it('should filter DOM collection by class selector [negation]', function(){
                expect(elem_filter_3_count_int).toBe(elem_filter_3_count_control_int);
            });

            it('should filter DOM collection by ID selector [negation]', function(){
                expect(elem_filter_4_count_int).toBe(elem_filter_4_count_control_int);
            });

            it('should filter DOM collection by multiple classes [negation]', function(){
                expect(elem_filter_5_count_int).toBe(elem_filter_5_count_control_int);
            });

            it('should filter DOM collection by multiple IDs [negation]', function(){
                expect(elem_filter_6_count_int).toBe(elem_filter_6_count_control_int);
            });

            it('should filter DOM collection by multiple classes in series', function(){
                expect(elem_filter_7_count_int).toBe(elem_filter_7_count_control_int);
            });

            it('should filter DOM collection by dual classes [positive and negation]', function(){
                expect(elem_filter_8_count_int).toBe(elem_filter_8_count_control_int);
            });

        });

        /**
         * Other
         */
        describe('wQuery Util', function(){

            var elem_util_obj,
                elem_is_wquery_object_bool;

            beforeAll(function(){
                elem_util_obj = $('html');
                elem_is_wquery_object_bool = wQuery.isWQueryObject(elem_util_obj);
            });

            it('should detect if object is wQuery instance', function(){
                expect(elem_is_wquery_object_bool).toBe(true);
            });

        });

    });

    describe('Wizmo Core', function(){

        /**
         * Store method
         */
        describe('wizmo.store', function(){

            var val_store_ss_str,
                val_store_ss_control_str,
                val_store_ss_int,
                val_store_ss_control_int,
                val_store_ss_obj,
                val_store_ss_control_obj,
                val_store_ss_bool,
                val_store_ss_control_bool,
                val_store_ls_str,
                val_store_ls_control_str,
                val_store_ls_int,
                val_store_ls_control_int,
                val_store_ls_obj,
                val_store_ls_control_obj,
                val_store_ls_bool,
                val_store_ls_control_bool,
                val_store_ck_str,
                val_store_ck_control_str
                ;

            beforeAll(function(){

                /** sessionStorage **/
                wizmo.store('val_string_ss', 'obinwanne', 'ss');
                val_store_ss_str = wizmo.store('val_string_ss');
                val_store_ss_control_str = 'obinwanne';

                wizmo.store('val_number_ss', 123456, 'ss');
                val_store_ss_int = wizmo.store('val_number_ss');
                val_store_ss_control_int = 123456;

                wizmo.store('val_object_ss', {first: 'obinwanne', last: 'hill'}, 'ss');
                val_store_ss_obj = wizmo.store('val_object_ss');
                val_store_ss_control_obj = {first: 'obinwanne', last: 'hill'};

                wizmo.store('val_boolean_ss', true, 'ss');
                val_store_ss_bool = wizmo.store('val_boolean_ss');
                val_store_ss_control_bool = true;

                /** localStorage **/
                wizmo.store('val_string_ls', 'obinwanne2', 'ls');
                val_store_ls_str = wizmo.store('val_string_ls', undefined, 'ls');
                val_store_ls_control_str = 'obinwanne2';

                wizmo.store('val_number_ls', 1234567, 'ls');
                val_store_ls_int = wizmo.store('val_number_ls', undefined, 'ls');
                val_store_ls_control_int = 1234567;

                wizmo.store('val_object_ls', {first: 'obinwanne2', last: 'hill2'}, 'ls');
                val_store_ls_obj = wizmo.store('val_object_ls', undefined, 'ls');
                val_store_ls_control_obj = {first: 'obinwanne2', last: 'hill2'};

                wizmo.store('val_boolean_ls', false, 'ls');
                val_store_ls_bool = wizmo.store('val_boolean_ls', undefined, 'ls');
                val_store_ls_control_bool = false;

                /** Cookie **/
                wizmo.cookieStore('val_string_ck', 'obinwanne3');
                val_store_ck_str = wizmo.cookieStore('val_string_ck');
                val_store_ck_control_str = 'obinwanne3';

            });

            it('should set and get string from sessionStorage', function(){
                expect(val_store_ss_str).toBe(val_store_ss_control_str);
            });

            it('should set and get number from sessionStorage', function(){
                expect(val_store_ss_int).toBe(val_store_ss_control_int);
            });

            it('should set and get object from sessionStorage', function(){
                expect(val_store_ss_obj.first).toBe(val_store_ss_control_obj.first);
            });

            it('should set and get boolean from sessionStorage', function(){
                expect(val_store_ss_bool).toBe(val_store_ss_control_bool);
            });

            it('should set and get string from localStorage', function(){
                expect(val_store_ls_str).toBe(val_store_ls_control_str);
            });

            it('should set and get number from localStorage', function(){
                expect(val_store_ls_int).toBe(val_store_ls_control_int);
            });

            it('should set and get object from localStorage', function(){
                expect(val_store_ls_obj.first).toBe(val_store_ls_control_obj.first);
            });

            it('should set and get boolean from localStorage', function(){
                expect(val_store_ls_bool).toBe(val_store_ls_control_bool);
            });

            it('should set and get string from cookie', function(){
                expect(val_store_ck_str).toBe(val_store_ck_control_str);
            });

        });

        /**
         * Store method
         * object property retrieval using :: notation
         */
        describe('wizmo.store::object', function(){

            var val_store_ss_sub_obj,
                val_store_ss_sub_1_str,
                val_store_ss_sub_2_str,
                val_store_ss_sub_3_str,
                val_store_ss_sub_4_str,
                val_store_ss_sub_5_str,
                val_store_ss_sub_1_control_str,
                val_store_ss_sub_2_control_str,
                val_store_ss_sub_3_control_str,
                val_store_ss_sub_4_control_str,
                val_store_ss_sub_5_control_str
                ;

            beforeAll(function(){

                val_store_ss_sub_obj = {'first': 'one', 'second': 25, 'third': true, 'fourth': [3,5,6,10,24], 'fifth': {'one': 11, 'two': 23}};

                wizmo.store('val_object_sub', val_store_ss_sub_obj, 'ss');

                val_store_ss_sub_1_str = wizmo.store('val_object_sub::first');
                val_store_ss_sub_1_control_str = 'one';

                val_store_ss_sub_2_str = wizmo.store('val_object_sub::second');
                val_store_ss_sub_2_control_str = 25;

                val_store_ss_sub_3_str = wizmo.store('val_object_sub::third');
                val_store_ss_sub_3_control_str = true;

                val_store_ss_sub_4_str = wizmo.store('val_object_sub::fourth');
                val_store_ss_sub_4_control_str = 6;

                val_store_ss_sub_5_str = wizmo.store('val_object_sub::fifth');
                val_store_ss_sub_5_control_str = 11;

            });

            it('should get object property [string] directly from sessionStorage using :: notation', function(){
                expect(val_store_ss_sub_1_str).toBe(val_store_ss_sub_1_control_str);
            });

            it('should get object property [number] directly from sessionStorage using :: notation', function(){
                expect(val_store_ss_sub_2_str).toBe(val_store_ss_sub_2_control_str);
            });

            it('should get object property [boolean] directly from sessionStorage using :: notation', function(){
                expect(val_store_ss_sub_3_str).toBe(val_store_ss_sub_3_control_str);
            });

            it('should get object property [array] directly from sessionStorage using :: notation', function(){
                expect(val_store_ss_sub_4_str[2]).toBe(val_store_ss_sub_4_control_str);
            });

            it('should get object property [object] directly from sessionStorage using :: notation', function(){
                expect(val_store_ss_sub_5_str['one']).toBe(val_store_ss_sub_5_control_str);
            });

        });

        /**
         * StoreCheck method
         */
        describe('wizmo.storeCheck', function(){

            var val_store_1_ss_bool,
                val_store_1_ss_control_bool,
                val_store_2_ss_bool,
                val_store_2_ss_control_bool,
                val_store_1_ls_bool,
                val_store_1_ls_control_bool,
                val_store_2_ls_bool,
                val_store_2_ls_control_bool,
                val_store_1_ck_bool,
                val_store_1_ck_control_bool,
                val_store_2_ck_bool,
                val_store_2_ck_control_bool
                ;

            beforeAll(function(){

                wizmo.store('val_string_ss_check', null, 'ss');
                val_store_1_ss_bool = wizmo.storeCheck('val_string_ss_check')
                val_store_1_ss_control_bool = false;

                wizmo.store('val_string_ss_check', 'obinwanne5', 'ss');
                val_store_2_ss_bool = wizmo.storeCheck('val_string_ss_check');
                val_store_2_ss_control_bool = true;

                wizmo.store('val_string_ls_check', null, 'ls');
                val_store_1_ls_bool = wizmo.storeCheck('val_string_ls_check', undefined, 'ls')
                val_store_1_ls_control_bool = false;

                wizmo.store('val_string_ls_check', 'obinwanne6', 'ls');
                val_store_2_ls_bool = wizmo.storeCheck('val_string_ls_check', undefined, 'ls');
                val_store_2_ls_control_bool = true;

                wizmo.cookieStore('val_string_ck_check', null);
                val_store_1_ck_bool = wizmo.storeCheck('val_string_ck_check', undefined, 'ck');
                val_store_1_ck_control_bool = false;

                wizmo.cookieStore('val_string_ck_check', 'obinwanne7');
                val_store_2_ck_bool = wizmo.storeCheck('val_string_ck_check', undefined, 'ck');
                val_store_2_ck_control_bool = true;

            });

            it('should check if a value is stored in sessionStorage pre-set', function(){
                expect(val_store_1_ss_bool).toBe(val_store_1_ss_control_bool);
            });

            it('should check if a value is stored in sessionStorage post-set', function(){
                expect(val_store_2_ss_bool).toBe(val_store_2_ss_control_bool);
            });

            it('should check if a value is stored in localStorage pre-set', function(){
                expect(val_store_1_ls_bool).toBe(val_store_1_ls_control_bool);
            });

            it('should check if a value is stored in localStorage post-set', function(){
                expect(val_store_2_ls_bool).toBe(val_store_2_ls_control_bool);
            });

            it('should check if a value is stored in cookie storage pre-set', function(){
                expect(val_store_1_ck_bool).toBe(val_store_1_ck_control_bool);
            });

            it('should check if a value is stored in cookie storage post-set', function(){
                expect(val_store_2_ck_bool).toBe(val_store_2_ck_control_bool);
            });

        });

        /**
         * StorePush method
         */
        describe('wizmo.storePush', function(){

            var val_store_1_ss_arr,
                val_store_2_ss_arr,
                val_store_ss_control_arr,
                val_store_1_ls_arr,
                val_store_2_ls_arr,
                val_store_ls_control_arr
                ;

            beforeAll(function(){

                val_store_1_ss_arr = ['first', 'second', 'third', 'fourth'];
                wizmo.store('val_store_ss_arr', val_store_1_ss_arr);
                wizmo.storePush('val_store_ss_arr', 'fifth');
                val_store_2_ss_arr = wizmo.store('val_store_ss_arr');
                val_store_ss_control_arr = ['first', 'second', 'third', 'fourth', 'fifth'];

                val_store_1_ls_arr = ['first', 'second', 'third', 'fourth'];
                wizmo.store('val_store_ls_arr', val_store_1_ls_arr);
                wizmo.storePush('val_store_ls_arr', 'fifth');
                val_store_2_ls_arr = wizmo.store('val_store_ls_arr');
                val_store_ls_control_arr = ['first', 'second', 'third', 'fourth', 'fifth'];

            });

            it('should add value to sessionStorage array', function(){
                expect(val_store_2_ss_arr[4]).toBe(val_store_ss_control_arr[4]);
            });

            it('should add value to localStorage array', function(){
                expect(val_store_2_ls_arr[4]).toBe(val_store_ls_control_arr[4]);
            });

        });

        /**
         * StoreIncrement method
         */
        describe('wizmo.storeIncrement', function(){

            var val_store_ss_int,
                val_store_ss_incr_int,
                val_store_ss_incr_control_int,
                val_store_ls_int,
                val_store_ls_incr_int,
                val_store_ls_incr_control_int,
                val_store_ck_int,
                val_store_ck_incr_int,
                val_store_ck_incr_control_int
                ;

            beforeAll(function(){

                wizmo.store('val_number_incr_ss', 24, 'ss');
                wizmo.store('val_number_incr_ls', 34, 'ls');
                wizmo.cookieStore('val_number_incr_ck', 44);

                val_store_ss_int = wizmo.store('val_number_incr_ss');
                wizmo.storeIncrement('val_number_incr_ss', 1);
                val_store_ss_incr_int = wizmo.store('val_number_incr_ss');
                val_store_ss_incr_control_int = 25;

                val_store_ls_int = wizmo.store('val_number_incr_ls', undefined, 'ls');
                wizmo.storeIncrement('val_number_incr_ls', 1, 'ls');
                val_store_ls_incr_int = wizmo.store('val_number_incr_ls', undefined, 'ls');
                val_store_ls_incr_control_int = 35;

                val_store_ck_int = wizmo.cookieStore('val_number_incr_ck');
                wizmo.storeIncrement('val_number_incr_ck', 1, 'ck');
                val_store_ck_incr_int = wizmo.cookieStore('val_number_incr_ck');
                val_store_ck_incr_control_int = 45;

            });

            it('should increment number stored in sessionStorage', function(){
                expect(val_store_ss_incr_int).toBe(val_store_ss_incr_control_int);
            });

            it('should increment number stored in localStorage', function(){
                expect(val_store_ls_incr_int).toBe(val_store_ls_incr_control_int);
            });

            it('should increment number stored in cookie', function(){
                expect(val_store_ck_incr_int).toBe(val_store_ck_incr_control_int);
            });

        });

        /**
         * StoreDecrement method
         */
        describe('wizmo.storeDecrement', function(){

            var val_store_ss_int,
                val_store_ss_decr_int,
                val_store_ss_decr_control_int,
                val_store_ls_int,
                val_store_ls_decr_int,
                val_store_ls_decr_control_int,
                val_store_ck_int,
                val_store_ck_decr_int,
                val_store_ck_decr_control_int
                ;

            beforeAll(function(){

                wizmo.store('val_number_decr_ss', 54, 'ss');
                wizmo.store('val_number_decr_ls', 64, 'ls');
                wizmo.cookieStore('val_number_decr_ck', 74);

                val_store_ss_int = wizmo.store('val_number_decr_ss');
                wizmo.storeIncrement('val_number_decr_ss', 1);
                val_store_ss_decr_int = wizmo.store('val_number_decr_ss');
                val_store_ss_decr_control_int = 55;

                val_store_ls_int = wizmo.store('val_number_decr_ls', undefined, 'ls');
                wizmo.storeIncrement('val_number_decr_ls', 1, 'ls');
                val_store_ls_decr_int = wizmo.store('val_number_decr_ls', undefined, 'ls');
                val_store_ls_decr_control_int = 65;

                val_store_ck_int = wizmo.cookieStore('val_number_decr_ck');
                wizmo.storeIncrement('val_number_decr_ck', 1, 'ck');
                val_store_ck_decr_int = wizmo.cookieStore('val_number_decr_ck');
                val_store_ck_decr_control_int = 75;

            });

            it('should increment number stored in sessionStorage', function(){
                expect(val_store_ss_decr_int).toBe(val_store_ss_decr_control_int);
            });

            it('should increment number stored in localStorage', function(){
                expect(val_store_ls_decr_int).toBe(val_store_ls_decr_control_int);
            });

            it('should increment number stored in cookie', function(){
                expect(val_store_ck_decr_int).toBe(val_store_ck_decr_control_int);
            });

        });

        /**
         * DomStore method
         */
        describe('wizmo.pageStore', function(){

            var val_store_ds_str,
                val_store_ds_control_str,
                val_store_ds_int,
                val_store_ds_control_int,
                val_store_ds_bool,
                val_store_ds_control_bool,
                val_store_ds_obj,
                val_store_ds_control_obj,
                val_store_ds_2_obj,
                val_store_ds_2_control_obj,
                val_store_ds_3_obj,
                val_store_ds_3_control_obj
                ;

            beforeAll(function(){

                wizmo.pageStore('val_string_ds', 'obinwanne4');
                val_store_ds_str = wizmo.pageStore('val_string_ds');
                val_store_ds_control_str = 'obinwanne4';

                wizmo.pageStore('val_number_ds', 345678);
                val_store_ds_int = wizmo.pageStore('val_number_ds');
                val_store_ds_control_int = 345678;

                wizmo.pageStore('val_boolean_ds', false);
                val_store_ds_bool = wizmo.pageStore('val_boolean_ds');
                val_store_ds_control_bool = false;

                wizmo.pageStore('val_object_ds', {first: 'obinwanne3', last: 'hill3'});
                val_store_ds_obj = wizmo.pageStore('val_object_ds');
                val_store_ds_control_obj = {first: 'obinwanne3', last: 'hill3'};

                wizmo.pageStore('val_object_ds_2', {first: 'obinwanne4', last: 'hill4'}, 'ut_namespace_1');
                val_store_ds_2_obj = wizmo.pageStore('val_object_ds_2', undefined, 'ut_namespace_1');
                val_store_ds_2_control_obj = {first: 'obinwanne4', last: 'hill4'};

                wizmo.pageStore('val_object_ds_3', {first: 'obinwanne5', last: 'hill5'}, 'ut_namespace_2');
                wizmo.pageStore('val_object_ds_4', {first: 'obinwanne6', last: 'hill6'}, 'ut_namespace_2');
                val_store_ds_3_obj = wizmo.pageStore(undefined, undefined, 'ut_namespace_2');
                val_store_ds_3_control_obj = {'w_val_object_ds_3': {first: 'obinwanne5', last: 'hill5'}, 'w_val_object_ds_4': {first: 'obinwanne6', last: 'hill6'}};

            });

            it('should set and get string on DOM-based storage', function(){
                expect(val_store_ds_str).toBe(val_store_ds_control_str);
            });

            it('should set and get number on DOM-based storage', function(){
                expect(val_store_ds_int).toBe(val_store_ds_control_int);
            });

            it('should set and get boolean on DOM-based storage', function(){
                expect(val_store_ds_bool).toBe(val_store_ds_control_bool);
            });

            it('should set and get object on DOM-based storage', function(){
                expect(val_store_ds_obj.last).toBe(val_store_ds_control_obj.last);
            });

            it('should set and get object on DOM-based storage with namespace', function(){
                expect(val_store_ds_2_obj.last).toBe(val_store_ds_2_control_obj.last);
            });

            it('should set and get multiple objects on DOM-based storage with namespace', function(){
                expect(val_store_ds_3_obj['w_val_object_ds_4'].first).toBe(val_store_ds_3_control_obj['w_val_object_ds_4'].first);
            });

        });

        /**
         * domStoreIncrement method
         */
        describe('wizmo.pageStoreIncrement', function(){

            var val_store_ds_1_int,
                val_store_ds_1_incr_int,
                val_store_ds_1_incr_control_int,
                val_store_ds_2_int,
                val_store_ds_2_incr_int,
                val_store_ds_2_incr_control_int
                ;

            beforeAll(function(){

                wizmo.pageStore('val_number_incr_ds_1', 38);
                wizmo.pageStore('val_number_incr_ds_2', 14);

                val_store_ds_1_int = wizmo.pageStore('val_number_incr_ds_1');
                wizmo.pageStoreIncrement('val_number_incr_ds_1');
                val_store_ds_1_incr_int = wizmo.pageStore('val_number_incr_ds_1');
                val_store_ds_1_incr_control_int = 39;

                val_store_ds_2_int = wizmo.pageStore('val_number_incr_ds_2');
                wizmo.pageStoreIncrement('val_number_incr_ds_2', 8);
                val_store_ds_2_incr_int = wizmo.pageStore('val_number_incr_ds_2');
                val_store_ds_2_incr_control_int = 22;

            });

            it('should increment number stored in domStore', function(){
                expect(val_store_ds_1_incr_int).toBe(val_store_ds_1_incr_control_int);
            });

            it('should increment number [by more than 1] stored in domStore', function(){
                expect(val_store_ds_2_incr_int).toBe(val_store_ds_2_incr_control_int);
            });

        });

        /**
         * domStoreDecrement method
         */
        describe('wizmo.pageStoreDecrement', function(){

            var val_store_ds_1_int,
                val_store_ds_1_decr_int,
                val_store_ds_1_decr_control_int,
                val_store_ds_2_int,
                val_store_ds_2_decr_int,
                val_store_ds_2_decr_control_int
                ;

            beforeAll(function(){

                wizmo.pageStore('val_number_decr_ds_1', 55);
                wizmo.pageStore('val_number_decr_ds_2', 32);

                val_store_ds_1_int = wizmo.pageStore('val_number_decr_ds_1');
                wizmo.pageStoreDecrement('val_number_decr_ds_1');
                val_store_ds_1_decr_int = wizmo.pageStore('val_number_decr_ds_1');
                val_store_ds_1_decr_control_int = 54;

                val_store_ds_2_int = wizmo.pageStore('val_number_decr_ds_2');
                wizmo.pageStoreDecrement('val_number_decr_ds_2', 9);
                val_store_ds_2_decr_int = wizmo.pageStore('val_number_decr_ds_2');
                val_store_ds_2_decr_control_int = 23;

            });

            it('should decrement number stored in domStore', function(){
                expect(val_store_ds_1_decr_int).toBe(val_store_ds_1_decr_control_int);
            });

            it('should decrement number [by more than 1] stored in domStore', function(){
                expect(val_store_ds_2_decr_int).toBe(val_store_ds_2_decr_control_int);
            });

        });


        /**
         * CookieStore method
         */
        describe('wizmo.cookieStore', function(){

            var val_store_ck_str,
                val_store_ck_control_str,
                val_store_ck_int,
                val_store_ck_control_int,
                val_store_ck_bool,
                val_store_ck_control_bool
                ;

            beforeAll(function(){

                wizmo.cookieStore('val_string_ck', 'obinwanne4');
                val_store_ck_str = wizmo.cookieStore('val_string_ck');
                val_store_ck_control_str = 'obinwanne4';

                wizmo.cookieStore('val_number_ck', 345679);
                val_store_ck_int = wizmo.cookieStore('val_number_ck');
                val_store_ck_control_int = 345679;

                wizmo.cookieStore('val_boolean_ck', false);
                val_store_ck_bool = wizmo.cookieStore('val_boolean_ck');
                val_store_ck_control_bool = false;

            });

            it('should set and get string on cookie storage', function(){
                expect(val_store_ck_str).toBe(val_store_ck_control_str);
            });

            it('should set and get number on cookie storage', function(){
                expect(val_store_ck_int).toBe(val_store_ck_control_int);
            });

            it('should set and get boolean on cookie storage', function(){
                expect(val_store_ck_bool).toBe(val_store_ck_control_bool);
            });

        });

        /**
         * parseDateTime method
         */
        describe('wizmo.parseDateTime', function(){

            var val_datetime_str,
                val_datetime_obj,
                val_datetime_obj_datetime_utc_str,
                val_datetime_obj_datetime_utc_control_str,
                val_datetime_obj_date_str,
                val_datetime_obj_date_control_str,
                val_datetime_obj_year_str,
                val_datetime_obj_year_control_str,
                val_datetime_obj_month_str,
                val_datetime_obj_month_control_str,
                val_datetime_obj_day_str,
                val_datetime_obj_day_control_str,
                val_datetime_obj_time_str,
                val_datetime_obj_time_control_str,
                val_datetime_obj_hour_str,
                val_datetime_obj_hour_control_str,
                val_datetime_obj_minute_str,
                val_datetime_obj_minute_control_str,
                val_datetime_obj_second_str,
                val_datetime_obj_second_control_str
                ;

            beforeAll(function(){

                val_datetime_str = '2018-08-24 16:13:09';
                val_datetime_obj = wizmo.parseDateTime(val_datetime_str);

                val_datetime_obj_datetime_utc_str = val_datetime_obj['datetime_utc'];
                val_datetime_obj_date_str = val_datetime_obj['date'];
                val_datetime_obj_year_str = val_datetime_obj['year'];
                val_datetime_obj_month_str = val_datetime_obj['month'];
                val_datetime_obj_day_str = val_datetime_obj['day'];
                val_datetime_obj_time_str = val_datetime_obj['time'];
                val_datetime_obj_hour_str = val_datetime_obj['hour'];
                val_datetime_obj_minute_str = val_datetime_obj['minute'];
                val_datetime_obj_second_str = val_datetime_obj['second'];

                val_datetime_obj_datetime_utc_control_str = '2018-08-24T16:13:09Z';
                val_datetime_obj_date_control_str = '2018-08-24';
                val_datetime_obj_year_control_str = '2018';
                val_datetime_obj_month_control_str = '08';
                val_datetime_obj_day_control_str = '24';
                val_datetime_obj_time_control_str = '16:13:09';
                val_datetime_obj_hour_control_str = '16';
                val_datetime_obj_minute_control_str = '13';
                val_datetime_obj_second_control_str = '09';

            });

            it('should parse the datetime utc from a datetime value', function(){
                expect(val_datetime_obj_datetime_utc_str).toBe(val_datetime_obj_datetime_utc_control_str);
            });

            it('should parse the date from a datetime value', function(){
               expect(val_datetime_obj_date_str).toBe(val_datetime_obj_date_control_str);
            });

            it('should parse the year from a datetime value', function(){
                expect(val_datetime_obj_year_str).toBe(val_datetime_obj_year_control_str);
            });

            it('should parse the month from a datetime value', function(){
                expect(val_datetime_obj_month_str).toBe(val_datetime_obj_month_control_str);
            });

            it('should parse the day from a datetime value', function(){
                expect(val_datetime_obj_day_str).toBe(val_datetime_obj_day_control_str);
            });

            it('should parse the time from a datetime value', function(){
                expect(val_datetime_obj_time_str).toBe(val_datetime_obj_time_control_str);
            });

            it('should parse the hour from a datetime value', function(){
                expect(val_datetime_obj_hour_str).toBe(val_datetime_obj_hour_control_str);
            });

            it('should parse the minute from a datetime value', function(){
                expect(val_datetime_obj_minute_str).toBe(val_datetime_obj_minute_control_str);
            });

            it('should parse the second from a datetime value', function(){
                expect(val_datetime_obj_second_str).toBe(val_datetime_obj_second_control_str);
            });

        });

        /**
         * filterDateTime method
         */
        describe('wizmo.filterDateTime', function(){

            var val_datetime_str,
                val_datetime_obj,
                val_datetime_obj_datetime_utc_str,
                val_datetime_obj_datetime_utc_control_str,
                val_datetime_obj_date_str,
                val_datetime_obj_date_control_str,
                val_datetime_obj_year_str,
                val_datetime_obj_year_control_str,
                val_datetime_obj_month_str,
                val_datetime_obj_month_control_str,
                val_datetime_obj_day_str,
                val_datetime_obj_day_control_str,
                val_datetime_obj_time_str,
                val_datetime_obj_time_control_str,
                val_datetime_obj_hour_str,
                val_datetime_obj_hour_control_str,
                val_datetime_obj_minute_str,
                val_datetime_obj_minute_control_str,
                val_datetime_obj_second_str,
                val_datetime_obj_second_control_str
                ;

            beforeAll(function(){

                val_datetime_str = '2018-08-25 16:13:12';

                val_datetime_obj_datetime_utc_str = wizmo.filterDateTime(val_datetime_str, 'datetime_utc');
                val_datetime_obj_date_str = wizmo.filterDateTime(val_datetime_str, 'date');
                val_datetime_obj_year_str = wizmo.filterDateTime(val_datetime_str, 'year');
                val_datetime_obj_month_str = wizmo.filterDateTime(val_datetime_str, 'month');
                val_datetime_obj_day_str = wizmo.filterDateTime(val_datetime_str, 'day');
                val_datetime_obj_time_str = wizmo.filterDateTime(val_datetime_str, 'time');
                val_datetime_obj_hour_str = wizmo.filterDateTime(val_datetime_str, 'hour');
                val_datetime_obj_minute_str = wizmo.filterDateTime(val_datetime_str, 'minute');
                val_datetime_obj_second_str = wizmo.filterDateTime(val_datetime_str, 'second');

                val_datetime_obj_datetime_utc_control_str = '2018-08-25T16:13:12Z';
                val_datetime_obj_date_control_str = '2018-08-25';
                val_datetime_obj_year_control_str = '2018';
                val_datetime_obj_month_control_str = '08';
                val_datetime_obj_day_control_str = '25';
                val_datetime_obj_time_control_str = '16:13:12';
                val_datetime_obj_hour_control_str = '16';
                val_datetime_obj_minute_control_str = '13';
                val_datetime_obj_second_control_str = '12';

            });

            it('should filter the datetime utc from a datetime value', function(){
                expect(val_datetime_obj_datetime_utc_str).toBe(val_datetime_obj_datetime_utc_control_str);
            });

            it('should filter the date from a datetime value', function(){
                expect(val_datetime_obj_date_str).toBe(val_datetime_obj_date_control_str);
            });

            it('should filter the year from a datetime value', function(){
                expect(val_datetime_obj_year_str).toBe(val_datetime_obj_year_control_str);
            });

            it('should filter the month from a datetime value', function(){
                expect(val_datetime_obj_month_str).toBe(val_datetime_obj_month_control_str);
            });

            it('should filter the day from a datetime value', function(){
                expect(val_datetime_obj_day_str).toBe(val_datetime_obj_day_control_str);
            });

            it('should filter the time from a datetime value', function(){
                expect(val_datetime_obj_time_str).toBe(val_datetime_obj_time_control_str);
            });

            it('should filter the hour from a datetime value', function(){
                expect(val_datetime_obj_hour_str).toBe(val_datetime_obj_hour_control_str);
            });

            it('should filter the minute from a datetime value', function(){
                expect(val_datetime_obj_minute_str).toBe(val_datetime_obj_minute_control_str);
            });

            it('should filter the second from a datetime value', function(){
                expect(val_datetime_obj_second_str).toBe(val_datetime_obj_second_control_str);
            });

        });

    });

});