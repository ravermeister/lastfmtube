<?php
#encoding: utf-8
header('Content-Type: text/plain; charset=utf-8'); 
$page           = $_GET['page'];
$totalpages     = $_GET['pages_total'];




$page_html  = '<input type="text" class="text" id="pagefield" value="'.$page.'" length="4" size="4" onkeyup="loadPage(this,event,'.$page.','.$totalpages .',\'pages\',\'playlist\');" maxlength="5"/>';
$return     = '';
if($page>1)
    $return.= '<a href="#" class="page_bt" style="color: #686868;text-decoration:none;" onClick="javascript:getPages('.($page-1).','.$totalpages.',\'pages\',\'playlist\',false);">&lt;&lt;</a>&nbsp;&nbsp;';
else
    $return.= '&lt;&lt;</a>&nbsp;&nbsp;';
    
$return.= '&nbsp;&nbsp;Seite '.$page_html.' von '.$totalpages.'&nbsp;&nbsp;';

if($page<$totalpages)
    $return.= '&nbsp;&nbsp;<a href="#" class="page_bt" style="color: #686868;text-decoration:none;" onClick="javascript:getPages('.($page+1).','.$totalpages.',\'pages\',\'playlist\',false);">&gt;&gt;</a>';
else
    $return.= '&nbsp;&nbsp;&gt;&gt;';

echo $return;
?>