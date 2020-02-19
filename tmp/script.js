$(function() {
  $('code span').filter(function() { return $(this).text().trim() === 'q' }).addClass('q');
});
