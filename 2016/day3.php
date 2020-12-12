<?php

class day
{
    private $triangles;

    function __construct()
    {
        $this->triangles = file('./day3-input.txt');
        /**
         * $this->triangles = [
         * "    5   10   25",
         * "    5   10   10",
         * "   25    5   10",
         * ];
         * /**
         * $this->triangles = [
         * "  101  301  501",
         * "  102  302  502",
         * "  103  303  503",
         * "  201  401  601",
         * "  202  402  602",
         * "  203  403  603",
         * ];/**/
        $this->triangles = array_map(function ($item) {
            return str_split(rtrim($item), 5);
        }, $this->triangles);

        /**
         * day1
         */
        $triangleCount = array_reduce(
            $this->triangles,
            array($this, 'calculate'),
            0
        );
        echo $triangleCount;

        /**
         * day2
         */
        $triangleCount = 0;
        for ($i = 0; $i < count($this->triangles) / 3; $i++) {
            $chunk = array_slice($this->triangles, $i * 3, 3);
            $chunk = $this->flipDiagonally($chunk);
//            print_r($chunk);
            $triangleCount = array_reduce(
                $chunk,
                array($this, 'calculate'),
                $triangleCount
            );
        }
        echo $triangleCount . PHP_EOL;
    }

    function flipDiagonally($arr)
    {
        $out = array();
        foreach ($arr as $key => $subarr) {
            foreach ($subarr as $subkey => $subvalue) {
                $out[$subkey][$key] = $subvalue;
            }
        }
        return $out;
    }

    private function calculate($acc, $item)
    {
        sort($item);
        print_r($item);

        return $acc + (($item[0] + $item[1] > $item[2]) ? 1 : 0);
    }
}

$day = new day();