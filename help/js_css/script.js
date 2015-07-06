function GetUrlValue(VarSearch) {
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for (var i = 0; i < VariableArray.length; i++) {
        var KeyValuePair = VariableArray[i].split('=');
        if (KeyValuePair[0] == VarSearch) {
            return KeyValuePair[1];
        }
    }
}


$(document).ready(function () {

    var url = "https://www.googleapis.com/fusiontables/v1/query";
	var id = parseInt(GetUrlValue('id')) || 1;
    var langa = GetUrlValue('lang') || 'de';
	
	// redirect draw/measure --> function
	
	if (id==66 || id==67) {id = 90};
	
	
	
	
	if (langa == 'de') {
	var lang = 'de';}
	else if (langa == 'fr') {
	var lang = 'fr';}
	else if (langa == 'it') {
	var lang = 'it';}
	else if (langa == 'en') {
	var lang = 'en';}
	else if (langa == 'rm') {
	var lang = 'de';}
	
	if (id && lang) {
	
	// connexion Google Drive Fusion Table
	
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        cache: false,
        contentType: "application/json",
        data: {
            key: 'AIzaSyDT7wmEx97gAG5OnPwKyz2PnCx3yT4j7C0',
            sql: "select * from 1A-5cc-vqU_pADcQ1HpqbIPkk_A2U5OnL5xpqo6Pj where col0=" + id + " and col5='" + lang + "'"
        },
        success: function (msg) {

			var selectLang = $('<div id="selectLang">');
            var dl = $('<dl>');
            var heading = $('<div id="heading">');
			
            var row = msg.rows[0];

            var title = row[1];
            var content = row[2].replace(/[\n\r]/g, '<br>').replace(/\[/g,'<a href="').replace(/\]/g,'" target="_blank"><b><span style="padding-right:20px; background: url(ico_extern.gif) no-repeat 26px 1px;"> Link </span></b></a>').replace(/<b1>/g,'<b>').replace(/<b2>/g,'</b>');
            var legend = row[3].replace(/[\n\r]/g, '<br>');
            var image = row[4];
			
	// Exception Homepage	
	
			if (id == 1){
			dl.append('<p>' + content + '</p>' + '<br>' + '<img src="' + image + '">' + '<br><br>' + '<legend>' + legend + '</legend></dl>');
			selectLang.append('<a href="//help.geo.admin.ch/?id=01&lang=de" target="_self">DE</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id=01&lang=fr" target="_self">FR</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id=01&lang=it" target="_self">IT</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id=01&lang=en" target="_self">EN</a>');

			$('#helpSection').append(dl);
			$('#headingSection').append(selectLang);
			}
			
	// Exception id 54 with iFrame
	
			else if (id == 54){  

			if (lang == 'fr'){
			dl.append('<h2>' + title + '</h2><p>' + content + '</p>' + '<br>' + '<img src="' + image + '">' + '<br><br>' + '<legend>' + legend + '</legend>' + '<iframe src="special/parameter_fr.html" width="570" height="1100" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe></dl>');
			selectLang.append('<a href="//help.geo.admin.ch/?id='+ id + '&lang=de" target="_self">DE</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=fr" target="_self">FR</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=it" target="_self">IT</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=en" target="_self">EN</a>');

			$('#helpSection').append(dl);
			$('#headingSection').append(selectLang);
			}
			if (lang == 'it'){
			dl.append('<h2>' + title + '</h2><p>' + content + '</p>' + '<br>' + '<img src="' + image + '">' + '<br><br>' + '<legend>' + legend + '</legend>' + '<iframe src="special/parameter_fr.html" width="570" height="1100" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe></dl>');
			selectLang.append('<a href="//help.geo.admin.ch/?id='+ id + '&lang=de" target="_self">DE</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=fr" target="_self">FR</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=it" target="_self">IT</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=en" target="_self">EN</a>');

			$('#helpSection').append(dl);
			$('#headingSection').append(selectLang);
			}
			if (lang == 'de'){
			dl.append('<h2>' + title + '</h2><p>' + content + '</p>' + '<br>' + '<img src="' + image + '">' + '<br><br>' + '<legend>' + legend + '</legend>' + '<iframe src="special/parameter.html" width="570" height="1100" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe></dl>');
			selectLang.append('<a href="//help.geo.admin.ch/?id='+ id + '&lang=de" target="_self">DE</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=fr" target="_self">FR</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=it" target="_self">IT</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=en" target="_self">EN</a>');

			$('#helpSection').append(dl);
			$('#headingSection').append(selectLang);
			}
			if (lang == 'en'){
			dl.append('<h2>' + title + '</h2><p>' + content + '</p>' + '<br>' + '<img src="' + image + '">' + '<br><br>' + '<legend>' + legend + '</legend>' + '<iframe src="special/parameter_en.html" width="570" height="1100" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe></dl>');
			selectLang.append('<a href="//help.geo.admin.ch/?id='+ id + '&lang=de" target="_self">DE</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=fr" target="_self">FR</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=it" target="_self">IT</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=en" target="_self">EN</a>');


			$('#helpSection').append(dl);
			$('#headingSection').append(selectLang);
			}
					
	// Content displayed in normal case			
			
			}
			
			else{  

			dl.append('<h2>' + title + '</h2><p>' + content + '</p>' + '<br>' + '<img src="' + image + '">' + '<br><br>' + '<legend>' + legend + '</legend></dl>');
			selectLang.append('<a href="//help.geo.admin.ch/?id='+ id + '&lang=de" target="_self">DE</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=fr" target="_self">FR</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=it" target="_self">IT</a><a>&nbsp;|&nbsp;<a/><a href="//help.geo.admin.ch/?id='+ id + '&lang=en" target="_self">EN</a>');


			$('#helpSection').append(dl);
			$('#headingSection').append(selectLang);
			}
			
			if (lang == 'de')
			{heading.append('<h1>' + 'Hilfe Kartenviewer' + '</h1>');}
			else if (lang == 'fr')
			{heading.append('<h1>' + 'Aide pour le visualisateur de cartes' + '</h1>');}
			else if (lang == 'it')
			{heading.append('<h1>' + 'Aiuto visualizzatore di carte' + '</h1>');}
			else if (lang == 'en')
			{heading.append('<h1>' + 'Mapviewer Help' + '</h1>');}
			$('#headingSection').append(heading);
        }
				
    });
	} 

	// Menu left display		

	if ((id || 1) && (lang || de)) {
	
	// connexion Google Drive Fusion Table
	
	    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        cache: false,
        contentType: "application/json",
        data: {
            key: 'AIzaSyDT7wmEx97gAG5OnPwKyz2PnCx3yT4j7C0',
            sql: 'select * from 1A-5cc-vqU_pADcQ1HpqbIPkk_A2U5OnL5xpqo6Pj where col5 = \''+lang + '\' order by col8'
        },
        success: function (msg) {

 		var dt = $('<dt>');
		var dx1 = $('<div id="dx1">');
		var dx2 = $('<div id="dx2">');
		var dx3 = $('<div id="dx3"><a href="https://map.geo.admin.ch" target="_self"><span style="font-size:13px">&#8678;</span> map.geo.admin.ch</div>');
		
		

            $.each(msg.rows, function () {

                var row = this;
                var	ids = row[0], 
					titles = row[1].replace(/[\n\r]/g, '<br>'),
					contents = row[2],
					languages = row[5];
					console.log(ids, titles);

				if (lang == languages && contents !== '#' && ids == id && id == 1) {
				    dx1.append('<a>'+titles+'</a>');
			    }	else if (lang == languages && contents !== '#' && ids == id && id !== 1) {
				    dt.append('<span style="color:#ff0000; font-size:0.9em; padding-left:20px; background: url(img/arrow.png) no-repeat 10px 2px;">'+titles+'</span></a><br>');
				}	else if (lang == languages && contents !== '#' && ids == 1) {
				    dx2.append('<a href="//help.geo.admin.ch/?id='+ ids + '&lang='+ languages +'" target="_self">'+titles+'</a><br>');
			    }	else if (lang == languages && contents !== '#') {
				    dt.append('<a href="//help.geo.admin.ch/?id='+ ids + '&lang='+ languages +'" target="_self">'+titles+'</a><br>');
				}	else if (lang == languages && contents == '#'){
				    dt.append('<h3>' + titles + '</h3>');
				}
            });
			$('#headingSection').append(dx1);
			$('#headingSection').append(dx2);
			$('#headingSection').append(dx3);
            $('#menuHelp').append(dt);
				

        }
				
    });
	}
	
});



