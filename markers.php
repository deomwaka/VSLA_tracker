<?php
include 'dbconn.php';

/* This is the code that is used to save the image to the folder. */
$imageData = $_POST['image'];
$imageData = str_replace("data:image/png;base64,", "", $imageData);
$imageData = str_replace(" ", "+", $imageData);
$imageData = base64_decode($imageData);
$unique_file_name = uniqid().'.png';
$file = 'images/'.$unique_file_name;
file_put_contents($file, $imageData);


$imageName= $unique_file_name;
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$groupId = $_POST['groupId'];
$groupName = $_POST['groupName'];
$cbtName = $_POST['cbtName'];
$cbtPhone = $_POST['cbtPhone'];
$chairpersonName = $_POST['chairpersonName'];
$chairpersonPhone = $_POST['chairpersonPhone'];

$training  = $_POST['training'];
$modules  = $_POST['modules'];

$modules_string = implode(',', $modules);

$sql = "INSERT INTO markers (lat, lng , groupId , groupName, cbtName, cbtPhone, chairpersonName, chairpersonPhone, photo, training, modules) VALUES ('$latitude', '$longitude', '$groupId', '$groupName', '$cbtName', '$cbtPhone' ,'$chairpersonName', '$chairpersonPhone', '$imageName', '$training', '$modules_string')";
if (mysqli_query($conn,$sql)) {
  echo "New marker created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
?>