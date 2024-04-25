<?php

if ($argv[1] < 0) {
    throw new Exception("Negatief bedrag meegegeven");
}
if (is_numeric($argv[1]) != 1) {
    throw new Exception("Geen waarde meegegeven");
}
try {
    if (empty($argv[1])) {
        echo "geen wisselgeld";
    }
} catch (Exception) {
    echo "foute waarde";
}


$restbedrag = $argv[1];

const MONEY_UNITS = [50, 20, 10, 5, 2, 1];
foreach (MONEY_UNITS as $stacks) {
    if ($restbedrag >= $stacks) {
        $Aantalxeenheid = floor($restbedrag / $stacks);
        $restbedrag = fmod($restbedrag, $stacks);
        print($Aantalxeenheid . " x " . $stacks . " euro " . PHP_EOL);
    }
}
$over8 = $restbedrag * 100;
$vcent = floor($over8 / 50);
$over4 = fmod($over8, 50);
$tcent = floor($over4 / 20);
$over5 = fmod($over4, 20);
$ticent = floor($over5 / 10);
$over6 = fmod($over5, 10);
$vicent = round($over6 / 5);
if ($vcent > 0) {
    echo $vcent . " x 50 cent" . PHP_EOL;
}
if ($tcent > 0) {
    echo $tcent . " x 20 cent" . PHP_EOL;
}
if ($ticent > 0) {
    echo $ticent . " x 10 cent" . PHP_EOL;
}
if ($vicent > 0) {
    if ($vicent == 2) {
        echo "1 x 10 cent" . PHP_EOL;
    } else {
        echo $vicent . " x 5 cent" . PHP_EOL;
    }
}
