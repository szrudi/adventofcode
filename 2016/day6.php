<?php

class day
{
    private $input;
    private $characters = [];

    function __construct()
    {
        $this->input = file('./day6-input.txt');
//        $this->input = file('./day6-input-demo.txt');

        $msg = '';
        foreach ($this->input as $line) {
            foreach (str_split($line) as $index => $letter) {
                if (isset($this->characters[$index][$letter])) {
                    $this->characters[$index][$letter]++;
                } else {
                    $this->characters[$index][$letter] = 1;
                }
                asort($this->characters[$index]);
            }
        }

        foreach ($this->characters as $characters) {
            print_r($characters);
            $msg .= array_shift(array_keys($characters));
        }
        print_r($msg);

    }
}

$day = new day();
