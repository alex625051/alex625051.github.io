var availableTags = [

	"ActionScript",
	"AppleScript",
	"Asp",
	"BASIC",
	"C",
	"C++",
	"Clojure",
	"COBOL",
	"ColdFusion",
	"Erlang",
	"Fortran",
	"Groovy",
	"Haskell",
	"Java",
	"JavaScript",
	"Lisp",
	"Perl",
	"PHP",
	"Python",
	"Ruby",
	"Scala",
	"Scheme"
];
$.widget("custom.search_terms", $.ui.autocomplete, {
 _renderItem : function( ul, item) {
	 
              var re = new RegExp(this.term, "gi") ;
              var t = item.label.replace(re,highlite_match);
              return $( "<li></li>" )
                  .data( "item.autocomplete", item )
                  .append( "<a>" + t + "</a>" )
                  .appendTo( ul );
          }
});	  

create_source_table(sample)
$("#autocomplete_box").append('<input id="autocomplete" title="type &quot;a&quot;">')
$("#autocomplete_box").append('<div id="autocomplete_full_description" style="width:50%"><div>')
$("#autocomplete").on('focus', function(){
	$(this).select()
})

 // $( "#autocomplete" ).autocomplete({
	// source: sample,
	// select: function(event, ui) { 
	// $("#autocomplete_full_description").html(ui.item.full_description).show();
	
	// /*ui.item будет содержать выбранный элемент*/ },
	// search: function(event, ui) { 
			// $("#autocomplete_full_description").hide();

	// },
	   // open: function(event, ui) { 
	   // console.log(ui)
			// var expr = new RegExp('2', 'g');
			// ui.item = ui.item.replace(expr, highlite_match);
		// }



// }); 
$( "#autocomplete" ).search_terms({
	minLength:0,
	maxResults: 10,

	//source: sample,
	select: function(event, ui) { 
	$("#autocomplete_full_description").html(ui.item.full_description).show();
		$("#autocomplete").select()

	
	/*ui.item будет содержать выбранный элемент*/ },
	search: function(event, ui) { 
			$("#autocomplete_full_description").hide();

	},
    source: function(request, response) {
        var results = $.ui.autocomplete.filter(sample, request.term);
        response(results.slice(0, this.options.maxResults));
    }
	   



}); 

/* $( "#autocomplete" ).catcomplete({
  source:sample
}); */
//////////////FUNCTIONS
function create_source_table(sample_table){
	sample_table.forEach (raw=> {
		raw.label = raw.key + unpack_reformulation(raw.reformulation)
		raw.value = raw.short_description
		raw.full_description = raw.full_description.replace(/(http\S*(\.png)|(\.svg)|(\.jpg)|(\.jpeg))/g, replacer_screenshots);
		//raw.full_description = raw.full_description.replace(/\(\((http.*?) Скриншот\)\)/g, replacer_screenshots);

	})
}



function unpack_reformulation(reformulation) {
	if (reformulation && reformulation.length ) {
		return "; " +reformulation.join('; ')
	} else {
		return ""
	}
}


function replacer_screenshots(str, p1, offset, s) {
  return '<a href="'+p1+'" target="_blank"><img src="'+ p1 + '"  width="100px" align="left"><a><br>'
}
function highlite_match(p1, pos, offset) {
  return "<span style='font-weight:bold;color:Blue;'>" + p1 + "</span>"
}

