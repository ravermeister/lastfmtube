<?php
namespace LastFmTube\Util;

use Icamys\SitemapGenerator\SitemapGenerator;
use DateTime;

class SiteMap {

     /**
      *
      * @var double
      */
     private static $DEF_PRIO = 0.5;

     /**
      *
      * @var string
      */
     private static $DEF_FREQ = 'always';

     /**
      *
      * @var SitemapGenerator
      */
     private $generator;

     /**
      *
      * @var string
      */
     private $domain;

     /**
      * a singleton instance for the application
      *
      * @var SiteMap
      */
     private static $instance;

     /**
      *
      * @return string the current url
      */
     private static function trackUrl() {
          $link = 'https://lastfm.rimkus.it';

          if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') $link = "https";
          else $link = "http";

          $link .= "://";
          $link .= $_SERVER['HTTP_HOST'];
          $link .= $_SERVER['REQUEST_URI'];
          return $link;
     }

     public function __construct($domain, $file = 'sitemap.xml', $indexfile = 'sitemap-index.xml', $compress = true) {
          $this->domain = $domain;
          $this->generator = new SitemapGenerator($this->domain);

          // will create also compressed (gzipped) sitemap
          $this->generator->createGZipFile = $compress;

          // determine how many urls should be put into one file
          // according to standard protocol 50000 is maximum value (see http://www.sitemaps.org/protocol.html)
          $this->generator->maxURLsPerSitemap = 10000;

          // sitemap file name
          $this->generator->sitemapFileName = $file;

          // sitemap index file name
          $this->generator->sitemapIndexFileName = $indexfile;
     }

     /**
      * // alternate languages
      * $alternates = [
      * ['hreflang' => 'de', 'href' => "http://www.example.com/de"],
      * ['hreflang' => 'fr', 'href' => "http://www.example.com/fr"],
      * ];
      *
      * adding url `loc`, `lastmodified`, `changefreq`, `priority`, `alternates`
      *
      * @param string $url
      * @param DateTime $lastmod
      * @param string $changeFreq
      * @param double $prio
      * @param array $altLangs
      *
      * @return SiteMap for better chaining
      */
     public function addURL($url, $lastmod = null, $changeFreq = 'always', $prio = 0.5, $altLangs = null) {
          if (is_null($lastmod)) {
               $lastmod = new DateTime();
          }
          $this->generator->addUrl($url, $lastmod, $changeFreq, $prio, $altLangs);
          return $this;
     }

     /**
      *
      * @param boolean $submit
      * @return SiteMap for better chaining
      */
     public function create($submit = false) {
          $this->generator->createSitemap();
          $this->generator->writeSitemap();
          if ($submit) $this->submitSiteMap();
          return $this;
     }

     /**
      *
      * @return SiteMap for better chaining
      */
     private function submitSiteMap() {
          $this->generator->submitSitemap();
          $this->generator->updateRobots();
          return $this;
     }
}