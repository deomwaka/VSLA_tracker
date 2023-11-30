<?php
include 'dbconn.php';

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
  header('Location: index.php');
  exit;
}

$sql="SELECT * FROM markers";
$result= mysqli_query($conn, $sql);

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#000000">
  <meta name="description" content="">
  <meta name="author" content="">
  <title>VSLA data</title>

  <link rel="apple-touch-icon" sizes="76x76" href="assets/img/favicon-76.png">
  <link rel="apple-touch-icon" sizes="120x120" href="assets/img/favicon-120.png">
  <link rel="apple-touch-icon" sizes="152x152" href="assets/img/favicon-152.png">
  <link rel="icon" sizes="196x196" href="assets/img/favicon-196.png">
  <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">



  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="plugins/all.min.css">
  <!-- DataTables -->
  <link rel="stylesheet" href="plugins/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="plugins/responsive.bootstrap4.min.css">
  <link rel="stylesheet" href="plugins/buttons.bootstrap4.min.css">
  <!-- Theme style -->

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
</head>
<body class="hold-transition">
<div class="wrapper">
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">

    <!-- Main content -->
  
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">VSLA DATA</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <table id="example1" class="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th>Group id</th>
                    <th>Group name</th>
                    <th>CBT name</th>
                    <th>CBT phone</th>
                    <th>chairperson name</th>
                    <th>chairperson Phone</th>
                    <th>Activity date</th>
                    <th>Activity</th>
                    <th>Modules</th>
                    <th>Activity photo</th>
                  </tr>
                  </thead>
                  <tbody>
                <?php
                 
                if (mysqli_num_rows($result) > 0) {
                  while($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>
                            <td>" . $row["groupId"]. "</td>
                            <td>" . $row["groupName"]. "</td>
                            <td>" . $row["cbtName"]. "</td>
                            <td>" . $row["cbtPhone"]. "</td>
                            <td>" . $row["chairpersonName"]. "</td>
                            <td>" . $row["chairpersonPhone"]. "</td>
                            <td>" . $row["created_at"]. "</td>
                            <td>" . $row["training"]. "</td>
                            <td>" . $row["modules"]. "</td>
                            <td><a href='#' data-toggle='modal' data-target='#imageModal' onclick='showImage(\"images/" . $row["photo"] . "\")'><img width='50px' height='50px' src=\"images/".$row["photo"]."\") ' </a></td>
                          </tr>";  ?>

                          <!-- The Modal -->
                          <div class="modal fade" id="imageModal">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <!-- Modal Header -->
                                <div class="modal-header">
                                  <h4 class="modal-title">Image</h4>
                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body text-center">
                                  <img id="image" width="600px" height="600px" src="" alt="Image" class="img-fluid">
                                </div>
                              </div>
                            </div>
                          </div>

                <?php
                  }
                } else {
                  echo "0 results";
                }
                ?>

                  </tbody>
                  <tfoot>
                    <th>Group id</th>
                    <th>Group name</th>
                    <th>CBT name</th>
                    <th>CBT phone</th>
                    <th>chairperson name</th>
                    <th>chairperson Phone</th>
                    <th>Activity date</th>
                    <th>Activity</th>
                    <th>modules</th>
                    <th>Activity photo</th>
                  </tfoot>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</div>
<!-- ./wrapper -->

<!-- jQuery -->
<script src="plugins/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="plugins/bootstrap.bundle.min.js"></script>
<!-- DataTables  & Plugins -->
<script src="plugins/jquery.dataTables.min.js"></script>
<script src="plugins/dataTables.bootstrap4.min.js"></script>
<script src="plugins/dataTables.responsive.min.js"></script>
<script src="plugins/responsive.bootstrap4.min.js"></script>
<script src="plugins/dataTables.buttons.min.js"></script>
<script src="plugins/buttons.bootstrap4.min.js"></script>
<script src="plugins/jszip.min.js"></script>
<script src="plugins/pdfmake.min.js"></script>
<script src="plugins/vfs_fonts.js"></script>
<script src="plugins/buttons.html5.min.js"></script>
<script src="plugins/buttons.print.min.js"></script>
<script src="plugins/buttons.colVis.min.js"></script>

<script>
  $(function () {
    $("#example1").DataTable({
      "responsive": true, "lengthChange": false, "autoWidth": false,
      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    $('#example2').DataTable({
      "paging": true,
      "lengthChange": false,
      "searching": false,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true,
    });
  });

  function showImage(src) {
  var modal = document.getElementById("imageModal");
  var image = document.getElementById("image");
  image.src = src;
  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
}

</script>

</body>
</html>
