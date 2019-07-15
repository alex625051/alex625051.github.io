/*!
 * плагин jQuery интерфейса глоссария
 * автор: @westeraspect
 * лицензия MIT
 * ver. 1.0
 */
/*!
 * requred: jquery.js, jquery-ui.js, jquery-ui.css
 * examples:
 *	1) $('#glossSearch_box').glossSearch('add',{source: [{"key": "2Pane mode","full_description": "2-ух"}] })
 *  2) $('#glossSearch_box').glossSearch('add',{source:'ajax_to_S3'})
 * Syntax:
 *	$(div).glossSearch('add',{options}) // элемент <div/> для прикрепления плагина
 *	options= {
 *		'maxResults': {Number}, 		// количество выдачи вариантов в меню
 *      'minLength': {Number}, 			//	минимальная длина слова для предоставления вариантов
 *		'url':{URL},					// для доступа по GET запросу на ресурс через синхронный Ajax
 *      'screenShotWidth': {String}, 	//	ширина картинки для предпросмотра скриншотов в px, %
 *		'source':{String/Array_of_objects} 			//	'ajax_to_S3' для запроса к серверу с данными, или массив объектов
 *	}
 *	$(div).glossSearch('destroy') 		// деактивировать плагин и удалить массив с данными window.glossSearch_source
 *
 *
 */

(function ($) {
    //ссылка для запроса таблицы с данными
    var ENTERinInput = true;
    var methods = {
        destroy: function () {
            return this.each(function () {
                var $this = $(this)
                    $this.find('.glossSearch_widget_inputing').search_terms('destroy')
                    $(window).unbind('.glossSearch');
                if (window.glossSearch_source) {
                    window.glossSearch_source.length = 0;
                    window.glossSearch_source = null;
                }
                $this.html('')
            })
        },
        add: function (options) {
            // defaults
            var settings = $.extend({
                    'maxResults': 10,
                    'minLength': 2,
                    'screenShotWidth': '100px',
                    'url': 'https://alex625051.github.io/Glossarijj.json' //ссылка для запроса таблицы с данными

                }, options);

            return this.each(function () {
                var $this = $(this)

                function add_plugin() {
                    if (window.glossSearch_source) {
						var req;
                        //css для поля полной информации
                        var glossSearch_full_description_css = '\
                            position:absolute;\
                            margin-top:5px;\
                            margin-left:0px;\
                            width:100%;\
                            z-index:99999;\
                            display:none;\
                            padding:15px;\
                            box-shadow: rgb(170, 170, 170) 0px 17px 20px 20px;\
                            border: solid rgb(237, 229, 71);\
                            background-color: rgb(246, 245, 243);\
                            '
                            //css для <input>
                            var glossSearch_widget_inputing_css = '\
                            width:calc(100% - 35px);\
                            padding: 4px 26px 4px 8px;\
                            font-size: 13px;\
                            border:0;\
                            outline: 0 !important;\
                            '
                            //добавление элементов в родительский <div>
                            var mouseDown = false;
                        $this.addClass('ui-widget')
                        $this.append('<div class="input_bordering" style="background-color:white;border: solid rgb(255, 228, 120);width:100%;">\
                            <input class="glossSearch_widget_inputing" style="' + glossSearch_widget_inputing_css + '">\
                            <span class="input_clear" style="margin:5px;margin-top:2.5;float:right;color:grey;cursor:pointer;">x</span>\
                            </div>')

                        $this.append('<div style="position:relative;width:calc(100% - 30px)">\
                            <div class="glossSearch_full_description" style="' + glossSearch_full_description_css + '">\
                            </div></div>')
                        //////////////events
                        $this.find("img").on('click', function () {
                            alert('!!!!!!!!!!!')
                        })
                        $this.find(".glossSearch_full_description").on('mousedown', function (e) {
                            if (e.target.closest('a')) {
                                mouseDown = true;
                                window.open(e.target.closest('a').href)
                                e.preventDefault()
                                return false;
                            }

                        })
                        $this.find(".glossSearch_widget_inputing").on('blur', function () {
                            if (!mouseDown) {
                                $this.find(".glossSearch_full_description").html('').hide()
								$this.find(".glossSearch_widget_inputing").val(req||"")

                            }
                            mouseDown = false;
                        })
                        $this.find(".glossSearch_widget_inputing").on('keypress', function () {
                            $this.find(".glossSearch_full_description").html('').hide()
                        })
                        $this.find(".glossSearch_widget_inputing").on('focus', function () {
                            $this.find(".glossSearch_widget_inputing").select()
                        })
                        $this.find(".input_clear").on('click', function () {
                            $this.find(".glossSearch_widget_inputing").val('')
                            $this.find(".glossSearch_full_description").html('').hide()
                        })
                        var bbox = $this
                            var glossSearch_full_description = $this.find(".glossSearch_full_description")
                            var glossSearch_widget_inputing = $this.find('.glossSearch_widget_inputing')

                            $.widget("custom.search_terms", $.ui.autocomplete, {
                                _renderItem: function (ul, item) {
                                    var re = new RegExp(this.term, "gi");
                                    var t = item.label.replace(re, highlite_match);
                                    return $("<li></li>")
                                    .data("ui-autocomplete-item", item)
                                    .append($("<div>").html(t))
                                    .appendTo(ul);
                                }
                            });
                        //Добавление плагина к элементу
                        $this.find('.glossSearch_widget_inputing').search_terms({
                            minLength: settings.minLength,
                            maxResults: settings.maxResults,
                            select: function (event, ui) {
                                ENTERinInput = false
                                    var full = '<strong>' + ui.item.key
                                    if (ui.item.reformulation.length) {
                                        full = full + " - " +
                                            ui.item.reformulation.toString().replace(`["']`, '') + ':</strong><br/>'
                                    } else {
                                        full = full + ':</strong><br/>'
                                    }
                                    full = full + ui.item.full_description
                                    glossSearch_full_description.html(full).show();
                                $this.find(".glossSearch_widget_inputing").val(req)
                                $this.find(".glossSearch_widget_inputing").focus().select()
                                /*ui.item будет содержать выбранный элемент*/
                                return false
                            },
                            focus: function (event, ui) {
                                glossSearch_widget_inputing.val(ui.item.short_description)
                                return false;
                            },
                            search: function (event, ui) {

                                if (ENTERinInput) {
                                    glossSearch_full_description.hide();
                                }
                                glossSearch_widget_inputing.search_terms("option", {
                                    minLength: settings.minLength
                                })

                            },

                            source: function (request, response) {
                                var results = $.ui.autocomplete.filter(window.glossSearch_source, request.term);
                                req = request.term
                                    response(results.slice(0, this.options.maxResults));
                            }
                        });
                        glossSearch_widget_inputing.on('keyup ', function (e) {
                            if ((e.which === 13) && ENTERinInput) {
                                e.stopPropagation();
                                event.preventDefault();
                                glossSearch_widget_inputing.search_terms("option", {
                                    minLength: 1
                                });
                                glossSearch_widget_inputing.search_terms("search", glossSearch_widget_inputing.val())

                                return false;
                            }
                            ENTERinInput = true;
                        })

                    } else {
                        console.log("Невозможно добавить плагин - нет массива данных")
                    }

                }; //add_plugin
                // Если плагин ещё не проинициализирован
                if (options.source) {
                    if (!window.glossSearch_source) {
                        //первое создание(и последнее)таблицы в глобальной переменной
                        function create_source_table(sample_table) {
                            sample_table.forEach(raw => {
                                raw.label = raw.key + _unpack_reformulation(raw.reformulation)
                                    if (!raw.short_description) {
                                        raw.short_description = raw.label
                                    }
                                    if (!raw.reformulation) {
                                        raw.reformulation = []
                                    }
                                    raw.value = raw.label //raw.short_description || null
                                    raw.full_description = raw.full_description.replace(/(https?\S*)/g, _replacer_http);
                                raw.full_description = raw.full_description.replace(/_blank">(https?\S*?(\.png)|(\.svg)|(\.jpg)|(\.jpeg))<\/a>/g, _replacer_screenshots);
                                //raw.full_description = raw.full_description.replace(/\(\((http.*?) Скриншот\)\)/g, replacer_screenshots);
                            })
                        }
                        function _unpack_reformulation(reformulation) {
                            if (reformulation && reformulation.length) {
                                return "; " + reformulation.join('; ')
                            } else {
                                return ""
                            }
                        }
                        function _replacer_http(str, p1, offset, s) {
                            return '<a href="' + p1 + '" target="_blank">' + p1 + '</a>'
                        }
                        function _replacer_screenshots(str, p1, offset, s) {
                            return '_blank"><img src="' + p1 + '"  width="' + settings.screenShotWidth + '" align="right" style="float:right;margin:5px;"></a>'
                        }
                        if (options.source === 'ajax_to_S3') {
                            //из запроса ajax
                            function getXmlHttp() {
                                var xmlhttp;
                                try {
                                    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
                                } catch (e) {
                                    try {
                                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                                    } catch (E) {
                                        xmlhttp = false;
                                    }
                                }
                                if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                                    xmlhttp = new XMLHttpRequest();
                                }
                                return xmlhttp;
                            }
                            var req = getXmlHttp()
                                req.open('GET', settings.url, true);
                            req.onreadystatechange = function () {
                                if (req.readyState == 4) {
                                    if (req.status == 200) {
                                        var dataAjax = JSON.parse(req.responseText);
                                        window.glossSearch_source = dataAjax
                                            create_source_table(window.glossSearch_source)
                                            add_plugin()
                                    } else {
                                        console.log("Ответ от сервера с таблицей не получен")
                                    }
                                }
                            };
                            req.send(null);
                        } else { //из source
                            window.glossSearch_source = options.source
                                create_source_table(window.glossSearch_source)
                                // Если плагин ещё не добавлен

                                add_plugin()
                        } // if ajax
                    } //window.glossSearch_source
                } //options
                else {
                    console.log("Нет массива в options для организации поиска")
                }

            }) //each
            function highlite_match(p1, pos) {
                return "<span style='font-weight:bold;color:Blue;'>" + p1 + "</span>"
            }
        },
        show: function () {
            // ...
        },
        hide: function () {
            // ...
        },
        update: function (content) {
            // ...
        }
    };
    //создание плагина jquery
    $.fn.glossSearch = function (method) {
        // "this" уже является объектом jquery
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.glossSearch');
        }
    };
})(jQuery);
