/////////////////////////@westeraspect
(function($) {

    var methods = {
        init: function(options) {
            var settings = $.extend({
                'screenShotWidth': '100px'

            }, options);
           // if () {

                var $this = $(this),
                    data = $this.data('glossSearch'),
                    glossSearch = $('<div />', {
                        text: $this.attr('title')
                    });

                // Если плагин ещё не проинициализирован
                    if (options.sample) {
                        if (!window.sample) {
							
                            /*
                             * Тут выполняем инициализацию
                             */
                            window.sample = options.sample

                            function create_source_table(sample_table) {
                                sample_table.forEach(raw => {
                                    raw.label = raw.key + _unpack_reformulation(raw.reformulation)
                                    raw.value = raw.short_description || ""
                                    raw.full_description = raw.full_description.replace(/(http\S*(\.png)|(\.svg)|(\.jpg)|(\.jpeg))/g, _replacer_screenshots);
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

                            function _replacer_screenshots(str, p1, offset, s) {
                                return '<a href="' + p1 + '" target="_blank"><img src="' + p1 + '"  width="' + settings.screenShotWidth + '" align="left"><a><br>'
                            }


                            create_source_table(window.sample)



                            
                        } //window.sample
                    } //options
                    else {
                        console.log("Нет массива в options для организации поиска")
                    }
                

            //                  }); //each
        }, // init  
        destroy: function() {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('glossSearch');

                $(window).unbind('.glossSearch');
                data.glossSearch.remove();
                $this.removeData('glossSearch');

            })

        },
        add: function(options) {
            var settings = $.extend({
                'maxResults': 10,
                'minLength': 0
            }, options);
            return this.each(function() {
 var $this = $(this),
                    data = $this.data('glossSearch'),
                    glossSearch = $('<div />', {
                        text: $this.attr('title')
                    });

                // Если плагин ещё не добавлен
                if (!data) {
                if (window.sample) {
					var autocomplete_full_description_css='\
						position:absolute;\
						margin-top:10px;\
						margin-left:0px;\
						width:100%;\
						z-index:99999;\
						display:none;\
						padding:10px;\
						box-shadow: inset 0 0 3px 3px rgb(255, 228, 120);\
					'
					var autocomplete_widget_inputing_css='\
						width:100%;\
						border: solid rgb(255, 228, 120);\
						font-size: 13px;\
						padding: 4px 26px 4px 8px;\
						'				
					
                    $this.addClass('ui-widget')
                    $this.append('<input class="autocomplete_widget_inputing" style="'+autocomplete_widget_inputing_css+'">')
                    $this.append ('<div style="position:relative;width:calc(100% - 14px);"><div class="autocomplete_full_description" style="'+autocomplete_full_description_css+'"><div></div>')
                    $this.find(".autocomplete_widget_inputing").on('focus', function() {
                        $this.find(".autocomplete_widget_inputing").select()
                    })
                    $this.find(".autocomplete_widget_inputing").focus()

                    var bbox = $this
                    var autocomplete_full_description = $this.find(".autocomplete_full_description")
                    $.widget("custom.search_terms", $.ui.autocomplete, {
                        _renderItem: function(ul, item) {

                            var re = new RegExp(this.term, "gi");
                            var t = item.label.replace(re, highlite_match);
                            return $("<li></li>")
                                .data("ui-autocomplete-item", item)
                                .append($("<div>").html(t))
                                .appendTo(ul);
                        }
                    });

                    $this.find('.autocomplete_widget_inputing').search_terms({
                        minLength: settings.minLength,
                        maxResults: settings.maxResults,

                        //source: sample,
                        select: function(event, ui) {
                            autocomplete_full_description.html(ui.item.full_description).show();
                            $this.find(".autocomplete_widget_inputing").focus()



                            /*ui.item будет содержать выбранный элемент*/
                        },
                        search: function(event, ui) {
                            autocomplete_full_description.hide();

                        },
                        source: function(request, response) {
                            var results = $.ui.autocomplete.filter(sample, request.term);
                            response(results.slice(0, this.options.maxResults));
                        }

                    });
					$(this).data('glossSearch', {
                                target: $this,
                                glossSearch: glossSearch
                            });
                } else {
                    console.log("Невозможно добавить плагин - нет массива данных")
                }
			  } //if data
            }) //each
            function highlite_match(p1, pos) {
                return "<span style='font-weight:bold;color:Blue;'>" + p1 + "</span>"
            }
        },
        show: function() {
            // ... 
        },
        hide: function() {
            // ... 
        },
        update: function(content) {
            // ...
        }
    };

    $.fn.glossSearch = function(method) {
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