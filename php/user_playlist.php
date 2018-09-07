<?php
if (! isset ( $_GET ['action'] ))
    return;
require_once dirname(__FILE__) . '/../vendor/autoload.php';

switch ($_GET ['action']) {
    case 'list' :
        {
            /**
             *
             * @todo implement loading of saved playlist for a registered user.
             */
            if (! isset ( $_SESSION ['music'] ['playlist'] )) {
                if (isset ( $_COOKIE ['music_userlist'] )) {
                    $data = $_COOKIE ['music_userlist'];
                    $data = json_decode ( $data, true );
                    $_SESSION ['music'] ['playlist'] = $data;
                } else
                    $_SESSION ['music'] ['playlist'] = array ();
            }

            $data = json_encode ( $_SESSION ['music'] ['playlist'] );

            echo $data;
            break;
        }

    case 'add' :
        {
            if (! isset ( $_SESSION ['music'] ['playlist'] )) {
                if (isset ( $_COOKIE ['music_userlist'] )) {
                    $data = $_COOKIE ['music_userlist'];
                    $data = json_decode ( $data, true );
                    $_SESSION ['music'] ['playlist'] = $data;
                } else
                    $_SESSION ['music'] ['playlist'] = array ();
            }

            $newtitle = $_POST ['trackdata'];
            $_SESSION ['music'] ['playlist'] [] = $newtitle;

            $data = json_encode ( $_SESSION ['music'] ['playlist'] );
            echo $data;
            break;
        }

    case 'remove' :
        {
            if (! isset ( $_SESSION ['music'] ['playlist'] )) {
                if (isset ( $_COOKIE ['music_userlist'] )) {
                    $data = $_COOKIE ['music_userlist'];
                    $data = json_decode ( $data, true );
                    $_SESSION ['music'] ['playlist'] = $data;
                } else
                    $_SESSION ['music'] ['playlist'] = array ();
            }

            $remove_track = $_POST ['trackdata'];
            $new_playlist = array ();
            for($cnt = 0; $cnt < sizeof ( $_SESSION ['music'] ['playlist'] ); $cnt ++) {
                // Functions::logMessage('saved: '.$savetrack['title'].'<> del: '.$remove_track['title']);
                // Functions::logMessage('saved: '.$savetrack['artist'].'<> del: '.$remove_track['artist']);
                $savetrack = $_SESSION ['music'] ['playlist'] [$cnt];
                /**
                 * if
                 * (
                 * strcmp($savetrack['title'],$remove_track['title'])==0&&
                 * strcmp($savetrack['artist'],$remove_track['artist'])==0
                 * )
                 * continue;
                 */
                // Functions::logMessage('saved: '.(($cnt+1)).'<> del: '.$remove_track['nr']);
                if ((($cnt + 1) == $remove_track ['nr']))
                    continue;
                $new_playlist [] = $savetrack;
            }

            $_SESSION ['music'] ['playlist'] = $new_playlist;
            $data = json_encode ( $_SESSION ['music'] ['playlist'] );
            echo $data;
            break;
        }

    case 'clear' :
        {
            $_SESSION ['music'] ['playlist'] = array ();
            $data = json_encode ( $_SESSION ['music'] ['playlist'] );
            echo $data;
            break;
        }

    case 'update' :
        {
            $_SESSION ['music'] ['playlist'] = $_POST ['playlist'];
            break;
        }
}
