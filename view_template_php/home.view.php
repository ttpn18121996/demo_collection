<layout name="layouts.app">
    <section name="content">
        <h2 class="text-black text-2xl" id="title">Hello world</h2>
        <p><?= 'What the fuck are you looking for?' ?></p>
        <div role="button">
            <p class="<?='text-sm sample-class'?>">
                <span class="text-red"><?=$message?></span>
            </p>
        </div>

        <?= $this->include('partials.table', ['items' => [[1, 'Nam'], [2, 'Nguyet']]]) ?>
    </section>
    <section name="title">Title page</section>
</layout>