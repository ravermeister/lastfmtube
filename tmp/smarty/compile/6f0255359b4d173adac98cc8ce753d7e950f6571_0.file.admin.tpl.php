<?php
/* Smarty version 3.1.30, created on 2017-08-11 17:16:21
  from "/home/ravermeister/lastfm.rimkus.it/themes/dark/admin.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.30',
  'unifunc' => 'content_598dca45a585b1_24061639',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '6f0255359b4d173adac98cc8ce753d7e950f6571' => 
    array (
      0 => '/home/ravermeister/lastfm.rimkus.it/themes/dark/admin.tpl',
      1 => 1502464518,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:admin.form.tpl' => 1,
    'file:admin.login.tpl' => 1,
  ),
),false)) {
function content_598dca45a585b1_24061639 (Smarty_Internal_Template $_smarty_tpl) {
?>
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
		
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/themes/dark/css/styles.css" type="text/css" />
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/codemirror.min.css" />
		
		<?php echo '<script'; ?>
 type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"><?php echo '</script'; ?>
>
		<!--//<?php echo '<script'; ?>
 type="text/javascript" src="//cloud.tinymce.com/stable/tinymce.min.js?apiKey=nt568kvsk9su00se2kh0c4bnywlkobst8kdf18oq0hxdb7ab"><?php echo '</script'; ?>
>//-->
		<?php echo '<script'; ?>
 type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/codemirror.min.js"><?php echo '</script'; ?>
>
		<?php echo '<script'; ?>
 type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/codemirror/5.28.0/mode/properties/properties.min.js"><?php echo '</script'; ?>
>
		
		<?php echo '<script'; ?>
 type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH']->value;?>
/js/admin-pagefunctions.js"><?php echo '</script'; ?>
>
	</head>
	
	<body onload="javascript:pageInit();">
		<?php if ($_smarty_tpl->tpl_vars['ADMIN_AUTHORIZED']->value == true) {?>
			<?php $_smarty_tpl->_subTemplateRender("file:admin.form.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

		<?php } else { ?>
			<?php $_smarty_tpl->_subTemplateRender("file:admin.login.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

		<?php }?>
	</body>
</html>

<?php }
}
