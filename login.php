<?php
include 'dbconn.php';

$email = mysqli_real_escape_string($conn, $_POST['email']);
$password = $_POST['password'];

$sql = "SELECT password FROM users WHERE email ='$email'";

$result = mysqli_query($conn, $sql);
session_start();

if (mysqli_num_rows($result) > 0) {
    
    $row = mysqli_fetch_assoc($result);
    if (password_verify($password, $row['password'])) {
        
        $_SESSION['logged_in'] = true;
        
        
        echo "logged in successfully";
        // echo json_encode(['success' => true]);

    } else {
        echo json_encode(['success' => false]);
    }
} else {
  echo json_encode(['success' => false]);
}

// close the database connection
mysqli_close($conn);


?>
