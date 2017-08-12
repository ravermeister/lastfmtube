<!--//
encoding: UTF-8
//-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--// 
created by Jonny Rimkus <jonny@rimkus.it> www.rimkus.it
//-->
<html
    xmlns="http://www.w3.org/1999/xhtml"   
>
	<head>
		<title>Last.fm YouTube Radio - Admin</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		
		<!--// purecss.io //-->
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/pure-min.css" />
		<!--[if lte IE 8]>
		    <link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/grids-responsive-old-ie-min.css" />
		<![endif]-->
		<!--[if gt IE 8]><!-->
		    <link rel="stylesheet" href="//unpkg.com/purecss@1.0.0/build/grids-responsive-min.css" />
		<!--<![endif]-->
		<!--// purecss.io //-->
		
		<link rel="stylesheet" href="{$BASE_PATH}/themes/dark/css/styles.css" type="text/css" />
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/codemirror.min.css" />
		
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<!--//<script type="text/javascript" src="//cloud.tinymce.com/stable/tinymce.min.js?apiKey=nt568kvsk9su00se2kh0c4bnywlkobst8kdf18oq0hxdb7ab"></script>//-->
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/codemirror.min.js"></script>
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/mode/properties/properties.min.js"></script>
		
		<script type="text/javascript" src="{$BASE_PATH}/js/admin-pagefunctions.js"></script>
	</head>
	
	<body onload="javascript:pageInit();">
		{if  $ADMIN_AUTHORIZED == true}
			{include file='admin.form.tpl'}
		{else}
			{include file='admin.login.tpl'}
		{/if}
	</body>
</html>

