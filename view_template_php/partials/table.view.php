<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($items as $item): ?>
        <tr>
            <td><?= $item[0] ?></td>
            <td><?= $item[1] ?></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
