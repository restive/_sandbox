describe('e2e Tests', function() {

    beforeAll(function () {
        fixture.setBase('spec/fixture');
        fixture.load('be2e.html');
    });

    describe('Wizmo Core', function () {

        /**
         * Port
         */
        describe('wizmo.port', function () {

            var elem_port_source_html_str,
                elem_port_target_obj,
                elem_port_target_html_str,
                elem_port_content_is_valid_bool,
                elem_port_content_is_valid_control_bool
                ;

            beforeAll(function (done) {

                elem_port_source_html_str = $('#port-content').html();
                wizmo.port(elem_port_source_html_str, {target: 'e2e-elem-port-001', fragment: 'div-port-content-1', postmode: 'replace'});

                setTimeout(function () {

                    elem_port_target_obj = $('#e2e-elem-port-001').find('.first');
                    elem_port_target_html_str = elem_port_target_obj.html();

                    elem_port_content_is_valid_bool = (/first +ported +paragraph/i.test(elem_port_target_html_str));
                    elem_port_content_is_valid_control_bool = true;

                    //close
                    done();

                }, 2000);

            });

            it('should check that content is ported from inert zone to active zone', function () {
                expect(elem_port_content_is_valid_bool).toBe(elem_port_content_is_valid_control_bool);
            });

        });

        /**
         * Parse
         */
        describe('wizmo.parse', function () {

            var elem_parse_source_html_str,
                elem_parse_obj,
                elem_parse_target_obj,
                elem_parse_target_html_str,
                elem_parse_content_is_valid_bool,
                elem_parse_content_is_valid_control_bool
                ;

            beforeAll(function (done) {

                elem_parse_source_html_str = '<div class="parse"><h1>Parse Content</h1><p class="first">First Parsed Paragraph</p><p class="second">Second Parsed Paragraph</p></div>';
                elem_parse_obj = wizmo.parse(elem_parse_source_html_str);
                elem_parse_target_obj = $('#e2e-elem-parse-002');
                elem_parse_obj.prependTo(elem_parse_target_obj);

                setTimeout(function () {

                    elem_parse_target_obj = $('#e2e-elem-parse-002').find('.first');
                    elem_parse_target_html_str = elem_parse_target_obj.html();

                    elem_parse_content_is_valid_bool = (/first +parsed +paragraph/i.test(elem_parse_target_html_str));
                    elem_parse_content_is_valid_control_bool = true;

                    //close
                    done();

                }, 2000);

            });

            it('should check that content is parsed from HTML to a DOM object', function () {
                expect(elem_parse_content_is_valid_bool).toBe(elem_parse_content_is_valid_control_bool);
            });

        });

    });

});