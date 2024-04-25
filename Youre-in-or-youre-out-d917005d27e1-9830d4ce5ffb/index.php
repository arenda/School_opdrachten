<?php

session_start();

if (!isset($_SESSION['loggedInUser'])) {
    header("Location: login.php");
    exit();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>

<body>
    <h2>Welcome</h2>
    <p>You are logged in!</p>
    <button onclick="location.href='logout.php'">Logout</button>
</body>

</html>