<?php
/**根据id查询商品**/
header('Content-Type:application/json');

$id = $_REQUEST['did'];
if(empty($id)){
    echo '[]';
    return;
}

$conn = mysqli_connect('127.0.0.1','root','','flowers',3306);
$sql = 'SET NAMES UTF8';
mysqli_query($conn,  $sql);
$sql = "SELECT did,name,price,img_lg,material,detail FROM  kf_dish WHERE did=$id";

$result = mysqli_query($conn, $sql);

$row = mysqli_fetch_assoc($result);  //此处无需循环
if(empty($row))
   echo '[]';
else
{
    $output[] = $row;
    echo json_encode($output);
}
?>