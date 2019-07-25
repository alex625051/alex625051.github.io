/*!
 * плагин jQuery интерфейса глоссария
 * автор: @westeraspect
 * лицензия MIT
 * ver. 1.2
 */
/*!
 * requred: jquery.js, jquery-ui.js, jquery-ui.css
 * examples:
 *	1) $('#glossSearch_box').glossSearch('add',{source: [{"key": "2Pane mode","full_description": "2-ух"}] })
 *  2) $('#glossSearch_box').glossSearch('add',{source:'ajax_to_S3'})
 * Syntax:
 *	$(div).glossSearch('add',{options}) // элемент <div/> для прикрепления плагина
 *	options= {
 *		'maxResults': {Number}, 		// количество выдачи вариантов в меню (default:10)
 *      'minLength': {Number}, 			//	минимальная длина слова для предоставления вариантов (default:2)
 *		'url':{URL},					// для доступа по GET запросу на ресурс через синхронный Ajax (default:'https://alex625051.github.io/Glossarijj.json' )
 *      'screenShotWidth': {String}, 	//	ширина картинки для предпросмотра скриншотов в px, % (default:'100px')
 *		'source':{String/Array_of_objects}, 			//	'ajax_to_S3' для запроса к серверу с данными, или массив объектов
 *		'button_position':{String}						//'left'/'right'/null
 *			}
 *	$(div).glossSearch('destroy') 		// деактивировать плагин и удалить массив с данными window.glossSearch_source
 *
 *
 */

(function($) {
  //ссылка для запроса таблицы с данными
  var ENTERinInput = true;
  var methods = {
    destroy: function() {
      return this.each(function() {
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
    add: function(options) {
      // defaults
      var settings = $.extend({
        'maxResults': 10,
        'minLength': 2,
        'screenShotWidth': '100px',
        'url': 'https://alex625051.github.io/Glossarijj.json',  //ссылка для запроса таблицы с данными
		'button_position':'left'
		

      }, options);

      return this.each(function() {
        var $this = $(this)

        function add_plugin() {
          if (window.glossSearch_source) {
            var req;
			//css для кнопки
            var glossSearch_main_container_css = {
                            'z-index':'99999',
							'display':'flex',
							 'z-index':'99999'

			}
			//css для кнопки
            var glossSearch_button_css = '\
	cursor: pointer;\
	margin: 0px;\
    width: 21px;\
    text-align: center;\
    z-index: 99999;\
    padding: 4px;\
    font-size: 13px;\
    border: solid rgb(255, 219, 77);\
    background-color: rgb(255, 219, 77);\
                            '
            //css для поля полной информации
            var glossSearch_full_description_css = '\
                            position:absolute;\
                            margin-top:5px;\
                            margin-left:0px;\
                            margin-right:0px;\
                            width:calc(100% - 29px);\
                            z-index:99999;\
                            display:none;\
                            padding:15px;\
                            box-shadow: rgba(0, 0, 0, 0.26) 0px 1px 5px 3px;\
                            border: 1px solid rgb(255, 219, 77);\
                            background-color: white;\
                            '
            //css для <input>
            var glossSearch_widget_inputing_css = '\
	padding: 4px 32px 4px 8px;\
    font-size: 13px;\
    border: 0;\
    outline: 0 !important;\
    width:calc(100% - 40px);\
                            '
            //добавление элементов в родительский <div>
            var mouseDown = false;
			$this.css(glossSearch_main_container_css)
			
			$this.append('<span class="gloss_container" style="width: calc(100% - 30px);position:relative;	visibility:hidden;"></span>')
			var gloss_container = $this.find(".gloss_container")
			var width_full_gloss =$this.outerWidth(true);
			var width_space 	= $(window).outerWidth(true)
			var position_gloss = $this.offset()
			var this_in_left_side = (position_gloss.left/width_space) <= 0.5
			
			if (!options.button_position){
			if (this_in_left_side){
				$this.prepend('<span class="gloss_button" style="'+glossSearch_button_css+'">?</span>')
			}  
				if (!this_in_left_side){
				$this.append('<span class="gloss_button" style="'+glossSearch_button_css+'">?</span>')
			} 
			} else {
			if (options.button_position=="left"){
				$this.prepend('<span class="gloss_button" style="'+glossSearch_button_css+'">?</span>')
				var pad="33"
			}  
				if (options.button_position=="right"){
				$this.append('<span class="gloss_button" style="'+glossSearch_button_css+'border-left: 0;'+'">?</span>')
				var pad="37"
			} 
			}
            gloss_container.append('<div class="input_bordering" style="background-color: white;border: solid rgb(255, 219, 77);position:relative;width: 100%;">\
                            <input placeholder="Поиск по глоссарию" class="glossSearch_widget_inputing" style="' + glossSearch_widget_inputing_css + '">\
                            \
                            </div>')

            gloss_container.append('<div style="position:relative;width:100%;class="glossSearch_full_description_container">\
                            <div class="glossSearch_full_description" style="' + glossSearch_full_description_css + '">\
                            </div></div>')
gloss_container.append('<span class="input_clear" style="top: 0px;padding: 4px;font-size: 13px;color: grey;cursor: pointer;position:absolute;right:5px;">x</span>')
            //////////////events
           
            $this.find(".glossSearch_full_description").on('mousedown', function(e) {
              if (e.target.closest('a')) {
                mouseDown = true;
                window.open(e.target.closest('a').href)
                e.preventDefault()
                return false;
              }

            })
            $this.find(".glossSearch_widget_inputing").on('blur', function() {
              if (!mouseDown) {
                $this.find(".glossSearch_full_description").html('').hide()
                $this.find(".glossSearch_widget_inputing").val(req || "")

              }
              mouseDown = false;
            })
			$this.find(".gloss_button").on('click', function() {
				if ($(this).html()=='X'){
					gloss_container.css('visibility','hidden')
					$(this).html('?')
				} else {
					gloss_container.css('visibility','visible')
					$(this).html('X')
				}
            })
            $this.find(".glossSearch_widget_inputing").on('keypress', function() {
              $this.find(".glossSearch_full_description").html('').hide()
            })
            $this.find(".glossSearch_widget_inputing").on('focus', function() {
              $this.find(".glossSearch_widget_inputing").select()
            })
            $this.find(".input_clear").on('click', function() {
              $this.find(".glossSearch_widget_inputing").val('')
              $this.find(".glossSearch_full_description").html('').hide()
            })
            var bbox = $this
            var glossSearch_full_description = $this.find(".glossSearch_full_description")
            var glossSearch_widget_inputing = $this.find('.glossSearch_widget_inputing')

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
            //Добавление плагина к элементу
            $this.find('.glossSearch_widget_inputing').search_terms({
              minLength: settings.minLength,
              maxResults: settings.maxResults,
              select: function(event, ui) {
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
              focus: function(event, ui) {
                glossSearch_widget_inputing.val(ui.item.short_description)
                return false;
              },
              search: function(event, ui) {

                if (ENTERinInput) {
                  glossSearch_full_description.hide();
                }
                glossSearch_widget_inputing.search_terms("option", {
                  minLength: settings.minLength
                })

              },

              source: function(request, response) {
                var results = $.ui.autocomplete.filter(window.glossSearch_source, request.term);
                req = request.term
                response(results.slice(0, this.options.maxResults));
              }
            });
            glossSearch_widget_inputing.on('keyup ', function(e) {
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
                raw.full_description = raw.full_description.replace(/ (https?\S*)/g, _replacer_http);
                raw.full_description = raw.full_description.replace(/_blank" class="formatted_gloss_urls">(https?\S*?(\.png)|(\.svg)|(\.jpg)|(\.jpeg))<\/a>/g, _replacer_screenshots);
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
              return ' <a href="' + p1 + '" target="_blank" class="formatted_gloss_urls">' + p1 + '</a>'
            }

            function _replacer_screenshots(str, p1, offset, s) {
              return '_blank" class="formatted_gloss_urls"><img src="' + p1 + '"  width="' + settings.screenShotWidth + '" align="right" style="float:right;margin:5px;"></a>'
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
              req.onreadystatechange = function() {
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
  
    hide: function() {
      // ...
    },
    update: function(content) {
      // ...
    }
  };
  //создание плагина jquery
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
