$('.categories li').on('click', setCategory);

function setCategory() {
    $('.categories li').removeClass('active');
    
    const selected = $(this);
    selected.addClass('active');

    $('.commands li').hide();

    const categoryCommands = $(`.commands .${selected[0].id}`)
    categoryCommands.show();
   
    $('#commandError').text(categoryCommands.length <= 0  ? 'Hey! What happended to all the commands!?' : '' );
    
}

setCategory.bind($('.categories li')[0])();

$('#search + button').on('click', () => {
    const query = $('#search input').val();
    const results = new Fuse(commands, {
        isCaseSensitive: false,
        keys: [
                { name: 'name', weight: 1 }, 
                { name: 'directory', weight: 0.5 }
            ]
    }).search(query);
    console.log(results);
});