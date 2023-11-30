<?php
  include 'dbconn.php';

  // Retrieve data from the database
  /*This query uses a subquery to get the most recent created_at for eac
  h groupId, and then joins the markers table to the subquery on the groupId and created_at 
  columns. It returns all columns from the markers table 
  for the rows that match the most recent created_at for each groupId in the current week. 
  Please note that you can use this query if created_at column is unique for each groupId.
  You can also use the order by created_at desc and limit 1 for each groupId.*/

//   $sql = "SELECT * FROM markers WHERE WEEK(created_at, 3) = WEEK(CURDATE(), 3) AND YEAR(created_at) = YEAR(CURDATE()) group by groupId order by created_at desc limit 1";


/* This query uses a subquery to get the most recent created_at for each groupId, and then joins the
markers table to the subquery on the groupId and created_at columns. It returns all columns from the
markers table for the rows that match the most recent created_at for each groupId in the current
week. Please note that you can use this query if created_at column is unique for each groupId. You
can also use the order by created_at desc and limit 1 for each groupId. */

$sql = "SELECT markers.* FROM markers JOIN (SELECT groupId, max(created_at) as max_created_at FROM markers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND created_at < NOW() GROUP BY groupId) as grouped_markers ON markers.groupId = grouped_markers.groupId AND markers.created_at = grouped_markers.max_created_at ORDER BY markers.created_at DESC";
$result = mysqli_query($conn, $sql);

  $geojson = array(
    'type'      => 'FeatureCollection',
    'features'  => array()
 );
 while($row = mysqli_fetch_assoc($result)) {
    $feature = array(
      'type' => 'Feature',
      'geometry' => array(
         'type' => 'Point',
         'coordinates' => array(
            $row['lng'],
            $row['lat']
         )
      ),
      'properties' => array(
         'groupId' => $row['groupId'],
         'groupName' => $row['groupName'],
         'cbtName' => $row['cbtName'],
         'cbtPhone' => $row['cbtPhone'],
         'chairpersonName' => $row['chairpersonName'],
         'chairpersonPhone' => $row['chairpersonPhone'],
         'createdAt' => $row['created_at']
      )
   );
    array_push($geojson['features'], $feature);
 }
 
  
  
  header('Content-type: application/json');
  echo json_encode($geojson);


  
  // Close the connection
  mysqli_close($conn);

  
?>
