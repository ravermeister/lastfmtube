<?php
/*******************************************************************************
 * Created 2017, 2019 by Jonny Rimkus <jonny@rimkus.it>.
 * Hope you like it :)
 *
 * Contributors:
 *     Jonny Rimkus - initial API and implementation
 *******************************************************************************/
namespace LastFmTube\Json;

interface JsonInterface {

    /**
     * @return array|mixed|void
     */
     public function get();

    /**
     * @return array|mixed|void
     */
     public function delete();

    /**
     * @return array|mixed|void
     */
     public function post();

    /**
     * @return array|mixed|void
     */
     public function put();
}