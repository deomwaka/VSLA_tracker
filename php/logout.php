<?php
session_start();

if (isset($_GET['logout'])) {
  session_destroy();
  echo json_encode(['success' => true]);
  exit();
}

?>