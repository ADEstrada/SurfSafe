<?php
session_start();
include '../includes/db.php';

if ($_SESSION['role'] !== 'Admin') { header("Location: index.php"); exit(); }

$query = "SELECT Users.*, Trainers_Profiles.accreditation_number 
          FROM Users 
          JOIN Trainers_Profiles ON Users.user_id = Trainers_Profiles.user_id 
          WHERE Users.is_approved = 0";
$result = mysqli_query($conn, $query);
?>

<h2>Pending Trainer Applications</h2>
<table border="1">
    <tr>
        <th>Name</th>
        <th>Document</th>
        <th>Action</th>
    </tr>
    <?php while($row = mysqli_fetch_assoc($result)): ?>
    <tr>
        <td><?php echo $row['first_name'] . " " . $row['last_name']; ?></td>
        <td><a href="uploads/<?php echo $row['accreditation_number']; ?>" target="_blank">View PDF</a></td>
        <td>
            <a href="approve_action.php?id=<?php echo $row['user_id']; ?>">Approve</a>
        </td>
    </tr>
    <?php endwhile; ?>
</table>