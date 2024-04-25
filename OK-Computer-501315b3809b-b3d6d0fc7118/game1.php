<?php
session_start();

function startGame()
{
    $_SESSION['choices'] = ['rock', 'paper', 'scissors'];
    $_SESSION['player1_choice'] = null;
    $_SESSION['player2_choice'] = null;
}

function determineWinner($player1Choice, $player2Choice)
{
    if ($player1Choice == $player2Choice) {
        return "It's a tie!";
    } elseif (
        ($player1Choice == 'rock' && $player2Choice == 'scissors') ||
        ($player1Choice == 'paper' && $player2Choice == 'rock') ||
        ($player1Choice == 'scissors' && $player2Choice == 'paper')
    ) {
        return 'Player 1 wins!';
    } else {
        return 'Player 2 wins!';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['player1_choice'])) {
        $_SESSION['player1_choice'] = filter_input(INPUT_POST, 'player1_choice', FILTER_SANITIZE_STRING);
    }

    if (isset($_POST['player2_choice'])) {
        $_SESSION['player2_choice'] = filter_input(INPUT_POST, 'player2_choice', FILTER_SANITIZE_STRING);
    }

    if (isset($_SESSION['player1_choice'], $_SESSION['player2_choice'])) {
        $result = determineWinner($_SESSION['player1_choice'], $_SESSION['player2_choice']);

        $_SESSION['player1_choice'] = null;
        $_SESSION['player2_choice'] = null;
    } else {
        $result = 'Waiting for the other player to make a choice.';
    }
} else {
    if (!isset($_SESSION['choices'])) {
        startGame();
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rock, Paper, Scissors Game</title>
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
        <p>Player 1:</p>
        <button type="submit" name="player1_choice" value="rock">Rock</button>
        <button type="submit" name="player1_choice" value="paper">Paper</button>
        <button type="submit" name="player1_choice" value="scissors">Scissors</button>

        <p>Player 2:</p>
        <button type="submit" name="player2_choice" value="rock">Rock</button>
        <button type="submit" name="player2_choice" value="paper">Paper</button>
        <button type="submit" name="player2_choice" value="scissors">Scissors</button>
    </form>

    <?php if (isset($result)) : ?>
        <p><?php echo $result; ?></p>
    <?php endif; ?>
    <button type="submit"><a href="index.php">Return Home</a></button>
</body>

</html>