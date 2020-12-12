<?php

class day
{
    private $input;

    function __construct()
    {
        $this->input = "uqwqemis";
//        $this->input = 'abc';

        $password = [];
        for ($i = 0; count($password) < 8; $i++) {
            $hash = md5($this->input . $i);
            if (substr($hash, 0, 5) === '00000') {
                echo $hash . PHP_EOL;
                $pos = substr($hash, 5, 1);
                var_dump($pos);
                $char = substr($hash, 6, 1);
                if (is_numeric($pos) && $pos >= 0 && $pos < 9 && !isset($password[$pos])) {
                    $password[$pos] = $char;
                    print_r($password);
                }
            }
        };
        ksort($password);
        print_r(join($password));
    }
}

$day = new day();
