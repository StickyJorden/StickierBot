$('.categories li').on('click', setCategory);

function setCategory() {
    $('.categories li').removeClass('active');
    
    const selected = $(this);
    selected.addClass('active');

    $('.commands li').hide();

    const categoryCommands = $(`.commands .${selected[0].id}`)
    categoryCommands.show();
   
    updateResultsText(categoryCommands);
}

function blank() {
    $('.categories li').removeClass('active');
    $('.commands li').hide();
}

function updateResultsText(arr){
    $('#commandError').text(arr.length <= 0  ? 'Hey! What happended to all the commands!?' : '' );
} 

$('#search + button').on('click', () => {
    const query = $('#search input').val();
    
    if (!query.trim()) {
      updateResultsText(commands);
      return $('.commands li').show();
    }
  
    const results = new Fuse(commands, {
        isCaseSensitive: false,
        includeScore: true,
        distance: 0,
        threshold: 0,
        keys: [
          { name: 'name', weight: 1 },
          { name: 'directory', weight: 0.5 }
        ]
      })
      .search(query)
      .map(r => r.item);
  
    blank(); 
    
    for (const command of results)
    {
      $(`#${command.name}`).show();
    }

    updateResultsText(results);
  });


setCategory.bind($('.categories li')[0])();