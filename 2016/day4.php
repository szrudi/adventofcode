<?php

class day
{
    private $input;

    function __construct()
    {
        $this->input = file('./day4-input.txt');
        /* * /
        $this->input = [
            "aaaaa-bbb-z-y-x-123[abxyz]",
            "a-b-c-d-e-f-g-h-987[abcde]",
            "not-a-real-room-404[oarel]",
            "totally-real-room-200[decoy]",
            "qzmt-zixmtkozy-ivhz-343[zimth]",
        ];/**/

        $this->input = array_map(function ($item) {
            preg_match('/([a-z-]+)-(\d+)\[([a-z]+)\]/', rtrim($item), $matches);
            array_shift($matches);
            return $matches;
        }, $this->input);

        $roomCount = array_reduce(
            $this->input,
            array($this, 'calculate'),
            ['roomSectorSum' => 0, 'rooms' => []]
        );
        print_r($roomCount);
    }

    /**
     * @param $acc
     * @param $item
     * @return mixed
     */
    private function calculate($acc, $item)
    {
//        print_r($item);

        list($letterCounts, $item[3]) = $this->countLetters($item);
        $letterCounts = $this->sortArray($letterCounts);
        $letterCounts = array_slice($letterCounts, 0, 5);
        $checksum = join('', array_keys($letterCounts));
//        print_r($letterCounts);
//        print_r($checksum);
        if ($checksum === $item[2]) {
            $acc['roomSectorSum'] += $item[1];
            $acc['rooms'][] = $item;
        }

        return $acc;
    }

    /**
     * @param $item
     * @return mixed
     */
    private function countLetters($item)
    {
        $decrypted = '';
        $letterCounts = [];
        foreach (str_split($item[0]) as $letter) {
            if ($letter !== '-') {
                $letterCounts[$letter] = isset($letterCounts[$letter]) ? $letterCounts[$letter] + 1 : 1;
                $decrypted .= $this->decryptChr($letter, $item[1]);
            } else {
                $decrypted .= '-';
            }
        }
        return [$letterCounts, $decrypted];
    }

    /**
     * @param $letter
     * @param $pass
     * @return string
     */
    private function decryptChr($letter, $pass)
    {
        return chr(
            (ord($letter) + $pass - ord('a'))
            % (ord('z') - ord('a') + 1)
            + ord('a')
        );
    }

    /**
     * @param $letterCounts
     * @return array
     */
    private function sortArray($letterCounts)
    {
        $temp = array();
        $i = 0;
        foreach ($letterCounts as $key => $value) {
            $temp[] = array($i, $key, $value);
            $i++;
        }
        uasort($temp, function ($a, $b) {
            return $a[2] == $b[2] ? ($a[1] > $b[1]) : ($a[2] < $b[2] ? 1 : -1);
        });
        $letterCounts = [];
        foreach ($temp as $val) {
            $letterCounts[$val[1]] = $val[2];
        }
        return $letterCounts;
    }

}

$day = new day();