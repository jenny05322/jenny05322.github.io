<?php

    $img = $_REQUEST['image'];

    $uploadPath = 'upload/';
    $fileName = $_REQUEST['fileName'] ? $_REQUEST['fileName'] : uniqid();
    $fileExtension = '.png';

    // 轉檔 & 存檔
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $uploadPath . $fileName . $fileExtension;
    $success = file_put_contents($file, $data);

    echo $fileName;
    exit;
