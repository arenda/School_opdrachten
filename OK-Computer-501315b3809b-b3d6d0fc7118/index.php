<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['start_computer_game'])) {
        header('Location: game.php');
        exit();
    }

    if (isset($_POST['start_player_game'])) {
        header('Location: game1.php');
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rock, Paper, Scissors - Start Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }

        button {
            padding: 10px;
            font-size: 16px;
            margin: 5px;
        }
    </style>
</head>

<body>

    <h1>Rock, Paper, Scissors Game</h1>

    <form method="post" action="">
        <button type="submit" name="start_computer_game">Play Against Computer</button>
        <button type="submit" name="start_player_game">Play Against Player</button>
    </form>

</body>

</html>