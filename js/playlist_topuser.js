var topusers_selected_row = null;

function topusers_load() {
        $.ajax({
        type: "POST",
        url: "./php/topusers.php",
        dataType: 'json',
        data: {
                'action': 'show'
        }
        
    }).done(function(response){ 
	topusers_generate(response);
    });
}


function topusers_generate(topusers){
       topuser        = document.createElement('table');
       topuser.setAttribute('class', 'pure-table pure-table-horizontal');
       topuser.id     = 'sort';
       //topuser.style.width='100%';
       //topuser.style.heiht='100%';
       
       thead        = document.createElement('thead');
       topuser.appendChild(thead);
              
       row          = document.createElement('tr');
       
       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('topuser.header.nr','locale',locale);  
       row.appendChild(rowdata);
       
       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('topuser.header.user','locale',locale);  
       row.appendChild(rowdata);

       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('topuser.header.lastplay','locale',locale);  
       row.appendChild(rowdata);
         
       thead.appendChild(row);
       
       rowdata      = document.createElement('td');
       rowdata.innerHTML = messageResource.get('topuser.header.playcount','locale',locale);  
       row.appendChild(rowdata);

       tbody    = document.createElement('tbody');
       
       for(cnt=0;cnt<topusers.length;cnt++) {
		
	        //show the last visit and playcount without our current visit
		if(lastfm_user==topusers[cnt].lastfm_user) {
			topusers[cnt].last_played = lastfm_user_visit;
			topusers[cnt].playcount--;
		}
	       
           row          = document.createElement('tr');
           row.className = row.className + ' topuser_entry';
           
           rowdata      = document.createElement('td');
           
           rowdata.innerHTML = (cnt+1);
                 
           rowdata.className = rowdata.className + 'topuser_data index';
           row.appendChild(rowdata);
           
           rowdata      = document.createElement('td');
           rowdata.innerHTML = topusers[cnt].lastfm_user;       
           rowdata.className = rowdata.className + 'topuser_data'; 
           row.appendChild(rowdata);
           
           rowdata      = document.createElement('td');
           rowdata.innerHTML = topusers[cnt].last_played;  
           rowdata.className = rowdata.className + 'topuser_data'; 
           row.appendChild(rowdata);
           
           rowdata      = document.createElement('td');
           rowdata.innerHTML = topusers[cnt].playcount;  
           rowdata.className = rowdata.className + 'topuser_data'; 
           row.appendChild(rowdata);
           
           
           $(row).mouseover(function(){
                topusers_setActiveRow($(this));
           });
           
           
           $(row).click(function(){
                
                cells = this.getElementsByTagName('td');
                lm_uname = $(cells[1]).text();                                
                loadLastFMUser(lm_uname);
           });
           
           tbody.appendChild(row);
       }
       topuser.appendChild(tbody);
    
	$("#topuser_list").ready(function(){

        container = $("#topuser_list");
        container.html('');
        container.append(topuser);

    });
}


function topusers_setActiveRow(row){
    topusers_selected_row = row;
}
